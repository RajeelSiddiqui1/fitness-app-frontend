// src/pages/progress/Progress.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  ChevronLeft,
  Target,
  Calendar,
  Activity
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../../components/GlassCard';
import ProgressCard from './components/ProgressCard';
import { axiosInstance } from '../../lib/axios';

const Progress = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [filteredProgress, setFilteredProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState('kg');
  const [stats, setStats] = useState({
    total: 0,
    avgWeight: 0,
    latestChest: 0,
    latestRunTime: 0
  });

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/progress');
      setProgress(response.data.workouts || []);
      setMeasurementUnit(response.data.measurementUnit || 'kg');
      
      // Calculate stats
      const progressList = response.data.workouts || [];
      const totalWeight = progressList.reduce((sum, p) => sum + (p.weight || 0), 0);
      const avgWeight = progressList.length > 0 ? (totalWeight / progressList.length).toFixed(1) : 0;
      
      // Get latest measurements
      const latest = progressList[progressList.length - 1] || {};
      
      setStats({
        total: progressList.length,
        avgWeight,
        latestChest: latest.bodyMeasurements?.chest || 0,
        latestRunTime: latest.performanceMetrics?.runTime || 0
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast.error('Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  // Filter progress
  useEffect(() => {
    let filtered = [...progress];

    // Search filter (by notes or measurements)
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bodyMeasurements?.chest?.toString().includes(searchTerm) ||
        p.performanceMetrics?.runTime?.toString().includes(searchTerm)
      );
    }

    setFilteredProgress(filtered);
  }, [searchTerm, progress]);

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
            <h1 className="text-xl md:text-2xl font-bold gradient-text">Progress Tracking</h1>
          </div>
          <button
            onClick={() => navigate('/progress/create')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl btn-primary w-full md:w-auto justify-center"
          >
            <Plus size={18} />
            <span>Add Progress</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Total Entries</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>{stats.total}</p>
              </div>
              <Calendar size={32} style={{ color: 'var(--theme-primary)', opacity: 0.5 }} />
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Avg Weight</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
                  {stats.avgWeight} {measurementUnit}
                </p>
              </div>
              <TrendingUp size={32} style={{ color: 'var(--theme-success)', opacity: 0.5 }} />
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Latest Chest</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
                  {stats.latestChest} cm
                </p>
              </div>
              <Target size={32} style={{ color: 'var(--theme-warning)', opacity: 0.5 }} />
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Latest Run Time</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
                  {stats.latestRunTime}s
                </p>
              </div>
              <Activity size={32} style={{ color: 'var(--theme-primary)', opacity: 0.5 }} />
            </div>
          </GlassCard>
        </div>

        {/* Search */}
        <GlassCard className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--theme-textMuted)' }} />
            <input
              type="text"
              placeholder="Search progress entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="theme-input w-full pl-10 pr-4 py-2"
            />
          </div>
        </GlassCard>

        {/* Progress List */}
        {filteredProgress.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <TrendingUp size={48} className="mx-auto mb-4" style={{ color: 'var(--theme-textMuted)' }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>No progress entries found</h3>
            <p className="mb-4" style={{ color: 'var(--theme-textSecondary)' }}>
              {searchTerm
                ? 'Try adjusting your search'
                : 'Start tracking your fitness journey'}
            </p>
            <button
              onClick={() => navigate('/progress/create')}
              className="px-6 py-2 rounded-xl btn-primary"
            >
              Add Progress Entry
            </button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProgress.map(entry => (
              <ProgressCard
                key={entry._id}
                progress={entry}
                onUpdate={fetchProgress}
                measurementUnit={measurementUnit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;