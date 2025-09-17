import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../../services/api';
import { ASSESSMENT_TYPES, ASSESSMENT_RANGES } from '../../utils/constants';
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AssessmentPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestions();
  }, [type]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await assessmentAPI.getQuestions(type);
      setQuestions(response.data.questions || []);
    } catch (error) {
      setError('Failed to load assessment questions');
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!consent) {
      setError('Please provide consent to continue');
      return;
    }

    const answerArray = questions.map(q => answers[q.id] || 0);
    
    try {
      setSubmitting(true);
      const response = await assessmentAPI.submit({
        type,
        answers: answerArray,
        consent: true
      });
      setResult(response.data);
    } catch (error) {
      setError('Failed to submit assessment');
      console.error('Error submitting assessment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getScoreInterpretation = (score, assessmentType) => {
    const ranges = ASSESSMENT_RANGES[assessmentType.replace('-', '')];
    if (!ranges) return { label: 'Unknown', color: 'gray' };

    for (const [key, range] of Object.entries(ranges)) {
      if (score >= range.min && score <= range.max) {
        return range;
      }
    }
    return { label: 'Unknown', color: 'gray' };
  };

  const getColorClass = (color) => {
    const colorMap = {
      green: 'text-green-600 bg-green-50 border-green-200',
      yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      orange: 'text-orange-600 bg-orange-50 border-orange-200',
      red: 'text-red-600 bg-red-50 border-red-200',
      gray: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colorMap[color] || colorMap.gray;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (result) {
    const interpretation = getScoreInterpretation(result.score, type);
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete</h1>
              <p className="text-gray-600">Thank you for completing the {type} assessment</p>
            </div>

            <div className={`rounded-lg border-2 p-6 mb-6 ${getColorClass(interpretation.color)}`}>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{result.score}</div>
                <div className="text-xl font-semibold mb-2">{interpretation.label}</div>
                <div className="text-sm opacity-75">
                  Score range: {interpretation.min}-{interpretation.max}
                </div>
              </div>
            </div>

            {result.recommendations && result.recommendations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-800">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-yellow-800">
                  <p className="font-medium mb-1">Important Notice</p>
                  <p className="text-sm">
                    This assessment is for informational purposes only and should not replace professional medical advice. 
                    If you're experiencing severe symptoms, please consult with a healthcare professional.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View Dashboard
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Get Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Not Available</h2>
          <p className="text-gray-600 mb-4">The requested assessment type is not available.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const isLastStep = currentStep === questions.length - 1;
  const canProceed = answers[currentQuestion?.id] !== undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-gray-900">{type} Assessment</h1>
            <span className="text-sm text-gray-500">
              {currentStep + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion?.question}
            </h2>
            
            <div className="space-y-3">
              {currentQuestion?.options?.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[currentQuestion.id] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={answers[currentQuestion.id] === index}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    answers[currentQuestion.id] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion.id] === index && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Consent (only on last step) */}
          {isLastStep && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Consent for Assessment</p>
                  <p>
                    I consent to having my assessment data processed and stored securely for the purpose of 
                    providing mental health insights and recommendations. I understand that this assessment 
                    is not a substitute for professional medical advice.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {isLastStep ? (
              <button
                onClick={handleSubmit}
                disabled={!canProceed || !consent || submitting}
                className={`flex items-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors ${
                  !canProceed || !consent || submitting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Assessment</span>
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`flex items-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors ${
                  !canProceed
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;