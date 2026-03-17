'use client';

import { useCalculator } from '@/lib/store';
import { getDerivSpec } from '@/lib/deriv-specs';
import { getSymbol } from '@/lib/symbols';

export default function TradePnLPreview() {
  const { calculationResult, stopLoss, selectedSymbol, entryPrice, tpPrice } = useCalculator();

  if (!calculationResult || stopLoss <= 0) return null;

  const derivSpec = getDerivSpec(selectedSymbol);
  const symbolData = getSymbol(selectedSymbol);
  const pointValue = derivSpec ? derivSpec.pointValue : symbolData.pointValue;

  const { minLotSize, positionsToStack } = calculationResult.stackingInfo;

  const tpPoints =
    tpPrice && entryPrice && tpPrice > 0 && entryPrice > 0
      ? Math.abs(tpPrice - entryPrice)
      : null;

  const rrRatio = tpPoints ? tpPoints / stopLoss : null;

  const riskPerPosition = minLotSize * stopLoss * pointValue;
  const totalRisk = riskPerPosition * positionsToStack;

  const profitPerPosition = tpPoints ? minLotSize * tpPoints * pointValue : null;
  const totalProfit = profitPerPosition ? profitPerPosition * positionsToStack : null;

  return (
    <div className="rounded-xl p-4 sm:p-6 border border-[rgba(255,255,255,0.05)] bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.02),transparent),#161A1E] backdrop-blur-xl">
      <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 label-text">
        Trade P&L Preview
      </h3>
      <p className="text-[10px] text-gray-500 mb-4">
        Exact dollar outcome if SL or TP is hit &bull; {positionsToStack} stacked {positionsToStack === 1 ? 'position' : 'positions'}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* SL Hit — Loss Side */}
        <div className="rounded-lg p-3 border border-red-500/20 bg-red-500/5">
          <p className="text-[10px] uppercase tracking-widest text-red-400 font-semibold mb-3">
            If SL Hit ✗
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">SL Distance</span>
              <span className="text-xs text-white font-mono">{stopLoss.toFixed(2)} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Per Position</span>
              <span className="text-sm font-semibold text-red-400 font-mono">
                -${riskPerPosition.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-1.5">
              <span className="text-xs text-gray-400">All {positionsToStack}</span>
              <span className="text-base font-bold text-red-400 font-mono">
                -${totalRisk.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* TP Hit — Profit Side */}
        <div className={`rounded-lg p-3 border ${
          tpPoints
            ? 'border-emerald-500/20 bg-emerald-500/5'
            : 'border-white/5 bg-white/[0.02]'
        }`}>
          <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold mb-3">
            If TP Hit ✓
          </p>
          {tpPoints && profitPerPosition && totalProfit ? (
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">TP Distance</span>
                <span className="text-xs text-white font-mono">{tpPoints.toFixed(2)} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Per Position</span>
                <span className="text-sm font-semibold text-emerald-400 font-mono">
                  +${profitPerPosition.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-1.5">
                <span className="text-xs text-gray-400">All {positionsToStack}</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  +${totalProfit.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-2">Enter TP price to see potential profit</p>
          )}
        </div>
      </div>

      {/* R:R Badge */}
      {rrRatio && (
        <div className="mt-3 flex items-center justify-between rounded-lg p-3 border border-blue-500/20 bg-blue-500/5">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Risk : Reward
          </span>
          <span className={`text-lg font-bold font-mono ${
            rrRatio >= 3
              ? 'text-emerald-400'
              : rrRatio >= 1.5
              ? 'text-amber-400'
              : 'text-red-400'
          }`}>
            1 : {rrRatio.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
