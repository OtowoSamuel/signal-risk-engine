'use client';

import { useSettings, usePositions } from '@/lib/store';
import AccountSetup from '@/components/AccountSetup';
import TradeCalculator from '@/components/TradeCalculator';
import StackingTracker from '@/components/StackingTracker';
import Disclaimer from '@/components/Disclaimer';

export default function Home() {
  const { settings } = useSettings();
  const { openPositions } = usePositions();
  
  const totalMarginUsed = openPositions.reduce((sum, pos) => sum + pos.marginUsed, 0);
  const marginPercent = (totalMarginUsed / settings.mt5Balance) * 100;
  const drawdownBuffer = settings.mt5Balance - totalMarginUsed;
  const bufferPercent = (drawdownBuffer / settings.mt5Balance) * 100;
  
  return (
    <div className="min-h-screen bg-[#0B0E11]">
      {/* Sticky Global Status Bar */}
      <div className="sticky top-0 z-50 border-b border-gray-800/50 backdrop-blur-md bg-[#0B0E11]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400 text-xs block mb-1 label-text">MT5 Balance</span>
              <p className="text-white font-mono font-semibold text-base mono-numbers value-text">${settings.mt5Balance.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs block mb-1 label-text">Margin Used</span>
              <p className={`font-mono font-semibold text-base mono-numbers value-text transition-colors duration-300 ${
                marginPercent > 70 ? 'text-red-400' : 
                marginPercent > 50 ? 'text-amber-400' : 
                marginPercent < 10 ? 'text-emerald-400' :
                'text-emerald-300'
              }`}>
                ${totalMarginUsed.toFixed(2)} ({marginPercent.toFixed(1)}%)
              </p>
            </div>
            <div>
              <span className="text-gray-400 text-xs block mb-1 label-text">Buffer</span>
              <p className={`font-mono font-semibold text-base mono-numbers value-text transition-colors duration-300 ${
                bufferPercent < 30 ? 'text-red-400' : 
                bufferPercent < 50 ? 'text-amber-400' : 
                bufferPercent > 90 ? 'text-emerald-400' :
                'text-emerald-300'
              }`}>
                ${drawdownBuffer.toFixed(2)} ({bufferPercent.toFixed(1)}%)
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 col-span-2 lg:col-span-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-400 text-xs font-medium label-text">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Signal Risk Engine
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Precision MT5 Position Sizing • Deriv Synthetic Indices
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#2962FF]/10 text-[#2962FF] border border-[#2962FF]/20">
                v1.0 MVP
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Disclaimer */}
          <Disclaimer />

          {/* Pro-Trader Layout: Input Zone (Left) + Intel Zone (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: INPUT ZONE (30%) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Account Settings - Condensed */}
              <AccountSetup />
              
              {/* Trade Calculator - Inputs Only */}
              <div className="space-y-4">
                <TradeCalculator displayMode="inputs-only" />
              </div>
            </div>

            {/* RIGHT COLUMN: INTEL ZONE (70%) */}
            <div className="lg:col-span-9 space-y-4">
              {/* Row 1: Stacking Strategy Card */}
              <TradeCalculator displayMode="stacking-result-only" />
              
              {/* Row 2: Risk Gauges (Margin, Risk, Buffer) */}
              <TradeCalculator displayMode="gauges-only" />
              
              {/* Row 3: Open Positions */}
              <StackingTracker />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400 text-center md:text-left">
              <p>© 2026 Signal Risk Engine • Educational Tool Only</p>
              <p className="text-xs text-gray-500 mt-1">
                Not affiliated with Deriv • Use at your own risk
              </p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
