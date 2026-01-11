# signal-risk-engine

User: You are a Senior Product Manager with deep experience in fintech, trading platforms, and risk management tools.
Your task is to generate a complete, structured Product Requirements Document (PRD) based strictly on the information provided below.

The product is an execution-support tool (not a signal provider, not auto-trading).

The PRD must be clear, opinionated, MVP-focused, and suitable for engineers, designers, and stakeholders.

PRODUCT CONTEXT (LOCKED ASSUMPTIONS)

Include this section verbatim.

Product Type: Web-based risk & lot-size enforcement tool
Target Platform: Web App
Broker: Deriv
Trading Platform: MT5
Markets: Synthetic indices only
Assets: All Volatility indices (entire Deriv catalog), Step Index, Step Dex
Audience: Beginner and Intermediate traders
Monetization Direction: Freemium (future)
Trust Model: Black-box calculations with minimal explanation
Signal Generation: Out of scope
Auto-Trading: Out of scope

PRD STRUCTURE TO GENERATE
1. Product Overview

Claude should define:

Product name (working name)

One-paragraph problem statement

One-sentence product vision

Clear value proposition

2. User Problem & Insight

Explain:

Why signal followers fail

Why lot size mistakes and stacking kill small accounts

Why enforcement matters more than advice

3. Target Users & Personas

Include at least:

Beginner trader with $50–$200

Intermediate trader following Telegram signals

Describe goals, pain points, behaviors

4. Core Product Philosophy

Claude must explicitly reflect:

- The app advises, not enforces (soft enforcement)
- The app assumes users may allocate only part of their total balance per trade
- Risk is defined relative to allocated capital, not entire account balance

5. Key Concepts (MUST BE EXPLAINED)

Claude must clearly define:

5.1 Allocated Trade Capital

Example logic:

Total balance: $100

User allocates $10 per trade

Risk calculations apply only to that $10

5.2 Margin Preservation Model

Stacking logic explanation:

Only $3–$4 used as margin

Remaining capital buffers drawdown

Prevents margin calls during volatility

6. Core Use Cases (MVP)

Claude should document flows such as:

User sets account balance

User defines per-trade capital allocation

User selects symbol

User inputs SL

System outputs exact MT5 lot size

System displays risk warning if violated

7. Functional Requirements

Claude must break this into:

7.1 Account Setup

Balance

Allocated capital per trade

Risk style (percentage or fixed amount)

7.2 Risk Engine

Risk per trade

Drawdown buffer logic

Stacking rules (fixed logic)

7.3 Trade Calculator

Symbol selection (all vol indices + step)

SL input

Output: exact lot size (MT5-compliant)

8. Stacking Rules (FIXED LOGIC – NOT CUSTOM)

Claude must reflect this logic:

Stacking is permitted only when:
- Initial margin usage is <= 30–40% of allocated trade capital
- Remaining capital must cover expected drawdown
- Stacks reduce allowable lot size progressively

9. UX / UI Principles

Include:

Minimal UI

No charts

Numeric, form-based interface

Clear warnings (not blocking)

10. Non-Functional Requirements

Claude should include:

Calculation accuracy

Deterministic outputs

Fast response time

MT5 lot-size precision limits

11. Out of Scope (MVP)

Explicitly list:

Auto-execution

Signal copying

Account linking

Performance promises

AI predictions

12. Metrics & Success Criteria

Include:

Calculator usage

Risk violations shown

User retention

Account survival indicators

13. Risks & Mitigations

Claude should cover:

User misunderstanding risk

Over-stacking

Trust in black-box system

14. Future Enhancements (POST-MVP)

Optional but documented:

Telegram signal parsing

MT5 plugin

Account journaling

API access

OUTPUT FORMAT REQUIREMENTS



- Use clear headings
- Use concise paragraphs
- Use bullet points where appropriate
- Write in professional PRD tone
- Avoid marketing fluff
- Avoid code


Generate the full PRD now, strictly following the structure and constraints above.

YOU CAN SEARCH ONLINE IF NEEDED




GitHub Copilot: I'll generate a comprehensive PRD for this risk management tool. Let me create the document now. 

Created [](file:///home/otowo-samuel/Documents/Projects-2026/signal-risk-engine/PRD.md)

I've generated a comprehensive Product Requirements Document (PRD) for the Signal Risk Engine. The document includes:

**Key Highlights:**

- **Clear product positioning** as an execution-support tool (not signal generation or auto-trading)
- **Detailed personas** for beginner and intermediate traders with specific pain points
- **Core philosophy** centered on allocated capital model and margin preservation
- **Comprehensive functional requirements** covering account setup, risk engine, calculator interface, and stacking logic
- **Fixed stacking rules** (30-40% initial margin, 70% cumulative cap)
- **Non-blocking warning system** that advises but doesn't enforce
- **MVP-focused scope** with explicit out-of-scope items
- **Success metrics** focused on usage, retention, and account survival
- **Risk mitigation strategies** for common failure modes
- **Future roadmap** (Telegram integration, MT5 plugin, journaling)

The PRD is structured for engineering teams to begin implementation immediately, with clear functional requirements, technical assumptions, and open questions for architecture decisions. The tone is professional, opinionated, and avoids marketing fluff per your requirements.

The document has been saved to PRD.md in your workspace.

Made changes.

User: Okay which in the image should i use to build this, the best

Workspace: Based on your PRD for the **Signal Risk Engine**, I recommend using **Claude Sonnet 4.5** (which you're currently using, as shown selected in the image).

**Why Claude Sonnet 4.5 is best for this project:**

1. **Complex Logic Requirements:** Your PRD involves sophisticated financial calculations (margin preservation, stacking logic, risk percentage conversions) that require strong reasoning abilities.

2. **Mathematical Accuracy:** The core product depends on deterministic calculations with zero tolerance for errors. Sonnet 4.5 excels at mathematical reasoning.

3. **Structured Output:** You need clean code architecture for calculation engines, input validation, and state management—Sonnet handles this well.

4. **Cost-Effective for MVP:** At 1x cost, it's economical for an MVP development cycle while maintaining high quality.

**Not recommended:**
- **GPT-5.2/GPT-4:** More expensive (3x), overkill for this scope
- **GPT-5 mini/Gemini Flash:** May struggle with complex financial logic validation
- **Grok/Raptor:** Less proven for production-grade financial applications

**For specific tasks, you might use:**
- **GPT-5 mini (0.33x):** Frontend UI components, simple state management
- **Claude Sonnet 4.5:** Core calculation engine, business logic, validation rules

Stick with **Claude Sonnet 4.5** as your primary model for building the Signal Risk Engine MVP.

User: so what prompt should i give to build from this PRD?

GitHub Copilot: Here's a **structured prompt sequence** to build the Signal Risk Engine from the PRD:

---

## **Phase 1: Project Setup & Architecture**

```
You are a senior full-stack engineer. Based on the PRD in PRD.md, create:

1. Project architecture recommendation:
   - Tech stack (React/Next.js vs Vue vs vanilla JS)
   - State management approach
   - File/folder structure
   - Why this stack fits the MVP requirements

2. Generate a complete project scaffold with:
   - Package.json with dependencies
   - Folder structure
   - Configuration files (tsconfig, eslint, etc.)
   - README with setup instructions

Focus on: Fast development, mobile-first, minimal dependencies, easy deployment.
```

---

## **Phase 2: Core Calculation Engine**

```
Build the Risk Calculation Engine module based on Section 7.2 of PRD.md.

Requirements:
1. Create a TypeScript/JavaScript module with functions for:
   - calculateMaxLotSize(allocatedCapital, slPoints, symbolPointValue)
   - calculateMargin(lotSize, symbol)
   - calculateDrawdownBuffer(allocatedCapital, marginRequired)
   - validateStackingRisk(openPositions, newPosition)

2. Use the formulas from Section 7.2 and Appendix A.2

3. Include:
   - Input validation
   - MT5 lot size constraints (min: 0.01, step: 0.01)
   - Comprehensive unit tests with edge cases

4. Symbol data structure for Deriv synthetics (V10, V25, V50, V75, V100, Step Index)

Output clean, documented code with TypeScript types.
```

---

## **Phase 3: UI Components**

```
Create React/Vue components for the Signal Risk Engine UI based on Section 9 (UX/UI Principles).

Components needed:
1. AccountSetup - collects balance, allocated capital, risk style (Section 7.1)
2. TradeCalculator - symbol selector, SL input, lot size output (Section 7.3)
3. StackingTracker - manual position tracking (Section 7.4)
4. WarningDisplay - color-coded risk warnings (Section 8.5)

Design principles from PRD:
- Minimal, form-based interface (no charts)
- Mobile-first (large touch targets)
- Primary focus: large bold lot size
- Copy-to-clipboard button
- Non-blocking warnings (yellow/red)

Use Tailwind CSS. Show me the component code for AccountSetup first.
```

---

## **Phase 4: State Management**

```
Implement state management for Signal Risk Engine based on PRD Section 7.

Requirements:
1. Store in browser localStorage:
   - User settings (balance, allocated capital, risk style)
   - Open positions (for stacking calculations)

2. Create hooks/composables for:
   - useSettings() - persist and retrieve account settings
   - useCalculator() - manage calculation inputs/outputs
   - usePositions() - track open positions for stacking

3. Handle:
   - Input debouncing (300ms)
   - Validation errors
   - Real-time recalculation

Use React Context + localStorage or Zustand. Show implementation.
```

---

## **Phase 5: Integration & Testing**

```
Based on PRD.md:

1. Integrate all components into a single-page app
2. Add calculation flow from Section 6 (Core Use Cases)
3. Implement warning logic from Section 8 (Stacking Rules)
4. Add input validation from Section 7

Then create:
- Integration tests for complete user flows
- Test cases from Section 12.6 (calculation accuracy audit)
- Error handling for edge cases (Appendix C)

Show me the main App component and test setup.
```

---

## **Phase 6: Polish & Deployment**

```
Final MVP polish for Signal Risk Engine:

1. Add disclaimer text (Section 13.5 - legal liability)
2. Implement "Show Math" toggle (Section 13.4 mitigation)
3. Add tooltips for "Allocated Capital" (Section 13.1 mitigation)
4. Mobile optimization checks
5. Accessibility (WCAG 2.1 Level A - Section 10.6)

Then provide:
- Deployment guide (Vercel/Netlify recommended)
- Environment variables setup
- Performance optimization checklist

Show deployment configuration and final checklist.
```

---

## **Alternative: Single Comprehensive Prompt**

If you want to build faster with one prompt:

```
You are a senior full-stack engineer. Build a complete MVP web app from the PRD in PRD.md.

**Requirements:**
1. Tech stack: Next.js 14 (App Router), TypeScript, Tailwind CSS
2. Single-page application (mobile-first)
3. Implement ALL functional requirements from Section 7
4. Use calculation formulas from Section 7.2 and Appendix A.2
5. Follow UI principles from Section 9 (minimal, form-based)
6. Include localStorage persistence
7. Add unit tests for calculation engine
8. Implement warning system from Section 8

**Deliverables:**
- Complete project scaffold
- Core calculation engine with tests
- All UI components (AccountSetup, TradeCalculator, StackingTracker)
- Integration and deployment-ready code

Start with project setup and folder structure. After I approve, build components one by one.
```

---

## **Recommended Approach:**

Use **Phase-by-Phase prompts** because:
- ✅ Allows you to review/test each module
- ✅ Easier to debug issues early
- ✅ You can iterate on UI before moving forward
- ✅ Matches PRD's MVP-focused philosophy

Start with **Phase 1** now. Would you like me to proceed with that?