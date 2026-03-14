// src/pages/progress/ProgressDetail.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Weight,
  Ruler,
  Zap,
  Calendar,
  TrendingUp,
  Edit2,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../../components/GlassCard';
import { axiosInstance } from '../../lib/axios';

const ProgressDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [measurementUnit, setMeasurementUnit] = useState('kg');

  useEffect(() => {
    fetchProgressDetail();
  }, [id]);

  const fetchProgressDetail = async () => {
    try {
      const response = await axiosInstance.get(`/progress/${id}`);
      setProgress(response.data.progress);
      setMeasurementUnit(response.data.measurementUnit || 'kg');
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast.error('Failed to load progress details');
      navigate('/progress');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this progress entry?')) {
      try {
        await axiosInstance.delete(`/progress/delete/progress/${id}`);
        toast.success('Progress entry deleted successfully');
        navigate('/progress');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete progress');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!progress) return null;

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--theme-bg)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-white/5 transition-colors"
              style={{ color: 'var(--theme-textSecondary)' }}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold gradient-text">Progress Details</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(`/progress/edit/${id}`)}
              className="p-2 rounded-xl hover:bg-white/5 transition-colors"
              title="Edit"
            >
              <Edit2 size={20} style={{ color: 'var(--theme-textSecondary)' }} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl hover:bg-white/5 transition-colors"
              title="Delete"
            >
              <Trash2 size={20} style={{ color: 'var(--theme-error)' }} />
            </button>
          </div>
        </div>

        {/* Date */}
        <GlassCard className="p-4 mb-4">
          <div className="flex items-center space-x-3">
            <Calendar size={20} style={{ color: 'var(--theme-primary)' }} />
            <span style={{ color: 'var(--theme-text)' }}>{formatDate(progress.createdAt)}</span>
          </div>
        </GlassCard>

        {/* Weight Card */}
        <GlassCard className="p-6 mb-4">
          <div className="flex items-center space-x-3 mb-4">
            <Weight size={24} style={{ color: 'var(--theme-primary)' }} />
            <h2 className="text-xl font-semibold" style={{ color: 'var(--theme-text)' }}>Weight</h2>
          </div>
          <div className="text-4xl font-bold text-center py-4 gradient-text">
            {progress.weight} {measurementUnit}
          </div>
        </GlassCard>

        {/* Body Measurements */}
        {(progress.bodyMeasurements?.chest > 0 || 
          progress.bodyMeasurements?.waist > 0 || 
          progress.bodyMeasurements?.hips > 0) && (
          <GlassCard className="p-6 mb-4">
            <div className="flex items-center space-x-3 mb-4">
              <Ruler size={24} style={{ color: 'var(--theme-primary)' }} />
              <h2 className="text-xl font-semibold" style={{ color: 'var(--theme-text)' }}>Body Measurements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {progress.bodyMeasurements?.chest > 0 && (
                <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-sm mb-1" style={{ color: 'var(--theme-textMuted)' }}>Chest</p>
                  <p className="text-2xl font-semibold" style={{ color: 'var(--theme-text)' }}>
                    {progress.bodyMeasurements.chest} cm
                  </p>
                </div>
              )}
              {progress.bodyMeasurements?.waist > 0 && (
                <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-sm mb-1" style={{ color: 'var(--theme-textMuted)' }}>Waist</p>
                  <p className="text-2xl font-semibold" style={{ color: 'var(--theme-text)' }}>
                    {progress.bodyMeasurements.waist} cm
                  </p>
                </div>
              )}
              {progress.bodyMeasurements?.hips > 0 && (
                <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-sm mb-1" style={{ color: 'var(--theme-textMuted)' }}>Hips</p>
                  <p className="text-2xl font-semibold" style={{ color: 'var(--theme-text)' }}>
                    {progress.bodyMeasurements.hips} cm
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* Performance Metrics */}
        {(progress.performanceMetrics?.runTime > 0 || 
          progress.performanceMetrics?.maxLift > 0) && (
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Zap size={24} style={{ color: 'var(--theme-primary)' }} />
              <h2 className="text-xl font-semibold" style={{ color: 'var(--theme-text)' }}>Performance Metrics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {progress.performanceMetrics?.runTime > 0 && (
                <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-sm mb-1" style={{ color: 'var(--theme-textMuted)' }}>Run Time</p>
                  <p className="text-2xl font-semibold" style={{ color: 'var(--theme-text)' }}>
                    {progress.performanceMetrics.runTime} seconds
                  </p>
                </div>
              )}
              {progress.performanceMetrics?.maxLift > 0 && (
                <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-sm mb-1" style={{ color: 'var(--theme-textMuted)' }}>Max Lift</p>
                  <p className="text-2xl font-semibold" style={{ color: 'var(--theme-text)' }}>
                    {progress.performanceMetrics.maxLift} {measurementUnit}
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default ProgressDetail;