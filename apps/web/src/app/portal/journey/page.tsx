'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { MetricHeader } from '@/components/journey/MetricHeader';
import { JourneyMapDAG } from '@/components/journey/JourneyMapDAG';
import { NodeDetailsDrawer } from '@/components/journey/NodeDetailsDrawer';
import { DigitalTwinScenarioSelector } from '@/components/journey/DigitalTwinScenarioSelector';
import { AdversarialStressTestConsole } from '@/components/journey/AdversarialStressTestConsole';
import { DigitalTwinExplainerModal } from '@/components/journey/DigitalTwinExplainerModal';
import { 
  TwinScenarioMode, 
  getResultForScenario 
} from '@/lib/simulator/digital-twin-engine';
import { 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Layers, 
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function JourneyPage() {
  const { 
    currentProfile, 
    simulationResult, 
    activeStrategyId, 
    setSimulationResult 
  } = useAppStore();

  const [activeTwinMode, setActiveTwinMode] = useState<TwinScenarioMode>('MINIMAX_CONCURRENCY');
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [showBottlenecksOnly, setShowBottlenecksOnly] = useState(false);
  const [activeShockDays, setActiveShockDays] = useState(0);

  if (!simulationResult) return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24 flex flex-col items-center justify-center text-center gap-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/10 border border-blue-500/20">
        <Layers className="h-10 w-10 text-blue-400" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white">No Simulation Loaded</h2>
        <p className="text-sm text-slate-400 max-w-md">
          Select a business profile using the cluster switcher in the nav bar, or use the KYA Wizard to configure your project — the DAG journey map will appear here automatically.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/portal/kya" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:brightness-110 transition-all">
          <Sparkles className="h-4 w-4" />
          Know Your Approvals (KYA)
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/portal/apply" className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-all">
          File a CAF Application
        </Link>
      </div>
    </div>
  );

  const currentStrategy = simulationResult.strategies.find(s => s.strategyId === activeStrategyId) || simulationResult.minimaxStrategy;

  const handleSelectScenario = (mode: TwinScenarioMode) => {
    setActiveTwinMode(mode);
    const newResult = getResultForScenario(mode, currentProfile);
    setSimulationResult(newResult);
  };

  const handleApplyShockDelay = (extraDays: number) => {
    setActiveShockDays(extraDays);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
      {/* 1. Flagship Metric Header with Time Saved vs Sequential */}
      <MetricHeader
        showCriticalOnly={showCriticalOnly}
        setShowCriticalOnly={setShowCriticalOnly}
        showBottlenecksOnly={showBottlenecksOnly}
        setShowBottlenecksOnly={setShowBottlenecksOnly}
      />

      {/* 2. Interactive Digital Twin 4-Scenario Selector */}
      <DigitalTwinScenarioSelector
        activeMode={activeTwinMode}
        onSelectMode={handleSelectScenario}
        onOpenExplainer={() => setIsExplainerOpen(true)}
      />

      {/* 3. Flagship Interactive D3.js DAG Canvas */}
      <div className="relative">
        {activeShockDays > 0 && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/80 px-3 py-1.5 text-xs font-bold text-rose-300 backdrop-blur-md shadow-lg animate-pulse">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Shock Injected: +{activeShockDays}d Bureaucratic Delay Active</span>
          </div>
        )}

        <JourneyMapDAG
          showCriticalOnly={showCriticalOnly}
          showBottlenecksOnly={showBottlenecksOnly}
        />
      </div>

      {/* 4. Adversarial Stress-Test & Self-Healing Console */}
      <AdversarialStressTestConsole
        onApplyShockDelay={handleApplyShockDelay}
      />

      {/* 5. Deep-Dive Strategy & Adversary Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Strategy Evaluation */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-blue-400" />
              Workflow Execution Model
            </h3>
            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-300">
              Resilience: {currentStrategy.resilienceScore}/100
            </span>
          </div>

          <p className="mt-3 text-xs text-slate-300 leading-relaxed">
            {currentStrategy.description}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
              <span className="text-[10px] text-slate-400 block">Fast-Track</span>
              <span className="font-mono font-bold text-emerald-400 text-sm mt-0.5 block">
                {currentStrategy.p10Days}d
              </span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
              <span className="text-[10px] text-slate-400 block">Expected</span>
              <span className="font-mono font-bold text-blue-400 text-sm mt-0.5 block">
                {currentStrategy.p50Days}d
              </span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
              <span className="text-[10px] text-slate-400 block">With Friction</span>
              <span className="font-mono font-bold text-rose-400 text-sm mt-0.5 block">
                {currentStrategy.worstCaseDays + activeShockDays}d
              </span>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
            <strong className="text-slate-300">Strategic Advantage:</strong> {currentStrategy.tradeoffs}
          </div>
        </div>

        {/* Real-World Maharashtra Perturbations */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              Maharashtra Department Objections
            </h3>
            <span className="text-[10px] text-slate-400">MahaVault Protections</span>
          </div>

          <div className="mt-3 space-y-2.5">
            {simulationResult.adversaryScenarios.slice(0, 2).map((scen) => (
              <div
                key={scen.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{scen.name}</span>
                  <span className="text-rose-400 font-mono text-[11px]">+{scen.delayDaysAdded}d Shock</span>
                </div>
                <p className="text-[11px] text-slate-400">{scen.triggerEvent}</p>
                <div className="text-[11px] text-emerald-400 font-medium bg-emerald-950/20 rounded p-1.5 border border-emerald-500/20">
                  🛡️ Defense: {scen.mitigationStrategy}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Bottleneck Playbook */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-rose-400" />
              Top System Bottleneck
            </h3>
            <span className="text-[10px] font-mono text-rose-400">Pacing Node</span>
          </div>

          {simulationResult.bottlenecks[0] && (
            <div className="mt-3 space-y-3 text-xs">
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 space-y-1">
                <div className="font-bold text-white text-sm">
                  {simulationResult.bottlenecks[0].nodeName}
                </div>
                <div className="text-[11px] text-slate-400">
                  {simulationResult.bottlenecks[0].department}
                </div>
                <div className="text-xs text-rose-300 pt-1">
                  {simulationResult.bottlenecks[0].reason}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-1">
                <span className="text-slate-400 text-[11px] uppercase font-bold block">
                  Prescribed Mitigation:
                </span>
                <p className="text-slate-200">
                  {simulationResult.bottlenecks[0].mitigationAction}
                </p>
              </div>

              <div className="pt-1">
                <Link
                  href="/portal/what-if"
                  className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-blue-500/30 bg-blue-500/10 py-2 text-xs font-bold text-blue-300 hover:bg-blue-500/20 transition-colors"
                >
                  Test Scenario in What-If Sandbox
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Sliding Node Details Drawer */}
      <NodeDetailsDrawer />

      {/* 7. Plain-English Digital Twin Explainer Modal for Judges */}
      <DigitalTwinExplainerModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
      />
    </div>
  );
}
