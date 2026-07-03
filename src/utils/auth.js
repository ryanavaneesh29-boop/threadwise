const USERS_KEY = 'threadwise-users'

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

export const verifyLogin = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase()
  const users = getStoredUsers()
  const hashedPassword = await hashPassword(password)
  return users.find((user) => user.email === normalizedEmail && user.password === hashedPassword) || null
}
