import React, { useState } from 'react'

export default function Login({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password to continue.')
      return
    }
    localStorage.setItem('threadwise-user-email', email.trim())
    localStorage.setItem('threadwise-logged-in', 'true')
    onLogin()
  }


  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_transparent_25%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-3/5 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_25%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-[0_40px_120px_-30px_rgba(15,23,42,0.75)] backdrop-blur-xl sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-2 text-sm uppercase tracking-[0.28em] text-violet-300">
                login panel
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Login to idkbro
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Sign in to unlock outfit generation, AI training, and wardrobe analysis. Beautiful styling and secure password reset are built in.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white/5 p-5 ring-1 ring-white/10">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Fast access</p>
                  <p className="mt-3 text-lg font-semibold text-white">Personalized outfit recommendations</p>
                </div>
                <div className="rounded-[1.5rem] bg-white/5 p-5 ring-1 ring-white/10">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Secure</p>
                  <p className="mt-3 text-lg font-semibold text-white">Reset password by email anytime</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/95 p-8 shadow-2xl shadow-black/30">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Welcome back</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Sign in to your account</h2>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-3xl border border-slate-700 bg-slate-800/90 px-4 py-4 text-base text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-3xl border border-slate-700 bg-slate-800/90 px-4 py-4 text-base text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                  />
                </div>

                {error ? (
                  <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200 ring-1 ring-rose-500/20">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="w-full rounded-3xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:opacity-95"
                >
                  Login
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                <button
                  type="button"
                  onClick={() => onNavigate('reset-password')}
                  className="font-medium text-slate-200 hover:text-white"
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => alert('Register flow not implemented yet.')}
                  className="font-medium text-indigo-300 hover:text-indigo-200"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
