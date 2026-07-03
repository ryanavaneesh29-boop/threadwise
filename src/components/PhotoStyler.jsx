import React, { useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'
import OutfitCard from './OutfitCard'

export default function PhotoStyler({ loading, recommendation, onAnalyze, onChoose }) {
  const [preview, setPreview] = useState('')
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (!file) {
      setPreview('')
      return
    }

    const nextPreview = URL.createObjectURL(file)
    setPreview(nextPreview)

    return () => URL.revokeObjectURL(nextPreview)
  }, [file])

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0]
    if (!nextFile) return

    setFile(nextFile)
  }

  function handleAnalyze() {
    if (file) onAnalyze(file)
  }

  return (
    <section className="rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-xl shadow-neutral-200/70 dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/20 sm:p-6">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">Photo stylist</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">Upload today&apos;s outfit</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          Take or upload a photo. Threadwise will recommend pieces from your saved wardrobe and rank the options.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-[1.25rem] border border-dashed border-neutral-300 bg-neutral-50 p-3 dark:border-white/10 dark:bg-white/5">
          {preview ? (
            <img src={preview} alt="Uploaded outfit preview" className="h-72 w-full rounded-2xl object-cover" />
          ) : (
            <label className="grid h-72 cursor-pointer place-items-center rounded-2xl bg-white text-center dark:bg-neutral-950">
              <span>
                <span className="block text-lg font-semibold text-neutral-950 dark:text-white">Add outfit photo</span>
                <span className="mt-2 block text-sm text-neutral-500 dark:text-neutral-400">Camera or upload</span>
              </span>
              <input className="sr-only" type="file" accept="image/*" capture="environment" onChange={handleFileChange} />
            </label>
          )}

          {preview ? (
            <label className="mt-3 block cursor-pointer rounded-2xl border border-neutral-200 px-4 py-3 text-center text-sm font-semibold text-neutral-700 transition hover:border-neutral-950 dark:border-white/10 dark:text-neutral-200 dark:hover:bg-white/10">
              Change photo
              <input className="sr-only" type="file" accept="image/*" capture="environment" onChange={handleFileChange} />
            </label>
          ) : null}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="mt-3 w-full rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-neutral-950"
          >
            {loading ? 'Ranking wardrobe...' : 'Rank wardrobe options'}
          </button>
        </div>

        <div>
          {loading ? <LoadingSpinner /> : null}

          {!loading && !recommendation ? (
            <div className="grid h-full min-h-72 place-items-center rounded-[1.25rem] bg-neutral-50 p-6 text-center dark:bg-white/5">
              <div>
                <p className="text-lg font-semibold text-neutral-950 dark:text-white">Your ranked options will appear here</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                  For now photo understanding is simulated locally; a real vision model can replace this service later.
                </p>
              </div>
            </div>
          ) : null}

          {!loading && recommendation?.outfits?.length ? (
            <div>
              <p className="mb-4 rounded-2xl bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-600 dark:bg-white/5 dark:text-neutral-300">
                {recommendation.rationale}
              </p>
              <div className="grid gap-4">
                {recommendation.outfits.map((outfit) => (
                  <div key={outfit.id} className="relative">
                    <span className="absolute right-4 top-4 z-10 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                      Rank #{outfit.rank}
                    </span>
                    <OutfitCard outfit={outfit} onChoose={onChoose} chooseLabel="Choose this look" />
                    {outfit.reason ? (
                      <p className="mt-2 px-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{outfit.reason}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
