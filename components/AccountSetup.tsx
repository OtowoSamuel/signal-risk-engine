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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Account Settings
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Summary View */}
      {!isExpanded && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">MT5 Balance</p>
            <p className="font-medium text-gray-900">${settings.mt5Balance}</p>
          </div>
          <div>
            <p className="text-gray-500">Target Margin</p>
            <p className="font-medium text-gray-900">{settings.targetMarginPercent}%</p>
          </div>
        </div>
      )}

      {/* Expanded Form */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* MT5 Balance */}
          <div>
            <label htmlFor="mt5Balance" className="block text-sm font-medium text-gray-700 mb-1">
              MT5 Account Balance ($)
            </label>
            <input
              type="number"
              id="mt5Balance"
              value={settings.mt5Balance}
              onChange={(e) => handleChange('mt5Balance', parseFloat(e.target.value) || 0)}
              min="1"
              max="100000"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900"
              placeholder="10"
            />
            <p className="text-xs text-gray-500 mt-1">
              Amount you transferred to MT5 for this trade
            </p>
          </div>

          {/* Target Margin Percentage */}
          <div>
            <label htmlFor="targetMargin" className="block text-sm font-medium text-gray-700 mb-1">
              Target Margin Usage (%)
            </label>
            <input
              type="number"
              id="targetMargin"
              value={settings.targetMarginPercent}
              onChange={(e) => handleChange('targetMarginPercent', parseFloat(e.target.value) || 35)}
              min="10"
              max="80"
              step="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900"
              placeholder="35"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 30-40% (leaves 60-70% as drawdown buffer)
            </p>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-700">
                  • {error}
                </p>
              ))}
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </form>
      )}
    </div>
  );
}
