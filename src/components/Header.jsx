import React from 'react'
import DarkToggle from './DarkToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-ivory-50/85 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-neutral-950 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950">
            T
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-tight">Threadwise</span>
            <span className="block text-xs uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">AI styling studio</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-300 md:flex">
          <a href="#recommend" className="transition hover:text-neutral-950 dark:hover:text-white">Recommend</a>
          <a href="#ai" className="transition hover:text-neutral-950 dark:hover:text-white">AI Training</a>
          <a href="#trending" className="transition hover:text-neutral-950 dark:hover:text-white">Trending</a>
          <a href="#tips" className="transition hover:text-neutral-950 dark:hover:text-white">Tips</a>
        </nav>

        <DarkToggle />
      </div>
    </header>
  )
}
