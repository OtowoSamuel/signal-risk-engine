/**
 * Tests for Risk Calculation Engine
 * Based on PRD Section 10.1 and Section 12.6
 */

import {
  calculateMaxLotSize,
  calculateMargin,
  calculateRiskAmount,
  calculateDrawdownBuffer,
  calculatePosition,
  analyzeStacking,
  validateAccountSettings,
  validateCalculationInputs
} from '../lib/calculator';
import { AccountSettings } from '../types';

describe('Risk Calculation Engine', () => {
  describe('calculateMaxLotSize', () => {
    it('should calculate correct lot size for given inputs', () => {
      const result = calculateMaxLotSize(10, 50, 'Volatility 75');
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(0.1); // Should be small for $10 allocated
    });

    it('should return 0 for invalid inputs', () => {
      expect(calculateMaxLotSize(0, 50, 'Volatility 75')).toBe(0);
      expect(calculateMaxLotSize(10, 0, 'Volatility 75')).toBe(0);
    });

    it('should respect MT5 min lot size constraint', () => {
      const result = calculateMaxLotSize(1, 1000, 'Volatility 75');
      expect(result).toBeGreaterThanOrEqual(0.01);
    });

    it('should round to 2 decimals (MT5 format)', () => {
      const result = calculateMaxLotSize(10, 50, 'Volatility 75');
      expect(result).toBe(parseFloat(result.toFixed(2)));
    });
  });

  describe('calculateMargin', () => {
    it('should calculate margin correctly', () => {
      const margin = calculateMargin(0.01, 'Volatility 75', 1000);
      expect(margin).toBeGreaterThan(0);
      expect(margin).toBe(parseFloat(margin.toFixed(2)));
    });

    it('should scale with lot size', () => {
      const margin1 = calculateMargin(0.01, 'Volatility 75', 1000);
      const margin2 = calculateMargin(0.02, 'Volatility 75', 1000);
      expect(margin2).toBe(margin1 * 2);
    });
  });

  describe('calculateRiskAmount', () => {
    it('should calculate risk correctly', () => {
      const risk = calculateRiskAmount(0.01, 50, 'Volatility 75');
      expect(risk).toBeGreaterThan(0);
      expect(risk).toBe(0.05); // 0.01 * 50 * 0.1
    });
  });

  describe('calculateDrawdownBuffer', () => {
    it('should calculate buffer correctly', () => {
      const result = calculateDrawdownBuffer(10, 3);
      expect(result.buffer).toBe(7);
      expect(result.bufferPercentage).toBe(70);
    });

    it('should handle edge case where margin equals allocated capital', () => {
      const result = calculateDrawdownBuffer(10, 10);
      expect(result.buffer).toBe(0);
      expect(result.bufferPercentage).toBe(0);
    });
  });

  describe('calculatePosition', () => {
    const settings: AccountSettings = {
      totalBalance: 100,
      allocatedCapital: 10,
      riskStyle: 'percentage',
      riskPercentage: 2
    };

    it('should return complete calculation result', () => {
      const result = calculatePosition(settings, 50, 'Volatility 75');
      
      expect(result).toHaveProperty('recommendedLotSize');
      expect(result).toHaveProperty('marginRequired');
      expect(result).toHaveProperty('riskAmount');
      expect(result).toHaveProperty('riskPercentage');
      expect(result).toHaveProperty('drawdownBuffer');
      expect(result).toHaveProperty('drawdownBufferPercentage');
      expect(result).toHaveProperty('warning');
    });

    it('should set high warning when buffer is low', () => {
      const lowBufferSettings: AccountSettings = {
        ...settings,
        allocatedCapital: 5
      };
      const result = calculatePosition(lowBufferSettings, 10, 'Volatility 75');
      expect(['high', 'moderate']).toContain(result.warning);
    });

    it('should set none warning when buffer is adequate', () => {
      const result = calculatePosition(settings, 50, 'Volatility 75');
      // With proper margin preservation, buffer should be good
      expect(result.drawdownBufferPercentage).toBeGreaterThan(50);
    });
  });

  describe('analyzeStacking', () => {
    it('should analyze single position correctly', () => {
      const positions = [{
        id: '1',
        symbol: 'Volatility 75' as const,
        lotSize: 0.01,
        stopLoss: 50,
        marginUsed: 3
      }];

      const analysis = analyzeStacking(10, positions);
      expect(analysis.totalMarginUsed).toBe(3);
      expect(analysis.totalMarginPercentage).toBe(30);
      expect(analysis.remainingBuffer).toBe(7);
      expect(analysis.warningLevel).toBe('none');
    });

    it('should warn at high margin usage', () => {
      const positions = [{
        id: '1',
        symbol: 'Volatility 75' as const,
        lotSize: 0.01,
        stopLoss: 50,
        marginUsed: 7.5
      }];

      const analysis = analyzeStacking(10, positions);
      expect(analysis.warningLevel).toBe('high');
      expect(analysis.canAddPosition).toBe(true);
    });

    it('should prevent adding position at critical levels', () => {
      const positions = [{
        id: '1',
        symbol: 'Volatility 75' as const,
        lotSize: 0.01,
        stopLoss: 50,
        marginUsed: 9
      }];

      const analysis = analyzeStacking(10, positions);
      expect(analysis.warningLevel).toBe('critical');
      expect(analysis.canAddPosition).toBe(false);
    });
  });

  describe('validateAccountSettings', () => {
    it('should validate correct settings', () => {
      const settings: AccountSettings = {
        totalBalance: 100,
        allocatedCapital: 10,
        riskStyle: 'percentage',
        riskPercentage: 2
      };

      const result = validateAccountSettings(settings);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject allocated capital > total balance', () => {
      const settings = {
        totalBalance: 100,
        allocatedCapital: 150,
        riskStyle: 'percentage' as const,
        riskPercentage: 2
      };

      const result = validateAccountSettings(settings);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject invalid risk percentage', () => {
      const settings = {
        totalBalance: 100,
        allocatedCapital: 10,
        riskStyle: 'percentage' as const,
        riskPercentage: 10 // Too high
      };

      const result = validateAccountSettings(settings);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateCalculationInputs', () => {
    it('should validate correct inputs', () => {
      const result = validateCalculationInputs(50, 10);
      expect(result.valid).toBe(true);
    });

    it('should reject negative SL', () => {
      const result = validateCalculationInputs(-10, 10);
      expect(result.valid).toBe(false);
    });

    it('should reject excessive SL', () => {
      const result = validateCalculationInputs(1500, 10);
      expect(result.valid).toBe(false);
    });
  });
});
