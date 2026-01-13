'use client';

import { useSettings, usePositions } from '@/lib/store';
import { useDerivAPI } from '@/lib/hooks/useDerivAPI';
import AccountSetup from '@/components/AccountSetup';
import TradeCalculator from '@/components/TradeCalculator';
import StackingTracker from '@/components/StackingTracker';
import Disclaimer from '@/components/Disclaimer';
import DerivConnection from '@/components/DerivConnection';

export default function Home() {
  const { settings } = useSettings();
  const { openPositions } = usePositions();
  const { account, isAuthorized, useDemo } = useDerivAPI();
  
  console.log('🏠 Home page state:', { 
    isAuthorized, 
    useDemo, 
    accountBalance: account?.balance, 
    settingsBalance: settings.mt5Balance 
  });
  
  // Use live balance from Deriv if authorized, otherwise use settings balance
  const displayBalance = isAuthorized && account?.balance ? account.balance : settings.mt5Balance;
  
  const totalMarginUsed = openPositions.reduce((sum, pos) => sum + pos.marginUsed, 0);
  const marginPercent = (totalMarginUsed / displayBalance) * 100;
  const drawdownBuffer = displayBalance - totalMarginUsed;
  const bufferPercent = (drawdownBuffer / displayBalance) * 100;
  
  return (
    <div className="min-h-screen bg-[#0B0E11]">
      {/* Sticky Global Status Bar - Highest Z-layer */}
      <div className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-md bg-[#0B0E11]/95 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-sm">
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 block mb-0.5 sm:mb-1 font-semibold label-text">MT5 Balance</span>
              <p className="text-white font-mono font-bold text-sm sm:text-lg mono-numbers value-text fade-in">${displayBalance.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 block mb-0.5 sm:mb-1 font-semibold label-text">Margin Used</span>
              <p className={`font-mono font-semibold text-sm sm:text-lg mono-numbers value-text transition-colors duration-300 fade-in ${
                marginPercent > 70 ? 'text-red-400' : 
                marginPercent > 50 ? 'text-amber-400' : 
                marginPercent < 10 ? 'text-emerald-400' :
                'text-emerald-300'
              }`}>
                ${totalMarginUsed.toFixed(2)} <span className="text-xs sm:text-sm opacity-70">({marginPercent.toFixed(1)}%)</span>
              </p>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 block mb-0.5 sm:mb-1 font-semibold label-text">Buffer</span>
              <p className={`font-mono font-semibold text-sm sm:text-lg mono-numbers value-text transition-colors duration-300 fade-in ${
                bufferPercent < 30 ? 'text-red-400' : 
                bufferPercent < 50 ? 'text-amber-400' : 
                bufferPercent > 90 ? 'text-emerald-400' :
                'text-emerald-300'
              }`}>
                ${drawdownBuffer.toFixed(2)} <span className="text-xs sm:text-sm opacity-70">({bufferPercent.toFixed(1)}%)</span>
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 col-span-2 lg:col-span-1">
              {isAuthorized ? (
                <>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${
                    useDemo ? 'bg-amber-500' : 'bg-green-500'
                  }`} style={{
                    filter: useDemo ? 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.8))' : 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.8))'
                  }}></span>
                  <span className={`text-xs font-medium label-text ${
                    useDemo ? 'text-amber-400' : 'text-green-400'
                  }`}>
                    {useDemo ? 'DEMO' : 'LIVE'}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                  <span className="text-gray-400 text-xs font-medium label-text">OFFLINE</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Signal Risk Engine
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Precision MT5 Position Sizing • Deriv Synthetic Indices
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#2962FF]/10 text-[#2962FF] border border-[#2962FF]/20">
                v1.0 MVP
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Pro-Trader Layout: Input Zone (Left) + Intel Zone (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
            {/* LEFT COLUMN: INPUT ZONE (33%) - STICKY with Z-axis depth */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-6 lg:self-start lg:sticky lg:top-24 lg:z-10 lg:shadow-[10px_0_30px_-15px_rgba(0,0,0,0.5)]">
              {/* Deriv API Connection */}
              <DerivConnection />
              
              {/* Trade Calculator - Inputs Only */}
              <div>
                <TradeCalculator displayMode="inputs-only" />
              </div>
              
              {/* Account Settings - Condensed */}
              <AccountSetup />

              {/* Disclaimer - Sidebar bottom with reduced opacity */}
              <div className="glass-card rounded-lg p-3 border-l-4 border-amber-600/50 bg-amber-950/20 opacity-40 hover:opacity-100 transition-opacity">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-amber-400 text-xs label-text">Educational Tool</p>
                    <p className="text-xs text-amber-200/70 leading-relaxed mt-0.5">
                      For educational purposes only. You are solely responsible for your trading decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INTEL ZONE (67%) - 4:8 Golden Ratio */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-6 lg:z-0">
              {/* Trade Analysis - Bento Grid (Strategy + Metrics Side-by-Side) */}
              {/* Note: Risk metric card edges align with Open Positions table columns below for architectural consistency */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left: Stacking Strategy */}
                <div className="rounded-xl p-4 sm:p-6 border border-[rgba(255,255,255,0.05)] bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.02),transparent),#161A1E] backdrop-blur-xl">
                  <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 label-text">Stacking Strategy</h3>
                  <p className="text-[10px] text-gray-500 mb-3 sm:mb-4">Multiple small positions to reach target margin</p>
                  <TradeCalculator displayMode="stacking-result-only" />
                </div>
                
                {/* Right: Risk Metrics */}
                <div className="rounded-xl p-4 sm:p-6 border border-[rgba(255,255,255,0.05)] bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.02),transparent),#161A1E] backdrop-blur-xl">
                  <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 label-text">Risk Analysis</h3>
                  <p className="text-[10px] text-gray-500 mb-3 sm:mb-4">Your current open positions</p>
                  <TradeCalculator displayMode="gauges-only" />
                </div>
              </div>

              {/* Show Math - How We Calculate */}
              <TradeCalculator displayMode="show-math-only" />
              
              {/* Open Positions */}
              <StackingTracker />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-400 text-center md:text-left">
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
