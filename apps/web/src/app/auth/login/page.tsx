'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, SEED_INDUSTRIALISTS, SEED_OFFICERS, UserRole } from '@/lib/store';
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
  BadgeCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const router = useRouter();
  const { 
    loginIndustrialist, 
    loginOfficer, 
    setActiveRole,
    loadDemoProfile
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'APPLICANT' | 'OFFICIAL'>('APPLICANT');
  
  // Applicant Form State
  const [applicantMobile, setApplicantMobile] = useState('9822054321');
  const [applicantOtp, setApplicantOtp] = useState('789123');
  const [isOtpSent, setIsOtpSent] = useState(true);

  // Official Form State
  const [officialEmail, setOfficialEmail] = useState('ramesh.mpcb@maharashtra.gov.in');
  const [officialPassword, setOfficialPassword] = useState('••••••••••••');
  const [selectedDeptKey, setSelectedDeptKey] = useState<string>('MPCB_PUNE');

  const handleApplicantLogin = (accountKey?: string) => {
    const account = accountKey 
      ? SEED_INDUSTRIALISTS[accountKey] 
      : SEED_INDUSTRIALISTS.EV_PUNE;
    
    // Also sync the demo business profile
    if (accountKey === 'PHARMA_AURIC') loadDemoProfile('PHARMA_AURANGABAD');
    else if (accountKey === 'FOOD_NASHIK') loadDemoProfile('FOOD_NASHIK');
    else if (accountKey === 'SOLAR_NAGPUR') loadDemoProfile('SOLAR_NAGPUR');
    else loadDemoProfile('EV_PUNE');

    loginIndustrialist(account);
    setActiveRole('APPLICANT');

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });

    router.push('/portal/applications');
  };

  const handleOfficerLogin = (officerKey?: string) => {
    const key = officerKey || selectedDeptKey;
    const officer = SEED_OFFICERS[key] || SEED_OFFICERS.MPCB_PUNE;
    
    loginOfficer(officer);
    setActiveRole('OFFICER');

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });

    router.push('/officer');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-xs font-semibold text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            Government of Maharashtra • Single Sign-On (SSO) Gateway
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Anumati<span className="bg-gradient-to-r from-blue-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">One</span> Access Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Choose your designated portal gateway below. Industrialists access statutory clearance & incentive workflows; Government officers access scrutiny & inspection desks.
          </p>
        </div>

        {/* Dual Gateway Selection Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 backdrop-blur-xl">
            <button
              onClick={() => setActiveTab('APPLICANT')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'APPLICANT'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Industrialist & Investor Gateway</span>
            </button>

            <button
              onClick={() => setActiveTab('OFFICIAL')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'OFFICIAL'
                  ? 'bg-gradient-to-r from-purple-600 to-amber-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Government Official Desk (Parichay)</span>
            </button>
          </div>
        </div>

        {/* Content Box */}
        {activeTab === 'APPLICANT' ? (
          /* ===================================================
             GATEWAY 1: INDUSTRIALIST / APPLICANT REALM
             =================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 border border-blue-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
            {/* Left: Standard SSO Form */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  Citizen / Business Sovereign Login
                </span>
                <h2 className="text-xl font-black text-white">
                  Entrepreneur Single Sign-On
                </h2>
                <p className="text-xs text-slate-400">
                  Authenticate via Aadhaar-linked mobile OTP or DigiLocker business identity.
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Mobile Number / Registered Email
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

                <button
                  onClick={() => handleApplicantLogin('EV_PUNE')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-3 px-4 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-[0.99] mt-2"
                >
                  <span>Sign In as Industrialist</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span>Secured under Maharashtra Right to Services (RTS) Act 2015</span>
              </div>
            </div>

            {/* Right: Quick Evaluator Persona Launcher */}
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
        ) : (
          /* ===================================================
             GATEWAY 2: GOVERNMENT OFFICIAL (PARICHAY SSO)
             =================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 border border-purple-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
            {/* Left: Official SSO Form */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Government of Maharashtra Intranet SSO
                </span>
                <h2 className="text-xl font-black text-white">
                  Officer Scrutiny & Inspection Desk
                </h2>
                <p className="text-xs text-slate-400">
                  Secured Parichay / MeriPehchan authentication for Department Scrutiny Officers and District Collectors.
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
                    Department Authority
                  </label>
                  <select
                    value={selectedDeptKey}
                    onChange={(e) => setSelectedDeptKey(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-purple-300 focus:border-purple-500 focus:outline-none font-medium"
                  >
                    <option value="MPCB_PUNE">MPCB — Pollution Control Board (Sub-Regional Office)</option>
                    <option value="MIDC_SPA">MIDC — Special Planning Authority (SPA Land & Plan)</option>
                    <option value="DISH_FACTORIES">DISH — Directorate of Industrial Safety & Health</option>
                    <option value="MSEDCL_POWER">MSEDCL — Mahavitaran Electricity DISCOM</option>
                    <option value="FIRE_SERVICES">Maharashtra Fire Services Command</option>
                  </select>
                </div>

                <button
                  onClick={() => handleOfficerLogin()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 py-3 px-4 text-xs font-bold text-white shadow-lg shadow-purple-500/20 transition-all active:scale-[0.99] mt-2"
                >
                  <span>Sign In to Officer Cockpit</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <BadgeCheck className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span>Authorized for RTS Section 3(2) and Section 4(1) Actions</span>
              </div>
            </div>

            {/* Right: Quick Evaluator Officer Selector */}
            <div className="lg:col-span-6 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-purple-400" />
                  Select Officer Role for Evaluation
                </span>
                <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Direct Queue
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Click any departmental officer to inspect their customized scrutiny queue and joint site visit scheduler:
              </p>

              <div className="space-y-2 pt-1">
                {[
                  {
                    key: 'MPCB_PUNE',
                    name: 'Er. Ramesh Kulkarni',
                    role: 'Sub-Regional Officer • MPCB Pune',
                    jurisdiction: 'Pollution Consents (CTE / CTO)',
                    badge: 'MPCB SRO-04',
                  },
                  {
                    key: 'MIDC_SPA',
                    name: 'Ar. Sneha Deshpande',
                    role: 'Executive Engineer (SPA) • MIDC Planning',
                    jurisdiction: 'Land Possession & CAD Building Plans',
                    badge: 'MIDC EE-44',
                  },
                  {
                    key: 'DISH_FACTORIES',
                    name: 'Er. Dilip Patil',
                    role: 'Joint Director & Factory Inspector • DISH',
                    jurisdiction: 'Factory License & Joint Site Visits',
                    badge: 'DISH JD-09',
                  },
                  {
                    key: 'MSEDCL_POWER',
                    name: 'Er. Vijay More',
                    role: 'Superintending Engineer • MSEDCL',
                    jurisdiction: 'HT Dedicated Feeder & Power Sanctions',
                    badge: 'MSEDCL SE-77',
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
      </div>
    </div>
  );
}
