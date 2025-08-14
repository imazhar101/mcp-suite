export interface StripeConfig {
  secretKey: string;
  webhookSecret?: string;
  apiVersion?: string;
}

export interface PaymentIntentCreateRequest {
  amount: number;
  currency: string;
  description?: string;
  customer?: string;
  payment_method?: string;
  confirm?: boolean;
  automatic_payment_methods?: {
    enabled: boolean;
  };
  metadata?: Record<string, string>;
}

export interface CustomerCreateRequest {
  email?: string;
  name?: string;
  phone?: string;
  description?: string;
  metadata?: Record<string, string>;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

export interface RefundCreateRequest {
  payment_intent?: string;
  charge?: string;
  amount?: number;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
  metadata?: Record<string, string>;
}

export interface SubscriptionCreateRequest {
  customer: string;
  items: Array<{
    price: string;
    quantity?: number;
  }>;
  trial_period_days?: number;
  billing_cycle_anchor?: number;
  metadata?: Record<string, string>;
}

export interface PriceCreateRequest {
  currency: string;
  product: string;
  billing_scheme?: 'per_unit' | 'tiered';
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count?: number;
  };
  unit_amount?: number;
  tiers?: Array<{
    up_to: number | 'inf';
    unit_amount: number;
  }>;
  metadata?: Record<string, string>;
}

export interface ProductCreateRequest {
  name: string;
  description?: string;
  images?: string[];
  metadata?: Record<string, string>;
  type?: 'good' | 'service';
  active?: boolean;
}

export interface InvoiceCreateRequest {
  customer: string;
  description?: string;
  auto_advance?: boolean;
  collection_method?: 'charge_automatically' | 'send_invoice';
  due_date?: number;
  metadata?: Record<string, string>;
}

export interface WebhookEndpointCreateRequest {
  url: string;
  enabled_events: string[];
  description?: string;
  metadata?: Record<string, string>;
}

export interface StripeServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}