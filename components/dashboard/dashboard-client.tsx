'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/progress-ring';
import { FoodEntryCard } from './food-entry-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FoodEntryForm, FoodEntryFormValues } from '@/components/food/food-entry-form';
import { createFoodEntry, updateFoodEntry, deleteFoodEntry } from '@/app/actions/food-entries';
import { toast } from 'sonner';
import type { FoodEntryDTO, MealType } from '@/types/food';

interface DashboardClientProps {
  initialEntries: FoodEntryDTO[];
  targetCalories: number;
}

type ModalState =
  | { type: 'closed' }
  | { type: 'add' }
  | { type: 'edit'; entry: FoodEntryDTO }
  | { type: 'delete'; entry: FoodEntryDTO };

export function DashboardClient({ initialEntries, targetCalories }: DashboardClientProps) {
  const [entries, setEntries] = useState<FoodEntryDTO[]>(initialEntries);
  const [modalState, setModalState] = useState<ModalState>({ type: 'closed' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalCalories = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.calories, 0),
    [entries]
  );

  const entriesByMealType = useMemo(() => {
    return entries.reduce((acc, entry) => {
      if (!acc[entry.mealType]) {
        acc[entry.mealType] = [];
      }
      acc[entry.mealType].push(entry);
      return acc;
    }, {} as Record<MealType, FoodEntryDTO[]>);
  }, [entries]);

  const mealTypeOrder: MealType[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
  const mealTypeLabels: Record<MealType, string> = {
    BREAKFAST: 'Breakfast',
    LUNCH: 'Lunch',
    DINNER: 'Dinner',
    SNACK: 'Snacks',
  };

  const closeModal = () => setModalState({ type: 'closed' });

  const handleAddSubmit = async (values: FoodEntryFormValues) => {
    const optimisticId = `temp-${Date.now()}`;
    const occurredAt = new Date().toISOString();
    const optimisticEntry: FoodEntryDTO = {
      id: optimisticId,
      name: values.name,
      calories: values.calories,
      mealType: values.mealType,
      occurredAt,
      createdAt: occurredAt,
    };
    const previousEntries = [...entries];

    setEntries((prev) => [...prev, optimisticEntry]);
    setIsSubmitting(true);

    try {
      const result = await createFoodEntry({
        ...values,
        occurredAt,
      });

      if (result.success && result.data) {
        const newEntry: FoodEntryDTO = {
          id: result.data.id,
          name: result.data.name,
          calories: result.data.calories,
          mealType: result.data.mealType,
          occurredAt: result.data.occurredAt.toISOString(),
          createdAt: result.data.createdAt.toISOString(),
        };

        setEntries((prev) =>
          prev.map((entry) => (entry.id === optimisticId ? newEntry : entry))
        );
        toast.success('Food entry added!');
        closeModal();
      } else {
        setEntries(previousEntries);
        toast.error(result.error || 'Failed to add food entry');
      }
    } catch (error) {
      setEntries(previousEntries);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (values: FoodEntryFormValues) => {
    if (modalState.type !== 'edit') return;

    setIsSubmitting(true);

    try {
      const result = await updateFoodEntry({
        id: modalState.entry.id,
        ...values,
        occurredAt: modalState.entry.occurredAt,
      });

      if (result.success && result.data) {
        const updatedEntry: FoodEntryDTO = {
          id: result.data.id,
          name: result.data.name,
          calories: result.data.calories,
          mealType: result.data.mealType,
          occurredAt: result.data.occurredAt.toISOString(),
          createdAt: result.data.createdAt.toISOString(),
        };

        setEntries((prev) =>
          prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
        );
        toast.success('Food entry updated!');
        closeModal();
      } else {
        toast.error(result.error || 'Failed to update food entry');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (modalState.type !== 'delete') return;

    setIsSubmitting(true);

    try {
      const result = await deleteFoodEntry(modalState.entry.id);

      if (result.success) {
        setEntries((prev) => prev.filter((entry) => entry.id !== modalState.entry.id));
        toast.success('Food entry deleted');
        closeModal();
      } else {
        toast.error(result.error || 'Failed to delete food entry');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Calorie Smart</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Track your daily food intake</p>
          </div>
          <Button onClick={() => setModalState({ type: 'add' })} className="gap-2 self-start">
            <Plus className="h-4 w-4" />
            Add Food
          </Button>
        </header>

        <section className="flex justify-center">
          <ProgressRing current={totalCalories} target={targetCalories} />
        </section>

        <section className="space-y-6">
          {mealTypeOrder.map((mealType) => {
            const mealEntries = entriesByMealType[mealType] ?? [];
            if (mealEntries.length === 0) return null;

            const mealCalories = mealEntries.reduce((sum, entry) => sum + entry.calories, 0);

            return (
              <div key={mealType} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {mealTypeLabels[mealType]}
                  </h2>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{mealCalories} cal</span>
                </div>
                <div className="space-y-2">
                  {mealEntries.map((entry) => (
                    <FoodEntryCard
                      key={entry.id}
                      entry={entry}
                      onEdit={(item) => setModalState({ type: 'edit', entry: item })}
                      onDelete={(item) => setModalState({ type: 'delete', entry: item })}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {entries.length === 0 && (
            <div className="rounded-lg border border-dashed border-zinc-200 py-12 text-center dark:border-zinc-800">
              <p className="text-zinc-500 dark:text-zinc-400">
                No food entries yet. Click "Add Food" to get started.
              </p>
            </div>
          )}
        </section>
      </div>

      <Dialog open={modalState.type === 'add'} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent onClose={closeModal}>
          <DialogHeader>
            <DialogTitle>Add food entry</DialogTitle>
          </DialogHeader>
          <FoodEntryForm
            onSubmit={handleAddSubmit}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
            submitLabel="Add food"
          />
        </DialogContent>
      </Dialog>

      {modalState.type === 'edit' && (
        <Dialog open onOpenChange={(open) => !open && closeModal()}>
          <DialogContent onClose={closeModal}>
            <DialogHeader>
              <DialogTitle>Edit food entry</DialogTitle>
            </DialogHeader>
            <FoodEntryForm
              defaultValues={{
                name: modalState.entry.name,
                calories: modalState.entry.calories,
                mealType: modalState.entry.mealType,
              }}
              onSubmit={handleEditSubmit}
              onCancel={closeModal}
              isSubmitting={isSubmitting}
              submitLabel="Update food"
            />
          </DialogContent>
        </Dialog>
      )}

      {modalState.type === 'delete' && (
        <Dialog open onOpenChange={(open) => !open && closeModal()}>
          <DialogContent onClose={closeModal}>
            <DialogHeader>
              <DialogTitle>Delete food entry</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{modalState.entry.name}"? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={closeModal} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
