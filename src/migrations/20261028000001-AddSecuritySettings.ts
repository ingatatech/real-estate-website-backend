import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSecuritySettings20261028000001 implements MigrationInterface {
  name = 'AddSecuritySettings20261028000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "site_settings"
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
      ADD COLUMN IF NOT EXISTS "cross_tab_sync_enabled" boolean DEFAULT true
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "site_settings"
      DROP COLUMN IF EXISTS "session_timeout_minutes",
      DROP COLUMN IF EXISTS "session_warning_minutes",
      DROP COLUMN IF EXISTS "min_password_length",
      DROP COLUMN IF EXISTS "max_password_length",
      DROP COLUMN IF EXISTS "max_auth_attempts",
      DROP COLUMN IF EXISTS "auth_rate_limit_window_minutes",
      DROP COLUMN IF EXISTS "contact_rate_limit_per_hour",
      DROP COLUMN IF EXISTS "search_rate_limit_per_minute",
      DROP COLUMN IF EXISTS "global_rate_limit",
      DROP COLUMN IF EXISTS "csrf_protection_enabled",
      DROP COLUMN IF EXISTS "cross_tab_sync_enabled"
    `);
  }
}
