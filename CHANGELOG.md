# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of InventPay Payment SDK
- Payment creation and management
- Multi-currency payment support
- Withdrawal functionality
- Balance tracking
- Transaction history
- Webhook configuration and management
- Webhook signature verification
- Merchant profile management
- TypeScript support with full type definitions
- Comprehensive error handling
- Export transactions to CSV/JSON
- Rate limiting support with automatic retry
- Public invoice API (no authentication required)
- Payment link generation
- QR code support for payments

### Features
- **Payments**
  - Create single-currency payments (BTC, ETH, LTC, USDT)
  - Create multi-currency payments
  - Get payment details
  - List payments with filters
  - Cancel pending payments
  - Get public invoice details
  - Select currency for multi-currency payments

- **Withdrawals**
  - Create withdrawal requests
  - Get withdrawal details
  - List withdrawals with filters
  - Cancel pending withdrawals
  - Get fee estimates

- **Balances**
  - Get all balances
  - Get specific currency balance
  - Track available and pending amounts

- **Transactions**
  - List transactions with filters
  - Export to CSV or JSON
  - Filter by date range, type, and currency

- **Webhooks**
  - Configure webhook URL and events
  - Test webhook configuration
  - List webhook deliveries
  - Retry failed deliveries
  - Get webhook statistics
  - Verify webhook signatures
  - Delete webhook configuration

- **Merchant**
  - Get merchant profile
  - Update merchant profile
  - Get merchant statistics

### Technical
- Built with TypeScript for type safety
- ES Module and CommonJS support
- Browser and Node.js compatible
- Automatic request timeout handling
- Built-in retry logic for rate limiting
- Comprehensive error types
- Full IntelliSense support

### Documentation
- Complete README with quick start guide
- API reference documentation
- Usage examples for Node.js
- React/Next.js integration examples
- Webhook handler examples
- Error handling guide
- Best practices guide

## [Unreleased]

### Planned
- Subscription/recurring payment support
- Refund API
- Dispute management
- Customer management
- Invoice templates
- Payment analytics dashboard
- SDK for Python
- SDK for PHP
- SDK for Ruby
- CLI tool for testing