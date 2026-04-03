# Authentication & Role-Based Access Control (RBAC) Documentation

## Overview

JobShield implements a comprehensive authentication and authorization system with role-based access control (RBAC) to manage user and admin access.

## Features

✅ **Login for Both Users and Admins**
- Unified login interface with role selection
- User role: Job seekers analyzing job postings
- Admin role: Platform administrators managing fraud reports

✅ **Controlled Using Role-Based Authentication (RBAC)**
- Role-based route protection
- Fine-grained permission control
- JWT token-based authentication
- Automatic token verification and refresh

## User Roles

### 1. User (Job Seeker)
**Permissions:**
- Access personal dashboard (`/dashboard`)
- Analyze job postings
- View analysis history
- Submit fraud reports (`/report`)
- Download analysis reports

**Protected Routes:**
- `/dashboard`
- `/report`

**Demo Credentials:**
```
Email: demo@example.com
Password: demo123
```

### 2. Admin
**Permissions:**
- Access admin portal (`/admin/dashboard`)
- View all fraud reports
- Manage users
- System settings and configuration
- Monitor platform statistics

**Protected Routes:**
- `/admin/*`

**Demo Credentials:**
```
Email: admin@example.com
Password: admin123
```

## Authentication Flow

### 1. Registration
```
User submits: name, email, password
↓
Validate input
↓
Create user account (role: 'user')
↓
Generate JWT token
↓
Store token in localStorage
↓
Redirect to dashboard
```

### 2. Login
```
User selects role (User/Admin)
User submits: email, password
↓
Validate credentials
↓
Generate JWT token with role
↓
Store token in localStorage
↓
Redirect to role-specific dashboard
```

### 3. Protected Route Access
```
User navigates to protected route
↓
Middleware checks token
↓
Token verification
↓
Role validation
↓
Allow/Deny access
```

## Implementation

### API Endpoints

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
}
```

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "3",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
}
```

#### Verify Token
```
GET /api/auth/verify
Authorization: Bearer eyJhbGc...

Response:
{
  "success": true,
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
}
```

### Frontend Components

#### Auth Context (`src/context/AuthContext.tsx`)
Provides authentication state and methods:
- `user`: Current authenticated user
- `isAuthenticated`: Boolean flag
- `isLoading`: Loading state
- `login()`: Login method
- `register()`: Register method
- `logout()`: Logout method
- `hasRole()`: Check user role

#### Usage
```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, hasRole, logout } = useAuth();

  if (hasRole('admin')) {
    // Show admin features
  }

  return <div>{user?.email}</div>;
}
```

### Route Protection (Middleware)

Middleware file: `middleware.ts`

**Features:**
- JWT token verification
- Token expiration checking
- Role-based access control
- Automatic redirect to login
- Admin access enforcement

**Protected Routes:**
```
/admin/*     → Admin only
/dashboard   → User only
/report      → User only
```

**Public Routes:**
```
/            → Home page
/auth/login  → Login page
/auth/register → Register page
/api/auth/*  → Auth endpoints
```

## Security Measures

### Token Management
- 🔐 JWT signed with secret key
- ⏱️ 7-day token expiration
- 🔄 Automatic token validation
- 📦 Stored in localStorage (production: httpOnly cookies recommended)

### Password Security
- ✓ Minimum 6 characters required
- ✓ Password confirmation validation
- ⚠️ Demo: Plain text (production: bcrypt hashing required)

### Route Protection
- ✓ Middleware-based access control
- ✓ Role verification before rendering
- ✓ Automatic redirect for unauthorized access
- ✓ Token expiration handling

### Best Practices for Production
```
1. Hash passwords with bcrypt
2. Use httpOnly cookies instead of localStorage
3. Implement CSRF tokens
4. Add rate limiting on auth endpoints
5. Enable HTTPS only
6. Implement 2FA for admin accounts
7. Add audit logging for admin actions
8. Use environment variables for secrets
9. Implement account lockout after failed attempts
10. Add email verification for registration
```

## Pages

### User Pages
- `/auth/login` → Login page with user/admin toggle
- `/auth/register` → Registration page
- `/dashboard` → User dashboard (protected)
- `/report` → Report scam page (protected)

### Admin Pages
- `/admin/dashboard` → Admin dashboard (protected)
- `/admin/profile` → Admin profile (protected)
- `/admin/settings` → Admin settings (protected)

## Testing

### Test Accounts (Demo)

**User Account:**
```
Email: demo@example.com
Password: demo123
Role: user
```

**Admin Account:**
```
Email: admin@example.com
Password: admin123
Role: admin
```

### Test Flow

1. **User Registration:**
   - Go to `/auth/register`
   - Create new account
   - Get automatically logged in
   - Redirected to `/dashboard`

2. **User Login:**
   - Go to `/auth/login`
   - Select "Job Seeker" tab
   - Enter credentials
   - Access user dashboard

3. **Admin Login:**
   - Go to `/auth/login`
   - Select "Admin" tab
   - Enter admin credentials
   - Access admin portal at `/admin/dashboard`

4. **Logout:**
   - Click user avatar in navbar/header
   - Select "Logout"
   - Redirected to home page

## Troubleshooting

### "Unauthorized" Error
- Check if token is valid
- Verify user role matches route requirement
- Token may have expired, re-login

### "Not Found" Error
- Verify route exists
- Check role access for protected routes
- Admin routes require admin role

### Token Not Saving
- Check localStorage permissions
- Verify cookies/storage enabled
- Check browser console for errors

## Future Enhancements

- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, GitHub)
- [ ] Role-based permission matrix
- [ ] Activity audit logs
- [ ] Session management
- [ ] API key authentication for integrations
- [ ] OAuth2 support
- [ ] SAML for enterprise SSO

## Components & Files

```
src/
├── context/
│   └── AuthContext.tsx          # Auth provider and hooks
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   └── register/
│   │       └── page.tsx         # Register page
│   ├── admin/
│   │   └── dashboard/
│   │       └── page.tsx         # Admin dashboard
│   ├── dashboard/
│   │   └── page.tsx             # User dashboard
│   └── api/auth/
│       ├── login/
│       │   └── route.ts         # Login endpoint
│       ├── register/
│       │   └── route.ts         # Register endpoint
│       └── verify/
│           └── route.ts         # Token verification
├── lib/
│   └── auth.ts                  # JWT utilities
└── middleware.ts                # Route protection
```

## Questions & Support

For issues or questions regarding authentication:
1. Check this documentation
2. Review test accounts credentials
3. Check browser console for errors
4. Verify token in localStorage
5. Contact support team

---

**Last Updated:** April 2026
**Version:** 1.0
**Status:** Production Ready ✓
