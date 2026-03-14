import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = ({ children, isAdmin }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const userRole = user?.role || 'user';
  const isAdminUser = isAdmin || userRole === 'admin';

  // Menu items for regular users
  const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'workout', label: 'Workouts' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'progress', label: 'Progress' },
    { id: 'achivements', label: 'Achivements' },
    { id: 'explore', label: 'Explore' },
    { id: 'creator', label: 'Creator' },
    { id: 'support', label: 'Support' },
    { id: 'profile', label: 'Profile' },
    { id: 'settings', label: 'Settings' },
  ];

  // Menu items for admin users
  const adminMenuItems = [
    { id: 'admin', label: 'Admin Dashboard' },
    { id: 'admin-tickets', label: 'Support Tickets' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'workout', label: 'Workouts' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'progress', label: 'Progress' },
    { id: 'achivements', label: 'Achivements' },
    { id: 'explore', label: 'Explore' },
    { id: 'creator', label: 'Creator' },
    { id: 'support', label: 'Support' },
    { id: 'profile', label: 'Profile' },
    { id: 'settings', label: 'Settings' },
  ];

  const menuItems = isAdminUser ? adminMenuItems : userMenuItems;

  // Set current page from URL on initial load
  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    const pathAdmin = location.pathname.split('/')[2] || '';
    
    // Map URL paths to menu item IDs
    const pathToId = {
      '': 'dashboard',
      'dashboard': 'dashboard',
      'workout': 'workout',
      'nutrition': 'nutrition',
      'progress': 'progress',
      'achivements': 'achivements',
      'explore': 'explore',
      'creator': 'creator',
      'profile': 'profile',
      'settings': 'settings',
      'support': 'support',
      'admin': 'admin',
      'admin-tickets': 'admin-tickets',
    };
    
    if (path === 'admin') {
      if (pathAdmin === 'tickets') {
        setCurrentPage('admin-tickets');
      } else {
        setCurrentPage('admin');
      }
    } else {
      setCurrentPage(pathToId[path] || 'dashboard');
    }
  }, [location.pathname]);

  const handleSidebarNavigate = (pageId) => {
    // Update the current page state
    setCurrentPage(pageId);
    
    // Navigate using React Router
    switch (pageId) {
      case 'dashboard':
        navigate('/');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'admin-tickets':
        navigate('/admin/tickets');
        break;
      default:
        navigate(`/${pageId}`);
    }
    
    // Close mobile menu after navigation
    setMobileMenuOpen(false);
  };

  // For admin layout, render the Outlet for nested routes
  if (isAdmin) {
    return (
      <div className="flex min-h-screen" style={{ background: 'var(--theme-bg)' }}>
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        {/* Sidebar - only visible on lg screens and above */}
        <div className="hidden lg:block">
          <Sidebar 
            onNavigate={handleSidebarNavigate} 
            currentPage={currentPage}
            isAdmin={true}
          />
        </div>
        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar 
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} 
            mobileMenuOpen={mobileMenuOpen}
            onNavigate={handleSidebarNavigate}
            currentPage={currentPage}
            menuItems={menuItems}
          />
          <main className="container py-4 md:py-8 flex-1 px-2 md:px-4">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--theme-bg)' }}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      {/* Sidebar - only visible on lg screens and above */}
      <div className="hidden lg:block">
        <Sidebar 
          onNavigate={handleSidebarNavigate} 
          currentPage={currentPage}
        />
      </div>
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar 
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} 
          mobileMenuOpen={mobileMenuOpen}
          onNavigate={handleSidebarNavigate}
          currentPage={currentPage}
          menuItems={menuItems}
        />
        <main className="container py-4 md:py-8 flex-1 px-2 md:px-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
