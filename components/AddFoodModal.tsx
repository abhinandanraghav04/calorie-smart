import React, { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from './ToastProvider';
import type { FoodSuggestion } from '@/types/food';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (food: { name: string; calories: number; portion: number }) => void;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  onAddFood,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState<string>('');
  const [portion, setPortion] = useState<string>('100');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { addToast } = useToast();

  const fetchSuggestions = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          q: trimmedQuery,
          pageSize: '10',
        });
        const response = await fetch(`/api/food/search?${params.toString()}`);

        let payload: { items?: FoodSuggestion[]; error?: string } | null = null;
        try {
          payload = await response.json();
        } catch (parseError) {
          payload = null;
        }

        if (!response.ok) {
          const message =
            payload && typeof payload.error === 'string'
              ? payload.error
              : 'Failed to fetch suggestions';
          throw new Error(message);
        }

        const items = Array.isArray(payload?.items) ? payload?.items ?? [] : [];

        setSuggestions(items);
      } catch (error) {
        console.error('Food suggestion lookup failed');
        addToast(
          error instanceof Error ? error.message : 'Failed to search for foods',
          'error'
        );
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [addToast]
  );

  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchSuggestions(debouncedSearchQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchQuery, fetchSuggestions]);

  const handleSelectSuggestion = (food: FoodSuggestion) => {
    const displayName = food.brand ? `${food.description} (${food.brand})` : food.description;
    setFoodName(displayName);
    if (food.calories != null) {
      setCalories(food.calories.toString());
    } else {
      setCalories('');
    }
    setSearchQuery('');
    setSuggestions([]);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const caloriesNum = parseFloat(calories);
    const portionNum = parseFloat(portion);

    if (!foodName.trim()) {
      addToast('Please enter a food name', 'error');
      return;
    }

    if (isNaN(caloriesNum) || caloriesNum < 0) {
      addToast('Please enter valid calories', 'error');
      return;
    }

    if (isNaN(portionNum) || portionNum <= 0) {
      addToast('Please enter a valid portion size', 'error');
      return;
    }

    onAddFood({
      name: foodName,
      calories: caloriesNum,
      portion: portionNum,
    });

    setSearchQuery('');
    setFoodName('');
    setCalories('');
    setPortion('100');
    addToast('Food added successfully!', 'success');
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setFoodName('');
    setCalories('');
    setPortion('100');
    setSuggestions([]);
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Food</h2>
          <button className="close-button" onClick={handleClose} aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="search">Search Food Database:</label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a food..."
              className="form-input"
              autoComplete="off"
            />
            {isLoading && <div className="loading-indicator">Searching...</div>}
            {suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    className="suggestion-item"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    <div className="suggestion-name">
                      {suggestion.description}
                      {suggestion.brand && (
                        <span className="suggestion-brand"> - {suggestion.brand}</span>
                      )}
                    </div>
                    {suggestion.calories && (
                      <div className="suggestion-calories">
                        {suggestion.calories} kcal/100g
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="foodName">Food Name:</label>
            <input
              id="foodName"
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Enter food name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="calories">Calories (kcal):</label>
            <input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Enter calories"
              className="form-input"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="portion">Portion Size (g):</label>
            <input
              id="portion"
              type="number"
              value={portion}
              onChange={(e) => setPortion(e.target.value)}
              placeholder="Enter portion size"
              className="form-input"
              min="1"
              step="1"
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="button button-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="button button-primary">
              Add Food
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
