import React, { useState } from 'react';
import { AddFoodModal } from '@/components/AddFoodModal';

interface FoodItem {
  name: string;
  calories: number;
  portion: number;
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foods, setFoods] = useState<FoodItem[]>([]);

  const handleAddFood = (food: FoodItem) => {
    setFoods((current) => [...current, food]);
  };

  const totalCalories = foods.reduce((total, food) => total + food.calories, 0);

  return (
    <div className="page-wrapper">
      <div className="card">
        <h1>Calorie Smart</h1>
        <p>Search for foods, add them to your daily log, and track your calories effortlessly.</p>

        <button className="button button-primary" onClick={() => setIsModalOpen(true)}>
          Add Food
        </button>

        {foods.length > 0 && (
          <div className="food-log">
            <h2>Today's entries</h2>
            <ul>
              {foods.map((food, index) => (
                <li key={`${food.name}-${index}`}>
                  <span>{food.name}</span>
                  <span>{food.calories} kcal</span>
                </li>
              ))}
            </ul>
            <div className="total-calories">
              <strong>Total:</strong> {totalCalories} kcal
            </div>
          </div>
        )}
      </div>

      <AddFoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddFood={handleAddFood}
      />
    </div>
  );
}
