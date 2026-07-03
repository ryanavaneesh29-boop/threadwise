# 🚀 Quick Start Guide

Get the AI Clothing Recommendation System running in 5 minutes!

## 1️⃣ Install Dependencies

```bash
cd ai-clothes-matcher
npm install
```

## 2️⃣ Start Development Server

```bash
npm run dev
```

The app will open at: **http://localhost:5174** (or 5173)

## 3️⃣ Using the App

### Option A: Text-Based Recommendations
1. Type a clothing item (e.g., "Blue jeans")
2. Click "Get Recommendations"
3. View the matched outfit

### Option B: AI Training & Predictions (NEW! 🤖)

**Train the AI:**
1. Scroll to "Machine Learning" section
2. Click "AI Training" tab → "Upload" mode
3. Select an image and label it (e.g., "Blue Jeans")
4. Click "Add to Training Data"
5. Repeat with 5-20 different items
6. Click "Train Model"

**Make Predictions:**
1. Go to "AI Predictions" section
2. Upload a new clothing image
3. Click "🔍 Analyze Clothing"
4. View detected color, type, style
5. See similar items and recommendations

### Option C: Manage Your Models
1. In "AI Training" → "View" tab
2. See statistics and labeled items
3. Export as JSON (download)
4. Import previously saved models

## 4️⃣ Optional: Run Full Stack (with Backend)

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (in new terminal)
npm install express multer cors dotenv
npm run backend
```

Backend runs at: **http://localhost:5000**

## 5️⃣ Features

✅ **Recommendation Engine**
- Text-based clothing search
- Photo analysis
- Trending outfits
- Random outfit generator

✅ **AI Learning System**
- Upload and label clothing images
- Train neural network on local data
- Make predictions on new images
- Export/import trained models
- View model statistics

✅ **User Interface**
- Dark mode support
- Responsive design (mobile-friendly)
- Save favorite outfits
- Outfit history
- Style memory

## 📚 Next Steps

- Read [AI_SYSTEM_README.md](./AI_SYSTEM_README.md) for detailed AI documentation
- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for advanced setup and troubleshooting
- Check [README.md](./README.md) for general information

## 🆘 Troubleshooting

**Port in use?**
```bash
npm run dev -- --port 3000
```

**Need to clear data?**
```javascript
// In browser console:
localStorage.clear()
```

**Want to see backend API?**
```bash
npm run backend
# Open http://localhost:5000/api/health
```

## 🎯 Key Endpoints

**Frontend:** http://localhost:5174 (or 5173)  
**Backend:** http://localhost:5000 (optional)  
**API Docs:** See SETUP_GUIDE.md section "Backend API"

---

**Happy Styling! 👔✨**
