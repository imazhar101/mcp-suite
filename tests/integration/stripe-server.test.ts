import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ChildProcess, spawn } from 'child_process';
import { createClient } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

describe('Stripe Server Integration Tests', () => {
  let serverProcess: ChildProcess;
  let client: any;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    // Skip tests if Stripe credentials are not available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('Skipping Stripe tests - STRIPE_SECRET_KEY not set');
      return;
    }

    // Start the Stripe server
    serverProcess = spawn('node', ['./servers/stripe/dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      },
    });

    // Create client and transport
    transport = new StdioClientTransport({
      reader: serverProcess.stdout!,
      writer: serverProcess.stdin!,
    });

    client = createClient(
      {
        name: 'stripe-test-client',
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

  it('should connect to Stripe API successfully', async () => {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('Skipping test - STRIPE_SECRET_KEY not set');
      return;
    }

    const result = await client.callTool({
      name: 'stripe_test_connection',
      arguments: {},
    });

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].type).toBe('text');
    
    const responseData = JSON.parse(result.content[0].text);
    expect(responseData.success).toBe(true);
    expect(responseData.data).toBeDefined();
    expect(responseData.data.accountId).toBeDefined();
  }, 30000);

  it('should list available tools', async () => {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('Skipping test - STRIPE_SECRET_KEY not set');
      return;
    }

    const result = await client.listTools();

    expect(result).toBeDefined();
    expect(result.tools).toBeDefined();
    expect(Array.isArray(result.tools)).toBe(true);
    expect(result.tools.length).toBeGreaterThan(0);

    // Check that key Stripe tools are available
    const toolNames = result.tools.map((tool: any) => tool.name);
    expect(toolNames).toContain('stripe_test_connection');
    expect(toolNames).toContain('stripe_create_payment_intent');
    expect(toolNames).toContain('stripe_create_customer');
    expect(toolNames).toContain('stripe_list_customers');
    expect(toolNames).toContain('stripe_create_product');
    expect(toolNames).toContain('stripe_create_subscription');
  });

  it('should create a test customer', async () => {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('Skipping test - STRIPE_SECRET_KEY not set');
      return;
    }

    const testEmail = `test-${Date.now()}@example.com`;
    const result = await client.callTool({
      name: 'stripe_create_customer',
      arguments: {
        email: testEmail,
        name: 'Test Customer',
        description: 'Test customer for integration tests',
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
    expect(responseData.data.id).toMatch(/^cus_/); // Stripe customer ID format
    expect(responseData.data.email).toBe(testEmail);
    expect(responseData.data.name).toBe('Test Customer');
  }, 30000);

  it('should create a test payment intent', async () => {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('Skipping test - STRIPE_SECRET_KEY not set');
      return;
    }

    const result = await client.callTool({
      name: 'stripe_create_payment_intent',
      arguments: {
        amount: 1000, // $10.00 in cents
        currency: 'usd',
        description: 'Test payment intent',
        automatic_payment_methods: {
          enabled: true,
        },
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
    expect(responseData.data.id).toMatch(/^pi_/); // Stripe payment intent ID format
    expect(responseData.data.amount).toBe(1000);
    expect(responseData.data.currency).toBe('usd');
    expect(responseData.data.status).toBe('requires_payment_method');
  }, 30000);

  it('should list customers', async () => {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('Skipping test - STRIPE_SECRET_KEY not set');
      return;
    }

    const result = await client.callTool({
      name: 'stripe_list_customers',
      arguments: {
        limit: 5,
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
    expect(responseData.data.object).toBe('list');
    expect(Array.isArray(responseData.data.data)).toBe(true);
  }, 30000);

  it('should create a test product', async () => {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('Skipping test - STRIPE_SECRET_KEY not set');
      return;
    }

    const productName = `Test Product ${Date.now()}`;
    const result = await client.callTool({
      name: 'stripe_create_product',
      arguments: {
        name: productName,
        description: 'Test product for integration tests',
        type: 'service',
        active: true,
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
    expect(responseData.data.id).toMatch(/^prod_/); // Stripe product ID format
    expect(responseData.data.name).toBe(productName);
    expect(responseData.data.type).toBe('service');
    expect(responseData.data.active).toBe(true);
  }, 30000);

  it('should handle errors gracefully for invalid requests', async () => {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('Skipping test - STRIPE_SECRET_KEY not set');
      return;
    }

    const result = await client.callTool({
      name: 'stripe_create_payment_intent',
      arguments: {
        // Missing required amount parameter
        currency: 'usd',
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