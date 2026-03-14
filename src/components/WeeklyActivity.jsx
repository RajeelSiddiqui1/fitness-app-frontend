import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import GlassCard from './GlassCard';

const activityData = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 60 },
  { day: 'Wed', minutes: 30 },
  { day: 'Thu', minutes: 75 },
  { day: 'Fri', minutes: 50 },
  { day: 'Sat', minutes: 90 },
  { day: 'Sun', minutes: 40 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="glass-card p-3"
        style={{ 
          border: '1px solid var(--theme-cardBorder)',
          boxShadow: 'var(--theme-shadow)'
        }}
      >
        <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{label}</p>
        <p className="text-sm" style={{ color: 'var(--theme-accent)' }}>
          {payload[0].value} minutes
        </p>
      </div>
    );
  }
  return null;
};

const WeeklyActivity = () => {
  const totalMinutes = activityData.reduce((acc, curr) => acc + curr.minutes, 0);
  const avgMinutes = Math.round(totalMinutes / 7);

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
            Weekly Activity
          </h3>
          <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>
            {totalMinutes} min total
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>{avgMinutes}</p>
          <p className="text-xs" style={{ color: 'var(--theme-textSecondary)' }}>avg min/day</p>
        </div>
      </div>
      
      <div className="h-40 md:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--theme-divider)" 
              vertical={false}
            />
            <XAxis 
              dataKey="day" 
              stroke="var(--theme-textMuted)"
              tick={{ fill: 'var(--theme-textMuted)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--theme-divider)' }}
            />
            <YAxis 
              stroke="var(--theme-textMuted)"
              tick={{ fill: 'var(--theme-textMuted)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--theme-divider)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="minutes" 
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            >
              {activityData.map((entry, index) => {
                const isToday = index === new Date().getDay() - 1;
                return (
                  <Cell 
                    key={`cell-${index}`}
                    fill={isToday ? 'var(--theme-primary)' : 'var(--theme-accent)'}
                    fillOpacity={isToday ? 1 : 0.6}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

export default WeeklyActivity;
