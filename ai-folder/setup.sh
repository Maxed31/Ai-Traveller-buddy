#!/bin/bash

# AI Folder Setup Script
echo "Setting up AI environment..."

# Check if Python3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "Error: pip3 is not installed. Please install pip3 first."
    exit 1
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip3 install -r requirements.txt

echo "✅ AI environment setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Make sure you have added your GEMINI_API_KEY to the .env file"
echo "2. Test the script with: python3 travel_planner.py Italy 7 Rome Venice"
echo "3. Start the backend server to use the API endpoint"
