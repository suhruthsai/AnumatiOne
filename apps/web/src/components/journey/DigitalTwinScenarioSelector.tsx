'use client';

import React from 'react';
import { 
  TwinScenarioMode, 
  TWIN_SCENARIOS, 
  TwinScenarioDetail 
} from '@/lib/simulator/digital-twin-engine';
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  TrendingDown,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface DigitalTwinScenarioSelectorProps {
  activeMode: TwinScenarioMode;
  onSelectMode: (mode: TwinScenarioMode) => void;
  onOpenExplainer: () => void;
}

export function DigitalTwinScenarioSelector({
  activeMode,
  onSelectMode,
  onOpenExplainer,
}: DigitalTwinScenarioSelectorProps) {
  const currentScenario = TWIN_SCENARIOS[activeMode];

  return (
    <div className="space-y-4">
      {/* Top Header with Explainer Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                Maharashtra Regulatory Digital Twin Simulator
              </h2>
              <span className="font-mono text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                Interactive Operational Sandbox
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simulate how your factory navigates state clearances under 4 distinct regulatory scenarios.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenExplainer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-all self-start sm:self-auto shadow-sm"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>How Does the Twin Work?</span>
        </button>
      </div>

      {/* 4 Interactive Scenario Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(TWIN_SCENARIOS) as TwinScenarioMode[]).map((mode) => {
          const scenario = TWIN_SCENARIOS[mode];
          const isSelected = activeMode === mode;

          let borderClass = 'border-slate-800 hover:border-slate-700 bg-slate-900/60';
          let badgeBg = 'bg-slate-800 text-slate-300';
          let dayColor = 'text-white';

          if (scenario.badgeColor === 'blue') {
            if (isSelected) borderClass = 'border-blue-500 bg-blue-950/30 shadow-lg shadow-blue-500/15 ring-1 ring-blue-500/50';
            badgeBg = 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
            dayColor = 'text-blue-300';
          } else if (scenario.badgeColor === 'emerald') {
            if (isSelected) borderClass = 'border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-500/15 ring-1 ring-emerald-500/50';
            badgeBg = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
            dayColor = 'text-emerald-300';
          } else if (scenario.badgeColor === 'amber') {
            if (isSelected) borderClass = 'border-amber-500 bg-amber-950/30 shadow-lg shadow-amber-500/15 ring-1 ring-amber-500/50';
            badgeBg = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
            dayColor = 'text-amber-300';
          } else if (scenario.badgeColor === 'rose') {
            if (isSelected) borderClass = 'border-rose-500 bg-rose-950/30 shadow-lg shadow-rose-500/15 ring-1 ring-rose-500/50';
            badgeBg = 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
            dayColor = 'text-rose-400';
          }

          return (
            <button
              key={mode}
              onClick={() => onSelectMode(mode)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${borderClass}`}
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${badgeBg}`}>
                    {scenario.badge}
                  </span>
                  {scenario.recommended && (
                    <span className="text-[9px] font-extrabold text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded">
                      ★ AI Recommended
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mt-2.5 line-clamp-1">
                  {scenario.name}
                </h3>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {scenario.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated SLA</span>
                  <span className={`text-2xl font-black font-mono ${dayColor}`}>
                    {scenario.totalDays} <span className="text-xs font-normal text-slate-400">days</span>
                  </span>
                </div>

                {scenario.daysSavedVsSequential > 0 ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    -{scenario.daysSavedVsSequential}d ({scenario.percentageFaster}%)
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    Baseline Silo
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Detail & Plain-Language Explanation */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Active Scenario:</span>
              <span className="text-xs font-bold text-blue-400 font-mono">
                {currentScenario.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({currentScenario.concurrencyLanes} Parallel Lanes • {currentScenario.rtsDeemedEligibleCount} RTS Deemed Permits)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              💡 <strong className="text-white">In Plain English: </strong>
              {currentScenario.plainEnglishExplanation}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 block">Resilience</span>
              <span className="font-mono font-bold text-emerald-400 text-sm mt-0.5 block">
                {currentScenario.resilienceScore}/100
              </span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 block">Critical Path</span>
              <span className="font-mono font-bold text-rose-400 text-sm mt-0.5 block">
                {currentScenario.criticalPathCount} Nodes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
