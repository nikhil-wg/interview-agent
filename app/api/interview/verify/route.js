import { NextResponse } from 'next/server';

/**
 * POST /api/interview/verify
 *
 * This endpoint has been removed. OTP verification is no longer part of
 * the interview flow. Candidates are authenticated via Token + Email on
 * the interview start page.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'OTP verification has been removed. Use Token + Email validation instead.' },
    { status: 410 }
  );
}
