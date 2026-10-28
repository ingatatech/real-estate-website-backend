import { validatePasswordComplexity } from '../utils/passwordValidator.js';

describe('Password Validator', () => {
  it('should accept a strong standard password with all character classes', () => {
    const result = validatePasswordComplexity('IngataSecure@2026');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.rules.hasUppercase).toBe(true);
    expect(result.rules.hasLowercase).toBe(true);
    expect(result.rules.hasNumber).toBe(true);
    expect(result.rules.hasSpecialChar).toBe(true);
    expect(result.rules.minLength).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(70);
  });

  it('should reject a password that is too short', () => {
    const result = validatePasswordComplexity('Aa1@', { minLength: 8 });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long.');
  });

  it('should reject a password missing an uppercase letter', () => {
    const result = validatePasswordComplexity('ingatasecure@2026', { requireUppercase: true });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter (A-Z).');
  });

  it('should reject a password missing a lowercase letter', () => {
    const result = validatePasswordComplexity('INGATASECURE@2026', { requireLowercase: true });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter (a-z).');
  });

  it('should reject a password missing a number', () => {
    const result = validatePasswordComplexity('IngataSecure@Pass', { requireNumbers: true });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number (0-9).');
  });

  it('should reject a password missing a special character', () => {
    const result = validatePasswordComplexity('IngataSecure2026', { requireSpecialChars: true });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character (e.g. !@#$%^&*).');
  });

  it('should allow disabling specific complexity rules if configured', () => {
    const result = validatePasswordComplexity('IngataSecure2026', {
      minLength: 8,
      requireSpecialChars: false,
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
