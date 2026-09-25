'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Zap, 
  Clock, 
  Calendar, 
  IndianRupee, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  TrendingDown,
  Layers
} from 'lucide-react';
import { StrategyKey } from '@approvalos/shared';

interface MetricHeaderProps {
  showCriticalOnly: boolean;
  setShowCriticalOnly: (val: boolean) => void;
  showBottlenecksOnly: boolean;
  setShowBottlenecksOnly: (val: boolean) => void;
}

export function MetricHeader({
  showCriticalOnly,
  setShowCriticalOnly,
  showBottlenecksOnly,
  setShowBottlenecksOnly,
}: MetricHeaderProps) {
  const { currentProfile, simulationResult, activeStrategyId, setActiveStrategyId } = useAppStore();

  if (!simulationResult) return null;

  const currentStrategy = simulationResult.strategies.find(s => s.strategyId === activeStrategyId) || simulationResult.minimaxStrategy;
  const currentOptimizedDays = currentStrategy.p50Days;
  const daysSaved = Math.max(0, simulationResult.sequentialDays - currentOptimizedDays);
  const percentageSaved = Math.round((daysSaved / simulationResult.sequentialDays) * 100);

  return (
    <div className="space-y-4">
      {/* Flagship Hero Banner: Time Saved vs Sequential */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-slate-950 via-brand-950/80 to-slate-950 p-5 shadow-2xl shadow-brand-900/30">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              Government of Maharashtra • Single-Window Approval & Scheme Navigator
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{currentProfile.companyName}</span>
              <span className="text-xs font-mono font-normal text-slate-400 border border-slate-800 rounded px-2 py-0.5 bg-slate-900">
                {currentProfile.state} • {currentProfile.sector.replace('_', ' ')}
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Intelligent multi-department parallel orchestration across MIDC, MPCB, DISH, and MSEDCL with pre-validated blueprints and RTS Act statutory guarantees.
            </p>
          </div>

          {/* Time Saved Stat Callout */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 sm:px-5 sm:py-3.5 backdrop-blur-md">
              <div className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5" />
                Time Saved vs Sequential
              </div>
              <div className="mt-0.5 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-300" suppressHydrationWarning>
                  {daysSaved} Days
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full" suppressHydrationWarning>
                  {percentageSaved}% FASTER
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Sequential Filing:</span>
                <span className="font-mono font-bold text-rose-400" suppressHydrationWarning>{simulationResult.sequentialDays} days</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Optimized Concurrency:</span>
                <span className="font-mono font-bold text-blue-300" suppressHydrationWarning>{currentOptimizedDays} days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Highlights & Visual Graph Filters */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              MahaVault Pre-Validation: Active
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-300">
              <Layers className="h-3.5 w-3.5 text-blue-400" />
              4 Parallel Department Lanes
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 text-xs font-semibold text-purple-300">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              MH RTS Act 2015 Protected
            </span>
          </div>

          {/* Interactive Visual Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCriticalOnly(!showCriticalOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                showCriticalOnly
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              Critical Path ({simulationResult.criticalPath.length})
            </button>
            <button
              onClick={() => setShowBottlenecksOnly(!showBottlenecksOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                showBottlenecksOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Bottlenecks ({simulationResult.bottlenecks.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
