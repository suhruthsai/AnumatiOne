import { NextRequest, NextResponse } from 'next/server';
import { DEMO_GRIEVANCES, registerGrievance, categorizeGrievanceWithNLP } from '@/lib/grievances/grievance-engine';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: DEMO_GRIEVANCES,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      title, 
      description, 
      applicationId, 
      department, 
      appealTier, 
      statutorySection, 
      appellateAuthority, 
      reliefSought, 
      appellantDetails, 
      previewOnly 
    } = body;

    if (previewOnly) {
      const nlp = categorizeGrievanceWithNLP(title || '', description || '');
      return NextResponse.json({ success: true, data: nlp });
    }

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Title and description are required' }, { status: 400 });
    }

    const created = registerGrievance({
      title,
      description,
      applicationId,
      department,
      appealTier,
      statutorySection,
      appellateAuthority,
      reliefSought,
      appellantDetails,
    });

    return NextResponse.json({
      success: true,
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
