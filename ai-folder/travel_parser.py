#!/usr/bin/env python3
import sys
import json
import os
import requests
from dotenv import load_dotenv

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Load environment variables from the ai-folder/.env file
env_path = os.path.join(script_dir, '.env')
load_dotenv(env_path)

def setup_ai():
    """Setup the Gemini AI configuration"""
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={api_key}"
    timeout = int(os.getenv('API_TIMEOUT', 15))
    
    return api_url, timeout

def parse_travel_request(user_message):
    """Use AI to intelligently parse travel request and extract structured data"""
    try:
        api_url, timeout = setup_ai()
        
        # Create a prompt for intelligent parsing
        system_prompt = """You are a travel planning assistant that extracts structured information from natural language travel requests.

Your task is to parse the user's message and extract travel details. Always respond with ONLY a valid JSON object with these exact fields:

{
  "country": "destination country name (or empty string if not found)",
  "duration": "number of days as integer (or 0 if not found)",
  "startCity": "starting city name (or empty string if not found)",
  "finalCity": "ending/departure city name (or empty string if not found)",
  "hasRequiredInfo": boolean indicating if both country and duration were found,
  "parsedSuccessfully": true
}

Extract information from various phrasings like:
- "I want to visit Japan for 10 days"
- "Plan a 2-week trip to Italy starting from Rome"
- "7 days in Thailand, leaving from Bangkok"
- "Visit France for a week and end in Paris"
- "2 weeks in Spain"
- "I want to go to Germany"

Be flexible with:
- Different ways of saying duration (days, weeks, etc.)
- Various country/city name formats
- Different sentence structures
- Implied information

If weeks are mentioned, convert to days (1 week = 7 days).
If only a duration or only a country is mentioned, still extract what you can.

Examples:
"I want to visit Japan for 10 days" → {"country": "Japan", "duration": 10, "startCity": "", "finalCity": "", "hasRequiredInfo": true, "parsedSuccessfully": true}
"2 weeks in Italy starting from Rome" → {"country": "Italy", "duration": 14, "startCity": "Rome", "finalCity": "", "hasRequiredInfo": true, "parsedSuccessfully": true}
"I want to go to France" → {"country": "France", "duration": 0, "startCity": "", "finalCity": "", "hasRequiredInfo": false, "parsedSuccessfully": true}"""

        prompt = f"{system_prompt}\n\nUser message: \"{user_message}\"\n\nJSON response:"
        
        # Prepare the request payload
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.1,  # Low temperature for consistent structured output
                "topK": 1,
                "topP": 0.1,
                "maxOutputTokens": 200
            }
        }
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        # Make the API request
        response = requests.post(api_url, json=payload, headers=headers, timeout=timeout)
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                if 'content' in result['candidates'][0] and 'parts' in result['candidates'][0]['content']:
                    ai_response = result['candidates'][0]['content']['parts'][0]['text'].strip()
                    
                    # Try to extract JSON from the response
                    try:
                        # Remove any markdown formatting or extra text
                        json_start = ai_response.find('{')
                        json_end = ai_response.rfind('}') + 1
                        if json_start != -1 and json_end != -1:
                            json_str = ai_response[json_start:json_end]
                            parsed_data = json.loads(json_str)
                            
                            # Validate the structure
                            required_fields = ['country', 'duration', 'startCity', 'finalCity', 'hasRequiredInfo', 'parsedSuccessfully']
                            if all(field in parsed_data for field in required_fields):
                                return {
                                    "success": True,
                                    "data": parsed_data,
                                    "error": None
                                }
                        
                        # If JSON parsing fails, try to create a fallback response
                        return {
                            "success": False,
                            "data": {
                                "country": "",
                                "duration": 0,
                                "startCity": "",
                                "finalCity": "",
                                "hasRequiredInfo": False,
                                "parsedSuccessfully": False
                            },
                            "error": "Could not parse AI response as JSON"
                        }
                        
                    except json.JSONDecodeError as e:
                        return {
                            "success": False,
                            "data": {
                                "country": "",
                                "duration": 0,
                                "startCity": "",
                                "finalCity": "",
                                "hasRequiredInfo": False,
                                "parsedSuccessfully": False
                            },
                            "error": f"JSON parsing error: {str(e)}"
                        }
            
            return {
                "success": False,
                "data": {
                    "country": "",
                    "duration": 0,
                    "startCity": "",
                    "finalCity": "",
                    "hasRequiredInfo": False,
                    "parsedSuccessfully": False
                },
                "error": "No response generated from AI"
            }
        else:
            return {
                "success": False,
                "data": {
                    "country": "",
                    "duration": 0,
                    "startCity": "",
                    "finalCity": "",
                    "hasRequiredInfo": False,
                    "parsedSuccessfully": False
                },
                "error": f"API request failed with status {response.status_code}: {response.text}"
            }
            
    except requests.exceptions.Timeout:
        return {
            "success": False,
            "data": {
                "country": "",
                "duration": 0,
                "startCity": "",
                "finalCity": "",
                "hasRequiredInfo": False,
                "parsedSuccessfully": False
            },
            "error": "Request timed out"
        }
    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "data": {
                "country": "",
                "duration": 0,
                "startCity": "",
                "finalCity": "",
                "hasRequiredInfo": False,
                "parsedSuccessfully": False
            },
            "error": f"Request error: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "data": {
                "country": "",
                "duration": 0,
                "startCity": "",
                "finalCity": "",
                "hasRequiredInfo": False,
                "parsedSuccessfully": False
            },
            "error": f"Error parsing travel request: {str(e)}"
        }

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "data": {
                "country": "",
                "duration": 0,
                "startCity": "",
                "finalCity": "",
                "hasRequiredInfo": False,
                "parsedSuccessfully": False
            },
            "error": "Message is required"
        }))
        sys.exit(1)
    
    user_message = sys.argv[1]
    
    # Parse the travel request
    result = parse_travel_request(user_message)
    
    # Output the result as JSON
    print(json.dumps(result))

if __name__ == "__main__":
    main()
