import { NextRequest, NextResponse } from 'next/server';
import { AuthService, UserRole } from '@/lib/auth/auth-service';

export async function POST(req: NextRequest) {
  try {
    const { phoneOrEmail, role } = await req.json();
    const identifier = phoneOrEmail || '+919876543210';
    const userRole: UserRole = role || 'CITIZEN_ENTREPRENEUR';

    const result = AuthService.generateOtp(identifier, userRole);

    return NextResponse.json({
      success: true,
      message: `OTP dispatched to ${identifier}. Use test OTP: ${result.otp}`,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'OTP generation error' },
      { status: 500 }
    );
  }
}
