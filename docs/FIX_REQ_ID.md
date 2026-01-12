# Fix: Deriv API req_id Format Error

## Problem
**Error**: `Authorization failed: Input validation failed: req_id`

The Deriv API was rejecting authorization requests due to invalid `req_id` format.

## Root Cause
According to the official [Deriv API Documentation](https://developers.deriv.com/docs/), the `req_id` field must be a **Number**, not a String.

The code was creating `req_id` as a string:
```typescript
// ❌ WRONG - String format
const reqId = `auth_${Date.now()}_${Math.random()}`;
```

## Solution
Changed `req_id` to be a numeric value as required by Deriv API:

### Changes Made:

#### 1. **Updated Map Type** (lib/deriv-api.ts, line 45)
```typescript
// Before:
private messageCallbacks: Map<string, (data: any) => void> = new Map();

// After:
private messageCallbacks: Map<number, (data: any) => void> = new Map();
```

#### 2. **Added Request Counter** (lib/deriv-api.ts, line 50)
```typescript
// New field to ensure unique numeric IDs
private requestCounter = 0;
```

#### 3. **Fixed send() Method** (lib/deriv-api.ts, line 161)
```typescript
// Before:
const reqId = `req_${Date.now()}_${Math.random()}`;

// After:
this.requestCounter++;
const reqId = Date.now() + this.requestCounter; // Unique numeric ID
```

#### 4. **Fixed authorize() Method** (lib/deriv-api.ts, line 226)
```typescript
// Before:
const reqId = `auth_${Date.now()}_${Math.random()}`;

// After:
this.requestCounter++;
const reqId = Date.now() + this.requestCounter; // Unique numeric ID
```

#### 5. **Fixed WebSocket Null Check** (lib/deriv-api.ts, line 92)
Added proper null safety check for WebSocket event handlers to resolve TypeScript compilation error.

## Technical Details

**Why the fix works:**
- Deriv API strictly requires `req_id` as a numeric field
- Using `Date.now() + this.requestCounter` ensures:
  - ✅ Numeric format (required by API)
  - ✅ Unique IDs (even if multiple requests in same millisecond)
  - ✅ Simple, no random floating-point precision issues
  - ✅ Sortable for debugging

**Validation Against Deriv Docs:**
From https://developers.deriv.com/docs/:
```
• `args.req_id` [Number] [Optional] Used to map request to response.
```

## Testing

After applying the fix:
1. ✅ TypeScript compilation succeeds
2. ✅ Build passes without errors
3. ✅ Ready for deployment

## Next Steps

1. **Test Authorization**: Paste a valid Deriv API token from https://app.deriv.com/account/api-token
2. **Expected Result**: Authorization should succeed with numeric `req_id` format
3. **Verify Console Logs**: Should show "✅ Successfully authorized" instead of validation error

## Files Modified
- [lib/deriv-api.ts](lib/deriv-api.ts) - All req_id format changes
