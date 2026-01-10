/**
 * Type Definitions for Signal Risk Engine
 * Based on PRD requirements
 */

export type SymbolName =
  | 'Volatility 10'
  | 'Volatility 25'
  | 'Volatility 50'
  | 'Volatility 75'
  | 'Volatility 100'
  | 'Step Index'
  | 'Step Dex';

export interface SymbolData {
  name: SymbolName;
  pointValue: number;
  minLot: number;
  maxLot: number;
  lotStep: number;
  leverage: number;
  description: string;
}

export type RiskStyle = 'percentage' | 'fixed';

export interface AccountSettings {
  totalBalance: number;
  allocatedCapital: number;
  riskStyle: RiskStyle;
  riskPercentage?: number; // For percentage-based risk (0.5-5%)
  riskAmount?: number; // For fixed dollar risk
}

export interface OpenPosition {
  id: string;
  symbol: SymbolName;
  lotSize: number;
  marginUsed: number;
  entryPrice?: number;
  stopLoss: number;
}

export interface CalculationResult {
  recommendedLotSize: number;
  marginRequired: number;
  riskAmount: number;
  riskPercentage: number;
  drawdownBuffer: number;
  drawdownBufferPercentage: number;
  warning: WarningLevel;
  warningMessage?: string;
}

export type WarningLevel = 'none' | 'moderate' | 'high' | 'critical';

export interface StackingAnalysis {
  totalMarginUsed: number;
  totalMarginPercentage: number;
  remainingBuffer: number;
  remainingBufferPercentage: number;
  warningLevel: WarningLevel;
  canAddPosition: boolean;
  recommendedMaxLotSize?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}
