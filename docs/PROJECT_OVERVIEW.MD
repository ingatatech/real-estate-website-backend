# Project Overview

## Ingata Real Estate Platform

**Last Updated:** October 27, 2026  
**Status:** Production Deployed (Vercel Frontend + Render Backend)  
**Version:** 1.0.0

---

## Executive Summary

Ingata Real Estate is a full-stack web application for managing property listings, inquiries, viewings, and content. The platform supports multiple user roles (Admin, Agent, Property Manager, Content Editor, User) with role-based access control, authentication, and analytics tracking.

### Key Features
- Property listing management with images/videos
- Multi-role user system with permissions
- Property inquiries and viewing requests
- Content management system (articles, pages, FAQs)
- Analytics tracking (page views, property views, click events)
- Password reset via email
- Responsive design with Tailwind CSS
- Interactive maps with Leaflet
- Property comparison and calculators

### Technology Stack
- **Backend:** Node.js, Express.js, TypeScript, TypeORM, PostgreSQL (Render/Neon)
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Authentication:** JWT with bcryptjs (5-minute token expiration)
- **Database:** PostgreSQL via TypeORM (Render PostgreSQL)
- **Email:** Nodemailer with Brevo SMTP
- **Media Storage:** Supabase Storage
- **Maps:** Leaflet + OpenStreetMap (no API key required)
- **Error Tracking:** Sentry
- **Deployment:** Vercel (frontend), Render.com (backend)

---

## Project Structure

```
realestateweb/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── controllers/       # Request handlers (35 files)
│   │   ├── entities/          # TypeORM models (30 entities)
│   │   ├── routes/            # API routes (45 files)
│   │   ├── middleware/        # Auth, authorization, validation (7 files)
│   │   ├── migrations/        # Database migrations (9 files)
│   │   ├── lib/               # TypeORM config, email utilities
│   │   ├── config/            # Database and environment config
│   │   ├── services/          # Scheduled tasks
│   │   ├── app.ts             # Express app setup
│   │   └── server.ts          # Server entry point
│   ├── database/
│   │   └── migrations/        # SQL migrations
│   ├── render.yaml            # Render deployment configuration
│   └── package.json
├── frontend/                   # Next.js 15 application
│   ├── app/                   # App Router pages
│   │   ├── admin/            # Admin dashboard
│   │   ├── portal/           # Staff portal (agent/PM/editor)
│   │   ├── properties/       # Property pages
│   │   ├── services/         # Services pages
│   │   ├── about/            # About section
│   │   ├── contact/          # Contact page
│   │   ├── faqs/             # FAQ page
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Homepage
│   ├── src/
│   │   ├── components/       # React components (25+ components)
│   │   ├── context/          # React contexts (AuthContext)
│   │   ├── legacy-pages/     # Legacy pages (92 files, migration in progress)
│   │   ├── services/         # API client (api.ts, portalApi, adminApi)
│   │   ├── hooks/            # Custom React hooks
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   └── package.json
├── docs/                     # Documentation
├── agent.md                  # Development rules
└── backend/README.md         # Backend-specific notes
```

---

## Development Status

### Implemented Features ✅

|| Feature | Status | Notes |
||---------|--------|-------|
|| User Authentication (JWT) | ✅ Complete | Login, register, logout, profile update, 5-min token expiration |
|| Admin Dashboard | ✅ Complete | Full CRUD for all entities |
|| Agent Dashboard | ✅ Complete | Manage assigned properties, inquiries, viewings |
|| Property Manager Dashboard | ✅ Complete | Manage properties, assign agents, approve listings |
|| Content Editor Dashboard | ✅ Complete | CMS for articles, pages, FAQs |
|| Property Listings | ✅ Complete | CRUD with images/videos, categories, features |
|| Property Search | ✅ Complete | Advanced search with filters and map view |
|| Inquiries | ✅ Complete | Property inquiries with status tracking |
|| Viewing Requests | ✅ Complete | Schedule and manage property viewings |
|| Listing Requests | ✅ Complete | User-submitted listings with approval workflow |
|| Valuation Requests | ✅ Complete | Property valuation requests |
|| Contact Form | ✅ Complete | Contact messages with reply functionality |
|| Articles/Insights | ✅ Complete | Blog with categories and publishing workflow |
|| FAQs | ✅ Complete | FAQ management with categories |
|| Services | ✅ Complete | Service offerings management |
|| Testimonials | ✅ Complete | Customer testimonials |
|| Site Settings | ✅ Complete | Configurable site-wide settings |
|| Analytics Tracking | ✅ Complete | Page views, property views, click events |
|| Analytics Dashboard | ✅ Complete | Role-based analytics access |
|| Password Reset | ✅ Complete | Email-based password reset (Brevo SMTP) |
|| Favorites | ✅ Complete | User favorite properties |
|| Agent Profiles | ✅ Complete | Public agent directory with profiles |
|| Property Categories | ✅ Complete | Hierarchical property categorization |
|| Article Categories | ✅ Complete | Article categorization (10 predefined categories) |
|| Site Pages | ✅ Complete | Static page CMS |
|| Related Properties | ✅ Complete | Similar properties shown on property details page |
|| SEO Optimization | ✅ Complete | Sitemap, structured data, dynamic meta tags |
|| Why Choose Us Section | ✅ Complete | Homepage section with 5 value propositions |
|| How It Works Section | ✅ Complete | Customer journey section on homepage |
|| Property Features Management | ✅ Complete | Admin UI for property features CRUD |
|| Development Management | ✅ Complete | Admin UI for developments CRUD |
|| CSRF Protection | ✅ Complete | Helmet middleware implemented (disabled for JWT API) |
|| Rate Limiting | ✅ Complete | API, auth, contact, search limiters implemented |
|| Error Tracking | ✅ Complete | Sentry integration configured |
|| CI/CD Pipeline | ✅ Complete | Render (backend) and Vercel (frontend) auto-deploy on git push |
|| Property Comparison | ✅ Complete | Compare up to 5 properties side-by-side |
|| Mortgage Calculator | ✅ Complete | Calculate monthly mortgage payments with breakdown |
|| Rental Yield Calculator | ✅ Complete | Calculate gross and net rental yields |
|| Maps Integration | ✅ Complete | Leaflet + OpenStreetMap with property markers |
|| Media Upload | ✅ Complete | Supabase Storage configured (max 100MB files) |
|| Analytics Data Cleanup | ✅ Complete | Automated daily cleanup via node-cron |
|| Agent Inquiry Notes | ✅ Complete | Agents can add notes and follow-up dates to inquiries |
|| Property Manager Ownership | ✅ Complete | Property managers can own and manage properties |
|| Cookie Consent | ✅ Complete | GDPR-compliant cookie consent management |
|| Inactivity Logout | ✅ Complete | 5-minute timeout with 3-minute warning |

### Partially Implemented Features ⚠️

|| Area | Status | Progress |
||------|--------|---------|
|| Frontend App Router Migration | ✅ Complete | All 91+ pages migrated to app/ directory |
|| Legacy Page Cleanup | ✅ Complete | No legacy pages remain |
|| Backend Testing | ⚠️ Broken | 3 test files exist but ESM configuration prevents execution |

### Unimplemented Features ❌

*No core unimplemented features at this time.*

---

## Database Overview

### Database: PostgreSQL (Render)

**Total Tables:** 30  
**Migrations:** 9  
**ORM:** TypeORM

### Core Tables

#### Authentication & Users
- `roles` - User roles (admin, agent, user, property_manager, content_editor)
- `users` - User accounts with authentication fields, password reset tokens

#### Property Management
- `properties` - Property listings with full details
- `property_categories` - Property categories
- `property_features` - Available features
- `property_feature_links` - Property-feature junction table
- `property_images` - Property media (images/videos)
- `developments` - Real estate developments

#### Agents
- `agents` - Agent profiles
- `agent_inquiry_notes` - Agent notes and follow-ups on inquiries

#### Content Management
- `articles` - Blog articles
- `article_categories` - Article categories (10 predefined)
- `site_pages` - Static site pages
- `site_settings` - Site-wide configuration
- `services` - Service offerings
- `testimonials` - Customer testimonials
- `faqs` - Frequently asked questions

#### User Interactions
- `inquiries` - Property inquiries
- `viewing_requests` - Property viewing requests
- `listing_requests` - Property listing requests
- `valuation_requests` - Property valuation requests
- `property_searches` - Saved property searches
- `favorites` - User favorite properties
- `contact_messages` - Contact form submissions
- `service_requests` - Service inquiry requests

#### Analytics
- `page_views` - Page view tracking with UTM parameters
- `property_views` - Property detail view tracking with session duration
- `click_events` - User interaction tracking (phone, email, WhatsApp, buttons)

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for detailed schema documentation.

---

## API Overview

### Base URL
- Development: `http://localhost:5000/api/v1`
- Production: `https://ingata-backend.onrender.com/api/v1` (Render)

### API Structure

**Public Routes (No Auth):**
- Authentication: `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`
- Properties: `/properties`, `/categories`
- Agents: `/agents`
- Content: `/articles`, `/faqs`, `/services`, `/pages`
- Interactions: `/contact`, `/inquiries`, `/viewings`, `/valuations`, `/listings`
- Analytics: `/analytics/page-view`, `/analytics/property-view`, `/analytics/click-event`

**Admin Routes (Require Admin Role):**
- `/admin/*` - Full CRUD for all entities
- `/admin/dashboard` - Dashboard stats
- `/admin/users` - User management
- `/admin/properties` - Property management
- `/admin/inquiries` - Inquiry management
- `/admin/analytics` - Analytics dashboard

**Agent Routes (Require Agent Role):**
- `/agent-dashboard/my-properties` - Agent's properties
- `/agent-dashboard/my-inquiries` - Agent's inquiries
- `/agent-dashboard/my-viewings` - Agent's viewings

**Property Manager Routes (Require Property Manager Role):**
- `/property-manager` - Managed properties
- `/property-manager/inquiries` - Managed inquiries
- `/property-manager/viewings` - Managed viewings
- `/property-manager/requests` - Listing requests

**Content Editor Routes (Require Content Editor Role):**
- `/content-editor/articles` - Article CMS
- `/content-editor/pages` - Page CMS
- `/content-editor/faqs` - FAQ CMS

See [API_REFERENCE.md](API_REFERENCE.md) for complete API documentation.

---

## User Roles

### 1. Admin
**Access:** `/admin/login` → `/admin/dashboard`

**Capabilities:**
- Full system access
- User and role management
- Property, category, and content management
- Analytics access (all data)
- Site settings configuration
- Bypasses property manager ownership checks

### 2. Agent
**Access:** `/portal/login` → `/portal/dashboard`

**Capabilities:**
- Manage assigned properties
- Handle inquiries for assigned properties
- Schedule viewings
- Upload property media
- Add notes and follow-up dates to inquiries
- View analytics for assigned properties

### 3. Property Manager
**Access:** `/portal/login` → `/portal/dashboard`

**Capabilities:**
- Manage properties assigned to them
- Assign agents to properties
- Approve/reject listing requests
- Handle inquiries and viewings
- Upload property media
- Create developments and property features
- View analytics for managed properties

### 4. Content Editor
**Access:** `/portal/login` → `/portal/dashboard`

**Capabilities:**
- Create/edit articles
- Create/edit site pages
- Create/edit FAQs
- Create/edit testimonials
- Publish/unpublish content
- Upload media

### 5. User (Public)
**Access:** No login required for most features

**Capabilities:**
- Browse properties
- View property details
- Submit inquiries
- Request viewings
- Save favorites
- Read articles
- Contact support
- Register and login
- Update profile

See [USER_ROLES_AND_FEATURES.md](USER_ROLES_AND_FEATURES.md) for detailed role documentation.

---

## Authentication Flow

### Login Process
1. User submits email and password to `/auth/login` or `/auth/admin/login`
2. Server validates credentials with bcrypt (12 rounds)
3. Server generates JWT token (5-minute expiration)
4. Server returns `{ token, user }`
5. Client stores token in localStorage (`admin_token`)
6. Client includes token in `Authorization: Bearer <token>` header
7. Frontend auto-logout after 5 minutes of inactivity (with 3-minute warning)

### Password Reset Flow
1. User submits email to `/auth/forgot-password`
2. Server generates reset token (32 bytes, SHA-256 hashed)
3. Server sends email with reset link via Brevo SMTP
4. User clicks link and enters new password
5. Server validates token and expiration (30 minutes)
6. Server updates password and clears token
7. Token is single-use and expires in 30 minutes

See [AUTHENTICATION_AND_PERMISSIONS.md](AUTHENTICATION_AND_PERMISSIONS.md) for detailed authentication documentation.

---

## Development Prerequisites

### Required Software
- Node.js (v18 or higher recommended)
- npm or yarn
- PostgreSQL database (Neon or Render recommended)
- Git

### Required Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://...
DATABASE_URL_UNPOOLED=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=5m
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email (Brevo SMTP)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your-email@brevo.com
EMAIL_PASSWORD=your-brevo-api-key
EMAIL_FROM=noreply@ingata.com

# Supabase Storage (optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-secret-key
SUPABASE_PROPERTY_MEDIA_BUCKET=property-media

# Sentry (optional)
SENTRY_DSN=your-sentry-dsn

# Scheduled Tasks
ENABLE_SCHEDULED_TASKS=true
```

**Frontend (.env):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd realestateweb
```

### 2. Install Dependencies
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment
```bash
# Copy and configure backend/.env
cd backend
cp .env.example .env  # (if example exists)
# Edit .env with your values
```

### 4. Setup Database
```bash
cd backend
npm run migration:run
npm run seed
```

### 5. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Access Applications
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1
- Admin Dashboard: http://localhost:3000/admin
- Staff Portal: http://localhost:3000/portal

See [INSTALLATION_AND_SETUP.md](INSTALLATION_AND_SETUP.md) for detailed setup instructions.

---

## Known Issues

### Critical Issues
1. **Backend Tests Broken:** Jest configured with 3 test files but ESM syntax error prevents execution. Tests need configuration fix to work with TypeScript ESM.

### Medium Priority
1. **Legacy Page Migration:** 92 legacy pages in src/legacy-pages need migration to App Router. Hybrid routing preserves functionality but cleanup needed.

### Low Priority
1. **No Refresh Token:** Users must re-authenticate every 5 minutes (JWT expiration). Consider adding refresh token implementation.
2. **Swagger Dependencies:** swagger-jsdoc and swagger-ui-express are installed but not used. Can be removed if not planning to implement API documentation.

See [TESTING_AND_KNOWN_ISSUES.md](TESTING_AND_KNOWN_ISSUES.md) for complete issue tracking.

---

## Documentation Index

- [README.md](../README.md) - Root project README
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture and design patterns
- [INSTALLATION_AND_SETUP.md](INSTALLATION_AND_SETUP.md) - Detailed setup instructions
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Complete database schema documentation
- [API_REFERENCE.md](API_REFERENCE.md) - Full API endpoint reference
- [AUTHENTICATION_AND_PERMISSIONS.md](AUTHENTICATION_AND_PERMISSIONS.md) - Authentication and authorization details
- [USER_ROLES_AND_FEATURES.md](USER_ROLES_AND_FEATURES.md) - Role-based feature documentation
- [TESTING_AND_KNOWN_ISSUES.md](TESTING_AND_KNOWN_ISSUES.md) - Testing status and known issues
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) - Future development plans
- [SECURITY.md](SECURITY.md) - Security documentation
- [ANALYTICS.md](ANALYTICS.md) - Analytics implementation details

---

## Support and Maintenance

### Development Rules
See `agent.md` in the project root for development guidelines and rules.

### Code Quality
- TypeScript strict mode enabled
- ESLint configured
- Frontend tests: 32 tests passing (Jest)
- Backend tests: Broken (ESM configuration issue)
- Incremental development workflow

### Git Workflow
- Main branch for production
- Feature branches for new features
- Commit with clear messages
- No force pushing to main

---

## License

[Specify your license here - currently not specified in package.json]

---

## Contributors

[Add contributor information here]

---

## Changelog

### Version 1.0.0 (October 2026)
- Initial release
- Core platform features implemented
- Multi-role user system
- Analytics tracking
- Content management system
- Password reset functionality
- Media upload with Supabase
- Interactive maps with Leaflet
- Property comparison and calculators
