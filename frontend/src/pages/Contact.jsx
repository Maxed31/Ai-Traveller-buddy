import React, { useEffect, useState } from 'react';
import Header, { useTheme } from '../components/Header';
import { 
    Mail, 
    MessageCircle, 
    MapPin, 
    Phone, 
    Send, 
    User, 
    Globe, 
    Clock,
    Heart,
    Star,
    CheckCircle2
} from 'lucide-react';
import './Contact.css';

const Contact = () => {
    const { currentTheme } = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            
            // Reset success message after 5 seconds
            setTimeout(() => {
                setIsSubmitted(false);
            }, 5000);
        }, 2000);
    };

    const contactMethods = [
        {
            icon: <Mail size={32} />,
            title: "Email Us",
            description: "Send us an email and we'll respond within 24 hours",
            contact: "hello@travelbuddy.com",
            action: "mailto:hello@travelbuddy.com"
        },
        {
            icon: <MessageCircle size={32} />,
            title: "Live Chat",
            description: "Chat with our AI assistant for instant help",
            contact: "Available 24/7",
            action: "/travel-chat"
        },
        {
            icon: <Phone size={32} />,
            title: "Call Us",
            description: "Speak with our support team",
            contact: "+1 (555) 123-4567",
            action: "tel:+15551234567"
        }
    ];

    const faqs = [
        {
            question: "How does the AI trip planning work?",
            answer: "Our AI analyzes your preferences, destination, and duration to create personalized day-by-day itineraries with activities, attractions, and recommendations tailored to your interests."
        },
        {
            question: "Is Travel Buddy really free to use?",
            answer: "Yes! Travel Buddy is completely free to use. We believe everyone should have access to intelligent travel planning tools."
        },
        {
            question: "Can I modify my itinerary after it's created?",
            answer: "Absolutely! You can easily modify destinations, duration, start/end cities, or ask for completely new recommendations at any time."
        },
        {
            question: "Which countries and destinations are supported?",
            answer: "Travel Buddy supports trip planning for destinations worldwide. Our AI has knowledge of attractions, activities, and travel information for countries across all continents."
        }
    ];

    return (
        <>
            <Header />
            <div 
                className="contact-container"
                style={{ backgroundColor: currentTheme.background }}
            >
                {/* Hero Section */}
                <div className="contact-hero">
                    <div className="contact-hero-content">
                        <h1 
                            className="contact-hero-title"
                            style={{ color: currentTheme.textPrimary }}
                        >
                            Get in Touch
                        </h1>
                        <p 
                            className="contact-hero-subtitle"
                            style={{ color: currentTheme.textSecondary }}
                        >
                            Have questions about Travel Buddy? Need help planning your trip? 
                            We're here to help you every step of the way!
                        </p>
                        <div className="contact-hero-badges">
                            <span 
                                className="contact-badge"
                                style={{ 
                                    backgroundColor: currentTheme.primary,
                                    color: '#fff'
                                }}
                            >
                                <Clock size={16} /> 24/7 Support
                            </span>
                            <span 
                                className="contact-badge"
                                style={{ 
                                    backgroundColor: currentTheme.secondary,
                                    color: '#fff'
                                }}
                            >
                                <Heart size={16} /> Friendly Team
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contact Methods */}
                <section className="contact-methods-section">
                    <div className="contact-section-header">
                        <h2 
                            className="contact-section-title"
                            style={{ color: currentTheme.textPrimary }}
                        >
                            How Can We Help?
                        </h2>
                        <p 
                            className="contact-section-subtitle"
                            style={{ color: currentTheme.textSecondary }}
                        >
                            Choose your preferred way to reach us
                        </p>
                    </div>

                    <div className="contact-methods-grid">
                        {contactMethods.map((method, index) => (
                            <div 
                                key={index}
                                className="contact-method-card"
                                style={{
                                    backgroundColor: currentTheme.surface,
                                    border: `1px solid ${currentTheme.border}`,
                                    boxShadow: currentTheme.name === 'dark' 
                                        ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                                        : '0 4px 20px rgba(0, 0, 0, 0.1)'
                                }}
                                onClick={() => {
                                    if (method.action.startsWith('/')) {
                                        window.location.href = method.action;
                                    } else {
                                        window.open(method.action, '_blank');
                                    }
                                }}
                            >
                                <div 
                                    className="contact-method-icon"
                                    style={{ color: currentTheme.primary }}
                                >
                                    {method.icon}
                                </div>
                                <div className="contact-method-content">
                                    <h3 
                                        className="contact-method-title"
                                        style={{ color: currentTheme.textPrimary }}
                                    >
                                        {method.title}
                                    </h3>
                                    <p 
                                        className="contact-method-description"
                                        style={{ color: currentTheme.textSecondary }}
                                    >
                                        {method.description}
                                    </p>
                                    <div 
                                        className="contact-method-contact"
                                        style={{ color: currentTheme.primary }}
                                    >
                                        {method.contact}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Form */}
                <section className="contact-form-section">
                    <div className="contact-form-container">
                        <div className="contact-form-header">
                            <h2 
                                className="contact-form-title"
                                style={{ color: currentTheme.textPrimary }}
                            >
                                Send Us a Message
                            </h2>
                            <p 
                                className="contact-form-subtitle"
                                style={{ color: currentTheme.textSecondary }}
                            >
                                Fill out the form below and we'll get back to you as soon as possible
                            </p>
                        </div>

                        {isSubmitted ? (
                            <div 
                                className="contact-success-message"
                                style={{
                                    backgroundColor: currentTheme.surface,
                                    border: `1px solid ${currentTheme.border}`,
                                    color: currentTheme.textPrimary
                                }}
                            >
                                <CheckCircle2 size={48} style={{ color: currentTheme.secondary }} />
                                <h3>Message Sent Successfully!</h3>
                                <p style={{ color: currentTheme.textSecondary }}>
                                    Thank you for reaching out. We'll get back to you within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form 
                                className="contact-form"
                                onSubmit={handleSubmit}
                                style={{
                                    backgroundColor: currentTheme.surface,
                                    border: `1px solid ${currentTheme.border}`
                                }}
                            >
                                <div className="contact-form-row">
                                    <div className="contact-form-group">
                                        <label 
                                            className="contact-form-label"
                                            style={{ color: currentTheme.textPrimary }}
                                        >
                                            <User size={16} />
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="contact-form-input"
                                            style={{
                                                backgroundColor: currentTheme.background,
                                                border: `1px solid ${currentTheme.border}`,
                                                color: currentTheme.textPrimary
                                            }}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="contact-form-group">
                                        <label 
                                            className="contact-form-label"
                                            style={{ color: currentTheme.textPrimary }}
                                        >
                                            <Mail size={16} />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="contact-form-input"
                                            style={{
                                                backgroundColor: currentTheme.background,
                                                border: `1px solid ${currentTheme.border}`,
                                                color: currentTheme.textPrimary
                                            }}
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>
                                
                                <div className="contact-form-group">
                                    <label 
                                        className="contact-form-label"
                                        style={{ color: currentTheme.textPrimary }}
                                    >
                                        <Star size={16} />
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="contact-form-input"
                                        style={{
                                            backgroundColor: currentTheme.background,
                                            border: `1px solid ${currentTheme.border}`,
                                            color: currentTheme.textPrimary
                                        }}
                                        placeholder="What's this about?"
                                    />
                                </div>
                                
                                <div className="contact-form-group">
                                    <label 
                                        className="contact-form-label"
                                        style={{ color: currentTheme.textPrimary }}
                                    >
                                        <MessageCircle size={16} />
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={5}
                                        className="contact-form-textarea"
                                        style={{
                                            backgroundColor: currentTheme.background,
                                            border: `1px solid ${currentTheme.border}`,
                                            color: currentTheme.textPrimary
                                        }}
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="contact-form-submit"
                                    style={{
                                        backgroundColor: currentTheme.primary,
                                        color: '#fff',
                                        opacity: isSubmitting ? 0.7 : 1
                                    }}
                                >
                                    <Send size={20} />
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="contact-faq-section">
                    <div className="contact-section-header">
                        <h2 
                            className="contact-section-title"
                            style={{ color: currentTheme.textPrimary }}
                        >
                            Frequently Asked Questions
                        </h2>
                        <p 
                            className="contact-section-subtitle"
                            style={{ color: currentTheme.textSecondary }}
                        >
                            Quick answers to common questions
                        </p>
                    </div>

                    <div className="contact-faq-grid">
                        {faqs.map((faq, index) => (
                            <div 
                                key={index}
                                className="contact-faq-card"
                                style={{
                                    backgroundColor: currentTheme.surface,
                                    border: `1px solid ${currentTheme.border}`
                                }}
                            >
                                <h3 
                                    className="contact-faq-question"
                                    style={{ color: currentTheme.textPrimary }}
                                >
                                    {faq.question}
                                </h3>
                                <p 
                                    className="contact-faq-answer"
                                    style={{ color: currentTheme.textSecondary }}
                                >
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="contact-cta-section">
                    <div 
                        className="contact-cta-card"
                        style={{
                            backgroundColor: currentTheme.surface,
                            border: `1px solid ${currentTheme.border}`,
                            boxShadow: currentTheme.name === 'dark' 
                                ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
                                : '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div className="contact-cta-content">
                            <h2 
                                className="contact-cta-title"
                                style={{ color: currentTheme.textPrimary }}
                            >
                                Ready to Start Planning?
                            </h2>
                            <p 
                                className="contact-cta-description"
                                style={{ color: currentTheme.textSecondary }}
                            >
                                Don't wait! Start planning your dream trip today with our AI-powered travel assistant.
                            </p>
                            <button 
                                className="contact-cta-button"
                                style={{
                                    backgroundColor: currentTheme.primary,
                                    color: '#fff'
                                }}
                                onClick={() => window.location.href = '/chat-planner'}
                            >
                                <Globe size={20} />
                                Start Trip Planning
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Contact;
