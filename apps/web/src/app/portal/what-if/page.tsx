'use client';

import React from 'react';
import { ScenarioComparison } from '@/components/what-if/ScenarioComparison';
import { GitBranch, Sparkles } from 'lucide-react';

export default function WhatIfPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          Interactive Strategic Pivot Simulator
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <GitBranch className="h-7 w-7 text-blue-400" />
          What-If Scenario Sandbox
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
          Compare regulatory friction, statutory compliance mandates, and critical path schedules across industrial estates and pollution tiers before committing capital.
        </p>
      </div>

      <ScenarioComparison />
    </div>
  );
}
