# Travel Buddy - AI Travel Planner

An intelligent travel planning application that uses AI to generate personalized itineraries. Built with React, Node.js, and Google Gemini AI.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3
- npm

### Setup
```bash
# Install all dependencies
npm run setup

# Or install individually:
npm run install-backend
npm run install-frontend
npm run install-ai
```

### Running the Application

#### Start Backend Server
```bash
npm start
# or
npm run backend
```

#### Start Frontend Development Server
```bash
npm run frontend
```

#### Development Mode (Backend with auto-reload)
```bash
npm run dev
```

## 📁 Project Structure

```
├── ai-folder/          # AI service (Python)
│   ├── travel_planner.py
│   ├── .env           # API keys (secure)
│   ├── requirements.txt
│   └── README.md
├── backend/           # Node.js API server
│   ├── index.js
│   ├── routes/
│   └── package.json
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   └── package.json
└── package.json       # Root package.json
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the backend server |
| `npm run dev` | Start backend in development mode |
| `npm run frontend` | Start the React frontend |
| `npm run backend` | Start the backend server |
| `npm run setup` | Install all dependencies |
| `npm run test-ai` | Test the AI service |
| `npm run build` | Build frontend for production |

## 🔐 Environment Setup

1. Add your Google Gemini API key to `ai-folder/.env`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

2. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🌟 Features

- **AI-Powered Itineraries**: Generate day-by-day travel plans
- **Theme Support**: Light and dark mode
- **Responsive Design**: Works on mobile and desktop
- **Secure Architecture**: API keys safely stored in backend
- **Modular Code**: Clean, maintainable structure

## 🛠️ Development

### Testing the AI Service
```bash
cd ai-folder
python3 travel_planner.py Italy 7 Rome Venice
```

### API Endpoints
- `GET /` - Health check
- `POST /api/generate-itinerary` - Generate travel itinerary
- `GET /api/health` - API health status

## 📝 Usage

1. Start the backend: `npm start`
2. Start the frontend: `npm run frontend`
3. Open http://localhost:3000 (or the port shown)
4. Navigate to the planner page
5. Fill in your travel details
6. Generate your AI-powered itinerary!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
