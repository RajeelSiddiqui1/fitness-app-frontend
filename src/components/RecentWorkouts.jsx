// src/components/RecentWorkouts.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from './GlassCard';
import { 
  Clock, 
  Flame, 
  ChevronRight,
  Dumbbell,
  Loader,
  CheckCircle,
  XCircle,
  Circle
} from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';

const getIntensityFromWorkout = (workout) => {
  // Calculate intensity based on workout metrics
  if (workout.category === 'Cardio') {
    // For cardio, intensity might be based on duration
    if (workout.duration) {
      if (workout.duration > 60) return 'high';
      if (workout.duration > 30) return 'medium';
      return 'low';
    }
  } else if (workout.category === 'Strength') {
    // For strength, intensity might be based on weight and sets/reps
    if (workout.weight && workout.sets && workout.reps) {
      const totalVolume = workout.weight * workout.sets * workout.reps;
      if (totalVolume > 1000) return 'high';
      if (totalVolume > 500) return 'medium';
      return 'low';
    }
  }
  
  // Default intensity based on status
  switch(workout.status) {
    case 'Completed': return 'high';
    case 'Pending': return 'medium';
    case 'Missed': return 'low';
    default: return 'medium';
  }
};

const getCategoryIcon = (category) => {
  switch(category?.toLowerCase()) {
    case 'cardio':
      return '🏃';
    case 'strength':
      return '🏋️';
    case 'flexibility':
      return '🧘';
    default:
      return '💪';
  }
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
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 7) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

const calculateCalories = (workout) => {
  // Rough estimation of calories burned
  let calories = 0;
  
  if (workout.category === 'Cardio') {
    // Assume moderate intensity cardio burns ~8-10 calories per minute
    const duration = workout.duration || 30;
    calories = Math.round(duration * 9);
  } else if (workout.category === 'Strength') {
    // Strength training burns ~5-7 calories per minute
    const duration = workout.duration || 45;
    calories = Math.round(duration * 6);
  } else if (workout.category === 'Flexibility') {
    // Flexibility exercises burn ~3-4 calories per minute
    const duration = workout.duration || 30;
    calories = Math.round(duration * 3.5);
  }
  
  // Adjust based on sets/reps/weight if available
  if (workout.sets && workout.reps && workout.weight) {
    const volume = workout.sets * workout.reps * workout.weight;
    calories += Math.round(volume / 10);
  }
  
  return calories;
};

const intensityColors = {
  high: { 
    bg: 'rgba(239, 68, 68, 0.15)', 
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 100%)'
  },
  medium: { 
    bg: 'rgba(245, 158, 11, 0.15)', 
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.05) 100%)'
  },
  low: { 
    bg: 'rgba(16, 185, 129, 0.15)', 
    color: '#10b981',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.05) 100%)'
  },
};

const RecentWorkouts = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [measurementUnit, setMeasurementUnit] = useState('kg');

  useEffect(() => {
    fetchRecentWorkouts();
  }, []);

  const fetchRecentWorkouts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/workout');
      
      // Get the 5 most recent workouts (sorted by createdAt)
      const allWorkouts = response.data.workouts || [];
      const sorted = allWorkouts.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      const recent = sorted.slice(0, 5);
      
      setWorkouts(recent);
      setMeasurementUnit(response.data.measurementUnit || 'kg');
    } catch (error) {
      console.error('Error fetching workouts:', error);
      toast.error('Failed to load recent workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    navigate('/workout');
  };

  const handleWorkoutClick = (workoutId) => {
    navigate(`/workout/${workoutId}`);
  };

  if (loading) {
    return (
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
            Recent Workouts
          </h3>
        </div>
        <div className="h-48 flex items-center justify-center">
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
            Recent Workouts
          </h3>
          <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>
            Your latest activities
          </p>
        </div>
        <button 
          onClick={handleViewAll}
          className="text-sm font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all hover-scale duration-300"
          style={{ color: 'var(--theme-primary)' }}
        >
          View All <ChevronRight size={14} />
        </button>
      </div>
      
      {workouts.length === 0 ? (
        <div 
          className="p-8 text-center rounded-xl"
          style={{ background: 'var(--theme-bgLight)' }}
        >
          <Dumbbell size={32} className="mx-auto mb-2" style={{ color: 'var(--theme-textMuted)' }} />
          <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>No workouts yet</p>
          <button
            onClick={() => navigate('/workout/create')}
            className="mt-3 text-sm font-medium px-4 py-2 rounded-lg btn-primary"
          >
            Add Your First Workout
          </button>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 md:max-h-96 overflow-y-auto custom-scrollbar pr-1">
          {workouts.map((workout) => {
            const intensity = getIntensityFromWorkout(workout);
            const calories = calculateCalories(workout);
            
            return (
              <div 
                key={workout._id} 
                onClick={() => handleWorkoutClick(workout._id)}
                className="group relative overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                  style={{ 
                    background: intensityColors[intensity].gradient,
                  }}
                />
                
                {/* Main content */}
                <div 
                  className="relative flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer"
                  style={{ 
                    background: 'var(--theme-inputBg)',
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* Icon with intensity color */}
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: intensityColors[intensity].bg }}
                    >
                      <span className="text-xl">
                        {getCategoryIcon(workout.category)}
                      </span>
                    </div>
                    
                    {/* Workout info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm" style={{ color: 'var(--theme-text)' }}>
                          {workout.exrciseName}
                        </p>
                        {workout.status && (
                          <div className="flex items-center">
                            {getStatusIcon(workout.status)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>
                          {getTimeAgo(workout.createdAt)}
                        </p>
                        {workout.category && (
                          <>
                            <span style={{ color: 'var(--theme-textMuted)' }}>•</span>
                            <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>
                              {workout.category}
                            </p>
                          </>
                        )}
                      </div>
                      
                      {/* Workout details */}
                      <div className="flex items-center gap-3 mt-1.5">
                        {workout.sets && workout.reps && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium" style={{ color: 'var(--theme-primary)' }}>
                              {workout.sets}×{workout.reps}
                            </span>
                          </div>
                        )}
                        {workout.weight > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs" style={{ color: 'var(--theme-textSecondary)' }}>
                              {workout.weight} {measurementUnit}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Duration and calories */}
                  <div className="flex items-center gap-3">
                    {workout.alertTime && (
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} style={{ color: 'var(--theme-textMuted)' }} />
                        <span className="text-xs" style={{ color: 'var(--theme-textSecondary)' }}>
                          {new Date(workout.alertTime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    )}
                    <div 
                      className="px-2 py-1 rounded-lg text-right"
                      style={{ background: intensityColors[intensity].bg }}
                    >
                      <span 
                        className="text-xs font-semibold"
                        style={{ color: intensityColors[intensity].color }}
                      >
                        {calories} kcal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Quick stats footer */}
      {workouts.length > 0 && (
        <div 
          className="mt-4 pt-3 flex items-center justify-between text-xs"
          style={{ borderTop: '1px solid var(--theme-border)' }}
        >
          <div className="flex items-center gap-4">
            <div>
              <span style={{ color: 'var(--theme-textMuted)' }}>Total: </span>
              <span className="font-medium" style={{ color: 'var(--theme-text)' }}>
                {workouts.length} recent
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--theme-textMuted)' }}>Unit: </span>
              <span className="font-medium" style={{ color: 'var(--theme-text)' }}>
                {measurementUnit}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Flame size={12} style={{ color: 'var(--theme-primary)' }} />
            <span className="font-medium" style={{ color: 'var(--theme-primary)' }}>
              {workouts.reduce((sum, w) => sum + calculateCalories(w), 0)} kcal total
            </span>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default RecentWorkouts;