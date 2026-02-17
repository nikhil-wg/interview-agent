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
  ThumbsUp
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
  const token = params?.token;

  // Mock interview statistics
  const interviewStats = {
    duration: '18:32',
    questionsAnswered: 5,
    totalQuestions: 5,
    completionDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  };

  const handleSubmitFeedback = async () => {
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setSubmitting(false);
  };

  const handleClose = () => {
    window.close();
  };

  return (
    <InterviewLayout
      title="Interview Complete!"
      subtitle="Thank you for completing the AI interview"
      showProgress={true}
      currentStep={5}
      totalSteps={5}
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
          <Card padding="md" className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
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
                  {interviewStats.questionsAnswered}/{interviewStats.totalQuestions}
                </div>
              </div>
              
              <div className="col-span-2">
                <span className="text-gray-600">Completed on:</span>
                <div className="font-medium mt-1">{interviewStats.completionDate}</div>
              </div>
            </div>
          </Card>
        </motion.div>

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