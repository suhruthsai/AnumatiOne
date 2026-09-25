import { NextRequest, NextResponse } from 'next/server';
import { compareWhatIfScenarios } from '@/lib/simulator/what-if-engine';
import { DEMO_PROFILES } from '@/lib/demo-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const baseline = body.baselineProfile || DEMO_PROFILES.PHARMA_AURANGABAD;
    const modifications = body.modifications || {
      state: 'MAHARASHTRA',
      landType: 'GOVT_INDUSTRIAL_PARK',
    };
    const title = body.title || 'Maharashtra Agricultural Land vs MIDC Notified Industrial Estate';

    const comparison = compareWhatIfScenarios(baseline, modifications, title);

    return NextResponse.json({
      success: true,
      data: comparison,
    });
  } catch (error: any) {
    console.error('What-If error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal What-If calculation error' },
      { status: 500 }
    );
  }
}
