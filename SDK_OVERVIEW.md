# InventPay Payment SDK - Implementation Overview

## 📦 What's Included

Your complete Payment SDK package includes:

### Core SDK
- **`src/index.ts`** - Main SDK implementation with TypeScript
  - Full API coverage for all merchant endpoints
  - Type-safe interfaces and error handling
  - No admin endpoints included (security first)

### Documentation
- **`README.md`** - Comprehensive guide with examples
- **`QUICKSTART.md`** - 5-minute getting started guide
- **`docs/API.md`** - Complete API reference
- **`CHANGELOG.md`** - Version history and roadmap

### Examples
- **`examples/basic-usage.js`** - Node.js examples for all features
- **`examples/react-integration.jsx`** - React/Next.js components

### Configuration
- **`package.json`** - NPM package configuration
- **`tsconfig.json`** - TypeScript configuration
- **`.gitignore`** - Git ignore rules
- **`.npmignore`** - NPM publish ignore rules
- **`LICENSE`** - MIT License

## 🔒 Security Features

### Admin Endpoints Excluded
The SDK **DOES NOT** include any admin endpoints. Only merchant-facing APIs are exposed:

✅ **Included:**
- Payment creation and management
- Withdrawal requests
- Balance checking
- Transaction history
- Webhook configuration
- Merchant profile management
- Public invoice access

❌ **Excluded (Admin Only):**
- User management
- System configuration
- Admin dashboards
- Platform-wide statistics
- Any administrative functions

## 🚀 Getting Started

### 1. Installation

```bash
npm install @inventpay/payment-sdk
```

### 2. Basic Usage

```typescript
import PaymentSDK from '@inventpay/payment-sdk';

const sdk = new PaymentSDK({
  apiKey: process.env.INVENTPAY_API_KEY
});

// Create a payment
const payment = await sdk.createPayment({
  amount: 100,
  currency: 'USDT_ERC20',
  orderId: 'ORDER-123'
});
```

## 📋 Supported Features

### Payments
- ✅ Create single-currency payments (BTC, ETH, LTC, SOL, USDT, USDC)
- ✅ Create multi-currency payments
- ✅ Get payment status
- ✅ List payments with filters
- ✅ Cancel payments
- ✅ Public invoice access (no auth)
- ✅ QR code generation

### Withdrawals
- ✅ Create withdrawal requests
- ✅ Get withdrawal status
- ✅ List withdrawals
- ✅ Cancel withdrawals
- ✅ Fee calculation

### Balances & Transactions
- ✅ View all balances
- ✅ View specific currency balance
- ✅ Transaction history with filters
- ✅ Export to CSV/JSON

### Webhooks
- ✅ Configure webhook URL
- ✅ Subscribe to events
- ✅ Test webhooks
- ✅ Signature verification
- ✅ Delivery tracking
- ✅ Retry failed deliveries
- ✅ Statistics

### Merchant Profile
- ✅ Get profile info
- ✅ Update profile
- ✅ View statistics

## 🔧 Supported Cryptocurrencies

- **BTC** - Bitcoin
- **ETH** - Ethereum
- **LTC** - Litecoin
- **USDT_ERC20** - Tether (Ethereum)
- **USDT_BEP20** - Tether (BSC)
- **SOL** - Solana
- **USDC_SOL** - USDC (Solana)
- **USDC_BEP20** - USDC (BSC)

## 📊 SDK Architecture

```
payment-sdk/
├── src/
│   └── index.ts           # Main SDK implementation
├── examples/
│   ├── basic-usage.js     # Node.js examples
│   └── react-integration.jsx  # React examples
├── docs/
│   └── API.md             # API reference
├── package.json           # NPM configuration
├── tsconfig.json          # TypeScript config
├── README.md              # Main documentation
├── QUICKSTART.md          # Quick start guide
├── CHANGELOG.md           # Version history
└── LICENSE                # MIT License
```

## 🛠️ Development Setup

### Publishing to NPM

1. **Build the package:**
```bash
npm run build
```

2. **Test locally:**
```bash
npm link
# In another project
npm link @inventpay/payment-sdk
```

3. **Publish:**
```bash
npm login
npm publish
```

### Using TypeScript

The SDK is built with TypeScript and provides full type definitions:

```typescript
import PaymentSDK, { 
  PaymentRequest, 
  Payment,
  PaymentSDKError 
} from '@inventpay/payment-sdk';

// Full IntelliSense support
const request: PaymentRequest = {
  amount: 100,
  currency: 'BTC', // Type-checked
};
```

## 🔐 Authentication

The SDK uses Bearer token authentication:

```typescript
const sdk = new PaymentSDK({
  apiKey: 'your-api-key', // Required
  baseUrl: 'https://api.inventpay.com', // Optional
  timeout: 30000 // Optional (ms)
});
```

API keys should be:
- Stored in environment variables
- Never committed to version control
- Rotated regularly
- Different for dev/staging/production

## 📡 Webhook Integration

### Setup

```typescript
const { webhookSecret } = await sdk.configureWebhook({
  url: 'https://yoursite.com/webhook',
  events: ['payment.completed', 'payment.failed']
});
```

### Verification

```typescript
import { PaymentSDK } from '@inventpay/payment-sdk';

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const isValid = PaymentSDK.verifyWebhookSignature(
    JSON.stringify(req.body),
    signature,
    webhookSecret
  );

  if (!isValid) {
    return res.status(401).send('Invalid');
  }

  // Process webhook
  res.status(200).send('OK');
});
```

## ⚠️ Error Handling

All errors throw `PaymentSDKError`:

```typescript
try {
  const payment = await sdk.createPayment(data);
} catch (error) {
  if (error instanceof PaymentSDKError) {
    console.error('Status:', error.statusCode);
    console.error('Message:', error.message);
    console.error('Details:', error.details);
  }
}
```

## 🎯 Common Use Cases

### E-commerce Checkout

```typescript
// 1. Create payment
const payment = await sdk.createPayment({
  amount: orderTotal,
  currency: 'USDT_ERC20',
  orderId: order.id,
  callbackUrl: `${siteUrl}/webhook`
});

// 2. Redirect customer
window.location.href = payment.invoiceUrl;

// 3. Handle webhook
// (webhook confirms payment, you fulfill order)
```

### Subscription Payments

```typescript
// Check balance first
const balance = await sdk.getBalance('USDT_ERC20');

if (balance.available >= subscriptionPrice) {
  // Create internal debit
  // Or create withdrawal to your address
}
```

### Multi-Currency Support

```typescript
// Let user choose currency
const payment = await sdk.createPayment({
  amount: 100, // USD
  currency: 'MULTI'
});

// User selects BTC
const { address } = await sdk.selectCurrency(
  payment.id, 
  'BTC'
);
```

## 📈 Best Practices

### 1. Use Environment Variables
```javascript
const sdk = new PaymentSDK({
  apiKey: process.env.INVENTPAY_API_KEY
});
```

### 2. Implement Idempotency
```typescript
const payment = await sdk.createPayment({
  amount: 100,
  currency: 'BTC',
  orderId: 'ORDER-123' // Unique ID prevents duplicates
});
```

### 3. Handle All Error Cases
```typescript
try {
  const payment = await sdk.createPayment(data);
} catch (error) {
  if (error.statusCode === 400) {
    // Validation error
  } else if (error.statusCode === 429) {
    // Rate limit - retry with backoff
  }
}
```

### 4. Always Verify Webhooks
```typescript
const isValid = PaymentSDK.verifyWebhookSignature(
  payload, signature, secret
);

if (!isValid) {
  throw new Error('Invalid webhook');
}
```

### 5. Monitor Payment Status
```typescript
// Poll or use webhooks
const interval = setInterval(async () => {
  const payment = await sdk.getPayment(paymentId);
  if (payment.status === 'COMPLETED') {
    clearInterval(interval);
    fulfillOrder();
  }
}, 5000);
```

## 🔄 Migration Guide

If migrating from direct API calls:

### Before (Direct API)
```javascript
const response = await fetch('https://api.inventpay.com/api/payments', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ amount: 100, currency: 'BTC' })
});
const payment = await response.json();
```

### After (SDK)
```javascript
const payment = await sdk.createPayment({
  amount: 100,
  currency: 'BTC'
});
```

Benefits:
- ✅ Type safety
- ✅ Error handling
- ✅ Automatic retries
- ✅ Better DX

## 📞 Support

- **Email**: support@inventpay.com
- **Documentation**: https://docs.inventpay.com
- **GitHub Issues**: Report bugs and request features
- **Discord**: Join our community

## 🗺️ Roadmap

### v1.1.0 (Coming Soon)
- Refund API
- Customer management
- Invoice templates
- Payment analytics

### v2.0.0 (Future)
- Subscriptions
- Recurring payments
- Dispute management
- Advanced reporting

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 🎉 You're Ready!

Your SDK is complete and ready to use. Start by:

1. Reading the [QUICKSTART.md](./QUICKSTART.md)
2. Checking [examples/](./examples/)
3. Reviewing [docs/API.md](./docs/API.md)

Happy coding! 🚀