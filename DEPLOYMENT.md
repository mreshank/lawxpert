# Deployment to Render.com

This guide explains how to host both the Express.js and Python backends on Render.com using the same domain.

## Setup Overview

The project will be deployed to `https://lawxpert-wqkm.onrender.com/` with:
- Express.js server handling `/api/*` routes
- Python FastAPI handling document analysis via `/analyze` endpoint

## Steps to Deploy

1. Create a Render account if you don't have one already
2. Push your code to a Git repository (GitHub, GitLab, etc.)
3. Connect your repository to Render.com

## Environment Variables

In Render.com dashboard, create an environment group called `lawxpert-env` with these variables:
- `CONNECTION_STRING`: MongoDB connection string
- `GEMINI_API_KEY`: Your Google Gemini API key

## Frontend Configuration

Create or update `.env.production` in your frontend directory with:

```
VITE_API_BASE_URL=https://lawxpert-wqkm.onrender.com/api
VITE_PYTHON_API_URL=https://lawxpert-wqkm.onrender.com
```

## Frontend Code for Document Analysis

When making API calls to the document analyzer, use the VITE_PYTHON_API_URL:

```typescript
// Example code to analyze a document
const analyzeDocument = async (file, question) => {
  const formData = new FormData();
  formData.append('file', file);
  if (question) {
    formData.append('question', question);
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_PYTHON_API_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Analysis failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw error;
  }
};
```

## Deployment Configuration File

The `render.yaml` file in the repository root defines the deployment configuration:

```yaml
services:
  # Express API service
  - type: web
    name: lawxpert-express
    env: node
    buildCommand: npm install
    startCommand: node backend/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 4000
      - key: CONNECTION_STRING
        fromGroup: lawxpert-env
    routes:
      - type: rewrite
        source: /api/*
        destination: /*

  # Python FastAPI service  
  - type: web
    name: lawxpert-python
    env: python
    buildCommand: pip install --upgrade pip && pip install -r backend/requirements.txt
    startCommand: cd backend && uvicorn main:app --host 0.0.0.0 --port 8000
    envVars:
      - key: GEMINI_API_KEY
        fromGroup: lawxpert-env
      - key: PYTHONUNBUFFERED
        value: "true"
    routes:
      - type: rewrite
        source: /analyze
        destination: /analyze

# Shared environment variables group
envVarGroups:
  - name: lawxpert-env
    envVars:
      - key: CONNECTION_STRING
        sync: false
      - key: GEMINI_API_KEY
        sync: false
```

## Python Dependencies

The backend uses several Python packages that are listed in `backend/requirements.txt`:

```
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6
google-generativeai==0.3.1
PyPDF2==3.0.1
python-docx==1.0.1
python-dotenv==1.0.0
```

Additionally, a `runtime.txt` file in the backend directory specifies the Python version:

```
python-3.10
```

This ensures that Render.com uses Python 3.10 for running the application.

## Manual Deployment Alternative

If the YAML approach doesn't work, you can:

1. Create two separate services on Render.com:
   - An Express.js web service for the Node.js backend
   - A Python web service for the FastAPI backend

2. Set up a custom domain on Render.com

3. Configure Render.com's routing rules to:
   - Route `/api/*` requests to the Express.js service
   - Route `/analyze` requests to the Python service

4. Update the frontend environment variables accordingly 