import 'reflect-metadata';
import app from './app.js';
import { env } from './config/env.js';
import AppDataSource from './lib/typeorm.js';
import { initializeScheduledTasks } from './services/scheduledTasks.js';
import { ensureSiteSettingsSchema } from './controllers/settingController.js';
import { ensureUserSchema } from './controllers/authController.js';

AppDataSource.initialize()
  .then(async () => {
    console.log('Database connected successfully');
    try {
      await ensureSiteSettingsSchema();
      console.log('Site settings schema self-healed and verified');
    } catch (schemaError) {
      console.warn('Auto-schema verification notice:', schemaError);
    }
    try {
      await ensureUserSchema();
    } catch (userSchemaError) {
      console.warn('Auto-user-schema verification notice:', userSchemaError);
    }
    try {
      const pendingMigrations = await AppDataSource.showMigrations();
      if (pendingMigrations) {
        console.log('Applying pending migrations on startup...');
        await AppDataSource.runMigrations();
        console.log('Migrations applied successfully on startup');
      }
    } catch (migError) {
      console.warn('Startup migration notice:', migError);
    }
    // Initialize scheduled tasks (analytics cleanup, etc.)
    initializeScheduledTasks();
    app.listen(env.port, () => {
      console.log(`Backend running on http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });
