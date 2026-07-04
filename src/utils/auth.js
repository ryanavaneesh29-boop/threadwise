import { supabase } from '../services/supabaseClient'

const USERS_KEY = 'threadwise-users'

export const hasSupabase = Boolean(supabase)

export const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export const isEmailValid = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const registerUser = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase()

  if (hasSupabase) {
    const { data, error } = await supabase.auth.signUp({ email: normalizedEmail, password })
    if (error) {
      throw new Error(error.message || 'Unable to register with Supabase.')
    }
    return {
      email: data.user?.email || normalizedEmail,
      session: data.session || null,
      user: data.user || null
    }
  }

  const users = getStoredUsers()
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('An account already exists for this email.')
  }

  const hashedPassword = await hashPassword(password)
  users.push({
    email: normalizedEmail,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  })
  saveUsers(users)
  return { email: normalizedEmail }
}

export const getUserByEmail = (email) => {
  const normalizedEmail = email.trim().toLowerCase()
  if (hasSupabase) {
    return { email: normalizedEmail }
  }
  return getStoredUsers().find((user) => user.email === normalizedEmail) || null
}

export const deleteUserByEmail = async (email) => {
  const normalizedEmail = email.trim().toLowerCase()
  if (hasSupabase) {
    await supabase.auth.signOut()
    return false
  }

  const users = getStoredUsers()
  const remainingUsers = users.filter((user) => user.email !== normalizedEmail)
  saveUsers(remainingUsers)
  return users.length !== remainingUsers.length
}

export const verifyLogin = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase()

  if (hasSupabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
    if (error) {
      return null
    }
    return { email: data.user?.email || normalizedEmail, session: data.session || null, user: data.user || null }
  }

  const users = getStoredUsers()
  const hashedPassword = await hashPassword(password)
  return users.find((user) => user.email === normalizedEmail && user.password === hashedPassword) || null
}

export const signOut = async () => {
  if (hasSupabase) {
    await supabase.auth.signOut()
  }
}

export const getAuthSession = async () => {
  if (!hasSupabase) {
    return null
  }
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    return null
  }
  return data.session
}
