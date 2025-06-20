"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequired = validateRequired;
exports.validateEmail = validateEmail;
exports.validateUrl = validateUrl;
exports.sanitizeString = sanitizeString;
exports.validateApiKey = validateApiKey;
function validateRequired(value, fieldName) {
    if (value === undefined || value === null || value === '') {
        throw new Error(`${fieldName} is required`);
    }
}
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validateUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
function sanitizeString(input) {
    return input.trim().replace(/[<>]/g, '');
}
function validateApiKey(apiKey, minLength = 10) {
    return typeof apiKey === 'string' && apiKey.length >= minLength;
}
//# sourceMappingURL=validation.js.map