import { NextResponse } from 'next/server';
import {
  getSession,
  appendMessage,
  updateSession,
} from '../../../../lib/interviewStore';
import { chatCompletion } from '../../../../lib/groq';
import { detectEvaluation } from '../../../../lib/evaluationDetector';

/**
 * POST /api/interview/chat
 *
 * Handles each conversation turn during the interview.
 *
 * Request body:
 * {
 *   token: string,
 *   userMessage: string
 * }
 *
 * Response:
 * {
 *   reply: string,
 *   isComplete: boolean,
 *   evaluation?: object
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { token, userMessage } = body;

    if (!token || !userMessage) {
      return NextResponse.json(
        { error: 'token and userMessage are required' },
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

    if (session.status === 'completed') {
      return NextResponse.json(
        { error: 'Interview already completed', isComplete: true },
        { status: 410 }
      );
    }

    // Count exchanges BEFORE this turn (+1 for the message we're about to add)
    const existingHistory = session.conversationHistory || [];
    const exchanges = existingHistory.filter((m) => m.role === 'user').length + 1;

    // Build messages array for Groq: existing history + new user message
    const messages = existingHistory.map((m) => ({ role: m.role, content: m.content }));
    messages.push({ role: 'user', content: userMessage });

    // If nearing the exchange limit, nudge the model to wrap up
    if (exchanges >= 12) {
      messages.push({
        role: 'system',
        content:
          'You have conducted enough exchanges. In your next reply, evaluate the candidate and respond with ONLY the final JSON evaluation object. Do not ask another question.',
      });
    }

    // Persist user message
    await appendMessage(token, { role: 'user', content: userMessage });

    // Call Groq
    const aiReply = await chatCompletion(messages);

    // Persist AI reply
    await appendMessage(token, { role: 'assistant', content: aiReply });

    // Check if the AI returned the final evaluation JSON
    const { isEvaluation, evaluation } = detectEvaluation(aiReply);

    if (isEvaluation) {
      await updateSession(token, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        evaluation,
        duration: session.startedAt
          ? Math.round((Date.now() - new Date(session.startedAt).getTime()) / 1000)
          : 0,
      });

      return NextResponse.json({
        reply: aiReply,
        isComplete: true,
        evaluation,
      });
    }

    return NextResponse.json({
      reply: aiReply,
      isComplete: false,
      exchangeCount: exchanges,
    });
  } catch (error) {
    console.error('[chat] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response. Please try again.' },
      { status: 500 }
    );
  }
}
