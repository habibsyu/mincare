import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Configure axios defaults
axios.defaults.baseURL = API_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      // Initialize auth state
      initializeAuth: async () => {
        const { token } = get()
        
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          try {
            const response = await axios.get('/auth/me')
            set({ 
              user: response.data.user, 
              isAuthenticated: true,
              isInitialized: true 
            })
          } catch (error) {
            // Token is invalid, clear auth state
            get().logout()
          }
        } else {
          set({ isInitialized: true })
        }
      },

      // Login
      login: async (email, password) => {
        set({ isLoading: true })
        
        try {
          const response = await axios.post('/auth/login', { email, password })
          const { user, access_token } = response.data
          
          // Set token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false
          })
          
          return { success: true, user }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.error || 'Login failed'
          return { success: false, error: message }
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true })
        
        try {
          const response = await axios.post('/auth/register', userData)
          const { user, access_token } = response.data
          
          // Set token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false
          })
          
          return { success: true, user }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.errors || error.response?.data?.error || 'Registration failed'
          return { success: false, error: message }
        }
      },

      // Logout
      logout: async () => {
        const { token } = get()
        
        if (token) {
          try {
            await axios.post('/auth/logout')
          } catch (error) {
            // Ignore logout errors
          }
        }
        
        // Clear axios headers
        delete axios.defaults.headers.common['Authorization']
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        })
      },

      // Update profile
      updateProfile: async (profileData) => {
        set({ isLoading: true })
        
        try {
          const response = await axios.put('/users/profile', profileData)
          const updatedUser = response.data
          
          set({
            user: updatedUser,
            isLoading: false
          })
          
          return { success: true, user: updatedUser }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.errors || error.response?.data?.error || 'Profile update failed'
          return { success: false, error: message }
        }
      },

      // Check if user has required role
      hasRole: (requiredRole) => {
        const { user } = get()
        if (!user) return false
        
        const roleHierarchy = {
          'admin': ['admin'],
          'staff': ['admin', 'staff'],
          'psikolog': ['admin', 'staff', 'psikolog'],
          'user': ['admin', 'staff', 'psikolog', 'user']
        }
        
        return roleHierarchy[requiredRole]?.includes(user.role) || false
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },

      // Check if user is staff
      isStaff: () => {
        const { user } = get()
        return ['admin', 'staff'].includes(user?.role)
      }
    }),
    {
      name: 'mindcare-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)