# Authentication and Permissions

**Last Updated:** October 27, 2026

---

## Overview

The Ingata Real Estate platform uses JWT (JSON Web Token) based authentication with role-based access control (RBAC). This document explains the authentication flow, authorization mechanisms, and permission system.

---

## Authentication

### JWT Token Structure

The platform uses stateless JWT tokens for authentication. Tokens contain the following payload:

```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1698765432,
  "exp": 1698765732
}
```

- `id`: User UUID
- `email`: User email
- `role`: User role (admin, agent, property_manager, content_editor, user)
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp

### Token Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| Algorithm | HS256 | HMAC SHA-256 |
| Secret | JWT_SECRET env var | Minimum 32 characters recommended |
| Expiration | 5 minutes (default) | Configurable via JWT_EXPIRES_IN |
| Storage | Client-side localStorage | Token stored in `admin_token` key |

### Login Flow

#### 1. User Login Request

**Endpoint:** `POST /api/v1/auth/login`  
**Rate Limit:** 5 req/15min

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

#### 2. Server Validation

1. Retrieve user by email from database
2. Check if user exists
3. Check if user is active (`is_active = true`)
4. Verify password using bcrypt (12 rounds)
5. Generate JWT token with user payload
6. Return token and user data

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "admin",
    "name": "John Doe"
  }
}
```

#### 3. Client Token Storage

Frontend stores token in localStorage:
```javascript
localStorage.setItem('admin_token', token);
localStorage.setItem('user_role', user.role);
```

### Admin Login

**Endpoint:** `POST /api/v1/auth/admin/login`

Same flow as regular login but:
- Requires admin role
- Redirects to `/admin/dashboard` on success
- Used for admin-specific authentication

### Token Verification

#### Middleware: `requireAuth`

Location: `backend/src/middleware/auth.ts`

```typescript
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
```

### Token Expiration

- **Default:** 5 minutes
- **Configurable:** Via `JWT_EXPIRES_IN` environment variable
- **Format:** Time duration string (e.g., '5m', '1h', '2d')

**Client-Side Handling:**
- Auto-logout after 5 minutes of inactivity
- 3-minute warning modal before logout
- Cross-tab synchronization via localStorage events

### Password Reset Flow

#### 1. Request Password Reset

**Endpoint:** `POST /api/v1/auth/forgot-password`  
**Rate Limit:** 5 req/15min

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Server Process:**
1. Check if user exists by email
2. Generate 32-byte random token
3. Hash token with SHA-256
4. Store hash and expiration (30 minutes) in database
5. Send email with reset link (via Brevo SMTP)
6. Return generic success message (to prevent email enumeration)

**Response:**
```json
{
  "success": true,
  "message": "If an account exists for that email, password reset instructions will be sent."
}
```

#### 2. Reset Password

**Endpoint:** `POST /api/v1/auth/reset-password`  
**Rate Limit:** 5 req/15min

**Request:**
```json
{
  "token": "64-character-hex-token",
  "newPassword": "NewPassword123!"
}
```

**Server Process:**
1. Hash provided token with SHA-256
2. Find user with matching token hash
3. Check if token is not expired (30 minutes)
4. Hash new password with bcrypt
5. Update user password
6. Clear reset token from database
7. Token is single-use (cleared after use)

**Validation:**
- Token must be 64 hex characters
- Password must be 8-128 characters
- Token must not be expired

### Password Hashing

**Algorithm:** bcrypt  
**Cost Factor:** 12 rounds  
**Implementation:**

```typescript
import bcrypt from 'bcryptjs';

// Hash password
const passwordHash = await bcrypt.hash(password, 12);

// Verify password
const isValid = await bcrypt.compare(password, user.passwordHash);
```

---

## Authorization

### Role-Based Access Control (RBAC)

The platform uses role-based authorization with 5 distinct roles:

| Role | Description | Access Level |
|------|-------------|--------------|
| admin | Full system administrator | Full access to all features |
| property_manager | Manages properties and agents | Property management, agent assignment |
| agent | Real estate agent | Assigned properties and inquiries |
| content_editor | Content management | Articles, pages, FAQs, testimonials |
| user | Regular user | Public features, profile management |

### Authorization Middleware

#### Middleware: `authorize`

Location: `backend/src/middleware/authorize.ts`

```typescript
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    const userRole = req.user.role.toLowerCase();
    const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);
    
    if (!isAllowed) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    
    next();
  };
};
```

**Usage:**
```typescript
router.get('/admin/dashboard', requireAuth, authorize('admin'), getDashboard);
router.get('/agent-dashboard', requireAuth, authorize('agent', 'admin'), getAgentDashboard);
```

### Role Normalization

Role names are normalized to lowercase for case-insensitive comparison:

```typescript
const normalizedRole = role.toLowerCase().trim();
```

This prevents issues with role names like "Admin", "ADMIN", "admin" being treated differently.

### Role Permissions Matrix

| Feature | Admin | Property Manager | Agent | Content Editor | User |
|---------|-------|-----------------|-------|----------------|------|
| User Management | ✅ | ❌ | ❌ | ❌ | ❌ |
| Role Management | ✅ | ❌ | ❌ | ❌ | ❌ |
| Property CRUD (All) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Property CRUD (Own) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Inquiry Management (All) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Inquiry Management (Own) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Viewing Management (All) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Viewing Management (Own) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Article Management | ✅ | ❌ | ❌ | ✅ | ❌ |
| Page Management | ✅ | ❌ | ❌ | ✅ | ❌ |
| FAQ Management | ✅ | ❌ | ❌ | ✅ | ❌ |
| Testimonial Management | ✅ | ❌ | ❌ | ✅ | ❌ |
| Category Management | ✅ | ✅ | ❌ | ❌ | ❌ |
| Development Management | ✅ | ✅ | ❌ | ❌ | ❌ |
| Property Feature Management | ✅ | ✅ | ❌ | ❌ | ❌ |
| Analytics Access | ✅ | ✅ (own properties) | ✅ (own properties) | ❌ | ❌ |
| Site Settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Media Upload | ✅ | ✅ | ✅* | ✅ | ❌ |
| Favorites | ✅ | ✅ | ✅ | ✅ | ✅ |
| Profile Update | ✅ | ✅ | ✅ | ✅ | ✅ |

*Requires `can_upload_property_media` permission flag

---

## Special Permissions

### Media Upload Permission

Users can have individual media upload permission via the `can_upload_property_media` flag in the users table.

**Who Has Media Upload Permission by Default:**
- Admin (always)
- Property Manager (always)
- Agent (requires `can_upload_property_media = true`)
- Property Owner (requires `can_upload_property_media = true`)

**Check Implementation:**
```typescript
const canUploadAsAgentOrOwner = Boolean(
  user?.canUpload_property_media && 
  user.role && 
  ['agent', 'property_owner'].includes(user.role.name)
);
```

### Property Manager Ownership

Property managers can only access properties they own (assigned to them).

**Middleware:** `requireOwnedManagerProperty`

Location: `backend/src/middleware/propertyManagerOwnership.ts`

```typescript
export const requireOwnedManagerProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === 'admin') {
    return next(); // Admins bypass ownership check
  }
  
  const property = await propertyRepo.findOne({
    where: { id: req.params.id }
  });
  
  if (!property || property.property_manager_id !== req.user.id) {
    return res.status(403).json({ 
      success: false, 
      message: 'You do not have permission to access this property' 
    });
  }
  
  next();
};
```

**Auto-Assignment:**
When a property manager creates a property, they are automatically assigned as the owner:

```typescript
export const assignPropertyManager = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === 'property_manager') {
    req.body.property_manager_id = req.user.id;
  }
  next();
};
```

### Agent Assignment

Agents can only access properties and inquiries assigned to them.

**Implementation:**
- Properties have `agent_id` field
- Inquiries have `agent_id` field
- Viewings have `agent_id` field
- Controllers filter by `agent_id = req.user.id` for agent role

---

## Frontend Authentication

### AuthContext

Location: `frontend/src/context/AuthContext.tsx`

**State:**
```typescript
{
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  userLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
}
```

### Token Storage

**Keys:**
- `admin_token` - JWT token
- `user_role` - User role for redirect logic
- `inactivity_logout` - Flag for cross-tab logout sync

### Session Restoration

On app mount, the frontend:
1. Checks for existing token in localStorage
2. Validates token with `/auth/me` endpoint
3. Restores user data if valid
4. Clears invalid tokens

### Inactivity Logout

**Implementation:** `useInactivityLogout` hook

**Settings:**
- Timeout: 5 minutes
- Warning: 3 minutes before timeout
- Activities: click, keydown, scroll, touch, submit, change, input

**Features:**
- Countdown timer in warning modal
- Cross-tab synchronization via localStorage events
- Automatic logout on timeout
- Role-based redirect on logout

### Protected Routes

**Component:** `ProtectedRoute`

Location: `frontend/src/components/auth/ProtectedRoute.tsx`

**Behavior:**
- Checks authentication status
- Redirects unauthenticated users to login
- Redirects non-admin users to portal
- Preserves intended destination for redirect after login

**Usage:**
```tsx
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>
```

---

## Security Best Practices

### Token Security

✅ **Implemented:**
- Short token expiration (5 minutes)
- Strong secret key required
- Tokens stored in localStorage (HTTP-only cookies not implemented)
- Token verification on every protected request
- Tokens invalidated on logout (client-side removal)

⚠️ **Consider Adding:**
- Refresh token implementation for better UX
- HTTP-only cookies for XSS protection
- Token blacklisting for immediate invalidation

### Password Security

✅ **Implemented:**
- bcrypt hashing with 12 rounds
- Password length validation (8-128 characters)
- Password reset tokens hashed with SHA-256
- Password reset tokens expire in 30 minutes
- Password reset tokens are single-use

⚠️ **Consider Adding:**
- Password complexity requirements (uppercase, lowercase, numbers, special chars)
- Password history to prevent reuse
- Account lockout after failed attempts
- Password strength meter on client

### Account Security

✅ **Implemented:**
- Account deactivation flag (`is_active`)
- Email verification placeholder (not implemented)
- Role-based access control
- Case-insensitive role comparison

⚠️ **Consider Adding:**
- Email verification on registration
- 2FA/MFA for sensitive accounts
- Suspicious activity detection
- Login notification emails

### API Security

✅ **Implemented:**
- Rate limiting (4 different limiters)
- CORS configuration
- Helmet security headers
- Content Security Policy
- Input validation middleware
- SQL injection prevention via TypeORM

⚠️ **Consider Adding:**
- Request size limiting
- IP-based rate limiting
- API key authentication for public endpoints
- Request signing for sensitive operations

---

## Common Authentication Issues

### 401 Unauthorized

**Causes:**
- Token missing from Authorization header
- Token expired
- Invalid token signature
- JWT_SECRET mismatch between servers

**Solutions:**
- Ensure `Authorization: Bearer <token>` header is set
- Re-authenticate if token expired
- Check JWT_SECRET is consistent across environments

### 403 Forbidden

**Causes:**
- User lacks required role
- User doesn't own the resource
- Special permission not granted

**Solutions:**
- Check user role in database
- Verify resource ownership
- Grant required permissions

### Token Not Refreshing

**Current Behavior:**
- No refresh token implementation
- Users must re-authenticate every 5 minutes

**Workaround:**
- Increase JWT_EXPIRES_IN (security trade-off)
- Implement custom refresh token mechanism

---

## Testing Authentication

### Login Test

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password123!"}'
```

### Protected Endpoint Test

```bash
# Get token first
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password123!"}' \
  | jq -r '.token')

# Use token
curl http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### Password Reset Test

```bash
# Request reset
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Reset with token (from email)
curl -X POST http://localhost:5000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"<token-from-email>","newPassword":"NewPassword123!"}'
```

---

## Environment Variables

### Required

```env
JWT_SECRET=your-very-secure-secret-key-at-least-32-characters
JWT_EXPIRES_IN=5m
```

### Optional

```env
# Email for password reset
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your-email@brevo.com
EMAIL_PASSWORD=your-brevo-api-key
EMAIL_FROM=noreply@ingata.com
```

---

## Future Improvements

### Short Term
1. **Refresh Token Implementation:** Reduce frequent re-authentication
2. **Password Complexity Requirements:** Enforce stronger passwords
3. **Account Lockout:** Prevent brute force attacks
4. **Email Verification:** Verify user email addresses

### Medium Term
1. **2FA/MFA:** Add two-factor authentication for sensitive accounts
2. **OAuth Integration:** Social login (Google, Facebook)
3. **Session Management:** View and revoke active sessions
4. **Audit Logging:** Log authentication events

### Long Term
1. **Biometric Auth:** Fingerprint/Face ID for mobile
2. **SSO Integration:** Single sign-on for enterprise clients
3. **Advanced Threat Detection:** ML-based anomaly detection
4. **Zero Trust Architecture:** Continuous authentication
