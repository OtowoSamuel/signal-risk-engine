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

  const symbolNames = getSymbolNames();

  // Debounced calculation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (stopLoss > 0) {
        const validation = validateCalculationInputs(stopLoss, settings.allocatedCapital);
        
        if (validation.valid) {
          calculate();
          setInputErrors([]);
        } else {
          setInputErrors(validation.errors);
        }
      }
    }, 300); // 300ms debounce as per PRD Section 7.3 (FR-3.4)

    return () => clearTimeout(timer);
  }, [stopLoss, selectedSymbol, settings.allocatedCapital, calculate]);

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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white"
          >
            {symbolNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Stop Loss Input */}
        <div>
          <label htmlFor="stopLoss" className="block text-sm font-medium text-gray-700 mb-2">
            Stop Loss (Points)
          </label>
          <input
            type="number"
            id="stopLoss"
            value={stopLoss || ''}
            onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
            min="1"
            max="1000"
            step="1"
            placeholder="50"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter stop loss distance in points (not pips)
          </p>
        </div>

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
            {/* Primary Output - Lot Size */}
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600 mb-1">MT5 Lot Size</p>
              <p className="text-5xl font-bold text-blue-600 mb-3">
                {calculationResult.recommendedLotSize.toFixed(2)}
              </p>
              <button
                onClick={handleCopyLotSize}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy to Clipboard
                  </>
                )}
              </button>
              <p className="text-xs text-gray-600 mt-2">
                Use this exact value in MT5
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
                  {((calculationResult.marginRequired / settings.allocatedCapital) * 100).toFixed(0)}% of allocated
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
