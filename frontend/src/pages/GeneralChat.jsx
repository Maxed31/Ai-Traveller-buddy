import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, LoaderCircle, RotateCcw, Route } from 'lucide-react';
import Header, { useTheme } from '../components/Header';
import { useNavigate } from 'react-router-dom';
import './GeneralChat.css';

const GeneralChat = () => {
    const { currentTheme } = useTheme();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: "Hi there! 🌍 I'm your travel buddy and I love chatting about all things travel! Ask me about destinations, travel tips, cultural insights, or just share your travel dreams with me! If you want to plan a specific itinerary, I can redirect you to our trip planner. ✈️",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    const addMessage = (type, content) => {
        const newMessage = {
            type,
            content,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        addMessage('user', userMessage);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Check if user is asking for trip planning
            const planningKeywords = ['plan', 'itinerary', 'schedule', 'trip plan', 'travel plan', 'organize trip', 'plan my trip'];
            const isAskingForPlanning = planningKeywords.some(keyword => 
                userMessage.toLowerCase().includes(keyword)
            );

            if (isAskingForPlanning) {
                addMessage('bot', "It sounds like you want to plan a specific trip! 🗺️ I'd love to help you create a detailed itinerary. Let me redirect you to our Trip Planner where I can help you plan day-by-day activities!");
                
                // Add a button or link to navigate
                setTimeout(() => {
                    addMessage('bot', "Click here to go to the Trip Planner, or I can continue our general travel chat! 😊");
                }, 1000);
                
                setIsLoading(false);
                return;
            }

            // Send to general chat API
            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMessage,
                    context: "General travel conversation - not for trip planning"
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    addMessage('bot', result.data);
                } else {
                    addMessage('bot', 'That\'s an interesting question! I love talking about travel. What else would you like to know? 🌟');
                }
            } else {
                addMessage('bot', 'I\'m having a small hiccup, but I\'m still here to chat about travel! What would you like to talk about? 😊');
            }
        } catch (error) {
            console.error("Error in general chat:", error);
            addMessage('bot', 'Oops! Something went wrong, but I\'m still excited to chat about travel with you! ✈️');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([
            {
                type: 'bot',
                content: "Hi there! 🌍 I'm your travel buddy and I love chatting about all things travel! Ask me about destinations, travel tips, cultural insights, or just share your travel dreams with me! If you want to plan a specific itinerary, I can redirect you to our trip planner. ✈️",
                timestamp: new Date()
            }
        ]);
    };

    const handleGoToPlanner = () => {
        navigate('/chat-planner');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            <Header />
            <div 
                className="general-chat-container"
                style={{ backgroundColor: currentTheme.background }}
            >
                <div className="general-chat-header">
                    <div className="general-chat-title-section">
                        <MessageCircle size={24} style={{color: currentTheme.secondary}} />
                        <h2 style={{color: currentTheme.textPrimary}}>Travel Chat</h2>
                        <span style={{color: currentTheme.textSecondary, fontSize: '14px'}}>
                            General travel conversation
                        </span>
                    </div>
                    <div className="general-chat-actions">
                        <button 
                            onClick={handleGoToPlanner}
                            className="general-chat-planner-btn"
                            style={{
                                backgroundColor: currentTheme.primary,
                                color: '#fff',
                                border: 'none'
                            }}
                        >
                            <Route size={16} />
                            Trip Planner
                        </button>
                        <button 
                            onClick={handleClearChat}
                            className="general-chat-clear-btn"
                            style={{
                                backgroundColor: currentTheme.surface,
                                color: currentTheme.textPrimary,
                                border: `1px solid ${currentTheme.border}`
                            }}
                        >
                            <RotateCcw size={16} />
                            Clear Chat
                        </button>
                    </div>
                </div>

                <div className="general-chat-messages">
                    {messages.map((message, index) => (
                        <div 
                            key={index}
                            className={`general-chat-message ${message.type}`}
                        >
                            <div className="general-chat-message-avatar">
                                {message.type === 'bot' ? (
                                    <MessageCircle size={20} style={{color: currentTheme.secondary}} />
                                ) : (
                                    <User size={20} style={{color: currentTheme.primary}} />
                                )}
                            </div>
                            <div 
                                className="general-chat-message-content"
                                style={{
                                    backgroundColor: message.type === 'user' ? currentTheme.primary : currentTheme.surface,
                                    color: message.type === 'user' ? '#fff' : currentTheme.textPrimary,
                                    border: message.type !== 'user' ? `1px solid ${currentTheme.border}` : 'none'
                                }}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="general-chat-message bot">
                            <div className="general-chat-message-avatar">
                                <MessageCircle size={20} style={{color: currentTheme.secondary}} />
                            </div>
                            <div 
                                className="general-chat-message-content general-chat-loading"
                                style={{
                                    backgroundColor: currentTheme.surface,
                                    border: `1px solid ${currentTheme.border}`
                                }}
                            >
                                <LoaderCircle 
                                    className="general-chat-loading-spinner" 
                                    size={20} 
                                    style={{color: currentTheme.secondary}} 
                                />
                                <span style={{color: currentTheme.textSecondary}}>Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div 
                    className="general-chat-input-container"
                    style={{
                        backgroundColor: currentTheme.surface,
                        border: `1px solid ${currentTheme.border}`
                    }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me about travel, destinations, tips... (e.g., 'What's the best food in Italy?')"
                        className="general-chat-input"
                        style={{
                            backgroundColor: 'transparent',
                            color: currentTheme.textPrimary
                        }}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="general-chat-send-btn"
                        style={{
                            backgroundColor: currentTheme.secondary,
                            opacity: (!inputMessage.trim() || isLoading) ? 0.5 : 1
                        }}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default GeneralChat;
