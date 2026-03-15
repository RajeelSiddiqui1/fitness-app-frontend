// components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Menu, X, LayoutDashboard, Dumbbell, Utensils, TrendingUp, FileText, Settings, Zap, Users, Bell as BellIcon, Crown, ArchiveIcon, Home, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import NotificationPanel from './NotificationPanel';
import { axiosInstance } from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import { initSocket, onNotificationCountUpdate, disconnectSocket, removeAllListeners } from '../lib/socket';

const iconMap = {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  TrendingUp,
  FileText,
  Settings,
  Zap,
  Users,
  Bell: BellIcon,
  Crown,
  ArchiveIcon,
  Home,
};

// Get gender-based default avatar
const getDefaultAvatar = (gender) => {
  const avatarBaseUrl = import.meta.env.VITE_AVATAR_PLACEHOLDER_URL || 'https://avatar-placeholder.iran.liara.run/avatars/';
  const genderKey = gender?.toLowerCase() || 'male'; // default to male
  return `${avatarBaseUrl}?gender=${genderKey}`;
};

const Navbar = ({ onToggleMobileMenu, mobileMenuOpen, onNavigate, currentPage, menuItems }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const mobileNavRef = useRef(null);
  const userDropdownRef = useRef(null);

  const userName = user?.userName || 'User';

  // Fetch initial unread count and set up socket
  useEffect(() => {
    fetchUnreadCount();
    
    // Initialize socket connection if user is logged in
    if (user?._id) {
      initSocket(user._id);
      
      // Listen for real-time notification count updates
      onNotificationCountUpdate((newCount) => {
        // newCount is the absolute unread count from server
        setUnreadCount(newCount);
      });
    }
    
    // Set up polling as fallback (every 30 seconds)
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => {
      clearInterval(interval);
      removeAllListeners();
      disconnectSocket();
    };
  }, [user?._id]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axiosInstance.get('/notifications');
      const unread = response.data.notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      
      Cookies.remove('token');   
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      toast.success('Logged out successfully!', {
        icon: '👋',
      });
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('Logout error:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to logout. Please try again.';
      toast.error(errorMessage);
      
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleViewAllClick = () => {
    setShowNotifications(false);
    navigate('/notifications');
  };

  const handleNotificationCountChange = (count) => {
    setUnreadCount(count);
  };

  // Close notification panel when route changes
  useEffect(() => {
    setShowNotifications(false);
    setShowMobileNav(false);
    setShowUserDropdown(false);
  }, [location.pathname]);

  // Close mobile nav when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
        setShowMobileNav(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    if (showMobileNav || showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileNav, showUserDropdown]);

  const handleMobileNavClick = (itemId) => {
    // Close menu first
    setShowMobileNav(false);
    
    // Small delay to ensure state update happens, then navigate
    setTimeout(() => {
      if (onNavigate) {
        onNavigate(itemId);
      } else {
        navigate(itemId === 'dashboard' ? '/' : `/${itemId}`);
      }
    }, 50);
  };

  // Get icon for menu item
  const getMenuIcon = (itemId) => {
    const iconMapping = {
      dashboard: LayoutDashboard,
      workout: Dumbbell,
      nutrition: Utensils,
      progress: TrendingUp,
      achivements: ArchiveIcon,
      explore: Users,
      creator: Crown,
      profile: BellIcon,
      settings: Settings,
    };
    const Icon = iconMapping[itemId];
    return Icon ? <Icon size={20} /> : <Home size={20} />;
  };

  return (
    <nav className="navbar w-full px-4 md:px-6 py-4 relative z-50">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <div className="relative" ref={mobileNavRef}>
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="lg:hidden p-2 rounded-xl menu-item-hover transition-all"
            style={{ color: 'var(--theme-textSecondary)' }}
          >
            {showMobileNav ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Navigation Dropdown */}
          {showMobileNav && (
            <div 
              className="absolute left-0 top-14 w-56 py-2 rounded-xl shadow-lg z-[9999] animate-fade-in-up"
              style={{ 
                background: 'var(--theme-bg)',
                border: '1px solid var(--theme-border)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--theme-border)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>Navigate</p>
              </div>
              <div className="py-1 max-h-80 overflow-y-auto">
                {menuItems?.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMobileNavClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-2.5 text-left transition-colors ${
                        isActive ? 'bg-primary/10' : 'hover:bg-white/5'
                      }`}
                      style={{ color: isActive ? 'var(--theme-primary)' : 'var(--theme-textSecondary)' }}
                    >
                      {getMenuIcon(item.id)}
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

       

        {/* Right side */}
        <div className="flex items-center space-x-3 ml-auto">
          {/* Theme Toggle */}
    
          
          {/* Notification Bell with Badge */}
          <div className="relative">
            <button 
              onClick={handleNotificationClick}
              className="relative p-2.5 rounded-xl menu-item-hover transition-all"
              style={{ color: 'var(--theme-textSecondary)' }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse"
                  style={{ background: 'var(--theme-danger)' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel - will appear above everything */}
            <NotificationPanel 
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              onViewAllClick={handleViewAllClick}
              onNotificationCountChange={handleNotificationCountChange}
            />
          </div>
          
          {/* User Menu with Dropdown */}
          <div className="relative" ref={userDropdownRef}>
            <button 
              className="flex items-center space-x-2 p-2 rounded-xl menu-item-hover"
              style={{ color: 'var(--theme-textSecondary)' }}
              onClick={(e) => {
                e.stopPropagation();
                setShowUserDropdown(!showUserDropdown);
              }}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                style={{ 
                  background: 'var(--theme-gradient)',
                  color: 'white'
                }}
              >
                {user?.avatar ? (
                  <img 
                    src={`https://fitness-app-backend-navy.vercel.app/${user.avatar}`}
                    alt={userName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = userName.charAt(0).toUpperCase();
                    }}
                  />
                ) : (
                  <img 
                    src={getDefaultAvatar(user?.gender)}
                    alt={userName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = userName.charAt(0).toUpperCase();
                    }}
                  />
                )}
              </div>
              <span className="hidden md:block text-sm font-medium" style={{ color: 'var(--theme-text)' }}>
                {userName}
              </span>
            </button>

            {/* Dropdown Menu */}
            <div 
              className={`absolute right-0 mt-2 w-48 py-2 rounded-xl transition-all duration-200 z-[9999] ${
                showUserDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              style={{ 
                background: 'var(--theme-bg)',
                border: '1px solid var(--theme-border)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--theme-border)' }}>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{userName}</p>
                  {user?.role === 'admin' && (
                    <span className="px-1.5 py-0.5 text-xs rounded-full flex items-center gap-1" style={{ background: 'rgba(255, 105, 180, 0.2)', color: '#FF69B4' }}>
                      <Shield size={10} />
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>{user?.email || ''}</p>
              </div>
              
              {user?.role === 'admin' && (
              <button
                onClick={() => { navigate('/admin'); setShowUserDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2"
                style={{ color: '#FF69B4' }}
              >
                <Shield size={16} />
                Admin Panel
              </button>
              )}
              
              <button
                onClick={() => { navigate('/profile'); setShowUserDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                style={{ color: 'var(--theme-text)' }}
              >
                Profile
              </button>
              
              <button
                onClick={() => { navigate('/settings'); setShowUserDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                style={{ color: 'var(--theme-text)' }}
              >
                Settings
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                style={{ color: 'var(--theme-danger)' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;