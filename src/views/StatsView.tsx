import React, { useMemo } from 'react';
import { useFitTracker } from '../context/FitTrackerContext';
import { format, subDays } from 'date-fns';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend, ReferenceLine
} from 'recharts';

export function StatsView() {
  const { state } = useFitTracker();
  const { dailyGoal } = state.userSettings;

  const chartData = useMemo(() => {
    const data = [];
    // Last 14 days
    for (let i = 13; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const dayRecord = state.dailyData[dateStr];
      
      let net = 0;
      let consumed = 0;
      let burned = 0;
      let weight = null;

      if (dayRecord) {
        consumed = dayRecord.meals.reduce((sum, m) => sum + m.calories, 0);
        burned = dayRecord.exercises.reduce((sum, e) => sum + e.calories, 0);
        net = consumed - burned;
        weight = dayRecord.weight;
      }

      data.push({
        date: format(d, 'MMM dd'),
        netCalories: net,
        consumed,
        burned,
        weight,
        goal: dailyGoal,
      });
    }
    return data;
  }, [state.dailyData, dailyGoal]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold">Statistics</h2>
          <p className="text-text-dim text-sm">Last 14 Days</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calories Chart */}
        <div className="bg-surface border border-border-main p-6 rounded-[16px]">
          <span className="text-[12px] uppercase tracking-[1px] text-text-dim font-bold mb-6 block">Net Calories vs Goal</span>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D3139" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#94A3B8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#94A3B8'}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#21242B', border: '1px solid #2D3139', borderRadius: '8px', color: '#F0F2F5' }}
                  itemStyle={{ color: '#F0F2F5' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
                <ReferenceLine y={dailyGoal} stroke="#FF5A5A" strokeDasharray="3 3" label={{ position: 'top', value: 'Goal', fill: '#FF5A5A', fontSize: 10, fontWeight: 700 }} />
                <Bar dataKey="netCalories" name="Net Calories" fill="#3DFFB4" radius={[4, 4, 0, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="bg-surface border border-border-main p-6 rounded-[16px]">
          <span className="text-[12px] uppercase tracking-[1px] text-text-dim font-bold mb-6 block">Weight Trend</span>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D3139" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#94A3B8'}} axisLine={false} tickLine={false} />
                <YAxis domain={['auto', 'auto']} tick={{fontSize: 12, fill: '#94A3B8'}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                   contentStyle={{ backgroundColor: '#21242B', border: '1px solid #2D3139', borderRadius: '8px', color: '#F0F2F5' }}
                   itemStyle={{ color: '#F0F2F5' }}
                 />
                <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#3DFFB4" strokeWidth={3} connectNulls dot={{ r: 4, fill: '#16181D', strokeWidth: 2, stroke: '#3DFFB4' }} activeDot={{ r: 6, fill: '#3DFFB4' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-text-dim text-center mt-4">Points with no logged weight are connected continuously.</p>
        </div>
      </div>
    </div>
  );
}
