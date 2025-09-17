import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import LoadingSpinner from '../common/LoadingSpinner'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, isInitialized } = useAuthStore()
  const location = useLocation()

  // Show loading while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // Check role requirements
  if (requiredRole) {
    const hasRequiredRole = () => {
      if (!user) return false
      
      const roleHierarchy = {
        'admin': ['admin'],
        'staff': ['admin', 'staff'],
        'psikolog': ['admin', 'staff', 'psikolog'],
        'user': ['admin', 'staff', 'psikolog', 'user']
      }
      
      return roleHierarchy[requiredRole]?.includes(user.role) || false
    }

    if (!hasRequiredRole()) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Required role: {requiredRole}
            </p>
            <button
              onClick={() => window.history.back()}
              className="btn btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    }
  }

  return children
}

export default ProtectedRoute