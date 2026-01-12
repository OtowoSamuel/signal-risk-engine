/**
 * Type Definitions for Signal Risk Engine
 * Based on PRD requirements
 */

export type SymbolName =
  // Volatility Indices (1s) - Fast tick
  | 'Volatility 10 (1s) Index'
  | 'Volatility 25 (1s) Index'
  | 'Volatility 50 (1s) Index'
  | 'Volatility 75 (1s) Index'
  | 'Volatility 100 (1s) Index'
  | 'Volatility 150 (1s) Index'
  | 'Volatility 250 (1s) Index'
  // Volatility Indices (2s) - Normal tick
  | 'Volatility 10 Index'
  | 'Volatility 25 Index'
  | 'Volatility 50 Index'
  | 'Volatility 75 Index'
  | 'Volatility 100 Index'
  // Crash Indices
  | 'Crash 300 Index'
  | 'Crash 500 Index'
  | 'Crash 600 Index'
  | 'Crash 900 Index'
  | 'Crash 1000 Index'
  // Boom Indices
  | 'Boom 300 Index'
  | 'Boom 500 Index'
  | 'Boom 600 Index'
  | 'Boom 900 Index'
  | 'Boom 1000 Index'
  // Jump Indices
  | 'Jump 10 Index'
  | 'Jump 25 Index'
  | 'Jump 50 Index'
  | 'Jump 75 Index'
  | 'Jump 100 Index'
  // Step Indices
  | 'Step Index'
  // Range Break Indices
  | 'Range Break 100 Index'
  | 'Range Break 200 Index'
  // DEX Indices (Directional)
  | 'DEX 150 UP Index'
  | 'DEX 150 DOWN Index'
  | 'DEX 300 UP Index'
  | 'DEX 300 DOWN Index'
  | 'DEX 600 UP Index'
  | 'DEX 600 DOWN Index'
  | 'DEX 900 UP Index'
  | 'DEX 900 DOWN Index'
  | 'DEX 1200 UP Index'
  | 'DEX 1200 DOWN Index'
  // Drift Switching Indices
  | 'Drift Switch Index 10'
  | 'Drift Switch Index 20'
  | 'Drift Switch Index 30'
  // Daily Reset Indices
  | 'Bull Market Index'
  | 'Bear Market Index'
  // Multi Step Indices
  | 'Multi Step Index 200'
  | 'Multi Step Index 250'
  | 'Multi Step Index 300'
  | 'Multi Step Index 500'
  // Skew Step Indices
  | 'Skew Step Index 80/20'
  | 'Skew Step Index 90/10'
  // Trek Indices
  | 'Trek UP Index'
  | 'Trek DOWN Index'
  // Volatility Switch Indices
  | 'Volatility Switch 10/50 Index'
  | 'Volatility Switch 10/100 Index'
  | 'Volatility Switch 50/100 Index';

export interface SymbolData {
  name: SymbolName;
  pointValue: number;
  minLot: number;
  maxLot: number;
  lotStep: number;
  leverage: number;
  description: string;
  typicalPrice: number; // Typical market price for margin calculation
  contractSize: number; // Contract size (1 for synthetic indices)
}

export interface AccountSettings {
  mt5Balance: number; // Current MT5 account balance
  targetMarginPercent: number; // Target margin usage (default 35%)
}

export interface OpenPosition {
  id: string;
  symbol: SymbolName;
  lotSize: number;
  marginUsed: number;
  entryPrice?: number;
  stopLoss: number;
  currentPrice?: number;
  profit?: number;
  contractId?: number;
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
  stackingInfo: {
    minLotSize: number;
    marginPerPosition: number;
    positionsToStack: number;
    targetMarginPercentage: number;
    totalStackedLots: number;
  };
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
