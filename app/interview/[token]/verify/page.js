'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { Mail, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import InterviewLayout from '../../../components/layout/InterviewLayout';
import Button from '../../../components/ui/Button';

const VerifyPage = () => {
  const router = useRouter();
  const params = useParams();
  const [verificationMethod, setVerificationMethod] = useState('email'); // email, otp
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('input'); // input, verify_otp
  const token = params?.token;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setStep('verify_otp');
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (otp === '123456') {
      router.push(`/interview/${token}/instructions`);
    } else {
      setError('Invalid OTP. Please try again.');
      setLoading(false);
    }
  };

  const handleDirectOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (otp === '123456') {
      router.push(`/interview/${token}/instructions`);
    } else {
      setError('Invalid OTP. Please try again.');
      setLoading(false);
    }
  };

  return (
    <InterviewLayout
      title="Verify Identity"
      subtitle="Please verify your identity to continue"
      showProgress={true}
      currentStep={2}
      totalSteps={5}
    >
      <div className="space-y-6">
        {step === 'input' && (
          <>
            <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setVerificationMethod('email')}
                className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  verificationMethod === 'email' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </button>
              <button
                onClick={() => setVerificationMethod('otp')}
                className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  verificationMethod === 'otp' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Shield className="w-4 h-4 mr-2" />
                OTP
              </button>
            </div>

            {verificationMethod === 'email' ? (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleEmailSubmit}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your.email@company.com"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    We'll send a verification code to this email
                  </p>
                </div>

                <Button 
                  type="submit" 
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  Send Verification Code
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.form>
            ) : (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleDirectOtp}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="otp-direct" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP Code
                  </label>
                  <input
                    type="text"
                    id="otp-direct"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest font-mono"
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the 6-digit code provided by your interviewer
                  </p>
                </div>

                <Button 
                  type="submit" 
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  Verify Code
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.form>
            )}
          </>
        )}

        {step === 'verify_otp' && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleOtpSubmit}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                We've sent a verification code to:
              </p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>

            <div>
              <label htmlFor="otp-verify" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="otp-verify"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest font-mono"
                placeholder="123456"
                maxLength={6}
                required
              />
            </div>

            <Button 
              type="submit" 
              loading={loading}
              className="w-full"
              size="lg"
            >
              Verify & Continue
            </Button>

            <button
              type="button"
              onClick={() => setStep('input')}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Use a different email
            </button>
          </motion.form>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md"
          >
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Having trouble? Contact your interviewer for assistance
          </p>
        </div>
      </div>
    </InterviewLayout>
  );
};

export default VerifyPage;