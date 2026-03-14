// src/components/NutritionSummary.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from './GlassCard';
import { 
  Flame, 
  Utensils, 
  Loader, 
  ChevronRight,
  Coffee,
  Sun,
  Moon,
  Apple,
  Clock,
  CheckCircle,
  Circle,
  XCircle
} from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';

const mealIcons = {
  Breakfast: <Coffee size={18} />,
  Lunch: <Sun size={18} />,
  Dinner: <Moon size={18} />,
  Snack: <Apple size={18} />
};

const mealColors = {
  Breakfast: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' },
  Lunch: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
  Dinner: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' },
  Snack: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }
};

const getStatusIcon = (status) => {
  switch(status) {
    case 'Completed':
      return <CheckCircle size={14} style={{ color: 'var(--theme-success)' }} />;
    case 'Missed':
      return <XCircle size={14} style={{ color: 'var(--theme-error)' }} />;
    default:
      return <Circle size={14} style={{ color: 'var(--theme-warning)' }} />;
  }
};

const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

const NutritionSummary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [nutritionData, setNutritionData] = useState([]);
  const [todayTotals, setTodayTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    meals: 0
  });

  // Default goals (can be made user-configurable later)
  const dailyGoals = {
    calories: 2200,
    protein: 120,
    carbs: 250,
    fats: 65
  };

  useEffect(() => {
    fetchTodayNutrition();
  }, []);

  const fetchTodayNutrition = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/nutrition');
      
      const allNutrition = response.data.nutritions || [];
      
      // Filter for today's entries
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayEntries = allNutrition.filter(entry => {
        const entryDate = new Date(entry.createdAt);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      });

      setNutritionData(todayEntries);
      
      // Calculate totals
      const totals = todayEntries.reduce((acc, entry) => ({
        calories: acc.calories + (entry.calories || 0),
        protein: acc.protein + (entry.protein || 0),
        carbs: acc.carbs + (entry.carbs || 0),
        fats: acc.fats + (entry.fats || 0),
        meals: acc.meals + 1
      }), { calories: 0, protein: 0, carbs: 0, fats: 0, meals: 0 });

      setTodayTotals(totals);
    } catch (error) {
      console.error('Error fetching nutrition:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    navigate('/nutrition');
  };

  const handleAddMeal = () => {
    navigate('/nutrition/create');
  };

  const caloriePercent = (todayTotals.calories / dailyGoals.calories) * 100;

  if (loading) {
    return (
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
            Nutrition Summary
          </h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <Loader className="animate-spin" size={24} style={{ color: 'var(--theme-primary)' }} />
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="overflow-hidden bounceIn">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
            Nutrition Summary
          </h3>
          <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>
            Today's intake • {todayTotals.meals} meals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddMeal}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            title="Add Meal"
          >
            <Utensils size={18} style={{ color: 'var(--theme-primary)' }} />
          </button>
          <button 
            onClick={handleViewAll}
            className="text-sm font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
            style={{ color: 'var(--theme-primary)' }}
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
      </div>
      
      {/* Calories Ring */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded-xl" style={{ background: 'var(--theme-inputBg)' }}>
        <div className="relative">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="var(--theme-inputBorder)"
              strokeWidth="8"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="var(--theme-primary)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${Math.min(caloriePercent * 2.2, 220)} 220`}
              style={{ filter: 'drop-shadow(0 0 8px var(--theme-primary))' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>
              {Math.min(caloriePercent, 100).toFixed(0)}%
            </span>
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
            {todayTotals.calories}
          </p>
          <p className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
            of {dailyGoals.calories} kcal
          </p>
          {todayTotals.calories > dailyGoals.calories && (
            <p className="text-xs mt-1" style={{ color: 'var(--theme-warning)' }}>
              +{todayTotals.calories - dailyGoals.calories} over goal
            </p>
          )}
        </div>
      </div>

      {/* Macros */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-sm font-medium" style={{ color: 'var(--theme-textSecondary)' }}>
              Protein
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
              {todayTotals.protein}g <span style={{ color: 'var(--theme-textMuted)' }}>/ {dailyGoals.protein}g</span>
            </span>
          </div>
          <div className="progress-bar h-2.5">
            <div 
              className="progress-bar-fill h-full rounded-full"
              style={{ 
                width: `${Math.min((todayTotals.protein / dailyGoals.protein) * 100, 100)}%`,
                background: '#3b82f6',
                boxShadow: '0 0 10px #3b82f640'
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-sm font-medium" style={{ color: 'var(--theme-textSecondary)' }}>
              Carbs
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
              {todayTotals.carbs}g <span style={{ color: 'var(--theme-textMuted)' }}>/ {dailyGoals.carbs}g</span>
            </span>
          </div>
          <div className="progress-bar h-2.5">
            <div 
              className="progress-bar-fill h-full rounded-full"
              style={{ 
                width: `${Math.min((todayTotals.carbs / dailyGoals.carbs) * 100, 100)}%`,
                background: '#10b981',
                boxShadow: '0 0 10px #10b98140'
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-sm font-medium" style={{ color: 'var(--theme-textSecondary)' }}>
              Fats
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
              {todayTotals.fats}g <span style={{ color: 'var(--theme-textMuted)' }}>/ {dailyGoals.fats}g</span>
            </span>
          </div>
          <div className="progress-bar h-2.5">
            <div 
              className="progress-bar-fill h-full rounded-full"
              style={{ 
                width: `${Math.min((todayTotals.fats / dailyGoals.fats) * 100, 100)}%`,
                background: '#f59e0b',
                boxShadow: '0 0 10px #f59e0b40'
              }}
            />
          </div>
        </div>
      </div>

      {/* Today's Meals */}
      {nutritionData.length > 0 ? (
        <div>
          <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--theme-textSecondary)' }}>
            Today's Meals
          </h4>
          <div className="space-y-2 max-h-48 md:max-h-64 overflow-y-auto custom-scrollbar pr-1">
            {nutritionData.map((meal) => (
              <div
                key={meal._id}
                onClick={() => navigate(`/nutrition/${meal._id}`)}
                className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all hover:bg-white/5"
                style={{ background: 'var(--theme-inputBg)' }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: mealColors[meal.mealType]?.bg || 'rgba(255,255,255,0.1)' }}
                  >
                    <span style={{ color: mealColors[meal.mealType]?.color || 'var(--theme-text)' }}>
                      {mealIcons[meal.mealType] || <Apple size={16} />}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>
                        {meal.foodItem}
                      </p>
                      {meal.status && getStatusIcon(meal.status)}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>
                      {meal.quantity ? `${meal.quantity}g • ` : ''}{meal.calories} kcal
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {meal.alertTime && (
                    <div className="flex items-center gap-1">
                      <Clock size={10} style={{ color: 'var(--theme-textMuted)' }} />
                      <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>
                        {getTimeAgo(meal.alertTime)}
                      </span>
                    </div>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                    background: mealColors[meal.mealType]?.bg || 'rgba(255,255,255,0.1)',
                    color: mealColors[meal.mealType]?.color || 'var(--theme-text)'
                  }}>
                    {meal.mealType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div 
          className="p-6 text-center rounded-xl"
          style={{ background: 'var(--theme-bgLight)' }}
        >
          <Utensils size={32} className="mx-auto mb-2" style={{ color: 'var(--theme-textMuted)' }} />
          <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>No meals logged today</p>
          <button
            onClick={handleAddMeal}
            className="mt-3 text-sm font-medium px-4 py-2 rounded-lg btn-primary"
          >
            Add Meal
          </button>
        </div>
      )}

      {/* Quick stats footer */}
      {nutritionData.length > 0 && (
        <div 
          className="mt-4 pt-3 flex items-center justify-between text-xs"
          style={{ borderTop: '1px solid var(--theme-border)' }}
        >
          <div className="flex items-center gap-4">
            <div>
              <span style={{ color: 'var(--theme-textMuted)' }}>Meals: </span>
              <span className="font-medium" style={{ color: 'var(--theme-text)' }}>
                {todayTotals.meals}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--theme-textMuted)' }}>Avg/meal: </span>
              <span className="font-medium" style={{ color: 'var(--theme-text)' }}>
                {todayTotals.meals > 0 ? Math.round(todayTotals.calories / todayTotals.meals) : 0} kcal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Flame size={12} style={{ color: 'var(--theme-primary)' }} />
            <span className="font-medium" style={{ color: 'var(--theme-primary)' }}>
              {todayTotals.protein + todayTotals.carbs + todayTotals.fats}g total
            </span>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default NutritionSummary;