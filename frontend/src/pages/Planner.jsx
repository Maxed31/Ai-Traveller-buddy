import React, { useState } from 'react';
import { Bot, MapPin, LoaderCircle } from 'lucide-react';
import Header, { useTheme } from '../components/Header';
import './Planner.css';

const Planner = () => {
    const { currentTheme } = useTheme();
    const [formData, setFormData] = useState({
        country: '',
        duration: '',
        startCity: '',
        finalCity: '',
    });
    const [itinerary, setItinerary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateItinerary = async (e) => {
        e.preventDefault();
        if (!formData.country || !formData.duration) {
            setError('Please fill in at least the country and duration.');
            return;
        }
        setError('');
        setIsLoading(true);
        setItinerary(null);

        const prompt = `
            Create a realistic day-by-day travel itinerary for a trip to ${formData.country} for ${formData.duration} days.
            The trip should start in ${formData.startCity || 'a major city'} and end in ${formData.finalCity || 'a major city'}.
            For each day, suggest a city or town to visit and a list of 2-3 interesting attractions or activities there.
        `;

        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        itinerary: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    day: { type: "NUMBER", description: "Day number of the trip" },
                                    city: { type: "STRING", description: "City or town to visit" },
                                    activities: {
                                        type: "ARRAY",
                                        description: "List of suggested activities or attractions",
                                        items: { type: "STRING" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0].text) {
                const parsedResult = JSON.parse(result.candidates[0].content.parts[0].text);
                setItinerary(parsedResult.itinerary);
            } else {
                throw new Error("Unexpected API response structure.");
            }
        } catch (err) {
            console.error("Error generating itinerary:", err);
            setError("Sorry, I couldn't generate an itinerary. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div 
                className="planner-container"
                style={{ backgroundColor: currentTheme.background }}
            >
            <div className="planner-content">
                {/* Input Form */}
                <div 
                    className="planner-form-card"
                    style={{
                        backgroundColor: currentTheme.surface,
                        border: `1px solid ${currentTheme.border}`
                    }}
                >
                    <h2 
                        className="planner-title"
                        style={{color: currentTheme.textPrimary}}
                    >
                        Plan Your Adventure
                    </h2>
                    <form onSubmit={generateItinerary} className="planner-form">
                        <div className="planner-form-row">
                            <div className="planner-form-group">
                                <label 
                                    htmlFor="country" 
                                    className="planner-label"
                                    style={{color: currentTheme.textSecondary}}
                                >
                                    Country
                                </label>
                                <input 
                                    type="text" 
                                    name="country" 
                                    id="country" 
                                    value={formData.country} 
                                    onChange={handleInputChange} 
                                    placeholder="e.g., Italy" 
                                    className="planner-input"
                                    style={{
                                        backgroundColor: currentTheme.background,
                                        color: currentTheme.textPrimary,
                                        border: `1px solid ${currentTheme.border}`
                                    }}
                                />
                            </div>
                            <div className="planner-form-group">
                                <label 
                                    htmlFor="duration" 
                                    className="planner-label"
                                    style={{color: currentTheme.textSecondary}}
                                >
                                    Duration (days)
                                </label>
                                <input 
                                    type="number" 
                                    name="duration" 
                                    id="duration" 
                                    value={formData.duration} 
                                    onChange={handleInputChange} 
                                    placeholder="e.g., 10" 
                                    className="planner-input"
                                    style={{
                                        backgroundColor: currentTheme.background,
                                        color: currentTheme.textPrimary,
                                        border: `1px solid ${currentTheme.border}`
                                    }}
                                />
                            </div>
                        </div>
                        <div className="planner-form-row">
                            <div className="planner-form-group">
                                <label 
                                    htmlFor="startCity" 
                                    className="planner-label"
                                    style={{color: currentTheme.textSecondary}}
                                >
                                    Starting City (Optional)
                                </label>
                                <input 
                                    type="text" 
                                    name="startCity" 
                                    id="startCity" 
                                    value={formData.startCity} 
                                    onChange={handleInputChange} 
                                    placeholder="e.g., Rome" 
                                    className="planner-input"
                                    style={{
                                        backgroundColor: currentTheme.background,
                                        color: currentTheme.textPrimary,
                                        border: `1px solid ${currentTheme.border}`
                                    }}
                                />
                            </div>
                            <div className="planner-form-group">
                                <label 
                                    htmlFor="finalCity" 
                                    className="planner-label"
                                    style={{color: currentTheme.textSecondary}}
                                >
                                    Final City (Optional)
                                </label>
                                <input 
                                    type="text" 
                                    name="finalCity" 
                                    id="finalCity" 
                                    value={formData.finalCity} 
                                    onChange={handleInputChange} 
                                    placeholder="e.g., Venice" 
                                    className="planner-input"
                                    style={{
                                        backgroundColor: currentTheme.background,
                                        color: currentTheme.textPrimary,
                                        border: `1px solid ${currentTheme.border}`
                                    }}
                                />
                            </div>
                        </div>
                        <div className="planner-submit-container">
                            <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="planner-submit-btn"
                                style={{
                                    backgroundColor: currentTheme.primary,
                                    opacity: isLoading ? 0.5 : 1
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <LoaderCircle className="planner-spinner" size={20} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Bot size={20} />
                                        Generate Plan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    {error && (
                        <p className="planner-error">{error}</p>
                    )}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="planner-loading">
                        <LoaderCircle 
                            className="planner-loading-spinner" 
                            size={48} 
                            style={{color: currentTheme.primary}} 
                        />
                        <p style={{color: currentTheme.textSecondary}}>
                            Your AI buddy is crafting the perfect trip...
                        </p>
                    </div>
                )}

                {/* Itinerary Display */}
                {itinerary && (
                    <div className="planner-itinerary">
                        <h3 
                            className="planner-itinerary-title"
                            style={{color: currentTheme.textPrimary}}
                        >
                            Your Custom Itinerary
                        </h3>
                        {itinerary.map((day) => (
                            <div 
                                key={day.day} 
                                className="planner-day-card"
                                style={{
                                    backgroundColor: currentTheme.surface,
                                    border: `1px solid ${currentTheme.border}`
                                }}
                            >
                                <div 
                                    className="planner-day-number"
                                    style={{backgroundColor: currentTheme.primary}}
                                >
                                    <span className="planner-day-label">DAY</span>
                                    <span className="planner-day-value">{day.day}</span>
                                </div>
                                <div className="planner-day-content">
                                    <h4 
                                        className="planner-city-title"
                                        style={{color: currentTheme.textPrimary}}
                                    >
                                        <MapPin size={20} style={{color: currentTheme.secondary}} />
                                        {day.city}
                                    </h4>
                                    <ul 
                                        className="planner-activities"
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
                )}
            </div>
            </div>
        </>
    );
};

export default Planner;
