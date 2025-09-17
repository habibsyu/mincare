import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Heart, 
  User, 
  LogOut, 
  Settings, 
  MessageCircle,
  BookOpen,
  Users,
  BarChart3
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
    setShowUserMenu(false)
  }

  const navLinks = [
    { name: 'Home', path: '/', icon: Heart },
    { name: 'Assessment', path: '/assessment/PHQ-9', icon: BarChart3 },
    { name: 'Content', path: '/contents', icon: BookOpen },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Community', path: '/community', icon: Users },
  ]

  const userLinks = isAuthenticated ? [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Chat', path: '/chat', icon: MessageCircle },
    { name: 'Profile', path: '/profile', icon: User },
  ] : []

  const adminLinks = user?.role === 'admin' ? [
    { name: 'Admin Panel', path: '/admin', icon: Settings },
  ] : []

  const allLinks = [...navLinks, ...userLinks, ...adminLinks]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container-xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MindCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {userLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'text-primary-600'
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`text-sm font-medium transition-colors duration-200 ${
                      location.pathname.startsWith('/admin')
                        ? 'text-primary-600'
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    Admin
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="hidden lg:block">{user?.name}</span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                      >
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="btn btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200"
            >
              <div className="py-4 space-y-2">
                {allLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon className="w-4 h-4 mr-3" />
                    {link.name}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center px-4 py-2 text-sm text-gray-500">
                      <User className="w-4 h-4 mr-3" />
                      {user?.name} ({user?.role})
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <Link
                      to="/auth/login"
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/auth/register"
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar