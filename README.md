# CalorieSmart MVP

A calorie tracking application that helps users reach their health goals through personalized nutrition planning.

## Features

### Profile & Calorie Target Calculation

- **Onboarding Flow**: New users are guided through a 3-step onboarding process to set up their profile
  - Step 1: Profile Info (age, height, weight, sex)
  - Step 2: Goals (activity level, goal)
  - Step 3: Review & Save (computed calorie target)

- **Mifflin-St Jeor Formula**: Calculates daily calorie targets using the scientifically-validated Mifflin-St Jeor equation for BMR (Basal Metabolic Rate), then applies activity level multipliers for TDEE (Total Daily Energy Expenditure)

- **Goal-Based Adjustments**: 
  - Weight loss: -500 kcal/day
  - Maintain weight: no adjustment
  - Gain muscle: +500 kcal/day

- **Dashboard**: Displays today's calorie target prominently with profile summary

- **Settings**: Edit profile and optionally override the automatic calorie calculation with a manual target
  - Automatic recalculation when profile changes (unless manually overridden)
  - Manual override option for clinician-approved plans

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Prisma**: Type-safe ORM with SQLite database
- **Vitest**: Unit testing framework

## Database Schema

### User Model
- id, email, name
- One-to-one relationship with Profile

### Profile Model
- age, heightCm, weightKg, sex (MALE/FEMALE)
- activityLevel (SEDENTARY, LIGHTLY_ACTIVE, MODERATELY_ACTIVE, VERY_ACTIVE, EXTRA_ACTIVE)
- goal (LOSE, MAINTAIN, GAIN)
- calorieTarget: computed daily calorie target
- calorieTargetOverridden: boolean flag for manual overrides

## Getting Started

### Installation

```bash
npm install
```

### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Testing

```bash
npm test
```

## Project Structure

```
/app
  /api/profile       # Profile CRUD API endpoints
  /onboarding        # Onboarding flow page
  /settings          # Settings page
  layout.tsx         # Root layout
  page.tsx           # Dashboard/home page
  globals.css        # Global styles

/components
  /onboarding
    OnboardingFlow.tsx  # Multi-step onboarding component
    Stepper.tsx         # Progress stepper UI

/lib
  calorie-calculator.ts      # BMR/TDEE calculation logic
  calorie-calculator.test.ts # Unit tests
  auth.ts                    # Demo user authentication
  prisma.ts                  # Prisma client singleton

/prisma
  schema.prisma      # Database schema
```

## Calorie Calculation

The application uses the **Mifflin-St Jeor equation** to calculate BMR:

**For males:**
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
```

**For females:**
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
```

TDEE is then calculated by multiplying BMR by an activity factor:
- Sedentary: 1.2
- Lightly active: 1.375
- Moderately active: 1.55
- Very active: 1.725
- Extra active: 1.9

Finally, the calorie target adjusts based on the user's goal, with a minimum floor of 1,200 kcal/day for safety.

## Future Enhancements

- Food logging functionality
- Progress tracking and charts
- Meal planning and recipes
- Integration with fitness trackers
- Multi-user authentication system
- Mobile app

## License

ISC
