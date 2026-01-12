/**
 * Deriv API Integration
 * WebSocket connection for real-time data and account access
 * Documentation: https://api.deriv.com/
 */

export interface DerivConnection {
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  authorize: (token: string) => Promise<void>;
  getAccountInfo: () => Promise<DerivAccount>;
  getOpenPositions: () => Promise<DerivPosition[]>;
  subscribeToPrices: (symbols: string[], callback: (data: DerivTick) => void) => void;
  unsubscribeFromPrices: () => void;
}

export interface DerivAccount {
  balance: number;
  currency: string;
  loginid: string;
}

export interface DerivPosition {
  contract_id: number;
  symbol: string;
  contract_type: string;
  buy_price: number;
  current_price: number;
  profit: number;
  date_start: number;
  volume?: number; // MT5 lot size
  stop_loss?: number;
  take_profit?: number;
}

export interface DerivTick {
  symbol: string;
  bid: number;
  ask: number;
  quote: number;
  epoch: number;
}

class DerivAPIClient {
  private ws: WebSocket | null = null;
  private appId: string;
  private messageCallbacks: Map<number, (data: any) => void> = new Map();
  private tickCallback: ((data: DerivTick) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private requestCounter = 0; // Counter to ensure unique req_ids
  private lastPortfolioFetch = 0; // Timestamp of last portfolio fetch
  private portfolioRateLimit = 5000; // Minimum 5 seconds between portfolio calls

  constructor(appId: string = '1089') {
    // Default app_id 1089 is for testing, users should register their own
    this.appId = appId;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || this.isConnected) {
        resolve();
        return;
      }

      this.isConnecting = true;

      try {
        // For Node.js environment, import WebSocket
        let WebSocketClass: any = (globalThis as any).WebSocket;
        
        // Fallback for Node.js
        if (!WebSocketClass) {
          try {
            WebSocketClass = require('ws');
          } catch (e) {
            reject(new Error('WebSocket not available. Install ws package: npm install ws'));
            return;
          }
        }

        this.ws = new WebSocketClass(`wss://ws.derivws.com/websockets/v3?app_id=${this.appId}`);

        // Set a timeout for connection
        const connectionTimeout = setTimeout(() => {
          if (!this.isConnected) {
            this.isConnecting = false;
            this.ws?.close();
            reject(new Error('WebSocket connection timeout'));
          }
        }, 5000);

        if (this.ws) {
          this.ws.onopen = () => {
            clearTimeout(connectionTimeout);
            this.isConnecting = false;
            console.log('✅ Deriv API connected');
            this.reconnectAttempts = 0;
            resolve();
          };
          this.ws.onmessage = (event: any) => {
            try {
              const data = JSON.parse(event.data);
              this.handleMessage(data);
            } catch (error) {
              console.error('Error parsing WebSocket message:', error);
            }
          };

          this.ws.onerror = (error: any) => {
            clearTimeout(connectionTimeout);
            this.isConnecting = false;
            console.error('❌ Deriv API WebSocket error:', error);
            reject(error);
          };

          this.ws.onclose = () => {
            clearTimeout(connectionTimeout);
            this.isConnecting = false;
            console.log('Deriv API disconnected');
            this.handleReconnect();
          };
        }
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => {
        this.connect().catch(console.error);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  get isConnected(): boolean {
    if (!this.ws) return false;
    // Handle both browser WebSocket and ws library
    const readyState = this.ws.readyState || (this.ws as any).readyState;
    return readyState === 1; // 1 = WebSocket.OPEN
  }

  private send(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Wait up to 2 seconds for connection
      let attempts = 0;
      const checkConnection = () => {
        if (this.isConnected) {
          this.requestCounter++;
          const reqId = Date.now() + this.requestCounter; // Unique numeric ID
          const payload = { ...data, req_id: reqId };

          this.messageCallbacks.set(reqId, (response) => {
            this.messageCallbacks.delete(reqId);
            if (response.error) {
              reject(new Error(response.error.message));
            } else {
              resolve(response);
            }
          });

          try {
            this.ws!.send(JSON.stringify(payload));
          } catch (error) {
            reject(new Error(`Failed to send WebSocket message: ${error}`));
          }
        } else if (attempts < 20) {
          attempts++;
          setTimeout(checkConnection, 100);
        } else {
          reject(new Error('WebSocket not connected after timeout'));
        }
      };
      
      checkConnection();
    });
  }

  private handleMessage(data: any) {
    // Handle subscription updates (ticks)
    if (data.msg_type === 'tick') {
      if (this.tickCallback) {
        const tick: DerivTick = {
          symbol: data.tick.symbol,
          bid: data.tick.bid,
          ask: data.tick.ask,
          quote: data.tick.quote,
          epoch: data.tick.epoch
        };
        this.tickCallback(tick);
      }
      return;
    }

    // Handle request/response with req_id
    if (data.req_id && this.messageCallbacks.has(data.req_id)) {
      const callback = this.messageCallbacks.get(data.req_id);
      callback!(data);
    }
  }

  async authorize(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      // Validate token format - should be a non-empty string
      if (!token || typeof token !== 'string' || token.trim().length === 0) {
        reject(new Error('Invalid token: Token must be a non-empty string'));
        return;
      }

      const trimmedToken = token.trim();
      
      // Additional validation: Deriv tokens are typically 10-60 characters
      if (trimmedToken.length < 10) {
        reject(new Error(`Token appears too short (${trimmedToken.length} chars). Valid tokens are typically 10-60 characters. Check for copy/paste errors.`));
        return;
      }

      // Check for common mistakes (quotes, newlines, spaces)
      if (trimmedToken.includes('"') || trimmedToken.includes("'") || trimmedToken.includes('\n')) {
        reject(new Error('Token contains invalid characters (quotes or newlines). Copy the token exactly from Deriv without quotes.'));
        return;
      }
      
      // Debug: Check token format
      console.log(`Token length: ${trimmedToken.length}, First 10 chars: ${trimmedToken.substring(0, 10)}...`);
      
      this.requestCounter++;
      const reqId = Date.now() + this.requestCounter; // Unique numeric ID
      
      // Set timeout for authorization response
      const authTimeout = setTimeout(() => {
        this.messageCallbacks.delete(reqId);
        reject(new Error('Authorization timeout: No response from server'));
      }, 10000);

      this.messageCallbacks.set(reqId, (response) => {
        clearTimeout(authTimeout);
        this.messageCallbacks.delete(reqId);
        
        if (response.error) {
          const errorMsg = response.error.message || 'Unknown authorization error';
          const errorCode = response.error.code || 'Unknown code';
          console.error(`Authorization error [${errorCode}]: ${errorMsg}`);
          console.error('Full error response:', JSON.stringify(response.error, null, 2));
          
          // Provide specific guidance based on error
          let guidanceMsg = errorMsg;
          if (errorMsg.includes('authorize')) {
            guidanceMsg += '\n• Token may be expired or invalid\n• Ensure you copied the FULL token (typically 32-60 characters)\n• Get a fresh token from: https://app.deriv.com/account/api-token';
          } else if (errorMsg.includes('validation')) {
            guidanceMsg += '\n• Check token format and that it contains no quotes or extra spaces';
          }
          
          reject(new Error(`Authorization failed: ${guidanceMsg}`));
        } else if (response.authorize) {
          console.log('✅ Successfully authorized');
          console.log('Account info:', response.authorize);
          resolve();
        } else {
          console.warn('Unexpected response structure:', JSON.stringify(response, null, 2));
          reject(new Error('Unexpected response from authorization'));
        }
      });

      try {
        console.log(`Sending authorization request with req_id: ${reqId}`);
        console.log('Authorization payload:', { authorize: '[TOKEN]', req_id: reqId });
        this.ws!.send(JSON.stringify({
          authorize: trimmedToken,
          req_id: reqId
        }));
      } catch (error) {
        clearTimeout(authTimeout);
        this.messageCallbacks.delete(reqId);
        reject(new Error(`Failed to send authorization: ${error}`));
      }
    });
  }

  async getAccountInfo(): Promise<DerivAccount> {
    const response = await this.send({ balance: 1, account: 'current' });
    return {
      balance: response.balance.balance,
      currency: response.balance.currency,
      loginid: response.balance.loginid
    };
  }

  async getOpenPositions(): Promise<DerivPosition[]> {
    // Rate limiting: Check if we've called this too recently
    const now = Date.now();
    const timeSinceLastFetch = now - this.lastPortfolioFetch;
    
    if (timeSinceLastFetch < this.portfolioRateLimit) {
      const waitTime = this.portfolioRateLimit - timeSinceLastFetch;
      console.log(`⏳ Rate limit: waiting ${Math.ceil(waitTime/1000)}s before fetching positions`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    console.log('📡 Fetching positions from Deriv API (Deriv Trader only)...');
    console.log('⚠️ Note: MT5 positions are not accessible via Deriv API. Use manual entry for MT5 trades.');
    this.lastPortfolioFetch = Date.now();
    
    const response = await this.send({ portfolio: 1 });
    console.log('📦 Portfolio response:', response);
    
    if (!response.portfolio || !response.portfolio.contracts) {
      console.log('⚠️ No portfolio or contracts in response');
      return [];
    }

    const positions = response.portfolio.contracts.map((contract: any) => ({
      contract_id: contract.contract_id,
      symbol: contract.symbol,
      contract_type: contract.contract_type,
      buy_price: contract.buy_price,
      current_price: contract.bid_price,
      profit: contract.profit,
      date_start: contract.date_start
    }));
    
    console.log(`✅ Mapped ${positions.length} Deriv Trader contracts:`, positions);
    console.log('💡 For MT5 positions, use the "+ Add Position" button to manually track your trades.');
    return positions;
  }

  async getMT5Accounts(): Promise<any[]> {
    try {
      const response = await this.send({ mt5_login_list: 1 });
      
      if (!response.mt5_login_list) {
        console.log('No MT5 accounts found');
        return [];
      }

      console.log('MT5 Accounts:', response.mt5_login_list);
      // Separate real and demo accounts
      const accounts = response.mt5_login_list.map((acc: any) => ({
        ...acc,
        isDemo: acc.account_type === 'demo' || acc.mt5_account_category === 'demo'
      }));
      
      return accounts;
    } catch (error) {
      console.error('Failed to fetch MT5 accounts:', error);
      return [];
    }
  }

  getRealMT5Account(accounts: any[]): any | null {
    // Prefer real (live money) accounts over demo
    const realAccount = accounts.find(acc => !acc.isDemo && acc.account_type !== 'demo');
    return realAccount || accounts[0] || null;
  }

  getDemoMT5Account(accounts: any[]): any | null {
    // Get demo account if available
    return accounts.find(acc => acc.isDemo || acc.account_type === 'demo') || null;
  }

  async getMT5Positions(): Promise<DerivPosition[]> {
    try {
      // First get MT5 accounts
      const mt5Accounts = await this.getMT5Accounts();
      
      if (mt5Accounts.length === 0) {
        console.log('No MT5 accounts available');
        return [];
      }

      // Get open contracts (positions) for the account
      const response = await this.send({ portfolio: 1 });
      
      if (!response.portfolio || !response.portfolio.contracts) {
        return [];
      }

      return response.portfolio.contracts.map((contract: any) => ({
        contract_id: contract.contract_id,
        symbol: contract.symbol,
        contract_type: contract.contract_type,
        buy_price: contract.buy_price,
        current_price: contract.bid_price,
        profit: contract.profit,
        date_start: contract.date_start
      }));
    } catch (error) {
      console.error('Failed to fetch MT5 positions:', error);
      return [];
    }
  }

  subscribeToPrices(symbols: string[], callback: (data: DerivTick) => void) {
    this.tickCallback = callback;
    
    symbols.forEach(symbol => {
      this.send({ ticks: symbol, subscribe: 1 }).catch(console.error);
    });
  }

  unsubscribeFromPrices() {
    this.tickCallback = null;
    if (this.isConnected) {
      this.send({ forget_all: 'ticks' }).catch(console.error);
    }
  }

  async getSymbolPrice(symbol: string): Promise<number> {
    const response = await this.send({ ticks: symbol });
    return response.tick.quote;
  }
}

// Singleton instance
let derivClient: DerivAPIClient | null = null;

export function getDerivClient(appId?: string): DerivAPIClient {
  if (!derivClient) {
    derivClient = new DerivAPIClient(appId);
  }
  return derivClient;
}

// Map our symbol names to Deriv API symbol names
// Source: Official Deriv WebSocket API active_symbols response (January 2026)
export function mapToDerivSymbol(ourSymbol: string): string {
  const mapping: Record<string, string> = {
    // CONTINUOUS INDICES (Volatility Indices)
    'Volatility 10 (1s) Index': '1HZ10V',
    'Volatility 10 Index': 'R_10',
    'Volatility 15 (1s) Index': '1HZ15V',
    'Volatility 25 (1s) Index': '1HZ25V',
    'Volatility 25 Index': 'R_25',
    'Volatility 30 (1s) Index': '1HZ30V',
    'Volatility 50 (1s) Index': '1HZ50V',
    'Volatility 50 Index': 'R_50',
    'Volatility 75 (1s) Index': '1HZ75V',
    'Volatility 75 Index': 'R_75',
    'Volatility 90 (1s) Index': '1HZ90V',
    'Volatility 100 (1s) Index': '1HZ100V',
    'Volatility 100 Index': 'R_100',
    'Volatility 150 (1s) Index': '1HZ150V', // Not in API, assumed
    'Volatility 250 (1s) Index': '1HZ250V', // Not in API, assumed
    
    // CRASH/BOOM INDICES
    'Crash 300 Index': 'CRASH300N',
    'Crash 500 Index': 'CRASH500',
    'Crash 600 Index': 'CRASH600',
    'Crash 900 Index': 'CRASH900',
    'Crash 1000 Index': 'CRASH1000',
    'Boom 300 Index': 'BOOM300N',
    'Boom 500 Index': 'BOOM500',
    'Boom 600 Index': 'BOOM600',
    'Boom 900 Index': 'BOOM900',
    'Boom 1000 Index': 'BOOM1000',
    
    // JUMP INDICES
    'Jump 10 Index': 'JD10',
    'Jump 25 Index': 'JD25',
    'Jump 50 Index': 'JD50',
    'Jump 75 Index': 'JD75',
    'Jump 100 Index': 'JD100',
    
    // RANGE BREAK INDICES
    'Range Break 100 Index': 'RB100',
    'Range Break 200 Index': 'RB200',
    
    // STEP INDICES
    'Step Index': 'stpRNG',
    'Multi Step Index 200': 'stpRNG2',
    'Multi Step Index 250': 'stpRNG',  // Closest match
    'Multi Step Index 300': 'stpRNG3',
    'Multi Step Index 500': 'stpRNG5',
    
    // DAILY RESET INDICES
    'Bull Market Index': 'RDBULL',
    'Bear Market Index': 'RDBEAR',
    
    // DEX INDICES - Not in official API, need confirmation
    'DEX 150 UP Index': 'DEX150UP',
    'DEX 150 DOWN Index': 'DEX150DOWN',
    'DEX 300 UP Index': 'DEX300UP',
    'DEX 300 DOWN Index': 'DEX300DOWN',
    'DEX 600 UP Index': 'DEX600UP',
    'DEX 600 DOWN Index': 'DEX600DOWN',
    'DEX 900 UP Index': 'DEX900UP',
    'DEX 900 DOWN Index': 'DEX900DOWN',
    'DEX 1200 UP Index': 'DEX1200UP',
    'DEX 1200 DOWN Index': 'DEX1200DOWN',
    
    // DRIFT SWITCHING INDICES - Need to confirm
    'Drift Switch Index 10': 'DRIFT10',
    'Drift Switch Index 20': 'DRIFT20',
    'Drift Switch Index 30': 'DRIFT30',
    
    // SKEW STEP INDICES - Need to confirm
    'Skew Step Index 80/20': 'SKEW8020',
    'Skew Step Index 90/10': 'SKEW9010',
    
    // TREK INDICES - Need to confirm
    'Trek UP Index': 'TREKUP',
    'Trek DOWN Index': 'TREKDOWN',
    
    // VOLATILITY SWITCH INDICES - Need to confirm
    'Volatility Switch 10/50 Index': 'VOLSW1050',
    'Volatility Switch 10/100 Index': 'VOLSW10100',
    'Volatility Switch 50/100 Index': 'VOLSW50100'
  };

  return mapping[ourSymbol] || ourSymbol;
}
