# Testing and Known Issues

**Last Updated:** October 22, 2026

---

## Table of Contents
1. [Testing Status](#testing-status)
2. [Manual Testing Guidelines](#manual-testing-guidelines)
3. [Test Coverage](#test-coverage)
4. [Known Issues](#known-issues)
5. [Inconsistencies](#inconsistencies)
6. [Unfinished Features](#unfinished-features)
7. [Security Considerations](#security-considerations)
8. [Performance Issues](#performance-issues)
9. [Troubleshooting Guide](#troubleshooting-guide)

---

## Testing Status

### Current State

**Automated Testing:** ✅ Infrastructure Set Up  
**Manual Testing:** Required per AGENT.md  
**Test Configuration:** ✅ Configured  
**CI/CD Testing:** Not configured

### Test Infrastructure

#### Backend Testing (Jest + Supertest)

**Configuration:** `backend/jest.config.js`

**Test Dependencies:**
- jest ^30.5.2
- @types/jest ^30.0.0
- ts-jest ^29.4.15
- supertest ^7.3.1
- @types/supertest ^7.2.1

**Test Scripts:**
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

**Test Files:**
- `backend/src/__tests__/app.test.ts` - API health check tests
- `backend/src/__tests__/auth.test.ts` - Authentication tests
- `backend/src/__tests__/articleController.test.ts` - Article controller tests

**Configuration:**
- Preset: ts-jest
- Test Environment: node
- Test Match: `**/__tests__/**/*.ts`, `**/?(*.)+(spec|test).ts`
- Coverage: Excludes types, scripts, and migrations
- Timeout: 10 seconds

#### Frontend Testing (Jest + React Testing Library)

**Configuration:** `frontend/jest.config.js`

**Test Dependencies:**
- jest ^30.5.2
- @jest/globals ^30.5.2
- @jest/transform ^30.5.2
- @testing-library/jest-dom ^7.0.1
- @testing-library/react ^16.3.3
- @types/jest ^30.0.0
- jest-environment-jsdom ^30.5.2
- babel-jest ^30.5.2

**Test Scripts:**
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

**Test Files:**
- `frontend/src/components/ui/__tests__/Button.test.tsx` - Button component tests
- `frontend/src/components/consent/__tests__/ConsentManager.test.tsx` - Consent manager tests

**Configuration:**
- Test Environment: jest-environment-jsdom
- Setup File: jest.setup.js (imports @testing-library/jest-dom)
- Module Mapper: `@/*` → `<rootDir>/src/$1`
- Test Match: `**/__tests__/**/*.[jt]s?(x)`, `**/?(*.)+(spec|test).[jt]s?(x)`
- Transform: babel-jest with next/babel preset
- Coverage: Excludes types, stories, and test files

#### E2E Testing (Playwright)

**Configuration:** `playwright.config.ts`

**Test Scripts:**
```bash
npx playwright test        # Run all E2E tests
npx playwright test --ui   # Run tests with UI
npx playwright test --headed # Run tests in headed mode
```

**Test Files:**
- `e2e/example.spec.ts` - Basic E2E tests (homepage, properties page, navigation)
- `frontend/src/legacy-pages/Admin/Articles/NewArticle/__tests__/NewArticle.test.tsx` - New article component tests
- `frontend/src/legacy-pages/Insights/Articles/__tests__/Articles.test.tsx` - Articles component tests

**Configuration:**
- Test Directory: ./e2e
- Base URL: http://localhost:3000
- Parallel Execution: Yes
- Browsers: Chromium, Firefox, WebKit (Desktop)
- Reporter: HTML
- Trace: on-first-retry
- Dev Server: Commented out (can be enabled for automated server startup)

### Test Coverage

**Current Test Coverage:**
- Backend: API health checks, authentication, article controller
- Frontend: Button component, Consent manager, New article component, Articles component
- E2E: Homepage, properties page, navigation

**Test Priority Areas Still Needing Tests:**
1. Authentication flows (login, logout, password reset)
2. Authorization middleware
3. All API endpoints beyond health check
4. Database operations
5. Email functionality
6. Frontend components beyond Button
7. Form submissions
8. Error handling
9. User flows (property search, contact, favorites, etc.)

---

## Running Tests

### Backend Tests

Navigate to the backend directory:
```bash
cd backend
```

Run all tests:
```bash
npm test
```

Run tests in watch mode (for development):
```bash
npm run test:watch
```

Run tests with coverage report:
```bash
npm run test:coverage
```

### Frontend Tests

Navigate to the frontend directory:
```bash
cd frontend
```

Run all tests:
```bash
npm test
```

Run tests in watch mode (for development):
```bash
npm run test:watch
```

Run tests with coverage report:
```bash
npm run test:coverage
```

### E2E Tests

Ensure the frontend dev server is running on http://localhost:3000:
```bash
cd frontend
npm run dev
```

In a separate terminal, run E2E tests:
```bash
npx playwright test
```

Run E2E tests with UI (for debugging):
```bash
npx playwright test --ui
```

Run E2E tests in headed mode (shows browser):
```bash
npx playwright test --headed
```

Run E2E tests for a specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

View E2E test report:
```bash
npx playwright show-report
```

### Running All Tests

To run all tests (backend, frontend, and E2E), you can use a script in the root directory if created, or run them separately in each directory.

---

## Manual Testing Guidelines

### Per AGENT.md Rules

Before declaring a task complete:
1. Test the changed functionality
2. Check for console errors
3. Check for build errors
4. Check affected existing functionality
5. Test responsive behavior when UI was changed
6. Fix errors caused by implementation

### Testing Checklist

#### Backend Changes
- [ ] API endpoint returns correct response
- [ ] Error handling works correctly
- [ ] Database operations succeed
- [ ] Authentication/authorization enforced
- [ ] Input validation works
- [ ] Console shows no errors
- [ ] Database schema matches entities

#### Frontend Changes
- [ ] Page renders without errors
- [ ] Forms submit correctly
- [ ] API calls succeed
- [ ] Error messages display correctly
- [ ] Loading states work
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Browser console shows no errors
- [ ] Build succeeds without errors

#### Database Changes
- [ ] Migration runs successfully
- [ ] Seed data loads correctly
- [ ] Entity relationships work
- [ ] Queries return expected results
- [ ] Indexes are created
- [ ] Foreign keys enforce constraints

### Browser Testing

**Recommended Browsers:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Responsive Breakpoints:**
- Mobile: 375px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

---

## Test Coverage

### Currently Tested Areas

**Backend:**
- ✅ API health check endpoint (`/`)
- ✅ Authentication tests (basic)
- ✅ 404 error handling

**Frontend:**
- ✅ Button component (variants, loading state, disabled state, className)

**E2E:**
- ✅ Homepage title and navigation
- ✅ Properties page loading
- ✅ Navigation to contact page

### Currently Untested Areas

**Backend:**
- ❌ Most API endpoints beyond health check
- ❌ Authentication flows (login, logout, password reset)
- ❌ Authorization middleware
- ❌ Database operations
- ❌ Email functionality
- ❌ File uploads
- ❌ Error handling (beyond 404)
- ❌ Validation logic
- ❌ Property CRUD operations
- ❌ Inquiry handling
- ❌ Analytics endpoints

**Frontend:**
- ❌ Most components (only Button tested)
- ❌ All pages
- ❌ API integration
- ❌ Authentication context
- ❌ Form submissions
- ❌ Responsive layouts
- ❌ Error boundaries
- ❌ Loading states
- ❌ Property search functionality
- ❌ Favorites functionality
- ❌ Agent dashboard
- ❌ Admin pages

**Integration:**
- ❌ End-to-end user flows
- ❌ API-client communication
- ❌ Authentication flows
- ❌ Data persistence
- ❌ Property listing to details flow
- ❌ Contact form submission
- ❌ Favorites management

### Recommended Test Priority

**High Priority:**
1. Authentication flows (login, logout, password reset)
2. Authorization middleware
3. Critical API endpoints (login, property CRUD)
4. Database operations
5. Email functionality
6. Frontend authentication context
7. Property search and filtering

**Medium Priority:**
1. All API endpoints
2. Frontend components (PropertyCard, PropertyFilters, etc.)
3. Form validation
4. Error handling
5. Admin pages
6. Agent dashboard
7. Contact form

**Low Priority:**
1. UI components (non-critical)
2. Static pages
3. Analytics tracking
4. Decorative components

---

## Known Issues

### Critical Issues

#### 1. Media Upload Storage Not Implemented

**Status:** ⚠️ Partially Implemented  
**Severity:** High  
**Impact:** Feature non-functional

**Description:**
- Multer is configured in backend
- Storage provider not implemented (no S3, Cloudinary, or local storage)
- Files may not persist after upload
- Upload endpoints exist but may fail

**Evidence:**
- `backend/package.json` includes `multer: ^2.4.0`
- Upload endpoints exist: `/admin/properties/media`, `/agent-dashboard/property-media`, `/property-manager/media`
- No storage provider configuration found in code

**Recommended Next Steps:**
1. Choose storage provider (S3, Cloudinary, or local filesystem)
2. Configure Multer storage
3. Implement file upload logic
4. Test upload functionality
5. Add error handling for upload failures

**Code Locations:**
- Backend controllers with file upload
- Need to add storage configuration in `backend/src/config/`

---

#### 2. Limited Test Coverage

**Status:** ⚠️ Partially Implemented  
**Severity:** Medium  
**Impact:** Quality assurance risk for untested areas

**Description:**
- Testing infrastructure is set up (Jest for backend/frontend, Playwright for E2E)
- Basic tests exist (API health check, Button component, E2E smoke tests)
- Critical functionality lacks comprehensive test coverage
- No CI/CD testing pipeline

**Evidence:**
- Backend tests: `backend/src/__tests__/app.test.ts`, `auth.test.ts`
- Frontend tests: `frontend/src/components/ui/__tests__/Button.test.tsx`
- E2E tests: `e2e/example.spec.ts`
- No GitHub Actions or CI configuration

**Recommended Next Steps:**
1. Write tests for authentication flows (login, logout, password reset)
2. Write tests for authorization middleware
3. Write tests for all API endpoints
4. Write tests for database operations
5. Write tests for email functionality
6. Write tests for frontend components and pages
7. Write tests for form submissions
8. Write tests for error handling
9. Write E2E tests for critical user flows
10. Configure CI/CD pipeline with automated testing

**Code Locations:**
- Add tests to `backend/src/__tests__/`
- Add tests to `frontend/src/**/__tests__/`
- Add E2E tests to `e2e/`

---

#### 3. No Deployment Configuration

**Status:** ❌ Not Implemented  
**Severity:** High  
**Impact:** Production deployment manual and error-prone

**Description:**
- No Dockerfile
- No docker-compose.yml
- No CI/CD configuration
- No deployment scripts
- No production environment documentation

**Evidence:**
- Search for `Dockerfile`, `docker-compose.yml` returned no results
- No `.github/workflows/` directory
- No `.gitlab-ci.yml` or similar
- No deployment scripts in project

**Recommended Next Steps:**
1. Create Dockerfile for backend
2. Create Dockerfile for frontend
3. Create docker-compose.yml for local development
4. Set up CI/CD pipeline (GitHub Actions or GitLab CI)
5. Create deployment documentation
6. Add environment-specific configuration

**Code Locations:**
- Need to create `Dockerfile` in root
- Need to create `docker-compose.yml` in root
- Need to create `.github/workflows/` directory

---

### Medium Priority Issues

#### 4. Analytics Data Cleanup Job ✅ RESOLVED

**Status:** ✅ Complete  
**Severity:** N/A  
**Impact:** None

**Description:**
- Automated cleanup job implemented using node-cron
- Respects `analytics_retention_days` from site settings (default: 365 days)
- Daily cleanup at 2:00 AM UTC
- Manual cleanup endpoint available

**Evidence:**
- `backend/src/services/scheduledTasks.ts` - automated cleanup service
- `node-cron` package added to dependencies
- `ENABLE_SCHEDULED_TASKS` environment variable added
- Manual cleanup: `POST /admin/analytics/cleanup`
- Retention status: `GET /admin/analytics/retention-status`

**Resolution:**
- Implemented on October 22, 2026
- No action required

---

#### 5. Property Features UI Not Implemented

**Status:** ⚠️ Partially Implemented  
**Severity:** Medium  
**Impact:** Cannot manage property features via UI

**Description:**
- `property_features` and `property_feature_links` tables exist
- Database schema supports property features
- No admin UI for managing features
- Features may need to be managed via database directly

**Evidence:**
- Entities: `PropertyFeature.ts`, `PropertyFeatureLink.ts` exist
- Database tables created in migration
- No frontend components for feature management found
- No admin routes for feature management

**Recommended Next Steps:**
1. Create admin UI for feature management
2. Add API endpoints for feature CRUD
3. Integrate feature selection in property form
4. Add feature display in property details
5. Test feature management end-to-end

**Code Locations:**
- Need to create `frontend/src/legacy-pages/Admin/Features/`
- Need to add routes in `backend/src/routes/adminFeatureRoutes.ts`

---

#### 6. Development Management UI Not Implemented

**Status:** ⚠️ Partially Implemented  
**Severity:** Medium  
**Impact:** Cannot manage developments via UI

**Description:**
- `developments` table exists in database
- Development entity exists
- No admin UI for managing developments
- Developments may need to be managed via database directly

**Evidence:**
- Entity: `Development.ts` exists
- Database table created in migration
- No frontend components for development management
- No admin routes for development management

**Recommended Next Steps:**
1. Create admin UI for development management
2. Add API endpoints for development CRUD
3. Integrate development selection in property form
4. Add development display in property details
5. Test development management end-to-end

**Code Locations:**
- Need to create `frontend/src/legacy-pages/Admin/Developments/`
- Need to add routes in `backend/src/routes/adminDevelopmentRoutes.ts`

---

#### 7. Maps Integration ✅ RESOLVED

**Status:** ✅ Complete  
**Severity:** N/A  
**Impact:** None

**Description:**
- Interactive map component implemented using Leaflet and React Leaflet
- Uses OpenStreetMap tiles (free, no API key required)
- Integrated into PropertyDetails page
- Responsive design (mobile/desktop)
- CSP configured to allow Leaflet resources

**Evidence:**
- `frontend/src/components/map/PropertyMap.tsx` - interactive map component
- `leaflet` and `react-leaflet` packages added to dependencies
- Helmet middleware configured for Leaflet tiles
- Cross-origin embedder policy disabled for map tiles
- Replaced Google Maps iframe in PropertyDetails

**Resolution:**
- Implemented on October 22, 2026
- No action required

---

#### 8. Supabase Dependencies Unused

**Status:** ⚠️ Unused Dependencies  
**Severity:** Low  
**Impact:** Bundle size bloat

**Description:**
- Supabase client libraries installed but not used
- Backend uses raw PostgreSQL via TypeORM
- Unnecessary dependencies increase bundle size

**Evidence:**
- `backend/package.json` includes:
  - `@supabase/server: ^1.9.0`
  - `@supabase/ssr: ^0.12.7`
  - `@supabase/supabase-js: ^2.117.2`
- No imports from these packages found in code
- TypeORM used for all database operations

**Recommended Next Steps:**
1. Verify no code uses Supabase libraries
2. Remove unused dependencies from package.json
3. Run `npm install` to clean up
4. Test application after removal

**Code Locations:**
- `backend/package.json` - remove Supabase dependencies

---

#### 9. Google Analytics Placeholder

**Status:** ⚠️ Placeholder Only  
**Severity:** Low  
**Impact:** Analytics tracking not functional

**Description:**
- Google Analytics script included in layout
- GA_MEASUREMENT_ID is placeholder
- Analytics tracking not functional until configured

**Evidence:**
- `frontend/app/layout.tsx` includes GA script
- GA_MEASUREMENT_ID is placeholder string
- No production GA ID configured

**Recommended Next Steps:**
1. Replace GA_MEASUREMENT_ID with actual GA4 ID
2. Test analytics tracking
3. Configure GA events for key actions
4. Verify data appears in GA dashboard

**Code Locations:**
- `frontend/app/layout.tsx` - update GA_MEASUREMENT_ID

---

### Low Priority Issues

#### 10. Inquiry Entity Column Name ✅ RESOLVED

**Status:** ✅ Resolved  
**Severity:** N/A  
**Impact:** None

**Description:**
- Migration 20261012000001 renamed column from `inquiry` to `message`
- Entity verified to use correct column name `message`

**Evidence:**
- Migration: `ALTER TABLE "inquiries" RENAME COLUMN "inquiry" TO "message"`
- Entity `backend/src/entities/Inquiry.ts` uses: `@Column('text') message: string;`
- Entity and database schema are aligned

**Resolution:**
- Verified on October 19, 2026
- No action required

---

#### 11. Content Editor Role Not Seeded ⚠️ VERIFICATION NEEDED

**Status:** ⚠️ Verification Needed  
**Severity:** Low  
**Impact:** Content editor may not be able to log in

**Description:**
- Content editor role may not be in seed data
- Content editor routes exist but role may not exist in database
- Migration 20261007000002 deduplicated role names but may not have added content_editor

**Evidence:**
- Seed script only creates: admin, agent, user roles
- Content editor routes exist in code
- Need to verify role exists in production database

**Recommended Next Steps:**
1. Check production database for content_editor role
2. Add to seed script if missing
3. Run seed script: `npm run seed`
4. Test content editor login

**Code Locations:**
- `backend/src/seed.ts`
- Database roles table

---

#### 12. SEO Optimization Incomplete ✅ PARTIALLY IMPLEMENTED

**Status:** ✅ Partially Implemented  
**Severity:** Low  
**Impact:** Improved but not fully optimized

**Description:**
- Basic metadata in layout.tsx
- Dynamic meta tags for some pages
- Sitemap and robots.txt files exist

**Evidence:**
- `frontend/app/layout.tsx` has basic metadata
- `frontend/app/sitemap.ts` exists (sitemap generation)
- `frontend/app/robots.ts` exists (robots.txt generation)
- SEO component exists: `frontend/src/components/seo/`

**Remaining Work:**
1. Implement dynamic meta tags for all pages
2. Add structured data (JSON-LD) for properties
3. Test with SEO tools
4. Optimize page titles and meta descriptions

**Code Locations:**
- `frontend/app/layout.tsx` - basic metadata
- `frontend/app/sitemap.ts` - sitemap generation
- `frontend/app/robots.ts` - robots.txt generation
- `frontend/src/components/seo/` - SEO components

---

## Deployment Configuration Status

### Current Production Setup ✅

**Frontend (Vercel):**
- ✅ Configured via `vercel.json`
- ✅ Build command: `cd frontend && npm run build`
- ✅ Environment variable: `NEXT_PUBLIC_API_URL=https://ingata-backend.onrender.com/api/v1`
- ⚠️ Needs verification that frontend URL is correctly deployed

**Backend (Render.com):**
- ✅ Configured via `backend/render.yaml`
- ✅ Database: `ingata-postgres` (PostgreSQL on Render)
- ✅ Build command: `npm install --include=dev && npm run build`
- ✅ Start command: `npm start`
- ⚠️ Needs FRONTEND_URL to be updated to actual Vercel URL
- ⚠️ Email SMTP variables need configuration for password reset
- ⚠️ Database migrations need to be run after deployment

**Configuration Files:**
- `vercel.json` - Vercel configuration
- `backend/render.yaml` - Render infrastructure as code
- `backend/DEPLOYMENT.md` - Detailed Render deployment guide
- `backend/RENDER_DEPLOYMENT_STEPS.md` - Quick start guide

**Pending Deployment Tasks:**
1. Verify frontend is deployed to Vercel
2. Verify backend is deployed to Render
3. Run database migrations on Render: `npm run migration:run`
4. Update FRONTEND_URL in Render environment variables
5. Configure SMTP for password reset (optional)
6. Test full integration between frontend and backend

**Documentation References:**
- See `backend/RENDER_DEPLOYMENT_STEPS.md` for detailed deployment instructions
- See `docs/DEPLOYMENT_GUIDE.md` for general deployment options

---

## Inconsistencies

### Database vs Entity Alignment

#### Inquiry Message Column

**Migration:** `20261012000001-RenameInquiryMessageColumn`
```sql
ALTER TABLE "inquiries" RENAME COLUMN "inquiry" TO "message"
```

**Entity:** `backend/src/entities/Inquiry.ts`
```typescript
@Column('text')
message: string;
```

**Status:** ✅ Aligned (entity uses correct column name)

**Verification Needed:** Confirm all controllers use correct field name

---

### Role Name Case Sensitivity

**Migration:** `20261007000002-DeduplicateRoleNames`
- Normalized role names to lowercase
- Enforced unique constraint on normalized names

**Middleware:** `backend/src/middleware/authorize.ts`
- Uses case-insensitive comparison

**Status:** ✅ Consistent

**Verification Needed:** Ensure all role checks use case-insensitive comparison

---

### Frontend API Alignment

**API Service:** `frontend/src/services/api.ts`
- API endpoints aligned with backend routes
- Most endpoints match

**Status:** ✅ Generally Aligned

**Verification Needed:** Comprehensive audit of all API calls

---

## Unfinished Features

### Property Comparison

**Status:** ❌ Not Started  
**Priority:** Low

**Description:**
- Favorites feature exists
- Comparison tool referenced in legacy pages
- Not fully implemented

**Database Support:** ✅ Favorites exist  
**Frontend Support:** ⚠️ Referenced only  
**Backend Support:** ❌ None

**Recommended Implementation:**
1. Create comparison component
2. Allow users to select properties to compare
3. Display side-by-side comparison
4. Highlight differences
5. Export comparison results

---

### Mortgage Calculator

**Status:** ❌ Not Started  
**Priority:** Low

**Description:**
- Referenced in legacy pages
- Not implemented

**Database Support:** N/A  
**Frontend Support:** ❌ None  
**Backend Support:** ❌ None

**Recommended Implementation:**
1. Create calculator component
2. Implement mortgage calculation logic
3. Add interest rate inputs
4. Display monthly payment
5. Add amortization schedule

---

### Rental Yield Calculator

**Status:** ❌ Not Started  
**Priority:** Low

**Description:**
- Referenced in legacy pages
- Not implemented

**Database Support:** N/A  
**Frontend Support:** ❌ None  
**Backend Support:** ❌ None

**Recommended Implementation:**
1. Create calculator component
2. Implement yield calculation logic
3. Add rental income inputs
4. Add property value inputs
5. Display annual yield percentage

---

### Advanced Search

**Status:** ⚠️ Partially Implemented  
**Priority:** Medium

**Description:**
- Basic search exists
- No advanced filters
- No saved search alerts

**Database Support:** ✅ Property searches exist  
**Frontend Support:** ⚠️ Basic only  
**Backend Support:** ⚠️ Basic filters only

**Recommended Implementation:**
1. Add advanced filter UI
2. Implement complex query logic
3. Add saved search alerts
4. Add search history
5. Implement search suggestions

---

## Security Considerations

### Missing Security Features

#### CSRF Protection

**Status:** ❌ Not Implemented  
**Severity:** Medium  
**Impact:** Vulnerable to CSRF attacks

**Recommended:**
- Implement CSRF tokens
- Use csurf or similar library
- Add CSRF validation to state-changing requests

---

#### Rate Limiting

**Status:** ❌ Not Implemented  
**Severity:** Medium  
**Impact:** Vulnerable to abuse/DoS

**Recommended:**
- Implement rate limiting per IP
- Implement rate limiting per user
- Use express-rate-limit
- Configure limits for sensitive endpoints

---

#### Input Sanitization

**Status:** ⚠️ Basic Only  
**Severity:** Low  
**Impact:** Potential XSS vulnerabilities

**Current:**
- TypeORM provides SQL injection protection
- React provides basic XSS protection

**Recommended:**
- Add input sanitization library
- Sanitize user-generated content
- Validate and sanitize file uploads
- Implement Content Security Policy

---

### Security Best Practices

**Current Implementations:**
- ✅ Password hashing with bcryptjs (12 rounds)
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ SQL injection prevention (TypeORM)
- ✅ Password reset token hashing
- ✅ Generic error messages (prevents enumeration)

**Missing Implementations:**
- ❌ HTTPS enforcement (production)
- ❌ Security headers (Helmet.js)
- ❌ HTTP Strict Transport Security (HSTS)
- ❌ Content Security Policy (CSP)
- ❌ Request logging for security events
- ❌ Error tracking (Sentry)

---

## Performance Issues

### N+1 Query Potential

**Status:** ⚠️ Possible  
**Severity:** Medium  
**Impact:** Performance degradation

**Description:**
- Some controllers may have N+1 queries
- Example: Agent property counting in `agentController.ts`

**Evidence:**
```typescript
// agentController.ts
const agentsWithCount = await Promise.all(
  agents.map(async (agent) => {
    const count = await propertyRepo.count({ where: { agentId: agent.id } });
    return { ...agent, _count: { properties: count } };
  })
);
```

**Recommended:**
- Review all controllers for N+1 queries
- Use eager loading with relations
- Add query batching
- Implement query optimization

---

### No Caching Layer

**Status:** ❌ Not Implemented  
**Severity:** Medium  
**Impact:** Higher database load

**Description:**
- No Redis or in-memory cache
- Database queried on every request
- No API response caching

**Recommended:**
- Add Redis cache
- Cache frequently accessed data
- Cache API responses
- Implement cache invalidation
- Add cache warming

---

### Image Optimization

**Status:** ⚠️ Partially Implemented  
**Severity:** Low  
**Impact:** Slower page loads

**Description:**
- Next.js Image component used
- Remote patterns configured for localhost only
- Production image domains not configured

**Evidence:**
```javascript
// next.config.js
images: {
  remotePatterns: [
    { protocol: 'http', hostname: 'localhost', pathname: '/**' },
    { protocol: 'https', hostname: 'localhost', pathname: '/**' },
  ],
}
```

**Recommended:**
- Configure production image domains
- Use CDN for static assets
- Implement image optimization
- Add lazy loading
- Compress images

---

## Troubleshooting Guide

### Common Development Issues

#### Backend Won't Start

**Symptoms:** Port already in use, database connection failed

**Solutions:**
1. Check if port 5000 is in use
2. Verify DATABASE_URL is correct
3. Check database is running
4. Verify JWT_SECRET is set
5. Check Node.js version (18+)

#### Frontend Won't Start

**Symptoms:** Port already in use, build errors

**Solutions:**
1. Check if port 3000 is in use
2. Run `npm run typecheck` to check for errors
3. Clear .next cache: `rm -rf .next`
4. Verify NEXT_PUBLIC_API_URL is set
5. Check Node.js version (18+)

#### Database Migration Failed

**Symptoms:** Migration errors, schema conflicts

**Solutions:**
1. Check database connection
2. Verify migration file syntax
3. Check for conflicting migrations
4. Run `npm run migration:revert` if needed
5. Verify TypeORM configuration

#### Maps Not Loading

**Symptoms:** Map shows blank or error message

**Solutions:**
1. Verify NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set in frontend/.env
2. Check if API key is valid and has Maps JavaScript API enabled
3. Check browser console for Google Maps API errors
4. Verify network can reach maps.googleapis.com
5. Check if Google Maps billing is enabled for the API key

#### Build Errors

**Symptoms:** TypeScript errors, missing dependencies

**Solutions:**
1. Run `npm install` in both backend and frontend
2. Run `npm run typecheck` to identify TypeScript errors
3. Check for circular dependencies
4. Verify all imports are correct
5. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

---

## Testing Checklist for Maps Integration

When testing map functionality:

- [ ] Google Maps API key is set in frontend/.env
- [ ] API key has Maps JavaScript API enabled
- [ ] PropertyMap component renders on property details page
- [ ] Map displays at correct latitude/longitude
- [ ] Marker shows property location
- [ ] Map is responsive on mobile/tablet/desktop
- [ ] No console errors related to Google Maps
- [ ] Map loads within reasonable time
- [ ] UseGoogleMaps hook correctly loads API
- [ ] Map styles (POI labels hidden) are applied
- [ ] Error handling for missing API key works
