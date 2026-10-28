import { AppDataSource } from '../lib/typeorm.js';
import { SiteSetting } from '../entities/SiteSetting.js';

export interface PasswordComplexityConfig {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

export interface PasswordRulesBreakdown {
  minLength: boolean;
  maxLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  rules: PasswordRulesBreakdown;
  score: number; // 0 to 100
}

export const SPECIAL_CHARACTERS_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;

export const DEFAULT_PASSWORD_CONFIG: Required<PasswordComplexityConfig> = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

/**
 * Validates a password against standard complexity requirements.
 */
export const validatePasswordComplexity = (
  password: string,
  config: PasswordComplexityConfig = {}
): PasswordValidationResult => {
  const minLength =
    typeof config.minLength === 'number' && config.minLength > 0
      ? config.minLength
      : DEFAULT_PASSWORD_CONFIG.minLength;
  const maxLength =
    typeof config.maxLength === 'number' && config.maxLength > 0
      ? config.maxLength
      : DEFAULT_PASSWORD_CONFIG.maxLength;
  const requireUppercase = config.requireUppercase !== false;
  const requireLowercase = config.requireLowercase !== false;
  const requireNumbers = config.requireNumbers !== false;
  const requireSpecialChars = config.requireSpecialChars !== false;

  const pwd = typeof password === 'string' ? password : '';
  const errors: string[] = [];

  const rules: PasswordRulesBreakdown = {
    minLength: pwd.length >= minLength,
    maxLength: pwd.length <= maxLength,
    hasUppercase: /[A-Z]/.test(pwd),
    hasLowercase: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecialChar: SPECIAL_CHARACTERS_REGEX.test(pwd),
  };

  if (!rules.minLength) {
    errors.push(`Password must be at least ${minLength} characters long.`);
  }
  if (!rules.maxLength) {
    errors.push(`Password cannot exceed ${maxLength} characters.`);
  }
  if (requireUppercase && !rules.hasUppercase) {
    errors.push('Password must contain at least one uppercase letter (A-Z).');
  }
  if (requireLowercase && !rules.hasLowercase) {
    errors.push('Password must contain at least one lowercase letter (a-z).');
  }
  if (requireNumbers && !rules.hasNumber) {
    errors.push('Password must contain at least one number (0-9).');
  }
  if (requireSpecialChars && !rules.hasSpecialChar) {
    errors.push('Password must contain at least one special character (e.g. !@#$%^&*).');
  }

  // Calculate score (0 to 100)
  let score = 0;
  if (pwd.length >= minLength) score += 25;
  if (pwd.length >= minLength + 4) score += 15;
  if (rules.hasUppercase) score += 15;
  if (rules.hasLowercase) score += 15;
  if (rules.hasNumber) score += 15;
  if (rules.hasSpecialChar) score += 15;
  score = Math.min(100, score);

  return {
    isValid: errors.length === 0,
    errors,
    rules,
    score,
  };
};

/**
 * Fetches the active password policy from the site_settings table.
 * Falls back to default standard complexity requirements if unavailable.
 */
export const getPasswordPolicy = async (): Promise<Required<PasswordComplexityConfig>> => {
  try {
    const settingRepo = AppDataSource.getRepository(SiteSetting);
    const settings = await settingRepo.findOne({ where: {} });
    if (settings) {
      return {
        minLength: Number(settings.minPasswordLength) || DEFAULT_PASSWORD_CONFIG.minLength,
        maxLength: Number(settings.maxPasswordLength) || DEFAULT_PASSWORD_CONFIG.maxLength,
        requireUppercase: settings.requireUppercase ?? DEFAULT_PASSWORD_CONFIG.requireUppercase,
        requireLowercase: settings.requireLowercase ?? DEFAULT_PASSWORD_CONFIG.requireLowercase,
        requireNumbers: settings.requireNumbers ?? DEFAULT_PASSWORD_CONFIG.requireNumbers,
        requireSpecialChars: settings.requireSpecialChars ?? DEFAULT_PASSWORD_CONFIG.requireSpecialChars,
      };
    }
  } catch (error) {
    console.warn('Could not load site setting password policy, applying defaults:', error);
  }

  return { ...DEFAULT_PASSWORD_CONFIG };
};
