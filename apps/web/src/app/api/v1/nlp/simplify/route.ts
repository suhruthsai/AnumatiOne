import { NextRequest, NextResponse } from 'next/server';
import { nlpSimplifier } from '@/lib/rag/nlp-simplifier';
import { askGroq } from '@/lib/ai/groq-client';

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

    // 1. Get baseline structured classification from local rules
    const simplified = nlpSimplifier.simplifyDepartmentQuery(queryText);

    // 2. Enhance with Groq LPU inference for a bespoke official response letter
    try {
      const groqPrompt = `Department Notice Text: "${queryText}"\n\nIdentified Department: ${simplified.identifiedDepartment}\nCited Rule: ${simplified.citedActOrRule}\n\nTask: Draft a concise, legally robust formal reply letter on behalf of an industrial unit under the Maharashtra Right to Services Act 2015. Include formal salutation, statutory reference, and request for deemed clearance if SLA breached. Keep it professional.`;
      
      const customLetter = await askGroq(groqPrompt, { maxTokens: 400, temperature: 0.2 });
      if (customLetter) {
        simplified.suggestedOfficialResponseLetter = customLetter;
      }
    } catch {
      // Gracefully retain baseline rule-based draft
    }

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
