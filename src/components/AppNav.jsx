import React from 'react'

export default function AppNav({ currentPage, onNavigate, onLogout }) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200">
      {[
        { key: 'home', label: 'Home' },
        { key: 'recommend', label: 'Recommend' },
        { key: 'training', label: 'Training' },
        { key: 'analysis', label: 'Analysis' },
        { key: 'privacy', label: 'Privacy' }
      ].map((link) => (
        <button
          key={link.key}
          type="button"
          onClick={() => onNavigate(link.key)}
          className={`rounded-full px-4 py-2 transition ${currentPage === link.key ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'hover:bg-neutral-100 dark:hover:bg-white/10'}`}
        >
          {link.label}
        </button>
      ))}
      <button
        type="button"
        onClick={onLogout}
        className="ml-auto rounded-full bg-red-100 px-4 py-2 text-red-700 transition hover:bg-red-200 dark:bg-red-500/10 dark:text-red-200 dark:hover:bg-red-500/20"
      >
        Log out
      </button>
    </nav>
  )
}
