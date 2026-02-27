export function validateRequired(value, fieldName) {
    if (value === undefined || value === null || value === '') {
        throw new Error(`${fieldName} is required`);
    }
}
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export function validateUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
export function sanitizeString(input) {
    return input.trim().replace(/[<>]/g, '');
}
export function validateApiKey(apiKey, minLength = 10) {
    return typeof apiKey === 'string' && apiKey.length >= minLength;
}
//# sourceMappingURL=validation.js.map