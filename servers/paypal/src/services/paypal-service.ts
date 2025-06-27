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
}
