# API Integration Fixes Summary

## Issues Fixed

### 1. **Login Response Format Mismatch**
**Problem:** The API returns `access_token` instead of `token`, and doesn't include user data directly.

**Solution:**
- Updated login page to expect `access_token` field
- Created JWT utility functions to decode the token
- Extract user information from the JWT payload (sub, username, email, role)

### 2. **Next.js 15 Async Params**
**Problem:** In Next.js 15, route params are now promises and need to be unwrapped.

**Solution:**
- Updated `modules/[id]/page.tsx` to use `React.use()` to unwrap params
- Changed type from `{ params: { id: string } }` to `{ params: Promise<{ id: string }> }`

### 3. **Auto-Login After Registration**
**Enhancement:** Users are now automatically logged in after successful registration.

**Implementation:**
- After successful registration, make a login request with the same credentials
- Decode the JWT token and store user info
- Redirect to `/modules` page

## Files Modified

### 1. `src/lib/jwt.ts` (NEW)
Utility functions for JWT handling:
- `decodeJWT()` - Decode JWT token to get payload
- `isTokenExpired()` - Check if token is expired
- `getUserFromToken()` - Extract user object from token

### 2. `src/app/login/page.tsx`
- Import `getUserFromToken` utility
- Handle `access_token` field from API response
- Decode JWT to get user information
- Store token and redirect to `/modules`

### 3. `src/app/register/page.tsx`
- Import `getUserFromToken` utility
- Auto-login after successful registration
- Decode JWT and redirect to `/modules`
- Fallback to manual login page if auto-login fails

### 4. `src/app/modules/[id]/page.tsx`
- Use `React.use()` to unwrap async params
- Updated type signature for params
- Use `unwrappedParams.id` instead of `params.id`

## API Contract

### Login Request
```json
POST /auth/login
{
  "username": "johndoe",
  "password": "password123"
}
```

### Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### JWT Payload Structure
```json
{
  "sub": "68ec2bf8921ecd841d7363b7",  // user ID
  "username": "johndoe",
  "email": "user@example.com",
  "iat": 1760481814,                   // issued at
  "exp": 1760482714                    // expiration
}
```

### Register Request
```json
POST /auth/register
{
  "username": "johndoe",
  "email": "user@example.com",
  "password": "password123"
}
```

### Register Response
```json
{
  "id": "68eed238e7aac8a107c44540",
  "username": "johndoe",
  "email": "user@example.com",
  "role": "student",
  "createdAt": "2025-10-14T22:44:08.720Z",
  "updatedAt": "2025-10-14T22:44:08.720Z"
}
```

## Authentication Flow

1. **Login:**
   - User submits credentials → API returns `access_token`
   - Decode JWT to extract user info (id, username, email, role)
   - Store token in localStorage
   - Store user object in AuthContext
   - Redirect to `/modules`

2. **Register:**
   - User submits registration → API returns user object
   - Automatically attempt login with same credentials
   - Get `access_token` from login response
   - Decode JWT and store user info
   - Redirect to `/modules`

3. **Protected Routes:**
   - Check `isAuthenticated` from AuthContext
   - If not authenticated → redirect to `/login`
   - Include `Authorization: Bearer <token>` header in API requests

## Testing Checklist

- [x] Login with valid credentials works
- [x] JWT token is properly decoded
- [x] User info is extracted from token
- [x] Redirect to modules page after login
- [x] Register creates account
- [x] Auto-login after registration works
- [x] Token stored in localStorage
- [x] Protected routes check authentication
- [x] Next.js 15 async params handled correctly
- [x] No TypeScript errors

## Notes

- JWT tokens are decoded client-side using `atob()` (base64 decode)
- Token expiration checking is available via `isTokenExpired()` utility
- All sensitive data is in the JWT payload - no separate user profile endpoint needed
- The `role` field in JWT can be used for future role-based access control

## Next Steps (Optional)

1. Add token refresh logic when token expires
2. Add "Remember me" functionality
3. Add password reset flow
4. Add email verification
5. Implement role-based access control using the `role` field
6. Add token expiration warning before auto-logout
