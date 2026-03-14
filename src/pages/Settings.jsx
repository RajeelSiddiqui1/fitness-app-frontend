// pages/Settings.js
import React, { useState, useEffect } from 'react';
import { useTheme, themes } from '../contexts/ThemeContext';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { 
  Palette, 
  Bell, 
  Shield, 
  User, 
  Globe, 
  ChevronRight,
  Check,
  Sparkles,
  Moon,
  Sun,
  Mail
} from 'lucide-react';

const settingsSections = [
  { id: 'appearance', icon: Palette, label: 'Appearance', description: 'Themes, colors & display' },
  { id: 'notifications', icon: Bell, label: 'Notifications', description: 'Alerts, mail & preferences' },

];

const ThemeCard = ({ themeData, isActive, onClick }) => {
  const colors = themeData.colors;
  
  return (
    <div 
      onClick={onClick}
      className={`theme-card group ${isActive ? 'active' : ''}`}
      style={{
        background: isActive ? `${colors.primaryLight}` : 'var(--theme-inputBg)',
      }}
    >
      {/* Theme Preview */}
      <div 
        className="w-full h-24 rounded-lg mb-3 relative overflow-hidden"
        style={{ background: colors.bg }}
      >
        {/* Mini sidebar preview */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-8"
          style={{ background: colors.sidebarBg, borderRight: `1px solid ${colors.divider}` }}
        >
          <div className="flex flex-col items-center gap-1.5 pt-2">
            {[1,2,3,4].map(i => (
              <div 
                key={i} 
                className="w-3 h-3 rounded"
                style={{ 
                  background: i === 1 ? colors.primary : colors.inputBg,
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Mini content preview */}
        <div className="ml-10 p-2 space-y-1.5">
          <div 
            className="h-2 w-16 rounded"
            style={{ background: colors.text, opacity: 0.6 }}
          />
          <div className="flex gap-1.5">
            <div 
              className="h-8 flex-1 rounded"
              style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}
            />
            <div 
              className="h-8 flex-1 rounded"
              style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}
            />
          </div>
          <div 
            className="h-6 w-full rounded"
            style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}
          />
        </div>

        {/* Gradient overlay */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-6"
          style={{ background: `linear-gradient(transparent, ${colors.bg})` }}
        />
      </div>

      {/* Theme Info */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{themeData.icon}</span>
            <h4 className="font-semibold text-sm" style={{ color: 'var(--theme-text)' }}>
              {themeData.name}
            </h4>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--theme-textMuted)' }}>
            {themeData.description}
          </p>
        </div>
        {isActive && (
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: 'var(--theme-primary)' }}
          >
            <Check size={14} className="text-white" />
          </div>
        )}
      </div>

      {/* Color dots */}
      <div className="flex gap-1.5 mt-3">
        <div className="w-4 h-4 rounded-full" style={{ background: colors.primary }} />
        <div className="w-4 h-4 rounded-full" style={{ background: colors.accent }} />
        <div className="w-4 h-4 rounded-full" style={{ background: colors.success }} />
        <div className="w-4 h-4 rounded-full border border-white/20" style={{ background: colors.bg }} />
        <div className="w-4 h-4 rounded-full" style={{ background: colors.text }} />
      </div>
    </div>
  );
};

const Settings = ({ onNavigate }) => {
  const { theme, currentTheme, setTheme, isLight } = useTheme();
  const [activeSection, setActiveSection] = useState('appearance');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    notification: true,
    mail: true,
    measurementUnit: 'kg'
  });

  // Fetch user settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        if (response.data.user) {
          setSettings({
            notification: response.data.user.notification ?? true,
            mail: response.data.user.mail ?? true,
            measurementUnit: response.data.user.measurementUnit || 'kg'
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = async (key) => {
    setLoading(true);
    try {
      let response;
      if (key === 'measurementUnit') {
        response = await axiosInstance.patch('/auth/measurement-toggle');
        setSettings(prev => ({
          ...prev,
          measurementUnit: response.data.measurementUnit
        }));
        toast.success(response.data.message || 'Measurement unit updated');
      } else if (key === 'notification') {
        response = await axiosInstance.patch('/auth/notification-toggle');
        setSettings(prev => ({
          ...prev,
          notification: response.data.notification
        }));
        toast.success(response.data.message || 'Notification preference updated');
      } else if (key === 'mail') {
        response = await axiosInstance.patch('/auth/mail-toggle');
        setSettings(prev => ({
          ...prev,
          mail: response.data.mail
        }));
        toast.success(response.data.message || 'Mail preference updated');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update setting');
    } finally {
      setLoading(false);
    }
  };

  const darkThemes = Object.values(themes).filter(t => !['snowlight', 'warmlight', 'oceanlight', 'sunsetlight', 'emeraldlight', 'royallight', 'roseLight'].includes(t.id));
  const lightThemes = Object.values(themes).filter(t => ['snowlight', 'warmlight', 'oceanlight', 'sunsetlight', 'emeraldlight', 'royallight', 'roseLight'].includes(t.id));

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
        <p style={{ color: 'var(--theme-textSecondary)' }}>
          Customize your R-Fit experience
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-72 shrink-0">
          <div className="glass-card p-2 animate-fade-in-up animate-delay-1">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left mb-1 ${
                    activeSection === section.id 
                      ? 'nav-active' 
                      : 'menu-item-hover'
                  }`}
                >
                  <Icon size={20} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{section.label}</p>
                    <p className={`text-xs truncate ${activeSection === section.id ? 'text-white/70' : ''}`}
                       style={activeSection !== section.id ? { color: 'var(--theme-textMuted)' } : {}}>
                      {section.description}
                    </p>
                  </div>
                  <ChevronRight size={16} className="opacity-50" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 min-w-0">
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              {/* Quick Toggle */}
              <div className="glass-card p-6 animate-fade-in-up animate-delay-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                         style={{ background: 'var(--theme-primaryLight)' }}>
                      <Sparkles size={20} style={{ color: 'var(--theme-primary)' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Current Theme</h3>
                      <p className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                        {theme.icon} {theme.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                       style={{ background: 'var(--theme-inputBg)' }}>
                    <Sun size={16} style={{ color: isLight ? 'var(--theme-primary)' : 'var(--theme-textMuted)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--theme-textSecondary)' }}>
                      {isLight ? 'Light' : 'Dark'}
                    </span>
                    <Moon size={16} style={{ color: !isLight ? 'var(--theme-primary)' : 'var(--theme-textMuted)' }} />
                  </div>
                </div>
              </div>

              {/* Dark Themes */}
              <div className="animate-fade-in-up animate-delay-3">
                <div className="flex items-center gap-2 mb-4">
                  <Moon size={18} style={{ color: 'var(--theme-textSecondary)' }} />
                  <h3 className="text-lg font-semibold">Dark Themes</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'var(--theme-primaryLight)', color: 'var(--theme-primary)' }}>
                    {darkThemes.length} themes
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {darkThemes.map((t) => (
                    <ThemeCard
                      key={t.id}
                      themeData={t}
                      isActive={currentTheme === t.id}
                      onClick={() => setTheme(t.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Light Themes */}
              <div className="animate-fade-in-up animate-delay-4">
                <div className="flex items-center gap-2 mb-4">
                  <Sun size={18} style={{ color: 'var(--theme-textSecondary)' }} />
                  <h3 className="text-lg font-semibold">Light Themes</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'var(--theme-accentLight)', color: 'var(--theme-accent)' }}>
                    {lightThemes.length} themes
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {lightThemes.map((t) => (
                    <ThemeCard
                      key={t.id}
                      themeData={t}
                      isActive={currentTheme === t.id}
                      onClick={() => setTheme(t.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div className="glass-card p-6 animate-fade-in-up animate-delay-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                     style={{ background: 'var(--theme-primaryLight)' }}>
                  <User size={20} style={{ color: 'var(--theme-primary)' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Account Settings</h3>
                  <p className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                    Manage your profile and personal information
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Display Name</label>
                  <input type="text" placeholder="Your name" className="theme-input w-full px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" placeholder="your@email.com" className="theme-input w-full px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea placeholder="Tell us about yourself..." className="theme-input w-full px-4 py-3 h-24 resize-none" />
                </div>
                <button className="btn-primary px-6 py-3">Save Changes</button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="glass-card p-6 animate-fade-in-up animate-delay-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                     style={{ background: 'var(--theme-primaryLight)' }}>
                  <Bell size={20} style={{ color: 'var(--theme-primary)' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Notifications & Mail</h3>
                  <p className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                    Manage your notification preferences
                  </p>
                </div>
              </div>
              
              {/* Measurement Unit */}
              <div className="mb-6">
                <h4 className="font-medium text-sm mb-3" style={{ color: 'var(--theme-textSecondary)' }}>
                  Measurement Unit
                </h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => settings.measurementUnit !== 'kg' && handleToggle('measurementUnit')}
                    disabled={loading}
                    className={`flex-1 p-3 rounded-xl border transition-all ${
                      settings.measurementUnit === 'kg' 
                        ? 'border-[var(--theme-primary)] bg-[var(--theme-primaryLight)]' 
                        : 'border-[var(--theme-border)] hover:border-[var(--theme-primary)]'
                    }`}
                  >
                    <span className="font-medium">Kilograms (kg)</span>
                  </button>
                  <button
                    onClick={() => settings.measurementUnit !== 'lb' && handleToggle('measurementUnit')}
                    disabled={loading}
                    className={`flex-1 p-3 rounded-xl border transition-all ${
                      settings.measurementUnit === 'lb' 
                        ? 'border-[var(--theme-primary)] bg-[var(--theme-primaryLight)]' 
                        : 'border-[var(--theme-border)] hover:border-[var(--theme-primary)]'
                    }`}
                  >
                    <span className="font-medium">Pounds (lb)</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Push Notifications */}
                <div className="flex items-center justify-between p-4 rounded-xl menu-item-hover">
                  <div className="flex items-center gap-3">
                    <Bell size={20} style={{ color: 'var(--theme-textSecondary)' }} />
                    <span className="font-medium">Push Notifications</span>
                  </div>
                  <button
                    onClick={() => handleToggle('notification')}
                    disabled={loading}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      settings.notification ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      settings.notification ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 rounded-xl menu-item-hover">
                  <div className="flex items-center gap-3">
                    <Mail size={20} style={{ color: 'var(--theme-textSecondary)' }} />
                    <span className="font-medium">Email Notifications</span>
                  </div>
                  <button
                    onClick={() => handleToggle('mail')}
                    disabled={loading}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      settings.mail ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      settings.mail ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

         
        </div>
      </div>
    </div>
  );
};

export default Settings;