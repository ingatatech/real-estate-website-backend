import cron from 'node-cron';
import { AppDataSource } from '../lib/typeorm.js';
import { PageView } from '../entities/PageView.js';
import { PropertyView } from '../entities/PropertyView.js';
import { ClickEvent } from '../entities/ClickEvent.js';
import { SiteSetting } from '../entities/SiteSetting.js';

/**
 * Scheduled Tasks Service
 * Handles all automated background jobs for the application
 */

let analyticsCleanupTask: ReturnType<typeof cron.schedule> | null = null;

/**
 * Analytics Data Cleanup Job
 * Runs daily at 2:00 AM to clean up old analytics data based on retention settings
 */
export const startAnalyticsCleanupJob = () => {
  // Stop existing task if running
  if (analyticsCleanupTask) {
    analyticsCleanupTask.stop();
  }

  // Schedule daily cleanup at 2:00 AM
  analyticsCleanupTask = cron.schedule('0 2 * * *', async () => {
    console.log('[Scheduled Task] Starting analytics data cleanup...');
    try {
      const siteSettingRepo = AppDataSource.getRepository(SiteSetting);
      const settings = await siteSettingRepo.findOne({ where: { id: 'default' } });

      const retentionDays = settings?.analyticsRetentionDays || 365;

      if (retentionDays <= 0) {
        console.log('[Scheduled Task] Data retention is disabled. Skipping cleanup.');
        return;
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const pageViewRepo = AppDataSource.getRepository(PageView);
      const propertyViewRepo = AppDataSource.getRepository(PropertyView);
      const clickEventRepo = AppDataSource.getRepository(ClickEvent);

      const pageViewsResult = await pageViewRepo
        .createQueryBuilder()
        .delete()
        .where('createdAt < :cutoffDate', { cutoffDate })
        .execute();

      const propertyViewsResult = await propertyViewRepo
        .createQueryBuilder()
        .delete()
        .where('createdAt < :cutoffDate', { cutoffDate })
        .execute();

      const clickEventsResult = await clickEventRepo
        .createQueryBuilder()
        .delete()
        .where('createdAt < :cutoffDate', { cutoffDate })
        .execute();

      const pageViewsDeleted = pageViewsResult.affected || 0;
      const propertyViewsDeleted = propertyViewsResult.affected || 0;
      const clickEventsDeleted = clickEventsResult.affected || 0;

      console.log('[Scheduled Task] Analytics cleanup completed:', {
        retentionDays,
        cutoffDate: cutoffDate.toISOString(),
        deletedCounts: {
          pageViews: pageViewsDeleted,
          propertyViews: propertyViewsDeleted,
          clickEvents: clickEventsDeleted,
        },
      });
    } catch (error) {
      console.error('[Scheduled Task] Analytics cleanup failed:', error);
    }
  }, {
    timezone: 'UTC',
  });

  console.log('[Scheduled Task] Analytics cleanup job scheduled to run daily at 2:00 AM UTC');
};

/**
 * Stop all scheduled tasks
 */
export const stopAllScheduledTasks = () => {
  if (analyticsCleanupTask) {
    analyticsCleanupTask.stop();
    analyticsCleanupTask = null;
    console.log('[Scheduled Task] Analytics cleanup job stopped');
  }
};

/**
 * Initialize all scheduled tasks
 * Call this when the server starts
 */
export const initializeScheduledTasks = () => {
  // Only start scheduled tasks in production or if explicitly enabled
  const enableScheduledTasks = process.env.ENABLE_SCHEDULED_TASKS === 'true' || process.env.NODE_ENV === 'production';

  if (enableScheduledTasks) {
    console.log('[Scheduled Task] Initializing scheduled tasks...');
    startAnalyticsCleanupJob();
  } else {
    console.log('[Scheduled Task] Scheduled tasks disabled (set ENABLE_SCHEDULED_TASKS=true to enable)');
  }
};
