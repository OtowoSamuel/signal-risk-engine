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
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  private tickCallback: ((data: DerivTick) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(appId: string = '1089') {
    // Default app_id 1089 is for testing, users should register their own
    this.appId = appId;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${this.appId}`);

        this.ws.onopen = () => {
          console.log('✅ Deriv API connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        };

        this.ws.onerror = (error) => {
          console.error('Deriv API error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('Deriv API disconnected');
          this.handleReconnect();
        };
      } catch (error) {
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
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  private send(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const reqId = `req_${Date.now()}_${Math.random()}`;
      const payload = { ...data, req_id: reqId };

      this.messageCallbacks.set(reqId, (response) => {
        this.messageCallbacks.delete(reqId);
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response);
        }
      });

      this.ws!.send(JSON.stringify(payload));
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
    const response = await this.send({ authorize: token });
    if (response.error) {
      throw new Error(response.error.message);
    }
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
export function mapToDerivSymbol(ourSymbol: string): string {
  const mapping: Record<string, string> = {
    'Volatility 10 (1s) Index': 'R_10',
    'Volatility 25 (1s) Index': 'R_25',
    'Volatility 50 (1s) Index': 'R_50',
    'Volatility 75 (1s) Index': 'R_75',
    'Volatility 100 (1s) Index': 'R_100',
    'Volatility 10 Index': '1HZ10V',
    'Volatility 25 Index': '1HZ25V',
    'Volatility 50 Index': '1HZ50V',
    'Volatility 75 Index': '1HZ75V',
    'Volatility 100 Index': '1HZ100V',
    'Crash 300 Index': 'CRASH300N',
    'Crash 500 Index': 'CRASH500',
    'Crash 1000 Index': 'CRASH1000',
    'Boom 300 Index': 'BOOM300N',
    'Boom 500 Index': 'BOOM500',
    'Boom 1000 Index': 'BOOM1000',
    'Jump 10 Index': 'JD10',
    'Jump 25 Index': 'JD25',
    'Jump 50 Index': 'JD50',
    'Jump 75 Index': 'JD75',
    'Jump 100 Index': 'JD100'
  };

  return mapping[ourSymbol] || ourSymbol;
}
