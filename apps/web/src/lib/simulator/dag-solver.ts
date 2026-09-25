import { ApprovalNode, SimulationLane } from '@approvalos/shared';

export interface DAGSolverResult {
  lanes: SimulationLane[];
  topologicalOrder: string[];
  criticalPath: string[];
  criticalPathDays: number;
  sequentialDays: number;
  parallelTheoreticalMinDays: number;
  nodeEarliestStart: Record<string, number>;
  nodeEarliestFinish: Record<string, number>;
  nodeLatestStart: Record<string, number>;
  nodeLatestFinish: Record<string, number>;
  nodeSlackDays: Record<string, number>;
  hasCycle: boolean;
}

/**
 * Modified Kahn's Algorithm with Stage Grouping & Critical Path Analysis (CPM)
 * Solves regulatory dependency graphs into optimal concurrent execution lanes.
 */
export function solveApprovalDAG(approvals: ApprovalNode[]): DAGSolverResult {
  const nodeMap = new Map<string, ApprovalNode>();
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>(); // u -> list of v where v depends on u
  const reverseAdj = new Map<string, string[]>(); // v -> list of u that v depends on

  // Initialize graph
  for (const node of approvals) {
    nodeMap.set(node.id, node);
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
    reverseAdj.set(node.id, []);
  }

  // Filter prerequisites to only nodes that exist in current project scope
  for (const node of approvals) {
    const validPrereqs = (node.prerequisites || []).filter(preId => nodeMap.has(preId));
    inDegree.set(node.id, validPrereqs.length);
    reverseAdj.set(node.id, validPrereqs);

    for (const preId of validPrereqs) {
      adjacency.get(preId)!.push(node.id);
    }
  }

  // Modified Kahn's algorithm: Level-order stage peeling
  const lanes: SimulationLane[] = [];
  const topologicalOrder: string[] = [];
  let currentZeroInDegree = approvals.filter(n => inDegree.get(n.id) === 0).map(n => n.id);
  const tempInDegree = new Map(inDegree);
  let stageIndex = 0;

  const stageNames = [
    'Stage 1: Foundation & Land Clearances',
    'Stage 2: Core Utility & Environmental Planning',
    'Stage 3: Building & Safety Consents',
    'Stage 4: Operational Readiness & Licensing',
    'Stage 5: Final Consent to Operate'
  ];

  while (currentZeroInDegree.length > 0) {
    const stageApprovals = currentZeroInDegree.map(id => nodeMap.get(id)!);
    const maxStageDays = Math.max(...stageApprovals.map(a => a.baseDays), 0);
    const bottleneckNode = stageApprovals.reduce((max, node) => node.baseDays > max.baseDays ? node : max, stageApprovals[0]);

    lanes.push({
      laneIndex: stageIndex,
      stageName: stageNames[stageIndex] || `Stage ${stageIndex + 1}: Parallel Execution Phase`,
      approvals: stageApprovals,
      estimatedDays: maxStageDays,
      bottleneckNodeId: bottleneckNode?.id,
    });

    for (const id of currentZeroInDegree) {
      topologicalOrder.push(id);
    }

    const nextZeroInDegree: string[] = [];
    for (const u of currentZeroInDegree) {
      for (const v of adjacency.get(u) || []) {
        const newDeg = tempInDegree.get(v)! - 1;
        tempInDegree.set(v, newDeg);
        if (newDeg === 0) {
          nextZeroInDegree.push(v);
        }
      }
    }

    currentZeroInDegree = nextZeroInDegree;
    stageIndex++;
  }

  const hasCycle = topologicalOrder.length !== approvals.length;

  // Calculate Forward Pass (Earliest Start / Earliest Finish)
  const ES: Record<string, number> = {};
  const EF: Record<string, number> = {};

  for (const nodeId of topologicalOrder) {
    const node = nodeMap.get(nodeId)!;
    const prereqs = reverseAdj.get(nodeId) || [];
    let maxPrereqFinish = 0;

    for (const p of prereqs) {
      if (EF[p] !== undefined && EF[p] > maxPrereqFinish) {
        maxPrereqFinish = EF[p];
      }
    }

    ES[nodeId] = maxPrereqFinish;
    EF[nodeId] = maxPrereqFinish + node.baseDays;
  }

  const totalProjectDays = Math.max(...Object.values(EF), 0);

  // Calculate Backward Pass (Latest Start / Latest Finish)
  const LF: Record<string, number> = {};
  const LS: Record<string, number> = {};
  const slack: Record<string, number> = {};

  for (let i = topologicalOrder.length - 1; i >= 0; i--) {
    const nodeId = topologicalOrder[i];
    const node = nodeMap.get(nodeId)!;
    const dependents = adjacency.get(nodeId) || [];

    if (dependents.length === 0) {
      LF[nodeId] = totalProjectDays;
    } else {
      let minDepStart = Infinity;
      for (const d of dependents) {
        if (LS[d] !== undefined && LS[d] < minDepStart) {
          minDepStart = LS[d];
        }
      }
      LF[nodeId] = minDepStart;
    }

    LS[nodeId] = LF[nodeId] - node.baseDays;
    slack[nodeId] = Math.max(0, LS[nodeId] - ES[nodeId]);
  }

  // Critical path comprises nodes with zero slack (or minimum slack)
  const criticalPath: string[] = [];
  for (const nodeId of topologicalOrder) {
    if (Math.abs((slack[nodeId] || 0)) <= 0.001) {
      criticalPath.push(nodeId);
    }
  }

  const sequentialDays = approvals.reduce((sum, n) => sum + n.baseDays, 0);

  return {
    lanes,
    topologicalOrder,
    criticalPath,
    criticalPathDays: totalProjectDays,
    sequentialDays,
    parallelTheoreticalMinDays: totalProjectDays,
    nodeEarliestStart: ES,
    nodeEarliestFinish: EF,
    nodeLatestStart: LS,
    nodeLatestFinish: LF,
    nodeSlackDays: slack,
    hasCycle,
  };
}
