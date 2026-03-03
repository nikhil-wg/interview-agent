'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import {
  Mic,
  MicOff,
  PhoneOff,
  Clock,
  Bot,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// ─── State machine constants ─────────────────────────────────────────────────
const STATE = {
  CONNECTING: 'connecting',
  IDLE: 'idle',
  LISTENING: 'listening',
  THINKING: 'thinking',
  SPEAKING: 'speaking',
  COMPLETED: 'completed',
};

// ─── Component ───────────────────────────────────────────────────────────────
const InterviewPage = () => {
  const router = useRouter();
  const params = useParams();
  const token = params?.token;

  // ── Core state ──────────────────────────────────────────────────────────────
  const [interviewState, setInterviewState] = useState(STATE.CONNECTING);
  const [candidateInfo, setCandidateInfo] = useState({ name: 'Candidate', avatar: 'C' });
  const [timer, setTimer] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const [error, setError] = useState('');
  const [micError, setMicError] = useState('');
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  // Text shown beneath each card
  const [lastAIText, setLastAIText] = useState('');
  const [lastUserTranscript, setLastUserTranscript] = useState('');

  // Guards
  const isSendingRef = useRef(false);      // prevent overlapping LLM calls
  const stateRef = useRef(STATE.CONNECTING); // synchronous state mirror
  const recognitionRef = useRef(null);

  // Keep stateRef in sync
  useEffect(() => { stateRef.current = interviewState; }, [interviewState]);

  // ── Helpers: TTS (strict turn-based — no interruption) ──────────────────────
  const cancelSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback((text) => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }

      // Stop any active recognition before AI speaks
      try { recognitionRef.current?.abort(); } catch {}

      // Set state to speaking & disable mic BEFORE utterance starts
      setInterviewState(STATE.SPEAKING);

      // 300ms deliberate pause — simulates natural thinking gap
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.92;   // slightly slower for human feel
        utterance.pitch = 1.0;

        // Try to pick a natural English voice
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('samantha') ||
              v.name.toLowerCase().includes('zira') ||
              v.name.toLowerCase().includes('google us english'))
        );
        if (preferred) utterance.voice = preferred;

        utterance.onend = () => {
          // AI finished speaking → transition to idle (mic becomes active)
          if (stateRef.current === STATE.SPEAKING) {
            setInterviewState(STATE.IDLE);
          }
          resolve();
        };

        utterance.onerror = () => {
          if (stateRef.current === STATE.SPEAKING) {
            setInterviewState(STATE.IDLE);
          }
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      }, 300);
    });
  }, []);

  // ── Helpers: STT ────────────────────────────────────────────────────────────
  const stopRecognition = useCallback(() => {
    try { recognitionRef.current?.abort(); } catch {}
  }, []);

  const startRecognition = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError('Speech recognition is not supported in this browser.');
      return;
    }

    // STRICT: only allow starting when idle — no interrupting AI
    if (stateRef.current !== STATE.IDLE) return;

    setMicError('');
    setInterviewState(STATE.LISTENING);

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setLastUserTranscript(transcript);
        // Move to thinking and send to backend
        setInterviewState(STATE.THINKING);
        sendToBackend(transcript);
      } else {
        // Empty result — return to idle
        setInterviewState(STATE.IDLE);
      }
    };

    recognition.onerror = (event) => {
      console.warn('STT error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setMicError('Microphone access denied. Please allow mic access in your browser settings.');
      } else if (event.error === 'no-speech') {
        setMicError('No speech detected. Click the mic and try again.');
      } else if (event.error !== 'aborted') {
        setMicError('Mic error. Please try again.');
      }
      // Only go idle if we're still in listening state
      if (stateRef.current === STATE.LISTENING) {
        setInterviewState(STATE.IDLE);
      }
    };

    recognition.onend = () => {
      // If still in LISTENING, that means no result came — go idle
      if (stateRef.current === STATE.LISTENING) {
        setInterviewState(STATE.IDLE);
      }
    };

    try {
      recognition.start();
    } catch (err) {
      console.warn('Failed to start recognition:', err);
      setInterviewState(STATE.IDLE);
    }
  }, []);

  // ── Backend communication ───────────────────────────────────────────────────
  const sendToBackend = useCallback(async (userMessage) => {
    if (isSendingRef.current) return;
    isSendingRef.current = true;
    setError('');

    try {
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to get AI response.');
        setInterviewState(STATE.IDLE);
        isSendingRef.current = false;
        return;
      }

      if (data.exchangeCount) setTurnCount(data.exchangeCount);

      // ── Check if interview is complete (evaluation JSON) ────────────────
      if (data.isComplete) {
        if (data.evaluation) {
          sessionStorage.setItem(`evaluation_${token}`, JSON.stringify(data.evaluation));
        }
        setInterviewState(STATE.COMPLETED);
        setLastAIText('Thank you for completing the interview!');

        // Speak a short closing, then navigate
        await speak('Thank you for completing the interview. Your responses have been recorded.');
        isSendingRef.current = false;
        router.push(`/interview/${token}/complete`);
        return;
      }

      // ── Normal reply — speak it (speak() handles state transitions) ─────
      const replyText = data.reply || '';
      setLastAIText(replyText);

      // speak() sets state→SPEAKING, then state→IDLE when utterance ends
      await speak(replyText);

    } catch (err) {
      console.error('Chat error:', err);
      setError('Connection error. Please try again.');
      setInterviewState(STATE.IDLE);
    } finally {
      isSendingRef.current = false;
    }
  }, [token, speak, router]);

  // ── Start interview on mount ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        // Pre-load voices (Chrome needs this)
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.getVoices();
          window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
        }

        const res = await fetch('/api/interview/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setError(data.error || 'Failed to start interview');
          setInterviewState(STATE.COMPLETED);
          return;
        }

        if (data.candidateInfo) setCandidateInfo(data.candidateInfo);

        const replyText = data.reply || 'Hello, let\'s begin.';
        setLastAIText(replyText);

        // speak() sets state→SPEAKING, then state→IDLE when utterance ends
        await speak(replyText);
      } catch (err) {
        if (cancelled) return;
        console.error('Init error:', err);
        setError('Failed to connect. Please refresh.');
        setInterviewState(STATE.COMPLETED);
      }
    };

    init();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Timer ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (interviewState === STATE.CONNECTING || interviewState === STATE.COMPLETED) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [interviewState]);

  // ── Cleanup on unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      cancelSpeech();
      stopRecognition();
    };
  }, [cancelSpeech, stopRecognition]);

  // ── Mic button handler (STRICT: only works when idle) ──────────────────────
  const handleMicClick = useCallback(() => {
    // Only allow mic activation when state is IDLE
    if (interviewState !== STATE.IDLE) return;

    startRecognition();
  }, [interviewState, startRecognition]);

  // ── End interview ───────────────────────────────────────────────────────────
  const handleEndInterview = useCallback(async () => {
    setShowEndConfirm(false);
    cancelSpeech();
    stopRecognition();
    setInterviewState(STATE.THINKING);

    try {
      const res = await fetch('/api/interview/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (data.evaluation) {
        sessionStorage.setItem(`evaluation_${token}`, JSON.stringify(data.evaluation));
      }

      setInterviewState(STATE.COMPLETED);
      setLastAIText('The interview has ended. Thank you!');
      await speak('The interview has been concluded. Thank you for your time.');

      router.push(`/interview/${token}/complete`);
    } catch {
      setError('Failed to end interview.');
      setInterviewState(STATE.IDLE);
    }
  }, [token, cancelSpeech, stopRecognition, speak, router]);

  // ── Format helpers ──────────────────────────────────────────────────────────
  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const getStatusLabel = () => {
    switch (interviewState) {
      case STATE.CONNECTING: return 'Connecting…';
      case STATE.IDLE: return 'Your turn — click the mic to speak';
      case STATE.LISTENING: return 'Listening…';
      case STATE.THINKING: return 'AI is thinking…';
      case STATE.SPEAKING: return 'AI is speaking…';
      case STATE.COMPLETED: return 'Interview Complete';
      default: return '';
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  RENDER — CONNECTING
  // ═══════════════════════════════════════════════════════════════════════════
  if (interviewState === STATE.CONNECTING) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-white mb-2">Connecting to Interview</h2>
          <p className="text-gray-400">Setting up your session…</p>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  RENDER — COMPLETED (fallback)
  // ═══════════════════════════════════════════════════════════════════════════
  if (interviewState === STATE.COMPLETED && !lastAIText) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md px-4">
          {error ? (
            <>
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Connection Failed</h2>
              <p className="text-gray-400 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Retry
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Interview Complete</h2>
              <p className="text-gray-400">Redirecting to results…</p>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  RENDER — MAIN MEETING UI
  // ═══════════════════════════════════════════════════════════════════════════
  const isAISpeaking = interviewState === STATE.SPEAKING;
  const isListening = interviewState === STATE.LISTENING;
  const isThinking = interviewState === STATE.THINKING;
  const isIdle = interviewState === STATE.IDLE;
  const isCompleted = interviewState === STATE.COMPLETED;
  const micActive = isListening;
  const micDisabled = isAISpeaking || isThinking || isCompleted;

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col select-none">
      {/* ─── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="bg-[#16213e] border-b border-white/10 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium text-white">AI Interview Session</span>
          </div>
          <div className="flex items-center space-x-5">
            {turnCount > 0 && (
              <span className="text-xs text-gray-400 font-mono">Q {turnCount}/~15</span>
            )}
            <div className="flex items-center space-x-1.5 text-gray-300">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm">{formatTime(timer)}</span>
            </div>
            <button
              onClick={() => setShowEndConfirm(true)}
              className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 transition"
              title="End Interview"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Status bar ───────────────────────────────────────────────────── */}
      <div className="text-center py-2">
        <motion.p
          key={interviewState}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-500"
        >
          {getStatusLabel()}
        </motion.p>
      </div>

      {/* ─── Meeting area ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* AI Card */}
          <motion.div
            animate={{
              boxShadow: isAISpeaking
                ? ['0 0 0px rgba(59,130,246,0)', '0 0 40px rgba(59,130,246,0.45)', '0 0 0px rgba(59,130,246,0)']
                : '0 0 0px rgba(59,130,246,0)',
            }}
            transition={isAISpeaking ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
            className="relative bg-[#16213e] rounded-2xl border border-white/10 p-8 flex flex-col items-center"
          >
            {/* Avatar */}
            <motion.div
              animate={isAISpeaking ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={isAISpeaking ? { duration: 1.2, repeat: Infinity } : {}}
              className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4"
            >
              <Bot className="w-14 h-14 text-white" />
            </motion.div>

            <h3 className="text-white font-semibold text-lg">Sarah</h3>
            <p className="text-gray-500 text-sm mb-4">AI Interviewer</p>

            {/* Voice bars (visible while speaking) */}
            <div className="h-6 flex items-end justify-center space-x-1">
              {isAISpeaking && [0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 16 + Math.random() * 8, 4] }}
                  transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.08 }}
                  className="w-1 rounded-full bg-blue-400"
                />
              ))}
              {isThinking && (
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              )}
            </div>

            {/* Subtitle: AI's last spoken text */}
            {lastAIText && (
              <motion.p
                key={lastAIText.slice(0, 30)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-xs text-gray-400 text-center leading-relaxed line-clamp-3 max-w-[280px]"
              >
                {lastAIText}
              </motion.p>
            )}
          </motion.div>

          {/* Candidate Card */}
          <motion.div
            animate={{
              boxShadow: isListening
                ? ['0 0 0px rgba(34,197,94,0)', '0 0 40px rgba(34,197,94,0.45)', '0 0 0px rgba(34,197,94,0)']
                : '0 0 0px rgba(34,197,94,0)',
            }}
            transition={isListening ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
            className="relative bg-[#16213e] rounded-2xl border border-white/10 p-8 flex flex-col items-center"
          >
            {/* Avatar */}
            <motion.div
              animate={isListening ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={isListening ? { duration: 1.2, repeat: Infinity } : {}}
              className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center mb-4 text-white text-3xl font-bold"
            >
              {candidateInfo.avatar}
            </motion.div>

            <h3 className="text-white font-semibold text-lg">{candidateInfo.name}</h3>
            <p className="text-gray-500 text-sm mb-4">Candidate</p>

            {/* Voice indicator */}
            <div className="h-6 flex items-end justify-center space-x-1">
              {isListening && [0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 14 + Math.random() * 10, 4] }}
                  transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.07 }}
                  className="w-1 rounded-full bg-green-400"
                />
              ))}
            </div>

            {/* Subtitle: last user transcript */}
            {lastUserTranscript && (
              <motion.p
                key={lastUserTranscript.slice(0, 30)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-xs text-gray-400 text-center leading-relaxed line-clamp-3 max-w-[280px]"
              >
                {lastUserTranscript}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      {/* ─── Error / mic-error banners ────────────────────────────────────── */}
      <AnimatePresence>
        {(error || micError) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-6 pb-2"
          >
            <div className="max-w-md mx-auto flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-300">{error || micError}</p>
              <button onClick={() => { setError(''); setMicError(''); }} className="ml-auto text-red-400 hover:text-red-300 text-xs">✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Controls bar ─────────────────────────────────────────────────── */}
      {!isCompleted && (
        <div className="bg-[#16213e] border-t border-white/10 py-5">
          <div className="flex items-center justify-center space-x-6">
            {/* Mic button */}
            <motion.button
              whileHover={{ scale: micDisabled ? 1 : 1.08 }}
              whileTap={{ scale: micDisabled ? 1 : 0.92 }}
              onClick={handleMicClick}
              disabled={micDisabled}
              className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                micActive
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/40'
                  : micDisabled
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {micActive ? (
                <Mic className="w-7 h-7" />
              ) : (
                <MicOff className="w-7 h-7" />
              )}

              {/* Pulse ring while listening */}
              {micActive && (
                <motion.span
                  animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-green-400"
                />
              )}
            </motion.button>

            {/* End call */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowEndConfirm(true)}
              className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30 transition"
            >
              <PhoneOff className="w-6 h-6" />
            </motion.button>
          </div>

          <p className="text-center text-[11px] text-gray-600 mt-3">
            {isIdle && 'Your turn — click the mic to speak'}
            {isListening && 'Listening — speak now…'}
            {isThinking && 'Processing your response…'}
            {isAISpeaking && 'AI is speaking — please wait…'}
          </p>
        </div>
      )}

      {/* ─── Completed bar ────────────────────────────────────────────────── */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border-t border-green-500/20 py-5 text-center"
        >
          <p className="text-green-400 font-medium text-sm">Interview Complete — Redirecting to results…</p>
        </motion.div>
      )}

      {/* ─── End Confirmation Modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#16213e] border border-white/10 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-white mb-3">End Interview?</h3>
              <p className="text-gray-400 text-sm mb-6">
                The AI will generate an evaluation based on the conversation so far. This cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="flex-1 px-4 py-2.5 text-gray-300 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEndInterview}
                  className="flex-1 px-4 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
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