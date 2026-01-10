/**
 * MT5 Symbol Data for Deriv Synthetic Indices
 * Based on PRD Appendix A.1
 */

import { SymbolData, SymbolName } from '@/types';

export const SYMBOLS: Record<SymbolName, SymbolData> = {
  'Volatility 10': {
    name: 'Volatility 10',
    pointValue: 0.1,
    minLot: 0.01,
    maxLot: 100,
    lotStep: 0.01,
    leverage: 1000,
    description: 'Low volatility synthetic index with 10% volatility'
  },
  'Volatility 25': {
    name: 'Volatility 25',
    pointValue: 0.1,
    minLot: 0.01,
    maxLot: 100,
    lotStep: 0.01,
    leverage: 1000,
    description: 'Medium volatility synthetic index with 25% volatility'
  },
  'Volatility 50': {
    name: 'Volatility 50',
    pointValue: 0.1,
    minLot: 0.01,
    maxLot: 100,
    lotStep: 0.01,
    leverage: 1000,
    description: 'Medium-high volatility synthetic index with 50% volatility'
  },
  'Volatility 75': {
    name: 'Volatility 75',
    pointValue: 0.1,
    minLot: 0.01,
    maxLot: 100,
    lotStep: 0.01,
    leverage: 1000,
    description: 'High volatility synthetic index with 75% volatility'
  },
  'Volatility 100': {
    name: 'Volatility 100',
    pointValue: 0.1,
    minLot: 0.01,
    maxLot: 100,
    lotStep: 0.01,
    leverage: 1000,
    description: 'Very high volatility synthetic index with 100% volatility'
  },
  'Step Index': {
    name: 'Step Index',
    pointValue: 0.1,
    minLot: 0.01,
    maxLot: 100,
    lotStep: 0.01,
    leverage: 500,
    description: 'Step-based synthetic index'
  },
  'Step Dex': {
    name: 'Step Dex',
    pointValue: 0.1,
    minLot: 0.01,
    maxLot: 100,
    lotStep: 0.01,
    leverage: 500,
    description: 'Dex-based step synthetic index'
  }
};

export const getSymbol = (name: SymbolName): SymbolData => {
  return SYMBOLS[name];
};

export const getAllSymbols = (): SymbolData[] => {
  return Object.values(SYMBOLS);
};

export const getSymbolNames = (): SymbolName[] => {
  return Object.keys(SYMBOLS) as SymbolName[];
};
