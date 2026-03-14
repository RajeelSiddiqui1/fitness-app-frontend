import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isLight, toggleTheme, currentTheme, theme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl menu-item-hover transition-all duration-300 group relative overflow-hidden"
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
    >
      {/* Background effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ 
          background: theme.gradient,
          opacity: 0.1
        }}
      />
      
      <div className="relative flex items-center justify-center">
        {isLight ? (
          <Moon 
            size={20} 
            className="transition-transform duration-300 group-hover:rotate-12"
            style={{ color: 'var(--theme-textSecondary)' }}
          />
        ) : (
          <Sun 
            size={20} 
            className="transition-transform duration-300 group-hover:-rotate-12"
            style={{ color: 'var(--theme-accent)' }}
          />
        )}
      </div>
      
      {/* Tooltip */}
      <div className="tooltip-content absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {isLight ? 'Switch to Dark' : 'Switch to Light'}
      </div>
    </button>
  );
};

export default ThemeToggle;
