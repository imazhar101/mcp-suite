# PayPal MCP Server

A comprehensive PayPal integration for the Model Context Protocol (MCP) that enables payment processing, transaction management, and PayPal API operations.

## Features

- **Payment Processing**: Create, execute, and manage PayPal payments
- **Transaction Management**: Handle sales, authorizations, captures, and refunds
- **OAuth Authentication**: Automatic token management with refresh capabilities
- **Webhook Events**: Monitor and retrieve PayPal webhook events
- **Multi-Environment**: Support for both sandbox and production environments
- **Comprehensive API Coverage**: 43 tools covering PayPal operations

## Installation

### From npm

```bash
npm install @imazhar101/mcp-paypal-server
```

### From source

```bash
cd mcp-suite/servers/paypal
npm install
npm run build
```

## Configuration

### Environment Variables

The server requires the following environment variables:

- `PAYPAL_CLIENT_ID` - Your PayPal application client ID
- `PAYPAL_CLIENT_SECRET` - Your PayPal application client secret
- `PAYPAL_ENVIRONMENT` - Environment (optional, defaults to "sandbox")
  - `sandbox` - PayPal sandbox environment for testing
  - `production` - PayPal production environment for live transactions

### Obtaining PayPal Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Create a new application or select an existing one
3. Copy the Client ID and Client Secret
4. Set the appropriate environment variables

## Usage

### With Claude Code

Add to your Claude Code configuration:

```json
{
  "mcpServers": {
    "paypal": {
      "command": "npx",
      "args": ["@imazhar101/mcp-paypal-server"],
      "env": {
        "PAYPAL_CLIENT_ID": "your-client-id",
        "PAYPAL_CLIENT_SECRET": "your-client-secret",
        "PAYPAL_ENVIRONMENT": "sandbox"
      }
    }
  }
}
```

### Standalone

```bash
export PAYPAL_CLIENT_ID="your-client-id"
export PAYPAL_CLIENT_SECRET="your-client-secret"
export PAYPAL_ENVIRONMENT="sandbox"
npx @imazhar101/mcp-paypal-server
```

## Available Tools (43 total)

### Payment Processing
- **paypal_create_payment** - Create a new PayPal payment with specified intent (sale, authorize, order)
- **paypal_execute_payment** - Execute a PayPal payment after user approval
- **paypal_get_payment** - Get details of a specific PayPal payment
- **paypal_list_payments** - List PayPal payments with optional filtering

### Transaction Management
- **paypal_refund_sale** - Refund a completed PayPal sale
- **paypal_capture_authorization** - Capture funds from a PayPal authorization
- **paypal_void_authorization** - Void a PayPal authorization
- **paypal_list_transactions** - List PayPal transactions with filtering and pagination

### Order Management (v2 API)
- **paypal_create_order** - Create a new PayPal order
- **paypal_get_order** - Get details of a specific PayPal order
- **paypal_capture_order** - Capture payment for a PayPal order

### Invoice Management
- **paypal_create_invoice** - Create a new PayPal invoice
- **paypal_list_invoices** - List PayPal invoices with optional filtering and pagination
- **paypal_get_invoice** - Get details of a specific PayPal invoice
- **paypal_send_invoice** - Send a PayPal invoice to recipients
- **paypal_send_invoice_reminder** - Send a reminder for an existing PayPal invoice
- **paypal_cancel_sent_invoice** - Cancel a sent PayPal invoice
- **paypal_generate_invoice_qr_code** - Generate a QR code for a PayPal invoice

### Product Catalog
- **paypal_create_product** - Create a new product in PayPal catalog
- **paypal_list_products** - List products in PayPal catalog with pagination
- **paypal_get_product** - Get details of a specific product from PayPal catalog
- **paypal_update_product** - Update an existing product in PayPal catalog

### Subscription Management
- **paypal_create_subscription_plan** - Create a new subscription plan in PayPal
- **paypal_list_subscription_plans** - List subscription plans with pagination
- **paypal_get_subscription_plan** - Get details of a specific subscription plan
- **paypal_create_subscription** - Create a new subscription
- **paypal_get_subscription** - Get details of a specific subscription
- **paypal_cancel_subscription** - Cancel an active subscription

### Dispute Management
- **paypal_list_disputes** - List PayPal disputes with optional filtering
- **paypal_get_dispute** - Get detailed information about a specific PayPal dispute
- **paypal_accept_dispute_claim** - Accept a PayPal dispute claim

### Shipping & Tracking
- **paypal_create_shipment_tracking** - Create a shipment tracking record for PayPal
- **paypal_get_shipment_tracking** - Get shipment tracking information from PayPal

### Monitoring & Utilities
- **paypal_get_webhook_events** - Get PayPal webhook events for monitoring transactions
- **paypal_test_connection** - Test the PayPal API connection and authentication

### Key Features by Category

#### Payment Processing
Create and manage payments with support for:
- Multiple payment intents (sale, authorize, order)
- Detailed item breakdown and shipping information
- Custom payer information and return/cancel URLs
- Payment execution with payer approval

#### Invoice System
Complete invoicing capabilities including:
- Rich invoice creation with merchant/billing info
- Item management with taxes and discounts
- Invoice sending and reminder notifications
- QR code generation for easy payment

#### Subscription Management
Full subscription lifecycle management:
- Product catalog management
- Flexible billing cycles and pricing
- Subscription creation and cancellation
- Payment preferences and setup fees

#### Order Management (v2 API)
Modern PayPal Orders API support:
- Enhanced order creation with detailed breakdown
- Purchase unit management
- Capture and authorization handling
- Advanced payer and application context

#### Dispute Resolution
Comprehensive dispute management:
- List and filter disputes by status
- Detailed dispute information retrieval
- Claim acceptance with refund/replace options

#### Shipping Integration
Shipment tracking capabilities:
- Multiple carrier support (FedEx, UPS, USPS, DHL, etc.)
- Real-time tracking status updates
- Buyer notification options
- Item-level tracking details

## Development

### Building

```bash
npm run build
```

### Testing

```bash
# Set environment variables
export PAYPAL_CLIENT_ID="your-test-client-id"
export PAYPAL_CLIENT_SECRET="your-test-client-secret"
export PAYPAL_ENVIRONMENT="sandbox"

# Test connection
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "paypal_test_connection", "arguments": {}}}' | node dist/index.js
```

## Payment Flow Examples

### Simple Sale Payment

1. **Create Payment:**

```json
{
  "intent": "sale",
  "amount": { "total": "25.00", "currency": "USD" },
  "description": "Product purchase",
  "return_url": "https://yoursite.com/success",
  "cancel_url": "https://yoursite.com/cancel"
}
```

2. **User approves payment on PayPal**

3. **Execute Payment:**

```json
{
  "payment_id": "PAYID-123456",
  "payer_id": "PAYER123"
}
```

### Authorization and Capture

1. **Create Authorization:**

```json
{
  "intent": "authorize",
  "amount": { "total": "100.00", "currency": "USD" },
  "return_url": "https://yoursite.com/success",
  "cancel_url": "https://yoursite.com/cancel"
}
```

2. **Execute Authorization**

3. **Capture Funds:**

```json
{
  "authorization_id": "AUTH-123456",
  "amount": { "total": "100.00", "currency": "USD" },
  "is_final_capture": true
}
```

## Error Handling

The server includes comprehensive error handling:

- **Authentication Errors**: Automatic token refresh on 401 responses
- **Rate Limiting**: Proper handling of PayPal API rate limits
- **Validation Errors**: Clear error messages for invalid requests
- **Network Errors**: Retry logic for transient failures

## Security Considerations

- Client credentials are never logged or exposed
- All API calls use HTTPS
- Access tokens are automatically refreshed before expiration
- Sandbox environment recommended for testing

## Supported PayPal Features

- ✅ Payment creation and execution (Classic API)
- ✅ Order management (v2 API)
- ✅ Authorization and capture
- ✅ Sale refunds and void operations
- ✅ Invoice creation and management
- ✅ Product catalog management
- ✅ Subscription plans and billing
- ✅ Dispute management and resolution
- ✅ Shipment tracking integration
- ✅ Transaction listing and retrieval
- ✅ Webhook event monitoring
- ✅ OAuth token management
- ✅ Multi-environment support (sandbox/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see the LICENSE file for details.
