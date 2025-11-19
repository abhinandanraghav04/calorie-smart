'use client';

import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FoodEntryDTO } from '@/types/food';

interface FoodEntryCardProps {
  entry: FoodEntryDTO;
  onEdit: (entry: FoodEntryDTO) => void;
  onDelete: (entry: FoodEntryDTO) => void;
}

export function FoodEntryCard({ entry, onEdit, onDelete }: FoodEntryCardProps) {
  const time = new Date(entry.occurredAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow"
    >
      <div className="flex-1">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{entry.name}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{time}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right mr-2">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{entry.calories}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">cal</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(entry)}
          className="h-8 w-8"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(entry)}
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          aria-label={`Delete ${entry.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
