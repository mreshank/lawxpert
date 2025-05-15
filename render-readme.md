# LawXpert Render.com Deployment

This repository is configured to deploy automatically to Render.com.

## Architecture

The application is split into two main backend components:
1. **Express.js API** - Handles authentication, user data and general API endpoints
2. **Python FastAPI** - Handles document analysis with AI capabilities

Both are deployed to the same domain (`https://lawxpert-wqkm.onrender.com/`) with routing:
- Express.js endpoints are available at `/api/*`
- Python document analysis endpoint is available at `/analyze`

## Setup on Render.com

### Blueprint Deployment (Recommended)

1. Fork/clone this repository
2. Connect to Render.com and select "Blueprint" deployment
3. Render will automatically configure the services as defined in `render.yaml`
4. Set up the environment group `lawxpert-env` with required secrets

### Manual Setup

If you prefer to set up the services manually:

1. Create two web services:
   - **Node.js service** for Express backend:
     - Build Command: `npm install`
     - Start Command: `node backend/server.js`
     - Routes: `/api/*` to `/*`
     
   - **Python service** for FastAPI:
     - Build Command: `pip install -r backend/requirements.txt`
     - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port 8000`
     - Routes: `/analyze` to `/analyze`

2. Configure the routing as described on Render's custom domain settings

## Environment Variables

Set these in the `lawxpert-env` environment group:

- `CONNECTION_STRING`: MongoDB connection string
- `GEMINI_API_KEY`: Google Gemini API key for document analysis

## Frontend Configuration

The frontend is configured to use these environment variables:
- `VITE_API_BASE_URL`: Set to `https://lawxpert-wqkm.onrender.com/api`
- `VITE_PYTHON_API_URL`: Set to `https://lawxpert-wqkm.onrender.com`

## Testing the Deployment

After deployment:
1. The Express API endpoints should be accessible at `https://lawxpert-wqkm.onrender.com/api/*`
2. The document analyzer should be accessible at `https://lawxpert-wqkm.onrender.com/analyze` 