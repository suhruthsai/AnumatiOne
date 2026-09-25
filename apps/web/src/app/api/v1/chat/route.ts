import { NextRequest, NextResponse } from 'next/server';
import { statutoryRAG } from '@/lib/rag/hybrid-rag-engine';

export async function POST(req: NextRequest) {
  try {
    const { message, profile } = await req.json();
    const query = message || '';

    // Generate grounded RAG answer
    const ragAnswer = statutoryRAG.generateAnswer(query);

    // Build rich, structured markdown reply
    let reply = `### 💡 In Plain English\n${ragAnswer.plainEnglishExplanation}\n\n`;

    reply += `### 📜 Maharashtra Statutory Basis\n`;
    reply += `* **Governing Statute:** ${ragAnswer.legalBasis.actTitle} (${ragAnswer.legalBasis.sectionOrRule})\n`;
    reply += `* **Enforcing Authority:** ${ragAnswer.legalBasis.department}\n`;
    if (ragAnswer.legalBasis.statutorySafeguard) {
      reply += `* **Legal Safeguard:** ${ragAnswer.legalBasis.statutorySafeguard}\n`;
    }
    reply += `\n`;

    if (ragAnswer.actionableSteps && ragAnswer.actionableSteps.length > 0) {
      reply += `### ✅ What You Should Do\n`;
      ragAnswer.actionableSteps.forEach((step, idx) => {
        reply += `${idx + 1}. ${step}\n`;
      });
      reply += `\n`;
    }

    if (ragAnswer.topCitations && ragAnswer.topCitations.length > 0) {
      reply += `### 🔍 Verified Legal Citations\n`;
      ragAnswer.topCitations.forEach((cit) => {
        reply += `* **[${cit.sectionOrRule}]** ${cit.actTitle} • *${cit.department}* (Confidence: ${cit.confidence}%)\n`;
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        reply,
        plainSummary: ragAnswer.summary,
        legalBasis: ragAnswer.legalBasis,
        citations: ragAnswer.topCitations,
        followUpSuggestions: ragAnswer.suggestedFollowUps,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Chat service error' },
      { status: 500 }
    );
  }
}
