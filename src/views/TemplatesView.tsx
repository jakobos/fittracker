import React from 'react';
import { useFitTracker } from '../context/FitTrackerContext';
import { useToast } from '../context/ToastContext';
import { format } from 'date-fns';
import { Trash2, Plus } from 'lucide-react';

export function TemplatesView() {
  const { state, addMealToDay, addExerciseToDay, removeMealTemplate, removeExerciseTemplate } = useFitTracker();
  const { addToast } = useToast();
  const dateStr = format(new Date(), 'yyyy-MM-dd');

  const { meals, exercises } = state.templates;

  const handleAddMeal = (meal: any) => {
    addMealToDay(dateStr, { name: meal.name, calories: meal.calories });
    addToast('Meal template added to today!');
  };

  const handleAddExercise = (ex: any) => {
    addExerciseToDay(dateStr, { name: ex.name, calories: ex.calories });
    addToast('Exercise template added to today!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-surface border border-border-main p-6 rounded-[16px] shadow-sm">
        <h2 className="text-xl font-extrabold mb-2">Saved Templates</h2>
        <p className="text-text-dim text-sm mb-6">Quickly add frequently used meals or exercises to today's log.</p>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="flex flex-col">
            <h3 className="text-[12px] uppercase tracking-[1px] text-text-dim font-bold mb-5 flex justify-between items-center pb-2 border-b border-surface-light">Meals</h3>
            <ul className="space-y-0">
              {meals.map(meal => (
                <li key={meal.id} className="flex justify-between items-center border-b border-surface-light pb-3 mb-3 last:border-0 last:pb-0 last:mb-0 group">
                  <div>
                    <p className="font-semibold text-sm">{meal.name}</p>
                    <p className="text-[11px] text-text-dim mt-0.5">{meal.calories} kcal</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAddMeal(meal)} className="flex items-center gap-1 text-[11px] font-bold tracking-wide border border-border-main bg-surface-light text-text-dim px-3 py-1.5 rounded-[20px] hover:text-accent hover:border-accent transition-colors">
                      <Plus className="w-3 h-3" /> ADD
                    </button>
                    <button onClick={() => removeMealTemplate(meal.id)} className="p-1.5 text-text-dim hover:text-danger rounded-lg transition-colors md:opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
              {meals.length === 0 && <p className="text-sm text-text-dim text-center py-4">No meal templates saved.</p>}
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="text-[12px] uppercase tracking-[1px] text-text-dim font-bold mb-5 flex justify-between items-center pb-2 border-b border-surface-light">Exercises</h3>
            <ul className="space-y-0">
              {exercises.map(ex => (
                <li key={ex.id} className="flex justify-between items-center border-b border-surface-light pb-3 mb-3 last:border-0 last:pb-0 last:mb-0 group">
                  <div>
                    <p className="font-semibold text-sm">{ex.name}</p>
                    <p className="text-[11px] text-text-dim mt-0.5">{ex.calories} kcal</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAddExercise(ex)} className="flex items-center gap-1 text-[11px] font-bold tracking-wide border border-border-main bg-surface-light text-text-dim px-3 py-1.5 rounded-[20px] hover:text-accent hover:border-accent transition-colors">
                      <Plus className="w-3 h-3" /> ADD
                    </button>
                    <button onClick={() => removeExerciseTemplate(ex.id)} className="p-1.5 text-text-dim hover:text-danger rounded-lg transition-colors md:opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
              {exercises.length === 0 && <p className="text-sm text-text-dim text-center py-4">No exercise templates saved.</p>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
