# Signal Risk Engine

A web-based risk management and lot size calculator for Deriv MT5 traders focusing on synthetic indices.

## Overview

Signal Risk Engine is an execution-support tool that helps traders calculate precise MT5 lot sizes based on allocated capital, stop-loss distance, and margin-safe stacking rules. Built specifically for Deriv's synthetic indices (Volatility 10, 25, 50, 75, 100, Step Index, and Step Dex).

**Key Features:**
- ✅ Precise MT5-compliant lot size calculations
- ✅ Margin preservation model (30-40% margin usage cap)
- ✅ Stacking risk analysis with visual warnings
- ✅ Allocated capital model (trade with portion of balance)
- ✅ LocalStorage persistence for settings
- ✅ Mobile-first responsive design
- ✅ Real-time calculation with input debouncing

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand with persistence
- **Platform:** Deriv MT5
- **Markets:** Synthetic Indices Only

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
signal-risk-engine/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── AccountSetup.tsx   # Account settings form
│   ├── TradeCalculator.tsx # Main calculator interface
│   ├── StackingTracker.tsx # Position tracking & stacking analysis
│   └── Disclaimer.tsx     # Legal disclaimer
├── lib/                   # Core business logic
│   ├── calculator.ts      # Risk calculation engine
│   ├── symbols.ts         # MT5 symbol data for Deriv
│   └── store.ts           # Zustand state management
├── types/                 # TypeScript type definitions
│   └── index.ts
├── __tests__/            # Test files
│   └── calculator.test.ts
└── PRD.md                # Full Product Requirements Document
```

## Core Concepts

### Allocated Trade Capital

The portion of your total account balance designated for a specific trade. Unlike traditional calculators that use 100% of balance, this reflects real-world trading where you partition capital across multiple opportunities.

**Example:**
- Total Balance: $100
- Allocated Capital per Trade: $10
- Risk calculations apply only to the $10

### Margin Preservation Model

Ensures initial margin usage consumes only **30-40%** of allocated capital, leaving 60-70% as a drawdown buffer. This prevents margin calls before stop-loss execution, especially critical on fast-moving synthetic indices.

### Stacking Rules

Fixed logic for managing multiple open positions:
- Individual positions: ≤ 30-40% margin usage
- Cumulative positions: ≤ 70% total margin usage
- Progressive lot size reduction for subsequent positions
- Visual warnings at 60% (moderate), 70% (high), 85% (critical)

## Calculation Formulas

### Max Lot Size
```
Max Lot Size = (Allocated Capital × 0.35) / (SL Points × Point Value)
```

### Margin Required
```
Margin = (Lot Size × Contract Size × Entry Price) / Leverage
```

### Drawdown Buffer
```
Buffer = Allocated Capital - Margin Required
Buffer % = (Buffer / Allocated Capital) × 100
```

## Usage Guide

### 1. Configure Account Settings
- Enter total MT5 account balance
- Set allocated capital per trade (e.g., $10 from $100 balance)
- Choose risk style (percentage or fixed amount)

### 2. Calculate Position Size
- Select synthetic index symbol
- Enter stop-loss distance in points
- System displays exact MT5 lot size to use
- Copy lot size to clipboard for quick entry

### 3. Track Open Positions (Optional)
- Manually add open positions
- View cumulative margin usage
- Get warnings before over-stacking
- Monitor remaining buffer

## MT5 Symbol Data

| Symbol | Point Value | Leverage | Min Lot | Max Lot |
|--------|-------------|----------|---------|---------|
| Volatility 10 | $0.10 | 1:1000 | 0.01 | 100 |
| Volatility 25 | $0.10 | 1:1000 | 0.01 | 100 |
| Volatility 50 | $0.10 | 1:1000 | 0.01 | 100 |
| Volatility 75 | $0.10 | 1:1000 | 0.01 | 100 |
| Volatility 100 | $0.10 | 1:1000 | 0.01 | 100 |
| Step Index | $0.10 | 1:500 | 0.01 | 100 |
| Step Dex | $0.10 | 1:500 | 0.01 | 100 |

## Roadmap

### Phase 2 (Post-MVP)
- [ ] Telegram signal parsing integration
- [ ] Position tracking dashboard with MT5 sync
- [ ] Historical calculation log
- [ ] Export calculation reports

### Phase 3
- [ ] MT5 plugin/API integration
- [ ] Trade journaling features
- [ ] Multi-broker support

### Phase 4
- [ ] Freemium monetization (Premium features)
- [ ] Community features
- [ ] Educational content library

## Disclaimer

**⚠️ IMPORTANT:** This tool is for educational purposes only and does not constitute financial advice. All trading involves risk. You are solely responsible for your trading decisions. The calculations are based on current Deriv MT5 settings which may change. Always verify lot sizes before executing trades.

## License

MIT License

## Support

- Documentation: See PRD.md for complete product requirements
- Issues: Open an issue in the repository

## Acknowledgments

- Built with Next.js, React, and TypeScript
- State management by Zustand
- Styling with Tailwind CSS
- Designed specifically for Deriv MT5 traders

---

**Version:** 1.0.0 (MVP)  
**Last Updated:** January 11, 2026  
**Target Platform:** Deriv MT5  
**Markets:** Synthetic Indices Only
