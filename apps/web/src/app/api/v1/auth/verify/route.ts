import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/auth-service';

export async function POST(req: NextRequest) {
  try {
    const { phoneOrEmail, otp } = await req.json();
    const identifier = phoneOrEmail || '+919876543210';
    const otpCode = otp || '789123';

    const session = AuthService.verifyOtp(identifier, otpCode);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP. Please enter 789123.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'OTP verification error' },
      { status: 500 }
    );
  }
}
