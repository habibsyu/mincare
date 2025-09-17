import React, { Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from './stores/authStore'
import { SocketProvider } from './providers/SocketProvider'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LoadingSpinner from './components/common/LoadingSpinner'
import ErrorBoundary from './components/common/ErrorBoundary'

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'))
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'))
const AssessmentPage = React.lazy(() => import('./pages/AssessmentPage'))
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'))
const ContentListPage = React.lazy(() => import('./pages/ContentListPage'))
const ContentDetailPage = React.lazy(() => import('./pages/ContentDetailPage'))
const BlogListPage = React.lazy(() => import('./pages/BlogListPage'))
const BlogDetailPage = React.lazy(() => import('./pages/BlogDetailPage'))
const CommunityPage = React.lazy(() => import('./pages/CommunityPage'))
const ChatPage = React.lazy(() => import('./pages/ChatPage'))
const AdminPanel = React.lazy(() => import('./pages/admin/AdminPanel'))
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'))

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const { initializeAuth, isInitialized } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <SocketProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          
          <main className="flex-1">
            <Suspense fallback={
              <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            }>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/register" element={<RegisterPage />} />
                  <Route path="/assessment/:type" element={<AssessmentPage />} />
                  <Route path="/contents" element={<ContentListPage />} />
                  <Route path="/contents/:id" element={<ContentDetailPage />} />
                  <Route path="/blog" element={<BlogListPage />} />
                  <Route path="/blog/:slug" element={<BlogDetailPage />} />
                  <Route path="/community" element={<CommunityPage />} />

                  {/* Protected Routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/chat" 
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Admin Routes */}
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminPanel />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Fallback Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </motion.div>
            </Suspense>
          </main>

          <Footer />
        </div>
      </SocketProvider>
    </ErrorBoundary>
  )
}

export default App