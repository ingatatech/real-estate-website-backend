# Ingata Real Estate Platform

A full-stack real estate management platform built with Next.js, Express.js, TypeScript, and PostgreSQL.

**Version:** 1.0.0  
**Status:** Production Deployed  
**Last Updated:** October 27, 2026

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
cd realestateweb

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Configure environment
cd backend
cp .env.example .env
# Edit .env with your configuration

# Setup database
cd backend
npm run migration:run
npm run seed

# Start development servers
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1
- Admin Dashboard: http://localhost:3000/admin
- Staff Portal: http://localhost:3000/portal

---

## Project Structure

```
realestateweb/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── entities/    # TypeORM models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, rate limiting, etc.
│   │   ├── migrations/  # Database migrations
│   │   └── services/    # Scheduled tasks
│   └── package.json
├── frontend/            # Next.js 15 application
│   ├── app/            # App Router pages
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API client
│   │   └── legacy-pages/ # Legacy pages (migration in progress)
│   └── package.json
├── docs/               # Documentation
└── agent.md           # Development rules
```

---

## Technology Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Maps:** Leaflet + OpenStreetMap
- **Icons:** Lucide React
- **State:** React Context

### Backend
- **Framework:** Express.js 4.21
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT
- **Email:** Nodemailer + Brevo SMTP
- **Storage:** Supabase Storage
- **Error Tracking:** Sentry

### Deployment
- **Frontend:** Vercel
- **Backend:** Render.com
- **Database:** Render PostgreSQL

---

## Features

### Core Features
- ✅ Multi-role user system (Admin, Agent, Property Manager, Content Editor, User)
- ✅ Property listing management with images/videos
- ✅ Advanced property search with filters and map view
- ✅ Property inquiries and viewing requests
- ✅ Property valuation requests
- ✅ Content management (articles, FAQs, pages, testimonials)
- ✅ Analytics tracking (page views, property views, click events)
- ✅ Password reset via email
- ✅ Interactive maps with Leaflet
- ✅ Property comparison tool
- ✅ Mortgage and rental yield calculators
- ✅ Agent profiles and directory
- ✅ Responsive design

### Role-Based Access
- **Admin:** Full system access, user management, analytics
- **Property Manager:** Manage properties, assign agents, approve listings
- **Agent:** Manage assigned properties, handle inquiries, schedule viewings
- **Content Editor:** Manage articles, FAQs, pages, testimonials
- **User:** Browse properties, submit inquiries, save favorites

---

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)** - Complete project overview and status
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[INSTALLATION_AND_SETUP.md](docs/INSTALLATION_AND_SETUP.md)** - Detailed setup instructions
- **[DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - Complete database schema documentation
- **[API_REFERENCE.md](docs/API_REFERENCE.md)** - Full API endpoint reference
- **[AUTHENTICATION_AND_PERMISSIONS.md](docs/AUTHENTICATION_AND_PERMISSIONS.md)** - Authentication and authorization details
- **[USER_ROLES_AND_FEATURES.md](docs/USER_ROLES_AND_FEATURES.md)** - Role-based feature documentation
- **[TESTING_AND_KNOWN_ISSUES.md](docs/TESTING_AND_KNOWN_ISSUES.md)** - Testing status and known issues
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment instructions
- **[DEVELOPMENT_ROADMAP.md](docs/DEVELOPMENT_ROADMAP.md)** - Future development plans

---

## Development

### Running Tests

**Frontend (working):**
```bash
cd frontend
npm test
```

**Backend (currently broken - ESM configuration issue):**
```bash
cd backend
npm test
```

### Type Checking

```bash
# Backend
cd backend
npm run typecheck

# Frontend
cd frontend
npm run typecheck
```

### Building

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

---

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://...
DATABASE_URL_UNPOOLED=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=5m
FRONTEND_URL=http://localhost:3000

# Email (Brevo SMTP)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your-email@brevo.com
EMAIL_PASSWORD=your-api-key
EMAIL_FROM=noreply@ingata.com

# Supabase Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-secret-key
SUPABASE_PROPERTY_MEDIA_BUCKET=property-media

# Sentry (optional)
SENTRY_DSN=your-sentry-dsn
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Deployment

### Production URLs
- **Frontend:** https://ingata-real-estate.vercel.app
- **Backend:** https://ingata-backend.onrender.com/api/v1

### Deployment Guide
See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

### CI/CD
- Git push to main branch triggers automatic deployment
- Vercel deploys frontend
- Render deploys backend
- Manual database migrations required after backend deployment

---

## Known Issues

### Critical
- **Backend Tests Broken:** Jest ESM configuration prevents test execution (see TESTING_AND_KNOWN_ISSUES.md)

### Medium Priority
- **Legacy Page Migration:** 92 legacy pages need migration to App Router (~15% complete)
- **No Refresh Token:** Users must re-authenticate every 5 minutes

### Low Priority
- **Swagger Dependencies:** Installed but not used (can be removed)
- **Social Media Links:** Placeholder URLs need updating

See [TESTING_AND_KNOWN_ISSUES.md](docs/TESTING_AND_KNOWN_ISSUES.md) for complete details.

---

## Development Rules

See [agent.md](agent.md) for development guidelines and rules.

**Key Principles:**
- Follow the current task only
- Inspect before changing
- Protect existing work
- Work incrementally
- No unrequested features
- UI/UX consistency
- Responsive design
- Testing before completion

---

## License

[Specify your license here]

---

## Contributors

[Add contributor information here]

---

## Support

For support and questions:
- Review documentation in `docs/` directory
- Check [TESTING_AND_KNOWN_ISSUES.md](docs/TESTING_AND_KNOWN_ISSUES.md) for troubleshooting
- Visit [DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment issues
