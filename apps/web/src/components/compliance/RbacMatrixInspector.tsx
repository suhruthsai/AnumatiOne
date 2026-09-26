'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Building2,
  Crown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Key,
  Database,
  ArrowRight,
  Fingerprint,
  RefreshCw,
  Search,
  Sliders,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  UserRole,
  PermissionAction,
  RBAC_ROLE_POLICIES,
  canPerformAction,
  canDepartmentAccessDocument,
  SEED_HASH_LEDGER,
  createLedgerBlock,
  verifyHashLedgerChain,
  HashLedgerBlock
} from '@/lib/rbac/permissions';

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  APPLICANT: <UserCheck className="h-5 w-5 text-emerald-400" />,
  OFFICER: <ShieldCheck className="h-5 w-5 text-blue-400" />,
  DEPT_ADMIN: <Building2 className="h-5 w-5 text-purple-400" />,
  STATE_ADMIN: <Crown className="h-5 w-5 text-amber-400" />,
};

const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  APPLICANT: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  OFFICER: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  DEPT_ADMIN: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  STATE_ADMIN: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
};

const MATRIX_ACTIONS: { action: PermissionAction; label: string; category: string }[] = [
  // Application Lifecycle
  { action: 'SUBMIT_CAF', label: 'Submit Common Application (CAF)', category: 'Lifecycle' },
  { action: 'SCRUTINIZE_APP', label: 'Technical Scrutiny & Review', category: 'Lifecycle' },
  { action: 'RAISE_QUERY', label: 'Raise Statutory Clarification Query', category: 'Lifecycle' },
  { action: 'RESPOND_QUERY', label: 'Respond to Clarification Query', category: 'Lifecycle' },
  { action: 'APPROVE_CLEARANCE', label: 'Grant Node Approval / NOC', category: 'Lifecycle' },
  { action: 'REJECT_CLEARANCE', label: 'Issue Rejection with Reason', category: 'Lifecycle' },
  { action: 'REASSIGN_APP', label: 'Reassign Stuck Application', category: 'Lifecycle' },
  // Compliance Passport
  { action: 'UPLOAD_PASSPORT_DOC', label: 'Upload to MahaVault Passport', category: 'Passport' },
  { action: 'VERIFY_NODE_DOC', label: 'Verify Assigned Node Document', category: 'Passport' },
  { action: 'CROSS_DEPT_PULL', label: 'Cross-Department RTS 3(2) Pull', category: 'Passport' },
  { action: 'VIEW_ALL_PASSPORT', label: 'View Unrestricted Vault Docs', category: 'Passport' },
  // SLA & Deemed Engine
  { action: 'VIEW_OWN_SLA_TWIN', label: 'View Digital Twin Simulation', category: 'SLA Engine' },
  { action: 'CLAIM_FAST_SLA', label: 'Claim Fast-Track 72h SLA', category: 'SLA Engine' },
  { action: 'PAUSE_SLA_CLOCK', label: 'Pause SLA Clock (Query Mode)', category: 'SLA Engine' },
  { action: 'EXTEND_SLA_ADMIN', label: 'Administrative 7-Day Extension', category: 'SLA Engine' },
  { action: 'OVERRIDE_DEEMED_APPROVAL', label: 'Override Deemed-Approval Bot', category: 'SLA Engine' },
  { action: 'EMERGENCY_FREEZE_SLA', label: 'Emergency State-Wide SLA Freeze', category: 'SLA Engine' },
  // RTS Appeals & Penalties
  { action: 'FILE_RTS_APPEAL', label: 'File Section 18 First Appeal', category: 'Appeals' },
  { action: 'ADJUDICATE_SEC18_APPEAL', label: 'Adjudicate First Appeal (HOD)', category: 'Appeals' },
  { action: 'ADJUDICATE_SEC19_APPEAL', label: 'Adjudicate Second Appeal (Apex)', category: 'Appeals' },
  { action: 'LEVY_OFFICER_PENALTY', label: 'Levy ₹250/day Statutory Penalty', category: 'Appeals' },
  // Knowledge Graph Configuration
  { action: 'VIEW_PUBLIC_GRAPH', label: 'View Public Regulatory Graph', category: 'Config' },
  { action: 'EDIT_DEPT_CHECKLIST', label: 'Modify Dept Checklist / Rules', category: 'Config' },
  { action: 'EDIT_GLOBAL_GRAPH_DEPENDENCIES', label: 'Edit Global Neo4j DAG Edges', category: 'Config' },
  { action: 'CONFIGURE_SLA_POLICIES', label: 'Configure Global SLA Parameters', category: 'Config' },
  // Audit Ledger
  { action: 'VIEW_OWN_TIMELINE', label: 'View Own Timeline Summary', category: 'Audit' },
  { action: 'VIEW_DEPT_AUDIT_LOGS', label: 'View Department-Wide Logs', category: 'Audit' },
  { action: 'VIEW_RAW_HASH_LEDGER', label: 'View Raw Cryptographic Hash-Ledger', category: 'Audit' },
];

export function RbacMatrixInspector() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'roles' | 'dpdp' | 'simulator' | 'ledger'>('matrix');
  const [selectedRole, setSelectedRole] = useState<UserRole>('OFFICER');

  // Simulator state
  const [simRole, setSimRole] = useState<UserRole>('APPLICANT');
  const [simAction, setSimAction] = useState<PermissionAction>('APPROVE_CLEARANCE');
  const [simIsOwner, setSimIsOwner] = useState(true);
  const [simDeptMatch, setSimDeptMatch] = useState(true);

  // DPDP Validator state
  const [dpdpDept, setDpdpDept] = useState('MPCB');
  const [dpdpDoc, setDpdpDoc] = useState('POLLUTION_UNDERTAKING');

  // Hash ledger interactive state
  const [ledgerChain, setLedgerChain] = useState<HashLedgerBlock[]>(SEED_HASH_LEDGER);
  const [newLogDetails, setNewLogDetails] = useState('Field engineer Dilip Patil verified emergency fire layout.');

  const simResult = canPerformAction(simRole, simAction, {
    isOwner: simIsOwner,
    departmentMatch: simDeptMatch,
  });

  const dpdpResult = canDepartmentAccessDocument(dpdpDept, dpdpDoc);
  const isChainValid = verifyHashLedgerChain(ledgerChain);

  const handleAppendLedger = () => {
    if (!newLogDetails.trim()) return;
    const prevBlock = ledgerChain.length > 0 ? ledgerChain[ledgerChain.length - 1] : null;
    const newBlock = createLedgerBlock(prevBlock, {
      actorRole: simRole,
      actorId: simRole === 'APPLICANT' ? 'ind_001' : simRole === 'OFFICER' ? 'off_003' : simRole === 'DEPT_ADMIN' ? 'dept_adm_001' : 'state_adm_001',
      action: simAction,
      resourceId: 'MPCB_CTE',
      details: newLogDetails,
    });
    setLedgerChain([...ledgerChain, newBlock]);
    setNewLogDetails('');
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-2">
            <Lock className="h-3.5 w-3.5" />
            Amazon SDE Security Bar Raiser Standards
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-indigo-400" />
            UdyamSetu Role-Based Access Control (RBAC) & Governance Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Hierarchical 4-role access model enforcing Principle of Least Privilege (PoLP), strict scope isolation, 
            DPDP Act 2023 Purpose Limitation, and Maharashtra RTS Act 2015 immutable hash-ledger logging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 text-xs font-mono font-bold">
            <Fingerprint className="h-4 w-4" />
            Zero Trust Architecture
          </span>
        </div>
      </div>

      {/* 4-Role Hierarchy Visual Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(['APPLICANT', 'OFFICER', 'DEPT_ADMIN', 'STATE_ADMIN'] as UserRole[]).map((r) => {
          const policy = RBAC_ROLE_POLICIES[r];
          return (
            <div
              key={r}
              onClick={() => {
                setSelectedRole(r);
                setActiveTab('roles');
              }}
              className={`cursor-pointer rounded-xl border p-4 transition-all hover:scale-[1.02] ${
                selectedRole === r
                  ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-950/50'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {ROLE_ICONS[r]}
                  <span className="font-bold text-white text-sm">{r}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  Level {policy.hierarchyLevel}
                </span>
              </div>
              <div className="text-xs font-medium text-slate-300 line-clamp-1">{policy.roleName.split('(')[0]}</div>
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                <span>Scope: <strong className="text-slate-200">{policy.viewScope}</strong></span>
                <span className={`px-1.5 py-0.2 rounded font-semibold ${policy.mfaEnforced ? 'text-blue-400' : 'text-slate-400'}`}>
                  {policy.mfaEnforced ? 'MFA Mandated' : 'OTP Standard'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'matrix', label: '1. Structured Permission Matrix' },
          { id: 'roles', label: '2. Role Scopes & Exclusions' },
          { id: 'dpdp', label: '3. DPDP Act Purpose Limitation' },
          { id: 'simulator', label: '4. Live RBAC Guard Simulator' },
          { id: 'ledger', label: '5. Immutable Hash-Ledger' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`whitespace-nowrap px-3.5 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Structured Permission Matrix Table */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              Cross-Role Statutory Capabilities & Enforcement Matrix
            </h3>
            <span className="text-[11px] text-slate-400">
              Evaluated strictly via <code className="text-indigo-300">canPerformAction()</code>
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Statutory Action / Right</th>
                  <th className="p-3.5 text-center">Applicant (L1)</th>
                  <th className="p-3.5 text-center">Officer (L2)</th>
                  <th className="p-3.5 text-center">Dept Admin (L3)</th>
                  <th className="p-3.5 text-center">State Admin (L4)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {MATRIX_ACTIONS.map((item, idx) => {
                  const appCheck = RBAC_ROLE_POLICIES.APPLICANT.allowedActions.includes(item.action);
                  const offCheck = RBAC_ROLE_POLICIES.OFFICER.allowedActions.includes(item.action);
                  const deptCheck = RBAC_ROLE_POLICIES.DEPT_ADMIN.allowedActions.includes(item.action);
                  const stateCheck = RBAC_ROLE_POLICIES.STATE_ADMIN.allowedActions.includes(item.action);

                  return (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 font-mono text-[10px] text-indigo-400">
                        {item.category}
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{item.label}</div>
                        <div className="font-mono text-[10px] text-slate-400">{item.action}</div>
                      </td>
                      <td className="p-3.5 text-center">
                        {appCheck ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                            <CheckCircle2 className="h-3 w-3" /> ALLOWED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold">
                            <XCircle className="h-3 w-3" /> DENIED
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {offCheck ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold">
                            <CheckCircle2 className="h-3 w-3" /> ALLOWED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold">
                            <XCircle className="h-3 w-3" /> DENIED
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {deptCheck ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold">
                            <CheckCircle2 className="h-3 w-3" /> ALLOWED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold">
                            <XCircle className="h-3 w-3" /> DENIED
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {stateCheck ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                            <CheckCircle2 className="h-3 w-3" /> ALLOWED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold">
                            <XCircle className="h-3 w-3" /> DENIED
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Role Scopes, Exclusions & Escalations */}
      {activeTab === 'roles' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {(['APPLICANT', 'OFFICER', 'DEPT_ADMIN', 'STATE_ADMIN'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === r
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {r}: {RBAC_ROLE_POLICIES[r].roleName.split('(')[0]}
              </button>
            ))}
          </div>

          {(() => {
            const p = RBAC_ROLE_POLICIES[selectedRole];
            return (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      {ROLE_ICONS[selectedRole]}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{p.roleName}</h4>
                      <p className="text-xs text-slate-400">{p.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${ROLE_BADGE_COLORS[selectedRole]}`}>
                      Hierarchy Level {p.hierarchyLevel}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold border border-slate-700 bg-slate-800 text-slate-300">
                      Scope: {p.viewScope}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* What They Can View */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      What They Can View (Scope: {p.viewScope})
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedRole === 'APPLICANT' && 'Restricted strictly to own enterprise applications, CAF dossiers, DAG milestone journey, self-uploaded MahaVault documents, and public statutory knowledge graph.'}
                      {selectedRole === 'OFFICER' && 'Applications and compliance documents assigned to their statutory desk within their assigned jurisdiction district and department.'}
                      {selectedRole === 'DEPT_ADMIN' && 'Department-wide dossier queue, all field officer case files, joint inspection rosters, and departmental SLA breach metrics across all districts.'}
                      {selectedRole === 'STATE_ADMIN' && 'Apex state-wide visibility across all 5 statutory departments, inter-departmental dependency bottlenecks, and the full cryptographic hash ledger.'}
                    </p>
                    <div className="pt-2 text-[11px] text-slate-400">
                      <strong>Audit Visibility Level:</strong> <span className="font-mono text-indigo-300">{p.auditVisibility}</span>
                    </div>
                  </div>

                  {/* Explicit Exclusions */}
                  <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 space-y-2">
                    <div className="font-bold text-rose-400 flex items-center gap-1.5">
                      <XCircle className="h-4 w-4" />
                      Explicit Exclusions (Prevent Scope Creep)
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-rose-200/90 leading-relaxed">
                      {p.explicitExclusions.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Escalation & Override Rights */}
                  <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4 space-y-2">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" />
                      Escalation & Override Rights
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-amber-200/90 leading-relaxed">
                      {p.escalationOverrideRights.map((esc, i) => (
                        <li key={i}>{esc}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Configuration & DPDP Consent */}
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/10 p-4 space-y-2">
                    <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                      <Sliders className="h-4 w-4" />
                      Configuration Rights & DPDP Consent Model
                    </div>
                    <div className="space-y-2 text-indigo-200/90 leading-relaxed">
                      <div>
                        <strong className="text-white">Knowledge Graph Configuration:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {p.configurationRights.map((cfg, i) => (
                            <li key={i}>{cfg}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-t border-indigo-500/20">
                        <strong className="text-white">DPDP Act 2023 Consent Model:</strong>
                        <p className="mt-1 text-[11px] text-indigo-300">{p.dpdpConsentModel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: DPDP Act 2023 Purpose Limitation Validator */}
      {activeTab === 'dpdp' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-emerald-400" />
              DPDP Act 2023 Section 6(1) Data Minimization & RTS Section 3(2) Cross-Acceptance Guard
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Departments are legally prohibited from browsing an applicant's complete sovereign document repository. 
              Each department may only query documents strictly necessary for their clearance node.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">Statutory Department</label>
              <select
                value={dpdpDept}
                onChange={(e) => setDpdpDept(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-white font-medium focus:border-indigo-500 focus:outline-none"
              >
                <option value="MPCB">MPCB (Maharashtra Pollution Control Board)</option>
                <option value="MIDC">MIDC (Industrial Development Corporation)</option>
                <option value="DISH">DISH (Industrial Safety & Health)</option>
                <option value="FIRE">FIRE (Maharashtra Fire Services)</option>
                <option value="MSEDCL">MSEDCL (State Electricity Distribution)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">MahaVault Compliance Document</label>
              <select
                value={dpdpDoc}
                onChange={(e) => setDpdpDoc(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-white font-medium focus:border-indigo-500 focus:outline-none"
              >
                <option value="POLLUTION_UNDERTAKING">Pollution Control Undertaking (Effluent/Emissions)</option>
                <option value="LAND_SALE_DEED">Registered Land Sale Deed / 95-Yr MIDC Lease</option>
                <option value="FACTORY_LAYOUT_PLAN">Architectural Factory Layout Plan</option>
                <option value="FIRE_SAFETY_SCHEMATIC">Hydrant & Sprinkler Engineering Schematic</option>
                <option value="POWER_LOAD_CALCULATION">High Tension (HT) Power Load Demand Chart</option>
                <option value="PROPRIETARY_FORMULATION">Confidential Chemical Batch Synthesis Formulation</option>
              </select>
            </div>
          </div>

          {/* Result card */}
          <div className={`rounded-xl border p-4 text-xs ${
            dpdpResult.authorized 
              ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200' 
              : 'border-rose-500/30 bg-rose-950/20 text-rose-200'
          }`}>
            <div className="flex items-center justify-between font-bold text-sm">
              <span className="flex items-center gap-2">
                {dpdpResult.authorized ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <XCircle className="h-5 w-5 text-rose-400" />}
                {dpdpResult.authorized ? 'ACCESS AUTHORIZED' : 'ACCESS DENIED (PURPOSE LIMITATION BREACH)'}
              </span>
              <span className="font-mono text-xs">{dpdpDept} ⟷ {dpdpDoc}</span>
            </div>
            <p className="mt-2 text-xs opacity-90">
              <strong>Statutory Rationale:</strong> {dpdpResult.statutoryRule}
            </p>
            {!dpdpResult.authorized && (
              <p className="mt-1 text-[11px] text-rose-300">
                Prevented unconstitutional fishing expeditions. Under Digital Personal Data Protection (DPDP) Act 2023, 
                statutory agencies cannot pull documents unrelated to their mandated clearance mandate.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Live RBAC Guard Simulator */}
      {activeTab === 'simulator' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-400" />
              Live RBAC Guard Evaluation Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Test runtime decision making of the <code className="text-indigo-300">canPerformAction(role, action, context)</code> guard engine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Actor Role</label>
              <select
                value={simRole}
                onChange={(e) => setSimRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-white font-medium focus:border-indigo-500 focus:outline-none"
              >
                <option value="APPLICANT">Applicant (Industrialist)</option>
                <option value="OFFICER">Officer (Field Engineer)</option>
                <option value="DEPT_ADMIN">Department Admin (Directorate Head)</option>
                <option value="STATE_ADMIN">State Admin (Apex Single-Window)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target Action</label>
              <select
                value={simAction}
                onChange={(e) => setSimAction(e.target.value as PermissionAction)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-white font-medium focus:border-indigo-500 focus:outline-none"
              >
                {MATRIX_ACTIONS.map((m) => (
                  <option key={m.action} value={m.action}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Ownership Context</label>
              <select
                value={simIsOwner ? 'true' : 'false'}
                onChange={(e) => setSimIsOwner(e.target.value === 'true')}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-white font-medium focus:border-indigo-500 focus:outline-none"
              >
                <option value="true">Own Record / Enterprise Dossier</option>
                <option value="false">Another Enterprise's Dossier</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Department Match</label>
              <select
                value={simDeptMatch ? 'true' : 'false'}
                onChange={(e) => setSimDeptMatch(e.target.value === 'true')}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-white font-medium focus:border-indigo-500 focus:outline-none"
              >
                <option value="true">Own Statutory Department (e.g. MPCB)</option>
                <option value="false">Different Department (e.g. DISH / MIDC)</option>
              </select>
            </div>
          </div>

          <div className={`rounded-xl border p-4 text-xs ${
            simResult.allowed 
              ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200' 
              : 'border-rose-500/30 bg-rose-950/20 text-rose-200'
          }`}>
            <div className="flex items-center justify-between font-bold text-sm">
              <span className="flex items-center gap-2">
                {simResult.allowed ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <XCircle className="h-5 w-5 text-rose-400" />}
                {simResult.allowed ? 'EXECUTION GRANTED' : 'PERMISSION DENIED'}
              </span>
              <span className="font-mono text-xs">{simRole} ➔ {simAction}</span>
            </div>
            <p className="mt-2 text-xs">
              <strong>Evaluation Engine Reason:</strong> {simResult.reason}
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: Immutable Hash-Ledger */}
      {activeTab === 'ledger' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="h-4 w-4 text-amber-400" />
                Maharashtra RTS Act 2015 Evidentiary Cryptographic Hash-Ledger
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Append-only SHA-256 chained audit blocks proving tamper-evident statutory tracking for legal tribunals.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                isChainValid.isValid 
                  ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-400' 
                  : 'border-rose-500/30 bg-rose-950/40 text-rose-400'
              }`}>
                {isChainValid.isValid ? '✓ Hash Chain Valid' : `Tampered at Block #${isChainValid.brokenIndex}`}
              </span>
            </div>
          </div>

          {/* Append Entry Form */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 text-xs">
            <div className="font-bold text-slate-300">Append New Evidentiary Action Block</div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={newLogDetails}
                onChange={(e) => setNewLogDetails(e.target.value)}
                placeholder="Log details (e.g. Officer approved clearance with 4 effluent norms)"
                className="flex-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={handleAppendLedger}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-md transition-all"
              >
                + Commit Hash Block
              </button>
            </div>
          </div>

          {/* Blocks visualizer */}
          <div className="space-y-3">
            {ledgerChain.map((block) => (
              <div
                key={block.blockIndex}
                className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-3.5 text-xs font-mono space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-indigo-400">BLOCK #{block.blockIndex}</span>
                  <span className="text-slate-400 text-[10px]">{block.timestamp}</span>
                </div>
                <div className="text-white text-xs font-sans">
                  <span className="font-semibold text-slate-300">[{block.actorRole} - {block.actorId}]:</span> {block.details}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <div>
                    <span className="text-slate-400">Prev Hash:</span>
                    <div className="truncate text-slate-400">{block.previousHash}</div>
                  </div>
                  <div>
                    <span className="text-amber-400">Current Hash:</span>
                    <div className="truncate text-amber-300">{block.currentHash}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
