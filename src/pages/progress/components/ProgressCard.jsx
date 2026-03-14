// src/pages/progress/components/ProgressCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Weight, 
  Ruler,
  Zap,
  Calendar,
  TrendingUp,
  Edit2,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../../../components/GlassCard';
import { axiosInstance } from '../../../lib/axios';

const ProgressCard = ({ progress, onUpdate, measurementUnit }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this progress entry?')) {
      try {
        await axiosInstance.delete(`/progress/delete/progress/${progress._id}`);
        toast.success('Progress entry deleted successfully');
        onUpdate();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete progress');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <GlassCard className="p-5 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header with Date */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Calendar size={16} style={{ color: 'var(--theme-primary)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>
                {formatDate(progress.createdAt)}
              </span>
            </div>
          </div>

          {/* Weight Display */}
          <div className="flex items-center space-x-2 mb-3 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <Weight size={18} style={{ color: 'var(--theme-primary)' }} />
            <span className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
              {progress.weight} {measurementUnit}
            </span>
          </div>

          {/* Body Measurements */}
          {(progress.bodyMeasurements?.chest > 0 || 
            progress.bodyMeasurements?.waist > 0 || 
            progress.bodyMeasurements?.hips > 0) && (
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <Ruler size={16} style={{ color: 'var(--theme-textMuted)' }} />
                <span className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>Body Measurements</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {progress.bodyMeasurements?.chest > 0 && (
                  <div className="text-center p-1 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Chest</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{progress.bodyMeasurements.chest} cm</p>
                  </div>
                )}
                {progress.bodyMeasurements?.waist > 0 && (
                  <div className="text-center p-1 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Waist</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{progress.bodyMeasurements.waist} cm</p>
                  </div>
                )}
                {progress.bodyMeasurements?.hips > 0 && (
                  <div className="text-center p-1 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Hips</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{progress.bodyMeasurements.hips} cm</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          {(progress.performanceMetrics?.runTime > 0 || 
            progress.performanceMetrics?.maxLift > 0) && (
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <Zap size={16} style={{ color: 'var(--theme-textMuted)' }} />
                <span className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>Performance</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {progress.performanceMetrics?.runTime > 0 && (
                  <div className="text-center p-1 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Run Time</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{progress.performanceMetrics.runTime}s</p>
                  </div>
                )}
                {progress.performanceMetrics?.maxLift > 0 && (
                  <div className="text-center p-1 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Max Lift</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{progress.performanceMetrics.maxLift} {measurementUnit}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer with Actions */}
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--theme-border)' }}>
            <div className="flex items-center space-x-2">
              <TrendingUp size={16} style={{ color: 'var(--theme-primary)' }} />
              <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>
                {new Date(progress.createdAt).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => navigate(`/progress/${progress._id}`)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                title="View Details"
              >
                <ChevronRight size={18} style={{ color: 'var(--theme-textSecondary)' }} />
              </button>
              <button
                onClick={() => navigate(`/progress/edit/${progress._id}`)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                title="Edit"
              >
                <Edit2 size={16} style={{ color: 'var(--theme-textSecondary)' }} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} style={{ color: 'var(--theme-error)' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProgressCard;