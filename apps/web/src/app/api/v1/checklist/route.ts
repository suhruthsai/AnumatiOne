import { NextRequest, NextResponse } from 'next/server';
import { generateCustomChecklist } from '@/lib/knowledge-engine/checklist-generator';
import { DEMO_PROFILES } from '@/lib/demo-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile = body.profile || DEMO_PROFILES.EV_PUNE;
    const checklist = generateCustomChecklist(profile);

    return NextResponse.json({
      success: true,
      data: checklist,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Checklist generation error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const demoKey = searchParams.get('demo') || 'EV_PUNE';
  const profile = DEMO_PROFILES[demoKey] || DEMO_PROFILES.EV_PUNE;
  const checklist = generateCustomChecklist(profile);

  return NextResponse.json({
    success: true,
    data: checklist,
  });
}
