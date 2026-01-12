/**
 * React Hook for Deriv API Integration
 * Manages WebSocket connection, authentication, and real-time data
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getDerivClient, DerivAccount, DerivPosition, DerivTick, mapToDerivSymbol } from '../deriv-api';
import { SymbolName } from '@/types';
import { useDerivAPIStore } from '../store';

export function useDerivAPI() {
  // Use global Zustand store for shared state
  const isConnected = useDerivAPIStore(state => state.isConnected);
  const isAuthorized = useDerivAPIStore(state => state.isAuthorized);
  const account = useDerivAPIStore(state => state.account);
  const useDemo = useDerivAPIStore(state => state.useDemo);
  const mt5Accounts = useDerivAPIStore(state => state.mt5Accounts);
  const setConnected = useDerivAPIStore(state => state.setConnected);
  const setAuthorized = useDerivAPIStore(state => state.setAuthorized);
  const setAccount = useDerivAPIStore(state => state.setAccount);
  const setUseDemo = useDerivAPIStore(state => state.setUseDemo);
  const setMt5Accounts = useDerivAPIStore(state => state.setMt5Accounts);
  
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const hasAutoConnected = useRef(false);

  const client = getDerivClient();

  // Auto-connect on mount (only once)
  useEffect(() => {
    console.log('🚀 useDerivAPI: Auto-connect useEffect running');
    
    // Prevent duplicate connections on React StrictMode remounts
    if (hasAutoConnected.current) {
      console.log('⏭️ Auto-connect already ran, skipping');
      return;
    }
    
    // Skip if already connected
    if (isConnected) {
      console.log('⏭️ Already connected, skipping auto-connect');
      return;
    }
    
    let mounted = true;
    hasAutoConnected.current = true;

    const autoConnect = async () => {
      console.log('🔌 Starting auto-connect...');
      try {
        setIsConnecting(true);
        console.log('📡 Calling client.connect()...');
        await client.connect();
        
        console.log('✅ Connected! mounted =', mounted);
        if (mounted) {
          setConnected(true);
          setError(null);

          // Try to auto-authorize from stored token
          const storedToken = localStorage.getItem('deriv_api_token');
          if (storedToken) {
            try {
              await client.authorize(storedToken);
              const accountInfo = await client.getAccountInfo();
              
              // Try to get MT5 account info if available
              const allMt5Accounts = await client.getMT5Accounts();
              if (allMt5Accounts.length > 0) {
                console.log('MT5 Accounts found:', allMt5Accounts);
                
                if (mounted) {
                  setMt5Accounts(allMt5Accounts);
                  
                  // Default to real account, fallback to first available
                  const selectedAccount = client.getRealMT5Account(allMt5Accounts);
                  if (selectedAccount) {
                    console.log('Using real MT5 account:', selectedAccount);
                    const displayAccount: DerivAccount = {
                      balance: selectedAccount.balance || accountInfo.balance,
                      currency: selectedAccount.currency || accountInfo.currency,
                      loginid: selectedAccount.login || accountInfo.loginid
                    };
                    setAccount(displayAccount);
                  } else {
                    setAccount(accountInfo);
                  }
                  
                  console.log('✅ Setting authorized to TRUE');
                  setAuthorized(true);
                }
              } else {
                if (mounted) {
                  setAccount(accountInfo);
                  console.log('✅ Setting authorized to TRUE (no MT5)');
                  setAuthorized(true);
                }
              }
            } catch (authErr) {
              console.log('Stored token invalid, clearing...');
              localStorage.removeItem('deriv_api_token');
            }
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to connect to Deriv API');
          setConnected(false);
        }
      } finally {
        if (mounted) {
          setIsConnecting(false);
        }
      }
    };

    console.log('🎬 Calling autoConnect()...');
    autoConnect();

    return () => {
      console.log('🛑 useDerivAPI cleanup');
      mounted = false;
      // Don't disconnect - let the singleton manage its own lifecycle
      // Only disconnect when explicitly calling disconnect()
    };
  }, []); // Empty deps - only run once on mount

  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      await client.connect();
      setConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [client, isConnecting, isConnected]);

  const disconnect = useCallback(async () => {
    client.disconnect();
    setConnected(false);
    setAuthorized(false);
    setAccount(null);
    
    // Reconnect to show "Connect MT5 Account" button
    try {
      await client.connect();
      setConnected(true);
    } catch (err) {
      console.log('Reconnect after disconnect failed:', err);
    }
  }, [client]);

  const authorize = useCallback(async (token: string) => {
    if (!isConnected) {
      setError('Not connected to Deriv API');
      return;
    }

    try {
      setIsConnecting(true);
      await client.authorize(token);
      const accountInfo = await client.getAccountInfo();
      
      // Try to get MT5 account info if available
      const allMt5Accounts = await client.getMT5Accounts();
      if (allMt5Accounts.length > 0) {
        console.log('MT5 Accounts found:', allMt5Accounts);
        setMt5Accounts(allMt5Accounts);
        
        // Default to real account, fallback to first available
        const selectedAccount = client.getRealMT5Account(allMt5Accounts);
        if (selectedAccount) {
          console.log('Using real MT5 account:', selectedAccount);
          const displayAccount: DerivAccount = {
            balance: selectedAccount.balance || accountInfo.balance,
            currency: selectedAccount.currency || accountInfo.currency,
            loginid: selectedAccount.login || accountInfo.loginid
          };
          setAccount(displayAccount);
        } else {
          setAccount(accountInfo);
        }
      } else {
        setAccount(accountInfo);
      }
      
      setAuthorized(true);
      setError(null);
      
      // Store token in localStorage for persistence
      localStorage.setItem('deriv_api_token', token);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Authorization failed';
      setError(errorMsg);
      setAuthorized(false);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [client, isConnected]);

  const getOpenPositions = useCallback(async (): Promise<DerivPosition[]> => {
    if (!isAuthorized) {
      throw new Error('Not authorized');
    }
    return await client.getOpenPositions();
  }, [client, isAuthorized]);

  const subscribeToPrices = useCallback((symbols: SymbolName[], callback: (tick: DerivTick) => void) => {
    if (!isConnected) return;
    
    const derivSymbols = symbols.map(mapToDerivSymbol);
    client.subscribeToPrices(derivSymbols, callback);
  }, [client, isConnected]);

  const unsubscribeFromPrices = useCallback(() => {
    client.unsubscribeFromPrices();
  }, [client]);

  const getLivePrice = useCallback(async (symbol: SymbolName): Promise<number> => {
    if (!isConnected) {
      throw new Error('Not connected to Deriv API');
    }
    const derivSymbol = mapToDerivSymbol(symbol);
    return await client.getSymbolPrice(derivSymbol);
  }, [client, isConnected]);

  const toggleAccountType = useCallback((demo: boolean) => {
    if (mt5Accounts.length === 0) return;
    
    let selectedAccount;
    if (demo) {
      selectedAccount = client.getDemoMT5Account(mt5Accounts);
    } else {
      selectedAccount = client.getRealMT5Account(mt5Accounts);
    }
    
    if (selectedAccount) {
      setUseDemo(demo);
      const displayAccount: DerivAccount = {
        balance: selectedAccount.balance,
        currency: selectedAccount.currency,
        loginid: selectedAccount.login
      };
      setAccount(displayAccount);
      console.log(`Switched to ${demo ? 'DEMO' : 'REAL'} account:`, selectedAccount);
    }
  }, [mt5Accounts, client]);

  return {
    isConnected,
    isAuthorized,
    isConnecting,
    account,
    error,
    connect,
    disconnect,
    authorize,
    getOpenPositions,
    subscribeToPrices,
    unsubscribeFromPrices,
    getLivePrice,
    useDemo,
    toggleAccountType,
    mt5Accounts
  };
}
