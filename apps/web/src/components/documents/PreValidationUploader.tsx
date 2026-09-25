'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { DocumentType, DocumentValidationResult } from '@approvalos/shared';
import { preValidateDocument } from '@/lib/document-intelligence/pre-validator';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Eye,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function PreValidationUploader() {
  const { addUploadedDocument, uploadedDocuments } = useAppStore();

  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('PAN_CARD');
  const [isValidating, setIsValidating] = useState(false);
  const [currentResult, setCurrentResult] = useState<DocumentValidationResult | null>(null);

  const sampleScenarios = [
    {
      title: 'Valid Corporate PAN Card',
      docType: 'PAN_CARD' as DocumentType,
      fileName: 'Aegis_Mobility_PAN.pdf',
      size: 184000,
      extractedText: 'INCOME TAX DEPARTMENT GOVT OF INDIA PERMANENT ACCOUNT NUMBER AAACG1234M AEGIS LITHIUM MOBILITY PVT LTD 14/08/2021',
    },
    {
      title: 'Blurry Mobile Snapshot (Rejection Test)',
      docType: 'PAN_CARD' as DocumentType,
      fileName: 'blurry_flash_glare_pan.jpg',
      size: 12000,
      extractedText: 'INCOME TAX DEPT BLUR GLARE UNREADABLE 892J',
    },
    {
      title: 'Valid Factory Layout Blueprint',
      docType: 'FACTORY_LAYOUT_PLAN' as DocumentType,
      fileName: 'Chakan_MIDC_PhaseIV_Factory_Blueprint_CA_Signed.pdf',
      size: 1250000,
      extractedText: 'ARCHITECTURAL PLAN COUNCIL OF ARCHITECTURE CA/2018/98412 MIDC DCR COMPLIANT 12M PERIPHERAL ROAD SETBACKS VERIFIED',
    },
    {
      title: 'Expired Non-Encumbrance Deed (Warning Test)',
      docType: 'LAND_SALE_DEED' as DocumentType,
      fileName: 'expired_non_encumbrance_deed.pdf',
      size: 450000,
      extractedText: 'SUB REGISTRAR OFFICE EXPIRED CERTIFICATE DATED 2021 7/12 EXTRACT',
    },
  ];

  const handleRunValidation = (scenario: typeof sampleScenarios[0]) => {
    setIsValidating(true);
    setSelectedDocType(scenario.docType);

    setTimeout(() => {
      const result = preValidateDocument({
        documentType: scenario.docType,
        fileName: scenario.fileName,
        fileSizeBytes: scenario.size,
        mimeType: 'application/pdf',
        mockExtractedText: scenario.extractedText,
      });

      setCurrentResult(result);
      addUploadedDocument(scenario.docType, result);
      setIsValidating(false);

      if (result.status === 'VALID') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Sample Scenario Preset Buttons */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          Simulate Document Upload & Pre-Validation Scenarios
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Experience how ApprovalOS catches errors, extracts statutory metadata, and prevents rejection loops *before* submitting to department officers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sampleScenarios.map((scen, idx) => (
            <button
              key={idx}
              onClick={() => handleRunValidation(scen)}
              disabled={isValidating}
              className="flex flex-col text-left rounded-xl border border-slate-800 bg-slate-950 p-3 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all text-xs group"
            >
              <span className="font-bold text-white group-hover:text-blue-300">
                {scen.title}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-1 truncate">
                {scen.fileName}
              </span>
              <span className="mt-2 text-[10px] font-medium text-blue-400">
                Run Pre-Validation →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Validation Result Dossier */}
      {isValidating && (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
            <span className="text-xs font-medium text-slate-300">
              Running OCR scan, resolution analysis, and anti-glare verification...
            </span>
          </div>
        </div>
      )}

      {currentResult && !isValidating && (
        <div className={`rounded-2xl border p-6 transition-all ${
          currentResult.status === 'VALID'
            ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-slate-950'
            : currentResult.status === 'WARNING'
            ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-slate-950'
            : 'border-rose-500/40 bg-gradient-to-b from-rose-950/20 to-slate-950'
        }`}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                currentResult.status === 'VALID'
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : currentResult.status === 'WARNING'
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                  : 'border-rose-500/40 bg-rose-500/10 text-rose-400'
              }`}>
                {currentResult.status === 'VALID' && <CheckCircle2 className="h-6 w-6" />}
                {currentResult.status === 'WARNING' && <AlertTriangle className="h-6 w-6" />}
                {currentResult.status === 'REJECTED' && <XCircle className="h-6 w-6" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">
                    {currentResult.fileName}
                  </h4>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    currentResult.status === 'VALID'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : currentResult.status === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {currentResult.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Type: {currentResult.documentType.replace(/_/g, ' ')} • Size: {(currentResult.fileSizeBytes / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>

            {/* Quality Score Meter */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Readability Score
                </div>
                <div className="text-2xl font-black text-white">
                  {currentResult.qualityScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Statutory Fields */}
          <div className="mt-5">
            <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              OCR Extracted Metadata (Auto-Populates Application Forms)
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(currentResult.extractedFields).map(([key, val]) => (
                <div key={key} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
                  <span className="text-slate-400 text-[11px] block">{key}</span>
                  <span className="font-mono font-bold text-white mt-0.5 block truncate">
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Issues & Suggestions */}
          {currentResult.issues.length > 0 && (
            <div className="mt-5 space-y-2">
              <h5 className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                Defects Detected (Would Trigger Department Rejection Query)
              </h5>
              {currentResult.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300"
                >
                  <XCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <span className="font-bold">[{issue.code}] </span>
                    {issue.message}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Guidance Suggestions */}
          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/40 p-3.5">
            <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              ApprovalOS Rejection-Prevention Guidance
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentResult.suggestions.map((sug, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
