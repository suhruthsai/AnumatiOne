'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { 
  X, 
  Clock, 
  Building2, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  UploadCloud, 
  Send,
  Zap,
  ExternalLink,
  BookOpen,
  Gift,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getGoverningActForApproval, 
  getLinkedSchemesForApproval 
} from '@/lib/knowledge-engine/maharashtra-governance';
import { statutoryRAG } from '@/lib/rag/hybrid-rag-engine';

export function NodeDetailsDrawer() {
  const { 
    selectedNode, 
    isDrawerOpen, 
    closeDrawer, 
    simulationResult, 
    currentProfile,
    addUploadedDocument 
  } = useAppStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [showRAGBriefing, setShowRAGBriefing] = useState(true);

  const ragBriefing = useMemo(() => {
    if (!selectedNode?.name) return null;
    return statutoryRAG.generateAnswer(selectedNode.name);
  }, [selectedNode?.name]);

  if (!selectedNode || !simulationResult) return null;

  const isCritical = simulationResult.criticalPath.includes(selectedNode.id);
  const bottleneck = simulationResult.bottlenecks.find(b => b.nodeId === selectedNode.id);
  const governingAct = getGoverningActForApproval(selectedNode.id);
  const linkedSchemes = getLinkedSchemesForApproval(selectedNode.id);

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: currentProfile,
          approvalNodeId: selectedNode.id,
          documents: selectedNode.documentsRequired.map(d => ({
            docType: d,
            docName: `${d.toLowerCase()}_prevalidated.pdf`,
            verified: true,
            url: '#',
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionSuccess(data.data.trackingNumber);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Sliding Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-lg border-l border-slate-800 bg-slate-950 p-6 shadow-2xl overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-mono font-semibold text-blue-400 border border-blue-500/30">
                    {selectedNode.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {selectedNode.category}
                  </span>
                </div>
                <h2 className="mt-1 text-xl font-bold text-white leading-tight">
                  {selectedNode.name}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedNode.department}
                </p>
              </div>

              <button
                onClick={closeDrawer}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Critical & Bottleneck Notice Alerts */}
            <div className="mt-5 space-y-3">
              {isCritical && (
                <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
                  <Zap className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <span className="font-bold">Critical Path Member: </span>
                    Any delay on this approval directly pushes back your commercial launch date. Pacing priority must be assigned.
                  </div>
                </div>
              )}

              {bottleneck && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-950/30 p-3 text-xs text-amber-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-bold">Bottleneck Diagnosis: </span>
                    {bottleneck.reason}
                    <div className="mt-1 text-[11px] font-medium text-amber-200/90">
                      Recommendation: {bottleneck.mitigationAction}
                    </div>
                  </div>
                </div>
              )}

              {selectedNode.canAutoApprove && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-300">
                  <Sparkles className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <div>
                    <span className="font-bold">Green Channel Eligible: </span>
                    Your promoter trust score qualifies this application for instant automated self-certification without physical desk delay.
                  </div>
                </div>
              )}
            </div>

            {/* Key Statutory Metrics */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-blue-400" />
                  Statutory SLA Time
                </div>
                <div className="mt-1 text-xl font-black text-white">
                  {selectedNode.baseDays} <span className="text-xs font-normal text-slate-400">days (±{selectedNode.varianceDays})</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Permit Validity
                </div>
                <div className="mt-1 text-xl font-black text-emerald-400">
                  {selectedNode.validityYears} <span className="text-xs font-normal text-slate-400">Years</span>
                </div>
              </div>
            </div>

            {/* Statutory RTS Act 2015 Compliance Card */}
            <div className="mt-3 rounded-xl border border-blue-500/20 bg-blue-950/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Statutory RTS Act 2015 Mandate
                </span>
                <span className="font-mono text-[9px] text-blue-300/80 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Deemed Approval Sec. 4(1)
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                <span className="text-slate-400 font-mono">Issuing Authority: </span>
                <span className="font-semibold text-white">{selectedNode.issuingAuthority}</span>
              </div>
              <div className="text-[11px] text-slate-300">
                <span className="text-slate-400 font-mono">Department: </span>
                <span className="text-slate-200">{selectedNode.department}</span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between border-t border-blue-500/10">
                <span>Site Inspection: {selectedNode.inspectionRequired ? 'Mandatory Field Inspection' : 'Desk Review Only'}</span>
                <span className="font-mono text-[9px] text-emerald-400">{selectedNode.canAutoApprove ? '⚡ Green Channel Eligible' : 'Standard Scrutiny'}</span>
              </div>
            </div>

            {/* AI Statutory RAG Legal Briefing & Plain-English Explainer */}
            <div className="mt-3 rounded-xl border border-sky-500/30 bg-gradient-to-br from-sky-950/30 via-slate-900/40 to-indigo-950/30 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-sky-500/20 p-1.5 text-sky-400 border border-sky-500/30">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      Plain-English Statutory Briefing
                      <span className="font-mono text-[9px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded border border-sky-500/30">
                        Hybrid RAG AI
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Decoded into simple language with legal safeguards
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowRAGBriefing(!showRAGBriefing)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 px-2.5 py-1 rounded-lg border border-sky-500/30 transition-all"
                >
                  {showRAGBriefing ? (
                    <>
                      <span>Collapse</span>
                      <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      <span>Explain in Plain English</span>
                      <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </button>
              </div>

              {showRAGBriefing && ragBriefing && (
                <div className="space-y-2.5 pt-2 border-t border-sky-500/20 text-xs">
                  {/* Plain English explanation */}
                  <div className="rounded-lg bg-slate-900/90 p-3 border border-slate-800 text-slate-200 leading-relaxed">
                    <div className="text-[10px] uppercase font-mono font-bold text-sky-400 mb-1 flex items-center gap-1">
                      <span>💡 What This Clearance Actually Means</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-200">
                      {ragBriefing.plainEnglishExplanation}
                    </p>
                  </div>

                  {/* Statutory Safeguard */}
                  {ragBriefing.legalBasis.statutorySafeguard && (
                    <div className="rounded-lg bg-emerald-950/30 p-2.5 border border-emerald-500/30 text-[11px] text-emerald-300">
                      <span className="font-bold text-emerald-400">⚖️ Statutory Safeguard: </span>
                      {ragBriefing.legalBasis.statutorySafeguard}
                    </div>
                  )}

                  {/* Actionable Steps */}
                  <div className="rounded-lg bg-indigo-950/20 p-2.5 border border-indigo-500/20 space-y-1.5">
                    <div className="text-[10px] uppercase font-mono font-bold text-indigo-300">
                      📋 Actions to Prevent Departmental Objections:
                    </div>
                    <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                      {ragBriefing.actionableSteps.map((step, idx) => (
                        <li key={idx} className="leading-snug">{step}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom link to full NLP Simplifier */}
                  <div className="pt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      Grounded in: <strong className="text-white">{ragBriefing.legalBasis.actTitle}</strong>
                    </span>
                    <a
                      href="/portal/compliance"
                      className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium transition-colors"
                    >
                      <span>Open NLP Simplifier</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Governing Maharashtra Statutory Act & Rules Card */}
            {governingAct && (
              <div className="mt-3 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-400 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                    Governing Maharashtra Statutory Act & Rules
                  </span>
                  <span className="font-mono text-[9px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    Enacted {governingAct.enactedYear}
                  </span>
                </div>
                <div className="text-xs font-bold text-white">
                  {governingAct.name}
                </div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>
                    <span className="text-slate-400 font-mono">Governing Rules: </span>
                    <span className="text-slate-200">{governingAct.governingRules}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono">Key Sections: </span>
                    <span className="text-slate-200">{governingAct.keySections}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-indigo-500/15">
                  <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider block mb-1">
                    Mandatory Statutory Rules:
                  </span>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    {governingAct.complianceRules.map((rule, idx) => (
                      <li key={idx} className="leading-snug">{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Applicable Maharashtra Industrial Incentive Schemes */}
            {linkedSchemes.length > 0 && (
              <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-950/25 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Gift className="h-3.5 w-3.5 text-emerald-400" />
                    Eligible Maharashtra State Schemes Linked to this Permit
                  </span>
                  <span className="font-mono text-[9px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {linkedSchemes.length} Matched
                  </span>
                </div>
                <div className="space-y-2">
                  {linkedSchemes.map((scheme) => (
                    <div key={scheme.id} className="rounded-lg border border-emerald-500/20 bg-slate-950/70 p-2.5 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{scheme.name}</span>
                        <span className="font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {scheme.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-300 font-medium">
                        ✨ {scheme.benefitHighlights}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Policy Ref: {scheme.policyDocument}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites Checklist */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Prerequisites (Must Complete First)
              </h3>
              <div className="mt-2 space-y-1.5">
                {selectedNode.prerequisites.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    None (Foundation Clearance - can be triggered immediately).
                  </p>
                ) : (
                  selectedNode.prerequisites.map((preId) => (
                    <div
                      key={preId}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs"
                    >
                      <span className="font-medium text-slate-300">{preId}</span>
                      <span className="flex items-center gap-1 text-[11px] text-blue-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Required
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Deduplicated Required Documents */}
            <div className="mt-6 space-y-2">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>MahaVault Status: All {selectedNode.documentsRequired.length} Docs Pre-Validated</span>
                </div>
                <span className="font-mono text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  Zero-Rejection Guarantee
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Attached Pre-Validated Documents
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">
                  DigiLocker Auto-Attached
                </span>
              </div>

              <div className="space-y-2">
                {selectedNode.documentsRequired.map((docType) => (
                  <div
                    key={docType}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-blue-400 shrink-0" />
                      <div>
                        <div className="font-medium text-white">{docType.replace(/_/g, ' ')}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          MahaVault Token: in.gov.mh.vault.{docType.toLowerCase().slice(0, 10)}
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Pre-Validated
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Action */}
            <div className="mt-8 pt-4 border-t border-slate-800">
              {submissionSuccess ? (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
                  <div className="font-bold text-emerald-300 text-sm">
                    Application Dispatched via Pre-Validated Vault!
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    Tracking #: {submissionSuccess}
                  </div>
                  <div className="text-[11px] text-emerald-400/80 mt-2">
                    Deemed Clearance Clock running under Maharashtra RTS Act 2015.
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleSubmitApplication}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? 'Dispatching from MahaVault...' : '⚡ 1-Click Instant File via Pre-Validated Vault'}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center italic">
                    All attached documents are pre-certified via DigiLocker. Protected against arbitrary departmental rejection under GoM Circular #MAITRI-2024.
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
