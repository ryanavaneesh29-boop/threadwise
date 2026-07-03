import React from 'react'
import AIPredictionPanel from '../components/AIPredictionPanel'

export default function Analysis() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">Clothing analysis</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-5xl">
          Analyze what you wear and get smarter recommendations.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Upload an outfit image and let the model identify key details to improve style suggestions.
        </p>
      </div>
      <AIPredictionPanel isDark={false} />
    </main>
  )
}
