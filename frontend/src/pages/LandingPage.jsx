import React, { useEffect } from 'react';
import Header, { ThemeProvider, useTheme } from '../components/Header';
import Hero from '../components/Hero';
import './LandingPage.css';

const LandingPageContent = () => {
  const { currentTheme } = useTheme();

  useEffect(() => {
    // Apply theme to body
    document.body.style.backgroundColor = currentTheme.background;
    document.body.style.color = currentTheme.textPrimary;
    
    return () => {
      // Clean up on unmount
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, [currentTheme]);

  return (
    <div 
      className="landing-container"
      style={{ backgroundColor: currentTheme.background }}
    >
      <Header />
      <Hero />
    </div>
  );
};

const LandingPage = () => {
  return (
    <ThemeProvider>
      <LandingPageContent />
    </ThemeProvider>
  );
};

export default LandingPage;