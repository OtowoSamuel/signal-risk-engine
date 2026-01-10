/**
 * Risk Calculation Engine
 * Based on PRD Section 7.2 - Risk Calculation Engine
 * Implements margin preservation model and MT5-compliant lot sizing
 */

import {
  SymbolName,
  AccountSettings,
  CalculationResult,
  WarningLevel,
  OpenPosition,
  StackingAnalysis
} from '@/types';
import { getSymbol } from './symbols';

// Constants from PRD Section 8 - Stacking Rules
const MARGIN_USAGE_CAP = 0.35; // 35% margin usage cap for single position
const SAFE_BUFFER_THRESHOLD = 0.5; // 50% buffer minimum
const MODERATE_STACKING_THRESHOLD = 0.6; // 60% cumulative margin
const HIGH_STACKING_THRESHOLD = 0.7; // 70% cumulative margin
const CRITICAL_STACKING_THRESHOLD = 0.85; // 85% cumulative margin

/**
 * Calculate maximum safe lot size
 * Formula from PRD Section 7.2 (FR-2.1):
 * Max Lot Size = (Allocated Capital × 0.35) / (SL Points × Point Value)
 */
export function calculateMaxLotSize(
  allocatedCapital: number,
  slPoints: number,
  symbol: SymbolName
): number {
  const symbolData = getSymbol(symbol);
  
  if (slPoints <= 0 || allocatedCapital <= 0) {
    return 0;
  }

  // Calculate raw lot size
  const rawLotSize = 
    (allocatedCapital * MARGIN_USAGE_CAP) / (slPoints * symbolData.pointValue);

  // Apply MT5 constraints (FR-2.2)
  let lotSize = Math.floor(rawLotSize / symbolData.lotStep) * symbolData.lotStep;
  lotSize = Math.max(symbolData.minLot, lotSize);
  lotSize = Math.min(symbolData.maxLot, lotSize);

  // Round to 2 decimals (MT5 format)
  return Math.round(lotSize * 100) / 100;
}

/**
 * Calculate margin required for a position
 * Formula from PRD Appendix A.2
 */
export function calculateMargin(
  lotSize: number,
  symbol: SymbolName,
  entryPrice: number = 1000 // Default approximate price for synthetics
): number {
  const symbolData = getSymbol(symbol);
  const contractSize = 100000; // Standard forex contract size
  
  // Margin = (Lot Size × Contract Size × Entry Price) / Leverage
  const margin = (lotSize * contractSize * entryPrice) / symbolData.leverage;
  
  return Math.round(margin * 100) / 100;
}

/**
 * Calculate risk amount based on stop loss and lot size
 */
export function calculateRiskAmount(
  lotSize: number,
  slPoints: number,
  symbol: SymbolName
): number {
  const symbolData = getSymbol(symbol);
  const riskAmount = lotSize * slPoints * symbolData.pointValue;
  
  return Math.round(riskAmount * 100) / 100;
}

/**
 * Calculate drawdown buffer
 * Formula from PRD Section 7.2 (FR-2.4)
 */
export function calculateDrawdownBuffer(
  allocatedCapital: number,
  marginRequired: number
): { buffer: number; bufferPercentage: number } {
  const buffer = allocatedCapital - marginRequired;
  const bufferPercentage = (buffer / allocatedCapital) * 100;
  
  return {
    buffer: Math.round(buffer * 100) / 100,
    bufferPercentage: Math.round(bufferPercentage * 100) / 100
  };
}

/**
 * Determine warning level based on buffer percentage
 */
function getWarningLevel(bufferPercentage: number): {
  level: WarningLevel;
  message?: string;
} {
  if (bufferPercentage < 20) {
    return {
      level: 'critical',
      message: '⚠️ CRITICAL: Very low buffer - high risk of margin call'
    };
  }
  
  if (bufferPercentage < 50) {
    return {
      level: 'high',
      message: '⚠️ HIGH RISK: Low buffer - consider reducing position size'
    };
  }
  
  if (bufferPercentage < 65) {
    return {
      level: 'moderate',
      message: '⚠️ Moderate risk - monitor position closely'
    };
  }
  
  return { level: 'none' };
}

/**
 * Main calculation function - implements full risk calculator
 * Based on PRD Section 6 (Core Use Cases) and Section 7.2
 */
export function calculatePosition(
  settings: AccountSettings,
  slPoints: number,
  symbol: SymbolName,
  entryPrice?: number
): CalculationResult {
  // Calculate maximum safe lot size
  const recommendedLotSize = calculateMaxLotSize(
    settings.allocatedCapital,
    slPoints,
    symbol
  );

  // Calculate margin required
  const marginRequired = calculateMargin(
    recommendedLotSize,
    symbol,
    entryPrice
  );

  // Calculate risk amount
  const riskAmount = calculateRiskAmount(
    recommendedLotSize,
    slPoints,
    symbol
  );

  // Calculate risk as percentage of total balance
  const riskPercentage = (riskAmount / settings.totalBalance) * 100;

  // Calculate drawdown buffer
  const { buffer, bufferPercentage } = calculateDrawdownBuffer(
    settings.allocatedCapital,
    marginRequired
  );

  // Determine warning level
  const { level: warning, message: warningMessage } = getWarningLevel(
    bufferPercentage
  );

  return {
    recommendedLotSize,
    marginRequired,
    riskAmount,
    riskPercentage: Math.round(riskPercentage * 100) / 100,
    drawdownBuffer: buffer,
    drawdownBufferPercentage: bufferPercentage,
    warning,
    warningMessage
  };
}

/**
 * Analyze stacking risk with multiple positions
 * Based on PRD Section 8 - Stacking Rules
 */
export function analyzeStacking(
  allocatedCapital: number,
  openPositions: OpenPosition[],
  newPosition?: { margin: number }
): StackingAnalysis {
  // Calculate total margin from open positions
  const totalMarginUsed = openPositions.reduce(
    (sum, pos) => sum + pos.marginUsed,
    0
  ) + (newPosition?.margin || 0);

  const totalMarginPercentage = (totalMarginUsed / allocatedCapital) * 100;
  const remainingBuffer = allocatedCapital - totalMarginUsed;
  const remainingBufferPercentage = (remainingBuffer / allocatedCapital) * 100;

  // Determine warning level based on PRD Section 8.4-8.5
  let warningLevel: WarningLevel = 'none';
  let canAddPosition = true;

  if (totalMarginPercentage >= CRITICAL_STACKING_THRESHOLD * 100) {
    warningLevel = 'critical';
    canAddPosition = false;
  } else if (totalMarginPercentage >= HIGH_STACKING_THRESHOLD * 100) {
    warningLevel = 'high';
  } else if (totalMarginPercentage >= MODERATE_STACKING_THRESHOLD * 100) {
    warningLevel = 'moderate';
  }

  // Calculate recommended max lot size for stacking
  const availableMargin = allocatedCapital * HIGH_STACKING_THRESHOLD - 
    openPositions.reduce((sum, pos) => sum + pos.marginUsed, 0);
  
  const recommendedMaxLotSize = availableMargin > 0 
    ? Math.max(0, availableMargin / allocatedCapital) 
    : 0;

  return {
    totalMarginUsed: Math.round(totalMarginUsed * 100) / 100,
    totalMarginPercentage: Math.round(totalMarginPercentage * 100) / 100,
    remainingBuffer: Math.round(remainingBuffer * 100) / 100,
    remainingBufferPercentage: Math.round(remainingBufferPercentage * 100) / 100,
    warningLevel,
    canAddPosition,
    recommendedMaxLotSize: recommendedMaxLotSize > 0 
      ? Math.round(recommendedMaxLotSize * 100) / 100 
      : undefined
  };
}

/**
 * Validate inputs
 * Based on PRD Section 7.1 (FR-1.4)
 */
export function validateAccountSettings(
  settings: Partial<AccountSettings>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!settings.totalBalance || settings.totalBalance <= 0) {
    errors.push('Total balance must be greater than 0');
  }

  if (!settings.allocatedCapital || settings.allocatedCapital <= 0) {
    errors.push('Allocated capital must be greater than 0');
  }

  if (
    settings.totalBalance &&
    settings.allocatedCapital &&
    settings.allocatedCapital > settings.totalBalance
  ) {
    errors.push('Allocated capital cannot exceed total balance');
  }

  if (settings.riskStyle === 'percentage') {
    if (
      !settings.riskPercentage ||
      settings.riskPercentage <= 0 ||
      settings.riskPercentage > 5
    ) {
      errors.push('Risk percentage must be between 0.1% and 5%');
    }
  }

  if (settings.riskStyle === 'fixed') {
    if (
      !settings.riskAmount ||
      settings.riskAmount <= 0 ||
      (settings.allocatedCapital && settings.riskAmount >= settings.allocatedCapital)
    ) {
      errors.push('Fixed risk amount must be greater than 0 and less than allocated capital');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateCalculationInputs(
  slPoints: number,
  allocatedCapital: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (slPoints <= 0 || slPoints > 1000) {
    errors.push('Stop loss must be between 1 and 1000 points');
  }

  if (allocatedCapital <= 0) {
    errors.push('Allocated capital must be greater than 0');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
