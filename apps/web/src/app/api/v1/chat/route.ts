import { NextRequest, NextResponse } from 'next/server';
import { statutoryRAG } from '@/lib/rag/hybrid-rag-engine';
import { askGroq } from '@/lib/ai/groq-client';

export async function POST(req: NextRequest) {
  try {
    const { message, profile } = await req.json();
    const query = message || '';

    // 1. Generate grounded RAG context from local Maharashtra legal corpus
    const ragAnswer = statutoryRAG.generateAnswer(query);

    // 2. Attempt ultra-fast Groq LPU inference if available
    let dynamicAiReply: string | null = null;
    const profileContext = profile ? `\nApplicant Profile: ${profile.companyName || 'Industrial Enterprise'}, Sector: ${profile.sector || 'General Manufacturing'}, Location: ${profile.district || 'Maharashtra'}` : '';
    
    const groqPrompt = `User Query: "${query}"${profileContext}\n\nLegal Grounding Context from Maharashtra Statutes:\n- Governing Act: ${ragAnswer.legalBasis.actTitle} (${ragAnswer.legalBasis.sectionOrRule})\n- Authority: ${ragAnswer.legalBasis.department}\n- Legal Safeguard: ${ragAnswer.legalBasis.statutorySafeguard || 'Statutory SLA'}\n- Context: ${ragAnswer.plainEnglishExplanation}`;

    try {
      dynamicAiReply = await askGroq(groqPrompt);
    } catch {
      dynamicAiReply = null;
    }

    // 3. Build rich, structured markdown reply (use Groq if available, fallback to deterministic RAG)
    let reply = '';
    if (dynamicAiReply) {
      reply = `${dynamicAiReply}\n\n`;
      reply += `---\n### 📜 Maharashtra Statutory Basis\n`;
      reply += `* **Governing Statute:** ${ragAnswer.legalBasis.actTitle} (${ragAnswer.legalBasis.sectionOrRule})\n`;
      reply += `* **Enforcing Authority:** ${ragAnswer.legalBasis.department}\n`;
      if (ragAnswer.legalBasis.statutorySafeguard) {
        reply += `* **Legal Safeguard:** ${ragAnswer.legalBasis.statutorySafeguard}\n`;
      }
      reply += `\n`;
    } else {
      reply = `### 💡 In Plain English\n${ragAnswer.plainEnglishExplanation}\n\n`;
      reply += `### 📜 Maharashtra Statutory Basis\n`;
      reply += `* **Governing Statute:** ${ragAnswer.legalBasis.actTitle} (${ragAnswer.legalBasis.sectionOrRule})\n`;
      reply += `* **Enforcing Authority:** ${ragAnswer.legalBasis.department}\n`;
      if (ragAnswer.legalBasis.statutorySafeguard) {
        reply += `* **Legal Safeguard:** ${ragAnswer.legalBasis.statutorySafeguard}\n`;
      }
      reply += `\n`;
    }

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
