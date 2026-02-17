'use client';

import { motion } from 'framer-motion';
import { Bot, Users, Clock, Shield } from 'lucide-react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';

export default function Home() {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Interviews',
      description: 'Advanced AI conducts natural, conversational interviews tailored to each role'
    },
    {
      icon: Clock,
      title: 'Efficient Process',
      description: 'Complete interviews in 20-30 minutes with immediate processing and analysis'
    },
    {
      icon: Users,
      title: 'Candidate-Friendly',
      description: 'Intuitive interface designed for a comfortable and professional experience'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'End-to-end encrypted sessions with complete data privacy protection'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI Interview System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of recruitment with our AI-powered interview platform. 
            Designed for modern hiring teams and candidates alike.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card hover className="h-full text-center">
                  <div className="p-2 bg-blue-100 rounded-lg inline-flex mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Card padding="lg" className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
            <h2 className="text-2xl font-semibold mb-4">
              Ready to Get Started?
            </h2>
            <p className="mb-6 opacity-90">
              To begin an interview, you'll need a valid interview link provided by your interviewer.
            </p>
            
            <div className="space-y-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-50"
                onClick={() => {
                  const token = prompt('Enter your interview token:');
                  if (token) {
                    window.location.href = `/interview/${token}`;
                  }
                }}
              >
                Enter Interview Token
              </Button>
              
              <div className="text-sm opacity-80">
                <p>For demo purposes, you can try these tokens:</p>
                <div className="mt-2 space-x-4">
                  <button
                    onClick={() => window.location.href = '/interview/demo-valid'}
                    className="underline hover:no-underline"
                  >
                    demo-valid
                  </button>
                  <button
                    onClick={() => window.location.href = '/interview/expired'}
                    className="underline hover:no-underline"
                  >
                    expired
                  </button>
                  <button
                    onClick={() => window.location.href = '/interview/invalid'}
                    className="underline hover:no-underline"
                  >
                    invalid
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 text-gray-500 text-sm"
        >
          <p>
            Powered by advanced AI technology • Secure & Private • GDPR Compliant
          </p>
        </motion.div>
      </div>
    </div>
  );
}
