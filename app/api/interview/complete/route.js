import { NextResponse } from 'next/server';
import {
  getSession,
  updateSession,
} from '../../../../lib/interviewStore';
import { chatCompletion } from '../../../../lib/groq';
import { detectEvaluation } from '../../../../lib/evaluationDetector';

/**
 * POST /api/interview/complete
 *
 * Force-completes the interview (e.g. when user clicks "End Interview").
 * If an evaluation hasn't been generated yet, it asks the model for one.
 *
 * Request body: { token: string, feedback?: { rating: number, text: string } }
 *
 * Response: { success: boolean, evaluation: object }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { token, feedback } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const session = await getSession(token);

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid interview token' },
        { status: 404 }
      );
    }

    // If already completed with evaluation, just return it
    if (session.status === 'completed' && session.evaluation) {
      // Optionally store feedback
      if (feedback) {
        await updateSession(token, { feedback });
      }
      return NextResponse.json({
        success: true,
        evaluation: session.evaluation,
        alreadyCompleted: true,
      });
    }

    // Force the model to generate a final evaluation
    let evaluation = null;
    const messages = session.conversationHistory.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Add force-complete instruction
    messages.push({
      role: 'system',
      content:
        'The interview is now ending early. Based on all responses so far, generate the final evaluation. Respond with ONLY the JSON evaluation object, no extra text.',
    });

    const aiReply = await chatCompletion(messages, { max_tokens: 1000 });

    const { isEvaluation, evaluation: parsed } = detectEvaluation(aiReply);

    if (isEvaluation) {
      evaluation = parsed;
    } else {
      // Fallback evaluation if model doesn't comply
      const exchanges = (session.conversationHistory || []).filter((m) => m.role === 'user').length;
      evaluation = {
        technicalDepth: Math.min(exchanges, 5),
        problemSolving: Math.min(exchanges, 5),
        systemDesignThinking: Math.min(exchanges, 4),
        communicationClarity: Math.min(exchanges + 1, 6),
        strengths: ['Participated in the interview'],
        weaknesses: ['Interview ended early — insufficient data for full evaluation'],
        overallScore: Math.min(exchanges, 5),
        hireRecommendation: 'Borderline',
        summary:
          'The interview was ended before sufficient technical depth could be evaluated. A follow-up interview is recommended.',
      };
    }

    const duration = session.startedAt
      ? Math.round((Date.now() - new Date(session.startedAt).getTime()) / 1000)
      : 0;

    await updateSession(token, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      evaluation,
      duration,
      ...(feedback ? { feedback } : {}),
    });

    return NextResponse.json({
      success: true,
      evaluation,
      duration,
    });
  } catch (error) {
    console.error('[complete] Error:', error);
    return NextResponse.json(
      { error: 'Failed to complete interview' },
      { status: 500 }
    );
  }
}
