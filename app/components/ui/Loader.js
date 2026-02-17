'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'md', text = '', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={`${sizes[size]} text-blue-600`} />
      </motion.div>
      {text && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-gray-600"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Skeleton loader for content
export const Skeleton = ({ className = '', width = 'full', height = 'auto' }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ 
        width: typeof width === 'string' ? (width === 'full' ? '100%' : width) : `${width}px`,
        height: height === 'auto' ? '1rem' : (typeof height === 'string' ? height : `${height}px`)
      }}
    />
  );
};

export default Loader;