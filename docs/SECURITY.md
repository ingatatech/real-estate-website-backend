# Security Documentation

**Last Updated:** October 22, 2026

## Recent Security Updates (October 22, 2026)

### 1. JWT Expiration Alignment
- **Change:** Default JWT expiration updated from 7 days to 5 minutes
- **Reason:** Aligns with session expiration and improves security
- **File:** `backend/src/controllers/authController.ts`
- **Commit:** e4c81bc

### 2. Analytics Data Cleanup Automation
- **Added:** node-cron package for scheduled tasks
- **Created:** `backend/src/services/scheduledTasks.ts`
- **Features:**
  - Daily cleanup at 2:00 AM UTC
  - Respects analyticsRetentionDays from site settings
  - Environment variable ENABLE_SCHEDULED_TASKS to control
  - Manual cleanup endpoint still available
- **Files Modified:** server.ts, .env.example
- **Commit:** dac7b25

### 3. Map Integration with Interactive Component
- **Added:** leaflet and react-leaflet packages
- **Created:** `frontend/src/components/map/PropertyMap.tsx`
- **Features:**
  - Interactive Leaflet map component
  - Uses OpenStreetMap tiles (free, no API key)
  - Property marker with address popup
  - Responsive design (mobile/desktop)
  - Replaced Google Maps iframe
- **Files Modified:** PropertyDetails/index.tsx
- **Commit:** d3894cd

### 4. CSRF Protection
- **Added:** helmet package for security headers
- **Created:** `backend/src/middleware/csrf.ts`
- **Features:**
  - Helmet middleware for security headers (CSP, HSTS, etc.)
  - Content Security Policy configured for Leaflet maps
  - CSRF protection middleware (disabled for JWT-based API)
  - Note: JWT authentication inherently protects against CSRF
- **Files Modified:** app.ts
- **Commit:** 595ba38

---

## Table of Contents
1. [Overview](#overview)
2. [Authentication Security](#authentication-security)
3. [Rate Limiting](#rate-limiting)
4. [Security Headers](#security-headers)
5. [CSRF Protection](#csrf-protection)
6. [Data Protection](#data-protection)
7. [Analytics Security](#analytics-security)
8. [Session Management](#session-management)
9. [Error Tracking](#error-tracking)
10. [Security Checklist](#security-checklist)

---

## Overview

This document outlines the security measures implemented in the Ingata Real Estate application to protect against common web vulnerabilities and ensure data protection.

### Security Layers

1. **Authentication Layer** - JWT-based authentication with role-based access control
2. **Transport Layer** - HTTPS in production, CORS configuration
3. **Application Layer** - Rate limiting, input validation, security headers
4. **Data Layer** - Password hashing, SQL injection prevention, data retention
5. **Monitoring Layer** - Error tracking with Sentry, analytics with privacy controls

---

## Authentication Security

### JWT Token Management

**Implementation:** `backend/src/controllers/authController.ts`

**Token Configuration:**
- **Algorithm:** HS256
- **Expiration:** 5 minutes (configurable via `JWT_EXPIRES_IN`)
- **Secret:** Stored in `JWT_SECRET` environment variable
- **Payload:** User ID, email, role

**Security Features:**
- Tokens are signed with strong secret key
- Short expiration window (5 minutes) reduces token exposure risk
- Stateless design - no server-side session storage
- Token verification on every protected request

**Environment Variables:**
```bash
JWT_SECRET=<strong_random_string_32+_chars>
JWT_EXPIRES_IN=5m
```

### Password Security

**Implementation:** `backend/src/controllers/authController.ts`

**Hashing:**
- **Algorithm:** bcrypt
- **Salt Rounds:** 12
- **Library:** bcryptjs

**Password Reset:**
- Single-use tokens (30-minute expiration)
- SHA-256 hashed before storage
- Generic success messages prevent email enumeration
- Tokens cleared after successful reset

### Role-Based Authorization

**Implementation:** `backend/src/middleware/authorize.ts`

**Features:**
- Case-insensitive role comparison
- Middleware-based enforcement
- Route-level and resource-level authorization
- Admin bypass for ownership checks

**Roles:**
- `admin` - Full system access
- `agent` - Manage assigned properties
- `property_manager` - Property oversight
- `content_editor` - Content management
- `user` - Public access

---

## Rate Limiting

### Implementation

**Location:** `backend/src/middleware/rateLimiter.ts`

**Rate Limiters:**

1. **API Rate Limiter** - Applied to all `/api/v1` routes
   - Window: 15 minutes
   - Limit: 100 requests per IP
   - Headers: RateLimit-* headers included

2. **Auth Rate Limiter** - Applied to authentication endpoints
   - Window: 15 minutes
   - Limit: 5 requests per IP
   - Prevents brute force attacks

3. **Contact Rate Limiter** - Applied to contact/inquiry forms
   - Window: 1 hour
   - Limit: 3 requests per IP
   - Prevents spam submissions

4. **Search Rate Limiter** - Applied to search endpoints
   - Window: 1 minute
   - Limit: 30 requests per IP
   - Prevents search abuse

**Configuration:**
```typescript
import { apiRateLimiter, authRateLimiter, contactRateLimiter, searchRateLimiter } from './middleware/rateLimiter.js';

app.use('/api/v1', apiRateLimiter);
router.post('/login', authRateLimiter, login);
router.post('/', contactRateLimiter, createContactMessage);
router.get('/', searchRateLimiter, getPropertySearches);
```

**Response on Limit Exceeded:**
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Security Headers

### Implementation

**Location:** `backend/src/app.ts`

**Helmet Middleware:**
```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "https://unpkg.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://ingata-backend.onrender.com", "http://localhost:5000"],
    },
  },
  crossOriginEmbedderPolicy: false, // Needed for Leaflet maps
}));
```

**Security Headers Provided:**
- **Content-Security-Policy** - Restricts resource loading
- **X-Content-Type-Options** - Prevents MIME sniffing
- **X-Frame-Options** - Prevents clickjacking
- **X-XSS-Protection** - XSS protection
- **Strict-Transport-Security** - HTTPS enforcement (production)
- **Referrer-Policy** - Controls referrer information

**Map Integration Security:**
- **Implementation:** Leaflet maps (frontend component)
- **Location:** `frontend/src/components/map/PropertyMap.tsx`
- **Tile Provider:** OpenStreetMap (free, no API key required)
- **CSP Configuration:** Allows `https://unpkg.com` for Leaflet CSS/JS
- **crossOriginEmbedderPolicy:** Disabled to allow map tiles
- **No API Keys:** Eliminates risk of exposed secrets

---

## CSRF Protection

### Implementation

**Location:** `backend/src/middleware/csrf.ts`

**Status:** Disabled for JWT-based API architecture

**Rationale:**
- JWT tokens are sent in `Authorization` header
- Browsers don't automatically include Authorization headers with requests
- This inherently protects against CSRF attacks
- Traditional CSRF protection (cookie-based) is not needed

**CSRF Middleware Available:**
- `csrfProtection` - Token verification (disabled)
- `generateCsrfToken` - Token generation (disabled)

**Future Use:**
If cookie-based authentication is added, CSRF protection can be enabled by:
1. Uncommenting middleware in `app.ts`
2. Implementing token generation/verification
3. Adding CSRF tokens to forms

---

## Data Protection

### SQL Injection Prevention

**Implementation:** TypeORM ORM

**Protection:**
- Parameterized queries automatically
- Type-safe entity operations
- No raw SQL queries in production code
- Migration system for schema changes

### XSS Prevention

**Implementation:** React (frontend)

**Protection:**
- Automatic escaping of JSX content
- `dangerouslySetInnerHTML` used sparingly (only for trusted content)
- User input always escaped by default

### Sensitive Data Protection

**Password Reset Tokens:**
- Never stored in plain text
- SHA-256 hashed before database storage
- Single-use only
- Short expiration (30 minutes)

**JWT Secrets:**
- Never committed to version control
- Environment variable only
- Different secrets for dev/prod

**API Keys:**
- Never exposed in client code
- Server-side only
- Environment variable configuration

---

## Analytics Security

### Privacy Controls

**Implementation:** `backend/src/controllers/analyticsController.ts`

**Privacy Features:**
- IP addresses captured but not displayed publicly
- User tracking respects authentication (userId only if logged in)
- No personal information beyond voluntary user input
- Tracking failures are silent (don't break UX)

### Data Retention

**Implementation:** `backend/src/services/scheduledTasks.ts`

**Automated Cleanup:**
- Schedule: Daily at 2:00 AM UTC
- Retention: Configurable via `analyticsRetentionDays` (default: 365 days)
- Scope: PageView, PropertyView, ClickEvent records
- Control: `ENABLE_SCHEDULED_TASKS` environment variable

**Manual Cleanup:**
- `POST /admin/analytics/cleanup` - Immediate cleanup
- `GET /admin/analytics/retention-status` - View cleanup status

---

## Session Management

### JWT Token Expiration

**Backend:** 5 minutes (configurable via `JWT_EXPIRES_IN`)

**Frontend Inactivity Logout:**
- **Implementation:** `frontend/src/hooks/useInactivityLogout.ts`
- **Timeout:** 5 minutes of inactivity
- **Warning:** Shown at 3 minutes with 2-minute countdown
- **Cross-tab sync:** Activity in one tab resets timer in all tabs
- **Auto-logout:** Redirects to login with session expired message

**Session Flow:**
1. User logs in → JWT token issued (5 min expiry)
2. User remains active → Frontend tracks activity
3. User inactive for 3 min → Warning shown
4. User inactive for 5 min → Auto-logout
5. User logs out → Token discarded from localStorage

---

## Error Tracking

### Sentry Integration

**Implementation:** `backend/src/config/sentry.ts`

**Features:**
- Error tracking in production
- Sensitive data filtering (authorization, cookie headers)
- Environment-based configuration
- Manual exception/message capture

**Configuration:**
```bash
SENTRY_DSN=<your_sentry_dsn>
```

**Sensitive Data Filtering:**
```typescript
beforeSend(event, hint) {
  if (event.request?.headers) {
    delete event.request.headers['authorization'];
    delete event.request.headers['cookie'];
  }
  return event;
}
```

---

## Security Checklist

### Before Production Deployment

#### Authentication
- [ ] Set strong `JWT_SECRET` (32+ random characters)
- [ ] Configure `JWT_EXPIRES_IN=5m`
- [ ] Verify password hashing (bcrypt, 12 rounds)
- [ ] Test password reset flow
- [ ] Verify role-based authorization
- [ ] Test inactivity logout

#### Network Security
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Verify security headers (Helmet)
- [ ] Test rate limiting

#### Data Protection
- [ ] Verify SQL injection prevention (TypeORM)
- [ ] Test XSS prevention (React)
- [ ] Configure analytics data retention
- [ ] Enable scheduled tasks for cleanup
- [ ] Set `ENABLE_SCHEDULED_TASKS=true`

#### Monitoring
- [ ] Configure Sentry DSN
- [ ] Verify error tracking
- [ ] Set up log monitoring
- [ ] Configure alerts

#### Secrets Management
- [ ] Never commit `.env` files
- [ ] Use environment variables for secrets
- [ ] Rotate secrets periodically
- [ ] Review exposed secrets

### Regular Security Maintenance

- [ ] Review and update dependencies
- [ ] Audit access logs
- [ ] Review analytics data cleanup
- [ ] Test backup and recovery
- [ ] Review user access and roles
- [ ] Update security documentation

---

## Security Best Practices

### Development
- Use weak secrets only for local development
- Never commit secrets to version control
- Keep dependencies updated
- Use `.env.example` for documentation

### Production
- Use strong, randomly generated secrets
- Enable all security features
- Monitor logs for suspicious activity
- Regular security audits
- Keep software updated

### Code Review
- Check for hardcoded secrets
- Verify input validation
- Review SQL queries for injection risks
- Check for XSS vulnerabilities
- Verify authorization on all protected routes

---

## Incident Response

### Security Incident Steps

1. **Identify** - Determine scope and impact
2. **Contain** - Isolate affected systems
3. **Eradicate** - Remove vulnerability
4. **Recover** - Restore from clean backups
5. **Lessons Learned** - Document and improve

### Contact Information

For security issues, contact:
- Security Team: security@ingata.com
- Emergency Response: 24/7 monitoring

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
