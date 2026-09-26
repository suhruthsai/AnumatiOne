'use client';

import React from 'react';
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
  Coins
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { loadDemoProfile } = useAppStore();

  const handleLaunchScenario = (key: string) => {
    loadDemoProfile(key);
    router.push('/portal/kya');
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background ambient radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-20 pb-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md shadow-lg shadow-blue-500/10">
          <Sparkles className="h-3.5 w-3.5" />
          Government of Maharashtra • MAITRI Single Window G2B Regulatory System
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Streamlining Industrial Approvals, Compliance & Support Services{' '}
          <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
            Across Maharashtra
          </span>
        </h1>

        <p className="mx-auto max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed">
          Engineered under the <strong>Maharashtra Right to Services (RTS) Act 2015</strong>. Covering the complete industrial lifecycle across 15+ state departments — <strong>Pre-Establishment</strong>, <strong>Pre-Operation</strong>, <strong>Continuous Statutory Returns</strong>, and <strong>License Renewals</strong> — with Zero-Query AI Pre-Scrutiny, MahaVault Document Re-use, and Deemed Approvals.
        </p>

        {/* Two Sovereign Gateway Access Portals */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-2xl mx-auto">
          <Link
            href="/auth/login"
            className="w-full sm:w-1/2 flex items-center justify-between p-4 rounded-2xl border border-blue-500/40 bg-gradient-to-r from-blue-950/60 to-slate-900/80 hover:border-blue-400 hover:scale-[1.02] active:scale-[0.99] transition-all text-left group shadow-xl shadow-blue-500/10"
          >
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Citizen / Investor Portal
              </div>
              <div className="text-sm font-bold text-white mt-0.5 group-hover:text-blue-300 transition-colors">
                Industrialist Sign In →
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                KYA, Single CAF, Digital Permits & PSI Subsidies
              </div>
            </div>
            <Building2 className="h-8 w-8 text-blue-400/80 shrink-0 ml-2" />
          </Link>

          <Link
            href="/auth/login"
            className="w-full sm:w-1/2 flex items-center justify-between p-4 rounded-2xl border border-purple-500/40 bg-gradient-to-r from-purple-950/60 to-slate-900/80 hover:border-purple-400 hover:scale-[1.02] active:scale-[0.99] transition-all text-left group shadow-xl shadow-purple-500/10"
          >
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Government Official Intranet
              </div>
              <div className="text-sm font-bold text-white mt-0.5 group-hover:text-purple-300 transition-colors">
                Officer Desk (Parichay) →
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Risk Scrutiny, Joint Inspections & Delay Analytics
              </div>
            </div>
            <ShieldCheck className="h-8 w-8 text-purple-400/80 shrink-0 ml-2" />
          </Link>
        </div>

        {/* Hero Operational Action Buttons - Directly aligned with SIH 26130 Pillars */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/portal/kya"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-blue-600 to-accent-purple px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-500/25 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Search className="h-4 w-4" />
            Know Your Approvals (KYA & CAF)
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/portal/applications"
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-6 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all backdrop-blur-md"
          >
            <FolderCheck className="h-4 w-4 text-emerald-400" />
            Track Applications & Permits
          </Link>

          <Link
            href="/portal/compliance"
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-6 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all backdrop-blur-md"
          >
            <Calendar className="h-4 w-4 text-purple-400" />
            Annual Statutory Compliance
          </Link>

          <Link
            href="/portal/incentives"
            className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/20 px-6 py-3.5 text-sm font-bold text-amber-300 hover:bg-amber-900/40 hover:text-white transition-all backdrop-blur-md"
          >
            <Coins className="h-4 w-4 text-amber-400" />
            Government Subsidies & PSI 2019
          </Link>

          <Link
            href="/portal/clearances"
            className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-900/80 px-6 py-3.5 text-sm font-bold text-cyan-300 hover:border-cyan-400 hover:text-white transition-all backdrop-blur-md shadow-lg shadow-cyan-500/10 group"
          >
            <Building2 className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            Clearances & Approvals Directory
            <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-400/30">
              28 Clearances
            </span>
          </Link>
        </div>

        {/* Live Performance Comparison Card */}
        <div className="pt-6 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-blue-500/30 bg-slate-900/70 p-5 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-around gap-6">
            <div className="text-left space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Traditional Sequential Clearance
              </span>
              <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                240 Days
              </div>
              <p className="text-[11px] text-slate-400">Department silos & repetitive desk queries</p>
            </div>

            <div className="hidden sm:block h-12 w-px bg-slate-800" />

            <div className="text-left space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5" />
                AnumatiOne Concurrent Clearances
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
                78 Days
              </div>
              <p className="text-[11px] text-emerald-400 font-bold">162 Days Saved (Parallel Workflows)</p>
            </div>

            <div className="hidden sm:block h-12 w-px bg-slate-800" />

            <div className="text-left space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                RTS Act 2015 Protection
              </span>
              <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">
                Sec 4(1)
              </div>
              <p className="text-[11px] text-slate-400">Statutory SLA Deemed Approval safeguard</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Lifecycle Stages Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">
            End-to-End Enterprise Support
          </h2>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">
            Complete Industrial Lifecycle in 4 Stages
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Eliminating procedural friction from initial land acquisition to multi-year factory renewals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stage 1 */}
          <div className="rounded-2xl border border-blue-500/20 bg-slate-900/60 p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20">
                  STAGE 1 • PILLAR 1: APPROVALS
                </span>
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
              <h3 className="font-bold text-white text-base">Pre-Establishment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prior to ground construction. Parallel clearance orchestration across state agencies.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-blue-400" /> MIDC Land / Sec 44 NA Sanction</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-blue-400" /> MPCB Consent to Establish (CTE)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-blue-400" /> Building Plan Approval (SPA)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-blue-400" /> Fire Provisional NOC (MFS)</li>
              </ul>
            </div>
            <Link
              href="/portal/apply?stage=PRE_ESTABLISHMENT"
              className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-blue-400 flex items-center justify-between hover:text-blue-300"
            >
              <span>Apply Stage 1 CAF</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Stage 2 */}
          <div className="rounded-2xl border border-purple-500/20 bg-slate-900/60 p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-400 border border-purple-500/20">
                  STAGE 2 • PILLAR 1: PERMITS
                </span>
                <Zap className="h-4 w-4 text-purple-400" />
              </div>
              <h3 className="font-bold text-white text-base">Pre-Operation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Post-construction readiness. Synchronized joint inspections and operational consents.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-purple-400" /> MPCB Consent to Operate (CTO)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-purple-400" /> DISH Factory License (Form 2)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-purple-400" /> Steam Boiler Registration</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-purple-400" /> MSEDCL HT Energization & Meter</li>
              </ul>
            </div>
            <Link
              href="/portal/apply?stage=PRE_OPERATION"
              className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-purple-400 flex items-center justify-between hover:text-purple-300"
            >
              <span>Apply Stage 2 CAF</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Stage 3 */}
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  STAGE 3 • PILLAR 2: COMPLIANCE
                </span>
                <Calendar className="h-4 w-4 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white text-base">During Operations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated statutory return sentinel preventing regulatory notices and penalty compounding.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> MPCB Form V (Sept 30 Annual)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Hazardous Form 4 (June 30 Annual)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> DISH Form 27 Half-Yearly</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Fire Safety Audit Form B (Bi-Annual)</li>
              </ul>
            </div>
            <Link
              href="/portal/compliance"
              className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-emerald-400 flex items-center justify-between hover:text-emerald-300"
            >
              <span>File Statutory Returns</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Stage 4 */}
          <div className="rounded-2xl border border-amber-500/20 bg-slate-900/60 p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                  STAGE 4 • PILLAR 3: INCENTIVES
                </span>
                <Award className="h-4 w-4 text-amber-400" />
              </div>
              <h3 className="font-bold text-white text-base">Renewals & Subsidies</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero-re-entry renewals via MahaVault plus automatic PSI 2019 incentive disbursement.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-amber-400" /> 5-Year MPCB CTO Renewal</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-amber-400" /> 10-Year Factory License Renewal</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-amber-400" /> PSI 2019 Gross SGST Refunds</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-amber-400" /> Electricity Duty 100% Exemption</li>
              </ul>
            </div>
            <Link
              href="/portal/incentives"
              className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-amber-400 flex items-center justify-between hover:text-amber-300"
            >
              <span>Calculate PSI Subsidies</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Demo Scenario Presets */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 border-t border-slate-800/80">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">
            One-Click Maharashtra Industrial Profiles
          </h2>
          <p className="text-xl sm:text-2xl font-black text-white mt-1">
            Choose a Sector to Experience Real-Time KYA & CAF
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'EV_PUNE',
              badge: '⚡ EV & Batteries (Zone B)',
              title: 'Aegis Lithium Mobility',
              location: 'Chakan MIDC Phase IV, Pune',
              investment: '₹120 Cr Outlay • Orange Category',
              highlight: 'Green-Channel Eligible • 67% Time Saved',
              color: 'from-blue-600/20 to-emerald-600/20 border-blue-500/30',
            },
            {
              id: 'PHARMA_AURANGABAD',
              badge: '💊 Bulk Drugs (Zone C)',
              title: 'Vanguard Biopharma Life Sciences',
              location: 'Shendra MIDC / AURIC DMIC',
              investment: '₹85 Cr Outlay • Red Category ZLD',
              highlight: 'SEIAA & MPCB CTE Critical Path',
              color: 'from-rose-600/20 to-amber-600/20 border-rose-500/30',
            },
            {
              id: 'SOLAR_NAGPUR',
              badge: '☀️ Clean Tech Solar SEZ (Zone D+)',
              title: 'Helios Photovoltaics India',
              location: 'MIHAN SEZ / Butibori MIDC, Nagpur',
              investment: '₹45 Cr Outlay • White Category',
              highlight: 'White Category • Instant Self-Cert',
              color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30',
            },
            {
              id: 'FOOD_NASHIK',
              badge: '🌾 Agro MSME (Zone C)',
              title: 'Godavari Valley Agro Foods Ltd',
              location: 'Dindori Mega Food Park, Nashik',
              investment: '₹22 Cr Outlay • Green Category',
              highlight: '5% MSME PSI Subvention • Boilers',
              color: 'from-purple-600/20 to-blue-600/20 border-purple-500/30',
            },
          ].map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleLaunchScenario(profile.id)}
              className={`text-left rounded-2xl border bg-gradient-to-b ${profile.color} p-5 hover:scale-[1.02] active:scale-[0.99] transition-all group backdrop-blur-md shadow-xl flex flex-col justify-between`}
            >
              <div>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                  {profile.badge}
                </span>
                <h3 className="font-bold text-white text-base mt-1 group-hover:text-blue-300 transition-colors">
                  {profile.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{profile.location}</p>
                <div className="mt-3 font-mono text-xs font-semibold text-white">
                  {profile.investment}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400">
                <span className="text-[11px] text-emerald-400 font-medium">{profile.highlight}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Core Technological Innovations */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 border-t border-slate-800/80">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">
            System Innovations
          </h2>
          <p className="text-2xl font-black text-white mt-1">
            Eliminating Bottlenecks for Both Industrialists & Officers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base">Know Your Approvals (KYA)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              4-step wizard that dynamically generates your statutory clearance roadmap, RTS SLA countdowns, and PSI 2019 subsidies.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base">Zero-Query AI Pre-Scrutiny</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audits PAN, 27-GSTIN, Udyam, factory layouts, and effluent capacity before submission to avoid rejection cycles.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base">MahaVault Scrutiny Shield</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cross-department document re-use under RTS Act Sec 3(2). Verified MIDC leases and layouts cannot be re-queried by MPCB or DISH.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base">RTS Section 4(1) Deemed Approval</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enforces statutory time-bound clearances. If a department exceeds its SLA, legal deemed consent certificates are auto-issued.
            </p>
          </div>
        </div>
      </section>

      {/* Participating GoM Departments Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 border-t border-slate-800/80 text-center">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Integrated With Government of Maharashtra Statutory Bodies & Directorates
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-blue-400" /> MIDC</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-400" /> MPCB</span>
          <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-400" /> MSEDCL</span>
          <span className="flex items-center gap-1.5"><Layers className="h-4 w-4 text-purple-400" /> DISH (Factories)</span>
          <span className="flex items-center gap-1.5"><FileCheck2 className="h-4 w-4 text-rose-400" /> Directorate of Steam Boilers</span>
          <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-orange-400" /> Maharashtra Fire Services</span>
          <span className="flex items-center gap-1.5"><Gift className="h-4 w-4 text-teal-400" /> Directorate of Industries</span>
        </div>
      </section>
    </div>
  );
}
