// components/FollowersModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MapPin, 
  UserPlus,
  UserCheck,
  UserMinus,
  X,
  Loader,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from './GlassCard';
import { axiosInstance } from '../lib/axios';

const FollowersModal = ({ isOpen, onClose, userId }) => {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [followingIds, setFollowingIds] = useState(new Set());

  useEffect(() => {
    if (isOpen) {
      fetchFollowers();
      fetchFollowing();
    }
  }, [isOpen]);

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      // If userId is provided, fetch followers for that user, otherwise fetch own followers
      const endpoint = userId ? `/auth/user/${userId}/followers` : '/follow/my-followers';
      const response = await axiosInstance.get(endpoint);
      setFollowers(response.data.followers || []);
    } catch (error) {
      console.error('Error fetching followers:', error);
      toast.error('Failed to load followers');
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowing = async () => {
    try {
      // If userId is provided, fetch following for that user, otherwise fetch own following
      const endpoint = userId ? `/auth/user/${userId}/following` : '/follow/my-following';
      const response = await axiosInstance.get(endpoint);
      const following = response.data.following || [];
      const ids = new Set(following.map(f => f._id));
      setFollowingIds(ids);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  const handleFollowBack = async (targetUserId) => {
    try {
      setLoadingUserId(targetUserId);
      await axiosInstance.post('/follow/follow-back', { userId: targetUserId });
      toast.success('Followed back successfully!');
      
      // Refresh followers and following lists
      await fetchFollowers();
      await fetchFollowing();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to follow back');
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      setLoadingUserId(targetUserId);
      await axiosInstance.post('/follow/unfollow', { userId: targetUserId });
      toast.success('Unfollowed successfully');
      
      // Refresh followers and following lists
      await fetchFollowers();
      await fetchFollowing();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unfollow');
    } finally {
      setLoadingUserId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg animate-fade-in-up">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{userId ? 'Followers' : 'My Followers'}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader className="animate-spin" size={24} />
            </div>
          ) : followers.length === 0 ? (
            <div className="text-center py-8">
              <Users size={40} className="mx-auto mb-3 opacity-50" />
              <p style={{ color: 'var(--theme-textSecondary)' }}>No followers yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {followers.map(follower => {
                const isFollowing = followingIds.has(follower._id);
                
                return (
                  <div key={follower._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5">
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => {
                        onClose();
                        navigate(`/user/${follower._id}`);
                      }}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                             style={{ background: 'var(--theme-gradient)' }}>
                            {follower.userName?.charAt(0).toUpperCase()}
                          </div>
                      <div>
                        <p className="font-medium">{follower.userName}</p>
                        <div className="flex items-center gap-1 text-xs opacity-60">
                          {follower.age && <span>{follower.age} years</span>}
                          {follower.gender && <span>• {follower.gender}</span>}
                        </div>
                        {(follower.city || follower.country) && (
                          <div className="flex items-center gap-1 text-xs opacity-60">
                            <MapPin size={10} />
                            <span>
                              {follower.city}{follower.city && follower.country && ', '}{follower.country}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Friend Label or Follow/Unfollow Button */}
                    {isFollowing ? (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-500 text-sm">
                          <UserCheck size={14} />
                          <span>Friend</span>
                        </span>
                        <button
                          onClick={() => handleUnfollow(follower._id)}
                          disabled={loadingUserId !== null}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors text-sm"
                          title="Unfollow"
                        >
                          {loadingUserId === follower._id ? (
                            <Loader className="animate-spin" size={14} />
                          ) : (
                            <UserMinus size={14} />
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleFollowBack(follower._id)}
                        disabled={loadingUserId !== null}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-colors text-sm"
                      >
                        {loadingUserId === follower._id ? (
                          <Loader className="animate-spin" size={14} />
                        ) : (
                          <>
                            <UserPlus size={14} />
                            <span>Follow Back</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default FollowersModal;