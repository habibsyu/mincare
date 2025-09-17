import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Platform': [
      { name: 'Self Assessment', path: '/assessment/PHQ-9' },
      { name: 'Educational Content', path: '/contents' },
      { name: 'Mental Health Blog', path: '/blog' },
      { name: 'Community Support', path: '/community' },
    ],
    'Support': [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Crisis Resources', path: '/crisis' },
      { name: 'Privacy Policy', path: '/privacy' },
    ],
    'Company': [
      { name: 'About Us', path: '/about' },
      { name: 'Our Team', path: '/team' },
      { name: 'Careers', path: '/careers' },
      { name: 'Terms of Service', path: '/terms' },
    ]
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">MindCare</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Professional mental health support platform providing evidence-based assessments, 
              educational resources, and compassionate care for your mental wellness journey.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-3" />
                <span>support@mindcare.com</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-3" />
                <span>24/7 Crisis Hotline: 988</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} MindCare. All rights reserved. | 
              <span className="ml-1">
                Professional mental health platform designed with care.
              </span>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Banner */}
      <div className="bg-error-600 py-3">
        <div className="container-xl">
          <div className="text-center text-white text-sm">
            <strong>Crisis Support:</strong> If you're having thoughts of self-harm, 
            call 988 (Suicide & Crisis Lifeline) or text "HELLO\" to 741741 (Crisis Text Line)
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer