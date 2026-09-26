'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Gavel
} from 'lucide-react';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'TRACKER' | 'VAULT'>('TRACKER');
  const [selectedQueryApp, setSelectedQueryApp] = useState<ApplicationRecord | null>(null);
  const [selectedPermitApp, setSelectedPermitApp] = useState<ApplicationRecord | null>(null);
  const [filterDepartment, setFilterDepartment] = useState('ALL');

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

  const filtered = applications.filter((app) => {
    if (filterDepartment === 'ALL') return true;
    return app.department.toLowerCase().includes(filterDepartment.toLowerCase());
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Real-Time Database Sync (Active)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
              <Sparkles className="h-3 w-3" />
              Maharashtra RTS Act 2015 SLA Sentinel
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <FolderCheck className="h-7 w-7 text-blue-400" />
            Applications & DigiLocker Data Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
            Track live filings across all departments in real time with active SLA countdowns, instant query resolution, and digital clearance certificates.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/portal/apply"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:brightness-110 active:scale-[0.99] transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>➕ File New Application (CAF)</span>
          </Link>

          {/* Tab Switcher */}
          <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1">
            <button
              onClick={() => setActiveTab('TRACKER')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'TRACKER'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Sentinel ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('VAULT')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'VAULT'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="h-3 w-3 text-emerald-400" />
              <span>MahaVault (6/6 Pre-Validated)</span>
            </button>
          </div>
        </div>
      </div>

      {/* View 1: Application Tracker */}
      {activeTab === 'TRACKER' && (
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

                  {/* Realtime Statutory SLA Countdown & Assigned Officer */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
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

                  {/* Clarification Query with 1-Click Respond Button & RTS Sec 18 Appeal Option */}
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
                        <span>View & Print Official Digital Permit with QR Code</span>
                      </button>
                    </div>
                  )}

                  {/* Attached Pre-Validated MahaVault Certified Dossier */}
                  {app.documents && app.documents.length > 0 && (
                    <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 text-xs space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        Attached Pre-Validated Dossier ({app.documents.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {app.documents.map((d, dIdx) => (
                          <span
                            key={dIdx}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-500/20"
                          >
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            {d.docType || d.docName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Inspection Notice if Slotted */}
                  {app.inspections && app.inspections.length > 0 && (
                    <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3 text-xs text-purple-200 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-purple-300">
                        <CalendarCheck className="h-3.5 w-3.5" />
                        Joint Synchronized Site Inspection Confirmed
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Date: <strong>{app.inspections[0].scheduledDate}</strong>. Joint team: {app.inspections[0].departments.join(' + ')}.
                      </p>
                    </div>
                  )}

                  {/* Timeline Stream */}
                  <div className="border-t border-slate-800/80 pt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Application Audit Trail
                    </span>
                    <div className="space-y-1.5 text-[11px]">
                      {app.timeline.map((evt, eIdx) => (
                        <div key={eIdx} className="flex items-start gap-2 text-slate-300">
                          <CheckCircle2 className="h-3 w-3 shrink-0 text-blue-400 mt-0.5" />
                          <span className="text-slate-400">{evt.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: Pre-Validation & Vault */}
      {activeTab === 'VAULT' && (
        <MahaVaultExplorer />
      )}

      {/* Query Response Modal */}
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

      {/* Digital Permit Certificate Modal */}
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
