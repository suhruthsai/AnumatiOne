'use client';

import React, { useState } from 'react';
import { ApplicationRecord } from '@approvalos/shared';
import { 
  X, 
  Sparkles, 
  Send, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { nlpSimplifier } from '@/lib/rag/nlp-simplifier';

interface QueryResponseModalProps {
  application: ApplicationRecord;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function QueryResponseModal({
  application,
  isOpen,
  onClose,
  onSuccess,
}: QueryResponseModalProps) {
  const [responseText, setResponseText] = useState('');
  const [attachedDocName, setAttachedDocName] = useState('Revised_Compliance_Annexure.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAIDraft, setIsGeneratingAIDraft] = useState(false);

  if (!isOpen) return null;

  const latestQuery = (application.queries && application.queries.length > 0)
    ? application.queries[0]
    : {
        objectionText: application.queryNotes?.[0] || 'Clarification requested by scrutiny officer.',
        department: application.department,
        officerName: application.assignedOfficerName,
        statutoryRuleRef: 'Applicable Departmental Guidelines',
      };

  const handleGenerateAIDraft = () => {
    setIsGeneratingAIDraft(true);
    try {
      const simplification = nlpSimplifier.simplifyDepartmentQuery(latestQuery.objectionText);
      setResponseText(simplification.suggestedOfficialResponseLetter);
    } catch (e) {
      console.error(e);
      setResponseText(`In reference to the clarification query raised regarding ${application.approvalName}, we submit that our unit strictly adheres to all statutory norms. The revised technical drawings and undertakings are attached herewith for your kind perusal.`);
    } finally {
      setIsGeneratingAIDraft(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      alert('Please enter your clarification response.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: application.id,
          action: 'RESPOND_QUERY',
          response: responseText,
          attachedDocName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        alert(data.error || 'Failed to submit response');
      }
    } catch (e: any) {
      alert(`Error submitting response: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl border border-amber-500/40 bg-slate-950 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20 mb-1">
              <AlertTriangle className="h-3 w-3" />
              Department Scrutiny Query Received (SLA Clock Paused)
            </div>
            <h2 className="text-lg font-bold text-white">
              Respond to {application.department.split('/')[0]}
            </h2>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Tracking #: {application.trackingNumber}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Officer's Objection Card */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-300">Official Scrutiny Objection:</span>
            <span className="text-[10px] font-mono text-amber-400/80">
              Officer: {latestQuery.officerName || application.assignedOfficerName}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-amber-100/90 font-medium">
            "{latestQuery.objectionText}"
          </p>
          {latestQuery.statutoryRuleRef && (
            <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-amber-500/20">
              Rule Reference: {latestQuery.statutoryRuleRef}
            </div>
          )}
        </div>

        {/* AI Draft Response Generator Banner */}
        <div className="flex items-center justify-between rounded-xl border border-blue-500/30 bg-blue-950/20 p-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-slate-200">
              Need help drafting a formal response citing Maharashtra statutes?
            </span>
          </div>
          <button
            type="button"
            onClick={handleGenerateAIDraft}
            disabled={isGeneratingAIDraft}
            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all"
          >
            {isGeneratingAIDraft ? 'Drafting...' : '🤖 AI Auto-Draft'}
          </button>
        </div>

        {/* Response Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Applicant Clarification & Undertaking *
          </label>
          <textarea
            rows={5}
            value={responseText}
            onChange={e => setResponseText(e.target.value)}
            placeholder="Type your official explanation or paste the AI draft response here..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
          />
        </div>

        {/* Attached Revised Document */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Attach Revised Technical Document / Endorsement
          </label>
          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <FileText className="h-4 w-4 text-blue-400" />
              <input
                type="text"
                value={attachedDocName}
                onChange={e => setAttachedDocName(e.target.value)}
                className="bg-transparent border-b border-slate-600 text-xs text-white focus:outline-none focus:border-blue-400"
              />
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">DigiLocker Attached</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmitResponse}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Submitting Clarification...' : 'Submit Response & Resume SLA Clock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
