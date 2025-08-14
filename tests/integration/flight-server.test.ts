import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ChildProcess, spawn } from 'child_process';
import { createClient } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

describe('Flight Server Integration Tests', () => {
  let serverProcess: ChildProcess;
  let client: any;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    // Skip tests if Duffel credentials are not available
    if (!process.env.DUFFEL_API_KEY) {
      console.log('Skipping Flight tests - DUFFEL_API_KEY not set');
      return;
    }

    // Start the Flight server
    serverProcess = spawn('node', ['./servers/flight/dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        DUFFEL_API_KEY: process.env.DUFFEL_API_KEY,
        DUFFEL_ENVIRONMENT: process.env.DUFFEL_ENVIRONMENT || 'test',
      },
    });

    // Create client and transport
    transport = new StdioClientTransport({
      reader: serverProcess.stdout!,
      writer: serverProcess.stdin!,
    });

    client = createClient(
      {
        name: 'flight-test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );

    await client.connect(transport);
  }, 10000);

  afterAll(async () => {
    if (client && transport) {
      await client.close();
      await transport.close();
    }
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it('should connect to Duffel API successfully', async () => {
    if (!process.env.DUFFEL_API_KEY) {
      console.log('Skipping test - DUFFEL_API_KEY not set');
      return;
    }

    const result = await client.callTool({
      name: 'duffel_test_connection',
      arguments: {},
    });

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].type).toBe('text');
    
    const responseData = JSON.parse(result.content[0].text);
    expect(responseData.success).toBe(true);
    expect(responseData.message).toBe('Successfully connected to Duffel API');
  }, 30000);

  it('should list available tools', async () => {
    if (!process.env.DUFFEL_API_KEY) {
      console.log('Skipping test - DUFFEL_API_KEY not set');
      return;
    }

    const result = await client.listTools();

    expect(result).toBeDefined();
    expect(result.tools).toBeDefined();
    expect(Array.isArray(result.tools)).toBe(true);
    expect(result.tools.length).toBeGreaterThan(0);

    // Check that key Flight tools are available
    const toolNames = result.tools.map((tool: any) => tool.name);
    expect(toolNames).toContain('duffel_test_connection');
    expect(toolNames).toContain('duffel_search_flights');
    expect(toolNames).toContain('duffel_get_offer_request');
    expect(toolNames).toContain('duffel_get_offers');
    expect(toolNames).toContain('duffel_get_offer');
    expect(toolNames).toContain('duffel_create_order');
    expect(toolNames).toContain('duffel_get_order');
    expect(toolNames).toContain('duffel_list_orders');
    expect(toolNames).toContain('duffel_cancel_order');
    expect(toolNames).toContain('duffel_get_seat_maps');
    expect(toolNames).toContain('duffel_get_airlines');
    expect(toolNames).toContain('duffel_get_airports');
  });

  it('should get airlines list', async () => {
    if (!process.env.DUFFEL_API_KEY) {
      console.log('Skipping test - DUFFEL_API_KEY not set');
      return;
    }

    const result = await client.callTool({
      name: 'duffel_get_airlines',
      arguments: {
        limit: 10,
      },
    });

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].type).toBe('text');
    
    const responseData = JSON.parse(result.content[0].text);
    expect(responseData.success).toBe(true);
    expect(responseData.data).toBeDefined();
    expect(Array.isArray(responseData.data)).toBe(true);
    expect(responseData.data.length).toBeGreaterThan(0);
    
    // Check airline structure
    const airline = responseData.data[0];
    expect(airline.id).toBeDefined();
    expect(airline.name).toBeDefined();
    expect(airline.iata_code).toBeDefined();
  }, 30000);

  it('should get airports list', async () => {
    if (!process.env.DUFFEL_API_KEY) {
      console.log('Skipping test - DUFFEL_API_KEY not set');
      return;
    }

    const result = await client.callTool({
      name: 'duffel_get_airports',
      arguments: {
        limit: 10,
        iata_code: 'JFK',
      },
    });

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].type).toBe('text');
    
    const responseData = JSON.parse(result.content[0].text);
    expect(responseData.success).toBe(true);
    expect(responseData.data).toBeDefined();
    expect(Array.isArray(responseData.data)).toBe(true);
    expect(responseData.data.length).toBeGreaterThan(0);
    
    // Check airport structure
    const airport = responseData.data[0];
    expect(airport.id).toBeDefined();
    expect(airport.name).toBeDefined();
    expect(airport.iata_code).toBeDefined();
    expect(airport.city_name).toBeDefined();
    expect(airport.country_name).toBeDefined();
  }, 30000);

  it('should search for flights', async () => {
    if (!process.env.DUFFEL_API_KEY) {
      console.log('Skipping test - DUFFEL_API_KEY not set');
      return;
    }

    // Get tomorrow's date for departure
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const departureDate = tomorrow.toISOString().split('T')[0];

    const result = await client.callTool({
      name: 'duffel_search_flights',
      arguments: {
        origin: 'JFK',
        destination: 'LAX',
        departure_date: departureDate,
        passengers: {
          adults: 1,
        },
        cabin_class: 'economy',
      },
    });

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].type).toBe('text');
    
    const responseData = JSON.parse(result.content[0].text);
    expect(responseData.success).toBe(true);
    expect(responseData.data).toBeDefined();
    expect(responseData.data.id).toBeDefined();
    expect(responseData.data.slices).toBeDefined();
    expect(Array.isArray(responseData.data.slices)).toBe(true);
    expect(responseData.data.passengers).toBeDefined();
    expect(Array.isArray(responseData.data.passengers)).toBe(true);
  }, 30000);

  it('should handle errors gracefully for invalid requests', async () => {
    if (!process.env.DUFFEL_API_KEY) {
      console.log('Skipping test - DUFFEL_API_KEY not set');
      return;
    }

    const result = await client.callTool({
      name: 'duffel_search_flights',
      arguments: {
        // Missing required parameters
        origin: 'JFK',
        // destination is missing
        departure_date: '2024-12-01',
        passengers: {
          adults: 1,
        },
      },
    });

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].type).toBe('text');
    
    const responseData = JSON.parse(result.content[0].text);
    expect(responseData.success).toBe(false);
    expect(responseData.error).toBeDefined();
    expect(typeof responseData.error).toBe('string');
  }, 30000);
});