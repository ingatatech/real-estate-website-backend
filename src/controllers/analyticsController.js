import { randomUUID } from 'node:crypto';
import { AppDataSource } from '../lib/typeorm.js';
import { PageView } from '../entities/PageView.js';
import { PropertyView } from '../entities/PropertyView.js';
import { ClickEvent } from '../entities/ClickEvent.js';
// Get client IP address from request
const getClientIp = (req) => {
    return (req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.headers['x-real-ip'] ||
        req.socket.remoteAddress ||
        undefined);
};
// Get user agent info
const getUserAgentInfo = (req) => {
    const userAgent = req.headers['user-agent'] || '';
    // Enhanced device type detection
    let deviceType = 'desktop';
    if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
        deviceType = 'mobile';
    }
    else if (/Tablet|iPad/i.test(userAgent)) {
        deviceType = 'tablet';
    }
    // Enhanced browser detection
    let browser = 'unknown';
    if (/Edg/i.test(userAgent))
        browser = 'edge';
    else if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent))
        browser = 'chrome';
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent))
        browser = 'safari';
    else if (/Firefox/i.test(userAgent))
        browser = 'firefox';
    else if (/Opera/i.test(userAgent))
        browser = 'opera';
    // Enhanced OS detection
    let os = 'unknown';
    if (/Windows/i.test(userAgent))
        os = 'windows';
    else if (/Mac OS X|Macintosh/i.test(userAgent))
        os = 'macos';
    else if (/Linux/i.test(userAgent))
        os = 'linux';
    else if (/Android/i.test(userAgent))
        os = 'android';
    else if (/iOS|iPhone|iPad|iPod/i.test(userAgent))
        os = 'ios';
    return { deviceType, browser, os };
};
// Parse UTM parameters from query string
const parseUtmParams = (input) => ({
    utmSource: input.utmSource || input.utm_source || undefined,
    utmMedium: input.utmMedium || input.utm_medium || undefined,
    utmCampaign: input.utmCampaign || input.utm_campaign || undefined,
    utmTerm: input.utmTerm || input.utm_term || undefined,
    utmContent: input.utmContent || input.utm_content || undefined,
});
export const trackPageView = async (req, res) => {
    try {
        const pageViewRepo = AppDataSource.getRepository(PageView);
        const { deviceType, browser, os } = getUserAgentInfo(req);
        const utmParams = parseUtmParams({ ...req.query, ...req.body });
        const pageView = pageViewRepo.create({
            id: randomUUID(),
            userId: req.user?.id || undefined,
            sessionId: req.headers['x-session-id'] || undefined,
            pagePath: req.body.pagePath || req.query.pagePath || req.path,
            pageTitle: req.body.pageTitle || undefined,
            referrer: req.headers.referer || req.body.referrer || undefined,
            ...utmParams,
            deviceType,
            browser,
            os,
            ipAddress: getClientIp(req),
            country: req.body.country || undefined,
            city: req.body.city || undefined,
        });
        await pageViewRepo.save(pageView);
        res.status(201).json({ success: true, data: { id: pageView.id } });
    }
    catch (error) {
        console.error('Error tracking page view:', error);
        // Don't fail the request if tracking fails
        res.status(200).json({ success: true, message: 'Page view tracking skipped' });
    }
};
export const trackPropertyView = async (req, res) => {
    try {
        const propertyViewRepo = AppDataSource.getRepository(PropertyView);
        const { deviceType } = getUserAgentInfo(req);
        const propertyId = req.body.propertyId || req.params.propertyId;
        if (!propertyId || typeof propertyId !== 'string') {
            return res.status(400).json({ success: false, message: 'A property ID is required.' });
        }
        const propertyView = propertyViewRepo.create({
            id: randomUUID(),
            userId: req.user?.id || undefined,
            sessionId: req.headers['x-session-id'] || undefined,
            propertyId,
            sessionDurationSeconds: req.body.sessionDurationSeconds || undefined,
            referrer: req.headers.referer || req.body.referrer || undefined,
            deviceType,
            ipAddress: getClientIp(req),
        });
        await propertyViewRepo.save(propertyView);
        res.status(201).json({ success: true, data: { id: propertyView.id } });
    }
    catch (error) {
        console.error('Error tracking property view:', error);
        res.status(200).json({ success: true, message: 'Property view tracking skipped' });
    }
};
export const trackClickEvent = async (req, res) => {
    try {
        const clickEventRepo = AppDataSource.getRepository(ClickEvent);
        const { deviceType } = getUserAgentInfo(req);
        const eventType = req.body.eventType;
        const eventTypes = new Set(['CTA', 'PHONE', 'EMAIL', 'WHATSAPP', 'LINK', 'BUTTON', 'SEARCH', 'FILTER']);
        if (!eventTypes.has(eventType) || typeof req.body.pagePath !== 'string') {
            return res.status(400).json({ success: false, message: 'A valid event type and page path are required.' });
        }
        const clickEvent = clickEventRepo.create({
            id: randomUUID(),
            userId: req.user?.id || undefined,
            sessionId: req.headers['x-session-id'] || undefined,
            eventType,
            propertyId: req.body.propertyId || undefined,
            elementId: req.body.elementId || undefined,
            elementText: req.body.elementText || undefined,
            pagePath: req.body.pagePath || req.path,
            destinationUrl: req.body.destinationUrl || undefined,
            deviceType,
            ipAddress: getClientIp(req),
        });
        await clickEventRepo.save(clickEvent);
        res.status(201).json({ success: true, data: { id: clickEvent.id } });
    }
    catch (error) {
        console.error('Error tracking click event:', error);
        res.status(200).json({ success: true, message: 'Click event tracking skipped' });
    }
};
