import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerificationAndAccountLockout20261028000003 implements MigrationInterface {
  name = 'AddEmailVerificationAndAccountLockout20261028000003';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_email_verified" boolean DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verification_token_hash" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verification_expires_at" timestamp`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "failed_login_attempts" integer DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "locked_until" timestamp`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "locked_until"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "failed_login_attempts"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "email_verification_expires_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "email_verification_token_hash"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "is_email_verified"`);
  }
}
