// src/pages/workout/components/WorkoutCard.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  Repeat, 
  Weight, 
  Clock,
  Globe,
  Lock,
  CheckCircle,
  Circle,
  XCircle,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../../../components/GlassCard';
import { axiosInstance } from '../../../lib/axios';

const WorkoutCard = ({ workout, onUpdate, measurementUnit }) => {
  const navigate = useNavigate();
  const [toggling, setToggling] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const cardRef = useRef(null);

  const statusOptions = ['Pending', 'Completed', 'Missed'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (showStatusDropdown) {
        setShowStatusDropdown(false);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showStatusDropdown]);

  const getStatusIcon = (status = workout.status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={16} style={{ color: 'var(--theme-success)' }} />;
      case 'Missed':
        return <XCircle size={16} style={{ color: 'var(--theme-error)' }} />;
      default:
        return <Circle size={16} style={{ color: 'var(--theme-warning)' }} />;
    }
  };

  const getStatusColor = (status = workout.status) => {
    switch (status) {
      case 'Completed':
        return 'var(--theme-success)';
      case 'Missed':
        return 'var(--theme-error)';
      default:
        return 'var(--theme-warning)';
    }
  };

  const getStatusBgColor = (status = workout.status) => {
    switch (status) {
      case 'Completed':
        return 'rgba(34, 197, 94, 0.1)';
      case 'Missed':
        return 'rgba(239, 68, 68, 0.1)';
      default:
        return 'rgba(234, 179, 8, 0.1)';
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (updatingStatus || newStatus === workout.status) {
      setShowStatusDropdown(false);
      return;
    }
    
    try {
      setUpdatingStatus(true);
      
      if (newStatus === 'Missed') {
        toast.error('Missed status can only be set automatically');
        setShowStatusDropdown(false);
        return;
      }
      
      const response = await axiosInstance.patch(`/workout/status-update/workout/${workout._id}`);
      toast.success(response.data.message);
      onUpdate();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
      setShowStatusDropdown(false);
    }
  };

  const handleToggleShared = async () => {
    if (toggling) return;
    
    try {
      setToggling(true);
      const response = await axiosInstance.patch(`/workout/toggle/workout/${workout._id}`);
      toast.success(response.data.message);
      onUpdate();
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to update sharing');
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axiosInstance.delete(`/workout/delete/workout/${workout._id}`);
        toast.success('Workout deleted successfully');
        onUpdate();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete workout');
      }
    }
  };

  const getCategoryColor = () => {
    switch (workout.category) {
      case 'Cardio':
        return 'bg-green-500/20 text-green-400';
      case 'Strength':
        return 'bg-blue-500/20 text-blue-400';
      case 'Flexibility':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <GlassCard 
      ref={cardRef}
      className="p-5 hover:scale-[1.02] transition-transform duration-200 relative"
      style={{ 
        overflow: 'visible', // Allow dropdown to overflow
        zIndex: showStatusDropdown ? 10 : 1 // Higher z-index when dropdown is open
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
              {workout.exrciseName}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleShared}
                disabled={toggling}
                className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${toggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={`Make ${workout.shared === 'Public' ? 'Private' : 'Public'}`}
              >
                {workout.shared === 'Public' ? (
                  <Globe size={16} style={{ color: 'var(--theme-primary)' }} />
                ) : (
                  <Lock size={16} style={{ color: 'var(--theme-textMuted)' }} />
                )}
              </button>
              {workout.category && (
                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor()}`}>
                  {workout.category}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 mb-3">
            <div className="flex items-center space-x-2">
              <Repeat size={16} style={{ color: 'var(--theme-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                {workout.sets} × {workout.reps}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Weight size={16} style={{ color: 'var(--theme-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                {workout.weight} {measurementUnit}
              </span>
            </div>
            {workout.alertTime && (
              <div className="flex items-center space-x-2">
                <Clock size={16} style={{ color: 'var(--theme-primary)' }} />
                <span className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                  {new Date(workout.alertTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>

          {/* Notes */}
          {workout.notes && (
            <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--theme-textMuted)' }}>
              {workout.notes}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Status Dropdown - Fixed positioning */}
            <div className="relative" style={{ zIndex: showStatusDropdown ? 20 : 1 }}>
              <button
                ref={buttonRef}
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                disabled={updatingStatus}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                  updatingStatus ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'
                }`}
                style={{ background: getStatusBgColor() }}
              >
                {getStatusIcon()}
                <span className="text-sm" style={{ color: getStatusColor() }}>
                  {updatingStatus ? 'Updating...' : workout.status}
                </span>
                <ChevronDown size={14} style={{ color: getStatusColor() }} />
              </button>

              {/* Dropdown Menu - Fixed positioning with higher z-index */}
              {showStatusDropdown && (
                <div 
                  ref={dropdownRef}
                  className="absolute left-0 mt-1 w-40 rounded-lg overflow-hidden"
                  style={{ 
                    background: 'var(--theme-bg)',
                    border: '1px solid var(--theme-border)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                    zIndex: 9999, // Very high z-index
                    position: 'absolute',
                    top: '100%',
                    left: 0
                  }}
                >
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 text-sm transition-colors ${
                        status === workout.status 
                          ? 'bg-white/10 cursor-default' 
                          : 'hover:bg-white/5'
                      }`}
                      disabled={status === workout.status}
                    >
                      {status === 'Completed' && <CheckCircle size={16} style={{ color: 'var(--theme-success)' }} />}
                      {status === 'Missed' && <XCircle size={16} style={{ color: 'var(--theme-error)' }} />}
                      {status === 'Pending' && <Circle size={16} style={{ color: 'var(--theme-warning)' }} />}
                      <span style={{ 
                        color: status === workout.status 
                          ? 'var(--theme-textSecondary)' 
                          : status === 'Completed' ? 'var(--theme-success)' :
                            status === 'Missed' ? 'var(--theme-error)' : 'var(--theme-warning)'
                      }}>
                        {status}
                      </span>
                      {status === workout.status && (
                        <span className="ml-auto text-xs" style={{ color: 'var(--theme-textMuted)' }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => navigate(`/workout/${workout._id}`)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                title="View Details"
              >
                <ChevronRight size={18} style={{ color: 'var(--theme-textSecondary)' }} />
              </button>
              <button
                onClick={() => navigate(`/workout/edit/${workout._id}`)}
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

export default WorkoutCard;