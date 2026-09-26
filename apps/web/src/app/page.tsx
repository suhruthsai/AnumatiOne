'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  GitBranch, 
  FolderCheck, 
  ShieldCheck, 
  Layers, 
  TrendingDown, 
  CheckCircle2, 
  Zap, 
  FileCheck2,
  Building2,
  Search,
  PlusCircle,
  Calendar,
  Gift,
  Scale,
  Clock,
  Award,
  Coins,
  ChevronRight,
  ExternalLink,
  MapPin,
  TrendingUp,
  Cpu,
  Factory,
  Flame,
  Droplet,
  Users,
  Briefcase,
  FileText,
  Crown,
  Sliders,
  KeyRound
} from 'lucide-react';
import LoginPage from '@/app/auth/login/page';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, loadDemoProfile } = useAppStore();
  const [activeTab, setActiveTab] = useState<'ALL' | 'POLICIES' | 'CIRCULARS' | 'WORKSHOPS'>('ALL');

  // FIRST LOGIN PAGE SHOULD COME:
  // If applicant/officer/admin has not authenticated, show the Login Page first.
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleLaunchScenario = (key: string) => {
    loadDemoProfile(key);
    router.push('/portal/kya');
  };

  const happenings = [
    {
      type: 'CIRCULAR',
      dept: 'Maharashtra Pollution Control Board (MPCB)',
      date: '24 Sep 2026',
      title: 'Mandatory Online IoT Telemetry Integration for OCEMS under Water Act Sec 25',
      summary: 'All Red & Orange category manufacturing units must bind digital telemetry endpoints directly to AnumatiOne before commercial CTO commissioning.',
      actionUrl: '/portal/clearances',
      tag: 'Pollution Control'
    },
    {
      type: 'POLICIES',
      dept: 'Department of Industries, GoM',
      date: '18 Sep 2026',
      title: 'Package Scheme of Incentives (PSI 2019) Extension for Ultra-Mega EV Units',
      summary: 'Special 100% SGST refund window disbursed over 10 years and stamp duty waiver extended for Tier 2/3 Talukas (Zones C and D+).',
      actionUrl: '/portal/incentives',
      tag: 'Fiscal Subsidies'
    },
    {
      type: 'WORKSHOPS',
      dept: 'Directorate of Industrial Safety & Health (DISH)',
      date: '12 Sep 2026',
      title: 'Standard Operating Procedures for Joint Multi-Departmental Inspections',
      summary: 'Synchronized on-site inspection calendar under Maharashtra RTS Act 2015 preventing overlapping site audits by Fire, DISH, and MPCB.',
      actionUrl: '/officer?tab=inspections',
      tag: 'Worker Safety'
    },
    {
      type: 'CIRCULAR',
      dept: 'Maharashtra State Innovation Society (MSIS)',
      date: '05 Sep 2026',
      title: 'Green Channel 48-Hour Instant Deemed Sanction Notification',
      summary: 'White and Green tier micro and small manufacturing units now qualify for autonomous certificate issuance with DigiLocker pre-checks.',
      actionUrl: '/portal/clearances',
      tag: 'Ease of Business'
    }
  ];

  const filteredHappenings = activeTab === 'ALL' 
    ? happenings 
    : happenings.filter(h => h.type === activeTab);

  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100">
      
      {/* SECTION 1: SIGNATURE STATE PORTAL HERO BANNER (MAHARASHTRA SOVEREIGN GATEWAY) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#101935] via-[#1E2958] to-[#C33764] py-8 sm:py-12 px-4 sm:px-6 border-b border-[#C33764]/30 shadow-2xl">
        {/* Subtle decorative vector backdrop overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(195,55,100,0.25),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(6,13,74,0.4),transparent_60%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl space-y-6">
          
          {/* Top Bar: Sovereign State Department Badge + SSO Quick Action */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1 text-xs font-semibold text-white">
              <span className="flex h-2 w-2 rounded-full bg-[#C33764] animate-pulse" />
              <span>Department of Industries & MSIS • Government of Maharashtra</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md px-4 py-1 text-xs font-bold text-white transition-all shadow"
              >
                <KeyRound className="h-3.5 w-3.5 text-rose-300" />
                <span>Single Sign-On (SSO) Portal</span>
              </Link>
            </div>
          </div>

          {/* EXACT HERO BANNER FROM SPECIFICATION WITH USER PICTURE */}
          <div className="relative rounded-3xl overflow-hidden border border-[#C33764]/40 shadow-2xl bg-gradient-to-r from-[#8d1858] via-[#481c5a] to-[#101e52] group">
            <div className="relative w-full overflow-hidden">
              <img
                src="/hero-maharashtra.png"
                alt="Maharashtra: The Engine of India’s Growth & Single-Window Clearance"
                className="w-full h-auto object-cover object-center max-h-[460px] filter brightness-105 contrast-105"
              />
              
              {/* Carousel Indicator matching the user visual specification */}
              <div className="absolute bottom-4 left-6 sm:bottom-8 sm:left-12 flex items-center gap-2 z-10 pointer-events-none">
                <span className="w-8 sm:w-10 h-1.5 sm:h-2 rounded-full bg-white shadow-lg" />
                <span className="w-2.5 sm:w-3 h-1.5 sm:h-2 rounded-full bg-white/40 shadow-sm" />
                <span className="w-2.5 sm:w-3 h-1.5 sm:h-2 rounded-full bg-white/40 shadow-sm" />
              </div>
            </div>

            {/* Quick Action Overlay Strip inside the banner */}
            <div className="bg-slate-950/85 backdrop-blur-md p-4 sm:p-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/portal/clearances"
                  className="flex items-center gap-2 rounded-full bg-[#C33764] hover:bg-[#A82650] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-[#C33764]/40 hover:scale-[1.02] active:scale-[0.99] transition-all group"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Explore Clearances Directory</span>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">
                    28 Clearances
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/portal/kya"
                  className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:border-white transition-all shadow-lg"
                >
                  <Search className="h-4 w-4" />
                  <span>Know Your Approvals (KYA & CAF)</span>
                </Link>

                <Link
                  href="/portal/applications"
                  className="flex items-center gap-2 rounded-full bg-[#060D4A]/80 hover:bg-[#060D4A] border border-blue-400/30 px-4 py-2.5 text-xs sm:text-sm font-bold text-blue-200 hover:text-white transition-all"
                >
                  <FolderCheck className="h-4 w-4 text-emerald-400" />
                  <span>Track Applications</span>
                </Link>

                <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-300">
                  <Zap className="h-3.5 w-3.5 text-emerald-400" />
                  <span>48-Hour Green Channel Fast-Track</span>
                </div>
              </div>

              {/* Evaluator Quick Persona Launchers */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-300" /> 1-Click Investor Scenarios:
                </span>
                <button
                  onClick={() => handleLaunchScenario('EV_PUNE')}
                  className="rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-slate-200 hover:text-white border border-white/20 transition-all font-mono text-[11px]"
                >
                  ⚡ Mega EV (Chakan)
                </button>
                <button
                  onClick={() => handleLaunchScenario('PHARMA_AURANGABAD')}
                  className="rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-slate-200 hover:text-white border border-white/20 transition-all font-mono text-[11px]"
                >
                  💊 Pharma (AURIC)
                </button>
                <button
                  onClick={() => handleLaunchScenario('FOOD_NASHIK')}
                  className="rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-slate-200 hover:text-white border border-white/20 transition-all font-mono text-[11px]"
                >
                  🌾 Agro MSME (Nashik)
                </button>
              </div>
            </div>
          </div>

          {/* 4-DOOR MULTI-ROLE ACCESS MATRIX (AMAZON SDE UI/UX DESIGN) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-rose-400" />
                  <span>Maharashtra Single-Window Multi-Role Access Gateways</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  Engineered with Amazon-standard RBAC security. Click any role below for direct Parichay SSO authentication:
                </p>
              </div>
              <Link
                href="/auth/login"
                className="text-xs font-bold text-rose-300 hover:text-white flex items-center gap-1 hover:underline shrink-0"
              >
                <span>SSO Gateway</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Role 1: Applicant */}
              <Link
                href="/auth/login"
                className="rounded-2xl border border-blue-500/30 bg-slate-900/80 hover:bg-blue-950/40 p-4 transition-all hover:scale-[1.02] shadow-xl group space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      Tier 1
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-blue-300 transition-colors mt-2">
                    Industrialist & Investor Gateway
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Single-Window CAF, track 28 statutory clearances, MahaVault document reuse & PSI 2019 subsidies.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-blue-400 font-semibold flex items-center justify-between">
                  <span>Sign In as Applicant</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Role 2: Officer */}
              <Link
                href="/auth/login"
                className="rounded-2xl border border-purple-500/30 bg-slate-900/80 hover:bg-purple-950/40 p-4 transition-all hover:scale-[1.02] shadow-xl group space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      Tier 2
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-purple-300 transition-colors mt-2">
                    Government Official Desk
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Parichay SSO scrutiny queue, MPCB / MIDC / DISH scrutiny, and synchronized 48h joint site inspections.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-purple-400 font-semibold flex items-center justify-between">
                  <span>Sign In as Officer</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Role 3: Department Admin */}
              <Link
                href="/auth/login"
                className="rounded-2xl border border-rose-500/30 bg-slate-900/80 hover:bg-rose-950/40 p-4 transition-all hover:scale-[1.02] shadow-xl group space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                      <Sliders className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      Tier 3
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-rose-300 transition-colors mt-2">
                    Department Administration
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Directorate HOD oversight (MPCB, MIDC, DISH, MSEDCL), file reassignment & RTS statutory compliance.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-rose-400 font-semibold flex items-center justify-between">
                  <span>Sign In as HOD Admin</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Role 4: State Admin */}
              <Link
                href="/auth/login"
                className="rounded-2xl border border-amber-500/30 bg-slate-900/80 hover:bg-amber-950/40 p-4 transition-all hover:scale-[1.02] shadow-xl group space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                      <Crown className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Tier 4
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors mt-2">
                    State Administration Admin
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Mantralaya Apex Council: 36-district EODB speed index, RTS deemed approvals & regulatory graph bottlenecks.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-400 font-semibold flex items-center justify-between">
                  <span>Sign In as State Admin</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: "MAHARASHTRA: THE LAND OF OPPORTUNITY" & 5 STRATEGIC PILLARS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Narrative Column */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C33764]/10 border border-[#C33764]/30 px-3 py-1 text-xs font-bold text-[#C33764] uppercase tracking-wider">
              State Innovation & Industrial Ecosystem
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Maharashtra: The Land of Opportunity
            </h2>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                Maharashtra, India’s economic powerhouse, contributes over 14% to the national GDP and stands as the nation’s foremost destination for foreign direct investment (FDI).
              </p>
              <p>
                With <strong>AnumatiOne</strong>, the Government of Maharashtra has unified bureaucratic departmental silos into an intelligent, concurrent approval superhighway. Countless industrialists and innovators have transitioned from ground acquisition to commercial production in record time, supported by transparent timelines and progressive ease-of-doing-business policies.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/portal/clearances"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#C33764] hover:text-white px-5 py-2.5 text-xs font-bold text-slate-200 transition-all shadow-md"
              >
                <span>Browse All 28 Clearances</span>
                <ChevronRight className="h-4 w-4 text-[#C33764]" />
              </Link>
              <Link
                href="/portal/incentives"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-400 hover:text-white px-5 py-2.5 text-xs font-bold text-slate-200 transition-all shadow-md"
              >
                <span>Calculate PSI 2019 Incentives</span>
                <ChevronRight className="h-4 w-4 text-blue-400" />
              </Link>
            </div>
          </div>

          {/* State Seal & Digital Twin Hologram Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-[#060D4A]/60 via-slate-900 to-slate-900/90 p-8 shadow-2xl relative text-center space-y-6">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#C33764] to-blue-600 shadow-2xl shadow-[#C33764]/30">
                <Scale className="h-12 w-12 text-white" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Sovereign Industrial Seal</h3>
                <p className="text-xs text-slate-400 mt-1">Maharashtra State Innovation Society (MSIS)</p>
              </div>

              <div className="space-y-2.5 text-left text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950/60">
                  <span className="text-slate-400">Statutory SLA Guarantee:</span>
                  <span className="font-bold text-white font-mono">15 to 30 Days Legal Max</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950/60">
                  <span className="text-slate-400">MahaVault Data Reuse:</span>
                  <span className="font-bold text-emerald-400 font-mono">Sec 3(2) Cross-Lock</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950/60">
                  <span className="text-slate-400">Green Channel Sanction:</span>
                  <span className="font-bold text-blue-400 font-mono">48-Hour Instant Deemed</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 5 Strategic Pillars Grid (Matching Startup Telangana 5 Pillars) */}
        <div className="mt-14">
          <div className="text-left mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C33764]" />
              The 5 Pillars of Maharashtra Industrial Transformation
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Engineered to fulfill all objectives of Problem Statement SIH 26130.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 text-left hover:border-blue-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Building2 className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-white">Physical Infrastructure</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  MIDC smart industrial cities, AURIC, plug-and-play factory sheds, and dedicated multi-modal logistics corridors.
                </p>
              </div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Pillar 1 • Infrastructure</span>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 text-left hover:border-[#C33764]/40 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C33764]/10 text-[#C33764] border border-[#C33764]/20">
                  <Zap className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-white">Regulatory Easing</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Single-Window Common Application Form (CAF) routing concurrent approvals across all state agencies simultaneously.
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#C33764] uppercase tracking-wider">Pillar 2 • Clearances</span>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 text-left hover:border-purple-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Users className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-white">Human Capital & Safety</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  DISH occupational safety vetting, apprentice mobilization, and institutional industrial safety training.
                </p>
              </div>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Pillar 3 • Workforce</span>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 text-left hover:border-emerald-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Flame className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-white">Grassroots Innovation</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Zero Liquid Discharge (ZLD) support, 48-Hour Green Channel self-certification, and sustainability incentives.
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Pillar 4 • Sustainability</span>
            </div>

            {/* Pillar 5 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 text-left hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Coins className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-white">Fiscal Subsidies</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Package Scheme of Incentives (PSI 2019), 100% stamp duty exemption, electricity duty waivers, and SGST refunds.
                </p>
              </div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pillar 5 • Incentives</span>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: "EMPOWERING ENTERPRISES WITH..." 5 CIRCULAR HIGHLIGHTS */}
      <section className="bg-[#060D4A]/40 border-y border-slate-800/80 py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl text-center space-y-10">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Empowering Enterprises & Industries with...
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              A comprehensive single-window ecosystem eliminating manual friction, redundant document submissions, and approval delays.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            
            {/* Circle 1: Govt Clearances */}
            <Link 
              href="/portal/clearances"
              className="flex flex-col items-center group space-y-3"
            >
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-slate-900 border-2 border-[#C33764] group-hover:scale-110 group-hover:bg-[#C33764]/20 group-hover:shadow-xl group-hover:shadow-[#C33764]/30 transition-all">
                <Building2 className="h-9 w-9 sm:h-10 sm:w-10 text-[#C33764]" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#C33764] transition-colors">
                28 Govt Clearances
              </h4>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                All statutory departments
              </p>
            </Link>

            {/* Circle 2: Fast-Track Green Channel */}
            <Link 
              href="/portal/clearances?stage=GREEN_CHANNEL"
              className="flex flex-col items-center group space-y-3"
            >
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-slate-900 border-2 border-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:shadow-xl group-hover:shadow-emerald-500/30 transition-all">
                <Zap className="h-9 w-9 sm:h-10 sm:w-10 text-emerald-400" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300 transition-colors">
                48h Green Channel
              </h4>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Instant deemed sanction
              </p>
            </Link>

            {/* Circle 3: MIDC Land & Infra */}
            <Link 
              href="/portal/kya"
              className="flex flex-col items-center group space-y-3"
            >
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-slate-900 border-2 border-blue-500 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all">
                <MapPin className="h-9 w-9 sm:h-10 sm:w-10 text-blue-400" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-blue-300 transition-colors">
                MIDC Land & Estates
              </h4>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                GIS plot reservation
              </p>
            </Link>

            {/* Circle 4: Fiscal Incentives */}
            <Link 
              href="/portal/incentives"
              className="flex flex-col items-center group space-y-3"
            >
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-slate-900 border-2 border-amber-500 group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:shadow-xl group-hover:shadow-amber-500/30 transition-all">
                <Coins className="h-9 w-9 sm:h-10 sm:w-10 text-amber-400" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors">
                PSI 2019 Subsidies
              </h4>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                SGST & stamp duty relief
              </p>
            </Link>

            {/* Circle 5: RTS Grievance Escalator */}
            <Link 
              href="/portal/grievances"
              className="flex flex-col items-center group space-y-3 col-span-2 md:col-span-1"
            >
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-slate-900 border-2 border-purple-500 group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:shadow-xl group-hover:shadow-purple-500/30 transition-all">
                <Scale className="h-9 w-9 sm:h-10 sm:w-10 text-purple-400" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-purple-300 transition-colors">
                2-Tier RTS Appeals
              </h4>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                ₹250/day officer fines
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* SECTION 5: "WE HOST THE GIANTS / PREMIER INDUSTRIAL HUBS" */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 text-left space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#C33764]">
              Maharashtra Manufacturing Geography
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              We Host the Giants: Premier Industrial Corridors
            </h3>
          </div>
          <Link
            href="/portal/kya"
            className="text-xs font-bold text-[#C33764] hover:text-rose-300 flex items-center gap-1 transition-colors"
          >
            Explore Zone Specific Schemes →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Hub 1: Chakan Pune */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-blue-500/40 transition-all">
            <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
              PUNE ZONE B
            </span>
            <h4 className="font-bold text-white text-base">Chakan & Talegaon</h4>
            <p className="text-xs text-slate-400">
              India’s premier automotive, EV gigafactory & precision engineering capital.
            </p>
            <div className="text-[11px] text-slate-500">
              Anchors: Tata Motors, Bajaj, Foxconn
            </div>
          </div>

          {/* Hub 2: AURIC City */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-purple-500/40 transition-all">
            <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
              SAMBHAJINAGAR ZONE D+
            </span>
            <h4 className="font-bold text-white text-base">AURIC Smart City</h4>
            <p className="text-xs text-slate-400">
              DMIC smart industrial node with automated SCADA utilities and biopharma hubs.
            </p>
            <div className="text-[11px] text-slate-500">
              Anchors: Hyosung, Perkins, Skoda
            </div>
          </div>

          {/* Hub 3: MIHAN Nagpur */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-emerald-500/40 transition-all">
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              NAGPUR SEZ ZONE D+
            </span>
            <h4 className="font-bold text-white text-base">MIHAN Cargo & SEZ</h4>
            <p className="text-xs text-slate-400">
              Multi-modal international cargo hub, aerospace defense, and solar PV manufacturing.
            </p>
            <div className="text-[11px] text-slate-500">
              Anchors: Boeing, Dassault, Infosys
            </div>
          </div>

          {/* Hub 4: Turbhe Navi Mumbai */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-amber-500/40 transition-all">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              NAVI MUMBAI ZONE A
            </span>
            <h4 className="font-bold text-white text-base">TTC & Turbhe</h4>
            <p className="text-xs text-slate-400">
              Specialized specialty chemicals, mega data center parks, and maritime tech.
            </p>
            <div className="text-[11px] text-slate-500">
              Anchors: BASF, Reliance, NTT Data
            </div>
          </div>

          {/* Hub 5: Dindori Nashik */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-rose-500/40 transition-all">
            <span className="text-[10px] font-mono font-bold text-[#C33764] bg-[#C33764]/10 px-2 py-0.5 rounded">
              NASHIK ZONE C
            </span>
            <h4 className="font-bold text-white text-base">Dindori Agro Park</h4>
            <p className="text-xs text-slate-400">
              Integrated cold chain, agro-processing, winery estates, and light electronics.
            </p>
            <div className="text-[11px] text-slate-500">
              Anchors: Sula, Mahindra, Haldiram’s
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: "HAPPENING MAHARASHTRA" (NOTICES, CIRCULARS & EVENTS) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 border-t border-slate-800/80 text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#C33764]">
              Regulatory Gazette & Updates
            </div>
            <h3 className="text-2xl font-black text-white mt-1">
              Happening Maharashtra: Orders, Circulars & Notices
            </h3>
          </div>

          {/* Tab Filter Controls */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {(['ALL', 'POLICIES', 'CIRCULARS', 'WORKSHOPS'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-[#C33764] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'ALL' ? 'All Updates' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHappenings.map((item, idx) => (
            <div 
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#C33764]" />
                    {item.date}
                  </span>
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
                    {item.tag}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-blue-400">
                  {item.dept}
                </div>

                <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <Link
                href={item.actionUrl}
                className="pt-3 border-t border-slate-800/80 text-xs font-semibold text-[#C33764] hover:text-rose-300 flex items-center justify-between transition-colors"
              >
                <span>Read Full Circular & Guidelines</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: INTERACTIVE CLEARANCE JOURNEY DAG CALLOUT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900 to-[#C33764]/20 p-8 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 text-left">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">
              <GitBranch className="h-3.5 w-3.5" />
              Adversarial Path Optimization Engine
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Visualize Parallel Clearance Lanes in Interactive D3.js Gantt
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience the 162-day time saving in action. Simulate critical path makespan, 
              detect department concurrency bottlenecks, and inspect live RTS Act Section 4(1) Deemed Approval countdowns.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/portal/journey"
              className="rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <GitBranch className="h-4 w-4" />
              Launch Journey Map
            </Link>
            <Link
              href="/portal/clearances"
              className="rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-6 py-3.5 text-xs font-bold text-white transition-all flex items-center gap-2"
            >
              <Building2 className="h-4 w-4 text-[#C33764]" />
              Clearances Directory
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
