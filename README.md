# calorie-smart-mvp

A minimal calorie tracking web application powered by the USDA FoodData Central API.

## Features

- 🔍 Real-time food search using USDA FoodData Central
- 🍎 Smart suggestion dropdown with debounced queries (300ms)
- 📊 View calorie information for foods
- ✏️ Adjust portion sizes and calories
- 🚀 In-memory caching (5 minutes) for better performance
- 🎨 Modern, responsive UI

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Backend:** Next.js API Routes (Node.js)
- **API:** USDA FoodData Central
- **Testing:** Vitest

## Setup

### Prerequisites

- Node.js 18+ and npm
- A USDA FoodData Central API key

### Get API Key

1. Visit [https://fdc.nal.usda.gov/api-key-signup.html](https://fdc.nal.usda.gov/api-key-signup.html)
2. Sign up for a free API key
3. Save your API key for the next step

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd calorie-smart-mvp
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

4. Open `.env` and add your USDA FoodData Central API key:

```bash
FDC_API_KEY=your_api_key_here
```

⚠️ **Important:** Never commit your `.env` file. It's included in `.gitignore` to prevent accidental exposure.

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

Run unit tests:

```bash
npm test
```

### Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Usage

### `/api/food/search`

Search for foods in the USDA FoodData Central database.

**Method:** `GET`

**Query Parameters:**

- `q` (required): Search query (e.g., "chicken", "banana")
- `pageSize` (optional): Results per page (1-50, default: 10)
- `page` (optional): Page number (default: 1)

**Example:**

```bash
curl "http://localhost:3000/api/food/search?q=chicken&pageSize=5"
```

**Response:**

```json
{
  "items": [
    {
      "id": 123456,
      "description": "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
      "brand": null,
      "calories": 165
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 5
}
```

## Error Handling

- **Rate Limiting:** If the USDA API rate limit is exceeded, you'll see a user-friendly toast notification
- **API Errors:** All API errors are caught and displayed as toast messages
- **Validation:** Input validation prevents invalid requests
- **Logging:** Server-side errors are logged (without sensitive information)

## Architecture

### Client-Side (Frontend)

- `pages/index.tsx`: Main application page
- `components/AddFoodModal.tsx`: Food search modal with debounced search
- `components/ToastProvider.tsx`: Toast notification system
- `hooks/useDebounce.ts`: Custom React hook for debouncing

### Server-Side (Backend)

- `pages/api/food/search.ts`: API route for food search
- `lib/fdc/client.ts`: USDA FoodData Central client with caching
- `lib/fdc/types.ts`: TypeScript types for FDC API
- `types/`: Shared TypeScript types

### Caching

The application uses an in-memory cache to reduce API calls:

- **Duration:** 5 minutes
- **Key:** Query string + page size + page number
- **Benefit:** Faster responses and reduced API usage

## Security

- ✅ API key stored in environment variable (never exposed to client)
- ✅ API key not logged in error messages
- ✅ Input validation on all endpoints
- ✅ No sensitive data in client-side code

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
