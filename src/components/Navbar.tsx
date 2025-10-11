
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {Menu, X, User, LogOut, Leaf} from 'lucide-react'

const Navbar: React.FC = () => {
  const { user, isAuthenticated, signIn, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/recommendations', label: 'Recommendations' },
    { path: '/foods', label: 'Food Database' },
    { path: '/health-tracker', label: 'Health Tracker' },
    { path: '/profile', label: 'Profile' }
  ]

  const adminNavItems = [
    { path: '/admin', label: 'Admin Panel' }
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-white" />
            <span className="text-white text-xl font-bold font-playfair">
              Ancient Wisdom
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-white hover:text-orange-200 transition-colors font-medium ${
                  isActive(item.path) ? 'text-orange-200 border-b-2 border-orange-200' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated && user?.userRole === 'ADMIN' && (
              adminNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-white hover:text-orange-200 transition-colors font-medium ${
                    isActive(item.path) ? 'text-orange-200 border-b-2 border-orange-200' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-white">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user?.userName}</span>
                  {user?.userRole === 'ADMIN' && (
                    <span className="bg-orange-800 text-white px-2 py-1 rounded-full text-xs">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-1 bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-orange-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-orange-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 text-white hover:text-orange-200 transition-colors ${
                  isActive(item.path) ? 'text-orange-200 bg-orange-800 rounded' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated && user?.userRole === 'ADMIN' && (
              adminNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-white hover:text-orange-200 transition-colors ${
                    isActive(item.path) ? 'text-orange-200 bg-orange-800 rounded' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))
            )}
            
            <div className="border-t border-orange-600 pt-3 mt-3">
              {isAuthenticated ? (
                <div className="px-3 py-2">
                  <div className="text-white font-medium mb-2">
                    {user?.userName}
                    {user?.userRole === 'ADMIN' && (
                      <span className="ml-2 bg-orange-800 text-white px-2 py-1 rounded-full text-xs">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left text-white hover:text-orange-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signIn()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:text-orange-200"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
