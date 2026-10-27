# Installation and Setup Guide

**Last Updated:** October 27, 2026

---

## Prerequisites

### Required Software
- **Node.js:** v18 or higher (v20+ recommended)
- **npm:** v9 or higher (comes with Node.js)
- **Git:** For version control
- **PostgreSQL Database:** Neon (recommended) or local PostgreSQL

### Optional Software
- **VS Code:** Recommended IDE with extensions
- **Postman:** For API testing
- **Docker:** For containerized database (optional)

---

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd realestateweb
```

### 2. Install Dependencies

Install root dependencies (if any):
```bash
npm install
```

Install backend dependencies:
```bash
cd backend
npm install
```

Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### 3. Database Setup

#### Option A: Neon (Recommended)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Copy both **Connection String** (pooled) and **Connection Details** (direct)

#### Option B: Render PostgreSQL

1. Create a free account at [render.com](https://render.com)
2. Create a new PostgreSQL database
3. Copy the **Internal Database URL** (pooled)
4. Copy the **External Database URL** (direct)

#### Option C: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
```sql
CREATE DATABASE ingata_real_estate;
```
3. Note your connection details:
```
Host: localhost
Port: 5432
Database: ingata_real_estate
Username: postgres
Password: your_password
```

---

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_URL_UNPOOLED=postgresql://user:password@host:port/database

# JWT Configuration
JWT_SECRET=your-very-secure-random-secret-key-at-least-32-characters
JWT_EXPIRES_IN=5m

# Email Configuration (Brevo SMTP)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your-email@brevo.com
EMAIL_PASSWORD=your-brevo-api-key
EMAIL_FROM=noreply@ingata.com

# Supabase Storage (for media uploads)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-supabase-secret-key
SUPABASE_PROPERTY_MEDIA_BUCKET=property-media
SUPABASE_DEVELOPMENT_MEDIA_BUCKET=development-media

# Sentry Error Tracking (optional)
SENTRY_DSN=your-sentry-dsn

# Scheduled Tasks
ENABLE_SCHEDULED_TASKS=true
```

**Important Notes:**
- `DATABASE_URL`: Use pooled connection for application
- `DATABASE_URL_UNPOOLED`: Use direct connection for migrations
- `JWT_SECRET`: Generate a strong random secret (min 32 characters)
- `EMAIL_PASSWORD`: Use Brevo API key, not account password
- Never commit `.env` file to version control

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important Notes:**
- Variables must start with `NEXT_PUBLIC_` to be exposed to browser
- `NEXT_PUBLIC_API_URL`: Backend API base URL
- `NEXT_PUBLIC_BASE_URL`: Frontend base URL (for absolute links)

---

## Database Migration

### Run Migrations

From the backend directory:

```bash
cd backend
npm run migration:run
```

This will:
1. Connect to the database using `DATABASE_URL_UNPOOLED`
2. Run all pending migrations in order
3. Create all tables, indexes, and constraints
4. Insert default data (article categories, etc.)

### Verify Migration

Check if tables were created:

```bash
# Connect to your database
psql $DATABASE_URL

# List tables
\dt

# Exit
\q
```

Expected tables (30 total):
- roles, users, agents, properties, property_categories, etc.

### Reset Database (if needed)

⚠️ **Warning:** This will delete all data!

```bash
cd backend
npm run migration:run  # Runs ResetDatabaseSchema migration
```

---

## Database Seeding

### Seed Initial Data

From the backend directory:

```bash
cd backend
npm run seed
```

This will:
1. Create default roles (admin, agent, user, property_manager, content_editor)
2. Create a default admin user
3. Create sample categories
4. Create sample properties (optional)

### Seed Article Categories

```bash
cd backend
npm run seed:article-categories
```

This inserts 10 predefined article categories:
- Property Market Updates
- Buying Guides
- Renting Guides
- Selling Guides
- Property Investment
- Property Management
- Homeownership
- Real Estate Trends
- Company Announcements
- New Developments

---

## Starting Development Servers

### Start Backend Server

From the backend directory:

```bash
cd backend
npm run dev
```

The backend will:
- Start on port 5000 (or configured PORT)
- Watch for file changes with tsx
- Hot-reload on changes
- Connect to database
- Initialize scheduled tasks (if enabled)

Expected output:
```
Database connected successfully
[Scheduled Task] Initializing scheduled tasks...
[Scheduled Task] Analytics cleanup job scheduled to run daily at 2:00 AM UTC
Backend running on http://localhost:5000
```

### Start Frontend Server

From the frontend directory (in a new terminal):

```bash
cd frontend
npm run dev
```

The frontend will:
- Start on port 3000
- Watch for file changes
- Hot-reload on changes
- Connect to backend API

Expected output:
```
▲ Next.js 15.0.0
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

---

## Verify Installation

### 1. Check Backend Health

```bash
curl http://localhost:5000/api/v1/health
```

Expected response:
```json
{
  "success": true,
  "message": "Ingata Real Estate API is running"
}
```

### 2. Check Frontend

Open browser to: http://localhost:3000

You should see:
- Homepage with property categories
- Navigation header
- Footer
- No console errors

### 3. Test Admin Registration

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "Password123!",
    "role": "admin"
  }'
```

### 4. Test Admin Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Password123!"
  }'
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## Common Setup Issues

### Database Connection Failed

**Problem:** `Database connection failed: connection refused`

**Solutions:**
1. Verify DATABASE_URL is correct
2. Check PostgreSQL is running
3. Check firewall allows connection
4. Verify credentials (username, password)
5. Try using DATABASE_URL_UNPOOLED for testing

### Migration Failed

**Problem:** Migration fails with error

**Solutions:**
1. Use DATABASE_URL_UNPOOLED for migrations
2. Check if tables already exist (drop if needed)
3. Verify database user has CREATE TABLE permissions
4. Check migration logs for specific error

### Frontend Cannot Connect to Backend

**Problem:** API calls fail with network error

**Solutions:**
1. Verify backend is running on correct port
2. Check NEXT_PUBLIC_API_URL in frontend .env
3. Check CORS configuration in backend
4. Verify no firewall blocking connections

### Email Not Sending

**Problem:** Password reset emails not sending

**Solutions:**
1. Verify Brevo SMTP credentials
2. Check EMAIL_HOST and EMAIL_PORT
3. Verify EMAIL_FROM is a verified sender
4. Check Brevo API key permissions
5. Test SMTP connection separately

### TypeORM Compilation Errors

**Problem:** TypeScript compilation fails

**Solutions:**
1. Run `npm run build` to see specific errors
2. Check entity decorators are correct
3. Verify all imports are correct
4. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

---

## Development Workflow

### Recommended Branch Strategy

```
main           # Production code
develop        # Integration branch
feature/*      # Feature branches
bugfix/*       # Bug fix branches
```

### Development Steps

1. Create feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make changes and test locally

3. Run type checking:
```bash
# Backend
cd backend
npm run typecheck

# Frontend
cd frontend
npm run typecheck
```

4. Run tests:
```bash
# Frontend
cd frontend
npm test

# Backend (currently broken, needs ESM fix)
cd backend
npm test
```

5. Build to verify:
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

6. Commit changes:
```bash
git add .
git commit -m "feat: add your feature description"
```

7. Push and create pull request

---

## IDE Setup

### VS Code Extensions (Recommended)

- **ESLint:** Linting support
- **Prettier:** Code formatting
- **TypeScript Vue Plugin (Volar):** TypeScript support
- **Tailwind CSS IntelliSense:** Tailwind autocomplete
- **PostgreSQL:** Database management
- **Thunder Client:** API testing (alternative to Postman)

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## Production Build

### Backend Production Build

```bash
cd backend
npm run build
```

This compiles TypeScript to JavaScript in `dist/` directory.

### Frontend Production Build

```bash
cd frontend
npm run build
```

This creates an optimized production build in `.next/` directory.

### Test Production Build Locally

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm start
```

---

## Troubleshooting

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Module Not Found

**Problem:** `Cannot find module '...`

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Permission Denied

**Problem:** `Error: EACCES: permission denied`

**Solution:**
```bash
# Linux/Mac
sudo npm install

# Or fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Out of Memory

**Problem:** `JavaScript heap out of memory`

**Solution:**
```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## Next Steps

After successful setup:

1. **Create Admin User:** Register an admin account via API or seed script
2. **Configure Email:** Set up Brevo SMTP for password reset
3. **Configure Supabase:** Set up Supabase Storage for media uploads
4. **Set Up Sentry:** Configure error tracking (optional)
5. **Test All Features:** Verify authentication, CRUD operations, etc.
6. **Review Documentation:** Read other documentation files in `/docs`

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Brevo SMTP Documentation](https://developers.brevo.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Sentry Documentation](https://docs.sentry.io/)
