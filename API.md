# API Reference

Complete API reference for the InventPay Payment SDK.

## Table of Contents

- [Initialization](#initialization)
- [Payments](#payments)
- [Withdrawals](#withdrawals)
- [Balances](#balances)
- [Transactions](#transactions)
- [Webhooks](#webhooks)
- [Merchant](#merchant)
- [Types](#types)
- [Error Handling](#error-handling)

## Initialization

### `new PaymentSDK(config)`

Creates a new SDK instance.

**Parameters:**

- `config.apiKey` (string, required) - Your API key
- `config.baseUrl` (string, optional) - API base URL (default: `https://api.inventpay.com`)
- `config.timeout` (number, optional) - Request timeout in milliseconds (default: 30000)

**Example:**

```typescript
const sdk = new PaymentSDK({
  apiKey: 'pk_live_...',
  baseUrl: 'https://api.inventpay.com',
  timeout: 30000
});
```

---

## Payments

### `createPayment(data)`

Creates a new payment.

**Parameters:**

```typescript
{
  amount: number;              // Payment amount
  currency: string;            // 'BTC' | 'ETH' | 'LTC' | 'USDT_ERC20' | 'USDT_BEP20' | 'MULTI'
  orderId?: string;            // Optional unique order ID
  description?: string;        // Optional description
  callbackUrl?: string;        // Optional webhook URL
  expirationMinutes?: number;  // Optional expiration (5-1440 minutes)
}
```

**Returns:** `Promise<Payment>`

**Example:**

```typescript
const payment = await sdk.createPayment({
  amount: 100,
  currency: 'USDT_ERC20',
  orderId: 'ORDER-123',
  description: 'Product purchase',
  callbackUrl: 'https://yoursite.com/webhook',
  expirationMinutes: 30
});
```

---

### `getPayment(paymentId)`

Retrieves payment details.

**Parameters:**

- `paymentId` (string) - Payment ID

**Returns:** `Promise<Payment>`

**Example:**

```typescript
const payment = await sdk.getPayment('payment_abc123');
```

---

### `listPayments(params)`

Lists payments with optional filters.

**Parameters:**

```typescript
{
  status?: string;      // Filter by status
  currency?: string;    // Filter by currency
  page?: number;        // Page number (default: 1)
  limit?: number;       // Items per page (default: 20)
}
```

**Returns:** `Promise<{ payments: Payment[], pagination: object }>`

**Example:**

```typescript
const { payments, pagination } = await sdk.listPayments({
  status: 'COMPLETED',
  currency: 'BTC',
  page: 1,
  limit: 10
});
```

---

### `getInvoice(paymentId)`

Gets public invoice details (no authentication required).

**Parameters:**

- `paymentId` (string) - Payment ID

**Returns:** `Promise<Invoice>`

**Example:**

```typescript
const invoice = await sdk.getInvoice('payment_abc123');
```

---

### `selectCurrency(paymentId, currency)`

Selects a currency for a multi-currency payment.

**Parameters:**

- `paymentId` (string) - Payment ID
- `currency` (string) - Selected currency

**Returns:** `Promise<{ address: string, qrCode: string }>`

**Example:**

```typescript
const { address, qrCode } = await sdk.selectCurrency(
  'payment_abc123',
  'BTC'
);
```

---

### `cancelPayment(paymentId)`

Cancels a pending payment.

**Parameters:**

- `paymentId` (string) - Payment ID

**Returns:** `Promise<void>`

**Example:**

```typescript
await sdk.cancelPayment('payment_abc123');
```

---

## Withdrawals

### `createWithdrawal(data)`

Creates a withdrawal request.

**Parameters:**

```typescript
{
  amount: number;                // Withdrawal amount
  currency: string;              // 'BTC' | 'ETH' | 'LTC' | 'USDT_ERC20' | 'USDT_BEP20'
  destinationAddress: string;    // Destination wallet address
  description?: string;          // Optional description
}
```

**Returns:** `Promise<Withdrawal>`

**Example:**

```typescript
const withdrawal = await sdk.createWithdrawal({
  amount: 0.5,
  currency: 'ETH',
  destinationAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  description: 'Weekly payout'
});
```

---

### `getWithdrawal(withdrawalId)`

Gets withdrawal details.

**Parameters:**

- `withdrawalId` (string) - Withdrawal ID

**Returns:** `Promise<Withdrawal>`

**Example:**

```typescript
const withdrawal = await sdk.getWithdrawal('withdrawal_xyz789');
```

---

### `listWithdrawals(params)`

Lists withdrawals with optional filters.

**Parameters:**

```typescript
{
  status?: string;      // Filter by status
  currency?: string;    // Filter by currency
  page?: number;        // Page number
  limit?: number;       // Items per page
}
```

**Returns:** `Promise<{ withdrawals: Withdrawal[], pagination: object }>`

**Example:**

```typescript
const { withdrawals } = await sdk.listWithdrawals({
  status: 'COMPLETED',
  page: 1,
  limit: 20
});
```

---

### `cancelWithdrawal(withdrawalId)`

Cancels a pending withdrawal.

**Parameters:**

- `withdrawalId` (string) - Withdrawal ID

**Returns:** `Promise<void>`

**Example:**

```typescript
await sdk.cancelWithdrawal('withdrawal_xyz789');
```

---

### `getWithdrawalFee(currency, amount)`

Gets withdrawal fee estimate.

**Parameters:**

- `currency` (string) - Withdrawal currency
- `amount` (number) - Withdrawal amount

**Returns:** `Promise<{ fee: number, netAmount: number }>`

**Example:**

```typescript
const { fee, netAmount } = await sdk.getWithdrawalFee('BTC', 0.1);
console.log(`Fee: ${fee} BTC, Net: ${netAmount} BTC`);
```

---

## Balances

### `getBalances()`

Gets all balances.

**Returns:** `Promise<Balance[]>`

**Example:**

```typescript
const balances = await sdk.getBalances();
balances.forEach(balance => {
  console.log(`${balance.currency}: ${balance.available}`);
});
```

---

### `getBalance(currency)`

Gets balance for a specific currency.

**Parameters:**

- `currency` (string) - Currency code

**Returns:** `Promise<Balance>`

**Example:**

```typescript
const btcBalance = await sdk.getBalance('BTC');
console.log('Available:', btcBalance.available);
```

---

## Transactions

### `listTransactions(params)`

Lists transactions with optional filters.

**Parameters:**

```typescript
{
  type?: string;         // Filter by type
  currency?: string;     // Filter by currency
  startDate?: string;    // Start date (ISO format)
  endDate?: string;      // End date (ISO format)
  page?: number;         // Page number
  limit?: number;        // Items per page
}
```

**Returns:** `Promise<{ transactions: Transaction[], pagination: object }>`

**Example:**

```typescript
const { transactions } = await sdk.listTransactions({
  type: 'PAYMENT',
  currency: 'BTC',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  page: 1,
  limit: 50
});
```

---

### `exportTransactions(params)`

Exports transactions as CSV or JSON.

**Parameters:**

```typescript
{
  startDate?: string;    // Start date
  endDate?: string;      // End date
  currency?: string;     // Filter by currency
  format?: 'csv' | 'json';  // Export format (default: 'csv')
}
```

**Returns:** `Promise<Blob>`

**Example:**

```typescript
const blob = await sdk.exportTransactions({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  format: 'csv'
});

// Save in browser
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'transactions.csv';
a.click();

// Save in Node.js
const fs = require('fs');
const buffer = Buffer.from(await blob.arrayBuffer());
fs.writeFileSync('transactions.csv', buffer);
```

---

## Webhooks

### `configureWebhook(config)`

Configures webhook URL and events.

**Parameters:**

```typescript
{
  url: string;           // Webhook URL
  events: string[];      // Array of event types to subscribe to
}
```

**Event Types:**
- `payment.created`
- `payment.completed`
- `payment.failed`
- `payment.expired`
- `withdrawal.created`
- `withdrawal.completed`
- `withdrawal.failed`

**Returns:** `Promise<{ webhookSecret: string }>`

**Example:**

```typescript
const { webhookSecret } = await sdk.configureWebhook({
  url: 'https://yoursite.com/webhooks/payment',
  events: ['payment.completed', 'payment.failed']
});

// Store the secret securely
process.env.WEBHOOK_SECRET = webhookSecret;
```

---

### `testWebhook()`

Tests webhook configuration.

**Returns:** `Promise<{ success: boolean, message: string }>`

**Example:**

```typescript
const result = await sdk.testWebhook();
console.log(result.message);
```

---

### `getWebhookConfig()`

Gets current webhook configuration.

**Returns:** `Promise<{ url: string, events: string[], secret: string }>`

**Example:**

```typescript
const config = await sdk.getWebhookConfig();
console.log('Webhook URL:', config.url);
console.log('Events:', config.events);
```

---

### `listWebhookDeliveries(params)`

Lists webhook delivery attempts.

**Parameters:**

```typescript
{
  success?: boolean;     // Filter by success status
  event?: string;        // Filter by event type
  page?: number;         // Page number
  limit?: number;        // Items per page
}
```

**Returns:** `Promise<{ deliveries: WebhookDelivery[], pagination: object }>`

**Example:**

```typescript
const { deliveries } = await sdk.listWebhookDeliveries({
  success: false,
  page: 1,
  limit: 10
});
```

---

### `retryWebhook(deliveryId)`

Retries a failed webhook delivery.

**Parameters:**

- `deliveryId` (string) - Delivery ID

**Returns:** `Promise<void>`

**Example:**

```typescript
await sdk.retryWebhook('delivery_123');
```

---

### `deleteWebhook()`

Removes webhook configuration.

**Returns:** `Promise<void>`

**Example:**

```typescript
await sdk.deleteWebhook();
```

---

### `getWebhookStats(days)`

Gets webhook statistics.

**Parameters:**

- `days` (number, optional) - Number of days (default: 7, max: 90)

**Returns:** `Promise<object>`

**Example:**

```typescript
const stats = await sdk.getWebhookStats(30);
console.log('Success rate:', stats.summary.successRate);
console.log('Total deliveries:', stats.summary.total);
```

---

### `PaymentSDK.verifyWebhookSignature(payload, signature, secret)` (Static)

Verifies webhook signature.

**Parameters:**

- `payload` (string) - JSON string of webhook payload
- `signature` (string) - Signature from `X-Webhook-Signature` header
- `secret` (string) - Your webhook secret

**Returns:** `boolean`

**Example:**

```typescript
const isValid = PaymentSDK.verifyWebhookSignature(
  JSON.stringify(req.body),
  req.headers['x-webhook-signature'],
  process.env.WEBHOOK_SECRET
);

if (!isValid) {
  throw new Error('Invalid signature');
}
```

---

## Merchant

### `getMerchantProfile()`

Gets merchant profile information.

**Returns:** `Promise<object>`

**Example:**

```typescript
const profile = await sdk.getMerchantProfile();
console.log('Business:', profile.businessName);
```

---

### `updateMerchantProfile(data)`

Updates merchant profile.

**Parameters:**

```typescript
{
  businessName?: string;
  website?: string;
  supportEmail?: string;
  // ... other fields
}
```

**Returns:** `Promise<object>`

**Example:**

```typescript
await sdk.updateMerchantProfile({
  businessName: 'My Company Inc.',
  website: 'https://mycompany.com'
});
```

---

### `getMerchantStats(params)`

Gets merchant statistics.

**Parameters:**

```typescript
{
  startDate?: string;    // Start date (ISO format)
  endDate?: string;      // End date (ISO format)
}
```

**Returns:** `Promise<object>`

**Example:**

```typescript
const stats = await sdk.getMerchantStats({
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});

console.log('Total volume:', stats.totalVolume);
console.log('Success rate:', stats.successRate);
```

---

### `generatePaymentLink(paymentId)`

Generates a payment link URL.

**Parameters:**

- `paymentId` (string) - Payment ID

**Returns:** `string`

**Example:**

```typescript
const link = sdk.generatePaymentLink('payment_abc123');
console.log('Share this link:', link);
// https://api.inventpay.com/invoice/payment_abc123
```

---

## Types

### Payment

```typescript
interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'CONFIRMING' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED' | 'FAILED';
  address: string;
  expiresAt: string;
  orderId?: string;
  description?: string;
  qrCode?: string;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

### Withdrawal

```typescript
interface Withdrawal {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  destinationAddress: string;
  txHash?: string;
  fee: number;
  netAmount: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

### Balance

```typescript
interface Balance {
  currency: string;
  available: number;
  pending: number;
  total: number;
}
```

---

### Transaction

```typescript
interface Transaction {
  id: string;
  type: 'PAYMENT' | 'WITHDRAWAL' | 'FEE' | 'REFUND';
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  description?: string;
  metadata?: object;
}
```

---

### Invoice

```typescript
interface Invoice {
  id: string;
  baseAmount: number;
  baseCurrency: string;
  selectedCurrency?: string;
  availableCurrencies: Record<string, {
    cryptoAmount: number;
    usdtAmount: number;
    price: number;
  }>;
  address?: string;
  status: string;
  expiresAt: string;
  qrCode?: string;
}
```

---

## Error Handling

### PaymentSDKError

All SDK errors throw `PaymentSDKError` instances.

```typescript
class PaymentSDKError extends Error {
  statusCode?: number;
  details?: any;
}
```

**Properties:**

- `message` (string) - Error message
- `statusCode` (number) - HTTP status code
- `details` (any) - Additional error details

**Example:**

```typescript
try {
  const payment = await sdk.createPayment(data);
} catch (error) {
  if (error instanceof PaymentSDKError) {
    switch (error.statusCode) {
      case 400:
        console.error('Validation error:', error.details);
        break;
      case 401:
        console.error('Authentication failed');
        break;
      case 404:
        console.error('Resource not found');
        break;
      case 429:
        console.error('Rate limit exceeded');
        break;
      default:
        console.error('API error:', error.message);
    }
  }
}
```

---

## HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid API key)
- `404` - Not Found
- `408` - Request Timeout
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## Rate Limits

The API enforces rate limits to ensure fair usage:

- **Default**: 100 requests per minute
- **Burst**: 10 requests per second

When rate limited, the API returns a `429` status code. Implement exponential backoff for retries.