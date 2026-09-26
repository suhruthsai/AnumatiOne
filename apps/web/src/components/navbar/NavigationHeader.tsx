'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
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
  AlertCircle,
  UserCheck,
  PlusCircle,
  Search
} from 'lucide-react';

export function NavigationHeader() {
  const pathname = usePathname();
  const { currentProfile, loadDemoProfile } = useAppStore();

  const navLinks = [
    { href: '/portal/kya', label: 'KYA Wizard', icon: Search, badge: 'Approvals' },
    { href: '/portal/apply', label: 'Apply (CAF)', icon: PlusCircle, badge: 'Unified' },
    { href: '/portal/applications', label: 'Applications', icon: FolderCheck, badge: 'Sentinel' },
    { href: '/portal/compliance', label: 'Compliance & Renewals', icon: FileCheck2 },
    { href: '/portal/incentives', label: 'Incentives (PSI)', icon: Gift },
    { href: '/officer', label: 'Officer Cockpit', icon: ShieldCheck },
    { href: '/portal/journey', label: 'Journey Map', icon: Compass },
    { href: '/portal/what-if', label: 'What-If', icon: GitBranch },
    { href: '/portal/grievances', label: 'Grievances', icon: AlertCircle },
    { href: '/admin', label: 'EODB', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 via-blue-500 to-accent-purple shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                Anumati<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">One</span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-brand-800/40 text-blue-300 border border-brand-500/30 shadow-sm shadow-blue-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                  {link.badge && (
                    <span className="ml-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Demo Profile Selector & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-xs">
            <span className="text-slate-400 text-[11px] hidden sm:inline">Cluster:</span>
            <select
              value={
                currentProfile.sector === 'EV_MANUFACTURING' ? 'EV_PUNE' :
                currentProfile.sector === 'PHARMA' ? 'PHARMA_AURANGABAD' :
                currentProfile.sector === 'RENEWABLE_ENERGY' ? 'SOLAR_NAGPUR' : 'FOOD_NASHIK'
              }
              onChange={(e) => loadDemoProfile(e.target.value)}
              className="bg-transparent text-xs font-medium text-blue-300 focus:outline-none cursor-pointer"
            >
              <option value="EV_PUNE" className="bg-slate-900 text-white">⚡ EV Plant (Pune Chakan MIDC)</option>
              <option value="PHARMA_AURANGABAD" className="bg-slate-900 text-white">💊 Pharma Red (AURIC Shendra)</option>
              <option value="SOLAR_NAGPUR" className="bg-slate-900 text-white">☀️ Solar Clean (Nagpur MIHAN SEZ)</option>
              <option value="FOOD_NASHIK" className="bg-slate-900 text-white">🌾 Agro MSME (Nashik Dindori Food Park)</option>
            </select>
          </div>

          <Link
            href="/portal/kya"
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-accent-purple px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-brand-500/20 hover:brightness-110 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            ⚡ Quick KYA
          </Link>
        </div>
      </div>
    </header>
  );
}
