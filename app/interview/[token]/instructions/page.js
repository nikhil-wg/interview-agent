'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { 
  Wifi, 
  Mic, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  PlayCircle
} from 'lucide-react';
import InterviewLayout from '../../../components/layout/InterviewLayout';
import Button from '../../../components/ui/Button';

const InstructionsPage = () => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [micPermission, setMicPermission] = useState('pending'); // pending, granted, denied
  const token = params?.token;

  const handleStartInterview = async () => {
    // Check microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission('granted');
      stream.getTracks().forEach(track => track.stop()); // Stop the test stream
      
      setLoading(true);
      
      // Simulate setup time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      router.push(`/interview/${token}/interview`);
    } catch (error) {
      setMicPermission('denied');
    }
  };

  const instructions = [
    {
      icon: Wifi,
      title: 'Stable Internet Connection',
      description: 'Ensure you have a reliable internet connection throughout the interview',
      color: 'blue'
    },
    {
      icon: Mic,
      title: 'Microphone Access',
      description: 'Allow microphone access when prompted. Speak clearly and at a normal pace',
      color: 'green'
    },
    {
      icon: Volume2,
      title: 'Clear Audio',
      description: 'Use headphones if possible and find a quiet environment',
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Time Management',
      description: 'The interview typically takes 20-30 minutes. Take your time to think before answering',
      color: 'orange'
    }
  ];

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100 border-blue-200',
    green: 'text-green-600 bg-green-100 border-green-200',
    purple: 'text-purple-600 bg-purple-100 border-purple-200',
    orange: 'text-orange-600 bg-orange-100 border-orange-200'
  };

  return (
    <InterviewLayout
      title="Interview Instructions"
      subtitle="Please review the following before starting"
      showProgress={true}
      currentStep={3}
      totalSteps={5}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {instructions.map((instruction, index) => {
            const Icon = instruction.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-4 border rounded-lg bg-gray-50"
              >
                <div className={`p-2 rounded-lg border ${colorClasses[instruction.color]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {instruction.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {instruction.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {micPermission === 'denied' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Microphone Access Required</p>
              <p className="text-xs text-red-600 mt-1">
                Please enable microphone access in your browser settings and try again.
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <h3 className="font-medium text-blue-900 mb-2 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            What to Expect
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• The AI interviewer will ask you questions one at a time</li>
            <li>• Wait for the AI to finish speaking before responding</li>
            <li>• Take a moment to think before answering</li>
            <li>• You can pause or end the interview at any time</li>
            <li>• Your responses will be analyzed for the final report</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Button
            size="lg"
            className="w-full"
            onClick={handleStartInterview}
            loading={loading}
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Start Interview
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By starting the interview, you acknowledge that you've read and understood the instructions
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center pt-4 border-t border-gray-200"
        >
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Go Back
          </button>
        </motion.div>
      </div>
    </InterviewLayout>
  );
};

export default InstructionsPage;