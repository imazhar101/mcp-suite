import { ApiCredentials } from '../types/common.js';
import { validateRequired, validateApiKey } from '../utils/validation.js';

export class AuthMiddleware {
  private credentials: ApiCredentials;

  constructor(credentials: ApiCredentials) {
    this.credentials = credentials;
    this.validateCredentials();
  }

  private validateCredentials(): void {
    if (this.credentials.apiKey) {
      if (!validateApiKey(this.credentials.apiKey)) {
        throw new Error('Invalid API key format');
      }
    }

    if (this.credentials.username) {
      validateRequired(this.credentials.username, 'Username');
    }

    if (this.credentials.baseUrl) {
      validateRequired(this.credentials.baseUrl, 'Base URL');
    }
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (this.credentials.apiKey) {
      headers['Authorization'] = `Bearer ${this.credentials.apiKey}`;
    }

    if (this.credentials.token) {
      headers['Authorization'] = `Bearer ${this.credentials.token}`;
    }

    if (this.credentials.username && this.credentials.password) {
      const auth = Buffer.from(`${this.credentials.username}:${this.credentials.password}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    return headers;
  }

  isAuthenticated(): boolean {
    return !!(this.credentials.apiKey || this.credentials.token || 
              (this.credentials.username && this.credentials.password));
  }
}