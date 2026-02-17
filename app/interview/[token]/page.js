'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import InterviewLayout from '../../components/layout/InterviewLayout';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

const InterviewLinkPage = () => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [linkStatus, setLinkStatus] = useState('validating'); // validating, valid, invalid, expired
  const [candidateInfo, setCandidateInfo] = useState(null);
  const token = params?.token;

  useEffect(() => {
    // Simulate validation of interview link
    const validateLink = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate different scenarios based on token
      if (token === 'invalid') {
        setLinkStatus('invalid');
      } else if (token === 'expired') {
        setLinkStatus('expired');
      } else {
        setLinkStatus('valid');
        setCandidateInfo({
          name: 'John Doe',
          position: 'Software Engineer',
          company: 'TechCorp Inc.'
        });
      }
      
      setLoading(false);
    };

    validateLink();
  }, [token]);

  const handleContinue = () => {
    router.push(`/interview/${token}/verify`);
  };

  if (loading) {
    return (
      <InterviewLayout>
        <div className="text-center py-8">
          <Loader size="lg" text="Validating interview link..." />
        </div>
      </InterviewLayout>
    );
  }

  if (linkStatus === 'invalid') {
    return (
      <InterviewLayout 
        title="Invalid Link" 
        subtitle="This interview link is not valid"
      >
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
          >
            <AlertCircle className="w-8 h-8 text-red-600" />
          </motion.div>
          
          <p className="text-gray-600 mb-6">
            The interview link you're trying to access is not valid. Please check the URL or contact your interviewer.
          </p>
          
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Go Back
          </Button>
        </div>
      </InterviewLayout>
    );
  }

  if (linkStatus === 'expired') {
    return (
      <InterviewLayout 
        title="Link Expired" 
        subtitle="This interview link has expired"
      >
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4"
          >
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </motion.div>
          
          <p className="text-gray-600 mb-6">
            This interview link has expired. Please contact your interviewer to get a new link.
          </p>
          
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Go Back
          </Button>
        </div>
      </InterviewLayout>
    );
  }

  return (
    <InterviewLayout 
      title="AI Interview"
      subtitle="Welcome to your AI-powered interview"
      showProgress={true}
      currentStep={1}
      totalSteps={5}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-8 h-8 text-green-600" />
        </motion.div>

        {candidateInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <h3 className="font-medium text-blue-900 mb-2">Interview Details</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><span className="font-medium">Candidate:</span> {candidateInfo.name}</p>
              <p><span className="font-medium">Position:</span> {candidateInfo.position}</p>
              <p><span className="font-medium">Company:</span> {candidateInfo.company}</p>
            </div>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          Please verify your identity to begin the interview process. This helps ensure the security and integrity of the interview.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleContinue}
          >
            Continue to Verification
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          
          <p className="text-xs text-gray-500">
            By continuing, you agree to the interview terms and conditions
          </p>
        </motion.div>
      </div>
    </InterviewLayout>
  );
};

export default InterviewLinkPage;