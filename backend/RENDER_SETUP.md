# Render.com Deployment Guide

This guide will help you deploy both your Express.js and Python FastAPI servers on the same Render.com service.

## Deployment Steps

1. Push your code to GitHub or GitLab

2. Login to your Render.com account

3. Create a new **Web Service**:
   - Connect your repository
   - Choose the **backend** directory as the "Root Directory"
   - Select "Docker" as the environment
   - Set a name for your service (e.g., "lawxpert-backend")
   - Choose a region close to your users
   - Select the "Free" plan or upgrade as needed

4. Set the following environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `4286`
   - `CONNECTION_STRING`: Your MongoDB connection string
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `PYTHONUNBUFFERED`: `true`

5. Deploy the service

## Accessing Your Services

After deployment, both services will be available on the same domain:

- Express.js API: `https://lawxpert-wqkm.onrender.com/api/*`  
  Example: `https://lawxpert-wqkm.onrender.com/api/auth/login`

- Python FastAPI: `https://lawxpert-wqkm.onrender.com/analyze`

## Frontend Configuration

Update your frontend on Vercel to use these URLs:

1. In Vercel dashboard, navigate to your project settings
2. Add these environment variables:
   - `VITE_API_BASE_URL`: `https://lawxpert-wqkm.onrender.com/api`
   - `VITE_PYTHON_API_URL`: `https://lawxpert-wqkm.onrender.com`

## Troubleshooting

If you encounter issues:

1. Check Render logs for both services
2. Ensure all environment variables are correctly set
3. Verify the Dockerfile is correctly pointing to your server entry points
4. Check if your MongoDB connection is accessible from Render 