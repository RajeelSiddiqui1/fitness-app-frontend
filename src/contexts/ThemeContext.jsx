import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Premium theme definitions
export const themes = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Dark',
    icon: '🌙',
    description: 'Deep dark theme with blue accents',
    colors: {
      bg: '#0a0e1a',
      bgSecondary: '#111827',
      card: 'rgba(17, 24, 39, 0.8)',
      cardHover: 'rgba(30, 41, 59, 0.9)',
      cardBorder: 'rgba(99, 102, 241, 0.15)',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      primary: '#6366f1',
      primaryHover: '#818cf8',
      primaryLight: 'rgba(99, 102, 241, 0.15)',
      accent: '#22d3ee',
      accentLight: 'rgba(34, 211, 238, 0.15)',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
      gradientAccent: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
      sidebarBg: 'rgba(10, 14, 26, 0.95)',
      navbarBg: 'rgba(10, 14, 26, 0.85)',
      inputBg: 'rgba(30, 41, 59, 0.6)',
      inputBorder: 'rgba(99, 102, 241, 0.2)',
      divider: 'rgba(148, 163, 184, 0.1)',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      glow: '0 0 40px rgba(99, 102, 241, 0.3)',
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Breeze',
    icon: '🌊',
    description: 'Cool ocean-inspired dark theme',
    colors: {
      bg: '#0c1222',
      bgSecondary: '#0f1a2e',
      card: 'rgba(15, 26, 46, 0.85)',
      cardHover: 'rgba(22, 38, 66, 0.9)',
      cardBorder: 'rgba(6, 182, 212, 0.15)',
      text: '#e2e8f0',
      textSecondary: '#7dd3fc',
      textMuted: '#38bdf8',
      primary: '#0ea5e9',
      primaryHover: '#38bdf8',
      primaryLight: 'rgba(14, 165, 233, 0.15)',
      accent: '#2dd4bf',
      accentLight: 'rgba(45, 212, 191, 0.15)',
      success: '#34d399',
      warning: '#fbbf24',
      danger: '#f87171',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #2dd4bf 100%)',
      gradientAccent: 'linear-gradient(135deg, #2dd4bf 0%, #34d399 100%)',
      sidebarBg: 'rgba(12, 18, 34, 0.95)',
      navbarBg: 'rgba(12, 18, 34, 0.85)',
      inputBg: 'rgba(22, 38, 66, 0.6)',
      inputBorder: 'rgba(14, 165, 233, 0.2)',
      divider: 'rgba(125, 211, 252, 0.1)',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      glow: '0 0 40px rgba(14, 165, 233, 0.3)',
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    icon: '🌅',
    description: 'Warm sunset-inspired dark theme',
    colors: {
      bg: '#1a0a0a',
      bgSecondary: '#27111a',
      card: 'rgba(39, 17, 26, 0.85)',
      cardHover: 'rgba(55, 25, 38, 0.9)',
      cardBorder: 'rgba(244, 63, 94, 0.15)',
      text: '#fce7f3',
      textSecondary: '#fda4af',
      textMuted: '#fb7185',
      primary: '#f43f5e',
      primaryHover: '#fb7185',
      primaryLight: 'rgba(244, 63, 94, 0.15)',
      accent: '#f97316',
      accentLight: 'rgba(249, 115, 22, 0.15)',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#ef4444',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #f97316 50%, #fbbf24 100%)',
      gradientAccent: 'linear-gradient(135deg, #f97316 0%, #fbbf24 100%)',
      sidebarBg: 'rgba(26, 10, 10, 0.95)',
      navbarBg: 'rgba(26, 10, 10, 0.85)',
      inputBg: 'rgba(55, 25, 38, 0.6)',
      inputBorder: 'rgba(244, 63, 94, 0.2)',
      divider: 'rgba(253, 164, 175, 0.1)',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      glow: '0 0 40px rgba(244, 63, 94, 0.3)',
    }
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Forest',
    icon: '🌿',
    description: 'Nature-inspired green dark theme',
    colors: {
      bg: '#0a1a0f',
      bgSecondary: '#0f2918',
      card: 'rgba(15, 41, 24, 0.85)',
      cardHover: 'rgba(22, 58, 34, 0.9)',
      cardBorder: 'rgba(16, 185, 129, 0.15)',
      text: '#d1fae5',
      textSecondary: '#6ee7b7',
      textMuted: '#34d399',
      primary: '#10b981',
      primaryHover: '#34d399',
      primaryLight: 'rgba(16, 185, 129, 0.15)',
      accent: '#a3e635',
      accentLight: 'rgba(163, 230, 53, 0.15)',
      success: '#22c55e',
      warning: '#eab308',
      danger: '#ef4444',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
      gradientAccent: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
      sidebarBg: 'rgba(10, 26, 15, 0.95)',
      navbarBg: 'rgba(10, 26, 15, 0.85)',
      inputBg: 'rgba(22, 58, 34, 0.6)',
      inputBorder: 'rgba(16, 185, 129, 0.2)',
      divider: 'rgba(110, 231, 183, 0.1)',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      glow: '0 0 40px rgba(16, 185, 129, 0.3)',
    }
  },
  royal: {
    id: 'royal',
    name: 'Royal Purple',
    icon: '👑',
    description: 'Luxurious purple dark theme',
    colors: {
      bg: '#0f0a1a',
      bgSecondary: '#1a1127',
      card: 'rgba(26, 17, 39, 0.85)',
      cardHover: 'rgba(38, 25, 55, 0.9)',
      cardBorder: 'rgba(168, 85, 247, 0.15)',
      text: '#f3e8ff',
      textSecondary: '#c4b5fd',
      textMuted: '#a78bfa',
      primary: '#a855f7',
      primaryHover: '#c084fc',
      primaryLight: 'rgba(168, 85, 247, 0.15)',
      accent: '#ec4899',
      accentLight: 'rgba(236, 72, 153, 0.15)',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #6d28d9 100%)',
      gradientAccent: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      sidebarBg: 'rgba(15, 10, 26, 0.95)',
      navbarBg: 'rgba(15, 10, 26, 0.85)',
      inputBg: 'rgba(38, 25, 55, 0.6)',
      inputBorder: 'rgba(168, 85, 247, 0.2)',
      divider: 'rgba(196, 181, 253, 0.1)',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      glow: '0 0 40px rgba(168, 85, 247, 0.3)',
    }
  },
  snowlight: {
    id: 'snowlight',
    name: 'Snow Light',
    icon: '☀️',
    description: 'Clean and bright light theme',
    colors: {
      bg: '#f8fafc',
      bgSecondary: '#f1f5f9',
      card: 'rgba(255, 255, 255, 0.9)',
      cardHover: 'rgba(255, 255, 255, 1)',
      cardBorder: 'rgba(99, 102, 241, 0.12)',
      text: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
      primary: '#4f46e5',
      primaryHover: '#6366f1',
      primaryLight: 'rgba(79, 70, 229, 0.1)',
      accent: '#0891b2',
      accentLight: 'rgba(8, 145, 178, 0.1)',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)',
      gradientAccent: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
      sidebarBg: 'rgba(255, 255, 255, 0.95)',
      navbarBg: 'rgba(255, 255, 255, 0.85)',
      inputBg: 'rgba(241, 245, 249, 0.8)',
      inputBorder: 'rgba(203, 213, 225, 0.8)',
      divider: 'rgba(203, 213, 225, 0.5)',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
      glow: '0 0 40px rgba(79, 70, 229, 0.1)',
    }
  },
  warmlight: {
    id: 'warmlight',
    name: 'Warm Light',
    icon: '🌤️',
    description: 'Warm and cozy light theme',
    colors: {
      bg: '#fefce8',
      bgSecondary: '#fef9c3',
      card: 'rgba(255, 255, 255, 0.9)',
      cardHover: 'rgba(255, 255, 255, 1)',
      cardBorder: 'rgba(217, 119, 6, 0.12)',
      text: '#1c1917',
      textSecondary: '#57534e',
      textMuted: '#a8a29e',
      primary: '#d97706',
      primaryHover: '#f59e0b',
      primaryLight: 'rgba(217, 119, 6, 0.1)',
      accent: '#ea580c',
      accentLight: 'rgba(234, 88, 12, 0.1)',
      success: '#16a34a',
      warning: '#ca8a04',
      danger: '#dc2626',
      gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
      gradientAccent: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
      sidebarBg: 'rgba(255, 255, 255, 0.95)',
      navbarBg: 'rgba(255, 255, 255, 0.85)',
      inputBg: 'rgba(254, 249, 195, 0.5)',
      inputBorder: 'rgba(217, 119, 6, 0.2)',
      divider: 'rgba(217, 119, 6, 0.1)',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.06)',
      glow: '0 0 40px rgba(217, 119, 6, 0.1)',
    }
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    icon: '🤖',
    description: 'Neon cyberpunk dark theme',
    colors: {
      bg: '#0a0a0f',
      bgSecondary: '#12121a',
      card: 'rgba(18, 18, 26, 0.9)',
      cardHover: 'rgba(25, 25, 38, 0.95)',
      cardBorder: 'rgba(0, 255, 136, 0.15)',
      text: '#e0ffe0',
      textSecondary: '#00ff88',
      textMuted: '#00cc6a',
      primary: '#00ff88',
      primaryHover: '#33ff9f',
      primaryLight: 'rgba(0, 255, 136, 0.1)',
      accent: '#ff0080',
      accentLight: 'rgba(255, 0, 128, 0.1)',
      success: '#00ff88',
      warning: '#ffff00',
      danger: '#ff0040',
      gradient: 'linear-gradient(135deg, #00ff88 0%, #00ccff 50%, #ff0080 100%)',
      gradientAccent: 'linear-gradient(135deg, #ff0080 0%, #ff00ff 100%)',
      sidebarBg: 'rgba(10, 10, 15, 0.98)',
      navbarBg: 'rgba(10, 10, 15, 0.9)',
      inputBg: 'rgba(25, 25, 38, 0.7)',
      inputBorder: 'rgba(0, 255, 136, 0.25)',
      divider: 'rgba(0, 255, 136, 0.1)',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      glow: '0 0 60px rgba(0, 255, 136, 0.2)',
    }
  },
  // Light themes
  oceanlight: {
    id: 'oceanlight',
    name: 'Ocean Light',
    icon: '🌊',
    description: 'Fresh ocean-inspired light theme',
    colors: {
      bg: '#f0f9ff',
      bgSecondary: '#e0f2fe',
      card: 'rgba(255, 255, 255, 0.95)',
      cardHover: 'rgba(255, 255, 255, 1)',
      cardBorder: 'rgba(14, 165, 233, 0.15)',
      text: '#0c4a6e',
      textSecondary: '#0369a1',
      textMuted: '#0284c7',
      primary: '#0284c7',
      primaryHover: '#0ea5e9',
      primaryLight: 'rgba(14, 165, 233, 0.12)',
      accent: '#0891b2',
      accentLight: 'rgba(8, 145, 178, 0.1)',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 50%, #2dd4bf 100%)',
      gradientAccent: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
      sidebarBg: 'rgba(240, 249, 255, 0.98)',
      navbarBg: 'rgba(255, 255, 255, 0.9)',
      inputBg: 'rgba(224, 242, 254, 0.6)',
      inputBorder: 'rgba(14, 165, 233, 0.3)',
      divider: 'rgba(14, 165, 233, 0.15)',
      shadow: '0 25px 50px -12px rgba(14, 165, 233, 0.15)',
      glow: '0 0 40px rgba(14, 165, 233, 0.1)',
    }
  },
  sunsetlight: {
    id: 'sunsetlight',
    name: 'Sunset Light',
    icon: '🌅',
    description: 'Warm sunset-inspired light theme',
    colors: {
      bg: '#fff7ed',
      bgSecondary: '#ffedd5',
      card: 'rgba(255, 255, 255, 0.95)',
      cardHover: 'rgba(255, 255, 255, 1)',
      cardBorder: 'rgba(249, 115, 22, 0.15)',
      text: '#7c2d12',
      textSecondary: '#c2410c',
      textMuted: '#ea580c',
      primary: '#ea580c',
      primaryHover: '#f97316',
      primaryLight: 'rgba(249, 115, 22, 0.12)',
      accent: '#f43f5e',
      accentLight: 'rgba(244, 63, 94, 0.1)',
      success: '#16a34a',
      warning: '#ca8a04',
      danger: '#dc2626',
      gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fbbf24 100%)',
      gradientAccent: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
      sidebarBg: 'rgba(255, 247, 237, 0.98)',
      navbarBg: 'rgba(255, 255, 255, 0.9)',
      inputBg: 'rgba(255, 237, 213, 0.6)',
      inputBorder: 'rgba(249, 115, 22, 0.3)',
      divider: 'rgba(249, 115, 22, 0.15)',
      shadow: '0 25px 50px -12px rgba(249, 115, 22, 0.12)',
      glow: '0 0 40px rgba(249, 115, 22, 0.1)',
    }
  },
  emeraldlight: {
    id: 'emeraldlight',
    name: 'Emerald Light',
    icon: '🌿',
    description: 'Fresh nature-inspired light theme',
    colors: {
      bg: '#f0fdf4',
      bgSecondary: '#dcfce7',
      card: 'rgba(255, 255, 255, 0.95)',
      cardHover: 'rgba(255, 255, 255, 1)',
      cardBorder: 'rgba(16, 185, 129, 0.15)',
      text: '#14532d',
      textSecondary: '#15803d',
      textMuted: '#16a34a',
      primary: '#16a34a',
      primaryHover: '#22c55e',
      primaryLight: 'rgba(16, 185, 129, 0.12)',
      accent: '#84cc16',
      accentLight: 'rgba(132, 204, 22, 0.1)',
      success: '#16a34a',
      warning: '#ca8a04',
      danger: '#dc2626',
      gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #84cc16 100%)',
      gradientAccent: 'linear-gradient(135deg, #22c55e 0%, #a3e635 100%)',
      sidebarBg: 'rgba(240, 253, 244, 0.98)',
      navbarBg: 'rgba(255, 255, 255, 0.9)',
      inputBg: 'rgba(220, 252, 231, 0.6)',
      inputBorder: 'rgba(16, 185, 129, 0.3)',
      divider: 'rgba(16, 185, 129, 0.15)',
      shadow: '0 25px 50px -12px rgba(16, 185, 129, 0.12)',
      glow: '0 0 40px rgba(16, 185, 129, 0.1)',
    }
  },
  royallight: {
    id: 'royallight',
    name: 'Royal Light',
    icon: '👑',
    description: 'Elegant purple light theme',
    colors: {
      bg: '#faf5ff',
      bgSecondary: '#f3e8ff',
      card: 'rgba(255, 255, 255, 0.95)',
      cardHover: 'rgba(255, 255, 255, 1)',
      cardBorder: 'rgba(168, 85, 247, 0.15)',
      text: '#581c87',
      textSecondary: '#7e22ce',
      textMuted: '#9333ea',
      primary: '#9333ea',
      primaryHover: '#a855f7',
      primaryLight: 'rgba(168, 85, 247, 0.12)',
      accent: '#ec4899',
      accentLight: 'rgba(236, 72, 153, 0.1)',
      success: '#16a34a',
      warning: '#ca8a04',
      danger: '#dc2626',
      gradient: 'linear-gradient(135deg, #9333ea 0%, #a855f7 50%, #c084fc 100%)',
      gradientAccent: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      sidebarBg: 'rgba(250, 245, 255, 0.98)',
      navbarBg: 'rgba(255, 255, 255, 0.9)',
      inputBg: 'rgba(243, 232, 255, 0.6)',
      inputBorder: 'rgba(168, 85, 247, 0.3)',
      divider: 'rgba(168, 85, 247, 0.15)',
      shadow: '0 25px 50px -12px rgba(168, 85, 247, 0.12)',
      glow: '0 0 40px rgba(168, 85, 247, 0.1)',
    }
  },
  roseLight: {
    id: 'roseLight',
    name: 'Rose Light',
    icon: '🌸',
    description: 'Soft pink light theme',
    colors: {
      bg: '#fdf2f8',
      bgSecondary: '#fce7f3',
      card: 'rgba(255, 255, 255, 0.95)',
      cardHover: 'rgba(255, 255, 255, 1)',
      cardBorder: 'rgba(236, 72, 153, 0.15)',
      text: '#831843',
      textSecondary: '#be185d',
      textMuted: '#db2777',
      primary: '#db2777',
      primaryHover: '#ec4899',
      primaryLight: 'rgba(236, 72, 153, 0.12)',
      accent: '#f43f5e',
      accentLight: 'rgba(244, 63, 94, 0.1)',
      success: '#16a34a',
      warning: '#ca8a04',
      danger: '#dc2626',
      gradient: 'linear-gradient(135deg, #db2777 0%, #ec4899 50%, #f472b6 100%)',
      gradientAccent: 'linear-gradient(135deg, #ec4899 0%, #fb7185 100%)',
      sidebarBg: 'rgba(253, 242, 248, 0.98)',
      navbarBg: 'rgba(255, 255, 255, 0.9)',
      inputBg: 'rgba(252, 231, 243, 0.6)',
      inputBorder: 'rgba(236, 72, 153, 0.3)',
      divider: 'rgba(236, 72, 153, 0.15)',
      shadow: '0 25px 50px -12px rgba(236, 72, 153, 0.12)',
      glow: '0 0 40px rgba(236, 72, 153, 0.1)',
    }
  },
};

const applyThemeToDOM = (theme) => {
  const root = document.documentElement;
  const colors = theme.colors;
  
  // Remove all theme classes
  Object.keys(themes).forEach(key => {
    root.classList.remove(`theme-${key}`);
  });
  root.classList.remove('light', 'dark');
  
  // Add current theme class
  root.classList.add(`theme-${theme.id}`);
  
  // Determine if light or dark
  const isLight = ['snowlight', 'warmlight', 'oceanlight', 'sunsetlight', 'emeraldlight', 'royallight', 'roseLight'].includes(theme.id);
  root.classList.add(isLight ? 'light' : 'dark');
  
  // Apply CSS custom properties
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('rfit-theme');
    return saved && themes[saved] ? saved : 'midnight';
  });

  const theme = themes[currentTheme];
  const isLight = ['snowlight', 'warmlight', 'oceanlight', 'sunsetlight', 'emeraldlight', 'royallight', 'roseLight'].includes(currentTheme);

  useEffect(() => {
    applyThemeToDOM(theme);
    localStorage.setItem('rfit-theme', currentTheme);
  }, [currentTheme, theme]);

  const setTheme = (themeId) => {
    if (themes[themeId]) {
      setCurrentTheme(themeId);
    }
  };

  const toggleTheme = () => {
    // Toggle between a random dark and light theme
    const darkThemesList = ['midnight', 'ocean', 'sunset', 'emerald', 'royal', 'cyberpunk'];
    const lightThemesList = ['snowlight', 'warmlight', 'oceanlight', 'sunsetlight', 'emeraldlight', 'royallight', 'roseLight'];
    
    if (isLight) {
      // Switch to a random dark theme
      const randomDark = darkThemesList[Math.floor(Math.random() * darkThemesList.length)];
      setCurrentTheme(randomDark);
    } else {
      // Switch to a random light theme
      const randomLight = lightThemesList[Math.floor(Math.random() * lightThemesList.length)];
      setCurrentTheme(randomLight);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      currentTheme, 
      setTheme, 
      toggleTheme, 
      isLight,
      isDark: !isLight,
      themes 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
