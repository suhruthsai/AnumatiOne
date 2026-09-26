import { MAHARASHTRA_STATUTORY_CORPUS, type StatutoryKnowledgeChunk } from './statutory-corpus';

export interface RAGSearchResult {
  chunk: StatutoryKnowledgeChunk;
  relevanceScore: number; // 0 to 100
  matchedKeywords: string[];
}

export interface RAGAnswer {
  query: string;
  detectedLanguage: 'en' | 'hi' | 'mr';
  summary: string;
  plainEnglishExplanation: string;
  isConversational?: boolean;
  legalBasis: {
    actTitle: string;
    sectionOrRule: string;
    department: string;
    statutorySafeguard?: string;
  };
  actionableSteps: string[];
  topCitations: Array<{
    id: string;
    actTitle: string;
    sectionOrRule: string;
    department: string;
    confidence: number;
  }>;
  suggestedFollowUps: string[];
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'but', 'by', 'can', 'could', 'did', 'do', 'does', 'doing',
  'down', 'during', 'each', 'explain', 'few', 'for', 'from', 'further', 'get',
  'give', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself',
  'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its',
  'itself', 'just', 'know', 'me', 'more', 'most', 'my', 'myself', 'need', 'no',
  'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'please', 'same', 'should', 'so',
  'some', 'such', 'tell', 'than', 'that', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through',
  'to', 'too', 'under', 'until', 'up', 'very', 'want', 'was', 'we', 'were',
  'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will',
  'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

function tokenize(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097F\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));
}

const TOPIC_PATTERNS: Array<{
  chunkId: string;
  patterns: RegExp[];
}> = [
  {
    chunkId: 'GREEN_CHANNEL_SELF_CERT',
    patterns: [/green\s*channel/i, /fast\s*track/i, /self\s*cert/i, /white\s*category/i, /instant\s*approval/i],
  },
  {
    chunkId: 'MAHAVAULT_PRE_VALIDATION',
    patterns: [/mahavault/i, /pre\s*validat/i, /document\s*check/i, /zero\s*query/i, /data\s*reuse/i, /cad\s*scrutiny/i],
  },
  {
    chunkId: 'WATER_ACT_SEC_25_CTE',
    patterns: [/consent\s*to\s*establish/i, /\bcte\b/i, /water\s*act/i, /\betp\b/i, /\bzld\b/i, /zero\s*liquid/i, /effluent/i, /wastewater/i, /mpcb/i],
  },
  {
    chunkId: 'AIR_ACT_SEC_21_CTO',
    patterns: [/consent\s*to\s*operate/i, /\bcto\b/i, /air\s*act/i, /emission/i, /chimney/i, /stack\s*height/i, /ocems/i],
  },
  {
    chunkId: 'MIDC_DCR_RULE_14_SETBACKS',
    patterns: [/setback/i, /driveway/i, /rule\s*14/i, /turning\s*radius/i, /peripheral\s*margin/i, /midc\s*dcr/i, /building\s*plan/i],
  },
  {
    chunkId: 'FIRE_ACT_CFO_NOC',
    patterns: [/fire\s*noc/i, /\bcfo\b/i, /fire\s*safety/i, /hydrant/i, /sprinkler/i, /fire\s*brigade/i],
  },
  {
    chunkId: 'FACTORIES_ACT_DISH_LICENSE',
    patterns: [/\bdish\b/i, /factory\s*license/i, /factory\s*act/i, /worker\s*safety/i, /form\s*27/i, /occupational/i],
  },
  {
    chunkId: 'ELECTRICITY_ACT_HT_POWER',
    patterns: [/electricity\s*connection/i, /power\s*(load|sanction|connection|supply|feeder|line|demand)/i, /\bht\s*power\b/i, /high\s*tension/i, /\bmsedcl\b/i, /\bmahadiscom\b/i, /transformer/i, /substation/i, /load\s*sanction/i],
  },
  {
    chunkId: 'IBR_BOILER_REGISTRATION',
    patterns: [/boiler/i, /\bibr\b/i, /steam/i, /hydraulic\s*test/i],
  },
  {
    chunkId: 'MAHA_PSI_2019_INCENTIVES',
    patterns: [/psi\s*2019/i, /\bips\b/i, /sgst/i, /subsidy/i, /incentive/i, /taluka/i, /zone\s*[a-d]/i, /package\s*scheme/i],
  },
  {
    chunkId: 'STAMP_DUTY_EXEMPTION_BOMBAY',
    patterns: [/stamp\s*duty/i, /lease\s*deed/i, /bombay\s*stamp/i, /\bdic\b/i, /duty\s*waiver/i],
  },
  {
    chunkId: 'ELECTRICITY_DUTY_EXEMPTION',
    patterns: [/electricity\s*duty/i, /power\s*bill\s*waiver/i, /energy\s*duty/i],
  },
  {
    chunkId: 'CMEGP_MSME_SCHEME',
    patterns: [/cmegp/i, /startup/i, /\bmsme\b/i, /first\s*gen/i, /grant/i, /interest\s*subvention/i],
  },
  {
    chunkId: 'RTS_ACT_SEC_8_APPEALS',
    patterns: [/appeal/i, /grievance/i, /penalty/i, /\bfine\b/i, /delay/i, /escalat/i, /complaint/i, /section\s*18/i, /section\s*19/i],
  },
  {
    chunkId: 'RTS_ACT_SEC_4_DEEMED',
    patterns: [/deemed/i, /rts\s*act/i, /section\s*4/i, /\bsla\b/i, /deadline/i, /countdown/i, /statutory\s*time/i],
  },
];

export class MaharashtraStatutoryRAG {
  private corpus: StatutoryKnowledgeChunk[];
  private corpusMap: Map<string, StatutoryKnowledgeChunk>;

  constructor(corpus = MAHARASHTRA_STATUTORY_CORPUS) {
    this.corpus = corpus;
    this.corpusMap = new Map(corpus.map(c => [c.id, c]));
  }

  public isGreetingOrGeneral(query: string): boolean {
    const q = query.trim().toLowerCase();
    const greetings = [
      'hi', 'hello', 'hey', 'namaste', 'namaskar', 'good morning', 'good afternoon',
      'good evening', 'who are you', 'what are you', 'help', 'what can you do',
      'how does this work', 'thanks', 'thank you', 'intro', 'welcome'
    ];
    return greetings.some(g => q === g || q.startsWith(g + ' ') || q.endsWith(' ' + g));
  }

  public search(query: string, topK = 3): RAGSearchResult[] {
    const rawQuery = query.toLowerCase();

    // 1. Pattern Matching with Match Count Scoring
    const patternMatches: Array<{ chunkId: string; count: number }> = [];
    for (const item of TOPIC_PATTERNS) {
      let count = 0;
      for (const p of item.patterns) {
        if (p.test(rawQuery)) count++;
      }
      if (count > 0) {
        patternMatches.push({ chunkId: item.chunkId, count });
      }
    }

    if (patternMatches.length > 0) {
      patternMatches.sort((a, b) => b.count - a.count);
      const topId = patternMatches[0].chunkId;
      const chunk = this.corpusMap.get(topId);
      if (chunk) {
        const otherChunks = this.corpus.filter(c => c.id !== topId).slice(0, topK - 1);
        return [
          { chunk, relevanceScore: 95, matchedKeywords: [topId] },
          ...otherChunks.map(c => ({ chunk: c, relevanceScore: 40, matchedKeywords: [] })),
        ];
      }
    }

    // 2. Lexical & Key Terms Matching
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) {
      return this.corpus.slice(0, topK).map(chunk => ({
        chunk,
        relevanceScore: 60,
        matchedKeywords: [],
      }));
    }

    const scored: RAGSearchResult[] = [];
    for (const chunk of this.corpus) {
      let score = 0;
      const matched: string[] = [];

      for (const kw of chunk.keyTerms || []) {
        const kwLower = kw.toLowerCase();
        if (rawQuery.includes(kwLower)) {
          score += 35;
          matched.push(kwLower);
        }
      }

      for (const t of queryTokens) {
        if (chunk.title.toLowerCase().includes(t)) {
          score += 20;
          matched.push(t);
        }
        if (chunk.plainEnglishExplanation.toLowerCase().includes(t)) {
          score += 10;
          matched.push(t);
        }
        if (chunk.department.toLowerCase().includes(t)) {
          score += 15;
          matched.push(t);
        }
      }

      if (score > 0) {
        scored.push({
          chunk,
          relevanceScore: Math.min(95, score),
          matchedKeywords: Array.from(new Set(matched)),
        });
      }
    }

    scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
    if (scored.length > 0) {
      return scored.slice(0, topK);
    }

    // Fallback: Return top 3 distinct key chunks
    return [
      { chunk: this.corpusMap.get('WATER_ACT_SEC_25_CTE') || this.corpus[0], relevanceScore: 50, matchedKeywords: [] },
      { chunk: this.corpusMap.get('MIDC_DCR_RULE_14_SETBACKS') || this.corpus[1], relevanceScore: 45, matchedKeywords: [] },
      { chunk: this.corpusMap.get('MAHA_PSI_2019_INCENTIVES') || this.corpus[2], relevanceScore: 40, matchedKeywords: [] },
    ];
  }

  public generateAnswer(userQuery: string, profileContext?: any): RAGAnswer {
    const rawQuery = (userQuery || '').trim();
    const isHindi = /[\u0900-\u097F]/.test(rawQuery) || rawQuery.toLowerCase().includes('hindi');
    const isMarathi = rawQuery.toLowerCase().includes('marathi') || rawQuery.toLowerCase().includes('मराठी');
    const detectedLang: 'en' | 'hi' | 'mr' = isMarathi ? 'mr' : (isHindi ? 'hi' : 'en');

    // Handle Greetings / General Introductions
    if (this.isGreetingOrGeneral(rawQuery)) {
      const company = profileContext?.companyName || 'Industrialist';
      const sector = profileContext?.sector || 'Manufacturing';
      const district = profileContext?.district || 'Maharashtra';

      const greetingText = `Hello **${company}**! Welcome to **AnumatiOne Regulatory AI**.\n\nI am your 24/7 statutory intelligence copilot for industrial clearances in **${district}** under the **Government of Maharashtra MAITRI Single-Window System**.\n\nHere is how I can assist your **${sector}** operations today:\n\n* 🌿 **Clearance Checklist & SLAs:** Know required NOCs across MPCB, MIDC, DISH, and Fire Services.\n* ⚡ **Green Channel Auto-Approval:** Check if you qualify for 48-hour self-certification.\n* 🛡️ **MahaVault Data Reuse:** Verify your CAD blueprints and land titles under RTS Sec 3(2).\n* 💰 **Package Scheme of Incentives (PSI 2019):** Calculate your State GST refunds, stamp duty waivers, and power tariff subsidies.\n* ⚖️ **RTS Act Safeguards:** Track mandatory 15-30 day SLAs and Section 4(1) Deemed Approvals.`;

      return {
        query: userQuery,
        detectedLanguage: detectedLang,
        summary: `AnumatiOne Statutory AI Copilot ready to assist ${company}.`,
        plainEnglishExplanation: greetingText,
        isConversational: true,
        legalBasis: {
          actTitle: 'Maharashtra Right to Services (RTS) Act, 2015',
          sectionOrRule: 'Single-Window Citizen Charter',
          department: 'Government of Maharashtra (MAITRI)',
          statutorySafeguard: 'Real-time statutory clearance copilot',
        },
        actionableSteps: [
          'Ask: "What approvals do I need for my plant?"',
          'Ask: "Can I get Green Channel auto-approval?"',
          'Ask: "How much SGST refund can I claim under PSI 2019?"',
          'Ask: "What are the fire driveway setback rules under MIDC DCR?"',
        ],
        topCitations: [
          {
            id: 'RTS_CITIZEN_CHARTER',
            actTitle: 'Maharashtra Right to Services (RTS) Act 2015',
            sectionOrRule: 'Citizen Charter',
            department: 'MAITRI Single-Window Gateway',
            confidence: 100,
          },
        ],
        suggestedFollowUps: [
          'What approvals do I need for my manufacturing plant?',
          'Can I get Green Channel auto-approval?',
          'How much SGST refund can I claim under PSI 2019?',
          'What are the mandatory setbacks under Rule 14 of MIDC DCR?',
        ],
      };
    }

    const searchResults = this.search(rawQuery, 3);
    const topChunk = searchResults[0].chunk;

    const topCitations = searchResults.map(r => ({
      id: r.chunk.id,
      actTitle: r.chunk.actTitle,
      sectionOrRule: r.chunk.sectionOrRule,
      department: r.chunk.department,
      confidence: r.relevanceScore,
    }));

    let summary = `Under ${topChunk.actTitle} (${topChunk.sectionOrRule}), ${topChunk.title.toLowerCase()} is enforced by ${topChunk.department}.`;
    let plainExplanation = topChunk.plainEnglishExplanation;
    let actionableSteps = [...topChunk.actionableSteps];

    if (detectedLang === 'hi') {
      summary = `**${topChunk.actTitle} (${topChunk.sectionOrRule}) के अंतर्गत:**\n${topChunk.title}`;
      plainExplanation = `**सरल शब्दों में:** ${topChunk.plainEnglishExplanation}`;
    }

    const followUps = this.generateContextualFollowUps(topChunk.id);

    return {
      query: userQuery,
      detectedLanguage: detectedLang,
      summary,
      plainEnglishExplanation: plainExplanation,
      isConversational: false,
      legalBasis: {
        actTitle: topChunk.actTitle,
        sectionOrRule: topChunk.sectionOrRule,
        department: topChunk.department,
        statutorySafeguard: topChunk.statutorySafeguard,
      },
      actionableSteps,
      topCitations,
      suggestedFollowUps: followUps,
    };
  }

  private generateContextualFollowUps(topChunkId: string): string[] {
    switch (topChunkId) {
      case 'GREEN_CHANNEL_SELF_CERT':
        return [
          'What criteria make my unit eligible for Green Channel?',
          'How does DigiLocker authentication replace physical verification?',
          'What happens if my unit is in the Orange or Red category?',
        ];
      case 'WATER_ACT_SEC_25_CTE':
        return [
          'What documents are needed for MPCB Consent to Establish (CTE)?',
          'How does MahaVault pre-validate Zero Liquid Discharge (ZLD) schemes?',
          'Can MPCB CTE run in parallel with MIDC Building Plan approvals?',
        ];
      case 'AIR_ACT_SEC_21_CTO':
        return [
          'When should I apply for MPCB Consent to Operate (CTO)?',
          'What are the OCEMS digital sensor requirements?',
          'How long is the initial CTO valid in Maharashtra?',
        ];
      case 'MIDC_DCR_RULE_14_SETBACKS':
        return [
          'What is the minimum peripheral fire driveway for hazardous plots?',
          'How does MahaVault pre-check CAD drawings for setback compliance?',
          'What is the processing SLA for MIDC Building Plan approvals?',
        ];
      case 'FIRE_ACT_CFO_NOC':
        return [
          'What static water storage is mandatory for an industrial Fire NOC?',
          'Can Fire NOC inspection be bundled with DISH Factory inspection?',
          'What is the statutory timeline for Provisional Fire NOC in MIDC?',
        ];
      case 'FACTORIES_ACT_DISH_LICENSE':
        return [
          'What is the deadline for filing DISH Form 27 annual safety returns?',
          'How many workers trigger mandatory full-time safety officer appointment?',
          'How do I schedule a synchronized joint inspection with DISH and Fire?',
        ];
      case 'ELECTRICITY_ACT_HT_POWER':
        return [
          'At what connected load does MSEDCL require HT 11kV connection?',
          'What is the statutory SLA for MSEDCL load sanction in Maharashtra?',
          'Does AnumatiOne run power feasibility concurrently with construction?',
        ];
      case 'MAHA_PSI_2019_INCENTIVES':
        return [
          'Which taluka category does my manufacturing site fall under (Zone A-D+)?',
          'How is the Gross SGST refund calculated against eligible capital outlay?',
          'How do I claim 100% stamp duty exemption on MIDC lease deeds?',
        ];
      case 'STAMP_DUTY_EXEMPTION_BOMBAY':
        return [
          'How do I obtain the DIC stamp duty waiver certificate?',
          'Does stamp duty exemption apply to bank mortgage deeds for project loans?',
          'What is the process at the Sub-Registrar Office in Maharashtra?',
        ];
      case 'CMEGP_MSME_SCHEME':
        return [
          'What is the maximum non-repayable grant under CMEGP for startups?',
          'How does the 5% interest subvention work on bank term loans?',
          'What documents are needed for District Taskforce Committee approval?',
        ];
      case 'RTS_ACT_SEC_8_APPEALS':
        return [
          'Who is the First Appellate Authority for MPCB or MIDC delays?',
          'How is the ₹250/day personal penalty deducted from defaulting officers?',
          'What is the statutory 30-day timeline to decide a Section 18 appeal?',
        ];
      case 'RTS_ACT_SEC_4_DEEMED':
      default:
        return [
          'How do I track my active deemed approval countdown?',
          'What is the legal validity of an electronic deemed certificate in court?',
          'What happens if an officer raises a query 1 day before SLA expires?',
        ];
    }
  }
}

export const statutoryRAG = new MaharashtraStatutoryRAG();
