import React from 'react'
import { colorSwatch } from '../utils/colorUtils'

export default function OutfitCard({ outfit, onSave, onChoose, chooseLabel = 'Choose outfit', compact = false }) {
  return (
    <article className="rounded-[1.25rem] border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-200/80 dark:border-white/10 dark:bg-neutral-900 dark:hover:shadow-black/25">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">{outfit.mood}</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">Complete outfit</h3>
        </div>
        {typeof outfit.score === 'number' ? (
          <span className="rounded-full bg-neutral-950 px-3 py-1 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950">
            {outfit.score}
          </span>
        ) : null}
      </div>

      <div className={`mt-5 grid gap-3 ${compact ? '' : 'sm:grid-cols-2'}`}>
        {outfit.items.map((item) => (
          <div key={`${outfit.id}-${item.name}`} className="rounded-2xl bg-neutral-50 p-3 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <span
                className="h-9 w-9 shrink-0 rounded-full border border-neutral-200 dark:border-white/10"
                style={{ backgroundColor: colorSwatch(item.color) }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate font-medium text-neutral-950 dark:text-white">{item.name}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.category} - {item.color}</p>
              </div>
            </div>
            {!compact ? (
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-neutral-400">{item.style} / {item.occasion}</p>
            ) : null}
          </div>
        ))}
      </div>

      {onChoose ? (
        <button
          type="button"
          onClick={() => onChoose(outfit)}
          className="mt-5 w-full rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
        >
          {chooseLabel}
        </button>
      ) : null}

      {onSave ? (
        <button
          type="button"
          onClick={() => onSave(outfit)}
          className="mt-5 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950 dark:border-white/10 dark:text-neutral-200 dark:hover:bg-white/10"
        >
          Save outfit
        </button>
      ) : null}
    </article>
  )
}
