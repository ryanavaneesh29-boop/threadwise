import React, { useEffect, useState } from 'react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Recommend from './pages/Recommend'
import Training from './pages/Training'
import Analysis from './pages/Analysis'
import ResetPassword from './pages/ResetPassword'
import AppNav from './components/AppNav'
import { getUserByEmail } from './utils/auth'

const protectedPages = ['recommend', 'training', 'analysis']

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)
    const resetToken = search.get('reset-token')
    const loggedIn = localStorage.getItem('threadwise-logged-in') === 'true'
    const email = localStorage.getItem('threadwise-user-email') || ''
    const hasRegisteredUser = email && getUserByEmail(email)
    setIsAuthenticated(loggedIn && Boolean(hasRegisteredUser))

    if (resetToken) {
      setCurrentPage('reset-password')
      return
    }

    if (!(loggedIn && Boolean(hasRegisteredUser)) && protectedPages.includes(currentPage)) {
      setCurrentPage('login')
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated && protectedPages.includes(currentPage)) {
      setCurrentPage('login')
    }
  }, [currentPage, isAuthenticated])

  const handleNavigate = (page) => {
    if (protectedPages.includes(page) && !isAuthenticated) {
      setCurrentPage('login')
      return
    }

    setCurrentPage(page)
  }

  const handleLogin = () => {
    localStorage.setItem('threadwise-logged-in', 'true')
    setIsAuthenticated(true)
    setCurrentPage('recommend')
  }

  const handleLogout = () => {
    localStorage.removeItem('threadwise-logged-in')
    localStorage.removeItem('threadwise-user-email')
    setIsAuthenticated(false)
    setCurrentPage('home')
  }

  const handleRegister = () => {
    setCurrentPage('login')
  }

  const handleNavigate = (page) => {
    if (page === 'register') {
      setCurrentPage('register')
      return
    }

    if (protectedPages.includes(page) && !isAuthenticated) {
      setCurrentPage('login')
      return
    }

    setCurrentPage(page)
  }

  const renderPage = () => {
    if (!isAuthenticated && currentPage === 'login') {
      return <Login onLogin={handleLogin} onNavigate={handleNavigate} />
    }

    if (!isAuthenticated && currentPage === 'register') {
      return <Register onRegister={handleRegister} onNavigate={handleNavigate} />
    }

    if (!isAuthenticated && currentPage === 'reset-password') {
      return <ResetPassword onNavigate={handleNavigate} />
    }

    if (!isAuthenticated && currentPage === 'home') {
      return <Landing onNavigate={handleNavigate} />
    }

    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AppNav currentPage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout} />
        {currentPage === 'home' && <Landing onNavigate={handleNavigate} />}
        {currentPage === 'recommend' && <Recommend />}
        {currentPage === 'training' && <Training />}
        {currentPage === 'analysis' && <Analysis />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory-50 text-neutral-950 transition-colors dark:bg-neutral-950 dark:text-white">
      {renderPage()}
    </div>
  )
}
