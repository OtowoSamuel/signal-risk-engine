/**
 * Zustand Store for Signal Risk Engine
 * Based on PRD Section 7.4 and Section 10.5 (localStorage persistence)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  AccountSettings,
  OpenPosition,
  SymbolName,
  CalculationResult,
  RiskStyle
} from '@/types';
import { calculatePosition, analyzeStacking } from './calculator';

interface CalculatorState {
  // Account Settings
  settings: AccountSettings;
  updateSettings: (settings: Partial<AccountSettings>) => void;
  resetSettings: () => void;

  // Calculator Inputs
  selectedSymbol: SymbolName;
  stopLoss: number;
  entryPrice?: number;
  setSelectedSymbol: (symbol: SymbolName) => void;
  setStopLoss: (sl: number) => void;
  setEntryPrice: (price: number | undefined) => void;

  // Calculation Results
  calculationResult: CalculationResult | null;
  calculate: () => void;
  clearCalculation: () => void;

  // Position Tracking
  openPositions: OpenPosition[];
  addPosition: (position: Omit<OpenPosition, 'id'>) => void;
  removePosition: (id: string) => void;
  clearPositions: () => void;
  updatePosition: (id: string, updates: Partial<OpenPosition>) => void;
}

const defaultSettings: AccountSettings = {
  totalBalance: 100,
  allocatedCapital: 10,
  riskStyle: 'percentage',
  riskPercentage: 2
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      // Initial State
      settings: defaultSettings,
      selectedSymbol: 'Volatility 75',
      stopLoss: 50,
      entryPrice: undefined,
      calculationResult: null,
      openPositions: [],

      // Settings Actions
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
        // Recalculate if there's existing data
        const { stopLoss } = get();
        if (stopLoss > 0) {
          get().calculate();
        }
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
      },

      // Calculator Input Actions
      setSelectedSymbol: (symbol) => {
        set({ selectedSymbol: symbol });
        // Recalculate immediately
        const { stopLoss } = get();
        if (stopLoss > 0) {
          get().calculate();
        }
      },

      setStopLoss: (sl) => {
        set({ stopLoss: sl });
        // Recalculate immediately (debounced in component)
        if (sl > 0) {
          get().calculate();
        }
      },

      setEntryPrice: (price) => {
        set({ entryPrice: price });
        // Recalculate if price is set
        const { stopLoss } = get();
        if (stopLoss > 0) {
          get().calculate();
        }
      },

      // Calculation Actions
      calculate: () => {
        const { settings, selectedSymbol, stopLoss, entryPrice } = get();
        
        if (stopLoss <= 0 || settings.allocatedCapital <= 0) {
          set({ calculationResult: null });
          return;
        }

        try {
          const result = calculatePosition(
            settings,
            stopLoss,
            selectedSymbol,
            entryPrice
          );
          set({ calculationResult: result });
        } catch (error) {
          console.error('Calculation error:', error);
          set({ calculationResult: null });
        }
      },

      clearCalculation: () => {
        set({
          calculationResult: null,
          stopLoss: 0,
          entryPrice: undefined
        });
      },

      // Position Tracking Actions
      addPosition: (position) => {
        const id = `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
          openPositions: [...state.openPositions, { ...position, id }]
        }));
      },

      removePosition: (id) => {
        set((state) => ({
          openPositions: state.openPositions.filter((pos) => pos.id !== id)
        }));
      },

      clearPositions: () => {
        set({ openPositions: [] });
      },

      updatePosition: (id, updates) => {
        set((state) => ({
          openPositions: state.openPositions.map((pos) =>
            pos.id === id ? { ...pos, ...updates } : pos
          )
        }));
      }
    }),
    {
      name: 'signal-risk-engine-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        openPositions: state.openPositions
      })
    }
  )
);

// Convenience hooks for specific slices
export const useSettings = () =>
  useCalculatorStore((state) => ({
    settings: state.settings,
    updateSettings: state.updateSettings,
    resetSettings: state.resetSettings
  }));

export const useCalculator = () =>
  useCalculatorStore((state) => ({
    selectedSymbol: state.selectedSymbol,
    stopLoss: state.stopLoss,
    entryPrice: state.entryPrice,
    calculationResult: state.calculationResult,
    setSelectedSymbol: state.setSelectedSymbol,
    setStopLoss: state.setStopLoss,
    setEntryPrice: state.setEntryPrice,
    calculate: state.calculate,
    clearCalculation: state.clearCalculation
  }));

export const usePositions = () =>
  useCalculatorStore((state) => ({
    openPositions: state.openPositions,
    addPosition: state.addPosition,
    removePosition: state.removePosition,
    clearPositions: state.clearPositions,
    updatePosition: state.updatePosition
  }));

// Helper hook for stacking analysis
export const useStackingAnalysis = () => {
  const { settings } = useSettings();
  const { openPositions } = usePositions();
  const { calculationResult } = useCalculator();

  return analyzeStacking(
    settings.allocatedCapital,
    openPositions,
    calculationResult ? { margin: calculationResult.marginRequired } : undefined
  );
};
