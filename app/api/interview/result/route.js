import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/interviewStore';

/**
 * GET /api/interview/result?token=xxx
 *
 * Returns the final evaluation and interview statistics for the completion page.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const session = getSession(token);

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid interview token' },
        { status: 404 }
      );
    }

    if (session.status !== 'completed' || !session.evaluation) {
      return NextResponse.json(
        { error: 'Interview has not been completed yet' },
        { status: 400 }
      );
    }

    const totalExchanges = session.conversationHistory.filter(
      (m) => m.role === 'user'
    ).length;

    // Format duration
    const durationSecs = session.duration || 0;
    const mins = Math.floor(durationSecs / 60);
    const secs = durationSecs % 60;
    const durationFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    return NextResponse.json({
      evaluation: session.evaluation,
      stats: {
        duration: durationFormatted,
        durationSeconds: durationSecs,
        questionsAnswered: totalExchanges,
        completedAt: session.completedAt,
        candidateName: session.candidate.name,
        jobTitle: session.job.title,
      },
    });
  } catch (error) {
    console.error('[result] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
