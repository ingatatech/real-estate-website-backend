# Changelog

All notable changes to the Ingata Real Estate Platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - October 27, 2026

### Added
- Initial release of Ingata Real Estate Platform
- Multi-role user system (Admin, Agent, Property Manager, Content Editor, User)
- Property listing management with images/videos
- Advanced property search with filters and map view
- Property inquiries and viewing requests
- Property valuation requests
- Content management system (articles, FAQs, pages, testimonials)
- Analytics tracking (page views, property views, click events)
- Password reset via email (Brevo SMTP)
- Interactive maps with Leaflet + OpenStreetMap
- Property comparison tool with side-by-side UI
- Mortgage and rental yield calculators
- Agent profiles and directory
- Responsive design with Tailwind CSS
- Next.js 15 App Router architecture
- Express.js backend with TypeORM
- PostgreSQL database with 30 tables
- JWT authentication with refresh token rotation
- Media upload with Supabase Storage
- Error tracking with Sentry
- Cookie consent management
- Inactivity logout with 3-minute warning
- Scheduled tasks for analytics cleanup
- Refresh token mechanism with rotation
- Standard password complexity requirements (uppercase, lowercase, numbers, special chars)
- Account lockout mechanism with configurable max attempts
- Email verification for new accounts
- Configurable security settings in admin dashboard
- Favorites functionality in App Router pages
- Enhanced property gallery with zoom functionality
- Saved search email alerts for new property matches
- Social media links (X, LinkedIn, Facebook, Instagram)

### Fixed
- Next.js production build errors (October 27, 2026)
  - Fixed PropertySearch.tsx syntax error (character encoding issue with apostrophe)
  - Fixed import path in terms-and-conditions page (backslash to forward slash)
  - Replaced missing LegacyAdminRoute component with redirect to admin dashboard
  - Fixed AdminDashboard Link components (changed `to=` to `href=` for Next.js Link)
  - Fixed PropertyDetails ImageViewer props (pass full media objects instead of just imageUrl strings)
  - Added Suspense boundaries for useSearchParams usage in property-search and request-viewing pages
  - Fixed useSearchParams type conflicts in PropertySearch with type casting
- Admin workspace audit and bug fixes
  - Resolved dashboard duplication issues
  - Fixed property requests routing
  - Added user edit modal
  - Implemented security settings UI
- Contact form inquiry message field
  - Changed from input to textarea for better user experience

### Changed
- Updated all documentation to reflect current project state
- Enhanced backend README with detailed API structure and configuration
- Enhanced frontend README with comprehensive development guide
- Updated TESTING_AND_KNOWN_ISSUES.md with recent build fixes
- Updated DEPLOYMENT.md with deployment status section
- Migrated all 91+ legacy pages to Next.js App Router
- Updated social media links with actual brand URLs
- Improved security with rate limiting and configurable settings

### Known Issues
- Backend tests broken due to ESM configuration issue (Jest not handling ESM properly)
- Swagger dependencies installed but not used

---

## [Unreleased]

### Planned
- Fix backend Jest ESM configuration to enable testing
- Complete legacy page migration to App Router
- Implement refresh token mechanism for better user experience
- Remove unused Swagger dependencies or implement API documentation
- Update social media links with actual URLs
- Add automated email testing
- Document backup strategy
- Improve accessibility (WCAG 2.1 AA compliance)
- Add E2E tests with Playwright or Cypress
- Implement API versioning strategy
- Add APM and monitoring tools
