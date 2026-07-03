# Threadwise - AI Clothing Recommender

A modern React + Tailwind fashion-tech web app that recommends a complete outfit from one clothing item.

## Features

- Responsive startup-style homepage
- Search input and clothing category dropdown
- Rule-based recommendation engine
- Color, style, season, and occasion matching
- Outfit cards with color swatches and save actions
- Dark mode with saved preference
- Favorite outfits and outfit history in localStorage
- Photo upload/camera outfit scan with ranked wardrobe options
- Rating popup that stores local feedback and adjusts future rankings
- Random outfit generator
- Trending outfits and fashion tips sections
- Modular AI provider boundary for OpenAI, Gemini, or Hugging Face integration later

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite, usually:

```bash
http://localhost:5173
```

## Project structure

```text
src/
|-- components/
|-- pages/
|-- services/
|-- data/
|-- utils/
|-- hooks/
|-- App.jsx
`-- main.jsx
```

## Recommendation engine

The current engine is rule-based and lives in `src/services/recommendation.js`. It detects likely color, category, style, occasion, and season from the user input, then scores wardrobe items by:

- compatible colors
- matching styles
- season fit
- occasion fit
- gender flexibility
- neutral shoe/accessory usefulness
- saved user ratings from previous photo recommendations

`src/services/api.js` defines the future provider boundary for hosted AI recommendations.
