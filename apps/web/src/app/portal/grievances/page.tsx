'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GrievanceRecord } from '@approvalos/shared';
import { 
  AlertCircle, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Star,
  Scale,
  Gavel,
  FileText,
  AlertTriangle,
  Building2,
  Copy,
  Printer,
  ChevronRight,
  ShieldCheck,
  Calendar,
  DollarSign,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/lib/store';

const PRESET_APPLICATIONS = [
  {
    id: 'APOS-PUNE-MIDC-01-2026-9812',
    name: 'MIDC Building Plan Approval & Commencement Certificate',
    dept: 'Maharashtra Industrial Development Corp (MIDC)',
    issue: 'SLA Expired by 14 days; no response to submitted structural drawings',
    daysOverdue: 14
  },
  {
    id: 'APOS-ENV01-301928',
    name: 'MPCB Consent to Establish (Orange/Red Category EV Line)',
    dept: 'Maharashtra Pollution Control Board (MPCB)',
    issue: 'Repetitive queries raised for lease panchnama already validated in MahaVault (Sec 3(2) violation)',
    daysOverdue: 6
  },
  {
    id: 'APOS-NASHIK-MSEDCL-01-2026-1102',
    name: 'MSEDCL High Tension 22kV Load Feasibility Sanction',
    dept: 'Maharashtra State Electricity Distribution Co. (MSEDCL)',
    issue: 'Demand note not generated within statutory 15 days despite site feasibility clearance',
    daysOverdue: 8
  }
];

function GrievanceContent() {
  const searchParams = useSearchParams();
  const { currentProfile, currentIndustrialist } = useAppStore();

  const [grievances, setGrievances] = useState<GrievanceRecord[]>([]);
  const [selectedTier, setSelectedTier] = useState<GrievanceRecord['appealTier']>('TIER_2_FIRST_APPEAL');
  const [selectedAppId, setSelectedAppId] = useState('APOS-PUNE-MIDC-01-2026-9812');
  const [department, setDepartment] = useState('Maharashtra Industrial Development Corp (MIDC)');
  const [title, setTitle] = useState('Statutory 30-Day SLA Expired: Building Commencement Withheld');
  const [description, setDescription] = useState(
    'The Designated Planning Authority has exceeded the 30-day statutory SLA under Section 4(1) of Maharashtra RTS Act 2015. All pre-requisite fire NOCs, structural certificates, and architectural plans were verified on DigiLocker MahaVault without deficiency.'
  );
  const [reliefSought, setReliefSought] = useState('Direction for immediate issuance of Building Commencement Certificate under deemed provisions.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'TIER_1' | 'TIER_2' | 'TIER_3'>('ALL');
  const [ratingSubmitted, setRatingSubmitted] = useState<Record<string, number>>({});
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<GrievanceRecord | null>(null);
  const [showLegalDraftModal, setShowLegalDraftModal] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Initialize from searchParams if navigated from Applications Sentinel
  useEffect(() => {
    const tierParam = searchParams.get('tier') as GrievanceRecord['appealTier'];
    const appIdParam = searchParams.get('appId');
    const deptParam = searchParams.get('dept');
    const reasonParam = searchParams.get('reason');

    if (tierParam) setSelectedTier(tierParam);
    if (appIdParam) setSelectedAppId(appIdParam);
    if (deptParam) setDepartment(deptParam);
    if (reasonParam === 'UNREASONABLE_QUERY') {
      setTitle('First Appeal: Repetitive Scrutiny Query in Violation of RTS Section 3(2)');
      setDescription(
        'The Scrutiny Desk has issued repetitive queries requesting documents previously verified and accepted on the DigiLocker MahaVault repository, in direct contravention of Section 3(2) of the Maharashtra Right to Public Services Act 2015.'
      );
      setReliefSought('Quashing of the redundant query notice and immediate processing without fresh documentation.');
    }
  }, [searchParams]);

  const fetchGrievances = async () => {
    try {
      const res = await fetch('/api/v1/grievances');
      const data = await res.json();
      if (data.success) {
        setGrievances(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleAppSelect = (appId: string) => {
    setSelectedAppId(appId);
    const preset = PRESET_APPLICATIONS.find(p => p.id === appId);
    if (preset) {
      setDepartment(preset.dept);
      if (preset.id === 'APOS-ENV01-301928') {
        setTitle('Appeal against Repetitive Documentation Query (Sec 3(2))');
        setDescription('MPCB Scrutiny desk raised repeated demands for physical lease panchnama previously verified on DigiLocker MahaVault.');
        setReliefSought('Quash redundant query notice and enforce Repetitive Scrutiny Shield with deemed Consent to Establish.');
      } else if (preset.id === 'APOS-PUNE-MIDC-01-2026-9812') {
        setTitle('Statutory 30-Day SLA Expired: Building Commencement Withheld');
        setDescription('The Designated Planning Authority has exceeded the 30-day statutory SLA under Section 4(1) of Maharashtra RTS Act 2015.');
        setReliefSought('Direction for immediate issuance of Building Commencement Certificate under deemed provisions.');
      } else {
        setTitle('MSEDCL HT Load Feasibility Sanction Overdue');
        setDescription('Demand note delayed past 15-day RTS timeline despite field technical inspection approval.');
        setReliefSought('Direct Superintending Engineer to release demand note and sanction letter immediately.');
      }
    }
  };

  const handleApplyPresetGround = (groundType: 'SLA_BREACH' | 'REPETITIVE_QUERY' | 'ARBITRARY_REJECTION') => {
    if (groundType === 'SLA_BREACH') {
      setTitle('Statutory SLA Expired: Failure of Designated Officer (Sec 4(1))');
      setDescription('The stipulated statutory period mandated under the Maharashtra Right to Public Services Act, 2015 has elapsed without reasoned communication. The applicant seeks immediate intervention.');
      setReliefSought('Mandate immediate clearance issuance and record officer delay for penal proceedings under Section 19(8).');
    } else if (groundType === 'REPETITIVE_QUERY') {
      setTitle('Statutory First Appeal: Contravention of Single Scrutiny Mandate (Sec 3(2))');
      setDescription('Designated scrutiny desk raised piecemeal objections subsequent to initial verification, directly contravening Maharashtra RTS Act Section 3(2) (Repetitive Scrutiny Shield).');
      setReliefSought('Quash the supplementary query notice and direct clearance within 48 hours.');
    } else {
      setTitle('Statutory Appeal: Arbitrary Rejection without Reasoned Speaking Order');
      setDescription('Application summarily rejected without providing statutory opportunity of hearing or a speaking order as mandated under RTS Rules 2016.');
      setReliefSought('Set aside the rejection order, conduct de novo review, and grant hearing before First Appellate Authority.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          applicationId: selectedAppId,
          department,
          appealTier: selectedTier,
          statutorySection: selectedTier === 'TIER_3_SECOND_APPEAL' 
            ? 'SECTION_19_SECOND_APPEAL' 
            : selectedTier === 'TIER_2_FIRST_APPEAL' 
            ? 'SECTION_18_FIRST_APPEAL' 
            : 'SECTION_9_COMPLAINT',
          appellateAuthority: selectedTier === 'TIER_3_SECOND_APPEAL'
            ? 'Chief Commissioner, Maharashtra State Right to Services Commission'
            : selectedTier === 'TIER_2_FIRST_APPEAL'
            ? 'District Collector & First Appellate Authority, Pune'
            : 'Designated Department Nodal Officer',
          reliefSought,
          appellantDetails: {
            companyName: currentIndustrialist?.companyName || currentProfile?.companyName || 'Sahyadri EV Battery Systems Pvt Ltd',
            authorizedPerson: currentIndustrialist?.fullName || 'Mr. Vikram Deshmukh',
            pan: currentIndustrialist?.pan || 'AABCS8819Q',
            phone: currentIndustrialist?.phone || '+91 98220 54321',
            email: currentIndustrialist?.email || 'vikram.deshmukh@sahyadri-battery.in'
          }
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGrievances((prev) => [data.data, ...prev]);
        setSubmittedTicket(data.data.ticketNumber);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGrievances = grievances.filter(g => {
    if (activeFilter === 'TIER_1') return g.appealTier === 'TIER_1_GRIEVANCE';
    if (activeFilter === 'TIER_2') return g.appealTier === 'TIER_2_FIRST_APPEAL';
    if (activeFilter === 'TIER_3') return g.appealTier === 'TIER_3_SECOND_APPEAL';
    return true;
  });

  const legalAppealMemo = `BEFORE THE FIRST APPELLATE AUTHORITY / DISTRICT COLLECTOR, PUNE
UNDER SECTION 18 OF THE MAHARASHTRA RIGHT TO PUBLIC SERVICES ACT, 2015
MEMORANDUM OF FIRST APPEAL (FORM 1, RULE 5)

IN THE MATTER OF:
Appellant: ${currentIndustrialist?.companyName || currentProfile?.companyName || 'Sahyadri EV Battery Systems Pvt Ltd'}
Represented by: ${currentIndustrialist?.fullName || 'Mr. Vikram Deshmukh'}, ${currentIndustrialist?.designation || 'Managing Director'}
PAN: ${currentIndustrialist?.pan || 'AABCS8819Q'} | Udyam: ${currentIndustrialist?.udyamNumber || 'UDYAM-MH-26-008219'}
Address: Plot PAP-E-44, MIDC Chakan Phase II, Taluka Khed, District Pune - 410501

VERSUS

Respondent / Designated Officer:
1. Designated Officer & Executive Engineer, ${department}
2. Single Window Scrutiny Cell, MAITRI, Govt of Maharashtra

APPLICATION DETAILS:
Application Tracking Number: ${selectedAppId}
Subject Matter: ${title}
Statutory Service Mandate: Maharashtra RTS Act 2015, Schedule Entry #14 (Industrial Building Clearances)
Prescribed Statutory Time Limit: 30 Working Days

STATEMENT OF FACTS & GROUNDS OF APPEAL:
1. The Appellant duly filed the Common Application Form (CAF) on the state single-window portal with 100% pre-validated DigiLocker MahaVault documents.
2. The Designated Officer failed to deliver the statutory service within the prescribed timeline of 30 days as mandated under Section 4(1) of the Act.
3. ${description}
4. That the action / inaction of the Designated Officer violates Section 3(2) of the Maharashtra Right to Public Services Act 2015, which prohibits repetitive and piecemeal scrutiny.

PRAYER / RELIEF SOUGHT:
The Appellant therefore humbly prays that the First Appellate Authority may be pleased to:
a) Direct the Designated Officer to immediately issue the statutory clearance/approval within 48 hours;
b) Mandate Deemed Approval under Section 4(1) of the Act;
c) Initiate penal proceedings against the defaulting officer under Section 19(8) of the Act.

VERIFICATION:
I, the Appellant above-named, do hereby verify that the contents of this Appeal are true to my personal knowledge and official records.
Dated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
Place: Pune, Maharashtra`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Title & Statutory Preamble */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">
            <Scale className="h-3.5 w-3.5" />
            Maharashtra Right to Public Services Act 2015 (MRTPS Act)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
            <Gavel className="h-3.5 w-3.5" />
            Sections 18 & 19 Statutory Escalation Matrix
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
            <DollarSign className="h-3 w-3" />
            Sec 19(8) Officer Penalty: ₹250/day up to ₹5,000
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Scale className="h-7 w-7 text-rose-400" />
          RTS Statutory Two-Tier Appeal & Grievance Escalator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-1">
          Lodge enforceable appeals under the Maharashtra Right to Public Services Act 2015 against designated officer delays, unreasonable documentation queries, or arbitrary rejections. Summons and hearings are automatically recorded before District Collectorates and the State RTS Commission.
        </p>
      </div>

      {/* Main Grid: Form on Left (5 cols), Active Docket on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Statutory Appeal Filing Engine */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md shadow-xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Gavel className="h-4 w-4 text-rose-400" />
              Lodge Statutory Appeal / Grievance
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select legal tier according to Maharashtra Right to Public Services Rules 2016.
            </p>
          </div>

          {/* Tier Selector Radio Cards */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Statutory Appeal Tier & Jurisdiction:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Tier 1 */}
              <button
                type="button"
                onClick={() => setSelectedTier('TIER_1_GRIEVANCE')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedTier === 'TIER_1_GRIEVANCE'
                    ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-bold text-blue-400 uppercase">Tier 1 • Sec 9</div>
                <div className="text-xs font-bold text-white mt-0.5 leading-tight">Dept Grievance</div>
                <div className="text-[10px] text-slate-400 mt-1">7-Day SLA • Nodal Head</div>
              </button>

              {/* Tier 2 */}
              <button
                type="button"
                onClick={() => setSelectedTier('TIER_2_FIRST_APPEAL')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedTier === 'TIER_2_FIRST_APPEAL'
                    ? 'border-amber-500 bg-amber-950/40 ring-1 ring-amber-500'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-bold text-amber-400 uppercase">Tier 2 • Sec 18</div>
                <div className="text-xs font-bold text-white mt-0.5 leading-tight">First Appeal</div>
                <div className="text-[10px] text-slate-400 mt-1">30-Day SLA • Collector</div>
              </button>

              {/* Tier 3 */}
              <button
                type="button"
                onClick={() => setSelectedTier('TIER_3_SECOND_APPEAL')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedTier === 'TIER_3_SECOND_APPEAL'
                    ? 'border-rose-500 bg-rose-950/40 ring-1 ring-rose-500'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-bold text-rose-400 uppercase">Tier 3 • Sec 19</div>
                <div className="text-xs font-bold text-white mt-0.5 leading-tight">Second Appeal</div>
                <div className="text-[10px] text-slate-400 mt-1">Commission • Penalty</div>
              </button>
            </div>

            {/* Tier Summary Explanation */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-[11px] text-slate-300">
              {selectedTier === 'TIER_1_GRIEVANCE' && (
                <div className="space-y-1">
                  <div className="font-bold text-blue-400">Jurisdiction: Departmental Nodal Officer (Sec 9)</div>
                  <div>For administrative delays, technical portal issues, or initial document clarification disputes.</div>
                </div>
              )}
              {selectedTier === 'TIER_2_FIRST_APPEAL' && (
                <div className="space-y-1">
                  <div className="font-bold text-amber-400">Jurisdiction: District Collector & First Appellate Authority (Sec 18)</div>
                  <div>For statutory 30-day SLA breaches or refusal of clearance without reasoned speaking order. Collector possesses powers of inquiry and witness summons.</div>
                </div>
              )}
              {selectedTier === 'TIER_3_SECOND_APPEAL' && (
                <div className="space-y-1">
                  <div className="font-bold text-rose-400">Jurisdiction: Chief Commissioner, Maharashtra State RTS Commission (Sec 19)</div>
                  <div>Statutory apex body. Holds legal power to issue Deemed Approvals and impose personal fines of ₹250/day up to ₹5,000 on defaulting officers under Sec 19(8).</div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Linked Application Selection */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Select Delayed or Queried Clearance:
              </label>
              <select
                value={selectedAppId}
                onChange={(e) => handleAppSelect(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PRESET_APPLICATIONS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.id} — {preset.name.slice(0, 38)}... (+{preset.daysOverdue}d overdue)
                  </option>
                ))}
              </select>
            </div>

            {/* Nodal Department */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Designated Department / Authority:
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Quick Grounds Preset Buttons */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">
                  Quick Legal Grounds:
                </label>
                <span className="text-[10px] text-slate-400">1-click statutory citations</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyPresetGround('SLA_BREACH')}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] font-medium text-slate-300 hover:text-white hover:border-amber-500/50 transition-colors"
                >
                  ⏱️ SLA Expired (Sec 4(1))
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetGround('REPETITIVE_QUERY')}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] font-medium text-slate-300 hover:text-white hover:border-blue-500/50 transition-colors"
                >
                  🛡️ Repetitive Query (Sec 3(2))
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetGround('ARBITRARY_REJECTION')}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] font-medium text-slate-300 hover:text-white hover:border-rose-500/50 transition-colors"
                >
                  🚫 Arbitrary Rejection
                </button>
              </div>
            </div>

            {/* Appeal Title */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Statutory Appeal Subject / Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Failure to dispose clearance within 30 days under RTS Act Section 4(1)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Grounds Description */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Statement of Facts & Ground of Appeal:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
              />
            </div>

            {/* Relief Sought / Prayer */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Relief / Prayer Sought before Appellate Authority:
              </label>
              <input
                type="text"
                value={reliefSought}
                onChange={(e) => setReliefSought(e.target.value)}
                placeholder="e.g. Mandate Deemed Approval under Sec 4(1) and impose penal cost on officer"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Legal Auto-Drafter Preview Trigger */}
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowLegalDraftModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>📜 Preview Legal Memo (Form 1 / Form 2)</span>
              </button>
              <span className="text-[10px] text-slate-500 font-mono">RTS Rules 2016</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-amber-600 to-indigo-600 py-2.5 px-4 font-bold text-white shadow-lg shadow-rose-600/20 hover:brightness-110 disabled:opacity-40 transition-all text-xs"
            >
              <Send className="h-3.5 w-3.5" />
              {isSubmitting ? 'Registering with Collectorate...' : '⚖️ File Statutory Appeal under RTS Act'}
            </button>
          </form>

          {/* Submission Feedback Banner */}
          {submittedTicket && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-emerald-300 text-center animate-fade-in">
              <CheckCircle2 className="mx-auto h-5 w-5 mb-1 text-emerald-400" />
              <div className="font-bold text-xs">Statutory Appeal Successfully Registered!</div>
              <div className="font-mono text-[11px] mt-0.5">Docket / Summons #: {submittedTicket}</div>
              <p className="text-[10px] text-emerald-400/80 mt-1">
                Notice dispatched to Respondent Officer. First hearing scheduled in 7 days before District Collectorate.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Active Appeals Docket & Collector Hearings */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md shadow-xl space-y-4">
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="h-4 w-4 text-amber-400" />
                  Active Appeals & Collector Docket ({grievances.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time hearing schedule, summons status, and officer delay penalty tracker.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  onClick={() => setActiveFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    activeFilter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({grievances.length})
                </button>
                <button
                  onClick={() => setActiveFilter('TIER_2')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    activeFilter === 'TIER_2' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sec 18 Collector
                </button>
                <button
                  onClick={() => setActiveFilter('TIER_3')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    activeFilter === 'TIER_3' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sec 19 Commission
                </button>
              </div>
            </div>

            {/* Docket Items */}
            <div className="space-y-3.5">
              {filteredGrievances.map((grv) => {
                const isSec18 = grv.appealTier === 'TIER_2_FIRST_APPEAL';
                const isSec19 = grv.appealTier === 'TIER_3_SECOND_APPEAL';
                const isEscalated = grv.status === 'ESCALATED_TO_COLLECTOR' || grv.status === 'HEARING_SCHEDULED';

                return (
                  <div
                    key={grv.id}
                    className={`rounded-xl border p-4 text-xs space-y-3 transition-all ${
                      isSec19
                        ? 'border-rose-500/40 bg-rose-950/15'
                        : isSec18
                        ? 'border-amber-500/40 bg-amber-950/15'
                        : 'border-slate-800 bg-slate-950'
                    }`}
                  >
                    {/* Top Row: Ticket & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-amber-400">
                            {grv.ticketNumber}
                          </span>
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                            isSec19 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                              : isSec18 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {isSec19 ? '⚖️ RTS Sec 19 Second Appeal' : isSec18 ? '🏛️ RTS Sec 18 First Appeal' : '📋 Sec 9 Grievance'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Ref: {grv.applicationId}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm mt-1">
                          {grv.title}
                        </h4>
                      </div>

                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 self-start sm:self-center ${
                        isEscalated
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                          : grv.status === 'ORDER_PASSED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}>
                        {grv.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Grounds Description */}
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {grv.description}
                    </p>

                    {/* Relief Sought Pill */}
                    {grv.reliefSought && (
                      <div className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-[11px] text-slate-300">
                        <span className="font-bold text-amber-400">Prayer / Relief: </span>
                        <span>{grv.reliefSought}</span>
                      </div>
                    )}

                    {/* Meta: Forum & Hearing Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="rounded-lg bg-slate-950 p-2 border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 block font-semibold">Appellate Forum:</span>
                        <span className="font-bold text-white truncate block">{grv.appellateAuthority || grv.department}</span>
                      </div>
                      <div className="rounded-lg bg-slate-950 p-2 border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 block font-semibold">Statutory Target / Hearing:</span>
                        <span className="font-bold text-amber-300 truncate block">
                          {grv.hearingDate 
                            ? `📅 Hearing: ${new Date(grv.hearingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` 
                            : `Target SLA: ${grv.targetResolutionDate.split('T')[0]}`}
                        </span>
                      </div>
                    </div>

                    {/* Officer Remarks or Statutory Order */}
                    {grv.rtsOrderDetails && (
                      <div className="rounded-lg bg-emerald-950/20 border border-emerald-500/30 p-2.5 text-[11px] text-emerald-300">
                        <strong className="text-emerald-400 block mb-0.5">Statutory Ruling / Order:</strong>
                        {grv.rtsOrderDetails}
                      </div>
                    )}

                    {/* Action Bar: View Summons & Satisfaction Rating */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSelectedNotice(grv)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-slate-200 font-bold transition-colors"
                      >
                        <FileText className="h-3 w-3 text-amber-400" />
                        <span>View Official Notice / Summons</span>
                      </button>

                      {/* Citizen Feedback Rating */}
                      <div className="flex items-center gap-1.5 ml-auto">
                        <span className="text-[10px] text-slate-400">Citizen Rating:</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingSubmitted({ ...ratingSubmitted, [grv.id]: star })}
                              className={`p-0.5 transition-colors ${
                                (ratingSubmitted[grv.id] ?? 0) >= star
                                  ? 'text-amber-400'
                                  : 'text-slate-600 hover:text-amber-400'
                              }`}
                            >
                              <Star className="h-3 w-3 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statutory Framework Reference Accordion */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Info className="h-4 w-4 text-blue-400" />
              Maharashtra Right to Public Services Act 2015 — Statutory Provisions
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-300">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 space-y-1">
                <span className="font-bold text-blue-400 block">Section 3(2) — Repetitive Scrutiny Shield</span>
                <p className="text-slate-400">
                  Every public authority must scrutinize applications in a single unified review. Piecemeal and repeated queries for already-verified documents are expressly prohibited.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 space-y-1">
                <span className="font-bold text-amber-400 block">Section 4(1) — Mandatory Statutory SLA</span>
                <p className="text-slate-400">
                  Industrialists possess the legal right to obtain public service within the designated period. Failure confers immediate right of First Appeal.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 space-y-1">
                <span className="font-bold text-purple-400 block">Section 18 — First Appeal to Collector</span>
                <p className="text-slate-400">
                  Aggrieved applicant may file First Appeal within 30 days before the First Appellate Authority (District Collector) who must dispose of it within 30 days.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 space-y-1">
                <span className="font-bold text-rose-400 block">Section 19(8) — Officer Delay Penalty</span>
                <p className="text-slate-400">
                  The Commission is mandated to levy a penalty of ₹250 per day (maximum ₹5,000) directly from the salary of the defaulting public officer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Legal Appeal Memorandum (Form 1 / Form 2 Auto-Draft) */}
      {showLegalDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-amber-500/40 bg-slate-900 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Form 1: Memorandum of First Appeal (RTS Rules 2016)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLegalDraftModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-400">
              This statutory legal memorandum is auto-drafted under Rule 5 of the Maharashtra Right to Public Services Rules, 2016. You can copy or print this directly for the District Collectorate hearing.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-200 whitespace-pre-wrap max-h-[380px] overflow-y-auto leading-relaxed selection:bg-amber-500/30">
              {legalAppealMemo}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Verified Legal Citation Format
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(legalAppealMemo);
                    setCopiedDraft(true);
                    setTimeout(() => setCopiedDraft(false), 2000);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-2 text-xs font-bold text-slate-950 transition-all"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedDraft ? 'Copied to Clipboard!' : 'Copy Legal Memo'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-bold text-white transition-all"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Memo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Official Hearing Notice / Statutory Summons */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Official Statutory Notice / Docket
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center text-amber-400 font-mono font-bold">
                <span>DOCKET #: {selectedNotice.ticketNumber}</span>
                <span>SEC {selectedNotice.statutorySection === 'SECTION_19_SECOND_APPEAL' ? '19' : '18'}</span>
              </div>
              <div className="text-white font-bold text-sm">
                {selectedNotice.title}
              </div>
              <div className="text-slate-300 text-[11px]">
                Appellate Forum: <strong className="text-white">{selectedNotice.appellateAuthority}</strong>
              </div>
              {selectedNotice.hearingDate && (
                <div className="text-emerald-300 font-bold text-[11px] pt-1">
                  📅 Statutory Hearing: {new Date(selectedNotice.hearingDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="font-semibold text-white">Official Direction / Note:</div>
              <p className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-[11px] leading-relaxed text-slate-400">
                {selectedNotice.officerRemarks || selectedNotice.rtsOrderDetails || 'Notice served to respondent officer. Submissions required 24 hours prior to hearing.'}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition-all"
              >
                Close Docket View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GrievancePortalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Statutory Appeal Engine...</div>}>
      <GrievanceContent />
    </Suspense>
  );
}
