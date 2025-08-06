import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Planner from './Planner';
import ChatPlanner from './ChatPlanner';
import GeneralChat from './GeneralChat';
import { ThemeProvider, useTheme } from '../components/Header';
import './ComingSoon.css';

// Import other pages here as you create them
// import Dashboard from './Dashboard';
// import Profile from './Profile';
// import TripPlanner from './TripPlanner';
// import Features from './Features';
// import Pricing from './Pricing';
// import Contact from './Contact';

// Placeholder component for pages that don't exist yet
const ComingSoon = ({ pageName }) => {
  const { currentTheme } = useTheme();
  
  React.useEffect(() => {
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
      className="coming-soon-container"
      style={{ 
        backgroundColor: currentTheme.background,
      }}
    >
      <div className="coming-soon-content">
        <h1 
          className="coming-soon-title"
          style={{ color: currentTheme.textPrimary }}
        >
          {pageName} Page
        </h1>
        <p 
          className="coming-soon-subtitle"
          style={{ color: currentTheme.textSecondary }}
        >
          Coming Soon...
        </p>
      </div>
    </div>
  );
};

// Page wrapper to include header in all pages
const PageWrapper = ({ children }) => {
  const { currentTheme } = useTheme();
  return (
    <div 
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
      style={{ backgroundColor: currentTheme.background }}
    >
      {children}
    </div>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Default route - redirects to landing page */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Landing page route */}
        <Route path="/home" element={<LandingPage />} />
        
        {/* Travel Planner routes */}
        <Route path="/planner" element={
          <ThemeProvider>
            <Planner />
          </ThemeProvider>
        } />
        <Route path="/chat-planner" element={
          <ThemeProvider>
            <ChatPlanner />
          </ThemeProvider>
        } />
        <Route path="/travel-chat" element={
          <ThemeProvider>
            <GeneralChat />
          </ThemeProvider>
        } />
        
        {/* Legacy route for backward compatibility */}
        <Route path="/chat" element={<Navigate to="/chat-planner" replace />} />
        
        {/* Navigation routes (placeholder for now) */}
        <Route path="/features" element={
          <ThemeProvider>
            <ComingSoon pageName="Features" />
          </ThemeProvider>
        } />
        <Route path="/pricing" element={
          <ThemeProvider>
            <ComingSoon pageName="Pricing" />
          </ThemeProvider>
        } />
        <Route path="/contact" element={
          <ThemeProvider>
            <ComingSoon pageName="Contact" />
          </ThemeProvider>
        } />
        
        {/* Add more routes here as you create pages */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/trip-planner" element={<TripPlanner />} /> */}
        
        {/* Catch-all route for 404 - redirects to landing page */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;