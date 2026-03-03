import { NextResponse } from 'next/server';
import { getSession, updateSession } from '../../../../lib/interviewStore';

/**
 * GET /api/interview/validate?token=xxx
 *
 * Validates an interview token and returns candidate + job info if valid.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { status: 'invalid', message: 'No token provided' },
        { status: 400 }
      );
    }

    const session = getSession(token);

    if (!session) {
      return NextResponse.json(
        { status: 'invalid', message: 'Interview link is not valid' },
        { status: 404 }
      );
    }

    if (session.status === 'expired') {
      return NextResponse.json(
        { status: 'expired', message: 'Interview link has expired' },
        { status: 410 }
      );
    }

    if (session.status === 'completed') {
      return NextResponse.json(
        { status: 'completed', message: 'Interview has already been completed' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      status: 'valid',
      candidate: {
        name: session.candidate.name,
        position: session.job.title,
        company: 'TechCorp Inc.', // from job or organisation data
      },
      job: session.job,
    });
  } catch (error) {
    console.error('[validate] Error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
