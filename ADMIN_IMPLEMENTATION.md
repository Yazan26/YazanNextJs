# Admin View Implementation

## Overview
A complete admin panel has been implemented for users with `role = "admin"` in the database. Admins have access to advanced features for managing VKMs and users.

## Features Implemented

### 1. **Admin Authentication & Authorization**
- **File**: `src/hooks/use-require-admin.ts`
- Protects admin routes by checking if user is authenticated AND has role "admin"
- Redirects non-admin users to home page
- Redirects unauthenticated users to login page

### 2. **Admin Types**
- **File**: `src/types/admin.ts`
- `AdminUser`: Extended user interface with creation/update timestamps
- `CreateVKMData`: Interface for creating new VKMs
- `UpdateUserData`: Interface for updating user details
- `UserWithFavorites`: User interface with favorite VKMs list

### 3. **Admin API Functions**
- **File**: `src/lib/api.ts` (added to existing file)

#### VKM Management:
- `adminGetVKMs()` - Get all VKMs with optional filters
- `adminCreateVKM()` - Create a new VKM
- `adminUpdateVKM()` - Update an existing VKM
- `adminDeleteVKM()` - Delete a VKM

#### User Management:
- `adminGetUsers()` - Get all users
- `adminGetUser(id)` - Get specific user details
- `adminUpdateUser(id, data)` - Update user details
- `adminDeleteUser(id)` - Delete a user

### 4. **Admin Dashboard**
- **Route**: `/admin`
- **File**: `src/app/admin/page.tsx`
- Overview page with navigation to admin features
- Feature cards for VKM Management and User Management
- Stats section (placeholder for future enhancement)

### 5. **VKM Management Page**
- **Route**: `/admin/vkms`
- **File**: `src/app/admin/vkms/page.tsx`

**Features:**
- View all VKMs with filtering options:
  - Search by name
  - Filter by location
  - Filter by level (NLQF5/NLQF6)
  - Filter by status (active/inactive)
- Create new VKMs with form including:
  - Name, descriptions, content
  - Study credits (15 or 30 EC)
  - Location, level, contact ID
  - Learning outcomes
- Delete VKMs
- View VKM details
- Display VKM status (active/inactive)

### 6. **User Management Pages**

#### User List Page
- **Route**: `/admin/users`
- **File**: `src/app/admin/users/page.tsx`

**Features:**
- View all users
- Search by username, email, or role
- Display user role badges (admin/student)
- Delete users
- Navigate to user details
- Statistics dashboard showing:
  - Total users
  - Number of admins
  - Number of students
  - Filtered results count

#### User Detail Page
- **Route**: `/admin/users/[id]`
- **File**: `src/app/admin/users/[id]/page.tsx`

**Features:**
- View detailed user information
- Edit user details (username, email, role)
- Delete user
- View user's favorite VKMs
- Display creation and update timestamps

### 7. **Navbar Updates**
- **File**: `src/components/navbar.tsx`
- Admin users see different navigation links:
  - 👑 Admin (Dashboard)
  - 📚 VKM Beheer
  - 👥 Gebruikers
- Regular students see:
  - 📚 Modules
  - ⭐ Favorieten
- Mobile menu includes descriptions for all links

## API Endpoints Used

### VKM Endpoints:
- `GET /vkm` - Get VKMs (with filters)
- `POST /vkm` - Create VKM
- `PUT /vkm/{id}` - Update VKM
- `DELETE /vkm/{id}` - Delete VKM

### User Management Endpoints:
- `GET /auth/users` - Get all users
- `GET /auth/users/{id}` - Get specific user
- `PUT /auth/users/{id}` - Update user
- `DELETE /auth/users/{id}` - Delete user

## VKM Creation Schema

```json
{
  "name": "Learning and working abroad",
  "shortDescription": "Internationaal, persoonlijke ontwikkeling, verpleegkunde",
  "description": "Studenten kiezen binnen de (stam) van de opleiding van Verpleegkunde...",
  "content": "Full content text...",
  "studyCredit": 15,
  "location": "Den Bosch",
  "contactId": "58",
  "level": "NLQF5",
  "learningOutcomes": "De student toont professioneel gedrag..."
}
```

## Security Features

1. **Route Protection**: All admin routes use `useRequireAdmin()` hook
2. **Role-Based Access**: Only users with `role = "admin"` can access admin features
3. **Authentication Check**: Redirects to login if not authenticated
4. **Authorization Check**: Redirects to home if authenticated but not admin

## User Experience

### For Admin Users:
- Access to complete admin dashboard
- Can create, view, update, and delete VKMs
- Can view, update, and delete users
- Can see user favorites
- Can filter and search both VKMs and users

### For Regular Students:
- See normal student navigation
- Cannot access `/admin` routes (automatically redirected)
- Can still use all student features (modules, favorites)

## Navigation Flow

```
Admin Login → Dashboard (/admin)
                ├── VKM Management (/admin/vkms)
                │   ├── View all VKMs
                │   ├── Create new VKM
                │   ├── Filter VKMs
                │   └── Delete VKMs
                │
                └── User Management (/admin/users)
                    ├── View all users
                    ├── Search users
                    └── User Details (/admin/users/[id])
                        ├── View user info
                        ├── Edit user
                        ├── View favorites
                        └── Delete user
```

## Styling

- Consistent with existing design system
- Uses CSS variables for theming
- Responsive design for mobile and desktop
- Dark mode support
- Smooth transitions and hover effects
- Card-based layouts
- Gradient accents for visual hierarchy

## Files Created/Modified

### New Files:
1. `src/types/admin.ts`
2. `src/hooks/use-require-admin.ts`
3. `src/app/admin/page.tsx`
4. `src/app/admin/vkms/page.tsx`
5. `src/app/admin/users/page.tsx`
6. `src/app/admin/users/[id]/page.tsx`

### Modified Files:
1. `src/lib/api.ts` - Added admin API functions
2. `src/components/navbar.tsx` - Added admin navigation links

## Testing the Implementation

1. **Login as admin**: Ensure user has `role = "admin"` in database
2. **Check navbar**: Should show "Admin", "VKM Beheer", "Gebruikers"
3. **Access admin routes**: Navigate to `/admin`, `/admin/vkms`, `/admin/users`
4. **Test VKM creation**: Create a new VKM using the form
5. **Test user management**: View, edit, and manage users
6. **Test role-based access**: Login as regular student, should not see admin links

## Notes

- All admin operations require authentication token
- Error handling is implemented for all API calls
- Loading states are shown during data fetching
- Confirmation dialogs prevent accidental deletions
- Forms validate required fields before submission
