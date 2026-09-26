'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  useAppStore, 
  SEED_INDUSTRIALISTS, 
  SEED_OFFICERS, 
  SEED_DEPT_ADMINS,
  SEED_STATE_ADMINS,
  UserRole,
  DepartmentAdminAccount,
  StateAdminAccount
} from '@/lib/store';
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2, 
  Lock, 
  Layers, 
  Zap, 
  Phone, 
  Mail, 
  UserCheck, 
  FileCheck2,
  Flame,
  BadgeCheck,
  Crown,
  Briefcase,
  Sliders,
  Landmark,
  FileBadge,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

type LoginRoleTab = 'APPLICANT' | 'OFFICER' | 'DEPT_ADMIN' | 'STATE_ADMIN';

export default function LoginPage() {
  const router = useRouter();
  const { 
    loginIndustrialist, 
    loginOfficer, 
    loginDeptAdmin,
    loginStateAdmin,
    setActiveRole,
    loadDemoProfile
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<LoginRoleTab>('APPLICANT');
  const [showPassword, setShowPassword] = useState(false);
  
  // 1. Applicant Form State
  const [applicantMobile, setApplicantMobile] = useState('9822054321');
  const [applicantOtp, setApplicantOtp] = useState('789123');
  const [applicantAuthMode, setApplicantAuthMode] = useState<'OTP' | 'PAN'>('OTP');
  const [applicantPan, setApplicantPan] = useState('AABCS8819Q');

  // 2. Officer Form State
  const [officialEmail, setOfficialEmail] = useState('ramesh.mpcb@maharashtra.gov.in');
  const [officialPassword, setOfficialPassword] = useState('••••••••••••');
  const [selectedDeptKey, setSelectedDeptKey] = useState<string>('MPCB_PUNE');

  // 3. Department Admin Form State
  const [selectedDeptAdminKey, setSelectedDeptAdminKey] = useState<string>('MPCB_HOD');
  const [deptAdminDscPin, setDeptAdminDscPin] = useState('881944');
  const [deptAdminEmail, setDeptAdminEmail] = useState('ms.mpcb@maharashtra.gov.in');

  // 4. State Administration Admin Form State
  const [selectedStateAdminKey, setSelectedStateAdminKey] = useState<string>('PRINCIPAL_SECRETARY');
  const [stateAdminKey, setStateAdminKey] = useState('MAHA-APEX-2026-RTS');
  const [stateAdminEmail, setStateAdminEmail] = useState('psec.ind@maharashtra.gov.in');

  // Success trigger helper
  const triggerSuccessEffects = (destination: string) => {
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C33764', '#1E2958', '#38BDF8', '#10B981']
    });
    setTimeout(() => {
      router.push(destination);
    }, 250);
  };

  // Handlers
  const handleApplicantLogin = (accountKey?: string) => {
    const key = accountKey || 'EV_PUNE';
    const account = SEED_INDUSTRIALISTS[key] || SEED_INDUSTRIALISTS.EV_PUNE;
    
    // Sync business profile
    if (key === 'PHARMA_AURIC') loadDemoProfile('PHARMA_AURANGABAD');
    else if (key === 'FOOD_NASHIK') loadDemoProfile('FOOD_NASHIK');
    else if (key === 'SOLAR_NAGPUR') loadDemoProfile('SOLAR_NAGPUR');
    else loadDemoProfile('EV_PUNE');

    loginIndustrialist(account);
    setActiveRole('APPLICANT');
    triggerSuccessEffects('/portal/applications');
  };

  const handleOfficerLogin = (officerKey?: string) => {
    const key = officerKey || selectedDeptKey;
    const officer = SEED_OFFICERS[key] || SEED_OFFICERS.MPCB_PUNE;
    
    loginOfficer(officer);
    setActiveRole('OFFICER');
    triggerSuccessEffects('/officer');
  };

  const handleDeptAdminLogin = (deptAdminKey?: string) => {
    const key = deptAdminKey || selectedDeptAdminKey;
    const admin = SEED_DEPT_ADMINS[key] || SEED_DEPT_ADMINS.MPCB_HOD;

    loginDeptAdmin(admin);
    setActiveRole('DEPT_ADMIN');
    triggerSuccessEffects('/officer?tab=inspections');
  };

  const handleStateAdminLogin = (adminKey?: string) => {
    const key = adminKey || selectedStateAdminKey;
    const admin = SEED_STATE_ADMINS[key] || SEED_STATE_ADMINS.PRINCIPAL_SECRETARY;

    loginStateAdmin(admin);
    setActiveRole('STATE_ADMIN');
    triggerSuccessEffects('/admin');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#C33764]/20 via-indigo-600/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-[500px] h-[300px] bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl w-full space-y-8 relative z-10">
        
        {/* Amazon-style Sovereign Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            <span>Government of Maharashtra • Single Sign-On (SSO) & RBAC Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Anumati<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-indigo-400">One</span> Access Portal
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Enterprise Single Sign-On powered by <strong>MeriPehchan & Parichay SSO</strong>. Select your authorized governance tier below for direct access to single-window services, regulatory scrutiny, departmental oversight, or apex state telemetry.
          </p>
        </div>

        {/* 4-Tier Role Navigation Switcher (Amazon Bar Raiser UI) */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-4 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-2xl gap-1 w-full max-w-4xl">
            
            {/* Tab 1: Applicant */}
            <button
              onClick={() => setActiveTab('APPLICANT')}
              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'APPLICANT'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">Industrialist & Investor Gateway</span>
            </button>

            {/* Tab 2: Officer */}
            <button
              onClick={() => setActiveTab('OFFICER')}
              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'OFFICER'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 ring-1 ring-purple-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="truncate">Government Official Desk (Parichay)</span>
            </button>

            {/* Tab 3: Department Admin */}
            <button
              onClick={() => setActiveTab('DEPT_ADMIN')}
              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'DEPT_ADMIN'
                  ? 'bg-gradient-to-r from-[#C33764] to-pink-600 text-white shadow-lg shadow-[#C33764]/25 ring-1 ring-rose-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sliders className="h-4 w-4 shrink-0" />
              <span className="truncate">Department Admin (HOD)</span>
            </button>

            {/* Tab 4: State Admin */}
            <button
              onClick={() => setActiveTab('STATE_ADMIN')}
              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'STATE_ADMIN'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Crown className="h-4 w-4 shrink-0" />
              <span className="truncate">State Administration Admin</span>
            </button>
          </div>
        </div>

        {/* Content Box with Role Forms & Evaluator Launchers */}
        <div className="transition-all duration-300">
          
          {/* ===================================================
             GATEWAY 1: INDUSTRIALIST / APPLICANT REALM
             =================================================== */}
          {activeTab === 'APPLICANT' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/70 border border-blue-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
              {/* Left: Applicant Form */}
              <div className="lg:col-span-6 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      Tier 1 • Citizen & Enterprise
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="h-3 w-3" /> DigiLocker Linked
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Industrialist & Investor Gateway
                  </h2>
                  <p className="text-xs text-slate-300">
                    Apply for 28 unified statutory clearances, submit Single CAF, track RTS SLA timers, and claim PSI 2019/2024 fiscal incentives.
                  </p>
                </div>

                {/* Sub-modes: OTP vs PAN */}
                <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setApplicantAuthMode('OTP')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      applicantAuthMode === 'OTP'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Aadhaar / Mobile OTP
                  </button>
                  <button
                    onClick={() => setApplicantAuthMode('PAN')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      applicantAuthMode === 'PAN'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Company PAN / GSTIN
                  </button>
                </div>

                <div className="space-y-3.5 pt-1">
                  {applicantAuthMode === 'OTP' ? (
                    <>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Registered Mobile Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                          <input
                            type="text"
                            value={applicantMobile}
                            onChange={(e) => setApplicantMobile(e.target.value)}
                            placeholder="+91 98220 54321"
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-300">
                            Security Verification Code (OTP)
                          </label>
                          <span className="text-[10px] text-emerald-400 font-mono">Demo OTP: 789123</span>
                        </div>
                        <div className="relative">
                          <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                          <input
                            type="text"
                            value={applicantOtp}
                            onChange={(e) => setApplicantOtp(e.target.value)}
                            placeholder="789123"
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-mono tracking-widest"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Enterprise PAN (10 Characters)
                        </label>
                        <input
                          type="text"
                          value={applicantPan}
                          onChange={(e) => setApplicantPan(e.target.value)}
                          placeholder="AABCS8819Q"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white uppercase font-mono placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          State GSTIN (27-Prefix Maharashtra)
                        </label>
                        <input
                          type="text"
                          defaultValue="27AABCS8819Q1ZP"
                          readOnly
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs text-emerald-400 font-mono focus:outline-none"
                        />
                      </div>
                    </>
                  )}

                  <button
                    onClick={() => handleApplicantLogin('EV_PUNE')}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-3 px-4 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-[0.99] mt-2 group"
                  >
                    <span>Sign In to Applicant Dashboard</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>Statutory protection under Maharashtra Right to Services (RTS) Act 2015</span>
                </div>
              </div>

              {/* Right: Evaluator Quick Launcher */}
              <div className="lg:col-span-6 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-blue-400" />
                    Jury / Evaluator 1-Click Launchers
                  </span>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    Instant Access
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Click any pre-seeded Maharashtra enterprise below to test real-time applications, clearances, and subsidies without typing:
                </p>

                <div className="space-y-2 pt-1">
                  {[
                    {
                      key: 'EV_PUNE',
                      name: 'Aegis Lithium Mobility Pvt Ltd',
                      sector: '⚡ EV & Battery (Pune Chakan MIDC)',
                      tag: 'Zone B • ₹120 Cr Outlay',
                      color: 'hover:border-blue-500/50 hover:bg-blue-950/20',
                    },
                    {
                      key: 'PHARMA_AURIC',
                      name: 'Vanguard Biopharma Life Sciences',
                      sector: '💊 Bulk Drugs & ZLD (AURIC Shendra)',
                      tag: 'Zone D+ • ₹85 Cr Outlay',
                      color: 'hover:border-rose-500/50 hover:bg-rose-950/20',
                    },
                    {
                      key: 'FOOD_NASHIK',
                      name: 'Godavari Valley Agro Foods Ltd',
                      sector: '🌾 Food Processing MSME (Nashik Food Park)',
                      tag: 'Zone C • ₹22 Cr Outlay',
                      color: 'hover:border-purple-500/50 hover:bg-purple-950/20',
                    },
                    {
                      key: 'SOLAR_NAGPUR',
                      name: 'Helios Photovoltaics India Ltd',
                      sector: '☀️ Solar Cell Tech (MIHAN SEZ Nagpur)',
                      tag: 'Zone D+ • ₹45 Cr Outlay',
                      color: 'hover:border-emerald-500/50 hover:bg-emerald-950/20',
                    },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleApplicantLogin(item.key)}
                      className={`w-full text-left p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/50 ${item.color} transition-all flex items-center justify-between group`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.sector}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-emerald-400 block">{item.tag}</span>
                        <span className="text-[10px] text-blue-400 font-semibold group-hover:underline flex items-center gap-0.5 justify-end mt-0.5">
                          Launch <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
             GATEWAY 2: GOVERNMENT OFFICER DESK (PARICHAY SSO)
             =================================================== */}
          {activeTab === 'OFFICER' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/70 border border-purple-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
              {/* Left: Officer Form */}
              <div className="lg:col-span-6 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      Tier 2 • Department Scrutiny Desk
                    </span>
                    <span className="text-[10px] text-purple-300 font-semibold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Parichay Gov SSO
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Government Official Desk (Parichay)
                  </h2>
                  <p className="text-xs text-slate-300">
                    Desk officers process applications, scrutinize MahaVault verified documents under RTS Sec 3(2), and schedule synchronized joint inspections.
                  </p>
                </div>

                <div className="space-y-3.5 pt-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Official Email (@maharashtra.gov.in)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        value={officialEmail}
                        onChange={(e) => setOfficialEmail(e.target.value)}
                        placeholder="officer@maharashtra.gov.in"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Department Authority & Jurisdiction
                    </label>
                    <select
                      value={selectedDeptKey}
                      onChange={(e) => setSelectedDeptKey(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-purple-300 focus:border-purple-500 focus:outline-none font-medium"
                    >
                      <option value="MPCB_PUNE">MPCB — Pollution Control Board (Sub-Regional Office, Pune)</option>
                      <option value="MIDC_SPA">MIDC — Special Planning Authority (SPA Land & Building Plan)</option>
                      <option value="DISH_FACTORIES">DISH — Directorate of Industrial Safety & Health</option>
                      <option value="MSEDCL_POWER">MSEDCL — Mahavitaran Electricity DISCOM</option>
                      <option value="FIRE_SERVICES">Maharashtra Fire Services Command (MIDC Circle)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Parichay Officer Password / Security Token
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={officialPassword}
                        onChange={(e) => setOfficialPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-10 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOfficerLogin()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 py-3 px-4 text-xs font-bold text-white shadow-lg shadow-purple-500/20 transition-all active:scale-[0.99] mt-2 group"
                  >
                    <span>Sign In to Officer Scrutiny Cockpit</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <BadgeCheck className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                  <span>Authorized for RTS Section 3(2) Cross-Acceptance and Section 4(1) Actions</span>
                </div>
              </div>

              {/* Right: Evaluator Officer Selector */}
              <div className="lg:col-span-6 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-purple-400" />
                    Jury / Evaluator 1-Click Launchers
                  </span>
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    Official Desk
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Click any departmental officer to inspect their customized scrutiny queue, pending queries, and joint site visit scheduler:
                </p>

                <div className="space-y-2 pt-1">
                  {[
                    {
                      key: 'MPCB_PUNE',
                      name: 'Er. Ramesh Kulkarni',
                      role: 'Sub-Regional Officer • MPCB Pune',
                      jurisdiction: 'Pollution Consents (CTE / CTO)',
                      badge: 'GOM-MPCB-2016-8812',
                    },
                    {
                      key: 'MIDC_SPA',
                      name: 'Ar. Sneha Deshpande',
                      role: 'Executive Engineer (SPA) • MIDC Planning',
                      jurisdiction: 'Land Possession & CAD Building Plans',
                      badge: 'GOM-MIDC-2018-4421',
                    },
                    {
                      key: 'DISH_FACTORIES',
                      name: 'Er. Dilip Patil',
                      role: 'Joint Director & Factory Inspector • DISH',
                      jurisdiction: 'Factory License & Joint Site Visits',
                      badge: 'GOM-DISH-2014-1109',
                    },
                    {
                      key: 'MSEDCL_POWER',
                      name: 'Er. Vijay More',
                      role: 'Superintending Engineer • MSEDCL',
                      jurisdiction: 'HT Dedicated Feeder & Power Sanctions',
                      badge: 'GOM-MSEDCL-2015-7731',
                    },
                    {
                      key: 'FIRE_SERVICES',
                      name: 'CFO Sanjay Pawar',
                      role: 'Chief Fire Officer • Fire Command',
                      jurisdiction: 'Fire Safety NOC & High-Rise Sprinkler Audits',
                      badge: 'GOM-FIRE-2017-3390',
                    },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleOfficerLogin(item.key)}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/50 hover:border-purple-500/50 hover:bg-purple-950/20 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.role}</div>
                        <div className="text-[10px] text-purple-400 font-medium">{item.jurisdiction}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 block">
                          {item.badge}
                        </span>
                        <span className="text-[10px] text-purple-400 font-semibold group-hover:underline flex items-center gap-0.5 justify-end mt-1">
                          Review <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
             GATEWAY 3: DEPARTMENT ADMIN (HOD / DIRECTORATE)
             =================================================== */}
          {activeTab === 'DEPT_ADMIN' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/70 border border-rose-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
              {/* Left: Department Admin Form */}
              <div className="lg:col-span-6 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      Tier 3 • Department Administration
                    </span>
                    <span className="text-[10px] text-rose-300 font-semibold flex items-center gap-1">
                      <Sliders className="h-3 w-3" /> Directorate Admin HOD
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Department Administration
                  </h2>
                  <p className="text-xs text-slate-300">
                    Supervise department-wide clearance pipelines, reassign bottlenecked files, enforce RTS 2015 statutory timelines, and inspect cross-department joint audits.
                  </p>
                </div>

                <div className="space-y-3.5 pt-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Select Department Directorate
                    </label>
                    <select
                      value={selectedDeptAdminKey}
                      onChange={(e) => setSelectedDeptAdminKey(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-rose-300 focus:border-rose-500 focus:outline-none font-medium"
                    >
                      <option value="MPCB_HOD">MPCB HQ — Dr. Pravin Darade, IAS (Member Secretary)</option>
                      <option value="MIDC_CEO">MIDC HQ — Dr. P. Velrasu, IAS (Chief Executive Officer)</option>
                      <option value="DISH_DIRECTOR">DISH HQ — Shri S. P. Rathod (Director of Industrial Safety)</option>
                      <option value="MSEDCL_CMD">MSEDCL HQ — Shri Lokesh Chandra, IAS (Chairman & MD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Directorate Admin Gov Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        value={deptAdminEmail}
                        onChange={(e) => setDeptAdminEmail(e.target.value)}
                        placeholder="hod@maharashtra.gov.in"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        Class 3 DSC Digital Signature / Officer PIN
                      </label>
                      <span className="text-[10px] text-rose-400 font-mono">Demo PIN: 881944</span>
                    </div>
                    <div className="relative">
                      <FileBadge className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        value={deptAdminDscPin}
                        onChange={(e) => setDeptAdminDscPin(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeptAdminLogin()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C33764] to-pink-600 hover:from-[#A82650] hover:to-pink-700 py-3 px-4 text-xs font-bold text-white shadow-lg shadow-[#C33764]/25 transition-all active:scale-[0.99] mt-2 group"
                  >
                    <span>Sign In as Department Admin</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  <span>Empowered under Maharashtra Right to Services Act 2015 Section 5 Oversight</span>
                </div>
              </div>

              {/* Right: Evaluator Dept Admin Selector */}
              <div className="lg:col-span-6 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-rose-400" />
                    Jury / Evaluator 1-Click Launchers
                  </span>
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    Directorate HOD
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Select a State Directorate Head to inspect high-level department SLA queues, officer performance metrics, and bottleneck alerts:
                </p>

                <div className="space-y-2 pt-1">
                  {[
                    {
                      key: 'MPCB_HOD',
                      name: 'Dr. Pravin Darade, IAS',
                      role: 'Member Secretary • MPCB Directorate HQ',
                      focus: 'Statewide Environmental Consents & CPCB OCEMS',
                      code: 'GOM-IAS-2004-MPCB-01',
                    },
                    {
                      key: 'MIDC_CEO',
                      name: 'Dr. P. Velrasu, IAS',
                      role: 'Chief Executive Officer • MIDC HQ',
                      focus: 'Industrial Parks, Land Allotments & SPA Approvals',
                      code: 'GOM-IAS-2006-MIDC-01',
                    },
                    {
                      key: 'DISH_DIRECTOR',
                      name: 'Shri S. P. Rathod',
                      role: 'Director • Directorate of Industrial Safety & Health',
                      focus: 'Factory Licensing, Hazardous Units & Joint Audits',
                      code: 'GOM-DISH-2008-0012',
                    },
                    {
                      key: 'MSEDCL_CMD',
                      name: 'Shri Lokesh Chandra, IAS',
                      role: 'Chairman & Managing Director • MSEDCL',
                      focus: 'Industrial Power Feeders & Sub-Station Sanctions',
                      code: 'GOM-IAS-2005-MSEDCL-01',
                    },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleDeptAdminLogin(item.key)}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/50 hover:border-rose-500/50 hover:bg-rose-950/20 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.role}</div>
                        <div className="text-[10px] text-rose-400 font-medium">{item.focus}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-rose-300 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 block">
                          {item.code}
                        </span>
                        <span className="text-[10px] text-rose-400 font-semibold group-hover:underline flex items-center gap-0.5 justify-end mt-1">
                          Open HOD Desk <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
             GATEWAY 4: APEX STATE ADMINISTRATION ADMIN
             =================================================== */}
          {activeTab === 'STATE_ADMIN' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/70 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
              {/* Left: State Admin Form */}
              <div className="lg:col-span-6 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Tier 4 • Apex State Administration Admin
                    </span>
                    <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                      <Landmark className="h-3 w-3" /> Mantralaya Secretariat
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    State Administration Admin
                  </h2>
                  <p className="text-xs text-slate-300">
                    Apex oversight of Maharashtra's 36-district Ease of Doing Business index, statutory Deemed Approvals (RTS Sec 4(1)), and cross-department regulatory knowledge graph telemetry.
                  </p>
                </div>

                <div className="space-y-3.5 pt-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Select Apex State Administrator Authority
                    </label>
                    <select
                      value={selectedStateAdminKey}
                      onChange={(e) => setSelectedStateAdminKey(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-amber-300 focus:border-amber-500 focus:outline-none font-medium"
                    >
                      <option value="PRINCIPAL_SECRETARY">Principal Secretary (Industries) — Dr. Harshdeep Kamble, IAS</option>
                      <option value="CEO_MAITRI">CEO MAITRI & Dev Commissioner — Dr. Vipin Sharma, IAS</option>
                      <option value="EODB_COMMISSIONER">State RTS Commissioner & Ombudsman — Smt. Manisha Verma, IAS</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Secretariat Gov Email (@maharashtra.gov.in)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        value={stateAdminEmail}
                        onChange={(e) => setStateAdminEmail(e.target.value)}
                        placeholder="psec.ind@maharashtra.gov.in"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        Apex Secretariat Sovereign Token / Security Key
                      </label>
                      <span className="text-[10px] text-amber-400 font-mono">Demo: MAHA-APEX-2026-RTS</span>
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        value={stateAdminKey}
                        onChange={(e) => setStateAdminKey(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleStateAdminLogin()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 py-3 px-4 text-xs font-bold text-white shadow-lg shadow-amber-500/25 transition-all active:scale-[0.99] mt-2 group"
                  >
                    <span>Sign In to State EODB Intelligence Center</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <Landmark className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>Apex State Authority under Government of Maharashtra Gazette & EODB Cell</span>
                </div>
              </div>

              {/* Right: Evaluator State Admin Selector */}
              <div className="lg:col-span-6 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="h-4 w-4 text-amber-400" />
                    Jury / Evaluator 1-Click Launchers
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Apex Council
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Click any Apex State Administrator to view statewide macro EODB metrics, district clearance speeds, and RTS Section 19 appellate dockets:
                </p>

                <div className="space-y-2 pt-1">
                  {[
                    {
                      key: 'PRINCIPAL_SECRETARY',
                      name: 'Dr. Harshdeep Kamble, IAS',
                      role: 'Principal Secretary (Industries) • Govt of Maharashtra',
                      scope: '36 Districts • Mega Project Inward FDI & Policy',
                      id: 'GOM-IAS-1997-SEC-01',
                    },
                    {
                      key: 'CEO_MAITRI',
                      name: 'Dr. Vipin Sharma, IAS',
                      role: 'Development Commissioner & CEO MAITRI',
                      scope: 'Single-Window Clearances & Digital Twin Orchestration',
                      id: 'GOM-IAS-2005-MAITRI-01',
                    },
                    {
                      key: 'EODB_COMMISSIONER',
                      name: 'Smt. Manisha Verma, IAS',
                      role: 'State Right to Services Commissioner',
                      scope: 'RTS Sec 19 Second Appeals & Officer Penalty Audits',
                      id: 'GOM-IAS-2002-RTS-01',
                    },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleStateAdminLogin(item.key)}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/50 hover:border-amber-500/50 hover:bg-amber-950/20 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.role}</div>
                        <div className="text-[10px] text-amber-400 font-medium">{item.scope}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 block">
                          {item.id}
                        </span>
                        <span className="text-[10px] text-amber-400 font-semibold group-hover:underline flex items-center gap-0.5 justify-end mt-1">
                          View EODB Center <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
