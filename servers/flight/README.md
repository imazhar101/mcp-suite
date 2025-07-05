# Flight MCP Server

A Model Context Protocol (MCP) server that integrates with the [Duffel API](https://duffel.com/) to provide comprehensive flight booking and management capabilities.

## Features

### Core Flight Operations
- **Flight Search**: Search for flights between airports with various filters
- **Offer Management**: Get and manage flight offers from search results
- **Booking Management**: Create, retrieve, and cancel flight bookings
- **Seat Maps**: Access seat maps for specific flight offers

### Reference Data
- **Airlines**: Get information about airlines
- **Airports**: Search and get airport information by IATA code

### Available Tools

1. **duffel_test_connection** - Test connection to Duffel API
2. **duffel_search_flights** - Search for flights between airports
3. **duffel_get_offer_request** - Get details of a specific offer request
4. **duffel_get_offers** - Get available offers for an offer request
5. **duffel_get_offer** - Get details of a specific offer
6. **duffel_create_order** - Create a booking order from selected offers
7. **duffel_get_order** - Get details of a specific order
8. **duffel_list_orders** - List all orders with pagination
9. **duffel_cancel_order** - Cancel a specific order
10. **duffel_get_seat_maps** - Get seat maps for a specific offer
11. **duffel_get_airlines** - Get list of airlines
12. **duffel_get_airports** - Get list of airports

## Configuration

### Environment Variables

- `DUFFEL_API_KEY` (required): Your Duffel API key
- `DUFFEL_ENVIRONMENT` (optional): Either 'test' or 'live' (defaults to 'test')

### Getting a Duffel API Key

1. Sign up at [Duffel](https://duffel.com/)
2. Create a new API key in your dashboard
3. Use the test key for development and the live key for production

## Usage

### Basic Flight Search

```json
{
  "name": "duffel_search_flights",
  "arguments": {
    "origin": "JFK",
    "destination": "LAX",
    "departure_date": "2024-12-15",
    "passengers": {
      "adults": 1
    },
    "cabin_class": "economy"
  }
}
```

### Round-trip Search

```json
{
  "name": "duffel_search_flights",
  "arguments": {
    "origin": "JFK",
    "destination": "LAX",
    "departure_date": "2024-12-15",
    "return_date": "2024-12-22",
    "passengers": {
      "adults": 2,
      "children": 1
    },
    "cabin_class": "business"
  }
}
```

### Get Available Offers

```json
{
  "name": "duffel_get_offers",
  "arguments": {
    "offer_request_id": "orq_12345",
    "limit": 10
  }
}
```

### Create a Booking

```json
{
  "name": "duffel_create_order",
  "arguments": {
    "selected_offers": ["off_12345"],
    "passengers": [
      {
        "id": "pas_12345",
        "type": "adult",
        "given_name": "John",
        "family_name": "Doe",
        "gender": "M",
        "born_on": "1990-01-01",
        "email": "john@example.com",
        "phone_number": "+1234567890"
      }
    ],
    "type": "hold"
  }
}
```

## Development

### Building

```bash
# Build the flight server
npm run build --server=flight

# Build all servers
npm run build
```

### Testing

```bash
# Run integration tests (requires DUFFEL_API_KEY)
npm test

# Run specific test file
npx vitest run tests/integration/flight-server.test.ts
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## API Reference

The server implements the full Duffel API for flight booking operations. Key concepts:

- **Offer Request**: A search query that generates multiple flight offers
- **Offer**: A specific flight option with pricing and availability
- **Order**: A confirmed booking with passenger details
- **Slice**: A one-way journey (outbound or return)
- **Segment**: A single flight leg within a slice

## Error Handling

The server provides comprehensive error handling for:
- Invalid API credentials
- Malformed requests
- Network connectivity issues
- Duffel API rate limits
- Booking validation errors

All errors are returned in a consistent format with detailed error messages.

## License

MIT