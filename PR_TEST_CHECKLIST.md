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
- [ ] User can sign up with email/password
- [ ] User can sign in with valid credentials
- [ ] Invalid credentials show appropriate error
- [ ] Session management works (JWT-based)
- [ ] Protected routes redirect unauthenticated users to `/signin`

### Onboarding Flow
- [ ] New users are redirected to `/onboarding` after sign in
- [ ] Profile form validates all required fields
- [ ] Calorie target calculation works with Mifflin-St Jeor formula
- [ ] User can override calculated calorie target
- [ ] Successful onboarding redirects to `/dashboard`

### Dashboard Functionality
- [ ] Dashboard displays user's profile and daily target
- [ ] Today's food entries are displayed correctly
- [ ] Calorie consumption and remaining calculations are accurate
- [ ] "Add Food" button navigates to food entry form
- [ ] Links to history and settings work properly

### Food Logging CRUD
- [ ] Can add new food entries with name, calories, meal type, time
- [ ] Form validation works (required fields, positive calories)
- [ ] New entries appear on dashboard immediately
- [ ] Can edit existing food entries
- [ ] Can delete food entries
- [ ] Changes reflect correctly in daily totals

### History & Analytics
- [ ] 7-day history page loads correctly
- [ ] Daily calorie totals are accurate for each day
- [ ] Visual sparkline displays properly
- [ ] Variance vs target calculations are correct
- [ ] Navigation between dates works

### USDA Integration (Optional)
- [ ] Food search works when FDC_API_KEY is configured
- [ ] Search results display food names, brands, and calories
- [ ] Can select USDA foods to pre-fill calorie data
- [ ] Graceful handling when API key is missing

### Settings & Profile Management
- [ ] Settings page displays current profile information
- [ ] Can update profile details (age, height, weight, etc.)
- [ ] Calorie target recalculates when profile changes
- [ ] Manual calorie target override persists
- [ ] Account information displays correctly

### Navigation & UX
- [ ] Navigation bar shows correct user state
- [ ] User dropdown menu works properly
- [ ] Sign out functionality works and redirects to sign in
- [ ] All links and buttons are functional
- [ ] Responsive design works on mobile/desktop

### Error Handling
- [ ] Network errors show user-friendly messages
- [ ] Form validation errors are clear and helpful
- [ ] Unauthorized access is properly handled
- [ ] Database errors don't crash the application

## 🚀 Deployment Readiness

### Environment Configuration
- [ ] `.env.example` includes all required variables
- [ ] Database schema is migration-ready
- [ ] Production environment variables documented

### Performance
- [ ] Page load times are acceptable
- [ ] Database queries are optimized
- [ ] Client-side bundle size is reasonable

### Security
- [ ] Password hashing implemented (bcrypt)
- [ ] Session tokens are secure
- [ ] API routes have proper authentication
- [ ] Environment variables are not exposed

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