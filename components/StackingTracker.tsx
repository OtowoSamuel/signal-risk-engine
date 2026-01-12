/**
 * StackingTracker Component
 * Based on PRD Section 7.4 and Section 8 - Stacking Rules
 */

'use client';

import { useState } from 'react';
import { usePositions, useSettings, useStackingAnalysis } from '@/lib/store';
import { getSymbol, getSymbolNames } from '@/lib/symbols';
import { calculateMargin } from '@/lib/calculator';
import { SymbolName } from '@/types';
import { useDerivAPI } from '@/lib/hooks/useDerivAPI';

export default function StackingTracker() {
  const { openPositions, addPosition, removePosition, clearPositions } = usePositions();
  const { settings } = useSettings();
  const stackingAnalysis = useStackingAnalysis();
  const { isAuthorized, getOpenPositions } = useDerivAPI();
  
  const symbolNames = getSymbolNames();
  
  const [isAddingPosition, setIsAddingPosition] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [newPosition, setNewPosition] = useState({
    symbol: 'Volatility 75 (1s) Index' as SymbolName,
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
    setNewPosition({ symbol: 'Volatility 75 (1s) Index', lotSize: 0.01, stopLoss: 50 });
  };

  const handleSyncPositions = async () => {
    setIsSyncing(true);
    try {
      const positions = await getOpenPositions();
      
      // Clear existing positions
      clearPositions();
      
      // Add positions from Deriv
      positions.forEach(pos => {
        // Try to match Deriv symbol to our symbol names
        const symbol = symbolNames.find(s => s.includes(pos.symbol)) || 'Volatility 75 (1s) Index' as SymbolName;
        
        addPosition({
          symbol,
          lotSize: 0.01, // Default, Deriv portfolio doesn't always show lot size directly
          stopLoss: 50, // Default
          marginUsed: pos.buy_price
        });
      });
    } catch (error) {
      console.error('Failed to sync positions:', error);
    } finally {
      setIsSyncing(false);
    }
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
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Open Positions
        </h2>
        <div className="flex gap-2">
          {isAuthorized && (
            <button
              onClick={handleSyncPositions}
              disabled={isSyncing}
              className="text-sm text-green-400 hover:text-green-300 transition-colors px-3 py-1 rounded-lg bg-green-900/20 border border-green-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSyncing ? 'Syncing...' : '↻ Sync from Deriv'}
            </button>
          )}
          {openPositions.length > 0 && (
            <button
              onClick={clearPositions}
              className="text-sm text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded-lg bg-red-900/20 border border-red-500/30 font-medium"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsAddingPosition(!isAddingPosition)}
            className="text-base bg-[#2962FF] hover:bg-[#2962FF]/90 text-white px-6 py-2.5 rounded-lg transition-all font-semibold shadow-lg shadow-[#2962FF]/30 hover:shadow-[#2962FF]/50 active:scale-95 active:shadow-[#2962FF]/40"
          >
            {isAddingPosition ? 'Cancel' : '+ Add Position'}
          </button>
        </div>
      </div>

      {/* Add Position Form */}
      {isAddingPosition && (
        <div className="mb-6 bg-gray-900/30 rounded-lg p-4 space-y-3 border border-gray-700/30">
          <h3 className="text-sm font-medium text-gray-300">Add Open Position</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Symbol</label>
              <select
                value={newPosition.symbol}
                onChange={(e) => setNewPosition({ ...newPosition, symbol: e.target.value as SymbolName })}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded text-sm text-white"
              >
                {symbolNames.map((symbol) => (
                  <option key={symbol} value={symbol} className="bg-gray-900 text-white">{symbol}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Lot Size</label>
              <input
                type="number"
                value={newPosition.lotSize}
                onChange={(e) => setNewPosition({ ...newPosition, lotSize: parseFloat(e.target.value) || 0.1 })}
                min="0.1"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded text-sm text-white font-mono"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">SL (Points)</label>
              <input
                type="number"
                value={newPosition.stopLoss}
                onChange={(e) => setNewPosition({ ...newPosition, stopLoss: parseInt(e.target.value) || 50 })}
                min="1"
                max="1000"
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded text-sm text-white font-mono"
              />
            </div>
          </div>
          
          <button
            onClick={handleAddPosition}
            className="w-full bg-[#2962FF] hover:bg-[#2962FF]/90 text-white text-sm font-medium py-2 rounded-lg transition-all active:scale-[0.98] shadow-md hover:shadow-[#2962FF]/30"
          >
            Add Position
          </button>
        </div>
      )}

      {/* Positions List */}
      {openPositions.length > 0 ? (
        <div className="space-y-2 mb-6">
          {openPositions.map((position) => (
            <div
              key={position.id}
              className="flex items-center justify-between elevated-card rounded-lg p-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-white label-text text-sm">{position.symbol}</p>
                <div className="flex gap-3 text-xs text-gray-400 mt-0.5 mono-numbers">
                  <span>Lot: {position.lotSize.toFixed(2)}</span>
                  <span>SL: {position.stopLoss} pts</span>
                  <span>Margin: ${position.marginUsed.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => removePosition(position.id)}
                className="text-red-600 hover:text-red-700 ml-4 transition-colors active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800/30 mb-4">
            <svg
              className="w-10 h-10 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
              />
            </svg>
          </div>
          <p className="text-base font-semibold text-white mb-2 label-text">No positions tracked yet</p>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-5 label-text leading-relaxed">
            Track your open positions to monitor cumulative margin usage and stacking risk in real-time.
          </p>
          <button
            onClick={() => setIsAddingPosition(true)}
            className="inline-flex items-center gap-2 bg-[#2962FF] hover:bg-[#2962FF]/90 text-white px-5 py-2.5 rounded-lg transition-all font-semibold text-sm shadow-lg shadow-[#2962FF]/30 hover:shadow-[#2962FF]/50 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Position
          </button>
        </div>
      )}

      {/* Stacking Analysis */}
      {openPositions.length > 0 && (
        <div className="border-t border-gray-700/30 pt-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Stacking Analysis</h3>
          
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Margin Usage</span>
              <span className="font-medium font-mono">{stackingAnalysis.totalMarginPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700/30 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  stackingAnalysis.warningLevel === 'critical' ? 'bg-red-500 glow-red' :
                  stackingAnalysis.warningLevel === 'high' ? 'bg-orange-500' :
                  stackingAnalysis.warningLevel === 'moderate' ? 'bg-amber-500' :
                  'bg-[#10B981] glow-green'
                }`}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="elevated-card rounded-lg p-3">
              <p className="text-xs text-gray-400 label-text mb-1">Total Margin Used</p>
              <p className="text-lg font-semibold text-white mono-numbers value-text">
                ${stackingAnalysis.totalMarginUsed.toFixed(2)}
              </p>
            </div>
            
            <div className="elevated-card rounded-lg p-3">
              <p className="text-xs text-gray-400 label-text mb-1">Remaining Buffer</p>
              <p className="text-lg font-semibold text-white mono-numbers value-text">
                ${stackingAnalysis.remainingBuffer.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Warning Message */}
          <div className={`glass-card rounded-lg border-2 p-4 ${
            stackingAnalysis.warningLevel === 'critical' ? 'border-red-500/50 bg-red-500/10' :
            stackingAnalysis.warningLevel === 'high' ? 'border-orange-500/50 bg-orange-500/10' :
            stackingAnalysis.warningLevel === 'moderate' ? 'border-amber-500/50 bg-amber-500/10' :
            'border-[#10B981]/50 bg-[#10B981]/10'
          }`}>
            <p className={`text-sm font-medium ${
              stackingAnalysis.warningLevel === 'critical' ? 'text-red-400' :
              stackingAnalysis.warningLevel === 'high' ? 'text-orange-400' :
              stackingAnalysis.warningLevel === 'moderate' ? 'text-amber-400' :
              'text-[#10B981]'
            }`}>
              {getWarningMessage()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
