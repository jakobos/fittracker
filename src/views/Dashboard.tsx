import React, { useState } from 'react';
import { useFitTracker } from '../context/FitTrackerContext';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Save, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Meal, Exercise } from '../types';
import { useToast } from '../context/ToastContext';

export function Dashboard() {
  const { state, addMealToDay, removeMealFromDay, addExerciseToDay, removeExerciseFromDay, logWeight, saveMealTemplate, saveExerciseTemplate } = useFitTracker();
  const { addToast } = useToast();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const dayData = state.dailyData[dateStr] || { weight: null, meals: [], exercises: [] };
  const { dailyGoal } = state.userSettings;

  const totalConsumed = dayData.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalBurned = dayData.exercises.reduce((sum, ex) => sum + ex.calories, 0);
  const netCalories = totalConsumed - totalBurned;
  
  const progressPercent = Math.min(Math.max((netCalories / dailyGoal) * 100, 0), 100);

  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [exName, setExName] = useState('');
  const [exCalories, setExCalories] = useState('');
  const [weightInput, setWeightInput] = useState('');

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName || !mealCalories) return;
    addMealToDay(dateStr, { name: mealName, calories: parseInt(mealCalories) });
    addToast('Meal added!');
    setMealName('');
    setMealCalories('');
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exName || !exCalories) return;
    addExerciseToDay(dateStr, { name: exName, calories: parseInt(exCalories) });
    addToast('Exercise added!');
    setExName('');
    setExCalories('');
  };

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightInput) return;
    logWeight(dateStr, parseFloat(weightInput));
    addToast('Weight logged!');
    setWeightInput('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Date Navigation */}
      <div className="flex justify-between items-center bg-surface border border-border-main p-4 rounded-[16px] shadow-sm mb-2">
        <div>
          <h2 className="text-xl font-extrabold">{format(currentDate, 'EEEE, MMM do')}</h2>
          <p className="text-text-dim text-sm">{format(currentDate, 'yyyy')}</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentDate(subDays(currentDate, 1))} className="text-text-dim hover:text-text-main transition-colors p-2 bg-surface-light rounded-lg border border-border-main">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-sm">Date</span>
          <button onClick={() => setCurrentDate(addDays(currentDate, 1))} className="text-text-dim hover:text-text-main transition-colors p-2 bg-surface-light rounded-lg border border-border-main">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-surface border border-border-main p-6 rounded-[16px] shadow-sm">
        <span className="text-[12px] uppercase tracking-[1px] text-text-dim font-bold mb-4 block">Bilans Kaloryczny</span>
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-3xl font-bold">
              <span className={netCalories > dailyGoal ? 'text-danger' : 'text-accent'}>{netCalories}</span> 
              <span className="text-text-dim text-sm font-normal tracking-normal border-l border-border-main pl-2 ml-2">/ {dailyGoal} kcal</span>
            </p>
          </div>
          <div className="text-right flex gap-4 text-sm">
            <div>
              <p className="text-[10px] text-text-dim uppercase tracking-wider font-bold">Intake</p>
              <p className="font-semibold">{totalConsumed}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-dim uppercase tracking-wider font-bold">Burned</p>
              <p className="font-semibold">{totalBurned}</p>
            </div>
          </div>
        </div>
        <div className="w-full bg-surface-light h-3 rounded-full overflow-hidden border border-border-main mt-4">
          <div 
            className={cn("h-full transition-all duration-500 rounded-full", netCalories > dailyGoal ? "bg-danger" : "bg-accent")}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Meals Section */}
        <div className="bg-surface border border-border-main p-6 rounded-[16px] shadow-sm flex flex-col">
          <span className="text-[12px] uppercase tracking-[1px] text-text-dim font-bold mb-5 flex justify-between items-center">
            Zjedzone Posiłki
            <span className="bg-surface-light px-2 py-1 rounded-md text-text-main font-semibold tracking-normal">{totalConsumed} kcal</span>
          </span>
          
          <ul className="space-y-0 flex-1 mb-4">
            {dayData.meals.map(meal => (
              <li key={meal.id} className="flex justify-between items-center border-b border-surface-light pb-3 mb-3 last:border-0 last:pb-0 last:mb-0 group">
                <div>
                  <p className="font-semibold text-sm">{meal.name}</p>
                  <p className="text-[11px] text-text-dim mt-0.5">Meal</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-semibold text-accent">{meal.calories} kcal</span>
                  <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { saveMealTemplate(meal); addToast('Saved as template!'); }} className="p-1.5 text-text-dim hover:text-accent rounded-lg" title="Save as template">
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeMealFromDay(dateStr, meal.id)} className="p-1.5 text-text-dim hover:text-danger rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {dayData.meals.length === 0 && <p className="text-sm text-text-dim text-center py-4">No meals added yet.</p>}
          </ul>

          <form onSubmit={handleAddMeal} className="flex gap-2 mt-auto pt-4 border-t border-surface-light">
            <input 
              type="text" 
              placeholder="Food name" 
              value={mealName} 
              onChange={e => setMealName(e.target.value)}
              className="flex-1 rounded-lg bg-surface-light border border-border-main p-2 outline-none focus:border-accent text-sm" 
            />
            <input 
              type="number" 
              placeholder="kcal" 
              value={mealCalories} 
              onChange={e => setMealCalories(e.target.value)}
              className="w-20 rounded-lg bg-surface-light border border-border-main p-2 outline-none focus:border-accent text-sm" 
            />
            <button type="submit" className="bg-accent text-bg-main p-2 rounded-lg hover:opacity-90 transition-opacity"><Plus className="w-5 h-5"/></button>
          </form>
        </div>

        {/* Exercises Section */}
        <div className="bg-surface border border-border-main p-6 rounded-[16px] shadow-sm flex flex-col">
          <span className="text-[12px] uppercase tracking-[1px] text-text-dim font-bold mb-5 flex justify-between items-center">
            Aktywność Fizyczna
            <span className="bg-surface-light px-2 py-1 rounded-md text-text-main font-semibold tracking-normal">{totalBurned} kcal</span>
          </span>
          
          <ul className="space-y-0 flex-1 mb-4">
            {dayData.exercises.map(ex => (
              <li key={ex.id} className="flex justify-between items-center border-b border-surface-light pb-3 mb-3 last:border-0 last:pb-0 last:mb-0 group">
                <div>
                  <p className="font-semibold text-sm">{ex.name}</p>
                  <p className="text-[11px] text-text-dim mt-0.5">Exercise</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-semibold text-danger">-{ex.calories} kcal</span>
                  <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { saveExerciseTemplate(ex); addToast('Saved as template!'); }} className="p-1.5 text-text-dim hover:text-accent rounded-lg" title="Save as template">
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeExerciseFromDay(dateStr, ex.id)} className="p-1.5 text-text-dim hover:text-danger rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
             {dayData.exercises.length === 0 && <p className="text-sm text-text-dim text-center py-4">No exercises logged yet.</p>}
          </ul>

          <form onSubmit={handleAddExercise} className="flex gap-2 mt-auto pt-4 border-t border-surface-light">
            <input 
              type="text" 
              placeholder="Exercise name" 
              value={exName} 
              onChange={e => setExName(e.target.value)}
              className="flex-1 rounded-lg bg-surface-light border border-border-main p-2 outline-none focus:border-accent text-sm" 
            />
            <input 
              type="number" 
              placeholder="kcal burn" 
              value={exCalories} 
              onChange={e => setExCalories(e.target.value)}
              className="w-24 rounded-lg bg-surface-light border border-border-main p-2 outline-none focus:border-accent text-sm" 
            />
            <button type="submit" className="bg-surface-light border border-border-main text-text-main hover:bg-accent hover:border-accent hover:text-bg-main p-2 rounded-lg transition-colors"><Plus className="w-5 h-5"/></button>
          </form>
        </div>
      </div>

       {/* Weight Monitor */}
       <div className="bg-surface border border-border-main p-6 rounded-[16px] shadow-sm mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[12px] uppercase tracking-[1px] text-text-dim font-bold block mb-1">Weight Monitor ({format(currentDate, 'MMM do')})</span>
            {dayData.weight ? (
              <p className="text-2xl font-bold">{dayData.weight} <span className="text-sm text-text-dim font-normal">kg</span></p>
            ) : (
              <p className="text-text-dim text-sm mt-1">No weight logged today.</p>
            )}
          </div>
          <form onSubmit={handleSaveWeight} className="flex gap-2 w-full md:w-auto">
            <input 
              type="number" 
              step="0.1"
              placeholder="Weight (kg)" 
              value={weightInput} 
              onChange={e => setWeightInput(e.target.value)}
              className="w-full md:w-32 rounded-lg bg-surface-light border border-border-main p-2 outline-none focus:border-accent text-sm" 
            />
            <button type="submit" className="bg-surface-light border border-border-main text-text-main px-4 py-2 rounded-lg font-bold hover:bg-accent hover:border-accent hover:text-bg-main transition-colors">Log</button>
          </form>
       </div>

    </div>
  );
}
