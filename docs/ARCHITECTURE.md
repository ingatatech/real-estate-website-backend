# Architecture

**Last Updated:** October 27, 2026

---

## System Architecture Overview

The Ingata Real Estate platform follows a monorepo architecture with separate frontend and backend applications. The system uses a REST API architecture with JWT-based authentication and a PostgreSQL database.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │   Browser    │  │   Browser    │      │
│  │ (Admin)      │  │ (Agent/PM)   │  │ (Public)     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼─────────────────┼─────────────────┼───────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
┌───────────────────────────┼───────────────────────────────────┐
│                 Frontend Layer (Next.js 15)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  App Router Pages (New)                                  │  │
│  │  - Home, Properties, Contact, Services, About            │  │
│  │  - Portal (Login, Dashboard)                             │  │
│  │  - Admin (Login, Dashboard)                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Legacy Pages (92 pages, migration in progress)          │  │
│  │  - Property categories, Services, Legal, Tools            │  │
│  │  - Admin sub-pages (37+ pages)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components & Contexts                                   │  │
│  │  - AuthContext, UI Components, Maps, Analytics            │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┼───────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────┼───────────────────────────────────┐
│              API Gateway (Express.js 4.21)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                         │  │
│  │  - CORS, Helmet, Rate Limiting, Auth, Authorization       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Route Layer (45 route files)                            │  │
│  │  - Auth, Properties, Analytics, Admin, Portal            │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Controller Layer (35 controllers)                        │  │
│  │  - Business logic, validation, data transformation        │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┼───────────────────────────────────┘
                            │
┌───────────────────────────┼───────────────────────────────────┐
│              Data Layer (TypeORM + PostgreSQL)                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Entities (30 entities)                                  │  │
│  │  - Users, Properties, Inquiries, Analytics, etc.         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database (Render)                             │  │
│  │  - 30 tables, indexes, foreign keys                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

External Services:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Brevo SMTP  │  │ Supabase     │  │ Sentry       │  │ Leaflet/OSM  │
│  (Email)     │  │ (Storage)    │  │ (Error Track)│  │ (Maps)       │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

---

## Frontend Architecture

### Technology Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context (AuthContext)
- **Routing:** Next.js App Router + Legacy page wrappers
- **HTTP Client:** Custom API service layer
- **Maps:** Leaflet + React Leaflet
- **Icons:** Lucide React
- **Fonts:** Inter (Google Fonts)

### Directory Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── admin/                   # Admin pages
│   │   ├── dashboard/           # Admin dashboard
│   │   └── [...segments]        # Catch-all for legacy admin
│   ├── portal/                  # Staff portal
│   │   ├── login/               # Portal login
│   │   ├── forgot-password/     # Password reset
│   │   ├── reset-password/      # Password reset form
│   │   ├── dashboard/           # Portal dashboard entry
│   │   └── [...segments]        # Catch-all for portal workspace
│   ├── properties/              # Property pages
│   │   ├── [propertySlug]/      # Dynamic property details
│   │   └── page.tsx             # Properties listing
│   ├── services/                # Service pages
│   ├── about/                   # About section
│   ├── contact/                 # Contact page
│   ├── faqs/                    # FAQ page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── src/
│   ├── components/              # React components
│   │   ├── ui/                  # UI components (Button, Card, Input)
│   │   ├── layout/              # Layout components (Header, Footer)
│   │   ├── auth/                # Auth components (ProtectedRoute)
│   │   ├── routing/             # Route handlers (LegacyPublicRoute)
│   │   ├── portal/              # Portal components
│   │   ├── property/            # Property-specific components
│   │   ├── map/                 # Map components (Leaflet)
│   │   ├── content/             # Content components
│   │   ├── analytics/           # Analytics tracking
│   │   └── consent/             # Cookie consent
│   ├── context/                 # React contexts
│   │   └── AuthContext.tsx      # Authentication state
│   ├── legacy-pages/            # Legacy pages (92 files)
│   │   ├── Admin/               # Admin legacy pages
│   │   ├── Properties/          # Property legacy pages
│   │   ├── Services/            # Service legacy pages
│   │   └── ...                  # Other legacy pages
│   ├── services/                # API services
│   │   ├── api.ts               # Public API client
│   │   ├── adminApi.ts          # Admin API client
│   │   └── portalApi.ts         # Portal API client
│   ├── hooks/                   # Custom hooks
│   │   └── useInactivityLogout.ts
│   ├── utils/                   # Utility functions
│   │   ├── analytics.ts         # Analytics tracking
│   │   ├── consent.ts           # Cookie consent
│   │   ├── metadata.ts          # SEO metadata
│   │   └── rwandaDistricts.ts   # Rwanda location data
│   └── data/                    # Static data
├── public/                      # Static assets
└── package.json
```

### Component Architecture

**Component Hierarchy:**
```
App Layout (SiteShell)
├── Header
│   ├── Navigation
│   └── Mobile Menu
├── Main Content
│   ├── Page Components
│   └── Feature Components
└── Footer
```

**State Management:**
- **AuthContext:** Global authentication state (user, token, isAuthenticated)
- **localStorage:** Token persistence, user role, inactivity logout flag
- **sessionStorage:** Analytics session ID
- **Component State:** Local component state with useState/useReducer

**Routing Strategy:**
1. **App Router:** New pages using Next.js 13+ app directory
2. **Legacy Routing:** Old pages served through catch-all routes
3. **Route Handlers:** 
   - `LegacyPublicRoute` - Maps legacy public routes
   - `LegacyAdminRoute` - Maps legacy admin routes with auth
   - `PortalWorkspace` - Handles portal role-based routing

### API Integration Pattern

**Three API Clients:**
1. **api** - Public API (no authentication)
2. **adminApi** - Admin API (JWT authentication)
3. **portalApi** - Portal API (JWT authentication)

**Request Flow:**
```
Component → API Service → fetch() → Backend API → Response
                 ↓
            Error Handling (401 → redirect, 403 → error)
```

---

## Backend Architecture

### Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js 4.21
- **Language:** TypeScript
- **ORM:** TypeORM 1.1.1
- **Database:** PostgreSQL (Render)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Email:** Nodemailer + Brevo SMTP
- **Media Storage:** Supabase Storage
- **Error Tracking:** Sentry
- **Scheduling:** node-cron

### Directory Structure

```
backend/
├── src/
│   ├── controllers/           # Request handlers (35 files)
│   │   ├── authController.ts
│   │   ├── propertyController.ts
│   │   ├── adminController.ts
│   │   └── ...
│   ├── entities/              # TypeORM entities (30 files)
│   │   ├── User.ts
│   │   ├── Property.ts
│   │   ├── Role.ts
│   │   └── ...
│   ├── routes/                # API routes (45 files)
│   │   ├── authRoutes.ts
│   │   ├── propertyRoutes.ts
│   │   ├── adminRoutes.ts
│   │   └── ...
│   ├── middleware/            # Express middleware (7 files)
│   │   ├── auth.ts            # JWT authentication
│   │   ├── authorize.ts       # Role-based authorization
│   │   ├── rateLimiter.ts     # Rate limiting
│   │   ├── errorHandler.ts    # Global error handling
│   │   ├── validation.ts      # Request validation
│   │   ├── propertyManagerOwnership.ts
│   │   └── csrf.ts            # CSRF protection (disabled)
│   ├── migrations/            # Database migrations (9 files)
│   │   ├── 20261002000001-ResetDatabaseSchema.ts
│   │   └── ...
│   ├── lib/                   # Utility libraries
│   │   ├── typeorm.ts         # TypeORM configuration
│   │   └── passwordResetEmail.ts
│   ├── config/                # Configuration
│   │   ├── env.ts             # Environment variables
│   │   ├── database.ts        # Database configuration
│   │   └── sentry.ts          # Sentry configuration
│   ├── services/              # Background services
│   │   └── scheduledTasks.ts  # Cron jobs
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── database/
│   └── migrations/            # SQL migrations
├── render.yaml                # Render deployment config
└── package.json
```

### Request Flow

```
HTTP Request
    ↓
CORS Middleware
    ↓
Helmet (Security Headers)
    ↓
Rate Limiter
    ↓
Body Parser (express.json)
    ↓
Router (/api/v1)
    ↓
Route Handler
    ↓
requireAuth Middleware (if protected)
    ↓
authorize Middleware (if role-restricted)
    ↓
Controller
    ↓
TypeORM (Database)
    ↓
Response
    ↓
errorHandler (if error)
```

### Middleware Stack

1. **CORS:** Cross-origin resource sharing
2. **Helmet:** Security headers (CSP, HSTS, etc.)
3. **Rate Limiting:** Prevent abuse (4 limiters)
4. **Body Parser:** Parse JSON request bodies
5. **Authentication:** JWT token verification
6. **Authorization:** Role-based access control
7. **Validation:** Request validation
8. **Error Handler:** Global error handling

### Database Layer

**TypeORM Configuration:**
- Connection pooling (DATABASE_URL)
- Direct connection for migrations (DATABASE_URL_UNPOOLED)
- SSL enabled for production
- Query logging in development
- Subscriber for text ID generation

**Entity Relationships:**
- Many-to-one: Property → Agent, Property → Category
- One-to-many: User → Property, User → Inquiry
- Many-to-many: Property ↔ Feature (junction table)
- Cascade deletes for child entities
- SET NULL for analytics on user deletion

---

## Security Architecture

### Authentication
- **JWT Tokens:** Stateless authentication
- **Token Expiration:** 5 minutes (configurable)
- **Password Hashing:** bcrypt with 12 rounds
- **Password Reset:** SHA-256 hashed tokens, 30-minute expiration
- **Account Deactivation:** `is_active` flag

### Authorization
- **Role-Based Access Control (RBAC):** 5 roles
- **Case-Insensitive Role Comparison:** Normalized role names
- **Ownership Checks:** Property managers can only access their properties
- **Agent Assignment:** Agents can only access assigned properties
- **Special Permissions:** `can_upload_property_media` flag

### Rate Limiting
- **API Rate Limiter:** 100 requests/15 minutes
- **Auth Rate Limiter:** 5 requests/15 minutes
- **Contact Rate Limiter:** 3 requests/hour
- **Search Rate Limiter:** 30 requests/minute

### HTTP Security
- **CORS:** Configured allowed origins
- **Helmet:** Security headers (CSP, HSTS, X-Frame-Options)
- **Content Security Policy:** Allows Leaflet resources
- **Cross-Origin Embedder Policy:** Disabled for Leaflet maps

### Input Validation
- **Validation Middleware:** Generic validator factory
- **Email Validation:** Regex validation for password reset
- **Password Length:** 8-128 characters
- **Token Format:** 64 hex characters for reset tokens

### Error Handling
- **Global Error Handler:** Catches all errors
- **Sentry Integration:** Error tracking with sensitive header filtering
- **Production vs Development:** Generic vs detailed error messages

---

## Data Flow Architecture

### Property Listing Flow
```
User (Property Manager/Admin)
    ↓
Create Property Form
    ↓
POST /api/v1/admin/properties
    ↓
adminPropertyController.createAdminProperty
    ↓
TypeORM: Insert into properties table
    ↓
Property Manager Ownership Middleware (auto-assign)
    ↓
Upload Media (Supabase Storage)
    ↓
Update property_images table
    ↓
Response: Property created
```

### Inquiry Flow
```
User (Public)
    ↓
Property Inquiry Form
    ↓
POST /api/v1/inquiries
    ↓
inquiryController.createInquiry
    ↓
Rate Limiter Check (3 req/hour)
    ↓
TypeORM: Insert into inquiries table
    ↓
Assign to Property Agent (if exists)
    ↓
Create Agent Inquiry Note (empty)
    ↓
Response: Inquiry created
    ↓
Agent Dashboard: View inquiry
    ↓
Agent adds notes, sets follow-up date
```

### Analytics Tracking Flow
```
User (Public/Authenticated)
    ↓
Page Load / Property View / Click
    ↓
Frontend: analytics.ts utilities
    ↓
POST /api/v1/analytics/page-view
POST /api/v1/analytics/property-view
POST /api/v1/analytics/click-event
    ↓
analyticsController.track*
    ↓
TypeORM: Insert into analytics tables
    ↓
Async processing (no response delay)
    ↓
Scheduled Task: Daily cleanup at 2:00 AM UTC
    ↓
Delete records older than retention period
```

---

## Deployment Architecture

### Frontend Deployment (Vercel)
- **Platform:** Vercel
- **Build:** Next.js build (TypeScript compilation)
- **Environment Variables:** NEXT_PUBLIC_API_URL, NEXT_PUBLIC_BASE_URL
- **Domain:** ingata-real-estate.vercel.app
- **Automatic Deployment:** Git push triggers build

### Backend Deployment (Render)
- **Platform:** Render.com
- **Build:** TypeScript compilation (`npm run build`)
- **Runtime:** Node.js
- **Database:** Render PostgreSQL (free tier)
- **Environment Variables:** DATABASE_URL, JWT_SECRET, SMTP config, etc.
- **Domain:** ingata-backend.onrender.com
- **Automatic Deployment:** Git push triggers build
- **Migrations:** Manual execution via Render Shell

### Infrastructure as Code
- **render.yaml:** Defines backend service and database
- **Blueprint Deployment:** One-click deployment from render.yaml
- **Environment Variables:** Configured in render.yaml (some sync: false)

---

## Scalability Considerations

### Current Limitations
- **No Caching:** All queries hit primary database
- **No Read Replicas:** Single database instance
- **No Connection Pooling Config:** Uses TypeORM defaults
- **No Load Balancing:** Single Render instance
- **No CDN for API:** Direct API calls

### Future Scalability Options
- **Redis Caching:** Cache frequently accessed data (properties, categories)
- **Database Read Replicas:** Distribute read load
- **Connection Pooling:** Configure TypeORM pool size
- **Horizontal Scaling:** Multiple backend instances with load balancer
- **CDN for Static Assets:** Use CloudFront or similar
- **API Rate Limiting:** More sophisticated rate limiting per user

---

## Monitoring and Observability

### Current Implementation
- **Sentry:** Error tracking and logging
- **Console Logging:** Development logging
- **Analytics:** Custom page view and click tracking
- **Health Check:** `/api/v1/health` endpoint

### Recommended Additions
- **APM:** Application Performance Monitoring (e.g., New Relic, Datadog)
- **Metrics:** Prometheus metrics for request latency, error rates
- **Logs:** Centralized logging (e.g., LogRocket, Papertrail)
- **Uptime Monitoring:** External uptime monitoring (e.g., UptimeRobot)
- **Database Monitoring:** Query performance monitoring

---

## Technology Rationale

### Why Next.js 15?
- App Router for better routing and server components
- Built-in optimization (image, font, script)
- Excellent TypeScript support
- Strong community and documentation

### Why Express.js?
- Mature and stable framework
- Extensive middleware ecosystem
- Simple and flexible
- Good performance for REST APIs

### Why TypeORM?
- TypeScript-first ORM
- Active Record and Data Mapper patterns
- Good migration system
- Active community

### Why PostgreSQL?
- Robust relational database
- Excellent JSON support
- ACID compliance
- Strong ecosystem

### Why JWT?
- Stateless authentication
- Easy to implement
- Widely supported
- Good for REST APIs

### Why Leaflet?
- Open-source and free
- No API key required
- Lightweight
- Good performance

### Why Supabase Storage?
- Easy file upload API
- Generous free tier
- Good documentation
- Built-in CDN

---

## Design Patterns

### Repository Pattern
- TypeORM entities act as repositories
- `AppDataSource.getRepository(Entity)` for data access
- Encapsulates database operations

### Middleware Pattern
- Express middleware for cross-cutting concerns
- Auth, authorization, rate limiting, error handling
- Reusable across routes

### Factory Pattern
- Validation middleware factory
- Creates validation middleware from validator functions

### Context Pattern (Frontend)
- React Context for global state
- AuthContext for authentication state
- Avoids prop drilling

### Service Layer Pattern
- Controllers handle HTTP concerns
- Business logic in controllers (could be extracted to services)
- Database operations via TypeORM

---

## Future Architecture Improvements

### Short Term
1. **Refresh Token Implementation:** Reduce frequent re-authentication
2. **API Documentation:** Implement Swagger/OpenAPI
3. **Caching Layer:** Add Redis for frequently accessed data
4. **Backend Tests:** Fix Jest ESM configuration and add tests

### Medium Term
1. **Microservices:** Consider splitting into separate services
2. **Event-Driven Architecture:** Implement message queue for async tasks
3. **GraphQL:** Consider GraphQL for flexible data fetching
4. **Real-time Features:** WebSocket for live updates

### Long Term
1. **Multi-Tenancy:** Support multiple real estate agencies
2. **Mobile App:** React Native or Flutter mobile application
3. **AI Integration:** Property valuation predictions, recommendations
4. **Advanced Analytics:** Machine learning for market insights
