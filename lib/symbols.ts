/**
 * MT5 Symbol Data for Deriv Synthetic Indices
 * Based on PRD Appendix A.1
 * Updated with complete list of Deriv MT5 synthetic indices (January 2026)
 * Source: Deriv MT5 platform specifications
 */

import { SymbolData, SymbolName } from '@/types';

export const SYMBOLS: Record<SymbolName, SymbolData> = {
  // VOLATILITY INDICES (1s) - Continuous synthetic indices with fixed volatility
  'Volatility 10 (1s) Index': {
    name: 'Volatility 10 (1s) Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 6000,
    contractSize: 1,
    description: 'Simulates a market with 10% volatility, 1-second tick intervals'
  },
  'Volatility 25 (1s) Index': {
    name: 'Volatility 25 (1s) Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 8500,
    contractSize: 1,
    description: 'Simulates a market with 25% volatility, 1-second tick intervals'
  },
  'Volatility 50 (1s) Index': {
    name: 'Volatility 50 (1s) Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 12000,
    contractSize: 1,
    description: 'Simulates a market with 50% volatility, 1-second tick intervals'
  },
  'Volatility 75 (1s) Index': {
    name: 'Volatility 75 (1s) Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 17500,
    contractSize: 1,
    description: 'Simulates a market with 75% volatility, 1-second tick intervals'
  },
  'Volatility 100 (1s) Index': {
    name: 'Volatility 100 (1s) Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 25000,
    contractSize: 1,
    description: 'Simulates a market with 100% volatility, 1-second tick intervals'
  },
  'Volatility 150 (1s) Index': {
    name: 'Volatility 150 (1s) Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 38000,
    contractSize: 1,
    description: 'Simulates a market with 150% volatility, 1-second tick intervals'
  },
  'Volatility 250 (1s) Index': {
    name: 'Volatility 250 (1s) Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 63000,
    contractSize: 1,
    description: 'Simulates a market with 250% volatility, 1-second tick intervals'
  },

  // CRASH INDICES - Indices with periodic downward spikes
  'Crash 300 Index': {
    name: 'Crash 300 Index',
    pointValue: 0.1,
    minLot: 1.0,
    maxLot: 100,
    lotStep: 1.0,
    leverage: 1000,
    typicalPrice: 800,
    contractSize: 1,
    description: 'Index with average 1 crash every 300 ticks'
  },
  'Crash 500 Index': {
    name: 'Crash 500 Index',
    pointValue: 0.1,
    minLot: 1.0,
    maxLot: 100,
    lotStep: 1.0,
    leverage: 1000,
    typicalPrice: 1200,
    contractSize: 1,
    description: 'Index with average 1 crash every 500 ticks'
  },
  'Crash 1000 Index': {
    name: 'Crash 1000 Index',
    pointValue: 0.1,
    minLot: 1.0,
    maxLot: 100,
    lotStep: 1.0,
    leverage: 1000,
    typicalPrice: 1500,
    contractSize: 1,
    description: 'Index with average 1 crash every 1000 ticks'
  },

  // BOOM INDICES - Indices with periodic upward spikes
  'Boom 300 Index': {
    name: 'Boom 300 Index',
    pointValue: 0.1,
    minLot: 1.0,
    maxLot: 100,
    lotStep: 1.0,
    leverage: 1000,
    typicalPrice: 3500000,
    contractSize: 1,
    description: 'Index with average 1 boom (spike up) every 300 ticks'
  },
  'Boom 500 Index': {
    name: 'Boom 500 Index',
    pointValue: 0.1,
    minLot: 1.0,
    maxLot: 100,
    lotStep: 1.0,
    leverage: 1000,
    typicalPrice: 5200000,
    contractSize: 1,
    description: 'Index with average 1 boom (spike up) every 500 ticks'
  },
  'Boom 1000 Index': {
    name: 'Boom 1000 Index',
    pointValue: 0.1,
    minLot: 1.0,
    maxLot: 100,
    lotStep: 1.0,
    leverage: 1000,
    typicalPrice: 7800000,
    contractSize: 1,
    description: 'Index with average 1 boom (spike up) every 1000 ticks'
  },

  // JUMP INDICES - Fixed jump patterns at regular intervals
  'Jump 10 Index': {
    name: 'Jump 10 Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 30000,
    contractSize: 1,
    description: 'Index with equal probability of up/down jumps, average 1 jump every 10 ticks'
  },
  'Jump 25 Index': {
    name: 'Jump 25 Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 45000,
    contractSize: 1,
    description: 'Index with equal probability of up/down jumps, average 1 jump every 25 ticks'
  },
  'Jump 50 Index': {
    name: 'Jump 50 Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 68000,
    contractSize: 1,
    description: 'Index with equal probability of up/down jumps, average 1 jump every 50 ticks'
  },
  'Jump 75 Index': {
    name: 'Jump 75 Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 95000,
    contractSize: 1,
    description: 'Index with equal probability of up/down jumps, average 1 jump every 75 ticks'
  },
  'Jump 100 Index': {
    name: 'Jump 100 Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 130000,
    contractSize: 1,
    description: 'Index with equal probability of up/down jumps, average 1 jump every 100 ticks'
  },

  // STEP INDICES - Equal up/down step patterns
  'Step Index': {
    name: 'Step Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 500,
    typicalPrice: 20000,
    contractSize: 1,
    description: 'Index with equal-sized up or down steps at regular intervals'
  },

  // RANGE BREAK INDICES - Breakout patterns after consolidation
  'Range Break 100 Index': {
    name: 'Range Break 100 Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 10000,
    contractSize: 1,
    description: 'Index that breaks out of a range with average break every 100 ticks'
  },
  'Range Break 200 Index': {
    name: 'Range Break 200 Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 14000,
    contractSize: 1,
    description: 'Index that breaks out of a range with average break every 200 ticks'
  },

  // DEX INDICES - Directional indices with bias
  'DEX 150 UP Index': {
    name: 'DEX 150 UP Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 5000,
    contractSize: 1,
    description: 'Small drops and major spikes every 10 minutes on average (upward bias)'
  },
  'DEX 150 DOWN Index': {
    name: 'DEX 150 DOWN Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 5000,
    contractSize: 1,
    description: 'Small rises and major drops every 10 minutes on average (downward bias)'
  },
  'DEX 300 UP Index': {
    name: 'DEX 300 UP Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 7500,
    contractSize: 1,
    description: 'Small drops and major spikes every 10 minutes on average (upward bias)'
  },
  'DEX 300 DOWN Index': {
    name: 'DEX 300 DOWN Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 7500,
    contractSize: 1,
    description: 'Small rises and major drops every 10 minutes on average (downward bias)'
  },
  'DEX 600 UP Index': {
    name: 'DEX 600 UP Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 12000,
    contractSize: 1,
    description: 'Small drops and major spikes every 10 minutes on average (upward bias)'
  },
  'DEX 600 DOWN Index': {
    name: 'DEX 600 DOWN Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 12000,
    contractSize: 1,
    description: 'Small rises and major drops every 10 minutes on average (downward bias)'
  },
  'DEX 900 UP Index': {
    name: 'DEX 900 UP Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 17000,
    contractSize: 1,
    description: 'Small drops and major spikes every 10 minutes on average (upward bias)'
  },
  'DEX 900 DOWN Index': {
    name: 'DEX 900 DOWN Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 17000,
    contractSize: 1,
    description: 'Small rises and major drops every 10 minutes on average (downward bias)'
  },
  'DEX 1200 UP Index': {
    name: 'DEX 1200 UP Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 23000,
    contractSize: 1,
    description: 'Small drops and major spikes every 10 minutes on average (upward bias)'
  },
  'DEX 1200 DOWN Index': {
    name: 'DEX 1200 DOWN Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 23000,
    contractSize: 1,
    description: 'Small rises and major drops every 10 minutes on average (downward bias)'
  },

  // DRIFT SWITCHING INDICES - Indices that switch between bullish, bearish, or sideways trends
  'Drift Switch Index 10': {
    name: 'Drift Switch Index 10',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 8000,
    contractSize: 1,
    description: 'Switches between trends at average duration of 10 minutes'
  },
  'Drift Switch Index 20': {
    name: 'Drift Switch Index 20',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 12000,
    contractSize: 1,
    description: 'Switches between trends at average duration of 20 minutes'
  },
  'Drift Switch Index 30': {
    name: 'Drift Switch Index 30',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 16000,
    contractSize: 1,
    description: 'Switches between trends at average duration of 30 minutes'
  },

  // DAILY RESET INDICES - Simulate bull/bear trends that reset daily
  'Bull Market Index': {
    name: 'Bull Market Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 15000,
    contractSize: 1,
    description: 'Simulates rising market trends, resets daily to baseline'
  },
  'Bear Market Index': {
    name: 'Bear Market Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 15000,
    contractSize: 1,
    description: 'Simulates falling market trends, resets daily to baseline'
  },

  // HYBRID CRASH/BOOM - Crash/Boom with 20% volatility boost
  'Crash 600 Index': {
    name: 'Crash 600 Index',
    pointValue: 0.1,
    minLot: 1.0,
    maxLot: 100,
    lotStep: 1.0,
    leverage: 1000,
    typicalPrice: 1000,
    contractSize: 1,
    description: 'Index with average 1 crash every 600 ticks'
  },
  'Crash 900 Index': {
    name: 'Crash 900 Index',
    pointValue: 0.1,
    minLot: 1.0,
    maxLot: 100,
    lotStep: 1.0,
    leverage: 1000,
    typicalPrice: 1300,
    contractSize: 1,
    description: 'Index with average 1 crash every 900 ticks'
  },
  'Boom 600 Index': {
    name: 'Boom 600 Index',
    pointValue: 0.1,
    minLot: 1.0,
    maxLot: 100,
    lotStep: 1.0,
    leverage: 1000,
    typicalPrice: 6500000,
    contractSize: 1,
    description: 'Index with average 1 boom (spike up) every 600 ticks'
  },
  'Boom 900 Index': {
    name: 'Boom 900 Index',
    pointValue: 0.1,
    minLot: 1.0,
    maxLot: 100,
    lotStep: 1.0,
    leverage: 1000,
    typicalPrice: 9200000,
    contractSize: 1,
    description: 'Index with average 1 boom (spike up) every 900 ticks'
  },

  // MULTI STEP INDICES - Multiple step sizes with varying probabilities
  'Multi Step Index 200': {
    name: 'Multi Step Index 200',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 500,
    typicalPrice: 18000,
    contractSize: 1,
    description: 'Steps of 0.1 with occasional 0.2 movements'
  },
  'Multi Step Index 250': {
    name: 'Multi Step Index 250',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 500,
    typicalPrice: 22000,
    contractSize: 1,
    description: 'Steps of 0.1 with occasional 0.25 movements'
  },
  'Multi Step Index 300': {
    name: 'Multi Step Index 300',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 500,
    typicalPrice: 26000,
    contractSize: 1,
    description: 'Steps of 0.1 with occasional 0.3 movements'
  },
  'Multi Step Index 500': {
    name: 'Multi Step Index 500',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 500,
    typicalPrice: 35000,
    contractSize: 1,
    description: 'Steps of 0.1 with occasional 0.5 movements'
  },

  // SKEW STEP INDICES - Asymmetric step sizes and probabilities
  'Skew Step Index 80/20': {
    name: 'Skew Step Index 80/20',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 500,
    typicalPrice: 14000,
    contractSize: 1,
    description: '80% probability for small shifts, 20% for sharp movements'
  },
  'Skew Step Index 90/10': {
    name: 'Skew Step Index 90/10',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 500,
    typicalPrice: 16000,
    contractSize: 1,
    description: '90% probability for small shifts, 10% for sharp movements'
  },

  // TREK INDICES - Directional bias with 30% volatility
  'Trek UP Index': {
    name: 'Trek UP Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 20000,
    contractSize: 1,
    description: '30% volatility market with upward directional bias'
  },
  'Trek DOWN Index': {
    name: 'Trek DOWN Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 20000,
    contractSize: 1,
    description: '30% volatility market with downward directional bias'
  },

  // VOLATILITY SWITCH INDICES - Switching volatility levels
  'Volatility Switch 10/50 Index': {
    name: 'Volatility Switch 10/50 Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 9000,
    contractSize: 1,
    description: 'Switches between 10% and 50% volatility every 5-60 minutes'
  },
  'Volatility Switch 10/100 Index': {
    name: 'Volatility Switch 10/100 Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 13000,
    contractSize: 1,
    description: 'Switches between 10% and 100% volatility every 5-60 minutes'
  },
  'Volatility Switch 50/100 Index': {
    name: 'Volatility Switch 50/100 Index',
    pointValue: 0.1,
    minLot: 0.1,
    maxLot: 100,
    lotStep: 0.1,
    leverage: 1000,
    typicalPrice: 18000,
    contractSize: 1,
    description: 'Switches between 50% and 100% volatility every 5-60 minutes'
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
