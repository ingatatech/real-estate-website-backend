# Installation and Setup Guide

**Last Updated:** October 14, 2026

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Repository Setup](#repository-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Setup](#database-setup)
6. [Environment Configuration](#environment-configuration)
7. [Running the Application](#running-the-application)
8. [Development Workflow](#development-workflow)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18+ (recommended) | Runtime environment |
| npm | 9+ (or yarn 1.22+) | Package manager |
| Git | Latest | Version control |
| PostgreSQL | 14+ | Database (local or Neon) |

### Optional Software

| Software | Purpose |
|----------|---------|
| VS Code | Recommended IDE |
| Postman | API testing |
| DBeaver/pgAdmin | Database management |

### Verify Installation

```bash
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
git --version   # Should show version
psql --version  # If using local PostgreSQL
```

---

## Repository Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd realestateweb
```

### 2. Install Root Dependencies

```bash
npm install
```

This installs shared development tools (TypeScript, Tailwind CSS, etc.).

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Backend Dependencies

```bash
npm install
```

**Key Dependencies:**
- express: 4.21.2
- typeorm: 1.1.1
- pg: 8.23.1
- jsonwebtoken: 9.0.3
- bcryptjs: 3.0.3
- nodemailer: 7.0.13
- multer: 2.4.0
- cors: 2.8.5
- dotenv: 16.4.5
- tsx: 4.19.1

### 3. Verify Installation

```bash
npm list --depth=0
```

### 4. Build TypeScript (Optional)

```bash
npm run build
```

This compiles TypeScript to the `dist/` directory.

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd ../frontend
```

### 2. Install Frontend Dependencies

```bash
npm install
```

**Key Dependencies:**
- next: 15.0.0
- react: 19.3.0
- react-dom: 19.3.0
- typescript: 6.0.3
- tailwindcss: 3.4.19
- lucide-react: 1.46.0
- apexcharts: 8.1.0

### 3. Verify Installation

```bash
npm list --depth=0
```

### 4. Type Check (Optional)

```bash
npm run typecheck
```

---

## Database Setup

### Option 1: Neon PostgreSQL (Recommended)

#### 1. Create Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for an account
3. Create a new project
4. Copy the connection string

#### 2. Configure Database URL

The Neon connection string will be in format:
```
postgresql://[user]:[password]@[host]-pooler/[database]?sslmode=require
```

Add this to your backend `.env` file:
```
DATABASE_URL=postgresql://[user]:[password]@[host]-pooler/[database]?sslmode=require
```

#### 3. Run Migrations

```bash
cd backend
npm run migration:run
```

#### 4. Seed Database

```bash
npm run seed
```

This creates:
- Default roles (admin, agent, user)
- Admin user (admin@realestate.com / admin123)
- Test user (user@test.com / user123)
- Property categories
- Article categories
- Services
- Site settings

### Option 2: Local PostgreSQL

#### 1. Install PostgreSQL

**Windows:**
- Download from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
- Run installer with default settings
- Note the password you set during installation

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

#### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE realestate;

# Create user (optional, can use postgres)
CREATE USER realestate_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE realestate TO realestate_user;

# Exit
\q
```

#### 3. Configure Database URL

Add to backend `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=realestate_user
DB_PASSWORD=your_password
DB_NAME=realestate
```

Or use connection string:
```
DATABASE_URL=postgresql://realestate_user:your_password@localhost:5432/realestate
```

#### 4. Run Migrations and Seed

```bash
cd backend
npm run migration:run
npm run seed
```

---

## Environment Configuration

### Backend Environment Variables

Create `backend/.env` file:

```bash
# Database Configuration
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
# OR
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=realestate_user
DB_PASSWORD=your_password
DB_NAME=realestate

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Database Logging (optional)
DB_LOGGING=false

# Password Reset Email (optional but recommended)
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

**Important Security Notes:**
- Change `JWT_SECRET` to a strong random string in production
- Use app-specific password for Gmail SMTP
- Never commit `.env` file to version control
- Use different values for development and production

### Frontend Environment Variables

Create `frontend/.env` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**Production:**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

---

## Running the Application

### Development Mode

#### 1. Start Backend Server

```bash
cd backend
npm run dev
```

Backend will start on `http://localhost:5000`

Expected output:
```
Database connected successfully
Backend running on http://localhost:5000
```

#### 2. Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:3000`

Expected output:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

#### 3. Access Applications

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/v1
- **Health Check:** http://localhost:5000/api/v1/health
- **Admin Dashboard:** http://localhost:3000/admin
- **Staff Portal:** http://localhost:3000/portal

### Production Mode

#### 1. Build Backend

```bash
cd backend
npm run build
```

#### 2. Build Frontend

```bash
cd frontend
npm run build
```

#### 3. Start Backend (Production)

```bash
cd backend
npm run start
```

#### 4. Start Frontend (Production)

```bash
cd frontend
npm run start
```

**Note:** For production deployment, use a process manager like PM2 or systemd.

---

## Development Workflow

### Recommended Workflow

#### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# Test changes

# Commit changes
git add .
git commit -m "Add your feature"

# Push and create PR
git push origin feature/your-feature-name
```

#### 2. Running Commands

**From Root Directory:**
```bash
npm run dev          # Start frontend only
npm run build        # Build frontend only
npm run start        # Start frontend production
```

**From Backend Directory:**
```bash
npm run dev          # Start backend with hot reload
npm run build        # Build TypeScript
npm run start        # Start production server
npm run migration:run  # Run migrations
npm run seed         # Seed database
```

**From Frontend Directory:**
```bash
npm run dev          # Start frontend with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # Type check only
```

#### 3. Database Changes

**For Schema Changes:**
```bash
cd backend

# Generate new migration (manual)
# Create file in src/migrations/ with timestamp

# Run migration
npm run migration:run

# Test migration
```

**For Data Changes:**
```bash
cd backend

# Edit seed.ts
npm run seed
```

#### 4. Testing Changes

**Manual Testing Checklist:**
1. Test changed functionality
2. Check for console errors
3. Check for build errors
4. Test affected existing functionality
5. Test responsive behavior (if UI changed)
6. Fix any errors found

### Code Quality

#### TypeScript Compilation

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run typecheck
```

#### Linting

No ESLint configuration found currently. To add:

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npx eslint --init
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error:** `Database connection failed`

**Solutions:**
- Verify DATABASE_URL is correct
- Check database is running
- Verify credentials
- Check firewall settings
- For Neon: verify connection string format

#### 2. Migration Failed

**Error:** Migration execution failed

**Solutions:**
- Check database connection
- Verify migration file syntax
- Check for migration conflicts
- Review migration logs
- Rollback if needed (manual process)

#### 3. Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solutions:**
```bash
# Find process using port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

#### 4. JWT Secret Not Set

**Error:** JWT verification failed

**Solutions:**
- Verify JWT_SECRET in backend/.env
- Restart backend after changing .env
- Use strong random string for production

#### 5. CORS Errors

**Error:** CORS policy error in browser

**Solutions:**
- Backend CORS middleware is configured with default settings
- For production, configure specific origins
- Check frontend API URL matches backend

#### 6. Module Not Found

**Error:** `Cannot find module 'xxx'`

**Solutions:**
```bash
cd backend  # or frontend
npm install
```

#### 7. TypeScript Compilation Errors

**Error:** TypeScript compilation failed

**Solutions:**
- Check tsconfig.json configuration
- Verify all dependencies installed
- Check for type errors
- Run `npm run build` to see specific errors

#### 8. Password Reset Not Working

**Error:** Password reset email not sending

**Solutions:**
- Verify SMTP configuration in backend/.env
- Check SMTP credentials
- Verify SMTP_FROM is verified email
- Check email spam folder
- Test SMTP configuration with tool like [smtpjs.com](https://smtpjs.com)

#### 9. Frontend Build Failed

**Error:** Next.js build failed

**Solutions:**
- Check for TypeScript errors
- Verify all imports are correct
- Check for missing dependencies
- Clear .next cache: `rm -rf .next`
- Try building again

#### 10. Environment Variables Not Loading

**Error:** Process.env undefined

**Solutions:**
- Verify .env file exists
- Check .env file location (backend/ or frontend/)
- Verify dotenv is called in code
- Restart server after changing .env

### Getting Help

1. Check console logs for error details
2. Review error messages carefully
3. Check documentation in `/docs` folder
4. Review AGENT.md for development rules
5. Check GitHub issues (if public repository)

### Debug Mode

**Enable Database Logging:**
```bash
# backend/.env
DB_LOGGING=true
```

**Enable Verbose Logging:**
```bash
# Backend
NODE_ENV=development npm run dev

# Frontend
NODE_ENV=development npm run dev
```

---

## Development Tips

### Hot Reload

**Backend:** Uses tsx watch for automatic hot reload on file changes

**Frontend:** Next.js dev server provides hot reload

### Database Schema Changes

1. Always create a migration for schema changes
2. Test migration on development database first
3. Backup production database before running migrations
4. Document breaking changes

### API Testing

Use Postman collection in `.postman/` folder or test with curl:

```bash
# Health check
curl http://localhost:5000/api/v1/health

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@realestate.com","password":"admin123"}'
```

### Default Credentials

After running seed:

**Admin:**
- Email: admin@realestate.com
- Password: admin123
- Access: /admin/login

**Test User:**
- Email: user@test.com
- Password: user123
- Access: /login

**Change these passwords in production!**

---

## Production Deployment Preparation

### Before Deployment

1. **Change Secrets:**
   - Generate strong JWT_SECRET
   - Use production database credentials
   - Configure production SMTP

2. **Build Applications:**
   ```bash
   npm run build  # Backend
   cd frontend && npm run build  # Frontend
   ```

3. **Run Migrations:**
   ```bash
   cd backend
   npm run migration:run
   ```

4. **Environment Variables:**
   - Set NODE_ENV=production
   - Configure production DATABASE_URL
   - Set production FRONTEND_URL
   - Configure production SMTP

5. **Database Backup:**
   - Backup production database
   - Test backup restore process

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

---

## Additional Resources

- [TypeORM Documentation](https://typeorm.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Neon Documentation](https://neon.tech/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
