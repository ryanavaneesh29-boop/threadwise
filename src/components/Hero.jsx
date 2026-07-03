import React from 'react'

const looks = [
  { label: 'Base', value: 'Blue jeans', tone: 'bg-blue-600' },
  { label: 'Layer', value: 'Denim jacket', tone: 'bg-sky-800' },
  { label: 'Finish', value: 'Silver watch', tone: 'bg-slate-300' }
]

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center lg:px-8 lg:py-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3 py-1 text-sm text-neutral-600 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-neutral-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Rule-based AI styling, model-ready architecture
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight text-neutral-950 dark:text-white sm:text-6xl lg:text-7xl">
            Outfit ideas that start with the piece you already want to wear.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
            Tell Threadwise the item, color, or occasion. It reads the style signal and builds a full look across tops, bottoms, shoes, jackets, and accessories.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-neutral-600 dark:text-neutral-300">
            {['Color harmony', 'Season aware', 'Occasion matched', 'Saved history'].map((item) => (
              <span key={item} className="rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-sm dark:border-white/10 dark:bg-white/10">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-neutral-950 p-5 text-white shadow-2xl shadow-neutral-300/60 dark:shadow-black/30">
          <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.28),_transparent_36%),linear-gradient(135deg,_rgba(217,119,6,0.28),_rgba(37,99,235,0.22),_transparent_68%)]" />
          <div className="relative flex h-full min-h-[380px] flex-col justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/55">Live edit</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Blue jeans</h2>
              <p className="mt-2 max-w-xs text-sm leading-6 text-white/65">
                Casual everyday outfit with crisp neutrals and a denim layer.
              </p>
            </div>

            <div className="grid gap-3">
              {looks.map((look) => (
                <div key={look.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <span className={`h-10 w-10 rounded-full border border-white/20 ${look.tone}`} />
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">{look.label}</p>
                      <p className="font-medium">{look.value}</p>
                    </div>
                  </div>
                  <span className="text-sm text-white/45">Matched</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
