import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MapPin, LoaderCircle, RotateCcw } from 'lucide-react';
import Header, { useTheme } from '../components/Header';
import './ChatPlanner.css';

const ChatPlanner = () => {
    const { currentTheme } = useTheme();
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: "Hi! I'm your AI travel buddy 🌍 Let's plan your perfect trip! Just tell me where you want to go and for how long.",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationState, setConversationState] = useState('initial'); // initial, gathering, planning, completed
    const [tripData, setTripData] = useState({
        country: '',
        duration: '',
        startCity: '',
        finalCity: ''
    });
    
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

    const parseUserInput = async (input) => {
        try {
            const response = await fetch('http://localhost:3001/api/parse-travel-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    return result.data;
                }
            }
            
            // Fallback if AI parsing fails
            return {
                country: '',
                duration: 0,
                startCity: '',
                finalCity: '',
                hasRequiredInfo: false,
                parsedSuccessfully: false
            };
        } catch (error) {
            console.error('Error parsing user input:', error);
            // Fallback if request fails
            return {
                country: '',
                duration: 0,
                startCity: '',
                finalCity: '',
                hasRequiredInfo: false,
                parsedSuccessfully: false
            };
        }
    };

    const handleTripModification = async (userMessage) => {
        // Parse the modification request
        const parsed = await parseUserInput(userMessage);
        let hasChanges = false;
        let changeMessage = "I've updated your trip plan! 🔄\n\n";

        // Check what the user wants to change
        if (parsed.country && parsed.country !== tripData.country) {
            setTripData(prev => ({ ...prev, country: parsed.country }));
            changeMessage += `📍 Destination: ${parsed.country}\n`;
            hasChanges = true;
        }

        if (parsed.duration > 0 && parsed.duration.toString() !== tripData.duration) {
            setTripData(prev => ({ ...prev, duration: parsed.duration.toString() }));
            changeMessage += `📅 Duration: ${parsed.duration} days\n`;
            hasChanges = true;
        }

        if (parsed.startCity && parsed.startCity !== tripData.startCity) {
            setTripData(prev => ({ ...prev, startCity: parsed.startCity }));
            changeMessage += `🛫 Starting from: ${parsed.startCity}\n`;
            hasChanges = true;
        }

        if (parsed.finalCity && parsed.finalCity !== tripData.finalCity) {
            setTripData(prev => ({ ...prev, finalCity: parsed.finalCity }));
            changeMessage += `🛬 Ending in: ${parsed.finalCity}\n`;
            hasChanges = true;
        }

        if (hasChanges) {
            changeMessage += "\nLet me generate your new itinerary... ✨";
            addMessage('bot', changeMessage);
            setConversationState('planning');
            
            // Generate new itinerary with updated data
            const updatedTripData = {
                country: parsed.country || tripData.country,
                duration: parsed.duration > 0 ? parsed.duration : parseInt(tripData.duration),
                startCity: parsed.startCity || tripData.startCity,
                finalCity: parsed.finalCity || tripData.finalCity
            };
            
            await generateItinerary(
                updatedTripData.country, 
                updatedTripData.duration, 
                updatedTripData.startCity, 
                updatedTripData.finalCity
            );
        } else {
            addMessage('bot', 'I didn\'t detect any specific changes to make. Could you tell me what you\'d like to modify? For example:\n\n• "Change destination to France"\n• "Make it 10 days instead"\n• "Start from Paris"\n• "End in Rome" 🔄');
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        addMessage('user', userMessage);
        setInputMessage('');
        setIsLoading(true);

        try {
            if (conversationState === 'initial') {
                // Parse the initial input for country and duration using AI
                const parsed = await parseUserInput(userMessage);
                
                if (parsed.hasRequiredInfo) {
                    // We have both country and duration, proceed to generate itinerary
                    setTripData(prev => ({
                        ...prev,
                        country: parsed.country,
                        duration: parsed.duration.toString(),
                        startCity: parsed.startCity,
                        finalCity: parsed.finalCity
                    }));
                    
                    let responseMessage = `Perfect! I'll plan a ${parsed.duration}-day trip to ${parsed.country}`;
                    if (parsed.startCity && parsed.finalCity) {
                        responseMessage += ` starting from ${parsed.startCity} and ending in ${parsed.finalCity}`;
                    } else if (parsed.startCity) {
                        responseMessage += ` starting from ${parsed.startCity}`;
                    } else if (parsed.finalCity) {
                        responseMessage += ` ending in ${parsed.finalCity}`;
                    }
                    responseMessage += ` for you. Let me craft the perfect itinerary... ✈️`;
                    
                    addMessage('bot', responseMessage);
                    setConversationState('planning');
                    
                    // Generate itinerary
                    await generateItinerary(parsed.country, parsed.duration, parsed.startCity, parsed.finalCity);
                } else if (parsed.country) {
                    // We have country but need duration
                    setTripData(prev => ({ 
                        ...prev, 
                        country: parsed.country,
                        startCity: parsed.startCity,
                        finalCity: parsed.finalCity
                    }));
                    addMessage('bot', `Great choice! ${parsed.country} is amazing! 🎉 How many days are you planning to stay?`);
                    setConversationState('gathering');
                } else if (parsed.duration > 0) {
                    // We have duration but need country
                    setTripData(prev => ({ 
                        ...prev, 
                        duration: parsed.duration.toString(),
                        startCity: parsed.startCity,
                        finalCity: parsed.finalCity
                    }));
                    addMessage('bot', `A ${parsed.duration}-day trip sounds perfect! 🌟 Where would you like to go?`);
                    setConversationState('gathering');
                } else {
                    // Need both or couldn't parse
                    addMessage('bot', 'I\'d love to help plan your trip! Could you tell me which country you\'d like to visit and for how many days? For example: "I want to visit Italy for 7 days" 🗺️');
                }
            } else if (conversationState === 'gathering') {
                // We're gathering missing information
                const parsed = await parseUserInput(userMessage);
                
                if (!tripData.country && parsed.country) {
                    const updatedTripData = { 
                        ...tripData, 
                        country: parsed.country,
                        startCity: parsed.startCity || tripData.startCity,
                        finalCity: parsed.finalCity || tripData.finalCity
                    };
                    setTripData(updatedTripData);
                    
                    addMessage('bot', `Excellent! I'll plan your ${tripData.duration}-day adventure in ${parsed.country}. Let me create the perfect itinerary for you... 🎒`);
                    setConversationState('planning');
                    await generateItinerary(parsed.country, tripData.duration, updatedTripData.startCity, updatedTripData.finalCity);
                } else if (!tripData.duration && parsed.duration > 0) {
                    const updatedTripData = { 
                        ...tripData, 
                        duration: parsed.duration.toString(),
                        startCity: parsed.startCity || tripData.startCity,
                        finalCity: parsed.finalCity || tripData.finalCity
                    };
                    setTripData(updatedTripData);
                    
                    addMessage('bot', `Perfect! A ${parsed.duration}-day trip to ${tripData.country}. Let me craft your itinerary... 🗓️`);
                    setConversationState('planning');
                    await generateItinerary(tripData.country, parsed.duration, updatedTripData.startCity, updatedTripData.finalCity);
                } else if (!tripData.country) {
                    addMessage('bot', 'I didn\'t catch the country name. Could you please tell me which country you\'d like to visit? 🌍');
                } else if (!tripData.duration) {
                    addMessage('bot', 'How many days are you planning to stay? Please let me know the number of days! 📅');
                }
            } else if (conversationState === 'completed') {
                // Trip is completed, handle various conversational responses
                const lowerMessage = userMessage.toLowerCase();
                
                // Thank you responses
                if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('appreciate')) {
                    const thankYouResponses = [
                        "You're very welcome! I'm so excited for your trip! 🌟 Have an amazing time and feel free to come back for your next adventure! ✈️",
                        "My pleasure! I hope you have the most incredible journey! 🎒 Don't forget to make wonderful memories! 📸",
                        "You're absolutely welcome! Wishing you safe travels and unforgettable experiences! 🌍✨",
                        "I'm thrilled I could help! Have the most amazing adventure and enjoy every moment! 🎉🗺️"
                    ];
                    const randomResponse = thankYouResponses[Math.floor(Math.random() * thankYouResponses.length)];
                    addMessage('bot', randomResponse);
                }
                // Change/modify plan requests
                else if (lowerMessage.includes('change') || lowerMessage.includes('modify') || lowerMessage.includes('adjust') || 
                         lowerMessage.includes('different') || lowerMessage.includes('update') || lowerMessage.includes('revise')) {
                    // Check if they specified what to change
                    if (lowerMessage.includes('destination') || lowerMessage.includes('country') || 
                        lowerMessage.includes('days') || lowerMessage.includes('duration') ||
                        lowerMessage.includes('city') || lowerMessage.includes('start') || lowerMessage.includes('end')) {
                        // Specific change request - handle the modification
                        await handleTripModification(userMessage);
                    } else {
                        // General change request - ask for specifics
                        addMessage('bot', 'I\'d be happy to help you adjust your travel plans! 🔄 What would you like to change? You can:\n\n• Ask for a different destination\n• Change the duration\n• Modify start/end cities\n• Or start completely fresh with "new trip"! 🎯');
                    }
                }
                // New trip requests
                else if (lowerMessage.includes('new trip') || lowerMessage.includes('plan another') ||
                         lowerMessage.includes('start over') || lowerMessage.includes('different trip')) {
                    handleNewTrip();
                }
                // Positive feedback
                else if (lowerMessage.includes('great') || lowerMessage.includes('perfect') || lowerMessage.includes('love') || 
                         lowerMessage.includes('awesome') || lowerMessage.includes('amazing') || lowerMessage.includes('excellent')) {
                    const positiveResponses = [
                        "I'm so glad you love the plan! 😊 Have the most wonderful time on your adventure! 🎒✨",
                        "That makes me so happy to hear! 🌟 Your trip is going to be absolutely incredible! 🗺️",
                        "Yay! I'm thrilled you're excited about your itinerary! 🎉 Safe travels and enjoy every moment! ✈️",
                        "Wonderful! I had so much fun planning this with you! 😄 Have an amazing journey! 🌍"
                    ];
                    const randomResponse = positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
                    addMessage('bot', randomResponse);
                }
                // Help requests
                else if (lowerMessage.includes('help') || lowerMessage.includes('what can') || lowerMessage.includes('options')) {
                    addMessage('bot', 'I\'m here to help! 🤝 Here\'s what I can do:\n\n✈️ Plan new trips to any country\n🔄 Modify your current plan\n🗓️ Adjust trip duration\n🏙️ Change start/end cities\n💬 Chat about travel tips\n\nJust tell me what you\'d like to do! 😊');
                }
                // Casual conversation
                else if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
                    addMessage('bot', 'Hello there! 👋 Hope you\'re excited about your trip plan! Is there anything else I can help you with? Maybe plan another adventure? 🌟');
                }
                else if (lowerMessage.includes('goodbye') || lowerMessage.includes('bye') || lowerMessage.includes('see you')) {
                    addMessage('bot', 'Safe travels and have the most amazing trip! 🌍✈️ Come back anytime you need help planning your next adventure! Bon voyage! 👋✨');
                }
                // Default response with suggestions
                else {
                    addMessage('bot', 'I hope you\'re excited about your trip plan! 🎒 I can help you:\n\n• Plan a "new trip" 🗺️\n• "Change" or modify your current plan 🔄\n• Answer travel questions 💬\n\nWhat would you like to do? 😊');
                }
            }
        } catch (error) {
            addMessage('bot', 'Sorry, I encountered an issue. Please try again! 😅');
        } finally {
            setIsLoading(false);
        }
    };

    const generateItinerary = async (country, duration, startCity = null, finalCity = null) => {
        try {
            const payload = {
                country: country,
                duration: parseInt(duration),
                startCity: startCity || tripData.startCity || null,
                finalCity: finalCity || tripData.finalCity || null
            };

            const response = await fetch('http://localhost:3001/api/generate-itinerary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Server request failed with status ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success && result.data) {
                // Display the itinerary as a chat message
                setMessages(prev => [...prev, {
                    type: 'bot',
                    content: 'Here\'s your personalized itinerary! 🎉',
                    timestamp: new Date()
                }, {
                    type: 'itinerary',
                    content: result.data,
                    timestamp: new Date()
                }, {
                    type: 'bot',
                    content: 'I hope you love this itinerary! 🎒 For travel tips and general chat, visit our Travel Chat. Want to plan another trip? Just say "new trip"! ✈️',
                    timestamp: new Date()
                }]);
                
                setConversationState('completed');
            } else {
                throw new Error(result.error || "Failed to generate itinerary");
            }
        } catch (error) {
            console.error("Error generating itinerary:", error);
            addMessage('bot', 'Sorry, I couldn\'t generate an itinerary right now. Please make sure the backend server is running and try again! 🛠️');
            setConversationState('initial');
        }
    };

    const handleNewTrip = () => {
        setMessages([
            {
                type: 'bot',
                content: "Let's plan another amazing trip! 🌍 Where would you like to go next and for how long?",
                timestamp: new Date()
            }
        ]);
        setConversationState('initial');
        setTripData({ country: '', duration: '', startCity: '', finalCity: '' });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatMessage = (message) => {
        if (message.type === 'itinerary') {
            return (
                <div className="chat-itinerary">
                    {message.content.map((day) => (
                        <div 
                            key={day.day} 
                            className="chat-day-card"
                            style={{
                                backgroundColor: currentTheme.surface,
                                border: `1px solid ${currentTheme.border}`
                            }}
                        >
                            <div 
                                className="chat-day-header"
                                style={{backgroundColor: currentTheme.primary}}
                            >
                                <span className="chat-day-label">DAY {day.day}</span>
                            </div>
                            <div className="chat-day-content">
                                <h4 
                                    className="chat-city-title"
                                    style={{color: currentTheme.textPrimary}}
                                >
                                    <MapPin size={16} style={{color: currentTheme.secondary}} />
                                    {day.city}
                                </h4>
                                <ul 
                                    className="chat-activities"
                                    style={{color: currentTheme.textSecondary}}
                                >
                                    {day.activities.map((activity, index) => (
                                        <li key={index}>{activity}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
        return message.content;
    };

    return (
        <>
            <Header />
            <div 
                className="chat-container"
                style={{ backgroundColor: currentTheme.background }}
            >
                <div className="chat-header">
                    <div className="chat-title-section">
                        <Bot size={24} style={{color: currentTheme.primary}} />
                        <h2 style={{color: currentTheme.textPrimary}}>Travel Buddy</h2>
                    </div>
                    <button 
                        onClick={handleNewTrip}
                        className="chat-new-trip-btn"
                        style={{
                            backgroundColor: currentTheme.surface,
                            color: currentTheme.textPrimary,
                            border: `1px solid ${currentTheme.border}`
                        }}
                    >
                        <RotateCcw size={16} />
                        New Trip
                    </button>
                </div>

                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div 
                            key={index}
                            className={`chat-message ${message.type}`}
                        >
                            <div className="chat-message-avatar">
                                {message.type === 'bot' || message.type === 'itinerary' ? (
                                    <Bot size={20} style={{color: currentTheme.primary}} />
                                ) : (
                                    <User size={20} style={{color: currentTheme.secondary}} />
                                )}
                            </div>
                            <div 
                                className="chat-message-content"
                                style={{
                                    backgroundColor: message.type === 'user' ? currentTheme.primary : currentTheme.surface,
                                    color: message.type === 'user' ? '#fff' : currentTheme.textPrimary,
                                    border: message.type !== 'user' ? `1px solid ${currentTheme.border}` : 'none'
                                }}
                            >
                                {formatMessage(message)}
                            </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="chat-message bot">
                            <div className="chat-message-avatar">
                                <Bot size={20} style={{color: currentTheme.primary}} />
                            </div>
                            <div 
                                className="chat-message-content chat-loading"
                                style={{
                                    backgroundColor: currentTheme.surface,
                                    border: `1px solid ${currentTheme.border}`
                                }}
                            >
                                <LoaderCircle 
                                    className="chat-loading-spinner" 
                                    size={20} 
                                    style={{color: currentTheme.primary}} 
                                />
                                <span style={{color: currentTheme.textSecondary}}>Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div 
                    className="chat-input-container"
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
                        placeholder="Type your message... (e.g., 'I want to visit Japan for 10 days')"
                        className="chat-input"
                        style={{
                            backgroundColor: 'transparent',
                            color: currentTheme.textPrimary
                        }}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="chat-send-btn"
                        style={{
                            backgroundColor: currentTheme.primary,
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

export default ChatPlanner;
