# Quick Start Guide - InventPay Payment SDK

This guide will help you get started with the InventPay Payment SDK in minutes.

## Installation

```bash
npm install @inventpay/payment-sdk
```

## Step 1: Get Your API Key

1. Log in to your InventPay dashboard
2. Navigate to Settings > API Keys
3. Generate a new API key
4. Copy and store it securely

## Step 2: Initialize the SDK

```javascript
import PaymentSDK from '@inventpay/payment-sdk';

const sdk = new PaymentSDK({
  apiKey: 'your-api-key-here'
});
```

## Step 3: Create Your First Payment

```javascript
async function createPayment() {
  try {
    const payment = await sdk.createPayment({
      amount: 100,
      currency: 'USDT_ERC20',
      orderId: 'ORDER-123',
      description: 'Product purchase'
    });

    console.log('Payment created!');
    console.log('Invoice URL:', payment.invoiceUrl);
    console.log('Payment address:', payment.address);
    
    // Share the invoice URL with your customer
    return payment;
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Step 4: Check Payment Status

```javascript
async function checkStatus(paymentId) {
  const payment = await sdk.getPayment(paymentId);
  
  if (payment.status === 'COMPLETED') {
    console.log('Payment received! ✅');
    // Fulfill the order
  } else if (payment.status === 'PENDING') {
    console.log('Waiting for payment...');
  }
}
```

## Step 5: Setup Webhooks (Recommended)

```javascript
// Configure webhook
const { webhookSecret } = await sdk.configureWebhook({
  url: 'https://yoursite.com/webhooks/payment',
  events: ['payment.completed', 'payment.failed']
});

// In your webhook handler:
app.post('/webhooks/payment', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const isValid = PaymentSDK.verifyWebhookSignature(
    JSON.stringify(req.body),
    signature,
    webhookSecret
  );

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.body;
  
  if (event.event === 'payment.completed') {
    // Payment received - fulfill order
    console.log('Payment completed:', event.data.paymentId);
  }

  res.status(200).send('OK');
});
```

## Step 6: Withdraw Funds

```javascript
async function withdraw() {
  // Check fee first
  const { fee, netAmount } = await sdk.getWithdrawalFee('BTC', 0.1);
  console.log(`Fee: ${fee}, You'll receive: ${netAmount}`);

  // Create withdrawal
  const withdrawal = await sdk.createWithdrawal({
    amount: 0.1,
    currency: 'BTC',
    destinationAddress: 'your-btc-address'
  });

  console.log('Withdrawal created:', withdrawal.id);
}
```

## Common Use Cases

### Accept Multiple Cryptocurrencies

```javascript
const payment = await sdk.createPayment({
  amount: 100, // Amount in USD
  currency: 'MULTI', // Let user choose
  orderId: 'ORDER-456'
});

// Customer selects their preferred currency
const { address } = await sdk.selectCurrency(payment.id, 'BTC');
```

### Check Your Balance

```javascript
const balances = await sdk.getBalances();
balances.forEach(b => {
  console.log(`${b.currency}: ${b.available}`);
});
```

### Export Transactions

```javascript
const blob = await sdk.exportTransactions({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  format: 'csv'
});

// Save the file
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'transactions.csv';
a.click();
```

## Best Practices

1. **Store API keys securely** - Use environment variables
2. **Verify webhook signatures** - Always validate incoming webhooks
3. **Handle errors gracefully** - Implement proper error handling
4. **Use order IDs** - Prevent duplicate payments
5. **Monitor payments** - Set up webhooks for real-time updates

## Next Steps

- Read the [complete API reference](./docs/API.md)
- Check out [examples](./examples/)
- Join our [Discord community](#)
- Read the [full documentation](#)

## Support

Need help? Contact us:
- Email: support@inventpay.com
- Discord: [Join our community](#)
- Documentation: https://docs.inventpay.com

## Links

- [GitHub Repository](#)
- [npm Package](#)
- [API Reference](./docs/API.md)
- [Examples](./examples/)