import React from 'react';
import { Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from './Header';
import './Hero.css';

const Hero = () => {
  const { theme, currentTheme } = useTheme();

  return (
    <main className="hero-main">
      <div className="hero-container">
        <h2 
          className="hero-heading"
          style={{ color: currentTheme.textPrimary }}
        >
          Your Ultimate <span style={{ color: currentTheme.primary }}>Travel AI</span> Companion
        </h2>
        <p 
          className="hero-description"
          style={{ color: currentTheme.textSecondary }}
        >
          Effortlessly plan your next adventure. From itinerary creation to real-time recommendations, Travel Buddy is the only travel partner you'll ever need.
        </p>
        
        {/* Call to Action Section */}
        <div className="hero-actions">
          <Link 
            to="/chat-planner"
            className="hero-primary-btn"
            style={{ 
              backgroundColor: currentTheme.primary,
              ringColor: theme === 'light' ? 'rgba(30, 136, 229, 0.4)' : 'rgba(144, 202, 249, 0.4)'
            }}
          >
            <Send size={20} />
            Plan a Trip
          </Link>
          <Link 
            to="/travel-chat"
            className="hero-secondary-btn"
            style={{ 
              backgroundColor: currentTheme.secondary,
              color: '#fff',
              ringColor: theme === 'light' ? 'rgba(67, 160, 71, 0.4)' : 'rgba(102, 187, 106, 0.4)'
            }}
          >
            Travel Chat
          </Link>
          <Link 
            to="/planner"
            className="hero-tertiary-btn"
            style={{ 
              backgroundColor: currentTheme.surface,
              color: currentTheme.textPrimary,
              ringColor: theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'
            }}
          >
            Form Planner
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Hero;