import React from 'react'

export default function RecommendationButton({ loading }) {
  return (
    <button
      type="submit"
      className="inline-flex h-14 items-center justify-center rounded-2xl bg-neutral-950 px-6 text-base font-semibold text-white shadow-lg shadow-neutral-300/80 transition hover:-translate-y-0.5 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:bg-white dark:text-neutral-950 dark:shadow-black/30"
      disabled={loading}
    >
      {loading ? 'Generating...' : 'Recommend outfit'}
    </button>
  )
}
