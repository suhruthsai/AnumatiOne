'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppStore, SEED_OFFICERS, SEED_DEPT_ADMINS } from '@/lib/store';
import { SmartQueueTable } from '@/components/officer/SmartQueueTable';
import { MahaVaultExplorer } from '@/components/documents/MahaVaultExplorer';
import { 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  CalendarCheck, 
  BarChart3, 
  Layers, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Send,
  Users,
  MapPin,
  TrendingDown,
  ArrowRight,
  BadgeCheck,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';

function OfficerPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const { 
    isAuthenticated, 
    logout, 
    activeRole, 
    currentOfficer, 
    currentDeptAdmin, 
    loginOfficer,
    loginDeptAdmin 
  } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  const [activeTab, setActiveTab] = useState<'QUEUE' | 'INSPECTIONS' | 'VAULT' | 'ANALYTICS'>('QUEUE');

  // RBAC Scope Gate: Prevent Applicant from viewing internal officer queues
  if (activeRole === 'APPLICANT') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/30">
            RBAC Policy Enforcement • Principle of Least Privilege
          </div>
          <h2 className="text-2xl font-black text-white">403 Forbidden: Officer Scrutiny Desk Restricted</h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Your active session role is <strong className="text-emerald-400 font-mono">APPLICANT</strong> (Scope: <code className="text-indigo-300">OWN_RECORDS_ONLY</code>).
            Under UdyamSetu RBAC policy, applicants are strictly excluded from departmental back-office scrutiny queues, internal notes, and officer leave rosters.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => router.push('/portal/applications')}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 transition-all shadow-md cursor-pointer"
          >
            Return to Investor Overview
          </button>
          <button
            onClick={() => {
              logout();
              router.push('/auth/login');
            }}
            className="rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs px-4 py-2.5 transition-all cursor-pointer"
          >
            Switch to Officer Login (Parichay SSO)
          </button>
        </div>
      </div>
    );
  }

  // Identity extraction based on role
  const isDeptAdmin = activeRole === 'DEPT_ADMIN';
  const officerDisplayName = isDeptAdmin
    ? (currentDeptAdmin?.fullName || 'Dr. Pravin Darade, IAS')
    : (currentOfficer?.fullName || 'Er. Ramesh Kulkarni');

  const officerDesignation = isDeptAdmin
    ? (currentDeptAdmin?.designation || 'Member Secretary & Directorate Head')
    : (currentOfficer?.designation || 'Sub-Regional Officer');

  const officerDepartmentName = isDeptAdmin
    ? (currentDeptAdmin?.departmentName || 'Maharashtra Pollution Control Board (HQ)')
    : (currentOfficer?.departmentName || 'Maharashtra Pollution Control Board (MPCB)');

  const officerJurisdiction = isDeptAdmin
    ? 'State-Wide Department Authority (GoM HQ)'
    : (currentOfficer?.jurisdictionDistrict || 'Pune Region');

  const officerCredentials = isDeptAdmin
    ? `DSC: ${currentDeptAdmin?.dscCertificateId || 'DSC-CLASS3-MH-99214'} | ${currentDeptAdmin?.employeeCode || 'GOM-IAS-2004-MPCB-01'}`
    : `Code: ${currentOfficer?.employeeCode || 'GOM-MPCB-2016-8812'}`;

  // Inspection Scheduler State
  const [scheduledInspections, setScheduledInspections] = useState([
    {
      id: 'INSP-2026-991',
      company: 'Aegis Lithium Mobility Pvt Ltd',
      site: 'Plot A-42, Chakan MIDC Phase II, Pune',
      date: '2026-10-04 (10:00 AM - 02:00 PM)',
      departments: ['DISH (Safety)', 'MIDC Fire Brigade', 'MPCB (Effluent)'],
      officers: ['Er. Dilip Patil (DISH)', 'CFO Sanjay Pawar (Fire)', 'Er. Ramesh Kulkarni (MPCB)'],
      status: 'SLOTTED_48H',
      rtsCompliance: 'Synchronized under RTS Protocol Sec 4(1)',
    },
    {
      id: 'INSP-2026-992',
      company: 'Vanguard Biopharma Life Sciences',
      site: 'Plot C-12, AURIC DMIC, Shendra',
      date: '2026-10-08 (11:00 AM - 03:00 PM)',
      departments: ['MPCB (Hazardous Waste)', 'DISH (Boilers)'],
      officers: ['Er. Sachin Kale (MPCB)', 'Er. Dilip Patil (DISH)'],
      status: 'CONFIRMED',
      rtsCompliance: 'Unified Single Visit Protocol',
    },
  ]);

  const [newInspectionAppId, setNewInspectionAppId] = useState('');
  const [isSlotted, setIsSlotted] = useState(false);

  useEffect(() => {
    if (tabParam === 'inspections') setActiveTab('INSPECTIONS');
    else if (tabParam === 'vault') setActiveTab('VAULT');
    else if (tabParam === 'analytics') setActiveTab('ANALYTICS');
    else setActiveTab('QUEUE');
  }, [tabParam]);

  const handleScheduleNewInspection = () => {
    setIsSlotted(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setIsSlotted(false), 4000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Officer Credential & Department Banner */}
      <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-blue-950/30 p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
              <ShieldCheck className="h-3 w-3 text-purple-400" />
              {isDeptAdmin ? 'Government of Maharashtra Apex Intranet (Class-3 DSC)' : 'Government of Maharashtra Official Intranet (Parichay SSO)'}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
              isDeptAdmin ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            }`}>
              <BadgeCheck className="h-3 w-3" />
              {isDeptAdmin ? 'Hierarchy Level 3: Department Directorate Head' : 'Hierarchy Level 2: Field Inspector / Desk Scrutinizer'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            {officerDisplayName}
            <span className="text-sm font-semibold text-purple-300 font-sans">
              ({officerDesignation})
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
            <span>Department: <strong className="text-white">{officerDepartmentName}</strong></span>
            <span>Jurisdiction: <strong className="text-purple-300">{officerJurisdiction}</strong></span>
            <span>Identity: <strong className="font-mono text-slate-300">{officerCredentials}</strong></span>
          </div>
        </div>

        {/* Quick Officer Switcher for Judges */}
        <div className="flex items-center gap-2 rounded-2xl border border-purple-500/30 bg-purple-950/30 p-3 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Evaluator Switch:</div>
            <div className="text-xs font-bold text-purple-300">
              {isDeptAdmin ? 'Change Directorate Head' : 'Change Officer Role'}
            </div>
          </div>
          
          {isDeptAdmin ? (
            <select
              value={
                currentDeptAdmin?.department === 'MPCB' ? 'MPCB_HOD' :
                currentDeptAdmin?.department === 'MIDC' ? 'MIDC_CEO' :
                currentDeptAdmin?.department === 'DISH' ? 'DISH_DIRECTOR' : 'MSEDCL_CMD'
              }
              onChange={(e) => {
                const adm = SEED_DEPT_ADMINS[e.target.value];
                if (adm) loginDeptAdmin(adm);
              }}
              className="rounded-xl border border-purple-500/40 bg-slate-900 px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="MPCB_HOD">🏛️ Dr. Pravin Darade, IAS (MPCB Member Secretary)</option>
              <option value="MIDC_CEO">🏗️ Dr. P. Velrasu, IAS (MIDC CEO)</option>
              <option value="DISH_DIRECTOR">⚙️ Shri S. P. Rathod (DISH Director)</option>
              <option value="MSEDCL_CMD">⚡ Shri Lokesh Chandra, IAS (MSEDCL CMD)</option>
            </select>
          ) : (
            <select
              value={
                currentOfficer?.department === 'MPCB' ? 'MPCB_PUNE' :
                currentOfficer?.department === 'MIDC' ? 'MIDC_SPA' :
                currentOfficer?.department === 'DISH' ? 'DISH_FACTORIES' :
                currentOfficer?.department === 'MSEDCL' ? 'MSEDCL_POWER' : 'FIRE_SERVICES'
              }
              onChange={(e) => {
                const off = SEED_OFFICERS[e.target.value];
                if (off) loginOfficer(off);
              }}
              className="rounded-xl border border-purple-500/40 bg-slate-900 px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="MPCB_PUNE">🛡️ Er. Ramesh Kulkarni (MPCB Pollution)</option>
              <option value="MIDC_SPA">🏗️ Ar. Sneha Deshpande (MIDC Planning)</option>
              <option value="DISH_FACTORIES">⚙️ Er. Dilip Patil (DISH Safety & Boiler)</option>
              <option value="MSEDCL_POWER">⚡ Er. Vijay More (MSEDCL Power)</option>
              <option value="FIRE_SERVICES">🚒 CFO Sanjay Pawar (Fire Services)</option>
            </select>
          )}

          <button
            onClick={() => {
              logout();
              router.push('/auth/login');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/70 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-3.5 py-2 text-xs font-black text-white shadow-md shadow-red-950/50 hover:from-red-500 hover:to-rose-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Sign out of Officer Portal"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 4 Officer Tabs Navigation */}
      <div className="border-b border-slate-800 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
              SIH 26130 Government Back-Office System
            </span>
            <h2 className="text-lg font-black text-white mt-0.5">
              Regulatory Scrutiny, Joint Inspections & Delay Analytics
            </h2>
          </div>

          <div className="flex flex-wrap items-center rounded-2xl border border-slate-800 bg-slate-900/90 p-1">
            <button
              onClick={() => setActiveTab('QUEUE')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === 'QUEUE'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Risk-Based Scrutiny Queue</span>
            </button>

            <button
              onClick={() => setActiveTab('INSPECTIONS')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === 'INSPECTIONS'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>Common Inspection Planning</span>
            </button>

            <button
              onClick={() => setActiveTab('VAULT')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === 'VAULT'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>MahaVault Data Reuse (Sec 3(2))</span>
            </button>

            <button
              onClick={() => setActiveTab('ANALYTICS')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === 'ANALYTICS'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5 text-blue-400" />
              <span>Delay Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          TAB 1: RISK-BASED SCRUTINY QUEUE
          ======================================================== */}
      {activeTab === 'QUEUE' && (
        <div className="space-y-4">
          <SmartQueueTable />
        </div>
      )}

      {/* ========================================================
          TAB 2: COMMON INSPECTION PLANNING (SYNCHRONIZED JOINT VISITS)
          ======================================================== */}
      {activeTab === 'INSPECTIONS' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-purple-500/30 bg-slate-900/60 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-purple-400" />
                  Multi-Department Synchronized Joint Site Inspection Scheduler
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fulfilling Maharashtra RTS Act Section 4(1): Bundles DISH (Safety), MIDC Fire, and MPCB (Pollution) officers into a single 48-hour site visit.
                </p>
              </div>

              <button
                onClick={handleScheduleNewInspection}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
              >
                <span>Synchronize 48h Inspection Window</span>
                <Sparkles className="h-3.5 w-3.5" />
              </button>
            </div>

            {isSlotted && (
              <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-200 text-xs flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Joint Site Visit Scheduled: </strong> DISH Factory Inspector, MIDC Fire Officer, and MPCB Sub-Regional Officer locked into unified 48-hour slot for Chakan Plot A-42.
                </span>
              </div>
            )}

            {/* Scheduled Joint Visits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {scheduledInspections.map((insp) => (
                <div
                  key={insp.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {insp.id}
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                        {insp.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm">{insp.company}</h4>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span>{insp.site}</span>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 text-xs space-y-1">
                      <div className="text-[11px] text-purple-300 font-semibold">
                        🗓️ Slotted Visit Window: {insp.date}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Bundled Agencies: {insp.departments.join(' • ')}
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-300 pt-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Assigned Officers:</div>
                      {insp.officers.map((off, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span>{off}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-medium">{insp.rtsCompliance}</span>
                    <button
                      onClick={() => alert(`Single Joint Inspection Report (JIR) for ${insp.id} signed by all officers.`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-300 hover:text-white border border-slate-800 text-[10px] font-bold transition-colors"
                    >
                      Download JIR Form →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: MAHAVULT DATA REUSE (RTS SEC 3(2))
          ======================================================== */}
      {activeTab === 'VAULT' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-4 text-xs text-slate-300">
            <h3 className="font-bold text-emerald-300 text-sm flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              RTS Act 2015 Section 3(2) Cross-Acceptance Mechanism
            </h3>
            <p>
              Under Maharashtra State Gazette Rules, documents verified by MIDC, Directorate of Industries, or DigiLocker are permanently certified.
              Department scrutiny officers are <strong>legally barred</strong> from requesting duplicate copies of land leases, incorporation records, or building setbacks.
            </p>
          </div>
          <MahaVaultExplorer />
        </div>
      )}

      {/* ========================================================
          TAB 4: DELAY ANALYTICS & BOTTLENECK IDENTIFICATION
          ======================================================== */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-blue-500/30 bg-slate-900/60 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  State-Wide Clearance Makespan & Bottleneck Heatmap
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Macro analytics identifying departmental turnaround times, pacing nodes, and Section 4(1) Deemed Approval trigger rates.
                </p>
              </div>
              <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 font-bold">
                15 State Industrial Directorates
              </span>
            </div>

            {/* Macro Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Average Clearance TAT</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">78 Days</div>
                <p className="text-[11px] text-emerald-400">Down from 240 days (-67.5%)</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Top Pacing Node</span>
                <div className="text-xl font-black text-rose-400">MPCB ZLD Consent</div>
                <p className="text-[11px] text-slate-400">Average TAT: 31.4 Days</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Section 4(1) Deemed Approvals</span>
                <div className="text-2xl font-black text-purple-400 font-mono">14.2%</div>
                <p className="text-[11px] text-purple-300">Auto-cleared upon SLA expiry</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Document Re-Use Rate</span>
                <div className="text-2xl font-black text-blue-400 font-mono">92.8%</div>
                <p className="text-[11px] text-blue-300">Zero duplicate physical uploads</p>
              </div>
            </div>

            {/* Department Bottleneck Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <div className="p-3 border-b border-slate-800 font-bold text-xs text-white">
                Department Turnaround Time (TAT) & RTS SLA Compliance
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/60 text-[10px] uppercase text-slate-400">
                    <tr>
                      <th className="px-4 py-2.5">Department</th>
                      <th className="px-4 py-2.5">Statutory Clearance</th>
                      <th className="px-4 py-2.5">Statutory SLA</th>
                      <th className="px-4 py-2.5">Actual Average TAT</th>
                      <th className="px-4 py-2.5">Compliance Rate</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-white">MIDC Planning</td>
                      <td className="px-4 py-2.5">Land Possession & SPA Building Plan</td>
                      <td className="px-4 py-2.5 font-mono">30 Days</td>
                      <td className="px-4 py-2.5 font-mono text-emerald-400">18.2 Days</td>
                      <td className="px-4 py-2.5 font-mono">96.4%</td>
                      <td className="px-4 py-2.5"><span className="text-emerald-400 font-bold">Fast Track</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-white">MPCB Pollution</td>
                      <td className="px-4 py-2.5">Consent to Establish (CTE) & CTO</td>
                      <td className="px-4 py-2.5 font-mono">30 Days</td>
                      <td className="px-4 py-2.5 font-mono text-amber-400">26.8 Days</td>
                      <td className="px-4 py-2.5 font-mono">88.1%</td>
                      <td className="px-4 py-2.5"><span className="text-amber-400 font-bold">Pacing Node</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-white">DISH Safety</td>
                      <td className="px-4 py-2.5">Factory License & Form 2 Approval</td>
                      <td className="px-4 py-2.5 font-mono">20 Days</td>
                      <td className="px-4 py-2.5 font-mono text-emerald-400">11.4 Days</td>
                      <td className="px-4 py-2.5 font-mono">94.2%</td>
                      <td className="px-4 py-2.5"><span className="text-emerald-400 font-bold">Joint Visit Slotted</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-white">MSEDCL DISCOM</td>
                      <td className="px-4 py-2.5">HT Dedicated 22/33kV Power Sanction</td>
                      <td className="px-4 py-2.5 font-mono">25 Days</td>
                      <td className="px-4 py-2.5 font-mono text-emerald-400">14.1 Days</td>
                      <td className="px-4 py-2.5 font-mono">95.0%</td>
                      <td className="px-4 py-2.5"><span className="text-emerald-400 font-bold">18d Float Absorbed</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-white">Fire Services</td>
                      <td className="px-4 py-2.5">Provisional & Final Fire NOC</td>
                      <td className="px-4 py-2.5 font-mono">15 Days</td>
                      <td className="px-4 py-2.5 font-mono text-emerald-400">8.9 Days</td>
                      <td className="px-4 py-2.5 font-mono">98.1%</td>
                      <td className="px-4 py-2.5"><span className="text-emerald-400 font-bold">Fast Track</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OfficerPortalPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em]" />
        <p className="mt-2 text-xs text-slate-400">Loading Government Officer Desk...</p>
      </div>
    }>
      <OfficerPortalContent />
    </Suspense>
  );
}
