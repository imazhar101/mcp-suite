import { Logger } from '../utils/logger.js';
import { ServerResponse } from '../types/common.js';
export declare class ErrorHandler {
    private logger;
    constructor(logger: Logger);
    handleError(error: any, context?: string): ServerResponse;
    handleApiError(error: any, apiName: string): ServerResponse;
    handleValidationError(field: string, message: string): ServerResponse;
}
//# sourceMappingURL=error-handler.d.ts.map