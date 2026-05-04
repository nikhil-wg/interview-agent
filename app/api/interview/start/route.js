import { NextResponse } from 'next/server';
import { getSession, updateSession } from '../../../../lib/interviewStore';
import { buildInitialMessages } from '../../../../lib/prompts';
import { chatCompletion } from '../../../../lib/groq';
import { isDemoInterviewToken } from '../../../../lib/demoInterviewData';
import { ensureDemoInterviewSession } from '../../../../lib/demoInterviewStore';

/**
 * POST /api/interview/start
 *
 * Initialises the interview session: builds the system prompt, sends it to
 * Groq to get the AI's opening question, and stores everything in the session.
 *
 * Request body: { token: string }
 * Response:     { reply: string, candidateInfo: object }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { token } = body;
    const normalizedToken = token?.trim();

    if (!normalizedToken) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const session = isDemoInterviewToken(normalizedToken)
      ? await ensureDemoInterviewSession(normalizedToken, { resetCompleted: true })
      : await getSession(normalizedToken);

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid interview token' },
        { status: 404 }
      );
    }

    if (session.status === 'completed') {
      return NextResponse.json(
        { error: 'Interview already completed' },
        { status: 410 }
      );
    }

    // If interview already has conversation history, resume from where we left off
    if (session.conversationHistory && session.conversationHistory.length > 0) {
      const lastAssistant = [...session.conversationHistory]
        .reverse()
        .find((m) => m.role === 'assistant');

      return NextResponse.json({
        reply: lastAssistant?.content || 'Let\'s continue our interview.',
        candidateInfo: {
          name: session.candidate.name,
          avatar: session.candidate.name.charAt(0).toUpperCase(),
        },
        resumed: true,
      });
    }

    // Build initial messages with system prompt
    const messages = buildInitialMessages(session.candidate, session.job);

    // Add a user-like seed to kick off the conversation
    messages.push({
      role: 'user',
      content: 'Hello, I am ready for the interview.',
    });

    // Get AI's opening message from Groq
    const aiReply = await chatCompletion(messages);

    // Store system prompt + seed + AI reply, mark as in_progress
    await updateSession(normalizedToken, {
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      conversationHistory: [
        messages[0], // system
        messages[1], // user seed
        { role: 'assistant', content: aiReply },
      ],
    });

    return NextResponse.json({
      reply: aiReply,
      candidateInfo: {
        name: session.candidate.name,
        avatar: session.candidate.name.charAt(0).toUpperCase(),
      },
      resumed: false,
    });
  } catch (error) {
    console.error('[start] Error:', error);
    return NextResponse.json(
      { error: 'Failed to start the interview. Please try again.' },
      { status: 500 }
    );
  }
}
