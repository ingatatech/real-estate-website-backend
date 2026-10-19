# API Reference

**Last Updated:** October 19, 2026  
**Base URL:** `http://localhost:5000/api/v1` (development), `https://ingata-backend.onrender.com/api/v1` (production)  
**Version:** 1.0.0

---

## Table of Contents
1. [Overview](#overview)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Public Endpoints](#public-endpoints)
4. [Admin Endpoints](#admin-endpoints)
5. [Agent Dashboard Endpoints](#agent-dashboard-endpoints)
6. [Property Manager Endpoints](#property-manager-endpoints)
7. [Content Editor Endpoints](#content-editor-endpoints)
8. [Analytics Endpoints](#analytics-endpoints)
9. [Response Format](#response-format)
10. [Error Handling](#error-handling)

---

## Overview

### Authentication
- Most endpoints require JWT authentication
- Token sent in `Authorization: Bearer <token>` header
- Public endpoints marked as such

### Rate Limiting
- Not currently implemented
- TODO: Add rate limiting for production

### Pagination
- Query parameters: `page`, `limit`
- Default: `page=1`, `limit=10`
- Max limit: 100
- Response includes pagination metadata

### Filtering
- Most list endpoints support query parameter filtering
- Common filters: `status`, `category`, `property_type`, etc.

---

## Authentication Endpoints

### POST /auth/login
**Description:** Public user login

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user-uuid",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

**Errors:**
- 400: Missing email or password
- 401: Invalid credentials
- 403: Account deactivated
- 500: Internal server error

---

### POST /auth/register
**Description:** User registration

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

**Errors:**
- 400: Missing email or password
- 409: Email already exists
- 500: Internal server error

---

### POST /auth/admin/login
**Description:** Admin login (requires admin role)

**Request Body:**
```json
{
  "email": "admin@realestate.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "admin-uuid",
      "name": "Admin User",
      "email": "admin@realestate.com",
      "role": "admin"
    }
  }
}
```

**Errors:**
- 400: Missing email or password
- 401: Invalid credentials
- 403: Account deactivated or not admin
- 500: Internal server error

---

### POST /auth/forgot-password
**Description:** Request password reset email

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If an account exists for that email, password reset instructions will be sent."
}
```

**Errors:**
- 400: Invalid email format
- 503: Password reset not configured (SMTP missing)
- 503: Email delivery failed
- 500: Internal server error

**Note:** Returns generic message regardless of whether email exists (security)

---

### POST /auth/reset-password
**Description:** Reset password with token

**Request Body:**
```json
{
  "token": "64-character-hex-token",
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now sign in."
}
```

**Errors:**
- 400: Invalid token format
- 400: Invalid password length (8-128 characters)
- 400: Token expired or invalid
- 500: Internal server error

---

### POST /auth/logout
**Description:** Logout (client-side token removal)

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

**Note:** JWT is stateless - client simply discards token

---

### GET /auth/me
**Description:** Get current authenticated user

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "+1234567890",
    "isActive": true,
    "createdAt": "2026-10-01T00:00:00.000Z",
    "role": {
      "name": "user"
    }
  }
}
```

**Errors:**
- 401: Not authenticated
- 404: User not found
- 500: Internal server error

---

### PATCH /auth/profile
**Description:** Update user profile

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "+9876543210"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "name": "Updated Name",
    "email": "user@example.com",
    "phone": "+9876543210"
  }
}
```

**Errors:**
- 401: Not authenticated
- 404: User not found
- 500: Internal server error

---

## Public Endpoints

### GET /properties
**Description:** List properties with filters

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `property_type` - Filter by property type
- `transaction_type` - Filter by transaction type
- `category` - Filter by category slug
- `status` - Filter by status
- `is_featured` - Filter featured properties
- `min_price` - Minimum price
- `max_price` - Maximum price
- `location` - Filter by location
- `bedrooms` - Number of bedrooms
- `bathrooms` - Number of bathrooms

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "property-uuid",
      "title": "Property Title",
      "slug": "property-slug",
      "price": 500000,
      "currency": "USD",
      "location": "Location",
      "propertyType": "RESIDENTIAL",
      "transactionType": "SALE",
      "bedrooms": 3,
      "bathrooms": 2,
      "size": 150,
      "sizeUnit": "sqm",
      "status": "AVAILABLE",
      "isFeatured": false,
      "propertyImages": [
        {
          "imageUrl": "https://example.com/image.jpg",
          "isPrimary": true,
          "mediaType": "IMAGE"
        }
      ],
      "propertyFeatures": [
        {
          "feature": {
            "name": "Swimming Pool"
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

### GET /properties/:slug
**Description:** Get property by slug

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "property-uuid",
    "title": "Property Title",
    "slug": "property-slug",
    "description": "Property description",
    "price": 500000,
    "currency": "USD",
    "location": "Location",
    "district": "District",
    "sector": "Sector",
    "address": "Full Address",
    "latitude": -1.95,
    "longitude": 30.05,
    "size": 150,
    "sizeUnit": "sqm",
    "bedrooms": 3,
    "bathrooms": 2,
    "status": "AVAILABLE",
    "propertyImages": [...],
    "propertyFeatures": [...],
    "agent": {
      "id": "agent-uuid",
      "name": "Agent Name",
      "slug": "agent-slug",
      "phone": "+1234567890",
      "email": "agent@example.com"
    }
  }
}
```

**Errors:**
- 404: Property not found

---

### GET /agents
**Description:** List agents

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `isActive` - Filter by active status

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "agent-uuid",
      "name": "Agent Name",
      "slug": "agent-slug",
      "email": "agent@example.com",
      "phone": "+1234567890",
      "profileImage": "https://example.com/avatar.jpg",
      "bio": "Agent biography",
      "specialization": "Residential",
      "yearsExperience": 5,
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### GET /agents/:slug
**Description:** Get agent by slug

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "agent-uuid",
    "name": "Agent Name",
    "slug": "agent-slug",
    "email": "agent@example.com",
    "phone": "+1234567890",
    "profileImage": "https://example.com/avatar.jpg",
    "bio": "Agent biography",
    "specialization": "Residential",
    "licenseNumber": "LICENSE-123",
    "yearsExperience": 5,
    "isActive": true,
    "properties": [...]
  }
}
```

**Errors:**
- 404: Agent not found

---

### GET /categories
**Description:** List property categories

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "category-uuid",
      "name": "Apartment",
      "slug": "apartment",
      "description": "Modern apartments",
      "isActive": true,
      "imageUrl": "https://example.com/category.jpg"
    }
  ]
}
```

---

### GET /article-categories
**Description:** List article categories

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "category-uuid",
      "name": "Market News",
      "slug": "market-news",
      "description": "Real estate market updates",
      "isActive": true
    }
  ]
}
```

---

### GET /articles
**Description:** List articles

**Query Parameters:**
- `category` - Filter by category slug

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "article-uuid",
      "title": "Article Title",
      "slug": "article-slug",
      "excerpt": "Article excerpt",
      "featuredImage": "https://example.com/image.jpg",
      "category": {
        "name": "Market News",
        "slug": "market-news"
      },
      "author": {
        "name": "Author Name"
      },
      "publicationStatus": "PUBLISHED",
      "publishedAt": "2026-10-01T00:00:00.000Z",
      "createdAt": "2026-10-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET /articles/:slug
**Description:** Get article by slug

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "article-uuid",
    "title": "Article Title",
    "slug": "article-slug",
    "excerpt": "Article excerpt",
    "content": "Full article content",
    "featuredImage": "https://example.com/image.jpg",
    "category": {...},
    "author": {...},
    "publicationStatus": "PUBLISHED",
    "publishedAt": "2026-10-01T00:00:00.000Z",
    "createdAt": "2026-10-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z"
  }
}
```

**Errors:**
- 404: Article not found

---

### GET /faqs
**Description:** List FAQs

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "faq-uuid",
      "question": "Question text",
      "answer": "Answer text",
      "category": "General",
      "displayOrder": 1,
      "isActive": true
    }
  ]
}
```

---

### GET /services
**Description:** List services

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "service-uuid",
      "name": "Property Valuation",
      "slug": "property-valuation",
      "shortDescription": "Professional valuation",
      "description": "Full description",
      "imageUrl": "https://example.com/service.jpg",
      "isActive": true,
      "displayOrder": 1
    }
  ]
}
```

---

### GET /pages
**Description:** List site pages

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "page-uuid",
      "title": "About Us",
      "slug": "about",
      "pageType": "static",
      "isPublished": true
    }
  ]
}
```

---

### GET /settings
**Description:** Get site settings

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "default",
    "siteName": "Real Estate Web",
    "logoUrl": "https://example.com/logo.png",
    "email": "contact@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "heroTitle": "Find Your Dream Property",
    "heroSubtitle": "Discover the perfect property",
    "defaultCurrency": "USD",
    "showAboutSection": true,
    "showServicesSection": true,
    "showFeaturedSection": true
  }
}
```

---

### POST /contact
**Description:** Submit contact form

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Property Inquiry",
  "message": "I'm interested in a property"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Contact message submitted successfully"
}
```

---

### POST /inquiries
**Description:** Submit property inquiry

**Request Body:**
```json
{
  "propertyId": "property-uuid",
  "agentId": "agent-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I'm interested in this property"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Inquiry submitted successfully"
}
```

---

### POST /viewings
**Description:** Request property viewing

**Request Body:**
```json
{
  "propertyId": "property-uuid",
  "agentId": "agent-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "preferredDate": "2026-10-20T10:00:00.000Z",
  "preferredTime": "10:00 AM",
  "message": "I'd like to view this property"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Viewing request submitted successfully"
}
```

---

### POST /valuations
**Description:** Request property valuation

**Request Body:**
```json
{
  "propertyId": "property-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "propertyType": "RESIDENTIAL",
  "location": "Kigali",
  "propertySize": 150,
  "bedrooms": 3,
  "bathrooms": 2,
  "description": "Property description"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Valuation request submitted successfully"
}
```

---

### POST /listings
**Description:** Submit property listing request

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "propertyType": "RESIDENTIAL",
  "transactionType": "SALE",
  "location": "Kigali",
  "district": "Nyarugenge",
  "sector": "Nyamirambo",
  "propertySize": 150,
  "sizeUnit": "sqm",
  "bedrooms": 3,
  "bathrooms": 2,
  "description": "Property description",
  "price": 500000,
  "images": [
    {
      "imageUrl": "https://example.com/image.jpg",
      "mediaType": "IMAGE"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Listing request submitted successfully"
}
```

---

### POST /property-searches
**Description:** Save property search

**Request Body:**
```json
{
  "userId": "user-uuid",
  "email": "user@example.com",
  "location": "Kigali",
  "propertyType": "RESIDENTIAL",
  "transactionType": "SALE",
  "minPrice": 100000,
  "maxPrice": 500000,
  "minBedrooms": 2,
  "maxBedrooms": 4,
  "features": ["Swimming Pool", "Garden"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Search saved successfully"
}
```

---

### GET /favorites
**Description:** Get user favorites

**Query Parameters:**
- `userId` - User ID (required)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "favorite-uuid",
      "userId": "user-uuid",
      "propertyId": "property-uuid",
      "property": {
        "id": "property-uuid",
        "title": "Property Title",
        "slug": "property-slug",
        "price": 500000
      }
    }
  ]
}
```

---

### POST /favorites
**Description:** Add to favorites

**Request Body:**
```json
{
  "userId": "user-uuid",
  "propertyId": "property-uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Added to favorites"
}
```

---

### DELETE /favorites/:id
**Description:** Remove from favorites

**Response (204):** No content

---

### POST /property-media
**Description:** Upload property media (public)

**Request:** multipart/form-data with `file` field

**Response (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/uploaded-image.jpg",
    "mediaType": "IMAGE"
  }
}
```

**Note:** Storage provider not yet configured - may not work

---

## Admin Endpoints

All admin endpoints require:
- Authentication (JWT token)
- Admin role authorization

### GET /admin/dashboard
**Description:** Admin dashboard statistics

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalProperties": 100,
    "totalUsers": 50,
    "totalInquiries": 25,
    "totalViewings": 15,
    "pendingInquiries": 5,
    "pendingViewings": 3
  }
}
```

---

### GET /admin/users
**Description:** List users

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `role` - Filter by role

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-uuid",
      "name": "User Name",
      "email": "user@example.com",
      "phone": "+1234567890",
      "isActive": true,
      "canUploadPropertyMedia": false,
      "createdAt": "2026-10-01T00:00:00.000Z",
      "lastLoginAt": "2026-10-14T10:00:00.000Z",
      "role": {
        "id": 1,
        "name": "user"
      },
      "agentProfile": {
        "name": "Agent Name",
        "slug": "agent-slug",
        "isActive": true
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### POST /admin/users
**Description:** Create user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "roleId": 2,
  "isActive": true,
  "canUploadPropertyMedia": false,
  "agentProfile": {
    "name": "John Doe",
    "slug": "john-doe",
    "specialization": "Residential",
    "yearsExperience": 5
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": {
      "name": "user"
    }
  }
}
```

---

### PATCH /admin/users/:id
**Description:** Update user

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "+9876543210",
  "isActive": true,
  "roleId": 3,
  "canUploadPropertyMedia": true,
  "agentProfile": {
    "bio": "Updated bio"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {...}
}
```

---

### DELETE /admin/users/:id
**Description:** Delete user

**Response (204):** No content

---

### GET /admin/roles
**Description:** List roles

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "admin",
      "description": "Administrator with full access"
    },
    {
      "id": 2,
      "name": "agent",
      "description": "Real estate agent"
    },
    {
      "id": 3,
      "name": "user",
      "description": "Regular user"
    }
  ]
}
```

---

### GET /admin/property-managers
**Description:** Get assignable property managers

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-uuid",
      "name": "Property Manager Name",
      "email": "pm@example.com"
    }
  ]
}
```

---

### PATCH /admin/users/:id/media-permission
**Description:** Update user media upload permission

**Request Body:**
```json
{
  "canUploadPropertyMedia": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Media permission updated"
}
```

---

### GET /admin/properties
**Description:** List properties (admin view)

**Query Parameters:**
- `page`, `limit`
- `status`, `category`, `agent_id`, `property_manager_id`

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

---

### POST /admin/properties
**Description:** Create property

**Request Body:**
```json
{
  "title": "Property Title",
  "slug": "property-slug",
  "description": "Description",
  "categoryId": "category-uuid",
  "agentId": "agent-uuid",
  "propertyManagerId": "pm-uuid",
  "propertyType": "RESIDENTIAL",
  "transactionType": "SALE",
  "price": 500000,
  "currency": "USD",
  "location": "Kigali",
  "district": "Nyarugenge",
  "sector": "Nyamirambo",
  "address": "123 Main St",
  "latitude": -1.95,
  "longitude": 30.05,
  "size": 150,
  "sizeUnit": "sqm",
  "bedrooms": 3,
  "bathrooms": 2,
  "status": "AVAILABLE",
  "publicationStatus": "PUBLISHED",
  "isFeatured": false,
  "amenities": ["Swimming Pool", "Garden"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {...}
}
```

---

### PATCH /admin/properties/:id
**Description:** Update property

**Request Body:** Same as create (partial updates supported)

**Response (200):**
```json
{
  "success": true,
  "data": {...}
}
```

---

### DELETE /admin/properties/:id
**Description:** Delete property

**Response (204):** No content

---

### POST /admin/properties/media
**Description:** Upload property media

**Request:** multipart/form-data with `file` field

**Response (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/uploaded-image.jpg",
    "mediaType": "IMAGE"
  }
}
```

---

### Categories, Articles, FAQs, Services, Testimonials

Similar CRUD patterns for:
- `/admin/categories` - Property categories
- `/admin/article-categories` - Article categories
- `/admin/articles` - Articles
- `/admin/faqs` - FAQs
- `/admin/services` - Services
- `/admin/testimonials` - Testimonials

Each supports:
- `GET /admin/{resource}` - List
- `GET /admin/{resource}/:id` - Get single
- `POST /admin/{resource}` - Create
- `PATCH /admin/{resource}/:id` - Update
- `DELETE /admin/{resource}/:id` - Delete

---

### GET /admin/inquiries
**Description:** List inquiries

**Query Parameters:**
- `page`, `limit`, `status`, `property_id`, `agent_id`

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

---

### PATCH /admin/inquiries/:id
**Description:** Update inquiry status

**Request Body:**
```json
{
  "status": "CONTACTED"
}
```

---

### DELETE /admin/inquiries/:id
**Description:** Delete inquiry

---

### Viewing Requests, Valuations, Listings, Contact Messages

Similar patterns for:
- `/admin/viewings` - Viewing requests
- `/admin/valuations` - Valuation requests
- `/admin/listings` - Listing requests
- `/admin/contact` - Contact messages

Special actions:
- `PATCH /admin/listings/:id/approve` - Approve listing
- `PATCH /admin/listings/:id/reject` - Reject listing
- `POST /admin/contact/:id/reply` - Reply to contact message

---

### GET /admin/settings
**Description:** Get site settings

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "default",
    "siteName": "Real Estate Web",
    "heroTitle": "Find Your Dream Property",
    ...
  }
}
```

---

### PUT /admin/settings
**Description:** Update site settings

**Request Body:** Full settings object

**Response (200):**
```json
{
  "success": true,
  "data": {...}
}
```

---

## Agent Dashboard Endpoints

Require: Agent role authentication

### GET /agent-dashboard/my-properties
**Description:** Get agent's assigned properties

**Response (200):**
```json
{
  "success": true,
  "data": [...]
}
```

---

### PATCH /agent-dashboard/my-properties/:id
**Description:** Update agent's property

**Request Body:** Partial property update

**Response (200):**
```json
{
  "success": true,
  "data": {...}
}
```

---

### DELETE /agent-dashboard/my-properties/:id
**Description:** Delete agent's property

---

### POST /agent-dashboard/property-media
**Description:** Upload property media

---

### GET /agent-dashboard/my-inquiries
**Description:** Get agent's inquiries

**Response (200):**
```json
{
  "success": true,
  "data": [...]
}
```

---

### PATCH /agent-dashboard/my-inquiries/:id/status
**Description:** Update inquiry status

**Request Body:**
```json
{
  "status": "CONTACTED"
}
```

---

### PATCH /agent-dashboard/my-inquiries/:id/follow-up
**Description:** Update inquiry follow-up

**Request Body:**
```json
{
  "notes": "Called client, interested",
  "nextFollowUpDate": "2026-10-20T10:00:00.000Z"
}
```

---

### GET /agent-dashboard/my-viewings
**Description:** Get agent's viewings

---

### PATCH /agent-dashboard/my-viewings/:id
**Description:** Update viewing

**Request Body:**
```json
{
  "status": "CONFIRMED",
  "preferredDate": "2026-10-20T10:00:00.000Z"
}
```

---

## Property Manager Endpoints

Require: Property Manager role authentication (admin bypass)

### GET /property-manager
**Description:** Get managed properties

**Query Parameters:**
- `page`, `limit`, `status`

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

---

### POST /property-manager
**Description:** Create managed property (auto-assigned to self)

**Request Body:** Same as admin property create

**Response (201):**
```json
{
  "success": true,
  "data": {...}
}
```

---

### PATCH /property-manager/:id
**Description:** Update managed property

---

### DELETE /property-manager/:id
**Description:** Delete managed property

---

### POST /property-manager/media
**Description:** Upload managed property media

---

### GET /property-manager/agents
**Description:** Get assignable agents

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "agent-uuid",
      "name": "Agent Name"
    }
  ]
}
```

---

### GET /property-manager/inquiries
**Description:** Get managed inquiries

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...},
  "stats": {
    "statusCounts": {
      "NEW": 5,
      "CONTACTED": 3
    },
    "newInquiries": 8
  }
}
```

---

### PATCH /property-manager/inquiries/:id
**Description:** Update managed inquiry

---

### DELETE /property-manager/inquiries/:id
**Description:** Delete managed inquiry

---

### GET /property-manager/viewings
**Description:** Get managed viewings

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...},
  "stats": {
    "upcomingViewings": 5,
    "pendingViewings": 2
  }
}
```

---

### POST /property-manager/viewings
**Description:** Create managed viewing

**Request Body:**
```json
{
  "propertyId": "property-uuid",
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "+1234567890",
  "preferredDate": "2026-10-20T10:00:00.000Z",
  "preferredTime": "10:00 AM",
  "status": "PENDING"
}
```

---

### PATCH /property-manager/viewings/:id
**Description:** Update managed viewing

---

### DELETE /property-manager/viewings/:id
**Description:** Delete managed viewing

---

### GET /property-manager/requests
**Description:** Get listing requests

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...},
  "stats": {
    "pendingRequests": 3
  }
}
```

---

### PATCH /property-manager/requests/:id
**Description:** Update listing request

---

### PATCH /property-manager/requests/:id/approve
**Description:** Approve listing request

---

### PATCH /property-manager/requests/:id/reject
**Description:** Reject listing request

---

## Content Editor Endpoints

Require: Content Editor role authentication

### GET /content-editor/articles
**Description:** Get articles

**Response (200):**
```json
{
  "success": true,
  "data": [...]
}
```

---

### POST /content-editor/articles
**Description:** Create article

**Request Body:**
```json
{
  "title": "Article Title",
  "slug": "article-slug",
  "excerpt": "Excerpt",
  "content": "Full content",
  "featuredImage": "https://example.com/image.jpg",
  "categoryId": "category-uuid",
  "publicationStatus": "DRAFT"
}
```

---

### PATCH /content-editor/articles/:id
**Description:** Update article

---

### DELETE /content-editor/articles/:id
**Description:** Delete article

---

### GET /content-editor/pages
**Description:** Get pages

---

### POST /content-editor/pages
**Description:** Create page

**Request Body:**
```json
{
  "title": "Page Title",
  "slug": "page-slug",
  "content": "Page content",
  "pageType": "static",
  "metaTitle": "SEO Title",
  "metaDescription": "SEO Description",
  "isPublished": true
}
```

---

### PATCH /content-editor/pages/:id
**Description:** Update page

---

### DELETE /content-editor/pages/:id
**Description:** Delete page

---

### GET /content-editor/faqs
**Description:** Get FAQs

---

### POST /content-editor/faqs
**Description:** Create FAQ

**Request Body:**
```json
{
  "question": "Question text",
  "answer": "Answer text",
  "category": "General",
  "displayOrder": 1,
  "isActive": true
}
```

---

### PATCH /content-editor/faqs/:id
**Description:** Update FAQ

---

### DELETE /content-editor/faqs/:id
**Description:** Delete FAQ

---

## Analytics Endpoints

### POST /analytics/page-view
**Description:** Track page view (public, no auth)

**Request Body:**
```json
{
  "pagePath": "/properties",
  "pageTitle": "Properties",
  "referrer": "https://google.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Page view tracked"
}
```

---

### POST /analytics/property-view
**Description:** Track property view (public, no auth)

**Request Body:**
```json
{
  "propertyId": "property-uuid",
  "sessionDurationSeconds": 30,
  "referrer": "https://google.com"
}
```

---

### POST /analytics/click-event
**Description:** Track click event (public, no auth)

**Request Body:**
```json
{
  "eventType": "CTA",
  "propertyId": "property-uuid",
  "elementId": "contact-button",
  "elementText": "Contact Agent",
  "pagePath": "/properties/property-slug",
  "destinationUrl": "/contact"
}
```

**Event Types:** CTA, PHONE, EMAIL, WHATSAPP, LINK, BUTTON

---

### GET /analytics/summary
**Description:** Get analytics summary (auth required)

**Query Parameters:**
- `period` - today, 7days, 30days, 90days (default: 30days)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pageViews": 1000,
    "propertyViews": 500,
    "clickEvents": 200,
    "inquiries": 25,
    "viewings": 15,
    "uniqueVisitors": 800,
    "averageSessionDuration": 120
  }
}
```

---

### GET /analytics/devices
**Description:** Get device breakdown (auth required)

**Query Parameters:**
- `period` - today, 7days, 30days, 90days

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "deviceType": "Desktop",
      "count": 600,
      "percentage": 60
    },
    {
      "deviceType": "Mobile",
      "count": 350,
      "percentage": 35
    },
    {
      "deviceType": "Tablet",
      "count": 50,
      "percentage": 5
    }
  ]
}
```

---

### GET /analytics/sources
**Description:** Get traffic sources (auth required)

**Query Parameters:**
- `period` - today, 7days, 30days, 90days

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "source": "google",
      "count": 400,
      "percentage": 40
    },
    {
      "source": "direct",
      "count": 300,
      "percentage": 30
    },
    {
      "source": "facebook",
      "count": 200,
      "percentage": 20
    }
  ]
}
```

---

### GET /analytics/export-csv
**Description:** Export analytics as CSV (auth required)

**Query Parameters:**
- `period` - today, 7days, 30days, 90days
- `type` - pageViews, propertyViews, clickEvents

**Response (200):** CSV file download

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

### Common Error Messages

| Error | Cause |
|-------|-------|
| "Authentication required" | Missing or invalid token |
| "Invalid or expired token" | Token verification failed |
| "Forbidden: insufficient permissions" | Role not authorized |
| "Resource not found" | Entity doesn't exist |
| "Email already exists" | Duplicate email |
| "Invalid email or password" | Wrong credentials |
| "Required field missing" | Validation error |

---

## Health Check

### GET /api/v1/health
**Description:** API health check

**Response (200):**
```json
{
  "success": true,
  "message": "Ingata Real Estate API is running"
}
```

---

## Notes

### Authentication Header Format
```
Authorization: Bearer <jwt_token>
```

### Date Format
All dates in ISO 8601 format: `2026-10-14T10:00:00.000Z`

### ID Format
All IDs are UUID strings (text type in database)

### Boolean Values
Boolean values are lowercase: `true`, `false`

### Enum Values
Common enum values (case-sensitive):
- Property types: RESIDENTIAL, COMMERCIAL, LAND, etc.
- Transaction types: SALE, RENT, LEASE
- Status values: AVAILABLE, SOLD, RENTED, PENDING, etc.
- Publication status: PUBLISHED, DRAFT, ARCHIVED
