export class Logger {
    level;
    context;
    constructor(level = 'info', context = {}) {
        this.level = level;
        this.context = context;
    }
    shouldLog(level) {
        const levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        };
        return levels[level] >= levels[this.level];
    }
    formatMessage(level, message, data) {
        const timestamp = new Date().toISOString();
        const contextStr = this.context.server ? `[${this.context.server}]` : '';
        const dataStr = data ? ` ${JSON.stringify(data)}` : '';
        return `${timestamp} ${level.toUpperCase()} ${contextStr} ${message}${dataStr}`;
    }
    debug(message, data) {
        if (this.shouldLog('debug')) {
            console.debug(this.formatMessage('debug', message, data));
        }
    }
    info(message, data) {
        if (this.shouldLog('info')) {
            console.info(this.formatMessage('info', message, data));
        }
    }
    warn(message, data) {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message, data));
        }
    }
    error(message, error) {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', message, error));
        }
    }
    withContext(context) {
        return new Logger(this.level, { ...this.context, ...context });
    }
}
//# sourceMappingURL=logger.js.map