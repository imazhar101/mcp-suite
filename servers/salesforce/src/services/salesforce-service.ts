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

  async listSObjects(): Promise<{ success: boolean; data?: { sobjects: any[] }; error?: string }> {
    try {
      const response = await this.makeRequest("/sobjects");
      
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

      this.logger.info("Successfully authenticated with Salesforce OAuth");

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
}