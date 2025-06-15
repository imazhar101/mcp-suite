import { validateRequired, validateApiKey } from '../utils/validation.js';
export class AuthMiddleware {
    credentials;
    constructor(credentials) {
        this.credentials = credentials;
        this.validateCredentials();
    }
    validateCredentials() {
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
    getAuthHeaders() {
        const headers = {};
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
    isAuthenticated() {
        return !!(this.credentials.apiKey || this.credentials.token ||
            (this.credentials.username && this.credentials.password));
    }
}
//# sourceMappingURL=auth.js.map