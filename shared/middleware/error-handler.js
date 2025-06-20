"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
class ErrorHandler {
    constructor(logger) {
        this.logger = logger;
    }
    handleError(error, context) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const contextMsg = context ? `[${context}]` : '';
        this.logger.error(`${contextMsg} ${errorMessage}`, error);
        return {
            success: false,
            error: errorMessage,
            message: 'An error occurred while processing your request'
        };
    }
    handleApiError(error, apiName) {
        if (error.response) {
            const status = error.response.status;
            const statusText = error.response.statusText;
            const message = error.response.data?.message || error.response.data?.error || statusText;
            this.logger.error(`${apiName} API error: ${status} ${statusText}`, {
                status,
                statusText,
                data: error.response.data
            });
            return {
                success: false,
                error: `${apiName} API error: ${message}`,
                message: `Failed to communicate with ${apiName}`
            };
        }
        return this.handleError(error, `${apiName} API`);
    }
    handleValidationError(field, message) {
        this.logger.warn(`Validation error for field '${field}': ${message}`);
        return {
            success: false,
            error: `Validation failed for ${field}: ${message}`,
            message: 'Please check your input and try again'
        };
    }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=error-handler.js.map