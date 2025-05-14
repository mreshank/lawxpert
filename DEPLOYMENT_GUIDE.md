# LawXpert Deployment Guide

This guide explains how to deploy the LawXpert application with its separate backend services.

## Architecture Overview

The application consists of three separate deployments:

1. **Frontend**: React/Vite application deployed on Vercel
   - URL: https://lawexpert.vercel.app/

2. **Express Backend**: Node.js/Express server for authentication and main API
   - URL: https://lawxpert-wqkm.onrender.com/

3. **Python Backend**: FastAPI service for document analysis
   - URL: https://lawxpert-py.onrender.com/

## Express Backend Deployment (Render.com)

1. Push your code to GitHub/GitLab
2. Create a new Web Service on Render.com
3. Connect your repository
4. Configure the service:
   - Name: `lawxpert-wqkm`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   
5. Set environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or any port Render allows)
   - `CONNECTION_STRING`: Your MongoDB connection string

6. Deploy the service

## Python Backend Deployment (Render.com)

1. Create another Web Service on Render.com
2. Connect to the same repository
3. Configure the service:
   - Name: `lawxpert-py`
   - Root Directory: `backend`
   - Environment: `Python`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`
   
4. Set environment variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `PYTHONUNBUFFERED`: `true`

5. Deploy the service

## Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect to your repository
3. Configure the project:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   
4. Set environment variables:
   - `VITE_API_BASE_URL`: `https://lawxpert-wqkm.onrender.com/api`
   - `VITE_PYTHON_API_URL`: `https://lawxpert-py.onrender.com`

5. Deploy the project

## Testing the Deployment

After deployment, verify that:

1. The frontend loads correctly at https://lawexpert.vercel.app/
2. Authentication works through the Express backend
3. Document analysis works through the Python backend

## API Endpoints

### Express Backend

- Base URL: `https://lawxpert-wqkm.onrender.com/api`
- Authentication: `https://lawxpert-wqkm.onrender.com/api/auth/login`
- User profile: `https://lawxpert-wqkm.onrender.com/api/auth/profile`

### Python Backend

- Document Analysis: `https://lawxpert-py.onrender.com/analyze`

## Troubleshooting

If you encounter issues:

1. **CORS Errors**: Ensure both backends have the correct CORS settings to allow requests from `https://lawexpert.vercel.app`

2. **Environment Variables**: Verify that all environment variables are correctly set in each deployment

3. **API Connection Issues**: Test API endpoints directly using tools like Postman

4. **MongoDB Connection**: Ensure your MongoDB instance allows connections from Render.com IP addresses

5. **Logs**: Check the logs in both Render.com services and Vercel for any errors 