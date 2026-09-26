import { NextRequest, NextResponse } from 'next/server';
import { statutoryRAG } from '@/lib/rag/hybrid-rag-engine';
import { askGroq } from '@/lib/ai/groq-client';

export async function POST(req: NextRequest) {
  try {
    const { message, profile } = await req.json();
    const query = (message || '').trim();

    if (!query) {
      return NextResponse.json({
        success: true,
        data: {
          reply: 'How can I assist you with Maharashtra industrial clearances, statutory SLAs, or PSI 2019 incentives today?',
          plainSummary: 'Awaiting your query.',
          followUpSuggestions: [
            'What approvals do I need for my manufacturing plant?',
            'Can I get Green Channel auto-approval?',
            'How much SGST refund can I claim under PSI 2019?',
            'What are the mandatory setbacks under Rule 14 of MIDC DCR?',
          ],
          timestamp: new Date().toISOString(),
        },
      });
    }

    // 1. Generate grounded RAG context from Maharashtra statutory corpus
    const ragAnswer = statutoryRAG.generateAnswer(query, profile);

    // 2. If it's a greeting or intro query, return conversational welcome immediately
    if (ragAnswer.isConversational) {
      return NextResponse.json({
        success: true,
        data: {
          reply: ragAnswer.plainEnglishExplanation,
          plainSummary: ragAnswer.summary,
          legalBasis: ragAnswer.legalBasis,
          citations: ragAnswer.topCitations,
          followUpSuggestions: ragAnswer.suggestedFollowUps,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // 3. Attempt ultra-fast Groq LPU inference with rich contextual prompting
    let dynamicAiReply: string | null = null;
    const profileContext = profile 
      ? `\nApplicant Profile:
- Enterprise: ${profile.companyName || 'Maharashtra Industrial Enterprise'}
- Sector: ${profile.sector || 'Manufacturing'}
- District / MIDC Zone: ${profile.district || 'Pune'}
- Investment: ₹${profile.investmentInrCr || 25} Crore
- Scale: ${profile.isMsme ? 'MSME' : 'Large / Mega'}
- Pollution Tier: ${profile.pollutionCategory || 'Orange'}`
      : '';
    
    const groqPrompt = `User Query: "${query}"
${profileContext}

Statutory Grounding Reference:
- Relevant Statute: ${ragAnswer.legalBasis.actTitle} (${ragAnswer.legalBasis.sectionOrRule})
- Regulating Authority: ${ragAnswer.legalBasis.department}
- Statutory Standard / Rule: ${ragAnswer.plainEnglishExplanation}

Instructions:
1. Answer the user's specific query directly, authoritatively, and thoroughly for the state of Maharashtra (MAITRI single-window system).
2. Tailor your answer specifically to their sector and investment if provided in the applicant profile.
3. Structure with clean markdown headers and bullet points.
4. Keep the tone professional, encouraging ease of doing business, and cite specific rules (e.g. RTS Act 2015, MIDC DCR 2009, Water Act 1974, PSI 2019).`;

    try {
      dynamicAiReply = await askGroq(groqPrompt);
    } catch {
      dynamicAiReply = null;
    }

    // 4. Construct response:
    // If Groq generated a dynamic reply, present it directly with relevant statutory citations
    let reply = '';
    if (dynamicAiReply) {
      reply = dynamicAiReply;
      
      // Add a concise, non-intrusive legal basis badge if not already mentioned
      if (!dynamicAiReply.toLowerCase().includes(ragAnswer.legalBasis.sectionOrRule.toLowerCase())) {
        reply += `\n\n---\n*🏛️ **Statutory Authority:** ${ragAnswer.legalBasis.department} • **Governing Rule:** ${ragAnswer.legalBasis.actTitle} (${ragAnswer.legalBasis.sectionOrRule})*`;
      }
    } else {
      // Deterministic RAG fallback tailored to the specific identified topic
      reply = `### 💡 Regulatory Guidance\n${ragAnswer.plainEnglishExplanation}\n\n`;
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
          reply += `* **[${cit.sectionOrRule}]** ${cit.actTitle} • *${cit.department}* (Relevance: ${cit.confidence}%)\n`;
        });
      }
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
    console.error('Chat error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Chat service error' },
      { status: 500 }
    );
  }
}
