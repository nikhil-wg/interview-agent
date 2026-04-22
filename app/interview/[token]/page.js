'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Loader from '../../components/ui/Loader';
import {
  DEMO_INTERVIEW_TOKEN,
  buildDemoSessionStorageRecord,
  getInterviewSessionStorageKey,
  isDemoInterviewToken,
} from '@/lib/demoInterviewData';

/**
 * /interview/[token]
 *
 * Guard page: if the candidate has already validated via the home page,
 * redirect to instructions; otherwise send them back to the home page to
 * complete Token + Email validation.
 */
export default function InterviewTokenPage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token;

  useEffect(() => {
    if (!token) {
      router.replace('/');
      return;
    }

    const sessionKey = getInterviewSessionStorageKey(token);
    const stored = sessionStorage.getItem(sessionKey);
    if (isDemoInterviewToken(token) && !stored) {
      sessionStorage.setItem(
        sessionKey,
        JSON.stringify(buildDemoSessionStorageRecord())
      );
      router.replace(`/interview/${DEMO_INTERVIEW_TOKEN}/instructions`);
      return;
    }

    if (stored) {
      router.replace(`/interview/${token}/instructions`);
    } else {
      router.replace('/');
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader size="lg" text="Loading your interview…" />
    </div>
  );
}
