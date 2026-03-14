// UserMenu.js (create this file)
import React, { useState } from 'react';
import { User, LogOut, Settings, UserCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserMenu = ({ userName, userEmail, userRole }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative group">
      <button 
        className="flex items-center space-x-2 p-2 rounded-xl menu-item-hover"
        style={{ color: 'var(--theme-textSecondary)' }}
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ 
            background: 'var(--theme-gradient)',
            color: 'white'
          }}
        >
          <User size={18} />
        </div>
        <span className="hidden md:block text-sm font-medium" style={{ color: 'var(--theme-text)' }}>
          {userName}
        </span>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-48 py-2 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
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
            {userRole === 'admin' && (
              <span className="px-1.5 py-0.5 text-xs rounded-full flex items-center gap-1" style={{ background: 'rgba(255, 105, 180, 0.2)', color: '#FF69B4' }}>
                <Shield size={10} />
                Admin
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>{userEmail}</p>
        </div>
        
        
        
        <hr className="my-1" style={{ borderColor: 'var(--theme-border)' }} />
        
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
          style={{ color: 'var(--theme-danger)' }}
        >
          <LogOut size={16} />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;