'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ApplicationRecord } from '@approvalos/shared';
import { MahaVaultExplorer } from '@/components/documents/MahaVaultExplorer';
import { RealtimeSlaCountdown } from '@/components/realtime/RealtimeSlaCountdown';
import { QueryResponseModal } from '@/components/applications/QueryResponseModal';
import { DigitalPermitModal } from '@/components/applications/DigitalPermitModal';
import { 
  FolderCheck, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  CalendarCheck,
  Send,
  Lock,
  PlusCircle,
  ExternalLink,
  MessageSquare,
  Printer,
  Scale,
  Award,
  Calendar,
  Coins,
  QrCode,
  Download,
  Building2,
  Search,
  ArrowRight,
  Zap,
  BookOpen,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ApplicationsPage() {
  const router = useRouter();
  const { isAuthenticated, logout, currentIndustrialist, currentProfile } = useAppStore();
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);
  const [activeTab, setActiveTab] = useState<'APPLICATIONS' | 'APPROVALS' | 'RENEWALS' | 'INCENTIVES' | 'VAULT'>('APPLICATIONS');
  const [selectedQueryApp, setSelectedQueryApp] = useState<ApplicationRecord | null>(null);
  const [selectedPermitApp, setSelectedPermitApp] = useState<ApplicationRecord | null>(null);
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [isFastSlaActive, setIsFastSlaActive] = useState(false);
  const [isFastSlaApplying, setIsFastSlaApplying] = useState(false);

  // Fast SLA Express Approval Handler
  const handleApplyFastSla = async () => {
    setIsFastSlaApplying(true);
    try {
      const res = await fetch('/api/v1/applications/fast-sla', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: currentIndustrialist?.companyName || currentProfile.companyName,
          profileId: currentProfile.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsFastSlaActive(true);
        setApplications(data.data);
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#10B981', '#38BDF8', '#F59E0B', '#C33764']
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFastSlaApplying(false);
    }
  };

  // Statutory Returns Filing State
  const [filedReturns, setFiledReturns] = useState<Record<string, string>>({
    'MPCB-V': 'MH-MPCB-V-2026-X892',
  });

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/v1/applications');
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFileReturn = (returnKey: string) => {
    const token = `MH-GOM-${returnKey}-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setFiledReturns((prev) => ({ ...prev, [returnKey]: token }));
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const filtered = applications.filter((app) => {
    if (filterDepartment === 'ALL') return true;
    return app.department.toLowerCase().includes(filterDepartment.toLowerCase());
  });

  const approvedApps = applications.filter(
    (a) => a.status === 'APPROVED' || a.status === 'GREEN_CHANNEL_APPROVED' || a.status === 'DEEMED_APPROVED'
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Enterprise Identity Banner */}
      <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-purple-950/30 p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/30">
              <Building2 className="h-3 w-3" />
              Verified Enterprise Profile
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-3 w-3" />
              MahaVault KYC Locked
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            {currentIndustrialist?.companyName || currentProfile.companyName || 'Aegis Lithium Mobility Pvt Ltd'}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 font-mono">
            <span>GSTIN: <strong className="text-white">{currentIndustrialist?.gstin || '27AABCS8819Q1ZP'}</strong></span>
            <span>PAN: <strong className="text-white">{currentIndustrialist?.pan || 'AABCS8819Q'}</strong></span>
            <span>Udyam: <strong className="text-white">{currentIndustrialist?.udyamNumber || 'UDYAM-MH-26-008219'}</strong></span>
            <span>Zone: <strong className="text-emerald-400">{currentProfile.talukaCategory || 'Zone B (Developing)'}</strong></span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/portal/kya"
            className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-bold text-blue-300 hover:bg-blue-500/20 transition-all"
          >
            <Search className="h-3.5 w-3.5" />
            <span>KYA Checklist</span>
          </Link>

          <Link
            href="/portal/apply"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:brightness-110 active:scale-[0.99] transition-all"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Submit New CAF</span>
          </Link>

          <Link
            href="/portal/grievances"
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/20 px-3.5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-900/30 transition-all"
          >
            <Scale className="h-3.5 w-3.5" />
            <span>RTS Escalation</span>
          </Link>

          <button
            onClick={() => {
              logout();
              router.push('/auth/login');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/70 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-4 py-2 text-xs font-black text-white shadow-lg shadow-red-950/50 hover:from-red-500 hover:to-rose-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Sign out of AnumatiOne session"
          >
            <LogOut className="h-3.5 w-3.5 text-white" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* FAST SLA & SCHEMES INTELLIGENCE BANNER */}
      <div className={`rounded-3xl border p-5 sm:p-6 backdrop-blur-xl shadow-2xl transition-all ${
        isFastSlaActive || applications.every(a => a.status === 'APPROVED' || a.status === 'GREEN_CHANNEL_APPROVED' || a.status === 'DEEMED_APPROVED')
          ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/30'
          : 'border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-purple-950/30'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                isFastSlaActive || applications.every(a => a.status === 'APPROVED' || a.status === 'GREEN_CHANNEL_APPROVED' || a.status === 'DEEMED_APPROVED')
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                <Zap className="h-3 w-3" />
                {isFastSlaActive || applications.every(a => a.status === 'APPROVED' || a.status === 'GREEN_CHANNEL_APPROVED' || a.status === 'DEEMED_APPROVED')
                  ? '⚡ FAST SLA ACTIVE: Approvals Sanctioned Under RTS Sec 4(1)'
                  : '⚡ Express Fast SLA & Green Channel Option'}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/30">
                <BookOpen className="h-3 w-3" />
                Maharashtra Schemes & RTS Rules
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white">
              {isFastSlaActive || applications.every(a => a.status === 'APPROVED' || a.status === 'GREEN_CHANNEL_APPROVED' || a.status === 'DEEMED_APPROVED')
                ? 'Statutory Clearances Accelerated to 48-Hour Fast-Track'
                : 'Accelerate Approval Speed via Fast SLA (48-Hour Green Channel)'}
            </h3>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {isFastSlaActive || applications.every(a => a.status === 'APPROVED' || a.status === 'GREEN_CHANNEL_APPROVED' || a.status === 'DEEMED_APPROVED')
                ? 'Your project has qualified for autonomous clearance issuance under Maharashtra Right to Services (RTS) Act 2015 Section 4(1). All statutory consent certificates are digitally signed and verified.'
                : 'Under the Maharashtra RTS Act 2015 and MSIS Green Channel, qualifying enterprises can activate Fast SLA to reduce standard sequential makespans (240 days) down to an express 48-hour approval turnaround.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {!(isFastSlaActive || applications.every(a => a.status === 'APPROVED' || a.status === 'GREEN_CHANNEL_APPROVED' || a.status === 'DEEMED_APPROVED')) ? (
              <button
                onClick={handleApplyFastSla}
                disabled={isFastSlaApplying}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                <Zap className="h-4 w-4" />
                <span>{isFastSlaApplying ? 'Accelerating Approvals...' : '⚡ Apply for Fast SLA (Express Approval)'}</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-4 py-2.5 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>All Clearances Sanctioned</span>
              </div>
            )}

            <Link
              href="/portal/profile"
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:border-blue-400 px-4 py-3 text-xs font-bold text-slate-200 hover:text-white transition-all shadow-md"
            >
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span>Explore Schemes & Rules</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* The Unified 4-Quadrant Dashboard Header & Tab Navigation */}
      <div className="border-b border-slate-800 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              Smart India Hackathon 26130 Single-Window Dashboard
            </span>
            <h2 className="text-lg font-black text-white mt-0.5">
              Enterprise Clearance, Compliance & Fiscal Operations
            </h2>
          </div>

          {/* 4 Quadrants + MahaVault Tab Bar */}
          <div className="flex flex-wrap items-center rounded-2xl border border-slate-800 bg-slate-900/90 p-1">
            <button
              onClick={() => setActiveTab('APPLICATIONS')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === 'APPLICATIONS'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderCheck className="h-3.5 w-3.5" />
              <span>Applications ({applications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('APPROVALS')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === 'APPROVALS'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              <span>Approvals ({approvedApps.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('RENEWALS')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === 'RENEWALS'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Renewals & Returns</span>
            </button>

            <button
              onClick={() => setActiveTab('INCENTIVES')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === 'INCENTIVES'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coins className="h-3.5 w-3.5" />
              <span>Incentives & PSI 2019</span>
            </button>

            <button
              onClick={() => setActiveTab('VAULT')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === 'VAULT'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              <span>MahaVault (6/6)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          QUADRANT 1: ACTIVE APPLICATIONS
          ======================================================== */}
      {activeTab === 'APPLICATIONS' && (
        <div className="space-y-4">
          {/* Department Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium mr-1 text-[11px]">Filter:</span>
            {[
              { id: 'ALL', label: 'All Departments' },
              { id: 'MIDC', label: 'MIDC Planning' },
              { id: 'MPCB', label: 'MPCB Pollution' },
              { id: 'DISH', label: 'DISH Safety' },
              { id: 'MSEDCL', label: 'MSEDCL Power' },
              { id: 'FIRE', label: 'Fire Services' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterDepartment(f.id)}
                className={`rounded-lg px-3 py-1 font-medium transition-colors whitespace-nowrap ${
                  filterDepartment === f.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((app) => {
              const isUrgent = app.daysRemaining <= 3 && app.status !== 'APPROVED' && app.status !== 'GREEN_CHANNEL_APPROVED';
              const isApproved = app.status === 'APPROVED' || app.status === 'GREEN_CHANNEL_APPROVED' || app.status === 'DEEMED_APPROVED';
              const isQueryRaised = app.status === 'QUERY_RAISED';

              return (
                <div
                  key={app.id}
                  className={`rounded-2xl border p-5 backdrop-blur-md shadow-xl space-y-4 transition-all ${
                    isQueryRaised
                      ? 'border-amber-500/50 bg-amber-950/15 ring-1 ring-amber-500/20'
                      : isApproved
                      ? 'border-emerald-500/40 bg-emerald-950/15'
                      : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400">
                          {app.trackingNumber}
                        </span>
                        {app.cafReferenceNumber && (
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {app.cafReferenceNumber}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {app.department.split('(')[0]}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        {app.approvalName}
                      </h3>
                      {app.cafSummary && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {app.cafSummary.midcCluster} • {app.cafSummary.plotNumber}
                        </div>
                      )}
                    </div>

                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      isApproved
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isQueryRaised
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                        : app.status === 'INSPECTION_PENDING'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* SLA Countdown & Assigned Scrutiny Officer */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-blue-400" />
                        RTS Act Statutory SLA
                      </div>
                      <RealtimeSlaCountdown
                        deadlineIso={app.slaDeadline}
                        initialDaysRemaining={app.daysRemaining}
                      />
                      {app.isEscalated && (
                        <span className="text-[10px] text-rose-400 font-bold block mt-1">
                          ⚠️ Escalated to {app.escalationLevel}
                        </span>
                      )}
                      {isQueryRaised && (
                        <span className="text-[10px] text-amber-400 font-medium block mt-1 font-mono">
                          ⏸️ SLA Paused during query
                        </span>
                      )}
                      {((app.daysRemaining <= 3 && !isApproved) || app.isEscalated) && (
                        <Link
                          href={`/portal/grievances?tier=TIER_2_FIRST_APPEAL&appId=${app.trackingNumber}&dept=${encodeURIComponent(app.department)}`}
                          className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 hover:text-rose-300 underline underline-offset-2"
                        >
                          <Scale className="h-2.5 w-2.5" />
                          <span>Request Department Escalation</span>
                        </Link>
                      )}
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck className="h-3 w-3 text-emerald-400" />
                        Scrutiny Officer
                      </div>
                      <div className="text-xs font-bold text-white mt-1 truncate">
                        {app.assignedOfficerName}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Trust Score: {app.trustScore}/100
                      </div>
                    </div>
                  </div>

                  {/* Clarification Query with 1-Click Respond Button */}
                  {isQueryRaised && (
                    <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-xs text-amber-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-amber-300">
                          <AlertTriangle className="h-4 w-4 text-amber-400" />
                          <span>Department Clarification Required</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                          Action Required
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-amber-100/90 font-medium">
                        {app.queryNotes?.[0] || 'Clarification required regarding technical drawing and setback calculations.'}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 pt-1">
                        <button
                          onClick={() => setSelectedQueryApp(app)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 py-2 px-3 text-xs font-bold text-slate-950 shadow-md transition-all active:scale-[0.99]"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Respond (Use AI Draft)</span>
                        </button>
                        <Link
                          href={`/portal/grievances?tier=TIER_2_FIRST_APPEAL&appId=${app.trackingNumber}&dept=${encodeURIComponent(app.department)}&reason=UNREASONABLE_QUERY`}
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 py-2 px-3 text-xs font-bold text-slate-300 transition-all"
                        >
                          <Scale className="h-3.5 w-3.5 text-slate-400" />
                          <span>Request Escalation</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Official Digital Permit Available */}
                  {isApproved && (
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs text-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>Statutory Clearance Granted</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                          Digital Signature Verified
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedPermitApp(app)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 px-3 text-xs font-bold text-white shadow-md transition-all active:scale-[0.99]"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>View & Print Official Digital Permit</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          QUADRANT 2: GRANTED APPROVALS & DIGITAL PERMIT VAULT
          ======================================================== */}
      {activeTab === 'APPROVALS' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-400" />
                  Statutory Clearances & Digital Permit Registry
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Official digitally signed government authorizations issued under the Maharashtra Right to Services Act 2015.
                </p>
              </div>
              <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
                {approvedApps.length} Cleared Permits
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {approvedApps.map((app) => (
                <div
                  key={app.id}
                  className="rounded-2xl border border-emerald-500/30 bg-slate-950 p-4 space-y-3 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {app.trackingNumber}
                      </span>
                      <QrCode className="h-4 w-4 text-emerald-400" />
                    </div>

                    <h4 className="font-bold text-white text-sm">
                      {app.approvalName}
                    </h4>

                    <div className="text-[11px] text-slate-400">
                      Issuing Body: <span className="text-slate-300 font-semibold">{app.department}</span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Signatory: <span className="text-slate-300">{app.assignedOfficerName}</span>
                    </div>

                    <div className="rounded-lg bg-slate-900 p-2 text-[10px] font-mono text-slate-300 space-y-0.5 border border-slate-800">
                      <div>Status: <span className="text-emerald-400 font-bold">ACTIVE & VALID</span></div>
                      <div>Validity: 5 Years from Date of Issue</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPermitApp(app)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-bold text-white transition-all shadow-md active:scale-95"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>View Digital Permit</span>
                  </button>
                </div>
              ))}

              {/* Instant Green-Channel Seeded Permit Example if none yet approved */}
              {approvedApps.length === 0 && (
                <div className="col-span-full py-12 text-center space-y-3 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                  <Award className="h-10 w-10 text-slate-500 mx-auto" />
                  <h4 className="text-sm font-bold text-white">No Permits Issued Yet</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Submit your Common Application Form (CAF) to trigger parallel clearances. Green-Channel eligible projects receive deemed approvals within 48 hours.
                  </p>
                  <Link
                    href="/portal/apply"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
                  >
                    <span>File Single-Window CAF</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          QUADRANT 3: CONTINUOUS STATUTORY COMPLIANCE & RENEWALS
          ======================================================== */}
      {activeTab === 'RENEWALS' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  Statutory Returns Calendar & Fast-Track Renewals
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mandatory periodic filings under Environment Protection Rules, Hazardous Wastes Rules, and Maharashtra Factories Rules.
                </p>
              </div>

              <Link
                href="/portal/apply?stage=RENEWAL"
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-3.5 py-2 text-xs font-bold text-white transition-all shadow-md self-start sm:self-auto"
              >
                <span>Fast-Track 5-Yr License Renewal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Statutory Returns Schedule Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[
                {
                  key: 'MPCB-V',
                  formNumber: 'MPCB Form V',
                  act: 'Environment (Protection) Rules, 1986',
                  title: 'Annual Environmental Statement',
                  deadline: 'Every September 30',
                  penalty: 'compounding daily penalty under Water/Air Acts',
                  frequency: 'Annual',
                },
                {
                  key: 'HAZARDOUS-4',
                  formNumber: 'Form 4 (Hazardous)',
                  act: 'Hazardous & Other Wastes Rules, 2016',
                  title: 'Annual Returns of Hazardous Waste Disposal',
                  deadline: 'Every June 30',
                  penalty: 'immediate inspection notice and show-cause order',
                  frequency: 'Annual',
                },
                {
                  key: 'DISH-27',
                  formNumber: 'DISH Form 27',
                  act: 'Maharashtra Factories Rules, 1963',
                  title: 'Half-Yearly Factory Return (Man-hours & Accidents)',
                  deadline: 'January 15 & July 15',
                  penalty: 'license suspension inquiry under Factories Act 1948',
                  frequency: 'Half-Yearly',
                },
                {
                  key: 'FIRE-B',
                  formNumber: 'Fire Form B',
                  act: 'Maharashtra Fire Prevention & Life Safety Act, 2006',
                  title: 'Bi-Annual Fire Safety Certificate Audit',
                  deadline: 'January & July (Bi-Annual)',
                  penalty: 'revocation of occupancy certificate',
                  frequency: 'Bi-Annual',
                },
              ].map((ret) => {
                const isFiled = !!filedReturns[ret.key];
                return (
                  <div
                    key={ret.key}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                          {ret.formNumber}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {ret.frequency}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-sm">{ret.title}</h4>
                      <p className="text-[11px] text-slate-400">{ret.act}</p>

                      <div className="text-[11px] text-amber-300 bg-amber-950/20 p-2 rounded-lg border border-amber-500/20">
                        ⏰ Statutory Due Date: <strong>{ret.deadline}</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      {isFiled ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-mono text-[11px]">{filedReturns[ret.key]}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleFileReturn(ret.key)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                        >
                          <Send className="h-3 w-3" />
                          <span>1-Click File Return</span>
                        </button>
                      )}

                      <span className="text-[10px] text-slate-500">MahaVault Auto-Fill</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          QUADRANT 4: FISCAL SUPPORT & PSI 2019 INCENTIVES
          ======================================================== */}
      {activeTab === 'INCENTIVES' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-500/30 bg-slate-900/60 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Coins className="h-5 w-5 text-amber-400" />
                  Package Scheme of Incentives (PSI 2019/2024) Entitlements
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated disbursement tracking for State GST refunds, electricity duty waivers, and capital subsidies.
                </p>
              </div>

              <Link
                href="/portal/incentives"
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 text-xs font-bold text-amber-300 transition-all shadow-sm"
              >
                <span>Interactive PSI Calculator</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 4 Fiscal Benefit Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Taluka Zone Category</span>
                <div className="text-xl font-black text-amber-400">
                  {currentProfile.talukaCategory || 'Zone B (Developing)'}
                </div>
                <p className="text-[11px] text-slate-400">Chakan Phase II, Pune District</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Eligible Gross SGST Refund</span>
                <div className="text-xl font-black text-emerald-400">
                  60% of FCI
                </div>
                <p className="text-[11px] text-slate-400">₹72.00 Cr Ceiling over 7 Years</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Electricity Duty Waiver</span>
                <div className="text-xl font-black text-blue-400">
                  100% Exemption
                </div>
                <p className="text-[11px] text-slate-400">7 Years Complete Waiver</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">MIDC Stamp Duty</span>
                <div className="text-xl font-black text-purple-400">
                  100% Waived
                </div>
                <p className="text-[11px] text-slate-400">Zero Upfront Lease Deed Duty</p>
              </div>
            </div>

            {/* Direct Entitlement Claim Banner */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Award className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">PSI 2019 Eligibility Certificate (EC) Ready</div>
                  <div className="text-[11px] text-slate-400">Pre-populated using your verified Single-Window CAF data from MahaVault.</div>
                </div>
              </div>

              <button
                onClick={() => {
                  confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs whitespace-nowrap shadow-md active:scale-95 transition-all"
              >
                Claim Incentive Entitlement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MAHAVULT: INTER-DEPARTMENTAL DATA REUSE
          ======================================================== */}
      {activeTab === 'VAULT' && (
        <MahaVaultExplorer />
      )}

      {/* Modals */}
      {selectedQueryApp && (
        <QueryResponseModal
          application={selectedQueryApp}
          isOpen={!!selectedQueryApp}
          onClose={() => setSelectedQueryApp(null)}
          onSuccess={() => {
            fetchApplications();
            setSelectedQueryApp(null);
          }}
        />
      )}

      {selectedPermitApp && (
        <DigitalPermitModal
          application={selectedPermitApp}
          isOpen={!!selectedPermitApp}
          onClose={() => setSelectedPermitApp(null)}
        />
      )}
    </div>
  );
}
