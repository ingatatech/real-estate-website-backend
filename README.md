# Ingata Real Estate Backend

Express.js API server for the Ingata Real Estate platform with TypeScript, TypeORM, and PostgreSQL.

**Version:** 1.0.0
**Status:** Production Deployed
**Last Updated:** October 27, 2026

---

## Overview

This is the backend API server for the Ingata Real Estate platform. It provides RESTful APIs for property management, user authentication, content management, and analytics.

**Production URL:** https://ingata-backend.onrender.com/api/v1

---

## Quick Start

### Prerequisites
- Node.js v18 or higher
- PostgreSQL database (Neon or Render recommended)
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd realestateweb/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run migration:run
npm run seed

# Start development server
npm run dev
```

### Access
- Backend API: http://localhost:5000/api/v1
- Health check: http://localhost:5000/api/v1/health

---

## Project Structure

```
backend/
├── src/
│   ├── controllers/       # Request handlers (35 files)
│   ├── entities/          # TypeORM models (30 entities)
│   ├── routes/            # API routes (45 files)
│   ├── middleware/        # Auth, rate limiting, validation (7 files)
│   ├── migrations/        # Database migrations (9 files)
│   ├── lib/               # TypeORM config, email utilities
│   ├── config/            # Database and environment config
│   ├── services/          # Scheduled tasks
│   ├── app.ts             # Express app setup
│   └── server.ts          # Server entry point
├── database/
│   └── migrations/        # SQL migrations
├── render.yaml            # Render deployment configuration
├── package.json
└── tsconfig.json
```

---

## Technology Stack

- **Framework:** Express.js 4.21
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT with bcryptjs
- **Email:** Nodemailer + Brevo SMTP
- **Storage:** Supabase Storage
- **Error Tracking:** Sentry
- **Scheduled Tasks:** node-cron

---

## Development

### Running the Server

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start
```

### Type Checking

```bash
npm run typecheck
```

### Testing

**Status:** ⚠️ Currently broken due to ESM configuration issue

```bash
npm test
```

See `../docs/TESTING_AND_KNOWN_ISSUES.md` for details on fixing the test configuration.

---

## Environment Variables

### Required

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_URL_UNPOOLED=postgresql://user:password@host:port/database
JWT_SECRET=your-very-secure-random-secret-key-at-least-32-characters
JWT_EXPIRES_IN=5m
FRONTEND_URL=http://localhost:3000
```

### Optional (Email)

```env
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your-email@brevo.com
EMAIL_PASSWORD=your-brevo-api-key
EMAIL_FROM=noreply@ingata.com
```

### Optional (Supabase Storage)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-supabase-secret-key
SUPABASE_PROPERTY_MEDIA_BUCKET=property-media
SUPABASE_DEVELOPMENT_MEDIA_BUCKET=development-media
```

### Optional (Sentry)

```env
SENTRY_DSN=your-sentry-dsn
```

### Optional (Scheduled Tasks)

```env
ENABLE_SCHEDULED_TASKS=true
```

---

## Database Management

### Run Migrations

```bash
npm run migration:run
```

### Seed Database

```bash
npm run seed
npm run seed:article-categories
```

### Reset Database

⚠️ **Warning:** This will delete all data!

```bash
npm run migration:run  # Runs ResetDatabaseSchema migration
```

---

## API Endpoints

### Public Routes
- `/api/v1/auth/login` - User login
- `/api/v1/auth/register` - User registration
- `/api/v1/auth/forgot-password` - Request password reset
- `/api/v1/auth/reset-password` - Reset password
- `/api/v1/properties` - Property listings
- `/api/v1/categories` - Property categories
- `/api/v1/agents` - Agent profiles
- `/api/v1/articles` - Blog articles
- `/api/v1/faqs` - FAQs
- `/api/v1/services` - Services
- `/api/v1/contact` - Contact form
- `/api/v1/inquiries` - Property inquiries
- `/api/v1/viewings` - Viewing requests
- `/api/v1/valuations` - Valuation requests
- `/api/v1/analytics/*` - Analytics tracking

### Admin Routes (Require Admin Role)
- `/api/v1/admin/*` - Full CRUD for all entities
- `/api/v1/admin/dashboard` - Dashboard statistics
- `/api/v1/admin/users` - User management
- `/api/v1/admin/analytics` - Analytics dashboard

### Agent Routes (Require Agent Role)
- `/api/v1/agent-dashboard/*` - Agent-specific endpoints

### Property Manager Routes (Require Property Manager Role)
- `/api/v1/property-manager/*` - Property manager endpoints

### Content Editor Routes (Require Content Editor Role)
- `/api/v1/content-editor/*` - Content management endpoints

See `../docs/API_REFERENCE.md` for complete API documentation.

---

## Authentication

### JWT Token Flow

1. User submits credentials to `/api/v1/auth/login`
2. Server validates credentials with bcrypt (12 rounds)
3. Server generates JWT token (5-minute expiration)
4. Server returns `{ token, user }`
5. Client includes token in `Authorization: Bearer <token>` header
6. Server validates token on protected routes

### Password Reset Flow

1. User submits email to `/api/v1/auth/forgot-password`
2. Server generates reset token (32 bytes, SHA-256 hashed)
3. Server sends email with reset link via Brevo SMTP
4. User clicks link and enters new password
5. Server validates token and expiration (30 minutes)
6. Server updates password and clears token

---

## Rate Limiting

The backend implements multiple rate limiters:

- **API Rate Limiter:** 100 requests per 15 minutes per IP
- **Auth Rate Limiter:** 5 requests per 15 minutes per IP
- **Contact Rate Limiter:** 3 requests per hour per IP
- **Search Rate Limiter:** 20 requests per minute per IP

---

## Error Tracking

Sentry is configured for error tracking. To enable:

1. Set `SENTRY_DSN` environment variable
2. Errors will be automatically tracked
3. Performance monitoring available (optional)

---

## Deployment

### Render Deployment

The backend is deployed on Render.com using `render.yaml` configuration.

**Deploy via Blueprint:**
1. Connect GitHub repository to Render
2. Render detects `render.yaml`
3. Review and apply blueprint
4. Configure manual environment variables
5. Deploy

**Manual Setup:**
1. Create PostgreSQL database on Render
2. Create web service
3. Set environment variables
4. Deploy

See `../docs/DEPLOYMENT.md` for detailed deployment instructions.

### Post-Deployment

After deployment, run migrations:
```bash
# Via Render Shell
cd /opt/render/project/src
npm run migration:run
```

---

## Known Issues

### Critical
- **Backend Tests Broken:** Jest ESM configuration prevents test execution

### Medium Priority
- **No Refresh Token:** Users must re-authenticate every 5 minutes

### Low Priority
- **Swagger Dependencies:** Installed but not used

See `../docs/TESTING_AND_KNOWN_ISSUES.md` for complete details.

---

## Documentation

See `../docs/` directory for comprehensive documentation:

- **[PROJECT_OVERVIEW.md](../docs/PROJECT_OVERVIEW.md)** - Complete project overview
- **[ARCHITECTURE.md](../docs/ARCHITECTURE.md)** - System architecture
- **[INSTALLATION_AND_SETUP.md](../docs/INSTALLATION_AND_SETUP.md)** - Setup instructions
- **[DATABASE_SCHEMA.md](../docs/DATABASE_SCHEMA.md)** - Database schema
- **[API_REFERENCE.md](../docs/API_REFERENCE.md)** - API documentation
- **[AUTHENTICATION_AND_PERMISSIONS.md](../docs/AUTHENTICATION_AND_PERMISSIONS.md)** - Auth details
- **[TESTING_AND_KNOWN_ISSUES.md](../docs/TESTING_AND_KNOWN_ISSUES.md)** - Testing status
- **[DEPLOYMENT.md](../docs/DEPLOYMENT.md)** - Deployment guide

---

## Development Rules

See `../agent.md` for development guidelines and rules.

**Key Principles:**
- Follow the current task only
- Inspect before changing
- Protect existing work
- Work incrementally
- No unrequested features
- Testing before completion
