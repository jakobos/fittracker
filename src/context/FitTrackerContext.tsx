import React, { createContext, useContext, useState, useEffect } from 'react';
import { FitTrackerState, Meal, Exercise, UserSettings } from '../types';

const defaultSettings: UserSettings = {
  age: 30,
  weight: 70,
  height: 170,
  gender: 'male',
  activityLevel: 1.2,
  dailyGoal: 2000,
  hasOnboarded: false,
};

const defaultState: FitTrackerState = {
  userSettings: defaultSettings,
  templates: { meals: [], exercises: [] },
  dailyData: {}
};

type FitTrackerContextType = {
  state: FitTrackerState;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addMealToDay: (date: string, meal: Omit<Meal, 'id'>) => void;
  removeMealFromDay: (date: string, mealId: string) => void;
  addExerciseToDay: (date: string, exercise: Omit<Exercise, 'id'>) => void;
  removeExerciseFromDay: (date: string, exerciseId: string) => void;
  logWeight: (date: string, weight: number) => void;
  saveMealTemplate: (meal: Omit<Meal, 'id'>) => void;
  removeMealTemplate: (id: string) => void;
  saveExerciseTemplate: (exercise: Omit<Exercise, 'id'>) => void;
  removeExerciseTemplate: (id: string) => void;
};

const FitTrackerContext = createContext<FitTrackerContextType | undefined>(undefined);

export const useFitTracker = () => {
  const context = useContext(FitTrackerContext);
  if (!context) throw new Error('useFitTracker must be used within Provider');
  return context;
};

export const FitTrackerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, setState] = useState<FitTrackerState>(() => {
    const saved = localStorage.getItem('fitTrackerData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('fitTrackerData', JSON.stringify(state));
  }, [state]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setState(s => ({ ...s, userSettings: { ...s.userSettings, ...newSettings }}));
  };

  const addMealToDay = (date: string, meal: Omit<Meal, 'id'>) => {
    setState(s => {
      const day = s.dailyData[date] || { weight: null, meals: [], exercises: [] };
      return {
        ...s,
        dailyData: {
          ...s.dailyData,
          [date]: { ...day, meals: [...day.meals, { ...meal, id: generateId() }] }
        }
      };
    });
  };

  const removeMealFromDay = (date: string, mealId: string) => {
    setState(s => {
      const day = s.dailyData[date];
      if (!day) return s;
      return {
        ...s,
        dailyData: {
          ...s.dailyData,
          [date]: { ...day, meals: day.meals.filter(m => m.id !== mealId) }
        }
      };
    });
  };

  const addExerciseToDay = (date: string, exercise: Omit<Exercise, 'id'>) => {
    setState(s => {
      const day = s.dailyData[date] || { weight: null, meals: [], exercises: [] };
      return {
        ...s,
        dailyData: {
          ...s.dailyData,
          [date]: { ...day, exercises: [...day.exercises, { ...exercise, id: generateId() }] }
        }
      };
    });
  };

  const removeExerciseFromDay = (date: string, exerciseId: string) => {
    setState(s => {
      const day = s.dailyData[date];
      if (!day) return s;
      return {
        ...s,
        dailyData: {
          ...s.dailyData,
          [date]: { ...day, exercises: day.exercises.filter(e => e.id !== exerciseId) }
        }
      };
    });
  };

  const logWeight = (date: string, weight: number) => {
    setState(s => {
      const day = s.dailyData[date] || { weight: null, meals: [], exercises: [] };
      return {
        ...s,
        dailyData: {
          ...s.dailyData,
          [date]: { ...day, weight }
        }
      };
    });
  };

  const saveMealTemplate = (meal: Omit<Meal, 'id'>) => {
    setState(s => ({
      ...s,
      templates: { ...s.templates, meals: [...s.templates.meals, { ...meal, id: generateId() }] }
    }));
  };

  const removeMealTemplate = (id: string) => {
    setState(s => ({
      ...s,
      templates: { ...s.templates, meals: s.templates.meals.filter(m => m.id !== id) }
    }));
  };

  const saveExerciseTemplate = (exercise: Omit<Exercise, 'id'>) => {
    setState(s => ({
      ...s,
      templates: { ...s.templates, exercises: [...s.templates.exercises, { ...exercise, id: generateId() }] }
    }));
  };

  const removeExerciseTemplate = (id: string) => {
    setState(s => ({
      ...s,
      templates: { ...s.templates, exercises: s.templates.exercises.filter(e => e.id !== id) }
    }));
  };

  return (
    <FitTrackerContext.Provider value={{
      state, updateSettings, addMealToDay, removeMealFromDay,
      addExerciseToDay, removeExerciseFromDay, logWeight,
      saveMealTemplate, removeMealTemplate, saveExerciseTemplate, removeExerciseTemplate
    }}>
      {children}
    </FitTrackerContext.Provider>
  );
};
