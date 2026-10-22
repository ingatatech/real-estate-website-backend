# Analytics Implementation

## Overview

The Ingata Real Estate website includes analytics tracking to monitor user engagement, property views, and conversion metrics. This document describes the analytics infrastructure and how to use it.

## Backend Infrastructure

### Entities

1. **PageView** (`src/entities/PageView.ts`)
   - Tracks every page visit
   - Captures: page path, page title, referrer, UTM parameters, device type, browser, OS, IP address
   - Indexed by: userId, pagePath, createdAt

2. **PropertyView** (`src/entities/PropertyView.ts`)
   - Tracks property detail page views
   - Captures: propertyId, session duration, referrer, device type, IP address
   - Indexed by: userId, propertyId, createdAt

3. **ClickEvent** (`src/entities/ClickEvent.ts`)
   - Tracks user interactions (clicks)
   - Event types: CTA, PHONE, EMAIL, WHATSAPP, LINK, BUTTON
   - Captures: eventType, propertyId, elementId, elementText, pagePath, destinationUrl, device type, IP address
   - Indexed by: userId, eventType, propertyId, createdAt

### API Endpoints

All analytics endpoints are at `/analytics/*`:

- `POST /analytics/page-view` - Track a page view
- `POST /analytics/property-view` - Track a property view
- `POST /analytics/click-event` - Track a click event
- `GET /analytics/summary` - Get analytics summary (admin only)
- `GET /analytics/devices` - Get device breakdown (admin only)
- `GET /analytics/sources` - Get traffic sources (admin only)
- `GET /analytics/funnel` - Get conversion funnel (admin only)
- `GET /analytics/property/:propertyId` - Get property-specific analytics (admin only)

Public tracking endpoints do not require authentication. Admin analytics endpoints require admin role.

## Frontend Implementation

### Analytics Utilities

Location: `src/utils/analytics.ts`

#### Functions

1. **trackPageView(pagePath, pageTitle)**
   - Tracks page visits
   - Automatically called by PageViewTracker component

2. **trackPropertyView(propertyId, sessionDurationSeconds)**
   - Tracks property detail page views
   - Can track session duration on page exit

3. **trackClickEvent(eventType, propertyId, elementId, elementText, destinationUrl)**
   - Tracks user interactions
   - Event types: 'CTA', 'PHONE', 'EMAIL', 'WHATSAPP', 'LINK', 'BUTTON'

4. **withClickTracking(handler, eventType, ...)**
   - Higher-order function to wrap click handlers with tracking

### Components

1. **PageViewTracker** (`src/components/analytics/PageViewTracker.tsx`)
   - Automatically tracks page views on route changes
   - Added to SiteShell for all public pages
   - Does not render anything (invisible component)

### Integration Points

#### 1. Page View Tracking (Automatic)
- Location: `src/components/layout/SiteShell.tsx`
- Implementation: PageViewTracker component added to SiteShell
- Scope: All public pages (excludes admin routes)
- Tracks: Every route change with page path and title

#### 2. Property View Tracking
- Location: `src/legacy-pages/PropertyDetails/index.tsx`
- Implementation: useEffect hook calls trackPropertyView when property loads
- Tracks: Property ID, session duration on unmount
- Scope: Property detail pages only

#### 3. Click Event Tracking
- Location: `src/legacy-pages/PropertyDetails/index.tsx`
  - Agent phone clicks → eventType: 'PHONE'
  - Agent email clicks → eventType: 'EMAIL'
- Location: `src/legacy-pages/Contact/index.tsx`
  - Contact phone clicks → eventType: 'PHONE'
  - Contact email clicks → eventType: 'EMAIL'
  - WhatsApp clicks → eventType: 'WHATSAPP'

## Session Management

- Session IDs are generated and stored in sessionStorage
- Format: `sess_<timestamp>_<randomString>`
- Used to track user sessions across page views
- Persists for the browser session only

## Privacy Considerations

- IP addresses are captured but not displayed publicly
- User tracking respects authentication (userId only if logged in)
- Tracking failures are silent (don't break user experience)
- No personal information beyond what users voluntarily provide

## Admin Dashboard

Location: `src/legacy-pages/Admin/Analytics/index.tsx`

The admin analytics dashboard displays:
- Summary metrics (visitors, property views, inquiries, conversions)
- Conversion funnel (visitors → property views → inquiries → viewings → listings)
- Traffic sources (when data available)
- Device breakdown (when data available)

**Note**: The dashboard now fetches real data from the backend analytics endpoints. Initially, it will show empty states until sufficient events are tracked on the public website.

## Adding New Tracking

### To Track a New Page View

No action needed - PageViewTracker handles all public pages automatically.

### To Track a New Click Event

```typescript
import { trackClickEvent } from '@/utils/analytics';

// In your component
<a
  href="tel:+1234567890"
  onClick={() => trackClickEvent('PHONE', propertyId, 'contact-phone', 'Call Us', 'tel:+1234567890')}
>
  Call Us
</a>
```

### To Track a Custom Event

Add a new event type to the ClickEventType union in `src/entities/ClickEvent.ts`:
```typescript
export type ClickEventType = 'CTA' | 'PHONE' | 'EMAIL' | 'WHATSAPP' | 'LINK' | 'BUTTON' | 'YOUR_TYPE';
```

Then use it in trackClickEvent calls.

## Testing

To verify tracking is working:

1. Open browser DevTools → Network tab
2. Filter by "analytics"
3. Navigate to different pages - should see POST /analytics/page-view requests
4. View a property detail page - should see POST /analytics/property-view requests
5. Click phone/email links - should see POST /analytics/click-event requests
6. Check Request Payload to confirm data is being sent correctly

## Data Retention

Analytics data is retained according to the data retention policy (see migration 20261012000003-AddDataRetention.ts). Old data is automatically cleaned up to maintain database performance.

### Automated Cleanup

**Implementation:** `src/services/scheduledTasks.ts`

The backend includes automated analytics data cleanup using node-cron:

- **Schedule:** Daily at 2:00 AM UTC
- **Retention Period:** Configurable via `analyticsRetentionDays` in site settings (default: 365 days)
- **Control:** Enable/disable via `ENABLE_SCHEDULED_TASKS` environment variable
- **Scope:** Cleans up PageView, PropertyView, and ClickEvent records older than retention period

**Manual Cleanup:**
Admin can manually trigger cleanup via:
- `POST /admin/analytics/cleanup` - Immediate cleanup
- `GET /admin/analytics/retention-status` - View cleanup status and old record counts

**Configuration:**
```bash
# Enable scheduled tasks (default: true in production)
ENABLE_SCHEDULED_TASKS=true
```

## Troubleshooting

### Tracking Not Working

1. Check that API_BASE_URL is correctly configured in `src/config/api.ts`
2. Verify backend analytics endpoints are accessible
3. Check browser console for tracking errors (logged with console.debug)
4. Ensure PageViewTracker is in SiteShell

### No Data in Admin Dashboard

1. Verify users have been visiting the public website
2. Check that tracking requests are being sent (Network tab)
3. Confirm backend is receiving and saving events
4. Wait for sufficient data collection (dashboard may need time to populate)

## Future Enhancements

Potential additions:
- Add tracking to property listing cards
- Track form submissions (inquiries, viewing requests, contact forms)
- Implement scroll depth tracking
- Add heatmap integration
- Track social media clicks
- Implement real-time analytics dashboard
