'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore, SEED_INDUSTRIALISTS } from '@/lib/store';
import { 
  MAHARASHTRA_STATUTORY_ACTS, 
  MaharashtraActDetail 
} from '@/lib/knowledge-engine/maharashtra-governance';
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  FileText, 
  Scale, 
  Layers, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Factory, 
  Coins, 
  Gift, 
  BookOpen, 
  AlertCircle,
  ExternalLink,
  Cpu,
  Flame,
  Droplet,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProjectProfilePage() {
  const router = useRouter();
  const { isAuthenticated, logout, currentIndustrialist, currentProfile, loadDemoProfile } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  const [activeTab, setActiveTab] = useState<'SPECS' | 'SCHEMES' | 'RULES'>('SPECS');
  const [selectedAct, setSelectedAct] = useState<MaharashtraActDetail>(MAHARASHTRA_STATUTORY_ACTS[0]);

  // Maharashtra 6 Priority Schemes Data
  const schemesList = [
    {
      id: 'PSI_2019',
      name: 'Package Scheme of Incentives (PSI 2019 / 2024 Extension)',
      department: 'Department of Industries, Govt of Maharashtra',
      category: 'Fiscal Capital & Operational Subsidy',
      zoneBenefit: 'Zone A: 30% • Zone B: 50% • Zone C: 70% • Zone D+: 100% of Fixed Capital Investment (FCI)',
      sgstRefund: '100% Gross SGST reimbursement disbursed annually for up to 10 years.',
      powerTariff: '₹1.50 to ₹2.00 / unit power tariff subvention for 5 years.',
      stampDuty: '100% Stamp Duty exemption during land allotment and mortgage.',
      status: 'MATCHED_AND_APPLICABLE',
      highlight: true
    },
    {
      id: 'EV_POLICY_2025',
      name: 'Maharashtra Electric Vehicle (EV) Policy 2025',
      department: 'Industries & Environment Departments, GoM',
      category: 'Pioneer & Mega EV Manufacturing Subvention',
      zoneBenefit: 'Pioneer / Mega status for investments above ₹100 Cr in EV assembly or battery manufacturing.',
      sgstRefund: 'Additional 20% SGST refund bonus and zero electricity duty for 15 years.',
      powerTariff: 'Dedicated Green Power open access grid tariff.',
      stampDuty: 'Complete waiver of MIDC development charges and stamp duties.',
      status: currentProfile.sector === 'EV_MANUFACTURING' ? 'HIGH_PRIORITY_MATCH' : 'ELIGIBLE_FOR_ANCILLARY',
      highlight: currentProfile.sector === 'EV_MANUFACTURING'
    },
    {
      id: 'CMEGP_SCHEME',
      name: 'Chief Minister Employment Generation Programme (CMEGP)',
      department: 'Directorate of Industries, Maharashtra',
      category: 'MSME Capital Margin Assistance',
      zoneBenefit: '15% to 35% margin money assistance on project outlays up to ₹50 Lakhs.',
      sgstRefund: 'State-backed collateral free bank credit under CGTMSE.',
      powerTariff: 'Concessional industrial power slab.',
      stampDuty: 'Exemption for rural and semi-urban MIDC industrial clusters.',
      status: 'AVAILABLE_FOR_MICRO_TIER',
      highlight: false
    },
    {
      id: 'AGRO_FOOD_2023',
      name: 'Maharashtra Agro & Food Processing Policy',
      department: 'Agriculture & Cooperation Department, GoM',
      category: 'Agro Industrial Value Addition',
      zoneBenefit: '50% capital subsidy on cold chain, irradiation facilities & food park clusters.',
      sgstRefund: 'Full SGST reimbursement for processed horticulture & dairy.',
      powerTariff: 'Agricultural feeder cross-subsidized rates.',
      stampDuty: '100% stamp duty waiver in Nashik, Sangli, and Marathwada food belts.',
      status: currentProfile.sector === 'FOOD_PROCESSING' ? 'HIGH_PRIORITY_MATCH' : 'INAPPLICABLE',
      highlight: currentProfile.sector === 'FOOD_PROCESSING'
    },
    {
      id: 'SEMICONDUCTOR_2024',
      name: 'Maharashtra Electronics & Semiconductor Fab Policy',
      department: 'MSIS & Department of Information Technology',
      category: 'High-Tech Capital Incentive',
      zoneBenefit: 'Top-up 25% state capital assistance matched to India Semiconductor Mission (ISM).',
      sgstRefund: '99.999% ultra-pure water tariff rebate & high-purity nitrogen pipeline subsidies.',
      powerTariff: 'Dual redundant 220kV feeder with zero interruption guarantee.',
      stampDuty: 'Allotment at 50% concessional MIDC land rates in Talegaon & Chhatrapati Sambhajinagar.',
      status: 'STRATEGIC_SECTOR',
      highlight: false
    },
    {
      id: 'PLUG_AND_PLAY',
      name: 'MIDC Ready-Built Plug-and-Play Infrastructure Scheme',
      department: 'Maharashtra Industrial Development Corporation (MIDC)',
      category: 'Instant Factory Sheds & Green Fast-Track',
      zoneBenefit: 'Instant possession of pre-cleared industrial shed within 7 days.',
      sgstRefund: 'Zero gestation clearance hold with pre-sanctioned MPCB CTE & Fire NOC.',
      powerTariff: 'Pre-installed HT sub-station connection.',
      stampDuty: 'Concessional lease rent during initial 3 years of commercial production.',
      status: 'FAST_TRACK_ELIGIBLE',
      highlight: false
    }
  ];

  const handlePersonaSwitch = (key: string) => {
    loadDemoProfile(key);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Banner: Enterprise Identity & 1-Click Persona Switcher */}
      <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 p-6 backdrop-blur-xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/30">
              <Building2 className="h-3.5 w-3.5" />
              Statutory Project Profile
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              MahaVault Verified (RTS Sec 3(2))
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Fast SLA Eligible
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {currentIndustrialist?.companyName || currentProfile.companyName || 'Aegis Lithium Mobility Pvt Ltd'}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 font-mono">
            <span>GSTIN: <strong className="text-white">{currentIndustrialist?.gstin || '27AABCS8819Q1ZP'}</strong></span>
            <span>PAN: <strong className="text-white">{currentIndustrialist?.pan || 'AABCS8819Q'}</strong></span>
            <span>Udyam: <strong className="text-white">{currentIndustrialist?.udyamNumber || 'UDYAM-MH-26-008219'}</strong></span>
            <span>Taluka Zone: <strong className="text-emerald-400">{currentProfile.talukaCategory || 'Zone B'}</strong></span>
          </div>
        </div>

        {/* 1-Click Persona Switcher for Evaluation */}
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-3 space-y-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-yellow-400" /> Switch Test Enterprise:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handlePersonaSwitch('EV_PUNE')}
              className="px-2.5 py-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-200 text-left font-semibold transition-all"
            >
              ⚡ Aegis EV (Pune)
            </button>
            <button
              onClick={() => handlePersonaSwitch('PHARMA_AURANGABAD')}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-200 text-left font-semibold transition-all"
            >
              💊 Vanguard Pharma
            </button>
            <button
              onClick={() => handlePersonaSwitch('FOOD_NASHIK')}
              className="px-2.5 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-left font-semibold transition-all"
            >
              🌾 Godavari Agro
            </button>
            <button
              onClick={() => handlePersonaSwitch('SOLAR_NAGPUR')}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-left font-semibold transition-all"
            >
              ☀️ Helios Solar
            </button>
          </div>
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                logout();
                router.push('/auth/login');
              }}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-red-500/70 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 py-1.5 text-xs font-black text-white shadow-md shadow-red-950/50 hover:from-red-500 hover:to-rose-500 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              title="Sign out of AnumatiOne session"
            >
              <LogOut className="h-3.5 w-3.5 text-white" />
              <span>Logout Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Main Tabs: Specs, Schemes, Rules */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('SPECS')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'SPECS'
              ? 'border-blue-500 text-blue-400 bg-blue-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Project Specifications</span>
        </button>

        <button
          onClick={() => setActiveTab('SCHEMES')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'SCHEMES'
              ? 'border-[#C33764] text-rose-400 bg-rose-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="h-4 w-4" />
          <span>Maharashtra Schemes & Subsidies</span>
          <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-mono text-rose-300">
            6 Schemes
          </span>
        </button>

        <button
          onClick={() => setActiveTab('RULES')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'RULES'
              ? 'border-amber-500 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="h-4 w-4" />
          <span>Statutory Acts & Governing Rules</span>
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-300">
            9 Acts
          </span>
        </button>
      </div>

      {/* TAB 1: PROJECT SPECIFICATIONS */}
      {activeTab === 'SPECS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Box 1: Corporate Entity */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-blue-400" />
                Corporate Entity
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">Entity Type:</span>
                  <span className="font-bold text-white font-mono">{currentIndustrialist?.entityType || 'PVT_LTD'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">Designation:</span>
                  <span className="font-semibold text-white">{currentIndustrialist?.designation || 'Managing Director'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">Authorized Phone:</span>
                  <span className="font-mono text-white">{currentIndustrialist?.phone || '+91 98220 54321'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Corporate Email:</span>
                  <span className="font-mono text-white truncate max-w-[180px]">{currentIndustrialist?.email || 'contact@sahyadri-battery.in'}</span>
                </div>
              </div>
            </div>

            {/* Box 2: Manufacturing Outlay */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Factory className="h-4 w-4 text-emerald-400" />
                Capital & Scale
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">Sector:</span>
                  <span className="font-bold text-emerald-300">{currentProfile.sector.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">Fixed Capital Outlay:</span>
                  <span className="font-black text-white font-mono">₹{currentProfile.investmentInrCr}.00 Crores</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">Direct Employment:</span>
                  <span className="font-bold text-white font-mono">{currentProfile.expectedEmployees} Personnel</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pollution Index:</span>
                  <span className="font-bold text-rose-400 font-mono">{currentProfile.pollutionCategory} Category</span>
                </div>
              </div>
            </div>

            {/* Box 3: Site & Utilities */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-purple-400" />
                Site & Resource Demands
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">Industrial Cluster:</span>
                  <span className="font-semibold text-white">MIDC {currentProfile.district}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">Land Allotment:</span>
                  <span className="font-mono text-white">{currentProfile.landAreaAcres} Acres</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">Power Sanction (HT):</span>
                  <span className="font-mono text-purple-300 font-bold">{currentProfile.powerRequiredKva} kVA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Water Sanction:</span>
                  <span className="font-mono text-blue-300 font-bold">{currentProfile.waterRequiredKld} KLD (ZLD)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Bar to Explore Schemes or Apply Fast SLA */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <strong className="text-sm font-bold text-white block">Ready for 48-Hour Fast-Track Clearance?</strong>
                <p className="text-xs text-slate-400">
                  Pre-scrutiny checks complete. All statutory documents verified in MahaVault under RTS Act Sec 3(2).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('SCHEMES')}
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-200 hover:text-white hover:border-slate-500 transition-all"
              >
                View Eligible Subsidies
              </button>
              <Link
                href="/portal/applications"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-xs font-bold text-white shadow-lg hover:brightness-110 transition-all flex items-center gap-1.5"
              >
                <Zap className="h-4 w-4" />
                <span>Go to Fast SLA Hub</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MAHARASHTRA SCHEMES & SUBSIDIES */}
      {activeTab === 'SCHEMES' && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Gift className="h-5 w-5 text-rose-400" />
                <span>Maharashtra Industrial Incentive Policies & Subsidies</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Statutory fiscal benefits guaranteed under Government of Maharashtra Industrial Policy.
              </p>
            </div>
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
              Current Zone: {currentProfile.talukaCategory}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {schemesList.map((scheme) => (
              <div 
                key={scheme.id}
                className={`rounded-2xl border p-5 space-y-4 transition-all ${
                  scheme.highlight 
                    ? 'border-rose-500/40 bg-gradient-to-br from-rose-950/20 via-slate-900/90 to-slate-900 shadow-xl'
                    : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {scheme.category}
                    </span>
                    <h3 className="text-base font-bold text-white leading-snug">{scheme.name}</h3>
                    <p className="text-[11px] text-slate-400">{scheme.department}</p>
                  </div>
                  {scheme.highlight && (
                    <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold shrink-0">
                      Top Match
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400">Capital & Zone Entitlement:</span>
                    <p className="text-slate-200 font-medium">{scheme.zoneBenefit}</p>
                  </div>
                  <div className="space-y-1 pt-1.5 border-t border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400">SGST Refund Window:</span>
                    <p className="text-emerald-300 font-medium">{scheme.sgstRefund}</p>
                  </div>
                  <div className="space-y-1 pt-1.5 border-t border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400">Power & Stamp Duty:</span>
                    <p className="text-slate-300">{scheme.powerTariff} | {scheme.stampDuty}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Status: <strong className="text-emerald-400">{scheme.status}</strong>
                  </span>
                  <Link
                    href="/portal/incentives"
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline"
                  >
                    <span>Calculate Benefit</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STATUTORY ACTS & GOVERNING RULES */}
      {activeTab === 'RULES' && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Scale className="h-5 w-5 text-amber-400" />
                <span>Maharashtra Statutory Acts & Regulatory Rules Directory</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                9 governing state statutes enforcing mandatory SLA limits, officer penalties, and deemed approvals.
              </p>
            </div>
            <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
              RTS Act 2015 Protected
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: List of 9 Acts */}
            <div className="lg:col-span-5 space-y-2">
              {MAHARASHTRA_STATUTORY_ACTS.map((act) => (
                <button
                  key={act.id}
                  onClick={() => setSelectedAct(act)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-1.5 ${
                    selectedAct.id === act.id
                      ? 'border-amber-500/50 bg-amber-950/30 shadow-lg'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{act.shortName}</span>
                    <span className="font-mono text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      SLA: {act.rtsSlaDays} Days
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-[280px]">
                    {act.department}
                  </p>
                </button>
              ))}
            </div>

            {/* Right Column: Detailed Inspector for Selected Act */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-5 shadow-2xl backdrop-blur-xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                  Enacted {selectedAct.enactedYear} • Statutory SLA: {selectedAct.rtsSlaDays} Days
                </span>
                <h3 className="text-xl font-black text-white">{selectedAct.name}</h3>
                <p className="text-xs text-slate-400">{selectedAct.department}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 space-y-1">
                  <span className="text-slate-400 font-semibold block">Governing Rules & Delegated Legislation:</span>
                  <p className="text-white font-medium">{selectedAct.governingRules}</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 space-y-1">
                  <span className="text-slate-400 font-semibold block">Key Statutory Sections:</span>
                  <p className="text-amber-200 font-mono">{selectedAct.keySections}</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 space-y-1">
                  <span className="text-slate-400 font-semibold block">Statutory Mandate:</span>
                  <p className="text-slate-300 leading-relaxed">{selectedAct.statutoryMandate}</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
                  <span className="text-slate-400 font-semibold block">Mandatory Compliance Rules:</span>
                  <ul className="space-y-1.5">
                    {selectedAct.complianceRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-200 text-xs">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Applies to: <strong className="text-white">{selectedAct.appliesToApprovals.length} Clearances</strong>
                </span>
                <Link
                  href="/portal/chat"
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold hover:underline"
                >
                  <span>Ask Chatbot about this Act</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
