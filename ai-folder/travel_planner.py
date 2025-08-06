import os
import json
import requests
from dotenv import load_dotenv
from typing import Dict, List, Optional

# Load environment variables
load_dotenv()

class TravelPlannerAI:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={self.api_key}"
        self.timeout = int(os.getenv('API_TIMEOUT', 30))
        self.max_retries = int(os.getenv('MAX_RETRIES', 3))
        
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
    
    def generate_itinerary(self, country: str, duration: int, start_city: Optional[str] = None, final_city: Optional[str] = None) -> Dict:
        """
        Generate a travel itinerary using Google Gemini AI
        
        Args:
            country: The destination country
            duration: Number of days for the trip
            start_city: Optional starting city
            final_city: Optional final city
            
        Returns:
            Dictionary containing the itinerary or error information
        """
        
        # Create the prompt
        prompt = f"""
        Create a realistic day-by-day travel itinerary for a trip to {country} for {duration} days.
        The trip should start in {start_city or 'a major city'} and end in {final_city or 'a major city'}.
        For each day, suggest a city or town to visit and a list of 2-3 interesting attractions or activities there.
        Make sure the itinerary is practical and considers travel time between locations.
        """
        
        # Prepare the payload
        payload = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json",
                "responseSchema": {
                    "type": "OBJECT",
                    "properties": {
                        "itinerary": {
                            "type": "ARRAY",
                            "items": {
                                "type": "OBJECT",
                                "properties": {
                                    "day": {"type": "NUMBER", "description": "Day number of the trip"},
                                    "city": {"type": "STRING", "description": "City or town to visit"},
                                    "activities": {
                                        "type": "ARRAY",
                                        "description": "List of suggested activities or attractions",
                                        "items": {"type": "STRING"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        # Make the API request with retries
        for attempt in range(self.max_retries):
            try:
                response = requests.post(
                    self.api_url,
                    headers={'Content-Type': 'application/json'},
                    json=payload,
                    timeout=self.timeout
                )
                
                if response.status_code == 200:
                    result = response.json()
                    
                    if result.get('candidates') and len(result['candidates']) > 0:
                        candidate = result['candidates'][0]
                        if candidate.get('content') and candidate['content'].get('parts'):
                            text_content = candidate['content']['parts'][0].get('text')
                            if text_content:
                                try:
                                    parsed_result = json.loads(text_content)
                                    return {
                                        "success": True,
                                        "data": parsed_result.get('itinerary', []),
                                        "message": "Itinerary generated successfully"
                                    }
                                except json.JSONDecodeError as e:
                                    return {
                                        "success": False,
                                        "error": f"Failed to parse AI response: {str(e)}",
                                        "data": []
                                    }
                    
                    return {
                        "success": False,
                        "error": "Invalid response structure from AI",
                        "data": []
                    }
                
                else:
                    if attempt == self.max_retries - 1:  # Last attempt
                        return {
                            "success": False,
                            "error": f"API request failed with status {response.status_code}",
                            "data": []
                        }
                    
            except requests.RequestException as e:
                if attempt == self.max_retries - 1:  # Last attempt
                    return {
                        "success": False,
                        "error": f"Network error: {str(e)}",
                        "data": []
                    }
                
        return {
            "success": False,
            "error": "Max retries exceeded",
            "data": []
        }

def main():
    """
    Main function for testing the travel planner
    Can be called directly or used as a CLI tool
    """
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python travel_planner.py <country> <duration> [start_city] [final_city]")
        print("Example: python travel_planner.py Italy 7 Rome Venice")
        return
    
    country = sys.argv[1]
    duration = int(sys.argv[2])
    start_city = sys.argv[3] if len(sys.argv) > 3 else None
    final_city = sys.argv[4] if len(sys.argv) > 4 else None
    
    try:
        planner = TravelPlannerAI()
        result = planner.generate_itinerary(country, duration, start_city, final_city)
        
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": f"Error initializing travel planner: {str(e)}",
            "data": []
        }, indent=2))

if __name__ == "__main__":
    main()
