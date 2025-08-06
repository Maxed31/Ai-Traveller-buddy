# AI Traveller Buddy - Backend

This is the backend API server for the AI Traveller Buddy application. It provides RESTful API endpoints for generating travel itineraries using AI.

## Features

- Express.js API server
- CORS enabled for frontend communication
- Environment variable support
- Integration with Python AI service
- Automatic server management scripts

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm (v8+)
- Python 3.x (for AI service)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` (if available)
   - Configure your environment variables

## Available Scripts

### Development Scripts

- **`npm start`** - Start the server in foreground with nodemon (blocks terminal, use Ctrl+C to stop)
  ```bash
  npm start
  ```

- **`npm run start-bg`** - Start the server in background (terminal remains free)
  ```bash
  npm run start-bg
  ```

- **`npm run dev`** - Start the development server in foreground (same as npm start)
  ```bash
  npm run dev
  ```

### Server Management Scripts

- **`npm run status`** - Check if the server is running
  ```bash
  npm run status
  ```

- **`npm run stop`** - Stop the server gracefully
  ```bash
  npm run stop
  ```

- **`npm run force-stop`** - Force stop all processes on port 5000
  ```bash
  npm run force-stop
  ```

- **`npm run restart`** - Stop and restart the server
  ```bash
  npm run restart
  ```

- **`npm run logs`** - View server logs in real-time
  ```bash
  npm run logs
  ```

### Testing Scripts

- **`npm run test-ai`** - Test the AI service with sample data
  ```bash
  npm run test-ai
  ```

## API Endpoints

### POST /api/itinerary

Generate a travel itinerary using AI.

**Request Body:**
```json
{
  "destination": "Italy",
  "duration": 7,
  "city": "Rome"
}
```

**Response:**
```json
{
  "success": true,
  "itinerary": "Generated itinerary content..."
}
```

## Server Configuration

- **Port:** 5000 (default)
- **CORS:** Enabled for all origins in development
- **Environment:** Configurable via `.env` file

## Project Structure

```
backend/
├── index.js           # Main server file
├── package.json       # Dependencies and scripts
├── routes/
│   └── api.js         # API route handlers
└── README.md          # This file
```

## Troubleshooting

### Server Won't Stop
If the server doesn't stop with `npm run stop`, use:
```bash
npm run force-stop
```

### Port Already in Use
Check what's running on port 5000:
```bash
npm run status
```

Force stop any processes:
```bash
npm run force-stop
```

### Python AI Service Issues
Test the AI service independently:
```bash
npm run test-ai
```

Make sure Python dependencies are installed in the `ai-folder` directory.

## Development Notes

- Use `npm start` to run server in foreground (shows port info, use Ctrl+C to stop)
- Use `npm run start-bg` to run server in background (terminal stays free)
- Use `npm run logs` to view server output when running in background
- Always check server status with `npm run status` before starting
- Server logs are saved to `server.log` when running in background
- The AI service requires a valid API key in `../ai-folder/.env`

## Environment Variables

Create a `.env` file in the backend directory (if needed):
```env
PORT=5000
NODE_ENV=development
```

The AI service uses its own `.env` file in the `ai-folder` directory.
