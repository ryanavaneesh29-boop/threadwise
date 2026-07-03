import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="grid place-items-center rounded-[1.25rem] border border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center dark:border-white/10 dark:bg-white/5">
      <div className="relative h-16 w-16">
        <span className="absolute inset-0 rounded-full border border-neutral-200 dark:border-white/10" />
        <span className="absolute inset-2 rounded-full border-4 border-neutral-200 border-t-neutral-950 animate-spin dark:border-white/10 dark:border-t-white" />
      </div>
      <p className="mt-5 text-sm font-medium text-neutral-700 dark:text-neutral-200">Reading color, season, occasion, and silhouette...</p>
    </div>
  )
}
