/**
 * TradeCalculator Component
 * Based on PRD Section 7.3 - Trade Calculator Interface
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCalculator, useSettings } from '@/lib/store';
import { getSymbolNames } from '@/lib/symbols';
import { validateCalculationInputs } from '@/lib/calculator';
import { SymbolName } from '@/types';
import ShowMath from './ShowMath';

export default function TradeCalculator() {
  const {
    selectedSymbol,
    stopLoss,
    calculationResult,
    setSelectedSymbol,
    setStopLoss,
    calculate
  } = useCalculator();
  
  const { settings } = useSettings();
  const [inputErrors, setInputErrors] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [slPrice, setSlPrice] = useState<number>(0);

  const symbolNames = getSymbolNames();

  // Auto-calculate SL in points when prices change
  useEffect(() => {
    if (entryPrice > 0 && slPrice > 0) {
      const calculatedPoints = Math.abs(entryPrice - slPrice);
      setStopLoss(Math.round(calculatedPoints * 100) / 100);
    }
  }, [entryPrice, slPrice, setStopLoss]);

  // Debounced calculation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (stopLoss > 0) {
        const validation = validateCalculationInputs(stopLoss, settings.mt5Balance);
        
        if (validation.valid) {
          calculate();
          setInputErrors([]);
        } else {
          setInputErrors(validation.errors);
        }
      }
    }, 300); // 300ms debounce as per PRD Section 7.3 (FR-3.4)

    return () => clearTimeout(timer);
  }, [stopLoss, selectedSymbol, settings.mt5Balance, calculate]);

  const handleCopyLotSize = useCallback(() => {
    if (calculationResult) {
      navigator.clipboard.writeText(calculationResult.recommendedLotSize.toFixed(2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [calculationResult]);

  const getWarningColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'moderate':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-green-100 border-green-300 text-green-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Trade Calculator
      </h2>

      <div className="space-y-6">
        {/* Symbol Selector */}
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-2">
            Select Symbol
          </label>
          <select
            id="symbol"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value as SymbolName)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white text-gray-900"
          >
            {symbolNames.map((name) => (
              <option key={name} value={name} className="text-gray-900 bg-white">
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Entry Price Input */}
        <div>
          <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Entry Price
          </label>
          <input
            type="number"
            id="entryPrice"
            value={entryPrice || ''}
            onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            placeholder="4500"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-1">
            Current market price or your planned entry
          </p>
        </div>

        {/* Stop Loss Price Input */}
        <div>
          <label htmlFor="slPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Stop Loss Price
          </label>
          <input
            type="number"
            id="slPrice"
            value={slPrice || ''}
            onChange={(e) => setSlPrice(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            placeholder="4472.29"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your stop loss price from signal
          </p>
        </div>

        {/* Auto-Calculated SL Points Display */}
        {stopLoss > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              📊 <span className="font-semibold">Stop Loss:</span> {stopLoss.toFixed(2)} points
            </p>
          </div>
        )}

        {/* Input Errors */}
        {inputErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            {inputErrors.map((error, index) => (
              <p key={index} className="text-sm text-red-700">
                • {error}
              </p>
            ))}
          </div>
        )}

        {/* Calculation Results */}
        {calculationResult && stopLoss > 0 && inputErrors.length === 0 && (
          <div className="border-t border-gray-200 pt-6 space-y-4">
            {/* Primary Output - STACKING INFO */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <p className="text-sm opacity-90 mb-2">🎯 Stacking Strategy</p>
              <div className="flex items-baseline justify-center gap-3 mb-4">
                <p className="text-6xl font-bold">
                  {calculationResult.stackingInfo.positionsToStack || 0}
                </p>
                <p className="text-2xl font-medium opacity-90">positions</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Each position:</span>
                  <span className="text-lg font-bold">{calculationResult.stackingInfo.minLotSize} lots</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Margin per position:</span>
                  <span className="text-lg font-bold">${calculationResult.stackingInfo.marginPerPosition.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/20 pt-2 mt-2">
                  <span className="text-sm opacity-90">Total margin used:</span>
                  <span className="text-lg font-bold">
                    ${(calculationResult.stackingInfo.positionsToStack * calculationResult.stackingInfo.marginPerPosition).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Total stacked lots:</span>
                  <span className="text-lg font-bold">{calculationResult.stackingInfo.totalStackedLots} lots</span>
                </div>
              </div>
              <p className="text-xs text-center mt-4 opacity-80">
                Open {calculationResult.stackingInfo.positionsToStack} positions at {calculationResult.stackingInfo.minLotSize} lots each on your confirmation candle
              </p>
            </div>

            {/* Secondary Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Margin Required</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${calculationResult.marginRequired.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((calculationResult.marginRequired / settings.mt5Balance) * 100).toFixed(0)}% of allocated
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Risk Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${calculationResult.riskAmount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {calculationResult.riskPercentage.toFixed(2)}% of balance
                </p>
              </div>
            </div>

            {/* Tertiary Information - Buffer */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Drawdown Buffer</p>
                  <p className="text-sm font-medium text-gray-900">
                    ${calculationResult.drawdownBuffer.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {calculationResult.drawdownBufferPercentage.toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-500">remaining buffer</p>
                </div>
              </div>
            </div>

            {/* Warning Messages */}
            {calculationResult.warning !== 'none' && (
              <div className={`rounded-lg border-2 p-4 ${getWarningColor(calculationResult.warning)}`}>
                <p className="font-medium text-sm">
                  {calculationResult.warningMessage}
                </p>
              </div>
            )}

            {calculationResult.warning === 'none' && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <p className="font-medium text-sm text-green-800">
                  ✓ Safe position size with adequate buffer
                </p>
              </div>
            )}

            {/* Show Math Component */}
            <ShowMath
              calculationResult={calculationResult}
              allocatedCapital={settings.mt5Balance}
              stopLoss={stopLoss}
              symbol={selectedSymbol}
            />
          </div>
        )}

        {/* Empty State */}
        {(!calculationResult || stopLoss === 0) && inputErrors.length === 0 && (
          <div className="border-t border-gray-200 pt-6 text-center text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Enter a stop loss to calculate lot size</p>
          </div>
        )}
      </div>
    </div>
  );
}
