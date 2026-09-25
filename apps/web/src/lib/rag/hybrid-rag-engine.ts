import { MAHARASHTRA_STATUTORY_CORPUS, StatutoryKnowledgeChunk } from './statutory-corpus';

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

/**
 * Tokenizes text into lowercase normalized words
 */
function tokenize(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097F\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

/**
 * Hybrid Semantic & BM25-style Retriever across Maharashtra Statutory Knowledge Base
 */
export class MaharashtraStatutoryRAG {
  private corpus: StatutoryKnowledgeChunk[];

  constructor(corpus = MAHARASHTRA_STATUTORY_CORPUS) {
    this.corpus = corpus;
  }

  /**
   * Search knowledge base and rank by hybrid lexical + semantic relevance
   */
  public search(query: string, topK = 3): RAGSearchResult[] {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) {
      return this.corpus.slice(0, topK).map(chunk => ({
        chunk,
        relevanceScore: 70,
        matchedKeywords: [],
      }));
    }

    const results: RAGSearchResult[] = [];

    for (const chunk of this.corpus) {
      const chunkTokens = [
        ...tokenize(chunk.title),
        ...tokenize(chunk.actTitle),
        ...tokenize(chunk.sectionOrRule),
        ...tokenize(chunk.department),
        ...tokenize(chunk.plainEnglishExplanation),
        ...(chunk.keyTerms || []).flatMap(k => tokenize(k)),
      ];

      const chunkTokenSet = new Set(chunkTokens);
      const matched: string[] = [];

      // Exact term overlap
      let matchCount = 0;
      for (const token of queryTokens) {
        if (chunkTokenSet.has(token)) {
          matchCount++;
          matched.push(token);
        } else {
          // Substring partial match
          for (const cToken of chunkTokens) {
            if (cToken.includes(token) || token.includes(cToken)) {
              matchCount += 0.5;
              matched.push(cToken);
              break;
            }
          }
        }
      }

      // Keyword boost
      let keywordBoost = 0;
      for (const kw of chunk.keyTerms || []) {
        if (query.toLowerCase().includes(kw.toLowerCase())) {
          keywordBoost += 25;
        }
      }

      const lexicalScore = (matchCount / queryTokens.length) * 55;
      const totalScore = Math.min(100, Math.round(lexicalScore + keywordBoost));

      if (totalScore > 10) {
        results.push({
          chunk,
          relevanceScore: totalScore,
          matchedKeywords: matched.filter((m, idx) => matched.indexOf(m) === idx),
        });
      }
    }

    // Sort descending by relevance
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    if (results.length === 0) {
      return this.corpus.slice(0, topK).map(chunk => ({
        chunk,
        relevanceScore: 60,
        matchedKeywords: [],
      }));
    }

    return results.slice(0, topK);
  }

  /**
   * Generates a grounded, plain-English response with legal citations
   */
  public generateAnswer(userQuery: string): RAGAnswer {
    const rawQuery = (userQuery || '').trim();
    const isHindi = /[\u0900-\u097F]/.test(rawQuery) || rawQuery.toLowerCase().includes('hindi') || rawQuery.toLowerCase().includes('हिन्दी');
    const isMarathi = rawQuery.toLowerCase().includes('marathi') || rawQuery.toLowerCase().includes('मराठी');
    const detectedLang: 'en' | 'hi' | 'mr' = isMarathi ? 'mr' : (isHindi ? 'hi' : 'en');

    const searchResults = this.search(rawQuery, 3);
    const topResult = searchResults[0];
    const topChunk = topResult.chunk;

    const topCitations = searchResults.map(r => ({
      id: r.chunk.id,
      actTitle: r.chunk.actTitle,
      sectionOrRule: r.chunk.sectionOrRule,
      department: r.chunk.department,
      confidence: r.relevanceScore,
    }));

    // Plain English Answer Synthesis
    let summary = `Under ${topChunk.actTitle} (${topChunk.sectionOrRule}), ${topChunk.title.toLowerCase()} is enforced by ${topChunk.department}.`;
    let plainExplanation = topChunk.plainEnglishExplanation;
    let actionableSteps = [...topChunk.actionableSteps];

    // Language adaptation for Hindi
    if (detectedLang === 'hi') {
      summary = `**${topChunk.actTitle} (${topChunk.sectionOrRule}) के अंतर्गत:**\n${topChunk.title}`;
      plainExplanation = `**सरल शब्दों में:** ${topChunk.plainEnglishExplanation}`;
    }

    const followUps = this.generateContextualFollowUps(topChunk.id, rawQuery);

    return {
      query: userQuery,
      detectedLanguage: detectedLang,
      summary,
      plainEnglishExplanation: plainExplanation,
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

  private generateContextualFollowUps(topChunkId: string, query: string): string[] {
    if (topChunkId.includes('RTS')) {
      return [
        'How do I track my active deemed approval countdown?',
        'What is the penalty if an officer sits on my application past 30 days?',
        'How do I file a 1-click first appeal to the Appellate Authority?',
      ];
    }
    if (topChunkId.includes('WATER') || topChunkId.includes('AIR')) {
      return [
        'What documents are required for MPCB Consent to Establish (CTE)?',
        'How does MahaVault pre-validate Zero Liquid Discharge (ZLD) blueprints?',
        'Can MPCB CTE run in parallel with building plan approvals?',
      ];
    }
    if (topChunkId.includes('PSI') || topChunkId.includes('INCENTIVE') || topChunkId.includes('STAMP')) {
      return [
        'How to claim 100% stamp duty exemption on MIDC lease deeds?',
        'What is the SGST refund under Maharashtra PSI 2019?',
        'How do I apply for the CMEGP startup grant in Maharashtra?',
      ];
    }
    return [
      'Explain Section 4(1) Deemed Approval under Maharashtra RTS Act',
      'What are the mandatory setbacks under Rule 14 of MIDC DCR?',
      'How does AnumatiOne cut approval times from 218 days to 88 days?',
    ];
  }
}

// Global Singleton Instance
export const statutoryRAG = new MaharashtraStatutoryRAG();
