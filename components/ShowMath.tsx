/**
 * ShowMath Component
 * Based on PRD Section 13.4 - Show Math toggle for transparency
 */

'use client';

import { useState } from 'react';
import { CalculationResult, SymbolName } from '@/types';
import { getSymbol } from '@/lib/symbols';

interface ShowMathProps {
  calculationResult: CalculationResult;
  allocatedCapital: number;
  stopLoss: number;
  symbol: SymbolName;
}

export default function ShowMath({
  calculationResult,
  allocatedCapital,
  stopLoss,
  symbol
}: ShowMathProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const symbolData = getSymbol(symbol);

  if (!calculationResult) return null;

  const marginUsagePercentage = (calculationResult.marginRequired / allocatedCapital) * 100;

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Show Math - How We Calculate
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 text-sm bg-gray-50 rounded-lg p-4">
          {/* Formula Overview */}
          <div>
            <p className="font-medium text-gray-900 mb-2">Step 1: Calculate Maximum Safe Lot Size</p>
            <div className="bg-white rounded border border-gray-200 p-3 font-mono text-xs">
              <p className="text-gray-600 mb-2">Formula:</p>
              <p className="text-blue-600">
                Max Lot Size = (Allocated Capital × 0.35) / (SL Points × Point Value)
              </p>
              <div className="mt-3 space-y-1 text-gray-700">
                <p>= (${allocatedCapital} × 0.35) / ({stopLoss} points × ${symbolData.pointValue})</p>
                <p>= ${(allocatedCapital * 0.35).toFixed(2)} / ${(stopLoss * symbolData.pointValue).toFixed(2)}</p>
                <p className="font-bold text-blue-600">
                  = {calculationResult.recommendedLotSize.toFixed(2)} lots
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              * 0.35 (35%) = Margin usage cap to preserve 65% buffer
            </p>
          </div>

          {/* Margin Calculation */}
          <div>
            <p className="font-medium text-gray-900 mb-2">Step 2: Calculate Margin Required</p>
            <div className="bg-white rounded border border-gray-200 p-3 font-mono text-xs">
              <p className="text-gray-600 mb-2">Formula:</p>
              <p className="text-blue-600">
                Margin = (Lot Size × Contract Size × Price) / Leverage
              </p>
              <div className="mt-3 space-y-1 text-gray-700">
                <p>= ({calculationResult.recommendedLotSize.toFixed(2)} × 100,000 × $1,000) / {symbolData.leverage}</p>
                <p className="font-bold text-blue-600">
                  = ${calculationResult.marginRequired.toFixed(2)}
                </p>
                <p className="text-gray-600 mt-2">
                  Margin usage: {marginUsagePercentage.toFixed(1)}% of allocated capital
                </p>
              </div>
            </div>
          </div>

          {/* Risk Calculation */}
          <div>
            <p className="font-medium text-gray-900 mb-2">Step 3: Calculate Risk Amount</p>
            <div className="bg-white rounded border border-gray-200 p-3 font-mono text-xs">
              <p className="text-gray-600 mb-2">Formula:</p>
              <p className="text-blue-600">
                Risk = Lot Size × SL Points × Point Value
              </p>
              <div className="mt-3 space-y-1 text-gray-700">
                <p>= {calculationResult.recommendedLotSize.toFixed(2)} × {stopLoss} × ${symbolData.pointValue}</p>
                <p className="font-bold text-blue-600">
                  = ${calculationResult.riskAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Buffer Calculation */}
          <div>
            <p className="font-medium text-gray-900 mb-2">Step 4: Calculate Drawdown Buffer</p>
            <div className="bg-white rounded border border-gray-200 p-3 font-mono text-xs">
              <p className="text-gray-600 mb-2">Formula:</p>
              <p className="text-blue-600">
                Buffer = Allocated Capital - Margin Required
              </p>
              <div className="mt-3 space-y-1 text-gray-700">
                <p>= ${allocatedCapital} - ${calculationResult.marginRequired.toFixed(2)}</p>
                <p className="font-bold text-blue-600">
                  = ${calculationResult.drawdownBuffer.toFixed(2)} ({calculationResult.drawdownBufferPercentage.toFixed(1)}%)
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              This buffer protects you from margin calls during normal volatility
            </p>
          </div>

          {/* Why This Matters */}
          <div className="border-t border-gray-200 pt-3">
            <p className="font-medium text-gray-900 mb-2">Why These Numbers Matter:</p>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>
                  <strong>35% Margin Cap:</strong> Ensures you never over-leverage. Keeps 65% of your allocated capital free.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>
                  <strong>Drawdown Buffer:</strong> Protects against margin calls. On Deriv MT5, margin calls happen at 50% equity. 
                  Your buffer keeps you safe.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>
                  <strong>Allocated Capital:</strong> You're not risking your entire ${allocatedCapital}, just the margin portion. 
                  The rest is your safety net.
                </span>
              </li>
            </ul>
          </div>

          {/* MT5 Constraints */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="font-medium text-blue-900 text-xs mb-1">MT5 Constraints Applied:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>✓ Minimum lot: {symbolData.minLot} (enforced)</li>
              <li>✓ Lot step: {symbolData.lotStep} (rounded)</li>
              <li>✓ Leverage: 1:{symbolData.leverage} (accounted)</li>
              <li>✓ Point value: ${symbolData.pointValue} per lot</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
