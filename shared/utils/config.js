"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVar = getEnvVar;
exports.getOptionalEnvVar = getOptionalEnvVar;
exports.getLogLevel = getLogLevel;
exports.isProduction = isProduction;
exports.isDevelopment = isDevelopment;
function getEnvVar(key, defaultValue) {
    const value = process.env[key];
    if (value === undefined) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value;
}
function getOptionalEnvVar(key, defaultValue = '') {
    return process.env[key] || defaultValue;
}
function getLogLevel() {
    const level = process.env.LOG_LEVEL?.toLowerCase();
    return ['debug', 'info', 'warn', 'error'].includes(level) ? level : 'info';
}
function isProduction() {
    return process.env.NODE_ENV === 'production';
}
function isDevelopment() {
    return process.env.NODE_ENV === 'development';
}
//# sourceMappingURL=config.js.map