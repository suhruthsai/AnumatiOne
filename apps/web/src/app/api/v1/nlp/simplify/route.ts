import { NextRequest, NextResponse } from 'next/server';
import { nlpSimplifier } from '@/lib/rag/nlp-simplifier';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const queryText = body.queryText || '';

    if (!queryText.trim()) {
      return NextResponse.json(
        { success: false, error: 'Query text is required' },
        { status: 400 }
      );
    }

    const simplified = nlpSimplifier.simplifyDepartmentQuery(queryText);

    return NextResponse.json({
      success: true,
      data: simplified,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'NLP simplification error' },
      { status: 500 }
    );
  }
}
