# Product Requirements Document (PRD)
## Signal Risk Engine

**Version:** 1.0 (MVP)  
**Date:** January 10, 2026  
**Status:** Draft for Review  
**Owner:** Product Management

---

## Product Context (Locked Assumptions)

**Product Type:** Web-based risk & lot-size enforcement tool  
**Target Platform:** Web App  
**Broker:** Deriv  
**Trading Platform:** MT5  
**Markets:** Synthetic indices only  
**Assets:** All Volatility indices (entire Deriv catalog), Step Index, Step Dex  
**Audience:** Beginner and Intermediate traders  
**Monetization Direction:** Freemium (future)  
**Trust Model:** Black-box calculations with minimal explanation  
**Signal Generation:** Out of scope  
**Auto-Trading:** Out of scope

---

## 1. Product Overview

### Product Name
**Signal Risk Engine** (working name)

### Problem Statement
Beginner and intermediate traders following Telegram signals on Deriv's synthetic indices consistently blow their accounts—not because signals are bad, but because they miscalculate lot sizes, stack positions recklessly, and misunderstand margin requirements. Even when traders know their risk percentage, they lack a reliable tool to translate that into MT5-compliant lot sizes that account for allocated capital, margin preservation, and stacking exposure. The result is preventable margin calls and account wipeouts.

### Product Vision
A zero-friction web calculator that tells traders the exact MT5 lot size to use—so they can follow signals without destroying their accounts.

### Value Proposition
Signal Risk Engine removes the guesswork from position sizing by calculating precise, MT5-compatible lot sizes based on allocated trade capital, stop-loss distance, and margin-safe stacking rules—helping traders preserve accounts long enough to see if their strategy works.

---

## 2. User Problem & Insight

### Why Signal Followers Fail

Most signal services provide entry price, stop-loss, and take-profit—but they don't tell followers what lot size to use. Users following signals with $50–$500 accounts often:

- Use lot sizes intended for $10,000 accounts
- Calculate risk as a percentage of total balance, not allocated capital
- Ignore margin requirements and over-leverage
- Stack multiple positions without understanding cumulative exposure

### Why Lot Size Mistakes Kill Small Accounts

A 2% risk rule sounds safe, but when applied incorrectly:

- User with $100 calculates 2% = $2 risk
- Uses full balance as margin, leaving no drawdown buffer
- MT5 margin call triggers at 50% equity—wipeout happens before SL is hit

On synthetic indices with high volatility (e.g., Volatility 75), a single tick against the position can move 5–10% of margin instantly.

### Why Enforcement Matters More Than Advice

Traders know they should "risk small" but lack the tools to operationalize it. Educational content doesn't prevent mistakes at execution time. What's needed is a real-time calculator that outputs exact MT5 lot sizes with built-in guardrails—not advice, but actionable numbers.

---

## 3. Target Users & Personas

### Persona 1: **Beginner Signal Follower**

**Profile:**
- Age: 22–35
- Account size: $50–$200
- Experience: 3–12 months trading
- Platform: Deriv MT5 on mobile/web
- Signal source: Telegram groups (free/paid)

**Goals:**
- Follow signals without blowing account
- Understand why previous trades failed
- Survive long enough to learn

**Pain Points:**
- Doesn't understand margin vs. balance
- Copies lot sizes from screenshots without adjustment
- Gets margin called before SL is hit
- Loses confidence after 2–3 failures

**Behaviors:**
- Trades 3–8 times per week
- Uses entire balance per trade
- Stacks 2–4 positions without checking exposure
- Blames broker or signals, not position sizing

---

### Persona 2: **Intermediate Trader (Semi-Experienced)**

**Profile:**
- Age: 28–45
- Account size: $200–$1,000
- Experience: 1–3 years trading
- Platform: Deriv MT5 on desktop
- Signal source: Paid Telegram, own analysis

**Goals:**
- Implement proper risk management
- Use stacking strategically
- Scale account sustainably

**Pain Points:**
- Knows risk concepts but struggles with execution
- Manually calculates lot sizes in Excel (time-consuming, error-prone)
- Uncertain about safe stacking limits
- Lost money due to over-leveraging, now risk-averse

**Behaviors:**
- Trades 5–15 times per week
- Allocates 10–20% of balance per trade
- Wants to stack but fears over-exposure
- Seeks validation for position sizing decisions

---

## 4. Core Product Philosophy

Signal Risk Engine is built on three foundational principles:

### 4.1 Advisory, Not Enforced
The application **advises** users on proper lot sizing but does not enforce trade execution. Users remain in full control—the tool calculates and warns, but never blocks or executes trades. This maintains user autonomy while providing critical decision-support.

### 4.2 Allocated Capital Model
Risk calculations are **not** performed against total account balance. Instead, the system assumes users allocate a portion of their balance per trade (e.g., $10 out of $100). This reflects real-world trading psychology where traders mentally partition capital across multiple opportunities.

### 4.3 Margin Preservation Priority
The tool prioritizes **margin preservation over maximum position size**. Calculations ensure that only 30–40% of allocated capital is used as initial margin, leaving 60–70% as a drawdown buffer. This prevents margin calls during normal volatility before the stop-loss is triggered.

**Core Assumption:** Traders will blow accounts if they max out margin usage—even if stop-losses are in place—because synthetic indices move fast and brokers liquidate at 50% margin level.

---

## 5. Key Concepts (Must Be Explained)

### 5.1 Allocated Trade Capital

**Definition:**  
Allocated Trade Capital is the portion of a trader's total account balance designated for a specific trade or trading session. It is **not** the entire account balance.

**Example:**
- Total Balance: $100
- Allocated Capital per Trade: $10 (user-defined)
- Risk calculations apply only to the $10

**Why This Matters:**  
Traditional risk calculators assume 100% of balance is available per trade. This is unrealistic for:
- Traders stacking multiple positions
- Traders preserving capital for future signals
- Psychological comfort (not "all-in" on one trade)

By working with allocated capital, the tool respects how traders actually think about their money.

---

### 5.2 Margin Preservation Model

**Definition:**  
The Margin Preservation Model ensures that initial margin usage consumes only **30–40%** of allocated trade capital, leaving the remaining **60–70%** as a buffer against drawdown before the stop-loss is hit.

**Why Margin Preservation Matters:**

On Deriv MT5, margin calls trigger at **50% equity**. If a trader uses 100% of allocated capital as margin:
- A 50% drawdown = margin call
- Stop-loss never gets a chance to execute
- Account wipes out faster than SL can protect

**Stacking Logic:**
- Trade 1 uses 30% of allocated capital as margin → safe
- Trade 2 adds another 30% → cumulative 60% → still acceptable
- Trade 3 would push to 90% → **system warns against stacking further**

**MT5 Reality Check:**  
Volatility indices (V75, V100) can spike 10–20 points in seconds. If margin is maxed out, the position liquidates before the market reaches SL. Margin preservation keeps traders in the game.

---

## 6. Core Use Cases (MVP)

### Use Case 1: Single Trade Position Sizing
**Actor:** Trader following a Telegram signal  
**Precondition:** User has set account balance and allocated capital per trade

**Flow:**
1. User receives signal: "Buy Volatility 75, SL = 50 points"
2. User opens Signal Risk Engine web app
3. User selects **Volatility 75** from symbol dropdown
4. User inputs **Stop Loss: 50 points**
5. System calculates and displays:
   - Maximum safe lot size: **0.04 MT5 lots**
   - Margin required: **$3.20** (32% of $10 allocated)
   - Risk amount: **$2.00** (2% of $100 balance)
6. User copies lot size to MT5 and executes manually

---

### Use Case 2: Stacking Validation
**Actor:** Intermediate trader with 2 open positions considering a 3rd

**Flow:**
1. User has 2 positions open (manually entered into app or recalled)
2. User receives new signal
3. User inputs SL for new position
4. System calculates:
   - Cumulative margin usage: **68%** of allocated capital
   - Remaining buffer: **32%**
5. **System displays warning:**  
   *"⚠️ Stacking Risk: 68% margin used. Consider closing a position first or reducing lot size."*
6. User decides to reduce lot size from 0.04 to 0.02
7. System recalculates: **54% cumulative margin → acceptable**

---

### Use Case 3: Risk Style Selection
**Actor:** New user setting up account for first time

**Flow:**
1. User navigates to **Settings**
2. User enters:
   - Total Balance: **$100**
   - Allocated Capital per Trade: **$10**
   - Risk Style: **Percentage-based (2%)**
3. System saves preferences
4. All future calculations use these parameters
5. User can toggle between **Fixed Dollar Risk** or **Percentage Risk**

---

## 7. Functional Requirements

### 7.1 Account Setup Module

**FR-1.1:** User must input **Total Account Balance** (numeric, $1–$1,000,000)  
**FR-1.2:** User must define **Allocated Capital per Trade** (numeric, <= Total Balance)  
**FR-1.3:** User must select **Risk Style:**
- Option A: Percentage-based (0.5%–5% per trade)
- Option B: Fixed Dollar Amount ($1–$100 per trade)

**FR-1.4:** System must validate:
- Allocated capital ≤ Total balance
- Risk percentage > 0 and ≤ 5%
- Fixed risk amount > 0 and < Allocated capital

**FR-1.5:** Settings must persist across sessions (browser localStorage)

---

### 7.2 Risk Calculation Engine

**FR-2.1:** System must calculate **Maximum Safe Lot Size** using:
```
Max Lot Size = (Allocated Capital × 0.35) / (SL Points × Point Value)
```
Where:
- 0.35 = 35% margin usage cap (configurable internally)
- SL Points = User-defined stop loss distance
- Point Value = MT5 tick value for selected symbol

**FR-2.2:** System must enforce **MT5 lot size constraints:**
- Minimum: 0.01 lots
- Maximum: 100 lots (broker-dependent, use conservative default)
- Step: 0.01 lots

**FR-2.3:** System must display:
- Recommended lot size (MT5-formatted, 2 decimals)
- Margin required in dollars
- Risk amount in dollars
- Risk as percentage of total balance

**FR-2.4:** System must calculate **drawdown buffer:**
```
Buffer = Allocated Capital - Margin Required
Buffer % = (Buffer / Allocated Capital) × 100
```

**FR-2.5:** If Buffer < 50%, display **high-risk warning**

---

### 7.3 Trade Calculator Interface

**FR-3.1:** Symbol Selector must include:
- All Volatility indices: V10, V25, V50, V75, V100
- Step Index
- Step Dex 1s

**FR-3.2:** Stop Loss Input:
- Numeric field (points, not pips)
- Validation: SL > 0, SL < 1000 (prevent absurd values)

**FR-3.3:** Output Display:
- **Large, bold lot size** (primary focus)
- Margin, risk, buffer displayed as secondary info
- Copy button for lot size (clipboard)

**FR-3.4:** System must recalculate instantly on input change (debounced, 300ms delay)

---

### 7.4 Stacking Logic (Fixed Rules)

**FR-4.1:** User can manually track open positions:
- Symbol
- Lot size
- Margin used

**FR-4.2:** System calculates **cumulative margin:**
```
Total Margin = Sum of all open position margins + New position margin
```

**FR-4.3:** Stacking is flagged as **risky** if:
- Cumulative margin > 70% of allocated capital

**FR-4.4:** Stacking is flagged as **dangerous** if:
- Cumulative margin > 85% of allocated capital

**FR-4.5:** System does **not block** stacking—only displays warnings

---

## 8. Stacking Rules (Fixed Logic – Not Custom)

Stacking (opening multiple positions simultaneously) is permitted only under the following conditions:

### 8.1 Initial Margin Threshold
- **Rule:** Each individual position must use ≤ 30–40% of allocated trade capital as initial margin
- **Rationale:** Ensures first position is safely margined before adding more

### 8.2 Cumulative Margin Cap
- **Rule:** Total margin across all open positions must not exceed 70% of allocated capital
- **Rationale:** Maintains 30% buffer for volatility/drawdown

### 8.3 Progressive Lot Size Reduction
- **Rule:** When stacking, subsequent positions should use smaller lot sizes
- **Example:**
  - Position 1: 0.04 lots (30% margin)
  - Position 2: 0.03 lots (22% margin)
  - Position 3: 0.02 lots (15% margin)
  - **Total:** 67% margin usage → acceptable

### 8.4 No Manual Override
- Users cannot customize stacking thresholds in MVP
- Fixed logic prevents analysis paralysis
- Future versions may expose advanced settings

### 8.5 Warning System
- **Yellow Warning (60–70%):** "Moderate stacking risk—consider exit plan"
- **Red Warning (70%+):** "High margin usage—new positions may cause liquidation"

---

## 9. UX / UI Principles

### 9.1 Minimal, Utilitarian Design
- No charts, no graphs, no visualizations
- Single-page form interface
- Focus: Numbers in, numbers out

### 9.2 Hierarchy of Information
**Primary (Large, Bold):**
- MT5 Lot Size

**Secondary (Medium, Regular):**
- Margin Required
- Risk Amount

**Tertiary (Small, Gray):**
- Buffer %, Warnings

### 9.3 Non-Blocking Warnings
- Warnings use color (yellow/red) and icons (⚠️)
- Never disable calculation or hide results
- User remains in control

### 9.4 Mobile-First
- 80% of users trade on mobile
- Large touch targets (min 44px)
- Numeric inputs optimized for phone keyboards

### 9.5 No Marketing Fluff
- No "AI-powered" claims
- No "guaranteed profit" language
- Clinical, factual tone

### 9.6 Copy-Paste Optimized
- One-click copy for lot size
- Clear labeling: "Use this value in MT5"

---

## 10. Non-Functional Requirements

### 10.1 Calculation Accuracy
- **Requirement:** Lot size calculations must be deterministic and accurate to 2 decimal places
- **Validation:** Unit tests for all calculation functions with known inputs/outputs

### 10.2 Performance
- **Response Time:** Calculation results must display within 100ms of input change
- **Debouncing:** Input fields debounced at 300ms to prevent excessive recalculations

### 10.3 MT5 Compliance
- **Lot Size Precision:** Must match MT5's 0.01 lot increments
- **Margin Calculations:** Must align with Deriv MT5 margin requirements (leverage-adjusted)

### 10.4 Browser Compatibility
- **Supported:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile:** iOS Safari, Chrome Mobile

### 10.5 Data Persistence
- **Settings:** Stored in browser localStorage
- **No Server Storage:** MVP does not store user data server-side

### 10.6 Accessibility
- **WCAG 2.1 Level A** compliance minimum
- Keyboard navigation support
- Screen reader-friendly labels

### 10.7 Reliability
- **Uptime:** 99%+ (static web app, minimal backend)
- **Graceful Degradation:** If calculation fails, display error message, never show incorrect lot size

---

## 11. Out of Scope (MVP)

The following features are explicitly **not included** in the MVP release:

### 11.1 Execution Features
- ❌ Auto-trading / trade execution
- ❌ MT5 account linking
- ❌ One-click trade placement
- ❌ API integration with Deriv

### 11.2 Signal Features
- ❌ Signal generation
- ❌ Telegram signal parsing
- ❌ Entry/exit recommendations
- ❌ Technical analysis tools

### 11.3 Advanced Features
- ❌ Trade journaling
- ❌ Performance tracking
- ❌ Win/loss statistics
- ❌ Multi-account support
- ❌ Account syncing

### 11.4 Education / Content
- ❌ Tutorials
- ❌ Risk management courses
- ❌ Webinars
- ❌ In-app chat support

### 11.5 Guarantees / Promises
- ❌ Performance guarantees
- ❌ Profit projections
- ❌ AI/ML predictions
- ❌ "Holy grail" marketing

### 11.6 Customization
- ❌ Custom margin thresholds
- ❌ User-defined stacking rules
- ❌ White-label versions

**Rationale for Exclusions:**  
MVP focuses on core calculation accuracy and usability. Feature bloat increases development time and risk. These features may be considered post-launch based on user feedback.

---

## 12. Metrics & Success Criteria

### 12.1 Usage Metrics (Primary)
- **Calculator Sessions per User:** Target >3 per week (indicates regular use)
- **Calculation Completions:** Target 95%+ (users finish input → see result)
- **Copy Button Clicks:** Target 80%+ (users actually use the output)

### 12.2 Risk Behavior Metrics
- **Warning Display Rate:** % of calculations triggering warnings (expect 30–50% in early use)
- **High-Risk Overrides:** % of users proceeding despite red warnings (monitor for educational needs)

### 12.3 Retention Metrics
- **Day 7 Retention:** Target 40%+ (users return after 1 week)
- **Day 30 Retention:** Target 20%+ (indicates habit formation)

### 12.4 Account Survival Indicators (Indirect)
- **User Self-Reported:** Survey "Has this tool helped you avoid account losses?" (Target: 70%+ "Yes")
- **Support Tickets:** Track user reports of margin calls despite using tool (Target: <5%)

### 12.5 Product-Market Fit Signals
- **Organic Shares:** Users sharing tool in Telegram groups (qualitative monitoring)
- **Feature Requests:** Volume and themes (prioritize post-MVP roadmap)

### 12.6 Technical Health
- **Error Rate:** <0.1% of calculations
- **Calculation Accuracy Audit:** Quarterly manual verification against known test cases

---

## 13. Risks & Mitigations

### 13.1 Risk: User Misunderstands "Allocated Capital"
**Impact:** Users input total balance instead of per-trade allocation → incorrect lot sizes  
**Likelihood:** High (unfamiliar concept)  
**Mitigation:**
- Clear tooltip: "How much of your balance do you want to risk on this trade?"
- Example values displayed: "e.g., $10 if balance is $100"
- Validation: Alert if allocated capital > 50% of balance

---

### 13.2 Risk: Users Over-Stack Despite Warnings
**Impact:** Margin calls occur, users blame tool  
**Likelihood:** Medium (users ignore warnings)  
**Mitigation:**
- Escalating warning severity (yellow → red)
- Display consequences: "Margin call likely at 50% drawdown"
- Post-MVP: Track open positions automatically (no manual input)

---

### 13.3 Risk: MT5 Margin Requirements Change
**Impact:** Calculations become inaccurate if Deriv adjusts leverage/margin rules  
**Likelihood:** Low (infrequent)  
**Mitigation:**
- Monitor Deriv announcements
- Build admin panel to update margin parameters without code changes
- Display disclaimer: "Margin calculations based on current Deriv MT5 settings"

---

### 13.4 Risk: Users Don't Trust Black-Box Calculations
**Impact:** Low adoption, users default to manual calculations  
**Likelihood:** Medium (skepticism is healthy in trading)  
**Mitigation:**
- Provide "Show Math" toggle (displays formula with user's values plugged in)
- Educational pop-up: "Why we calculate this way"
- Social proof: Testimonials from beta users

---

### 13.5 Risk: Legal Liability for Trading Losses
**Impact:** Users lose money, claim tool gave bad advice, legal action  
**Likelihood:** Low (but high severity)  
**Mitigation:**
- Prominent disclaimer on every page: "Educational tool only. Not financial advice."
- Terms of Service requiring acceptance before use
- No execution = reduced liability (users manually place trades)
- Consult legal counsel before launch

---

### 13.6 Risk: Competitive Tools Emerge
**Impact:** Users switch to feature-rich alternatives  
**Likelihood:** Medium (low barrier to entry)  
**Mitigation:**
- Speed to market (MVP in 4–6 weeks)
- Focus on accuracy and trust, not features
- Build community (Telegram group for users)
- Post-MVP: Differentiate with Deriv-specific optimizations

---

## 14. Future Enhancements (Post-MVP)

These features are **not in MVP** but documented for future consideration:

### 14.1 Telegram Integration (Phase 2)
- Parse signal messages automatically
- Extract symbol, SL, TP
- Pre-fill calculator
- One-click lot size retrieval

**Benefit:** Reduces manual input errors  
**Complexity:** Medium (requires Telegram bot API)

---

### 14.2 MT5 Plugin / API Integration (Phase 3)
- Desktop plugin for MT5 terminal
- Right-click on chart → calculate lot size
- Optional: One-click trade placement

**Benefit:** Eliminates copy-paste step  
**Complexity:** High (MT5 API, installation friction)

---

### 14.3 Position Tracking Dashboard (Phase 2)
- Sync open positions from MT5 (read-only)
- Auto-calculate cumulative margin
- Real-time stacking alerts

**Benefit:** Eliminates manual position entry  
**Complexity:** Medium (requires MT5 account linking)

---

### 14.4 Trade Journal (Phase 3)
- Log all trades (manual or auto-synced)
- Track which signals/strategies work
- P&L analysis

**Benefit:** Helps users improve over time  
**Complexity:** High (database, auth, privacy concerns)

---

### 14.5 Multi-Broker Support (Phase 4)
- Expand beyond Deriv (e.g., Exness, XM)
- Different margin/leverage rules
- Symbol catalog management

**Benefit:** Larger addressable market  
**Complexity:** High (broker-specific logic)

---

### 14.6 Premium Tier (Monetization - Phase 2)
**Free Tier:**
- Basic calculator
- 10 calculations per day

**Premium ($5–10/month):**
- Unlimited calculations
- Position tracking
- Telegram parsing
- Priority support

**Benefit:** Revenue stream for sustainability  
**Complexity:** Medium (payment integration, feature gating)

---

### 14.7 Educational Content Library (Phase 3)
- Video tutorials on risk management
- Case studies (anonymized user trades)
- Glossary (margin, drawdown, stacking)

**Benefit:** Reduces support burden, builds trust  
**Complexity:** Low (content creation, not engineering)

---

### 14.8 Community Features (Phase 3)
- User forum (Discord/Telegram)
- Share anonymized trade setups
- Peer feedback on risk levels

**Benefit:** Network effects, retention  
**Complexity:** Medium (moderation required)

---

## Appendix A: Technical Assumptions

### A.1 MT5 Symbol Parameters (Deriv Synthetics)
- **Volatility 10:** Point value = $0.10, Min lot = 0.01, Leverage = 1:1000
- **Volatility 75:** Point value = $0.10, Min lot = 0.01, Leverage = 1:1000
- **Step Index:** Point value = $0.10, Min lot = 0.01, Leverage = 1:500

*(Full symbol specification table required during development)*

### A.2 Margin Calculation Formula
```
Margin Required = (Lot Size × Contract Size × Entry Price) / Leverage
```
For Deriv synthetics with 1:1000 leverage:
```
Margin ≈ (Lot Size × 100,000 × Current Price) / 1000
```

### A.3 Browser Storage Limits
- LocalStorage: 5–10MB per domain (sufficient for MVP settings)

---

## Appendix B: Glossary

**Allocated Trade Capital:** The portion of total account balance a user designates for a single trade.

**Drawdown Buffer:** Unused capital remaining after margin is reserved, used to absorb adverse price movement.

**Margin Call:** Broker-initiated liquidation when account equity falls below margin maintenance level (typically 50%).

**Margin Preservation:** Design philosophy prioritizing low initial margin usage to prevent liquidation.

**MT5 Lot:** Standard trading unit in MetaTrader 5 (0.01 = micro lot = 1,000 units of base currency).

**Stacking:** Opening multiple positions simultaneously, increasing cumulative margin usage.

**Synthetic Indices:** Deriv-proprietary simulated markets (Volatility indices, Step indices) based on random number generation.

---

## Appendix C: Open Questions for Engineering

1. **Backend Architecture:** Static site (JAMstack) vs. lightweight API server?
2. **Symbol Data Source:** Hardcoded JSON vs. fetch from Deriv API?
3. **Calculation Library:** Custom JavaScript vs. existing financial libraries?
4. **Error Handling:** How to gracefully handle edge cases (e.g., SL = 0, allocated capital = 0)?
5. **Analytics:** Google Analytics vs. privacy-focused alternative (Plausible, Fathom)?

---

## Sign-Off

**Product Manager:** ___________________  
**Engineering Lead:** ___________________  
**Design Lead:** ___________________  
**Date:** ___________________

---

**Document End**
