'use client';

import React from 'react';
import { SmartQueueTable } from '@/components/officer/SmartQueueTable';
import { ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export default function OfficerPortalPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Officer Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          Single-Window Regulatory Scrutiny Officer Cockpit
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-blue-400" />
          Officer Smart Scrutiny & Joint Inspection Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
          Intelligent queue sorted by statutory SLA proximity and AI risk scores. Perform one-click approvals, schedule synchronized multi-department site visits, or issue structured queries.
        </p>
      </div>

      <SmartQueueTable />
    </div>
  );
}
