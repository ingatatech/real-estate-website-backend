# Development Roadmap

**Last Updated:** October 27, 2026

---

## Overview

This document outlines the development roadmap for the Ingata Real Estate platform. It includes completed features, current priorities, and future enhancements.

---

## Completed Features ✅

### Version 1.0.0 (October 2026)

**Core Platform:**
- ✅ User authentication (JWT)
- ✅ Multi-role system (5 roles)
- ✅ Property listing management
- ✅ Property search with filters
- ✅ Advanced search with map view
- ✅ Property categories
- ✅ Property features
- ✅ Developments
- ✅ Media upload (Supabase)

**User Interactions:**
- ✅ Property inquiries
- ✅ Viewing requests
- ✅ Valuation requests
- ✅ Listing requests
- ✅ Contact forms
- ✅ Favorites
- ✅ Property searches
- ✅ Property comparison
- ✅ Mortgage calculator
- ✅ Rental yield calculator

**Content Management:**
- ✅ Articles with categories
- ✅ FAQs
- ✅ Testimonials
- ✅ Services
- ✅ Site pages
- ✅ Homepage content management

**Analytics:**
- ✅ Page view tracking
- ✅ Property view tracking
- ✅ Click event tracking
- ✅ Analytics dashboard
- ✅ Data retention management
- ✅ Automated data cleanup

**Security:**
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Security headers (Helmet)
- ✅ Role-based authorization
- ✅ Password reset (email)

**Infrastructure:**
- ✅ Backend deployment (Render)
- ✅ Frontend deployment (Vercel)
- ✅ Database (PostgreSQL)
- ✅ Email service (Brevo)
- ✅ Media storage (Supabase)
- ✅ Error tracking (Sentry)
- ✅ CI/CD (auto-deploy)

**Frontend:**
- ✅ Next.js 15 with App Router
- ✅ Tailwind CSS styling
- ✅ Responsive design
- ✅ Interactive maps (Leaflet)
- ✅ SEO optimization
- ✅ Cookie consent management
- ✅ Inactivity logout

---

## Current Priorities 🎯

### High Priority (Immediate)

#### 1. Fix Backend Test Configuration
**Status:** ⚠️ Broken  
**Effort:** 1-2 hours  
**Description:** Configure Jest to handle ESM modules and enable backend testing

**Tasks:**
- Update jest.config.js for ESM support
- Configure ts-jest with ESM preset
- Test all backend tests
- Aim for 80%+ code coverage

**Impact:** Enable automated testing, improve code quality

---

#### 2. Continue Legacy Page Migration
**Status:** 🔄 In Progress (~15% complete)  
**Effort:** 20-30 hours  
**Description:** Migrate 92 legacy pages to Next.js App Router

**Tasks:**
- Migrate admin sub-pages (37 pages)
- Migrate property category pages
- Migrate service detail pages
- Migrate legal pages
- Migrate tools (calculators, comparison)
- Remove legacy route handlers
- Delete legacy files

**Impact:** Modernize codebase, improve performance, simplify maintenance

---

### Medium Priority (Near Term)

#### 3. Implement Refresh Token Mechanism
**Status:** 📋 Planned  
**Effort:** 8-12 hours  
**Description:** Add refresh token support to reduce frequent re-authentication

**Tasks:**
- Design refresh token flow
- Add refresh token endpoint
- Store refresh token in HTTP-only cookie
- Update frontend to use refresh token
- Extend access token duration
- Test refresh flow

**Impact:** Improve user experience, reduce login frequency

---

#### 4. Add Automated Email Testing
**Status:** 📋 Planned  
**Effort:** 4-6 hours  
**Description:** Test email functionality in CI/CD pipeline

**Tasks:**
- Set up Mailtrap or similar
- Mock email service in tests
- Add email sending tests
- Verify email content
- Integrate with CI/CD

**Impact:** Ensure email functionality works correctly

---

#### 5. Implement API Documentation
**Status:** 📋 Planned  
**Effort:** 10-15 hours  
**Description:** Add Swagger/OpenAPI documentation or remove unused dependencies

**Tasks:**
- Option A: Implement Swagger with swagger-jsdoc
- Option B: Remove unused Swagger dependencies
- Document all endpoints
- Add examples
- Set up Swagger UI

**Impact:** Better API documentation or cleaner dependencies

---

### Low Priority (Future)

#### 6. Remove Unused Dependencies
**Status:** 📋 Planned  
**Effort:** 0.5 hours  
**Description:** Remove Swagger dependencies if not implementing API docs

**Tasks:**
- Remove swagger-jsdoc from package.json
- Remove swagger-ui-express from package.json
- Run npm install
- Test application

**Impact:** Cleaner dependencies, smaller bundle size

---

#### 7. Update Social Media Links
**Status:** 📋 Planned  
**Effort:** 0.5 hours  
**Description:** Replace placeholder social media URLs with actual brand URLs

**Tasks:**
- Update site settings with actual URLs
- Or remove social media section if not used
- Test links

**Impact:** Accurate social media presence

---

#### 8. Add Password Complexity Requirements
**Status:** 📋 Planned  
**Effort:** 2-3 hours  
**Description:** Enforce stronger password requirements

**Tasks:**
- Add password complexity validation
- Require uppercase, lowercase, numbers, special chars
- Add password strength meter
- Update validation messages
- Test password flow

**Impact:** Improved security

---

#### 9. Implement Account Lockout
**Status:** 📋 Planned  
**Effort:** 4-6 hours  
**Description:** Lock accounts after failed login attempts

**Tasks:**
- Track failed login attempts
- Lock account after N attempts
- Implement lockout duration
- Add unlock mechanism
- Notify user of lockout
- Test lockout flow

**Impact:** Improved security, prevent brute force

---

#### 10. Add Email Verification
**Status:** 📋 Planned  
**Effort:** 6-8 hours  
**Description:** Require email verification for new accounts

**Tasks:**
- Add email verification token to users table
- Send verification email on registration
- Add verification endpoint
- Block unverified users from certain features
- Add resend verification option
- Test verification flow

**Impact:** Improved security, verified email addresses

---

## Future Enhancements 💡

### Short Term (Next 3 Months)

#### Performance Optimization
- **Redis Caching:** Cache frequently accessed data (properties, categories)
- **Database Indexing:** Add missing indexes for slow queries
- **Image Optimization:** Further optimize images for faster loading
- **Code Splitting:** Implement dynamic imports for larger components

#### Security Enhancements
- **2FA/MFA:** Add two-factor authentication for sensitive accounts
- **Audit Logging:** Log all user actions for security audit
- **IP-based Rate Limiting:** More sophisticated rate limiting per user
- **Request Size Limiting:** Prevent large payload attacks

#### User Experience
- **Property Comparison UI:** Integrate comparison hook with UI component
- **Favorites in New Pages:** Add favorites to App Router pages
- **Property Gallery:** Enhanced image gallery with zoom
- **Save Search Alerts:** Email alerts for saved searches

#### Content Management
- **Rich Text Editor:** Better editor for articles and pages
- **Image Cropping:** Crop images before upload
- **Bulk Actions:** Bulk update/delete in admin
- **Content Scheduling:** Schedule content publication

---

### Medium Term (Next 6 Months)

#### Advanced Features
- **Real-time Notifications:** WebSocket for live updates
- **Chat System:** In-app messaging between users and agents
- **Property Alerts:** Price change alerts, new listing alerts
- **Market Analysis:** Property market trends and analytics
- **Virtual Tours:** 3D property tours integration

#### Mobile Application
- **React Native App:** Mobile app for iOS and Android
- **Push Notifications:** Property alerts and updates
- **Offline Mode:** View properties offline
- **Native Maps:** Better map performance on mobile

#### Marketing & SEO
- **Blog Integration:** Advanced blog features
- **Social Sharing:** Enhanced social media sharing
- **SEO Tools:** Advanced SEO optimization
- **Lead Generation:** Lead capture forms and funnels

#### Reporting
- **Advanced Analytics:** More detailed analytics dashboard
- **Custom Reports:** Generate custom reports
- **Data Export:** Export data in various formats
- **Performance Metrics:** Track key performance indicators

---

### Long Term (Next 12 Months)

#### Platform Expansion
- **Multi-Tenancy:** Support multiple real estate agencies
- **White Labeling:** Custom branding for partners
- **API Platform:** Public API for third-party integrations
- **Marketplace:** Property marketplace for multiple agents

#### AI Integration
- **Property Valuation AI:** Automated property valuation
- **Recommendation Engine:** Property recommendations based on preferences
- **Chatbot:** AI-powered customer support
- **Image Recognition:** Auto-tag property images

#### Advanced Infrastructure
- **Microservices:** Split into separate services
- **Event-Driven Architecture:** Message queue for async tasks
- **GraphQL:** Consider GraphQL for flexible data fetching
- **Multi-Region Deployment:** Deploy in multiple regions

#### Compliance & Privacy
- **GDPR Compliance:** Full GDPR compliance features
- **Data Anonymization:** Advanced data anonymization
- **Right to be Forgotten:** Complete data deletion
- **Privacy Dashboard:** User privacy controls

---

## Technical Debt

### High Priority

1. **Backend Test Configuration** - Fix ESM issues
2. **Legacy Page Migration** - Complete App Router migration
3. **No Refresh Tokens** - Implement refresh token mechanism

### Medium Priority

1. **No Integration Tests** - Add API integration tests
2. **No E2E Tests** - Add end-to-end tests
3. **No API Documentation** - Implement or remove Swagger
4. **Error Handling** - Improve error messages and logging

### Low Priority

1. **Type Safety** - Improve TypeScript strictness
2. **Code Duplication** - Remove duplicate code
3. **Component Organization** - Better component structure
4. **Naming Conventions** - Consistent naming across codebase

---

## Dependencies

### Security Updates

**Regular Updates Required:**
- Security patches for Node.js
- Security patches for dependencies
- Update to latest stable versions
- Monitor for CVEs

**Current Versions:**
- Node.js: v18+ (recommend v20+)
- Next.js: 15.0.0
- React: 19.3.0
- Express: 4.21.2
- TypeORM: 1.1.1

### Deprecated Dependencies

**Remove/Replace:**
- Swagger dependencies (if not implementing)
- Any deprecated packages
- Unused dependencies

---

## Technology Stack Evolution

### Consider Evaluating

**Frontend:**
- Consider migrating from Next.js 15 to latest stable
- Evaluate new React features
- Consider alternative state management (Zustand, Jotai)

**Backend:**
- Consider Fastify instead of Express (better performance)
- Evaluate Prisma instead of TypeORM (better TypeScript support)
- Consider tRPC for type-safe APIs

**Database:**
- Evaluate Neon for better development experience
- Consider read replicas for scaling
- Evaluate TimescaleDB for analytics data

---

## Milestones

### Q4 2026 (October - December)

**Goals:**
- ✅ Complete core platform (done)
- 🔄 Fix backend test configuration
- 🔄 Complete 50% of legacy page migration
- 📋 Implement refresh tokens
- 📋 Add integration tests

**Success Metrics:**
- Backend tests passing
- 46 legacy pages migrated
- Refresh token implementation
- 50% API coverage

### Q1 2027 (January - March)

**Goals:**
- Complete legacy page migration
- Add E2E tests
- Implement API documentation
- Add 2FA/MFA
- Launch mobile app MVP

**Success Metrics:**
- 0 legacy pages remaining
- E2E tests for critical flows
- API documentation complete
- 2FA for admin accounts
- Mobile app beta testing

### Q2 2027 (April - June)

**Goals:**
- Launch mobile app
- Add real-time notifications
- Implement advanced analytics
- Add AI property valuation
- Launch multi-tenant support

**Success Metrics:**
- Mobile app in app stores
- WebSocket notifications working
- Advanced analytics dashboard
- AI valuation accuracy > 80%
- 3 agency partners onboarded

---

## Resource Allocation

### Development Team

**Recommended Team Size:**
- 1 Full-stack Developer (current)
- 1 Frontend Developer (recommended)
- 1 Backend Developer (recommended)
- 1 QA Engineer (recommended)
- 1 DevOps Engineer (part-time, recommended)

### Time Allocation

**Current (Solo Developer):**
- 40% feature development
- 30% bug fixes
- 20% maintenance
- 10% documentation

**Recommended (Team):**
- 50% feature development
- 20% bug fixes
- 15% maintenance
- 10% testing
- 5% documentation

---

## Risk Assessment

### Technical Risks

**High Risk:**
- Backend test configuration failure
- Legacy page migration complexity
- Third-party service dependencies (Brevo, Supabase)

**Medium Risk:**
- Security vulnerabilities in dependencies
- Performance issues at scale
- Database migration failures

**Low Risk:**
- UI/UX inconsistencies
- Minor bugs
- Documentation gaps

### Mitigation Strategies

**High Risk Mitigation:**
- Prioritize test configuration fix
- Plan legacy migration carefully with rollback strategy
- Have fallback options for third-party services

**Medium Risk Mitigation:**
- Regular dependency updates
- Performance monitoring
- Test migrations in staging

**Low Risk Mitigation:**
- Regular code reviews
- User testing
- Keep documentation updated

---

## Success Metrics

### Key Performance Indicators (KPIs)

**User Engagement:**
- Monthly active users
- Property views per user
- Inquiry conversion rate
- Time on site

**Technical Performance:**
- Page load time < 2 seconds
- API response time < 200ms
- Uptime > 99.5%
- Error rate < 0.1%

**Business Metrics:**
- Number of properties listed
- Number of inquiries
- Number of viewings scheduled
- Conversion rate (inquiry to viewing)

**Code Quality:**
- Test coverage > 80%
- Bug count < 10 per release
- Code review participation
- Documentation completeness

---

## Feedback Loop

### User Feedback

**Channels:**
- Contact form
- User surveys
- Support tickets
- In-app feedback

**Process:**
1. Collect feedback
2. Categorize feedback
3. Prioritize based on impact
4. Add to roadmap
5. Implement and test
6. Notify users of changes

### Developer Feedback

**Channels:**
- Code reviews
- Team meetings
- Stand-ups
- Retrospectives

**Process:**
1. Regular code reviews
2. Discuss technical decisions
3. Identify improvement areas
4. Update development practices
5. Share knowledge

---

## Conclusion

This roadmap provides a clear path forward for the Ingata Real Estate platform. The immediate focus is on fixing critical issues (backend tests, legacy migration) and improving user experience (refresh tokens). Future enhancements focus on advanced features, mobile application, and AI integration.

The roadmap is flexible and will be updated based on:
- User feedback
- Business priorities
- Technical constraints
- Resource availability
- Market changes

**Next Steps:**
1. Fix backend test configuration (immediate)
2. Continue legacy page migration (ongoing)
3. Implement refresh tokens (near term)
4. Plan for mobile app development (medium term)
5. Evaluate AI integration opportunities (long term)
