import React, { useState } from 'react'
import { isEmailValid, registerUser } from '../utils/auth'

export default function Register({ onRegister, onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!email.trim() || !password.trim() || !confirm.trim()) {
      setError('All fields are required to create an account.')
      return
    }

    if (!isEmailValid(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (!agreed) {
      setError('You must agree to the privacy policy to continue.')
      return
    }

    setLoading(true)
    try {
      const registeredUser = await registerUser(email, password)
      if (registeredUser?.email) {
        onRegister?.(registeredUser.email)
      } else {
        setMessage('Account created successfully. Please sign in.')
        setEmail('')
        setPassword('')
        setConfirm('')
        setAgreed(false)
      }
    } catch (err) {
      setError(err.message || 'Unable to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_transparent_25%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-3/5 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_25%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-[0_40px_120px_-30px_rgba(15,23,42,0.75)] backdrop-blur-xl sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm uppercase tracking-[0.28em] text-cyan-300">
                register panel
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Create your Threadwise account
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Register to save your preferences, track your recommendations, and access the full Threadwise experience.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white/5 p-5 ring-1 ring-white/10">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Secure signup</p>
                  <p className="mt-3 text-lg font-semibold text-white">Passwords are hashed locally before storage.</p>
                </div>
                <div className="rounded-[1.5rem] bg-white/5 p-5 ring-1 ring-white/10">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Data consent</p>
                  <p className="mt-3 text-lg font-semibold text-white">Your account data is stored only in your browser.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/95 p-8 shadow-2xl shadow-black/30">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">New user</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Register with your email</h2>
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
                    placeholder="Create a password"
                    className="w-full rounded-3xl border border-slate-700 bg-slate-800/90 px-4 py-4 text-base text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Confirm password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    placeholder="Confirm your password"
                    className="w-full rounded-3xl border border-slate-700 bg-slate-800/90 px-4 py-4 text-base text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    id="gdpr-consent"
                    className="mt-1 h-5 w-5 rounded-md border border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                  />
                  <div className="space-y-1">
                    <label htmlFor="gdpr-consent" className="text-sm leading-6 text-slate-300 block">
                      I agree to the privacy policy and consent to data processing for account use.
                    </label>
                    <button
                      type="button"
                      onClick={() => onNavigate('privacy')}
                      className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
                    >
                      Read the full privacy policy
                    </button>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200 ring-1 ring-rose-500/20">
                    {error}
                  </div>
                ) : null}
                {message ? (
                  <div className="rounded-3xl bg-emerald-500/10 p-4 text-sm text-emerald-200 ring-1 ring-emerald-500/20">
                    {message}
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="w-full rounded-3xl bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:opacity-95"
                  disabled={loading}
                >
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="font-medium text-indigo-300 hover:text-indigo-200"
                >
                  Back to login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
