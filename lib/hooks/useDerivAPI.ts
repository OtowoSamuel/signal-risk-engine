/**
 * React Hook for Deriv API Integration
 * Manages WebSocket connection, authentication, and real-time data
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDerivClient, DerivAccount, DerivPosition, DerivTick, mapToDerivSymbol } from '../deriv-api';
import { SymbolName } from '@/types';

export function useDerivAPI() {
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [account, setAccount] = useState<DerivAccount | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const client = getDerivClient();

  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      await client.connect();
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [client, isConnecting, isConnected]);

  const disconnect = useCallback(() => {
    client.disconnect();
    setIsConnected(false);
    setIsAuthorized(false);
    setAccount(null);
  }, [client]);

  const authorize = useCallback(async (token: string) => {
    if (!isConnected) {
      setError('Not connected to Deriv API');
      return;
    }

    try {
      await client.authorize(token);
      const accountInfo = await client.getAccountInfo();
      setAccount(accountInfo);
      setIsAuthorized(true);
      setError(null);
      
      // Store token in localStorage for persistence
      localStorage.setItem('deriv_token', token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authorization failed');
      setIsAuthorized(false);
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

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  // Auto-authorize if token exists in localStorage
  useEffect(() => {
    if (isConnected && !isAuthorized) {
      const storedToken = localStorage.getItem('deriv_token');
      if (storedToken) {
        authorize(storedToken);
      }
    }
  }, [isConnected, isAuthorized, authorize]);

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
    getLivePrice
  };
}
