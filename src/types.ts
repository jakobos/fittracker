export type Meal = { id: string; name: string; calories: number };
export type Exercise = { id: string; name: string; calories: number };

export type DailyRecord = {
  weight: number | null;
  meals: Meal[];
  exercises: Exercise[];
};

export type UserSettings = {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activityLevel: number;
  dailyGoal: number;
  hasOnboarded: boolean;
};

export type Templates = {
  meals: Meal[];
  exercises: Exercise[];
};

export type FitTrackerState = {
  userSettings: UserSettings;
  templates: Templates;
  dailyData: Record<string, DailyRecord>;
};
