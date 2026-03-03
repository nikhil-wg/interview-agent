import { NextResponse } from 'next/server';
import { getSession, updateSession } from '../../../../lib/interviewStore';

/**
 * POST /api/interview/verify
 *
 * Verifies candidate identity using OTP.
 * In production: integrate with email/SMS OTP provider.
 * Currently accepts "123456" as the valid OTP.
 *
 * Request body: { token: string, email?: string, otp: string }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { token, email, otp } = body;

    if (!token || !otp) {
      return NextResponse.json(
        { success: false, message: 'Token and OTP are required' },
        { status: 400 }
      );
    }

    const session = getSession(token);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Invalid interview token' },
        { status: 404 }
      );
    }

    if (session.status === 'completed') {
      return NextResponse.json(
        { success: false, message: 'Interview already completed' },
        { status: 410 }
      );
    }

    // Demo OTP validation — replace with real provider in production
    const VALID_OTP = '123456';

    if (otp !== VALID_OTP) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP. Please try again.' },
        { status: 401 }
      );
    }

    // Mark verified
    updateSession(token, {
      verifiedEmail: email || 'verified',
      status: 'verified',
    });

    return NextResponse.json({
      success: true,
      message: 'Identity verified successfully',
    });
  } catch (error) {
    console.error('[verify] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
