import React, { useMemo, useState, useEffect } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import OutfitCard from '../components/OutfitCard'
import PhotoStyler from '../components/PhotoStyler'
import RatingModal from '../components/RatingModal'
import Results from '../components/Results'
import SearchBar from '../components/SearchBar'
import AITrainingPanel from '../components/AITrainingPanel'
import AIPredictionPanel from '../components/AIPredictionPanel'
import useLocalStorage from '../hooks/useLocalStorage'
import { generateRandomOutfit, getTrendingOutfits, recommendFromPhoto, recommendOutfit } from '../services/recommendation'
import { clothingAI } from '../services/mlModel'

const tips = [
  'Let one piece lead. If your base item is bold, keep two supporting pieces neutral.',
  'Match the occasion before the color palette. Formal sneakers are still casual sneakers.',
  'Repeat one color in a small accessory to make a look feel intentional.',
  'Use jackets to adjust season fit without changing the core outfit.'
]

export default function Home() {
  const [query, setQuery] = useState('Blue jeans')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [error, setError] = useState('')
  const [recommendation, setRecommendation] = useState(null)
  const [photoRecommendation, setPhotoRecommendation] = useState(null)
  const [selectedOutfit, setSelectedOutfit] = useState(null)
  const [favorites, setFavorites] = useLocalStorage('threadwise-favorites', [])
  const [history, setHistory] = useLocalStorage('threadwise-history', [])
  const [styleFeedback, setStyleFeedback] = useLocalStorage('threadwise-style-feedback', [])
  const [isDark, setIsDark] = useState(false)
  const trending = useMemo(() => getTrendingOutfits(), [])

  // Initialize ML model and listen for dark mode changes
  useEffect(() => {
    const initializeAI = async () => {
      await clothingAI.initialize()
      clothingAI.loadTrainingData()
    }
    initializeAI()

    // Listen for dark mode changes
    const updateDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    updateDarkMode()
    const observer = new MutationObserver(updateDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    return () => observer.disconnect()
  }, [])

  async function handleRecommend() {
    setLoading(true)
    setError('')

    try {
      const nextRecommendation = await recommendOutfit({ query, category, feedback: styleFeedback })
      setRecommendation(nextRecommendation)
      setHistory((current) => [
        {
          id: crypto.randomUUID(),
          query: query || category || nextRecommendation.seed.name,
          seed: nextRecommendation.seed.name,
          createdAt: new Date().toISOString(),
          outfits: nextRecommendation.outfits
        },
        ...current
      ].slice(0, 12))
    } catch (err) {
      setError(err.message || 'We could not generate an outfit for that input.')
    } finally {
      setLoading(false)
    }
  }

  function handleRandom() {
    const randomRecommendation = generateRandomOutfit(styleFeedback)
    setQuery(randomRecommendation.seed.name)
    setCategory(randomRecommendation.seed.category)
    setRecommendation(randomRecommendation)
    setError('')
    setHistory((current) => [
      {
        id: crypto.randomUUID(),
        query: 'Random outfit',
        seed: randomRecommendation.seed.name,
        createdAt: new Date().toISOString(),
        outfits: randomRecommendation.outfits
      },
      ...current
    ].slice(0, 12))
  }

  function saveFavorite(outfit) {
    setFavorites((current) => {
      const exists = current.some((item) => item.id === outfit.id)
      if (exists) return current
      return [{ ...outfit, savedAt: new Date().toISOString() }, ...current].slice(0, 8)
    })
  }

  async function handlePhotoAnalyze(file) {
    setPhotoLoading(true)
    setError('')

    try {
      const nextRecommendation = await recommendFromPhoto({ file, feedback: styleFeedback })
      setPhotoRecommendation(nextRecommendation)
      setHistory((current) => [
        {
          id: crypto.randomUUID(),
          query: 'Photo outfit scan',
          seed: nextRecommendation.seed.name,
          createdAt: new Date().toISOString(),
          outfits: nextRecommendation.outfits
        },
        ...current
      ].slice(0, 12))
    } catch (err) {
      setError(err.message || 'We could not rank wardrobe options from that photo.')
    } finally {
      setPhotoLoading(false)
    }
  }

  function handleChooseOutfit(outfit) {
    setSelectedOutfit(outfit)
  }

  function handleSubmitRating(entry) {
    setStyleFeedback((current) => [entry, ...current].slice(0, 40))
    setSelectedOutfit(null)
  }

  return (
    <div className="min-h-screen bg-ivory-50 text-neutral-950 dark:bg-neutral-950 dark:text-white">
      <Header />
      <main>
        <Hero />

        <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <div className="grid gap-6">
            <SearchBar
              value={query}
              onChange={setQuery}
              category={category}
              onCategoryChange={setCategory}
              onSubmit={handleRecommend}
              onRandom={handleRandom}
              loading={loading}
              error={error}
            />
            <Results recommendation={recommendation} loading={loading} onSave={saveFavorite} />
            <PhotoStyler
              loading={photoLoading}
              recommendation={photoRecommendation}
              onAnalyze={handlePhotoAnalyze}
              onChoose={handleChooseOutfit}
            />
          </div>

          <aside className="grid gap-6 lg:sticky lg:top-24 lg:self-start">
            <Panel eyebrow="Saved" title="Favorite outfits">
              {favorites.length === 0 ? (
                <EmptyPanel text="Save a generated outfit to build a personal styling board." />
              ) : (
                <div className="grid gap-3">
                  {favorites.slice(0, 3).map((outfit) => (
                    <OutfitCard key={`${outfit.id}-${outfit.savedAt}`} outfit={outfit} compact />
                  ))}
                </div>
              )}
            </Panel>

            <Panel eyebrow="Recent" title="Outfit history">
              {history.length === 0 ? (
                <EmptyPanel text="Your recent searches will collect here." />
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setQuery(item.seed)}
                      className="w-full rounded-2xl bg-neutral-50 p-3 text-left transition hover:bg-neutral-100 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                      <p className="font-medium text-neutral-950 dark:text-white">{item.seed}</p>
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{item.query}</p>
                    </button>
                  ))}
                </div>
              )}
            </Panel>

            <Panel eyebrow="Learning" title="Style memory">
              {styleFeedback.length === 0 ? (
                <EmptyPanel text="Choose and rate a photo recommendation to teach the local ranking model." />
              ) : (
                <div className="space-y-3">
                  {styleFeedback.slice(0, 4).map((item) => (
                    <div key={`${item.outfitId}-${item.createdAt}`} className="rounded-2xl bg-neutral-50 p-3 dark:bg-white/5">
                      <p className="font-medium text-neutral-950 dark:text-white">{item.mood}</p>
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Rating: {item.rating}/5</p>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </aside>
        </section>

        <section id="trending" className="border-y border-neutral-200 bg-white py-16 dark:border-white/10 dark:bg-neutral-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader eyebrow="Trending" title="Looks people are building now" />
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {trending.map((outfit) => (
                <OutfitCard key={outfit.id} outfit={outfit} compact />
              ))}
            </div>
          </div>
        </section>

        <section id="ai" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Machine Learning" title="Train AI on your clothing" />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <AITrainingPanel isDark={isDark} />
            <AIPredictionPanel isDark={isDark} />
          </div>
        </section>

        <section id="tips" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Fashion tips" title="Small rules that make recommendations sharper" />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tips.map((tip, index) => (
              <article key={tip} className="rounded-[1.25rem] border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
                <span className="text-sm font-semibold text-neutral-400">0{index + 1}</span>
                <p className="mt-4 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{tip}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <RatingModal outfit={selectedOutfit} onClose={() => setSelectedOutfit(null)} onSubmit={handleSubmitRating} />
    </div>
  )
}

function Panel({ eyebrow, title, children }) {
  return (
    <section className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-xl shadow-neutral-200/70 dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/20">
      <p className="text-xs uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function EmptyPanel({ text }) {
  return <p className="rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-500 dark:bg-white/5 dark:text-neutral-400">{text}</p>
}

function SectionHeader({ eyebrow, title }) {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">{eyebrow}</p>
      <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">{title}</h2>
    </div>
  )
}
