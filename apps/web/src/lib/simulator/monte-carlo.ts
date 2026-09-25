import { ApprovalNode } from '@approvalos/shared';

export interface MonteCarloResult {
  iterations: number;
  meanDays: number;
  medianDays: number;
  p10Days: number;
  p50Days: number;
  p90Days: number;
  p95Days: number;
  minDays: number;
  maxDays: number;
  stdDev: number;
  distributionHistogram: Array<{ day: number; count: number; density: number }>;
  nodeDurationDistributions: Record<string, { mean: number; p90: number }>;
}

/**
 * Fast, seedable Mulberry32 PRNG for deterministic Monte Carlo simulation
 * Guarantees identical simulation values between Server (SSR) and Client (Hydration)
 */
function createMulberry32(seed: number = 42) {
  let s = seed >>> 0;
  return function(): number {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t >>> 0) / 4294967296);
  };
}

let activeRng = createMulberry32(42);

export function resetMonteCarloSeed(seed: number = 42) {
  activeRng = createMulberry32(seed);
}

/**
 * Standard Box-Muller generator for standard normal distribution N(0, 1) using seeded PRNG
 */
function sampleStandardNormal(): number {
  let u1 = 0;
  let u2 = 0;
  while (u1 === 0) u1 = activeRng();
  while (u2 === 0) u2 = activeRng();
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

/**
 * Sample from a Log-Normal distribution parameterized by baseDays and variance
 */
export function sampleLognormalTime(baseDays: number, varianceDays: number): number {
  if (baseDays <= 0) return 0;
  // Coefficient of variation
  const cv = Math.min(1.2, Math.max(0.15, varianceDays / baseDays));
  const sigma = Math.sqrt(Math.log(1 + cv * cv));
  const mu = Math.log(baseDays) - (sigma * sigma) / 2;
  const z = sampleStandardNormal();
  const sampled = Math.exp(mu + sigma * z);
  // Practical bounds: an approval cannot be less than 20% of base time or exceed 4.5x base time
  return Math.max(Math.round(baseDays * 0.25), Math.min(Math.round(baseDays * 4.5), Math.round(sampled)));
}

/**
 * Run Monte Carlo simulation across the DAG network
 * Samples duration for each node in topological order and records the makespan
 */
export function runMonteCarloSimulation(
  approvals: ApprovalNode[],
  topologicalOrder: string[],
  reverseAdj: Map<string, string[]>,
  iterations: number = 2000,
  seed: number = 42
): MonteCarloResult {
  resetMonteCarloSeed(seed);
  const nodeMap = new Map<string, ApprovalNode>(approvals.map(a => [a.id, a]));
  const projectDurations: number[] = [];
  const nodeSums: Record<string, number> = {};
  const nodeSamples: Record<string, number[]> = {};

  for (const n of approvals) {
    nodeSums[n.id] = 0;
    nodeSamples[n.id] = [];
  }

  for (let it = 0; it < iterations; it++) {
    const EF: Record<string, number> = {};

    for (const nodeId of topologicalOrder) {
      const node = nodeMap.get(nodeId);
      if (!node) continue;

      const sampledDuration = sampleLognormalTime(node.baseDays, node.varianceDays);
      nodeSums[nodeId] += sampledDuration;
      if (it < 500) {
        nodeSamples[nodeId].push(sampledDuration);
      }

      const prereqs = reverseAdj.get(nodeId) || [];
      let maxPrereqFinish = 0;
      for (const p of prereqs) {
        if (EF[p] !== undefined && EF[p] > maxPrereqFinish) {
          maxPrereqFinish = EF[p];
        }
      }

      EF[nodeId] = maxPrereqFinish + sampledDuration;
    }

    const makespan = Math.max(...Object.values(EF), 0);
    projectDurations.push(makespan);
  }

  // Sort project durations for percentile calculation
  projectDurations.sort((a, b) => a - b);

  const sum = projectDurations.reduce((acc, val) => acc + val, 0);
  const meanDays = Math.round(sum / iterations);
  const minDays = projectDurations[0];
  const maxDays = projectDurations[projectDurations.length - 1];

  const varianceSum = projectDurations.reduce((acc, val) => acc + Math.pow(val - meanDays, 2), 0);
  const stdDev = Math.round(Math.sqrt(varianceSum / iterations));

  const p10Days = projectDurations[Math.floor(iterations * 0.10)];
  const p50Days = projectDurations[Math.floor(iterations * 0.50)];
  const p90Days = projectDurations[Math.floor(iterations * 0.90)];
  const p95Days = projectDurations[Math.floor(iterations * 0.95)];

  // Generate distribution histogram (25 bins)
  const binCount = 20;
  const binStep = Math.max(1, Math.ceil((maxDays - minDays) / binCount));
  const histogramBins: Record<number, number> = {};

  for (let b = 0; b < binCount; b++) {
    const binCenter = minDays + b * binStep;
    histogramBins[binCenter] = 0;
  }

  for (const d of projectDurations) {
    const binIndex = Math.min(binCount - 1, Math.floor((d - minDays) / binStep));
    const binCenter = minDays + binIndex * binStep;
    histogramBins[binCenter] = (histogramBins[binCenter] || 0) + 1;
  }

  const distributionHistogram = Object.entries(histogramBins).map(([dayStr, count]) => ({
    day: Number(dayStr),
    count,
    density: Number((count / iterations).toFixed(4)),
  }));

  const nodeDurationDistributions: Record<string, { mean: number; p90: number }> = {};
  for (const n of approvals) {
    const mean = Math.round(nodeSums[n.id] / iterations);
    const sorted = (nodeSamples[n.id] || []).sort((a, b) => a - b);
    const p90 = sorted.length > 0 ? sorted[Math.floor(sorted.length * 0.90)] : n.baseDays + n.varianceDays;
    nodeDurationDistributions[n.id] = { mean, p90 };
  }

  return {
    iterations,
    meanDays,
    medianDays: p50Days,
    p10Days,
    p50Days,
    p90Days,
    p95Days,
    minDays,
    maxDays,
    stdDev,
    distributionHistogram,
    nodeDurationDistributions,
  };
}
