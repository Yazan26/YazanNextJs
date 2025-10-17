# Backend JWT Issue - Admin Role Not Included

## Problem
The admin user is logging in successfully, but the admin navigation is not showing because the JWT token does not include the `role` field.

## Database Entry (Correct)
```json
{
  "_id": "68f28f042e2f55edaed4c600",
  "username": "Admin",
  "email": "admin@admin.com",
  "role": "admin",  // ✅ Role is set in database
  ...
}
```

## Current Behavior
1. User logs in with admin credentials
2. Backend returns JWT token
3. Frontend decodes JWT - but `role` field is missing
4. Defaults to `role: 'student'`
5. Admin navigation doesn't show

## Root Cause
The backend is **NOT including the `role` field in the JWT payload** when generating the access token.

## Backend Fix Required

Your backend login endpoint needs to include the `role` field when creating the JWT. 

### Example (Node.js/Express with jsonwebtoken):

**BEFORE (current - incorrect):**
```javascript
const token = jwt.sign(
  {
    sub: user._id,
    username: user.username,
    email: user.email,
    // role is missing!
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

**AFTER (correct):**
```javascript
const token = jwt.sign(
  {
    sub: user._id,
    username: user.username,
    email: user.email,
    role: user.role,  // ✅ Add this line
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

## Where to Make the Change

Look for your backend login route, typically in a file like:
- `src/auth/auth.service.ts`
- `src/controllers/authController.js`
- `routes/auth.js`
- `src/routes/auth.route.ts`

Find where the JWT is being signed and add the `role` field to the payload.

## Verification Steps

After updating the backend:

1. **Login with admin account**
2. **Open browser console** (F12)
3. **Check the logs** - you should see:
   ```
   JWT Payload: {
     sub: "68f28f042e2f55edaed4c600",
     username: "Admin",
     email: "admin@admin.com",
     role: "admin",  // ✅ This should now appear
     iat: 1234567890,
     exp: 1234567890
   }
   ```
4. **Check navbar** - should show admin links
5. **Navigate to `/admin`** - should work

## Alternative: Manual Token Check

You can manually decode your current JWT token at https://jwt.io to see what fields are included.

1. Login as admin
2. Open browser console
3. Type: `localStorage.getItem('token')`
4. Copy the token
5. Paste at https://jwt.io
6. Check if `role` field exists in the payload

## Frontend Changes Made

We've added debug logging to help diagnose the issue:
- `src/lib/jwt.ts` - logs JWT payload and extracted user
- `src/app/login/page.tsx` - logs decoded user on login
- `src/components/navbar.tsx` - logs user and isAdmin flag

These console logs will help confirm when the backend fix is applied.
