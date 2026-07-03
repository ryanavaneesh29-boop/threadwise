import React from 'react'
import AITrainingPanel from '../components/AITrainingPanel'

export default function Training() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">AI Training</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-5xl">
          Build the model with your own wardrobe.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Upload images, review training data, and export models for later use.
        </p>
      </div>
      <AITrainingPanel isDark={false} />
    </main>
  )
}
