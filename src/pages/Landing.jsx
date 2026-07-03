import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'

export default function Landing({ onNavigate }) {
  return (
    <div className="min-h-screen bg-ivory-50 text-neutral-950 dark:bg-neutral-950 dark:text-white">
      <Header />
      <main>
        <Hero />
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/70 dark:border-white/10 dark:bg-neutral-950 dark:shadow-black/20">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white">Explore Threadwise</h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-300">
                  The homepage is public. Create an account or sign in to unlock outfit recommendations, AI training, and clothing analysis.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Sign in to continue
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('recommend')}
                  className="rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Preview recommendations
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
