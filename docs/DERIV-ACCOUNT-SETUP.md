# Deriv Account Integration - Account Settings Setup

## Overview
The Account Settings panel now dynamically integrates with your connected Deriv MT5 account, providing live balance updates and real/demo account awareness.

## Features Implemented

### 1. **Live Balance Syncing**
- When you connect your Deriv API token, the MT5 balance automatically populates in Account Settings
- Balance updates in real-time as you toggle between Real and Demo accounts
- In edit mode, the balance field is **read-only** when connected (grayed out)
- If not connected, you can manually enter a balance for testing

### 2. **Real/Demo Account Badge**
- Summary view displays a visual badge showing which account type is active:
  - **GREEN "LIVE"** - Real money account
  - **AMBER "DEMO"** - Practice account
- Badge appears only when Deriv account is connected

### 3. **Connection Status Indicator**
- Green checkmark shows "✓ Connected to {Demo/Real} MT5 Account"
- Confirms that your account settings are pulling live data

### 4. **Target Margin Configuration**
- Remains fully editable (10-80% range)
- Persists to localStorage automatically
- Used for position sizing calculations
- Independent of account balance

## How It Works

### Without Deriv Connection
```
User manually enters MT5 Balance
     ↓
Account Settings uses manual value
     ↓
Position calculations based on manual balance
```

### With Deriv Connection
```
User connects Deriv API token
     ↓
useDerivAPI hook fetches live MT5 account
     ↓
AccountSetup component auto-syncs balance
     ↓
Balance field becomes read-only (shows live value)
     ↓
Position calculations use LIVE account balance
```

## Component Changes

### AccountSetup.tsx
**Added:**
- `useDerivAPI` hook integration to access:
  - `account` - Live account data with balance
  - `isAuthorized` - Connection status
  - `useDemo` - Which account type is active
  
- `useEffect` hook to auto-sync balance whenever:
  - Account is authorized
  - Account balance changes
  - Account type is toggled (Real ↔ Demo)

**Updated:**
- Balance input disabled when `isAuthorized === true`
- Display shows live balance from `account.balance` when connected
- Summary view shows account type badge and connection status
- Help text changes based on connection state

## Usage Flow

### Step 1: Open Account Settings
Click **Edit** on the Account Settings card

### Step 2: Connect Deriv Account (if not already)
1. Go to **Deriv API Connection** section above
2. Paste your Deriv API token
3. Click **Authorize**

### Step 3: Configure Settings
- **MT5 Balance**: Auto-populated from your connected account (read-only)
- **Target Margin**: Adjust your target margin percentage (10-80%)
  - Default: 35%
  - Recommended: 30-40%

### Step 4: Save
- Click **Save Settings**
- Settings persist to localStorage
- Position calculations automatically use updated values

### Step 4b: Switch Account Type (Optional)
- Toggle between **Real Account** and **Demo Account** in Deriv Connection
- Account Settings automatically updates to show the selected account's balance

## Integration with Position Sizing

Your Account Settings are automatically used by:
- **Trade Calculator** - Uses target margin for position sizing
- **Stacking Tracker** - Uses balance for available margin calculations
- **Position Sizing Logic** - Respects both balance and target margin

## Technical Details

### Data Flow
```typescript
// In AccountSetup.tsx
useEffect(() => {
  if (isAuthorized && account?.balance) {
    // Auto-sync live balance to settings store
    updateSettings({ mt5Balance: account.balance });
  }
}, [account?.balance, isAuthorized, updateSettings]);
```

### Balance Display Logic
```tsx
// Shows live balance if connected, otherwise shows stored value
${isAuthorized && account?.balance 
  ? account.balance.toFixed(2) 
  : settings.mt5Balance.toFixed(2)
}
```

### Read-Only When Connected
```tsx
disabled={isAuthorized}  // Field disabled when Deriv connected
className={isAuthorized ? 'opacity-60 cursor-not-allowed' : ''}
```

## Troubleshooting

### Balance not updating?
1. Verify token is pasted correctly (DerivConnection should show green dot)
2. Check browser console for errors
3. Try toggling between Real/Demo accounts
4. Refresh the page

### Want to use manual balance?
1. Disconnect your Deriv account (click **Disconnect** in Deriv Connection)
2. MT5 Balance field becomes editable again
3. Enter your desired balance and click **Save Settings**

### Which balance is being used?
- **Connected account**: Live balance from Deriv MT5 account (auto-updated)
- **Manual entry**: Only used when Deriv is disconnected
- **Validation**: Never changes Target Margin without your approval

## Next Steps

Once Account Settings are configured:
1. Go to **Trade Calculator** to size positions
2. View **Stacking Analysis** to see margin usage
3. Add positions to **Stacking Tracker** to monitor live margin
4. Use **Real Account** for live trading, **Demo** for testing

---

**Status**: ✅ Fully Integrated
- Live balance syncing: Working
- Real/Demo awareness: Working
- Target margin editing: Working
- localStorage persistence: Working
