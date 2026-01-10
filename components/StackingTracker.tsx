/**
 * StackingTracker Component
 * Based on PRD Section 7.4 and Section 8 - Stacking Rules
 */

'use client';

import { useState } from 'react';
import { usePositions, useSettings, useStackingAnalysis } from '@/lib/store';
import { getSymbol } from '@/lib/symbols';
import { calculateMargin } from '@/lib/calculator';
import { SymbolName } from '@/types';

export default function StackingTracker() {
  const { openPositions, addPosition, removePosition, clearPositions } = usePositions();
  const { settings } = useSettings();
  const stackingAnalysis = useStackingAnalysis();
  
  const [isAddingPosition, setIsAddingPosition] = useState(false);
  const [newPosition, setNewPosition] = useState({
    symbol: 'Volatility 75' as SymbolName,
    lotSize: 0.01,
    stopLoss: 50
  });

  const handleAddPosition = () => {
    const margin = calculateMargin(newPosition.lotSize, newPosition.symbol);
    
    addPosition({
      symbol: newPosition.symbol,
      lotSize: newPosition.lotSize,
      stopLoss: newPosition.stopLoss,
      marginUsed: margin
    });
    
    setIsAddingPosition(false);
    setNewPosition({ symbol: 'Volatility 75', lotSize: 0.01, stopLoss: 50 });
  };

  const getWarningColorClass = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'moderate':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const getWarningMessage = () => {
    if (stackingAnalysis.warningLevel === 'critical') {
      return '⚠️ CRITICAL: High margin usage - new positions may cause liquidation';
    }
    if (stackingAnalysis.warningLevel === 'high') {
      return '⚠️ High margin usage - consider exit plan';
    }
    if (stackingAnalysis.warningLevel === 'moderate') {
      return '⚠️ Moderate stacking risk - monitor closely';
    }
    return '✓ Safe margin levels';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Open Positions
        </h2>
        <div className="flex gap-2">
          {openPositions.length > 0 && (
            <button
              onClick={clearPositions}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsAddingPosition(!isAddingPosition)}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {isAddingPosition ? 'Cancel' : '+ Add Position'}
          </button>
        </div>
      </div>

      {/* Add Position Form */}
      {isAddingPosition && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Add Open Position</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Symbol</label>
              <select
                value={newPosition.symbol}
                onChange={(e) => setNewPosition({ ...newPosition, symbol: e.target.value as SymbolName })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                {['Volatility 10', 'Volatility 25', 'Volatility 50', 'Volatility 75', 'Volatility 100', 'Step Index', 'Step Dex'].map((symbol) => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Lot Size</label>
              <input
                type="number"
                value={newPosition.lotSize}
                onChange={(e) => setNewPosition({ ...newPosition, lotSize: parseFloat(e.target.value) || 0.01 })}
                min="0.01"
                max="100"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">SL (Points)</label>
              <input
                type="number"
                value={newPosition.stopLoss}
                onChange={(e) => setNewPosition({ ...newPosition, stopLoss: parseInt(e.target.value) || 50 })}
                min="1"
                max="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          
          <button
            onClick={handleAddPosition}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg"
          >
            Add Position
          </button>
        </div>
      )}

      {/* Positions List */}
      {openPositions.length > 0 ? (
        <div className="space-y-3 mb-6">
          {openPositions.map((position) => (
            <div
              key={position.id}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-4"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{position.symbol}</p>
                <div className="flex gap-4 text-xs text-gray-600 mt-1">
                  <span>Lot: {position.lotSize.toFixed(2)}</span>
                  <span>SL: {position.stopLoss} pts</span>
                  <span>Margin: ${position.marginUsed.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => removePosition(position.id)}
                className="text-red-600 hover:text-red-700 ml-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-sm">No open positions tracked</p>
          <p className="text-xs mt-1">Add positions to monitor your stacking risk</p>
        </div>
      )}

      {/* Stacking Analysis */}
      {openPositions.length > 0 && (
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Stacking Analysis</h3>
          
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Margin Usage</span>
              <span className="font-medium">{stackingAnalysis.totalMarginPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${getWarningColorClass(stackingAnalysis.warningLevel)}`}
                style={{ width: `${Math.min(stackingAnalysis.totalMarginPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>70% (High Risk)</span>
              <span>100%</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Total Margin Used</p>
              <p className="text-lg font-semibold text-gray-900">
                ${stackingAnalysis.totalMarginUsed.toFixed(2)}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Remaining Buffer</p>
              <p className="text-lg font-semibold text-gray-900">
                ${stackingAnalysis.remainingBuffer.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Warning Message */}
          <div className={`rounded-lg border-2 p-4 ${
            stackingAnalysis.warningLevel === 'critical' ? 'bg-red-50 border-red-300' :
            stackingAnalysis.warningLevel === 'high' ? 'bg-orange-50 border-orange-300' :
            stackingAnalysis.warningLevel === 'moderate' ? 'bg-yellow-50 border-yellow-300' :
            'bg-green-50 border-green-300'
          }`}>
            <p className={`text-sm font-medium ${
              stackingAnalysis.warningLevel === 'critical' ? 'text-red-800' :
              stackingAnalysis.warningLevel === 'high' ? 'text-orange-800' :
              stackingAnalysis.warningLevel === 'moderate' ? 'text-yellow-800' :
              'text-green-800'
            }`}>
              {getWarningMessage()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
