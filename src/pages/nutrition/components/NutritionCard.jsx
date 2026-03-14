// src/pages/nutrition/components/NutritionCard.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Coffee,
  Apple,
  Beef,
  Flame,
  Droplet,
  Wheat,
  Cookie,
  Globe,
  Lock,
  CheckCircle,
  Circle,
  XCircle,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown,
  Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../../../components/GlassCard';
import { axiosInstance } from '../../../lib/axios';

const NutritionCard = ({ nutrition, onUpdate }) => {
  const navigate = useNavigate();
  const [toggling, setToggling] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const cardRef = useRef(null);

  const statusOptions = ['Pending', 'Completed', 'Missed'];

  const getMealIcon = () => {
    switch (nutrition.mealType) {
      case 'Breakfast':
        return <Coffee size={16} style={{ color: 'var(--theme-primary)' }} />;
      case 'Lunch':
        return <Beef size={16} style={{ color: 'var(--theme-primary)' }} />;
      case 'Dinner':
        return <Beef size={16} style={{ color: 'var(--theme-primary)' }} />;
      default:
        return <Apple size={16} style={{ color: 'var(--theme-primary)' }} />;
    }
  };

  const getMealColor = () => {
    switch (nutrition.mealType) {
      case 'Breakfast':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Lunch':
        return 'bg-orange-500/20 text-orange-400';
      case 'Dinner':
        return 'bg-purple-500/20 text-purple-400';
      case 'Snack':
        return 'bg-pink-500/20 text-pink-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

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

  const getStatusIcon = (status = nutrition.status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={16} style={{ color: 'var(--theme-success)' }} />;
      case 'Missed':
        return <XCircle size={16} style={{ color: 'var(--theme-error)' }} />;
      default:
        return <Circle size={16} style={{ color: 'var(--theme-warning)' }} />;
    }
  };

  const getStatusColor = (status = nutrition.status) => {
    switch (status) {
      case 'Completed':
        return 'var(--theme-success)';
      case 'Missed':
        return 'var(--theme-error)';
      default:
        return 'var(--theme-warning)';
    }
  };

  const getStatusBgColor = (status = nutrition.status) => {
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
    if (updatingStatus || newStatus === nutrition.status) {
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
      
      const response = await axiosInstance.patch(`/nutrition/status-update/nutrition/${nutrition._id}`);
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
      const response = await axiosInstance.patch(`/nutrition/toggle/nutrition/${nutrition._id}`);
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
    if (window.confirm('Are you sure you want to delete this nutrition entry?')) {
      try {
        await axiosInstance.delete(`/nutrition/delete/nutrition/${nutrition._id}`);
        toast.success('Nutrition entry deleted successfully');
        onUpdate();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete nutrition entry');
      }
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
            <div className="flex items-center space-x-2">
              {getMealIcon()}
              <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
                {nutrition.foodItem}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleShared}
                disabled={toggling}
                className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${toggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={`Make ${nutrition.shared === 'Public' ? 'Private' : 'Public'}`}
              >
                {nutrition.shared === 'Public' ? (
                  <Globe size={16} style={{ color: 'var(--theme-primary)' }} />
                ) : (
                  <Lock size={16} style={{ color: 'var(--theme-textMuted)' }} />
                )}
              </button>
              <span className={`px-2 py-1 text-xs rounded-full ${getMealColor()}`}>
                {nutrition.mealType}
              </span>
            </div>
          </div>

          {/* Nutrition Facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            <div className="flex items-center space-x-1">
              <Flame size={14} style={{ color: 'var(--theme-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                {nutrition.calories} cal
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Beef size={14} style={{ color: 'var(--theme-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                {nutrition.protein}g
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Wheat size={14} style={{ color: 'var(--theme-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                {nutrition.carbs}g
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Droplet size={14} style={{ color: 'var(--theme-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                {nutrition.fats}g
              </span>
            </div>
          </div>

          {/* Quantity and Alert */}
          <div className="flex items-center space-x-4 mb-3">
            <span className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>
              Quantity: {nutrition.quantity}g
            </span>
            {nutrition.alertTime && (
              <div className="flex items-center space-x-1">
                <Clock size={14} style={{ color: 'var(--theme-textMuted)' }} />
                <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>
                  {new Date(nutrition.alertTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>

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
                  {updatingStatus ? 'Updating...' : nutrition.status}
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
                        status === nutrition.status 
                          ? 'bg-white/10 cursor-default' 
                          : 'hover:bg-white/5'
                      }`}
                      disabled={status === nutrition.status}
                    >
                      {status === 'Completed' && <CheckCircle size={16} style={{ color: 'var(--theme-success)' }} />}
                      {status === 'Missed' && <XCircle size={16} style={{ color: 'var(--theme-error)' }} />}
                      {status === 'Pending' && <Circle size={16} style={{ color: 'var(--theme-warning)' }} />}
                      <span style={{ 
                        color: status === nutrition.status 
                          ? 'var(--theme-textSecondary)' 
                          : status === 'Completed' ? 'var(--theme-success)' :
                            status === 'Missed' ? 'var(--theme-error)' : 'var(--theme-warning)'
                      }}>
                        {status}
                      </span>
                      {status === nutrition.status && (
                        <span className="ml-auto text-xs" style={{ color: 'var(--theme-textMuted)' }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => navigate(`/nutrition/${nutrition._id}`)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                title="View Details"
              >
                <ChevronRight size={18} style={{ color: 'var(--theme-textSecondary)' }} />
              </button>
              <button
                onClick={() => navigate(`/nutrition/edit/${nutrition._id}`)}
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

export default NutritionCard;