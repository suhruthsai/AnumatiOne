'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ExternalLink, 
  ArrowRight,
  Scale,
  Sparkles,
  FileText,
  Layers,
  ChevronRight
} from 'lucide-react';

export function StatePortalFooter() {
  return (
    <footer className="w-full bg-[#060D4A] border-t-4 border-[#C33764] text-slate-300">
      {/* Top Banner / Quick Access Ribbon */}
      <div className="border-b border-white/10 bg-[#040833] py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C33764] text-white font-bold">
              📞
            </span>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Industrialist & Citizen 24x7 Support Helpline
              </span>
              <span className="text-white font-mono font-bold text-sm">
                1800-120-8040 (Toll Free) • support@anumatione.maharashtra.gov.in
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">Maharashtra RTS Act 2015 SLA Guarantee:</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
              ⚡ Deemed Approval Active
            </span>
            <Link 
              href="/auth/login"
              className="text-[#C33764] hover:text-rose-300 font-bold flex items-center gap-1 transition-colors"
            >
              Officer Desk (Parichay) →
            </Link>
          </div>
        </div>
      </div>

      {/* Main 4-Column Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Government Authority Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#C33764] to-indigo-600 text-white shadow-lg shadow-[#C33764]/30">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-white font-black text-lg tracking-tight flex items-center gap-1">
                  Anumati<span className="text-[#C33764]">One</span>
                </h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Govt of Maharashtra
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Unified Single-Window Industrial Clearances, Compliance Automation, and Package Scheme of Incentives (PSI 2019) digital administration platform.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#C33764] shrink-0 mt-0.5" />
                <span>Maharashtra State Innovation Society (MSIS), 4th Floor, Mantralaya, Nariman Point, Mumbai 400032</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#C33764] shrink-0" />
                <span>Working Hours: Mon – Fri 9:45 AM to 6:15 PM</span>
              </div>
            </div>
          </div>

          {/* Column 2: Approvals & Clearances */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-2 flex items-center justify-between">
              <span>Approvals & Clearances</span>
              <Building2 className="h-4 w-4 text-[#C33764]" />
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/portal/clearances" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>Clearances & Approvals Directory (28 Clearances)</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/kya" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>Know Your Approvals (KYA Wizard)</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/apply" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>Single-Window Common Application Form (CAF)</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/clearances?stage=GREEN_CHANNEL" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>48-Hour Green Channel Self-Certification</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/journey" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>Clearance Journey DAG Path Visualizer</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Compliance & Incentives */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-2 flex items-center justify-between">
              <span>Compliance & Subsidies</span>
              <FileText className="h-4 w-4 text-[#C33764]" />
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/portal/applications" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>Unified 4-Quadrant Industrialist Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/compliance" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>Annual Statutory Returns (MPCB Form V & 4)</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/compliance" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>DISH Factory Safety Annual Return Form 27</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/incentives" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>Package Scheme of Incentives (PSI 2019)</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/incentives" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>100% Stamp Duty & Electricity Duty Waivers</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: RTS Safeguards & Officer Access */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-2 flex items-center justify-between">
              <span>Legal Safeguards & Portals</span>
              <Scale className="h-4 w-4 text-[#C33764]" />
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/portal/grievances" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>RTS Act 2015 Two-Tier Grievance Escalator</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/grievances" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>Section 18 First Appeal (Designated Officer)</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/grievances" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>Section 19 Second Appeal & ₹250/day Fines</span>
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>Dual Sovereign Gateway Login Portal</span>
                </Link>
              </li>
              <li>
                <Link href="/officer" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-[#C33764]" />
                  <span>Officer Cockpit (Risk Scrutiny & Delay Analytics)</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Accessibility Bar */}
      <div className="border-t border-white/10 bg-[#020520] py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <p>© 2026 Government of Maharashtra. All Rights Reserved.</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              AnumatiOne is the sovereign industrial approval platform designed under Smart India Hackathon (SIH 26130) for Maharashtra State Innovation Society (MSIS).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <Link href="/portal/clearances" className="hover:text-white transition-colors">Clearances Guide</Link>
            <span className="text-slate-600">•</span>
            <Link href="/portal/kya" className="hover:text-white transition-colors">KYA Wizard</Link>
            <span className="text-slate-600">•</span>
            <Link href="/portal/grievances" className="hover:text-white transition-colors">Citizen Charter</Link>
            <span className="text-slate-600">•</span>
            <Link href="/auth/login" className="hover:text-white transition-colors">Official Intranet</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
