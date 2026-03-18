// components/NotificationPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  UserPlus, 
  Heart, 
  MessageCircle, 
  Award,
  Clock,
  Dumbbell,
  Utensils,
  ExternalLink,
  Loader,
  Mail,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = ({ isOpen, onClose, onViewAllClick, onNotificationCountChange, isFullPage = false }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const panelRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Fetch notifications when panel opens or page changes
  useEffect(() => {
    if (isFullPage) {
      if (page > 1) {
        loadMoreNotifications();
      } else {
        fetchNotifications();
      }
    } else if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, page, isFullPage]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const limit = isFullPage ? 10 : 5;
      const response = await axiosInstance.get(`/notifications?page=1&limit=${limit}`);
      
      const fetchedNotifications = response.data.notifications || [];
      setNotifications(fetchedNotifications);
      setTotalPages(response.data.totalPages || 1);
      setHasMore(response.data.page < response.data.totalPages);
      setPage(1);
      
      // Calculate unread count from all notifications
      const unread = fetchedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      onNotificationCountChange?.(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreNotifications = async () => {
    try {
      setLoadingMore(true);
      const limit = 10;
      const response = await axiosInstance.get(`/notifications?page=${page + 1}&limit=${limit}`);
      
      const newNotifications = response.data.notifications || [];
      setNotifications(prev => [...prev, ...newNotifications]);
      setTotalPages(response.data.totalPages || 1);
      setHasMore(response.data.page < response.data.totalPages);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more notifications:', error);
      toast.error('Failed to load more notifications');
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle click outside to close
  useEffect(() => {
    if (isFullPage) return;
    
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isFullPage]);

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as seen first
      await axiosInstance.post('/notifications/seen', { notificationId: notification._id });
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n._id === notification._id 
            ? { ...n, seen: true, read: true } 
            : n
        )
      );
      
      // Update unread count
      const newUnreadCount = unreadCount - 1;
      setUnreadCount(newUnreadCount);
      onNotificationCountChange?.(newUnreadCount);

      // Close the panel only in dropdown mode (not full page)
      if (!isFullPage && onClose) {
        onClose();
      }

      // Navigate based on notification type and link
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      toast.error('Failed to open notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await axiosInstance.post('/notifications/read-all');
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      setUnreadCount(0);
      onNotificationCountChange?.(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow':
      case 'follow_request':
      case 'follow_accept':
        return <UserPlus size={18} className="text-blue-500" />;
      case 'like':
      case 'workout_like':
      case 'nutrition_like':
        return <Heart size={18} className="text-red-500" />;
      case 'comment':
        return <MessageCircle size={18} className="text-green-500" />;
      case 'achievement':
        return <Award size={18} className="text-yellow-500" />;
      case 'workout':
        return <Dumbbell size={18} className="text-purple-500" />;
      case 'nutrition':
        return <Utensils size={18} className="text-orange-500" />;
      default:
        return <Bell size={18} className="text-gray-500" />;
    }
  };

  const getNotificationBgColor = (notification) => {
    if (!notification.read) {
      return 'bg-blue-500/5 hover:bg-blue-500/10';
    }
    return 'hover:bg-white/5';
  };

  if (!isOpen && !isFullPage) return null;

  return (
    <div 
      ref={panelRef}
      className={`${isFullPage ? 'min-h-screen p-4 md:p-6' : 'fixed top-16 right-4 w-96 max-w-[calc(100vw-2rem)]'} z-[9999] animate-fade-in-up`}
    >
      <div 
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ 
          background: 'var(--theme-bg)',
          border: '1px solid var(--theme-border)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between"
             style={{ borderColor: 'var(--theme-border)' }}>
          <div className="flex items-center gap-2">
            {isFullPage && (
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors mr-1"
              >
                <ArrowRight size={18} className="rotate-180" />
              </button>
            )}
            <Bell size={20} style={{ color: 'var(--theme-primary)' }} />
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-xs flex items-center gap-1"
                style={{ color: 'var(--theme-textSecondary)' }}
                title="Mark all as read"
              >
                {markingAll ? (
                  <Loader size={14} className="animate-spin" />
                ) : (
                  <CheckCheck size={16} />
                )}
              </button>
            )}
            <button
              onClick={isFullPage ? () => navigate(-1) : onClose}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className={`${isFullPage ? 'max-h-[calc(100vh-200px)]' : 'max-h-96'} overflow-y-auto`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size={32} className="animate-spin mb-3" style={{ color: 'var(--theme-primary)' }} />
              <p className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full mb-3 flex items-center justify-center"
                   style={{ background: 'rgba(255,255,255,0.05)' }}>
                <Bell size={24} style={{ color: 'var(--theme-textMuted)' }} />
              </div>
              <p className="font-medium mb-1">No notifications yet</p>
              <p className="text-xs text-center" style={{ color: 'var(--theme-textMuted)' }}>
                When you get notifications, they'll appear here
              </p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 cursor-pointer transition-all ${getNotificationBgColor(notification)}`}
                >
                  <div className="flex gap-3">
                    {/* Avatar/Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                           style={{ background: 'var(--theme-gradient)' }}>
                        {notification.sender?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
                           style={{ border: '2px solid var(--theme-bg)' }}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm" style={{ color: 'var(--theme-text)' }}>
                            <span className="font-semibold">{notification.sender?.name}</span>{' '}
                            <span className="opacity-90">{notification.message}</span>
                          </p>
                        </div>
                        
                        {/* Unread indicator */}
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></span>
                        )}
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2 mt-2">
                        <Clock size={10} style={{ color: 'var(--theme-textMuted)' }} />
                        <span className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer with View All button */}
        {notifications.length > 0 && (
          <div className="p-3 border-t" style={{ borderColor: 'var(--theme-border)' }}>
            {!isFullPage ? (
              <button
                onClick={onViewAllClick}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
                style={{ color: 'var(--theme-primary)' }}
              >
                <span>View All Notifications</span>
                <ArrowRight size={16} />
              </button>
            ) : hasMore && (
              <button
                onClick={loadMoreNotifications}
                disabled={loadingMore}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
                style={{ color: 'var(--theme-primary)' }}
              >
                {loadingMore ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Load More</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;