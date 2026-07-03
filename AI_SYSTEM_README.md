# AI Clothing Recommendation System

A modern, AI-powered clothing recommendation web application that learns from user-uploaded images and provides personalized outfit suggestions.

## Features

### 🎨 Core Recommendations
- **Text-based recommendations**: Enter any clothing item to get matching outfit suggestions
- **Photo analysis**: Upload outfit photos for AI-powered analysis and recommendations
- **Random outfit generator**: Discover new outfit combinations
- **Trending outfits**: See what other users are styling

### 🤖 Machine Learning Capabilities
- **Image recognition**: Automatically detects clothing type, color, style, and pattern from uploaded images
- **AI model training**: Learn from your uploaded images to improve recommendations over time
- **Training data persistence**: Save and export your trained models locally
- **Confidence scoring**: Get confidence metrics on clothing detection and recommendations

### 🎯 Learning Features
- **Upload and label**: Build your personal clothing database by uploading images with custom labels
- **Model training**: Train the AI model with collected samples for personalized recommendations
- **Prediction engine**: Use the trained model to analyze new clothing items
- **Export/Import**: Share trained models with others or back them up

### 🌙 User Experience
- **Dark mode**: Full dark mode support for comfortable viewing
- **Responsive design**: Works seamlessly on mobile, tablet, and desktop
- **Favorite outfits**: Save your favorite generated outfits
- **Outfit history**: Keep track of all your searches and recommendations
- **Style memory**: Rate recommendations to teach the local ranking model

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
cd ai-clothes-matcher
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## How to Use

### 1. Text-Based Recommendations

1. Enter a clothing item (e.g., "Blue jeans") in the search bar
2. Optionally select a category
3. Click "Get recommendations"
4. View the generated outfit with matching pieces

### 2. Upload Training Data (AI Learning)

1. Navigate to the **AI Training** section
2. Click **"Upload"** mode
3. Select an image of a clothing item
4. Add a descriptive label (e.g., "Red Hoodie", "White Sneakers")
5. Click "Add to Training Data"
6. Repeat to build your clothing database
7. Once you have 2+ samples, click "Train Model" to train the AI

### 3. Make Predictions

1. Go to the **AI Predictions** section
2. Upload an image of a clothing item
3. Click "Analyze Clothing"
4. View:
   - Detected clothing characteristics (type, color, style, pattern)
   - Confidence score
   - Similar items from your training data
   - Personalized recommendations based on learned patterns

### 4. Manage Your Model

1. In the **AI Training** section
2. Click **"View"** tab to see:
   - Total training samples
   - Unique clothing types learned
   - Model status
   - All labeled training data
3. Click **"Export"** tab to:
   - Export model as JSON (to share or backup)
   - Import a pre-trained model

## Project Structure

```
src/
├── components/
│   ├── AITrainingPanel.jsx        # UI for training the AI model
│   ├── AIPredictionPanel.jsx      # UI for making predictions
│   ├── DarkToggle.jsx             # Dark mode toggle
│   ├── Header.jsx                 # Application header
│   ├── Hero.jsx                   # Landing hero section
│   ├── LoadingSpinner.jsx         # Loading animation
│   ├── OutfitCard.jsx             # Outfit display card
│   ├── PhotoStyler.jsx            # Photo upload and analysis
│   ├── RatingModal.jsx            # Outfit rating modal
│   ├── Results.jsx                # Search results display
│   ├── RecommendationButton.jsx   # Recommendation trigger button
│   └── SearchBar.jsx              # Search input component
├── pages/
│   └── Home.jsx                   # Main application page
├── services/
│   ├── api.js                     # API communication utilities
│   ├── mlModel.js                 # Machine learning model core
│   └── recommendation.js          # Recommendation engine
├── data/
│   └── clothingDatabase.js        # Clothing dataset
├── utils/
│   └── colorUtils.js              # Color utilities
├── hooks/
│   └── useLocalStorage.js         # Local storage hook
├── styles/
│   └── globals.css                # Global styles
├── App.jsx                        # App component
└── main.jsx                       # Entry point
```

## ML Model Architecture

### ClothingAIModel Class

The core ML system is implemented in `src/services/mlModel.js`:

```javascript
class ClothingAIModel {
  // Initialize neural network for image feature extraction
  async initialize()
  
  // Extract visual features from clothing images
  async extractImageFeatures(imageFile)
  
  // Analyze clothing characteristics
  async analyzeClothing(imageFile)
  
  // Add labeled training data
  async addTrainingData(imageFile, label)
  
  // Train model on collected data
  async trainModel()
  
  // Predict clothing type and get recommendations
  async predictClothing(imageFile)
  
  // Get training statistics
  getStatistics()
  
  // Export model for sharing/backup
  async exportModel()
  
  // Import pre-trained model
  async importModel(data)
}
```

### Model Capabilities

#### Image Analysis
- **Color Detection**: Identifies dominant colors in clothing
- **Type Classification**: Determines clothing category (shirt, pants, shoes, etc.)
- **Style Recognition**: Detects style (casual, formal, sporty, etc.)
- **Pattern Detection**: Identifies patterns (solid, striped, plaid, etc.)

#### Confidence Scoring
- Each prediction includes a confidence score (0-1)
- Higher scores indicate more reliable predictions

#### Training Features
- Local browser-based training (no server required)
- Automatic persistence to browser's localStorage
- Export/import capabilities for model sharing

## Advanced Usage

### Exporting Your Model

1. Go to **AI Training** → **Export** tab
2. Click "📥 Export Model as JSON"
3. A JSON file with all your training data and labels is downloaded
4. Share the file with others or keep as backup

### Importing a Model

1. Go to **AI Training** → **Export** tab
2. Click "Import Model" 
3. Select a previously exported model JSON file
4. Model data is imported and ready to use

### Understanding Predictions

Each prediction includes:
- **Type**: Clothing category detected
- **Color**: Dominant color(s)
- **Style**: Style classification
- **Pattern**: Pattern type
- **Confidence**: How sure the model is (as percentage)
- **Similar Items**: Clothing from your training data that's similar
- **Recommendations**: Suggested pieces to pair with

## Customization

### Adding Custom Clothing Data

Edit `src/data/clothingDatabase.js` to add more clothing items:

```javascript
{
  "name": "Leather Jacket",
  "category": "Jacket",
  "color": "Black",
  "style": "Edgy",
  "season": "Fall",
  "gender": "Unisex",
  "occasion": "Evening"
}
```

### Styling

All styles use Tailwind CSS. Customize colors and themes in `tailwind.config.cjs`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add custom colors here
      }
    }
  }
}
```

## Future Enhancements

### Planned Features

1. **Pre-trained Models**
   - Use TensorFlow pre-trained models (MobileNet, EfficientNet)
   - Significantly improve accuracy of clothing detection

2. **Backend Integration**
   - Save models to cloud database
   - Share models with community
   - Collaborative learning

3. **API Integrations**
   - OpenAI Vision API for advanced image understanding
   - Google Gemini for multi-modal analysis
   - Hugging Face models for specialized tasks

4. **Advanced Features**
   - Virtual try-on using AR
   - Price integration for shopping
   - Weather-based recommendations
   - Body shape optimization
   - Seasonal trend analysis

5. **Performance**
   - Web Workers for model training
   - GPU acceleration via WebGL
   - Model quantization for faster inference

## Technical Stack

### Frontend
- **React 18**: UI framework
- **Tailwind CSS**: Styling
- **Vite**: Build tool

### Machine Learning
- **TensorFlow.js**: Neural network library
- **tf.js Browser API**: Image processing

### Storage
- **Browser LocalStorage**: Model persistence
- **JSON Export**: Model sharing

## Browser Support

- Chrome/Edge (v90+)
- Firefox (v88+)
- Safari (v14+)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

1. **Image Size**: Upload reasonably sized images (< 5MB) for faster processing
2. **Training**: More samples = better model (aim for 20+ samples per category)
3. **Storage**: Exported models are stored in browser localStorage (~5-10MB limit)
4. **Export Large Models**: If approaching storage limit, export and clear data

## Troubleshooting

### "Not enough training data" error
- **Solution**: You need at least 2 different labeled samples to train

### Model not making good predictions
- **Solution**: Add more training samples (different angles, lighting, items)
- **Solution**: Ensure labels are clear and specific

### App not loading
- **Solution**: Clear browser cache and localStorage
- **Solution**: Try in an incognito/private window

### Images not uploading
- **Solution**: Ensure image is under 5MB
- **Solution**: Try a different image format (JPEG, PNG, WebP)

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on the repository.

---

## API Reference

### ClothingAI Methods

#### `initialize()`
Initialize the ML model. Call this once before using predictions.

```javascript
await clothingAI.initialize();
```

#### `addTrainingData(imageFile, label)`
Add a labeled image to the training dataset.

**Parameters:**
- `imageFile` (File): Image file to train on
- `label` (string): Label describing the clothing item

**Returns:** Promise resolving to clothing object with detected features

```javascript
const clothing = await clothingAI.addTrainingData(imageFile, "Blue Denim Jacket");
```

#### `trainModel()`
Train the model with collected data.

**Returns:** Promise resolving to training results

```javascript
const results = await clothingAI.trainModel();
// { success: true, samplesUsed: 15, accuracy: 0.856, ... }
```

#### `predictClothing(imageFile)`
Predict clothing characteristics and get recommendations.

**Parameters:**
- `imageFile` (File): Image to analyze

**Returns:** Promise resolving to prediction object

```javascript
const prediction = await clothingAI.predictClothing(imageFile);
// {
//   analysis: { type, color, style, pattern, ... },
//   confidence: 0.87,
//   similarFromTraining: [...],
//   recommendations: { tops: [], bottoms: [], ... }
// }
```

#### `getStatistics()`
Get current model statistics.

**Returns:** Statistics object

```javascript
const stats = clothingAI.getStatistics();
// { totalSamples: 42, uniqueLabels: 8, labels: [...], ... }
```

#### `exportModel()`
Export trained model for backup or sharing.

**Returns:** Promise resolving to exportable model data

```javascript
const modelData = await clothingAI.exportModel();
// Can be JSON stringified and saved
```

#### `importModel(data)`
Import a previously exported model.

**Parameters:**
- `data` (object): Exported model data

**Returns:** Promise

```javascript
await clothingAI.importModel(savedModelData);
```

---

Built with ❤️ for fashion enthusiasts and developers
