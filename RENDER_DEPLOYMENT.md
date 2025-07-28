# Render Deployment Guide for SymptoSeek

## Overview
This guide will help you deploy your SymptoSeek application to Render with dynamic backend URLs.

## Prerequisites
1. GitHub repository with your code
2. Render account (https://render.com)
3. Both backends ready for deployment

## File Changes Made

### 1. Environment Variables (.env)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_FLASK_API_URL=http://localhost:5001
```

### 2. API Configuration (config/api.ts)
- Centralized API configuration
- Dynamic URL generation based on environment variables
- Support for both Node.js and Flask backends

### 3. Frontend Updates
- All hardcoded localhost URLs replaced with dynamic imports
- Uses environment variables for backend URLs

## Deployment Steps

### Step 1: Deploy Node.js Backend
1. Go to Render dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `symptoseek-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` or `node server.js`
   - **Port**: The port your Node.js server uses (usually 5000)

### Step 2: Deploy Flask Backend
1. Create another Web Service
2. Configure:
   - **Name**: `symptoseek-flask`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py` or your Flask start command
   - **Port**: The port your Flask server uses (usually 5001)

### Step 3: Deploy Frontend
1. Create another Web Service
2. Configure:
   - **Name**: `symptoseek-frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Port**: 3000

### Step 4: Configure Environment Variables
In your frontend service on Render, add these environment variables:

```
NEXT_PUBLIC_API_BASE_URL=https://symptoseek-backend.onrender.com
NEXT_PUBLIC_FLASK_API_URL=https://symptoseek-flask.onrender.com
```

Replace the URLs with your actual Render service URLs.

### Step 5: Update CORS Settings
Make sure your backends allow requests from your frontend domain:

**Node.js Backend (server.js):**
```javascript
const cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-app.onrender.com'
  ],
  credentials: true
}));
```

**Flask Backend (app.py):**
```python
from flask_cors import CORS
CORS(app, origins=[
    'http://localhost:3000',
    'https://your-frontend-app.onrender.com'
])
```

## Testing Your Deployment

1. **Check Backend Services**: 
   - Visit `https://your-backend.onrender.com/api/health` (if you have health check)
   - Check logs in Render dashboard

2. **Check Frontend**:
   - Visit your frontend URL
   - Open browser dev tools → Network tab
   - Verify API calls are going to the correct Render URLs

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Loading**
   - Ensure variables start with `NEXT_PUBLIC_`
   - Restart the service after adding variables

2. **CORS Errors**
   - Update CORS settings in both backends
   - Include your frontend domain in allowed origins

3. **API Calls Failing**
   - Check if backend services are running
   - Verify environment variable URLs are correct
   - Check network logs in browser

4. **Build Failures**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify build commands are correct

## Environment Variables Reference

### Local Development (.env)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_FLASK_API_URL=http://localhost:5001
```

### Production (.env.production or Render Environment Variables)
```
NEXT_PUBLIC_API_BASE_URL=https://your-nodejs-backend.onrender.com
NEXT_PUBLIC_FLASK_API_URL=https://your-flask-backend.onrender.com
```

## Next Steps

1. Deploy your backends first
2. Get the Render URLs for both services
3. Update environment variables in frontend service
4. Deploy frontend
5. Test the complete application

Your application should now work dynamically with any backend URLs you configure!
