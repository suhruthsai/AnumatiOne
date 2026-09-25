'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Scale, 
  AlertTriangle,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface DigitalTwinExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DigitalTwinExplainerModal({ isOpen, onClose }: DigitalTwinExplainerModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] space-y-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                Plain-English Guide for Evaluators & Entrepreneurs
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                How the Regulatory Digital Twin Works
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Section 1: What is a Digital Twin? */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4" />
              1. What is a &ldquo;Regulatory Digital Twin&rdquo;?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In manufacturing, a digital twin is a virtual simulation of a physical machine used to test stress before building it. In <strong>AnumatiOne</strong>, the <strong>Regulatory Digital Twin is a virtual simulation of the entire Maharashtra state bureaucracy</strong> (MIDC, MPCB, DISH, MSEDCL, Fire Services, SEIAA). It simulates all 11 clearances on a computer before you submit a single paper or spend capital.
            </p>
          </div>

          {/* Section 2: Why not submit everything at once? (The Greedy Trap) */}
          <div className="space-y-2 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-4">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              2. Why not just file every application on Day 1?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Most entrepreneurs naively submit to all 5 departments at once. In real life, this causes <strong>Circular Query Compounding</strong>:
            </p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>MPCB asks you to move your effluent plant location 20 meters to the left.</li>
              <li>That invalidates the architectural building plan already under review at MIDC.</li>
              <li>That invalidates the fire hydrant blueprint under review by the Fire Brigade.</li>
              <li>You end up having to re-file across 3 departments, taking <strong>150 to 218 days</strong>!</li>
            </ul>
            <p className="text-xs text-emerald-300 font-semibold pt-1">
              ✓ AnumatiOne solves this: it locks pre-validated foundations in MahaVault before triggering dependent civil clearances.
            </p>
          </div>

          {/* Section 3: Understanding the Critical Path */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="h-4 w-4" />
              3. What is the Glowing Red Critical Path?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The red path on the DAG canvas represents the <strong>longest uninterrupted sequence of approvals</strong> (Land Possession → Environmental Clearance → Building Plan → Factory License → Consent to Operate).
            </p>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
              <strong className="text-white">Golden Rule: </strong>
              Any 1-day delay on the Red Line delays your entire factory launch by 1 day. In contrast, utility permits (like MSEDCL Power Sanction) have <strong>18 days of &ldquo;slack&rdquo;</strong>—meaning even if MSEDCL takes an extra 10 days, your factory opening date does not slip!
            </div>
          </div>

          {/* Section 4: Maharashtra RTS Act 2015 Deemed Clearance */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Scale className="h-4 w-4" />
              4. Legal Protection: Maharashtra Right to Services (RTS) Act 2015
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Under <strong>Section 4(1) of the Maharashtra RTS Act 2015</strong>, every clearance has a statutory deadline. If the designated officer fails to issue a query or approval within the SLA, the applicant receives <strong>statutory Deemed Approval</strong>. AnumatiOne maintains an auditable submission record to legally protect your deemed approval status.
            </p>
          </div>

          {/* Section 5: Maharashtra Support Schemes */}
          <div className="space-y-2 rounded-2xl border border-blue-500/20 bg-blue-950/20 p-4">
            <h3 className="text-sm font-bold text-blue-300 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              5. Government Support Schemes & Subsidies
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              AnumatiOne automatically cross-checks your business profile against official Maharashtra industrial policies:
            </p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li><strong>Package Scheme of Incentives (PSI 2019):</strong> Industrial Promotion Subsidy on State GST.</li>
              <li><strong>100% Stamp Duty Exemption:</strong> On MIDC lease deeds under Bombay Stamp Act.</li>
              <li><strong>Electricity Duty Exemption:</strong> 7–10 year waiver under Maharashtra Electricity Duty Act.</li>
              <li><strong>CMEGP & MSME Subvention:</strong> Capital grant and 5% interest subvention for first-generation entrepreneurs.</li>
            </ul>
          </div>

          {/* Footer Close */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-lg shadow-blue-500/20"
            >
              Got It, Return to Simulator
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
