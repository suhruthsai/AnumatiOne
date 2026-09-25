import { NextRequest, NextResponse } from 'next/server';
import { BusinessProfile } from '@approvalos/shared';
import { getApprovalsForProfile } from '@/lib/knowledge-engine/regulatory-graph';
import { AdversarialPathOptimizer } from '@/lib/simulator/adversarial-optimizer';
import { DEMO_PROFILES } from '@/lib/demo-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: BusinessProfile = body.profile || DEMO_PROFILES.EV_PUNE;
    const iterations = body.iterations || 3000;

    // 1. Resolve applicable approvals from Regulatory Knowledge Engine
    const approvals = getApprovalsForProfile(profile);

    // 2. Run Adversarial Path Optimization
    const optimizer = new AdversarialPathOptimizer(approvals, profile, {
      monteCarloIterations: iterations,
    });

    const result = optimizer.optimize();

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal simulation error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const demoKey = searchParams.get('demo') || 'EV_PUNE';
  const profile = DEMO_PROFILES[demoKey] || DEMO_PROFILES.EV_PUNE;

  const approvals = getApprovalsForProfile(profile);
  const optimizer = new AdversarialPathOptimizer(approvals, profile);
  const result = optimizer.optimize();

  return NextResponse.json({
    success: true,
    data: result,
  });
}
