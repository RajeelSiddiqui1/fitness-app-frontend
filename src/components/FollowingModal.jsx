// components/FollowingModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MapPin, 
  UserMinus,
  UserCheck,
  X,
  Loader
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from './GlassCard';
import { axiosInstance } from '../lib/axios';

const FollowingModal = ({ isOpen, onClose, userId }) => {
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unfollowLoading, setUnfollowLoading] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchFollowing();
    }
  }, [isOpen]);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      // If userId is provided, fetch following for that user, otherwise fetch own following
      const endpoint = userId ? `/auth/user/${userId}/following` : '/follow/my-following';
      const response = await axiosInstance.get(endpoint);
      setFollowing(response.data.following || []);
    } catch (error) {
      console.error('Error fetching following:', error);
      toast.error('Failed to load following');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      setLoadingUserId(targetUserId);
      await axiosInstance.post('/follow/unfollow', { userId: targetUserId });
      toast.success('Unfollowed successfully');
      
      // Refresh following list
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
            <h3 className="text-xl font-bold">{userId ? 'Following' : 'Following'}</h3>
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
          ) : following.length === 0 ? (
            <div className="text-center py-8">
              <Users size={40} className="mx-auto mb-3 opacity-50" />
              <p style={{ color: 'var(--theme-textSecondary)' }}>Not following anyone yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {following.map(user => (
                <div key={user._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5">
                  <div 
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      onClose();
                      navigate(`/user/${user._id}`);
                    }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                             style={{ background: 'var(--theme-gradient)' }}>
                          {user.userName?.charAt(0).toUpperCase()}
                        </div>
                    <div>
                      <p className="font-medium">{user.userName}</p>
                      <div className="flex items-center gap-1 text-xs opacity-60">
                        {user.age && <span>{user.age} years</span>}
                        {user.gender && <span>• {user.gender}</span>}
                      </div>
                      {(user.city || user.country) && (
                        <div className="flex items-center gap-1 text-xs opacity-60">
                          <MapPin size={10} />
                          <span>
                            {user.city}{user.city && user.country && ', '}{user.country}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Friend Label and Unfollow Button */}
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-500 text-sm">
                      <UserCheck size={14} />
                      <span>Friend</span>
                    </span>
                    <button
                      onClick={() => handleUnfollow(user._id)}
                      disabled={loadingUserId !== null}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors text-sm"
                      title="Unfollow"
                    >
                      {loadingUserId === user._id ? (
                        <Loader className="animate-spin" size={14} />
                      ) : (
                        <UserMinus size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default FollowingModal;