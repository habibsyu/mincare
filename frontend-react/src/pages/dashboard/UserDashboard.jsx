import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { assessmentAPI, contentAPI } from '../../services/api';
import { 
  Brain, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuthStore();
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [recommendedContent, setRecommendedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssessments: 0,
    lastAssessment: null,
    averageScore: 0,
    improvementTrend: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [historyResponse, contentResponse] = await Promise.all([
        assessmentAPI.getHistory(),
        contentAPI.getAll({ limit: 6, featured: true })
      ]);

      const history = historyResponse.data.data || [];
      setAssessmentHistory(history);
      setRecommendedContent(contentResponse.data.data || []);

      // Calculate stats
      if (history.length > 0) {
        const totalScore = history.reduce((sum, assessment) => sum + assessment.score, 0);
        const averageScore = totalScore / history.length;
        
        let improvementTrend = 0;
        if (history.length >= 2) {
          const recent = history.slice(0, 2);
          improvementTrend = recent[0].score - recent[1].score;
        }

        setStats({
          totalAssessments: history.length,
          lastAssessment: history[0],
          averageScore: Math.round(averageScore * 10) / 10,
          improvementTrend
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score, type) => {
    // Simplified scoring - you can enhance this based on assessment type
    if (score <= 5) return 'text-green-600';
    if (score <= 10) return 'text-yellow-600';
    if (score <= 15) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend < 0) return <TrendingUp className="w-4 h-4 text-green-500 transform rotate-180" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's your mental health journey overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssessments}</p>
              </div>
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
                  {stats.averageScore}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trend</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {Math.abs(stats.improvementTrend)}
                  </span>
                  {getTrendIcon(stats.improvementTrend)}
                </div>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Assessment</p>
                <p className="text-sm font-bold text-gray-900">
                  {stats.lastAssessment ? formatDate(stats.lastAssessment.created_at) : 'None'}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assessment History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Assessments</h2>
                  <Link
                    to="/assessment/PHQ-9"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Take New Assessment
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {assessmentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {assessmentHistory.slice(0, 5).map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <Brain className="w-8 h-8 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{assessment.type}</h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(assessment.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getScoreColor(assessment.score, assessment.type)}`}>
                            {assessment.score}
                          </div>
                          <div className="text-sm text-gray-500">{assessment.result_label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
                    <p className="text-gray-500 mb-4">
                      Take your first mental health assessment to get started
                    </p>
                    <Link
                      to="/assessment/PHQ-9"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Start Assessment
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Recommendations */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/chat"
                  className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Start Chat Support</span>
                </Link>
                
                <Link
                  to="/contents"
                  className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Browse Resources</span>
                </Link>
                
                <Link
                  to="/community"
                  className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-800">Join Community</span>
                </Link>
              </div>
            </div>

            {/* Recommended Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h2>
              <div className="space-y-4">
                {recommendedContent.slice(0, 3).map((content) => (
                  <div key={content.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                      {content.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {content.excerpt || 'Learn more about mental health and wellness...'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {content.type}
                      </span>
                      <Link
                        to={`/contents/${content.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mental Health Tip */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">Daily Wellness Tip</h3>
                  <p className="text-sm opacity-90">
                    Take 5 minutes today for deep breathing exercises. It can help reduce stress and improve your mood.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;