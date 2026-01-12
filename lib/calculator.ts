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
import { getDerivSpec, validateLotSize as validateLotSizeSpec, calculateMarginFromSpec } from './deriv-specs';

// Constants from PRD Section 8 - Stacking Rules
const MARGIN_USAGE_CAP = 0.35; // 35% margin usage cap for single position
const SAFE_BUFFER_THRESHOLD = 0.5; // 50% buffer minimum
const MODERATE_STACKING_THRESHOLD = 0.6; // 60% cumulative margin
const HIGH_STACKING_THRESHOLD = 0.7; // 70% cumulative margin
const CRITICAL_STACKING_THRESHOLD = 0.85; // 85% cumulative margin

/**
 * Calculate maximum safe lot size
 * Formula from PRD Section 7.2 (FR-2.1):
 * Max Lot Size = (MT5 Balance × 0.35) / (SL Points × Point Value)
 * Enforces actual Deriv min/max lot constraints
 */
export function calculateMaxLotSize(
  mt5Balance: number,
  slPoints: number,
  symbol: SymbolName
): number {
  const symbolData = getSymbol(symbol);
  const derivSpec = getDerivSpec(symbol);
  
  if (slPoints <= 0 || mt5Balance <= 0 || isNaN(slPoints) || isNaN(mt5Balance)) {
    return 0;
  }

  // Use actual point value from Deriv specs if available
  const pointValue = derivSpec ? derivSpec.pointValue : symbolData.pointValue;

  // Calculate raw lot size
  const rawLotSize = 
    (mt5Balance * MARGIN_USAGE_CAP) / (slPoints * pointValue);

  if (!isFinite(rawLotSize) || rawLotSize <= 0) {
    return 0;
  }

  // Use actual Deriv constraints if available, otherwise use symbol data
  const minLot = derivSpec ? derivSpec.minLot : symbolData.minLot;
  const maxLot = derivSpec ? derivSpec.maxLot : symbolData.maxLot;
  const lotStep = symbolData.lotStep; // Keep using symbol data for lot step

  // Apply MT5 constraints (FR-2.2)
  let lotSize = Math.floor(rawLotSize / lotStep) * lotStep;
  lotSize = Math.max(minLot, lotSize);
  lotSize = Math.min(maxLot, lotSize);

  // Round to 2 decimals (MT5 format)
  return Math.round(lotSize * 100) / 100;
}

/**
 * Calculate margin required for a position
 * Uses actual Deriv margin specifications when available
 * Falls back to legacy formula for symbols not in Deriv specs
 */
export function calculateMargin(
  lotSize: number,
  symbol: SymbolName,
  entryPrice?: number // Optional: use for real-time price, otherwise use typical price
): number {
  if (lotSize <= 0 || isNaN(lotSize)) {
    return 0;
  }

  // Try to use actual Deriv specifications first
  const derivSpec = getDerivSpec(symbol);
  const symbolData = getSymbol(symbol);
  
  // Use provided entry price or fall back to typical price for the symbol
  const price = entryPrice && entryPrice > 0 ? entryPrice : symbolData.typicalPrice;
  
  if (derivSpec) {
    // Use real Deriv margin calculation:
    // Margin = Lot Size × Contract Size × Price × (Margin % / 100)
    const margin = lotSize * derivSpec.contractSize * price * (derivSpec.marginPercent / 100);
    
    if (!isFinite(margin)) {
      return 0;
    }
    
    return Math.round(margin * 100) / 100;
  }
  
  // Fallback to legacy calculation for symbols not in Deriv specs
  // Margin = (Lot Size × Contract Size × Price) / Leverage
  const margin = (lotSize * symbolData.contractSize * price) / symbolData.leverage;
  
  if (!isFinite(margin)) {
    return 0;
  }
  
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
  const derivSpec = getDerivSpec(symbol);
  
  // Use actual point value from Deriv specs if available
  const pointValue = derivSpec ? derivSpec.pointValue : symbolData.pointValue;
  const riskAmount = lotSize * slPoints * pointValue;
  
  return Math.round(riskAmount * 100) / 100;
}

/**
 * Validate lot size against Deriv specifications
 * Returns validation result with error message if invalid
 */
export function validateLotSize(
  symbol: SymbolName,
  lotSize: number
): { valid: boolean; error?: string; adjustedLotSize?: number } {
  const derivSpec = getDerivSpec(symbol);
  
  if (!derivSpec) {
    // If no Deriv spec, use symbol data for validation
    const symbolData = getSymbol(symbol);
    
    if (lotSize < symbolData.minLot) {
      return {
        valid: false,
        error: `Lot size ${lotSize} is below minimum ${symbolData.minLot}`,
        adjustedLotSize: symbolData.minLot
      };
    }
    
    if (lotSize > symbolData.maxLot) {
      return {
        valid: false,
        error: `Lot size ${lotSize} exceeds maximum ${symbolData.maxLot}`,
        adjustedLotSize: symbolData.maxLot
      };
    }
    
    return { valid: true };
  }
  
  // Use Deriv spec validation
  return validateLotSizeSpec(symbol, lotSize);
}

/**
 * Calculate drawdown buffer
 * Formula from PRD Section 7.2 (FR-2.4)
 */
export function calculateDrawdownBuffer(
  mt5Balance: number,
  marginRequired: number
): { buffer: number; bufferPercentage: number } {
  const buffer = mt5Balance - marginRequired;
  const bufferPercentage = (buffer / mt5Balance) * 100;
  
  return {
    buffer: Math.round(buffer * 100) / 100,
    bufferPercentage: Math.round(bufferPercentage * 100) / 100
  };
}

/**
 * Calculate how many minimum lot positions to stack
 * Target: 30-40% margin usage (leaving 60-70% buffer)
 */
export function calculateStackingPositions(
  mt5Balance: number,
  symbol: SymbolName,
  targetMarginPercentage: number = 35, // Default 35% as per user strategy
  entryPrice?: number
): {
  minLotSize: number;
  marginPerPosition: number;
  positionsToStack: number;
  totalMargin: number;
  totalLotSize: number;
} {
  const symbolData = getSymbol(symbol);
  const minLotSize = symbolData.minLot;
  
  // Calculate margin for ONE minimum lot position
  const marginPerPosition = calculateMargin(minLotSize, symbol, entryPrice);
  
  // Calculate target margin in dollars
  const targetMarginDollars = mt5Balance * (targetMarginPercentage / 100);
  
  // Calculate how many positions can be stacked
  const positionsToStack = Math.floor(targetMarginDollars / marginPerPosition);
  
  // Calculate actual totals
  const totalMargin = positionsToStack * marginPerPosition;
  const totalLotSize = positionsToStack * minLotSize;
  
  return {
    minLotSize,
    marginPerPosition: Math.round(marginPerPosition * 100) / 100,
    positionsToStack,
    totalMargin: Math.round(totalMargin * 100) / 100,
    totalLotSize: Math.round(totalLotSize * 100) / 100
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
    settings.mt5Balance,
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
  const riskPercentage = (riskAmount / settings.mt5Balance) * 100;

  // Calculate drawdown buffer
  const { buffer, bufferPercentage } = calculateDrawdownBuffer(
    settings.mt5Balance,
    marginRequired
  );

  // Determine warning level
  const { level: warning, message: warningMessage } = getWarningLevel(
    bufferPercentage
  );

  // Calculate stacking information
  const stackingInfo = calculateStackingPositions(
    settings.mt5Balance,
    symbol,
    settings.targetMarginPercent,
    entryPrice
  );

  return {
    recommendedLotSize,
    marginRequired,
    riskAmount,
    riskPercentage: Math.round(riskPercentage * 100) / 100,
    drawdownBuffer: buffer,
    drawdownBufferPercentage: bufferPercentage,
    warning,
    warningMessage,
    stackingInfo: {
      minLotSize: stackingInfo.minLotSize,
      marginPerPosition: stackingInfo.marginPerPosition,
      positionsToStack: stackingInfo.positionsToStack,
      targetMarginPercentage: 35,
      totalStackedLots: stackingInfo.totalLotSize
    }
  };
}

/**
 * Analyze stacking risk with multiple positions
 * Based on PRD Section 8 - Stacking Rules
 */
export function analyzeStacking(
  mt5Balance: number,
  openPositions: OpenPosition[],
  newPosition?: { margin: number }
): StackingAnalysis {
  // Calculate total margin from open positions
  const totalMarginUsed = openPositions.reduce(
    (sum, pos) => sum + pos.marginUsed,
    0
  ) + (newPosition?.margin || 0);

  const totalMarginPercentage = (totalMarginUsed / mt5Balance) * 100;
  const remainingBuffer = mt5Balance - totalMarginUsed;
  const remainingBufferPercentage = (remainingBuffer / mt5Balance) * 100;

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
  const availableMargin = mt5Balance * HIGH_STACKING_THRESHOLD - 
    openPositions.reduce((sum, pos) => sum + pos.marginUsed, 0);
  
  const recommendedMaxLotSize = availableMargin > 0 
    ? Math.max(0, availableMargin / mt5Balance) 
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

  if (!settings.mt5Balance || settings.mt5Balance <= 0) {
    errors.push('MT5 balance must be greater than 0');
  }

  if (settings.mt5Balance && settings.mt5Balance > 1000000) {
    errors.push('MT5 balance exceeds maximum allowed (1,000,000)');
  }

  if (settings.targetMarginPercent && (settings.targetMarginPercent < 1 || settings.targetMarginPercent > 100)) {
    errors.push('Target margin must be between 1% and 100%');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateCalculationInputs(
  slPoints: number,
  mt5Balance: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (slPoints <= 0 || slPoints > 1000) {
    errors.push('Stop loss must be between 1 and 1000 points');
  }

  if (mt5Balance <= 0) {
    errors.push('Allocated capital must be greater than 0');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
