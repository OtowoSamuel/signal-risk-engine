/**
 * Disclaimer Component
 * Based on PRD Section 13.5 - Legal Liability Mitigation
 */

'use client';

export default function Disclaimer() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-700">
      <div className="flex gap-3">
        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p className="font-medium text-yellow-900 mb-1">Educational Tool Only</p>
          <p className="text-xs text-yellow-800">
            This calculator is for educational purposes only and does not constitute financial advice. 
            All trading involves risk. Past performance does not guarantee future results. 
            The calculations provided are based on current Deriv MT5 settings and may change. 
            You are solely responsible for your trading decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
