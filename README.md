# Ingata Real Estate

Ingata Real Estate is a full-stack property website and staff portal. The public site exposes property discovery, enquiries, viewing, valuation, listing, and content pages. The staff portal provides role-specific workspaces for administrators, agents, property managers, and content editors.

## Technology

- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS
- Backend: Express, TypeScript, TypeORM, PostgreSQL (Render)
- Integrations: SMTP via Nodemailer (requires configuration), JWT authentication, Leaflet maps (OpenStreetMap)
- Deployment: Vercel (frontend), Render.com (backend + database)
- Security: Helmet security headers, rate limiting, scheduled analytics cleanup, CSRF protection

## Prerequisites

- Node.js and npm
- PostgreSQL database reachable by the backend
- Backend environment configuration (see [installation guide](docs/INSTALLATION_AND_SETUP.md))
- Supabase Storage and SMTP only when media upload and password-reset/email features are required

## Quick start

```sh
npm --prefix frontend install
npm --prefix backend install

npm --prefix backend run dev
npm --prefix frontend run dev
```

The frontend defaults to `http://localhost:3000`; the backend defaults to `http://localhost:5000`. The API is mounted at `/api/v1`.

Run database migrations only after configuring the backend database:

```sh
npm --prefix backend run migration:run
```

## Development commands

```sh
# Frontend
npm run dev
npm run build
npm run start
npm --prefix frontend run typecheck

# Backend
npm --prefix backend run dev
npm --prefix backend run build
npm --prefix backend run migration:run
npm --prefix backend run seed
```

## Documentation

- [Project overview](docs/PROJECT_OVERVIEW.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Installation and setup](docs/INSTALLATION_AND_SETUP.md)
- [Database schema](docs/DATABASE_SCHEMA.md)
- [API reference](docs/API_REFERENCE.md)
- [Authentication and permissions](docs/AUTHENTICATION_AND_PERMISSIONS.md)
- [User roles and features](docs/USER_ROLES_AND_FEATURES.md)
- [Testing and known issues](docs/TESTING_AND_KNOWN_ISSUES.md)
- [Deployment guide](docs/DEPLOYMENT_GUIDE.md)
- [Development roadmap](docs/DEVELOPMENT_ROADMAP.md)

The documentation records source-verified behavior as of the audit. Deployment state, live database migration state, and third-party account configuration require manual verification.
