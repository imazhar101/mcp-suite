import Stripe from 'stripe';
import { Logger } from '../../../../shared/utils/logger.js';
import {
  StripeConfig,
  StripeServiceResponse,
  PaymentIntentCreateRequest,
  CustomerCreateRequest,
  RefundCreateRequest,
  SubscriptionCreateRequest,
  PriceCreateRequest,
  ProductCreateRequest,
  InvoiceCreateRequest,
  WebhookEndpointCreateRequest,
} from '../types/index.js';

export class StripeService {
  private stripe: Stripe;
  private logger: Logger;

  constructor(config: StripeConfig, logger: Logger) {
    this.logger = logger;
    this.stripe = new Stripe(config.secretKey, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async testConnection(): Promise<StripeServiceResponse> {
    try {
      const account = await this.stripe.accounts.retrieve();
      this.logger.info('Stripe connection successful', { accountId: account.id });
      return {
        success: true,
        data: { accountId: account.id, country: account.country },
        message: 'Successfully connected to Stripe',
      };
    } catch (error) {
      this.logger.error('Stripe connection failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Payment Intents
  async createPaymentIntent(request: PaymentIntentCreateRequest): Promise<StripeServiceResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create(request);
      this.logger.info('Payment intent created', { id: paymentIntent.id });
      return {
        success: true,
        data: paymentIntent,
        message: 'Payment intent created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create payment intent', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment intent',
      };
    }
  }

  async getPaymentIntent(paymentIntentId: string): Promise<StripeServiceResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        success: true,
        data: paymentIntent,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve payment intent', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve payment intent',
      };
    }
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethod?: string): Promise<StripeServiceResponse> {
    try {
      const updateData: any = {};
      if (paymentMethod) {
        updateData.payment_method = paymentMethod;
      }
      
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, updateData);
      this.logger.info('Payment intent confirmed', { id: paymentIntent.id });
      return {
        success: true,
        data: paymentIntent,
        message: 'Payment intent confirmed successfully',
      };
    } catch (error) {
      this.logger.error('Failed to confirm payment intent', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to confirm payment intent',
      };
    }
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<StripeServiceResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId);
      this.logger.info('Payment intent cancelled', { id: paymentIntent.id });
      return {
        success: true,
        data: paymentIntent,
        message: 'Payment intent cancelled successfully',
      };
    } catch (error) {
      this.logger.error('Failed to cancel payment intent', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel payment intent',
      };
    }
  }

  async listPaymentIntents(params: { limit?: number; customer?: string }): Promise<StripeServiceResponse> {
    try {
      const paymentIntents = await this.stripe.paymentIntents.list(params);
      return {
        success: true,
        data: paymentIntents,
      };
    } catch (error) {
      this.logger.error('Failed to list payment intents', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list payment intents',
      };
    }
  }

  // Customers
  async createCustomer(request: CustomerCreateRequest): Promise<StripeServiceResponse> {
    try {
      const customer = await this.stripe.customers.create(request);
      this.logger.info('Customer created', { id: customer.id });
      return {
        success: true,
        data: customer,
        message: 'Customer created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create customer', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create customer',
      };
    }
  }

  async getCustomer(customerId: string): Promise<StripeServiceResponse> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      return {
        success: true,
        data: customer,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve customer', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve customer',
      };
    }
  }

  async updateCustomer(customerId: string, updates: Partial<CustomerCreateRequest>): Promise<StripeServiceResponse> {
    try {
      const customer = await this.stripe.customers.update(customerId, updates);
      this.logger.info('Customer updated', { id: customer.id });
      return {
        success: true,
        data: customer,
        message: 'Customer updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update customer', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update customer',
      };
    }
  }

  async listCustomers(params: { limit?: number; email?: string }): Promise<StripeServiceResponse> {
    try {
      const customers = await this.stripe.customers.list(params);
      return {
        success: true,
        data: customers,
      };
    } catch (error) {
      this.logger.error('Failed to list customers', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list customers',
      };
    }
  }

  // Payment Methods
  async createPaymentMethod(type: string, card?: any): Promise<StripeServiceResponse> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: type as any,
        card,
      });
      this.logger.info('Payment method created', { id: paymentMethod.id });
      return {
        success: true,
        data: paymentMethod,
        message: 'Payment method created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create payment method', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment method',
      };
    }
  }

  async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<StripeServiceResponse> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      this.logger.info('Payment method attached', { id: paymentMethod.id, customer: customerId });
      return {
        success: true,
        data: paymentMethod,
        message: 'Payment method attached successfully',
      };
    } catch (error) {
      this.logger.error('Failed to attach payment method', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to attach payment method',
      };
    }
  }

  async listPaymentMethods(customerId: string, type?: string): Promise<StripeServiceResponse> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: type as any,
      });
      return {
        success: true,
        data: paymentMethods,
      };
    } catch (error) {
      this.logger.error('Failed to list payment methods', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list payment methods',
      };
    }
  }

  // Refunds
  async createRefund(request: RefundCreateRequest): Promise<StripeServiceResponse> {
    try {
      const refund = await this.stripe.refunds.create(request);
      this.logger.info('Refund created', { id: refund.id });
      return {
        success: true,
        data: refund,
        message: 'Refund created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create refund', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create refund',
      };
    }
  }

  async getRefund(refundId: string): Promise<StripeServiceResponse> {
    try {
      const refund = await this.stripe.refunds.retrieve(refundId);
      return {
        success: true,
        data: refund,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve refund', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve refund',
      };
    }
  }

  // Products
  async createProduct(request: ProductCreateRequest): Promise<StripeServiceResponse> {
    try {
      const product = await this.stripe.products.create(request);
      this.logger.info('Product created', { id: product.id });
      return {
        success: true,
        data: product,
        message: 'Product created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create product', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create product',
      };
    }
  }

  async listProducts(params: { limit?: number; active?: boolean }): Promise<StripeServiceResponse> {
    try {
      const products = await this.stripe.products.list(params);
      return {
        success: true,
        data: products,
      };
    } catch (error) {
      this.logger.error('Failed to list products', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list products',
      };
    }
  }

  // Prices
  async createPrice(request: PriceCreateRequest): Promise<StripeServiceResponse> {
    try {
      const price = await this.stripe.prices.create(request);
      this.logger.info('Price created', { id: price.id });
      return {
        success: true,
        data: price,
        message: 'Price created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create price', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create price',
      };
    }
  }

  async listPrices(params: { limit?: number; product?: string; active?: boolean }): Promise<StripeServiceResponse> {
    try {
      const prices = await this.stripe.prices.list(params);
      return {
        success: true,
        data: prices,
      };
    } catch (error) {
      this.logger.error('Failed to list prices', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list prices',
      };
    }
  }

  // Subscriptions
  async createSubscription(request: SubscriptionCreateRequest): Promise<StripeServiceResponse> {
    try {
      const subscription = await this.stripe.subscriptions.create(request);
      this.logger.info('Subscription created', { id: subscription.id });
      return {
        success: true,
        data: subscription,
        message: 'Subscription created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create subscription', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create subscription',
      };
    }
  }

  async getSubscription(subscriptionId: string): Promise<StripeServiceResponse> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return {
        success: true,
        data: subscription,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve subscription', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve subscription',
      };
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<StripeServiceResponse> {
    try {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      this.logger.info('Subscription cancelled', { id: subscription.id });
      return {
        success: true,
        data: subscription,
        message: 'Subscription cancelled successfully',
      };
    } catch (error) {
      this.logger.error('Failed to cancel subscription', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel subscription',
      };
    }
  }

  async listSubscriptions(params: { limit?: number; customer?: string; status?: string }): Promise<StripeServiceResponse> {
    try {
      const listParams: any = {
        limit: params.limit,
        customer: params.customer,
      };
      if (params.status) {
        listParams.status = params.status;
      }
      const subscriptions = await this.stripe.subscriptions.list(listParams);
      return {
        success: true,
        data: subscriptions,
      };
    } catch (error) {
      this.logger.error('Failed to list subscriptions', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list subscriptions',
      };
    }
  }

  // Invoices
  async createInvoice(request: InvoiceCreateRequest): Promise<StripeServiceResponse> {
    try {
      const invoice = await this.stripe.invoices.create(request);
      this.logger.info('Invoice created', { id: invoice.id });
      return {
        success: true,
        data: invoice,
        message: 'Invoice created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create invoice', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create invoice',
      };
    }
  }

  async listInvoices(params: { limit?: number; customer?: string }): Promise<StripeServiceResponse> {
    try {
      const invoices = await this.stripe.invoices.list(params);
      return {
        success: true,
        data: invoices,
      };
    } catch (error) {
      this.logger.error('Failed to list invoices', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list invoices',
      };
    }
  }

  // Webhook Endpoints
  async createWebhookEndpoint(request: WebhookEndpointCreateRequest): Promise<StripeServiceResponse> {
    try {
      const endpoint = await this.stripe.webhookEndpoints.create({
        url: request.url,
        enabled_events: request.enabled_events as any,
        description: request.description,
        metadata: request.metadata,
      });
      this.logger.info('Webhook endpoint created', { id: endpoint.id });
      return {
        success: true,
        data: endpoint,
        message: 'Webhook endpoint created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create webhook endpoint', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create webhook endpoint',
      };
    }
  }

  async listWebhookEndpoints(): Promise<StripeServiceResponse> {
    try {
      const endpoints = await this.stripe.webhookEndpoints.list();
      return {
        success: true,
        data: endpoints,
      };
    } catch (error) {
      this.logger.error('Failed to list webhook endpoints', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list webhook endpoints',
      };
    }
  }

  // Charges
  async listCharges(params: { limit?: number; customer?: string }): Promise<StripeServiceResponse> {
    try {
      const charges = await this.stripe.charges.list(params);
      return {
        success: true,
        data: charges,
      };
    } catch (error) {
      this.logger.error('Failed to list charges', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list charges',
      };
    }
  }

  async getCharge(chargeId: string): Promise<StripeServiceResponse> {
    try {
      const charge = await this.stripe.charges.retrieve(chargeId);
      return {
        success: true,
        data: charge,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve charge', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve charge',
      };
    }
  }
}