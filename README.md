# CalorieSmart MVP

A modern, intelligent calorie tracking application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Modern UI**: Built with Tailwind CSS and custom design tokens
- 🌓 **Dark Mode**: Full dark mode support with theme persistence
- ⚡ **Smooth Animations**: Framer Motion powered transitions with reduced motion support
- 📱 **Responsive Design**: Mobile-first approach, works on all devices
- 🧩 **Component Library**: Reusable UI primitives (Button, Card, Input, Select, Modal, Toast)
- 🔒 **Type Safe**: Full TypeScript coverage
- 🎯 **Dashboard**: Track calories, macros, and progress
- ✨ **Design System**: Complete component showcase and documentation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theming**: next-themes
- **Utilities**: clsx, tailwind-merge, class-variance-authority
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 20+ installed
- pnpm installed (or use corepack: `corepack enable`)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd calorie-smart-mvp
```

2. Install dependencies:

```bash
pnpm install
```

3. Copy the environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm typecheck` - Run TypeScript type checking

## Project Structure

```
calorie-smart-mvp/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Landing page
│   ├── dashboard/           # Dashboard route
│   ├── design-system/       # Design system showcase
│   └── globals.css          # Global styles and theme tokens
├── components/              # React components
│   ├── ui/                  # UI primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── modal.tsx
│   │   └── toast.tsx
│   ├── navbar.tsx           # Top navigation
│   ├── footer.tsx           # Site footer
│   ├── app-shell.tsx        # Layout shell
│   ├── page-transition.tsx  # Animation wrapper
│   ├── theme-provider.tsx   # Theme context
│   ├── theme-toggle.tsx     # Dark mode toggle
│   └── user-menu.tsx        # User dropdown menu
├── lib/                     # Utility functions
│   └── utils.ts             # cn() and other helpers
├── .github/workflows/       # CI/CD configuration
│   └── ci.yml               # GitHub Actions workflow
├── .husky/                  # Git hooks
│   └── pre-commit           # Pre-commit hook
└── public/                  # Static assets
```

## UI Components

### Button

```tsx
import { Button } from "@/components/ui/button";

<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button size="lg">Large</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Card content goes here</CardContent>
</Card>;
```

### Input & Select

```tsx
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

<Input placeholder="Enter text..." />
<Select>
  <option>Option 1</option>
  <option>Option 2</option>
</Select>
```

### Modal

```tsx
import { Modal } from "@/components/ui/modal";

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  description="Modal description"
>
  Modal content
</Modal>;
```

### Toast

```tsx
import { useToast } from "@/components/ui/toast";

const { toast } = useToast();

toast({
  title: "Success!",
  description: "Your action was completed.",
  type: "success",
});
```

## Theme Customization

The theme is configured in `app/globals.css`. You can customize colors, spacing, and other design tokens:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --accent: 25 95% 53%;
  --radius-md: 0.75rem;
  /* ... more tokens */
}
```

## Animations

All animations respect the `prefers-reduced-motion` user preference. The app uses Framer Motion for:

- Page transitions (fade + slide)
- List item stagger animations
- Modal enter/exit animations
- Toast notifications

## Git Hooks

Pre-commit hooks automatically run:

- ESLint (with auto-fix)
- Prettier (with auto-format)
- TypeScript type checking

## CI/CD

GitHub Actions automatically runs on push and PR:

1. Install dependencies
2. Run ESLint
3. Run TypeScript type checking
4. Build the application

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass (`pnpm lint && pnpm typecheck && pnpm build`)
4. Submit a pull request

## License

MIT
