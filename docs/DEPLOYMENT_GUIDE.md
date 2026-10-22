# Deployment Guide

**Last Updated:** October 22, 2026

---

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Database Deployment](#database-deployment)
7. [Production Configuration](#production-configuration)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Backup and Recovery](#backup-and-recovery)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### Current Deployment Status

**Current Production Deployment:**
- **Frontend:** Vercel (configured via vercel.json)
- **Backend:** Render.com (configured via render.yaml)
- **Database:** PostgreSQL on Render (ingata-postgres)
- **Containerization:** ❌ Not configured  
- **CI/CD:** ❌ Not configured  
**Monitoring:** ❌ Not configured  
**Logging:** Basic console logging

### Deployment Options

This guide covers:
- **Current Setup:** Vercel (frontend) + Render.com (backend) - ✅ Configured
- Manual deployment to VPS
- Deployment to Vercel (frontend)
- Deployment to Railway/Render (backend)
- Future: Docker-based deployment

---

## Prerequisites

### Required Accounts

**For VPS Deployment:**
- VPS provider (DigitalOcean, Linode, AWS EC2, etc.)
- Domain name (optional but recommended)
- SSL certificate provider (Let's Encrypt recommended)

**For Cloud Deployment:**
- Vercel account (frontend)
- Railway/Render account (backend)
- Neon database account (or alternative)

### Required Software

**Local Machine:**
- Git
- Node.js 18+
- npm or yarn

**Server:**
- Node.js 18+
- npm
- PostgreSQL client (psql)
- Nginx (recommended)
- PM2 (process manager)

### Domain and DNS

**Recommended:**
- Domain name for frontend
- Subdomain for API (e.g., api.yourdomain.com)
- DNS A records pointing to server IP
- SSL certificates for HTTPS

---

## Environment Setup

### Production Environment Variables

**Backend (.env):**
```bash
# Database
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://[user]:[password]@[host]/[database]?sslmode=no-verify

# Server
PORT=5000
NODE_ENV=production

# Security
JWT_SECRET=[strong-random-string-32+ characters]
JWT_EXPIRES_IN=5m
ENABLE_SCHEDULED_TASKS=true

# Email (required for password reset)
FRONTEND_URL=https://yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com

# Logging
DB_LOGGING=false
```

**Frontend (.env):**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

### Security Checklist

Before deploying:
- [ ] Change JWT_SECRET to strong random string
- [ ] Use production database credentials
- [ ] Configure production SMTP
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Remove/disable debug logging
- [ ] Change default passwords (admin, test user)

---

## Backend Deployment

### Current Deployment: Render.com ✅

The backend is currently configured for deployment to Render.com using `render.yaml` infrastructure as code.

**Configuration Files:**
- `backend/render.yaml` - Infrastructure as code configuration
- `backend/DEPLOYMENT.md` - Detailed Render deployment guide
- `backend/RENDER_DEPLOYMENT_STEPS.md` - Quick start guide

**Current Configuration:**
- Service Name: `ingata-backend`
- Database: `ingata-postgres` (PostgreSQL on Render)
- Plan: Free tier (configurable)
- Port: 10000
- Build Command: `npm install --include=dev && npm run build`
- Start Command: `npm start`

**Environment Variables (render.yaml):**
- `NODE_ENV=production`
- `PORT=10000`
- `DATABASE_URL` (from Render database)
- `DATABASE_URL_UNPOOLED` (for migrations)
- `JWT_SECRET` (auto-generated)
- `FRONTEND_URL` (needs update to actual Vercel URL)
- Email SMTP variables (optional, need configuration)

**Deployment Steps:**
1. Ensure code is pushed to GitHub
2. Go to Render.com → New → Blueprint
3. Connect GitHub repository
4. Render will detect `render.yaml` and apply configuration
5. After deployment, run migrations via Render Shell: `npm run migration:run`
6. Update frontend API URL in Vercel environment variables

**See:** `backend/RENDER_DEPLOYMENT_STEPS.md` for detailed instructions

---

### Option 1: VPS Deployment

#### 1. Prepare Server

**Connect to VPS:**
```bash
ssh user@your-server-ip
```

**Update system:**
```bash
sudo apt update
sudo apt upgrade -y
```

**Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

**Install PostgreSQL Client:**
```bash
sudo apt install -y postgresql-client
```

**Install PM2:**
```bash
sudo npm install -g pm2
```

**Install Nginx:**
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 2. Deploy Application

**Clone repository:**
```bash
cd /var/www
sudo git clone <repository-url> realestateweb
cd realestateweb
```

**Install dependencies:**
```bash
npm install
cd backend
npm install
cd ../frontend
npm install
```

**Configure environment:**
```bash
cd backend
cp .env.example .env  # or create manually
nano .env
# Add production environment variables
```

**Run migrations:**
```bash
cd backend
npm run migration:run
npm run seed
```

**Build backend:**
```bash
npm run build
```

#### 3. Start with PM2

**Create PM2 ecosystem file:**
```bash
cd /var/www/realestateweb
nano ecosystem.config.js
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [
    {
      name: 'realestate-backend',
      script: './backend/dist/server.js',
      cwd: '/var/www/realestateweb',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
```

**Start application:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Check status:**
```bash
pm2 status
pm2 logs realestate-backend
```

#### 4. Configure Nginx

**Create Nginx config:**
```bash
sudo nano /etc/nginx/sites-available/realestate
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/realestate /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. Configure SSL with Let's Encrypt

**Install Certbot:**
```bash
sudo apt install -y certbot python3-certbot-nginx
```

**Obtain certificate:**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Auto-renewal:**
```bash
sudo certbot renew --dry-run
```

---

### Option 2: Railway Deployment

#### 1. Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up and create account
3. Create new project

#### 2. Deploy Backend

**Create backend service:**
- Click "New Service"
- Select "Deploy from GitHub repo"
- Connect your GitHub repository
- Select root directory as source
- Configure environment variables
- Click "Deploy"

**Configure environment variables:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
NODE_ENV=production
PORT=5000
```

**Configure health check:**
- Health check path: `/api/v1/health`
- Interval: 30 seconds

#### 3. Deploy Database

**Create PostgreSQL service:**
- Click "New Service"
- Select "PostgreSQL"
- Railway will provide connection string
- Copy DATABASE_URL to backend service

#### 4. Run Migrations

**Railway deploy hooks:**
- Add deploy script to package.json
- Run migrations on deploy
- Seed database on initial deploy

---

### Option 3: Render Deployment

#### 1. Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up and create account
3. Create new web service

#### 2. Deploy Backend

**Create web service:**
- Connect GitHub repository
- Select "Node" as runtime
- Set build command: `cd backend && npm install && npm run build`
- Set start command: `cd backend && npm run start`
- Configure environment variables
- Deploy

**Configure environment variables:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
NODE_ENV=production
PORT=5000
```

#### 3. Deploy Database

**Create PostgreSQL service:**
- Create new PostgreSQL service
- Copy internal database URL
- Add to backend service environment variables

---

## Frontend Deployment

### Current Deployment: Vercel ✅

The frontend is configured for deployment to Vercel using `vercel.json`.

**Configuration File:**
- `vercel.json` - Vercel deployment configuration
- **Build Command:** `cd frontend && npm run build`
- **Install Command:** `cd frontend && npm install`
- **Framework:** null (Next.js detected automatically)
- **Environment Variable:** `NEXT_PUBLIC_API_URL=https://ingata-backend.onrender.com/api/v1`

**Deployment Steps:**
1. Ensure code is pushed to GitHub
2. Go to Vercel dashboard
3. Import GitHub repository
4. Vercel will detect Next.js automatically
5. Configure environment variable: `NEXT_PUBLIC_API_URL=https://ingata-backend.onrender.com/api/v1`
6. Deploy

**Post-Deployment:**
- Verify frontend loads correctly
- Test API connectivity to Render backend
- Configure custom domain (optional)

---

### Option 1: Vercel Deployment (Manual)

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Deploy Frontend

**From project root:**
```bash
cd frontend
vercel
```

**Follow prompts:**
- Link to existing project or create new
- Set project name
- Set root directory to `frontend`
- Configure build settings

**Configure environment variables:**
- In Vercel dashboard, add `NEXT_PUBLIC_API_URL`
- Set to production backend URL

**Deploy:**
```bash
vercel --prod
```

#### 3. Configure Custom Domain

**In Vercel dashboard:**
- Go to project settings
- Add custom domain
- Configure DNS records (A or CNAME)
- Wait for SSL certificate

---

### Option 2: VPS Deployment (Continued)

#### 1. Build Frontend

**On server:**
```bash
cd /var/www/realestateweb/frontend
npm run build
```

#### 2. Start with PM2

**Update ecosystem.config.js:**
```javascript
module.exports = {
  apps: [
    {
      name: 'realestate-backend',
      script: './backend/dist/server.js',
      cwd: '/var/www/realestateweb',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
    {
      name: 'realestate-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/realestateweb/frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

**Start:**
```bash
pm2 reload ecosystem.config.js
```

#### 3. Update Nginx Config

**Same as backend configuration** - Nginx already configured to proxy both frontend (port 3000) and backend (port 5000).

---

## Database Deployment

### Neon PostgreSQL (Recommended)

#### 1. Create Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create account
3. Create new project
4. Copy connection string

#### 2. Configure Database URL

**Pooled connection (for app):**
```
postgresql://[user]:[password]@[host]-pooler.[region].neon.tech/[database]?sslmode=require
```

**Direct connection (for migrations):**
```
postgresql://[user]:[password]@[host].[region].neon.tech/[database]?sslmode=no-verify
```

#### 3. Run Migrations

**From backend directory:**
```bash
npm run migration:run
```

#### 4. Seed Database

```bash
npm run seed
```

### Self-Hosted PostgreSQL

#### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 2. Create Database and User

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE realestate;
CREATE USER realestate_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE realestate TO realestate_user;
\q
```

#### 3. Configure Connection

**Backend .env:**
```bash
DATABASE_URL=postgresql://realestate_user:strong_password@localhost:5432/realestate
```

#### 4. Run Migrations and Seed

```bash
cd backend
npm run migration:run
npm run seed
```

---

## Production Configuration

### Backend Configuration

**TypeScript compilation:**
```bash
cd backend
npm run build
```

**Production server:**
```bash
npm run start
```

**With PM2:**
```bash
pm2 start ecosystem.config.js
```

### Frontend Configuration

**Production build:**
```bash
cd frontend
npm run build
```

**Production server:**
```bash
npm run start
```

**With PM2:**
```bash
pm2 start frontend -- npm start
```

### Nginx Configuration

**Full production config with SSL:**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Monitoring and Logging

### PM2 Monitoring

**View logs:**
```bash
pm2 logs realestate-backend
pm2 logs realestate-frontend
```

**View status:**
```bash
pm2 status
pm2 monit
```

**Restart services:**
```bash
pm2 restart realestate-backend
pm2 restart realestate-frontend
```

### Application Logging

**Backend logging:**
- Console logging enabled in development
- Disabled in production (`DB_LOGGING=false`)
- Consider adding Winston or Pino for structured logging

**Frontend logging:**
- Next.js provides built-in logging
- Console logs appear in server logs
- Consider adding error tracking (Sentry)

### Server Monitoring

**System monitoring:**
```bash
htop
```

**Disk usage:**
```bash
df -h
```

**Memory usage:**
```bash
free -m
```

**Process monitoring:**
```bash
ps aux | grep node
```

### Error Tracking (Recommended)

**Sentry Setup:**
1. Create Sentry account
2. Create new project
3. Install Sentry SDK:
   ```bash
   npm install @sentry/node
   ```
4. Initialize Sentry in backend
5. Initialize Sentry in frontend
6. Configure environment variables

---

## Backup and Recovery

### Database Backup

**Manual backup:**
```bash
pg_dump -h [host] -U [user] -d [database] > backup-$(date +%Y%m%d).sql
```

**Automated backup (cron):**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * pg_dump -h [host] -U [user] -d [database] > /backups/db-$(date +\%Y\%m\%d).sql
```

**Neon backup:**
- Neon provides automated backups
- Use Neon console for point-in-time recovery

### Application Backup

**Code backup:**
```bash
# Push to GitHub
git push origin main
```

**Environment backup:**
```bash
# Backup .env files
cp backend/.env backend/.env.backup
cp frontend/.env frontend/.env.backup
```

### Recovery

**Restore database:**
```bash
psql -h [host] -U [user] -d [database] < backup-20261014.sql
```

**Restore application:**
```bash
git pull origin main
npm install
cd backend && npm install && npm run build && npm run migration:run
cd frontend && npm install && npm run build
pm2 reload ecosystem.config.js
```

---

## Troubleshooting

### Backend Issues

#### Application Won't Start

**Check logs:**
```bash
pm2 logs realestate-backend
```

**Common causes:**
- Port already in use
- Database connection failed
- Environment variables missing
- Build errors

**Solutions:**
- Kill process using port 5000
- Verify DATABASE_URL
- Check .env file
- Run `npm run build` to check for errors

#### Database Connection Failed

**Check connection:**
```bash
psql -h [host] -U [user] -d [database]
```

**Common causes:**
- Wrong credentials
- Database not running
- Network issues
- SSL issues

**Solutions:**
- Verify credentials
- Start database service
- Check network connectivity
- Try direct connection URL

### Frontend Issues

#### Build Errors

**Check TypeScript errors:**
```bash
cd frontend
npm run typecheck
```

**Common causes:**
- TypeScript errors
- Missing dependencies
- Wrong imports

**Solutions:**
- Fix TypeScript errors
- Run `npm install`
- Check imports

#### Application Won't Start

**Check logs:**
```bash
pm2 logs realestate-frontend
```

**Common causes:**
- Port already in use
- NEXT_PUBLIC_API_URL wrong
- Build errors

**Solutions:**
- Kill process using port 3000
- Verify API URL
- Run `npm run build`

### Nginx Issues

#### 502 Bad Gateway

**Check if backend is running:**
```bash
pm2 status
curl http://localhost:5000/api/v1/health
```

**Solutions:**
- Restart backend
- Check PM2 logs
- Verify backend is listening on correct port

#### SSL Certificate Issues

**Renew certificate:**
```bash
sudo certbot renew
```

**Check certificate:**
```bash
sudo certbot certificates
```

### Database Issues

#### Migration Failed

**Check migration status:**
```bash
cd backend
npm run migration:run
```

**Solutions:**
- Check database connection
- Verify migration file syntax
- Rollback if needed (manual process)

#### Seed Failed

**Check seed script:**
```bash
cd backend
npm run seed
```

**Solutions:**
- Check database connection
- Verify seed data doesn't conflict
- Check for unique constraint violations

---

## Post-Deployment Checklist

### Security

- [ ] JWT_SECRET changed from default
- [ ] Default passwords changed (admin, test user)
- [ ] HTTPS enabled
- [ ] SSL certificate valid
- [ ] CORS configured for production domain
- [ ] Debug logging disabled
- [ ] Environment variables not committed

### Functionality

- [ ] Backend API accessible
- [ ] Frontend loads correctly
- [ ] Database migrations run
- [ ] Seed data loaded
- [ ] Authentication works
- [ ] Password reset works (SMTP configured)
- [ ] File uploads work (if implemented)
- [ ] Analytics tracking works

### Performance

- [ ] Page load times acceptable
- [ ] API response times acceptable
- [ ] No console errors
- [ ] No memory leaks
- [ ] PM2 processes stable

### Monitoring

- [ ] PM2 monitoring set up
- [ ] Error tracking configured (optional)
- [ ] Database backups configured
- [ ] Log rotation configured
- [ ] Uptime monitoring (optional)

---

## Scaling Considerations

### Horizontal Scaling

**Backend:**
- Use load balancer (Nginx, HAProxy)
- Run multiple instances with PM2 cluster mode
- Use shared database (Neon handles this)
- Use shared session storage (Redis)

**Frontend:**
- Vercel handles scaling automatically
- Use CDN for static assets
- Enable Next.js ISR/SSR where appropriate

### Database Scaling

**Neon:**
- Auto-scaling based on load
- Read replicas for read-heavy workloads
- Connection pooling configured

**Self-hosted:**
- Consider read replicas
- Optimize queries
- Add caching layer (Redis)

---

## Cost Estimation

### VPS Deployment

**Minimum requirements:**
- 2 CPU cores
- 4GB RAM
- 40GB SSD
- $20-40/month

**Additional costs:**
- Domain: $10-15/year
- SSL: Free (Let's Encrypt)

### Cloud Deployment

**Railway:**
- Backend: ~$20-50/month (depends on usage)
- Database: ~$20-50/month (PostgreSQL)
- Total: ~$40-100/month

**Render:**
- Backend: ~$7-25/month (free tier available)
- Database: ~$7-20/month (free tier available)
- Total: ~$14-45/month

**Vercel:**
- Frontend: Free (hobby tier)
- Pro tier: $20/month for additional features

**Neon:**
- Free tier available
- Paid plans start at $19/month

### Recommended

**Development/MVP:**
- Railway/Render + Neon free tiers
- Vercel free tier for frontend
- Cost: $0-50/month

**Production:**
- VPS deployment
- Neon Pro plan
- Domain + SSL
- Cost: $50-100/month

---

## CI/CD Pipeline (Future)

### GitHub Actions Example

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm install
          cd backend && npm install
          cd ../frontend && npm install
      
      - name: Run tests
        run: npm test
      
      - name: Build backend
        run: cd backend && npm run build
      
      - name: Build frontend
        run: cd frontend && npm run build
      
      - name: Deploy to production
        run: |
          # Add deployment commands
          # e.g., deploy to Railway, Vercel, or VPS
```

---

## Maintenance

### Regular Tasks

**Daily:**
- Check PM2 status
- Review error logs
- Monitor disk space

**Weekly:**
- Check SSL certificate expiry
- Review database backup logs
- Monitor performance metrics

**Monthly:**
- Update dependencies
- Review security advisories
- Test disaster recovery
- Review and rotate secrets

### Updates

**Update dependencies:**
```bash
npm audit
npm audit fix
npm update
```

**Update Node.js:**
```bash
# Check current version
node --version

# Update using nvm
nvm install 18
nvm use 18
```

**Update operating system:**
```bash
sudo apt update
sudo apt upgrade -y
```

---

## Rollback Procedure

### Quick Rollback

**Git rollback:**
```bash
git log
git checkout [previous-commit-hash]
pm2 reload ecosystem.config.js
```

**Database rollback:**
```bash
psql -h [host] -U [user] -d [database] < backup-file.sql
```

### Full Rollback

1. Stop services:
```bash
pm2 stop all
```

2. Rollback code:
```bash
git checkout [previous-tag]
```

3. Rebuild:
```bash
cd backend && npm run build
cd frontend && npm run build
```

4. Rollback database:
```bash
psql -h [host] -U [user] -d [database] < backup-file.sql
```

5. Restart services:
```bash
pm2 start ecosystem.config.js
```

---

## Support

### Documentation

- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- Development rules: `agent.md`
- This documentation folder: `docs/`

### Resources

- Node.js: https://nodejs.org/docs
- Next.js: https://nextjs.org/docs
- TypeORM: https://typeorm.io/
- PostgreSQL: https://www.postgresql.org/docs/
- PM2: https://pm2.keymetrics.io/docs/
- Nginx: https://nginx.org/en/docs/
