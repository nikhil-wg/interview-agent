import { NextResponse } from 'next/server';
import { getCollection } from '../../../../lib/mongodb';
import { isDemoInterviewToken } from '../../../../lib/demoInterviewData';
import { ensureDemoInterviewSession } from '../../../../lib/demoInterviewStore';

/**
 * POST /api/interview/validate
 *
 * Validates an interview token + candidate email against MongoDB.
 *
 * Body: { token: string, email: string }
 *
 * Responses:
 *   200 – valid   → { interviewId, candidate, job, status }
 *   400 – missing fields
 *   401 – email mismatch
 *   404 – token not found
 *   410 – expired or already completed
 *   500 – server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { token, email } = body;

    const normalizedToken = token?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedToken || !normalizedEmail) {
      return NextResponse.json(
        { error: 'Interview token and email are required' },
        { status: 400 }
      );
    }

    if (isDemoInterviewToken(normalizedToken)) {
      const session = await ensureDemoInterviewSession({ resetCompleted: true });

      return NextResponse.json({
        interviewId: session.interviewId,
        candidate: session.candidate,
        job: session.job,
        status: session.status,
      });
    }

    const col = await getCollection('interviews');
    const session = await col.findOne(
      { interviewId: normalizedToken },
      { projection: { _id: 0 } }
    );

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid interview token. Please check the link sent to you.' },
        { status: 404 }
      );
    }

    // Expiry check — only enforced when expiresAt is present
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This interview link has expired. Please contact the recruiter.' },
        { status: 410 }
      );
    }

    if (session.status === 'completed') {
      return NextResponse.json(
        { error: 'This interview has already been completed.' },
        { status: 410 }
      );
    }

    // Validate candidate email (case-insensitive)
    const storedEmail = session.candidate?.email ?? '';
    if (storedEmail.toLowerCase() !== email.trim().toLowerCase()) {
      return NextResponse.json(
        { error: 'Email address does not match our records for this interview.' },
        { status: 401 }
      );
    }

    // Record the verified email on the document
    await col.updateOne(
      { interviewId: normalizedToken },
      { $set: { verifiedEmail: normalizedEmail } }
    );

    return NextResponse.json({
      interviewId: session.interviewId,
      candidate: session.candidate,
      job: session.job,
      status: session.status,
    });
  } catch (error) {
    console.error('[validate] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
