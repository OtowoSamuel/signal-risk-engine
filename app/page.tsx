/**
 * Signal Risk Engine - Main Page
 * Based on PRD requirements
 */

'use client';

import AccountSetup from '@/components/AccountSetup';
import TradeCalculator from '@/components/TradeCalculator';
import StackingTracker from '@/components/StackingTracker';
import Disclaimer from '@/components/Disclaimer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Signal Risk Engine
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Precise MT5 lot sizing for Deriv synthetic indices
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Version 1.0 MVP</p>
              <p className="text-xs text-gray-500">Deriv MT5 Only</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Disclaimer */}
          <Disclaimer />

          {/* Account Setup */}
          <AccountSetup />

          {/* Two Column Layout - Calculator and Stacking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TradeCalculator />
            <StackingTracker />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 text-center md:text-left">
              <p>© 2026 Signal Risk Engine. Educational tool only.</p>
              <p className="text-xs text-gray-500 mt-1">
                Not affiliated with Deriv. Use at your own risk.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Documentation</a>
              <a href="#" className="hover:text-gray-900">Support</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
