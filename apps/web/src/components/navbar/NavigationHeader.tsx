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
    { href: '/portal/kya', label: 'Clearances & CAF', icon: Search, badge: 'Pillar 1' },
    { href: '/portal/applications', label: 'Status & Permits', icon: FolderCheck },
    { href: '/portal/compliance', label: 'Annual Compliance', icon: FileCheck2, badge: 'Pillar 2' },
    { href: '/portal/incentives', label: 'Incentives & Subsidies', icon: Gift, badge: 'Pillar 3' },
  ];

  const isOfficerActive = pathname === '/officer';

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

          {/* Core 3-Pillar Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href === '/portal/kya' && (pathname === '/portal/apply' || pathname === '/portal/journey'));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                  {link.badge && (
                    <span className="ml-1 rounded-full bg-blue-500/20 px-1.5 py-0.2 text-[9px] font-mono font-bold text-blue-300 border border-blue-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Cluster Demo Selector & Dedicated Officer Portal Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-xs">
            <span className="text-slate-400 text-[11px] hidden sm:inline font-medium">Cluster:</span>
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
            href="/officer"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all border ${
              isOfficerActive
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20'
                : 'bg-purple-950/30 text-purple-300 border-purple-500/30 hover:bg-purple-900/40'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
            <span className="hidden sm:inline">Officer Cockpit</span>
            <span className="sm:hidden">Officer</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
