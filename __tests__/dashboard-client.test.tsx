import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import type { FoodEntryDTO } from '@/types/food';

vi.mock('@/app/actions/food-entries', () => ({
  createFoodEntry: vi.fn(),
  updateFoodEntry: vi.fn(),
  deleteFoodEntry: vi.fn(),
}));

const { createFoodEntry, deleteFoodEntry } = require('@/app/actions/food-entries');

describe('DashboardClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows adding and deleting a food entry', async () => {
    const user = userEvent.setup();

    createFoodEntry.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'entry-1',
        name: 'Oatmeal',
        calories: 300,
        mealType: 'BREAKFAST',
        occurredAt: new Date('2024-01-01T08:00:00.000Z'),
        createdAt: new Date('2024-01-01T08:00:00.000Z'),
      },
    });

    deleteFoodEntry.mockResolvedValueOnce({ success: true });

    render(<DashboardClient initialEntries={[]} targetCalories={2000} />);

    await user.click(screen.getByRole('button', { name: /^add food$/i }));
    await user.type(screen.getByLabelText(/food name/i), 'Oatmeal');
    const caloriesInput = screen.getByLabelText(/calories/i);
    await user.clear(caloriesInput);
    await user.type(caloriesInput, '300');

    const submitButtons = screen.getAllByRole('button', { name: /add food/i });
    await user.click(submitButtons[submitButtons.length - 1]);

    await waitFor(() => {
      expect(screen.getByText('Oatmeal')).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('Delete Oatmeal'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^delete$/i })).toBeEnabled();
    });
    await user.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(deleteFoodEntry).toHaveBeenCalledWith('entry-1');
    });
  });
});
