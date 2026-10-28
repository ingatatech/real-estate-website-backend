# User Roles and Features

**Last Updated:** October 27, 2026

---

## Overview

The Ingata Real Estate platform uses a role-based access control (RBAC) system with 5 distinct user roles. Each role has specific permissions and access to different features within the application.

---

## Role Hierarchy

```
Admin (Full Access)
├── Property Manager
│   └── Agent
├── Content Editor
└── User (Public)
```

**Access Levels:**
- **Admin:** Highest level, full system access
- **Property Manager:** Property and agent management
- **Agent:** Assigned properties and inquiries
- **Content Editor:** Content management
- **User:** Public features, profile management

---

## Role Details

### 1. Admin

**Purpose:** Full system administrator with complete control over all aspects of the platform.

**Access URL:** `/admin/login` → `/admin/dashboard`

**Capabilities:**

#### User Management
- ✅ Create, read, update, delete users
- ✅ Assign and change user roles
- ✅ Manage user permissions
- ✅ Activate/deactivate user accounts
- ✅ Grant media upload permissions
- ✅ View all user activity

#### Property Management
- ✅ Full CRUD on all properties (regardless of ownership)
- ✅ Upload property media
- ✅ Manage property categories
- ✅ Manage property features
- ✅ Manage developments
- ✅ Set featured properties
- ✅ Approve/reject listing requests
- ✅ Assign agents to properties
- ✅ Assign property managers

#### Content Management
- ✅ Full CRUD on articles
- ✅ Full CRUD on article categories
- ✅ Full CRUD on FAQs
- ✅ Full CRUD on testimonials
- ✅ Full CRUD on site pages
- ✅ Full CRUD on services
- ✅ Publish/unpublish content

#### Analytics
- ✅ Access all analytics data
- ✅ View page views, property views, click events
- ✅ View device breakdown
- ✅ View traffic sources
- ✅ View conversion funnel
- ✅ Export analytics data
- ✅ Trigger data cleanup
- ✅ Configure data retention

#### Inquiries & Viewings
- ✅ Full CRUD on all inquiries
- ✅ Full CRUD on all viewing requests
- ✅ Full CRUD on valuation requests
- ✅ Reply to contact messages
- ✅ Manage inquiry status

#### System Configuration
- ✅ Update site settings
- ✅ Configure homepage content
- ✅ Manage contact information
- ✅ Configure social media links
- ✅ Set analytics retention period

#### Special Permissions
- ✅ Bypasses all ownership checks
- ✅ Bypasses property manager restrictions
- ✅ Always has media upload permission
- ✅ Can view all analytics (not just own data)

**Dashboard Features:**
- Total properties count
- Total inquiries count
- Total viewings count
- Total users count
- Recent activity feed
- Quick action buttons

---

### 2. Property Manager

**Purpose:** Manages a portfolio of properties, assigns agents, and oversees property operations.

**Access URL:** `/portal/login` → `/portal/dashboard`

**Capabilities:**

#### Property Management
- ✅ Create properties (auto-assigned as owner)
- ✅ Update own properties
- ✅ Delete own properties
- ✅ Upload property media
- ✅ Manage property categories
- ✅ Manage property features
- ✅ Create developments
- ✅ Update developments
- ✅ Delete developments
- ✅ Upload development media
- ❌ Cannot access properties owned by other property managers
- ❌ Cannot delete properties assigned to other managers

#### Agent Management
- ✅ View assignable agents
- ✅ Assign agents to own properties
- ✅ Reassign agents from own properties
- ❌ Cannot manage agents themselves

#### Listing Requests
- ✅ View all listing requests
- ✅ Approve listing requests
- ✅ Reject listing requests
- ✅ View submitted property details

#### Inquiries
- ✅ View inquiries for own properties
- ✅ Update inquiry status
- ✅ Delete inquiries for own properties
- ❌ Cannot access inquiries for other properties

#### Viewings
- ✅ Create viewing requests for own properties
- ✅ View viewings for own properties
- ✅ Update viewing status
- ✅ Delete viewings for own properties
- ❌ Cannot access viewings for other properties

#### Analytics
- ✅ View analytics for own properties
- ✅ View property views for own properties
- ❌ Cannot access global analytics

#### Profile
- ✅ Update own profile
- ✅ Change own password

**Dashboard Features:**
- Managed properties count
- Managed inquiries count
- Managed viewings count
- Pending listing requests
- Recent activity for managed properties

---

### 3. Agent

**Purpose:** Handles property inquiries, schedules viewings, and manages assigned properties.

**Access URL:** `/portal/login` → `/portal/dashboard`

**Capabilities:**

#### Property Management
- ✅ View assigned properties
- ✅ Update assigned properties
- ✅ Archive assigned properties
- ✅ Upload property media (if `can_upload_property_media = true`)
- ❌ Cannot create properties
- ❌ Cannot delete properties
- ❌ Cannot access unassigned properties

#### Inquiries
- ✅ View assigned inquiries
- ✅ Update inquiry status
- ✅ Add notes to inquiries
- ✅ Set follow-up dates
- ✅ View inquiry history
- ❌ Cannot access inquiries for other agents
- ❌ Cannot delete inquiries

#### Viewings
- ✅ View assigned viewings
- ✅ Schedule new viewings
- ✅ Update viewing status
- ✅ Cancel viewings
- ❌ Cannot access viewings for other agents

#### Analytics
- ✅ View analytics for assigned properties
- ✅ View property views for assigned properties
- ❌ Cannot access global analytics

#### Profile
- ✅ Update own profile
- ✅ Change own password
- ✅ Update agent profile (bio, specialization, etc.)

**Dashboard Features:**
- Assigned properties count
- Assigned inquiries count
- Assigned viewings count
- Pending follow-ups
- Recent inquiries

**Special Permission:**
- Media upload requires `can_upload_property_media = true` flag
- Assigned by admin via user management

---

### 4. Content Editor

**Purpose:** Manages website content including articles, FAQs, pages, and testimonials.

**Access URL:** `/portal/login` → `/portal/dashboard`

**Capabilities:**

#### Article Management
- ✅ Create articles
- ✅ Update articles
- ✅ Delete articles
- ✅ Publish/unpublish articles
- ✅ Set article categories
- ✅ Upload article images (via media upload)
- ❌ Cannot delete article categories

#### FAQ Management
- ✅ Create FAQs
- ✅ Update FAQs
- ✅ Delete FAQs
- ✅ Set FAQ categories
- ✅ Reorder FAQs (display order)
- ✅ Activate/deactivate FAQs

#### Page Management
- ✅ Create site pages
- ✅ Update site pages
- ✅ Delete site pages
- ✅ Publish/unpublish pages
- ✅ Set SEO metadata
- ❌ Cannot delete system pages

#### Testimonial Management
- ✅ Create testimonials
- ✅ Update testimonials
- ✅ Delete testimonials
- ✅ Set featured testimonials
- ✅ Activate/deactivate testimonials

#### Media
- ✅ Upload media for content
- ✅ Use media in articles and pages

#### Profile
- ✅ Update own profile
- ✅ Change own password

**Dashboard Features:**
- Published articles count
- Draft articles count
- Published FAQs count
- Published testimonials count
- Recent content activity

**Restrictions:**
- ❌ Cannot access property management
- ❌ Cannot access user management
- ❌ Cannot access analytics
- ❌ Cannot access system settings

---

### 5. User (Public)

**Purpose:** Regular users who browse properties, submit inquiries, and manage their profiles.

**Access URL:** No login required for most features

**Capabilities:**

#### Property Browsing
- ✅ View all properties
- ✅ Search and filter properties
- ✅ View property details
- ✅ View property images
- ✅ View property location on map
- ✅ View related properties

#### Property Interactions
- ✅ Submit property inquiries
- ✅ Request property viewings
- ✅ Request property valuations
- ✅ Submit property listing requests
- ✅ Save properties to favorites
- ✅ Remove from favorites
- ✅ Compare properties (up to 5)

#### Content Access
- ✅ Read published articles
- ✅ View FAQs
- ✅ View testimonials
- ✅ View services
- ✅ View agent profiles
- ✅ View site pages

#### Calculators
- ✅ Use mortgage calculator
- ✅ Use rental yield calculator

#### Contact
- ✅ Submit contact form
- ✅ View contact information
- ✅ Call/WhatsApp agents

#### Account (if registered)
- ✅ Register account
- ✅ Login to account
- ✅ Update profile
- ✅ Change password
- ✅ Request password reset
- ✅ View favorite properties
- ✅ View saved property searches
- ✅ Create saved property searches

**Restrictions:**
- ❌ Cannot access admin dashboard
- ❌ Cannot access staff portal
- ❌ Cannot manage properties
- ❌ Cannot manage content
- ❌ Cannot access analytics
- ❌ Cannot manage users

---

## Permission Matrix

### By Feature Category

| Feature | Admin | Property Manager | Agent | Content Editor | User |
|---------|-------|-----------------|-------|----------------|------|
| **User Management** |
| View all users | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create users | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update users | ✅ | ❌ | ❌ | ❌ | Own only |
| Delete users | ✅ | ❌ | ❌ | ❌ | ❌ |
| Change roles | ✅ | ❌ | ❌ | ❌ | ❌ |
| Media permission | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Property Management** |
| View all properties | ✅ | ❌ | ❌ | ❌ | ✅ (public) |
| Create properties | ✅ | ✅ (own) | ❌ | ❌ | ❌ |
| Update properties | ✅ | ✅ (own) | ✅ (assigned) | ❌ | ❌ |
| Delete properties | ✅ | ✅ (own) | ❌ | ❌ | ❌ |
| Upload media | ✅ | ✅ | ✅* | ✅ | ❌ |
| **Category Management** |
| View categories | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create categories | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update categories | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete categories | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Inquiry Management** |
| View all inquiries | ✅ | ❌ | ❌ | ❌ | ❌ |
| View own inquiries | ✅ | ✅ (own props) | ✅ (assigned) | ❌ | ❌ |
| Create inquiries | ✅ | ❌ | ❌ | ❌ | ✅ |
| Update inquiries | ✅ | ✅ (own props) | ✅ (assigned) | ❌ | ❌ |
| Delete inquiries | ✅ | ✅ (own props) | ❌ | ❌ | ❌ |
| Add inquiry notes | ✅ | ❌ | ✅ (assigned) | ❌ | ❌ |
| **Viewing Management** |
| View all viewings | ✅ | ❌ | ❌ | ❌ | ❌ |
| View own viewings | ✅ | ✅ (own props) | ✅ (assigned) | ❌ | ❌ |
| Create viewings | ✅ | ✅ (own props) | ✅ (assigned) | ❌ | ✅ |
| Update viewings | ✅ | ✅ (own props) | ✅ (assigned) | ❌ | ❌ |
| Delete viewings | ✅ | ✅ (own props) | ❌ | ❌ | ❌ |
| **Content Management** |
| View articles | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create articles | ✅ | ❌ | ❌ | ✅ | ❌ |
| Update articles | ✅ | ❌ | ❌ | ✅ | ❌ |
| Delete articles | ✅ | ❌ | ❌ | ✅ | ❌ |
| Publish articles | ✅ | ❌ | ❌ | ✅ | ❌ |
| Manage FAQs | ✅ | ❌ | ❌ | ✅ | ❌ |
| Manage pages | ✅ | ❌ | ❌ | ✅ | ❌ |
| Manage testimonials | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Analytics** |
| View global analytics | ✅ | ❌ | ❌ | ❌ | ❌ |
| View own analytics | ✅ | ✅ (own props) | ✅ (assigned) | ❌ | ❌ |
| Export analytics | ✅ | ❌ | ❌ | ❌ | ❌ |
| Configure retention | ✅ | ❌ | ❌ | ❌ | ❌ |
| **System Settings** |
| View settings | ✅ | ❌ | ❌ | ❌ | ✅ (public) |
| Update settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage homepage | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Public Features** |
| Browse properties | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit inquiries | ✅ | ✅ | ✅ | ✅ | ✅ |
| Save favorites | ✅ | ✅ | ✅ | ✅ | ✅ |
| Use calculators | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update profile | ✅ | ✅ | ✅ | ✅ | ✅ |

*Requires `can_upload_property_media = true`

---

## Role Assignment

### Creating Users with Roles

**Admin assigns roles via:**
1. Admin Dashboard → Users
2. Click "Create User"
3. Select role from dropdown
4. Set permissions as needed

**API Example:**
```bash
POST /api/v1/admin/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "agent",
  "can_upload_property_media": true
}
```

### Changing User Roles

**Admin can change roles:**
1. Admin Dashboard → Users
2. Edit user
3. Change role
4. Save changes

**Impact:**
- User gains new role permissions immediately
- Previous role permissions revoked
- User may need to re-login for changes to take effect

### Media Upload Permission

**Admin grants permission:**
1. Admin Dashboard → Users
2. Edit user
3. Toggle "Can Upload Property Media"
4. Save changes

**Applies to:**
- Agents
- Property Owners
- Property Managers (always have permission)
- Admins (always have permission)

---

## Role-Specific Workflows

### Admin Workflow

1. **Property Manager Setup**
   - Create property manager account
   - Assign property_manager role
   - Property manager can now manage properties

2. **Agent Assignment**
   - Create agent account
   - Assign agent role
   - Grant media upload permission if needed
   - Property manager assigns agent to properties

3. **Content Editor Setup**
   - Create content editor account
   - Assign content_editor role
   - Content editor can now manage content

4. **Property Approval**
   - User submits listing request
   - Admin reviews request
   - Admin approves/reject
   - If approved, property created automatically

### Property Manager Workflow

1. **Property Creation**
   - Login to portal
   - Navigate to Properties
   - Create new property
   - Property auto-assigned to manager
   - Upload media
   - Assign agent to property

2. **Agent Management**
   - View assignable agents
   - Assign agent to property
   - Reassign if needed
   - Monitor agent performance

3. **Listing Review**
   - View pending listing requests
   - Review property details
   - Approve or reject
   - Track approval status

### Agent Workflow

1. **Property Management**
   - View assigned properties
   - Update property details
   - Upload media (if permitted)
   - Archive when sold/rented

2. **Inquiry Handling**
   - View assigned inquiries
   - Add notes to inquiries
   - Set follow-up dates
   - Update inquiry status
   - Contact prospects

3. **Viewing Scheduling**
   - View assigned viewings
   - Schedule new viewings
   - Update viewing status
   - Cancel if needed

### Content Editor Workflow

1. **Article Creation**
   - Login to portal
   - Navigate to Articles
   - Create new article
   - Write content
   - Set category
   - Upload featured image
   - Save as draft or publish

2. **FAQ Management**
   - Navigate to FAQs
   - Create new FAQ
   - Set category
   - Set display order
   - Publish

3. **Page Updates**
   - Navigate to Pages
   - Edit existing page
   - Update content
   - Set SEO metadata
   - Publish

### User Workflow

1. **Property Search**
   - Browse properties
   - Use filters
   - View details
   - Save favorites

2. **Inquiry Submission**
   - Find property of interest
   - Submit inquiry form
   - Wait for agent contact
   - Schedule viewing

3. **Account Management**
   - Register account
   - Update profile
   - View favorites
   - Save searches

---

## Security Considerations

### Role Elevation Prevention

- Admins cannot elevate own permissions beyond admin
- Property managers cannot assign admin role
- Role changes logged (audit trail recommended)

### Data Isolation

- Property managers only see own properties
- Agents only see assigned properties
- Content editors only see content
- Users only see own data (favorites, profile)

### Ownership Validation

- Backend enforces ownership checks
- Property manager ownership middleware
- Agent assignment checks
- Admins bypass ownership checks

---

## Future Role Enhancements

### Potential New Roles

1. **Property Owner**
   - Similar to agent but owns properties
   - Can view own property analytics
   - Limited agent features

2. **Viewer**
   - Read-only access to specific features
   - For external auditors or stakeholders

3. **Super Admin**
   - Above admin role
   - Can manage admins
   - System-level configuration

### Potential Role Enhancements

1. **Granular Permissions**
   - Break down broad roles into specific permissions
   - Permission-based rather than role-based
   - More flexible access control

2. **Role Groups**
   - Group related permissions
   - Assign multiple groups to users
   - More complex access patterns

3. **Temporary Roles**
   - Temporary elevation for specific tasks
   - Time-limited permissions
   - Auto-revocation after expiration

---

## Troubleshooting

### User Cannot Access Feature

**Possible Causes:**
1. Incorrect role assigned
2. Ownership check failing
3. Special permission not granted
4. Token expired
5. Role not normalized (case sensitivity)

**Solutions:**
1. Verify user role in database
2. Check resource ownership
3. Grant required permissions
4. User must re-login
5. Ensure role name is lowercase

### Property Manager Cannot Access Property

**Possible Causes:**
1. Property not assigned to manager
2. property_manager_id field incorrect
3. Middleware not applied to route
4. Admin bypass not working

**Solutions:**
1. Check property_manager_id in properties table
2. Update property ownership
3. Verify middleware applied
4. Check admin role in database

### Agent Cannot Upload Media

**Possible Causes:**
1. can_upload_property_media flag not set
2. Media upload middleware rejecting
3. Supabase not configured
4. File size exceeds limit

**Solutions:**
1. Set can_upload_property_media = true
2. Check middleware implementation
3. Configure Supabase environment variables
4. Ensure file < 100MB

---

## API Endpoints by Role

### Admin Only
- `GET /admin/dashboard`
- `GET /admin/users`
- `POST /admin/users`
- `PATCH /admin/users/:id`
- `DELETE /admin/users/:id`
- `GET /admin/roles`
- `PATCH /admin/users/:id/media-permission`
- `POST /admin/analytics/cleanup`
- `GET /admin/analytics/retention-status`

### Property Manager
- `GET /property-manager`
- `POST /property-manager`
- `PATCH /property-manager/:id`
- `DELETE /property-manager/:id`
- `GET /property-manager/agents`
- `GET /property-manager/developments`
- `POST /property-manager/developments`
- `GET /property-manager/property-features`
- `POST /property-manager/property-features`
- `GET /property-manager/inquiries`
- `GET /property-manager/viewings`
- `GET /property-manager/listings`

### Agent
- `GET /agent-dashboard/my-properties`
- `PATCH /agent-dashboard/my-properties/:id`
- `DELETE /agent-dashboard/my-properties/:id`
- `POST /agent-dashboard/property-media`
- `GET /agent-dashboard/my-inquiries`
- `PATCH /agent-dashboard/my-inquiries/:id/status`
- `PATCH /agent-dashboard/my-inquiries/:id/follow-up`
- `GET /agent-dashboard/my-viewings`
- `POST /agent-dashboard/my-viewings`
- `PATCH /agent-dashboard/my-viewings/:id`

### Content Editor
- `GET /content-editor/articles`
- `POST /content-editor/articles`
- `PATCH /content-editor/articles/:id`
- `DELETE /content-editor/articles/:id`
- `GET /content-editor/faqs`
- `POST /content-editor/faqs`
- `PATCH /content-editor/faqs/:id`
- `DELETE /content-editor/faqs/:id`
- `GET /content-editor/pages`
- `POST /content-editor/pages`
- `PATCH /content-editor/pages/:id`
- `DELETE /content-editor/pages/:id`
- `GET /content-editor/testimonials`
- `POST /content-editor/testimonials`
- `PATCH /content-editor/testimonials/:id`
- `DELETE /content-editor/testimonials/:id`
- `POST /content-editor/media`

### User (Public)
- `GET /properties`
- `GET /properties/:slug`
- `POST /inquiries`
- `POST /viewings`
- `POST /valuations`
- `POST /listings`
- `GET /favorites`
- `POST /favorites`
- `DELETE /favorites/:id`
- `GET /articles`
- `GET /faqs`
- `GET /services`
- `POST /contact`
- `POST /auth/register`
- `POST /auth/login`
- `PATCH /auth/profile`
