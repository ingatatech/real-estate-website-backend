import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordComplexityRequirements20261028000002 implements MigrationInterface {
  name = 'AddPasswordComplexityRequirements20261028000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "require_uppercase" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "require_lowercase" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "require_numbers" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "require_special_chars" boolean DEFAULT true;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "site_settings"
      DROP COLUMN IF EXISTS "require_special_chars",
      DROP COLUMN IF EXISTS "require_numbers",
      DROP COLUMN IF EXISTS "require_lowercase",
      DROP COLUMN IF EXISTS "require_uppercase";
    `);
  }
}
