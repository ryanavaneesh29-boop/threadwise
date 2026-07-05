import React, { useEffect, useState } from 'react'
import { hasSupabase, requestPasswordReset } from '../utils/auth'
import { supabase } from '../services/supabaseClient'

const rawApiUrl = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL
const apiBase = rawApiUrl
  ? rawApiUrl.replace(/\/api\/?$/, '')
  : 'http://localhost:5000'

export default function ResetPassword({ onNavigate }) {
  const [stage, setStage] = useState('request')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [isRecoveryMode, setIsRecoveryMode] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      const search = new URLSearchParams(window.location.search)
      const resetToken = search.get('token') || search.get('reset-token')
      const accessToken = search.get('access_token')
      const refreshToken = search.get('refresh_token')
      const type = search.get('type')
      const recoveryLink = accessToken && type === 'recovery'

      if (recoveryLink) {
        setIsRecoveryMode(true)
        setStage('confirm')

        if (hasSupabase) {
          await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        }
        return
      }

      if (resetToken) {
        setToken(resetToken)
        setStage('confirm')
      }
    }

    initialize()
  }, [])

  const sendResetLink = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!email.trim()) {
      setError('Enter your email address to receive the reset link.')
      return
    }

    setLoading(true)
    try {
      if (hasSupabase) {
        const { error } = await requestPasswordReset(email.trim())
        if (error) {
          setError(error.message || 'Could not send reset link. Please try again.')
        } else {
          setMessage('Reset link sent. Check your inbox.')
        }
      } else {
        const response = await fetch(`${apiBase}/api/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() })
        })

        const result = await response.json()
        if (!response.ok) {
          setError(result.error || 'Could not send reset link. Please try again.')
        } else {
          setMessage(result.message || 'Reset link sent. Check your inbox.')
        }
      }
    } catch (err) {
      setError('Unable to reach the server. Try again later.')
    } finally {
      setLoading(false)
    }
  }

  const confirmReset = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!password.trim() || !confirm.trim()) {
      setError('Both password fields are required.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      if (hasSupabase) {
        const { data, error } = await supabase.auth.updateUser({ password: password.trim() })
        if (error) {
          setError(error.message || 'Unable to reset your password.')
        } else {
          setMessage('Password reset successful. You may now log in.')
        }
      } else {
        if (!token) {
          setError('Reset token is missing. Please use the link from your email.')
          return
        }

        const response = await fetch(`${apiBase}/api/auth/confirm-reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password: password.trim() })
        })

        const result = await response.json()
        if (!response.ok) {
          setError(result.error || 'Unable to reset your password.')
        } else {
          setMessage(result.message || 'Password reset successful. You may now log in.')
        }
      }
    } catch (err) {
      setError('Unable to reach the server. Try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-[0_30px_100px_-40px_rgba(15,23,42,0.8)] backdrop-blur-xl sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Reset password</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Secure password recovery for your account
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Enter your email to receive a secure reset link, or follow the link from your inbox to choose a new password.
            </p>
            <div className="mt-8 grid gap-4 rounded-[1.5rem] bg-white/5 p-6 ring-1 ring-white/10">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">How it works</p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
                  <li>1. Request a reset link by email</li>
                  <li>2. Open the link and set a new password</li>
                  <li>3. Log in again and continue styling</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="rounded-full bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Back to login
              </button>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-slate-950/95 p-8 ring-1 ring-slate-700/60 shadow-2xl shadow-black/30">
            {stage === 'request' ? (
              <form className="space-y-6" onSubmit={sendResetLink}>
                <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/90">Request reset link</p>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-4 text-base text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
                {error ? <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div> : null}
                {message ? <div className="rounded-3xl bg-emerald-500/10 p-4 text-sm text-emerald-200">{message}</div> : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-3xl bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? 'Sending link…' : 'Send reset link'}
                </button>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={confirmReset}>
                <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/90">Create a new password</p>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="New password"
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-4 text-base text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Confirm password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    placeholder="Confirm password"
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-4 text-base text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
                {error ? <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div> : null}
                {message ? <div className="rounded-3xl bg-emerald-500/10 p-4 text-sm text-emerald-200">{message}</div> : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-3xl bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? 'Resetting password…' : 'Reset password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
