/**
 * Payment SDK for InventPay API
 * Provides easy integration for payment processing, withdrawals, store management, and merchant operations
 * Uses X-API-Key authentication for all requests
 */

export interface SDKConfig {
  apiKey: string;
  withdrawalApiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

export interface PaymentRequest {
  amount: number;
  amountCurrency?: "USD" | "USDT" | "BTC" | "LTC" | "ETH";
  currency?: "BTC" | "LTC" | "ETH" | "USDT_ERC20" | "USDT_BEP20" | "MULTI";
  orderId?: string;
  description?: string;
  callbackUrl?: string;
  expirationMinutes?: number;
}

export interface InvoiceRequest {
  amount: number;
  amountCurrency?: "USD" | "USDT" | "BTC" | "LTC" | "ETH";
  orderId?: string;
  description?: string;
  callbackUrl?: string;
  expirationMinutes?: number;
}

export interface BalancesResponse {
  success: boolean;
  data: {
    merchantId: string;
    businessName: string;
    balances: {
      [currency: string]: {
        totalEarned: number;
        totalWithdrawn: number;
        availableBalance: number;
        lockedBalance: number;
        pendingBalance: number;
      };
    };
    timestamp: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  data: {
    paymentId: string;
    amount?: number;
    baseAmount?: number;
    currency?: string;
    baseCurrency?: string;
    address?: string;
    network?: string;
    conversionRates?: Record<string, any>;
    priceExpiry?: string;
    allowCurrencySelection?: boolean;
    selectedCurrency?: string | null;
    orderId?: string;
    description?: string;
    expiresAt: string;
    expiresAtTimestamp: number;
    createdAt: string;
    qrCode?: string;
    invoiceUrl: string;
    currentPrice?: number;
    priceTimestamp?: string;
    isStablecoin?: boolean;
  };
}

export interface WithdrawalRequest {
  amount: number;
  currency: "BTC" | "LTC" | "ETH" | "USDT_ERC20" | "USDT_BEP20";
  destinationAddress: string;
  description?: string;
}

export interface WithdrawalResponse {
  success: boolean;
  data: {
    withdrawalId: string;
    amount: string;
    currency: string;
    destinationAddress: string;
    status: string;
    feeAmount: string;
    netAmount: string;
    transactionHash: string | null;
    requiresApproval: boolean;
    createdAt: string;
    processedAt: string | null;
    errorMessage: string | null;
    balanceAfterLock: {
      available: string;
      locked: string;
    };
    feeBreakdown: {
      networkFee: number;
      serviceFee: number;
    };
    estimatedCompletion: string;
  };
}

export interface BalanceResponse {
  success: boolean;
  data: {
    currency: string;
    balance: {
      totalEarned: number;
      totalWithdrawn: number;
      totalFees: number;
      availableBalance: number;
      lockedBalance: number;
      pendingBalance: number;
      lastUpdated: string;
    };
    limits: {
      daily: { limit: number; used: number };
      weekly: { limit: number; used: number };
      monthly: { limit: number; used: number };
    };
    merchantInfo: {
      businessName: string;
      rateLimitTier: string;
    };
  };
}

export interface PaymentStatusResponse {
  status: "PENDING" | "COMPLETED" | "EXPIRED" | "FAILED";
  currentBalance: string;
  confirmations: number;
}

// ==================== STORE INTERFACES ====================

export interface CreateStoreRequest {
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  settings?: {
    acceptedCurrencies?: string[];
    minOrderAmount?: number;
    maxOrderAmount?: number;
  };
}

export interface UpdateStoreRequest {
  name?: string;
  description?: string;
  logo?: string;
  banner?: string;
  isPublished?: boolean;
  settings?: Record<string, any>;
}

export interface StoreResponse {
  success: boolean;
  data: {
    id: string;
    merchantId: string;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    banner: string | null;
    isPublished: boolean;
    settings: Record<string, any>;
    productCount?: number;
    orderCount?: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface DigitalContent {
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  licenseKey?: string;
  instructions?: string;
  textContent?: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  currency: string;
  images?: string[];
  stock?: number;
  digitalContent?: DigitalContent;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  stock?: number;
  isActive?: boolean;
  digitalContent?: DigitalContent;
}

export interface ProductResponse {
  success: boolean;
  data: {
    id: string;
    storeId: string;
    name: string;
    slug: string;
    description: string | null;
    price: string;
    currency: string;
    images: string[];
    stock: number | null;
    isActive: boolean;
    digitalContent: DigitalContent | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ProductListResponse {
  success: boolean;
  data: {
    products: ProductResponse["data"][];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface OrderResponse {
  success: boolean;
  data: {
    id: string;
    orderNumber: string;
    storeId: string;
    status: string;
    totalAmount: string;
    currency: string;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      price: string;
    }>;
    payment: Record<string, any> | null;
    customer: Record<string, any> | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface OrderListResponse {
  success: boolean;
  data: {
    orders: OrderResponse["data"][];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// ==================== WEBHOOK INTERFACES ====================

export interface WebhookConfig {
  webhookUrl: string;
}

export interface WebhookConfigResponse {
  success: boolean;
  data: {
    webhook: {
      url: string;
      secret: string;
      isConfigured: boolean;
      lastUpdated: string | null;
    };
    statistics: {
      total: number;
      successful: number;
      failed: number;
      successRate: string;
    };
    recentDeliveries: WebhookDelivery[];
    supportedEvents: string[];
  };
}

export interface WebhookDelivery {
  id: string;
  paymentId: string;
  url: string;
  payload?: any;
  httpStatus?: number;
  response?: string;
  attempts: number;
  success: boolean;
  lastAttemptAt: string;
  nextAttemptAt?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface WebhookDeliveriesResponse {
  success: boolean;
  data: {
    deliveries: WebhookDelivery[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters: {
      success: boolean | "all";
      paymentId: string | "all";
    };
  };
}

export interface WebhookStatsResponse {
  success: boolean;
  data: {
    period: string;
    summary: {
      total: number;
      successful: number;
      failed: number;
      successRate: string;
      avgAttempts: string;
    };
    webhookUrl: string | null;
    isConfigured: boolean;
  };
}

export interface TestWebhookResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    statusCode: number;
    responseTime: number;
    response: string;
    signature: string;
    testedAt: string;
  };
}

export interface WebhookEvent {
  event: string;
  timestamp: string;
  data: {
    paymentId: string;
    merchantId: string;
    amount: number;
    currency: string;
    status: string;
    txHash?: string;
    confirmations?: number;
    [key: string]: any;
  };
}

export class PaymentSDKError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = "PaymentSDKError";
  }
}

export class PaymentSDK {
  private apiKey: string;
  private withdrawalApiKey: string | undefined;
  private baseUrl: string;
  private timeout: number;

  constructor(config: SDKConfig) {
    if (!config.apiKey) {
      throw new Error("API key is required");
    }

    this.apiKey = config.apiKey;
    this.withdrawalApiKey = config.withdrawalApiKey;
    this.baseUrl = config.baseUrl || "https://api.inventpay.io";
    this.timeout = config.timeout || 30000;
  }

  /**
   * Make HTTP request to API using X-API-Key authentication
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    requiresAuth: boolean = true,
    extraHeaders?: Record<string, string>
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (requiresAuth) {
      headers["X-API-Key"] = this.apiKey;
    }

    if (extraHeaders) {
      Object.assign(headers, extraHeaders);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new PaymentSDKError(
          "Invalid JSON response",
          response.status,
          responseText
        );
      }

      if (!response.ok) {
        throw new PaymentSDKError(
          responseData.error || "Request failed",
          response.status,
          responseData.details || responseData.message
        );
      }

      return responseData;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error instanceof PaymentSDKError) {
        throw error;
      }

      if (error.name === "AbortError") {
        throw new PaymentSDKError("Request timeout", 408);
      }

      throw new PaymentSDKError(
        error.message || "Network error",
        undefined,
        error
      );
    }
  }

  // ==================== PAYMENT METHODS ====================

  async createInvoice(invoiceData: InvoiceRequest): Promise<PaymentResponse> {
    return await this.request<PaymentResponse>(
      "POST",
      "/v1/create_invoice",
      invoiceData
    );
  }

  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    return await this.request<PaymentResponse>(
      "POST",
      "/v1/create_payment",
      paymentData
    );
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    return await this.request<PaymentStatusResponse>(
      "GET",
      `/v1/invoice/${paymentId}/status`,
      undefined,
      false
    );
  }

  // ==================== BALANCE METHODS ====================

  async getBalances(): Promise<BalancesResponse> {
    return await this.request<BalancesResponse>("GET", "/v1/merchant/balance");
  }

  async getBalance(currency: string): Promise<BalanceResponse> {
    return await this.request<BalanceResponse>(
      "GET",
      `/v1/merchant/balance/${currency}`
    );
  }

  // ==================== WITHDRAWAL METHODS ====================

  /**
   * Create a withdrawal request.
   * Requires a withdrawal API key — pass it via SDKConfig.withdrawalApiKey
   * or generate one from Dashboard → Settings → Withdrawal API Key.
   */
  async createWithdrawal(
    withdrawalData: WithdrawalRequest
  ): Promise<WithdrawalResponse> {
    if (!this.withdrawalApiKey) {
      throw new PaymentSDKError(
        "Withdrawal API key is required. Pass withdrawalApiKey in SDKConfig or generate one from Dashboard → Settings → Withdrawal API Key.",
        403
      );
    }
    return await this.request<WithdrawalResponse>(
      "POST",
      "/v1/merchant/withdrawal/create",
      withdrawalData,
      true,
      { "X-Withdrawal-Key": this.withdrawalApiKey }
    );
  }

  async getWithdrawal(withdrawalId: string): Promise<WithdrawalResponse> {
    return await this.request<WithdrawalResponse>(
      "GET",
      `/v1/withdrawal/${withdrawalId}`
    );
  }

  // ==================== STORE METHODS ====================

  /**
   * Create a new store
   */
  async createStore(storeData: CreateStoreRequest): Promise<StoreResponse> {
    return await this.request<StoreResponse>(
      "POST",
      "/v1/store/manage",
      storeData
    );
  }

  /**
   * Get your store details
   */
  async getStore(): Promise<StoreResponse> {
    return await this.request<StoreResponse>("GET", "/v1/store/manage");
  }

  /**
   * Update store settings
   */
  async updateStore(storeData: UpdateStoreRequest): Promise<StoreResponse> {
    return await this.request<StoreResponse>(
      "PUT",
      "/v1/store/manage",
      storeData
    );
  }

  /**
   * Create a product in your store
   */
  async createProduct(
    productData: CreateProductRequest
  ): Promise<ProductResponse> {
    return await this.request<ProductResponse>(
      "POST",
      "/v1/store/manage/products",
      productData
    );
  }

  /**
   * List products in your store
   */
  async listProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return await this.request<ProductListResponse>(
      "GET",
      `/v1/store/manage/products${query ? `?${query}` : ""}`
    );
  }

  /**
   * Update a product
   */
  async updateProduct(
    productId: string,
    productData: UpdateProductRequest
  ): Promise<ProductResponse> {
    return await this.request<ProductResponse>(
      "PUT",
      `/v1/store/manage/products/${productId}`,
      productData
    );
  }

  /**
   * Delete (deactivate) a product
   */
  async deleteProduct(
    productId: string
  ): Promise<{ success: boolean; message: string }> {
    return await this.request<{ success: boolean; message: string }>(
      "DELETE",
      `/v1/store/manage/products/${productId}`
    );
  }

  /**
   * List orders for your store
   */
  async listOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<OrderListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return await this.request<OrderListResponse>(
      "GET",
      `/v1/store/manage/orders${query ? `?${query}` : ""}`
    );
  }

  /**
   * Get a specific order
   */
  async getOrder(orderId: string): Promise<OrderResponse> {
    return await this.request<OrderResponse>(
      "GET",
      `/v1/store/manage/orders/${orderId}`
    );
  }

  /**
   * Update order fulfillment status
   */
  async updateOrderStatus(
    orderId: string,
    status: string
  ): Promise<OrderResponse> {
    return await this.request<OrderResponse>(
      "PUT",
      `/v1/store/manage/orders/${orderId}/status`,
      { status }
    );
  }

  // ==================== WEBHOOK METHODS ====================

  /**
   * Configure webhook URL for receiving payment notifications
   */
  async configureWebhook(
    config: WebhookConfig
  ): Promise<{ success: boolean; message: string; data: any }> {
    return await this.request<{ success: boolean; message: string; data: any }>(
      "PUT",
      "/v1/merchant/webhook-url",
      config
    );
  }

  /**
   * Get current webhook configuration and statistics
   */
  async getWebhookConfig(): Promise<WebhookConfigResponse> {
    return await this.request<WebhookConfigResponse>(
      "GET",
      "/v1/merchant/webhook-config"
    );
  }

  /**
   * Test webhook configuration by sending a test event
   */
  async testWebhook(webhookUrl?: string): Promise<TestWebhookResponse> {
    const data = webhookUrl ? { webhookUrl } : undefined;
    return await this.request<TestWebhookResponse>(
      "POST",
      "/v1/merchant/test-webhook",
      data
    );
  }

  /**
   * Get webhook delivery history with pagination
   */
  async getWebhookDeliveries(params?: {
    page?: number;
    limit?: number;
    success?: boolean;
    paymentId?: string;
  }): Promise<WebhookDeliveriesResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/v1/merchant/webhook-deliveries${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;

    return await this.request<WebhookDeliveriesResponse>("GET", endpoint);
  }

  /**
   * Get specific webhook delivery details
   */
  async getWebhookDelivery(
    deliveryId: string
  ): Promise<{ success: boolean; data: WebhookDelivery }> {
    return await this.request<{ success: boolean; data: WebhookDelivery }>(
      "GET",
      `/v1/merchant/webhook-delivery/${deliveryId}`
    );
  }

  /**
   * Retry a failed webhook delivery
   */
  async retryWebhookDelivery(
    deliveryId: string
  ): Promise<{ success: boolean; message: string; data: any }> {
    return await this.request<{ success: boolean; message: string; data: any }>(
      "POST",
      `/v1/merchant/webhook-delivery/${deliveryId}/retry`
    );
  }

  /**
   * Remove webhook configuration
   */
  async deleteWebhook(): Promise<{
    success: boolean;
    message: string;
    data: any;
  }> {
    return await this.request<{ success: boolean; message: string; data: any }>(
      "DELETE",
      "/v1/merchant/webhook-url"
    );
  }

  /**
   * Get webhook statistics for a given period
   */
  async getWebhookStats(days: number = 7): Promise<WebhookStatsResponse> {
    return await this.request<WebhookStatsResponse>(
      "GET",
      `/v1/merchant/webhook-stats?days=${days}`
    );
  }

  // ==================== UTILITY METHODS ====================

  generatePaymentLink(paymentId: string): string {
    return `${this.baseUrl.replace("api.", "www.")}/invoice/${paymentId}`;
  }

  /**
   * Verify webhook signature to ensure authenticity
   */
  static verifyWebhookSignature(
    payload: string | object,
    signature: string,
    secret: string
  ): boolean {
    if (typeof require !== "undefined") {
      try {
        const crypto = require("crypto");
        const payloadString =
          typeof payload === "string" ? payload : JSON.stringify(payload);
        const computedSignature = crypto
          .createHmac("sha256", secret)
          .update(payloadString)
          .digest("hex");
        return computedSignature === signature;
      } catch (e) {
        console.warn("Crypto module not available");
        return false;
      }
    }
    console.warn("Webhook verification should be done server-side");
    return false;
  }

  /**
   * Parse and validate webhook event
   */
  static parseWebhookEvent(
    payload: string | object,
    signature: string,
    secret: string
  ): WebhookEvent | null {
    // First verify the signature
    if (!this.verifyWebhookSignature(payload, signature, secret)) {
      return null;
    }

    try {
      const payloadObj =
        typeof payload === "string" ? JSON.parse(payload) : payload;

      // Validate required fields
      if (!payloadObj.event || !payloadObj.timestamp || !payloadObj.data) {
        return null;
      }

      return payloadObj as WebhookEvent;
    } catch (error) {
      console.error("Failed to parse webhook event:", error);
      return null;
    }
  }

  /**
   * Get supported webhook events
   */
  static getSupportedWebhookEvents(): string[] {
    return [
      "payment.completed",
      "payment.pending",
      "payment.failed",
      "payment.expired",
      "payment.underpaid",
      "payment.test",
      "withdrawal.completed",
      "withdrawal.failed",
      "withdrawal.processing",
    ];
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await this.getBalances();
      return {
        success: true,
        message: "API connection successful",
      };
    } catch (error) {
      if (error instanceof PaymentSDKError) {
        if (error.statusCode === 401) {
          return {
            success: false,
            message: "Invalid API key",
          };
        }
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: false,
        message: "Connection failed",
      };
    }
  }

  static getVersion(): string {
    return "1.1.1";
  }

  getApiKeyPreview(): string {
    return `${this.apiKey.substring(0, 8)}...${this.apiKey.substring(this.apiKey.length - 4)}`;
  }
}

export default PaymentSDK;
