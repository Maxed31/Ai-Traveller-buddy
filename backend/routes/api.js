const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const axios = require('axios');
const router = express.Router();

// Free image search endpoint using Unsplash API
router.post('/search-images', async (req, res) => {
    try {
        const { query, country } = req.body;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required',
                data: []
            });
        }

        // Unsplash API configuration (free tier: 50 requests/hour)
        const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
        
        if (!UNSPLASH_ACCESS_KEY) {
            console.log('Unsplash API key not configured, using free placeholder images');
            return generatePlaceholderImages(query, country);
        }

        // Enhanced search query for better travel results
        const searchQuery = `${query} ${country || ''} travel destination`.trim();
        
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: searchQuery,
                per_page: 3,
                orientation: 'landscape',
                content_filter: 'high'
            },
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            },
            timeout: 10000
        });

        if (response.data && response.data.results && response.data.results.length > 0) {
            const images = response.data.results.map(item => ({
                url: item.urls.regular,
                title: item.alt_description || `${query} - Travel Photo`,
                source: 'Unsplash',
                thumbnail: item.urls.small,
                photographer: item.user.name,
                photographerUrl: item.user.links.html
            }));

            return res.json({
                success: true,
                data: { images }
            });
        } else {
            // Fallback to free services if no Unsplash results
            return generatePlaceholderImages(query, country);
        }

    } catch (error) {
        console.error('Error searching for images:', error.message);
        
        // Return free placeholder images on error
        return generatePlaceholderImages(req.body.query, req.body.country);
    }
});

// Helper function to generate free placeholder images
function generatePlaceholderImages(query, country) {
    const imageServices = [
        'https://picsum.photos/400/300',
        'https://source.unsplash.com/400x300',
        'https://loremflickr.com/400/300'
    ];
    
    const randomService = imageServices[Math.floor(Math.random() * imageServices.length)];
    const searchTerm = encodeURIComponent(query.replace(/\s+/g, ','));
    
    let imageUrl;
    if (randomService.includes('unsplash')) {
        imageUrl = `${randomService}/?${searchTerm},travel,destination`;
    } else if (randomService.includes('loremflickr')) {
        imageUrl = `${randomService}/${searchTerm},travel`;
    } else {
        imageUrl = `${randomService}?random=${Math.floor(Math.random() * 1000)}`;
    }
    
    return {
        success: true,
        data: {
            images: [{
                url: imageUrl,
                title: `${query} - Travel Photo`,
                source: 'Free Image Service',
                thumbnail: imageUrl
            }]
        }
    };
}

// Travel planner endpoint
router.post('/generate-itinerary', async (req, res) => {
    try {
        const { country, duration, startCity, finalCity } = req.body;
        
        // Validate required fields
        if (!country || !duration) {
            return res.status(400).json({
                success: false,
                error: 'Country and duration are required fields',
                data: []
            });
        }
        
        // Prepare arguments for Python script
        const args = [
            path.join(__dirname, '../../ai-folder/travel_planner.py'),
            country,
            duration.toString()
        ];
        
        if (startCity) args.push(startCity);
        if (finalCity) args.push(finalCity);
        
        // Execute Python script
        const pythonProcess = spawn('python3', args);
        
        let dataString = '';
        let errorString = '';
        let responseHandled = false; // Flag to ensure only one response is sent
        
        // Set timeout for the request
        const timeoutId = setTimeout(() => {
            if (!responseHandled) {
                responseHandled = true;
                pythonProcess.kill();
                res.status(408).json({
                    success: false,
                    error: 'Request timeout',
                    data: []
                });
            }
        }, 30000); // 30 seconds timeout
        
        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
            if (!responseHandled) {
                responseHandled = true;
                clearTimeout(timeoutId); // Clear the timeout since we're handling the response
                
                if (code === 0) {
                    try {
                        const result = JSON.parse(dataString);
                        res.json(result);
                    } catch (parseError) {
                        res.status(500).json({
                            success: false,
                            error: 'Failed to parse AI response',
                            data: []
                        });
                    }
                } else {
                    console.error('Python script error:', errorString);
                    res.status(500).json({
                        success: false,
                        error: 'AI service temporarily unavailable',
                        data: []
                    });
                }
            }
        });
        
        pythonProcess.on('error', (error) => {
            if (!responseHandled) {
                responseHandled = true;
                clearTimeout(timeoutId);
                console.error('Python process error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to start AI service',
                    data: []
                });
            }
        });
        
    } catch (error) {
        console.error('Error in generate-itinerary:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            data: []
        });
    }
});

// Intelligent travel request parsing endpoint
router.post('/parse-travel-request', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Validate required fields
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required',
                data: {
                    country: '',
                    duration: 0,
                    startCity: '',
                    finalCity: '',
                    hasRequiredInfo: false,
                    parsedSuccessfully: false
                }
            });
        }
        
        // Prepare arguments for Python parsing script
        const args = [
            path.join(__dirname, '../../ai-folder/travel_parser.py'),
            message
        ];
        
        // Execute Python script
        const pythonProcess = spawn('python3', args);
        
        let dataString = '';
        let errorString = '';
        let responseHandled = false; // Flag to ensure only one response is sent
        
        // Set timeout for the request
        const timeoutId = setTimeout(() => {
            if (!responseHandled) {
                responseHandled = true;
                pythonProcess.kill();
                res.status(408).json({
                    success: false,
                    error: 'Request timeout',
                    data: {
                        country: '',
                        duration: 0,
                        startCity: '',
                        finalCity: '',
                        hasRequiredInfo: false,
                        parsedSuccessfully: false
                    }
                });
            }
        }, 15000); // 15 seconds timeout for parsing
        
        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
            if (!responseHandled) {
                responseHandled = true;
                clearTimeout(timeoutId); // Clear the timeout since we're handling the response
                
                if (code === 0) {
                    try {
                        const result = JSON.parse(dataString);
                        res.json(result);
                    } catch (parseError) {
                        res.status(500).json({
                            success: false,
                            error: 'Failed to parse AI response',
                            data: {
                                country: '',
                                duration: 0,
                                startCity: '',
                                finalCity: '',
                                hasRequiredInfo: false,
                                parsedSuccessfully: false
                            }
                        });
                    }
                } else {
                    console.error('Python parsing script error:', errorString);
                    res.status(500).json({
                        success: false,
                        error: 'AI parsing service temporarily unavailable',
                        data: {
                            country: '',
                            duration: 0,
                            startCity: '',
                            finalCity: '',
                            hasRequiredInfo: false,
                            parsedSuccessfully: false
                        }
                    });
                }
            }
        });
        
        pythonProcess.on('error', (error) => {
            if (!responseHandled) {
                responseHandled = true;
                clearTimeout(timeoutId);
                console.error('Python parsing process error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to start AI parsing service',
                    data: {
                        country: '',
                        duration: 0,
                        startCity: '',
                        finalCity: '',
                        hasRequiredInfo: false,
                        parsedSuccessfully: false
                    }
                });
            }
        });
        
    } catch (error) {
        console.error('Error in parse-travel-request endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            data: {
                country: '',
                duration: 0,
                startCity: '',
                finalCity: '',
                hasRequiredInfo: false,
                parsedSuccessfully: false
            }
        });
    }
});

// General chat endpoint
router.post('/chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        
        // Validate required fields
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required',
                data: ''
            });
        }
        
        // Prepare arguments for Python chat script
        const args = [
            path.join(__dirname, '../../ai-folder/chat_bot.py'),
            message
        ];
        
        if (context) args.push(context);
        
        // Execute Python script
        const pythonProcess = spawn('python3', args);
        
        let dataString = '';
        let errorString = '';
        let responseHandled = false; // Flag to ensure only one response is sent
        
        // Set timeout for the request
        const timeoutId = setTimeout(() => {
            if (!responseHandled) {
                responseHandled = true;
                pythonProcess.kill();
                res.status(408).json({
                    success: false,
                    error: 'Request timeout',
                    data: ''
                });
            }
        }, 15000); // 15 seconds timeout for chat
        
        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
            if (!responseHandled) {
                responseHandled = true;
                clearTimeout(timeoutId); // Clear the timeout since we're handling the response
                
                if (code === 0) {
                    try {
                        const result = JSON.parse(dataString);
                        res.json(result);
                    } catch (parseError) {
                        res.status(500).json({
                            success: false,
                            error: 'Failed to parse AI response',
                            data: ''
                        });
                    }
                } else {
                    console.error('Python chat script error:', errorString);
                    res.status(500).json({
                        success: false,
                        error: 'Chat service temporarily unavailable',
                        data: ''
                    });
                }
            }
        });
        
        pythonProcess.on('error', (error) => {
            if (!responseHandled) {
                responseHandled = true;
                clearTimeout(timeoutId);
                console.error('Python chat process error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to start chat service',
                    data: ''
                });
            }
        });
        
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            data: ''
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Travel API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
