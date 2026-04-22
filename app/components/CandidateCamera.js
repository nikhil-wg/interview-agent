'use client';

import { useEffect, useRef, useState } from 'react';
import { CameraOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CandidateCamera({ fallbackAvatar, isListening }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activeStream = null;

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false, // Audio is managed separately by the SpeechRecognition API
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setError(false);
      } catch (err) {
        console.error('Failed to access camera:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    startCamera();

    return () => {
      // Cleanup all video tracks on unmount to prevent memory leaks
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="relative z-10 w-28 h-28 flex items-center justify-center mb-4">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin shrink-0" />
      </div>
    );
  }

  if (error || !stream) {
    return (
      <motion.div
        animate={isListening ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={isListening ? { duration: 1.2, repeat: Infinity } : {}}
        className="relative z-10 w-28 h-28 rounded-full overflow-hidden bg-linear-to-br from-gray-600 to-gray-800 flex items-center justify-center mb-4 ring-2 ring-white/10"
      >
        <div className="flex flex-col items-center justify-center text-white" title="Camera access denied or unavailable">
          {fallbackAvatar ? (
            <span className="text-3xl font-bold">{fallbackAvatar}</span>
          ) : (
            <CameraOff className="w-8 h-8 text-gray-400" />
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Spacer to maintain the flex layout symmetry with the AI card */}
      <div className="relative z-10 w-28 h-28 mb-4 pointer-events-none" />

      {/* Absolute video background covering the parent card */}
      <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        />
        {/* Dark gradient overlay to ensure candidate info text remains readable */}
        <div className=" to-transparent" />
      </div>
    </>
  );
}