import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Premium theme definitions - 5 dark + 5 light themes
export const themes = {
  // Dark Themes - 5 colors: Blue, Purple, Black, Green, Coffee
  blue: {
    id: 'blue',
    name: 'Blue Dark',
    icon: '🔵',
    description: 'Deep blue dark theme',
    colors: {
      bg: '#0a0e1a',
      bgSecondary: '#111827',
      card: 'rgba(17, 24, 39, 0.8)',
      cardHover: 'rgba(30, 41, 59, 0.9)',
      cardBorder: 'rgba(59, 130, 246, 0.15)',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      primary: '#3b82f6',
      primaryHover: '#60a5fa',
      primaryLight: 'rgba(59, 130, 246, 0.15)',
      accent: '#22d3ee',
      accentLight: 'rgba(34, 211, 238, 0.15)',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)',
      gradientAccent: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
      sidebarBg: 'rgba(10, 14, 26, 0.95)',
      navbarBg: 'rgba(10, 14, 26, 0.85)',
      inputBg: 'rgba(30, 41, 59, 0.6)',
      inputBorder: 'rgba(59, 130, 246, 0.2)',
      divider: 'rgba(148, 163, 184, 0.1)',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      glow: '0 0 40px rgba(59, 130, 246, 0.3)',
    }
  },
  purple: {
    id: 'purple',
    name: 'Purple Dark',
    icon: '🟣',
    description: 'Rich purple dark theme',
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
  black: {
    id: 'black',
    name: 'Black Dark',
    icon: '⚫',
    description: 'Pure black dark theme',
    colors: {
      bg: '#000000',
      bgSecondary: '#0a0a0a',
      card: 'rgba(20, 20, 20, 0.85)',
      cardHover: 'rgba(30, 30, 30, 0.9)',
      cardBorder: 'rgba(255, 215, 0, 0.15)',
      text: '#f5f5f5',
      textSecondary: '#ffd700',
      textMuted: '#daa520',
      primary: '#ffd700',
      primaryHover: '#ffed4a',
      primaryLight: 'rgba(255, 215, 0, 0.15)',
      accent: '#ffd700',
      accentLight: 'rgba(255, 215, 0, 0.15)',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
      gradient: 'linear-gradient(135deg, #ffd700 0%, #daa520 50%, #b8860b 100%)',
      gradientAccent: 'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)',
      sidebarBg: 'rgba(0, 0, 0, 0.95)',
      navbarBg: 'rgba(0, 0, 0, 0.85)',
      inputBg: 'rgba(30, 30, 30, 0.6)',
      inputBorder: 'rgba(255, 215, 0, 0.3)',
      divider: 'rgba(255, 215, 0, 0.1)',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      glow: '0 0 40px rgba(255, 215, 0, 0.2)',
    }
  },
  green: {
    id: 'green',
    name: 'Green Dark',
    icon: '🟢',
    description: 'Nature green dark theme',
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
  coffee: {
    id: 'coffee',
    name: 'Coffee Dark',
    icon: '☕',
    description: 'Warm coffee dark theme',
    colors: {
      bg: '#1a1410',
      bgSecondary: '#2d2319',
      card: 'rgba(45, 35, 25, 0.85)',
      cardHover: 'rgba(60, 45, 32, 0.9)',
      cardBorder: 'rgba(180, 130, 90, 0.15)',
      text: '#f5ebe0',
      textSecondary: '#d4c4b0',
      textMuted: '#a8917d',
      primary: '#c4a77d',
      primaryHover: '#d4b88d',
      primaryLight: 'rgba(196, 167, 125, 0.15)',
      accent: '#e8d5b7',
      accentLight: 'rgba(232, 213, 183, 0.15)',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
      gradient: 'linear-gradient(135deg, #c4a77d 0%, #8b6914 50%, #5c4a1f 100%)',
      gradientAccent: 'linear-gradient(135deg, #e8d5b7 0%, #d4c4a8 100%)',
      sidebarBg: 'rgba(26, 20, 16, 0.95)',
      navbarBg: 'rgba(26, 20, 16, 0.85)',
      inputBg: 'rgba(45, 35, 25, 0.6)',
      inputBorder: 'rgba(180, 130, 90, 0.2)',
      divider: 'rgba(180, 130, 90, 0.1)',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      glow: '0 0 40px rgba(196, 167, 125, 0.2)',
    }
  },
  // Light Themes - 5 colors: Blue, Purple, Gray, Green, Coffee
  bluelight: {
    id: 'bluelight',
    name: 'Blue Light',
    icon: '🔵',
    description: 'Clean blue light theme',
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
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
      gradientAccent: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
      sidebarBg: 'rgba(240, 249, 255, 0.98)',
      navbarBg: 'rgba(255, 255, 255, 0.9)',
      inputBg: 'rgba(224, 242, 254, 0.6)',
      inputBorder: 'rgba(14, 165, 233, 0.3)',
      divider: 'rgba(14, 165, 233, 0.15)',
      shadow: '0 25px 50px -12px rgba(14, 165, 233, 0.15)',
      glow: '0 0 40px rgba(14, 165, 233, 0.1)',
    }
  },
  purplelight: {
    id: 'purplelight',
    name: 'Purple Light',
    icon: '🟣',
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
  blacklight: {
    id: 'blacklight',
    name: 'Gray Light',
    icon: '⚫',
    description: 'Clean gray light theme',
    colors: {
      bg: '#f5f5f5',
      bgSecondary: '#e5e5e5',
      card: 'rgba(255, 255, 255, 0.95)',
      cardHover: 'rgba(255, 255, 255, 1)',
      cardBorder: 'rgba(115, 115, 115, 0.15)',
      text: '#171717',
      textSecondary: '#404040',
      textMuted: '#737373',
      primary: '#404040',
      primaryHover: '#525252',
      primaryLight: 'rgba(64, 64, 64, 0.1)',
      accent: '#737373',
      accentLight: 'rgba(115, 115, 115, 0.1)',
      success: '#16a34a',
      warning: '#ca8a04',
      danger: '#dc2626',
      gradient: 'linear-gradient(135deg, #404040 0%, #525252 50%, #737373 100%)',
      gradientAccent: 'linear-gradient(135deg, #737373 0%, #a3a3a3 100%)',
      sidebarBg: 'rgba(245, 245, 245, 0.98)',
      navbarBg: 'rgba(255, 255, 255, 0.9)',
      inputBg: 'rgba(229, 229, 229, 0.6)',
      inputBorder: 'rgba(115, 115, 115, 0.3)',
      divider: 'rgba(115, 115, 115, 0.15)',
      shadow: '0 25px 50px -12px rgba(115, 115, 115, 0.15)',
      glow: '0 0 40px rgba(64, 64, 64, 0.1)',
    }
  },
  greenlight: {
    id: 'greenlight',
    name: 'Green Light',
    icon: '🟢',
    description: 'Fresh green light theme',
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
      gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #4ade80 100%)',
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
  coffeelight: {
    id: 'coffeelight',
    name: 'Coffee Light',
    icon: '☕',
    description: 'Warm coffee light theme',
    colors: {
      bg: '#faf6f1',
      bgSecondary: '#f5ebe0',
      card: 'rgba(255, 255, 255, 0.95)',
      cardHover: 'rgba(255, 255, 255, 1)',
      cardBorder: 'rgba(180, 130, 90, 0.15)',
      text: '#3d2e1f',
      textSecondary: '#5c4a3a',
      textMuted: '#8b7355',
      primary: '#8b6914',
      primaryHover: '#a67c00',
      primaryLight: 'rgba(139, 105, 20, 0.12)',
      accent: '#c4a77d',
      accentLight: 'rgba(196, 167, 125, 0.1)',
      success: '#16a34a',
      warning: '#ca8a04',
      danger: '#dc2626',
      gradient: 'linear-gradient(135deg, #8b6914 0%, #a67c00 50%, #c4a77d 100%)',
      gradientAccent: 'linear-gradient(135deg, #c4a77d 0%, #d4b88d 100%)',
      sidebarBg: 'rgba(250, 246, 241, 0.98)',
      navbarBg: 'rgba(255, 255, 255, 0.9)',
      inputBg: 'rgba(245, 235, 224, 0.6)',
      inputBorder: 'rgba(180, 130, 90, 0.3)',
      divider: 'rgba(180, 130, 90, 0.15)',
      shadow: '0 25px 50px -12px rgba(139, 105, 20, 0.12)',
      glow: '0 0 40px rgba(139, 105, 20, 0.1)',
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
  const isLight = ['bluelight', 'purplelight', 'blacklight', 'greenlight', 'coffeelight'].includes(theme.id);
  root.classList.add(isLight ? 'light' : 'dark');
  
  // Apply CSS custom properties
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('rfit-theme');
    return saved && themes[saved] ? saved : 'blue';
  });

  const theme = themes[currentTheme];
  const isLight = ['bluelight', 'purplelight', 'blacklight', 'greenlight', 'coffeelight'].includes(currentTheme);

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
    // Toggle between dark and light themes
    const darkThemesList = ['blue', 'purple', 'black', 'green', 'coffee'];
    const lightThemesList = ['bluelight', 'purplelight', 'blacklight', 'greenlight', 'coffeelight'];
    
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
      currentTheme,
      theme,
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
