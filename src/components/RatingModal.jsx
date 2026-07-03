import React, { useState } from 'react'

export default function RatingModal({ outfit, onClose, onSubmit }) {
  const [rating, setRating] = useState(4)

  if (!outfit) return null

  function handleSubmit() {
    onSubmit({
      outfitId: outfit.id,
      mood: outfit.mood,
      rating,
      items: outfit.items.map((item) => item.name),
      createdAt: new Date().toISOString()
    })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl dark:bg-neutral-900">
        <p className="text-sm uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">Taste feedback</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">Rate this recommendation</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          Your score is saved locally and boosts or lowers similar wardrobe picks next time.
        </p>

        <div className="mt-5 rounded-2xl bg-neutral-50 p-4 dark:bg-white/5">
          <p className="font-medium text-neutral-950 dark:text-white">{outfit.mood}</p>
          <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            {outfit.items.map((item) => item.name).join(', ')}
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`grid h-12 w-12 place-items-center rounded-full text-lg font-semibold transition ${
                value <= rating
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                  : 'bg-neutral-100 text-neutral-500 dark:bg-white/10 dark:text-neutral-300'
              }`}
              aria-label={`Rate ${value} out of 5`}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-950 dark:border-white/10 dark:text-neutral-200 dark:hover:bg-white/10"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
          >
            Save rating
          </button>
        </div>
      </div>
    </div>
  )
}
