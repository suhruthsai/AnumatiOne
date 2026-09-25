'use client';

import React from 'react';
import { ApplicationRecord } from '@approvalos/shared';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Printer, 
  QrCode, 
  Building2, 
  Lock,
  Sparkles
} from 'lucide-react';

interface DigitalPermitModalProps {
  application: ApplicationRecord;
  isOpen: boolean;
  onClose: () => void;
}

export function DigitalPermitModal({
  application,
  isOpen,
  onClose,
}: DigitalPermitModalProps) {
  if (!isOpen) return null;

  const cert = application.certificate || {
    certificateNumber: `MH/2026/${application.trackingNumber.slice(-6)}`,
    issuedAt: application.submissionDate,
    issuingAuthority: application.department,
    department: application.department,
    validUntil: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    qrHash: `in.gov.mh.verify.${application.trackingNumber.toLowerCase()}`,
    digitalSignatureHash: 'SHA256:4a8f9c1e7d3b2a5f6e8c0d1b3a5f7e9c2d4b6a8f1e3c5d7b9a2f4e6c8d0b1a3',
    isDeemedApproval: application.status === 'DEEMED_APPROVED',
    statutoryAct: 'Maharashtra Right to Services Act 2015',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl border border-emerald-500/40 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Certificate Container Styled like Official Stamp */}
        <div className="border-4 border-double border-emerald-500/40 rounded-2xl bg-gradient-to-b from-emerald-950/20 via-slate-950 to-emerald-950/20 p-6 sm:p-8 text-center space-y-5">
          {/* Header & Seal */}
          <div className="space-y-1.5 border-b border-emerald-500/20 pb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-1">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="text-xs uppercase tracking-widest font-mono font-bold text-slate-300">
              Government of Maharashtra
            </div>
            <div className="text-sm font-bold text-emerald-400">
              {application.department}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              Official Statutory Clearance Certificate
            </h1>
            {cert.isDeemedApproval && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-mono font-bold text-blue-300 border border-blue-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                Section 4(1) Statutory Deemed Approval Granted
              </div>
            )}
          </div>

          {/* Body Details */}
          <div className="text-left text-xs space-y-3 bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block font-mono text-[10px]">Certificate Number:</span>
                <span className="font-mono font-bold text-emerald-400 text-xs">{cert.certificateNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-mono text-[10px]">Date of Issue:</span>
                <span className="font-semibold text-white text-xs">{new Date(cert.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-2">
              <span className="text-slate-400 block font-mono text-[10px]">Granted To:</span>
              <span className="font-bold text-white text-sm">{application.companyName}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-mono text-[10px]">Statutory Clearance Type:</span>
              <span className="font-semibold text-slate-200">{application.approvalName}</span>
            </div>

            {application.cafSummary && (
              <div className="border-t border-slate-800 pt-2 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Location:</span>
                  <span className="text-slate-200">{application.cafSummary.midcCluster}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Plot Reference:</span>
                  <span className="text-slate-200">{application.cafSummary.plotNumber}</span>
                </div>
              </div>
            )}

            <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Statutory Validity:</span>
                <span className="font-bold text-emerald-300">
                  Valid Until {new Date(cert.validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Governing Law:</span>
                <span className="text-slate-300 font-mono text-[10px]">{cert.statutoryAct}</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Verification Box */}
          <div className="flex items-center justify-between rounded-xl bg-slate-900/90 p-3.5 border border-slate-800 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Digitally Signed & Authenticated</span>
              </div>
              <div className="font-mono text-[9px] text-slate-400 truncate max-w-xs">
                Hash: {cert.digitalSignatureHash}
              </div>
              <div className="font-mono text-[9px] text-blue-400">
                MahaVault Token: {cert.qrHash}
              </div>
              <div className="text-[9px] text-slate-400 pt-0.5">
                Verifiable on MAITRI: <a href="https://maitri.maharashtra.gov.in/services/verify-a-permission/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">maitri.maharashtra.gov.in/services/verify-a-permission</a>
              </div>
            </div>

            <div className="h-16 w-16 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
              <QrCode className="h-14 w-14 text-slate-900" />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
