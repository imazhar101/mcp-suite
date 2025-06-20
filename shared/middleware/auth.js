"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const validation_js_1 = require("../utils/validation.js");
class AuthMiddleware {
    constructor(credentials) {
        this.credentials = credentials;
        this.validateCredentials();
    }
    validateCredentials() {
        if (this.credentials.apiKey) {
            if (!(0, validation_js_1.validateApiKey)(this.credentials.apiKey)) {
                throw new Error('Invalid API key format');
            }
        }
        if (this.credentials.username) {
            (0, validation_js_1.validateRequired)(this.credentials.username, 'Username');
        }
        if (this.credentials.baseUrl) {
            (0, validation_js_1.validateRequired)(this.credentials.baseUrl, 'Base URL');
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
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.js.map