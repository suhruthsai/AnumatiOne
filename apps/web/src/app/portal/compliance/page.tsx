'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ComplianceCalendarItem, StatutoryReturnRecord } from '@approvalos/shared';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Bell, 
  ShieldCheck,
  RefreshCw,
  FileCheck2,
  BookOpen,
  Gift,
  Scale,
  ExternalLink,
  ChevronRight,
  Landmark,
  FileText,
  ArrowRight,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  MAHARASHTRA_STATUTORY_ACTS, 
  MAHARASHTRA_STATE_SCHEMES 
} from '@/lib/knowledge-engine/maharashtra-governance';
import { NLPRAGSimplifierPanel } from '@/components/compliance/NLPRAGSimplifierPanel';
import { MahaVaultExplorer } from '@/components/documents/MahaVaultExplorer';

type TabView = 'CALENDAR' | 'MAHAVAULT' | 'ACTS' | 'SCHEMES' | 'NLP_RAG';

export default function ComplianceCalendarPage() {
  const router = useRouter();
  const { currentProfile } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabView>('CALENDAR');
  const [selectedActId, setSelectedActId] = useState<string | null>(null);

  const [returnsList, setReturnsList] = useState<StatutoryReturnRecord[]>([
    {
      id: 'ret_1',
      code: 'FORM_V',
      title: 'Annual Environmental Statement (Form V)',
      department: 'Maharashtra Pollution Control Board (MPCB)',
      governingAct: 'Environment (Protection) Rules 1986, Rule 14',
      frequency: 'ANNUAL',
      statutoryDueDate: '30 September',
      daysRemaining: 5,
      status: 'PENDING_FILING',
    },
    {
      id: 'ret_2',
      code: 'FORM_4',
      title: 'Hazardous Waste Annual Return (Form 4)',
      department: 'Maharashtra Pollution Control Board (MPCB)',
      governingAct: 'Hazardous and Other Wastes Management Rules 2016',
      frequency: 'ANNUAL',
      statutoryDueDate: '30 June',
      daysRemaining: 278,
      status: 'SUBMITTED',
      lastSubmittedDate: '2026-06-25',
      acknowledgmentHash: 'MPCB-HW-2026-88194-MH',
    },
    {
      id: 'ret_3',
      code: 'FORM_27',
      title: 'Factory Safety & Labour Half-Yearly Return',
      department: 'Directorate of Industrial Safety & Health (DISH)',
      governingAct: 'Maharashtra Factories Rules 1963, Rule 106',
      frequency: 'HALF_YEARLY',
      statutoryDueDate: '15 January',
      daysRemaining: 112,
      status: 'PENDING_FILING',
    },
    {
      id: 'ret_4',
      code: 'FORM_B',
      title: 'Annual Fire System Maintenance Certificate (Form B)',
      department: 'Maharashtra Fire Services',
      governingAct: 'Maharashtra Fire Prevention & Life Safety Act 2006, Sec 3(3)',
      frequency: 'ANNUAL',
      statutoryDueDate: '31 March',
      daysRemaining: 187,
      status: 'SUBMITTED',
      lastSubmittedDate: '2026-03-28',
      acknowledgmentHash: 'MFS-CERT-B-2026-00412',
    },
  ]);

  const handleFileReturn = (returnId: string) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const ackHash = `MH-GOM-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`;
    setReturnsList(prev => prev.map(r => r.id === returnId ? {
      ...r,
      status: 'SUBMITTED',
      lastSubmittedDate: timestamp,
      acknowledgmentHash: ackHash,
    } : r));
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const calendarItems: ComplianceCalendarItem[] = [
    {
      id: 'comp_1',
      approvalId: 'FIRE_NOC',
      approvalName: 'Fire Safety Annual Compliance Certificate',
      department: 'State Fire and Emergency Services',
      renewalDueDate: '2027-04-15',
      daysToExpiry: 202,
      status: 'HEALTHY',
      frequency: 'ANNUAL',
      autoRenewEligible: true,
      lastAuditedDate: '2026-04-15',
    },
    {
      id: 'comp_2',
      approvalId: 'CTO_POLLUTION',
      approvalName: 'Air & Water Act Consent to Operate (CTO)',
      department: 'Maharashtra Pollution Control Board (MPCB)',
      renewalDueDate: '2031-03-31',
      daysToExpiry: 1648,
      status: 'HEALTHY',
      frequency: 'FIVE_YEAR',
      autoRenewEligible: true,
      lastAuditedDate: '2026-03-31',
    },
    {
      id: 'comp_3',
      approvalId: 'BOILER_REGISTRATION',
      approvalName: 'Boiler Annual Hydraulic Inspection & Steam Certificate',
      department: 'Directorate of Steam Boilers, Maharashtra',
      renewalDueDate: '2026-11-20',
      daysToExpiry: 56,
      status: 'UPCOMING_RENEWAL',
      frequency: 'ANNUAL',
      autoRenewEligible: false,
      lastAuditedDate: '2025-11-20',
    },
    {
      id: 'comp_4',
      approvalId: 'FACTORY_LICENSE',
      approvalName: 'Factories Act Annual Employment & Welfare Return',
      department: 'Directorate of Industrial Safety & Health (DISH)',
      renewalDueDate: '2027-01-31',
      daysToExpiry: 128,
      status: 'HEALTHY',
      frequency: 'ANNUAL',
      autoRenewEligible: true,
      lastAuditedDate: '2026-01-31',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          MAITRI 2.0 Statutory Regulatory & Policy Repository
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Landmark className="h-7 w-7 text-blue-400" />
          Statutory Governance & Compliance Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-1">
          Complete regulatory governance architecture for Maharashtra industrial setup under the Maharashtra Right to Services (RTS) Act 2015, governing statutory acts, and eligible state fiscal schemes.
        </p>
      </div>

      {/* Navigation Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('CALENDAR')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'CALENDAR'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          Compliance & Renewal Calendar ({calendarItems.length})
        </button>

        <button
          onClick={() => setActiveTab('ACTS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'ACTS'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Maharashtra Statutory Acts & Rules ({MAHARASHTRA_STATUTORY_ACTS.length})
        </button>

        <button
          onClick={() => setActiveTab('MAHAVAULT')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'MAHAVAULT'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'bg-slate-900/80 text-purple-300 hover:text-white border border-purple-500/30'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          MahaVault Document Vault
        </button>

        <button
          onClick={() => setActiveTab('SCHEMES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'SCHEMES'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Gift className="h-3.5 w-3.5" />
          State Industrial Policies & Schemes ({MAHARASHTRA_STATE_SCHEMES.length})
        </button>

        <button
          onClick={() => setActiveTab('NLP_RAG')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'NLP_RAG'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'bg-slate-900/80 text-purple-300 hover:text-white border border-purple-500/30'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-300" />
          🤖 RAG Legal Assistant & NLP Simplifier
        </button>
      </div>

      {/* TAB 1: COMPLIANCE CALENDAR */}
      {activeTab === 'CALENDAR' && (
        <div className="space-y-6">
          {/* Compliance Health Scorecard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Overall Compliance Health
              </span>
              <div className="text-3xl font-black text-white mt-1">
                100% HEALTHY
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Zero active statutory defaults or show-cause notices.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Upcoming Renewal Window
              </span>
              <div className="text-3xl font-black text-amber-300 mt-1">
                56 Days
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Boiler Inspection scheduled for Nov 20, 2026.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                Auto-Renew Feasible
              </span>
              <div className="text-3xl font-black text-white mt-1">
                3 / 4 Clearances
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Enabled by high promoter Trust Score ({currentProfile.trustScore}/100).
              </p>
            </div>
          </div>

          {/* Statutory Annual Returns & Operational Filings */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl space-y-0">
            <div className="border-b border-slate-800 p-4 bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  Statutory Operational Returns & Annual Compliance Filings
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Mandatory periodic returns under Environment (Protection) Act, Factories Act, and Maharashtra Fire Act.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/20">
                  {returnsList.filter(r => r.status === 'SUBMITTED').length} / {returnsList.length} Filed
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-800/80">
              {returnsList.map((ret) => (
                <div key={ret.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {ret.code}
                      </span>
                      <span className="text-xs text-slate-400">
                        {ret.department}
                      </span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">
                        {ret.frequency}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {ret.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Law: {ret.governingAct} • Due Date: <strong className="text-slate-200">{ret.statutoryDueDate}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {ret.status === 'SUBMITTED' ? (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Filed & Acknowledged</span>
                        </span>
                        <div className="font-mono text-[9px] text-slate-400 mt-1">
                          Token: {ret.acknowledgmentHash}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="text-right text-xs">
                          <span className="text-amber-400 font-bold block text-[11px]">Due in {ret.daysRemaining} days</span>
                        </div>
                        <button
                          onClick={() => handleFileReturn(ret.id)}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition-all"
                        >
                          <Send className="h-3 w-3" />
                          <span>1-Click File Return</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Calendar Items List */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
            <div className="border-b border-slate-800 p-4 bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-400" />
                Mandatory Periodic Clearances & Renewal Timetable
              </h3>
              <button
                onClick={() => router.push('/portal/apply?stage=RENEWAL')}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition-all shadow-md shadow-blue-500/20 shrink-0"
              >
                <span>⚡ Fast-Track Renewal via CAF</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/80">
              {calendarItems.map((item) => (
                <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-400">
                        {item.approvalId}
                      </span>
                      <span className="text-xs text-slate-400">
                        {item.department}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">
                      {item.approvalName}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span>Cycle: <strong>{item.frequency}</strong></span>
                      <span>Last Audited: <strong>{item.lastAuditedDate}</strong></span>
                      <span>Next Due: <strong className="text-slate-200">{item.renewalDueDate}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'HEALTHY'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                      <div className="font-mono text-xs text-slate-300 font-semibold mt-1">
                        {item.daysToExpiry} days remaining
                      </div>
                    </div>

                    {item.autoRenewEligible ? (
                      <span className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-xs font-bold text-emerald-300 whitespace-nowrap">
                        ⚡ Auto-Renew Active
                      </span>
                    ) : (
                      <button
                        onClick={() => router.push('/portal/apply?stage=RENEWAL')}
                        className="rounded-xl border border-blue-500/30 bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors whitespace-nowrap"
                      >
                        Schedule Inspection
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MAHARASHTRA STATUTORY ACTS & RULES */}
      {activeTab === 'ACTS' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-slate-950 to-slate-950 p-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="h-5 w-5 text-indigo-400" />
              Maharashtra Statutory Permitting Legal Framework
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              All 9 statutory acts and rules modeled in AnumatiOne. Each permit is governed by an explicit Maharashtra statute with designated appellate officers, statutory SLA timelines, and Section 4(1) deemed clearance protections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MAHARASHTRA_STATUTORY_ACTS.map((act) => (
              <div
                key={act.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <span className="font-mono text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      Enacted {act.enactedYear}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      RTS SLA: {act.rtsSlaDays} Days
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mt-2.5">
                    {act.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {act.department}
                  </p>

                  <div className="mt-3 text-xs space-y-1.5 font-sans">
                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                      <div className="text-[11px] text-slate-300">
                        <strong className="text-slate-400 font-mono">Governing Rules: </strong>
                        {act.governingRules}
                      </div>
                      <div className="text-[11px] text-slate-300">
                        <strong className="text-slate-400 font-mono">Key Sections: </strong>
                        {act.keySections}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {act.statutoryMandate}
                    </p>

                    <div className="pt-2">
                      <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider block mb-1">
                        Mandatory Compliance Rules:
                      </span>
                      <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                        {act.complianceRules.map((rule, idx) => (
                          <li key={idx} className="leading-snug">{rule}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Authority: <strong>{act.issuingAuthority.split('/')[0]}</strong></span>
                  <div className="flex items-center gap-1">
                    {act.appliesToApprovals.slice(0, 3).map((appId) => (
                      <span key={appId} className="font-mono text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                        {appId.split('_')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STATE INDUSTRIAL POLICIES & SCHEMES */}
      {activeTab === 'SCHEMES' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-950 to-slate-950 p-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Gift className="h-5 w-5 text-emerald-400" />
              Maharashtra State Industrial Schemes & Policy Repository
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Official Maharashtra Government Resolutions (GRs) and policy frameworks automatically evaluated and attached to eligible clearances during application filing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MAHARASHTRA_STATE_SCHEMES.map((scheme) => (
              <div
                key={scheme.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 flex flex-col justify-between hover:border-emerald-500/40 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {scheme.code}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {scheme.category}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mt-2.5">
                    {scheme.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {scheme.department}
                  </p>

                  <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-2.5">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                      Benefit Highlight:
                    </span>
                    <p className="text-xs font-bold text-emerald-300 mt-0.5">
                      {scheme.benefitHighlights}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {scheme.description}
                  </p>

                  <div className="mt-3 text-xs space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Eligibility Mandate:
                    </span>
                    <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc list-inside">
                      {scheme.eligibilityConditions.map((cond, idx) => (
                        <li key={idx}>{cond}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                  <span className="truncate max-w-[280px]">GR: {scheme.policyDocument}</span>
                  <span className="text-emerald-400 font-semibold">{scheme.linkedApprovals.length} Linked Permits</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MAHAVAULT SINGLE-SOURCE DOCUMENT EXPLORER */}
      {activeTab === 'MAHAVAULT' && (
        <MahaVaultExplorer />
      )}

      {/* TAB 4: NLP & RAG SIMPLIFIER */}
      {activeTab === 'NLP_RAG' && (
        <NLPRAGSimplifierPanel />
      )}
    </div>
  );
}
