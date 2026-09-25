'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { ApprovalNode, RiskLevel } from '@approvalos/shared';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Layers,
  ChevronRight
} from 'lucide-react';

interface JourneyMapDAGProps {
  showCriticalOnly: boolean;
  showBottlenecksOnly: boolean;
}

export function JourneyMapDAG({ showCriticalOnly, showBottlenecksOnly }: JourneyMapDAGProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { simulationResult, selectedNode, setSelectedNode } = useAppStore();

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Compute node positions organized by parallel lanes (stages)
  const layout = useMemo(() => {
    if (!simulationResult) return null;

    const lanes = simulationResult.parallelLanes;
    const nodePositions: Record<string, { x: number; y: number; width: number; height: number; node: ApprovalNode; laneIdx: number }> = {};
    const laneWidth = 270;
    const laneGap = 65;
    const startX = 60;
    const startY = 120;
    const nodeWidth = 240;
    const nodeHeight = 110;
    const nodeVerticalGap = 35;

    let maxLaneHeight = 0;

    lanes.forEach((lane, laneIdx) => {
      const laneX = startX + laneIdx * (laneWidth + laneGap);
      let currentY = startY;

      lane.approvals.forEach((approval) => {
        nodePositions[approval.id] = {
          x: laneX,
          y: currentY,
          width: nodeWidth,
          height: nodeHeight,
          node: approval,
          laneIdx,
        };
        currentY += nodeHeight + nodeVerticalGap;
      });

      if (currentY > maxLaneHeight) {
        maxLaneHeight = currentY;
      }
    });

    const totalWidth = startX + lanes.length * (laneWidth + laneGap) + 100;
    const totalHeight = Math.max(700, maxLaneHeight + 100);

    // Compute edges between prerequisites
    const edges: Array<{
      sourceId: string;
      targetId: string;
      isCritical: boolean;
      sourceX: number;
      sourceY: number;
      targetX: number;
      targetY: number;
    }> = [];

    const criticalPathSet = new Set(simulationResult.criticalPath);

    Object.values(nodePositions).forEach(({ node, x, y, width, height }) => {
      (node.prerequisites || []).forEach(preId => {
        const sourcePos = nodePositions[preId];
        if (sourcePos) {
          const isCritical = criticalPathSet.has(preId) && criticalPathSet.has(node.id);
          edges.push({
            sourceId: preId,
            targetId: node.id,
            isCritical,
            sourceX: sourcePos.x + sourcePos.width,
            sourceY: sourcePos.y + sourcePos.height / 2,
            targetX: x,
            targetY: y + height / 2,
          });
        }
      });
    });

    return {
      lanes,
      nodePositions,
      edges,
      totalWidth,
      totalHeight,
      laneWidth,
      laneGap,
      startX,
      startY,
    };
  }, [simulationResult]);

  // D3 Zoom handler
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const g = svg.select<SVGGElement>('#dag-zoom-group');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);
  }, [layout]);

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(
      d3.zoom<SVGSVGElement, unknown>().transform,
      d3.zoomIdentity
    );
    setZoomLevel(1);
  };

  const handleZoom = (factor: number) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy,
      factor
    );
  };

  if (!simulationResult || !layout) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50">
        <p className="text-slate-400">Loading Journey DAG Simulation...</p>
      </div>
    );
  }

  const criticalSet = new Set(simulationResult.criticalPath);
  const bottleneckIds = new Set(simulationResult.bottlenecks.map(b => b.nodeId));

  const getRiskBorderColor = (risk: RiskLevel, isSelected: boolean, isCritical: boolean) => {
    if (isSelected) return 'border-blue-400 ring-2 ring-blue-500 shadow-lg shadow-blue-500/25';
    if (isCritical) return 'border-rose-500/80 shadow-md shadow-rose-500/20';
    switch (risk) {
      case 'CRITICAL': return 'border-rose-600/70 hover:border-rose-500';
      case 'HIGH': return 'border-amber-500/70 hover:border-amber-400';
      case 'MEDIUM': return 'border-blue-500/70 hover:border-blue-400';
      case 'LOW': return 'border-emerald-500/70 hover:border-emerald-400';
    }
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL': return <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-bold text-rose-300 border border-rose-500/30">Critical</span>;
      case 'HIGH': return <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">High Risk</span>;
      case 'MEDIUM': return <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-300 border border-blue-500/30">Medium</span>;
      case 'LOW': return <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">Low Risk</span>;
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90 shadow-2xl">
      {/* Visual Canvas Toolbar Controls */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 p-1.5 backdrop-blur-md shadow-lg">
        <span className="px-2 text-[11px] font-mono text-slate-400">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={() => handleZoom(1.2)}
          title="Zoom In"
          className="rounded p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleZoom(0.8)}
          title="Zoom Out"
          className="rounded p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset Canvas View"
          className="rounded p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Legend & Lane Header Overlay */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 px-5 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-blue-400" />
            Interactive DAG Gantt
          </span>
          <div className="hidden sm:flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
              Critical Path Pacing
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Green Channel Eligible
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              Bottleneck Alert
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 italic">
          Click any node to open the dossier drawer & pre-validation checks
        </div>
      </div>

      {/* SVG DAG Canvas */}
      <div ref={containerRef} className="h-[640px] w-full cursor-grab active:cursor-grabbing overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${layout.totalWidth} ${layout.totalHeight}`}
          className="select-none"
        >
          <defs>
            {/* SVG Markers for Dependency Arrows */}
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#475569" />
            </marker>
            <marker
              id="arrow-critical"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#f43f5e" />
            </marker>
            <marker
              id="arrow-hover"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8" />
            </marker>

            {/* Glowing filter for critical path lines - with userSpaceOnUse to prevent zero-height clipping on horizontal lines */}
            <filter id="glow" filterUnits="userSpaceOnUse" x="0" y="0" width="3500" height="2500">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g id="dag-zoom-group">
            {/* Background Stage Lane Columns */}
            {layout.lanes.map((lane, idx) => {
              const laneX = layout.startX + idx * (layout.laneWidth + layout.laneGap);
              return (
                <g key={`lane-${idx}`}>
                  {/* Lane Column Backdrop */}
                  <rect
                    x={laneX - 15}
                    y={40}
                    width={layout.laneWidth + 30}
                    height={layout.totalHeight - 80}
                    rx={16}
                    fill={idx % 2 === 0 ? 'rgba(30, 41, 59, 0.15)' : 'rgba(15, 23, 42, 0.25)'}
                    stroke="rgba(51, 65, 85, 0.3)"
                    strokeDasharray="4 4"
                  />

                  {/* Stage Lane Header Label */}
                  <foreignObject
                    x={laneX - 10}
                    y={50}
                    width={layout.laneWidth + 20}
                    height={55}
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
                        <span>Phase {idx + 1}</span>
                        <ChevronRight className="h-3 w-3 opacity-60" />
                      </div>
                      <div className="text-[11px] font-medium text-slate-300 truncate max-w-full">
                        {lane.stageName.split(':')[1]?.trim() || lane.stageName}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Pacing SLA: ~{lane.estimatedDays} days
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Dependency Connector Arcs (Bézier curves) */}
            {layout.edges.map((edge, idx) => {
              const isConnectedToHover = hoveredNodeId === edge.sourceId || hoveredNodeId === edge.targetId;
              const isDimmed = (showCriticalOnly && !edge.isCritical) || (hoveredNodeId && !isConnectedToHover);

              // Calculate smooth cubic bezier path
              const dx = edge.targetX - edge.sourceX;
              const dy = edge.targetY - edge.sourceY;
              const isMultiLaneJump = dx > (layout.laneWidth + layout.laneGap) * 1.3;
              const controlOffset = Math.max(30, dx * 0.45);

              let pathD: string;
              if (isMultiLaneJump && Math.abs(dy) < 30) {
                // Multi-lane horizontal jump: arc slightly to avoid cutting through intermediate cards
                const arcLift = -65;
                pathD = `M ${edge.sourceX} ${edge.sourceY} C ${edge.sourceX + 60} ${edge.sourceY + arcLift}, ${edge.targetX - 60} ${edge.targetY + arcLift}, ${edge.targetX} ${edge.targetY}`;
              } else {
                pathD = `M ${edge.sourceX} ${edge.sourceY} C ${edge.sourceX + controlOffset} ${edge.sourceY}, ${edge.targetX - controlOffset} ${edge.targetY}, ${edge.targetX} ${edge.targetY}`;
              }

              return (
                <path
                  key={`edge-${idx}`}
                  d={pathD}
                  fill="none"
                  stroke={
                    edge.isCritical
                      ? '#f43f5e'
                      : isConnectedToHover
                      ? '#38bdf8'
                      : 'rgba(100, 116, 139, 0.4)'
                  }
                  strokeWidth={edge.isCritical ? 3 : isConnectedToHover ? 2.5 : 1.5}
                  strokeDasharray={edge.isCritical ? '6 4' : 'none'}
                  filter={edge.isCritical ? 'url(#glow)' : undefined}
                  markerEnd={
                    edge.isCritical
                      ? 'url(#arrow-critical)'
                      : isConnectedToHover
                      ? 'url(#arrow-hover)'
                      : 'url(#arrow-default)'
                  }
                  opacity={isDimmed ? 0.15 : 1}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Approval Nodes rendered via foreignObject for modern HTML card styling */}
            {Object.entries(layout.nodePositions).map(([nodeId, pos]) => {
              const node = pos.node;
              const isSelected = selectedNode?.id === nodeId;
              const isCritical = criticalSet.has(nodeId);
              const isBottleneck = bottleneckIds.has(nodeId);

              const isDimmed = (showCriticalOnly && !isCritical) || (showBottlenecksOnly && !isBottleneck);

              return (
                <foreignObject
                  key={`node-${nodeId}`}
                  x={pos.x}
                  y={pos.y}
                  width={pos.width}
                  height={pos.height}
                  className="overflow-visible"
                >
                  <div
                    onClick={() => setSelectedNode(node)}
                    onMouseEnter={() => setHoveredNodeId(nodeId)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    style={{ opacity: isDimmed ? 0.25 : 1 }}
                    className={`group relative h-full w-full cursor-pointer rounded-xl border bg-slate-900/95 p-3.5 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${getRiskBorderColor(
                      node.riskLevel,
                      isSelected,
                      isCritical
                    )}`}
                  >
                    {/* Critical Path Indicator Ribbon */}
                    {isCritical && (
                      <div className="absolute -top-2.5 left-3 flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-md shadow-rose-600/30">
                        <Zap className="h-2.5 w-2.5 fill-current" />
                        Critical Path
                      </div>
                    )}

                    {/* Bottleneck Warning Badge */}
                    {isBottleneck && (
                      <div className="absolute -top-2.5 right-3 flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[9px] font-bold text-slate-950 shadow-md">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        Bottleneck
                      </div>
                    )}

                    {/* Node Header: Department & Risk */}
                    <div className="flex items-start justify-between gap-2 pt-0.5">
                      <div className="text-[10px] font-semibold text-slate-400 truncate max-w-[130px]">
                        {node.code} • {node.department.split('(')[0].trim()}
                      </div>
                      <div className="flex items-center gap-1">
                        {node.canAutoApprove && (
                          <span title="Maharashtra RTS Act 2015 Section 4(1) Deemed Approval" className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Sparkles className="h-2.5 w-2.5 text-emerald-400" />
                            RTS Deemed
                          </span>
                        )}
                        {getRiskBadge(node.riskLevel)}
                      </div>
                    </div>

                    {/* Approval Title */}
                    <div className="mt-1 font-bold text-xs text-white line-clamp-1 group-hover:text-blue-300 transition-colors">
                      {node.name}
                    </div>

                    {/* SLA Days & Validity Footer */}
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 font-mono text-slate-300">
                        <Clock className="h-3 w-3 text-blue-400" />
                        <span className="font-semibold">{node.baseDays}</span>
                        <span className="text-[10px] text-slate-400">±{node.varianceDays}d</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-300">
                        <span className="text-emerald-400 font-semibold">{node.validityYears}y</span>
                        <span className="text-[10px] text-slate-400">validity</span>
                      </div>
                    </div>
                  </div>
                </foreignObject>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
