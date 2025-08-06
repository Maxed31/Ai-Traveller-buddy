#!/usr/bin/env python3
import sys
import json
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def setup_ai():
    """Setup the Gemini AI configuration"""
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={api_key}"
    timeout = int(os.getenv('API_TIMEOUT', 15))
    
    return api_url, timeout

def generate_chat_response(user_message, context=None):
    """Generate a conversational response using Gemini AI"""
    try:
        api_url, timeout = setup_ai()
        
        # Create a prompt for general travel conversation
        system_prompt = """You are a friendly and knowledgeable AI travel assistant. You help people with travel-related questions, provide tips, share interesting facts about destinations, and engage in casual conversation about travel topics.

Keep your responses:
- Conversational and friendly
- Helpful and informative
- Around 1-3 sentences unless more detail is specifically requested
- Travel-focused when possible
- Encouraging and positive

If the user asks about something completely unrelated to travel, gently guide the conversation back to travel topics."""

        # Include context if provided
        if context:
            prompt = f"{system_prompt}\n\nContext: {context}\n\nUser: {user_message}\n\nAssistant:"
        else:
            prompt = f"{system_prompt}\n\nUser: {user_message}\n\nAssistant:"
        
        # Prepare the request payload
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 500
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
                    return {
                        "success": True,
                        "data": ai_response,
                        "error": None
                    }
            
            return {
                "success": False,
                "data": "",
                "error": "No response generated from AI"
            }
        else:
            return {
                "success": False,
                "data": "",
                "error": f"API request failed with status {response.status_code}: {response.text}"
            }
            
    except requests.exceptions.Timeout:
        return {
            "success": False,
            "data": "",
            "error": "Request timed out"
        }
    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "data": "",
            "error": f"Request error: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "data": "",
            "error": f"Error generating response: {str(e)}"
        }

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "data": "",
            "error": "Message is required"
        }))
        sys.exit(1)
    
    user_message = sys.argv[1]
    context = sys.argv[2] if len(sys.argv) > 2 else None
    
    # Generate chat response
    result = generate_chat_response(user_message, context)
    
    # Output the result as JSON
    print(json.dumps(result))

if __name__ == "__main__":
    main()
