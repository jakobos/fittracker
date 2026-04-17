import React, { useState, useEffect } from 'react';
import { useFitTracker } from '../context/FitTrackerContext';
import { cn } from '../lib/utils';

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { state, updateSettings } = useFitTracker();
  const [formData, setFormData] = useState(state.userSettings);

  const calculateTDEE = (data: typeof formData) => {
    let bmr = 0;
    if (data.gender === 'male') {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
    } else {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
    }
    return Math.round(bmr * data.activityLevel);
  };

  const [tdee, setTdee] = useState(() => calculateTDEE(formData));

  useEffect(() => {
    setTdee(calculateTDEE(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = (name === 'gender') ? value : parseFloat(value);
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ ...formData, hasOnboarded: true });
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-main text-text-main">
      <div className="max-w-md w-full bg-surface border border-border-main rounded-[16px] shadow-2xl p-8">
        <h1 className="text-2xl font-extrabold text-center mb-2">Welcome to FitTracker</h1>
        <p className="text-sm text-text-dim mb-8 text-center">Let's set up your profile to calculate your calorie needs.</p>
        
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-text-dim uppercase tracking-wider mb-2">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full rounded-lg bg-surface-light border border-border-main text-text-main p-3 outline-none focus:border-accent text-sm transition-colors">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-text-dim uppercase tracking-wider mb-2">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full rounded-lg bg-surface-light border border-border-main text-text-main p-3 outline-none focus:border-accent text-sm transition-colors" required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-text-dim uppercase tracking-wider mb-2">Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full rounded-lg bg-surface-light border border-border-main text-text-main p-3 outline-none focus:border-accent text-sm transition-colors" required />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-text-dim uppercase tracking-wider mb-2">Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full rounded-lg bg-surface-light border border-border-main text-text-main p-3 outline-none focus:border-accent text-sm transition-colors" required />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-text-dim uppercase tracking-wider mb-2">Activity Level (PAL)</label>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full rounded-lg bg-surface-light border border-border-main text-text-main p-3 outline-none focus:border-accent text-sm transition-colors">
              <option value="1.2">Sedentary (1.2)</option>
              <option value="1.375">Lightly Active (1.375)</option>
              <option value="1.55">Moderately Active (1.55)</option>
              <option value="1.725">Very Active (1.725)</option>
              <option value="1.9">Extra Active (1.9)</option>
            </select>
          </div>

          <div className="bg-surface-light border border-border-main p-4 rounded-xl text-center my-6">
            <div className="text-[11px] text-text-dim uppercase tracking-wider font-bold mb-1">Estimated TDEE (Maintenance)</div>
            <div className="text-2xl font-extrabold text-accent">{tdee} kcal</div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-text-dim uppercase tracking-wider mb-2">Daily Calorie Goal</label>
            <input type="number" name="dailyGoal" value={formData.dailyGoal || tdee} onChange={handleChange} className="w-full rounded-lg bg-surface-light border border-border-main text-text-main p-3 outline-none focus:border-accent text-sm transition-colors" required />
            <p className="text-xs text-text-dim mt-2">Set below your TDEE for weight loss.</p>
          </div>

          <button type="submit" className="w-full bg-accent text-bg-main font-extrabold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity mt-2">
            Save Profile & Continue
          </button>
        </form>
      </div>
    </div>
  );
}

