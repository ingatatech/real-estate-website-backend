# User Roles and Features

**Last Updated:** October 14, 2026

---

## Table of Contents
1. [Role Overview](#role-overview)
2. [Admin Role](#admin-role)
3. [Agent Role](#agent-role)
4. [Property Manager Role](#property-manager-role)
5. [Content Editor Role](#content-editor-role)
6. [User Role (Public)](#user-role-public)
7. [Role Matrix](#role-matrix)
8. [Permission Comparison](#permission-comparison)

---

## Role Overview

### Role Hierarchy

```
admin (highest privilege)
├── Property Manager
├── Agent
├── Content Editor
└── User (lowest privilege)
```

### Role Access Points

| Role | Login URL | Dashboard URL | Primary Purpose |
|------|-----------|---------------|-----------------|
| admin | /admin/login | /admin/dashboard | Full system administration |
| agent | /portal/login | /portal/dashboard | Manage assigned properties |
| property_manager | /portal/login | /portal/dashboard | Property oversight |
| content_editor | /portal/login | /portal/dashboard | Content management |
| user | /login | N/A | Public access, profile management |

### Shared Portal

The `/portal/login` endpoint is used by Agent, Property Manager, and Content Editor roles. After authentication, users are routed to role-specific workspaces within `/portal/dashboard`.

---

## Admin Role

### Access
- **Login:** `/admin/login`
- **Dashboard:** `/admin/dashboard`
- **Authentication:** JWT with admin role verification

### Capabilities

#### User Management
- ✅ Create users with any role
- ✅ Update user profiles and roles
- ✅ Delete users
- ✅ Manage agent profiles
- ✅ Assign property managers
- ✅ Grant/revoke media upload permissions
- ✅ View all users with filtering

#### Property Management
- ✅ Full CRUD on all properties
- ✅ Create, update, delete any property
- ✅ Upload property media
- ✅ Manage property categories
- ✅ Manage property features
- ✅ Set featured properties
- ✅ Assign agents to properties
- ✅ Assign property managers to properties
- ✅ Manage developments

#### Content Management
- ✅ Create, update, delete articles
- ✅ Manage article categories
- ✅ Create, update, delete FAQs
- ✅ Create, update, delete site pages
- ✅ Manage services
- ✅ Manage testimonials
- ✅ Publish/unpublish content

#### Inquiry & Request Management
- ✅ View all inquiries
- ✅ Update inquiry status
- ✅ Delete inquiries
- ✅ View all viewing requests
- ✅ Update viewing status
- ✅ Delete viewing requests
- ✅ View all valuation requests
- ✅ Update valuation status
- ✅ Delete valuation requests
- ✅ View all listing requests
- ✅ Approve/reject listing requests
- ✅ View all contact messages
- ✅ Reply to contact messages
- ✅ Delete contact messages

#### Analytics
- ✅ View full analytics dashboard
- ✅ Access all analytics data
- ✅ View device breakdown
- ✅ View traffic sources
- ✅ Export analytics as CSV
- ✅ Configure data retention policy

#### Site Configuration
- ✅ Update site settings
- ✅ Configure homepage content
- ✅ Manage social media links
- ✅ Configure contact information
- ✅ Toggle section visibility
- ✅ Set default currency

### Frontend Pages

**Dashboard:**
- `/admin/dashboard` - Overview with statistics

**User Management:**
- `/admin/users` - User list and management

**Property Management:**
- `/admin/properties` - Property list and management
- `/admin/categories` - Property categories
- `/admin/featured-properties` - Featured properties

**Content Management:**
- `/admin/articles` - Article management
- `/admin/article-categories` - Article categories
- `/admin/faqs` - FAQ management
- `/admin/services` - Service management
- `/admin/testimonials` - Testimonial management
- `/admin/pages` - Site page management

**Request Management:**
- `/admin/inquiries` - Inquiry management
- `/admin/viewings` - Viewing management
- `/admin/valuations` - Valuation management
- `/admin/listings` - Listing request management
- `/admin/contact` - Contact message management

**Configuration:**
- `/admin/settings` - Site settings
- `/admin/homepage` - Homepage content

**Analytics:**
- `/admin/analytics` - Analytics dashboard

### API Endpoints

All `/admin/*` endpoints require admin role:
- User management: `/admin/users/*`
- Property management: `/admin/properties/*`
- Content management: `/admin/articles/*`, `/admin/faqs/*`, etc.
- Request management: `/admin/inquiries/*`, `/admin/viewings/*`, etc.
- Configuration: `/admin/settings`, `/admin/homepage`
- Analytics: `/admin/analytics/*`

### Special Permissions

- **Bypass Ownership:** Admin can access any resource regardless of ownership
- **Full Analytics Access:** Can view analytics for all data
- **Role Assignment:** Can create users with any role
- **Media Upload:** Can upload property media by default

---

## Agent Role

### Access
- **Login:** `/portal/login`
- **Dashboard:** `/portal/dashboard` (Agent workspace)
- **Authentication:** JWT with agent role verification

### Capabilities

#### Property Management
- ✅ View assigned properties only
- ✅ Update assigned properties
- ✅ Delete assigned properties
- ✅ Upload property media (images/videos)
- ✅ Update property details
- ✅ Manage property images
- ❌ Cannot create new properties (admin or PM only)
- ❌ Cannot access properties not assigned to them

#### Inquiry Management
- ✅ View inquiries for assigned properties
- ✅ Update inquiry status
- ✅ Add follow-up notes to inquiries
- ✅ Set next follow-up date
- ✅ View inquiry history
- ❌ Cannot delete inquiries
- ❌ Cannot access inquiries for unassigned properties

#### Viewing Management
- ✅ View viewing requests for assigned properties
- ✅ Update viewing status
- ✅ Schedule viewings
- ✅ Cancel viewings
- ❌ Cannot delete viewings
- ❌ Cannot access viewings for unassigned properties

#### Analytics
- ✅ View analytics for assigned properties only
- ✅ View property views for their properties
- ✅ View inquiries stats for their properties
- ❌ Cannot access full analytics dashboard
- ❌ Cannot view other agents' data

### Frontend Pages

**Workspace:**
- `/portal/dashboard` - Agent workspace with role-specific UI

**Properties Section:**
- Properties list (filtered to assigned)
- Property detail view
- Property edit form
- Property media upload
- Property deletion

**Inquiries Section:**
- Inquiries list (filtered to assigned properties)
- Inquiry detail view
- Status update
- Follow-up notes
- Next follow-up date

**Viewings Section:**
- Viewings list (filtered to assigned properties)
- Viewing detail view
- Status update
- Scheduling interface

### API Endpoints

Agent-specific endpoints:
- `/agent-dashboard/my-properties` - Get agent's properties
- `/agent-dashboard/my-properties/:id` - Update agent's property
- `/agent-dashboard/my-properties/:id` - Delete agent's property
- `/agent-dashboard/property-media` - Upload property media
- `/agent-dashboard/my-inquiries` - Get agent's inquiries
- `/agent-dashboard/my-inquiries/:id/status` - Update inquiry status
- `/agent-dashboard/my-inquiries/:id/follow-up` - Update inquiry follow-up
- `/agent-dashboard/my-viewings` - Get agent's viewings
- `/agent-dashboard/my-viewings/:id` - Update viewing

### Property Assignment

Properties are assigned to agents via the `agent_id` foreign key in the `properties` table.

**Query:**
```sql
SELECT * FROM properties WHERE agent_id = :agentId
```

### Limitations

- Cannot manage properties not assigned to them
- Cannot create new properties (must be assigned by admin or PM)
- Cannot access other agents' data
- Cannot view full analytics
- Cannot manage categories or other system configuration

---

## Property Manager Role

### Access
- **Login:** `/portal/login`
- **Dashboard:** `/portal/dashboard` (Property Manager workspace)
- **Authentication:** JWT with property_manager role verification

### Capabilities

#### Property Management
- ✅ View managed properties (assigned via property_manager_id)
- ✅ Create new properties (auto-assigned to self)
- ✅ Update managed properties
- ✅ Delete managed properties
- ✅ Upload property media (role-based permission)
- ✅ Assign agents to properties
- ✅ Update property details
- ✅ Manage property images
- ❌ Cannot access properties not managed by them (admin bypass)

#### Inquiry Management
- ✅ View inquiries for managed properties
- ✅ Update inquiry status
- ✅ Add notes to inquiries
- ✅ Delete inquiries
- ❌ Cannot access inquiries for unmanaged properties

#### Viewing Management
- ✅ View viewing requests for managed properties
- ✅ Create new viewing requests
- ✅ Update viewing status
- ✅ Delete viewing requests
- ✅ Schedule viewings on behalf of clients
- ❌ Cannot access viewings for unmanaged properties

#### Listing Request Management
- ✅ View listing requests for managed properties
- ✅ Update listing request details
- ✅ Approve listing requests
- ✅ Reject listing requests
- ❌ Cannot access requests for unmanaged properties

#### Analytics
- ✅ View analytics for managed properties only
- ✅ View property views for their properties
- ✅ View inquiries stats for their properties
- ✅ View viewing stats for their properties
- ❌ Cannot access full analytics dashboard
- ❌ Cannot view other PMs' data

### Frontend Pages

**Workspace:**
- `/portal/dashboard` - Property Manager workspace with role-specific UI

**Properties Section:**
- Properties list (filtered to managed)
- Property creation form
- Property detail view
- Property edit form
- Agent assignment
- Property media upload
- Property deletion

**Inquiries Section:**
- Inquiries list (filtered to managed properties)
- Inquiry detail view
- Status update
- Notes management
- Inquiry deletion

**Viewings Section:**
- Viewings list (filtered to managed properties)
- Viewing creation form
- Viewing detail view
- Status update
- Viewing deletion

**Listing Requests Section:**
- Listing requests list (filtered to managed properties)
- Request detail view
- Status update
- Approve/reject actions

### API Endpoints

Property Manager-specific endpoints:
- `/property-manager` - Get managed properties
- `/property-manager` - Create managed property (auto-assigned)
- `/property-manager/:id` - Update managed property
- `/property-manager/:id` - Delete managed property
- `/property-manager/media` - Upload managed property media
- `/property-manager/agents` - Get assignable agents
- `/property-manager/inquiries` - Get managed inquiries
- `/property-manager/inquiries/:id` - Update managed inquiry
- `/property-manager/inquiries/:id` - Delete managed inquiry
- `/property-manager/viewings` - Get managed viewings
- `/property-manager/viewings` - Create managed viewing
- `/property-manager/viewings/:id` - Update managed viewing
- `/property-manager/viewings/:id` - Delete managed viewing
- `/property-manager/requests` - Get listing requests
- `/property-manager/requests/:id` - Update listing request
- `/property-manager/requests/:id/approve` - Approve listing
- `/property-manager/requests/:id/reject` - Reject listing

### Property Assignment

Properties are assigned to property managers via the `property_manager_id` foreign key in the `properties` table.

**Query:**
```sql
SELECT * FROM properties WHERE property_manager_id = :userId
```

### Agent Assignment

Property managers can assign agents to properties via the `agent_id` foreign key.

**Ownership Enforcement:**
- Middleware ensures PMs can only access properties where `property_manager_id` matches their user ID
- Admin users bypass this check
- Implemented in `propertyManagerOwnership.ts` middleware

### Limitations

- Cannot manage properties not assigned to them (admin bypass)
- Cannot access other PMs' data
- Cannot view full analytics
- Cannot manage categories or system configuration
- Cannot manage users or roles

---

## Content Editor Role

### Access
- **Login:** `/portal/login`
- **Dashboard:** `/portal/dashboard` (Content Editor workspace)
- **Authentication:** JWT with content_editor role verification

### Capabilities

#### Article Management
- ✅ Create articles
- ✅ Update articles
- ✅ Delete articles
- ✅ Set publication status (DRAFT/PUBLISHED)
- ✅ Assign article categories
- ✅ Manage article content
- ✅ Upload article images
- ❌ Cannot manage article categories (admin only)

#### Page Management
- ✅ Create site pages
- ✅ Update site pages
- ✅ Delete site pages
- ✅ Set page publication status
- ✅ Manage page content
- ✅ Set SEO metadata
- ❌ Cannot manage page types (admin only)

#### FAQ Management
- ✅ Create FAQs
- ✅ Update FAQs
- ✅ Delete FAQs
- ✅ Set FAQ categories
- ✅ Set display order
- ✅ Toggle FAQ visibility
- ❌ Cannot manage FAQ categories (admin only)

### Frontend Pages

**Workspace:**
- `/portal/dashboard` - Content Editor workspace with role-specific UI

**Articles Section:**
- Articles list
- Article creation form
- Article detail view
- Article edit form
- Rich text editor for content
- Category selection
- Publication status toggle
- Image upload
- Article deletion

**Pages Section:**
- Pages list
- Page creation form
- Page detail view
- Page edit form
- Content editor
- SEO metadata fields
- Publication status toggle
- Page deletion

**FAQs Section:**
- FAQs list
- FAQ creation form
- FAQ detail view
- FAQ edit form
- Category field
- Display order
- Visibility toggle
- FAQ deletion

### API Endpoints

Content Editor-specific endpoints:
- `/content-editor/articles` - Get articles
- `/content-editor/articles` - Create article
- `/content-editor/articles/:id` - Update article
- `/content-editor/articles/:id` - Delete article
- `/content-editor/pages` - Get pages
- `/content-editor/pages` - Create page
- `/content-editor/pages/:id` - Update page
- `/content-editor/pages/:id` - Delete page
- `/content-editor/faqs` - Get FAQs
- `/content-editor/faqs` - Create FAQ
- `/content-editor/faqs/:id` - Update FAQ
- `/content-editor/faqs/:id` - Delete FAQ

### Limitations

- Cannot manage categories (article categories, property categories)
- Cannot manage system settings
- Cannot manage users or roles
- Cannot access property management features
- Cannot access analytics
- Cannot manage inquiries, viewings, etc.

---

## User Role (Public)

### Access
- **Login:** `/login` (optional)
- **Dashboard:** N/A (public site access)
- **Authentication:** JWT with user role verification (optional)

### Capabilities

#### Property Browsing
- ✅ Browse all published properties
- ✅ View property details
- ✅ Search properties with filters
- ✅ Filter by category, type, price, location
- ✅ View property images
- ✅ View property features
- ✅ View agent information

#### Agent Directory
- ✅ View all agents
- ✅ View agent profiles
- ✅ View agent's properties
- ✅ Contact agent

#### Content Viewing
- ✅ Read published articles
- ✅ Read FAQs
- ✅ View services
- ✅ View testimonials
- ✅ View site pages

#### Interactions (Without Login)
- ✅ Submit contact form
- ✅ Submit property inquiry
- ✅ Request property viewing
- ✅ Request property valuation
- ✅ Submit property listing request
- ✅ Request services

#### Interactions (With Login)
- ✅ All public features
- ✅ Save property searches
- ✅ Add properties to favorites
- ✅ Remove from favorites
- ✅ View favorite properties
- ✅ Update profile (name, phone)
- ✅ Reset password

### Frontend Pages

**Public Pages:**
- `/` - Homepage
- `/properties` - Property listings
- `/properties/:slug` - Property details
- `/property-search` - Advanced search
- `/agents` - Agent directory
- `/agents/:slug` - Agent profile
- `/services` - Services
- `/articles` - Articles/insights
- `/about` - About section
- `/contact` - Contact form
- `/faqs` - FAQ page

**Interaction Pages:**
- `/list-your-property` - Listing request form
- `/request-viewing` - Viewing request form
- `/property-valuation` - Valuation request form

**Account Pages:**
- `/login` - Login
- `/register` - Registration
- `/portal/forgot-password` - Password reset request
- `/portal/reset-password` - Password reset form

**User Dashboard:**
- `/portal/dashboard` - User workspace (if implemented)
- Favorites management
- Saved searches
- Profile management

### API Endpoints

**Public Endpoints (No Auth):**
- `/properties` - List properties
- `/properties/:slug` - Get property
- `/agents` - List agents
- `/agents/:slug` - Get agent
- `/categories` - List categories
- `/article-categories` - List article categories
- `/articles` - List articles
- `/articles/:slug` - Get article
- `/faqs` - List FAQs
- `/services` - List services
- `/pages` - List pages
- `/settings` - Get site settings
- `/contact` - Submit contact form
- `/inquiries` - Submit inquiry
- `/viewings` - Submit viewing request
- `/valuations` - Submit valuation request
- `/listings` - Submit listing request
- `/property-searches` - Save search
- `/property-media` - Upload media (public)
- `/auth/login` - Login
- `/auth/register` - Register
- `/auth/forgot-password` - Request password reset
- `/auth/reset-password` - Reset password

**Authenticated Endpoints (Require User Role):**
- `/auth/me` - Get current user
- `/auth/profile` - Update profile
- `/favorites` - Get favorites
- `/favorites` - Add to favorites
- `/favorites/:id` - Remove from favorites

### Limitations

- Cannot access admin dashboard
- Cannot access staff portal
- Cannot manage any content
- Cannot view analytics
- Cannot manage other users
- Cannot access property management features

---

## Role Matrix

### Feature Access Comparison

| Feature | Admin | Agent | Property Manager | Content Editor | User |
|---------|-------|-------|-----------------|----------------|------|
| **User Management** |
| Create users | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update users | ✅ | ❌ | ❌ | ❌ | ❌ |
| Delete users | ✅ | ❌ | ❌ | ❌ | ❌ |
| View all users | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Property Management** |
| Create properties | ✅ | ❌ | ✅ (self) | ❌ | ❌ |
| Update all properties | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update assigned properties | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete properties | ✅ | ✅ (assigned) | ✅ (managed) | ❌ | ❌ |
| Upload media | ✅ | ✅ | ✅ | ❌ | ❌ |
| Assign agents | ✅ | ❌ | ✅ | ❌ | ❌ |
| Assign PMs | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Content Management** |
| Create articles | ✅ | ❌ | ❌ | ✅ | ❌ |
| Update articles | ✅ | ❌ | ❌ | ✅ | ❌ |
| Delete articles | ✅ | ❌ | ❌ | ✅ | ❌ |
| Create pages | ✅ | ❌ | ❌ | ✅ | ❌ |
| Update pages | ✅ | ❌ | ❌ | ✅ | ❌ |
| Delete pages | ✅ | ❌ | ❌ | ✅ | ❌ |
| Create FAQs | ✅ | ❌ | ❌ | ✅ | ❌ |
| Update FAQs | ✅ | ❌ | ❌ | ✅ | ❌ |
| Delete FAQs | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Categories** |
| Manage property categories | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage article categories | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Inquiries** |
| View all inquiries | ✅ | ❌ | ❌ | ❌ | ❌ |
| View assigned inquiries | ✅ | ✅ | ✅ | ❌ | ❌ |
| Update inquiry status | ✅ | ✅ | ✅ | ❌ | ❌ |
| Add follow-up notes | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete inquiries | ✅ | ❌ | ✅ | ❌ | ❌ |
| Submit inquiries | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Viewings** |
| View all viewings | ✅ | ❌ | ❌ | ❌ | ❌ |
| View assigned viewings | ✅ | ✅ | ✅ | ❌ | ❌ |
| Update viewing status | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create viewings | ✅ | ❌ | ✅ | ❌ | ❌ |
| Delete viewings | ✅ | ❌ | ✅ | ❌ | ❌ |
| Submit viewings | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Analytics** |
| Full analytics dashboard | ✅ | ❌ | ❌ | ❌ | ❌ |
| Property analytics (assigned) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Track page views | ✅ | ❌ | ❌ | ❌ | ✅ |
| Track property views | ✅ | ❌ | ❌ | ❌ | ✅ |
| Track click events | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Site Configuration** |
| Update site settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage homepage content | ✅ | ❌ | ❌ | ❌ | ❌ |
| **User Profile** |
| Update own profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reset password | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Favorites** |
| Add to favorites | ❌ | ❌ | ❌ | ❌ | ✅ |
| View favorites | ❌ | ❌ | ❌ | ❌ | ✅ |
| Remove from favorites | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Permission Comparison

### Admin vs Property Manager

| Aspect | Admin | Property Manager |
|--------|-------|-----------------|
| Property Access | All properties | Managed properties only |
| Property Creation | Anywhere | Auto-assigned to self |
| Agent Assignment | Full control | Can assign to managed properties |
| PM Assignment | Full control | Cannot assign other PMs |
| Bypass Ownership | Yes | No |
| Analytics Access | Full data | Managed properties only |
| User Management | Full control | None |
| System Settings | Full control | None |

### Agent vs Property Manager

| Aspect | Agent | Property Manager |
|--------|-------|-----------------|
| Property Access | Assigned properties | Managed properties |
| Property Creation | Cannot create | Can create (self-assigned) |
| Agent Assignment | Cannot assign | Can assign to managed properties |
| PM Assignment | Cannot assign | Cannot assign |
| Ownership Check | Via agent_id | Via property_manager_id |
| Inquiry Management | Assigned properties | Managed properties |
| Viewing Management | Assigned properties | Managed properties |
| Listing Requests | Cannot manage | Can approve/reject |
| Follow-up Notes | Can add | Cannot add |

### Content Editor vs Admin

| Aspect | Content Editor | Admin |
|--------|----------------|-------|
| Article Management | Full CRUD | Full CRUD |
| Page Management | Full CRUD | Full CRUD |
| FAQ Management | Full CRUD | Full CRUD |
| Category Management | None | Full CRUD |
| System Settings | None | Full control |
| User Management | None | Full control |
| Property Management | None | Full control |

---

## Role Implementation Details

### Database Schema

**roles table:**
```sql
CREATE TABLE "roles" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL UNIQUE,
  "description" text
);
```

**users table (role reference):**
```sql
CREATE TABLE "users" (
  "id" text PRIMARY KEY,
  "email" text NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "role_id" integer NOT NULL,
  CONSTRAINT "fk_users_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id")
);
```

### Middleware Implementation

**Role check:**
```typescript
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { role?: string };
    if (!allowedRoles.map(r => r.toLowerCase()).includes(user.role?.toLowerCase())) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
  };
};
```

### Frontend Role Detection

**AuthContext:**
```typescript
const authenticatedUser: AdminUser = {
  ...userData,
  role: userData.role?.name ?? userData.role,
};
```

**Role-based routing:**
```typescript
// In PortalWorkspace component
if (user.role === 'agent') {
  return <AgentWorkspace />;
}
if (user.role === 'property_manager') {
  return <PropertyManagerWorkspace />;
}
if (user.role === 'content_editor') {
  return <ContentEditorWorkspace />;
}
```

---

## Testing Role Permissions

### Manual Testing Checklist

**Admin Role:**
- [ ] Can create user with agent role
- [ ] Can create user with property_manager role
- [ ] Can access all properties
- [ ] Can update any property
- [ ] Can delete any property
- [ ] Can view full analytics
- [ ] Can update site settings

**Agent Role:**
- [ ] Can only see assigned properties
- [ ] Can update assigned properties
- [ ] Cannot access unassigned properties
- [ ] Can add follow-up notes to inquiries
- [ ] Can view analytics for assigned properties only

**Property Manager Role:**
- [ ] Can only see managed properties
- [ ] Can create properties (auto-assigned)
- [ ] Can assign agents to managed properties
- [ ] Cannot access unmanaged properties
- [ ] Can approve/reject listing requests
- [ ] Can view analytics for managed properties only

**Content Editor Role:**
- [ ] Can create articles
- [ ] Can create pages
- [ ] Can create FAQs
- [ ] Cannot manage categories
- [ ] Cannot access property management
- [ ] Cannot access analytics

**User Role:**
- [ ] Can browse public properties
- [ ] Can submit inquiries
- [ ] Can add to favorites (when logged in)
- [ ] Cannot access admin dashboard
- [ ] Cannot access staff portal
- [ ] Cannot manage any content

---

## Role Assignment Best Practices

### Creating Users

**Admin User:**
```typescript
{
  email: "admin@realestate.com",
  roleId: 1,  // admin role ID
  canUploadPropertyMedia: true
}
```

**Agent User:**
```typescript
{
  email: "agent@realestate.com",
  roleId: 2,  // agent role ID
  agentProfile: {
    name: "Agent Name",
    slug: "agent-name",
    specialization: "Residential"
  }
}
```

**Property Manager User:**
```typescript
{
  email: "pm@realestate.com",
  roleId: 4,  // property_manager role ID
  canUploadPropertyMedia: true
}
```

**Content Editor User:**
```typescript
{
  email: "editor@realestate.com",
  roleId: 5,  // content_editor role ID
}
```

### Role Changes

**Promoting User to Agent:**
1. Update user's `roleId` to agent role ID
2. Create agent profile
3. Assign properties to agent

**Demoting Agent to User:**
1. Reassign agent's properties to another agent
2. Delete agent profile
3. Update user's `roleId` to user role ID

**Adding Property Manager:**
1. Create user with property_manager role
2. Grant `canUploadPropertyMedia` permission
3. Assign properties via `property_manager_id`

---

## Common Issues

### Role Not Recognized

**Symptom:** 403 Forbidden despite correct role

**Causes:**
1. Role name case mismatch (normalized to lowercase)
2. Role not seeded in database
3. Middleware not applied correctly
4. Token not refreshed after role change

**Solutions:**
1. Verify role in database
2. Check role name is lowercase
3. Run seed script to ensure roles exist
4. Re-login after role change

### Property Assignment Not Working

**Symptom:** Agent/PM cannot see properties

**Causes:**
1. `agent_id` or `property_manager_id` not set
2. Wrong user ID assigned
3. Ownership middleware blocking access

**Solutions:**
1. Verify foreign key is set correctly
2. Check user ID matches
3. Verify middleware implementation
4. Admin bypass should work

### Analytics Access Denied

**Symptom:** Cannot view analytics

**Causes:**
1. Role not authorized for analytics endpoints
2. Analytics endpoint requires specific role
3. Data ownership filters blocking access

**Solutions:**
1. Verify role has analytics access
2. Check endpoint authorization
3. Verify data ownership logic
