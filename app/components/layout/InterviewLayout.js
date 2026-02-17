'use client';

import { motion } from 'framer-motion';
import Card from '../ui/Card';

const InterviewLayout = ({ 
  children, 
  title,
  subtitle,
  showProgress = false,
  currentStep = 1,
  totalSteps = 5,
  className = ''
}) => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${className}`}>
      <motion.div
        initial="initial"
        animate="animate" 
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {showProgress && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-xs text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <motion.div 
                className="bg-blue-600 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        <Card padding="lg">
          <div className="text-center mb-6">
            {title && (
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-semibold text-gray-900 mb-2"
              >
                {title}
              </motion.h1>
            )}
            {subtitle && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {children}
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default InterviewLayout;