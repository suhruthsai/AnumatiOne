'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Send, 
  Clock, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { statutoryRAG, RAGAnswer } from '@/lib/rag/hybrid-rag-engine';
import { nlpSimplifier, SimplifiedQueryResult } from '@/lib/rag/nlp-simplifier';
import confetti from 'canvas-confetti';

const SAMPLE_QUERIES = [
  {
    title: 'Section 4(1) Deemed Approval',
    query: 'What is Section 4(1) Deemed Approval under Maharashtra RTS Act and how does it protect me?',
  },
  {
    title: 'MIDC 12m Fire Driveway Rule',
    query: 'What are the setback and peripheral fire driveway rules under Rule 14.1 of MIDC DCR 2009?',
  },
  {
    title: 'MPCB Zero Liquid Discharge (ZLD)',
    query: 'Why does MPCB require Zero Liquid Discharge (ZLD) mass balance flowchart for Consent to Establish (CTE)?',
  },
  {
    title: '100% Stamp Duty Exemption',
    query: 'How do I claim the 100% stamp duty exemption on MIDC industrial lease deeds?',
  },
];

const SAMPLE_NOTICES = [
  {
    label: 'MPCB ZLD Notice',
    text: 'Pursuant to Section 25 of Water Act 1974, submit detailed water mass-balance flowchart and Effluent Treatment Plant (ETP) capacity schematic within 15 days.',
  },
  {
    label: 'MIDC Rule 14.1 Setback Objection',
    text: 'Under Rule 14.1 of MIDC DCR 2009, submitted architectural CAD layout fails to demonstrate unobstructed 12.0m peripheral fire driveway with 15.0m corner turning radius.',
  },
  {
    label: 'DISH & Fire Inspection Stalemate',
    text: 'Notice regarding joint inspection under Rule 4 of Maharashtra Factories Rules 1963 and Fire Safety Act 2006. Rescheduling required due to officer unavailability.',
  },
];

export function NLPRAGSimplifierPanel() {
  const [activeSubTab, setActiveSubTab] = useState<'RAG_SEARCH' | 'QUERY_SIMPLIFIER'>('RAG_SEARCH');

  // RAG Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [ragResult, setRagResult] = useState<RAGAnswer | null>(() => {
    return statutoryRAG.generateAnswer('What is Section 4(1) Deemed Approval under Maharashtra RTS Act?');
  });

  // NLP Query Simplifier State
  const [noticeInput, setNoticeInput] = useState(SAMPLE_NOTICES[0].text);
  const [simplifiedResult, setSimplifiedResult] = useState<SimplifiedQueryResult | null>(() => {
    return nlpSimplifier.simplifyDepartmentQuery(SAMPLE_NOTICES[0].text);
  });
  const [copied, setCopied] = useState(false);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) return;
    const ans = statutoryRAG.generateAnswer(q);
    setRagResult(ans);
  };

  const handleSimplifyNotice = (textToSimplify: string) => {
    setNoticeInput(textToSimplify);
    if (!textToSimplify.trim()) return;
    const res = nlpSimplifier.simplifyDepartmentQuery(textToSimplify);
    setSimplifiedResult(res);
  };

  const copyResponseLetter = () => {
    if (!simplifiedResult) return;
    navigator.clipboard.writeText(simplifiedResult.suggestedOfficialResponseLetter);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation pills */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('RAG_SEARCH')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'RAG_SEARCH'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Search className="h-3.5 w-3.5" />
          Statutory RAG Semantic Knowledge Assistant
        </button>

        <button
          onClick={() => setActiveSubTab('QUERY_SIMPLIFIER')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'QUERY_SIMPLIFIER'
              ? 'bg-gradient-to-r from-blue-600 to-accent-purple text-white shadow-lg shadow-purple-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-300" />
          NLP Department Query & Rejection Simplifier
        </button>
      </div>

      {/* Mode 1: Statutory RAG Semantic Knowledge Search */}
      {activeSubTab === 'RAG_SEARCH' && (
        <div className="space-y-6">
          {/* Search Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Ask Any Maharashtra Legal, Statutory, or Scheme Question
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Retrieval-Augmented Generation across 9 official Maharashtra Acts, 6 industrial schemes, and departmental SOPs.
            </p>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="e.g. How does Section 4(1) deemed approval work? What are the setback rules under MIDC DCR?"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-24 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <button
                onClick={() => handleSearch(searchQuery)}
                className="absolute right-2 top-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
              >
                Search RAG
              </button>
            </div>

            {/* Quick Sample Queries */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Popular Queries:</span>
              {SAMPLE_QUERIES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(sample.query)}
                  className="rounded-lg bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 text-[11px] text-slate-300 border border-slate-700/50 transition-colors"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* RAG Answer Display */}
          {ragResult && (
            <div className="rounded-2xl border border-blue-500/30 bg-slate-900/80 p-6 backdrop-blur-md shadow-2xl space-y-5">
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                    RAG Grounded Response
                  </span>
                  <span className="text-xs text-slate-400">
                    Authority: <strong className="text-white">{ragResult.legalBasis.department}</strong>
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  {ragResult.legalBasis.actTitle} • <strong>{ragResult.legalBasis.sectionOrRule}</strong>
                </div>
              </div>

              {/* Plain English Card */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  In Plain English (Simple Explanation)
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {ragResult.plainEnglishExplanation}
                </p>
                {ragResult.legalBasis.statutorySafeguard && (
                  <div className="text-[11px] text-emerald-400 pt-1 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Statutory Safeguard: {ragResult.legalBasis.statutorySafeguard}
                  </div>
                )}
              </div>

              {/* Actionable Steps Checklist */}
              {ragResult.actionableSteps && ragResult.actionableSteps.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-blue-400" />
                    What You Should Do (Actionable Roadmap)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {ragResult.actionableSteps.map((step, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-1">
                        <span className="font-mono text-[10px] font-bold text-blue-400 block">Step {idx + 1}</span>
                        <p className="text-slate-300 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Retrieved Statutory Citations */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5 text-slate-400" />
                  Retrieved Official Legal Citations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {ragResult.topCitations.map((cit, idx) => (
                    <div key={idx} className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-[11px]">
                      <div className="flex items-center justify-between text-blue-400 font-bold">
                        <span>{cit.sectionOrRule}</span>
                        <span className="font-mono text-[10px] text-emerald-400">{cit.confidence}% Match</span>
                      </div>
                      <div className="text-white font-medium truncate mt-0.5">{cit.actTitle}</div>
                      <div className="text-[10px] text-slate-400 truncate">{cit.department}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contextual Follow-up Chips */}
              {ragResult.suggestedFollowUps && ragResult.suggestedFollowUps.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Follow-up Questions:</span>
                  {ragResult.suggestedFollowUps.map((fu, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(fu)}
                      className="rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/20 px-2.5 py-1 text-[11px] text-blue-300 transition-colors"
                    >
                      {fu} →
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: NLP Department Query & Rejection Simplifier */}
      {activeSubTab === 'QUERY_SIMPLIFIER' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Paste Any Department Notice, Query, or Rejection Letter
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Our NLP engine parses dense legalese from MPCB, MIDC, DISH, or Fire Brigade, explains the real issue in plain English, and writes a formal response letter for you.
            </p>

            {/* Quick Sample Notice Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Try Real Maharashtra Notices:</span>
              {SAMPLE_NOTICES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimplifyNotice(sample.text)}
                  className="rounded-lg bg-purple-950/40 hover:bg-purple-900/50 px-2.5 py-1 text-[11px] text-purple-300 border border-purple-500/20 transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={noticeInput}
              onChange={(e) => setNoticeInput(e.target.value)}
              placeholder="Paste raw notice text received from government portal or officer email..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
            />

            <button
              onClick={() => handleSimplifyNotice(noticeInput)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-accent-purple px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Analyze & Simplify with NLP
            </button>
          </div>

          {/* NLP Analysis Result */}
          {simplifiedResult && (
            <div className="rounded-2xl border border-purple-500/30 bg-slate-900/80 p-6 backdrop-blur-md shadow-2xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                    NLP Parsing Verified
                  </span>
                  <span className="text-xs text-slate-300">
                    Department: <strong className="text-white">{simplifiedResult.identifiedDepartment}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    +{simplifiedResult.estimatedTimelineDelayDays}d Delay if Ignored
                  </span>
                  <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                    {simplifiedResult.citedActOrRule}
                  </span>
                </div>
              </div>

              {/* Plain English Translation */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  What the Officer is Actually Asking For (Plain English):
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {simplifiedResult.plainEnglishExplanation}
                </p>
                <div className="text-[11px] text-slate-400 pt-1">
                  <strong className="text-slate-300">Root Cause:</strong> {simplifiedResult.whyThisHappened}
                </div>
              </div>

              {/* Remedial Steps */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Prescribed Remedial Steps:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {simplifiedResult.actionableSteps.map((step, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-1">
                      <span className="font-mono text-[10px] font-bold text-purple-400">Step {idx + 1}</span>
                      <p className="text-slate-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Response Letter Box */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-blue-400" />
                    AI-Drafted Official Response Letter (Ready to Submit):
                  </h4>
                  <button
                    onClick={copyResponseLetter}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1 text-xs font-bold text-white transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    {copied ? 'Copied to Clipboard! ✓' : 'Copy Letter'}
                  </button>
                </div>

                <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {simplifiedResult.suggestedOfficialResponseLetter}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
