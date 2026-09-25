import { NextRequest, NextResponse } from 'next/server';
import { matchIncentivesForProfile } from '@/lib/incentives/incentive-matcher';
import { DEMO_PROFILES } from '@/lib/demo-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile = body.profile || DEMO_PROFILES.EV_PUNE;
    const result = matchIncentivesForProfile(profile);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Incentive calculation error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const demoKey = searchParams.get('demo') || 'EV_PUNE';
  const profile = DEMO_PROFILES[demoKey] || DEMO_PROFILES.EV_PUNE;
  const result = matchIncentivesForProfile(profile);

  return NextResponse.json({
    success: true,
    data: result,
  });
}
