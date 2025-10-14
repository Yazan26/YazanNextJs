# Favorites Feature - Troubleshooting Guide

## Overview
The favorites feature allows students to save VKM modules and view them on a dedicated page.

## How It Works

### Favoriting a Module
1. Navigate to `/modules` page
2. Click the ☆ (empty star) button on any module card
3. The star becomes ⭐ (filled star)
4. Module is added to favorites

### Viewing Favorites
1. Click "Favorieten" in the navbar
2. Or click "Bekijk mijn favorieten" link on modules page
3. Navigate to `/favorites` page
4. All favorited modules are displayed

### Removing from Favorites
1. On `/favorites` page, click the ⭐ (filled star)
2. Module is instantly removed from the list
3. Or go to `/modules` page and click ⭐ to unfavorite

## API Endpoints Used

### Get All Favorites
```
GET /vkm/favorites
Headers: Authorization: Bearer <token>
```

**Expected Response:**
```json
[
  {
    "id": "68ed766ca5d5dc8235d7cf37",
    "name": "Module Name",
    "shortDescription": "Short description",
    "description": "Full description",
    "studyCredit": 15,
    "location": "Breda",
    "contactId": "126",
    "level": "NLQF5",
    "learningOutcomes": "Learning outcomes",
    "isActive": true,
    "createdAt": "2025-10-14T22:31:02.422Z",
    "updatedAt": "2025-10-14T22:31:02.422Z",
    "isFavorited": true
  }
]
```

### Toggle Favorite
```
POST /vkm/{id}/favorite
Headers: Authorization: Bearer <token>
```

## Common Issues & Solutions

### Issue 1: "Kan favorieten niet ophalen"

**Possible Causes:**
1. API endpoint `/vkm/favorites` returns error
2. Authentication token is invalid/expired
3. Network connection issue
4. CORS issue

**Debug Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for log messages:
   - "Fetching favorites from: [URL]"
   - "Error fetching favorites: [error message]"
4. Go to Network tab
5. Find the request to `/vkm/favorites`
6. Check:
   - Status code (should be 200)
   - Request headers (Authorization header present?)
   - Response body (what error is returned?)

**Solutions:**
- If 401 Unauthorized: Token expired, log out and log back in
- If 404 Not Found: Check API endpoint is correct
- If 500 Server Error: Check backend logs
- If CORS error: Configure CORS on backend

### Issue 2: Favorites Not Showing After Favoriting

**Possible Causes:**
1. `isFavorited` field not returned from API
2. Favorite action succeeded but state not updated
3. User needs to refresh favorites page

**Solutions:**
1. Navigate away and back to `/favorites`
2. Click "Opnieuw laden" button on error page
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Issue 3: Can't Remove Favorites

**Possible Causes:**
1. Toggle endpoint `/vkm/{id}/favorite` not working
2. Token expired
3. Module ID incorrect

**Debug Steps:**
1. Check Network tab for POST request to `/vkm/{id}/favorite`
2. Verify module ID in URL
3. Check response status

**Solutions:**
- Ensure endpoint toggles correctly (POST same endpoint to add/remove)
- Refresh auth token if expired
- Check backend implementation

## Environment Variables

Ensure `.env.local` has correct API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
# or your production API URL
```

## Testing the Feature

### Manual Test Flow
1. ✅ Login with valid credentials
2. ✅ Navigate to `/modules`
3. ✅ Click ☆ on a module → becomes ⭐
4. ✅ Navigate to `/favorites`
5. ✅ Module appears in favorites list
6. ✅ Click ⭐ on favorite → removed from list
7. ✅ Empty state shows when no favorites

### Expected Behavior
- **Empty favorites**: Shows friendly message with link to browse modules
- **With favorites**: Shows grid of favorited modules
- **Clicking star**: Instantly updates UI (optimistic update)
- **Error**: Shows error message with retry button

## Debug Logs

The favorites page includes console.log statements:
- `console.log("Fetching favorites from:", url)`
- `console.log("Favorites received:", data)`
- `console.error("Error fetching favorites:", err)`

Check browser console for these logs when debugging.

## API Response Validation

The favorites endpoint should return an array of VKM modules. Each module should have:
- `id` (string)
- `name` (string)
- `shortDescription` (string)
- `description` (string)
- `studyCredit` (number: 15 or 30)
- `location` (string)
- `contactId` (string)
- `level` (string: "NLQF5" or "NLQF6")
- `learningOutcomes` (string)
- `isActive` (boolean)
- `createdAt` (ISO date string)
- `updatedAt` (ISO date string)
- `isFavorited` (boolean - should be true for favorites)

## Backend Requirements

The backend should:
1. Implement `GET /vkm/favorites` endpoint
2. Return only modules favorited by authenticated user
3. Include `isFavorited: true` in response
4. Support pagination (optional)
5. Handle authentication via Bearer token
6. Return proper HTTP status codes

## Next Steps

If issues persist:
1. Check backend API logs
2. Verify database has favorites stored correctly
3. Test API endpoints directly with Postman/curl
4. Ensure JWT token contains correct user ID (`sub` field)
5. Verify backend favorites query uses correct user ID from token
