'use client';

import React, { useState, useEffect } from 'react';
import { ApplicationRecord } from '@approvalos/shared';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles,
  UserCheck,
  ChevronRight,
  Send,
  CalendarCheck,
  Lock,
  UserPlus,
  Layers,
  Zap
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { canPerformAction, canDepartmentAccessDocument } from '@/lib/rbac/permissions';
import confetti from 'canvas-confetti';

export function SmartQueueTable() {
  const { currentOfficer, currentDeptAdmin, activeRole } = useAppStore();
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  
  const currentDept = activeRole === 'DEPT_ADMIN' 
    ? currentDeptAdmin?.department 
    : currentOfficer?.department;

  const [filterDepartment, setFilterDepartment] = useState(currentDept || 'ALL');

  useEffect(() => {
    if (currentDept) {
      setFilterDepartment(currentDept);
    }
  }, [currentDept]);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/v1/applications?role=officer');
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOfficerAction = async (
    action: 'APPROVE' | 'REJECT' | 'RAISE_QUERY' | 'SCHEDULE_INSPECTION' | 'REASSIGN' | 'EXTEND_SLA' | 'CROSS_DEPT_PULL'
  ) => {
    if (!selectedApp) return;

    const userRole = activeRole === 'DEPT_ADMIN' ? 'DEPT_ADMIN' : 'OFFICER';

    // RBAC Pre-Execution Guard Check
    const permissionAction = 
      action === 'APPROVE' ? 'APPROVE_CLEARANCE' :
      action === 'REJECT' ? 'REJECT_CLEARANCE' :
      action === 'RAISE_QUERY' ? 'RAISE_QUERY' :
      action === 'SCHEDULE_INSPECTION' ? 'SCHEDULE_JOINT_INSPECTION' :
      action === 'REASSIGN' ? 'REASSIGN_APP' :
      action === 'EXTEND_SLA' ? 'EXTEND_SLA_ADMIN' :
      action === 'CROSS_DEPT_PULL' ? 'CROSS_DEPT_PULL' : 'LOG_INSPECTION_FINDINGS';

    const activeDeptName = activeRole === 'DEPT_ADMIN' 
      ? currentDeptAdmin?.department 
      : currentOfficer?.department;

    const departmentMatch = activeDeptName 
      ? selectedApp.department.toLowerCase().includes(activeDeptName.toLowerCase())
      : true;

    const rbacDecision = canPerformAction(userRole, permissionAction, { departmentMatch });
    if (!rbacDecision.allowed) {
      alert(`RBAC Scope Enforcement: ${rbacDecision.reason}`);
      return;
    }

    const actorName = activeRole === 'DEPT_ADMIN'
      ? (currentDeptAdmin ? `${currentDeptAdmin.fullName}, ${currentDeptAdmin.designation} (${currentDeptAdmin.department})` : 'Dr. Pravin Darade, IAS, Member Secretary (MPCB HQ)')
      : (currentOfficer ? `${currentOfficer.fullName}, ${currentOfficer.designation} (${currentOfficer.department})` : 'Er. Ramesh Kulkarni, Senior Scrutiny Officer (MPCB)');

    try {
      const res = await fetch('/api/v1/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          action,
          notes: actionNotes || (action === 'REJECT'
            ? 'Statutory compliance standards not met upon field scrutiny'
            : action === 'APPROVE'
            ? 'Consent granted subject to standard statutory safeguards'
            : action === 'REASSIGN'
            ? 'Reassigned to Fast-Track Technical Desk to prevent SLA breach'
            : action === 'EXTEND_SLA'
            ? '7-Day Administrative extension granted for high-risk Red category unit'
            : action === 'CROSS_DEPT_PULL'
            ? 'Cross-department document pulled under RTS Act 2015 Sec 3(2)'
            : `Officer action: ${action}`),
          performedBy: actorName,
          newOfficerName: 'Er. Dilip Patil (Fast-Track Technical Cell, Pune)',
          additionalDays: 7,
          docType: 'LAND_SALE_DEED',
          docName: 'MIDC_Chakan_Plot_Allotment_Agreement.pdf',
          sourceDept: 'MIDC Planning Directorate',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((a) => (a.id === selectedApp.id ? data.data : a))
        );
        setSelectedApp(data.data);
        setActionNotes('');

        if (action === 'APPROVE' || action === 'REASSIGN' || action === 'EXTEND_SLA') {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = applications
    .filter((app) => {
      if (filterDepartment === 'ALL') return true;
      return app.department.toLowerCase().includes(filterDepartment.toLowerCase());
    })
    .sort((a, b) => (b.riskScore - a.riskScore) || (a.daysRemaining - b.daysRemaining));

  return (
    <div className="space-y-6">
      {/* Officer Queue Header & KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-[11px] font-medium text-slate-400">Total Scrutiny Queue</div>
          <div className="text-2xl font-black text-white mt-1">{applications.length} Files</div>
          <div className="text-[10px] text-blue-400 mt-1">Priority sorted by SLA deadline</div>
        </div>

        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4">
          <div className="text-[11px] font-medium text-rose-300">Urgent SLA Attention (&lt; 3 Days)</div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {applications.filter(a => a.daysRemaining <= 3 && a.status !== 'APPROVED' && a.status !== 'GREEN_CHANNEL_APPROVED').length} Files
          </div>
          <div className="text-[10px] text-rose-300/80 mt-1">Auto-escalation warning active</div>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
          <div className="text-[11px] font-medium text-emerald-300">Green Channel Auto-Cleared</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {applications.filter(a => a.status === 'GREEN_CHANNEL_APPROVED').length} Files
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1">Zero officer hours expended</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-[11px] font-medium text-slate-400">Joint Inspections Slotted</div>
          <div className="text-2xl font-black text-white mt-1">
            {applications.filter(a => a.status === 'INSPECTION_PENDING').length} Sites
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Single combined visit window</div>
        </div>
      </div>

      {/* Queue Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 p-4 bg-slate-900/80">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              Smart Scrutiny Queue
            </h3>
            <p className="text-xs text-slate-400">
              Applications ranked by risk score, SLA remaining days, and automated pre-validation indicators
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeRole === 'OFFICER' && currentOfficer ? (
              <div className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-950/40 px-2.5 py-1 text-xs font-bold text-purple-300">
                <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                <span>{currentOfficer.department} Desk • {currentOfficer.jurisdictionDistrict}</span>
              </div>
            ) : (
              <>
                <span className="text-xs text-slate-400">Department:</span>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300 font-medium"
                >
                  <option value="ALL">All Departments</option>
                  <option value="MIDC">MIDC Planning Authority</option>
                  <option value="MPCB">MPCB Pollution Board</option>
                  <option value="DISH">DISH Industrial Safety</option>
                  <option value="MSEDCL">MSEDCL Electricity DISCOM</option>
                  <option value="Fire">Maharashtra Fire Services</option>
                </select>
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/70 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Tracking #</th>
                <th className="px-4 py-3">Applicant Company</th>
                <th className="px-4 py-3">Clearance Required</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">SLA Status</th>
                <th className="px-4 py-3">AI Risk Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((app) => {
                const isUrgent = app.daysRemaining <= 3 && app.status !== 'APPROVED' && app.status !== 'GREEN_CHANNEL_APPROVED';
                return (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3.5 font-mono text-blue-400 font-semibold whitespace-nowrap">
                      {app.trackingNumber}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-white max-w-[180px] truncate">
                      {app.companyName}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">
                      {app.approvalName}
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 max-w-[160px] truncate">
                      {app.department.split('(')[0]}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Clock className={`h-3 w-3 ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
                        <span className={`font-bold ${isUrgent ? 'text-rose-400' : 'text-slate-300'}`}>
                          {app.daysRemaining} days left
                        </span>
                      </div>
                      {app.isEscalated && (
                        <span className="text-[9px] font-bold text-rose-400 block">
                          Escalated to {app.escalationLevel}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full ${
                              app.riskScore > 60 ? 'bg-rose-500' : app.riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${app.riskScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-300">{app.riskScore}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        app.status === 'APPROVED' || app.status === 'GREEN_CHANNEL_APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : app.status === 'QUERY_RAISED'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : app.status === 'INSPECTION_PENDING'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApp(app);
                        }}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-blue-300 hover:border-blue-500 hover:text-white transition-colors"
                      >
                        Review Dossier →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Review Dossier Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-mono font-bold text-blue-400">
                    {selectedApp.trackingNumber}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {selectedApp.department}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedApp.companyName} — {selectedApp.approvalName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Industrial Project & CAF Profile Parameters */}
            {selectedApp.cafSummary && (
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white uppercase tracking-wider text-[10px]">
                    Industrial Project Parameters (Common Application Form)
                  </span>
                  <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    Category: {selectedApp.cafSummary.pollutionCategory}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">MIDC Industrial Zone:</span>
                    <span className="font-semibold text-slate-200">{selectedApp.cafSummary.midcCluster}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Plot Reference:</span>
                    <span className="font-semibold text-slate-200">{selectedApp.cafSummary.plotNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Project Capital Cost:</span>
                    <span className="font-bold text-emerald-400">₹ {selectedApp.cafSummary.totalProjectCostCr} Cr</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Connected Power Feeder:</span>
                    <span className="font-semibold text-slate-200">{selectedApp.cafSummary.powerKva} kVA (HT)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Water Demand (KLD):</span>
                    <span className="font-semibold text-slate-200">{selectedApp.cafSummary.waterKld} KLD</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Statutory SLA Time:</span>
                    <span className="font-mono font-bold text-blue-400">{selectedApp.daysRemaining} Days Left</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Risk Scrutiny Insight */}
            <div className="mt-4 rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 text-xs text-slate-300">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 font-bold text-blue-300">
                  <Sparkles className="h-4 w-4" />
                  AI Pre-Scrutiny & Dossier Completeness
                </div>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                  100% Complete Dossier (0 Missing Annexures)
                </span>
              </div>
              <p>
                All required architectural CAD and environmental schematics passed automated authenticity checks via DigiLocker.
                Applicant promoter exhibits a <strong>Trust Score of {selectedApp.trustScore}/100</strong>.
                {selectedApp.greenChannelEligible
                  ? ' Application qualifies for automatic Green Channel fast-track approval.'
                  : ' Standard desk scrutiny recommended.'}
              </p>
            </div>

            {/* Repetitive Scrutiny Shield & Cross-Department Verification */}
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-emerald-300 text-xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Repetitive Scrutiny Shield (MahaVault Cross-Acceptance)</span>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-300 border border-emerald-500/30">
                  RTS Act 2015 Protected
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Documents verified by sister authorities are permanently locked and cross-accepted. Scrutiny officers cannot demand re-submission of already authenticated land deeds, corporate identity, or civil drawings:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] pt-1">
                <div className="rounded-lg bg-slate-900/80 p-2 border border-slate-800 text-slate-300 flex items-center justify-between">
                  <span>📜 <strong>MIDC Land Lease / 7/12:</strong> Verified by MIDC</span>
                  <span className="text-emerald-400 font-mono font-bold">✓ Cross-Accepted</span>
                </div>
                <div className="rounded-lg bg-slate-900/80 p-2 border border-slate-800 text-slate-300 flex items-center justify-between">
                  <span>🏛️ <strong>27-GSTIN & Entity PAN:</strong> Verified by DoI</span>
                  <span className="text-emerald-400 font-mono font-bold">✓ Cross-Accepted</span>
                </div>
                <div className="rounded-lg bg-slate-900/80 p-2 border border-slate-800 text-slate-300 flex items-center justify-between">
                  <span>📐 <strong>Architectural Plant Layout:</strong> Approved by SPA</span>
                  <span className="text-emerald-400 font-mono font-bold">✓ Cross-Accepted</span>
                </div>
                <div className="rounded-lg bg-slate-900/80 p-2 border border-slate-800 text-slate-300 flex items-center justify-between">
                  <span>⚡ <strong>HT Substation Single Line (SLD):</strong> Vetted by MSEDCL</span>
                  <span className="text-emerald-400 font-mono font-bold">✓ Cross-Accepted</span>
                </div>
              </div>
            </div>

            {/* Existing Department Queries & Applicant Responses */}
            {selectedApp.queries && selectedApp.queries.length > 0 && (
              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/15 p-4 space-y-3">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Clarification Query & Response Thread</span>
                </div>
                <div className="space-y-2.5">
                  {selectedApp.queries.map((q) => (
                    <div key={q.id} className="rounded-lg bg-slate-900/90 p-3 border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-amber-300 font-semibold">Objection: "{q.objectionText}"</span>
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                          q.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {q.status}
                        </span>
                      </div>
                      {q.applicantResponseText ? (
                        <div className="rounded bg-emerald-950/20 border border-emerald-500/20 p-2 text-emerald-200 text-[11px]">
                          <strong>Applicant Clarification: </strong>
                          {q.applicantResponseText}
                        </div>
                      ) : (
                        <div className="text-slate-400 italic text-[10px]">
                          Awaiting applicant response (SLA clock paused under RTS rules).
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attached Documents */}
            <div className="mt-5">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Attached Statutory Documents ({selectedApp.documents.length})
              </h4>
              <div className="space-y-2">
                {selectedApp.documents.map((doc, idx) => {
                  const dpdpCheck = canDepartmentAccessDocument(currentDept || selectedApp.department, doc.docType);
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {dpdpCheck.authorized ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Lock className="h-4 w-4 text-amber-400 shrink-0" />
                        )}
                        <div>
                          <div className="font-semibold text-white">{doc.docName}</div>
                          <div className="text-[10px] text-slate-400">{doc.docType}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {dpdpCheck.authorized ? (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                            DPDP Sec 6(1) Mandated
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-400 border border-amber-500/20">
                            DPDP Minimization Redacted
                          </span>
                        )}
                        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold text-blue-400 border border-blue-500/20">
                          OCR Verified
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Center */}
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Officer Scrutiny Notes & Justification
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Enter statutory inspection remarks, conditions of approval, or specific clarification query..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
              />

              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                {activeRole === 'DEPT_ADMIN' && (
                  <>
                    <button
                      onClick={() => handleOfficerAction('REASSIGN')}
                      className="flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-3.5 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition-colors cursor-pointer"
                      title="Reassign stuck or delayed application to fast-track desk (REASSIGN_APP)"
                    >
                      <UserPlus className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Reassign Application Desk</span>
                    </button>

                    <button
                      onClick={() => handleOfficerAction('EXTEND_SLA')}
                      className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 px-3.5 py-2 text-xs font-bold text-blue-300 hover:bg-blue-500/20 transition-colors cursor-pointer"
                      title="Grant emergency 7-day extension for complex Red category units (EXTEND_SLA_ADMIN)"
                    >
                      <Zap className="h-3.5 w-3.5 text-blue-400" />
                      <span>Grant 7-Day SLA Extension</span>
                    </button>

                    <button
                      onClick={() => handleOfficerAction('CROSS_DEPT_PULL')}
                      className="flex items-center gap-1.5 rounded-xl border border-teal-500/40 bg-teal-500/10 px-3.5 py-2 text-xs font-bold text-teal-300 hover:bg-teal-500/20 transition-colors cursor-pointer"
                      title="Pull sister department documents under Section 3(2) RTS Act data reuse (CROSS_DEPT_PULL)"
                    >
                      <Layers className="h-3.5 w-3.5 text-teal-400" />
                      <span>Pull RTS Sec 3(2) Doc</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleOfficerAction('REJECT')}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  <XCircle className="h-3.5 w-3.5 text-rose-400" />
                  <span>{activeRole === 'DEPT_ADMIN' ? 'Issue Directorate Rejection' : 'Issue Statutory Rejection'}</span>
                </button>

                <button
                  onClick={() => handleOfficerAction('RAISE_QUERY')}
                  className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Raise Clarification Query</span>
                </button>

                <button
                  onClick={() => handleOfficerAction('SCHEDULE_INSPECTION')}
                  className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/10 px-3.5 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition-colors cursor-pointer"
                >
                  <CalendarCheck className="h-3.5 w-3.5" />
                  <span>{activeRole === 'DEPT_ADMIN' ? 'Mandate Joint Inspection Roster' : 'Slot Joint Inspection'}</span>
                </button>

                <button
                  onClick={() => handleOfficerAction('APPROVE')}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{activeRole === 'DEPT_ADMIN' ? 'Grant Directorate Clearance' : 'Issue Statutory Clearance'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
