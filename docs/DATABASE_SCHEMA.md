# Database Schema

**Last Updated:** October 27, 2026  
**Database:** PostgreSQL  
**ORM:** TypeORM  
**Total Tables:** 30  
**Migrations:** 9

---

## Overview

The Ingata Real Estate platform uses PostgreSQL as its primary database. The schema is managed through TypeORM migrations and includes 30 tables covering user management, property listings, content management, analytics, and more.

### Database Connection
- **Development:** Configured via DATABASE_URL in .env
- **Production:** Render PostgreSQL (pooled connection)
- **Migrations:** Use DATABASE_URL_UNPOOLED for direct connections

---

## Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐
│    roles    │─────────│   users     │
└─────────────┘         └──────┬──────┘
                               │
                   ┌───────────┼───────────┐
                   │           │           │
            ┌──────▼──────┐ ┌──▼────┐ ┌───▼────┐
            │   agents    │ │ etc   │ │ etc    │
            └──────┬──────┘ └───────┘ └────────┘
                   │
            ┌──────▼──────┐
            │ properties  │
            └──────┬──────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
┌────▼────┐  ┌────▼────┐  ┌────▼────┐
│ images  │  │inquiries│  │viewings │
└─────────┘  └─────────┘  └─────────┘
```

---

## Tables

### 1. roles

User roles for access control.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO_INCREMENT | Role ID |
| name | text | UNIQUE, INDEXED | Role name (normalized to lowercase) |
| description | text | NULLABLE | Role description |

**Relationships:**
- One-to-many with users

**Default Roles:**
- admin
- agent
- user
- property_manager
- content_editor

---

### 2. users

User accounts with authentication and profile information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | User ID |
| name | text | NULLABLE | User full name |
| email | text | UNIQUE | User email address |
| phone | text | NULLABLE | User phone number |
| password_hash | text | NOT NULL | Bcrypt-hashed password |
| role_id | integer | FOREIGN KEY → roles.id | User role |
| is_active | boolean | DEFAULT: true | Account active status |
| created_at | timestamp | NOT NULL | Account creation date |
| updated_at | timestamp | NOT NULL | Last update date |
| last_login_at | timestamp | NULLABLE | Last login timestamp |
| can_upload_property_media | boolean | DEFAULT: false | Media upload permission |
| password_reset_token_hash | text | NULLABLE | SHA-256 hashed reset token |
| password_reset_expires_at | timestamp | NULLABLE | Reset token expiration |

**Relationships:**
- Many-to-one: role
- One-to-many: agent, articles, contact_messages, favorites, inquiries, listing_requests, property_searches, service_requests, valuation_requests, viewing_requests, page_views, property_views, click_events

**Indexes:**
- email (unique)

---

### 3. agents

Agent profiles for real estate agents.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Agent ID |
| user_id | text | UNIQUE, FOREIGN KEY → users.id (CASCADE) | Associated user |
| name | text | NOT NULL | Agent name |
| slug | text | UNIQUE | URL-friendly name |
| email | text | NULLABLE | Agent email |
| phone | text | NULLABLE | Agent phone |
| profile_image | text | NULLABLE | Profile image URL |
| bio | text | NULLABLE | Agent biography |
| specialization | text | NULLABLE | Area of specialization |
| license_number | text | NULLABLE | Real estate license |
| years_experience | integer | NULLABLE | Years of experience |
| is_active | boolean | DEFAULT: true | Active status |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |

**Relationships:**
- Many-to-one: user
- One-to-many: inquiries, properties, viewing_requests

**Indexes:**
- user_id (unique)
- slug (unique)

---

### 4. property_categories

Property categories for classification.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Category ID |
| name | text | UNIQUE | Category name |
| slug | text | UNIQUE | URL-friendly name |
| description | text | NULLABLE | Category description |
| is_active | boolean | DEFAULT: true | Active status |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |
| image_url | text | NULLABLE | Category image URL |

**Relationships:**
- One-to-many: properties

**Indexes:**
- name (unique)
- slug (unique)

---

### 5. property_features

Available property features (e.g., "Swimming Pool", "Garden").

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Feature ID |
| name | text | UNIQUE | Feature name |
| slug | text | UNIQUE | URL-friendly name |
| created_at | timestamp | NOT NULL | Creation date |

**Relationships:**
- One-to-many: property_feature_links

**Indexes:**
- name (unique)
- slug (unique)

---

### 6. property_feature_links

Junction table for many-to-many relationship between properties and features.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| property_id | text | PRIMARY KEY, FOREIGN KEY → properties.id (CASCADE) | Property ID |
| feature_id | text | PRIMARY KEY, FOREIGN KEY → property_features.id (CASCADE) | Feature ID |

**Relationships:**
- Many-to-one: property
- Many-to-one: property_feature

**Primary Key:** (property_id, feature_id)

---

### 7. property_images

Property media (images and videos).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Image ID |
| property_id | text | FOREIGN KEY → properties.id (CASCADE) | Property ID |
| image_url | text | NOT NULL | Media URL |
| alt_text | text | NULLABLE | Alt text for accessibility |
| display_order | integer | DEFAULT: 0 | Display order |
| is_primary | boolean | DEFAULT: false | Primary image flag |
| created_at | timestamp | NOT NULL | Upload date |
| media_type | text | DEFAULT: 'IMAGE' | IMAGE or VIDEO |

**Relationships:**
- Many-to-one: property

---

### 8. developments

Real estate developments (multiple properties in one project).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Development ID |
| name | text | NOT NULL | Development name |
| slug | text | UNIQUE | URL-friendly name |
| description | text | NULLABLE | Development description |
| location | text | NULLABLE | Development location |
| developer_name | text | NULLABLE | Developer name |
| status | text | NULLABLE | Development status |
| completion_date | timestamp | NULLABLE | Expected completion |
| image_url | text | NULLABLE | Development image |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |

**Relationships:**
- One-to-many: properties

**Indexes:**
- slug (unique)

---

### 9. properties

Property listings with full details.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Property ID |
| property_id | text | UNIQUE, NULLABLE | External property ID |
| title | text | NOT NULL | Property title |
| slug | text | UNIQUE | URL-friendly title |
| description | text | NULLABLE | Property description |
| category_id | text | FOREIGN KEY → property_categories.id (NULLABLE) | Property category |
| agent_id | text | FOREIGN KEY → agents.id (NULLABLE) | Assigned agent |
| property_manager_id | text | FOREIGN KEY → users.id (NULLABLE, SET NULL) | Property manager |
| development_id | text | FOREIGN KEY → developments.id (NULLABLE) | Development |
| property_type | text | DEFAULT: 'RESIDENTIAL' | RESIDENTIAL, COMMERCIAL, etc. |
| transaction_type | text | DEFAULT: 'SALE' | SALE, RENT, LEASE |
| price | decimal | NULLABLE | Property price |
| currency | text | NULLABLE | Currency code |
| location | text | NULLABLE | Property location |
| district | text | NULLABLE | District (Rwanda) |
| sector | text | NULLABLE | Sector (Rwanda) |
| address | text | NULLABLE | Full address |
| latitude | double precision | NULLABLE | GPS latitude |
| longitude | double precision | NULLABLE | GPS longitude |
| size | decimal | NULLABLE | Property size |
| size_unit | text | NULLABLE | Size unit (sqm, sqft) |
| bedrooms | integer | NULLABLE | Number of bedrooms |
| bathrooms | integer | NULLABLE | Number of bathrooms |
| status | text | DEFAULT: 'AVAILABLE' | AVAILABLE, SOLD, RENTED |
| publication_status | text | DEFAULT: 'PUBLISHED' | PUBLISHED, DRAFT |
| is_featured | boolean | DEFAULT: false | Featured property |
| is_new_development | boolean | DEFAULT: false | New development |
| listed_at | timestamp | NULLABLE | Listing date |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |
| furnishing_status | text | NULLABLE | Furnished, Unfurnished |
| amenities | text array | DEFAULT: '{}' | List of amenities |
| area | text | NULLABLE | Area name |
| location_description | text | NULLABLE | Location description |
| nearby_landmarks | text | NULLABLE | Nearby landmarks |
| neighborhood | text | NULLABLE | Neighborhood name |
| parking | integer | NULLABLE | Parking spaces |

**Relationships:**
- Many-to-one: agent, user (property_manager), property_category, development
- One-to-many: property_feature_links, property_images, favorites, inquiries, listing_requests, valuation_requests, viewing_requests, property_views, click_events

**Indexes:**
- property_id (unique)
- slug (unique)
- property_manager_id
- category_id
- transaction_type
- property_type
- status
- publication_status
- is_featured

---

### 10. article_categories

Article/blog categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Category ID |
| name | text | UNIQUE | Category name |
| slug | text | UNIQUE | URL-friendly name |
| description | text | NULLABLE | Category description |
| is_active | boolean | DEFAULT: true | Active status |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |
| image_url | text | NULLABLE | Category image URL |

**Relationships:**
- One-to-many: articles

**Indexes:**
- name (unique)
- slug (unique)

**Predefined Categories:**
1. Property Market Updates
2. Buying Guides
3. Renting Guides
4. Selling Guides
5. Property Investment
6. Property Management
7. Homeownership
8. Real Estate Trends
9. Company Announcements
10. New Developments

---

### 11. articles

Blog articles and insights.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Article ID |
| title | text | NOT NULL | Article title |
| slug | text | UNIQUE | URL-friendly title |
| excerpt | text | NULLABLE | Article excerpt |
| content | text | NOT NULL | Article content (HTML/Markdown) |
| featured_image | text | NULLABLE | Featured image URL |
| category_id | text | FOREIGN KEY → article_categories.id (NULLABLE) | Article category |
| author_id | text | FOREIGN KEY → users.id (NULLABLE) | Author |
| publication_status | text | DEFAULT: 'DRAFT' | DRAFT, PUBLISHED |
| published_at | timestamp | NULLABLE | Publication date |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |

**Relationships:**
- Many-to-one: user (author), article_category

**Indexes:**
- slug (unique)
- publication_status
- published_at

---

### 12. services

Service offerings (e.g., Property Management, Valuation).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Service ID |
| name | text | NOT NULL | Service name |
| slug | text | UNIQUE | URL-friendly name |
| short_description | text | NULLABLE | Short description |
| description | text | NULLABLE | Full description |
| image_url | text | NULLABLE | Service image |
| is_active | boolean | DEFAULT: true | Active status |
| display_order | integer | DEFAULT: 0 | Display order |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |

**Relationships:**
- One-to-many: service_requests

**Indexes:**
- slug (unique)

---

### 13. service_requests

Service inquiry requests.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Request ID |
| service_id | text | FOREIGN KEY → services.id (CASCADE) | Service |
| user_id | text | FOREIGN KEY → users.id (NULLABLE) | User |
| name | text | NOT NULL | Contact name |
| email | text | NOT NULL | Contact email |
| phone | text | NULLABLE | Contact phone |
| message | text | NULLABLE | Request message |
| status | text | DEFAULT: 'NEW' | NEW, IN_PROGRESS, COMPLETED |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |

**Relationships:**
- Many-to-one: service, user

---

### 14. site_pages

Static site pages (About, Legal, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Page ID |
| title | text | NOT NULL | Page title |
| slug | text | UNIQUE | URL-friendly title |
| content | text | NULLABLE | Page content (HTML) |
| page_type | text | NULLABLE | Page type |
| meta_title | text | NULLABLE | SEO meta title |
| meta_description | text | NULLABLE | SEO meta description |
| is_published | boolean | DEFAULT: true | Published status |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |

**Indexes:**
- slug (unique)
- is_published

---

### 15. site_settings

Site-wide configuration and settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Settings ID |
| site_name | text | NULLABLE | Site name |
| logo_url | text | NULLABLE | Logo URL |
| favicon_url | text | NULLABLE | Favicon URL |
| email | text | NULLABLE | Contact email |
| phone | text | NULLABLE | Contact phone |
| address | text | NULLABLE | Contact address |
| facebook_url | text | NULLABLE | Facebook URL |
| instagram_url | text | NULLABLE | Instagram URL |
| x_url | text | NULLABLE | X (Twitter) URL |
| linkedin_url | text | NULLABLE | LinkedIn URL |
| default_currency | text | NULLABLE | Default currency |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |
| about_cta_link | text | NULLABLE | About section CTA link |
| about_cta_text | text | NULLABLE | About section CTA text |
| about_description | text | NULLABLE | About section description |
| about_image_url | text | NULLABLE | About section image |
| about_title | text | NULLABLE | About section title |
| featured_section_title | text | NULLABLE | Featured section title |
| hero_cta_link | text | NULLABLE | Hero section CTA link |
| hero_cta_text | text | NULLABLE | Hero section CTA text |
| hero_image_url | text | NULLABLE | Hero section image |
| hero_subtitle | text | NULLABLE | Hero section subtitle |
| hero_title | text | NULLABLE | Hero section title |
| services_description | text | NULLABLE | Services section description |
| services_title | text | NULLABLE | Services section title |
| show_about_section | boolean | DEFAULT: false | Show about section |
| show_featured_section | boolean | DEFAULT: false | Show featured section |
| show_services_section | boolean | DEFAULT: false | Show services section |
| whatsapp | text | NULLABLE | WhatsApp number |
| analytics_retention_days | integer | DEFAULT: 365 | Analytics data retention period |

---

### 16. testimonials

Customer testimonials.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Testimonial ID |
| name | text | NOT NULL | Customer name |
| role | text | NULLABLE | Customer role/title |
| content | text | NOT NULL | Testimonial content |
| image_url | text | NULLABLE | Customer image |
| rating | integer | DEFAULT: 5 | Rating (1-5) |
| is_featured | boolean | DEFAULT: false | Featured testimonial |
| is_active | boolean | DEFAULT: true | Active status |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |

**Indexes:**
- is_featured
- is_active

---

### 17. faqs

Frequently asked questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | FAQ ID |
| question | text | NOT NULL | FAQ question |
| answer | text | NOT NULL | FAQ answer |
| category | text | NULLABLE | FAQ category |
| display_order | integer | DEFAULT: 0 | Display order |
| is_active | boolean | DEFAULT: true | Active status |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |

**Indexes:**
- category
- is_active
- display_order

---

### 18. contact_messages

Contact form submissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Message ID |
| name | text | NOT NULL | Contact name |
| email | text | NOT NULL | Contact email |
| phone | text | NULLABLE | Contact phone |
| subject | text | NULLABLE | Message subject |
| message | text | NOT NULL | Message content |
| status | text | DEFAULT: 'NEW' | NEW, READ, REPLIED |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |
| user_id | text | FOREIGN KEY → users.id (NULLABLE) | User (if logged in) |

**Relationships:**
- Many-to-one: user

**Indexes:**
- status
- created_at

---

### 19. favorites

User favorite properties.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Favorite ID |
| user_id | text | FOREIGN KEY → users.id (CASCADE) | User |
| property_id | text | FOREIGN KEY → properties.id (CASCADE) | Property |
| created_at | timestamp | NOT NULL | Creation date |

**Relationships:**
- Many-to-one: user, property

**Unique Constraint:** (user_id, property_id)

---

### 20. inquiries

Property inquiries from potential buyers/renters.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Inquiry ID |
| property_id | text | FOREIGN KEY → properties.id (NULLABLE) | Property |
| agent_id | text | FOREIGN KEY → agents.id (NULLABLE) | Assigned agent |
| user_id | text | FOREIGN KEY → users.id (NULLABLE) | User |
| name | text | NOT NULL | Contact name |
| email | text | NOT NULL | Contact email |
| phone | text | NULLABLE | Contact phone |
| inquiry | text | NOT NULL | Inquiry message |
| status | text | DEFAULT: 'NEW' | NEW, CONTACTED, CONVERTED, CLOSED |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |

**Relationships:**
- Many-to-one: property, agent, user
- One-to-many: agent_inquiry_notes

**Indexes:**
- status
- created_at
- property_id
- agent_id

---

### 21. agent_inquiry_notes

Agent notes and follow-up dates for inquiries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Note ID |
| agent_id | text | FOREIGN KEY → agents.id (CASCADE) | Agent |
| inquiry_id | text | FOREIGN KEY → inquiries.id (CASCADE) | Inquiry |
| notes | text | DEFAULT: '' | Agent notes |
| next_follow_up_date | timestamp | NULLABLE | Next follow-up date |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |

**Relationships:**
- Many-to-one: agent, inquiry

**Unique Constraint:** (agent_id, inquiry_id)

---

### 22. listing_requests

User-submitted property listing requests.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Request ID |
| property_id | text | FOREIGN KEY → properties.id (NULLABLE) | Created property (after approval) |
| user_id | text | FOREIGN KEY → users.id (NULLABLE) | User |
| name | text | NOT NULL | Owner name |
| email | text | NOT NULL | Owner email |
| phone | text | NULLABLE | Owner phone |
| property_type | text | DEFAULT: 'RESIDENTIAL' | Property type |
| transaction_type | text | DEFAULT: 'SALE' | Transaction type |
| location | text | NOT NULL | Property location |
| district | text | NULLABLE | District |
| sector | text | NULLABLE | Sector |
| property_size | decimal | NULLABLE | Property size |
| size_unit | text | NULLABLE | Size unit |
| bedrooms | integer | NULLABLE | Bedrooms |
| bathrooms | integer | NULLABLE | Bathrooms |
| description | text | NULLABLE | Property description |
| price | decimal | NULLABLE | Expected price |
| images | jsonb | DEFAULT: '[]' | Uploaded images (URLs) |
| status | text | DEFAULT: 'SUBMITTED' | SUBMITTED, PENDING, APPROVED, REJECTED |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |

**Relationships:**
- Many-to-one: property, user

**Indexes:**
- status
- created_at

---

### 23. property_searches

Saved property search criteria.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Search ID |
| user_id | text | FOREIGN KEY → users.id (CASCADE, INDEXED) | User |
| email | text | NULLABLE | Email for alerts |
| location | text | NULLABLE | Location filter |
| property_type | text | NULLABLE | Property type filter |
| transaction_type | text | NULLABLE | Transaction type filter |
| min_price | decimal | NULLABLE | Minimum price |
| max_price | decimal | NULLABLE | Maximum price |
| min_bedrooms | integer | NULLABLE | Minimum bedrooms |
| max_bedrooms | integer | NULLABLE | Maximum bedrooms |
| min_bathrooms | integer | NULLABLE | Minimum bathrooms |
| max_bathrooms | integer | NULLABLE | Maximum bathrooms |
| min_size | decimal | NULLABLE | Minimum size |
| max_size | decimal | NULLABLE | Maximum size |
| size_unit | text | NULLABLE | Size unit |
| availability | text | NULLABLE | Availability filter |
| furnishing_status | text | NULLABLE | Furnishing filter |
| features | text array | DEFAULT: '{}' | Required features |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |

**Relationships:**
- Many-to-one: user

**Indexes:**
- user_id

---

### 24. valuation_requests

Property valuation requests.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Valuation ID |
| property_id | text | FOREIGN KEY → properties.id (NULLABLE) | Property |
| user_id | text | FOREIGN KEY → users.id (NULLABLE) | User |
| name | text | NOT NULL | Contact name |
| email | text | NOT NULL | Contact email |
| phone | text | NULLABLE | Contact phone |
| property_type | text | DEFAULT: 'RESIDENTIAL' | Property type |
| location | text | NOT NULL | Property location |
| property_size | decimal | NULLABLE | Property size |
| bedrooms | integer | NULLABLE | Bedrooms |
| bathrooms | integer | NULLABLE | Bathrooms |
| description | text | NULLABLE | Property description |
| estimated_value | decimal | NULLABLE | Estimated value |
| status | text | DEFAULT: 'NEW' | NEW, IN_PROGRESS, COMPLETED |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |

**Relationships:**
- Many-to-one: property, user

**Indexes:**
- status
- created_at

---

### 25. viewing_requests

Property viewing requests.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Viewing ID |
| property_id | text | FOREIGN KEY → properties.id (CASCADE) | Property |
| user_id | text | FOREIGN KEY → users.id (NULLABLE) | User |
| agent_id | text | FOREIGN KEY → agents.id (NULLABLE) | Assigned agent |
| name | text | NOT NULL | Contact name |
| email | text | NOT NULL | Contact email |
| phone | text | NULLABLE | Contact phone |
| preferred_date | timestamp | NULLABLE | Preferred date |
| preferred_time | text | NULLABLE | Preferred time |
| message | text | NULLABLE | Additional message |
| status | text | DEFAULT: 'PENDING' | PENDING, SCHEDULED, COMPLETED, CANCELLED |
| created_at | timestamp | NOT NULL | Creation date |
| updated_at | timestamp | NOT NULL | Last update |

**Relationships:**
- Many-to-one: property, user, agent

**Indexes:**
- status
- created_at
- property_id
- agent_id

---

### 26. page_views

Analytics: Page view tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | View ID |
| user_id | text | FOREIGN KEY → users.id (SET NULL, INDEXED) | User (if logged in) |
| session_id | text | NULLABLE | Session identifier |
| page_path | text | INDEXED | Page path |
| page_title | text | NULLABLE | Page title |
| referrer | text | NULLABLE | Referrer URL |
| utm_source | text | NULLABLE | UTM source |
| utm_medium | text | NULLABLE | UTM medium |
| utm_campaign | text | NULLABLE | UTM campaign |
| utm_term | text | NULLABLE | UTM term |
| utm_content | text | NULLABLE | UTM content |
| device_type | text | NULLABLE | Device type |
| browser | text | NULLABLE | Browser name |
| os | text | NULLABLE | Operating system |
| ip_address | text | NULLABLE | IP address |
| country | text | NULLABLE | Country |
| city | text | NULLABLE | City |
| created_at | timestamp | INDEXED | View timestamp |

**Relationships:**
- Many-to-one: user

**Indexes:**
- user_id
- page_path
- created_at

---

### 27. property_views

Analytics: Property detail view tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | View ID |
| user_id | text | FOREIGN KEY → users.id (SET NULL, INDEXED) | User (if logged in) |
| session_id | text | NULLABLE | Session identifier |
| property_id | text | FOREIGN KEY → properties.id (CASCADE, INDEXED) | Property viewed |
| session_duration_seconds | text | NULLABLE | Time spent on page |
| referrer | text | NULLABLE | Referrer URL |
| device_type | text | NULLABLE | Device type |
| ip_address | text | NULLABLE | IP address |
| created_at | timestamp | INDEXED | View timestamp |

**Relationships:**
- Many-to-one: user, property

**Indexes:**
- user_id
- property_id
- created_at

---

### 28. click_events

Analytics: User interaction tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PRIMARY KEY, UUID | Event ID |
| user_id | text | FOREIGN KEY → users.id (SET NULL, INDEXED) | User (if logged in) |
| session_id | text | NULLABLE | Session identifier |
| event_type | text | INDEXED | CTA, PHONE, EMAIL, WHATSAPP, LINK, BUTTON, SEARCH, FILTER |
| property_id | text | FOREIGN KEY → properties.id (SET NULL, INDEXED) | Property (if applicable) |
| element_id | text | NULLABLE | Element ID |
| element_text | text | NULLABLE | Element text |
| page_path | text | NOT NULL | Page path |
| destination_url | text | NULLABLE | Destination URL |
| device_type | text | NULLABLE | Device type |
| ip_address | text | NULLABLE | IP address |
| created_at | timestamp | INDEXED | Event timestamp |

**Relationships:**
- Many-to-one: user, property

**Indexes:**
- user_id
- event_type
- property_id
- created_at

---

## Migrations

### Migration Files

1. **20261002000001-ResetDatabaseSchema.ts**
   - Complete database reset
   - Drops all tables
   - Recreates all tables with current schema
   - No down migration

2. **20261007000001-AddPasswordResetFields.ts**
   - Adds password reset fields to users table
   - password_reset_token_hash
   - password_reset_expires_at

3. **20261007000002-DeduplicateRoleNames.ts**
   - Normalizes role names to lowercase
   - Creates unique index on role names
   - Updates user role_id references

4. **20261008000001-AddAgentInquiryNotes.ts**
   - Creates agent_inquiry_notes table
   - For agent notes and follow-ups

5. **20261008000002-AddPropertyManagerOwnership.ts**
   - Adds property_manager_id to properties table
   - Enables property manager ownership

6. **20261012000001-RenameInquiryMessageColumn.ts**
   - Renames message column to inquiry in inquiries table

7. **20261012000002-CreateAnalyticsTables.ts**
   - Creates page_views table
   - Creates property_views table
   - Creates click_events table

8. **20261012000003-AddDataRetention.ts**
   - Adds analytics_retention_days to site_settings
   - Adds indexes for efficient cleanup

9. **20261018000001-InsertArticleCategories.ts**
   - Inserts 10 predefined article categories
   - Specific IDs for frontend compatibility

---

## Database Constraints

### Foreign Key Constraints

Most foreign keys have appropriate actions:
- **CASCADE:** Delete child records when parent is deleted
- **SET NULL:** Set foreign key to NULL when parent is deleted (used for analytics to preserve data)
- **NO ACTION:** Prevent deletion if child records exist

### Unique Constraints

- users.email
- roles.name (normalized)
- agents.user_id
- agents.slug
- property_categories.name
- property_categories.slug
- property_features.name
- property_features.slug
- developments.slug
- properties.property_id
- properties.slug
- article_categories.name
- article_categories.slug
- articles.slug
- services.slug
- site_pages.slug
- favorites (user_id, property_id)
- agent_inquiry_notes (agent_id, inquiry_id)

### Indexes

Performance indexes on:
- Foreign keys (user_id, property_id, etc.)
- Frequently queried fields (status, created_at, etc.)
- Unique fields (email, slug, etc.)
- Analytics fields (page_path, event_type, created_at)

---

## Data Retention

### Analytics Data Cleanup

- **Retention Period:** Configurable via site_settings.analytics_retention_days (default: 365 days)
- **Cleanup Schedule:** Daily at 2:00 AM UTC
- **Tables Cleaned:** page_views, property_views, click_events
- **Implementation:** node-cron scheduled task

### Manual Cleanup

Admin can trigger cleanup via API:
```bash
POST /api/v1/admin/analytics/cleanup
```

---

## Backup Strategy

### Render PostgreSQL
- **Automatic Backups:** Render provides automatic daily backups
- **Retention:** 7 days for free tier
- **Manual Backups:** Can be triggered via Render dashboard

### Neon
- **Automatic Backups:** Point-in-time recovery
- **Retention:** 7 days for free tier
- **Branching:** Can create database branches for testing

### Recommended
- Regular exports via pg_dump
- Store backups in secure location
- Test restore procedure regularly

---

## Performance Considerations

### Connection Pooling
- Use DATABASE_URL (pooled) for application
- Use DATABASE_URL_UNPOOLED for migrations
- Configure pool size in production

### Query Optimization
- Indexes on frequently queried fields
- Avoid N+1 queries with TypeORM relations
- Use pagination for large result sets

### Monitoring
- Monitor slow queries
- Check index usage
- Monitor connection pool utilization

---

## Security

### Data Protection
- Passwords hashed with bcrypt (12 rounds)
- Reset tokens hashed with SHA-256
- Sensitive data in environment variables
- No plaintext passwords stored

### Access Control
- Role-based access control enforced in application
- Database user has limited permissions
- No direct database access from frontend

### Compliance
- GDPR-ready with data retention policies
- User data can be deleted (CASCADE)
- Analytics data anonymized over time
