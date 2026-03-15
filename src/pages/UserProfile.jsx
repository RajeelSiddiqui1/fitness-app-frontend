// pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  UserPlus, 
  UserCheck,
  UserMinus,
  ChevronLeft,
  Dumbbell,
  Utensils,
  Calendar,
  Loader,
  Users,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import FollowersModal from '../components/FollowersModal';
import FollowingModal from '../components/FollowingModal';
import { axiosInstance } from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';

// Get gender-based default avatar
const getDefaultAvatar = (gender) => {
  const avatarBaseUrl = import.meta.env.VITE_AVATAR_PLACEHOLDER_URL || 'https://avatar-placeholder.iran.liara.run/avatars/';
  const genderKey = gender?.toLowerCase() || 'male';
  return `${avatarBaseUrl}?gender=${genderKey}`;
};

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [relationship, setRelationship] = useState({
    isFollowing: false,
    hasPendingRequest: false,
    isOwnProfile: false,
    isFollowedBy: false
  });
  const [stats, setStats] = useState({
    followersCount: 0,
    followingCount: 0,
    publicWorkoutsCount: 0,
    publicNutritionCount: 0
  });
  const [publicWorkouts, setPublicWorkouts] = useState([]);
  const [publicNutrition, setPublicNutrition] = useState([]);
  const [activeTab, setActiveTab] = useState('workouts');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/auth/user/${userId}`);
      
      if (response.data) {
        setUser(response.data.user);
        setRelationship(response.data.relationship);
        setStats(response.data.stats);
        setPublicWorkouts(response.data.publicWorkouts || []);
        setPublicNutrition(response.data.publicNutrition || []);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
      navigate('/explore');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (isFollowBack = false) => {
    try {
      setFollowLoading(true);
      
      if (isFollowBack && relationship.isFollowedBy) {
        // Use follow-back endpoint when the other user follows us
        await axiosInstance.post('/follow/follow-back', { userId });
        toast.success('Followed back successfully!');
      } else {
        // Use follow-request endpoint for normal follow
        await axiosInstance.post('/follow/follow-request', { userId });
        toast.success('Follow request sent!');
      }
      
      setRelationship(prev => ({ ...prev, isFollowing: true, hasPendingRequest: false }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to follow');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setFollowLoading(true);
      await axiosInstance.post('/follow/unfollow', { userId });
      toast.success('Unfollowed successfully!');
      // If the user still follows us (isFollowedBy), show Follow Back, otherwise show Follow
      setRelationship(prev => ({ 
        ...prev, 
        isFollowing: false, 
        hasPendingRequest: false 
      }));
      // Refresh stats
      fetchUserProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unfollow');
    } finally {
      setFollowLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={32} style={{ color: 'var(--theme-primary)' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">User not found</p>
          <button 
            onClick={() => navigate('/explore')}
            className="btn-primary px-4 py-2 rounded-xl"
          >
            Go back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6 animate-fade-in-up">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110"
          style={{ color: 'var(--theme-textSecondary)' }}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold ml-2 gradient-text">
          {user.userName}'s Profile
        </h1>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <GlassCard className="p-4 md:p-6 mb-6 bounceIn">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div 
              className="w-32 h-32 rounded-full overflow-hidden border-4 flex-shrink-0 hover-scale animate-glow"
              style={{ borderColor: 'var(--theme-primary)' }}
            >
              {user.avatar ? (
                <img 
                  src={`https://fitness-app-backend-navy.vercel.app/${user.avatar}`}
                  alt={user.userName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<img src="${getDefaultAvatar(user.gender)}" alt="${user.userName}" class="w-full h-full object-cover" />`;
                  }}
                />
              ) : (
                <img 
                  src={getDefaultAvatar(user.gender)}
                  alt={user.userName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl font-bold text-white" style="background: var(--theme-gradient)">${user.userName?.charAt(0).toUpperCase()}</div>`;
                  }}
                />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--theme-text)' }}>
                {user.userName}
              </h2>
              
              {(user.city || user.country) && (
                <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
                  <MapPin size={16} style={{ color: 'var(--theme-primary)' }} />
                  <span style={{ color: 'var(--theme-textSecondary)' }}>
                    {user.city}{user.city && user.country && ', '}{user.country}
                  </span>
                </div>
              )}

              <p className="text-sm mb-4" style={{ color: 'var(--theme-textSecondary)' }}>
                Member since {formatDate(user.createdAt)}
              </p>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-6">
              
                <div
               
                  className="text-center cursor-pointer hover-scale transition-all duration-300 p-2 rounded-xl hover:bg-white/5"
                >
                  <p className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>
                    {stats.followersCount}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Followers</p>
             </div>
                <div
               
                  className="text-center cursor-pointer hover-scale transition-all duration-300 p-2 rounded-xl hover:bg-white/5"
                >
                  <p className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>
                    {stats.followingCount}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Following</p>
                </div>
              </div>
            </div>

            {/* Follow Button */}
            {!relationship.isOwnProfile && (
              <div className="flex-shrink-0 flex gap-2">
                {relationship.isFollowing ? (
                  <>
                    <button
                      onClick={handleUnfollow}
                      disabled={followLoading}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl hover-scale transition-all duration-300"
                      style={{ 
                        background: 'var(--theme-danger)',
                        color: 'white'
                      }}
                    >
                      {followLoading ? (
                        <Loader className="animate-spin" size={18} />
                      ) : (
                        <>
                          <UserMinus size={18} />
                          <span>Unfollow</span>
                        </>
                      )}
                    </button>
                  </>
                ) : relationship.hasPendingRequest ? (
                  <button
                    disabled
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-500/20 text-yellow-500 cursor-default"
                  >
                    <UserCheck size={18} />
                    <span>Request Sent</span>
                  </button>
                ) : relationship.isFollowedBy ? (
                  <button
                    onClick={() => handleFollow(true)}
                    disabled={followLoading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl btn-primary hover-scale transition-all duration-300"
                  >
                    {followLoading ? (
                      <Loader className="animate-spin" size={18} />
                    ) : (
                      <>
                        <UserPlus size={18} />
                        <span>Follow Back</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollow(false)}
                    disabled={followLoading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl btn-primary hover-scale transition-all duration-300"
                  >
                    {followLoading ? (
                      <Loader className="animate-spin" size={18} />
                    ) : (
                      <>
                        <UserPlus size={18} />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setActiveTab('workouts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover-scale ${
              activeTab === 'workouts' ? 'btn-primary' : ''
            }`}
            style={activeTab !== 'workouts' ? { background: 'rgba(255,255,255,0.05)' } : {}}
          >
            <Dumbbell size={18} />
            <span>Workouts ({stats.publicWorkoutsCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover-scale ${
              activeTab === 'nutrition' ? 'btn-primary' : ''
            }`}
            style={activeTab !== 'nutrition' ? { background: 'rgba(255,255,255,0.05)' } : {}}
          >
            <Utensils size={18} />
            <span>Nutrition ({stats.publicNutritionCount})</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'workouts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {publicWorkouts.length === 0 ? (
              <GlassCard className="p-8 text-center col-span-full hover-scale transition-all duration-300">
                <Dumbbell size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No public workouts</h3>
                <p style={{ color: 'var(--theme-textSecondary)' }}>
                  This user hasn't shared any workouts publicly yet.
                </p>
              </GlassCard>
            ) : (
              publicWorkouts.map((workout, index) => (
                <GlassCard 
                  key={workout._id} 
                  className="p-4 cursor-pointer hover-scale transition-all duration-300 animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => navigate(`/achievements/workout/${workout._id}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--theme-text)' }}>
                      {workout.exrciseName}
                    </h3>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ 
                        background: workout.status === 'Completed' ? 'var(--theme-success)' : 'var(--theme-warning)',
                        color: 'white'
                      }}
                    >
                      {workout.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Sets</p>
                      <p className="font-bold" style={{ color: 'var(--theme-text)' }}>{workout.sets}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Reps</p>
                      <p className="font-bold" style={{ color: 'var(--theme-text)' }}>{workout.reps}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Weight</p>
                      <p className="font-bold" style={{ color: 'var(--theme-text)' }}>{workout.weight}kg</p>
                    </div>
                  </div>

                  {workout.category && (
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--theme-primary)', color: 'white' }}>
                      {workout.category}
                    </span>
                  )}
                </GlassCard>
              ))
            )}
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {publicNutrition.length === 0 ? (
              <GlassCard className="p-8 text-center col-span-full hover-scale transition-all duration-300">
                <Utensils size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No public nutrition</h3>
                <p style={{ color: 'var(--theme-textSecondary)' }}>
                  This user hasn't shared any nutrition publicly yet.
                </p>
              </GlassCard>
            ) : (
              publicNutrition.map((nutrition, index) => (
                <GlassCard 
                  key={nutrition._id} 
                  className="p-4 cursor-pointer hover-scale transition-all duration-300 animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => navigate(`/achievements/nutrition/${nutrition._id}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--theme-text)' }}>
                      {nutrition.foodItem}
                    </h3>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ 
                        background: nutrition.status === 'Completed' ? 'var(--theme-success)' : 'var(--theme-warning)',
                        color: 'white'
                      }}
                    >
                      {nutrition.status}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-sm px-2 py-1 rounded-full" style={{ background: 'var(--theme-accent)', color: 'white' }}>
                      {nutrition.mealType}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Cal</p>
                      <p className="font-bold text-sm" style={{ color: 'var(--theme-text)' }}>{nutrition.calories}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Pro</p>
                      <p className="font-bold text-sm" style={{ color: 'var(--theme-text)' }}>{nutrition.protein}g</p>
                    </div>
                    <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Carb</p>
                      <p className="font-bold text-sm" style={{ color: 'var(--theme-text)' }}>{nutrition.carbs}g</p>
                    </div>
                    <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Fat</p>
                      <p className="font-bold text-sm" style={{ color: 'var(--theme-text)' }}>{nutrition.fats}g</p>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showFollowersModal && (
        <FollowersModal 
          isOpen={showFollowersModal}
          userId={userId}
          onClose={() => setShowFollowersModal(false)} 
        />
      )}
      {showFollowingModal && (
        <FollowingModal 
          isOpen={showFollowingModal}
          userId={userId}
          onClose={() => setShowFollowingModal(false)} 
        />
      )}
    </div>
  );
};

export default UserProfile;
