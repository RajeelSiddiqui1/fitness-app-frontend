// src/pages/achievements/Achievements.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Utensils,
  Dumbbell,
  ChevronLeft,
  Calendar,
  Users,
  Eye,
  Trophy,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../../components/GlassCard';
import AchievementCard from './components/AchievementCard';
import { axiosInstance } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

const Achievements = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nutritions, setNutritions] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [myNutritions, setMyNutritions] = useState([]);
  const [myWorkouts, setMyWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-achievements'); // 'my-achievements', 'workouts' or 'nutritions'
  const [searchTerm, setSearchTerm] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState('kg');
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalNutritions: 0,
    avgWorkoutWeight: 0,
    avgNutritionCalories: 0,
    totalLikes: 0,
    totalComments: 0
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      
      // Fetch my achievements (creator's own)
      const myAchievementsResponse = await axiosInstance.get('/user-daily-routine/my-achievements');
      const myData = myAchievementsResponse.data;
      setMyWorkouts(myData.workouts || []);
      setMyNutritions(myData.nutritions || []);
      setMeasurementUnit(myData.measurementUnit || 'kg');
      
      // Fetch public workouts
      const workoutResponse = await axiosInstance.get('/user-daily-routine/workout');
      const workoutData = workoutResponse.data;
      setWorkouts(workoutData.workouts || []);
      
      // Fetch public nutritions
      const nutritionResponse = await axiosInstance.get('/user-daily-routine/nutrition');
      setNutritions(nutritionResponse.data || []);
      
      // Calculate stats for my achievements
      const totalMyWorkouts = myData.workouts?.length || 0;
      const totalMyNutritions = myData.nutritions?.length || 0;
      
      const totalWeight = myData.workouts?.reduce((sum, w) => sum + (w.weight || 0), 0) || 0;
      const avgWorkoutWeight = totalMyWorkouts > 0 ? (totalWeight / totalMyWorkouts).toFixed(1) : 0;
      
      const totalCalories = myData.nutritions?.reduce((sum, n) => sum + (n.calories || 0), 0) || 0;
      const avgNutritionCalories = totalMyNutritions > 0 ? Math.round(totalCalories / totalMyNutritions) : 0;

      // Calculate engagement stats
      const totalLikes = (myData.workouts?.reduce((sum, w) => sum + (w.likes || 0), 0) || 0) + 
                        (myData.nutritions?.reduce((sum, n) => sum + (n.likes || 0), 0) || 0);
      const totalComments = (myData.workouts?.reduce((sum, w) => sum + (w.comments || 0), 0) || 0) + 
                           (myData.nutritions?.reduce((sum, n) => sum + (n.comments || 0), 0) || 0);
      
      setStats({
        totalWorkouts: totalMyWorkouts,
        totalNutritions: totalMyNutritions,
        avgWorkoutWeight,
        avgNutritionCalories,
        totalLikes,
        totalComments
      });
      
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  // Filter workouts based on search
  const filteredWorkouts = workouts.filter(workout => 
    workout.exrciseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter nutritions based on search
  const filteredNutritions = nutritions.filter(nutrition =>
    nutrition.foodItem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nutrition.mealType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter my achievements
  const filteredMyWorkouts = myWorkouts.filter(workout => {
    if (!searchTerm) return true; // Show all when no search
    return workout.exrciseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.notes?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredMyNutritions = myNutritions.filter(nutrition => {
    if (!searchTerm) return true; // Show all when no search
    return nutrition.foodItem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nutrition.mealType?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--theme-bg)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: 'var(--theme-bg)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:justify-between mb-4 md:mb-6 gap-4">
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-white/5 transition-colors"
              style={{ color: 'var(--theme-textSecondary)' }}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold gradient-text">Achievements</h1>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('my-achievements')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all flex-1 md:flex-initial justify-center ${
                activeTab === 'my-achievements' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={{ color: activeTab === 'my-achievements' ? 'white' : 'var(--theme-text)' }}
            >
              <Trophy size={18} />
              <span>My Achievements</span>
            </button>
            <button
              onClick={() => setActiveTab('workouts')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all flex-1 md:flex-initial justify-center ${
                activeTab === 'workouts' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={{ color: activeTab === 'workouts' ? 'white' : 'var(--theme-text)' }}
            >
              <Dumbbell size={18} />
              <span>Community</span>
            </button>
            <button
              onClick={() => setActiveTab('nutritions')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all flex-1 md:flex-initial justify-center ${
                activeTab === 'nutritions' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={{ color: activeTab === 'nutritions' ? 'white' : 'var(--theme-text)' }}
            >
              <Utensils size={18} />
              <span>Nutrition</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Show for My Achievements tab */}
        {activeTab === 'my-achievements' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4 mb-4 md:mb-6">
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Workouts</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>{stats.totalWorkouts}</p>
                </div>
                <Dumbbell size={32} style={{ color: 'var(--theme-primary)', opacity: 0.5 }} />
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Nutrition</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>{stats.totalNutritions}</p>
                </div>
                <Utensils size={32} style={{ color: 'var(--theme-success)', opacity: 0.5 }} />
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Avg Weight</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
                    {stats.avgWorkoutWeight} {measurementUnit}
                  </p>
                </div>
                <Eye size={32} style={{ color: 'var(--theme-warning)', opacity: 0.5 }} />
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Avg Calories</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
                    {stats.avgNutritionCalories} kcal
                  </p>
                </div>
                <Users size={32} style={{ color: 'var(--theme-primary)', opacity: 0.5 }} />
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Total Likes</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>{stats.totalLikes}</p>
                </div>
                <Star size={32} style={{ color: 'var(--theme-error)', opacity: 0.5 }} />
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Comments</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>{stats.totalComments}</p>
                </div>
                <Calendar size={32} style={{ color: 'var(--theme-info)', opacity: 0.5 }} />
              </div>
            </GlassCard>
          </div>
        )}

        {/* Search */}
        <GlassCard className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--theme-textMuted)' }} />
            <input
              type="text"
              placeholder={activeTab === 'my-achievements' 
                ? 'Search your achievements...' 
                : `Search ${activeTab === 'workouts' ? 'workouts...' : 'nutrition entries...'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="theme-input w-full pl-10 pr-4 py-2"
            />
          </div>
        </GlassCard>

        {/* Content */}
        {activeTab === 'my-achievements' ? (
          // My Achievements Section
          <div className="space-y-6">
            {/* My Workouts */}
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center space-x-2" style={{ color: 'var(--theme-text)' }}>
                <Dumbbell size={20} />
                <span>My Workouts ({filteredMyWorkouts.length})</span>
              </h2>
              {filteredMyWorkouts.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <Dumbbell size={40} className="mx-auto mb-3" style={{ color: 'var(--theme-textMuted)' }} />
                  <p style={{ color: 'var(--theme-textSecondary)' }}>No workouts found</p>
                </GlassCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMyWorkouts.map(workout => (
                    <AchievementCard
                      key={workout._id}
                      item={workout}
                      type="workout"
                      measurementUnit={measurementUnit}
                      isOwner={true}
                      showEngagement={true}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* My Nutritions */}
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center space-x-2" style={{ color: 'var(--theme-text)' }}>
                <Utensils size={20} />
                <span>My Nutrition ({filteredMyNutritions.length})</span>
              </h2>
              {filteredMyNutritions.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <Utensils size={40} className="mx-auto mb-3" style={{ color: 'var(--theme-textMuted)' }} />
                  <p style={{ color: 'var(--theme-textSecondary)' }}>No nutrition entries found</p>
                </GlassCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMyNutritions.map(nutrition => (
                    <AchievementCard
                      key={nutrition._id}
                      item={nutrition}
                      type="nutrition"
                      isOwner={true}
                      showEngagement={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'workouts' ? (
          // Workouts Section
          filteredWorkouts.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Dumbbell size={48} className="mx-auto mb-4" style={{ color: 'var(--theme-textMuted)' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>No workouts found</h3>
              <p className="mb-4" style={{ color: 'var(--theme-textSecondary)' }}>
                {searchTerm ? 'Try adjusting your search' : 'No public workouts available yet'}
              </p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWorkouts.map(workout => (
                <AchievementCard
                  key={workout._id}
                  item={workout}
                  type="workout"
                  measurementUnit={measurementUnit}
                  isOwner={workout.isOwner}
                />
              ))}
            </div>
          )
        ) : (
          // Nutritions Section
          filteredNutritions.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Utensils size={48} className="mx-auto mb-4" style={{ color: 'var(--theme-textMuted)' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>No nutrition entries found</h3>
              <p className="mb-4" style={{ color: 'var(--theme-textSecondary)' }}>
                {searchTerm ? 'Try adjusting your search' : 'No public nutrition entries available yet'}
              </p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNutritions.map(nutrition => (
                <AchievementCard
                  key={nutrition._id}
                  item={nutrition}
                  type="nutrition"
                  isOwner={nutrition.isOwner}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Achievements;