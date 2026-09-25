'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles, 
  Clock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShockItem {
  id: string;
  name: string;
  department: string;
  triggerEvent: string;
  delayDaysAdded: number;
  mitigationStrategy: string;
  targetApprovalId: string;
}

const MAHARASHTRA_SHOCKS: ShockItem[] = [
  {
    id: 'ADV-MPCB-ZLD',
    name: 'MPCB ZLD Mass Balance Query',
    department: 'Maharashtra Pollution Control Board',
    triggerEvent: 'MPCB sub-regional officer issues query on industrial wastewater recycling flowchart and mass balance.',
    delayDaysAdded: 16,
    targetApprovalId: 'CTE_POLLUTION',
    mitigationStrategy: 'MahaVault Pre-Validator audits chemical mass balance & ETP blueprints prior to filing, preventing query issuance under Water Act 1974.',
  },
  {
    id: 'ADV-JOINT-INSP',
    name: 'DISH & Fire Joint Inspection Stalemate',
    department: 'DISH & MIDC Fire Brigade',
    triggerEvent: 'Factory Inspector (DISH) and Chief Fire Officer (MIDC) schedules fail to align, postponing physical site inspection.',
    delayDaysAdded: 14,
    targetApprovalId: 'FIRE_NOC',
    mitigationStrategy: 'Single-Window Joint Inspection Protocol under Section 4(1) RTS Act auto-bundles DISH and Fire officers into a synchronized 48-hour slot.',
  },
  {
    id: 'ADV-MSEDCL-GRID',
    name: 'MSEDCL 33kV Dedicated Feeder Study',
    department: 'MSEDCL (Mahavitaran)',
    triggerEvent: 'Testing wing requires supplementary transformer fault-level and grid stability analysis.',
    delayDaysAdded: 12,
    targetApprovalId: 'POWER_SANCTION',
    mitigationStrategy: 'Digital Twin utilizes calculated 18-day slack window on HT Power Sanction to absorb the study without delaying the building critical path.',
  },
  {
    id: 'ADV-MIDC-SPA',
    name: 'MIDC 12m Fire Driveway Scrutiny',
    department: 'MIDC Special Planning Authority',
    triggerEvent: 'BPAMS automated plan scrutiny flags turning radius on peripheral driveway under MIDC DCR 2009.',
    delayDaysAdded: 10,
    targetApprovalId: 'BUILDING_PLAN',
    mitigationStrategy: 'MahaVault CAD-validator pre-checks architectural layouts against Rule 14.1 setbacks, unlocking instant Green Channel deemed approval.',
  },
];

interface AdversarialStressTestConsoleProps {
  onApplyShockDelay: (totalExtraDays: number) => void;
}

export function AdversarialStressTestConsole({ onApplyShockDelay }: AdversarialStressTestConsoleProps) {
  const [activeShocks, setActiveShocks] = useState<string[]>([]);
  const [isDefenseActive, setIsDefenseActive] = useState(false);

  const toggleShock = (shockId: string) => {
    setIsDefenseActive(false);
    setActiveShocks(prev => {
      const next = prev.includes(shockId)
        ? prev.filter(id => id !== shockId)
        : [...prev, shockId];
      
      const totalDelay = next.reduce((sum, id) => {
        const item = MAHARASHTRA_SHOCKS.find(s => s.id === id);
        return sum + (item ? item.delayDaysAdded : 0);
      }, 0);
      
      onApplyShockDelay(totalDelay);
      return next;
    });
  };

  const handleDeployDefense = () => {
    setIsDefenseActive(true);
    onApplyShockDelay(0);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleReset = () => {
    setActiveShocks([]);
    setIsDefenseActive(false);
    onApplyShockDelay(0);
  };

  const currentShockDelay = activeShocks.reduce((sum, id) => {
    const item = MAHARASHTRA_SHOCKS.find(s => s.id === id);
    return sum + (item ? item.delayDaysAdded : 0);
  }, 0);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Department Objection & Self-Healing Stress Tester
            </h3>
            <span className="font-mono text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Live Bureaucracy Simulator
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Test how real-world Maharashtra department queries impact your factory timeline and watch MahaVault pre-validation neutralize the delays.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeShocks.length > 0 && (
            <button
              onClick={handleReset}
              className="px-2.5 py-1 rounded-lg text-[11px] text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              Reset Shocks
            </button>
          )}

          <button
            onClick={handleDeployDefense}
            disabled={activeShocks.length === 0 || isDefenseActive}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              isDefenseActive
                ? 'bg-emerald-600 text-white border border-emerald-400/40 cursor-default'
                : activeShocks.length > 0
                ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:brightness-110 active:scale-95 animate-pulse'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {isDefenseActive ? '🛡️ MahaVault Defense Active (0d Delay)' : '🛡️ Deploy MahaVault Defense'}
          </button>
        </div>
      </div>

      {/* Shocks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {MAHARASHTRA_SHOCKS.map((shock) => {
          const isActive = activeShocks.includes(shock.id);
          return (
            <button
              key={shock.id}
              onClick={() => toggleShock(shock.id)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                isActive
                  ? isDefenseActive
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : 'border-rose-500/60 bg-rose-950/20 shadow-md shadow-rose-500/10'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-[9px] font-bold text-slate-400">
                  {shock.targetApprovalId.split('_')[0]}
                </span>
                <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isActive
                    ? isDefenseActive
                      ? 'text-emerald-300 bg-emerald-500/20'
                      : 'text-rose-300 bg-rose-500/20'
                    : 'text-amber-400 bg-amber-500/10'
                }`}>
                  +{shock.delayDaysAdded}d Delay
                </span>
              </div>

              <div className="text-xs font-bold text-white mt-1.5 line-clamp-1">
                {shock.name}
              </div>

              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                {shock.triggerEvent}
              </p>

              <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 truncate max-w-[120px]">{shock.department.split(' ')[0]}</span>
                <span className={`font-semibold ${isActive ? (isDefenseActive ? 'text-emerald-400' : 'text-rose-400') : 'text-slate-400'}`}>
                  {isActive ? (isDefenseActive ? 'Defended ✓' : 'Shock Injected !') : 'Click to Inject'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Impact Status Banner */}
      {activeShocks.length > 0 && (
        <div className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDefenseActive
            ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-200'
            : 'border-rose-500/30 bg-rose-950/30 text-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {isDefenseActive ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            )}
            <span>
              {isDefenseActive ? (
                <>
                  <strong className="text-emerald-300">MahaVault Zero-Defect Defense Applied: </strong>
                  Pre-validated blueprints and Single-Window Joint Inspection Protocol absorbed the <strong>+{currentShockDelay} days</strong> shock. Total net project delay: <strong>0 days</strong>.
                </>
              ) : (
                <>
                  <strong className="text-rose-300">Unmitigated Bureaucratic Friction: </strong>
                  {activeShocks.length} departmental shocks injected. Project makespan expanded by <strong>+{currentShockDelay} days</strong>. Click &ldquo;Deploy MahaVault Defense&rdquo; to neutralize.
                </>
              )}
            </span>
          </div>

          {!isDefenseActive && (
            <button
              onClick={handleDeployDefense}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap self-start sm:self-auto transition-colors"
            >
              Neutralize Shocks
            </button>
          )}
        </div>
      )}
    </div>
  );
}
