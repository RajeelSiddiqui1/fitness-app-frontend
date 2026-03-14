import React from 'react';
import RecentWorkouts from '../components/RecentWorkouts';
import NutritionSummary from '../components/NutritionSummary';
import ProgressCharts from '../components/ProgressCharts';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = ({ currentPage = 'dashboard', onNavigate }) => {
    const { user, logout } = useAuth();
  return (
    <>
      {/* Page Header */}
      <div className="mb-6 md:mb-8 animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">Welcome Back!  <span className="text-xl md:text-3xl font-medium" style={{ color: 'var(--theme-text)' }}>
                {user.userName}
              </span> </h1>
        <p className="text-sm md:text-base" style={{ color: 'var(--theme-textSecondary)' }}>
          Here's your fitness overview for today
        </p>
      </div>

  

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 stagger-children">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <RecentWorkouts />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <NutritionSummary />
        </div>
        <div className="md:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <ProgressCharts />
        </div>
      </div>
    </>
  );
};

export default Dashboard;