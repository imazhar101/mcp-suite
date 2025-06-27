import axios, { AxiosInstance } from "axios";
import { Logger } from "../../../../shared/utils/logger.js";
import {
  PayPalConfig,
  PayPalAuthResponse,
  PayPalPayment,
  PayPalCreatePaymentRequest,
  PayPalExecutePaymentRequest,
  PayPalRefundRequest,
  PayPalWebhookEvent,
} from "../types/index.js";

export class PayPalService {
  private client: AxiosInstance;
  private logger: Logger;
  private config: PayPalConfig;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(config: PayPalConfig, logger: Logger) {
    this.config = {
      ...config,
      environment: config.environment || "sandbox",
    };
    this.logger = logger;

    const baseURL =
      this.config.environment === "production"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      async (config) => {
        if (!config.url?.includes("/oauth2/token")) {
          await this.ensureValidToken();
          if (this.accessToken) {
            config.headers.Authorization = `Bearer ${this.accessToken}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          this.accessToken = null;
          await this.ensureValidToken();
          if (this.accessToken) {
            error.config.headers.Authorization = `Bearer ${this.accessToken}`;
            return this.client.request(error.config);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async ensureValidToken(): Promise<void> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return;
    }

    try {
      const auth = Buffer.from(
        `${this.config.clientId}:${this.config.clientSecret}`
      ).toString("base64");

      const response = await this.client.post<PayPalAuthResponse>(
        "/v1/oauth2/token",
        "grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt =
        Date.now() + response.data.expires_in * 1000 - 60000; // 1 minute buffer

      this.logger.info("PayPal access token refreshed");
    } catch (error) {
      this.logger.error("Failed to get PayPal access token", error);
      throw new Error("PayPal authentication failed");
    }
  }

  async createPayment(
    paymentData: PayPalCreatePaymentRequest
  ): Promise<{ success: boolean; data?: PayPalPayment; error?: string }> {
    try {
      this.logger.info("Creating PayPal payment", {
        intent: paymentData.intent,
      });

      const response = await this.client.post<PayPalPayment>(
        "/v1/payments/payment",
        paymentData
      );

      this.logger.info("PayPal payment created successfully", {
        paymentId: response.data.id,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to create PayPal payment", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create payment",
      };
    }
  }

  async executePayment(
    paymentId: string,
    executeData: PayPalExecutePaymentRequest
  ): Promise<{ success: boolean; data?: PayPalPayment; error?: string }> {
    try {
      this.logger.info("Executing PayPal payment", {
        paymentId,
        payerId: executeData.payer_id,
      });

      const response = await this.client.post<PayPalPayment>(
        `/v1/payments/payment/${paymentId}/execute`,
        executeData
      );

      this.logger.info("PayPal payment executed successfully", {
        paymentId: response.data.id,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to execute PayPal payment", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to execute payment",
      };
    }
  }

  async getPayment(
    paymentId: string
  ): Promise<{ success: boolean; data?: PayPalPayment; error?: string }> {
    try {
      this.logger.info("Fetching PayPal payment", { paymentId });

      const response = await this.client.get<PayPalPayment>(
        `/v1/payments/payment/${paymentId}`
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to fetch PayPal payment", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch payment",
      };
    }
  }

  async listPayments(
    params: {
      count?: number;
      start_id?: string;
      start_index?: number;
      start_time?: string;
      end_time?: string;
      payee_id?: string;
      sort_by?: string;
      sort_order?: "asc" | "desc";
    } = {}
  ): Promise<{
    success: boolean;
    data?: { payments: PayPalPayment[]; count: number; next_id?: string };
    error?: string;
  }> {
    try {
      this.logger.info("Listing PayPal payments", params);

      const response = await this.client.get("/v1/payments/payment", {
        params,
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to list PayPal payments", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to list payments",
      };
    }
  }

  async refundSale(
    saleId: string,
    refundData?: PayPalRefundRequest
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Refunding PayPal sale", {
        saleId,
        amount: refundData?.amount,
      });

      const response = await this.client.post(
        `/v1/payments/sale/${saleId}/refund`,
        refundData || {}
      );

      this.logger.info("PayPal sale refunded successfully", {
        saleId,
        refundId: response.data.id,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to refund PayPal sale", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to refund sale",
      };
    }
  }

  async captureAuthorization(
    authorizationId: string,
    captureData: {
      amount: { total: string; currency: string };
      is_final_capture?: boolean;
    }
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Capturing PayPal authorization", {
        authorizationId,
        amount: captureData.amount,
      });

      const response = await this.client.post(
        `/v1/payments/authorization/${authorizationId}/capture`,
        captureData
      );

      this.logger.info("PayPal authorization captured successfully", {
        authorizationId,
        captureId: response.data.id,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to capture PayPal authorization", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to capture authorization",
      };
    }
  }

  async voidAuthorization(
    authorizationId: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Voiding PayPal authorization", { authorizationId });

      const response = await this.client.post(
        `/v1/payments/authorization/${authorizationId}/void`
      );

      this.logger.info("PayPal authorization voided successfully", {
        authorizationId,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to void PayPal authorization", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to void authorization",
      };
    }
  }

  async getWebhookEvents(
    params: {
      page_size?: number;
      start_time?: string;
      end_time?: string;
      transaction_id?: string;
    } = {}
  ): Promise<{
    success: boolean;
    data?: { events: PayPalWebhookEvent[]; count: number; links: any[] };
    error?: string;
  }> {
    try {
      this.logger.info("Fetching PayPal webhook events", params);

      const response = await this.client.get(
        "/v1/notifications/webhooks-events",
        { params }
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to fetch PayPal webhook events", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch webhook events",
      };
    }
  }

  async testConnection(): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      await this.ensureValidToken();

      // Test with a simple API call
      await this.client.get("/v1/payments/payment?count=1");

      return {
        success: true,
        message: `Successfully connected to PayPal ${this.config.environment} environment`,
      };
    } catch (error: any) {
      this.logger.error("PayPal connection test failed", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Connection test failed",
      };
    }
  }

  // Invoice Management Methods
  async createInvoice(
    invoiceData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Creating PayPal invoice");
      const response = await this.client.post(
        "/v2/invoicing/invoices",
        invoiceData
      );
      this.logger.info("PayPal invoice created successfully", {
        invoiceId: response.data.id,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to create PayPal invoice", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create invoice",
      };
    }
  }

  async listInvoices(
    params: any = {}
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Listing PayPal invoices", params);
      const response = await this.client.get("/v2/invoicing/invoices", {
        params,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to list PayPal invoices", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to list invoices",
      };
    }
  }

  async getInvoice(
    invoiceId: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Fetching PayPal invoice", { invoiceId });
      const response = await this.client.get(
        `/v2/invoicing/invoices/${invoiceId}`
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to fetch PayPal invoice", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch invoice",
      };
    }
  }

  async sendInvoice(
    invoiceId: string,
    sendData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Sending PayPal invoice", { invoiceId });
      const response = await this.client.post(
        `/v2/invoicing/invoices/${invoiceId}/send`,
        sendData
      );
      this.logger.info("PayPal invoice sent successfully", { invoiceId });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to send PayPal invoice", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to send invoice",
      };
    }
  }

  async sendInvoiceReminder(
    invoiceId: string,
    reminderData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Sending PayPal invoice reminder", { invoiceId });
      const response = await this.client.post(
        `/v2/invoicing/invoices/${invoiceId}/remind`,
        reminderData
      );
      this.logger.info("PayPal invoice reminder sent successfully", {
        invoiceId,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to send PayPal invoice reminder", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to send invoice reminder",
      };
    }
  }

  async cancelSentInvoice(
    invoiceId: string,
    cancelData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Cancelling PayPal invoice", { invoiceId });
      const response = await this.client.post(
        `/v2/invoicing/invoices/${invoiceId}/cancel`,
        cancelData
      );
      this.logger.info("PayPal invoice cancelled successfully", { invoiceId });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to cancel PayPal invoice", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to cancel invoice",
      };
    }
  }

  async generateInvoiceQrCode(
    invoiceId: string,
    qrData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Generating PayPal invoice QR code", { invoiceId });
      const response = await this.client.post(
        `/v2/invoicing/invoices/${invoiceId}/generate-qr-code`,
        qrData
      );
      this.logger.info("PayPal invoice QR code generated successfully", {
        invoiceId,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to generate PayPal invoice QR code", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to generate QR code",
      };
    }
  }

  // Order Management Methods
  async createOrder(
    orderData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Creating PayPal order", { intent: orderData.intent });
      const response = await this.client.post("/v2/checkout/orders", orderData);
      this.logger.info("PayPal order created successfully", {
        orderId: response.data.id,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to create PayPal order", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create order",
      };
    }
  }

  async getOrder(
    orderId: string,
    fields?: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Fetching PayPal order", { orderId });
      const params = fields ? { fields } : {};
      const response = await this.client.get(`/v2/checkout/orders/${orderId}`, {
        params,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to fetch PayPal order", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch order",
      };
    }
  }

  async captureOrder(
    orderId: string,
    paymentSource?: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Capturing PayPal order", { orderId });
      const captureData = paymentSource
        ? { payment_source: paymentSource }
        : {};
      const response = await this.client.post(
        `/v2/checkout/orders/${orderId}/capture`,
        captureData
      );
      this.logger.info("PayPal order captured successfully", { orderId });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to capture PayPal order", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to capture order",
      };
    }
  }

  // Dispute Management Methods
  async listDisputes(
    params: any = {}
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Listing PayPal disputes", params);
      const response = await this.client.get("/v1/customer/disputes", {
        params,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to list PayPal disputes", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to list disputes",
      };
    }
  }

  async getDispute(
    disputeId: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Fetching PayPal dispute", { disputeId });
      const response = await this.client.get(
        `/v1/customer/disputes/${disputeId}`
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to fetch PayPal dispute", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch dispute",
      };
    }
  }

  async acceptDisputeClaim(
    disputeId: string,
    acceptData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Accepting PayPal dispute claim", { disputeId });
      const response = await this.client.post(
        `/v1/customer/disputes/${disputeId}/accept-claim`,
        acceptData
      );
      this.logger.info("PayPal dispute claim accepted successfully", {
        disputeId,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to accept PayPal dispute claim", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to accept dispute claim",
      };
    }
  }

  // Shipment Tracking Methods
  async createShipmentTracking(
    transactionId: string,
    trackingData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Creating PayPal shipment tracking", { transactionId });
      const response = await this.client.post(`/v1/shipping/trackers-batch`, {
        trackers: [
          {
            transaction_id: transactionId,
            ...trackingData,
          },
        ],
      });
      this.logger.info("PayPal shipment tracking created successfully", {
        transactionId,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to create PayPal shipment tracking", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create shipment tracking",
      };
    }
  }

  async getShipmentTracking(
    transactionId: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Fetching PayPal shipment tracking", { transactionId });
      const response = await this.client.get(
        `/v1/shipping/trackers/${transactionId}`
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to fetch PayPal shipment tracking", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch shipment tracking",
      };
    }
  }

  // Catalog Management Methods
  async createProduct(
    productData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Creating PayPal product", { name: productData.name });
      const response = await this.client.post(
        "/v1/catalogs/products",
        productData
      );
      this.logger.info("PayPal product created successfully", {
        productId: response.data.id,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to create PayPal product", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create product",
      };
    }
  }

  async listProducts(
    params: any = {}
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Listing PayPal products", params);
      const response = await this.client.get("/v1/catalogs/products", {
        params,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to list PayPal products", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to list products",
      };
    }
  }

  async getProduct(
    productId: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Fetching PayPal product", { productId });
      const response = await this.client.get(
        `/v1/catalogs/products/${productId}`
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to fetch PayPal product", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch product",
      };
    }
  }

  async updateProduct(
    productId: string,
    operations: any[]
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Updating PayPal product", { productId });
      const response = await this.client.patch(
        `/v1/catalogs/products/${productId}`,
        operations
      );
      this.logger.info("PayPal product updated successfully", { productId });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to update PayPal product", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to update product",
      };
    }
  }

  // Subscription Management Methods
  async createSubscriptionPlan(
    planData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Creating PayPal subscription plan", {
        name: planData.name,
      });
      const response = await this.client.post("/v1/billing/plans", planData);
      this.logger.info("PayPal subscription plan created successfully", {
        planId: response.data.id,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to create PayPal subscription plan", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create subscription plan",
      };
    }
  }

  async listSubscriptionPlans(
    params: any = {}
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Listing PayPal subscription plans", params);
      const response = await this.client.get("/v1/billing/plans", { params });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to list PayPal subscription plans", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to list subscription plans",
      };
    }
  }

  async getSubscriptionPlan(
    planId: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Fetching PayPal subscription plan", { planId });
      const response = await this.client.get(`/v1/billing/plans/${planId}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to fetch PayPal subscription plan", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch subscription plan",
      };
    }
  }

  async createSubscription(
    subscriptionData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Creating PayPal subscription", {
        planId: subscriptionData.plan_id,
      });
      const response = await this.client.post(
        "/v1/billing/subscriptions",
        subscriptionData
      );
      this.logger.info("PayPal subscription created successfully", {
        subscriptionId: response.data.id,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to create PayPal subscription", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create subscription",
      };
    }
  }

  async getSubscription(
    subscriptionId: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Fetching PayPal subscription", { subscriptionId });
      const response = await this.client.get(
        `/v1/billing/subscriptions/${subscriptionId}`
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to fetch PayPal subscription", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch subscription",
      };
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    reason: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Cancelling PayPal subscription", { subscriptionId });
      const response = await this.client.post(
        `/v1/billing/subscriptions/${subscriptionId}/cancel`,
        { reason }
      );
      this.logger.info("PayPal subscription cancelled successfully", {
        subscriptionId,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to cancel PayPal subscription", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to cancel subscription",
      };
    }
  }

  // Reporting Methods
  async listTransactions(
    params: any = {}
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      this.logger.info("Listing PayPal transactions", params);
      const response = await this.client.get("/v1/reporting/transactions", {
        params,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      this.logger.error("Failed to list PayPal transactions", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to list transactions",
      };
    }
  }
}
