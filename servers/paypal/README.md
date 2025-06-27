# PayPal MCP Server

A comprehensive PayPal integration for the Model Context Protocol (MCP) that enables payment processing, transaction management, and PayPal API operations.

## Features

- **Payment Processing**: Create, execute, and manage PayPal payments
- **Transaction Management**: Handle sales, authorizations, captures, and refunds
- **OAuth Authentication**: Automatic token management with refresh capabilities
- **Webhook Events**: Monitor and retrieve PayPal webhook events
- **Multi-Environment**: Support for both sandbox and production environments
- **Comprehensive API Coverage**: 9 tools covering core PayPal operations

## Installation

### From npm

```bash
npm install @mcp-suite/paypal-server
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
      "args": ["@mcp-suite/paypal-server"],
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
npx @mcp-suite/paypal-server
```

## Available Tools

### 1. paypal_create_payment

Create a new PayPal payment with specified intent.

**Parameters:**

- `intent` (required): Payment intent - "sale", "authorize", or "order"
- `amount` (required): Payment amount with total and currency
- `return_url` (required): URL to redirect after successful payment
- `cancel_url` (required): URL to redirect after cancelled payment
- `description`: Payment description
- `invoice_number`: Invoice number for tracking
- `items`: Array of item details
- `payer_info`: Payer information (email, name)

**Example:**

```json
{
  "intent": "sale",
  "amount": {
    "total": "10.00",
    "currency": "USD"
  },
  "description": "Test payment",
  "return_url": "https://example.com/success",
  "cancel_url": "https://example.com/cancel"
}
```

### 2. paypal_execute_payment

Execute a PayPal payment after user approval.

**Parameters:**

- `payment_id` (required): Payment ID to execute
- `payer_id` (required): Payer ID from PayPal approval
- `transactions`: Optional transaction details for verification

### 3. paypal_get_payment

Get details of a specific PayPal payment.

**Parameters:**

- `payment_id` (required): Payment ID to retrieve

### 4. paypal_list_payments

List PayPal payments with optional filtering.

**Parameters:**

- `count`: Number of payments to return (max 20)
- `start_index`: Starting index for pagination
- `start_time`: Start time filter (RFC 3339 format)
- `end_time`: End time filter (RFC 3339 format)
- `sort_by`: Sort field ("create_time" or "update_time")
- `sort_order`: Sort order ("asc" or "desc")

### 5. paypal_refund_sale

Refund a completed PayPal sale.

**Parameters:**

- `sale_id` (required): Sale ID to refund
- `amount`: Refund amount (leave empty for full refund)
- `description`: Refund description
- `invoice_number`: Invoice number for tracking

### 6. paypal_capture_authorization

Capture funds from a PayPal authorization.

**Parameters:**

- `authorization_id` (required): Authorization ID to capture
- `amount` (required): Amount to capture with total and currency
- `is_final_capture`: Whether this is the final capture

### 7. paypal_void_authorization

Void a PayPal authorization.

**Parameters:**

- `authorization_id` (required): Authorization ID to void

### 8. paypal_get_webhook_events

Get PayPal webhook events for monitoring transactions.

**Parameters:**

- `page_size`: Number of events to return (max 300)
- `start_time`: Start time filter (RFC 3339 format)
- `end_time`: End time filter (RFC 3339 format)
- `transaction_id`: Filter by transaction ID

### 9. paypal_test_connection

Test the PayPal API connection and authentication.

**Parameters:** None

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

- ✅ Payment creation and execution
- ✅ Authorization and capture
- ✅ Sale refunds
- ✅ Payment listing and retrieval
- ✅ Webhook event monitoring
- ✅ OAuth token management
- ✅ Multi-environment support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see the LICENSE file for details.
