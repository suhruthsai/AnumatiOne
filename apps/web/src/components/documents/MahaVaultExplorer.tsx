'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { DocumentType, DocumentValidationResult } from '@approvalos/shared';
import { PreValidationUploader } from './PreValidationUploader';
import { DocumentImageModal } from './DocumentImageModal';
import { OcrScannerModal } from './OcrScannerModal';
import { 
  ShieldCheck, 
  FileCheck2, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Search, 
  ExternalLink, 
  RefreshCw, 
  QrCode, 
  X, 
  Check, 
  Clock, 
  FileText,
  Lock,
  Download,
  Scan,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

type CategoryFilter = 'ALL' | 'KYC' | 'LAND' | 'ENVIRONMENT' | 'SAFETY';

interface DocumentMeta {
  type: DocumentType;
  title: string;
  category: CategoryFilter;
  authority: string;
  badge: string;
}

const DOCUMENT_CATEGORIES: Record<DocumentType, DocumentMeta> = {
  PAN_CARD: {
    type: 'PAN_CARD',
    title: 'Corporate Permanent Account Number (PAN)',
    category: 'KYC',
    authority: 'Income Tax Department (ITD) / NSDL',
    badge: 'Statutory Identity',
  },
  AADHAAR_CARD: {
    type: 'AADHAAR_CARD',
    title: 'Authorized Signatory UIDAI e-KYC Identity',
    category: 'KYC',
    authority: 'Unique Identification Authority of India (UIDAI)',
    badge: 'Legal Signatory',
  },
  GSTIN_CERTIFICATE: {
    type: 'GSTIN_CERTIFICATE',
    title: 'Maharashtra GST Registration Certificate (REG-06)',
    category: 'KYC',
    authority: 'State Tax Department, Maharashtra',
    badge: 'Fiscal Compliance',
  },
  LAND_SALE_DEED: {
    type: 'LAND_SALE_DEED',
    title: 'MIDC 95-Yr Registered Lease Deed & 7/12 Extract',
    category: 'LAND',
    authority: 'MIDC & Mahabhulekh (Land Records GoM)',
    badge: 'Deemed NA Zoning',
  },
  FACTORY_LAYOUT_PLAN: {
    type: 'FACTORY_LAYOUT_PLAN',
    title: 'Architect Certified Factory Layout Blueprint (1:100)',
    category: 'LAND',
    authority: 'Council of Architecture & MIDC SPA',
    badge: 'Structural Vetted',
  },
  PROJECT_FEASIBILITY_REPORT: {
    type: 'PROJECT_FEASIBILITY_REPORT',
    title: 'Detailed Project Report (DPR) & Financial Closure',
    category: 'ENVIRONMENT',
    authority: 'Chartered Engineer & Lead Appraisal Bank',
    badge: 'PSI 2019 Eligible',
  },
  POLLUTION_UNDERTAKING: {
    type: 'POLLUTION_UNDERTAKING',
    title: 'MPCB Zero Liquid Discharge (ZLD) Undertaking',
    category: 'ENVIRONMENT',
    authority: 'Maharashtra Pollution Control Board (MPCB)',
    badge: 'Zero-Discharge',
  },
  WATER_BALANCE_CHART: {
    type: 'WATER_BALANCE_CHART',
    title: 'Industrial Water Flow & Mass Balance Diagram',
    category: 'ENVIRONMENT',
    authority: 'MIDC Water Works & MPCB Engineering Wing',
    badge: 'Water Allocation',
  },
  POWER_LOAD_CALCULATION: {
    type: 'POWER_LOAD_CALCULATION',
    title: 'MSEDCL HT Load Demand & Feeder Sanction Calculation',
    category: 'ENVIRONMENT',
    authority: 'MSEDCL (Mahavitaran) Technical Wing',
    badge: '22kV Feeder Sanction',
  },
  FIRE_SAFETY_SCHEMATIC: {
    type: 'FIRE_SAFETY_SCHEMATIC',
    title: 'Maharashtra Fire Services Hydrant & Sprinkler Plan',
    category: 'SAFETY',
    authority: 'Maharashtra Fire Services / MIDC Fire Brigade',
    badge: 'NBC 2016 Compliant',
  },
};

export function MahaVaultExplorer() {
  const { uploadedDocuments, currentProfile, addUploadedDocument } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('ALL');
  const [activeModalDoc, setActiveModalDoc] = useState<DocumentValidationResult | null>(null);
  const [activeImageDoc, setActiveImageDoc] = useState<DocumentValidationResult | null>(null);
  const [isOcrScannerOpen, setIsOcrScannerOpen] = useState(false);
  const [verifyingDocType, setVerifyingDocType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifySuccessToast, setVerifySuccessToast] = useState<string | null>(null);

  const docList = Object.values(uploadedDocuments);
  const validCount = docList.filter((d) => d.status === 'VALID').length;
  const avgScore = docList.length > 0 
    ? Math.round(docList.reduce((acc, d) => acc + d.qualityScore, 0) / docList.length)
    : 96;

  const filteredDocs = docList.filter((doc) => {
    const meta = DOCUMENT_CATEGORIES[doc.documentType];
    if (!meta) return true;
    if (selectedCategory !== 'ALL' && meta.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        meta.title.toLowerCase().includes(q) ||
        meta.authority.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSimulateRegistryVerification = (docType: DocumentType) => {
    setVerifyingDocType(docType);
    setTimeout(() => {
      setVerifyingDocType(null);
      setVerifySuccessToast(`Live Registry Ping Successful: ${DOCUMENT_CATEGORIES[docType]?.authority || docType} verified.`);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });
      setTimeout(() => setVerifySuccessToast(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {verifySuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950 p-4 text-xs font-semibold text-emerald-200 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{verifySuccessToast}</span>
        </div>
      )}

      {/* Flagship MahaVault Header & Security Summary */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-950 p-6 shadow-2xl">
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
              <Lock className="h-3.5 w-3.5" />
              MahaVault v3.2 • Unified Enterprise DigiLocker Single Source of Truth
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Pre-Validated Regulatory Data Vault</span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30">
                100% Pre-Validated
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Under the <strong>Maharashtra Right to Services Act 2015</strong> and MAITRI Deemed Approval Protocol, documents stored and validated in MahaVault are <strong>permanently cross-accepted</strong> across MIDC, MPCB, MSEDCL, Fire, and DISH without re-upload or duplicate scrutiny queries.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
              <span className="text-[10px] text-slate-400 block font-mono">Dossier Readiness</span>
              <span className="text-xl font-black text-emerald-400 mt-0.5 block">
                {validCount}/{docList.length}
              </span>
              <span className="text-[9px] text-emerald-400/90 font-medium">All Certified</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
              <span className="text-[10px] text-slate-400 block font-mono">Avg Quality</span>
              <span className="text-xl font-black text-blue-400 mt-0.5 block">
                {avgScore}%
              </span>
              <span className="text-[9px] text-slate-400 font-medium">300 DPI Clear</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
              <span className="text-[10px] text-slate-400 block font-mono">Rejection Risk</span>
              <span className="text-xl font-black text-emerald-400 mt-0.5 block">
                0.0%
              </span>
              <span className="text-[9px] text-emerald-400/90 font-medium">RTS Protected</span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: `All (${docList.length})` },
              { id: 'KYC', label: 'Corporate KYC (3)' },
              { id: 'LAND', label: 'Land & Civil (2)' },
              { id: 'ENVIRONMENT', label: 'Environmental & Utilities (3)' },
              { id: 'SAFETY', label: 'Safety & Fire (2)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as CategoryFilter)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box & Scan Button */}
          <div className="flex items-center gap-2.5">
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search document, authority, gat no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setIsOcrScannerOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
            >
              <Scan className="h-3.5 w-3.5" />
              <span>Scan Image (OCR)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => {
          const meta = DOCUMENT_CATEGORIES[doc.documentType] || {
            type: doc.documentType,
            title: doc.documentType.replace(/_/g, ' '),
            category: 'KYC',
            authority: 'Government of Maharashtra Registry',
            badge: 'Pre-Validated',
          };

          const isVerifying = verifyingDocType === doc.documentType;

          return (
            <div
              key={doc.documentType}
              className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-blue-500/40 hover:bg-slate-900/80 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Header: Status and Authority */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="space-y-1">
                    <span className="inline-block rounded-full bg-blue-500/10 px-2 py-0.5 text-[9px] font-mono font-bold text-blue-300 border border-blue-500/20">
                      {meta.badge}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                      {meta.title}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {meta.authority}
                    </p>
                  </div>

                  <span className="shrink-0 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    PRE-VALIDATED
                  </span>
                </div>

                {/* Extracted Details Pill Grid */}
                <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-2.5">
                    <span className="text-[10px] text-slate-400 block font-mono">DigiLocker Identifier</span>
                    <span className="font-mono text-[11px] font-semibold text-slate-200 truncate block mt-0.5">
                      {doc.extractedFields?.digiLockerDocUri || doc.fileName}
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-2.5">
                    <span className="text-[10px] text-slate-400 block font-mono">Quality Assurance</span>
                    <span className="text-[11px] font-bold text-emerald-400 block mt-0.5">
                      {doc.qualityScore}% (300 DPI • Verified)
                    </span>
                  </div>
                </div>

                {/* Key Extracted Metadata Summary */}
                <div className="mt-3 rounded-xl border border-slate-800/50 bg-slate-950/50 p-2.5 text-[11px] text-slate-300 space-y-1 font-mono">
                  {Object.entries(doc.extractedFields || {})
                    .filter(([k]) => !['digiLockerDocUri', 'statutoryStatus', 'ocrLanguagesDetected'].includes(k))
                    .slice(0, 3)
                    .map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between gap-2">
                        <span className="text-slate-400 capitalize truncate">
                          {k.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="font-semibold text-slate-200 truncate max-w-[170px]">
                          {String(v)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveImageDoc(doc)}
                    className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-950/40 px-2.5 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-900/60 hover:text-white transition-all shadow-sm"
                  >
                    <ImageIcon className="h-3.5 w-3.5 text-purple-400" />
                    <span>View Image</span>
                  </button>

                  <button
                    onClick={() => setActiveModalDoc(doc)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <FileText className="h-3.5 w-3.5 text-blue-400" />
                    <span>Inspect</span>
                  </button>
                </div>

                <button
                  onClick={() => handleSimulateRegistryVerification(doc.documentType)}
                  disabled={isVerifying}
                  className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition-colors"
                >
                  <RefreshCw className={`h-3.5 w-3.5 text-blue-400 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{isVerifying ? 'Pinging...' : 'Registry Ping'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Scanner & Preset Uploader */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <PreValidationUploader />
      </div>

      {/* Document Dossier Inspection Modal */}
      {activeModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                    DIGILOCKER VERIFIED
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {activeModalDoc.documentType}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {DOCUMENT_CATEGORIES[activeModalDoc.documentType]?.title || activeModalDoc.documentType}
                </h3>
                <p className="text-xs text-slate-400">
                  {DOCUMENT_CATEGORIES[activeModalDoc.documentType]?.authority}
                </p>
              </div>

              <button
                onClick={() => setActiveModalDoc(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cryptographic Trust Stamp */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  Statutory Non-Repudiation Certificate
                </span>
                <span className="font-mono text-[10px]">MAITRI-SEAL-2024</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                This document was ingested through the MahaVault Gateway with SHA-256 integrity hash. It carries deemed statutory clearance under Section 4(1) of the Maharashtra Right to Services Act 2015.
              </p>
              <div className="font-mono text-[10px] text-slate-400 break-all bg-slate-950/60 p-2 rounded border border-slate-800">
                SHA-256 Fingerprint: 8a4c1f9b7829d10e5b72183cfa61284092b7e1248081f9a1286c8b93f18e9a21
              </div>
            </div>

            {/* Extracted Statutory Metadata */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Extracted Statutory Attributes
              </h4>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 divide-y divide-slate-800/80 text-xs font-mono">
                {Object.entries(activeModalDoc.extractedFields || {}).map(([key, value]) => (
                  <div key={key} className="py-2 flex items-center justify-between gap-4">
                    <span className="text-slate-400">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="font-semibold text-slate-200 text-right truncate max-w-sm">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-Department Acceptance Status */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Departmental Pre-Acceptance Matrix
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                {['MPCB Environment', 'MIDC Planning', 'MSEDCL Power', 'DISH Factories'].map((dept) => (
                  <div key={dept} className="rounded-lg border border-slate-800 bg-slate-950 p-2">
                    <span className="text-[10px] text-slate-400 block truncate">{dept}</span>
                    <span className="text-emerald-400 font-bold text-xs mt-0.5 flex items-center justify-center gap-1">
                      <Check className="h-3 w-3" /> Deemed OK
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setActiveModalDoc(null)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Image / OCR Inspector Modal */}
      {activeImageDoc && (
        <DocumentImageModal
          doc={activeImageDoc}
          onClose={() => setActiveImageDoc(null)}
        />
      )}

      {/* Real-time OCR Scanner Modal */}
      {isOcrScannerOpen && (
        <OcrScannerModal
          onClose={() => setIsOcrScannerOpen(false)}
        />
      )}
    </div>
  );
}
