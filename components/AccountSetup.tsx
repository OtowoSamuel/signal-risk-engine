/**
 * AccountSetup Component
 * Based on PRD Section 7.1 - Account Setup Module
 */

'use client';

import { useState } from 'react';
import { useSettings } from '@/lib/store';
import { validateAccountSettings } from '@/lib/calculator';

export default function AccountSetup() {
  const { settings, updateSettings } = useSettings();
  const [errors, setErrors] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAccountSettings(settings);
    
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    
    setErrors([]);
    setIsExpanded(false);
  };

  const handleChange = (field: keyof typeof settings, value: any) => {
    updateSettings({ [field]: value });
    // Clear errors on change
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="glass-card rounded-xl p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm font-bold text-white label-text flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Account Settings
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-[#2962FF] hover:text-[#2962FF]/80 transition-colors font-medium"
        >
          {isExpanded ? 'Close' : 'Edit'}
        </button>
      </div>

      {/* Summary View */}
      {!isExpanded && (
        <div className="space-y-1.5">
          <div className="elevated-card rounded-lg p-2">
            <p className="text-gray-400 text-xs mb-0.5 label-text">MT5 Balance</p>
            <p className="mono-numbers text-base font-semibold text-white value-text">${settings.mt5Balance}</p>
          </div>
          <div className="elevated-card rounded-lg p-2">
            <p className="text-gray-400 text-xs mb-0.5 label-text">Target Margin</p>
            <p className="mono-numbers text-base font-semibold text-[#2962FF] value-text">{settings.targetMarginPercent}%</p>
          </div>
        </div>
      )}

      {/* Expanded Form */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* MT5 Balance */}
          <div>
            <label htmlFor="mt5Balance" className="block text-sm font-medium text-gray-300 mb-2">
              MT5 Account Balance
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
              <input
                type="number"
                id="mt5Balance"
                value={settings.mt5Balance}
                onChange={(e) => handleChange('mt5Balance', parseFloat(e.target.value) || 0)}
                min="1"
                max="100000"
                step="1"
                className="w-full pl-10 pr-4 py-3 bg-[#1E2329] border border-[#2B3139] rounded-lg text-xl text-white mono-numbers placeholder-gray-500 transition-all value-text focus-within:ring-2 focus-within:ring-[#2962FF]/50 focus:outline-none"
                placeholder="10.00"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Amount transferred to MT5 for trading
            </p>
          </div>

          {/* Target Margin Percentage */}
          <div>
            <label htmlFor="targetMargin" className="block text-sm font-medium text-gray-300 mb-2">
              Target Margin Usage
            </label>
            <div className="relative">
              <input
                type="number"
                id="targetMargin"
                value={settings.targetMarginPercent}
                onChange={(e) => handleChange('targetMarginPercent', parseFloat(e.target.value) || 35)}
                min="10"
                max="80"
                step="5"
                className="w-full pr-10 pl-4 py-3 bg-[#1E2329] border border-[#2B3139] rounded-lg text-xl text-white mono-numbers placeholder-gray-500 transition-all value-text focus-within:ring-2 focus-within:ring-[#2962FF]/50 focus:outline-none"
                placeholder="35"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Recommended: 30-40% (leaves 60-70% buffer)
            </p>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 glow-red">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-400">
                  • {error}
                </p>
              ))}
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-[#2962FF] hover:bg-[#2962FF]/90 text-white font-medium py-3 px-4 rounded-lg transition-all glow-blue active:scale-[0.98] active:shadow-[#2962FF]/40"
          >
            Save Settings
          </button>
        </form>
      )}
    </div>
  );
}
