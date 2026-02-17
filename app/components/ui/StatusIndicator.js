'use client';

import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Pause } from 'lucide-react';

const StatusIndicator = ({ 
  status = 'idle', 
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const sizes = {
    sm: 'w-4 h-4',  
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const statuses = {
    listening: {
      icon: Mic,
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-200',
      label: 'Listening',
      pulse: true
    },
    speaking: {
      icon: Volume2,
      color: 'text-blue-500',
      bg: 'bg-blue-50', 
      border: 'border-blue-200',
      label: 'AI Speaking',
      pulse: true
    },
    paused: {
      icon: Pause,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      label: 'Paused',
      pulse: false
    },
    idle: {
      icon: MicOff,
      color: 'text-gray-500',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      label: 'Ready',
      pulse: false
    }
  };

  const currentStatus = statuses[status];
  const Icon = currentStatus.icon;

  const pulseAnimation = currentStatus.pulse ? {
    scale: [1, 1.1, 1],
    transition: { duration: 1.5, repeat: Infinity }
  } : {};

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.div
        animate={pulseAnimation}
        className={`
          p-2 rounded-full border
          ${currentStatus.bg} 
          ${currentStatus.border}
        `}
      >
        <Icon className={`${sizes[size]} ${currentStatus.color}`} />
      </motion.div>
      
      {showLabel && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-sm font-medium ${currentStatus.color}`}
        >
          {currentStatus.label}
        </motion.span>
      )}
    </div>
  );
};

// Recording pulse indicator
export const RecordingPulse = ({ isRecording = false, size = 'md' }) => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-6 h-6'
  };

  if (!isRecording) return null;

  return (
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`${sizes[size]} bg-red-500 rounded-full`}
    />
  );
};

export default StatusIndicator;