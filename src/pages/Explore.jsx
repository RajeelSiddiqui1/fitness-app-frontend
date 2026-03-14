// pages/Explore.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  UserPlus, 
  UserCheck,
  UserX,
  X,
  Loader,
  Bell
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import FollowersModal from '../components/FollowersModal';
import FollowingModal from '../components/FollowingModal';
import { axiosInstance } from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';

const Explore = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [processingRequestId, setProcessingRequestId] = useState(null);
  const [followRequests, setFollowRequests] = useState([]);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  
  // Count states
  const [requestsCount, setRequestsCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Fetch users for explore
  useEffect(() => {
    fetchUsers();
    fetchFollowRequests();
    fetchCounts();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch('/auth/fetch-users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch follow requests
  const fetchFollowRequests = async () => {
    try {
      const response = await axiosInstance.get('/follow/get-follow-request');
      setFollowRequests(response.data.requests || []);
      setRequestsCount(response.data.requests?.length || 0);
    } catch (error) {
      console.error('Error fetching follow requests:', error);
    }
  };

  // Fetch counts
  const fetchCounts = async () => {
    try {
      // Fetch followers count
      const followersRes = await axiosInstance.get('/follow/my-followers');
      setFollowersCount(followersRes.data.followers?.length || 0);
      
      // Fetch following count
      const followingRes = await axiosInstance.get('/follow/my-following');
      setFollowingCount(followingRes.data.following?.length || 0);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const handleSendFollowRequest = async (userId) => {
    try {
      setLoadingUserId(userId);
      await axiosInstance.post('/follow/follow-request', { userId });
      toast.success('Follow request sent successfully!');
      
      // Update local state to show pending
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, followRequestSent: true } : user
      ));
      
      if (selectedUser?._id === userId) {
        setSelectedUser(prev => ({ ...prev, followRequestSent: true }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send follow request');
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleAcceptFollow = async (userId) => {
    try {
      setProcessingRequestId(userId);
      await axiosInstance.post('/follow/accept-follow', { userId });
      toast.success('Follow request accepted!');
      
      // Refresh all data
      await fetchFollowRequests();
      await fetchCounts();
      await fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept request');
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleRejectFollow = async (userId) => {
    try {
      setProcessingRequestId(userId);
      await axiosInstance.post('/follow/reject-follow', { userId });
      toast.success('Follow request rejected');
      
      // Refresh requests
      await fetchFollowRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    } finally {
      setProcessingRequestId(null);
    }
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const navigateToUserProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  const openRequestsModal = async () => {
    await fetchFollowRequests();
    setShowRequestsModal(true);
  };

  const openFollowersModal = async () => {
    await fetchCounts();
    setShowFollowersModal(true);
  };

  const openFollowingModal = async () => {
    await fetchCounts();
    setShowFollowingModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">Explore People</h1>
            <p className="text-sm md:text-base" style={{ color: 'var(--theme-textSecondary)' }}>
              Discover and connect with other fitness enthusiasts
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="flex gap-2 md:gap-4">
            {/* Requests Card */}
            <div 
              onClick={openRequestsModal}
              className="relative cursor-pointer group"
            >
              <GlassCard className="px-3 md:px-6 py-2 md:py-3 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="relative">
                    <Bell size={18} style={{ color: 'var(--theme-primary)' }} />
                    {requestsCount > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                        {requestsCount}
                      </span>
                    )}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xl md:text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
                      {requestsCount}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--theme-textSecondary)' }}>
                      Requests
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Followers Card */}
            <div 
              onClick={openFollowersModal}
              className="cursor-pointer group"
            >
              <GlassCard className="px-3 md:px-6 py-2 md:py-3 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2 md:gap-3">
                  <Users size={18} style={{ color: 'var(--theme-accent)' }} />
                  <div className="text-left hidden md:block">
                    <p className="text-xl md:text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
                      {followersCount}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--theme-textSecondary)' }}>
                      Followers
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Following Card */}
            <div 
              onClick={openFollowingModal}
              className="cursor-pointer group"
            >
              <GlassCard className="px-3 md:px-6 py-2 md:py-3 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2 md:gap-3">
                  <UserCheck size={18} style={{ color: 'var(--theme-success)' }} />
                  <div className="text-left hidden md:block">
                    <p className="text-xl md:text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
                      {followingCount}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--theme-textSecondary)' }}>
                      Following
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin" size={32} style={{ color: 'var(--theme-primary)' }} />
        </div>
      ) : users.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No users found</h3>
          <p style={{ color: 'var(--theme-textSecondary)' }}>
            Check back later for more people to connect with!
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">
          {users.map((user, index) => (
            <div
              key={user._id}
              className="animate-fade-in-up hover-lift"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <GlassCard 
                className="p-4 cursor-pointer hover-scale transition-all duration-300"
                onClick={() => navigateToUserProfile(user._id)}
              >
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <div 
                    className="w-24 h-24 rounded-full overflow-hidden border-4 mb-3"
                    style={{ borderColor: 'var(--theme-primary)' }}
                  >
                    {user.avatar ? (
                      <img 
                        src={`http://localhost:5000/${user.avatar}`}
                        alt={user.userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center text-2xl font-bold text-white"
                        style={{ background: 'var(--theme-gradient)' }}
                      >
                        {user.userName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--theme-text)' }}>
                    {user.userName}
                  </h3>
                  
                  {(user.city || user.country) && (
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin size={14} style={{ color: 'var(--theme-textMuted)' }} />
                      <span className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                        {user.city}{user.city && user.country && ', '}{user.country}
                      </span>
                    </div>
                  )}

                  {user.gender && (
                    <span className="text-xs px-2 py-1 rounded-full mb-3"
                      style={{ 
                        background: 'var(--theme-inputBg)',
                        color: 'var(--theme-textSecondary)'
                      }}
                    >
                      {user.gender}
                    </span>
                  )}

                  {/* Follow Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendFollowRequest(user._id);
                    }}
                    disabled={loadingUserId !== null || user.followRequestSent}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      user.followRequestSent 
                        ? 'bg-green-500/20 text-green-500 cursor-default'
                        : 'btn-primary'
                    }`}
                  >
                    {loadingUserId === user._id ? (
                      <Loader className="animate-spin" size={16} />
                    ) : user.followRequestSent ? (
                      <>
                        <UserCheck size={16} />
                        <span>Request Sent</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      )}

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-2xl animate-fade-in-up">
            <GlassCard className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div 
                  className="w-32 h-32 rounded-full overflow-hidden border-4 mb-4"
                  style={{ borderColor: 'var(--theme-primary)' }}
                >
                  {selectedUser.avatar ? (
                    <img 
                      src={`http://localhost:5000/${selectedUser.avatar}`}
                      alt={selectedUser.userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-4xl font-bold text-white"
                      style={{ background: 'var(--theme-gradient)' }}
                    >
                      {selectedUser.userName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--theme-text)' }}>
                  {selectedUser.userName}
                </h2>

                {/* Location */}
                {(selectedUser.city || selectedUser.country) && (
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={16} style={{ color: 'var(--theme-primary)' }} />
                    <span style={{ color: 'var(--theme-textSecondary)' }}>
                      {selectedUser.city}{selectedUser.city && selectedUser.country && ', '}{selectedUser.country}
                    </span>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                  <div className="p-3 rounded-xl text-center"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <p className="text-sm mb-1" style={{ color: 'var(--theme-textMuted)' }}>Gender</p>
                    <p className="font-medium" style={{ color: 'var(--theme-text)' }}>
                      {selectedUser.gender || 'Not specified'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl text-center"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <p className="text-sm mb-1" style={{ color: 'var(--theme-textMuted)' }}>Age</p>
                    <p className="font-medium" style={{ color: 'var(--theme-text)' }}>
                      {selectedUser.age || '-'}
                    </p>
                  </div>
                </div>

                {/* Follow Button */}
                <button
                  onClick={() => handleSendFollowRequest(selectedUser._id)}
                  disabled={loadingUserId !== null || selectedUser.followRequestSent}
                  className={`w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    selectedUser.followRequestSent 
                      ? 'bg-green-500/20 text-green-500 cursor-default'
                      : 'btn-primary'
                  }`}
                >
                  {loadingUserId === selectedUser._id ? (
                    <Loader className="animate-spin" size={18} />
                  ) : selectedUser.followRequestSent ? (
                    <>
                      <UserCheck size={18} />
                      <span>Follow Request Sent</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      <span>Send Follow Request</span>
                    </>
                  )}
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Follow Requests Modal */}
      {showRequestsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRequestsModal(false)} />
          
          <div className="relative w-full max-w-lg animate-fade-in-up">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Follow Requests</h3>
                <button
                  onClick={() => setShowRequestsModal(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {followRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Bell size={40} className="mx-auto mb-3 opacity-50" />
                  <p style={{ color: 'var(--theme-textSecondary)' }}>No pending follow requests</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {followRequests.map(requester => (
                    <div key={requester._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          {requester.avatar ? (
                            <img src={`http://localhost:5000/${requester.avatar}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white"
                                 style={{ background: 'var(--theme-gradient)' }}>
                              {requester.userName?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{requester.userName}</p>
                          <p className="text-xs opacity-60">
                            {requester.age || ''} {requester.gender ? `• ${requester.gender}` : ''}
                          </p>
                          {(requester.city || requester.country) && (
                            <p className="text-xs opacity-60">
                              {requester.city}{requester.city && requester.country && ', '}{requester.country}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptFollow(requester._id)}
                          disabled={processingRequestId !== null}
                          className="p-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors"
                          title="Accept"
                        >
                          {processingRequestId === requester._id ? (
                            <Loader className="animate-spin" size={16} />
                          ) : (
                            <UserCheck size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectFollow(requester._id)}
                          disabled={processingRequestId !== null}
                          className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                          title="Reject"
                        >
                          {processingRequestId === requester._id ? (
                            <Loader className="animate-spin" size={16} />
                          ) : (
                            <UserX size={16} />
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
      )}

      {/* Followers Modal Component */}
      <FollowersModal 
        isOpen={showFollowersModal}
        onClose={() => {
          setShowFollowersModal(false);
          fetchCounts(); // Refresh counts when modal closes
        }}
      />

      {/* Following Modal Component */}
      <FollowingModal 
        isOpen={showFollowingModal}
        onClose={() => {
          setShowFollowingModal(false);
          fetchCounts(); // Refresh counts when modal closes
        }}
      />
    </div>
  );
};

export default Explore;