import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Shield, 
  Users, 
  MessageCircle, 
  BookOpen, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Play
} from 'lucide-react'

const HomePage = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Professional Assessments',
      description: 'Evidence-based mental health screenings including PHQ-9, GAD-7, and DASS-21 with personalized recommendations.',
      color: 'bg-primary-100 text-primary-600'
    },
    {
      icon: MessageCircle,
      title: 'AI-Powered Support',
      description: 'Intelligent chatbot provides immediate support with seamless handover to human counselors when needed.',
      color: 'bg-secondary-100 text-secondary-600'
    },
    {
      icon: BookOpen,
      title: 'Educational Resources',
      description: 'Comprehensive library of articles, videos, and interactive content to support your mental wellness journey.',
      color: 'bg-accent-100 text-accent-600'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with others through our Discord and Telegram communities for peer support and shared experiences.',
      color: 'bg-success-100 text-success-600'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your data is encrypted and protected. All assessments and conversations are completely confidential.',
      color: 'bg-warning-100 text-warning-600'
    },
    {
      icon: Heart,
      title: '24/7 Availability',
      description: 'Access support whenever you need it. Our platform is available around the clock for your mental health needs.',
      color: 'bg-error-100 text-error-600'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'User',
      content: 'MindCare helped me understand my anxiety better. The assessments were eye-opening and the support chat was incredibly helpful.',
      rating: 5
    },
    {
      name: 'Dr. James Wilson',
      role: 'Mental Health Professional',
      content: 'As a psychologist, I appreciate the evidence-based approach and the seamless integration of AI with human support.',
      rating: 5
    },
    {
      name: 'Maria L.',
      role: 'User',
      content: 'The community support and educational resources have been invaluable in my mental health journey. Highly recommended.',
      rating: 5
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Users Supported' },
    { number: '25,000+', label: 'Assessments Completed' },
    { number: '98%', label: 'User Satisfaction' },
    { number: '24/7', label: 'Support Available' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container-xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Mental Health
                <span className="text-gradient block">Matters</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Professional mental health support with evidence-based assessments, 
                AI-powered counseling, and compassionate human care. Take the first 
                step towards better mental wellness today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/assessment/PHQ-9" className="btn btn-primary btn-lg">
                  Start Free Assessment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/chat" className="btn btn-outline btn-lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Get Support Now
                </Link>
              </div>
              <div className="flex items-center mt-8 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-success-600 mr-2" />
                <span>Completely confidential and secure</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-primary rounded-full opacity-10"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-secondary rounded-full opacity-10"></div>
                
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Mental Health Assessment</h3>
                      <p className="text-sm text-gray-500">PHQ-9 Depression Screening</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Progress</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                          <div className="w-16 h-2 bg-primary-600 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-primary-600">67%</span>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-700 mb-3">
                        "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?"
                      </p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="radio" className="mr-2" />
                          <span className="text-sm">Not at all</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" className="mr-2" defaultChecked />
                          <span className="text-sm">Several days</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Mental Health Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines evidence-based assessments, AI-powered support, 
              and human expertise to provide comprehensive mental health care.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card card-hover p-6"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600">
              See what our users and mental health professionals say about MindCare
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warning-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container-xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Your Mental Health Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Take the first step towards better mental health with our free, 
              confidential assessment. Get personalized recommendations and support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessment/PHQ-9" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
                Start Free Assessment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/auth/register" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 btn-lg">
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Crisis Support Banner */}
      <section className="py-4 bg-error-600 text-white">
        <div className="container-xl">
          <div className="text-center">
            <p className="font-medium">
              <strong>Crisis Support:</strong> If you're having thoughts of self-harm, 
              call 988 (Suicide & Crisis Lifeline) or text "HELLO\" to 741741
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage