import type { NextApiRequest, NextApiResponse } from 'next';
import { searchFoods, FdcRateLimitError, FdcApiError } from '@/lib/fdc/client';
import type { FoodSuggestion } from '@/types/food';

type ApiResponse = {
  items: FoodSuggestion[];
  total: number;
  page: number;
  pageSize: number;
};

type ApiError = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | ApiError>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q, pageSize = '10', page = '1' } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    if (q.trim().length === 0) {
      return res.status(400).json({ error: 'Query cannot be empty' });
    }

    const parsedPageSize = parseInt(pageSize as string, 10);
    const parsedPage = parseInt(page as string, 10);

    if (isNaN(parsedPageSize) || parsedPageSize < 1 || parsedPageSize > 50) {
      return res.status(400).json({ error: 'Invalid pageSize (must be 1-50)' });
    }

    if (isNaN(parsedPage) || parsedPage < 1) {
      return res.status(400).json({ error: 'Invalid page (must be >= 1)' });
    }

    const items = await searchFoods(q, parsedPageSize, parsedPage);

    return res.status(200).json({
      items,
      total: items.length,
      page: parsedPage,
      pageSize: parsedPageSize,
    });
  } catch (error) {
    console.error('Food search error occurred');

    if (error instanceof FdcRateLimitError) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    if (error instanceof FdcApiError) {
      if (error.message.includes('not configured')) {
        return res.status(500).json({ error: 'Service configuration error' });
      }
      return res.status(500).json({ error: 'Failed to search for food' });
    }

    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
