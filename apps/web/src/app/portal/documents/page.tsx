'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MahaVaultExplorer } from '@/components/documents/MahaVaultExplorer';
import { 
  FolderCheck, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function DocumentsPage() {
  const router = useRouter();
  const { isAuthenticated, logout, currentIndustrialist, currentProfile, uploadedDocuments } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  const totalDocs = Object.keys(uploadedDocuments).length;
  const verifiedDocs = Object.values(uploadedDocuments).filter(d => d.status === 'VALID').length;
  const isFastSlaReady = verifiedDocs >= 4;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900/90 to-purple-950/30 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/30">
                <FolderCheck className="h-3.5 w-3.5" />
                MahaVault Enterprise Repository
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                DigiLocker & RTS Sec 3(2) Encrypted
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              MahaVault™ Statutory Document Locker
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Tamper-evident, zero-query document vault compliant with Maharashtra RTS Act 2015. Uploaded documents undergo automated OCR, DPI, and statutory rule validation before submission to eliminate 78% of departmental requisitions.
            </p>
          </div>

          {/* Document Metrics & Fast SLA Readiness */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Pre-Validated Documents
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-2xl font-black text-emerald-400 font-mono">{verifiedDocs}</span>
                <span className="text-xs text-slate-500 font-mono">/ {totalDocs}</span>
              </div>
              <span className="text-[10px] text-emerald-400/80 font-medium mt-0.5 block flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Ready for Green Channel
              </span>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  <Zap className="h-3 w-3" />
                  Fast SLA Eligibility
                </div>
                <div className="text-xs font-semibold text-white mt-1">
                  {isFastSlaReady ? '100% Eligible (48-Hr Approval)' : 'Upload Remaining Docs'}
                </div>
              </div>
              <Link
                href="/portal/applications"
                className="mt-2 inline-flex items-center justify-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 text-xs font-bold transition-colors"
              >
                Claim Fast SLA
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="flex sm:flex-col justify-center">
              <button
                onClick={() => {
                  logout();
                  router.push('/auth/login');
                }}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-red-500/70 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-4 py-3.5 text-xs font-black text-white shadow-lg shadow-red-950/50 hover:from-red-500 hover:to-rose-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Sign out of current session"
              >
                <LogOut className="h-4 w-4 text-white" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main MahaVault Explorer */}
      <MahaVaultExplorer />

      {/* Regulatory Context & Cross Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Link
          href="/portal/applications"
          className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 hover:border-blue-500/40 hover:bg-slate-900/80 transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-blue-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              Clearance Applications
            </span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-400">
            Track status of submitted statutory clearances with live RTS countdown timers.
          </p>
        </Link>

        <Link
          href="/portal/profile"
          className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Schemes & Rules
            </span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-400">
            Check your project subsidies under PSI 2019, EV Policy 2025, and all 9 statutory Acts.
          </p>
        </Link>

        <Link
          href="/portal/chat"
          className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 hover:border-purple-500/40 hover:bg-slate-900/80 transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-purple-400 mb-1">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              Access to Chatbot
            </span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-400">
            Ask any question regarding document formats, RTS deemed approvals, or MPCB checklists.
          </p>
        </Link>
      </div>
    </div>
  );
}
