export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  environment?: "sandbox" | "production";
}

export interface PayPalAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface PayPalPayment {
  id: string;
  intent: string;
  state: string;
  cart: string;
  payer: PayPalPayer;
  transactions: PayPalTransaction[];
  create_time: string;
  update_time: string;
  links: PayPalLink[];
}

export interface PayPalPayer {
  payment_method: string;
  status?: string;
  payer_info?: PayPalPayerInfo;
}

export interface PayPalPayerInfo {
  email?: string;
  first_name?: string;
  last_name?: string;
  payer_id?: string;
  phone?: string;
  country_code?: string;
}

export interface PayPalTransaction {
  amount: PayPalAmount;
  payee?: PayPalPayee;
  description?: string;
  invoice_number?: string;
  item_list?: PayPalItemList;
  related_resources?: PayPalRelatedResource[];
}

export interface PayPalAmount {
  total: string;
  currency: string;
  details?: PayPalAmountDetails;
}

export interface PayPalAmountDetails {
  subtotal?: string;
  tax?: string;
  shipping?: string;
  handling_fee?: string;
  shipping_discount?: string;
  discount?: string;
}

export interface PayPalPayee {
  merchant_id: string;
  email?: string;
}

export interface PayPalItemList {
  items: PayPalItem[];
  shipping_address?: PayPalShippingAddress;
}

export interface PayPalItem {
  name: string;
  sku?: string;
  price: string;
  currency: string;
  quantity: string;
  description?: string;
  tax?: string;
}

export interface PayPalShippingAddress {
  recipient_name: string;
  line1: string;
  line2?: string;
  city: string;
  country_code: string;
  postal_code: string;
  state: string;
  phone?: string;
}

export interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

export interface PayPalRelatedResource {
  sale?: PayPalSale;
  authorization?: PayPalAuthorization;
  capture?: PayPalCapture;
  refund?: PayPalRefund;
}

export interface PayPalSale {
  id: string;
  state: string;
  amount: PayPalAmount;
  payment_mode: string;
  protection_eligibility: string;
  transaction_fee: PayPalTransactionFee;
  parent_payment: string;
  create_time: string;
  update_time: string;
  links: PayPalLink[];
}

export interface PayPalAuthorization {
  id: string;
  state: string;
  amount: PayPalAmount;
  parent_payment: string;
  valid_until: string;
  create_time: string;
  update_time: string;
  links: PayPalLink[];
}

export interface PayPalCapture {
  id: string;
  state: string;
  amount: PayPalAmount;
  parent_payment: string;
  transaction_fee: PayPalTransactionFee;
  create_time: string;
  update_time: string;
  links: PayPalLink[];
}

export interface PayPalRefund {
  id: string;
  state: string;
  amount: PayPalAmount;
  parent_payment: string;
  sale_id?: string;
  capture_id?: string;
  create_time: string;
  update_time: string;
  links: PayPalLink[];
}

export interface PayPalTransactionFee {
  value: string;
  currency: string;
}

export interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  create_time: string;
  resource_type: string;
  resource: any;
  links: PayPalLink[];
  summary: string;
}

export interface PayPalCreatePaymentRequest {
  intent: "sale" | "authorize" | "order";
  payer: {
    payment_method: "paypal" | "credit_card";
    payer_info?: PayPalPayerInfo;
  };
  transactions: {
    amount: PayPalAmount;
    description?: string;
    invoice_number?: string;
    item_list?: PayPalItemList;
    payee?: PayPalPayee;
  }[];
  redirect_urls: {
    return_url: string;
    cancel_url: string;
  };
}

export interface PayPalExecutePaymentRequest {
  payer_id: string;
  transactions?: {
    amount: PayPalAmount;
  }[];
}

export interface PayPalRefundRequest {
  amount?: PayPalAmount;
  invoice_number?: string;
  description?: string;
}
