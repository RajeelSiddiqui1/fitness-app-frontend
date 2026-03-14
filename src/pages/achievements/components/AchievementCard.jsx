// src/pages/achievements/components/AchievementCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  Utensils,
  Calendar,
  User,
  ChevronRight,
  Activity,
  Flame,
  Clock,
  Repeat,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';
import GlassCard from '../../../components/GlassCard';

const AchievementCard = ({ item, type, measurementUnit = 'kg', isOwner = false, showEngagement = false }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed':
        return 'var(--theme-success)';
      case 'Pending':
        return 'var(--theme-warning)';
      case 'Missed':
        return 'var(--theme-error)';
      default:
        return 'var(--theme-textMuted)';
    }
  };

  const handleViewDetails = () => {
    if (type === 'workout') {
      navigate(`/achievements/workout/${item._id}`);
    } else {
      navigate(`/achievements/nutrition/${item._id}`);
    }
  };

  return (
    <GlassCard className="p-5 hover:scale-[1.02] transition-transform duration-200 cursor-pointer" onClick={handleViewDetails}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header with Type Icon and User */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {type === 'workout' ? (
                <div className="p-2 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  <Dumbbell size={16} style={{ color: 'var(--theme-primary)' }} />
                </div>
              ) : (
                <div className="p-2 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                  <Utensils size={16} style={{ color: 'var(--theme-success)' }} />
                </div>
              )}
              <span className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>
                {type === 'workout' ? item.category : item.mealType}
              </span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <User size={12} style={{ color: 'var(--theme-textMuted)' }} />
              <span className="text-xs" style={{ color: 'var(--theme-textSecondary)' }}>
                {item.userId?.userName || 'Anonymous'}
              </span>
              {isOwner && (
                <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full" 
                  style={{ 
                    background: type === 'workout' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: type === 'workout' ? 'var(--theme-primary)' : 'var(--theme-success)'
                  }}>
                  You
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--theme-text)' }}>
            {type === 'workout' ? item.exrciseName : item.foodItem}
          </h3>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {type === 'workout' ? (
              // Workout Details
              <>
                {item.sets > 0 && (
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Sets</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{item.sets}</p>
                  </div>
                )}
                {item.reps > 0 && (
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Reps</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{item.reps}</p>
                  </div>
                )}
                {item.weight > 0 && (
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Weight</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>
                      {item.weight} {measurementUnit}
                    </p>
                  </div>
                )}
              </>
            ) : (
              // Nutrition Details
              <>
                {item.calories > 0 && (
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Calories</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{item.calories} kcal</p>
                  </div>
                )}
                {item.protein > 0 && (
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Protein</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{item.protein}g</p>
                  </div>
                )}
                {item.carbs > 0 && (
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Carbs</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{item.carbs}g</p>
                  </div>
                )}
                {item.fats > 0 && (
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Fats</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{item.fats}g</p>
                  </div>
                )}
                {item.quantity > 0 && (
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Quantity</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{item.quantity}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Engagement Stats - Only show for owner achievements */}
          {showEngagement && (
            <div className="flex items-center space-x-4 mb-3 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-center space-x-1">
                <Heart size={14} style={{ color: 'var(--theme-error)' }} />
                <span className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>{item.likes || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle size={14} style={{ color: 'var(--theme-primary)' }} />
                <span className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>{item.comments || 0}</span>
              </div>
            </div>
          )}

          {/* Status and Notes */}
          {item.notes && (
            <div className="mb-3 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-sm italic" style={{ color: 'var(--theme-textSecondary)' }}>"{item.notes}"</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--theme-border)' }}>
            <div className="flex items-center space-x-3">
              {/* Status Badge */}
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: getStatusColor(item.status) }}
                />
                <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>{item.status}</span>
              </div>

              {/* Date */}
              <div className="flex items-center space-x-1">
                <Calendar size={12} style={{ color: 'var(--theme-textMuted)' }} />
                <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>{formatDate(item.createdAt)}</span>
              </div>

              {/* Alert if exists */}
              {item.alertTime && (
                <div className="flex items-center space-x-1">
                  <Clock size={12} style={{ color: 'var(--theme-warning)' }} />
                  <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>{formatTime(item.alertTime)}</span>
                  {item.alertRecurring !== 'once' && (
                    <Repeat size={10} style={{ color: 'var(--theme-textMuted)' }} />
                  )}
                </div>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ChevronRight size={18} style={{ color: 'var(--theme-textSecondary)' }} />
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default AchievementCard;