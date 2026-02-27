import { LogLevel, LogContext } from '../types/common.js';
export declare class Logger {
    private level;
    private context;
    constructor(level?: LogLevel, context?: Partial<LogContext>);
    private shouldLog;
    private formatMessage;
    debug(message: string, data?: any): void;
    info(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    error(message: string, error?: any): void;
    withContext(context: Partial<LogContext>): Logger;
}
//# sourceMappingURL=logger.d.ts.map