import { BusinessProfile, SimulationResult, WhatIfComparison, ApprovalNode } from '@approvalos/shared';
import { AdversarialPathOptimizer } from './adversarial-optimizer';
import { getApprovalsForProfile } from '../knowledge-engine/regulatory-graph';

export interface WhatIfModification {
  state?: BusinessProfile['state'];
  landType?: BusinessProfile['landType'];
  pollutionCategory?: BusinessProfile['pollutionCategory'];
  investmentInrCr?: number;
  expectedEmployees?: number;
}

/**
 * What-If Simulation Engine: Evaluates strategic decisions before committing capital.
 */
export function compareWhatIfScenarios(
  baselineProfile: BusinessProfile,
  modifications: WhatIfModification,
  title: string = 'What-If Strategic Comparison'
): WhatIfComparison {
  // Construct alternate scenario profile
  const scenarioProfile: BusinessProfile = {
    ...baselineProfile,
    ...modifications,
    id: `${baselineProfile.id}_whatif_${Date.now()}`,
  };

  // Resolve applicable approvals for both
  const baselineApprovals = getApprovalsForProfile(baselineProfile);
  const scenarioApprovals = getApprovalsForProfile(scenarioProfile);

  // Run Adversarial Path Optimization for both
  const baselineOptimizer = new AdversarialPathOptimizer(baselineApprovals, baselineProfile);
  const scenarioOptimizer = new AdversarialPathOptimizer(scenarioApprovals, scenarioProfile);

  const baselineResult = baselineOptimizer.optimize();
  const scenarioResult = scenarioOptimizer.optimize();

  const deltaDays = scenarioResult.optimizedDays - baselineResult.optimizedDays;
  const deltaPercentage = baselineResult.optimizedDays > 0 
    ? Math.round(((scenarioResult.optimizedDays - baselineResult.optimizedDays) / baselineResult.optimizedDays) * 100)
    : 0;
  const deltaApprovals = scenarioResult.totalApprovalsCount - baselineResult.totalApprovalsCount;
  const deltaFee = 0;

  const keyDifferentiators: string[] = [];

  if (modifications.landType && modifications.landType !== baselineProfile.landType) {
    if (modifications.landType === 'GOVT_INDUSTRIAL_PARK') {
      keyDifferentiators.push('Eliminates private agricultural land conversion (CLU) delay, saving ~40 days.');
      keyDifferentiators.push('Plug-and-play boundary wall, internal drainage, and pre-allocated water grid connections.');
    }
  }

  if (modifications.state && modifications.state !== baselineProfile.state) {
    keyDifferentiators.push(`Relocating from ${baselineProfile.state} to ${modifications.state} leverages state single-window statutory fast-track policies.`);
  }

  if (modifications.pollutionCategory && modifications.pollutionCategory !== baselineProfile.pollutionCategory) {
    if (modifications.pollutionCategory === 'GREEN' || modifications.pollutionCategory === 'WHITE') {
      keyDifferentiators.push('Eliminates mandatory MoEFCC Environmental Clearance (EIA/EC) public hearings.');
      keyDifferentiators.push('Qualifies for Green-Channel instant self-certification for Consent to Establish (CTE).');
    }
  }

  let recommendation = 'Both scenarios are feasible. Compare financial incentives and supply chain proximity.';
  if (deltaDays < -20) {
    recommendation = `Highly Recommended: The alternate scenario accelerates market entry by ${Math.abs(deltaDays)} days (${Math.abs(deltaPercentage)}% faster) and eliminates ${Math.abs(deltaApprovals)} regulatory hurdles.`;
  } else if (deltaDays > 20) {
    recommendation = `Caution: The alternate scenario increases regulatory burden by ${deltaDays} days and requires additional statutory scrutiny.`;
  }

  return {
    id: `whatif_${Date.now()}`,
    title,
    baseline: {
      profile: baselineProfile,
      result: baselineResult,
    },
    scenario: {
      profile: scenarioProfile,
      result: scenarioResult,
    },
    deltaDays,
    deltaPercentage,
    deltaApprovals,
    deltaFee,
    keyDifferentiators,
    recommendation,
  };
}
