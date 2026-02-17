'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { 
  Mic,
  MicOff, 
  PhoneOff,
  Clock,
  Bot,
  User
} from 'lucide-react';

const InterviewPage = () => {
  const router = useRouter();
  const params = useParams();
  const token = params?.token;
  
  // Interview state
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [status, setStatus] = useState('connecting'); // connecting, ai_speaking, listening, processing, ended
  const [timer, setTimer] = useState(0);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  // Sample questions for demo
  const questions = [
    "Hello! I'm Sarah, your AI recruiter today. Can you please introduce yourself and tell me about your background?",
    "What interests you most about this position and our company?", 
    "Can you describe a challenging project you've worked on recently and how you overcame obstacles?",
    "How do you handle working under pressure and tight deadlines?",
    "Where do you see yourself professionally in the next 5 years?"
  ];

  // Candidate info (mock data)
  const candidateInfo = {
    name: "Rahul",
    avatar: "R"
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (status !== 'connecting' && status !== 'ended') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Interview flow simulation
  useEffect(() => {
    if (status === 'connecting') {
      // Initial connection
      const connectTimeout = setTimeout(() => {
        startNextQuestion();
      }, 2000);
      return () => clearTimeout(connectTimeout);
    }
  }, [status]);

  const startNextQuestion = () => {
    if (questionIndex >= questions.length) {
      handleEndInterview();
      return;
    }

    setCurrentQuestion(questions[questionIndex]);
    setStatus('ai_speaking');
    setIsAISpeaking(true);
    setIsUserSpeaking(false);

    // Simulate AI speaking duration (3-5 seconds)
    const speakingDuration = 3000 + Math.random() * 2000;
    
    setTimeout(() => {
      setIsAISpeaking(false);
      setStatus('listening');
      
      // Auto advance after user speaking simulation (5-10 seconds)
      const listeningDuration = 5000 + Math.random() * 5000;
      
      setTimeout(() => {
        setStatus('processing');
        
        // Processing time (1-2 seconds)
        setTimeout(() => {
          setQuestionIndex(prev => prev + 1);
          startNextQuestion();
        }, 1500);
      }, listeningDuration);
    }, speakingDuration);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMic = () => {
    setIsMicEnabled(!isMicEnabled);
  };

  const handleEndInterview = () => {
    setStatus('ended');
    setIsAISpeaking(false);
    setIsUserSpeaking(false);
    setTimeout(() => {
      router.push(`/interview/${token}/complete`);
    }, 2000);
  };

  const getStatusText = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting...';
      case 'ai_speaking':
        return 'AI is speaking...';
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing...';
      case 'ended':
        return 'Interview Complete';
      default:
        return 'Interview in Progress...';
    }
  };

  // Loading state
  if (status === 'connecting') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connecting to Interview</h2>
          <p className="text-gray-600">Please wait while we set up your session...</p>
        </motion.div>
      </div>
    );
  }

  // End state
  if (status === 'ended') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Interview Complete</h2>
          <p className="text-gray-600">Thank you for your time. Redirecting...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">AI Interview Session</h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{formatTime(timer)}</span>
          </div>
        </div>
      </div>

      {/* Current Question */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block max-w-3xl">
              <p className="text-gray-900 text-lg leading-relaxed">
                {currentQuestion || 'Preparing your interview...'}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Video Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* AI Interviewer Card */}
          <motion.div
            animate={{
              scale: isAISpeaking ? 1.02 : 1,
              boxShadow: isAISpeaking 
                ? '0 10px 25px rgba(59, 130, 246, 0.3)' 
                : '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center relative overflow-hidden"
          >
            {isAISpeaking && (
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500 rounded-xl"
              />
            )}
            <div className="relative z-10">
              <motion.div
                animate={{ 
                  scale: isAISpeaking ? [1, 1.05, 1] : 1,
                }}
                transition={{ 
                  duration: 1, 
                  repeat: isAISpeaking ? Infinity : 0 
                }}
                className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Bot className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="font-semibold text-gray-900 mb-1">AI Recruiter</h3>
              <p className="text-sm text-gray-500">Sarah</p>
              {isAISpeaking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <div className="flex items-center justify-center space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: [4, 12, 4],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                        className="w-1 bg-blue-500 rounded-full"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">Speaking...</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Candidate Card */}
          <motion.div
            animate={{
              scale: status === 'listening' ? 1.02 : 1,
              boxShadow: status === 'listening'
                ? '0 10px 25px rgba(34, 197, 94, 0.3)' 
                : '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center relative overflow-hidden"
          >
            {status === 'listening' && (
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-green-500 rounded-xl"
              />
            )}
            <div className="relative z-10">
              <motion.div
                animate={{ 
                  scale: status === 'listening' ? [1, 1.05, 1] : 1,
                }}
                transition={{ 
                  duration: 1, 
                  repeat: status === 'listening' ? Infinity : 0 
                }}
                className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
              >
                {candidateInfo.avatar}
              </motion.div>
              <h3 className="font-semibold text-gray-900 mb-1">{candidateInfo.name}</h3>
              <p className="text-sm text-gray-500">Candidate</p>
              {status === 'listening' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 bg-green-500 rounded-full mx-auto"
                  />
                  <p className="text-xs text-green-600 mt-2">Listening...</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMic}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isMicEnabled 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-red-100 hover:bg-red-200 text-red-600'
            }`}
          >
            {isMicEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEndConfirm(true)}
            className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white"
          >
            <PhoneOff className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Status Text */}
        <div className="text-center">
          <motion.p
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            {getStatusText()}
          </motion.p>
        </div>
      </div>

      {/* End Confirmation Modal */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">End Interview?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to end the interview? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEndInterview}
                  className="flex-1 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                >
                  End Interview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewPage;