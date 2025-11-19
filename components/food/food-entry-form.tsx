'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const mealTypeOptions = [
  { value: 'BREAKFAST', label: 'Breakfast' },
  { value: 'LUNCH', label: 'Lunch' },
  { value: 'DINNER', label: 'Dinner' },
  { value: 'SNACK', label: 'Snack' },
] as const;

const FoodEntryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  calories: z
    .coerce
    .number({ invalid_type_error: 'Calories must be a number' })
    .int('Calories must be an integer')
    .positive('Calories must be positive'),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
});

export type FoodEntryFormValues = z.infer<typeof FoodEntryFormSchema>;

interface FoodEntryFormProps {
  defaultValues?: Partial<FoodEntryFormValues>;
  onSubmit: (values: FoodEntryFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function FoodEntryForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = 'Save',
}: FoodEntryFormProps) {
  const form = useForm<FoodEntryFormValues>({
    resolver: zodResolver(FoodEntryFormSchema),
    defaultValues: {
      name: '',
      calories: 0,
      mealType: 'BREAKFAST',
      ...defaultValues,
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values);
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="name">Food name</Label>
        <Input
          id="name"
          placeholder="E.g. Grilled chicken salad"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="calories">Calories</Label>
        <Input
          id="calories"
          type="number"
          inputMode="numeric"
          min={0}
          {...form.register('calories', { valueAsNumber: true })}
        />
        {form.formState.errors.calories && (
          <p className="text-sm text-red-500">{form.formState.errors.calories.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mealType">Meal type</Label>
        <Select
          id="mealType"
          {...form.register('mealType')}
        >
          {mealTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {form.formState.errors.mealType && (
          <p className="text-sm text-red-500">{form.formState.errors.mealType.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
