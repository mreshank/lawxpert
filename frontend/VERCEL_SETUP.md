# Vercel Deployment Guide for Frontend

This guide will help you deploy your React/Vite frontend on Vercel and configure it to connect to your backend services on Render.com.

## Deployment Steps

1. Push your code to GitHub or GitLab

2. Login to your Vercel account

3. Create a new project:
   - Connect your repository
   - Set the "Root Directory" to `frontend`
   - Vercel should automatically detect it as a Vite project
   - Configure the build settings if necessary:
     - Build Command: `npm run build`
     - Output Directory: `dist`

4. Set environment variables:
   - `VITE_API_BASE_URL`: `https://lawxpert-wqkm.onrender.com/api`
   - `VITE_PYTHON_API_URL`: `https://lawxpert-py.onrender.com`

5. Deploy the project

## Verifying the Setup

After deployment, your application should be available at `https://lawexpert.vercel.app/`.

The frontend should now correctly communicate with:
- Express API at `https://lawxpert-wqkm.onrender.com/api/*`  
- Python document analysis at `https://lawxpert-py.onrender.com/analyze`

## Troubleshooting

If you encounter CORS issues or other connection problems:

1. Ensure both backends' CORS settings include your Vercel domain (`https://lawexpert.vercel.app`)
2. Check if environment variables are correctly set in Vercel
3. Verify network requests in the browser's developer tools
4. Test the API endpoints using tools like Postman or Insomnia 