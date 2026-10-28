import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { AppDataSource } from '../lib/typeorm.js';
import { SiteSetting } from '../entities/SiteSetting.js';

let schemaEnsured = false;

export const ensureSiteSettingsSchema = async () => {
  if (schemaEnsured) return;
  try {
    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS "site_settings" (
        "id" text PRIMARY KEY,
        "site_name" text,
        "logo_url" text,
        "favicon_url" text,
        "email" text,
        "phone" text,
        "address" text,
        "facebook_url" text,
        "instagram_url" text,
        "x_url" text,
        "linkedin_url" text,
        "default_currency" text,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "about_cta_link" text,
        "about_cta_text" text,
        "about_description" text,
        "about_image_url" text,
        "about_title" text,
        "featured_section_title" text,
        "hero_cta_link" text,
        "hero_cta_text" text,
        "hero_image_url" text,
        "hero_subtitle" text,
        "hero_title" text,
        "services_description" text,
        "services_title" text,
        "show_about_section" boolean DEFAULT false NOT NULL,
        "show_featured_section" boolean DEFAULT false NOT NULL,
        "show_services_section" boolean DEFAULT false NOT NULL,
        "whatsapp" text,
        "analytics_retention_days" integer DEFAULT 365,
        "session_timeout_minutes" integer DEFAULT 5,
        "session_warning_minutes" integer DEFAULT 3,
        "min_password_length" integer DEFAULT 8,
        "max_password_length" integer DEFAULT 128,
        "max_auth_attempts" integer DEFAULT 5,
        "auth_rate_limit_window_minutes" integer DEFAULT 15,
        "contact_rate_limit_per_hour" integer DEFAULT 3,
        "search_rate_limit_per_minute" integer DEFAULT 30,
        "global_rate_limit" integer DEFAULT 100,
        "csrf_protection_enabled" boolean DEFAULT true,
        "cross_tab_sync_enabled" boolean DEFAULT true
      );

      ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "site_name" text,
      ADD COLUMN IF NOT EXISTS "logo_url" text,
      ADD COLUMN IF NOT EXISTS "favicon_url" text,
      ADD COLUMN IF NOT EXISTS "email" text,
      ADD COLUMN IF NOT EXISTS "phone" text,
      ADD COLUMN IF NOT EXISTS "address" text,
      ADD COLUMN IF NOT EXISTS "facebook_url" text,
      ADD COLUMN IF NOT EXISTS "instagram_url" text,
      ADD COLUMN IF NOT EXISTS "x_url" text,
      ADD COLUMN IF NOT EXISTS "linkedin_url" text,
      ADD COLUMN IF NOT EXISTS "default_currency" text,
      ADD COLUMN IF NOT EXISTS "about_cta_link" text,
      ADD COLUMN IF NOT EXISTS "about_cta_text" text,
      ADD COLUMN IF NOT EXISTS "about_description" text,
      ADD COLUMN IF NOT EXISTS "about_image_url" text,
      ADD COLUMN IF NOT EXISTS "about_title" text,
      ADD COLUMN IF NOT EXISTS "featured_section_title" text,
      ADD COLUMN IF NOT EXISTS "hero_cta_link" text,
      ADD COLUMN IF NOT EXISTS "hero_cta_text" text,
      ADD COLUMN IF NOT EXISTS "hero_image_url" text,
      ADD COLUMN IF NOT EXISTS "hero_subtitle" text,
      ADD COLUMN IF NOT EXISTS "hero_title" text,
      ADD COLUMN IF NOT EXISTS "services_description" text,
      ADD COLUMN IF NOT EXISTS "services_title" text,
      ADD COLUMN IF NOT EXISTS "show_about_section" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "show_featured_section" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "show_services_section" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "whatsapp" text,
      ADD COLUMN IF NOT EXISTS "analytics_retention_days" integer DEFAULT 365,
      ADD COLUMN IF NOT EXISTS "session_timeout_minutes" integer DEFAULT 5,
      ADD COLUMN IF NOT EXISTS "session_warning_minutes" integer DEFAULT 3,
      ADD COLUMN IF NOT EXISTS "min_password_length" integer DEFAULT 8,
      ADD COLUMN IF NOT EXISTS "max_password_length" integer DEFAULT 128,
      ADD COLUMN IF NOT EXISTS "max_auth_attempts" integer DEFAULT 5,
      ADD COLUMN IF NOT EXISTS "auth_rate_limit_window_minutes" integer DEFAULT 15,
      ADD COLUMN IF NOT EXISTS "contact_rate_limit_per_hour" integer DEFAULT 3,
      ADD COLUMN IF NOT EXISTS "search_rate_limit_per_minute" integer DEFAULT 30,
      ADD COLUMN IF NOT EXISTS "global_rate_limit" integer DEFAULT 100,
      ADD COLUMN IF NOT EXISTS "csrf_protection_enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "cross_tab_sync_enabled" boolean DEFAULT true;
    `);
    schemaEnsured = true;
  } catch (error) {
    console.warn('Could not auto-migrate site_settings columns:', error);
  }
};

export const getSettings = async (_req: Request, res: Response, next: (error: unknown) => void) => {
  try {
    await ensureSiteSettingsSchema();

    const settingRepo = AppDataSource.getRepository(SiteSetting);
    let settings = await settingRepo.findOne({ where: {} });

    if (!settings) {
      settings = settingRepo.create({
        id: randomUUID(),
        siteName: 'Ingata Real Estate',
        email: 'justinnizeyumuremyi20@gmail.com',
        phone: '+250 796 593 119',
        whatsapp: '0781830071',
        address: 'KG 11 Ave, Zindiro, AZAM Rond Point, Gasabo-Kigali',
        facebookUrl: 'https://facebook.com',
        xUrl: 'https://twitter.com',
        instagramUrl: 'https://instagram.com',
        linkedinUrl: 'https://linkedin.com',
        defaultCurrency: 'RWF',
        analyticsRetentionDays: 365,
        sessionTimeoutMinutes: 5,
        sessionWarningMinutes: 3,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        maxAuthAttempts: 5,
        authRateLimitWindowMinutes: 15,
        contactRateLimitPerHour: 3,
        searchRateLimitPerMinute: 30,
        globalRateLimit: 100,
        csrfProtectionEnabled: true,
        crossTabSyncEnabled: true,
      });
      settings = await settingRepo.save(settings);
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: (error: unknown) => void) => {
  try {
    await ensureSiteSettingsSchema();

    const {
      siteName, logoUrl, faviconUrl, email, phone, whatsapp, address,
      facebookUrl, instagramUrl, xUrl, linkedinUrl, defaultCurrency,
      heroTitle, heroSubtitle, heroCtaText, heroCtaLink, aboutTitle,
      aboutDescription, aboutCtaText, aboutCtaLink, servicesTitle,
      servicesDescription, featuredSectionTitle, showAboutSection,
      showFeaturedSection, showServicesSection, analyticsRetentionDays,
      sessionTimeoutMinutes, sessionWarningMinutes, minPasswordLength,
      maxPasswordLength, maxAuthAttempts, authRateLimitWindowMinutes,
      contactRateLimitPerHour, searchRateLimitPerMinute, globalRateLimit,
      csrfProtectionEnabled, crossTabSyncEnabled,
    } = req.body;

    const parseNum = (v: unknown): number | undefined => {
      if (v === undefined || v === null || v === '') return undefined;
      const num = Number(v);
      return Number.isNaN(num) ? undefined : num;
    };

    const parseBool = (v: unknown): boolean | undefined => {
      if (v === undefined || v === null) return undefined;
      return typeof v === 'boolean' ? v : v === 'true';
    };

    const settingValues = {
      siteName, logoUrl, faviconUrl, email, phone, whatsapp, address,
      facebookUrl, instagramUrl, xUrl, linkedinUrl, defaultCurrency,
      heroTitle, heroSubtitle, heroCtaText, heroCtaLink, aboutTitle,
      aboutDescription, aboutCtaText, aboutCtaLink, servicesTitle,
      servicesDescription, featuredSectionTitle,
      showAboutSection: parseBool(showAboutSection),
      showFeaturedSection: parseBool(showFeaturedSection),
      showServicesSection: parseBool(showServicesSection),
      analyticsRetentionDays: parseNum(analyticsRetentionDays),
      sessionTimeoutMinutes: parseNum(sessionTimeoutMinutes),
      sessionWarningMinutes: parseNum(sessionWarningMinutes),
      minPasswordLength: parseNum(minPasswordLength),
      maxPasswordLength: parseNum(maxPasswordLength),
      maxAuthAttempts: parseNum(maxAuthAttempts),
      authRateLimitWindowMinutes: parseNum(authRateLimitWindowMinutes),
      contactRateLimitPerHour: parseNum(contactRateLimitPerHour),
      searchRateLimitPerMinute: parseNum(searchRateLimitPerMinute),
      globalRateLimit: parseNum(globalRateLimit),
      csrfProtectionEnabled: parseBool(csrfProtectionEnabled),
      crossTabSyncEnabled: parseBool(crossTabSyncEnabled),
    };

    const updatedValues = Object.fromEntries(
      Object.entries(settingValues).filter(([, value]) => value !== undefined),
    );

    const settingRepo = AppDataSource.getRepository(SiteSetting);
    let settings = await settingRepo.findOne({ where: {} });

    if (settings) {
      Object.assign(settings, updatedValues);
      settings = await settingRepo.save(settings);
    } else {
      settings = settingRepo.create({ id: randomUUID(), ...updatedValues });
      settings = await settingRepo.save(settings);
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
