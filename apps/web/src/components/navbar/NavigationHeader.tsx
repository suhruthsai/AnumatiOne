'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore, SEED_OFFICERS, OfficerAccount } from '@/lib/store';
import { 
  Compass, 
  GitBranch, 
  FolderCheck, 
  ShieldCheck, 
  BarChart3, 
  Sparkles, 
  Layers, 
  FileCheck2,
  Gift,
  Building2,
  CalendarCheck,
  Search,
  PlusCircle,
  LogOut,
  ChevronDown,
  UserCheck,
  Award
} from 'lucide-react';

export function NavigationHeader() {
  const pathname = usePathname();
  const { 
    activeRole, 
    setActiveRole, 
    currentIndustrialist, 
    currentOfficer,
    loginOfficer,
    currentProfile, 
    loadDemoProfile 
  } = useAppStore();

  const isOfficerRoute = pathname.startsWith('/officer');
  const isAuthRoute = pathname.startsWith('/auth');

  // Sync role based on route
  useEffect(() => {
    if (isOfficerRoute && activeRole !== 'OFFICER') {
      setActiveRole('OFFICER');
    } else if (!isOfficerRoute && !isAuthRoute && activeRole !== 'APPLICANT') {
      setActiveRole('APPLICANT');
    }
  }, [pathname, isOfficerRoute, isAuthRoute, activeRole, setActiveRole]);

  // Applicant Navigation Links
  const applicantNavLinks = [
    { href: '/portal/clearances', label: 'Clearances Guide', icon: Building2, badge: 'Directory' },
    { href: '/portal/kya', label: 'KYA Checklist', icon: Search, badge: 'Step 1' },
    { href: '/portal/apply', label: 'Single CAF', icon: PlusCircle },
    { href: '/portal/applications', label: 'Dashboard', icon: FolderCheck, badge: 'All 4' },
    { href: '/portal/compliance', label: 'Compliance', icon: FileCheck2 },
    { href: '/portal/incentives', label: 'Incentives', icon: Gift },
    { href: '/portal/grievances', label: 'RTS Appeals', icon: Award },
  ];

  // Government Official Navigation Links
  const officerNavLinks = [
    { href: '/officer', label: 'Scrutiny Queue', icon: ShieldCheck, badge: currentOfficer?.department || 'MPCB' },
    { href: '/officer?tab=inspections', label: 'Joint Inspections', icon: CalendarCheck, badge: 'RTS 48h' },
    { href: '/officer?tab=vault', label: 'MahaVault Verifier', icon: Layers, badge: 'Sec 3(2)' },
    { href: '/officer?tab=analytics', label: 'Delay Analytics', icon: BarChart3 },
  ];

  const handleDepartmentSwitch = (officerKey: string) => {
    const officer = SEED_OFFICERS[officerKey];
    if (officer) {
      loginOfficer(officer);
    }
  };

  return (
    <div className="w-full">
      {/* Top Citizen Accessibility & Utility Bar (Startup Telangana Official Portal Style) */}
      <div className="w-full bg-[#060D4A] border-b border-[#C33764]/40 py-1.5 px-4 sm:px-6 text-[11px] text-slate-300">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
              <span className="text-[#C33764]">🏛️</span>
              Government of Maharashtra <span className="text-slate-500 hidden sm:inline">|</span> <span className="text-slate-400 hidden sm:inline">Industries & MSIS</span>
            </span>
            <span className="hidden md:inline text-slate-400">
              Toll-Free: <strong className="text-white font-mono">1800-120-8040</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
            <div className="hidden sm:flex items-center gap-1 border-r border-slate-700 pr-3">
              <span className="text-slate-400">Font:</span>
              <button type="button" className="px-1 font-bold hover:text-white transition-colors">A-</button>
              <button type="button" className="px-1 font-bold hover:text-white transition-colors">A</button>
              <button type="button" className="px-1 font-bold text-[#C33764] hover:text-rose-300 transition-colors">A+</button>
            </div>
            <Link href="/portal/grievances" className="hover:text-white font-semibold flex items-center gap-1 text-[#C33764]">
              RTS 2-Tier Appeals
            </Link>
            <Link 
              href={isOfficerRoute ? "/portal/applications" : "/auth/login"} 
              className="rounded bg-[#C33764] hover:bg-[#A82650] text-white px-2.5 py-0.5 font-bold transition-colors shadow-sm"
            >
              {isOfficerRoute ? "Switch to Investor Portal" : "Officer Desk (Parichay)"}
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#060D4A]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand Logo & Realm Badge */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#C33764] to-indigo-600 shadow-lg shadow-[#C33764]/25 group-hover:scale-105 transition-transform">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
                  Anumati<span className="text-[#C33764]">One</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Single-Window Portal
                </span>
              </div>
            </Link>

            {/* Current Realm Indicator Pill */}
            <div className="hidden lg:flex items-center">
              {isOfficerRoute ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                  <ShieldCheck className="h-3 w-3 text-purple-400" />
                  MAITRI Officer Desk • Parichay SSO
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#C33764]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#C33764] border border-[#C33764]/30">
                  <Building2 className="h-3 w-3 text-[#C33764]" />
                  Investor & Citizen Portal
                </span>
              )}
            </div>

            {/* Role-Specific Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {isOfficerRoute ? (
                /* Officer Tabs */
                officerNavLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href === '/officer' && pathname === '/officer' && !pathname.includes('?'));
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        isActive
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {link.label}
                      {link.badge && (
                        <span className="ml-1 rounded-full bg-purple-500/20 px-1.5 py-0.2 text-[9px] font-mono font-bold text-purple-300 border border-purple-500/30">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })
              ) : (
                /* Applicant Tabs */
                applicantNavLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        isActive
                          ? 'bg-[#C33764]/20 text-[#C33764] border border-[#C33764]/40 shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {link.label}
                      {link.badge && (
                        <span className="ml-1 rounded-full bg-[#C33764]/20 px-1.5 py-0.2 text-[9px] font-mono font-bold text-[#C33764] border border-[#C33764]/30">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })
              )}
            </nav>
          </div>

        {/* Right Section: Persona Selector + Gateway Switcher */}
        <div className="flex items-center gap-2.5">
          {isOfficerRoute ? (
            /* Officer Realm Controls */
            <>
              {/* Department Switcher Dropdown */}
              <div className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/30 px-2.5 py-1 text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <select
                  value={
                    currentOfficer?.department === 'MPCB' ? 'MPCB_PUNE' :
                    currentOfficer?.department === 'MIDC' ? 'MIDC_SPA' :
                    currentOfficer?.department === 'DISH' ? 'DISH_FACTORIES' :
                    currentOfficer?.department === 'MSEDCL' ? 'MSEDCL_POWER' : 'FIRE_SERVICES'
                  }
                  onChange={(e) => handleDepartmentSwitch(e.target.value)}
                  className="bg-transparent text-xs font-bold text-purple-200 focus:outline-none cursor-pointer"
                >
                  <option value="MPCB_PUNE" className="bg-slate-900 text-white">MPCB (Pollution Control Board)</option>
                  <option value="MIDC_SPA" className="bg-slate-900 text-white">MIDC (Special Planning Authority)</option>
                  <option value="DISH_FACTORIES" className="bg-slate-900 text-white">DISH (Industrial Safety & Health)</option>
                  <option value="MSEDCL_POWER" className="bg-slate-900 text-white">MSEDCL (HT Power Distribution)</option>
                  <option value="FIRE_SERVICES" className="bg-slate-900 text-white">Fire Services Command</option>
                </select>
              </div>

              {/* Fast Switcher to Applicant Portal for Evaluators */}
              <Link
                href="/portal/applications"
                onClick={() => setActiveRole('APPLICANT')}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all shadow-sm"
                title="Switch to Industrialist Portal"
              >
                <Building2 className="h-3.5 w-3.5 text-blue-400" />
                <span className="hidden sm:inline">Investor Portal</span>
              </Link>
            </>
          ) : (
            /* Applicant Realm Controls */
            <>
              {/* Enterprise Persona Selector */}
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-xs">
                <span className="text-slate-400 text-[11px] hidden sm:inline font-medium">Enterprise:</span>
                <select
                  value={
                    currentProfile.sector === 'EV_MANUFACTURING' ? 'EV_PUNE' :
                    currentProfile.sector === 'PHARMA' ? 'PHARMA_AURANGABAD' :
                    currentProfile.sector === 'RENEWABLE_ENERGY' ? 'SOLAR_NAGPUR' : 'FOOD_NASHIK'
                  }
                  onChange={(e) => loadDemoProfile(e.target.value)}
                  className="bg-transparent text-xs font-bold text-blue-300 focus:outline-none cursor-pointer"
                >
                  <option value="EV_PUNE" className="bg-slate-900 text-white">⚡ Aegis EV (Pune Chakan Zone B)</option>
                  <option value="PHARMA_AURANGABAD" className="bg-slate-900 text-white">💊 Vanguard Pharma (AURIC Zone D+)</option>
                  <option value="SOLAR_NAGPUR" className="bg-slate-900 text-white">☀️ Helios Solar (Nagpur SEZ Zone D+)</option>
                  <option value="FOOD_NASHIK" className="bg-slate-900 text-white">🌾 Godavari Agro (Nashik Zone C)</option>
                </select>
              </div>

              {/* Fast Switcher to Government Official Desk for Evaluators */}
              <Link
                href="/officer"
                onClick={() => setActiveRole('OFFICER')}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/40 transition-all shadow-sm"
                title="Switch to Government Officer Portal"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                <span className="hidden sm:inline">Officer Desk</span>
              </Link>
            </>
          )}

          {/* Central SSO Sign In Button (always available) */}
          <Link
            href="/auth/login"
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
            title="SSO Gateway"
          >
            <span>SSO</span>
          </Link>
        </div>
      </div>
    </header>
  </div>
  );
}
