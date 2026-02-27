export function getEnvVar(key, defaultValue) {
    const value = process.env[key];
    if (value === undefined) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value;
}
export function getOptionalEnvVar(key, defaultValue = '') {
    return process.env[key] || defaultValue;
}
export function getLogLevel() {
    const level = process.env.LOG_LEVEL?.toLowerCase();
    return ['debug', 'info', 'warn', 'error'].includes(level) ? level : 'info';
}
export function isProduction() {
    return process.env.NODE_ENV === 'production';
}
export function isDevelopment() {
    return process.env.NODE_ENV === 'development';
}
//# sourceMappingURL=config.js.map