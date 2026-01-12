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
    disconnect 
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
    localStorage.removeItem('deriv_token');
    disconnect();
  };

  return (
    <div className="glass-card rounded-xl p-4 border border-[#2B3139]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 
            isConnecting ? 'bg-amber-500 animate-pulse' : 
            'bg-gray-600'
          }`} />
          <h3 className="text-sm font-bold text-white label-text">Deriv API</h3>
        </div>
        
        {isAuthorized && account && (
          <span className="text-xs text-gray-400 mono-numbers">
            {account.loginid}
          </span>
        )}
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
          {error}
        </div>
      )}

      {isConnected && !isAuthorized && !showTokenInput && (
        <button
          onClick={() => setShowTokenInput(true)}
          className="w-full bg-[#2962FF] hover:bg-[#2962FF]/90 text-white px-4 py-2 rounded-lg transition-all text-sm font-semibold active:scale-95"
        >
          Connect MT5 Account
        </button>
      )}

      {isConnected && !isAuthorized && showTokenInput && (
        <div className="space-y-2">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your Deriv API token"
            className="w-full px-3 py-2 bg-[#1E2329] border border-[#2B3139] rounded-lg text-sm text-white placeholder-gray-500 focus-within:ring-2 focus-within:ring-[#2962FF]/50 focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleAuthorize()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAuthorize}
              disabled={!token.trim()}
              className="flex-1 bg-[#2962FF] hover:bg-[#2962FF]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all text-sm font-semibold active:scale-95"
            >
              Authorize
            </button>
            <button
              onClick={() => {
                setShowTokenInput(false);
                setToken('');
              }}
              className="px-4 py-2 bg-[#1E2329] hover:bg-[#2B3139] text-gray-300 rounded-lg transition-all text-sm active:scale-95"
            >
              Cancel
            </button>
          </div>
          <a
            href="https://app.deriv.com/account/api-token"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-[#2962FF] hover:text-[#2962FF]/80 text-center transition-colors"
          >
            Get your API token →
          </a>
        </div>
      )}

      {isAuthorized && account && (
        <div className="space-y-2">
          <div className="elevated-card rounded-lg p-2.5">
            <p className="text-xs text-gray-400 label-text mb-0.5">Live Balance</p>
            <p className="text-lg font-semibold text-[#10B981] mono-numbers value-text">
              ${account.balance.toFixed(2)} {account.currency}
            </p>
          </div>
          <button
            onClick={handleDisconnect}
            className="w-full bg-[#1E2329] hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg transition-all text-sm font-medium active:scale-95"
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
