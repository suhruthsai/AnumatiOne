/**
 * GroqCloud Ultra-Fast LPU Inference Client for AnumatiOne
 * Models: openai/gpt-oss-120b, qwen/qwen3.8-27b
 * Provides sub-second contextual responses for Maharashtra industrial clearances.
 */

const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const PRIMARY_MODEL = 'openai/gpt-oss-120b';
const MULTILINGUAL_MODEL = 'qwen/qwen3.8-27b';

export const MAHARASHTRA_LEGAL_SYSTEM_PROMPT = `You are AnumatiOne Regulatory AI, an expert advisor on Maharashtra industrial approvals, statutory compliance, and ease of doing business under the Government of Maharashtra (MAITRI single-window system).

Core Regulatory Knowledge Base:
1. Maharashtra Right to Services (RTS) Act 2015:
   - Section 4(1): Mandatory Service Level Agreements (SLAs) for all industrial approvals (typically 15 to 30 days).
   - Section 4(2): If an officer fails to approve, reject with reasoned order, or raise structured query within the SLA, the applicant receives legal DEEMED APPROVAL.
   - Section 18: First Appeal to First Appellate Authority within 30 days of SLA breach or arbitrary query.
   - Section 19: Second Appeal to Maharashtra Right to Public Services Commission within 45 days.
   - Section 19(8): Penalty of ₹250/day up to a maximum cap of ₹5,000 on defaulting officers deducted directly from salary.
   - Section 3(2): Scrutiny Shield — documents verified once in MahaVault (DigiLocker) cannot be re-demanded by sister departments.

2. Approvals & Line Departments:
   - MIDC: Land Allotment, Building Plan & Commencement Certificate (Rule 14 of MIDC DCR 2009: 6.0m minimum fire driveway setback).
   - MPCB: Consent to Establish (CTE) & Consent to Operate (CTO). Categorization: Red, Orange, Green, White. Zero Liquid Discharge (ZLD) mass balance required.
   - DISH: Factory Registration & License under Maharashtra Factories Rules 1963; Form 27 half-yearly safety return.
   - MSEDCL: High Tension (HT) 11kV/22kV/33kV power load feasibility sanction.
   - Fire Services: Provisional Fire NOC before construction; Final Occupancy Fire NOC before commissioning.

3. Package Scheme of Incentives (PSI 2019 / 2024):
   - Taluka Zone Tiers: Zone A (Developed/Mumbai-Pune City: 30% EV SGST refund), Zone B (40%), Zone C (60%), Zone D (80%), Zone D+ (100% max SGST refund over 7-10 years).
   - 100% Stamp Duty Exemption on MIDC industrial lease deeds.
   - Electricity Duty Exemption for 7-10 years.
   - CMEGP: Up to ₹50 Lakh capital subsidy for MSME / first-gen industrialists.

Instructions:
- Provide clear, highly authoritative, practical advice.
- Cite specific Maharashtra Acts, Sections, and Rules.
- If the user writes in Marathi (मराठी) or Hindi (हिन्दी), respond fluently in that language.
- Format with clean Markdown headers, bullet points, and practical action steps.`;

export async function askGroq(
  userPrompt: string,
  options?: {
    customSystemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
    preferMultilingual?: boolean;
  }
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
  if (!apiKey) {
    return null;
  }

  const isIndic = /[\u0900-\u097F]/.test(userPrompt);
  const modelToUse = isIndic || options?.preferMultilingual ? MULTILINGUAL_MODEL : PRIMARY_MODEL;
  const systemPrompt = options?.customSystemPrompt || MAHARASHTRA_LEGAL_SYSTEM_PROMPT;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout for reasoning models

    const response = await fetch(GROQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: options?.temperature ?? 0.3,
        max_tokens: options?.maxTokens ?? 1600,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Groq API returned status ${response.status}: ${response.statusText}`);
      if (modelToUse !== MULTILINGUAL_MODEL) {
        return askGroq(userPrompt, { ...options, preferMultilingual: true, maxTokens: 1600 });
      }
      return null;
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    return reply ? reply.trim() : null;
  } catch (err: any) {
    console.warn('Groq API invocation failed, falling back to local RAG engine:', err.message);
    return null;
  }
}
