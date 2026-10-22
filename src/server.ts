import 'reflect-metadata';
import app from './app.js';
import { env } from './config/env.js';
import AppDataSource from './lib/typeorm.js';
import { initializeScheduledTasks } from './services/scheduledTasks.js';

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
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
