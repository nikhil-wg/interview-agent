'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle,
  Clock,
  Star,
  FileText,
  Download,
  ExternalLink,
  ThumbsUp,
  TrendingUp,
  Award
} from 'lucide-react';
import { useParams } from 'next/navigation';
import InterviewLayout from '../../../components/layout/InterviewLayout';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

const CompletePage = () => {
  const params = useParams();
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = params?.token;

  useEffect(() => {
    loadResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadResults = async () => {
    // First check sessionStorage (set by interview page)
    const cached = sessionStorage.getItem(`evaluation_${token}`);
    if (cached) {
      try {
        setEvaluation(JSON.parse(cached));
      } catch {}
    }

    // Also fetch from API for full stats
    try {
      const res = await fetch(`/api/interview/result?token=${encodeURIComponent(token)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.evaluation) setEvaluation(data.evaluation);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch results:', err);
    }

    setLoading(false);
  };

  const interviewStats = stats || {
    duration: '--:--',
    questionsAnswered: '--',
    completedAt: new Date().toISOString(),
    candidateName: '',
    jobTitle: '',
  };

  const completionDate = interviewStats.completedAt
    ? new Date(interviewStats.completedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleSubmitFeedback = async () => {
    setSubmitting(true);
    
    try {
      await fetch('/api/interview/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          feedback: { rating, text: feedback },
        }),
      });
    } catch {}
    
    setSubmitted(true);
    setSubmitting(false);
  };

  const handleClose = () => {
    window.close();
  };

  // Score badge color
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-700 bg-green-100';
    if (score >= 6) return 'text-blue-700 bg-blue-100';
    if (score >= 4) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  const getRecColor = (rec) => {
    if (rec === 'Strong Hire') return 'text-green-800 bg-green-100 border-green-300';
    if (rec === 'Hire') return 'text-blue-800 bg-blue-100 border-blue-300';
    if (rec === 'Borderline') return 'text-yellow-800 bg-yellow-100 border-yellow-300';
    return 'text-red-800 bg-red-100 border-red-300';
  };

  return (
    <InterviewLayout
      title="Interview Complete!"
      subtitle="Thank you for completing the AI interview"
      showProgress={true}
      currentStep={3}
      totalSteps={3}
    >
      <div className="space-y-6">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 10, 
            delay: 0.2 
          }}
          className="text-center"
        >
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </motion.div>

        {/* Interview Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card padding="md" className="bg-linear-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Interview Summary
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Duration:</span>
                <div className="font-medium flex items-center mt-1">
                  <Clock className="w-4 h-4 mr-1 text-gray-500" />
                  {interviewStats.duration}
                </div>
              </div>
              
              <div>
                <span className="text-gray-600">Questions:</span>
                <div className="font-medium mt-1">
                  {interviewStats.questionsAnswered}
                </div>
              </div>
              
              <div className="col-span-2">
                <span className="text-gray-600">Completed on:</span>
                <div className="font-medium mt-1">{completionDate}</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Evaluation Scores */}
        {evaluation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card padding="md">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                Evaluation Scores
              </h3>

              <div className="space-y-2">
                {[
                  { label: 'Technical Depth', value: evaluation.technicalDepth },
                  { label: 'Problem Solving', value: evaluation.problemSolving },
                  { label: 'System Design', value: evaluation.systemDesignThinking },
                  { label: 'Communication', value: evaluation.communicationClarity },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getScoreColor(item.value)}`}>
                      {item.value}/10
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <span className="font-semibold text-gray-900">Overall</span>
                </div>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${getScoreColor(evaluation.overallScore)}`}>
                  {evaluation.overallScore}/10
                </span>
              </div>

              {evaluation.hireRecommendation && (
                <div className={`mt-3 text-center text-sm font-medium px-3 py-2 rounded-lg border ${getRecColor(evaluation.hireRecommendation)}`}>
                  Recommendation: {evaluation.hireRecommendation}
                </div>
              )}

              {evaluation.summary && (
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  {evaluation.summary}
                </p>
              )}
            </Card>
          </motion.div>
        )}

        {/* Status Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <h3 className="font-medium text-green-900 mb-2">
            🎉 Successfully Submitted!
          </h3>
          <p className="text-sm text-green-700">
            Your interview responses have been recorded and will be reviewed by our team. 
            You should hear back within 2-3 business days.
          </p>
        </motion.div>

        {/* Feedback Section */}
        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h3 className="font-medium text-gray-900">
              How was your interview experience?
            </h3>
            
            {/* Star Rating */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Rate your experience:
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-1 transition-colors ${
                      star <= rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Feedback Text */}
            <div>
              <label htmlFor="feedback" className="block text-sm text-gray-600 mb-2">
                Additional feedback (optional):
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                placeholder="Share your thoughts about the interview process..."
              />
            </div>
            
            <Button
              onClick={handleSubmitFeedback}
              loading={submitting}
              className="w-full"
              disabled={rating === 0}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <ThumbsUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-blue-900 mb-1">Thank you!</h3>
            <p className="text-sm text-blue-700">
              Your feedback has been submitted and helps us improve the interview experience.
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3 pt-4"
        >
          <Button
            size="lg"
            className="w-full"
            onClick={handleClose}
          >
            Close Window
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              You can safely close this window. If you have any questions about your interview 
              or the process, please contact the hiring team directly.
            </p>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="pt-6 border-t border-gray-200"
        >
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your responses will be analyzed by our AI system</li>
              <li>• The hiring team will review your interview</li>
              <li>• You'll receive an update within 2-3 business days</li>
              <li>• Further interview rounds may be scheduled if appropriate</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </InterviewLayout>
  );
};

export default CompletePage;