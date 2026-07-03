import React from 'react'
import RecommendationButton from './RecommendationButton'

const categories = ['Top', 'Bottom', 'Shoes', 'Jacket', 'Accessory']
const examples = ['Blue jeans', 'Black hoodie', 'Cream sweater dinner', 'White linen shorts vacation']

export default function SearchBar({
  value,
  onChange,
  category,
  onCategoryChange,
  onSubmit,
  onRandom,
  loading,
  error
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <section id="recommend" className="rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-xl shadow-neutral-200/70 dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/20 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">Styling input</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">Start with one item</h2>
        </div>
        <button
          type="button"
          onClick={onRandom}
          className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 dark:border-white/10 dark:text-neutral-200 dark:hover:bg-white/10"
        >
          Random outfit
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 lg:grid-cols-[1fr_180px_auto]">
        <label className="block">
          <span className="sr-only">Clothing item</span>
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Try blue jeans, black hoodie, red blouse..."
            className="h-14 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-5 text-base outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white"
          />
        </label>

        <label className="block">
          <span className="sr-only">Category</span>
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="h-14 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-base outline-none transition focus:border-neutral-950 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white"
          >
            <option value="">Any category</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <RecommendationButton loading={loading} />
      </form>

      {error ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-200">{error}</p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onChange(example)}
            className="rounded-full bg-neutral-100 px-3 py-2 text-sm text-neutral-600 transition hover:bg-neutral-200 dark:bg-white/10 dark:text-neutral-300 dark:hover:bg-white/15"
          >
            {example}
          </button>
        ))}
      </div>
    </section>
  )
}
