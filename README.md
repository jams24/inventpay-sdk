# InventPay JavaScript/TypeScript SDK

![InventPay](https://img.shields.io/badge/InventPay-SDK-blue)
![Version](https://img.shields.io/npm/v/inventpay)
![License](https://img.shields.io/npm/l/inventpay)

The official JavaScript/TypeScript SDK for [InventPay](https://inventpay.io) - Accept crypto payments, manage stores, handle withdrawals, and receive real-time notifications with ease.

## ✨ Features

- 💳 **Accept Crypto Payments** - Bitcoin, Ethereum, Litecoin, Solana, USDT (ERC20 & BEP20), USDC
- 🏪 **Store Management** - Create storefronts, add digital products, manage orders
- 🔄 **Secure Withdrawals** - Withdraw funds with a dedicated withdrawal API key
- 💰 **Balance Tracking** - Real-time balance and limit monitoring
- 🔔 **Webhook Support** - Secure payment notifications and event handling
- 🎯 **Dual Payment Modes** - Fixed currency or multi-currency invoices
- 🛡️ **TypeScript Ready** - Full type definitions and auto-completion
- ⚡ **Lightweight** - Zero dependencies, fast and reliable

## 🚀 Quick Start

### Installation

```bash
npm install inventpay
```

### Initialize SDK

```javascript
// CommonJS
const { PaymentSDK } = require("inventpay");

// ES Modules
import { PaymentSDK } from "inventpay";

// TypeScript
import { PaymentSDK, PaymentRequest } from "inventpay";

// Initialize with your API key
const sdk = new PaymentSDK({
  apiKey: "your-api-key-here", // Get from https://inventpay.io/dashboard
  withdrawalApiKey: "wk_live_...", // Optional — for programmatic withdrawals
  baseUrl: "https://api.inventpay.io", // Optional
  timeout: 30000, // Optional, defaults to 30 seconds
});
```

### Test Connection

```javascript
// Verify your API key and connection
const connection = await sdk.testConnection();
console.log(connection.message); // "API connection successful"
```

## 💳 Accepting Payments

### Option 1: Fixed Currency Payment

Get an immediate payment address for a specific cryptocurrency.

```javascript
const payment = await sdk.createPayment({
  amount: 29.99, // Amount in USD
  amountCurrency: "USD", // Base currency for amount
  currency: "USDT_BEP20", // Payment currency: BTC, ETH, LTC, USDT_ERC20, USDT_BEP20
  orderId: "order-12345",
  description: "Premium Plan Subscription",
  callbackUrl: "https://yourapp.com/webhooks/payments", // Optional
  expirationMinutes: 30, // Optional, 5-1440 minutes
});

console.log(payment.data);
// {
//   paymentId: 'cmh123...',
//   amount: 29.99,
//   currency: 'USDT_BEP20',
//   address: '0x742d35Cc...',
//   invoiceUrl: 'https://inventpay.io/invoice/cmh123...',
//   qrCode: 'usdt_bep20:0x742d35Cc...?amount=29.99',
//   expiresAt: '2024-01-01T12:00:00.000Z'
// }
```

### Option 2: Multi-Currency Invoice

Let customers choose their preferred cryptocurrency.

```javascript
const invoice = await sdk.createInvoice({
  amount: 49.99,
  amountCurrency: "USD",
  orderId: "order-67890",
  description: "E-commerce Purchase",
  expirationMinutes: 60,
});

console.log(invoice.data);
// {
//   paymentId: 'cmh456...',
//   baseAmount: 49.99,
//   baseCurrency: 'USDT',
//   conversionRates: {
//     BTC: { cryptoAmount: 0.0012, price: 41500 },
//     ETH: { cryptoAmount: 0.032, price: 3200 },
//     USDT_BEP20: { cryptoAmount: 49.99, price: 1 }
//   },
//   invoiceUrl: 'https://inventpay.io/invoice/cmh456...',
//   allowCurrencySelection: true
// }
```

### Check Payment Status

```javascript
// Public endpoint - no API key required
const status = await sdk.getPaymentStatus("cmh123...");
console.log(status);
// {
//   status: 'PENDING', // PENDING, COMPLETED, EXPIRED, FAILED
//   currentBalance: '0.5',
//   confirmations: 3
// }
```

## 💰 Managing Balances

### Get All Balances

```javascript
const balances = await sdk.getBalances();
console.log(balances.data);
// {
//   merchantId: 'cmf123...',
//   businessName: 'Your Business',
//   balances: {
//     BTC: { availableBalance: 0.5, totalEarned: 1.2, ... },
//     ETH: { availableBalance: 2.1, totalEarned: 5.6, ... },
//     USDT_BEP20: { availableBalance: 1500.75, totalEarned: 5000, ... }
//   }
// }
```

### Get Specific Currency Balance

```javascript
const balance = await sdk.getBalance("USDT_BEP20");
console.log(balance.data);
// {
//   currency: 'USDT_BEP20',
//   balance: {
//     availableBalance: 1500.75,
//     totalEarned: 5000,
//     totalWithdrawn: 3499.25,
//     limits: { daily: { limit: 10000, used: 1500 } }
//   }
// }
```

## 🔄 Withdraw Funds

Programmatic withdrawals require a **Withdrawal API Key** — a separate key from your main API key, disabled by default for security.

1. Go to **Dashboard → Settings → Withdrawal API Key**
2. Click **"Generate Key"** to create your `wk_live_...` key
3. Pass it when initializing the SDK:

```javascript
const sdk = new PaymentSDK({
  apiKey: process.env.INVENTPAY_API_KEY,
  withdrawalApiKey: process.env.INVENTPAY_WITHDRAWAL_KEY,
});
```

### Create Withdrawal

```javascript
const withdrawal = await sdk.createWithdrawal({
  amount: 10,
  currency: "USDT_BEP20",
  destinationAddress: "0x1E3D6848dE165e64052f0F2A3dA8823A27CAc22D",
  description: "Monthly payout",
});

console.log(withdrawal.data);
// {
//   withdrawalId: 'cmh789...',
//   amount: '10',
//   currency: 'USDT_BEP20',
//   destinationAddress: '0x1E3D6848dE165e64052f0F2A3dA8823A27CAc22D',
//   status: 'PENDING',
//   feeAmount: '0.051',
//   netAmount: '9.949',
//   feeBreakdown: { networkFee: 0.001, serviceFee: 0.05 },
//   estimatedCompletion: '2024-01-01T12:30:00.000Z'
// }
```

> **Note:** If `withdrawalApiKey` is not provided, `createWithdrawal()` will throw a `PaymentSDKError`. Dashboard withdrawals use 2FA instead and do not need this key.

### Check Withdrawal Status

```javascript
const withdrawalStatus = await sdk.getWithdrawal("cmh789...");
console.log(withdrawalStatus.data.status); // PENDING, PROCESSING, COMPLETED, FAILED
```

## 🏪 Store Management

Create and manage digital storefronts with products and orders.

### Create a Store

```javascript
const store = await sdk.createStore({
  name: "My Digital Shop",
  description: "Premium digital products",
  settings: {
    acceptedCurrencies: ["USDT_BEP20", "BTC", "ETH"],
    minOrderAmount: 1,
  },
});

console.log(store.data.slug); // "my-digital-shop"
```

### Add Products

```javascript
const product = await sdk.createProduct({
  name: "Premium Template Pack",
  description: "50+ professional templates",
  price: 29.99,
  currency: "USD",
  stock: 100,
  digitalContent: {
    fileUrl: "https://yourstorage.com/templates.zip",
    instructions: "Download link valid for 24 hours",
  },
});
```

### List Products

```javascript
const products = await sdk.listProducts({ page: 1, limit: 20 });
console.log(products.data.products); // Array of products
console.log(products.data.pagination.total); // Total product count
```

### Manage Orders

```javascript
// List orders
const orders = await sdk.listOrders({ status: "PAID", limit: 10 });

// Get order details
const order = await sdk.getOrder("order-id");

// Update order fulfillment status
await sdk.updateOrderStatus("order-id", "FULFILLED");
```

### Update & Delete Products

```javascript
// Update a product
await sdk.updateProduct("product-id", {
  price: 24.99,
  stock: 50,
});

// Delete (deactivate) a product
await sdk.deleteProduct("product-id");
```

### Key Pool (Unique Keys Per Customer)

```javascript
// Upload unique keys/codes to a product's pool
const result = await sdk.addProductKeys("product-id", [
  "LICENSE-AAAA-0001",
  "LICENSE-AAAA-0002",
  "LICENSE-AAAA-0003",
], "January Batch");
console.log(`Added ${result.data.added} keys`);

// Check pool stats
const stats = await sdk.getKeyPoolStats("product-id");
console.log(`${stats.data.available} keys available`);

// List keys (with optional status filter)
const keys = await sdk.listProductKeys("product-id", {
  status: "AVAILABLE",
  limit: 20,
});

// Remove all available (unassigned) keys
await sdk.removeAvailableKeys("product-id");
```

> When a customer purchases the product, one key is automatically assigned (FIFO) and delivered alongside the product's digital content.

## 🔔 Webhook Handling

### Configure Webhooks

```javascript
// Set your webhook URL
await sdk.configureWebhook({
  webhookUrl: "https://yourapp.com/api/webhooks/inventpay",
});

// Test webhook delivery
const testResult = await sdk.testWebhook();
console.log(testResult.message); // "Webhook test successful"
```

### Webhook Server Example

Here's a complete, production-ready webhook listener for handling InventPay notifications:

```javascript
// merchant-webhook-listener.js
const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3008;

// IMPORTANT: Replace with your actual webhook secret from InventPay dashboard
const WEBHOOK_SECRET =
  process.env.INVENTPAY_WEBHOOK_SECRET || "your-webhook-secret";

// Middleware to parse JSON and preserve raw body for signature verification
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString("utf8");
    },
  })
);

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * Verify webhook signature to ensure request is from InventPay
 */
function verifyWebhookSignature(payload, signature, secret) {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error("Signature verification error:", error.message);
    return false;
  }
}

/**
 * Process payment.created event
 */
function handlePaymentCreated(payload) {
  console.log("=== PAYMENT CREATED ===");
  console.log(`Payment ID: ${payload.paymentId}`);
  console.log(`Order ID: ${payload.orderId || "N/A"}`);
  console.log(`Amount: ${payload.baseAmount} ${payload.baseCurrency}`);
  console.log(`Currency: ${payload.currency}`);
  console.log(`Invoice URL: ${payload.invoiceUrl}`);
  console.log(`Expires At: ${payload.expiresAt}`);

  // TODO: Add your business logic here
  // - Store payment reference in your database
  // - Send invoice link to customer
  // - Reserve inventory
  // - Update order status to "awaiting_payment"

  return { success: true, message: "Payment created notification received" };
}

/**
 * Process payment.pending event
 */
function handlePaymentPending(payload) {
  console.log("=== PAYMENT PENDING ===");
  console.log(`Payment ID: ${payload.paymentId}`);
  console.log(`Amount: ${payload.amount} ${payload.currency}`);
  console.log(
    `Current Balance: ${payload.currentBalance || 0} ${payload.currency}`
  );
  console.log(`Status: ${payload.status}`);

  if (payload.currencySelected) {
    console.log(`Currency Selected: ${payload.currencySelected}`);
    console.log(`Address: ${payload.address}`);
    console.log(`Crypto Amount: ${payload.cryptoAmount}`);
  }

  // TODO: Add your business logic
  // - Update order status to "payment_pending"
  // - Show "payment received, awaiting confirmation" to user

  return { success: true, message: "Payment pending notification received" };
}

/**
 * Process payment.confirmed/completed event
 */
function handlePaymentConfirmed(payload) {
  console.log("=== PAYMENT CONFIRMED ===");
  console.log(`Payment ID: ${payload.paymentId}`);
  console.log(`Order ID: ${payload.orderId || "N/A"}`);
  console.log(`Amount: ${payload.amount} ${payload.currency}`);
  console.log(`Settlement Amount: ${payload.settlementAmount}`);
  console.log(
    `Fee: ${payload.feeAmount} (Rate: ${(payload.feeRate * 100).toFixed(2)}%)`
  );
  console.log(`Status: ${payload.status}`);
  console.log(`Timestamp: ${payload.timestamp}`);

  // TODO: Add your business logic here
  // - Update order status in your database to 'PAID'
  // - Send confirmation email to customer
  // - Trigger fulfillment process
  // - Update inventory

  return {
    success: true,
    message: "Payment confirmed and processed successfully",
  };
}

/**
 * Process payment.underpaid event
 */
function handlePaymentUnderpaid(payload) {
  console.log("=== PAYMENT UNDERPAID ===");
  console.log(`Payment ID: ${payload.paymentId}`);
  console.log(`Expected: ${payload.requiredAmount} ${payload.currency}`);
  console.log(`Received: ${payload.currentBalance} ${payload.currency}`);
  console.log(`Remaining: ${payload.remainingAmount} ${payload.currency}`);
  console.log(`Paid: ${payload.paidPercentage}%`);
  console.log(`Remaining: ${payload.remainingPercentage}%`);

  // TODO: Add your business logic
  // - Notify customer of underpayment
  // - Send reminder with remaining amount
  // - Update order status to "partially_paid"

  return { success: true, message: "Underpayment notification received" };
}

/**
 * Process payment.expired event
 */
function handlePaymentExpired(payload) {
  console.log("=== PAYMENT EXPIRED ===");
  console.log(`Payment ID: ${payload.paymentId}`);
  console.log(`Order ID: ${payload.orderId || "N/A"}`);
  console.log(`Was Underpaid: ${payload.wasUnderpaid ? "YES" : "NO"}`);
  console.log(`Final Balance: ${payload.currentBalance} ${payload.currency}`);
  console.log(`Expired At: ${payload.expiresAt}`);

  // TODO: Add your business logic
  // - Cancel order
  // - Release reserved inventory
  // - Notify customer of expiration

  return { success: true, message: "Payment expiration handled" };
}

/**
 * Process payment.failed event
 */
function handlePaymentFailed(payload) {
  console.log("=== PAYMENT FAILED ===");
  console.log(`Payment ID: ${payload.paymentId}`);
  console.log(`Order ID: ${payload.orderId || "N/A"}`);
  console.log(`Error: ${payload.error || "Unknown"}`);
  console.log(`Failure Reason: ${payload.failureReason || "Unknown"}`);
  console.log(`Status: ${payload.status}`);

  // TODO: Add your business logic
  // - Update order status to "payment_failed"
  // - Send notification to customer
  // - Release reserved inventory

  return { success: true, message: "Payment failure handled" };
}

/**
 * Process test event
 */
function handleTestEvent(payload) {
  console.log("=== TEST WEBHOOK ===");
  console.log("Test webhook received successfully!");
  console.log("Payload:", JSON.stringify(payload, null, 2));

  return { success: true, message: "Test webhook received and verified" };
}

// Main webhook endpoint
app.post("/webhook/inventpay", async (req, res) => {
  try {
    console.log("\n🔔 Webhook received from InventPay");

    // Get signature and event type from headers
    const signature = req.headers["x-webhook-signature"];
    const eventType = req.headers["x-webhook-event"];

    if (!signature) {
      console.error("❌ No signature provided");
      return res.status(401).json({
        success: false,
        error: "Missing signature",
      });
    }

    // Verify signature
    const isValid = verifyWebhookSignature(
      req.rawBody,
      signature,
      WEBHOOK_SECRET
    );

    if (!isValid) {
      console.error("❌ Invalid signature");
      return res.status(401).json({
        success: false,
        error: "Invalid signature",
      });
    }

    console.log("✅ Signature verified");

    // Get the payload (entire body is the payload)
    const payload = req.body;

    console.log(`Event Type: ${payload.event || eventType}`);
    console.log(`Timestamp: ${payload.timestamp}`);
    console.log(`Payment ID: ${payload.paymentId}`);
    console.log(`Test Mode: ${payload.test ? "YES" : "NO"}`);

    // Route to appropriate handler based on event type
    let result;
    const event = payload.event || eventType;

    switch (event) {
      case "payment.created":
        result = handlePaymentCreated(payload);
        break;
      case "payment.pending":
        result = handlePaymentPending(payload);
        break;
      case "payment.confirmed":
      case "payment.completed":
        result = handlePaymentConfirmed(payload);
        break;
      case "payment.underpaid":
        result = handlePaymentUnderpaid(payload);
        break;
      case "payment.expired":
        result = handlePaymentExpired(payload);
        break;
      case "payment.failed":
        result = handlePaymentFailed(payload);
        break;
      case "payment.test":
        result = handleTestEvent(payload);
        break;
      default:
        console.warn(`⚠️ Unknown event type: ${event}`);
        result = { success: true, message: "Event received but not processed" };
    }

    // Return 200 OK to acknowledge receipt
    res.status(200).json({
      success: true,
      message: result.message,
      received: true,
      event: event,
      paymentId: payload.paymentId,
      timestamp: new Date().toISOString(),
    });

    console.log("✅ Webhook processed successfully\n");
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "InventPay Webhook Listener",
    timestamp: new Date().toISOString(),
    webhookSecret: WEBHOOK_SECRET ? "configured" : "missing",
  });
});

// Start server
app.listen(PORT, () => {
  console.log("🚀 InventPay Webhook Listener Started");
  console.log(`📡 Listening on port: ${PORT}`);
  console.log(`🔗 Webhook URL: http://localhost:${PORT}/webhook/inventpay`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});
```

### Running the Webhook Listener

1. **Install dependencies:**

```bash
npm install express body-parser
```

2. **Set environment variables:**

```bash
export INVENTPAY_WEBHOOK_SECRET="your-webhook-secret-from-dashboard"
export WEBHOOK_PORT=3008
```

3. **Run the server:**

```bash
node merchant-webhook-listener.js
```

4. **Configure your webhook URL in InventPay dashboard:**
   `https://yourdomain.com/webhook/inventpay`

### Monitor Webhook Deliveries

```javascript
// Get recent webhook deliveries
const deliveries = await sdk.getWebhookDeliveries({
  page: 1,
  limit: 10,
  success: true,
});

// Get webhook statistics
const stats = await sdk.getWebhookStats(7); // Last 7 days
console.log(stats.data.summary.successRate); // "98.50%"
```

## 🛡️ Error Handling

```javascript
try {
  const payment = await sdk.createPayment({
    amount: 25,
    currency: "USDT_BEP20",
  });
} catch (error) {
  if (error.statusCode === 401) {
    console.error("Invalid API key");
  } else if (error.statusCode === 400) {
    console.error("Invalid request:", error.details);
  } else if (error.statusCode === 429) {
    console.error("Rate limit exceeded");
  } else {
    console.error("Unexpected error:", error.message);
  }
}
```

## 📚 API Reference

### Payment Methods

| Method               | Description                   | Endpoint                      |
| -------------------- | ----------------------------- | ----------------------------- |
| `createPayment()`    | Create fixed currency payment | `POST /v1/create_payment`     |
| `createInvoice()`    | Create multi-currency invoice | `POST /v1/create_invoice`     |
| `getPaymentStatus()` | Check payment status          | `GET /v1/invoice/{id}/status` |

### Balance Methods

| Method                 | Description                   | Endpoint                              |
| ---------------------- | ----------------------------- | ------------------------------------- |
| `getBalances()`        | Get all currency balances     | `GET /v1/merchant/balance`            |
| `getBalance(currency)` | Get specific currency balance | `GET /v1/merchant/balance/{currency}` |

### Withdrawal Methods

| Method               | Description                        | Endpoint                              |
| -------------------- | ---------------------------------- | ------------------------------------- |
| `createWithdrawal()` | Create withdrawal (requires key)   | `POST /v1/merchant/withdrawal/create` |
| `getWithdrawal()`    | Get withdrawal status              | `GET /v1/withdrawal/{id}`             |

### Store Methods

| Method                | Description                   | Endpoint                                    |
| --------------------- | ----------------------------- | ------------------------------------------- |
| `createStore()`       | Create a new store            | `POST /v1/store/manage`                     |
| `getStore()`          | Get store details             | `GET /v1/store/manage`                      |
| `updateStore()`       | Update store settings         | `PUT /v1/store/manage`                      |
| `createProduct()`     | Add a product                 | `POST /v1/store/manage/products`            |
| `listProducts()`      | List all products             | `GET /v1/store/manage/products`             |
| `updateProduct()`     | Update a product              | `PUT /v1/store/manage/products/{id}`        |
| `deleteProduct()`     | Delete (deactivate) a product | `DELETE /v1/store/manage/products/{id}`     |
| `addProductKeys()`    | Upload keys to product pool   | `POST /v1/store/manage/products/{id}/keys`  |
| `listProductKeys()`   | List keys in pool             | `GET /v1/store/manage/products/{id}/keys`   |
| `getKeyPoolStats()`   | Get pool stats                | `GET /v1/store/manage/products/{id}/keys/stats` |
| `removeAvailableKeys()` | Remove available keys       | `DELETE /v1/store/manage/products/{id}/keys` |
| `listOrders()`        | List store orders             | `GET /v1/store/manage/orders`              |
| `getOrder()`          | Get order details             | `GET /v1/store/manage/orders/{id}`         |
| `updateOrderStatus()` | Update order status           | `PUT /v1/store/manage/orders/{id}/status`  |

### Webhook Methods

| Method                   | Description                  |
| ------------------------ | ---------------------------- |
| `configureWebhook()`     | Set webhook URL              |
| `getWebhookConfig()`     | Get webhook configuration    |
| `testWebhook()`          | Test webhook endpoint        |
| `getWebhookDeliveries()` | Get delivery history         |
| `getWebhookStats()`      | Get delivery statistics      |
| `deleteWebhook()`        | Remove webhook configuration |

## 🔧 Configuration

### SDK Options

```javascript
const sdk = new PaymentSDK({
  apiKey: "string", // Required: Your InventPay API key
  withdrawalApiKey: "string", // Optional: For programmatic withdrawals (wk_live_...)
  baseUrl: "string", // Optional: API base URL (default: https://api.inventpay.io)
  timeout: 30000, // Optional: Request timeout in ms (default: 30000)
});
```

### Supported Currencies

**Payment Currencies:**

- `BTC` - Bitcoin
- `ETH` - Ethereum
- `LTC` - Litecoin
- `USDT_ERC20` - USDT on Ethereum
- `USDT_BEP20` - USDT on Binance Smart Chain
- `SOL` - Solana
- `USDC_SOL` - USDC on Solana
- `USDC_BEP20` - USDC on Binance Smart Chain
- `MULTI` - Multi-currency invoice

**Amount Currencies:**

- `USD` - US Dollars
- `USDT` - Tether
- `BTC` - Bitcoin
- `ETH` - Ethereum
- `LTC` - Litecoin
- `SOL` - Solana

## 🌟 Best Practices

### 1. Store API Keys Securely

```javascript
// Use environment variables
const sdk = new PaymentSDK({
  apiKey: process.env.INVENTPAY_API_KEY,
  withdrawalApiKey: process.env.INVENTPAY_WITHDRAWAL_KEY, // Only if needed
});
```

### 2. Handle Webhooks Properly

```javascript
// Always verify webhook signatures
// Implement retry logic for failed webhooks
// Log all webhook events for debugging
```

### 3. Monitor Payment Status

```javascript
// Poll for payment status if not using webhooks
// Set appropriate expiration times
// Handle partial payments and overpayments
```

## 📱 Examples

### React Component Example

```jsx
import React, { useState } from "react";
import { PaymentSDK } from "inventpay";

function PaymentButton({ amount, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const sdk = new PaymentSDK({
        apiKey: process.env.REACT_APP_INVENTPAY_API_KEY,
      });

      const payment = await sdk.createPayment({
        amount,
        currency: "USDT_BEP20",
        orderId: `order-${Date.now()}`,
      });

      // Redirect to payment page
      window.location.href = payment.data.invoiceUrl;
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? "Processing..." : `Pay $${amount}`}
    </button>
  );
}
```

### Node.js Express Server

```javascript
const express = require("express");
const { PaymentSDK } = require("inventpay");

const app = express();
app.use(express.json());

const sdk = new PaymentSDK({
  apiKey: process.env.INVENTPAY_API_KEY,
});

app.post("/api/create-payment", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const payment = await sdk.createPayment({
      amount,
      currency: currency || "USDT_BEP20",
      orderId: `order-${Date.now()}`,
      callbackUrl: `${process.env.BASE_URL}/webhooks/payments`,
    });

    res.json({ success: true, data: payment.data });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

## ❓ Frequently Asked Questions

### How do I get an API key?

Visit [InventPay Dashboard](https://inventpay.io/dashboard) to create an account and generate your API keys.

### What's the difference between createPayment and createInvoice?

- `createPayment` generates an immediate address for a specific cryptocurrency
- `createInvoice` creates a multi-currency invoice where customers can choose their preferred crypto

### Are webhooks required?

No, but highly recommended for real-time payment notifications. You can also poll payment status using `getPaymentStatus()`.

### How are conversion rates handled?

InventPay uses real-time market rates from multiple exchanges. Rates are locked when a payment is created.

### What happens if a payment expires?

Expired payments cannot be completed. You should create a new payment and notify the customer.

## 📞 Support

- **Documentation:** [https://docs.inventpay.io](https://docs.inventpay.io)
- **Dashboard:** [https://inventpay.io/dashboard](https://inventpay.io/dashboard)
- **Email Support:** support@inventpay.io
- **GitHub Issues:** [Report Bugs & Features](https://github.com/jams24/inventpay-sdk/issues)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Ready to start?** [Get your API key](https://inventpay.io/dashboard) and begin accepting crypto payments in minutes! 🚀
