import { describe, it, expect } from 'vitest';
import { validateRequired, validateEmail, validateUrl, sanitizeString } from '../../shared/utils/validation.js';

describe('Validation Utils', () => {
  describe('validateRequired', () => {
    it('should not throw for valid values', () => {
      expect(() => validateRequired('test', 'field')).not.toThrow();
      expect(() => validateRequired(123, 'field')).not.toThrow();
      expect(() => validateRequired([], 'field')).not.toThrow();
    });

    it('should throw for invalid values', () => {
      expect(() => validateRequired(null, 'field')).toThrow('field is required');
      expect(() => validateRequired(undefined, 'field')).toThrow('field is required');
      expect(() => validateRequired('', 'field')).toThrow('field is required');
    });
  });

  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('validateUrl', () => {
    it('should return true for valid URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://localhost:3000')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('')).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeString('  normal text  ')).toBe('normal text');
    });
  });
});