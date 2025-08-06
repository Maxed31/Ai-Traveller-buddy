# AI Travel Planner

This folder contains the AI service for generating travel itineraries using Google Gemini AI.

## Setup

1. **Install Dependencies**
   ```bash
   cd ai-folder
   ./setup.sh
   ```
   
   Or manually:
   ```bash
   pip3 install -r requirements.txt
   ```

2. **Environment Configuration**
   - The `.env` file contains your Google Gemini API key
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Usage

### Direct Python Script
```bash
python3 travel_planner.py <country> <duration> [start_city] [final_city]

# Examples:
python3 travel_planner.py Italy 7
python3 travel_planner.py Japan 10 Tokyo Osaka
python3 travel_planner.py France 5 Paris Nice
```

### Via Backend API
The backend server calls this script through the `/api/generate-itinerary` endpoint.

## Files

- `travel_planner.py` - Main AI service script
- `.env` - Environment variables (API keys)
- `requirements.txt` - Python dependencies
- `setup.sh` - Setup script for dependencies
- `README.md` - This file

## API Response Format

```json
{
  "success": true,
  "data": [
    {
      "day": 1,
      "city": "Rome",
      "activities": [
        "Visit the Colosseum",
        "Explore Roman Forum",
        "Walk through Palatine Hill"
      ]
    }
  ],
  "message": "Itinerary generated successfully"
}
```

## Error Handling

The script includes:
- Automatic retries for API failures
- Timeout handling
- JSON parsing error recovery
- Detailed error messages
