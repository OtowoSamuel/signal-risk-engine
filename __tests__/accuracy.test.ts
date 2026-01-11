/**
 * Accuracy Verification Tests for Deriv MT5 Calculations
 * Tests against real-world Deriv specifications
 */

import {
  calculateMaxLotSize,
  calculateMargin,
  calculateRiskAmount,
  calculatePosition
} from '../lib/calculator';
import { getSymbol } from '../lib/symbols';
import { AccountSettings } from '../types';

describe('Deriv MT5 Accuracy Verification', () => {
  describe('Margin Calculation Accuracy', () => {
    it('should calculate margin correctly for Volatility 75 (1s) Index at typical price', () => {
      const symbol = 'Volatility 75 (1s) Index';
      const symbolData = getSymbol(symbol);
      
      // Test with 0.01 lot at typical price
      const margin = calculateMargin(0.01, symbol);
      
      // Expected: (0.01 × 1 × 17500) / 1000 = 0.175
      const expected = (0.01 * symbolData.contractSize * symbolData.typicalPrice) / symbolData.leverage;
      
      expect(margin).toBe(Math.round(expected * 100) / 100);
      expect(margin).toBeCloseTo(0.18, 2); // Allow small rounding difference
    });

    it('should calculate margin correctly for 1 full lot', () => {
      const symbol = 'Volatility 75 (1s) Index';
      const symbolData = getSymbol(symbol);
      
      const margin = calculateMargin(1.0, symbol);
      
      // Expected: (1.0 × 1 × 17500) / 1000 = 17.50
      const expected = (1.0 * symbolData.contractSize * symbolData.typicalPrice) / symbolData.leverage;
      
      expect(margin).toBe(Math.round(expected * 100) / 100);
      expect(margin).toBeCloseTo(17.5, 2);
    });

    it('should handle custom entry price override', () => {
      const symbol = 'Volatility 75 (1s) Index';
      const customPrice = 20000; // Higher than typical
      
      const margin = calculateMargin(0.01, symbol, customPrice);
      
      // Expected: (0.01 × 1 × 20000) / 1000 = 0.20
      expect(margin).toBe(0.2);
    });

    it('should calculate lower margin for Step Index due to lower leverage', () => {
      const symbol = 'Step Index';
      const symbolData = getSymbol(symbol);
      
      expect(symbolData.leverage).toBe(500); // Verify lower leverage
      
      const margin = calculateMargin(0.01, symbol);
      
      // Expected: (0.01 × 1 × 20000) / 500 = 0.40
      const expected = (0.01 * symbolData.contractSize * symbolData.typicalPrice) / symbolData.leverage;
      
      expect(margin).toBe(Math.round(expected * 100) / 100);
      expect(margin).toBeGreaterThan(0.3); // Should be higher than 1:1000 leverage
    });

    it('should verify contract size is 1 for all synthetic indices', () => {
      const symbols: Array<'Volatility 75 (1s) Index' | 'Crash 500 Index' | 'Boom 1000 Index' | 'Jump 50 Index'> = [
        'Volatility 75 (1s) Index',
        'Crash 500 Index',
        'Boom 1000 Index',
        'Jump 50 Index'
      ];

      symbols.forEach(symbol => {
        const symbolData = getSymbol(symbol);
        expect(symbolData.contractSize).toBe(1);
      });
    });

    it('should calculate margin correctly for Crash indices with lower prices', () => {
      const symbol = 'Crash 500 Index';
      const symbolData = getSymbol(symbol);
      
      const margin = calculateMargin(0.1, symbol);
      
      // Expected: (0.1 × 1 × 1200) / 1000 = 0.12
      const expected = (0.1 * symbolData.contractSize * symbolData.typicalPrice) / symbolData.leverage;
      
      expect(margin).toBe(Math.round(expected * 100) / 100);
      expect(margin).toBeCloseTo(0.12, 2);
    });

    it('should calculate margin correctly for Boom indices with high prices', () => {
      const symbol = 'Boom 500 Index';
      const symbolData = getSymbol(symbol);
      
      const margin = calculateMargin(0.01, symbol);
      
      // Expected: (0.01 × 1 × 5200000) / 1000 = 52.00
      const expected = (0.01 * symbolData.contractSize * symbolData.typicalPrice) / symbolData.leverage;
      
      expect(margin).toBe(Math.round(expected * 100) / 100);
      expect(margin).toBeCloseTo(52.0, 2);
    });
  });

  describe('Point Value Verification', () => {
    it('should verify all symbols have $0.10 point value', () => {
      const symbols: Array<'Volatility 75 (1s) Index' | 'Crash 500 Index' | 'Boom 1000 Index' | 'Jump 50 Index' | 'Step Index'> = [
        'Volatility 75 (1s) Index',
        'Crash 500 Index',
        'Boom 1000 Index',
        'Jump 50 Index',
        'Step Index'
      ];

      symbols.forEach(symbol => {
        const symbolData = getSymbol(symbol);
        expect(symbolData.pointValue).toBe(0.1);
      });
    });

    it('should calculate risk correctly with $0.10 point value', () => {
      const symbol = 'Volatility 75 (1s) Index';
      const lotSize = 0.01;
      const slPoints = 50;
      
      const risk = calculateRiskAmount(lotSize, slPoints, symbol);
      
      // Expected: 0.01 × 50 × 0.10 = 0.05
      expect(risk).toBe(0.05);
    });

    it('should scale risk proportionally with lot size', () => {
      const symbol = 'Volatility 75 (1s) Index';
      const slPoints = 100;
      
      const risk001 = calculateRiskAmount(0.01, slPoints, symbol);
      const risk01 = calculateRiskAmount(0.1, slPoints, symbol);
      const risk1 = calculateRiskAmount(1.0, slPoints, symbol);
      
      expect(risk01).toBe(risk001 * 10);
      expect(risk1).toBe(risk001 * 100);
    });
  });

  describe('Real-World Trading Scenarios', () => {
    it('should handle typical retail trader scenario correctly', () => {
      const settings: AccountSettings = {
        mt5Balance: 20,
        targetMarginPercent: 35
      };

      const result = calculatePosition(settings, 50, 'Volatility 75 (1s) Index');

      // Verify lot size calculation
      expect(result.recommendedLotSize).toBeGreaterThan(0);
      expect(result.recommendedLotSize).toBeLessThanOrEqual(100); // Max lot

      // Verify margin calculation uses correct formula
      expect(result.marginRequired).toBeGreaterThan(0);
      
      // Verify risk calculation
      expect(result.riskAmount).toBeGreaterThan(0);
      expect(result.riskPercentage).toBeGreaterThan(0);

      // Verify buffer calculation
      expect(result.drawdownBuffer).toBeDefined();
      expect(result.drawdownBufferPercentage).toBeDefined();
    });

    it('should warn when margin exceeds allocated capital', () => {
      const settings: AccountSettings = {
        mt5Balance: 5,
        targetMarginPercent: 35
      };

      const result = calculatePosition(settings, 20, 'Volatility 75 (1s) Index');

      // With low allocated capital, should get warning
      expect(['critical', 'high']).toContain(result.warning);
    });

    it('should calculate properly for larger accounts', () => {
      const settings: AccountSettings = {
        mt5Balance: 1000,
        targetMarginPercent: 35
      };

      const result = calculatePosition(settings, 100, 'Volatility 75 (1s) Index');

      // Larger capital should allow larger positions
      expect(result.recommendedLotSize).toBeGreaterThan(0.1);
      
      // But margin should still be reasonable
      expect(result.marginRequired).toBeLessThan(settings.mt5Balance);
      
      // Should have decent buffer (at least 30%)
      expect(result.drawdownBufferPercentage).toBeGreaterThan(30);
    });

    it('should respect 35% margin preservation cap', () => {
      const settings: AccountSettings = {
        mt5Balance: 50,
        targetMarginPercent: 35
      };

      const result = calculatePosition(settings, 50, 'Volatility 75 (1s) Index');

      // Lot size should be calculated with 35% cap
      const expectedMaxLot = (settings.mt5Balance * 0.35) / (50 * 0.1);
      
      expect(result.recommendedLotSize).toBeLessThanOrEqual(expectedMaxLot);
    });
  });

  describe('Leverage Verification', () => {
    it('should verify 1:1000 leverage for volatility indices', () => {
      const symbol = 'Volatility 100 (1s) Index';
      const symbolData = getSymbol(symbol);
      
      expect(symbolData.leverage).toBe(1000);
    });

    it('should verify 1:1000 leverage for crash/boom indices', () => {
      const symbols: Array<'Crash 300 Index' | 'Boom 1000 Index'> = ['Crash 300 Index', 'Boom 1000 Index'];
      
      symbols.forEach(symbol => {
        const symbolData = getSymbol(symbol);
        expect(symbolData.leverage).toBe(1000);
      });
    });

    it('should verify 1:500 leverage for Step Index', () => {
      const symbol = 'Step Index';
      const symbolData = getSymbol(symbol);
      
      expect(symbolData.leverage).toBe(500);
    });

    it('should verify leverage affects margin correctly', () => {
      // Compare same lot size on different leverage
      const margin1000 = calculateMargin(0.01, 'Volatility 75 (1s) Index');
      const margin500 = calculateMargin(0.01, 'Step Index');
      
      // Step Index (1:500) should require approximately 2x margin of Volatility (1:1000)
      // Accounting for different typical prices, verify leverage ratio is respected
      const vol75Data = getSymbol('Volatility 75 (1s) Index');
      const stepData = getSymbol('Step Index');
      
      const expectedMargin1000 = (0.01 * 1 * vol75Data.typicalPrice) / 1000;
      const expectedMargin500 = (0.01 * 1 * stepData.typicalPrice) / 500;
      
      // Use precision 1 to allow for rounding (0.175 rounds to 0.18)
      expect(margin1000).toBeCloseTo(expectedMargin1000, 1);
      expect(margin500).toBeCloseTo(expectedMargin500, 1);
    });
  });

  describe('MT5 Constraints Verification', () => {
    it('should enforce minimum lot size of 0.01', () => {
      const result = calculateMaxLotSize(1, 1000, 'Volatility 75 (1s) Index');
      
      // Even with tiny capital, should not go below 0.01
      expect(result).toBeGreaterThanOrEqual(0.01);
    });

    it('should enforce maximum lot size of 100', () => {
      const result = calculateMaxLotSize(100000, 10, 'Volatility 75 (1s) Index');
      
      // Even with huge capital, should not exceed 100
      expect(result).toBeLessThanOrEqual(100);
    });

    it('should round to 0.01 lot step', () => {
      const result = calculateMaxLotSize(10, 37, 'Volatility 75 (1s) Index');
      
      // Check that result is a multiple of 0.01
      const remainder = (result * 100) % 1;
      expect(remainder).toBeCloseTo(0, 10);
    });

    it('should verify all symbols have correct MT5 constraints', () => {
      const symbols: Array<'Volatility 75 (1s) Index' | 'Crash 500 Index' | 'Boom 1000 Index'> = [
        'Volatility 75 (1s) Index',
        'Crash 500 Index',
        'Boom 1000 Index'
      ];

      // Volatility indices have 0.1 min lot, Crash/Boom have 1.0 min lot
      expect(getSymbol('Volatility 75 (1s) Index').minLot).toBe(0.1);
      expect(getSymbol('Crash 500 Index').minLot).toBe(1.0);
      expect(getSymbol('Boom 1000 Index').minLot).toBe(1.0);
      
      symbols.forEach(symbol => {
        const symbolData = getSymbol(symbol);
        expect(symbolData.maxLot).toBe(100);
      });
    });
  });
});
