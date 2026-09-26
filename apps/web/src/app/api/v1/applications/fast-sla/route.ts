import { NextRequest, NextResponse } from 'next/server';
import { applicationDB } from '@/lib/db/application-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const companyName = body.companyName || undefined;

    const result = applicationDB.applyFastSla(companyName);

    return NextResponse.json({
      success: true,
      message: `Fast SLA successfully activated. ${result.count} statutory clearances accelerated and approved under RTS Act 2015 Section 4(1).`,
      count: result.count,
      data: result.applications,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to apply Fast SLA' },
      { status: 500 }
    );
  }
}
