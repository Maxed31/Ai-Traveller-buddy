import React from 'react';
import { Send } from 'lucide-react';
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
          Effortlessly plan your next adventure. From itinerary creation to real-time recommendations, TravelBuddy AI is the only travel partner you'll ever need.
        </p>
        
        {/* Call to Action Section */}
        <div className="hero-actions">
          <button 
            className="hero-primary-btn"
            style={{ 
              backgroundColor: currentTheme.primary,
              ringColor: theme === 'light' ? 'rgba(30, 136, 229, 0.4)' : 'rgba(144, 202, 249, 0.4)'
            }}
          >
            <Send size={20} />
            Start Planning Now
          </button>
          <button 
            className="hero-secondary-btn"
            style={{ 
              backgroundColor: currentTheme.surface,
              color: currentTheme.textPrimary,
              ringColor: theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'
            }}
          >
            Learn More
          </button>
        </div>
      </div>
    </main>
  );
};

export default Hero;