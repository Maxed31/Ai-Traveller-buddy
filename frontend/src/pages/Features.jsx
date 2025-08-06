import React, { useEffect } from 'react';
import Header, { useTheme } from '../components/Header';
import { 
    Bot, 
    MapPin, 
    Calendar, 
    Camera, 
    MessageCircle, 
    Route, 
    Sparkles, 
    Globe, 
    Heart, 
    Zap,
    CheckCircle,
    Star
} from 'lucide-react';
import './Features.css';

const Features = () => {
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

    const mainFeatures = [
        {
            icon: <Bot size={32} />,
            title: "AI-Powered Trip Planning",
            description: "Let our advanced AI create personalized itineraries based on your preferences, duration, and destination.",
            highlights: ["Smart destination analysis", "Personalized recommendations", "Day-by-day planning"]
        },
        {
            icon: <MessageCircle size={32} />,
            title: "Intelligent Chat Interface",
            description: "Natural conversation with our AI travel assistant. Just tell us where you want to go!",
            highlights: ["Natural language processing", "Context-aware responses", "Trip modification support"]
        },
        {
            icon: <Camera size={32} />,
            title: "Beautiful Destination Photos",
            description: "Discover stunning photos of your destinations fetched from professional photography sources.",
            highlights: ["High-quality images", "Real destination photos", "Visual trip preview"]
        },
        {
            icon: <Route size={32} />,
            title: "Flexible Trip Customization",
            description: "Modify your trips on the fly - change destinations, duration, or starting points effortlessly.",
            highlights: ["Real-time modifications", "Smart re-planning", "Flexible itineraries"]
        }
    ];

    const additionalFeatures = [
        {
            icon: <MapPin size={24} />,
            title: "Multi-City Planning",
            description: "Plan trips with specific start and end cities"
        },
        {
            icon: <Calendar size={24} />,
            title: "Duration Flexibility",
            description: "From weekend getaways to month-long adventures"
        },
        {
            icon: <Globe size={24} />,
            title: "Global Destinations",
            description: "Plan trips to any country around the world"
        },
        {
            icon: <Sparkles size={24} />,
            title: "Smart Parsing",
            description: "AI understands your travel requests naturally"
        },
        {
            icon: <Heart size={24} />,
            title: "Personalized Experience",
            description: "Tailored recommendations for your interests"
        },
        {
            icon: <Zap size={24} />,
            title: "Instant Results",
            description: "Get your complete itinerary in seconds"
        }
    ];

    return (
        <>
            <Header />
            <div 
                className="features-container"
                style={{ backgroundColor: currentTheme.background }}
            >
            {/* Hero Section */}
            <div className="features-hero">
                <div className="features-hero-content">
                    <h1 
                        className="features-hero-title"
                        style={{ color: currentTheme.textPrimary }}
                    >
                        Discover Amazing Features
                    </h1>
                    <p 
                        className="features-hero-subtitle"
                        style={{ color: currentTheme.textSecondary }}
                    >
                        Travel Buddy combines cutting-edge AI technology with intuitive design 
                        to create the ultimate travel planning experience
                    </p>
                    <div className="features-hero-badges">
                        <span 
                            className="features-badge"
                            style={{ 
                                backgroundColor: currentTheme.primary,
                                color: '#fff'
                            }}
                        >
                            <Star size={16} /> AI-Powered
                        </span>
                        <span 
                            className="features-badge"
                            style={{ 
                                backgroundColor: currentTheme.secondary,
                                color: '#fff'
                            }}
                        >
                            <CheckCircle size={16} /> Free to Use
                        </span>
                        <span 
                            className="features-badge"
                            style={{ 
                                backgroundColor: currentTheme.surface,
                                color: currentTheme.textPrimary,
                                border: `1px solid ${currentTheme.border}`
                            }}
                        >
                            <Globe size={16} /> Global Coverage
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Features */}
            <section className="features-main-section">
                <div className="features-section-header">
                    <h2 
                        className="features-section-title"
                        style={{ color: currentTheme.textPrimary }}
                    >
                        Core Features
                    </h2>
                    <p 
                        className="features-section-subtitle"
                        style={{ color: currentTheme.textSecondary }}
                    >
                        Everything you need for perfect trip planning
                    </p>
                </div>

                <div className="features-main-grid">
                    {mainFeatures.map((feature, index) => (
                        <div 
                            key={index}
                            className="features-main-card"
                            style={{
                                backgroundColor: currentTheme.surface,
                                border: `1px solid ${currentTheme.border}`,
                                boxShadow: currentTheme.name === 'dark' 
                                    ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                                    : '0 4px 20px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <div 
                                className="features-card-icon"
                                style={{ color: currentTheme.primary }}
                            >
                                {feature.icon}
                            </div>
                            <div className="features-card-content">
                                <h3 
                                    className="features-card-title"
                                    style={{ color: currentTheme.textPrimary }}
                                >
                                    {feature.title}
                                </h3>
                                <p 
                                    className="features-card-description"
                                    style={{ color: currentTheme.textSecondary }}
                                >
                                    {feature.description}
                                </p>
                                <ul className="features-card-highlights">
                                    {feature.highlights.map((highlight, hIndex) => (
                                        <li 
                                            key={hIndex}
                                            style={{ color: currentTheme.textSecondary }}
                                        >
                                            <CheckCircle size={16} style={{ color: currentTheme.secondary }} />
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Additional Features */}
            <section className="features-additional-section">
                <div className="features-section-header">
                    <h2 
                        className="features-section-title"
                        style={{ color: currentTheme.textPrimary }}
                    >
                        Additional Features
                    </h2>
                    <p 
                        className="features-section-subtitle"
                        style={{ color: currentTheme.textSecondary }}
                    >
                        More reasons to love Travel Buddy
                    </p>
                </div>

                <div className="features-additional-grid">
                    {additionalFeatures.map((feature, index) => (
                        <div 
                            key={index}
                            className="features-additional-card"
                            style={{
                                backgroundColor: currentTheme.surface,
                                border: `1px solid ${currentTheme.border}`
                            }}
                        >
                            <div 
                                className="features-additional-icon"
                                style={{ color: currentTheme.secondary }}
                            >
                                {feature.icon}
                            </div>
                            <div className="features-additional-content">
                                <h4 
                                    className="features-additional-title"
                                    style={{ color: currentTheme.textPrimary }}
                                >
                                    {feature.title}
                                </h4>
                                <p 
                                    className="features-additional-description"
                                    style={{ color: currentTheme.textSecondary }}
                                >
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="features-cta-section">
                <div 
                    className="features-cta-card"
                    style={{
                        backgroundColor: currentTheme.surface,
                        border: `1px solid ${currentTheme.border}`,
                        boxShadow: currentTheme.name === 'dark' 
                            ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
                            : '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <div className="features-cta-content">
                        <h2 
                            className="features-cta-title"
                            style={{ color: currentTheme.textPrimary }}
                        >
                            Ready to Plan Your Next Adventure?
                        </h2>
                        <p 
                            className="features-cta-description"
                            style={{ color: currentTheme.textSecondary }}
                        >
                            Start planning your perfect trip with our AI-powered travel assistant. 
                            It's free, fast, and incredibly smart!
                        </p>
                        <div className="features-cta-buttons">
                            <button 
                                className="features-cta-primary"
                                style={{
                                    backgroundColor: currentTheme.primary,
                                    color: '#fff'
                                }}
                                onClick={() => window.location.href = '/chat-planner'}
                            >
                                <Route size={20} />
                                Start Trip Planning
                            </button>
                            <button 
                                className="features-cta-secondary"
                                style={{
                                    backgroundColor: 'transparent',
                                    color: currentTheme.textPrimary,
                                    border: `2px solid ${currentTheme.border}`
                                }}
                                onClick={() => window.location.href = '/contact'}
                            >
                                <MessageCircle size={20} />
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        </>
    );
};

export default Features;
