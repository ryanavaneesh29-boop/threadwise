import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import OutfitCard from './OutfitCard'

export default function Results({ recommendation, loading, onSave }) {
  const outfits = recommendation?.outfits || []

  return (
    <section className="rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-xl shadow-neutral-200/70 dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/20 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">Recommendation</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">
            {recommendation?.seed ? `Styled around ${recommendation.seed.name}` : 'Your outfit will appear here'}
          </h2>
        </div>
        {recommendation?.profile ? (
          <div className="flex flex-wrap gap-2 text-sm">
            {[recommendation.profile.style, recommendation.profile.occasion, recommendation.profile.season].filter(Boolean).map((item) => (
              <span key={item} className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-600 dark:bg-white/10 dark:text-neutral-300">{item}</span>
            ))}
          </div>
        ) : null}
      </div>

      {loading ? <LoadingSpinner /> : null}

      {!loading && outfits.length === 0 ? (
        <div className="rounded-[1.25rem] border border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center dark:border-white/10 dark:bg-white/5">
          <p className="text-lg font-semibold text-neutral-950 dark:text-white">No outfit generated yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Try a specific item like "blue jeans" or mix in a goal like "black hoodie casual".
          </p>
        </div>
      ) : null}

      {!loading && outfits.length > 0 ? (
        <>
          {recommendation.rationale ? (
            <p className="mb-5 rounded-2xl bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-600 dark:bg-white/5 dark:text-neutral-300">
              {recommendation.rationale}
            </p>
          ) : null}
          <div className="grid gap-4 xl:grid-cols-2">
            {outfits.map((outfit) => (
              <OutfitCard key={outfit.id} outfit={outfit} onSave={onSave} />
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}
