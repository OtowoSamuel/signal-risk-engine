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

// Convenience hooks for specific slices with shallow comparison
export const useSettings = () => {
  const settings = useCalculatorStore((state) => state.settings);
  const updateSettings = useCalculatorStore((state) => state.updateSettings);
  const resetSettings = useCalculatorStore((state) => state.resetSettings);
  
  return { settings, updateSettings, resetSettings };
};

export const useCalculator = () => {
  const selectedSymbol = useCalculatorStore((state) => state.selectedSymbol);
  const stopLoss = useCalculatorStore((state) => state.stopLoss);
  const entryPrice = useCalculatorStore((state) => state.entryPrice);
  const calculationResult = useCalculatorStore((state) => state.calculationResult);
  const setSelectedSymbol = useCalculatorStore((state) => state.setSelectedSymbol);
  const setStopLoss = useCalculatorStore((state) => state.setStopLoss);
  const setEntryPrice = useCalculatorStore((state) => state.setEntryPrice);
  const calculate = useCalculatorStore((state) => state.calculate);
  const clearCalculation = useCalculatorStore((state) => state.clearCalculation);
  
  return {
    selectedSymbol,
    stopLoss,
    entryPrice,
    calculationResult,
    setSelectedSymbol,
    setStopLoss,
    setEntryPrice,
    calculate,
    clearCalculation
  };
};

export const usePositions = () => {
  const openPositions = useCalculatorStore((state) => state.openPositions);
  const addPosition = useCalculatorStore((state) => state.addPosition);
  const removePosition = useCalculatorStore((state) => state.removePosition);
  const clearPositions = useCalculatorStore((state) => state.clearPositions);
  const updatePosition = useCalculatorStore((state) => state.updatePosition);
  
  return {
    openPositions,
    addPosition,
    removePosition,
    clearPositions,
    updatePosition
  };
};

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
