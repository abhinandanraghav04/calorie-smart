import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FoodEntryForm } from '@/components/food/food-entry-form';

describe('FoodEntryForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('validates that calories must be positive', async () => {
    const user = userEvent.setup();

    render(
      <FoodEntryForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitLabel="Submit"
      />
    );

    const nameInput = screen.getByLabelText(/food name/i);
    const caloriesInput = screen.getByLabelText(/calories/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'Test Food');
    await user.clear(caloriesInput);
    await user.type(caloriesInput, '-100');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/calories must be positive/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();

    render(
      <FoodEntryForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitLabel="Submit"
      />
    );

    const nameInput = screen.getByLabelText(/food name/i);
    const caloriesInput = screen.getByLabelText(/calories/i);
    const mealTypeSelect = screen.getByLabelText(/meal type/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'Chicken Salad');
    await user.clear(caloriesInput);
    await user.type(caloriesInput, '350');
    await user.selectOptions(mealTypeSelect, 'LUNCH');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Chicken Salad',
        calories: 350,
        mealType: 'LUNCH',
      });
    });
  });

  it('requires name field', async () => {
    const user = userEvent.setup();

    render(
      <FoodEntryForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitLabel="Submit"
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <FoodEntryForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
        submitLabel="Submit"
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
