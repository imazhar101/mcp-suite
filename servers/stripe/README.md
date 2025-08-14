# Stripe MCP Server

A Model Context Protocol (MCP) server that provides comprehensive integration with Stripe's payment processing API. This server enables AI assistants to manage payments, customers, subscriptions, and other Stripe resources.

## Features

### Payment Processing
- **Payment Intents**: Create, confirm, cancel, and manage payment intents
- **Payment Methods**: Create and manage payment methods for customers
- **Refunds**: Process full or partial refunds for payments
- **Charges**: Retrieve and list charge information

### Customer Management
- **Customers**: Create, update, retrieve, and list customers
- **Payment Methods**: Attach and manage customer payment methods

### Products & Pricing
- **Products**: Create and manage products in your catalog
- **Prices**: Set up pricing for products including one-time and recurring prices
- **Subscriptions**: Create and manage customer subscriptions

### Billing & Invoicing
- **Invoices**: Create and manage invoices for customers
- **Subscriptions**: Handle recurring billing and subscription management

### Webhooks & Integration
- **Webhook Endpoints**: Set up webhook endpoints for real-time event notifications
- **Connection Testing**: Verify API connectivity and account information

## Available Tools

### Connection & Testing
- `stripe_test_connection` - Test Stripe API connection and retrieve account info

### Payment Intents (5 tools)
- `stripe_create_payment_intent` - Create a new payment intent
- `stripe_get_payment_intent` - Retrieve payment intent details
- `stripe_confirm_payment_intent` - Confirm and process a payment
- `stripe_cancel_payment_intent` - Cancel a payment intent
- `stripe_list_payment_intents` - List payment intents with filters

### Customer Management (4 tools)
- `stripe_create_customer` - Create a new customer
- `stripe_get_customer` - Retrieve customer information
- `stripe_update_customer` - Update customer details
- `stripe_list_customers` - List customers with filters

### Payment Methods (3 tools)
- `stripe_create_payment_method` - Create a new payment method
- `stripe_attach_payment_method` - Attach payment method to customer
- `stripe_list_payment_methods` - List customer's payment methods

### Refunds (2 tools)
- `stripe_create_refund` - Create refund for payment or charge
- `stripe_get_refund` - Retrieve refund information

### Products & Catalog (4 tools)
- `stripe_create_product` - Create a new product
- `stripe_list_products` - List products in catalog
- `stripe_create_price` - Create pricing for products
- `stripe_list_prices` - List prices with filters

### Subscriptions (4 tools)
- `stripe_create_subscription` - Create customer subscription
- `stripe_get_subscription` - Retrieve subscription details
- `stripe_cancel_subscription` - Cancel a subscription
- `stripe_list_subscriptions` - List subscriptions with filters

### Invoices (2 tools)
- `stripe_create_invoice` - Create customer invoice
- `stripe_list_invoices` - List invoices with filters

### Webhooks (2 tools)
- `stripe_create_webhook_endpoint` - Set up webhook endpoint
- `stripe_list_webhook_endpoints` - List webhook endpoints

### Charges (2 tools)
- `stripe_list_charges` - List charges with filters
- `stripe_get_charge` - Retrieve charge details

**Total: 33 tools**

## Setup

### Prerequisites
- Node.js 18+ and npm
- A Stripe account with API access
- Stripe API keys (test or live mode)

### Environment Variables
Set these environment variables:

```bash
# Required
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key

# Optional
STRIPE_WEBHOOK_SECRET=whsec_... # For webhook signature verification
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd servers/stripe
   npm install
   ```
3. Build the server:
   ```bash
   npm run build
   ```

## Usage

### Running the Server
```bash
# Development mode with auto-rebuild
npm run dev

# Production mode
npm start

# Or run directly
node dist/index.js
```

### Integration with MCP Clients
Add this server to your MCP client configuration:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "node",
      "args": ["/path/to/mcp-suite/servers/stripe/dist/index.js"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_..."
      }
    }
  }
}
```

## Example Usage

### Basic Payment Flow
```typescript
// 1. Create a customer
const customer = await stripe_create_customer({
  email: "customer@example.com",
  name: "John Doe"
});

// 2. Create a payment intent
const paymentIntent = await stripe_create_payment_intent({
  amount: 2000, // $20.00 in cents
  currency: "usd",
  customer: customer.id,
  automatic_payment_methods: { enabled: true }
});

// 3. Confirm the payment (typically done on frontend)
const confirmedPayment = await stripe_confirm_payment_intent({
  payment_intent_id: paymentIntent.id
});
```

### Subscription Setup
```typescript
// 1. Create a product
const product = await stripe_create_product({
  name: "Monthly Subscription",
  type: "service"
});

// 2. Create a price
const price = await stripe_create_price({
  currency: "usd",
  product: product.id,
  unit_amount: 999, // $9.99
  recurring: {
    interval: "month"
  }
});

// 3. Create subscription for customer
const subscription = await stripe_create_subscription({
  customer: customer.id,
  items: [{ price: price.id }]
});
```

## Security Considerations

- **API Keys**: Never expose your Stripe secret keys in client-side code
- **Webhooks**: Use webhook secrets to verify event authenticity
- **Testing**: Use Stripe's test mode for development and testing
- **Permissions**: Ensure your Stripe account has appropriate permissions for the operations you need

## Testing

### Using Stripe Test Mode
- Use test API keys (starting with `sk_test_`)
- Use test card numbers provided by Stripe
- No real money is processed in test mode

### Test Cards
```javascript
// Successful payment
card_number: "4242424242424242"

// Declined payment
card_number: "4000000000000002"

// Requires authentication
card_number: "4000002500003155"
```

## Error Handling

The server provides detailed error messages for common scenarios:
- Invalid API keys
- Insufficient permissions
- Rate limiting
- Invalid parameters
- Network connectivity issues

All responses follow a consistent format:
```json
{
  "success": true|false,
  "data": {...}, // On success
  "error": "Error message", // On failure
  "message": "Human-readable message"
}
```

## Rate Limits

Stripe enforces rate limits on API requests. The server handles rate limiting gracefully and provides appropriate error messages when limits are exceeded.

## Support

- [Stripe API Documentation](https://docs.stripe.com/api)
- [Stripe Testing Guide](https://docs.stripe.com/testing)
- [MCP Documentation](https://modelcontextprotocol.io/)

## License

This project is licensed under the MIT License.