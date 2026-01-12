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

interface TradeCalculatorProps {
  displayMode?: 'full' | 'inputs-only' | 'stacking-result-only' | 'gauges-only' | 'show-math-only';
}

export default function TradeCalculator({ displayMode = 'full' }: TradeCalculatorProps) {
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

  // Inputs-only mode (for left sidebar)
  if (displayMode === 'inputs-only') {
    return (
      <div className="glass-card rounded-xl p-4">
        <h2 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3 label-text flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" />
          </svg>
          Calculator
        </h2>

        <div className="space-y-3">
          {/* Symbol Selector */}
          <div>
            <label htmlFor="symbol" className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 label-text">
              Symbol
            </label>
            <select
              id="symbol"
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value as SymbolName)}
              className="w-full px-3 py-2 bg-[#1E2329] border border-[#2B3139] rounded-lg text-sm text-white transition-all focus-within:ring-2 focus-within:ring-[#2962FF]/50 focus:outline-none hover:bg-[#1E2329]/80"              aria-label="Select trading symbol"            >
              {getSymbolNames().map((name) => (
                <option key={name} value={name} className="bg-gray-900 text-white">
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Entry Price Input */}
          <div>
            <label htmlFor="entryPrice" className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 label-text">
              Entry Price
            </label>
            <input
              type="number"
              id="entryPrice"
              value={entryPrice || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setEntryPrice(isNaN(value) ? 0 : value);
              }}
              min="0"
              step="0.01"
              placeholder="4500"
              className="w-full px-3 py-2 bg-[#1E2329] border border-[rgba(255,255,255,0.05)] rounded-lg text-sm text-white mono-numbers transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50"
            />
          </div>

          {/* Stop Loss Price Input */}
          <div>
            <label htmlFor="slPrice" className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 label-text">
              Stop Loss Price
            </label>
            <input
              type="number"
              id="slPrice"
              value={slPrice || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setSlPrice(isNaN(value) ? 0 : value);
              }}
              min="0"
              step="0.01"
              placeholder="4472.29"
              className="w-full px-3 py-2 bg-[#1E2329] border border-[rgba(255,255,255,0.05)] rounded-lg text-sm text-white mono-numbers transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50"
            />
          </div>

          {/* Auto-Calculated SL Points Display */}
          {stopLoss > 0 && (
            <div className="elevated-card rounded-lg p-2 border border-[#2962FF]/30">
              <p className="text-xs text-[#2962FF] label-text">
                Stop Loss: <span className="mono-numbers font-semibold">{stopLoss.toFixed(2)}</span> points
              </p>
            </div>
          )}

          {/* Input Errors */}
          {inputErrors.length > 0 && (
            <div className="elevated-card rounded-lg p-2 border border-red-500/30">
              {inputErrors.map((error, index) => (
                <p key={index} className="text-xs text-red-400">
                  • {error}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Stacking result only mode (for top right)
  if (displayMode === 'stacking-result-only') {
    return (
      <>
        {calculationResult && stopLoss > 0 && inputErrors.length === 0 && (
          <div className="h-full flex flex-col justify-center">
            <div className="flex items-baseline justify-center gap-3 mb-4">
              <p className="text-7xl font-bold text-white mono-numbers value-text leading-none animate-value fade-in">
                {calculationResult.stackingInfo.positionsToStack || 0}
              </p>
              <p className="text-xl font-medium text-[#94A3B8] label-text">{calculationResult.stackingInfo.positionsToStack === 1 ? 'position' : 'positions'}</p>
            </div>
            <div className="bg-[#2962FF]/10 rounded-lg p-3 space-y-1.5 backdrop-blur-sm border border-[rgba(255,255,255,0.05)]">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider label-text">Each position</span>
                <span className="text-base font-semibold text-white mono-numbers value-text fade-in">{calculationResult.stackingInfo.minLotSize} <span className="text-sm opacity-70">lots</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider label-text">Margin/Position</span>
                <span className="text-base font-semibold text-white mono-numbers value-text fade-in"><span className="text-sm opacity-70">$</span>{calculationResult.stackingInfo.marginPerPosition.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-1.5 mt-1.5">
                <span className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider label-text">Total Margin</span>
                <span className="text-base font-semibold text-white mono-numbers value-text fade-in">
                  <span className="text-sm opacity-70">$</span>{(calculationResult.stackingInfo.positionsToStack * calculationResult.stackingInfo.marginPerPosition).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider label-text">Total Lots</span>
                <span className="text-base font-semibold text-white mono-numbers value-text fade-in">{calculationResult.stackingInfo.totalStackedLots} <span className="text-sm opacity-70">lots</span></span>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Gauges only mode (for middle right)
  if (displayMode === 'gauges-only') {
    return (
      <>
        {calculationResult && stopLoss > 0 && inputErrors.length === 0 && (
          <div className="space-y-3">
            {/* Margin Required */}
            <div className="rounded-lg p-3 border border-[rgba(255,255,255,0.05)] bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.02),transparent),#161A1E] backdrop-blur-sm">
              <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mb-2 label-text">Margin Required</p>
              <p className="text-xl font-semibold text-white mono-numbers value-text mb-2 animate-value fade-in">
                <span className="text-base opacity-70">$</span>{calculationResult.marginRequired.toFixed(2)}
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8] label-text font-semibold">
                    {((calculationResult.marginRequired / settings.mt5Balance) * 100).toFixed(1)}<span className="text-[10px] opacity-70">%</span>
                  </span>
                </div>
                <div className="w-full bg-gray-900/50 rounded-full h-1.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 animate-gauge ${
                      (calculationResult.marginRequired / settings.mt5Balance) * 100 > 70 
                        ? 'bg-red-500' 
                        : (calculationResult.marginRequired / settings.mt5Balance) * 100 > 50 
                        ? 'bg-amber-500' 
                        : 'bg-[#2962FF]'
                    }`}
                    style={{ 
                      width: `${Math.min((calculationResult.marginRequired / settings.mt5Balance) * 100, 100)}%`,
                      boxShadow: (calculationResult.marginRequired / settings.mt5Balance) * 100 > 70
                        ? '0 0 10px rgba(239, 68, 68, 0.6)'
                        : (calculationResult.marginRequired / settings.mt5Balance) * 100 > 50
                        ? '0 0 10px rgba(245, 158, 11, 0.5)'
                        : '0 0 10px rgba(41, 98, 255, 0.6)'
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Risk Amount */}
            <div className="rounded-lg p-3 border border-[rgba(255,255,255,0.05)] bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.02),transparent),#161A1E] backdrop-blur-sm">
              <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mb-2 label-text">Risk Amount</p>
              <p className="text-xl font-semibold text-white mono-numbers value-text mb-2 animate-value fade-in">
                <span className="text-base opacity-70">$</span>{calculationResult.riskAmount.toFixed(2)}
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8] label-text font-semibold">
                    {calculationResult.riskPercentage.toFixed(2)}<span className="text-[10px] opacity-70">%</span>
                  </span>
                </div>
                <div className="w-full bg-gray-900/50 rounded-full h-1.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 animate-gauge ${
                      calculationResult.riskPercentage > 70 
                        ? 'bg-red-500' 
                        : calculationResult.riskPercentage > 50 
                        ? 'bg-amber-500' 
                        : 'bg-[#10B981]'
                    }`}
                    style={{ 
                      width: `${Math.min(calculationResult.riskPercentage, 100)}%`,
                      boxShadow: calculationResult.riskPercentage > 70
                        ? '0 0 10px rgba(239, 68, 68, 0.6)'
                        : calculationResult.riskPercentage > 50
                        ? '0 0 10px rgba(245, 158, 11, 0.5)'
                        : '0 0 10px rgba(16, 185, 129, 0.6)'
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Drawdown Buffer */}
            <div className={`rounded-lg p-3 border transition-all duration-300 backdrop-blur-sm overflow-hidden ${
              calculationResult.drawdownBufferPercentage < 20 
                ? 'bg-red-500/20 border-red-500/50 animate-pulse critical-glow' 
                : calculationResult.drawdownBufferPercentage < 50 
                ? 'bg-amber-500/15 border-amber-500/30 warning-glow' 
                : 'border-[rgba(255,255,255,0.05)] bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.02),transparent),#161A1E]'
            }`}>
              <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mb-2 label-text">Drawdown Buffer</p>
              <p className={`text-xl font-semibold mono-numbers value-text mb-2 animate-value fade-in ${
                calculationResult.drawdownBufferPercentage < 20 
                  ? 'text-red-400' 
                  : calculationResult.drawdownBufferPercentage < 50 
                  ? 'text-amber-400' 
                  : 'text-[#10B981]'
              }`}>
                <span className="text-base opacity-70">$</span>{calculationResult.drawdownBuffer.toFixed(2)}
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8] label-text font-semibold">
                    {calculationResult.drawdownBufferPercentage.toFixed(0)}<span className="text-[10px] opacity-70">%</span>
                  </span>
                  {calculationResult.drawdownBuffer < 0 && (
                    <span className="text-red-400 font-medium uppercase text-[10px] tracking-wider">Over-allocated</span>
                  )}
                </div>
                <div className="w-full bg-gray-900/50 rounded-full h-1.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 animate-gauge ${
                      calculationResult.drawdownBufferPercentage < 20 
                        ? 'bg-red-500' 
                        : calculationResult.drawdownBufferPercentage < 50 
                        ? 'bg-amber-500' 
                        : 'bg-[#10B981]'
                    }`}
                    style={{ 
                      width: `${Math.min(calculationResult.drawdownBufferPercentage, 100)}%`,
                      boxShadow: calculationResult.drawdownBufferPercentage < 20
                        ? '0 0 10px rgba(239, 68, 68, 0.6)'
                        : calculationResult.drawdownBufferPercentage < 50
                        ? '0 0 10px rgba(245, 158, 11, 0.5)'
                        : '0 0 10px rgba(16, 185, 129, 0.6)'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Show Math only mode
  if (displayMode === 'show-math-only') {
    return (
      <>
        {calculationResult && stopLoss > 0 && inputErrors.length === 0 && (
          <ShowMath
            calculationResult={calculationResult}
            allocatedCapital={settings.mt5Balance}
            stopLoss={stopLoss}
            symbol={selectedSymbol}
          />
        )}
      </>
    );
  }

  // Full mode (default, for backwards compatibility)
  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Trade Calculator
      </h2>

      <div className="space-y-6">
        {/* Symbol Selector */}
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-300 mb-2">
            Symbol
          </label>
          <select
            id="symbol"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value as SymbolName)}
            className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-lg text-lg text-white transition-all"
          >
            {symbolNames.map((name) => (
              <option key={name} value={name} className="bg-gray-900 text-white">
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Entry Price Input */}
        <div>
          <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-300 mb-2">
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
            className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-lg text-xl text-white mono-numbers transition-all"
          />
          <p className="text-xs text-gray-400 mt-1">
            Current market price or your planned entry
          </p>
        </div>

        {/* Stop Loss Price Input */}
        <div>
          <label htmlFor="slPrice" className="block text-sm font-medium text-gray-300 mb-2">
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
            className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-lg text-xl text-white mono-numbers transition-all"
          />
          <p className="text-xs text-gray-400 mt-1">
            Your stop loss price from signal
          </p>
        </div>

        {/* Auto-Calculated SL Points Display */}
        {stopLoss > 0 && (
          <div className="glass-card rounded-lg p-3 border border-[#2962FF]/30">
            <p className="text-sm text-[#2962FF]">
              <span className="font-semibold">Stop Loss:</span> <span className="mono-numbers">{stopLoss.toFixed(2)}</span> points
            </p>
          </div>
        )}

        {/* Input Errors */}
        {inputErrors.length > 0 && (
          <div className="glass-card rounded-lg p-3 border border-red-500/30">
            {inputErrors.map((error, index) => (
              <p key={index} className="text-sm text-red-400">
                • {error}
              </p>
            ))}
          </div>
        )}

        {/* Calculation Results */}
        {calculationResult && stopLoss > 0 && inputErrors.length === 0 && (
          <div className="border-t border-gray-700/30 pt-6 space-y-4">
            {/* Primary Output - STACKING INFO */}
            <div className="elevated-card rounded-xl p-6 border border-[#2962FF]/20 glow-blue">
              <p className="text-sm text-[#2962FF] mb-2 font-medium label-text">Stacking Strategy</p>
              <div className="flex items-baseline justify-center gap-3 mb-4">
                <p className="text-6xl font-bold text-white mono-numbers value-text">
                  {calculationResult.stackingInfo.positionsToStack || 0}
                </p>
                <p className="text-2xl font-medium text-gray-300 label-text">positions</p>
              </div>
              <div className="bg-[#2962FF]/10 rounded-lg p-4 space-y-2 backdrop-blur-sm border border-[#2962FF]/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300 label-text">Each position:</span>
                  <span className="text-lg font-semibold text-white mono-numbers value-text">{calculationResult.stackingInfo.minLotSize} lots</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300 label-text">Margin per position:</span>
                  <span className="text-lg font-semibold text-white mono-numbers value-text">${calculationResult.stackingInfo.marginPerPosition.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-2 mt-2">
                  <span className="text-sm text-gray-300 label-text">Total margin used:</span>
                  <span className="text-lg font-semibold text-white mono-numbers value-text">
                    ${(calculationResult.stackingInfo.positionsToStack * calculationResult.stackingInfo.marginPerPosition).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300 label-text">Total stacked lots:</span>
                  <span className="text-lg font-semibold text-white mono-numbers value-text">{calculationResult.stackingInfo.totalStackedLots} lots</span>
                </div>
              </div>
              <p className="text-xs text-center mt-4 text-gray-400 label-text">
                Open {calculationResult.stackingInfo.positionsToStack} positions at {calculationResult.stackingInfo.minLotSize} lots each on your confirmation candle
              </p>
            </div>

            {/* Secondary Information with Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="elevated-card rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-2 label-text">Margin Required</p>
                <p className="text-2xl font-semibold text-white mono-numbers value-text mb-2">
                  ${calculationResult.marginRequired.toFixed(2)}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 label-text">
                      {((calculationResult.marginRequired / settings.mt5Balance) * 100).toFixed(1)}% of MT5 balance
                    </span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 animate-gauge ${
                        (calculationResult.marginRequired / settings.mt5Balance) * 100 > 70 
                          ? 'bg-red-500 glow-red' 
                          : (calculationResult.marginRequired / settings.mt5Balance) * 100 > 50 
                          ? 'bg-amber-500' 
                          : 'bg-[#2962FF] glow-blue'
                      }`}
                      style={{ width: `${Math.min((calculationResult.marginRequired / settings.mt5Balance) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="elevated-card rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-2 label-text">Risk Amount</p>
                <p className="text-2xl font-semibold text-white mono-numbers value-text mb-2">
                  ${calculationResult.riskAmount.toFixed(2)}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 label-text">
                      {calculationResult.riskPercentage.toFixed(2)}% of balance
                    </span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 animate-gauge ${
                        calculationResult.riskPercentage > 70 
                          ? 'bg-red-500 glow-red' 
                          : calculationResult.riskPercentage > 50 
                          ? 'bg-amber-500' 
                          : 'bg-[#10B981] glow-green'
                      }`}
                      style={{ width: `${Math.min(calculationResult.riskPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tertiary Information - Buffer with Radial Gauge */}
            <div className="elevated-card rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-2 label-text">Drawdown Buffer</p>
                  <p className="text-2xl font-semibold text-white mono-numbers value-text">
                    ${calculationResult.drawdownBuffer.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 label-text">remaining buffer</p>
                </div>
                <div className="relative w-24 h-24">
                  <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-800/50"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - calculationResult.drawdownBufferPercentage / 100)}`}
                      className={`animate-gauge ${
                        calculationResult.drawdownBufferPercentage < 30 
                          ? 'text-red-500' 
                          : calculationResult.drawdownBufferPercentage < 50 
                          ? 'text-amber-500' 
                          : 'text-[#10B981]'
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-white mono-numbers value-text">
                      {calculationResult.drawdownBufferPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Messages */}
            {calculationResult.warning !== 'none' && (
              <div className={`glass-card rounded-lg border-2 p-4 ${
                calculationResult.warning === 'critical' 
                  ? 'border-red-500/50 bg-red-500/10' 
                  : calculationResult.warning === 'high' 
                  ? 'border-orange-500/50 bg-orange-500/10' 
                  : 'border-amber-500/50 bg-amber-500/10'
              }`}>
                <p className={`font-medium text-sm ${
                  calculationResult.warning === 'critical' 
                    ? 'text-red-400' 
                    : calculationResult.warning === 'high' 
                    ? 'text-orange-400' 
                    : 'text-amber-400'
                }`}>
                  {calculationResult.warningMessage}
                </p>
              </div>
            )}

            {calculationResult.warning === 'none' && (
              <div className="glass-card border-2 border-[#10B981]/50 bg-[#10B981]/10 rounded-lg p-4">
                <p className="font-medium text-sm text-[#10B981]">
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
          <div className="border-t border-gray-700/30 pt-6 text-center text-gray-400">
            <svg
              className="mx-auto h-12 w-12 text-gray-600 mb-3"
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
