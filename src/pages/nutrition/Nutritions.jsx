// src/pages/nutrition/Nutritions.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Apple,
  TrendingUp,
  Clock,
  ChevronLeft,
  CheckCircle,
  Coffee,
  Beef,
  Cookie,
  Flame
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../../components/GlassCard';
import NutritionCard from './components/NutritionCard';
import { axiosInstance } from '../../lib/axios';

const Nutritions = () => {
  const navigate = useNavigate();
  const [nutritions, setNutritions] = useState([]);
  const [filteredNutritions, setFilteredNutritions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMealType, setFilterMealType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    missed: 0,
    totalCalories: 0,
    totalProtein: 0
  });

  const mealTypes = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const fetchNutritions = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/nutrition');
      const nutritionList = response.data.nutritions || [];
      setNutritions(nutritionList);
      
      // Calculate stats
      const completed = nutritionList.filter(n => n.status === 'Completed').length;
      const missed = nutritionList.filter(n => n.status === 'Missed').length;
      const pending = nutritionList.filter(n => n.status === 'Pending').length;
      const totalCalories = nutritionList.reduce((sum, n) => sum + (n.calories || 0), 0);
      const totalProtein = nutritionList.reduce((sum, n) => sum + (n.protein || 0), 0);
      
      setStats({
        total: nutritionList.length,
        completed,
        pending,
        missed,
        totalCalories,
        totalProtein
      });
    } catch (error) {
      console.error('Error fetching nutrition:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutritions();
  }, []);

  // Filter nutrition entries
  useEffect(() => {
    let filtered = [...nutritions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.foodItem.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Meal type filter
    if (filterMealType !== 'All') {
      filtered = filtered.filter(n => n.mealType === filterMealType);
    }

    // Status filter
    if (filterStatus !== 'All') {
      filtered = filtered.filter(n => n.status === filterStatus);
    }

    setFilteredNutritions(filtered);
  }, [searchTerm, filterMealType, filterStatus, nutritions]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
            <h1 className="text-xl md:text-2xl font-bold gradient-text">My Nutrition</h1>
          </div>
          <button
            onClick={() => navigate('/nutrition/create')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl btn-primary w-full md:w-auto justify-center"
          >
            <Plus size={18} />
            <span>Add Food</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-4 md:mb-6">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Total Entries</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>{stats.total}</p>
              </div>
              <Apple size={32} style={{ color: 'var(--theme-primary)', opacity: 0.5 }} />
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Completed</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--theme-success)' }}>{stats.completed}</p>
              </div>
              <CheckCircle size={32} style={{ color: 'var(--theme-success)', opacity: 0.5 }} />
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Pending</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--theme-warning)' }}>{stats.pending}</p>
              </div>
              <Clock size={32} style={{ color: 'var(--theme-warning)', opacity: 0.5 }} />
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Total Calories</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>{stats.totalCalories}</p>
              </div>
              <Flame size={32} style={{ color: 'var(--theme-primary)', opacity: 0.5 }} />
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Total Protein</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>{stats.totalProtein}g</p>
              </div>
              <Beef size={32} style={{ color: 'var(--theme-primary)', opacity: 0.5 }} />
            </div>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--theme-textMuted)' }} />
              <input
                type="text"
                placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="theme-input w-full pl-10 pr-4 py-2"
              />
            </div>
            
            <select
              value={filterMealType}
              onChange={(e) => setFilterMealType(e.target.value)}
              className="theme-input px-4 py-2 min-w-[150px]"
            >
              {mealTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="theme-input px-4 py-2 min-w-[150px]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Missed">Missed</option>
            </select>
          </div>
        </GlassCard>

        {/* Nutrition List */}
        {filteredNutritions.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Apple size={48} className="mx-auto mb-4" style={{ color: 'var(--theme-textMuted)' }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>No nutrition entries found</h3>
            <p className="mb-4" style={{ color: 'var(--theme-textSecondary)' }}>
              {searchTerm || filterMealType !== 'All' || filterStatus !== 'All'
                ? 'Try adjusting your filters'
                : 'Start by adding your first food entry'}
            </p>
            <button
              onClick={() => navigate('/nutrition/create')}
              className="px-6 py-2 rounded-xl btn-primary"
            >
              Add Food
            </button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNutritions.map(nutrition => (
              <NutritionCard
                key={nutrition._id}
                nutrition={nutrition}
                onUpdate={fetchNutritions}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Nutritions;