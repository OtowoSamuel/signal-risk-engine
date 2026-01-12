/**
 * Instrument Specifications Display
 * Shows real Deriv MT5 index specifications for selected symbol
 */

'use client';

import { getDerivSpec } from '@/lib/deriv-specs';
import { SymbolName } from '@/types';

interface InstrumentSpecsProps {
  symbol: SymbolName;
}

export default function InstrumentSpecs({ symbol }: InstrumentSpecsProps) {
  const spec = getDerivSpec(symbol);

  if (!spec) {
    return (
      <div className="text-xs text-gray-500 italic">
        No specifications available for this symbol
      </div>
    );
  }

  return (
    <div className="rounded-lg p-3 border border-[rgba(255,255,255,0.05)] bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.02),transparent),#161A1E] backdrop-blur-sm">
      <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
        Instrument Specs
      </h4>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Lot Size Constraints */}
        <div>
          <span className="text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">Min Lot</span>
          <p className="text-white mono-numbers font-semibold fade-in">{spec.minLot}</p>
        </div>
        <div>
          <span className="text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">Max Lot</span>
          <p className="text-white mono-numbers font-semibold fade-in">{spec.maxLot}</p>
        </div>

        {/* Leverage & Margin */}
        <div>
          <span className="text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">Leverage</span>
          <p className="text-white mono-numbers font-semibold fade-in">1:{spec.maxLeverage}</p>
        </div>
        <div>
          <span className="text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">Margin Req</span>
          <p className="text-white mono-numbers font-semibold fade-in">{spec.marginPercent}<span className="text-[10px] opacity-70">%</span></p>
        </div>

        {/* Spread */}
        <div>
          <span className="text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">Min Spread</span>
          <p className="text-white mono-numbers font-semibold fade-in">{spec.minSpread} <span className="text-[10px] opacity-70">pts</span></p>
        </div>
        <div>
          <span className="text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">Point Value</span>
          <p className="text-white mono-numbers font-semibold fade-in"><span className="text-[10px] opacity-70">$</span>{spec.pointValue}</p>
        </div>

        {/* Swap Rates (if user holds overnight) */}
        {(spec.swapLong !== 0 || spec.swapShort !== 0) && (
          <>
            <div>
              <span className="text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">Swap Long</span>
              <p className={`mono-numbers font-semibold fade-in ${spec.swapLong < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {spec.swapLong} <span className="text-[10px] opacity-70">pts</span>
              </p>
            </div>
            <div>
              <span className="text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">Swap Short</span>
              <p className={`mono-numbers font-semibold fade-in ${spec.swapShort < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {spec.swapShort} <span className="text-[10px] opacity-70">pts</span>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Contract Details */}
      <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.05)]">
        <div className="text-[10px] text-gray-500">
          <span className="text-[#94A3B8] font-semibold uppercase tracking-wider">Trading:</span> {spec.tradingHours}
        </div>
      </div>
    </div>
  );
}
