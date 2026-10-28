# API Reference

**Last Updated:** October 27, 2026  
**Base URL:** `https://ingata-backend.onrender.com/api/v1` (Production)  
**Base URL:** `http://localhost:5000/api/v1` (Development)  
**Authentication:** JWT Bearer Token  
**Content-Type:** `application/json`

---

## Overview

The Ingata Real Estate API is a RESTful API built with Express.js and TypeScript. It provides endpoints for property management, user authentication, content management, analytics, and more.

### Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

Public endpoints (no authentication required):
- Authentication endpoints (login, register, password reset)
- Public property queries
- Content endpoints (articles, FAQs, services)
- Contact forms
- Analytics tracking

Protected endpoints (authentication required):
- Admin endpoints (admin role)
- Agent dashboard (agent role)
- Property manager endpoints (property_manager role)
- Content editor endpoints (content_editor role)
- User-specific actions (favorites, profile)

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

### Pagination Response

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## Rate Limiting

| Limiter | Rate | Applies To |
|---------|------|------------|
| API Rate Limiter | 100 req/15min | All API routes |
| Auth Rate Limiter | 5 req/15min | `/auth/*` endpoints |
| Contact Rate Limiter | 3 req/hour | `/contact` and `/inquiries` |
| Search Rate Limiter | 30 req/min | `/property-searches` |

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1698765432
```

---

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Rate Limit:** 5 req/15min  
**Auth:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /auth/login
Login with email and password.

**Rate Limit:** 5 req/15min  
**Auth:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /auth/admin/login
Admin-specific login (requires admin role).

**Rate Limit:** 5 req/15min  
**Auth:** Public

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "Password123!"
}
```

#### POST /auth/forgot-password
Request password reset email.

**Rate Limit:** 5 req/15min  
**Auth:** Public

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If an account exists for that email, password reset instructions will be sent."
}
```

#### POST /auth/reset-password
Reset password with token.

**Rate Limit:** 5 req/15min  
**Auth:** Public

**Request Body:**
```json
{
  "token": "64-character-hex-token",
  "newPassword": "NewPassword123!"
}
```

#### GET /auth/me
Get current authenticated user.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### PATCH /auth/profile
Update user profile.

**Auth:** Required

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+250788123456"
}
```

#### POST /auth/logout
Logout (client-side token removal).

**Auth:** Required

---

### Properties

#### GET /properties
Get all properties with optional filters.

**Auth:** Public

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `propertyType` - RESIDENTIAL, COMMERCIAL, etc.
- `transactionType` - SALE, RENT, LEASE
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `bedrooms` - Number of bedrooms
- `bathrooms` - Number of bathrooms
- `location` - Location filter
- `district` - District filter (Rwanda)
- `sector` - Sector filter (Rwanda)

**Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": { ... }
}
```

#### GET /properties/:slug
Get property by slug.

**Auth:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Modern Apartment in Kigali",
    "slug": "modern-apartment-kigali",
    "price": 150000000,
    "currency": "RWF",
    "location": "Kigali",
    "bedrooms": 3,
    "bathrooms": 2,
    "images": [ ... ],
    "agent": { ... }
  }
}
```

#### GET /properties/for-sale
Get properties for sale.

**Auth:** Public

#### GET /properties/for-rent
Get properties for rent.

**Auth:** Public

#### GET /properties/residential
Get residential properties.

**Auth:** Public

#### GET /properties/commercial
Get commercial properties.

**Auth:** Public

#### POST /properties
Create a new property.

**Auth:** Required (admin, property_manager, agent)

**Request Body:**
```json
{
  "title": "Modern Apartment",
  "description": "Beautiful apartment in prime location",
  "propertyType": "RESIDENTIAL",
  "transactionType": "SALE",
  "price": 150000000,
  "currency": "RWF",
  "location": "Kigali",
  "district": "Kigali City",
  "sector": "Nyarugenge",
  "bedrooms": 3,
  "bathrooms": 2,
  "size": 120,
  "sizeUnit": "sqm"
}
```

#### PATCH /properties/:id
Update property.

**Auth:** Required (admin, property_manager, agent + ownership check)

#### DELETE /properties/:id
Delete property.

**Auth:** Required (admin, property_manager, agent + ownership check)

---

### Property Categories

#### GET /categories
Get all property categories.

**Auth:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Apartments",
      "slug": "apartments",
      "image_url": "https://..."
    }
  ]
}
```

#### GET /categories/:slug
Get category by slug.

**Auth:** Public

---

### Article Categories

#### GET /article-categories
Get all article categories.

**Auth:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Property Market Updates",
      "slug": "property-market-updates"
    }
  ]
}
```

---

### Agents

#### GET /agents
Get all agents.

**Auth:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Smith",
      "slug": "john-smith",
      "email": "john@ingata.com",
      "phone": "+250788123456",
      "specialization": "Residential Properties",
      "years_experience": 5
    }
  ]
}
```

#### GET /agents/:slug
Get agent by slug.

**Auth:** Public

---

### Services

#### GET /services
Get all services.

**Auth:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Property Management",
      "slug": "property-management",
      "short_description": "Full property management services",
      "image_url": "https://..."
    }
  ]
}
```

#### GET /services/:slug
Get service by slug.

**Auth:** Public

---

### Articles

#### GET /articles
Get all published articles.

**Auth:** Public

**Query Parameters:**
- `category` - Filter by category slug
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Rwanda Real Estate Market 2026",
      "slug": "rwanda-real-estate-market-2026",
      "excerpt": "Market overview...",
      "featured_image": "https://...",
      "published_at": "2026-10-01T00:00:00Z",
      "category": { ... }
    }
  ]
}
```

#### GET /articles/:slug
Get article by slug.

**Auth:** Public

---

### FAQs

#### GET /faqs
Get all FAQs.

**Auth:** Public

**Query Parameters:**
- `category` - Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "question": "How do I schedule a viewing?",
      "answer": "You can schedule a viewing...",
      "category": "General"
    }
  ]
}
```

---

### Testimonials

#### GET /testimonials
Get all testimonials.

**Auth:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Jane Doe",
      "role": "Homeowner",
      "content": "Excellent service...",
      "rating": 5
    }
  ]
}
```

#### POST /testimonials
Create a testimonial.

**Auth:** Public

**Request Body:**
```json
{
  "name": "Jane Doe",
  "role": "Homeowner",
  "content": "Excellent service...",
  "rating": 5
}
```

---

### Contact

#### POST /contact
Submit contact form.

**Rate Limit:** 3 req/hour  
**Auth:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+250788123456",
  "subject": "Property Inquiry",
  "message": "I'm interested in..."
}
```

#### GET /contact
Get all contact messages.

**Auth:** Required (admin)

---

### Inquiries

#### POST /inquiries
Submit property inquiry.

**Rate Limit:** 3 req/hour  
**Auth:** Public

**Request Body:**
```json
{
  "property_id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+250788123456",
  "inquiry": "I'm interested in this property..."
}
```

#### GET /inquiries
Get all inquiries.

**Auth:** Required (admin)

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status

---

### Viewings

#### POST /viewings
Request property viewing.

**Auth:** Public

**Request Body:**
```json
{
  "property_id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+250788123456",
  "preferred_date": "2026-11-01",
  "preferred_time": "10:00 AM",
  "message": "I would like to view..."
}
```

#### GET /viewings
Get all viewing requests.

**Auth:** Required (admin)

---

### Valuations

#### POST /valuations
Request property valuation.

**Auth:** Public

**Request Body:**
```json
{
  "property_type": "RESIDENTIAL",
  "location": "Kigali",
  "property_size": 120,
  "bedrooms": 3,
  "bathrooms": 2,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+250788123456"
}
```

#### GET /valuations
Get all valuation requests.

**Auth:** Required (admin)

---

### Listings

#### POST /listings
Submit property listing request (with images).

**Auth:** Public

**Request:** multipart/form-data

**Fields:**
- `name` - Owner name
- `email` - Owner email
- `phone` - Owner phone
- `propertyType` - Property type
- `transactionType` - Transaction type
- `location` - Property location
- `district` - District
- `sector` - Sector
- `propertySize` - Property size
- `bedrooms` - Bedrooms
- `bathrooms` - Bathrooms
- `description` - Property description
- `price` - Expected price
- `images` - Files (max 8 images, 10MB each)

#### GET /listings
Get all listing requests.

**Auth:** Required (admin)

---

### Favorites

#### GET /favorites
Get user's favorite properties.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "property_id": "uuid",
      "property": { ... }
    }
  ]
}
```

#### POST /favorites
Add property to favorites.

**Auth:** Required

**Request Body:**
```json
{
  "property_id": "uuid"
}
```

#### DELETE /favorites/:id
Remove property from favorites.

**Auth:** Required

---

### Property Search

#### GET /property-searches
Get saved property searches.

**Auth:** Required

**Rate Limit:** 30 req/min

#### POST /property-searches
Save property search criteria.

**Auth:** Required

**Request Body:**
```json
{
  "location": "Kigali",
  "propertyType": "RESIDENTIAL",
  "transactionType": "SALE",
  "minPrice": 50000000,
  "maxPrice": 200000000,
  "bedrooms": 3
}
```

---

### Property Media

#### POST /property-media
Upload property media (image/video).

**Auth:** Required (admin, property_manager, agent with permission)

**Request:** multipart/form-data

**Fields:**
- `file` - File (max 100MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://supabase.co/...",
    "mediaType": "IMAGE"
  }
}
```

---

### Settings

#### GET /settings
Get site settings.

**Auth:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    "site_name": "Ingata Real Estate",
    "email": "info@ingata.com",
    "phone": "+250788123456",
    "address": "Kigali, Rwanda",
    "hero_title": "Find Your Dream Property",
    "hero_subtitle": "Premium real estate services in Rwanda"
  }
}
```

#### PUT /settings
Update site settings.

**Auth:** Required (admin)

---

### Pages

#### GET /pages
Get all site pages.

**Auth:** Public

#### GET /pages/:slug
Get page by slug.

**Auth:** Public

---

### Admin Endpoints

#### GET /admin/dashboard
Get admin dashboard statistics.

**Auth:** Required (admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProperties": 150,
    "totalInquiries": 500,
    "totalViewings": 200,
    "totalUsers": 1000,
    "recentActivity": [ ... ]
  }
}
```

#### GET /admin/users
Get all users.

**Auth:** Required (admin)

#### POST /admin/users
Create new user.

**Auth:** Required (admin)

#### PATCH /admin/users/:id
Update user.

**Auth:** Required (admin)

#### DELETE /admin/users/:id
Delete user.

**Auth:** Required (admin)

#### GET /admin/roles
Get all roles.

**Auth:** Required (admin)

#### PATCH /admin/users/:id/media-permission
Update user media upload permission.

**Auth:** Required (admin)

---

### Admin Properties

#### GET /admin/properties
Get all properties (admin view).

**Auth:** Required (admin)

#### POST /admin/properties
Create property (admin).

**Auth:** Required (admin)

#### PATCH /admin/properties/:id
Update property (admin).

**Auth:** Required (admin)

#### DELETE /admin/properties/:id
Delete property (admin).

**Auth:** Required (admin)

#### POST /admin/properties/media
Upload property media (admin).

**Auth:** Required (admin)

---

### Admin Articles

#### GET /admin/articles
Get all articles (admin view).

**Auth:** Required (admin)

#### POST /admin/articles
Create article.

**Auth:** Required (admin)

#### PATCH /admin/articles/:id
Update article.

**Auth:** Required (admin)

#### DELETE /admin/articles/:id
Delete article.

**Auth:** Required (admin)

---

### Admin Categories

#### GET /admin/categories
Get all categories (admin view).

**Auth:** Required (admin)

#### POST /admin/categories
Create category.

**Auth:** Required (admin)

#### PATCH /admin/categories/:id
Update category.

**Auth:** Required (admin)

#### DELETE /admin/categories/:id
Delete category.

**Auth:** Required (admin)

---

### Admin Analytics

#### GET /admin/analytics/summary
Get analytics summary.

**Auth:** Required (admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPageViews": 10000,
    "totalPropertyViews": 5000,
    "totalClickEvents": 2000,
    "uniqueVisitors": 3000,
    "period": "last-30-days"
  }
}
```

#### GET /admin/analytics/devices
Get device breakdown.

**Auth:** Required (admin)

#### GET /admin/analytics/sources
Get traffic sources.

**Auth:** Required (admin)

#### GET /admin/analytics/funnel
Get conversion funnel.

**Auth:** Required (admin)

#### POST /admin/analytics/cleanup
Trigger analytics data cleanup.

**Auth:** Required (admin)

---

### Agent Dashboard

#### GET /agent-dashboard/my-properties
Get agent's assigned properties.

**Auth:** Required (agent, admin)

#### GET /agent-dashboard/my-inquiries
Get agent's inquiries.

**Auth:** Required (agent, admin)

#### PATCH /agent-dashboard/my-inquiries/:id/status
Update inquiry status.

**Auth:** Required (agent, admin)

#### PATCH /agent-dashboard/my-inquiries/:id/follow-up
Update inquiry follow-up date and notes.

**Auth:** Required (agent, admin)

#### GET /agent-dashboard/my-viewings
Get agent's viewings.

**Auth:** Required (agent, admin)

#### POST /agent-dashboard/my-viewings
Schedule viewing.

**Auth:** Required (agent, admin)

---

### Property Manager

#### GET /property-manager
Get managed properties.

**Auth:** Required (property_manager, admin)

#### GET /property-manager/agents
Get assignable agents.

**Auth:** Required (property_manager, admin)

#### GET /property-manager/developments
Get developments.

**Auth:** Required (property_manager, admin)

#### POST /property-manager/developments
Create development.

**Auth:** Required (property_manager, admin)

#### GET /property-manager/property-features
Get property features.

**Auth:** Required (property_manager, admin)

#### POST /property-manager/property-features
Create property feature.

**Auth:** Required (property_manager, admin)

#### GET /property-manager/inquiries
Get managed inquiries.

**Auth:** Required (property_manager, admin)

#### GET /property-manager/viewings
Get managed viewings.

**Auth:** Required (property_manager, admin)

#### GET /property-manager/listings
Get managed listing requests.

**Auth:** Required (property_manager, admin)

---

### Content Editor

#### GET /content-editor/articles
Get articles (content editor view).

**Auth:** Required (content_editor, admin)

#### POST /content-editor/articles
Create article.

**Auth:** Required (content_editor, admin)

#### PATCH /content-editor/articles/:id
Update article.

**Auth:** Required (content_editor, admin)

#### DELETE /content-editor/articles/:id
Delete article.

**Auth:** Required (content_editor, admin)

#### GET /content-editor/faqs
Get FAQs (content editor view).

**Auth:** Required (content_editor, admin)

#### POST /content-editor/faqs
Create FAQ.

**Auth:** Required (content_editor, admin)

#### GET /content-editor/pages
Get pages (content editor view).

**Auth:** Required (content_editor, admin)

#### POST /content-editor/pages
Create page.

**Auth:** Required (content_editor, admin)

#### GET /content-editor/testimonials
Get testimonials (content editor view).

**Auth:** Required (content_editor, admin)

#### POST /content-editor/testimonials
Create testimonial.

**Auth:** Required (content_editor, admin)

---

### Analytics Tracking

#### POST /analytics/page-view
Track page view.

**Auth:** Public

**Request Body:**
```json
{
  "page_path": "/properties/modern-apartment",
  "page_title": "Modern Apartment",
  "referrer": "https://google.com",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "property-ads"
}
```

#### POST /analytics/property-view
Track property detail view.

**Auth:** Public

**Request Body:**
```json
{
  "property_id": "uuid",
  "session_duration_seconds": 120
}
```

#### POST /analytics/click-event
Track user interaction.

**Auth:** Public

**Request Body:**
```json
{
  "event_type": "PHONE",
  "property_id": "uuid",
  "element_text": "Call Agent",
  "page_path": "/properties/modern-apartment"
}
```

**Event Types:**
- `CTA` - Call-to-action button
- `PHONE` - Phone number click
- `EMAIL` - Email click
- `WHATSAPP` - WhatsApp click
- `LINK` - Link click
- `BUTTON` - Generic button click
- `SEARCH` - Search action
- `FILTER` - Filter action

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful delete) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid or missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate, invalid state) |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |
| 502 | Bad Gateway (external service failure) |
| 503 | Service Unavailable |

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 429 Rate Limit Exceeded
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Health Check

#### GET /health
Check API health status.

**Auth:** Public

**Response:**
```json
{
  "success": true,
  "message": "Ingata Real Estate API is running"
}
```

---

## Testing the API

### Using cURL

```bash
# Get properties
curl http://localhost:5000/api/v1/properties

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password123!"}'

# Get user profile (with token)
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <your-token>"
```

### Using Postman

1. Import API endpoints
2. Set base URL: `http://localhost:5000/api/v1`
3. Add Authorization header with Bearer token
4. Send requests

---

## SDK/Client Libraries

### JavaScript/TypeScript

The frontend includes a custom API client in `frontend/src/services/api.ts`:

```typescript
import { api, adminApi, portalApi } from '@/services/api';

// Public API
const properties = await api.getProperties();

// Admin API
const users = await adminApi.getUsers();

// Portal API
const myProperties = await portalApi.getMyProperties();
```

---

## Changelog

### v1.0.0 (October 2026)
- Initial API release
- 200+ endpoints across all features
- JWT authentication
- Rate limiting
- Analytics tracking
- Media upload support
