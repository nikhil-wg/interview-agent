import { NextResponse } from 'next/server';

/**
 * POST /api/interview/reset
 *
 * Demo reset is not available when using MongoDB-backed sessions.
 * Interview documents are managed exclusively by the recruiter platform.
 */
export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Session reset is not available in this environment.' },
    { status: 404 }
  );
}
