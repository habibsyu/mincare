import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentSession, setCurrentSession] = useState(null)
  const { token, isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && token) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'
      
      const newSocket = io(socketUrl, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      })

      newSocket.on('connect', () => {
        setIsConnected(true)
        console.log('Connected to chat service')
      })

      newSocket.on('disconnect', () => {
        setIsConnected(false)
        console.log('Disconnected from chat service')
      })

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
        toast.error('Failed to connect to chat service')
      })

      newSocket.on('error', (error) => {
        console.error('Socket error:', error)
        toast.error(error.message || 'Chat service error')
      })

      newSocket.on('session_joined', (data) => {
        setCurrentSession(data)
        toast.success('Joined counseling session')
      })

      newSocket.on('message_received', (message) => {
        // Handle incoming messages
        if (currentSession) {
          setCurrentSession(prev => ({
            ...prev,
            messages: [...(prev.messages || []), message]
          }))
        }
      })

      newSocket.on('escalation_suggested', (data) => {
        toast.error('Crisis keywords detected. Consider speaking with a human counselor.', {
          duration: 8000
        })
      })

      newSocket.on('staff_joined', (data) => {
        toast.success(`${data.staffName} has joined the conversation`)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [isAuthenticated, token])

  const joinSession = (sessionId, consent = true) => {
    if (socket && isConnected) {
      socket.emit('join_session', { sessionId, consent })
    }
  }

  const sendMessage = (sessionId, message, metadata = {}) => {
    if (socket && isConnected) {
      socket.emit('send_message', { sessionId, message, metadata })
    }
  }

  const requestEscalation = (sessionId, reason) => {
    if (socket && isConnected) {
      socket.emit('request_escalation', { sessionId, reason })
    }
  }

  const staffJoinSession = (sessionId) => {
    if (socket && isConnected && user?.role && ['admin', 'staff', 'psikolog'].includes(user.role)) {
      socket.emit('staff_join_session', { sessionId })
    }
  }

  const value = {
    socket,
    isConnected,
    currentSession,
    setCurrentSession,
    joinSession,
    sendMessage,
    requestEscalation,
    staffJoinSession
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}