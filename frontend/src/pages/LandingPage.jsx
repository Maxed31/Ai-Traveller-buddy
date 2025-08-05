import React from 'react';
import Header, { ThemeProvider, useTheme } from '../components/Header';
import Hero from '../components/Hero';
import './LandingPage.css';

const LandingPageContent = () => {
  const { currentTheme } = useTheme();

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