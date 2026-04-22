'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  buildDemoSessionStorageRecord,
  getInterviewSessionStorageKey,
  isDemoInterviewToken,
} from '@/lib/demoInterviewData';

/**
 * /interview/[token]/verify
 *
 * OTP verification has been removed. Candidates are authenticated via
 * Token + Email on the home page. This page simply redirects accordingly.
 */
export default function VerifyPage() {
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
    if (!stored && isDemoInterviewToken(token)) {
      sessionStorage.setItem(sessionKey, JSON.stringify(buildDemoSessionStorageRecord()));
      router.replace(`/interview/${token}/instructions`);
      return;
    }
    router.replace(stored ? `/interview/${token}/instructions` : '/');
  }, [token, router]);

  return null;
}
