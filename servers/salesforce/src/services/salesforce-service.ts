import { Logger } from "../../../../shared/utils/logger.js";
import {
  SalesforceConfig,
  SalesforceOAuthConfig,
  SalesforceAuthResponse,
  SalesforceRecord,
  SalesforceQueryResponse,
  SalesforceCreateResponse,
  SalesforceUpdateResponse,
  SalesforceDeleteResponse,
  SalesforceBulkDeleteResponse,
  SalesforceDescribeResponse,
  SalesforceError,
} from "../types/salesforce.js";

export class SalesforceService {
  private config: SalesforceConfig;
  private logger: Logger;
  private apiVersion: string;
  private isAuthenticated: boolean = false;

  constructor(config: SalesforceConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
    this.apiVersion = config.apiVersion || "v59.0";
    this.isAuthenticated = !!(config.instanceUrl && config.accessToken);
  }

  private getBaseUrl(): string {
    if (!this.config.instanceUrl) {
      throw new Error("Salesforce instance URL not configured. Please authenticate first using salesforce_oauth_login.");
    }
    return `${this.config.instanceUrl}/services/data/${this.apiVersion}`;
  }

  private async makeRequest(
    endpoint: string,
    method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
    body?: any
  ): Promise<any> {
    // Try to auto-authenticate if we have OAuth credentials but no access token
    if (!this.isAuthenticated && this.hasOAuthCredentials()) {
      this.logger.info("No access token found, attempting auto-authentication");
      const authResult = await this.autoAuthenticate();
      if (!authResult.success) {
        throw new Error(`Auto-authentication failed: ${authResult.error}`);
      }
    }

    if (!this.isAuthenticated) {
      throw new Error("Not authenticated. Please use salesforce_oauth_login to authenticate first.");
    }

    const url = `${this.getBaseUrl()}${endpoint}`;
    
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${this.config.accessToken}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && (method === "POST" || method === "PATCH")) {
      options.body = JSON.stringify(body);
    }

    try {
      this.logger.debug(`Making ${method} request to: ${url}`);
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        // Check if it's an authentication error (401 Unauthorized)
        if (response.status === 401 && this.hasOAuthCredentials()) {
          this.logger.warn("Access token expired, attempting re-authentication");
          const authResult = await this.autoAuthenticate();
          if (authResult.success) {
            // Retry the request with the new token
            options.headers = {
              ...options.headers,
              "Authorization": `Bearer ${this.config.accessToken}`,
            };
            const retryResponse = await fetch(url, options);
            if (retryResponse.ok) {
              if (retryResponse.status === 204) {
                return { success: true };
              }
              return await retryResponse.json();
            }
          }
        }

        const errorBody = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorBody);
          if (Array.isArray(errorJson) && errorJson.length > 0) {
            errorMessage = errorJson[0].message || errorMessage;
          }
        } catch (e) {
          // If parsing fails, use the original error message
        }
        
        throw new Error(errorMessage);
      }

      // Handle empty responses (like DELETE operations)
      if (response.status === 204) {
        return { success: true };
      }

      return await response.json();
    } catch (error) {
      this.logger.error(`Salesforce API request failed: ${error}`);
      throw error;
    }
  }

  async query(soql: string): Promise<{ success: boolean; data?: SalesforceQueryResponse; error?: string }> {
    try {
      const encodedQuery = encodeURIComponent(soql);
      const response = await this.makeRequest(`/query?q=${encodedQuery}`);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async create(
    sobjectType: string,
    record: Omit<SalesforceRecord, "Id">
  ): Promise<{ success: boolean; data?: SalesforceCreateResponse; error?: string }> {
    try {
      const response = await this.makeRequest(`/sobjects/${sobjectType}`, "POST", record);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async read(
    sobjectType: string,
    id: string,
    fields?: string[]
  ): Promise<{ success: boolean; data?: SalesforceRecord; error?: string }> {
    try {
      let endpoint = `/sobjects/${sobjectType}/${id}`;
      
      if (fields && fields.length > 0) {
        const fieldsParam = fields.join(",");
        endpoint += `?fields=${fieldsParam}`;
      }
      
      const response = await this.makeRequest(endpoint);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async update(
    sobjectType: string,
    id: string,
    record: Omit<SalesforceRecord, "Id">
  ): Promise<{ success: boolean; data?: SalesforceUpdateResponse; error?: string }> {
    try {
      await this.makeRequest(`/sobjects/${sobjectType}/${id}`, "PATCH", record);
      
      return {
        success: true,
        data: { success: true, errors: [] },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async delete(
    sobjectType: string,
    id: string
  ): Promise<{ success: boolean; data?: SalesforceDeleteResponse; error?: string }> {
    try {
      await this.makeRequest(`/sobjects/${sobjectType}/${id}`, "DELETE");
      
      return {
        success: true,
        data: { success: true, errors: [] },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
  
  async bulkDelete(
    sobjectType: string,
    ids: string[],
    allOrNone: boolean = false
  ): Promise<{ success: boolean; data?: SalesforceBulkDeleteResponse; error?: string }> {
    try {
      if (!ids || ids.length === 0) {
        return {
          success: false,
          error: "No IDs provided for bulk deletion",
        };
      }
      
      if (ids.length > 200) {
        return {
          success: false,
          error: "Maximum of 200 records can be deleted in a single bulk delete operation",
        };
      }
      
      // For objects of the same type, we can use the Composite API's sObject Collections
      const endpoint = `/composite/sobjects?ids=${ids.join(",")}&allOrNone=${allOrNone}`;
      const response = await this.makeRequest(endpoint, "DELETE");
      
      // Check if any records failed to delete when allOrNone is false
      const hasErrors = response.results && response.results.some((result: any) => !result.success);
      
      return {
        success: !hasErrors,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async describe(
    sobjectType: string
  ): Promise<{ success: boolean; data?: SalesforceDescribeResponse; error?: string }> {
    try {
      const response = await this.makeRequest(`/sobjects/${sobjectType}/describe`);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async listSObjects(): Promise<{ success: boolean; data?: { sobjects: string[] }; error?: string }> {
    try {
      const response = await this.makeRequest("/sobjects");
      
      // Extract only the names from the sobjects array to reduce payload size
      const objectNames = response.sobjects?.map((sobject: any) => sobject.name) || [];
      
      return {
        success: true,
        data: { sobjects: objectNames },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async authenticateWithOAuth(oauthConfig: SalesforceOAuthConfig): Promise<{ success: boolean; data?: SalesforceAuthResponse; error?: string }> {
    try {
      const loginUrl = oauthConfig.loginUrl || "https://login.salesforce.com";
      const tokenUrl = `${loginUrl}/services/oauth2/token`;

      const body = new URLSearchParams({
        grant_type: oauthConfig.grantType,
        client_id: oauthConfig.clientId,
        client_secret: oauthConfig.clientSecret,
        username: oauthConfig.username,
        password: oauthConfig.password,
      });

      this.logger.debug(`Authenticating with Salesforce OAuth at: ${tokenUrl}`);

      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `OAuth authentication failed: HTTP ${response.status}`;
        
        try {
          const errorJson = JSON.parse(errorBody);
          errorMessage = errorJson.error_description || errorJson.error || errorMessage;
        } catch (e) {
          // If parsing fails, use the original error message
        }
        
        throw new Error(errorMessage);
      }

      const authResponse = await response.json() as SalesforceAuthResponse;

      // Update the service configuration with the new tokens
      this.config.accessToken = authResponse.access_token;
      this.config.instanceUrl = authResponse.instance_url;
      this.isAuthenticated = true;

      // Store tokens in environment variables for persistence
      process.env.SALESFORCE_ACCESS_TOKEN = authResponse.access_token;
      process.env.SALESFORCE_INSTANCE_URL = authResponse.instance_url;

      this.logger.info("Successfully authenticated with Salesforce OAuth and stored tokens");

      return {
        success: true,
        data: authResponse,
      };
    } catch (error) {
      this.logger.error("OAuth authentication failed", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  isAuthenticatedWithSalesforce(): boolean {
    return this.isAuthenticated;
  }

  getAuthenticationStatus(): { authenticated: boolean; instanceUrl?: string; hasAccessToken: boolean } {
    return {
      authenticated: this.isAuthenticated,
      instanceUrl: this.config.instanceUrl,
      hasAccessToken: !!this.config.accessToken,
    };
  }

  private hasOAuthCredentials(): boolean {
    return !!(
      process.env.SALESFORCE_CLIENT_ID &&
      process.env.SALESFORCE_CLIENT_SECRET &&
      process.env.SALESFORCE_USERNAME &&
      process.env.SALESFORCE_PASSWORD
    );
  }

  private async autoAuthenticate(): Promise<{ success: boolean; data?: SalesforceAuthResponse; error?: string }> {
    if (!this.hasOAuthCredentials()) {
      return {
        success: false,
        error: "OAuth credentials not available in environment variables",
      };
    }

    const oauthConfig: SalesforceOAuthConfig = {
      clientId: process.env.SALESFORCE_CLIENT_ID!,
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET!,
      username: process.env.SALESFORCE_USERNAME!,
      password: process.env.SALESFORCE_PASSWORD!,
      grantType: process.env.SALESFORCE_GRANT_TYPE || "password",
      loginUrl: process.env.SALESFORCE_LOGIN_URL || "https://login.salesforce.com",
    };

    return await this.authenticateWithOAuth(oauthConfig);
  }
}