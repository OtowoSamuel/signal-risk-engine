/**
 * Deriv MT5 Index Specifications Database
 * Source: Deriv official specifications (January 2026)
 * Contains actual leverage, margin requirements, lot sizes, and spreads
 */

export interface DerivIndexSpec {
  name: string;
  contractSize: number;           // Underlying units per lot
  baseCurrency: string;           // Base currency (usually USD)
  minLot: number;                 // Minimum lot size
  maxLot: number;                 // Volume limit
  minSpread: number;              // Minimum spread in points
  targetSpreadPercent: number;    // Target spread as %
  maxLeverage: number;            // Max effective leverage (e.g., 5000 = 1:5000)
  marginPercent: number;          // Margin required as % (e.g., 0.02 = 0.02%)
  swapLong: number;               // Swap long in points
  swapShort: number;              // Swap short in points
  tradingHours: string;           // Trading hours in GMT
  pointValue: number;             // Value of 1 point (for P&L calculation)
}

/**
 * Complete Deriv MT5 Index Specifications
 * Organized by category for easy navigation
 */
export const DERIV_SPECS: Record<string, DerivIndexSpec> = {
  // ========== VOLATILITY INDICES (1s) ==========
  'Volatility 10 (1s) Index': {
    name: 'Volatility 10 (1s) Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.5,
    maxLot: 810,
    minSpread: 0.28,
    targetSpreadPercent: 0.00,
    maxLeverage: 5000,
    marginPercent: 0.02,
    swapLong: -1.00,
    swapShort: -1.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Volatility 15 (1s) Index': {
    name: 'Volatility 15 (1s) Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.2,
    maxLot: 300,
    minSpread: 0.549,
    targetSpreadPercent: 0.00,
    maxLeverage: 3000,
    marginPercent: 0.03,
    swapLong: -1.50,
    swapShort: -1.50,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Volatility 25 (1s) Index': {
    name: 'Volatility 25 (1s) Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.005,
    maxLot: 5,
    minSpread: 50.76,
    targetSpreadPercent: 0.01,
    maxLeverage: 4000,
    marginPercent: 0.03,
    swapLong: -2.50,
    swapShort: -2.50,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Volatility 30 (1s) Index': {
    name: 'Volatility 30 (1s) Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.2,
    maxLot: 360,
    minSpread: 0.776,
    targetSpreadPercent: 0.01,
    maxLeverage: 2000,
    marginPercent: 0.05,
    swapLong: -3.00,
    swapShort: -3.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Volatility 50 (1s) Index': {
    name: 'Volatility 50 (1s) Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.005,
    maxLot: 8,
    minSpread: 35.96,
    targetSpreadPercent: 0.01,
    maxLeverage: 2941,
    marginPercent: 0.03,
    swapLong: -5.00,
    swapShort: -5.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Volatility 75 (1s) Index': {
    name: 'Volatility 75 (1s) Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.05,
    maxLot: 230,
    minSpread: 0.95,
    targetSpreadPercent: 0.02,
    maxLeverage: 2000,
    marginPercent: 0.05,
    swapLong: -7.50,
    swapShort: -7.50,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Volatility 90 (1s) Index': {
    name: 'Volatility 90 (1s) Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 50,
    minSpread: 4.484,
    targetSpreadPercent: 0.03,
    maxLeverage: 1000,
    marginPercent: 0.10,
    swapLong: -9.00,
    swapShort: -9.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Volatility 100 (1s) Index': {
    name: 'Volatility 100 (1s) Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 1,
    maxLot: 1000,
    minSpread: 0.3,
    targetSpreadPercent: 0.03,
    maxLeverage: 1502,
    marginPercent: 0.07,
    swapLong: -10.00,
    swapShort: -10.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Volatility 150 (1s) Index': {
    name: 'Volatility 150 (1s) Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 1,
    maxLot: 50,
    minSpread: 0.07,
    targetSpreadPercent: 0.06,
    maxLeverage: 500,
    marginPercent: 0.20,
    swapLong: -15.00,
    swapShort: -15.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Volatility 250 (1s) Index': {
    name: 'Volatility 250 (1s) Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 1,
    maxLot: 50,
    minSpread: 0.06,
    targetSpreadPercent: 2.16,
    maxLeverage: 250,
    marginPercent: 0.40,
    swapLong: -25.00,
    swapShort: -25.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },

  // ========== VOLATILITY INDICES (Standard) ==========
  'Volatility 10 Index': {
    name: 'Volatility 10 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.5,
    maxLot: 1100,
    minSpread: 0.166,
    targetSpreadPercent: 0.00,
    maxLeverage: 5000,
    marginPercent: 0.02,
    swapLong: -1.00,
    swapShort: -1.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Volatility 25 Index': {
    name: 'Volatility 25 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.5,
    maxLot: 1200,
    minSpread: 0.176,
    targetSpreadPercent: 0.01,
    maxLeverage: 4000,
    marginPercent: 0.03,
    swapLong: -2.50,
    swapShort: -2.50,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Volatility 50 Index': {
    name: 'Volatility 50 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 4,
    maxLot: 11000,
    minSpread: 0.019,
    targetSpreadPercent: 0.01,
    maxLeverage: 2500,
    marginPercent: 0.04,
    swapLong: -5.00,
    swapShort: -5.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Volatility 75 Index': {
    name: 'Volatility 75 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.001,
    maxLot: 35,
    minSpread: 11.89,
    targetSpreadPercent: 0.03,
    maxLeverage: 1000,
    marginPercent: 0.10,
    swapLong: -7.50,
    swapShort: -7.50,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Volatility 100 Index': {
    name: 'Volatility 100 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 1,
    maxLot: 660,
    minSpread: 0.24,
    targetSpreadPercent: 0.03,
    maxLeverage: 1000,
    marginPercent: 0.10,
    swapLong: -10.00,
    swapShort: -10.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },

  // ========== BOOM INDICES ==========
  'Boom 150 Index': {
    name: 'Boom 150 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.5,
    maxLot: 1300,
    minSpread: 0.094,
    targetSpreadPercent: 0.00,
    maxLeverage: 2000,
    marginPercent: 0.05,
    swapLong: -5.00,
    swapShort: -3.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Boom 300 Index': {
    name: 'Boom 300 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.5,
    maxLot: 250,
    minSpread: 0.618,
    targetSpreadPercent: 0.03,
    maxLeverage: 100,
    marginPercent: 1.00,
    swapLong: -36.00,
    swapShort: -27.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Boom 500 Index': {
    name: 'Boom 500 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.2,
    maxLot: 400,
    minSpread: 0.338,
    targetSpreadPercent: 0.01,
    maxLeverage: 400,
    marginPercent: 0.25,
    swapLong: -23.00,
    swapShort: -9.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Boom 600 Index': {
    name: 'Boom 600 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.2,
    maxLot: 380,
    minSpread: 0.403,
    targetSpreadPercent: 0.01,
    maxLeverage: 400,
    marginPercent: 0.25,
    swapLong: -18.00,
    swapShort: -14.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Boom 900 Index': {
    name: 'Boom 900 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.2,
    maxLot: 310,
    minSpread: 0.497,
    targetSpreadPercent: 0.01,
    maxLeverage: 400,
    marginPercent: 0.25,
    swapLong: -16.00,
    swapShort: -11.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Boom 1000 Index': {
    name: 'Boom 1000 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.2,
    maxLot: 240,
    minSpread: 1.5959,
    targetSpreadPercent: 0.01,
    maxLeverage: 600,
    marginPercent: 0.17,
    swapLong: -18.00,
    swapShort: -6.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },

  // ========== CRASH INDICES ==========
  'Crash 150 Index': {
    name: 'Crash 150 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.5,
    maxLot: 1230,
    minSpread: 0.1007,
    targetSpreadPercent: 0.00,
    maxLeverage: 2000,
    marginPercent: 0.05,
    swapLong: -3.00,
    swapShort: -5.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Crash 300 Index': {
    name: 'Crash 300 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.5,
    maxLot: 350,
    minSpread: 0.377,
    targetSpreadPercent: 0.02,
    maxLeverage: 100,
    marginPercent: 1.00,
    swapLong: -27.00,
    swapShort: -36.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Crash 500 Index': {
    name: 'Crash 500 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.2,
    maxLot: 710,
    minSpread: 0.225,
    targetSpreadPercent: 0.01,
    maxLeverage: 400,
    marginPercent: 0.25,
    swapLong: -9.00,
    swapShort: -23.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Crash 600 Index': {
    name: 'Crash 600 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.2,
    maxLot: 120,
    minSpread: 1.29,
    targetSpreadPercent: 0.01,
    maxLeverage: 400,
    marginPercent: 0.25,
    swapLong: -14.00,
    swapShort: -18.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Crash 900 Index': {
    name: 'Crash 900 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.2,
    maxLot: 160,
    minSpread: 0.996,
    targetSpreadPercent: 0.01,
    maxLeverage: 400,
    marginPercent: 0.25,
    swapLong: -11.00,
    swapShort: -16.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Crash 1000 Index': {
    name: 'Crash 1000 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.2,
    maxLot: 720,
    minSpread: 0.2947,
    targetSpreadPercent: 0.01,
    maxLeverage: 600,
    marginPercent: 0.17,
    swapLong: -6.00,
    swapShort: -18.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },

  // ========== JUMP INDICES ==========
  'Jump 10 Index': {
    name: 'Jump 10 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.01,
    maxLot: 20,
    minSpread: 2.53,
    targetSpreadPercent: 0.00,
    maxLeverage: 2500,
    marginPercent: 0.04,
    swapLong: -2.00,
    swapShort: -2.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Jump 25 Index': {
    name: 'Jump 25 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.01,
    maxLot: 6,
    minSpread: 8.24,
    targetSpreadPercent: 0.01,
    maxLeverage: 1200,
    marginPercent: 0.08,
    swapLong: -4.00,
    swapShort: -4.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Jump 50 Index': {
    name: 'Jump 50 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.01,
    maxLot: 7,
    minSpread: 7.04,
    targetSpreadPercent: 0.02,
    maxLeverage: 600,
    marginPercent: 0.17,
    swapLong: -7.00,
    swapShort: -7.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Jump 75 Index': {
    name: 'Jump 75 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.01,
    maxLot: 15,
    minSpread: 3.91,
    targetSpreadPercent: 0.02,
    maxLeverage: 400,
    marginPercent: 0.25,
    swapLong: -10.00,
    swapShort: -10.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Jump 100 Index': {
    name: 'Jump 100 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 56,
    minSpread: 0.34,
    targetSpreadPercent: 0.04,
    maxLeverage: 250,
    marginPercent: 0.40,
    swapLong: -15.00,
    swapShort: -15.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },

  // ========== STEP INDICES ==========
  'Step Index': {
    name: 'Step Index',
    contractSize: 10,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 250,
    minSpread: 0.1,
    targetSpreadPercent: 0.00,
    maxLeverage: 10000,
    marginPercent: 0.01,
    swapLong: -0.55,
    swapShort: -0.55,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 1.0
  },
  'Step Index 200': {
    name: 'Step Index 200',
    contractSize: 10,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 60,
    minSpread: 0.2,
    targetSpreadPercent: 0.00,
    maxLeverage: 5000,
    marginPercent: 0.02,
    swapLong: -1.10,
    swapShort: -1.10,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 1.0
  },
  'Step Index 300': {
    name: 'Step Index 300',
    contractSize: 10,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 45,
    minSpread: 0.3,
    targetSpreadPercent: 0.00,
    maxLeverage: 3000,
    marginPercent: 0.03,
    swapLong: -1.65,
    swapShort: -1.65,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 1.0
  },
  'Step Index 400': {
    name: 'Step Index 400',
    contractSize: 10,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 40,
    minSpread: 0.4,
    targetSpreadPercent: 0.01,
    maxLeverage: 2500,
    marginPercent: 0.04,
    swapLong: -2.20,
    swapShort: -2.20,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 1.0
  },
  'Step Index 500': {
    name: 'Step Index 500',
    contractSize: 10,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 45,
    minSpread: 0.5,
    targetSpreadPercent: 0.01,
    maxLeverage: 2000,
    marginPercent: 0.05,
    swapLong: -2.75,
    swapShort: -2.75,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 1.0
  },

  // ========== RANGE BREAK INDICES ==========
  'Range Break 100 Index': {
    name: 'Range Break 100 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.01,
    maxLot: 15,
    minSpread: 2.2,
    targetSpreadPercent: 0.00,
    maxLeverage: 125,
    marginPercent: 0.80,
    swapLong: -30.00,
    swapShort: -30.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Range Break 200 Index': {
    name: 'Range Break 200 Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.01,
    maxLot: 15,
    minSpread: 1.9,
    targetSpreadPercent: 0.00,
    maxLeverage: 115,
    marginPercent: 0.87,
    swapLong: -30.00,
    swapShort: -30.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },

  // ========== DEX INDICES ==========
  'DEX 1500 DOWN Index': {
    name: 'DEX 1500 DOWN Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.01,
    maxLot: 20,
    minSpread: 2.7,
    targetSpreadPercent: 0.01,
    maxLeverage: 300,
    marginPercent: 0.33,
    swapLong: -15.00,
    swapShort: -25.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'DEX 1500 UP Index': {
    name: 'DEX 1500 UP Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 120,
    minSpread: 0.42,
    targetSpreadPercent: 0.01,
    maxLeverage: 300,
    marginPercent: 0.33,
    swapLong: -25.00,
    swapShort: -15.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'DEX 600 DOWN Index': {
    name: 'DEX 600 DOWN Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 110,
    minSpread: 0.43,
    targetSpreadPercent: 0.02,
    maxLeverage: 200,
    marginPercent: 0.50,
    swapLong: -20.00,
    swapShort: -30.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'DEX 600 UP Index': {
    name: 'DEX 600 UP Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 60,
    minSpread: 0.82,
    targetSpreadPercent: 0.02,
    maxLeverage: 200,
    marginPercent: 0.50,
    swapLong: -30.00,
    swapShort: -20.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'DEX 900 DOWN Index': {
    name: 'DEX 900 DOWN Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.01,
    maxLot: 15,
    minSpread: 6.31,
    targetSpreadPercent: 0.02,
    maxLeverage: 150,
    marginPercent: 0.67,
    swapLong: -25.00,
    swapShort: -35.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'DEX 900 UP Index': {
    name: 'DEX 900 UP Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 130,
    minSpread: 0.57,
    targetSpreadPercent: 0.01,
    maxLeverage: 150,
    marginPercent: 0.67,
    swapLong: -35.00,
    swapShort: -25.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },

  // ========== DRIFT SWITCH INDICES ==========
  'Drift Switch Index 10': {
    name: 'Drift Switch Index 10',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 80,
    minSpread: 0.4,
    targetSpreadPercent: 0.08,
    maxLeverage: 2000,
    marginPercent: 0.05,
    swapLong: -7.50,
    swapShort: -7.50,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Drift Switch Index 20': {
    name: 'Drift Switch Index 20',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 140,
    minSpread: 0.27,
    targetSpreadPercent: 0.09,
    maxLeverage: 2000,
    marginPercent: 0.05,
    swapLong: -7.50,
    swapShort: -7.50,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Drift Switch Index 30': {
    name: 'Drift Switch Index 30',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 70,
    minSpread: 0.4,
    targetSpreadPercent: 0.07,
    maxLeverage: 2000,
    marginPercent: 0.05,
    swapLong: -7.50,
    swapShort: -7.50,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },

  // ========== BASKET INDICES ==========
  'EUR Basket': {
    name: 'EUR Basket',
    contractSize: 100,
    baseCurrency: 'USD',
    minLot: 0.01,
    maxLot: 10,
    minSpread: 0.103,
    targetSpreadPercent: 0.02,
    maxLeverage: 1000,
    marginPercent: 0.10,
    swapLong: -3.00,
    swapShort: -1.00,
    tradingHours: 'Mon 00:00 - Fri 20:55 GMT',
    pointValue: 1.0
  },
  'GBP Basket': {
    name: 'GBP Basket',
    contractSize: 100,
    baseCurrency: 'USD',
    minLot: 0.01,
    maxLot: 10,
    minSpread: 0.143,
    targetSpreadPercent: 0.02,
    maxLeverage: 1000,
    marginPercent: 0.10,
    swapLong: -3.00,
    swapShort: -1.00,
    tradingHours: 'Mon 00:00 - Fri 20:55 GMT',
    pointValue: 1.0
  },
  'Gold Basket': {
    name: 'Gold Basket',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.01,
    maxLot: 2,
    minSpread: 349.421,
    targetSpreadPercent: 0.04,
    maxLeverage: 800,
    marginPercent: 0.13,
    swapLong: -5.00,
    swapShort: -0.10,
    tradingHours: 'Mon 00:00 - Fri 20:55 GMT. Daily break 22:00 - 23:00',
    pointValue: 0.1
  },
  'USD Basket': {
    name: 'USD Basket',
    contractSize: 100,
    baseCurrency: 'USD',
    minLot: 0.01,
    maxLot: 10,
    minSpread: 0.118,
    targetSpreadPercent: 0.01,
    maxLeverage: 1000,
    marginPercent: 0.10,
    swapLong: -3.00,
    swapShort: -1.00,
    tradingHours: 'Mon 00:00 - Fri 20:55 GMT',
    pointValue: 1.0
  },

  // ========== GOLD RSI INDICES ==========
  'Gold RSI Pullback Index': {
    name: 'Gold RSI Pullback Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 115,
    minSpread: 3.44,
    targetSpreadPercent: 0.08,
    maxLeverage: 500,
    marginPercent: 0.20,
    swapLong: -10.00,
    swapShort: -10.00,
    tradingHours: 'Mon 01:01 - Fri 20:54 GMT',
    pointValue: 0.1
  },
  'Gold RSI Rebound Index': {
    name: 'Gold RSI Rebound Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 75,
    minSpread: 8.12,
    targetSpreadPercent: 0.07,
    maxLeverage: 500,
    marginPercent: 0.20,
    swapLong: -10.00,
    swapShort: -10.00,
    tradingHours: 'Mon 01:01 - Fri 20:54 GMT',
    pointValue: 0.1
  },
  'Gold RSI Trend Down Index': {
    name: 'Gold RSI Trend Down Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 70,
    minSpread: 6.14,
    targetSpreadPercent: 0.07,
    maxLeverage: 500,
    marginPercent: 0.20,
    swapLong: -10.00,
    swapShort: -10.00,
    tradingHours: 'Mon 01:01 - Fri 20:54 GMT',
    pointValue: 0.1
  },
  'Gold RSI Trend Up Index': {
    name: 'Gold RSI Trend Up Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 45,
    minSpread: 14.5,
    targetSpreadPercent: 0.06,
    maxLeverage: 500,
    marginPercent: 0.20,
    swapLong: -10.00,
    swapShort: -10.00,
    tradingHours: 'Mon 01:01 - Fri 20:54 GMT',
    pointValue: 0.1
  },

  // ========== SILVER RSI INDICES ==========
  'Silver RSI Pullback Index': {
    name: 'Silver RSI Pullback Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 15,
    minSpread: 12.37,
    targetSpreadPercent: 0.17,
    maxLeverage: 100,
    marginPercent: 1.00,
    swapLong: -10.00,
    swapShort: -10.00,
    tradingHours: 'Mon 01:01 - Fri 20:54 GMT',
    pointValue: 0.1
  },
  'Silver RSI Rebound Index': {
    name: 'Silver RSI Rebound Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 10,
    minSpread: 57.48,
    targetSpreadPercent: 0.10,
    maxLeverage: 100,
    marginPercent: 1.00,
    swapLong: -10.00,
    swapShort: -10.00,
    tradingHours: 'Mon 01:01 - Fri 20:54 GMT',
    pointValue: 0.1
  },
  'Silver RSI Trend Down Index': {
    name: 'Silver RSI Trend Down Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 45,
    minSpread: 3.62,
    targetSpreadPercent: 0.16,
    maxLeverage: 100,
    marginPercent: 1.00,
    swapLong: -10.00,
    swapShort: -10.00,
    tradingHours: 'Mon 01:01 - Fri 20:54 GMT',
    pointValue: 0.1
  },
  'Silver RSI Trend Up Index': {
    name: 'Silver RSI Trend Up Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 35,
    minSpread: 12.57,
    targetSpreadPercent: 0.10,
    maxLeverage: 100,
    marginPercent: 1.00,
    swapLong: -10.00,
    swapShort: -10.00,
    tradingHours: 'Mon 01:01 - Fri 20:54 GMT',
    pointValue: 0.1
  },

  // ========== MULTI STEP INDICES ==========
  'Multi Step 2 Index': {
    name: 'Multi Step 2 Index',
    contractSize: 10,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 40,
    minSpread: 0.25,
    targetSpreadPercent: 0.00,
    maxLeverage: 7000,
    marginPercent: 0.01,
    swapLong: -1.00,
    swapShort: -1.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 1.0
  },
  'Multi Step 3 Index': {
    name: 'Multi Step 3 Index',
    contractSize: 10,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 40,
    minSpread: 0.2,
    targetSpreadPercent: 0.00,
    maxLeverage: 6000,
    marginPercent: 0.02,
    swapLong: -0.90,
    swapShort: -0.90,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 1.0
  },
  'Multi Step 4 Index': {
    name: 'Multi Step 4 Index',
    contractSize: 10,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 50,
    minSpread: 0.2,
    targetSpreadPercent: 0.00,
    maxLeverage: 5000,
    marginPercent: 0.02,
    swapLong: -0.80,
    swapShort: -0.80,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 1.0
  },

  // ========== TREK INDICES ==========
  'Trek Down Index': {
    name: 'Trek Down Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 80,
    minSpread: 0.72,
    targetSpreadPercent: 0.01,
    maxLeverage: 500,
    marginPercent: 0.20,
    swapLong: -10.00,
    swapShort: -10.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Trek Up Index': {
    name: 'Trek Up Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 80,
    minSpread: 0.75,
    targetSpreadPercent: 0.01,
    maxLeverage: 500,
    marginPercent: 0.20,
    swapLong: -10.00,
    swapShort: -10.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },

  // ========== VOL OVER INDICES ==========
  'Vol over Boom 400': {
    name: 'Vol over Boom 400',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 40,
    minSpread: 1.94,
    targetSpreadPercent: 0.02,
    maxLeverage: 100,
    marginPercent: 1.00,
    swapLong: -25.00,
    swapShort: -30.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Vol over Boom 550': {
    name: 'Vol over Boom 550',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 70,
    minSpread: 0.97,
    targetSpreadPercent: 0.02,
    maxLeverage: 150,
    marginPercent: 0.67,
    swapLong: -20.00,
    swapShort: -25.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Vol over Boom 750': {
    name: 'Vol over Boom 750',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 35,
    minSpread: 2.05,
    targetSpreadPercent: 0.01,
    maxLeverage: 200,
    marginPercent: 0.50,
    swapLong: -15.00,
    swapShort: -20.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Vol over Crash 400': {
    name: 'Vol over Crash 400',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 40,
    minSpread: 1.99,
    targetSpreadPercent: 0.03,
    maxLeverage: 100,
    marginPercent: 1.00,
    swapLong: -25.00,
    swapShort: -30.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Vol over Crash 550': {
    name: 'Vol over Crash 550',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 150,
    minSpread: 0.58,
    targetSpreadPercent: 0.01,
    maxLeverage: 150,
    marginPercent: 0.67,
    swapLong: -20.00,
    swapShort: -25.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'Vol over Crash 750': {
    name: 'Vol over Crash 750',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 60,
    minSpread: 1.12,
    targetSpreadPercent: 0.02,
    maxLeverage: 200,
    marginPercent: 0.50,
    swapLong: -15.00,
    swapShort: -20.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },

  // ========== VOLSWITCH INDICES ==========
  'VolSwitch High Vol Index': {
    name: 'VolSwitch High Vol Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 50,
    minSpread: 1.07,
    targetSpreadPercent: 0.07,
    maxLeverage: 700,
    marginPercent: 0.14,
    swapLong: -10.90,
    swapShort: -10.90,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'VolSwitch Low Vol Index': {
    name: 'VolSwitch Low Vol Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 50,
    minSpread: 1.14,
    targetSpreadPercent: 0.02,
    maxLeverage: 500,
    marginPercent: 0.20,
    swapLong: -4.30,
    swapShort: -4.30,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },
  'VolSwitch Medium Vol Index': {
    name: 'VolSwitch Medium Vol Index',
    contractSize: 1,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 20,
    minSpread: 2.01,
    targetSpreadPercent: 0.04,
    maxLeverage: 600,
    marginPercent: 0.17,
    swapLong: -7.30,
    swapShort: -7.30,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 0.1
  },

  // ========== SKEW STEP INDICES ==========
  'Skew Step Index 4 Down': {
    name: 'Skew Step Index 4 Down',
    contractSize: 10,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 20,
    minSpread: 0.6,
    targetSpreadPercent: 0.01,
    maxLeverage: 4000,
    marginPercent: 0.03,
    swapLong: -1.70,
    swapShort: -1.70,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 1.0
  },
  'Skew Step Index 4 Up': {
    name: 'Skew Step Index 4 Up',
    contractSize: 10,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 20,
    minSpread: 0.6,
    targetSpreadPercent: 0.01,
    maxLeverage: 4000,
    marginPercent: 0.03,
    swapLong: -1.70,
    swapShort: -1.70,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 1.0
  },
  'Skew Step Index 5 Down': {
    name: 'Skew Step Index 5 Down',
    contractSize: 10,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 15,
    minSpread: 0.9,
    targetSpreadPercent: 0.01,
    maxLeverage: 3000,
    marginPercent: 0.03,
    swapLong: -2.00,
    swapShort: -2.00,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 1.0
  },
  'Skew Step Index 5 Up': {
    name: 'Skew Step Index 5 Up',
    contractSize: 10,
    baseCurrency: 'USD',
    minLot: 0.1,
    maxLot: 15,
    minSpread: 0.8,
    targetSpreadPercent: 0.01,
    maxLeverage: 3000,
    marginPercent: 0.03,
    swapLong: -1.90,
    swapShort: -1.90,
    tradingHours: 'Sun 00:00 - Sat 24:00 GMT',
    pointValue: 1.0
  },
};

/**
 * Helper function to get Deriv spec for a symbol
 */
export function getDerivSpec(symbolName: string): DerivIndexSpec | undefined {
  return DERIV_SPECS[symbolName];
}

/**
 * Validate if a lot size is within the allowed range for a symbol
 */
export function validateLotSize(symbolName: string, lotSize: number): {
  valid: boolean;
  error?: string;
  adjustedLotSize?: number;
} {
  const spec = getDerivSpec(symbolName);
  
  if (!spec) {
    return { valid: false, error: 'Symbol not found in specifications' };
  }

  if (lotSize < spec.minLot) {
    return {
      valid: false,
      error: `Lot size ${lotSize} is below minimum ${spec.minLot} for ${symbolName}`,
      adjustedLotSize: spec.minLot
    };
  }

  if (lotSize > spec.maxLot) {
    return {
      valid: false,
      error: `Lot size ${lotSize} exceeds maximum ${spec.maxLot} for ${symbolName}`,
      adjustedLotSize: spec.maxLot
    };
  }

  return { valid: true };
}

/**
 * Calculate margin using actual Deriv specifications
 * Formula: Margin = (Lot Size × Contract Size × Price) / Max Leverage
 * But Deriv provides margin % directly, so:
 * Margin = Lot Size × Contract Size × Price × (Margin % / 100)
 */
export function calculateMarginFromSpec(
  symbolName: string,
  lotSize: number,
  currentPrice: number
): number {
  const spec = getDerivSpec(symbolName);
  
  if (!spec) {
    throw new Error(`Symbol ${symbolName} not found in Deriv specifications`);
  }

  // Margin = Lot Size × Contract Size × Price × (Margin % / 100)
  const margin = lotSize * spec.contractSize * currentPrice * (spec.marginPercent / 100);
  
  return Math.round(margin * 100) / 100;
}
