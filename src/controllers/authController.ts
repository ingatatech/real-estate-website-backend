import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../lib/typeorm.js';
import { User } from '../entities/User.js';
import { Role } from '../entities/Role.js';
import { SiteSetting } from '../entities/SiteSetting.js';
import { isPasswordResetEmailConfigured, sendPasswordResetEmail } from '../lib/passwordResetEmail.js';
import { sendVerificationEmail } from '../lib/verificationEmail.js';
import { getPasswordPolicy, validatePasswordComplexity } from '../utils/passwordValidator.js';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || (JWT_SECRET ? `${JWT_SECRET}_refresh` : 'ingata_jwt_refresh_secret_key');
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000;
const PASSWORD_RESET_RESPONSE = 'If an account exists for that email, password reset instructions will be sent.';

const hashResetToken = (token: string) => createHash('sha256').update(token).digest('hex');
const hashVerificationToken = (token: string) => createHash('sha256').update(token).digest('hex');

const generateTokens = (user: { id: string; email: string; role: string }) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
  );
  return { token, refreshToken };
};

const loadLockoutSettings = async (): Promise<{ maxAttempts: number; lockWindowMinutes: number }> => {
  try {
    const settings = await AppDataSource.getRepository(SiteSetting).findOne({ where: { id: 'default' } });
    return {
      maxAttempts: settings?.maxAuthAttempts ?? 5,
      lockWindowMinutes: settings?.authRateLimitWindowMinutes ?? 15,
    };
  } catch {
    return { maxAttempts: 5, lockWindowMinutes: 15 };
  }
};

let userSchemaEnsured = false;
export const ensureUserSchema = async () => {
  if (userSchemaEnsured) return;
  try {
    await AppDataSource.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "is_email_verified" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "email_verification_token_hash" text,
      ADD COLUMN IF NOT EXISTS "email_verification_expires_at" timestamp,
      ADD COLUMN IF NOT EXISTS "failed_login_attempts" integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "locked_until" timestamp;
    `);
    userSchemaEnsured = true;
    console.log('User schema self-healed and verified');
  } catch (err) {
    console.warn('Auto-user-schema verification notice:', err);
  }
};

// ─── Admin Login ────────────────────────────────────────────────────────────
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('LOWER(user.email) = :email', { email: normalizedEmail })
      .getOne();

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact support.' });
    }

    const roleName = user.role?.name || (typeof user.role === 'string' ? user.role : '');
    // Require admin role
    if (roleName.toLowerCase() !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
    }

    // Check account lockout
    const now = new Date();
    if (user.lockedUntil && user.lockedUntil > now) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - now.getTime()) / 60000);
      return res.status(423).json({ success: false, message: `Account is temporarily locked. Try again in ${minutesLeft} minute(s).` });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(String(password), user.passwordHash);
    if (!passwordValid) {
      const { maxAttempts, lockWindowMinutes } = await loadLockoutSettings();
      user.failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;
      if (user.failedLoginAttempts >= maxAttempts) {
        user.lockedUntil = new Date(Date.now() + lockWindowMinutes * 60 * 1000);
        await userRepo.save(user);
        return res.status(423).json({ success: false, message: `Too many failed attempts. Account locked for ${lockWindowMinutes} minute(s).` });
      }
      await userRepo.save(user);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Reset lockout on success
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await userRepo.save(user);

    // Sign JWT & Refresh Token
    const { token, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      role: roleName,
    });

    return res.json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: roleName,
        },
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Public Login ────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('LOWER(user.email) = :email', { email: normalizedEmail })
      .getOne();

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated.' });
    }

    // Check account lockout
    const now = new Date();
    if (user.lockedUntil && user.lockedUntil > now) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - now.getTime()) / 60000);
      return res.status(423).json({ success: false, message: `Account is temporarily locked. Try again in ${minutesLeft} minute(s).` });
    }

    const passwordValid = await bcrypt.compare(String(password), user.passwordHash);
    if (!passwordValid) {
      const { maxAttempts, lockWindowMinutes } = await loadLockoutSettings();
      user.failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;
      if (user.failedLoginAttempts >= maxAttempts) {
        user.lockedUntil = new Date(Date.now() + lockWindowMinutes * 60 * 1000);
        await userRepo.save(user);
        return res.status(423).json({ success: false, message: `Too many failed attempts. Account locked for ${lockWindowMinutes} minute(s).` });
      }
      await userRepo.save(user);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Reset lockout on success
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;

    user.lastLoginAt = new Date();
    await userRepo.save(user);

    const roleName = user.role?.name || (typeof user.role === 'string' ? user.role : 'user');

    const { token, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      role: roleName,
    });

    return res.json({
      success: true,
      data: {
        token,
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email, role: roleName },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
    }

    if (!isPasswordResetEmailConfigured()) {
      return res.status(503).json({ success: false, message: 'Password reset is temporarily unavailable. Please contact an administrator.' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.createQueryBuilder('user')
      .where('LOWER(user.email) = :email', { email })
      .getOne();
    if (!user || !user.isActive) {
      return res.json({ success: true, message: PASSWORD_RESET_RESPONSE });
    }

    // Always replace an existing token and send a fresh link. Returning success
    // without sending anything leaves a user stranded if the earlier email was
    // delayed, filtered, or deleted.
    const token = randomBytes(32).toString('hex');
    user.passwordResetTokenHash = hashResetToken(token);
    user.passwordResetExpiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);
    await userRepo.save(user);

    try {
      await sendPasswordResetEmail(user.email, token);
    } catch (error) {
      user.passwordResetTokenHash = null;
      user.passwordResetExpiresAt = null;
      await userRepo.save(user);
      console.error('Password reset email delivery failed:', error);
      return res.status(503).json({ success: false, message: 'Password reset email could not be delivered. Please try again later or contact an administrator.' });
    }

    return res.json({ success: true, message: PASSWORD_RESET_RESPONSE });
  } catch (error) {
    console.error('Forgot password request failed:', error);
    return res.status(500).json({ success: false, message: 'Unable to process the password reset request.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const token = typeof req.body?.token === 'string' ? req.body.token : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({ success: false, message: 'This password reset link is invalid or expired.' });
    }
    const policy = await getPasswordPolicy();
    const passwordValidation = validatePasswordComplexity(password, policy);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ success: false, message: passwordValidation.errors.join(' ') });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { passwordResetTokenHash: hashResetToken(token) },
    });
    if (!user || !user.isActive || !user.passwordResetExpiresAt || user.passwordResetExpiresAt.getTime() <= Date.now()) {
      return res.status(400).json({ success: false, message: 'This password reset link is invalid or expired.' });
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    await userRepo.save(user);

    return res.json({ success: true, message: 'Password reset successfully. You can now sign in.' });
  } catch (error) {
    console.error('Password reset failed:', error);
    return res.status(500).json({ success: false, message: 'Unable to reset the password.' });
  }
};

// ─── Register ─────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const passwordPolicy = await getPasswordPolicy();
    const passwordValidation = validatePasswordComplexity(String(password), passwordPolicy);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ success: false, message: passwordValidation.errors.join(' ') });
    }

    const userRepo = AppDataSource.getRepository(User);
    const roleRepo = AppDataSource.getRepository(Role);

    const existing = await userRepo.findOne({ where: { email: String(email) } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Default to 'user' role (id: 2; seed accordingly)
    const userRole = await roleRepo.findOne({ where: { name: 'user' } });
    if (!userRole) {
      return res.status(500).json({ success: false, message: 'Default role not found. Contact admin.' });
    }

    const passwordHash = await bcrypt.hash(String(password), 12);
    const user = userRepo.create({
      name,
      email,
      phone,
      passwordHash,
      roleId: userRole.id,
    });
    const savedUser = await userRepo.save(user);

    // Send verification email (fire-and-forget — never block registration)
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenHash = hashVerificationToken(verificationToken);
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await userRepo.update(savedUser.id, {
      emailVerificationTokenHash: verificationTokenHash,
      emailVerificationExpiresAt: verificationExpiresAt,
    });
    sendVerificationEmail(savedUser.email, verificationToken).catch(() => {});

    const userWithRole = await userRepo.findOne({
      where: { id: savedUser.id },
      relations: { role: true },
    });

    const roleName = userWithRole?.role.name || 'user';
    const { token, refreshToken } = generateTokens({
      id: savedUser.id,
      email: savedUser.email,
      role: roleName,
    });

    return res.status(201).json({
      success: true,
      data: {
        token,
        refreshToken,
        user: { id: savedUser.id, name: savedUser.name, email: savedUser.email, role: roleName, emailVerified: false },
        message: 'Registration successful. Please check your email to verify your account.',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Refresh Token ────────────────────────────────────────────────────────────
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const rawToken = req.body?.refreshToken;
    if (!rawToken || typeof rawToken !== 'string') {
      return res.status(400).json({ success: false, message: 'Refresh token is required.' });
    }

    let payload: { id: string; email: string; role: string; type?: string };
    try {
      payload = jwt.verify(rawToken, JWT_REFRESH_SECRET) as { id: string; email: string; role: string; type?: string };
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
    }

    if (payload.type !== 'refresh' || !payload.id) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: payload.id },
      relations: { role: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or account is deactivated.' });
    }

    const roleName = user.role?.name || 'user';
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: roleName,
    });

    return res.json({
      success: true,
      message: 'Token refreshed successfully.',
      data: {
        token: tokens.token,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: roleName,
        },
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logout = (_req: Request, res: Response) => {
  // JWT is stateless — client discards token. We just confirm.
  res.json({ success: true, message: 'Logged out successfully.' });
};

// ─── Get Current User ─────────────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: { role: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        role: {
          name: user.role.name,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const { name, phone } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    const updatedUser = await userRepo.save(user);

    return res.json({
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Verify Email ─────────────────────────────────────────────────────────────
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification token is required.' });
    }

    const tokenHash = hashVerificationToken(token);
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { emailVerificationTokenHash: tokenHash } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification link.' });
    }

    if (user.isEmailVerified) {
      return res.json({ success: true, message: 'Email already verified.' });
    }

    if (user.emailVerificationExpiresAt && user.emailVerificationExpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'Verification link has expired. Please request a new one.' });
    }

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpiresAt = null;
    await userRepo.save(user);

    return res.json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Resend Verification Email ────────────────────────────────────────────────
export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.createQueryBuilder('user')
      .where('LOWER(user.email) = :email', { email })
      .getOne();

    // Always return success to avoid leaking user existence
    if (!user || !user.isActive || user.isEmailVerified) {
      return res.json({ success: true, message: 'If an account exists for that email and is not yet verified, a verification email will be sent.' });
    }

    const verificationToken = randomBytes(32).toString('hex');
    user.emailVerificationTokenHash = hashVerificationToken(verificationToken);
    user.emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await userRepo.save(user);

    sendVerificationEmail(user.email, verificationToken).catch(() => {});

    return res.json({ success: true, message: 'If an account exists for that email and is not yet verified, a verification email will be sent.' });
  } catch (error) {
    console.error('Resend verification email error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
