/**
 * Deriv API Connection Component
 * Handles authentication and displays connection status
 */

'use client';

import { useState } from 'react';
import { useDerivAPI } from '@/lib/hooks/useDerivAPI';

export default function DerivConnection() {
  const { 
    isConnected, 
    isAuthorized, 
    isConnecting,
    account, 
    error, 
    authorize,
    disconnect,
    useDemo,
    toggleAccountType,
    mt5Accounts
  } = useDerivAPI();

  const [token, setToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const handleAuthorize = async () => {
    if (!token.trim()) return;
    await authorize(token);
    setToken('');
    setShowTokenInput(false);
  };

  const handleDisconnect = () => {
    localStorage.removeItem('deriv_api_token');
    setShowTokenInput(false);
    setToken('');
    disconnect();
  };

  const hasDemo = mt5Accounts.some(acc => acc.isDemo);
  const hasReal = mt5Accounts.some(acc => !acc.isDemo);

  return (
    <div className="glass-card rounded-xl p-4 border border-[rgba(255,255,255,0.05)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-[#10B981]' : 
            isConnecting ? 'bg-amber-500 animate-pulse' : 
            'bg-gray-600'
          }`} style={{
            boxShadow: isConnected ? '0 0 10px rgba(16, 185, 129, 0.6)' : 'none',
            filter: isConnected ? 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.8))' : isConnecting ? 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.6))' : 'none'
          }} />
          <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider label-text">Deriv API</h3>
          {isAuthorized && (hasDemo || hasReal) && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              useDemo 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}>
              {useDemo ? 'DEMO' : 'REAL'}
            </span>
          )}
        </div>
        
        {isAuthorized && account && (
          <span className="text-xs text-gray-400 mono-numbers">
            {account.loginid}
          </span>
        )}
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 whitespace-pre-wrap max-h-32 overflow-y-auto">
          {error}
        </div>
      )}

      {isConnected && !isAuthorized && !showTokenInput && (
        <button
          onClick={() => setShowTokenInput(true)}
          className="w-full bg-gradient-to-b from-blue-500 to-blue-600 hover:brightness-110 text-white px-5 py-2.5 rounded-md transition-all text-sm font-semibold active:scale-95 cursor-pointer border-t border-white/20 shadow-lg shadow-blue-500/30"
        >
          Connect MT5 Account
        </button>
      )}

      {isConnected && !isAuthorized && showTokenInput && (
        <div className="space-y-2">
          <div className="text-xs text-gray-400 mb-2">
            Get your token from: <a href="https://app.deriv.com/account/api-token" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-white underline transition-colors">deriv.com/account/api-token</a>
          </div>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your Deriv API token"
            className="w-full px-3 py-2 bg-[#1E2329] border border-white/5 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3)]"
            onKeyDown={(e) => e.key === 'Enter' && handleAuthorize()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAuthorize}
              disabled={!token.trim()}
              className="flex-1 bg-gradient-to-b from-blue-500 to-blue-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 text-white px-5 py-2.5 rounded-md transition-all text-sm font-semibold active:scale-95 cursor-pointer border-t border-white/20 shadow-lg shadow-blue-500/30"
            >
              Authorize
            </button>
            <button
              onClick={() => {
                setShowTokenInput(false);
                setToken('');
              }}
              className="px-5 py-2.5 bg-[#1E2329] hover:bg-[#2B3139] text-gray-300 rounded-md transition-all text-sm font-semibold cursor-pointer active:scale-95 border border-white/5"
            >
              Cancel
            </button>
          </div>
          <a
            href="https://app.deriv.com/account/api-token"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-[#94A3B8] hover:text-white text-center transition-colors underline"
          >
            Get your API token →
          </a>
        </div>
      )}

      {isAuthorized && account && (
        <div className="space-y-2">
          <div className="elevated-card rounded-lg p-2.5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold label-text mb-1">Live Balance</p>
            <p className="text-lg font-bold text-[#10B981] mono-numbers value-text fade-in">
              <span className="text-sm opacity-70">$</span>{account.balance.toFixed(2)} <span className="text-sm opacity-70">{account.currency}</span>
            </p>
          </div>
          
          {(hasDemo || hasReal) && (
            <div className="flex gap-2">
              {hasReal && (
                <button
                  onClick={() => toggleAccountType(false)}
                  className={`flex-1 px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                    !useDemo
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-[#1E2329] hover:bg-[#2B3139] text-gray-300 border border-white/5'
                  }`}
                >
                  Real Account
                </button>
              )}
              {hasDemo && (
                <button
                  onClick={() => toggleAccountType(true)}
                  className={`flex-1 px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                    useDemo
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                      : 'bg-[#1E2329] hover:bg-[#2B3139] text-gray-300 border border-white/5'
                  }`}
                >
                  Demo Account
                </button>
              )}
            </div>
          )}
          
          <button
            onClick={handleDisconnect}
            className="w-full bg-[#1E2329] hover:bg-red-500/20 hover:brightness-110 text-red-400 border border-red-500/30 px-5 py-2.5 rounded-md transition-all text-sm font-semibold active:scale-95 cursor-pointer"
          >
            Disconnect
          </button>
        </div>
      )}

      {!isConnected && !isConnecting && (
        <p className="text-xs text-gray-500 text-center">
          Connecting to Deriv API...
        </p>
      )}
    </div>
  );
}
