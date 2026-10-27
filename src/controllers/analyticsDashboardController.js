import { AppDataSource } from '../lib/typeorm.js';
import { PageView } from '../entities/PageView.js';
import { PropertyView } from '../entities/PropertyView.js';
import { ClickEvent } from '../entities/ClickEvent.js';
import { Inquiry } from '../entities/Inquiry.js';
import { ViewingRequest } from '../entities/ViewingRequest.js';
const validPeriods = new Set(['today', '7days', '30days', '90days']);
const range = (query, alias, dates) => query.where(`${alias}.createdAt >= :start`, { start: dates.start }).andWhere(`${alias}.createdAt <= :end`, { end: dates.end });
const publicPages = (query) => query.andWhere('pageView.pagePath NOT LIKE :adminPath', { adminPath: '/admin%' }).andWhere('pageView.pagePath NOT LIKE :portalPath', { portalPath: '/portal%' });
const published = (query, alias) => query.innerJoin(`${alias}.property`, 'property').andWhere('property.publicationStatus = :publishedStatus', { publishedStatus: 'PUBLISHED' });
const asCount = (value) => Number.parseInt(String(value || '0'), 10);
const rateChange = (current, previous) => previous === 0 ? null : ((current - previous) / previous) * 100;
function getRanges(requested) {
    const period = validPeriods.has(requested) ? requested : '30days';
    const end = new Date();
    const start = new Date(end);
    if (period === 'today')
        start.setHours(0, 0, 0, 0);
    else
        start.setTime(end.getTime() - ({ '7days': 7, '30days': 30, '90days': 90 }[period] || 30) * 86_400_000);
    const previousEnd = new Date(start.getTime() - 1);
    return { period, current: { start, end }, previous: { start: new Date(previousEnd.getTime() - (end.getTime() - start.getTime())), end: previousEnd } };
}
const pageViews = (dates) => publicPages(range(AppDataSource.getRepository(PageView).createQueryBuilder('pageView'), 'pageView', dates)).getCount();
const visitors = (dates) => publicPages(range(AppDataSource.getRepository(PageView).createQueryBuilder('pageView'), 'pageView', dates)).select('COUNT(DISTINCT pageView.sessionId)', 'count').getRawOne().then((row) => asCount(row?.count));
const propertyEvents = (entity, alias, dates) => published(range(AppDataSource.getRepository(entity).createQueryBuilder(alias), alias, dates), alias).getCount();
export const getAnalyticsSummary = async (req, res) => {
    try {
        const { period, current, previous } = getRanges(String(req.query.period || '30days'));
        const [totalPageViews, uniquePageViews, totalPropertyViews, totalInquiries, totalViewings, totalSearches, prevPageViews, prevPropertyViews, prevInquiries, prevViewings, clicks, trend, properties] = await Promise.all([
            pageViews(current), visitors(current), propertyEvents(PropertyView, 'propertyView', current), propertyEvents(Inquiry, 'inquiry', current), propertyEvents(ViewingRequest, 'viewing', current), range(AppDataSource.getRepository(ClickEvent).createQueryBuilder('search'), 'search', current).andWhere('search.eventType = :searchType', { searchType: 'SEARCH' }).getCount(),
            pageViews(previous), propertyEvents(PropertyView, 'propertyView', previous), propertyEvents(Inquiry, 'inquiry', previous), propertyEvents(ViewingRequest, 'viewing', previous),
            range(AppDataSource.getRepository(ClickEvent).createQueryBuilder('click'), 'click', current).select('click.eventType', 'eventType').addSelect('COUNT(*)', 'count').groupBy('click.eventType').getRawMany(),
            publicPages(range(AppDataSource.getRepository(PageView).createQueryBuilder('pageView'), 'pageView', current)).select('DATE(pageView.createdAt)', 'date').addSelect('COUNT(*)', 'count').groupBy('DATE(pageView.createdAt)').orderBy('DATE(pageView.createdAt)', 'ASC').getRawMany(),
            published(range(AppDataSource.getRepository(PropertyView).createQueryBuilder('propertyView'), 'propertyView', current), 'propertyView').select('propertyView.propertyId', 'propertyId').addSelect('property.title', 'title').addSelect('MIN(propertyImage.imageUrl)', 'thumbnailUrl').addSelect('COUNT(*)', 'viewCount').leftJoin('property.propertyImages', 'propertyImage').groupBy('propertyView.propertyId, property.title').orderBy('COUNT(*)', 'DESC').limit(5).getRawMany(),
        ]);
        const byType = clicks.reduce((all, item) => ({ ...all, [item.eventType]: asCount(item.count) }), {});
        const clickBreakdown = { CTA: byType.CTA || 0, PHONE: byType.PHONE || 0, EMAIL: byType.EMAIL || 0, WHATSAPP: byType.WHATSAPP || 0, LINK: byType.LINK || 0, BUTTON: byType.BUTTON || 0 };
        res.json({ success: true, data: { period, dateRange: current, previousDateRange: previous, summary: { totalPageViews, uniquePageViews, totalPropertyViews, totalInquiries, totalViewings, totalSearches, totalClicks: Object.values(clickBreakdown).reduce((a, b) => a + b, 0) }, comparison: { pageViewsChange: rateChange(totalPageViews, prevPageViews), propertyViewsChange: rateChange(totalPropertyViews, prevPropertyViews), inquiriesChange: rateChange(totalInquiries, prevInquiries), viewingsChange: rateChange(totalViewings, prevViewings) }, clickBreakdown, pageViewTrend: trend.map((item) => ({ date: item.date, count: asCount(item.count) })), popularProperties: properties.map((item) => ({ propertyId: item.propertyId, title: item.title, thumbnailUrl: item.thumbnailUrl || null, viewCount: asCount(item.viewCount) })) } });
    }
    catch (error) {
        console.error('Error fetching analytics summary:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch analytics summary' });
    }
};
export const getDeviceBreakdown = async (req, res) => {
    try {
        const { period, current } = getRanges(String(req.query.period || '30days'));
        const rows = await publicPages(range(AppDataSource.getRepository(PageView).createQueryBuilder('pageView'), 'pageView', current)).select("COALESCE(pageView.deviceType, 'unknown')", 'deviceType').addSelect('COUNT(*)', 'count').groupBy("COALESCE(pageView.deviceType, 'unknown')").getRawMany();
        res.json({ success: true, data: { period, dateRange: current, breakdown: rows.reduce((all, item) => ({ ...all, [item.deviceType]: asCount(item.count) }), {}) } });
    }
    catch (error) {
        console.error('Error fetching device breakdown:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch device breakdown' });
    }
};
export const getTrafficSources = async (req, res) => {
    try {
        const { period, current } = getRanges(String(req.query.period || '30days'));
        const rows = await publicPages(range(AppDataSource.getRepository(PageView).createQueryBuilder('pageView'), 'pageView', current)).select("COALESCE(NULLIF(pageView.utmSource, ''), 'Direct')", 'source').addSelect('COUNT(*)', 'count').groupBy("COALESCE(NULLIF(pageView.utmSource, ''), 'Direct')").orderBy('COUNT(*)', 'DESC').limit(10).getRawMany();
        res.json({ success: true, data: { period, dateRange: current, sources: rows.map((item) => ({ source: item.source, count: asCount(item.count) })) } });
    }
    catch (error) {
        console.error('Error fetching traffic sources:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch traffic sources' });
    }
};
export const getConversionFunnel = async (req, res) => {
    try {
        const { period, current } = getRanges(String(req.query.period || '30days'));
        const [uniqueVisitors, propertyViews, inquiries, viewings] = await Promise.all([visitors(current), propertyEvents(PropertyView, 'propertyView', current), propertyEvents(Inquiry, 'inquiry', current), propertyEvents(ViewingRequest, 'viewing', current)]);
        const rate = (value, base) => base ? (value / base) * 100 : 0;
        res.json({ success: true, data: { period, dateRange: current, funnel: [{ stage: 'Unique Visitors', count: uniqueVisitors, rate: 100, rateLabel: 'baseline' }, { stage: 'Property Views', count: propertyViews, rate: rate(propertyViews, uniqueVisitors), rateLabel: 'of visitors' }, { stage: 'Inquiries', count: inquiries, rate: rate(inquiries, propertyViews), rateLabel: 'of property views' }, { stage: 'Viewing Requests', count: viewings, rate: rate(viewings, propertyViews), rateLabel: 'of property views' }] } });
    }
    catch (error) {
        console.error('Error fetching conversion funnel:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch analytics funnel' });
    }
};
export const exportAnalyticsCsv = async (req, res) => {
    try {
        const { period, current } = getRanges(String(req.query.period || '30days'));
        const [pages, views, clicks] = await Promise.all([
            publicPages(range(AppDataSource.getRepository(PageView).createQueryBuilder('pageView'), 'pageView', current)).orderBy('pageView.createdAt', 'DESC').getMany(),
            published(range(AppDataSource.getRepository(PropertyView).createQueryBuilder('propertyView'), 'propertyView', current), 'propertyView').orderBy('propertyView.createdAt', 'DESC').getMany(),
            range(AppDataSource.getRepository(ClickEvent).createQueryBuilder('click'), 'click', current).orderBy('click.createdAt', 'DESC').getMany(),
        ]);
        const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
        const lines = ['Event,Date,Page or Property,Detail,Device,Source'];
        pages.forEach((item) => lines.push(['page_view', item.createdAt.toISOString(), item.pagePath, item.pageTitle, item.deviceType, item.utmSource].map(quote).join(',')));
        views.forEach((item) => lines.push(['property_view', item.createdAt.toISOString(), item.propertyId, '', item.deviceType, item.referrer].map(quote).join(',')));
        clicks.forEach((item) => lines.push(['click', item.createdAt.toISOString(), item.pagePath, item.eventType, item.deviceType, item.destinationUrl].map(quote).join(',')));
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=analytics-${period}.csv`);
        res.send(lines.join('\n'));
    }
    catch (error) {
        console.error('Error exporting analytics CSV:', error);
        res.status(500).json({ success: false, message: 'Failed to export analytics' });
    }
};
export const getPropertyAnalytics = async (req, res) => {
    try {
        const { period, current } = getRanges(String(req.query.period || '30days'));
        const propertyId = req.params.propertyId;
        const [viewCount, clickCount, inquiryCount, viewingCount] = await Promise.all([
            published(range(AppDataSource.getRepository(PropertyView).createQueryBuilder('propertyView'), 'propertyView', current), 'propertyView').andWhere('propertyView.propertyId = :propertyId', { propertyId }).getCount(),
            range(AppDataSource.getRepository(ClickEvent).createQueryBuilder('click'), 'click', current).andWhere('click.propertyId = :propertyId', { propertyId }).getCount(),
            published(range(AppDataSource.getRepository(Inquiry).createQueryBuilder('inquiry'), 'inquiry', current), 'inquiry').andWhere('inquiry.propertyId = :propertyId', { propertyId }).getCount(),
            published(range(AppDataSource.getRepository(ViewingRequest).createQueryBuilder('viewing'), 'viewing', current), 'viewing').andWhere('viewing.propertyId = :propertyId', { propertyId }).getCount(),
        ]);
        res.json({ success: true, data: { propertyId, period, dateRange: current, metrics: { viewCount, clickCount, inquiryCount, viewingCount } } });
    }
    catch (error) {
        console.error('Error fetching property analytics:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch property analytics' });
    }
};
