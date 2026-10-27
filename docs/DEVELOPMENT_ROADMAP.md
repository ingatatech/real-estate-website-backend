# Development Roadmap

**Last Updated:** October 22, 2026

---

## Table of Contents
1. [Overview](#overview)
2. [Completed Features](#completed-features)
3. [In Progress](#in-progress)
4. [Short Term Priorities](#short-term-priorities)
5. [Medium Term Goals](#medium-term-goals)
6. [Long Term Vision](#long-term-vision)
7. [Technical Debt](#technical-debt)
8. [Deprecation Timeline](#deprecation-timeline)

---

## Overview

### Project Status

**Version:** 1.0.0  
**Status:** Production Deployed (Vercel Frontend + Render Backend)  
**Completion:** ~95% core features, ~5% enhancements

### Development Philosophy

**Priority Order:**
1. Stability and reliability
2. Security
3. Core functionality
4. User experience
5. Performance
6. Advanced features

**Decision Criteria:**
- Business value
- User impact
- Development effort
- Risk assessment
- Resource availability

---

## Completed Features

### Core Functionality ✅

- [x] User authentication (JWT)
- [x] User registration
- [x] Password reset via email
- [x] Role-based authorization
- [x] Admin dashboard
- [x] Agent dashboard
- [x] Property manager dashboard
- [x] Content editor dashboard
- [x] Property listing management
- [x] Property search (basic)
- [x] Property categories
- [x] Property images
- [x] Property features (database + UI)
- [x] Agent profiles
- [x] Inquiries management
- [x] Viewing requests
- [x] Listing requests
- [x] Valuation requests
- [x] Contact messages
- [x] Articles/insights
- [x] FAQs
- [x] Services
- [x] Testimonials
- [x] Site settings
- [x] Site pages CMS
- [x] Analytics tracking
- [x] Analytics dashboard
- [x] Favorites
- [x] Property searches
- [x] Interactive property maps (Leaflet + OpenStreetMap)
- [x] Property comparison tool
- [x] Mortgage calculator
- [x] Rental yield calculator
- [x] Advanced search with map view
- [x] Image optimization with production domains

### Security Features ✅

- [x] JWT authentication with 5-minute expiration
- [x] Password hashing (bcrypt, 12 salt rounds)
- [x] Role-based authorization
- [x] Rate limiting (API, auth, contact, search)
- [x] Security headers (Helmet middleware)
- [x] Content Security Policy
- [x] CSRF protection middleware (disabled for JWT API)
- [x] Error tracking (Sentry integration)
- [x] Inactivity logout (5 minutes)
- [x] Scheduled analytics data cleanup (node-cron)
- [x] CI/CD pipeline (Vercel + Render auto-deploy)

### Database Schema ✅

- [x] 28 database tables
- [x] 8 migrations
- [x] Foreign key relationships
- [x] Performance indexes
- [x] Data retention policy field

### API Endpoints ✅

- [x] 40+ API routes
- [x] Public endpoints
- [x] Admin endpoints
- [x] Agent dashboard endpoints
- [x] Property manager endpoints
- [x] Content editor endpoints
- [x] Analytics endpoints

### Frontend Pages ✅

- [x] Homepage
- [x] Property listings
- [x] Property details
- [x] Agent directory
- [x] Agent profiles
- [x] Contact form
- [x] About section
- [x] Services page
- [x] Articles/insights
- [x] FAQs
- [x] Admin dashboard
- [x] Staff portal login
- [x] User registration
- [x] User login
- [x] Password reset flow

---

## In Progress

### Frontend Migration to App Router 🔄

**Status:** In Progress  
**Completion:** ~30%  
**Priority:** High

**Description:**
- Migrating from legacy pages to Next.js App Router
- 100+ legacy pages in `src/legacy-pages/`
- Legacy routing wrappers preserve old URLs
- New pages in `app/` directory

**Remaining Work:**
- Migrate all legacy pages to App Router
- Remove legacy routing wrappers
- Clean up legacy page files
- Update navigation to use new routes
- Test all routes

**Blocked By:**
- Time/resources
- Priority of other features

**Estimated Completion:** Q4 2026

---

## Short Term Priorities

### Phase 1: Critical Infrastructure (1-2 weeks)

#### 1.1 Media Upload Storage Implementation

**Status:** ❌ Not Started  
**Priority:** High  
**Effort:** 3-5 days

**Description:**
- Implement S3, Cloudinary, or local storage
- Configure Multer storage
- Test upload functionality
- Add error handling

**Tasks:**
- [ ] Choose storage provider
- [ ] Configure storage credentials
- [ ] Implement Multer storage configuration
- [ ] Update upload endpoints
- [ ] Test file upload
- [ ] Test file retrieval
- [ ] Add file size limits
- [ ] Add file type validation
- [ ] Add error handling

**Acceptance Criteria:**
- Files upload successfully
- Files persist after upload
- Files can be retrieved
- Error handling works
- Size limits enforced
- Type validation works

---

#### 1.2 Automated Testing Setup

**Status:** ℹ️ Infrastructure Available, Not Prioritized  
**Priority:** Low  
**Effort:** Not applicable

**Description:**
- Testing infrastructure is set up (Jest for backend/frontend, Playwright for E2E)
- Manual testing is required per AGENT.md
- Automated testing not prioritized for this project

**Tasks:**
- [x] Install Jest dependencies
- [x] Configure Jest for backend
- [x] Configure Jest for frontend
- [x] Configure Playwright for E2E
- [ ] Write additional tests (if needed in future)
- [ ] Configure CI/CD pipeline for automated testing (if needed in future)

**Notes:**
- Testing infrastructure is available for future use
- Current approach relies on manual testing per AGENT.md
- Can be prioritized if project requirements change

---

#### 1.3 Deployment Configuration ✅ RESOLVED

**Status:** ✅ Complete  
**Priority:** High  
**Effort:** 3-5 days

**Description:**
- Configure Vercel for frontend
- Configure Render for backend
- Set up CI/CD pipeline
- Write deployment documentation

**Tasks:**
- [x] Configure Vercel deployment
- [x] Configure Render deployment
- [x] Set up auto-deploy on git push
- [x] Write deployment documentation
- [x] Create render.yaml infrastructure as code
- [x] Configure environment variables
- [x] Test deployment pipeline

**Acceptance Criteria:**
- Vercel deployment works ✅
- Render deployment works ✅
- Auto-deploy on git push ✅
- Documentation is complete ✅
- Environment variables configured ✅

**Resolution:**
- Vercel (frontend) and Render (backend) deployments configured
- Auto-deploy on git push enabled
- No action required

---

### Phase 2: Feature Completion (2-3 weeks)

#### 2.1 Analytics Data Cleanup Job

**Status:** ✅ Complete  
**Priority:** Medium  
**Effort:** 2-3 days

**Description:**
- Implement scheduled cleanup job
- Use retention policy from site_settings
- Delete old analytics data

**Tasks:**
- [x] Install job scheduler (node-cron)
- [x] Create cleanup job script
- [x] Query retention policy
- [x] Delete old page_views
- [x] Delete old property_views
- [x] Delete old click_events
- [x] Schedule job (daily/weekly)
- [x] Add logging
- [x] Test cleanup logic

**Acceptance Criteria:**
- Job runs on schedule ✅
- Old data is deleted ✅
- Retention policy is respected ✅
- Logging works correctly ✅
- No data loss errors ✅

**Implementation:**
- Location: `backend/src/services/scheduledTasks.ts`
- Schedule: Daily at 2:00 AM UTC
- Control: `ENABLE_SCHEDULED_TASKS` environment variable
- Manual cleanup: `POST /admin/analytics/cleanup`

---

#### 2.2 Property Features UI ✅ RESOLVED

**Status:** ✅ Complete  
**Priority:** Medium  
**Effort:** 3-5 days

**Description:**
- Create admin UI for property features
- Add API endpoints
- Integrate with property form

**Tasks:**
- [x] Create admin features page
- [x] Add feature CRUD API endpoints
- [x] Add feature selection to property form
- [x] Display features in property details
- [x] Test feature management
- [x] Test feature display

**Acceptance Criteria:**
- Features can be created/edited/deleted ✅
- Features can be assigned to properties ✅
- Features display correctly ✅
- API endpoints work ✅
- UI is user-friendly ✅

**Resolution:**
- Implemented
- No action required

---

#### 2.3 Development Management UI ✅ RESOLVED

**Status:** ✅ Complete  
**Priority:** Medium  
**Effort:** 3-5 days

**Description:**
- Create admin UI for developments
- Add API endpoints
- Integrate with property form

**Tasks:**
- [x] Create admin developments page
- [x] Add development CRUD API endpoints
- [x] Add development selection to property form
- [x] Display development in property details
- [x] Test development management
- [x] Test development display

**Acceptance Criteria:**
- Developments can be created/edited/deleted ✅
- Developments can be assigned to properties ✅
- Developments display correctly ✅
- API endpoints work ✅
- UI is user-friendly ✅

**Resolution:**
- Implemented
- No action required

---

#### 2.4 Advanced Search ✅ RESOLVED

**Status:** ✅ Complete  
**Priority:** Medium  
**Effort:** 1-2 weeks

**Description:**
- Add advanced filter UI
- Implement complex query logic
- Add map view with property markers

**Tasks:**
- [x] Design advanced filter UI
- [x] Implement filter logic in backend
- [x] Add price range filter
- [x] Add location radius filter
- [x] Add amenities filter
- [x] Add map view with property markers
- [x] Add view toggle (Grid/Map/Split)
- [x] Test search functionality
- [x] Optimize query performance

**Acceptance Criteria:**
- Advanced filters work correctly ✅
- Search results are accurate ✅
- Map view displays property markers ✅
- Performance is acceptable ✅
- UI is intuitive ✅

**Resolution:**
- Implemented with map view and property markers
- No action required

---

#### 2.5 SEO Optimization ✅ RESOLVED

**Status:** ✅ Complete  
**Priority:** Medium  
**Effort:** 1-2 weeks

**Description:**
- Implement dynamic meta tags
- Generate sitemap
- Add robots.txt
- Add structured data
- Configure image optimization

**Tasks:**
- [x] Implement dynamic meta tags
- [x] Generate sitemap.xml
- [x] Add robots.txt
- [x] Add JSON-LD structured data
- [x] Optimize page titles
- [x] Optimize meta descriptions
- [x] Configure image optimization with production domains
- [x] Test with SEO tools
- [x] Verify Google Search Console

**Acceptance Criteria:**
- Meta tags are dynamic ✅
- Sitemap is generated ✅
- Robots.txt is correct ✅
- Structured data is valid ✅
- Image optimization configured ✅
- SEO score improves ✅

**Resolution:**
- Implemented with image optimization for production
- No action required

---

## Medium Term Goals

### Phase 3: Security & Performance (1-2 months)

#### 3.1 Security Enhancements

**Status:** ✅ Complete  
**Priority:** High  
**Effort:** 2-3 weeks

**Description:**
- Implement CSRF protection
- Add rate limiting
- Add security headers
- Implement CSP

**Tasks:**
- [x] Implement CSRF tokens (middleware created, disabled for JWT API)
- [x] Add rate limiting per IP (API, auth, contact, search limiters)
- [x] Add rate limiting per user (future enhancement)
- [x] Add Helmet.js security headers
- [x] Implement Content Security Policy (configured for Leaflet maps)
- [x] Add request logging (basic console logging)
- [x] Add security monitoring (Sentry integration)
- [x] Test security measures

**Acceptance Criteria:**
- CSRF protection works ✅ (middleware available, disabled for JWT architecture)
- Rate limiting prevents abuse ✅
- Security headers are correct ✅
- CSP is enforced ✅
- Security events are logged ✅

**Implementation:**
- Rate Limiting: `backend/src/middleware/rateLimiter.ts`
- Security Headers: `backend/src/app.ts` (Helmet middleware)
- CSRF Protection: `backend/src/middleware/csrf.ts` (disabled for JWT API)
- Error Tracking: `backend/src/config/sentry.ts`

---

#### 3.2 Performance Optimization

**Status:** ❌ Not Started  
**Priority:** High  
**Effort:** 2-3 weeks

**Description:**
- Add caching layer (Redis)
- Optimize N+1 queries
- Configure production image domains
- Add CDN

**Tasks:**
- [ ] Set up Redis cache
- [ ] Cache frequently accessed data
- [ ] Cache API responses
- [ ] Optimize N+1 queries
- [ ] Configure production image domains
- [ ] Set up CDN for static assets
- [ ] Implement lazy loading
- [ ] Optimize bundle size
- [ ] Test performance improvements

**Acceptance Criteria:**
- Cache reduces database load
- Query performance improves
- Page load times improve
- Image optimization works
- Bundle size is optimized

---

#### 3.3 Error Tracking

**Status:** ❌ Not Started  
**Priority:** Medium  
**Effort:** 1 week

**Description:**
- Integrate Sentry or similar
- Configure error reporting
- Set up alerts

**Tasks:**
- [ ] Create Sentry account
- [ ] Install Sentry SDK
- [ ] Initialize Sentry in backend
- [ ] Initialize Sentry in frontend
- [ ] Configure environment
- [ ] Set up alerts
- [ ] Test error tracking
- [ ] Review error reports

**Acceptance Criteria:**
- Errors are tracked
- Alerts are configured
- Error reports are useful
- Dashboard is accessible

---

### Phase 4: Feature Enhancements (2-3 months)

#### 4.1 Property Comparison ✅ RESOLVED

**Status:** ✅ Complete  
**Priority:** Low  
**Effort:** 1-2 weeks

**Description:**
- Create comparison tool
- Allow users to compare properties
- Display side-by-side comparison
- Export comparison results

**Tasks:**
- [x] Design comparison UI
- [x] Implement comparison logic
- [x] Add property selection
- [x] Display side-by-side comparison
- [x] Highlight differences
- [x] Add export functionality
- [x] Test comparison tool

**Acceptance Criteria:**
- Comparison tool works ✅
- Side-by-side display is clear ✅
- Differences are highlighted ✅
- Export works correctly ✅

**Resolution:**
- Implemented
- No action required

---

#### 4.3 Calculators ✅ RESOLVED

**Status:** ✅ Complete  
**Priority:** Low  
**Effort:** 2-3 weeks

**Description:**
- Implement mortgage calculator
- Implement rental yield calculator
- Add calculator pages

**Tasks:**
- [x] Design calculator UI
- [x] Implement mortgage calculation logic
- [x] Implement yield calculation logic
- [x] Add calculator pages
- [x] Add to navigation
- [x] Test calculators
- [x] Verify calculations

**Acceptance Criteria:**
- Calculations are accurate ✅
- UI is user-friendly ✅
- Results are clear ✅
- Calculators are accessible ✅

**Resolution:**
- Implemented
- No action required

---

#### 4.4 Remove Unused Dependencies

**Status:** ⚠️ Identified  
**Priority:** Low  
**Effort:** 1-2 days

**Description:**
- Remove Supabase dependencies
- Audit all dependencies
- Remove unused packages

**Tasks:**
- [ ] Verify no code uses Supabase
- [ ] Remove Supabase dependencies
- [ ] Audit all dependencies
- [ ] Remove unused packages
- [ ] Run npm install
- [ ] Test application
- [ ] Verify bundle size reduction

**Acceptance Criteria:**
- Unused dependencies removed
- Application still works
- Bundle size is reduced
- No broken dependencies

---

## Long Term Vision

### Phase 5: Advanced Features (3-6 months)

#### 5.1 Real-time Features

**Status:** ❌ Not Planned  
**Priority:** Low  
**Effort:** 4-6 weeks

**Description:**
- Add WebSocket support
- Real-time notifications
- Live chat for inquiries
- Real-time analytics

**Tasks:**
- [ ] Add WebSocket server
- [ ] Implement notification system
- [ ] Add live chat interface
- [ ] Implement real-time analytics
- [ ] Test real-time features
- [ ] Optimize WebSocket performance

---

#### 5.2 Mobile App

**Status:** ❌ Not Planned  
**Priority:** Low  
**Effort:** 8-12 weeks

**Description:**
- Create React Native app
- Implement core features
- Add push notifications
- Integrate with existing API

**Tasks:**
- [ ] Set up React Native project
- [ ] Implement authentication
- [ ] Implement property browsing
- [ ] Implement favorite management
- [ ] Add push notifications
- [ ] Test on iOS and Android
- [ ] Deploy to app stores

---

#### 5.3 GraphQL API

**Status:** ❌ Not Planned  
**Priority:** Low  
**Effort:** 4-6 weeks

**Description:**
- Create GraphQL API
- Migrate from REST
- Add GraphQL playground
- Update frontend to use GraphQL

**Tasks:**
- [ ] Set up Apollo Server
- [ ] Define GraphQL schema
- [ ] Create GraphQL resolvers
- [ ] Migrate REST endpoints
- [ ] Add GraphQL playground
- [ ] Update frontend Apollo Client
- [ ] Test GraphQL API
- [ ] Deprecate REST endpoints

---

#### 5.4 Microservices Architecture

**Status:** ❌ Not Planned  
**Priority:** Low  
**Effort:** 8-12 weeks

**Description:**
- Split into microservices
- Separate API services
- Add API gateway
- Implement service discovery

**Tasks:**
- [ ] Design microservices architecture
- [ ] Create API gateway
- [ ] Extract user service
- [ ] Extract property service
- [ ] Extract analytics service
- [ ] Implement service discovery
- [ ] Add inter-service communication
- [ ] Test microservices

---

### Phase 6: Platform Enhancements (6-12 months)

#### 6.1 Multi-Tenancy

**Status:** ❌ Not Planned  
**Priority:** Low  
**Effort:** 8-12 weeks

**Description:**
- Add multi-tenancy support
- Tenant isolation
- Tenant-specific settings
- Tenant billing

**Tasks:**
- [ ] Design multi-tenancy architecture
- [ ] Add tenant_id to entities
- [ ] Implement tenant isolation
- [ ] Add tenant-specific settings
- [ ] Add tenant billing
- [ ] Update authentication
- [ ] Test multi-tenancy

---

#### 6.2 Internationalization

**Status:** ❌ Not Planned  
**Priority:** Low  
**Effort**: 4-6 weeks

**Description:**
- Add i18n support
- Multi-language support
- Currency conversion
- Date/time localization

**Tasks:**
- [ ] Set up i18n framework
- [ ] Add language files
- [ ] Implement language switcher
- [ ] Add currency conversion
- [ ] Add date/time localization
- [ ] Test internationalization

---

#### 6.3 AI Features

**Status:** ❌ Not Planned  
**Priority:** Low  
**Effort:** 8-12 weeks

**Description:**
- AI-powered property recommendations
- Price prediction
- Market analysis
- Automated property descriptions

**Tasks:**
- [ ] Choose AI/ML framework
- [ ] Implement recommendation engine
- [ ] Train price prediction model
- [ ] Implement market analysis
- [ ] Add AI content generation
- [ ] Test AI features
- [ ] Optimize AI performance

---

## Technical Debt

### Current Technical Debt

#### 1. Frontend Migration

**Debt:** 100+ legacy pages need migration to App Router
**Impact:** Medium
**Effort:** 4-6 weeks
**Priority:** High

#### 2. Test Coverage

**Debt:** Testing infrastructure available, not prioritized
**Impact:** Low (manual testing per AGENT.md)
**Effort:** Not applicable (if needed in future)
**Priority:** Low

#### 3. Deployment Automation ✅ RESOLVED

**Debt:** CI/CD pipeline configured
**Impact:** None
**Effort:** Complete
**Priority:** N/A

#### 4. Media Storage

**Debt:** Supabase Storage configured, requires env vars in production
**Impact:** Medium
**Effort:** 1 day (configuration)
**Priority:** Medium

#### 5. N+1 Queries

**Debt:** Potential N+1 queries in controllers
**Impact:** Medium
**Effort:** 1-2 weeks
**Priority:** Medium

#### 6. Caching

**Debt:** No caching layer
**Impact:** Medium
**Effort:** 2-3 weeks
**Priority:** Medium

#### 7. Unused Dependencies

**Debt:** Supabase libraries unused (but Supabase Storage is used)
**Impact:** Low
**Effort:** 1-2 days
**Priority:** Low

---

## Deprecation Timeline

### No Deprecations Planned

**Current Status:** No features marked for deprecation

### Future Deprecation Considerations

**Legacy Pages:**
- Legacy routing wrappers may be deprecated after App Router migration completes
- Timeline: Q4 2026

**Legacy Routes:**
- Some API routes may be deprecated if GraphQL is implemented
- Timeline: 2027 (if GraphQL is adopted)

**Authentication:**
- JWT authentication may be enhanced with refresh tokens
- Timeline: 2027 (if needed)

---

## Version Planning

### Version 1.1.0 (Q4 2026)

**Focus:** Infrastructure and critical features

**Completed Features:**
- ✅ Deployment configuration (Vercel + Render)
- ✅ Analytics data cleanup job
- ✅ Property features UI
- ✅ Development management UI
- ✅ Advanced search with map view
- ✅ SEO optimization with image optimization
- ✅ Property comparison tool
- ✅ Mortgage calculator
- ✅ Rental yield calculator
- ✅ Maps integration with property markers
- ✅ Security enhancements (CSRF, rate limiting, error tracking)
- ✅ CI/CD pipeline (auto-deploy on git push)

**Remaining Tasks:**
- Media upload storage implementation (Supabase Storage configured, needs env vars)
- Automated testing (infrastructure available, not prioritized)

**Status:** Nearly Complete

---

### Version 1.2.0 (Q1 2027)

**Focus:** Security and performance

**Planned Features:**
- Redis caching
- Query optimization
- N+1 query optimization
- Image optimization
- CDN setup
- Performance monitoring

**Completed in v1.1.x:**
- CSRF protection (middleware available, disabled for JWT API)
- Rate limiting (API, auth, contact, search)
- Security headers (Helmet middleware)
- Content Security Policy (configured for Leaflet maps)
- Error tracking (Sentry integration)
- Maps integration (Leaflet + OpenStreetMap)
- Analytics data cleanup (node-cron)
- JWT expiration alignment (5 minutes)

**Target:** February 2027

---

### Version 2.0.0 (Q2 2027)

**Focus:** Feature enhancements

**Planned Features:**
- Property comparison tool
- Mortgage calculator
- Rental yield calculator
- Clean up technical debt
- Complete App Router migration
- Add more automated tests

**Target:** May 2027

---

## Contribution Guidelines

### Feature Requests

**Process:**
1. Submit feature request via GitHub Issues
2. Include business justification
3. Include proposed implementation
4. Include estimated effort
5. Community discussion

**Evaluation Criteria:**
- Business value
- User impact
- Development effort
- Alignment with roadmap
- Resource availability

### Bug Reports

**Process:**
1. Submit bug report via GitHub Issues
2. Include steps to reproduce
2. Include expected vs actual behavior
3. Include environment details
4. Include error messages/logs

**Priority:**
- Critical: Fixes immediately
- High: Next sprint
- Medium: When time permits
- Low: Backlog

---

## Risk Assessment

### Technical Risks

**Media Storage Implementation:**
- Risk: Complexity of integration
- Mitigation: Choose proven provider (S3, Cloudinary)
- Timeline: 3-5 days

**App Router Migration:**
- Risk: Breaking existing functionality
- Mitigation: Use legacy wrappers during migration
- Timeline: 4-6 weeks

**Testing Setup:**
- Risk: Time-consuming to implement
- Mitigation: Focus on critical paths first
- Timeline: 2-3 weeks

### Business Risks

**Timeline Delays:**
- Risk: Features may take longer than estimated
- Mitigation: Build in buffer time
- Adjust priorities as needed

**Resource Constraints:**
- Risk: Limited development resources
- Mitigation: Prioritize critical features
- Defer non-essential features

---

## Success Metrics

### Version 1.1.0 Success Criteria

- [ ] Media upload storage implemented and working
- [ ] Test coverage > 70% for critical paths
- [ ] CI/CD pipeline deployed successfully
- [ ] Analytics cleanup job running
- [ ] Property features UI implemented
- [ ] Development management UI implemented
- [ ] Advanced search working
- [ ] SEO score improved

### Overall Success Criteria

- [ ] All critical infrastructure in place
- [ ] Test coverage > 80%
- [ ] Automated deployment working
- [ ] Security vulnerabilities addressed
- [ ] Performance optimized
- [ ] Documentation complete
- [ ] User satisfaction high

---

## Feedback Loop

### User Feedback Collection

**Methods:**
- User surveys
- Analytics data
- Support tickets
- GitHub Issues

### Iteration Process

1. Collect feedback
2. Analyze feedback
3. Prioritize improvements
4. Plan next sprint
5. Implement improvements
6. Collect more feedback

### Continuous Improvement

**Practices:**
- Regular retrospectives
- Performance monitoring
- Security audits
- User testing
- Accessibility testing

---

## Conclusion

### Current State

The Ingata Real Estate platform is **70% complete** with core functionality working. The platform is production-ready with manual deployment, but lacks automated testing, deployment automation, and some enhancements.

### Next Steps

**Immediate (Next 4-6 weeks):**
1. Implement media upload storage
2. Set up automated testing
3. Configure deployment pipeline
4. Implement analytics cleanup
5. Add property features UI
6. Add development management UI

**Short Term (Next 2-3 months):**
1. Add security enhancements
2. Optimize performance
3. Add error tracking
4. Implement advanced search
5. Optimize SEO

**Long Term (Next 6-12 months):**
1. Evaluate maps integration
2. Evaluate calculators
3. Clean up technical debt
4. Consider mobile app
5. Evaluate GraphQL adoption

### Vision

To become a **leading real estate platform** in the target market with:
- Excellent user experience
- Robust and scalable architecture
- Comprehensive feature set
- Strong security posture
- High performance
- Active community

---

## Appendix

### Resource Allocation

**Development Team:**
- 1 Backend Developer
- 1 Frontend Developer
- 1 Part-time DevOps (when needed)

**Time Allocation:**
- 60% New features
- 20% Bug fixes
- 10% Technical debt
- 10% Documentation

### Budget Considerations

**Infrastructure Costs:**
- VPS: $20-40/month
- Database: $19-50/month (Neon Pro)
- Domain: $10-15/year
- Total: $50-100/month

**Cloud Deployment:**
- Railway/Render: $40-100/month
- Vercel: Free or $20/month
- Neon: $19-50/month
- Total: $60-170/month

### Technology Choices Review

**Current Stack:**
- Backend: Node.js, Express, TypeORM, PostgreSQL
- Frontend: Next.js, TypeScript, Tailwind CSS

**Alternatives Considered:**
- Database: MongoDB (rejected for relational needs)
- Backend: NestJS (rejected for simplicity)
- Frontend: Vue.js (rejected for ecosystem)
- CSS: Styled Components (rejected for Tailwind)

**Rationale:**
- Current stack is well-suited for requirements
- Strong community support
- Good documentation
- Familiar to team

---

## Contact

### Project Questions

**Development Rules:** See `agent.md`  
**Documentation:** See `/docs` folder  
**Issues:** Report via GitHub Issues

### Support

For technical support or questions about the roadmap, please refer to the project documentation or create a GitHub Issue.
