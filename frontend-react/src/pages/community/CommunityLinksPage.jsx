import React, { useState, useEffect } from 'react';
import { communityAPI } from '../../services/api';
import { ExternalLink, Users, MessageCircle, Hash, Globe } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CommunityLinksPage = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunityLinks();
  }, []);

  const loadCommunityLinks = async () => {
    try {
      setLoading(true);
      const response = await communityAPI.getLinks();
      setLinks(response.data || []);
    } catch (error) {
      console.error('Error loading community links:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'discord':
        return <MessageCircle className="w-8 h-8" />;
      case 'telegram':
        return <Hash className="w-8 h-8" />;
      default:
        return <Globe className="w-8 h-8" />;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform.toLowerCase()) {
      case 'discord':
        return 'from-indigo-500 to-purple-600';
      case 'telegram':
        return 'from-blue-500 to-cyan-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPlatformDescription = (platform) => {
    switch (platform.toLowerCase()) {
      case 'discord':
        return 'Join our Discord server for real-time conversations, support groups, and community events.';
      case 'telegram':
        return 'Connect with our Telegram community for daily tips, resources, and peer support.';
      default:
        return 'Connect with our community through this platform.';
    }
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Community</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with others on their mental health journey. Share experiences, find support, 
            and access resources in our welcoming community spaces.
          </p>
        </div>

        {/* Community Guidelines */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Be Respectful</h3>
                  <p className="text-gray-600 text-sm">Treat all members with kindness and respect</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Share Safely</h3>
                  <p className="text-gray-600 text-sm">Only share what you're comfortable with</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Support Others</h3>
                  <p className="text-gray-600 text-sm">Offer encouragement and understanding</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Stay On Topic</h3>
                  <p className="text-gray-600 text-sm">Keep discussions relevant to mental health</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">No Medical Advice</h3>
                  <p className="text-gray-600 text-sm">Share experiences, not medical recommendations</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Maintain Privacy</h3>
                  <p className="text-gray-600 text-sm">Respect others' privacy and confidentiality</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Links */}
        {links.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Available Communities</h2>
            {links.map((link) => (
              <div key={link.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className={`bg-gradient-to-r ${getPlatformColor(link.platform)} rounded-xl p-4 text-white`}>
                        {getPlatformIcon(link.platform)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                          {link.platform} Community
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {link.description || getPlatformDescription(link.platform)}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>Active Community</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>24/7 Support</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-gradient-to-r ${getPlatformColor(link.platform)} text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center space-x-2`}
                    >
                      <span>Join Now</span>
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Communities Coming Soon</h3>
            <p className="text-gray-600 mb-6">
              We're setting up community spaces for you to connect with others. Check back soon!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
              <h4 className="font-semibold text-blue-900 mb-2">Get Notified</h4>
              <p className="text-blue-800 text-sm mb-4">
                Want to be the first to know when our communities launch?
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Notify Me
              </button>
            </div>
          </div>
        )}

        {/* Crisis Support */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-xl p-8">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Need Immediate Help?</h3>
            <p className="text-red-800 mb-6">
              If you're experiencing a mental health crisis, please reach out for immediate professional help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:988"
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Call Crisis Hotline: 988
              </a>
              <a
                href="/chat"
                className="bg-white text-red-600 border border-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors font-semibold"
              >
                Start Emergency Chat
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityLinksPage;hhhhhhhhhhhhhhhhhhhhjh