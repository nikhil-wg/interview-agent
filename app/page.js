'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Bot, Mail, Key, ArrowRight, AlertCircle, PlayCircle } from 'lucide-react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import {
  DEMO_INTERVIEW_TOKEN,
  buildDemoSessionStorageRecord,
  getInterviewSessionStorageKey,
} from '@/lib/demoInterviewData';

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedToken = token.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedToken) {
      setError('Please enter your interview token.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/interview/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: trimmedToken, email: trimmedEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Validation failed. Please check your details.');
        setLoading(false);
        return;
      }

      // Persist the validated session in sessionStorage so interview pages
      // can confirm the candidate went through validation.
      sessionStorage.setItem(
        `interview_session_${data.interviewId}`,
        JSON.stringify({
          token: data.interviewId,
          email: trimmedEmail,
          candidateName: data.candidate?.name ?? '',
          jobTitle: data.job?.title ?? '',
          validatedAt: new Date().toISOString(),
        })
      );

      router.push(`/interview/${data.interviewId}/instructions`);
    } catch {
      setError('Connection error. Please check your network and try again.');
      setLoading(false);
    }
  };

  const handleDemoInterview = () => {
    setError('');
    sessionStorage.setItem(
      getInterviewSessionStorageKey(DEMO_INTERVIEW_TOKEN),
      JSON.stringify(buildDemoSessionStorageRecord())
    );
    router.push(`/interview/${DEMO_INTERVIEW_TOKEN}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Interview</h1>
          <p className="text-gray-500 mt-2">Enter your credentials to begin</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card padding="lg" className="shadow-xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Token field */}
              <div>
                <label
                  htmlFor="token"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Interview Token
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="e.g. tkn_a1b2c3d4e5"
                    autoComplete="off"
                    spellCheck={false}
                    required
                  />
                </div>
              </div>

              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Submit */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Verifying…' : 'Start Interview'}
                  {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                  onClick={handleDemoInterview}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Try Demo Interview
                </Button>
              </div>
            </form>

            <p className="text-xs text-center text-gray-400 mt-5">
              Your token and email were provided in the invitation email sent by the recruiter.
            </p>
            <p className="text-xs text-center text-gray-400 mt-2">
              The demo interview uses sample candidate data and can be restarted anytime.
            </p>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-gray-400 mt-6"
        >
          Powered by AI • Secure & Private
        </motion.p>
      </div>
    </div>
  );
}

