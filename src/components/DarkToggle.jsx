import React, { useEffect, useState } from 'react'

export default function DarkToggle() {
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem('threadwise-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', enabled)
    localStorage.setItem('threadwise-theme', enabled ? 'dark' : 'light')
  }, [enabled])

  return (
    <button
      type="button"
      onClick={() => setEnabled((value) => !value)}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-300 dark:border-white/10 dark:bg-white/10 dark:text-neutral-100 dark:hover:bg-white/15"
      aria-label="Toggle dark mode"
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-neutral-950 text-[10px] text-white dark:bg-white dark:text-neutral-950">
        {enabled ? 'D' : 'L'}
      </span>
      <span className="hidden sm:inline">{enabled ? 'Dark' : 'Light'}</span>
    </button>
  )
}
