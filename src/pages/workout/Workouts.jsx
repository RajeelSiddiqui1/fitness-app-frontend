// src/pages/workout/Workouts.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Dumbbell,
  TrendingUp,
  Clock,
  ChevronLeft,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../../components/GlassCard';
import WorkoutCard from './components/WorkoutCard';
import { axiosInstance } from '../../lib/axios';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Workouts = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [measurementUnit, setMeasurementUnit] = useState('kg');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    totalWeight: 0
  });

  const categories = ['All', 'Strength', 'Cardio', 'Flexibility', 'Other'];

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/workout');
      setWorkouts(response.data.workouts || []);
      setMeasurementUnit(response.data.measurementUnit || 'kg');
      
      // Calculate stats
      const workoutList = response.data.workouts || [];
      const completed = workoutList.filter(w => w.status === 'Completed').length;
      const totalWeight = workoutList.reduce((sum, w) => sum + (w.weight || 0), 0);
      
      setStats({
        total: workoutList.length,
        completed,
        pending: workoutList.length - completed,
        totalWeight
      });
    } catch (error) {
      console.error('Error fetching workouts:', error);
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Filter workouts
  useEffect(() => {
    let filtered = [...workouts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(w => 
        w.exrciseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'All') {
      filtered = filtered.filter(w => w.category === filterCategory);
    }

    // Status filter
    if (filterStatus !== 'All') {
      filtered = filtered.filter(w => w.status === filterStatus);
    }

    setFilteredWorkouts(filtered);
  }, [searchTerm, filterCategory, filterStatus, workouts]);

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
            <h1 className="text-xl md:text-2xl font-bold gradient-text">My Workouts</h1>
          </div>
          <button
            onClick={() => navigate('/workout/create')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl btn-primary w-full md:w-auto justify-center"
          >
            <Plus size={18} />
            <span>Add Workout</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Total Workouts</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>{stats.total}</p>
              </div>
              <Dumbbell size={32} style={{ color: 'var(--theme-primary)', opacity: 0.5 }} />
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
                <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Total Weight</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
                  {stats.totalWeight} {measurementUnit}
                </p>
              </div>
              <TrendingUp size={32} style={{ color: 'var(--theme-primary)', opacity: 0.5 }} />
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
                placeholder="Search workouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="theme-input w-full pl-10 pr-4 py-2"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="theme-input px-4 py-2 min-w-[150px]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
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
            </select>
          </div>
        </GlassCard>

        {/* Workouts List */}
        {filteredWorkouts.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Dumbbell size={48} className="mx-auto mb-4" style={{ color: 'var(--theme-textMuted)' }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>No workouts found</h3>
            <p className="mb-4" style={{ color: 'var(--theme-textSecondary)' }}>
              {searchTerm || filterCategory !== 'All' || filterStatus !== 'All'
                ? 'Try adjusting your filters'
                : 'Start by adding your first workout'}
            </p>
            <button
              onClick={() => navigate('/workout/create')}
              className="px-6 py-2 rounded-xl btn-primary"
            >
              Add Workout
            </button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWorkouts.map(workout => (
              <WorkoutCard
                key={workout._id}
                workout={workout}
                onUpdate={fetchWorkouts}
                measurementUnit={measurementUnit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;