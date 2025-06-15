import { Logger } from '../utils/logger.js';
import { ServerResponse } from '../types/common.js';

export class ErrorHandler {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  handleError(error: any, context?: string): ServerResponse {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const contextMsg = context ? `[${context}]` : '';
    
    this.logger.error(`${contextMsg} ${errorMessage}`, error);

    return {
      success: false,
      error: errorMessage,
      message: 'An error occurred while processing your request'
    };
  }

  handleApiError(error: any, apiName: string): ServerResponse {
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

  handleValidationError(field: string, message: string): ServerResponse {
    this.logger.warn(`Validation error for field '${field}': ${message}`);
    
    return {
      success: false,
      error: `Validation failed for ${field}: ${message}`,
      message: 'Please check your input and try again'
    };
  }
}