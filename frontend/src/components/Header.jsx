import React, { useState, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Globe } from 'lucide-react';
import './Header.css';

const themes = {
  light: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    primary: '#1E88E5',
    accent: '#F9A825',
    secondary: '#43A047',
    textPrimary: '#212121',
    textSecondary: '#616161',
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#90CAF9',
    accent: '#FFD54F',
    secondary: '#66BB6A',
    textPrimary: '#E0E0E0',
    textSecondary: '#BDBDBD',
  },
};

const ThemeContext = createContext();

const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const currentTheme = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const Header = () => {
  const { theme, toggleTheme, currentTheme } = useTheme();

  return (
    <header
      className="header-container"
      style={{ backgroundColor: currentTheme.surface, color: currentTheme.textPrimary }}
    >
      <div className="header-content">
        {/* App Logo/Name */}
        <div className="logo-section">
          <Globe className="logo-icon" style={{ color: currentTheme.primary }} />
          <Link to="/home" className="logo-text">
            Travel Buddy
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="nav-menu">
          <Link to="/planner" className="nav-link" style={{color: currentTheme.textSecondary}}>Form Planner</Link>
          <Link to="/chat-planner" className="nav-link" style={{color: currentTheme.textSecondary}}>Trip Planner</Link>
          <Link to="/travel-chat" className="nav-link" style={{color: currentTheme.textSecondary}}>Travel Chat</Link>
          <Link to="/features" className="nav-link" style={{color: currentTheme.textSecondary}}>Features</Link>
          <Link to="/pricing" className="nav-link" style={{color: currentTheme.textSecondary}}>Pricing</Link>
          <Link to="/contact" className="nav-link" style={{color: currentTheme.textSecondary}}>Contact</Link>
        </nav>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          style={{ 
            backgroundColor: currentTheme.background, 
            color: currentTheme.accent,
            borderColor: currentTheme.surface,
            ringColor: currentTheme.accent,
            ringOffsetColor: currentTheme.background
          }}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </div>
    </header>
  );
};

export { ThemeProvider, useTheme };
export default Header;
