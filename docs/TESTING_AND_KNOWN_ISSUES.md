# Testing and Known Issues

**Last Updated:** October 27, 2026

---

## Testing Status

### Frontend Testing

**Status:** ✅ Working  
**Test Framework:** Jest  
**Test Files:** 6  
**Total Tests:** 32  
**Passing:** 32  
**Failing:** 0

**Test Coverage:**
- Inactivity logout hook
- Session redirect logic
- UI components (Button)
- Consent management
- Some legacy pages

**Test Files:**
- `src/hooks/__tests__/useInactivityLogout.test.ts`
- `src/services/__tests__/sessionRedirect.test.ts`
- `src/components/ui/__tests__/Button.test.tsx`
- `src/components/consent/__tests__/ConsentManager.test.tsx`
- `src/legacy-pages/Admin/Articles/NewArticle/__tests__/NewArticle.test.tsx`
- `src/legacy-pages/Insights/Articles/__tests__/Articles.test.tsx`

**Running Tests:**
```bash
cd frontend
npm test
```

**Test Configuration:**
- `jest.config.js` - Jest configuration
- TypeScript via ts-jest
- jsdom environment for DOM testing
- Testing Library for React components

### Backend Testing

**Status:** ⚠️ Broken  
**Test Framework:** Jest  
**Test Files:** 3  
**Total Tests:** 0 (cannot run)

**Issue:** ESM syntax error prevents test execution

**Test Files:**
- `src/__tests__/app.test.ts`
- `src/__tests__/articleController.test.ts`
- `src/__tests__/auth.test.ts`

**Error:**
```
Must use import to load ES Module: D:\realestateweb\backend\src\__tests__\app.test.ts
```

**Root Cause:**
- Package.json has `"type": "module"` (ESM)
- Jest configured but not handling ESM properly
- Missing Babel transformation for ESM modules

**Running Tests (currently fails):**
```bash
cd backend
npm test
```

**Expected Output (currently):**
```
Test Suites: 3 failed, 3 total
Tests:       0 total
```

**Fix Required:**
1. Configure Jest to handle ESM modules
2. Add Babel transformation
3. Update jest.config.js for ESM support
4. Or use ts-jest with ESM preset

### Integration Testing

**Status:** ❌ Not Implemented

No integration tests currently exist. Recommended tools:
- Supertest (already installed)
- Jest for test runner
- Test database setup/teardown

### E2E Testing

**Status:** ❌ Not Implemented

No end-to-end tests currently exist. Recommended tools:
- Playwright
- Cypress
- Puppeteer

---

## Known Issues

### Critical Issues

#### 1. Backend Tests Broken (ESM Configuration)

**Severity:** High  
**Status:** Broken  
**Impact:** Cannot run backend tests, no automated backend testing

**Description:**
Backend has 3 test files but cannot execute due to ESM syntax error. Jest is not configured to handle TypeScript ESM modules properly.

**Current Behavior:**
```bash
npm test
# Output: "Must use import to load ES Module"
```

**Required Fix:**
1. Update jest.config.js to handle ESM:
```javascript
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
};
```

2. Update package.json scripts if needed
3. Ensure ts-jest is configured for ESM
4. Test with `npm test`

**Estimated Effort:** 1-2 hours

---

### Medium Priority Issues

#### 2. Legacy Page Migration (Completed)

**Severity:** N/A  
**Status:** ✅ Complete  
**Impact:** Resolved

**Description:**
Legacy page migration to Next.js App Router has been completed. All pages are now in the `app/` directory structure.

**Current State:**
- ✅ All 91+ pages migrated to App Router
- ✅ No `src/legacy-pages` directory exists
- ✅ All core sections migrated:
  - About section (5 pages)
  - Admin section (35+ pages)
  - Properties section (13 pages)
  - Services section (2 pages)
  - Legal section (4 pages)
  - Portal section (5 pages)
  - Plus 30+ additional pages

**Progress:** 100% complete

**Estimated Effort:** Completed

---

#### 3. No Refresh Token Implementation

**Severity:** Medium  
**Status:** Not Implemented  
**Impact:** Users must re-authenticate every 5 minutes

**Description:**
JWT tokens expire after 5 minutes with no refresh token mechanism. Users must re-login frequently, affecting user experience.

**Current Behavior:**
- Token expires after 5 minutes
- Auto-logout with 3-minute warning
- User must re-login
- No seamless token refresh

**Recommended Solution:**
1. Implement refresh token mechanism
2. Store refresh token in HTTP-only cookie
3. Add `/auth/refresh-token` endpoint
4. Update frontend to use refresh token
5. Extend access token duration (e.g., 15 minutes)
6. Refresh token longer duration (e.g., 7 days)

**Estimated Effort:** 8-12 hours

---

#### 4. Google Maps API Key Placeholder

**Severity:** Low  
**Status:** Not Used  
**Impact:** Placeholder exists but not used (Leaflet implemented instead)

**Description:**
`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable placeholder exists but Google Maps is not implemented. The platform uses Leaflet + OpenStreetMap instead.

**Current State:**
- Leaflet maps implemented and working
- Google Maps placeholder in .env
- No Google Maps code in application

**Recommended Action:**
- Remove Google Maps placeholder if not planning to use it
- Or implement Google Maps if preferred over Leaflet

**Estimated Effort:** 0.5 hours (to remove placeholder)

---

#### 5. Swagger Dependencies Not Used

**Severity:** Low  
**Status:** Not Used  
**Impact:** Extra dependencies, no API documentation

**Description:**
`swagger-jsdoc` and `swagger-ui-express` are installed but not used in the application. No API documentation interface exists.

**Current State:**
- Dependencies in package.json
- No swagger configuration
- No swagger UI endpoint
- No API documentation

**Recommended Action:**
- Implement Swagger/OpenAPI documentation, OR
- Remove unused dependencies

**Estimated Effort:** 
- Implement: 10-15 hours
- Remove: 0.5 hours

---

### Low Priority Issues

#### 6. Social Media Links Placeholders

**Severity:** Low  
**Status:** Placeholders  
**Impact:** Footer social links point to placeholder URLs

**Description:**
Social media links in footer use placeholder URLs (facebook.com, twitter.com, etc.) instead of actual brand URLs.

**Current State:**
- Footer has social media icons
- Links go to generic domain names
- No actual social media accounts configured

**Recommended Action:**
- Update with actual social media URLs
- Or remove social media section if not used

**Estimated Effort:** 0.5 hours

---

#### 7. No Automated Email Testing

**Severity:** Low  
**Status:** Not Implemented  
**Impact:** Email functionality not tested in CI/CD

**Description:**
Password reset and contact reply emails use Brevo SMTP but are not tested automatically. No email testing in test suite.

**Recommended Solution:**
1. Use email testing service (Mailtrap, Mailhog)
2. Mock email service in tests
3. Add email sending tests
4. Verify email content in tests

**Estimated Effort:** 4-6 hours

---

#### 8. No Database Backup Strategy in Code

**Severity:** Low  
**Status:** Not Implemented  
**Impact:** No automated backup process in application

**Description:**
Database backups rely on provider (Render/Neon) automatic backups. No custom backup strategy in application code.

**Current State:**
- Render provides daily backups (7-day retention)
- Neon provides point-in-time recovery
- No custom backup scripts
- No backup verification

**Recommended Action:**
- Document provider backup strategy
- Consider custom backup scripts for critical data
- Implement backup verification

**Estimated Effort:** 2-4 hours (documentation), 8-12 hours (custom backups)

---

## Performance Issues

### None Currently Reported

No significant performance issues have been reported. The application performs well with:
- Efficient database queries
- Proper indexing
- Image optimization (Next.js)
- No unnecessary re-renders

**Potential Optimizations:**
- Add Redis caching for frequently accessed data
- Implement database read replicas
- Add CDN for static assets
- Optimize large images

---

## Security Issues

### No Critical Security Issues

Security implementation is solid:
- JWT authentication
- Password hashing with bcrypt
- Rate limiting implemented
- CORS configured
- Helmet security headers
- Input validation
- SQL injection prevention via TypeORM

**Recommended Security Enhancements:**
- Implement refresh tokens (reduces token exposure)
- Add password complexity requirements
- Implement account lockout after failed attempts
- Add email verification for registration
- Implement 2FA for sensitive accounts

---

## Browser Compatibility

### Tested Browsers

**Desktop:**
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

**Mobile:**
- ✅ iOS Safari (latest)
- ✅ Chrome Mobile (latest)

**Known Issues:**
- None reported

**Polyfills Used:**
- None required (modern browser support)

---

## Deployment Issues

### None Currently Reported

Deployment is stable:
- Frontend on Vercel: ✅ Working
- Backend on Render: ✅ Working
- Auto-deploy on git push: ✅ Working
- Environment variables: ✅ Configured
- Database migrations: ✅ Manual execution required

**Known Deployment Considerations:**
- Backend migrations must be run manually after deployment
- Free tier services have limitations (spin-down, etc.)
- Email configuration required for password reset

---

## Data Quality Issues

### None Currently Reported

Data quality is good:
- Database schema is normalized
- Foreign key constraints enforce referential integrity
- Unique constraints prevent duplicates
- Input validation on all endpoints

**Recommended Data Quality Measures:**
- Add data validation cron jobs
- Implement data cleanup tasks
- Monitor for orphaned records
- Regular data integrity checks

---

## Accessibility Issues

### Partially Implemented

**Implemented:**
- Semantic HTML
- Alt text on images (some)
- Keyboard navigation support

**Needs Improvement:**
- ARIA labels on interactive elements
- Focus management in modals
- Screen reader testing
- Color contrast verification
- Skip navigation links

**Estimated Effort:** 8-12 hours for full WCAG 2.1 AA compliance

---

## API Versioning

### No API Versioning Strategy

**Current State:**
- All routes under `/api/v1`
- No version management
- No deprecation policy
- No backward compatibility guarantees

**Recommended Strategy:**
1. Document current API as v1
2. Add version negotiation
3. Implement deprecation headers
4. Support multiple versions during transition
5. Plan for v2 when breaking changes needed

**Estimated Effort:** 4-6 hours

---

## Monitoring and Observability

### Partially Implemented

**Implemented:**
- Sentry error tracking
- Console logging
- Health check endpoint
- Custom analytics tracking

**Missing:**
- APM (Application Performance Monitoring)
- Request latency metrics
- Database query performance monitoring
- Uptime monitoring
- Alerting system
- Centralized logging

**Recommended Tools:**
- New Relic, Datadog, or similar for APM
- Prometheus for metrics
- Grafana for visualization
- UptimeRobot or Pingdom for uptime
- LogRocket or Papertrail for logs

**Estimated Effort:** 16-24 hours for full implementation

---

## Third-Party Dependencies

### Dependencies Status

**Actively Used:**
- Next.js 15 ✅
- React 19 ✅
- Express.js ✅
- TypeORM ✅
- PostgreSQL (pg) ✅
- JWT (jsonwebtoken) ✅
- bcryptjs ✅
- Nodemailer ✅
- Leaflet ✅
- Sentry ✅
- Supabase (storage) ✅

**Installed but Not Used:**
- swagger-jsdoc ⚠️
- swagger-ui-express ⚠️

**Recommended Action:**
- Remove unused Swagger dependencies OR implement API documentation

---

## Localization/Internationalization

### Not Implemented

**Current State:**
- English only
- No multi-language support
- No date/time localization
- No currency formatting beyond RWF

**Future Consideration:**
- Add i18n support (next-i18next)
- Support Kinyarwanda, French, English
- Localize date/time formats
- Localize currency display

**Estimated Effort:** 20-30 hours for initial implementation

---

## Mobile Responsiveness

### Fully Implemented

**Status:** ✅ Working

All pages are responsive:
- Mobile-first design
- Tailwind responsive classes
- Tested on mobile devices
- No horizontal scrolling issues
- Touch-friendly UI elements

---

## SEO Implementation

### Fully Implemented

**Status:** ✅ Working

**Implemented:**
- Dynamic meta tags
- OpenGraph tags
- Twitter card tags
- Sitemap generation
- Robots.txt
- Canonical URLs
- Structured data (partial)

**Needs Improvement:**
- Complete structured data implementation
- Add schema.org markup for properties
- Verify sitemap is submitted to search engines
- Add robots.txt verification

**Estimated Effort:** 4-6 hours

---

## Documentation Gaps

### Previously Outdated

**Status:** ✅ Fixed

All documentation has been updated in this audit:
- ✅ PROJECT_OVERVIEW.md
- ✅ ARCHITECTURE.md
- ✅ INSTALLATION_AND_SETUP.md
- ✅ DATABASE_SCHEMA.md
- ✅ API_REFERENCE.md
- ✅ AUTHENTICATION_AND_PERMISSIONS.md
- ✅ USER_ROLES_AND_FEATURES.md
- ✅ TESTING_AND_KNOWN_ISSUES.md (this file)
- ✅ DEPLOYMENT.md
- ✅ README.md (root)
- ✅ backend/README.md
- ✅ frontend/README.md
- ✅ CHANGELOG.md (newly created)

---

## Issue Resolution Priorities

### High Priority (Fix Immediately)
1. **Backend Tests Broken** - Fix ESM configuration to enable testing

### Medium Priority (Fix Soon)
2. **Legacy Page Migration** - Continue migration to App Router
3. **Refresh Token Implementation** - Improve user experience

### Low Priority (Fix When Time Permits)
4. **Remove Unused Dependencies** - Swagger packages
5. **Update Social Media Links** - Replace placeholders
6. **Add Automated Email Testing** - Test email functionality
7. **Document Backup Strategy** - Create backup documentation

---

## Testing Recommendations

### Immediate Actions

1. **Fix Backend Tests**
   - Configure Jest for ESM
   - Run all backend tests
   - Aim for 80%+ code coverage

2. **Add Integration Tests**
   - Test API endpoints
   - Test database operations
   - Test authentication flow

3. **Add E2E Tests**
   - Test critical user flows
   - Test authentication
   - Test property search
   - Test inquiry submission

### Long-Term Testing Strategy

1. **Test Coverage Goals**
   - Unit tests: 80%+ coverage
   - Integration tests: All API endpoints
   - E2E tests: Critical user flows

2. **CI/CD Integration**
   - Run tests on every commit
   - Block deployments on test failures
   - Generate coverage reports

3. **Performance Testing**
   - Load testing with k6 or Artillery
   - Database query performance
   - API response time monitoring

---

## Troubleshooting Common Issues

### Backend Won't Start

**Symptoms:** Server fails to start or crashes immediately

**Solutions:**
1. Check DATABASE_URL is correct
2. Verify environment variables are set
3. Check port is not already in use
4. Run `npm run build` to check for compilation errors
5. Check database connection is available

### Frontend Build Fails

**Symptoms:** Next.js build fails with errors

**Solutions:**
1. Check TypeScript errors: `npm run typecheck`
2. Verify all dependencies installed
3. Check environment variables
4. Clear Next.js cache: `rm -rf .next`
5. Check for circular dependencies

### Database Migration Fails

**Symptoms:** Migration fails with error

**Solutions:**
1. Use DATABASE_URL_UNPOOLED for migrations
2. Check if tables already exist
3. Verify database user has CREATE TABLE permissions
4. Check migration logs for specific error
5. Consider running ResetDatabaseSchema migration if starting fresh

### Email Not Sending

**Symptoms:** Password reset emails not delivered

**Solutions:**
1. Verify Brevo SMTP credentials
2. Check EMAIL_HOST and EMAIL_PORT
3. Verify EMAIL_FROM is verified sender
4. Check Brevo API key permissions
5. Test SMTP connection separately
6. Check if emails go to spam folder

### Images Not Uploading

**Symptoms:** Media upload fails

**Solutions:**
1. Verify Supabase environment variables
2. Check SUPABASE_URL and SUPABASE_SECRET_KEY
3. Verify bucket exists in Supabase
4. Check file size (< 100MB)
5. Check file type (allowed types only)
6. Verify bucket permissions

---

## Changelog - Testing & Issues

### October 27, 2026
- ✅ Conducted comprehensive testing audit
- ✅ Documented all known issues
- ✅ Fixed outdated documentation
- ✅ Resolved Next.js production build errors
  - Fixed PropertySearch.tsx syntax error (character encoding issue)
  - Fixed import path in terms-and-conditions page
  - Replaced missing LegacyAdminRoute with redirect
  - Fixed AdminDashboard Link components (to= to href=)
  - Fixed PropertyDetails ImageViewer props
  - Added Suspense boundaries for useSearchParams usage
  - Fixed useSearchParams type conflicts
- ⚠️ Identified backend test configuration issue
- ⚠️ Documented legacy page migration status
