'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { StateType, LandType, PollutionCategory } from '@approvalos/shared';
import { compareWhatIfScenarios } from '@/lib/simulator/what-if-engine';
import { 
  GitCompare, 
  ArrowRight, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles,
  MapPin,
  Building,
  Leaf
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function ScenarioComparison() {
  const { currentProfile, setProfile } = useAppStore();

  const [targetState, setTargetState] = useState<StateType>('MAHARASHTRA');
  const [targetLandType, setTargetLandType] = useState<LandType>(
    currentProfile.landType === 'GOVT_INDUSTRIAL_PARK' ? 'PRIVATE_AGRICULTURAL' : 'GOVT_INDUSTRIAL_PARK'
  );
  const [targetPollution, setTargetPollution] = useState<PollutionCategory>(
    currentProfile.pollutionCategory === 'RED' ? 'ORANGE' : 'GREEN'
  );

  const [comparison, setComparison] = useState(() => {
    return compareWhatIfScenarios(currentProfile, {
      state: 'MAHARASHTRA',
      landType: targetLandType,
      pollutionCategory: targetPollution,
    });
  });

  const handleRecalculate = (
    newState: StateType,
    newLand: LandType,
    newPollution: PollutionCategory
  ) => {
    setTargetState('MAHARASHTRA');
    setTargetLandType(newLand);
    setTargetPollution(newPollution);

    const comp = compareWhatIfScenarios(currentProfile, {
      state: 'MAHARASHTRA',
      landType: newLand,
      pollutionCategory: newPollution,
    });
    setComparison(comp);
  };

  const handleApplyScenario = () => {
    setProfile(comparison.scenario.profile);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  const isFaster = comparison.deltaDays < 0;

  return (
    <div className="space-y-6">
      {/* Parameter Control Sandbox Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <GitCompare className="h-5 w-5 text-blue-400" />
          <h2 className="text-base font-bold text-white">
            What-If Scenario Sandbox Parameters
          </h2>
          <span className="text-xs text-slate-400 ml-2">
            Simulate pivots before acquiring land or engaging architects in Maharashtra
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* State Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <MapPin className="h-3.5 w-3.5 text-blue-400" />
              State Authority
            </label>
            <select
              value={targetState}
              disabled
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none opacity-90 cursor-not-allowed"
            >
              <option value="MAHARASHTRA">Maharashtra (MAITRI Single Window)</option>
            </select>
          </div>

          {/* Land Type */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Building className="h-3.5 w-3.5 text-blue-400" />
              Land Parcel Category
            </label>
            <select
              value={targetLandType}
              onChange={(e) => handleRecalculate(targetState, e.target.value as LandType, targetPollution)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="GOVT_INDUSTRIAL_PARK">Govt Industrial Park (MIDC Industrial Area)</option>
              <option value="PRIVATE_AGRICULTURAL">Private Agricultural Land (Requires CLU/NA)</option>
              <option value="SEZ">Special Economic Zone (SEZ Export Unit)</option>
              <option value="BROWNFIELD_EXISTING">Brownfield Existing Plant Expansion</option>
            </select>
          </div>

          {/* Pollution Category */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              Pollution Classification
            </label>
            <select
              value={targetPollution}
              onChange={(e) => handleRecalculate(targetState, targetLandType, e.target.value as PollutionCategory)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="WHITE">White Category (Zero Emission, Green Channel)</option>
              <option value="GREEN">Green Category (Low Effluent, Self-Cert)</option>
              <option value="ORANGE">Orange Category (Medium Scrutiny)</option>
              <option value="RED">Red Category (Mandatory EIA/EC Public Hearing)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Delta Callout Card */}
      <div className={`rounded-2xl border p-5 transition-all ${
        isFaster 
          ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950'
          : 'border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-slate-950 to-slate-950'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Scenario Comparative Impact
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{isFaster ? 'Accelerates Launch by' : 'Delays Launch by'}</span>
              <span className={isFaster ? 'text-emerald-400' : 'text-rose-400'}>
                {Math.abs(comparison.deltaDays)} Days
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isFaster ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {isFaster ? `-${Math.abs(comparison.deltaPercentage)}%` : `+${comparison.deltaPercentage}%`}
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              {comparison.recommendation}
            </p>
          </div>

          <button
            onClick={handleApplyScenario}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-accent-purple px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:brightness-110 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <Sparkles className="h-4 w-4" />
            Switch Active Profile to this Scenario
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Baseline Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Current Active Baseline
              </span>
              <h4 className="text-base font-bold text-white">
                {comparison.baseline.profile.state} • {comparison.baseline.profile.landType.replace(/_/g, ' ')}
              </h4>
            </div>
            <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-300">
              Baseline
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="text-slate-400 text-[11px]">Total Approvals</div>
              <div className="text-lg font-bold text-white mt-1">
                {comparison.baseline.result.totalApprovalsCount}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="text-slate-400 text-[11px]">Optimized Timeline</div>
              <div className="text-lg font-bold text-blue-400 mt-1">
                {comparison.baseline.result.optimizedDays} days
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="text-slate-400 text-[11px]">Parallel Lanes</div>
              <div className="text-lg font-bold text-slate-200 mt-1">
                {comparison.baseline.result.parallelLanes.length} Lanes
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="text-slate-400 text-[11px]">Critical Path Nodes</div>
              <div className="text-lg font-bold text-rose-400 mt-1">
                {comparison.baseline.result.criticalPath.length}
              </div>
            </div>
          </div>
        </div>

        {/* Alternate Scenario Card */}
        <div className="rounded-2xl border border-blue-500/30 bg-slate-900/80 p-5 shadow-xl shadow-blue-500/5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                Simulated Alternate Scenario
              </span>
              <h4 className="text-base font-bold text-white">
                {comparison.scenario.profile.state} • {comparison.scenario.profile.landType.replace(/_/g, ' ')}
              </h4>
            </div>
            <span className="rounded-lg bg-blue-500/20 border border-blue-500/30 px-2.5 py-1 text-xs font-mono font-semibold text-blue-300">
              Alternate
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="text-slate-400 text-[11px]">Total Approvals</div>
              <div className="text-lg font-bold text-white mt-1">
                {comparison.scenario.result.totalApprovalsCount}
                <span className="text-xs font-normal text-slate-400 ml-1">
                  ({comparison.deltaApprovals >= 0 ? `+${comparison.deltaApprovals}` : comparison.deltaApprovals})
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="text-slate-400 text-[11px]">Optimized Timeline</div>
              <div className={`text-lg font-bold mt-1 ${isFaster ? 'text-emerald-400' : 'text-rose-400'}`}>
                {comparison.scenario.result.optimizedDays} days
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="text-slate-400 text-[11px]">Parallel Lanes</div>
              <div className="text-lg font-bold text-slate-200 mt-1">
                {comparison.scenario.result.parallelLanes.length} Lanes
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="text-slate-400 text-[11px]">Critical Path Nodes</div>
              <div className="text-lg font-bold text-rose-400 mt-1">
                {comparison.scenario.result.criticalPath.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Strategic Differentiators */}
      {comparison.keyDifferentiators.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Key Regulatory Insights & Differentiators
          </h4>
          <ul className="space-y-2">
            {comparison.keyDifferentiators.map((diff, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>{diff}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
