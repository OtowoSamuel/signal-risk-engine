/**
 * AccountSetup Component
 * Based on PRD Section 7.1 - Account Setup Module
 */

'use client';

import { useState } from 'react';
import { useSettings } from '@/lib/store';
import { validateAccountSettings } from '@/lib/calculator';
import { RiskStyle } from '@/types';

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
            <p className="text-gray-500">Total Balance</p>
            <p className="font-medium text-gray-900">${settings.totalBalance}</p>
          </div>
          <div>
            <p className="text-gray-500">Allocated Capital</p>
            <p className="font-medium text-gray-900">${settings.allocatedCapital}</p>
          </div>
        </div>
      )}

      {/* Expanded Form */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Total Balance */}
          <div>
            <label htmlFor="totalBalance" className="block text-sm font-medium text-gray-700 mb-1">
              Total Account Balance ($)
            </label>
            <input
              type="number"
              id="totalBalance"
              value={settings.totalBalance}
              onChange={(e) => handleChange('totalBalance', parseFloat(e.target.value) || 0)}
              min="1"
              max="1000000"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your total account balance on MT5
            </p>
          </div>

          {/* Allocated Capital */}
          <div>
            <label htmlFor="allocatedCapital" className="block text-sm font-medium text-gray-700 mb-1">
              Allocated Capital Per Trade ($)
              <button
                type="button"
                className="ml-2 text-xs text-blue-600 hover:text-blue-700 cursor-help inline-flex items-center group relative"
                title="Click to learn more"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="hidden group-hover:block absolute left-0 top-6 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 z-10 shadow-lg">
                  <strong className="block mb-1">What is Allocated Capital?</strong>
                  The portion of your balance you want to use for this specific trade. 
                  <br/><br/>
                  <strong>Example:</strong> If your balance is $100, you might allocate only $10 per trade. 
                  This lets you take multiple positions and manage risk better.
                  <br/><br/>
                  <strong>⚠️ Important:</strong> This is NOT your entire balance. Most traders allocate 10-20% per trade.
                </span>
              </button>
            </label>
            <input
              type="number"
              id="allocatedCapital"
              value={settings.allocatedCapital}
              onChange={(e) => handleChange('allocatedCapital', parseFloat(e.target.value) || 0)}
              min="1"
              max={settings.totalBalance}
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="10"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: $10 if balance is $100 (not your entire balance)
            </p>
          </div>

          {/* Risk Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('riskStyle', 'percentage' as RiskStyle)}
                className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  settings.riskStyle === 'percentage'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Percentage-based
              </button>
              <button
                type="button"
                onClick={() => handleChange('riskStyle', 'fixed' as RiskStyle)}
                className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  settings.riskStyle === 'fixed'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Fixed Amount
              </button>
            </div>
          </div>

          {/* Risk Percentage or Fixed Amount */}
          {settings.riskStyle === 'percentage' ? (
            <div>
              <label htmlFor="riskPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                Risk Percentage (%)
              </label>
              <input
                type="number"
                id="riskPercentage"
                value={settings.riskPercentage || 2}
                onChange={(e) => handleChange('riskPercentage', parseFloat(e.target.value) || 2)}
                min="0.5"
                max="5"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 1-2% per trade
              </p>
            </div>
          ) : (
            <div>
              <label htmlFor="riskAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Fixed Risk Amount ($)
              </label>
              <input
                type="number"
                id="riskAmount"
                value={settings.riskAmount || 2}
                onChange={(e) => handleChange('riskAmount', parseFloat(e.target.value) || 2)}
                min="1"
                max={settings.allocatedCapital * 0.5}
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum you're willing to lose on this trade
              </p>
            </div>
          )}

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
