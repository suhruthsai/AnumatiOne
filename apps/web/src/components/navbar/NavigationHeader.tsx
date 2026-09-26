'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Award,
  KeyRound,
  LayoutDashboard,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';

export function NavigationHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { 
    isAuthenticated,
    logout,
    restoreSession,
    activeRole, 
    setActiveRole, 
    currentIndustrialist, 
    currentOfficer,
    currentDeptAdmin,
    currentStateAdmin,
    loginOfficer,
    currentProfile, 
    loadDemoProfile 
  } = useAppStore();

  // Restore authenticated session on mount
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isOfficerRoute = pathname.startsWith('/officer');
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname.startsWith('/auth');

  // Maintain role consistency without auto-escalating unprivileged roles
  useEffect(() => {
    if (!isOfficerRoute && !isAdminRoute && !isAuthRoute && (activeRole === 'OFFICER' || activeRole === 'STATE_ADMIN')) {
      // If a staff/admin user navigated back to investor portal
      setActiveRole('APPLICANT');
    }
  }, [pathname, isOfficerRoute, isAdminRoute, isAuthRoute, activeRole, setActiveRole]);

  // Applicant Navigation Links: Strictly the 5 requested core modules
  const applicantNavLinks = [
    { href: '/portal/applications', label: 'Overview', icon: LayoutDashboard },
    { href: '/portal/profile', label: 'Project Profile', icon: Building2 },
    { href: '/portal/journey', label: 'Approval Journey', icon: GitBranch, badge: 'DAG' },
    { href: '/portal/documents', label: 'Documents', icon: FolderCheck, badge: 'MahaVault' },
    { href: '/portal/chat', label: 'Access to Chatbot', icon: MessageSquare, badge: 'AI' },
  ];

  // Secondary portal resource routes for quick access
  const secondaryResourceRoutes = [
    { href: '/portal/clearances', label: 'Clearances Guide' },
    { href: '/portal/apply', label: 'Single CAF' },
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

  // 1. Unauthenticated or Login Route: Show ONLY "AnumatiOne Access Portal" and nothing else
  if (!isAuthenticated || isAuthRoute) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#060D4A]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#C33764] to-indigo-600 shadow-lg shadow-[#C33764]/25 group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
                Anumati<span className="text-[#C33764]">One</span>
                <span className="text-slate-400 font-light text-base">|</span>
                <span className="text-sm font-semibold text-slate-200">Access Portal</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Government of Maharashtra • Unified Single Sign-On
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Parichay SSO & 2FA Protected
            </span>
          </div>
        </div>
      </header>
    );
  }

  // 2. Post-Login: Show full Applicant / Officer navigation, Enterprise switcher, and Logout
  return (
    <>
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
              {isAdminRoute ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  <BarChart3 className="h-3 w-3 text-amber-400" />
                  Apex State Secretariat • EODB Directorate
                </span>
              ) : isOfficerRoute ? (
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

        {/* Right Section: Persona Selector + User Profile + PROMINENT LOGOUT */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Switchers for Evaluators (hidden on small/medium to guarantee Logout visibility) */}
          {isOfficerRoute ? (
            <div className="hidden xl:flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/30 px-2 py-1 text-xs">
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
                  <option value="MPCB_PUNE" className="bg-slate-900 text-white">MPCB</option>
                  <option value="MIDC_SPA" className="bg-slate-900 text-white">MIDC</option>
                  <option value="DISH_FACTORIES" className="bg-slate-900 text-white">DISH</option>
                  <option value="MSEDCL_POWER" className="bg-slate-900 text-white">MSEDCL</option>
                  <option value="FIRE_SERVICES" className="bg-slate-900 text-white">FIRE</option>
                </select>
              </div>
              <Link
                href="/portal/applications"
                onClick={() => setActiveRole('APPLICANT')}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
              >
                Investor Portal
              </Link>
            </div>
          ) : (
            <div className="hidden xl:flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-xs">
                <span className="text-slate-400 text-[11px] font-medium">Enterprise:</span>
                <select
                  value={
                    currentProfile.sector === 'EV_MANUFACTURING' ? 'EV_PUNE' :
                    currentProfile.sector === 'PHARMA' ? 'PHARMA_AURANGABAD' :
                    currentProfile.sector === 'RENEWABLE_ENERGY' ? 'SOLAR_NAGPUR' : 'FOOD_NASHIK'
                  }
                  onChange={(e) => loadDemoProfile(e.target.value)}
                  className="bg-transparent text-xs font-bold text-blue-300 focus:outline-none cursor-pointer max-w-[150px] truncate"
                >
                  <option value="EV_PUNE" className="bg-slate-900 text-white">⚡ Aegis EV</option>
                  <option value="PHARMA_AURANGABAD" className="bg-slate-900 text-white">💊 Vanguard Pharma</option>
                  <option value="SOLAR_NAGPUR" className="bg-slate-900 text-white">☀️ Helios Solar</option>
                  <option value="FOOD_NASHIK" className="bg-slate-900 text-white">🌾 Godavari Agro</option>
                </select>
              </div>
            </div>
          )}

          {/* User Account Info Chip (Desktop) */}
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-700/60 px-2.5 py-1 text-xs shrink-0">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <UserCheck className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col text-left max-w-[130px] truncate">
                <span className="font-bold text-white text-[11px] truncate leading-tight">
                  {activeRole === 'OFFICER' ? (currentOfficer?.fullName?.split(',')[0] || 'MPCB Officer') :
                   activeRole === 'DEPT_ADMIN' ? (currentDeptAdmin?.fullName?.split(',')[0] || 'Dept Admin') :
                   activeRole === 'STATE_ADMIN' ? (currentStateAdmin?.fullName?.split(',')[0] || 'State Admin') :
                   (currentIndustrialist?.fullName || 'Rajesh Patil')}
                </span>
                <span className="text-[9px] text-slate-400 truncate leading-tight">
                  {activeRole === 'OFFICER' ? (currentOfficer?.department || 'MPCB') :
                   activeRole === 'DEPT_ADMIN' ? (currentDeptAdmin?.department || 'HQ') :
                   activeRole === 'STATE_ADMIN' ? 'Secretariat' :
                   (currentIndustrialist?.companyName?.replace(' Pvt Ltd', '').replace(' Private Limited', '') || currentProfile.companyName || 'Aegis EV')}
                </span>
              </div>
            </div>
          )}

          {/* PROMINENT, UNMISTAKABLE LOGOUT BUTTON (Always pinned top-right) */}
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                router.push('/auth/login');
              }}
              className="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-900/50 border border-red-400/80 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
              title="Click to Logout of current session"
            >
              <LogOut className="h-4 w-4 text-white" />
              <span>Logout</span>
            </button>
          ) : !isAuthRoute ? (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#C33764] to-pink-600 hover:from-[#A82650] hover:to-pink-700 shadow-md shadow-[#C33764]/20 transition-all active:scale-[0.98] shrink-0"
              title="Multi-Role SSO Gateway"
            >
              <KeyRound className="h-3.5 w-3.5 text-rose-200" />
              <span>Sign In</span>
            </Link>
          ) : null}

          {/* Mobile / Tablet Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Secondary Full-Width Session Bar Under Main Header (Visible when logged in) */}
      {isAuthenticated && !isAuthRoute && (
        <div className="w-full border-t border-slate-800/80 bg-slate-950/90 px-4 py-1.5 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-slate-400 text-[11px] shrink-0">Logged In:</span>
              <strong className="text-white text-[11px] font-bold truncate">
                {activeRole === 'OFFICER' ? (currentOfficer?.fullName?.split(',')[0] || 'MPCB Officer') :
                 activeRole === 'DEPT_ADMIN' ? (currentDeptAdmin?.fullName?.split(',')[0] || 'Dept Admin') :
                 activeRole === 'STATE_ADMIN' ? (currentStateAdmin?.fullName?.split(',')[0] || 'State Admin') :
                 (currentIndustrialist?.fullName || 'Rajesh Patil')}
              </strong>
              <span className="text-slate-500 text-[11px] hidden md:inline truncate">
                • {activeRole === 'OFFICER' ? (currentOfficer?.department || 'MPCB') :
                   activeRole === 'DEPT_ADMIN' ? (currentDeptAdmin?.department || 'HQ') :
                   activeRole === 'STATE_ADMIN' ? 'Secretariat' :
                   (currentIndustrialist?.companyName || currentProfile.companyName || 'Aegis EV')}
              </span>
              <span className="rounded bg-[#C33764]/20 px-2 py-0.5 text-[9px] font-mono font-bold text-[#C33764] border border-[#C33764]/30 shrink-0">
                {activeRole}
              </span>
            </div>
            <button
              onClick={() => {
                logout();
                router.push('/auth/login');
              }}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-[11px] font-bold text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 transition-all shrink-0 cursor-pointer"
              title="End current session"
            >
              <LogOut className="h-3 w-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#060D4A] px-4 py-4 space-y-4 shadow-2xl">
          {/* User Profile Card in Mobile Menu */}
          {isAuthenticated ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {activeRole === 'OFFICER' ? (currentOfficer?.fullName?.split(',')[0] || 'MPCB Officer') :
                     activeRole === 'DEPT_ADMIN' ? (currentDeptAdmin?.fullName?.split(',')[0] || 'Dept Admin') :
                     activeRole === 'STATE_ADMIN' ? (currentStateAdmin?.fullName?.split(',')[0] || 'State Admin') :
                     (currentIndustrialist?.fullName || 'Rajesh Patil')}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {activeRole}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push('/auth/login');
                }}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow border border-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C33764] to-pink-600 py-2.5 text-xs font-bold text-white"
            >
              <KeyRound className="h-4 w-4" />
              <span>Sign In to Portal</span>
            </Link>
          )}

          {/* Mobile Navigation Links */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              {isOfficerRoute ? 'Officer Services' : 'Applicant Modules'}
            </div>
            {(isOfficerRoute ? officerNavLinks : applicantNavLinks).map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#C33764]/20 text-white border border-[#C33764]/40'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#C33764]" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-mono font-bold text-slate-300">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Evaluator Quick Switchers (Only for Government Staff & Admins) */}
          {(activeRole === 'OFFICER' || activeRole === 'DEPT_ADMIN' || activeRole === 'STATE_ADMIN') && (
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
              <Link
                href="/portal/applications"
                onClick={() => setActiveRole('APPLICANT')}
                className="flex-1 text-center py-1.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 font-bold"
              >
                Investor Portal
              </Link>
              <Link
                href="/officer"
                onClick={() => setActiveRole('OFFICER')}
                className="flex-1 text-center py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 font-bold"
              >
                Officer Desk
              </Link>
              <Link
                href="/admin"
                onClick={() => setActiveRole('STATE_ADMIN')}
                className="flex-1 text-center py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 font-bold"
              >
                State EODB
              </Link>
            </div>
          )}
        </div>
      )}
    </header>

    {/* Floating Bottom-Right Session Chip (Always Visible when logged in) */}
    {isAuthenticated && (
      <div className="fixed bottom-6 right-20 z-30 hidden md:flex items-center gap-2 rounded-full border border-red-500/40 bg-slate-950/95 px-3 py-1.5 shadow-2xl backdrop-blur-md">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="text-[11px] font-semibold text-slate-200">
          {activeRole === 'OFFICER' ? (currentOfficer?.fullName?.split(',')[0] || 'MPCB Officer') :
           activeRole === 'DEPT_ADMIN' ? (currentDeptAdmin?.fullName?.split(',')[0] || 'Dept Admin') :
           activeRole === 'STATE_ADMIN' ? (currentStateAdmin?.fullName?.split(',')[0] || 'State Admin') :
           (currentIndustrialist?.fullName || 'Rajesh Patil')}
        </span>
        <button
          onClick={() => {
            logout();
            router.push('/auth/login');
          }}
          className="flex items-center gap-1 rounded-full bg-red-600 hover:bg-red-500 px-2.5 py-0.5 text-[10px] font-black text-white transition-all shadow hover:scale-105 active:scale-95 cursor-pointer"
          title="Sign out of AnumatiOne"
        >
          <LogOut className="h-3 w-3" />
          <span>LOGOUT</span>
        </button>
      </div>
    )}
  </>
  );
}
