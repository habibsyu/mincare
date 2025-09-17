import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Heart } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md w-full"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="text-8xl font-bold text-primary-200 mb-4">404</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We couldn't find the page you're looking for. It might have been moved, 
            deleted, or you entered the wrong URL. Don't worry, we're here to help 
            you get back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
            <Link to="/" className="btn btn-primary inline-flex items-center">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Looking for something specific? Try these popular pages:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/assessment/PHQ-9" className="text-primary-600 hover:text-primary-700">
                Mental Health Assessment
              </Link>
              <Link to="/contents" className="text-primary-600 hover:text-primary-700">
                Educational Content
              </Link>
              <Link to="/blog" className="text-primary-600 hover:text-primary-700">
                Mental Health Blog
              </Link>
              <Link to="/community" className="text-primary-600 hover:text-primary-700">
                Community Support
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Crisis Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 p-4 bg-error-50 border border-error-200 rounded-lg"
        >
          <p className="text-sm text-error-800">
            <strong>Need immediate help?</strong> If you're in crisis, 
            call 988 (Suicide & Crisis Lifeline) or text "HELLO\" to 741741
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage