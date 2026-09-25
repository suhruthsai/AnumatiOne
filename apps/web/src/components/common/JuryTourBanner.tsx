'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Factory, 
  ShieldCheck, 
  Clock, 
  Scale, 
  ArrowRight,
  ExternalLink,
  Award
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function JuryTourBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const { loginIndustrialist } = useAppStore();

  const handleLaunchScenario = (scenario: number) => {
    if (scenario === 1) {
      // Scenario 1: Greenfield EV Mega Unit (Chakan MIDC)
      loginIndustrialist({
        userId: 'ind_001',
        fullName: 'Mr. Vikram Deshmukh',
        designation: 'Managing Director',
        phone: '+91 98220 54321',
        email: 'vikram.deshmukh@sahyadri-battery.in',
        companyName: 'Sahyadri EV Battery Systems Pvt Ltd',
        entityType: 'PVT_LTD',
        pan: 'AABCS8819Q',
        gstin: '27AABCS8819Q1ZP',
        udyamNumber: 'UDYAM-MH-26-008219',
        isKycVerified: true,
      });
      router.push('/portal/kya?sector=EV_MANUFACTURING&zone=ZONE_A&cluster=MIDC+Chakan+Phase+II%2C+Pune&costCr=54.5&stage=PRE_ESTABLISHMENT');
    } else if (scenario === 2) {
      // Scenario 2: Officer Cockpit & Repetitive Scrutiny Shield (RTS Sec 3(2))
      router.push('/officer');
    } else if (scenario === 3) {
      // Scenario 3: Real-Time Applications Sentinel with RTS Deemed Approval
      router.push('/portal/applications');
    } else if (scenario === 4) {
      // Scenario 4: RTS Two-Tier Statutory Appeal Escalator (Sec 18/19)
      router.push('/portal/grievances');
    }
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-2xl z-50">
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="ml-auto flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-2 text-xs font-black text-white shadow-2xl shadow-blue-500/50 hover:brightness-110 border border-blue-400/40 backdrop-blur-md transition-all animate-pulse"
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>⚡ Evaluator Quick Tour (Pitch Mode)</span>
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
      ) : (
        <div className="rounded-2xl border border-blue-500/40 bg-slate-950/95 p-4 shadow-2xl shadow-blue-950/80 backdrop-blur-xl space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Jury Evaluator Pitch Controller
                  </span>
                  <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">
                    SIH 26130 Ready
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  1-Click Live CUJ walkthroughs for Government of Maharashtra evaluators
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Minimise Pitch Bar"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 4 Interactive Scenarios */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
            <button
              type="button"
              onClick={() => handleLaunchScenario(1)}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-blue-950/50 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                <Factory className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[10px] font-mono font-bold">CUJ 01</span>
              </div>
              <div className="text-[11px] font-bold text-white group-hover:text-blue-300 truncate">
                Mega EV Plant
              </div>
              <div className="text-[9px] text-slate-400 truncate">
                KYA + 11 Schemes + CAF
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleLaunchScenario(2)}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-emerald-950/50 hover:border-emerald-500/50 transition-all group"
            >
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[10px] font-mono font-bold">CUJ 02</span>
              </div>
              <div className="text-[11px] font-bold text-white group-hover:text-emerald-300 truncate">
                Scrutiny Shield
              </div>
              <div className="text-[9px] text-slate-400 truncate">
                RTS Sec 3(2) Cross-Lock
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleLaunchScenario(3)}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-amber-950/50 hover:border-amber-500/50 transition-all group"
            >
              <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[10px] font-mono font-bold">CUJ 03</span>
              </div>
              <div className="text-[11px] font-bold text-white group-hover:text-amber-300 truncate">
                Deemed Approval
              </div>
              <div className="text-[9px] text-slate-400 truncate">
                Sec 4(1) Live Clocks
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleLaunchScenario(4)}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-rose-950/50 hover:border-rose-500/50 transition-all group"
            >
              <div className="flex items-center gap-1.5 text-rose-400 mb-1">
                <Scale className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[10px] font-mono font-bold">CUJ 04</span>
              </div>
              <div className="text-[11px] font-bold text-white group-hover:text-rose-300 truncate">
                2-Tier Appeals
              </div>
              <div className="text-[9px] text-slate-400 truncate">
                Collector RTS Sec 18
              </div>
            </button>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
            <span className="flex items-center gap-1 text-slate-300">
              <Award className="h-3 w-3 text-amber-400" />
              11 Official Maharashtra Schemes Modeled
            </span>
            <span className="hidden sm:inline font-mono text-blue-400">
              Current Route: {pathname}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
