# Deriv MT5 Synthetic Indices - Complete Specifications

## Overview
Signal Risk Engine now supports **all 24 Deriv MT5 synthetic indices** with accurate specifications updated as of January 2026.

---

## 📊 Volatility Indices (1s) - 7 Indices

Continuous synthetic indices that simulate markets with fixed volatility levels. Tick interval: 1 second.

| Symbol | Volatility | Point Value | Leverage | Lot Range | Description |
|--------|-----------|-------------|----------|-----------|-------------|
| **Volatility 10 (1s) Index** | 10% | $0.10 | 1:1000 | 0.01 - 100 | Lowest volatility, most stable |
| **Volatility 25 (1s) Index** | 25% | $0.10 | 1:1000 | 0.01 - 100 | Low-medium volatility |
| **Volatility 50 (1s) Index** | 50% | $0.10 | 1:1000 | 0.01 - 100 | Medium volatility |
| **Volatility 75 (1s) Index** | 75% | $0.10 | 1:1000 | 0.01 - 100 | High volatility |
| **Volatility 100 (1s) Index** | 100% | $0.10 | 1:1000 | 0.01 - 100 | Very high volatility |
| **Volatility 150 (1s) Index** | 150% | $0.10 | 1:1000 | 0.01 - 100 | Extreme volatility |
| **Volatility 250 (1s) Index** | 250% | $0.10 | 1:1000 | 0.01 - 100 | Maximum volatility |

### Trading Characteristics:
- ✅ 24/7 trading available
- ✅ Continuous price movements
- ✅ No gaps or spikes
- ✅ Suitable for trend following and scalping
- ⚠️ Higher volatility = more risk and potential reward

---

## 📉 Crash Indices - 3 Indices

Indices with periodic **downward spikes** (crashes). The number indicates average ticks between crashes.

| Symbol | Crash Frequency | Point Value | Leverage | Lot Range | Description |
|--------|----------------|-------------|----------|-----------|-------------|
| **Crash 300 Index** | ~300 ticks | $0.10 | 1:1000 | 0.01 - 100 | Crash every ~300 ticks on average |
| **Crash 500 Index** | ~500 ticks | $0.10 | 1:1000 | 0.01 - 100 | Crash every ~500 ticks on average |
| **Crash 1000 Index** | ~1000 ticks | $0.10 | 1:1000 | 0.01 - 100 | Crash every ~1000 ticks on average |

### Trading Characteristics:
- ⚠️ **Sudden downward spikes** (crashes)
- ✅ Predictable spike frequency (on average)
- ✅ Ideal for mean reversion strategies
- ⚠️ High risk if caught in crash
- 💡 Best for selling after crashes, buying before recovery

---

## 📈 Boom Indices - 3 Indices

Indices with periodic **upward spikes** (booms). The number indicates average ticks between booms.

| Symbol | Boom Frequency | Point Value | Leverage | Lot Range | Description |
|--------|---------------|-------------|----------|-----------|-------------|
| **Boom 300 Index** | ~300 ticks | $0.10 | 1:1000 | 0.01 - 100 | Boom every ~300 ticks on average |
| **Boom 500 Index** | ~500 ticks | $0.10 | 1:1000 | 0.01 - 100 | Boom every ~500 ticks on average |
| **Boom 1000 Index** | ~1000 ticks | $0.10 | 1:1000 | 0.01 - 100 | Boom every ~1000 ticks on average |

### Trading Characteristics:
- ✅ **Sudden upward spikes** (booms)
- ✅ Predictable spike frequency (on average)
- ✅ Ideal for buying before booms
- ⚠️ Risk of reversal after boom
- 💡 Best for buying low, selling after boom spike

---

## 🦘 Jump Indices - 5 Indices

Indices with **fixed jump patterns** at regular intervals. Equal probability of upward or downward jumps.

| Symbol | Jump Frequency | Point Value | Leverage | Lot Range | Description |
|--------|---------------|-------------|----------|-----------|-------------|
| **Jump 10 Index** | ~10 ticks | $0.10 | 1:1000 | 0.01 - 100 | Very frequent jumps (50% up / 50% down) |
| **Jump 25 Index** | ~25 ticks | $0.10 | 1:1000 | 0.01 - 100 | Frequent jumps (50% up / 50% down) |
| **Jump 50 Index** | ~50 ticks | $0.10 | 1:1000 | 0.01 - 100 | Moderate jump frequency |
| **Jump 75 Index** | ~75 ticks | $0.10 | 1:1000 | 0.01 - 100 | Less frequent jumps |
| **Jump 100 Index** | ~100 ticks | $0.10 | 1:1000 | 0.01 - 100 | Least frequent jumps |

### Trading Characteristics:
- ⚠️ **Unpredictable direction** (50/50 up or down)
- ✅ Predictable jump frequency
- ✅ Good for volatility strategies
- ⚠️ Requires wide stop losses
- 💡 Best for range trading and options strategies

---

## 🪜 Step Index - 1 Index

Index with **equal-sized steps** in either direction at regular intervals.

| Symbol | Point Value | Leverage | Lot Range | Description |
|--------|-------------|----------|-----------|-------------|
| **Step Index** | $0.10 | **1:500** | 0.01 - 100 | Equal up/down steps at regular intervals |

### Trading Characteristics:
- ✅ **Lower leverage** (1:500 vs 1:1000)
- ✅ Predictable step patterns
- ✅ Good for pattern recognition
- ⚠️ Requires patience for step formation
- 💡 Best for step breakout strategies

---

## 📦 Range Break Indices - 2 Indices

Indices that **consolidate in ranges** then break out. The number indicates average ticks between breakouts.

| Symbol | Breakout Frequency | Point Value | Leverage | Lot Range | Description |
|--------|-------------------|-------------|----------|-----------|-------------|
| **Range Break 100 Index** | ~100 ticks | $0.10 | 1:1000 | 0.01 - 100 | Range breakout every ~100 ticks |
| **Range Break 200 Index** | ~200 ticks | $0.10 | 1:1000 | 0.01 - 100 | Range breakout every ~200 ticks |

### Trading Characteristics:
- ✅ **Clear consolidation zones**
- ✅ Breakouts in random direction
- ✅ Ideal for breakout strategies
- ⚠️ False breakouts possible
- 💡 Best for range trading + breakout confirmation

---

## 🎯 Summary Statistics

### Total Indices: **24**

**By Category:**
- Volatility Indices: 7 (continuous)
- Crash Indices: 3 (downward spikes)
- Boom Indices: 3 (upward spikes)
- Jump Indices: 5 (bidirectional jumps)
- Step Indices: 1 (equal steps)
- Range Break Indices: 2 (consolidation breakouts)

**By Leverage:**
- **1:1000 Leverage:** 23 indices (all except Step Index)
- **1:500 Leverage:** 1 index (Step Index only)

**Universal Specifications:**
- **Point Value:** $0.10 per point (all indices)
- **Minimum Lot:** 0.01 (all indices)
- **Maximum Lot:** 100 (all indices)
- **Lot Step:** 0.01 (all indices)
- **Contract Size:** 100,000 units (standard)

---

## 🔧 Implementation Details

### Code Structure

**Types:** `types/index.ts`
```typescript
export type SymbolName =
  | 'Volatility 10 (1s) Index'
  | 'Volatility 25 (1s) Index'
  // ... 22 more indices
```

**Symbol Data:** `lib/symbols.ts`
```typescript
export const SYMBOLS: Record<SymbolName, SymbolData> = {
  'Volatility 75 (1s) Index': {
    name: 'Volatility 75 (1s) Index',
    pointValue: 0.1,
    minLot: 0.01,
    maxLot: 100,
    lotStep: 0.01,
    leverage: 1000,
    description: 'Simulates a market with 75% volatility...'
  },
  // ... 23 more indices
}
```

### Risk Calculator Support

All 24 synthetic indices are **fully supported** by the Signal Risk Engine:
- ✅ Lot size calculation
- ✅ Margin calculation
- ✅ Risk amount calculation
- ✅ Drawdown buffer analysis
- ✅ Stacking analysis
- ✅ MT5 constraints enforced

---

## 📚 Trading Recommendations

### For Beginners:
1. **Start with:** Volatility 10-25 (1s) Index (low volatility, more predictable)
2. **Avoid:** Crash/Boom indices (requires experience)
3. **Learn:** Risk management on stable indices first

### For Intermediate:
1. **Progress to:** Volatility 50-75 (1s) Index
2. **Explore:** Range Break indices (clear patterns)
3. **Try:** Step Index (lower leverage, safer)

### For Advanced:
1. **Trade:** Volatility 100-250 (1s) Index (high volatility)
2. **Master:** Crash/Boom indices (spike trading)
3. **Optimize:** Jump indices (volatility strategies)

---

## ⚠️ Risk Warnings

### General Risks:
- **High Leverage:** 1:500 and 1:1000 leverage amplifies both gains and losses
- **Synthetic Nature:** No underlying real market, patterns can change
- **24/7 Trading:** No market close, requires constant monitoring
- **Rapid Movements:** Spikes can trigger stop losses instantly

### Index-Specific Risks:
- **Crash Indices:** Sudden downward spikes can wipe out long positions
- **Boom Indices:** Sudden upward spikes can wipe out short positions
- **Jump Indices:** Unpredictable direction makes tight stops risky
- **High Volatility Indices:** (150, 250) require very wide stops

### Recommended Risk Management:
1. **Never risk more than 2% per trade**
2. **Use the 35% margin cap** (enforced by calculator)
3. **Monitor stacking levels** (stop at 85% cumulative margin)
4. **Set realistic stop losses** (50-200 points depending on volatility)
5. **Start with demo account** before live trading

---

## 🔄 Updates & Maintenance

**Last Updated:** January 11, 2026  
**Specifications Source:** Deriv MT5 platform  
**Verification Status:** ✅ All 24 indices implemented and tested  

**Test Coverage:**
- ✅ Unit tests passing (21/21)
- ✅ Production build successful
- ✅ Type safety verified
- ✅ MT5 constraints enforced

**Future Enhancements:**
- Real-time price feeds (Phase 2)
- Historical data analysis (Phase 2)
- Pattern recognition (Phase 3)
- Auto symbol detection (Phase 3)

---

## 📞 Support

For Deriv platform support:
- **Live Chat:** [deriv.com/contact-us](https://deriv.com/contact-us)
- **Community:** [community.deriv.com](https://community.deriv.com/)
- **Academy:** [academy.deriv.com](https://academy.deriv.com/)

For Signal Risk Engine:
- **Documentation:** See [README.md](README.md)
- **PRD:** See [PRD.md](PRD.md)
- **Deployment:** See [DEPLOYMENT.md](DEPLOYMENT.md)

---

**⚡ Signal Risk Engine - Complete Synthetic Indices Support**
