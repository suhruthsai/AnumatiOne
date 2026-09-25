'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Activity,
  Zap,
  Building2
} from 'lucide-react';
import { MASTER_APPROVALS } from '@/lib/knowledge-engine/regulatory-graph';

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/analytics/bottlenecks')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnalytics(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          Maharashtra Industrial Regulatory Intelligence Center
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="h-7 w-7 text-blue-400" />
          Ease of Doing Business (EODB) Analytics & Knowledge Graph
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
          System-wide performance telemetry, departmental SLA breach analytics, and Neo4j regulatory graph inspection.
        </p>
      </div>

      {/* High-Level System Telemetry */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-[11px] font-medium text-slate-400">Total Journeys Simulated</div>
            <div className="text-2xl font-black text-white mt-1">
              {analytics.systemStats.totalClearancesSimulated.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-blue-400 mt-1">Across 7 industrial sectors</div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <div className="text-[11px] font-medium text-emerald-300">Avg Time Saved vs Sequential</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {analytics.systemStats.averageTimeSavedPercentage}% FASTER
            </div>
            <div className="text-[10px] text-emerald-400/80 mt-1">Adversarial minimax path</div>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4">
            <div className="text-[11px] font-medium text-blue-300">Green Channel Auto-Approvals</div>
            <div className="text-2xl font-black text-blue-400 mt-1">
              {analytics.systemStats.greenChannelAutoApprovedCount.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-blue-400/80 mt-1">Zero bureaucratic delay</div>
          </div>

          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-4">
            <div className="text-[11px] font-medium text-purple-300">Joint Bundled Inspections</div>
            <div className="text-2xl font-black text-purple-400 mt-1">
              {analytics.systemStats.jointInspectionsScheduled.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-purple-400/80 mt-1">Combined multi-dept visits</div>
          </div>
        </div>
      )}

      {/* State EODB Rankings & Department Scorecards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State Rankings */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-400" />
              Maharashtra District & MIDC Clearance Index
            </h3>
            <span className="text-[10px] text-slate-400">Ranked by Speed</span>
          </div>

          {analytics && (
            <div className="mt-4 space-y-3">
              {analytics.eodbStateRankings.map((st: any) => (
                <div
                  key={st.state}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px] font-bold ${
                      st.rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{st.rank}
                    </span>
                    <div>
                      <div className="font-bold text-white">{st.state}</div>
                      <div className="text-[10px] text-slate-400">Friction: {st.singleWindowFriction}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-blue-400">{st.avgDaysToClearance} days</div>
                    <div className="text-[10px] text-slate-400">{st.score} / 100 score</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Bottleneck Scorecards */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-rose-400" />
              Departmental Bottleneck Scorecards
            </h3>
            <span className="text-[10px] text-slate-400">SLA Adherence Tracking</span>
          </div>

          {analytics && (
            <div className="mt-4 space-y-3">
              {analytics.departmentScorecards.map((dept: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="font-bold text-white text-sm">
                      {dept.department}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-mono text-blue-300">
                        Avg: {dept.avgApprovalDays}d (Statutory SLA: {dept.statutorySlaDays}d)
                      </span>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                        {dept.slaComplianceRate}% SLA Passed
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-amber-300/90 bg-amber-950/20 rounded p-2 border border-amber-500/20">
                    <strong className="text-amber-400">Primary Pacing Factor:</strong> {dept.topDelayReason}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Neo4j Regulatory Knowledge Graph Entities */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-400" />
              Regulatory Knowledge Graph (Neo4j Registry)
            </h3>
            <p className="text-xs text-slate-400">
              Live Cypher graph containing central acts, state statutory bodies, document requirements, and dependency edges
            </p>
          </div>
          <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-mono font-bold text-blue-300 border border-blue-500/30">
            {MASTER_APPROVALS.length} Master Clearances Indexed
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MASTER_APPROVALS.map((app) => (
            <div
              key={app.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-blue-400">
                  {app.code}
                </span>
                <span className="text-[10px] text-slate-400">
                  {app.category}
                </span>
              </div>
              <h4 className="font-bold text-white line-clamp-1">{app.name}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-1">{app.department}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                <span>Prerequisites: {app.prerequisites.length}</span>
                <span>Docs: {app.documentsRequired.length}</span>
                <span className="font-mono text-emerald-400">{app.validityYears}y Validity</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
