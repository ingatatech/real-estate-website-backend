import nodemailer from 'nodemailer';
import { AppDataSource } from '../lib/typeorm.js';
import { PropertySearch } from '../entities/PropertySearch.js';
import { Property } from '../entities/Property.js';

interface MailConfig {
  frontendUrl: string;
  from: string;
  transporter: nodemailer.Transporter;
}

const getMailConfig = (): MailConfig | null => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const portStr = process.env.SMTP_PORT || process.env.EMAIL_PORT;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS;
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || user;
  const frontendUrl = (process.env.FRONTEND_URL || process.env.CLIENT_URL || 'https://ingata-real-estate.vercel.app').replace(/\/+$/, '');

  if (!host || !portStr || !user || !pass || !from) return null;

  const port = Number(portStr);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return null;
  }

  return {
    frontendUrl,
    from,
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true' || port === 465,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    }),
  };
};

/**
 * Ensure property_searches table has last_alert_sent_at column
 */
export const ensurePropertySearchSchema = async () => {
  try {
    if (!AppDataSource.isInitialized) return;
    await AppDataSource.query(`
      ALTER TABLE property_searches
      ADD COLUMN IF NOT EXISTS last_alert_sent_at TIMESTAMP NULL;
    `);
  } catch (err) {
    console.error('[SavedSearchAlerts] Failed to ensure property_searches schema:', err);
  }
};

const formatPrice = (price?: number, currency: string = 'RWF'): string => {
  if (price === undefined || price === null) return 'Price on request';
  const num = Number(price);
  if (isNaN(num)) return String(price);
  if (num >= 1000000) {
    return `${currency} ${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${currency} ${(num / 1000).toFixed(0)}K`;
  }
  return `${currency} ${num.toLocaleString()}`;
};

/**
 * Send an email with matching property alerts
 */
export const sendSavedSearchAlertEmail = async (
  email: string,
  search: PropertySearch,
  properties: Property[]
) => {
  const mailConfig = getMailConfig();
  if (!mailConfig) {
    console.warn('[SavedSearchAlerts] SMTP not configured. Skipping email delivery to:', email);
    return false;
  }

  const { frontendUrl, from, transporter } = mailConfig;
  const propertyCount = properties.length;
  const subject = `New Properties Alert: ${propertyCount} new ${propertyCount === 1 ? 'property' : 'properties'} match your search`;

  const propertiesHtml = properties
    .slice(0, 6)
    .map((p) => {
      const propertyUrl = `${frontendUrl}/properties/${p.slug || p.id}`;
      const specs = [
        p.bedrooms ? `${p.bedrooms} Beds` : null,
        p.bathrooms ? `${p.bathrooms} Baths` : null,
        p.size ? `${p.size} ${p.sizeUnit || 'sqm'}` : null,
      ]
        .filter(Boolean)
        .join(' · ');

      return `
      <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 20px; background-color: #ffffff;">
        <div style="padding: 16px;">
          <div style="font-size: 12px; font-weight: bold; color: #059669; text-transform: uppercase; margin-bottom: 4px;">
            ${p.transactionType || 'For Sale'} · ${p.propertyType || 'Residential'}
          </div>
          <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #0f172a;">${p.title}</h3>
          <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px;">${p.location || 'Rwanda'}${p.district ? `, ${p.district}` : ''}</p>
          <div style="font-size: 18px; font-weight: bold; color: #059669; margin-bottom: 8px;">
            ${formatPrice(p.price, p.currency || 'RWF')}
          </div>
          ${specs ? `<p style="margin: 0 0 16px 0; color: #475569; font-size: 13px;">${specs}</p>` : ''}
          <a href="${propertyUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: bold;">
            View Property Details
          </a>
        </div>
      </div>
    `;
    })
    .join('');

  const criteriaList: string[] = [];
  if (search.location) criteriaList.push(`Location: <strong>${search.location}</strong>`);
  if (search.propertyType) criteriaList.push(`Type: <strong>${search.propertyType}</strong>`);
  if (search.transactionType) criteriaList.push(`Transaction: <strong>${search.transactionType}</strong>`);
  if (search.minPrice || search.maxPrice) {
    criteriaList.push(
      `Price: <strong>${search.minPrice ? formatPrice(search.minPrice) : '0'} - ${search.maxPrice ? formatPrice(search.maxPrice) : 'Any'}</strong>`
    );
  }
  if (search.minBedrooms) criteriaList.push(`Bedrooms: <strong>${search.minBedrooms}+</strong>`);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background-color: #0f172a; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: bold;">Ingata Real Estate</h1>
            <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Saved Search Property Alert</p>
          </div>

          <!-- Body -->
          <div style="padding: 24px;">
            <p style="font-size: 16px; color: #1e293b; margin-top: 0;">
              Hello,
            </p>
            <p style="font-size: 15px; color: #475569; line-height: 1.6;">
              Great news! We found <strong>${propertyCount}</strong> new ${propertyCount === 1 ? 'property' : 'properties'} that match your saved search criteria on Ingata Real Estate.
            </p>

            ${
              criteriaList.length > 0
                ? `<div style="background-color: #f1f5f9; border-radius: 8px; padding: 12px 16px; margin: 16px 0 24px 0; font-size: 13px; color: #334155;">
                    <div style="font-weight: bold; margin-bottom: 6px; color: #0f172a;">Your Search Filters:</div>
                    ${criteriaList.join(' · ')}
                  </div>`
                : ''
            }

            ${propertiesHtml}

            <div style="text-align: center; margin-top: 24px;">
              <a href="${frontendUrl}/properties" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: bold;">
                Browse All Properties
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
            <p style="margin: 0 0 6px 0;">You received this email because you saved a property search on Ingata Real Estate.</p>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Ingata Real Estate Ltd. Kigali, Rwanda.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Ingata Real Estate - New Properties Alert\n\nWe found ${propertyCount} new properties matching your search criteria.\n\n` +
    properties.slice(0, 5).map((p) => `- ${p.title} (${formatPrice(p.price, p.currency)}): ${frontendUrl}/properties/${p.slug || p.id}`).join('\n') +
    `\n\nBrowse all properties: ${frontendUrl}/properties`;

  await transporter.sendMail({
    from,
    to: email,
    subject,
    text,
    html,
  });

  return true;
};

/**
 * Scan for newly listed properties matching saved searches and send email alerts
 */
export const checkAndSendSavedSearchAlerts = async (): Promise<{
  processedCount: number;
  alertsSentCount: number;
  errors: string[];
}> => {
  await ensurePropertySearchSchema();

  const searchRepo = AppDataSource.getRepository(PropertySearch);
  const propertyRepo = AppDataSource.getRepository(Property);

  // Retrieve searches that have an email or a linked user
  const searches = await searchRepo.find({
    relations: { user: true },
  });

  let processedCount = 0;
  let alertsSentCount = 0;
  const errors: string[] = [];

  for (const search of searches) {
    const targetEmail = search.email || search.user?.email;
    if (!targetEmail || !targetEmail.includes('@')) {
      continue;
    }

    processedCount++;

    try {
      // Determine cutoff date: either the last alert sent timestamp, or searches created in last 48 hours
      const cutoffDate = search.lastAlertSentAt || new Date(Date.now() - 48 * 60 * 60 * 1000);

      // Build query for published properties created or listed after cutoffDate
      const qb = propertyRepo
        .createQueryBuilder('p')
        .where('p.publication_status = :pubStatus', { pubStatus: 'PUBLISHED' })
        .andWhere('(p.created_at > :cutoffDate OR p.listed_at > :cutoffDate)', { cutoffDate });

      if (search.transactionType) {
        qb.andWhere('UPPER(p.transaction_type) = :transactionType', {
          transactionType: search.transactionType.toUpperCase(),
        });
      }

      if (search.propertyType) {
        qb.andWhere('UPPER(p.property_type) = :propertyType', {
          propertyType: search.propertyType.toUpperCase(),
        });
      }

      if (search.minPrice !== undefined && search.minPrice !== null) {
        qb.andWhere('p.price >= :minPrice', { minPrice: search.minPrice });
      }

      if (search.maxPrice !== undefined && search.maxPrice !== null) {
        qb.andWhere('p.price <= :maxPrice', { maxPrice: search.maxPrice });
      }

      if (search.minBedrooms !== undefined && search.minBedrooms !== null) {
        qb.andWhere('p.bedrooms >= :minBedrooms', { minBedrooms: search.minBedrooms });
      }

      if (search.maxBedrooms !== undefined && search.maxBedrooms !== null) {
        qb.andWhere('p.bedrooms <= :maxBedrooms', { maxBedrooms: search.maxBedrooms });
      }

      if (search.minBathrooms !== undefined && search.minBathrooms !== null) {
        qb.andWhere('p.bathrooms >= :minBathrooms', { minBathrooms: search.minBathrooms });
      }

      if (search.location) {
        qb.andWhere(
          '(LOWER(p.location) LIKE :loc OR LOWER(p.district) LIKE :loc OR LOWER(p.sector) LIKE :loc)',
          { loc: `%${search.location.toLowerCase()}%` }
        );
      }

      qb.orderBy('p.createdAt', 'DESC');
      qb.take(10);

      const matchingProperties = await qb.getMany();

      if (matchingProperties.length > 0) {
        const sent = await sendSavedSearchAlertEmail(targetEmail, search, matchingProperties);
        if (sent) {
          alertsSentCount++;
          search.lastAlertSentAt = new Date();
          await searchRepo.save(search);
        }
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[SavedSearchAlerts] Error processing search ${search.id}:`, errMsg);
      errors.push(`Search ${search.id}: ${errMsg}`);
    }
  }

  console.log(`[SavedSearchAlerts] Done: checked ${processedCount} searches, sent ${alertsSentCount} alerts.`);
  return { processedCount, alertsSentCount, errors };
};
