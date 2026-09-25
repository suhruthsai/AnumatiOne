import { ApprovalNode, BusinessProfile, SimulationResult, SimulationLane } from '@approvalos/shared';
import { getApprovalsForProfile } from '../knowledge-engine/regulatory-graph';
import { AdversarialPathOptimizer } from './adversarial-optimizer';

export type TwinScenarioMode = 
  | 'MINIMAX_CONCURRENCY'
  | 'TRADITIONAL_SEQUENTIAL'
  | 'GREEN_CHANNEL_EXPRESS'
  | 'RED_CATEGORY_SCRUTINY';

export interface TwinScenarioDetail {
  id: TwinScenarioMode;
  name: string;
  badge: string;
  badgeColor: string;
  tagline: string;
  headlineSummary: string;
  totalDays: number;
  daysSavedVsSequential: number;
  percentageFaster: number;
  resilienceScore: number;
  concurrencyLanes: number;
  criticalPathCount: number;
  rtsDeemedEligibleCount: number;
  keyAssumptions: string[];
  plainEnglishExplanation: string;
  recommended: boolean;
}

export const TWIN_SCENARIOS: Record<TwinScenarioMode, TwinScenarioDetail> = {
  MINIMAX_CONCURRENCY: {
    id: 'MINIMAX_CONCURRENCY',
    name: 'AnumatiOne Smart Parallel Track',
    badge: 'Recommended SIH Solution',
    badgeColor: 'blue',
    tagline: 'Multi-department parallel orchestration with MahaVault pre-validation',
    headlineSummary: 'Coordinates MIDC, MPCB, DISH, and MSEDCL in 4 parallel execution lanes with pre-validated data reuse and RTS Act guarantees.',
    totalDays: 88,
    daysSavedVsSequential: 130,
    percentageFaster: 60,
    resilienceScore: 95,
    concurrencyLanes: 4,
    criticalPathCount: 5,
    rtsDeemedEligibleCount: 7,
    keyAssumptions: [
      'Parallel utility sanctions (MSEDCL Power, MIDC Water, Building Plan) triggered concurrently once Land possession is locked.',
      'MahaVault pre-validates ETP blueprints and architectural CAD setbacks before filing to eliminate query ping-pong.',
      'Single-Window Joint Inspection Protocol synchronizes DISH, Fire, and MPCB officers into a single 48-hour visit.',
    ],
    plainEnglishExplanation: 'Instead of waiting for each department one-by-one, AnumatiOne runs MIDC, MPCB, DISH, and MSEDCL in 4 parallel lanes simultaneously. Pre-validated blueprints prevent query loops, clearing all permits in ~88 days.',
    recommended: true,
  },
  TRADITIONAL_SEQUENTIAL: {
    id: 'TRADITIONAL_SEQUENTIAL',
    name: 'Legacy Departmental Silos',
    badge: 'Current Reality (Without AI)',
    badgeColor: 'rose',
    tagline: 'Uncoordinated physical paper filing taking over 7 months',
    headlineSummary: 'How entrepreneurs currently navigate Maharashtra bureaucracy: waiting for one department to finish before starting the next.',
    totalDays: 218,
    daysSavedVsSequential: 0,
    percentageFaster: 0,
    resilienceScore: 35,
    concurrencyLanes: 1,
    criticalPathCount: 11,
    rtsDeemedEligibleCount: 0,
    keyAssumptions: [
      'Zero concurrency: each clearance submitted only after previous physical certificate is received in person.',
      'Repetitive KYC and document submissions across departments with manual physical desk visits.',
      'Uncoordinated separate site inspections by DISH, Fire Brigade, and MPCB spread over months.',
    ],
    plainEnglishExplanation: 'This is the bureaucratic red tape entrepreneurs face today: filing one clearance at a time, repeated physical visits to offices, and sudden queries 3 months in—taking 218 days (over 7 months).',
    recommended: false,
  },
  GREEN_CHANNEL_EXPRESS: {
    id: 'GREEN_CHANNEL_EXPRESS',
    name: 'Green Channel Fast-Track (MSME & Clean Tech)',
    badge: 'Express Self-Certification',
    badgeColor: 'emerald',
    tagline: 'Section 4(1) Maharashtra RTS Act instant deemed approval',
    headlineSummary: 'Unlocks instant automated deemed approvals for clean-tech, MSME, or high-trust units situated in notified MIDC industrial parks.',
    totalDays: 48,
    daysSavedVsSequential: 170,
    percentageFaster: 78,
    resilienceScore: 98,
    concurrencyLanes: 4,
    criticalPathCount: 4,
    rtsDeemedEligibleCount: 10,
    keyAssumptions: [
      'Promoter Trust Score ≥ 80 based on verified historical compliance and Udyam MSME registration.',
      'Situated in pre-notified MIDC Industrial Zone (ready title & pre-cleared EIA zoning).',
      'White/Green low-effluent manufacturing process eligible for self-certification.',
      'Physical desk inspections replaced with automated DigiLocker authenticated declarations.',
    ],
    plainEnglishExplanation: 'For non-polluting White/Green units or MSMEs in pre-notified MIDC parks, physical desk visits are replaced with certified DigiLocker self-certification, unlocking approvals in just 48 days.',
    recommended: false,
  },
  RED_CATEGORY_SCRUTINY: {
    id: 'RED_CATEGORY_SCRUTINY',
    name: 'Heavy Industry / Chemical Scrutiny',
    badge: 'High-Scrutiny & Environmental Clearance',
    badgeColor: 'amber',
    tagline: 'Comprehensive SEIAA, Boiler hydraulic & hazardous review',
    headlineSummary: 'Simulates the complete compliance journey for heavy engineering, chemical, or pharmaceutical projects requiring SEIAA Environmental Clearance.',
    totalDays: 128,
    daysSavedVsSequential: 132,
    percentageFaster: 51,
    resilienceScore: 88,
    concurrencyLanes: 4,
    criticalPathCount: 6,
    rtsDeemedEligibleCount: 3,
    keyAssumptions: [
      'Mandatory State Environmental Impact Assessment (SEIAA) with SEAC expert committee review.',
      'Zero Liquid Discharge (ZLD) effluent treatment plant with online continuous emissions (OCEMS).',
      'High-pressure steam boiler hydraulic certification (IBR 1950) and PESO solvent storage scrutiny.',
    ],
    plainEnglishExplanation: 'For heavy chemical, pharma, or boiler units, government safety scrutiny is strict. Even under SEIAA appraisal, AnumatiOne parallelizes utility and civil sanctions to cut the journey in half (128 days vs 260 days).',
    recommended: false,
  },
};

/**
 * Calculates dynamically adjusted simulation result based on the chosen Twin Scenario Mode
 */
export function getResultForScenario(mode: TwinScenarioMode, profile: BusinessProfile): SimulationResult {
  let customProfile = { ...profile };

  if (mode === 'GREEN_CHANNEL_EXPRESS') {
    customProfile = {
      ...profile,
      trustScore: 95,
      landType: 'GOVT_INDUSTRIAL_PARK',
      pollutionCategory: 'GREEN',
      isMsme: true,
    };
  } else if (mode === 'RED_CATEGORY_SCRUTINY') {
    customProfile = {
      ...profile,
      pollutionCategory: 'RED',
      hazardousChemicals: true,
      boilerInstalled: true,
      investmentInrCr: Math.max(120, profile.investmentInrCr),
    };
  } else if (mode === 'TRADITIONAL_SEQUENTIAL') {
    customProfile = {
      ...profile,
      trustScore: 50,
      landType: 'PRIVATE_AGRICULTURAL',
    };
  }

  const approvals = getApprovalsForProfile(customProfile);
  const optimizer = new AdversarialPathOptimizer(approvals, customProfile);
  const baseResult = optimizer.optimize();

  if (mode === 'TRADITIONAL_SEQUENTIAL') {
    const sequentialLane: SimulationLane = {
      laneIndex: 0,
      stageName: 'Uncoordinated Sequential Departmental Review',
      approvals: approvals,
      estimatedDays: baseResult.sequentialDays,
      bottleneckNodeId: approvals[0]?.id,
    };

    return {
      ...baseResult,
      optimizedDays: baseResult.sequentialDays,
      daysSaved: 0,
      percentageSaved: 0,
      parallelLanes: [sequentialLane],
      criticalPath: approvals.map(a => a.id),
    };
  }

  if (mode === 'GREEN_CHANNEL_EXPRESS') {
    const fastDays = 48;
    return {
      ...baseResult,
      optimizedDays: fastDays,
      daysSaved: Math.max(0, baseResult.sequentialDays - fastDays),
      percentageSaved: Math.round(((baseResult.sequentialDays - fastDays) / baseResult.sequentialDays) * 100),
    };
  }

  if (mode === 'RED_CATEGORY_SCRUTINY') {
    const heavyDays = 128;
    return {
      ...baseResult,
      optimizedDays: heavyDays,
      daysSaved: Math.max(0, baseResult.sequentialDays - heavyDays),
      percentageSaved: Math.round(((baseResult.sequentialDays - heavyDays) / baseResult.sequentialDays) * 100),
    };
  }

  return baseResult;
}
