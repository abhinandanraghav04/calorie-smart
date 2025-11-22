# MVP Rollup PR Test Checklist

## ✅ Pre-merge Validation

### CI/CD Status
- [x] Build passes successfully (`pnpm build`)
- [x] Type checking passes (`pnpm typecheck`)
- [x] ESLint passes (no warnings/errors)
- [x] All dependencies resolved and installed

### Code Quality
- [x] Merge conflicts resolved
- [x] Import statements corrected (next-auth/next)
- [x] ESLint errors fixed (escaped apostrophe)
- [x] Schema integration complete (User, Profile, FoodEntry models)

## 🧪 Functional Testing Checklist

### Authentication Flow
- [x] User can sign up with email/password (created net-new account locally)
- [x] User can sign in with valid credentials (verified seeded + new accounts)
- [x] Invalid credentials show appropriate error (tested with bad password)
- [x] Session management works (JWT-based) (navbar + API routes reflect state)
- [x] Protected routes redirect unauthenticated users to `/signin`

### Onboarding Flow
- [x] New users are redirected to `/onboarding` after sign in
- [x] Profile form validates all required fields (missing fields show inline errors)
- [x] Calorie target calculation works with Mifflin-St Jeor formula (verified expected numbers)
- [x] User can override calculated calorie target (manual override persisted)
- [x] Successful onboarding redirects to `/dashboard`

### Dashboard Functionality
- [x] Dashboard displays user's profile and daily target
- [x] Today's food entries are displayed correctly (sorted by occurredAt)
- [x] Calorie consumption and remaining calculations are accurate
- [x] "Add Food" button navigates to food entry form
- [x] Links to history and settings work properly

### Food Logging CRUD
- [x] Can add new food entries with name, calories, meal type, time
- [x] Form validation works (required fields, positive calories)
- [x] New entries appear on dashboard immediately (cache revalidation)
- [x] Can edit existing food entries
- [x] Can delete food entries
- [x] Changes reflect correctly in daily totals

### History & Analytics
- [x] 7-day history page loads correctly
- [x] Daily calorie totals are accurate for each day
- [x] Visual sparkline displays properly
- [x] Variance vs target calculations are correct
- [x] Navigation between dates works

### USDA Integration (Optional)
- [ ] Food search works when FDC_API_KEY is configured *(blocked: no key in local env; code path smoke-tested via mocked fetch)*
- [ ] Search results display food names, brands, and calories *(requires live key)*
- [ ] Can select USDA foods to pre-fill calorie data *(requires live key)*
- [x] Graceful handling when API key is missing (verified add-food form surfaces friendly message)

### Settings & Profile Management
- [x] Settings page displays current profile information
- [x] Can update profile details (age, height, weight, etc.)
- [x] Calorie target recalculates when profile changes
- [x] Manual calorie target override persists
- [x] Account information displays correctly

### Navigation & UX
- [x] Navigation bar shows correct user state
- [x] User dropdown menu works properly
- [x] Sign out functionality works and redirects to sign in
- [x] All links and buttons are functional
- [x] Responsive design works on mobile/desktop (verified via Chrome dev tools)

### Error Handling
- [x] Network errors show user-friendly messages (API responses surfaced in toasts)
- [x] Form validation errors are clear and helpful
- [x] Unauthorized access is properly handled
- [x] Database errors don't crash the application (server errors rendered gracefully)

## 🚀 Deployment Readiness

### Environment Configuration
- [x] `.env.example` includes all required variables
- [x] Database schema is migration-ready
- [x] Production environment variables documented

### Performance
- [x] Page load times are acceptable
- [x] Database queries are optimized
- [x] Client-side bundle size is reasonable

### Security
- [x] Password hashing implemented (bcrypt)
- [x] Session tokens are secure
- [x] API routes have proper authentication
- [x] Environment variables are not exposed

## 📝 Notes

### Known Limitations
- USDA FoodData Central integration requires API key
- No real-time updates (manual refresh required)
- Limited to single user profile per account

### Future Enhancements
- Real-time calorie tracking
- Multiple profiles per account
- Barcode scanning for food items
- Social features and sharing

---

**Testing Environment**: Local development with PostgreSQL

**Browser Tested**: Chrome/Firefox latest versions

**Mobile Tested**: iOS Safari, Android Chrome
