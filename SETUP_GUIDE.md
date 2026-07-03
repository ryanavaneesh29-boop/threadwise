# 🤖 AI Clothing Recommendation System - Complete Setup Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Using the AI System](#using-the-ai-system)
5. [Backend API](#backend-api)
6. [Advanced Features](#advanced-features)
7. [Troubleshooting](#troubleshooting)
8. [Architecture Overview](#architecture-overview)

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

---

## Installation

### Prerequisites

- **Node.js** 16+ (download from [nodejs.org](https://nodejs.org/))
- **npm** 7+ (comes with Node.js)
- **Modern browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **4GB RAM minimum** (for ML model training)
- **1GB disk space** for node_modules and uploads

### Step 1: Clone or Setup Project

```bash
# Navigate to your project directory
cd ai-clothes-matcher

# Verify package.json exists
cat package.json
```

### Step 2: Install Dependencies

```bash
# Install frontend dependencies
npm install

# (Optional) Install backend dependencies for advanced features
npm install express multer cors dotenv
```

### Step 3: Verify Installation

```bash
# Check if all packages are installed
npm list

# Should show: ai-fashion-recommender@0.1.0
```

---

## Running the Application

### Frontend Only (Local ML)

Perfect for personal use with local browser-based learning:

```bash
npm run dev
```

- Opens at `http://localhost:5173`
- Uses browser localStorage for model persistence
- No backend server required
- Recommended for getting started

### Frontend + Backend (Full Stack)

Enables advanced features like shared models and server-side training:

```bash
# Option 1: Run both servers at once (requires concurrently)
npm install concurrently
npm run dev:full

# Option 2: Run separately in different terminals
# Terminal 1:
npm run dev

# Terminal 2:
npm run backend
```

Backend API runs on `http://localhost:5000`

---

## Using the AI System

### 1. First Time Setup

When you first open the app:

```
1. The AI model will automatically initialize
2. Navigate to "AI Training" section
3. You'll see three modes: Upload, View, Export
```

### 2. Training the AI Model

**Step-by-Step:**

```
1. Click "Upload" mode in the AI Training Panel
2. Click "Click to upload image" to select a clothing photo
3. Enter a descriptive label (e.g., "Blue Denim Jeans")
4. Click "Add to Training Data"
5. Repeat for 5-20 different clothing items
6. Once you have 2+ items, a "Train Model" button appears
7. Click "Train Model" to train on your data
8. View the training results (accuracy percentage)
```

**Pro Tips:**
- Use clear, well-lit photos for better accuracy
- Label items specifically: "White Nike Sneakers", not just "Shoes"
- Include various angles and lighting conditions
- Mix different clothing categories (tops, bottoms, shoes, etc.)
- 20+ samples generally yield better recommendations

### 3. Making Predictions

**Step-by-Step:**

```
1. Go to "AI Predictions" section
2. Upload a new clothing image
3. Click "🔍 Analyze Clothing"
4. View results:
   - Detected type, color, style, pattern
   - Confidence percentage
   - Similar items from your training data
   - Recommended items to pair
```

### 4. Managing Your Models

**Viewing Statistics:**

```
AI Training → View mode
Shows:
- Total training samples
- Unique clothing types learned
- List of all labeled items
- Model status
```

**Exporting Your Model:**

```
AI Training → Export mode
1. Click "📥 Export Model as JSON"
2. File downloads to your computer
3. Share with others or backup for later
```

**Importing a Model:**

```
AI Training → Export mode
1. Click "Import Model"
2. Select a previously exported .json file
3. All data is loaded and ready to use
```

---

## Backend API

### Setting Up the Backend

```bash
# Install backend dependencies
npm install express multer cors dotenv

# Create .env file (optional)
cat > .env << EOF
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
EOF

# Start backend server
npm run backend
```

### API Endpoints

#### 1. Train Model
```bash
POST /api/models/train

Request:
- Method: POST
- Content: multipart/form-data
- Files: images[] (up to 100 images)
- Data: labels (JSON array of strings)

Example:
curl -X POST http://localhost:5000/api/models/train \
  -F "images=@photo1.jpg" \
  -F "images=@photo2.jpg" \
  -F "labels=[\"Blue Jeans\", \"White Shirt\"]"

Response:
{
  "success": true,
  "modelId": "uuid-string",
  "samplesProcessed": 2,
  "accuracy": 0.87
}
```

#### 2. Make Predictions
```bash
POST /api/models/predict

Request:
- Method: POST
- Content: multipart/form-data
- File: image (single image)
- Data: modelId (string)

Example:
curl -X POST http://localhost:5000/api/models/predict \
  -F "image=@test.jpg" \
  -F "modelId=uuid-string"

Response:
{
  "success": true,
  "prediction": {
    "clothing": { "type": "Shirt", "color": "Blue", ... },
    "confidence": 0.89,
    "similar": [...]
  }
}
```

#### 3. List Models
```bash
GET /api/models

Response:
{
  "success": true,
  "models": [
    { "modelId": "uuid", "accuracy": 0.87, "samplesCount": 15 }
  ],
  "total": 1
}
```

#### 4. Get Model Details
```bash
GET /api/models/:modelId

Response:
{
  "success": true,
  "model": {
    "modelId": "uuid",
    "createdAt": "2024-01-15T10:30:00Z",
    "accuracy": 0.87,
    "samplesCount": 15,
    "labels": ["Blue Jeans", "White Shirt", ...]
  }
}
```

#### 5. Export Model
```bash
POST /api/models/:modelId/export

Response:
{
  "success": true,
  "model": {
    "modelId": "uuid",
    "accuracy": 0.87,
    "samplesCount": 15,
    "exportedAt": "2024-01-15T10:35:00Z"
  }
}
```

#### 6. Delete Model
```bash
DELETE /api/models/:modelId

Response:
{
  "success": true,
  "message": "Model deleted successfully"
}
```

#### 7. Health Check
```bash
GET /api/health

Response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:40:00Z",
  "uptime": 3600
}
```

---

## Advanced Features

### Using the Backend Client

In your React components, use the backend client:

```javascript
import { mlBackendClient } from '../services/mlBackendClient'

// Train model
const result = await mlBackendClient.trainModel(imageFiles, labels);
console.log(result.modelId); // Use this to make predictions

// Make predictions
const prediction = await mlBackendClient.predict(imageFile);

// List all models
const models = await mlBackendClient.listModels();

// Export model
const exported = await mlBackendClient.exportModel(modelId);

// Delete model
await mlBackendClient.deleteModel(modelId);
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Threadwise

# Backend
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:5173
```

### Database Integration (Optional)

To persist models permanently, integrate a database:

```bash
npm install sqlite3
# or
npm install mongodb mongoose
# or
npm install pg
```

Then update `backend.js` to use your database instead of Map storage.

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot find module 'express'"
```bash
# Solution: Install backend dependencies
npm install express multer cors dotenv
```

#### 2. "Model initialization failed"
```bash
# Solution: Clear browser cache and localStorage
localStorage.clear()
# Refresh the page
```

#### 3. "Port 5000 already in use"
```bash
# Solution: Use a different port
PORT=5001 npm run backend
```

#### 4. "Images not uploading"
```
- Check file size (must be < 10MB)
- Try a different image format (JPEG, PNG, WebP)
- Check browser console for error messages
```

#### 5. "Model not making good predictions"
```
- Add more training samples (aim for 20+)
- Use clearer, well-lit images
- Ensure labels are specific
- Try different image angles
```

#### 6. "localStorage full - cannot save model"
```
# Solution: Export and clear old models
1. Go to AI Training → Export
2. Click "Export Model as JSON"
3. Go to View tab
4. Click "Clear All Training Data"
5. Import the exported model when needed
```

#### 7. "CORS error when calling backend"
```
# Solution: Check backend CORS settings
# In backend.js, add:
app.use(cors({
  origin: 'http://localhost:5173'
}))
```

### Debug Mode

Enable detailed logging:

```javascript
// In mlModel.js
const DEBUG = true; // Set to true

// In mlBackendClient.js
const DEBUG = true; // Set to true

// Check console for detailed messages
```

---

## Architecture Overview

### Frontend Architecture

```
React App (http://localhost:5173)
├── Pages
│   └── Home.jsx (main interface)
├── Components
│   ├── AITrainingPanel.jsx (upload & train)
│   ├── AIPredictionPanel.jsx (analyze & predict)
│   ├── PhotoStyler.jsx (photo upload)
│   └── ...other components
├── Services
│   ├── mlModel.js (local ML - TensorFlow.js)
│   ├── mlBackendClient.js (backend communication)
│   ├── recommendation.js (recommendation engine)
│   └── api.js (API utilities)
└── Hooks
    └── useLocalStorage.js
```

### Backend Architecture

```
Express.js App (http://localhost:5000)
├── Routes
│   ├── POST /api/models/train
│   ├── POST /api/models/predict
│   ├── GET /api/models
│   ├── GET /api/models/:id
│   ├── POST /api/models/:id/export
│   ├── DELETE /api/models/:id
│   └── GET /api/health
├── Middleware
│   ├── CORS
│   ├── JSON parser
│   └── Multer (file upload)
└── Storage
    ├── File system (uploads/)
    └── In-memory models (Map)
```

### Data Flow

```
User Upload → Image File
     ↓
Frontend: mlModel.js (TensorFlow.js)
     ↓
Extract Features → Analyze Image
     ↓
Backend: backend.js (optional)
     ↓
Store Model → Save Metadata
     ↓
localStorage / Backend Database
     ↓
Use for Predictions
```

---

## Performance Optimization

### Frontend Optimization

```javascript
// Code splitting
const AITrainingPanel = React.lazy(() => import('./components/AITrainingPanel'))
const AIPredictionPanel = React.lazy(() => import('./components/AIPredictionPanel'))

// Image optimization
import sharp from 'sharp'
const optimized = await sharp(image)
  .resize(224, 224)
  .toBuffer()
```

### Backend Optimization

```javascript
// Increase file upload limit for large batches
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
})

// Use worker threads for training
import { Worker } from 'worker_threads'
```

### Browser Optimization

```javascript
// Use IndexedDB for larger models
const db = await openDB('fashionAI')
await db.put('models', modelData)

// Use Web Workers for training
const worker = new Worker('trainer.js')
worker.postMessage({ images, labels })
```

---

## Next Steps

1. **Add more features**
   - Price integration
   - Social sharing
   - Community models
   - Advanced search

2. **Improve ML**
   - Pre-trained models (MobileNet)
   - Advanced color analysis
   - Body shape recommendations
   - Weather integration

3. **Scale the backend**
   - Add database (PostgreSQL, MongoDB)
   - Authentication & user accounts
   - Model versioning
   - Analytics dashboard

4. **Deploy**
   - Frontend: Vercel, Netlify, GitHub Pages
   - Backend: Heroku, Railway, AWS
   - Database: PlanetScale, MongoDB Atlas

---

## Support & Resources

- **TensorFlow.js Docs**: https://js.tensorflow.org/
- **React Docs**: https://react.dev/
- **Express.js Docs**: https://expressjs.com/
- **Tailwind CSS Docs**: https://tailwindcss.com/
- **Vite Docs**: https://vitejs.dev/

---

## License

MIT - Feel free to use and modify!

---

Built with ❤️ for fashion enthusiasts and developers
