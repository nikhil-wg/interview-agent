'use client';

import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false,
  ...props 
}) => {
  const baseClasses = 'bg-white border border-gray-200 rounded-lg shadow-sm';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -2, shadow: '0 10px 25px rgba(0,0,0,0.1)' },
    initial: "initial",
    animate: "animate",
    exit: "exit",
    variants: cardVariants,
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${paddings[padding]} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;