import { BusinessProfile, RiskLevel } from '@approvalos/shared';

export interface RiskScrutinyScore {
  trustScore: number; // 0 - 100
  overallRiskLevel: RiskLevel;
  greenChannelEligible: boolean;
  greenChannelReason: string;
  riskFactors: Array<{ factor: string; scoreImpact: number; category: string }>;
  recommendedScrutinyLevel: 'AUTOMATED_FAST_TRACK' | 'DESK_SCRUTINY_ONLY' | 'JOINT_FIELD_INSPECTION_REQUIRED';
}

export interface ApplicationAnomaly {
  code: string;
  title: string;
  severity: 'CRITICAL' | 'WARNING';
  description: string;
  remedyAction: string;
}

/**
 * Anomaly Detection Engine for Suspicious Applications
 * Detects discrepancies, capital-to-land imbalances, and statutory inconsistencies.
 */
export function detectApplicationAnomalies(profile: BusinessProfile): ApplicationAnomaly[] {
  const anomalies: ApplicationAnomaly[] = [];

  // Anomaly 1: Capital to Land Density Imbalance
  const investmentPerAcre = profile.landAreaAcres > 0 ? profile.investmentInrCr / profile.landAreaAcres : 0;
  if (profile.investmentInrCr > 100 && profile.landAreaAcres < 2 && profile.sector !== 'ELECTRONICS') {
    anomalies.push({
      code: 'ANOMALY_LAND_CAPITAL_DENSITY',
      title: 'Suspicious Capital-to-Land Density',
      severity: 'WARNING',
      description: `Investment of ₹${profile.investmentInrCr} Cr on only ${profile.landAreaAcres} acres is statistically anomalous for heavy industrial ${profile.sector}.`,
      remedyAction: 'Attach detailed floor-by-floor vertical layout plan or clarify leased off-site staging facility.',
    });
  }

  // Anomaly 2: Water Demand vs Effluent Treatment Discrepancy
  if (profile.waterRequiredKld > 100 && !profile.effluentDischarge && profile.pollutionCategory === 'RED') {
    anomalies.push({
      code: 'ANOMALY_EFFLUENT_DISCHARGE_MISMATCH',
      title: 'Unaccounted High Water Consumption Without Effluent System',
      severity: 'CRITICAL',
      description: `Daily water intake is ${profile.waterRequiredKld} KLD in Red category, yet Zero Liquid Discharge (ZLD) is unchecked.`,
      remedyAction: 'Upload certified Chartered Chemical Engineer mass balance report detailing water recycling.',
    });
  }

  // Anomaly 3: High Worker Density vs Building Code Setbacks
  if (profile.expectedEmployees > 300 && profile.builtUpAreaSqMeters < 2000) {
    anomalies.push({
      code: 'ANOMALY_OCCUPATIONAL_DENSITY',
      title: 'Occupational Floor Area Below Factories Act Minimum',
      severity: 'WARNING',
      description: `Floor area allows < 6.5 sq.m per worker, breaching Factories Act 1948 Section 16 minimum cubic air requirements.`,
      remedyAction: 'Revise factory building blueprint to expand worker circulation area or shift-based operation.',
    });
  }

  return anomalies;
}

/**
 * Risk-Based Scrutiny Engine
 * Computes dynamic trust scores, risk categorization, Green Channel eligibility, and anomaly detections.
 */
export function evaluateRiskScrutiny(profile: BusinessProfile): RiskScrutinyScore & { anomalies: ApplicationAnomaly[] } {
  let score = 70; // baseline neutral
  const factors: RiskScrutinyScore['riskFactors'] = [];
  const anomalies = detectApplicationAnomalies(profile);

  // Apply penalty for anomalies
  for (const anom of anomalies) {
    const penalty = anom.severity === 'CRITICAL' ? 20 : 10;
    score -= penalty;
    factors.push({
      factor: `Anomaly Detected: ${anom.title}`,
      scoreImpact: -penalty,
      category: 'ANOMALY_CHECK',
    });
  }

  // 1. Sector Pollution Risk Weighting
  switch (profile.pollutionCategory) {
    case 'WHITE':
      score += 15;
      factors.push({ factor: 'Non-polluting White Category Industry', scoreImpact: +15, category: 'ENVIRONMENTAL' });
      break;
    case 'GREEN':
      score += 10;
      factors.push({ factor: 'Low-emission Green Category Industry', scoreImpact: +10, category: 'ENVIRONMENTAL' });
      break;
    case 'ORANGE':
      score -= 5;
      factors.push({ factor: 'Medium-risk Orange Category Industry', scoreImpact: -5, category: 'ENVIRONMENTAL' });
      break;
    case 'RED':
      score -= 18;
      factors.push({ factor: 'High-polluting Red Category Chemical/Pharma Industry', scoreImpact: -18, category: 'ENVIRONMENTAL' });
      break;
  }

  // 2. Land Location Security
  if (profile.landType === 'GOVT_INDUSTRIAL_PARK' || profile.landType === 'SEZ') {
    score += 12;
    factors.push({ factor: 'Designated Government Industrial Estate with Pre-Vetted Master Plan', scoreImpact: +12, category: 'ZONING' });
  } else if (profile.landType === 'PRIVATE_AGRICULTURAL') {
    score -= 10;
    factors.push({ factor: 'Private Agricultural Land requiring Non-Agricultural Conversion (CLU)', scoreImpact: -10, category: 'ZONING' });
  }

  // 3. Promoter Track Record
  if (profile.pastComplianceRecord === 'EXEMPLARY') {
    score += 15;
    factors.push({ factor: 'Exemplary 5-Year Zero-Default Environmental Track Record', scoreImpact: +15, category: 'COMPLIANCE' });
  } else if (profile.pastComplianceRecord === 'MINOR_ISSUES') {
    score -= 12;
    factors.push({ factor: 'Past Minor Audit Observations in Prior Unit', scoreImpact: -12, category: 'COMPLIANCE' });
  }

  // 4. Hazardous Materials
  if (profile.hazardousChemicals) {
    score -= 10;
    factors.push({ factor: 'On-site Storage of Flammable / Toxic Solvents', scoreImpact: -10, category: 'SAFETY' });
  }

  // 5. MSME Priority
  if (profile.isMsme) {
    score += 5;
    factors.push({ factor: 'Udyam Registered MSME Priority Enterprise', scoreImpact: +5, category: 'POLICY' });
  }

  const trustScore = Math.max(15, Math.min(98, score));

  // Determine Green Channel
  const greenEligible = (
    trustScore >= 75 &&
    (profile.pollutionCategory === 'WHITE' || profile.pollutionCategory === 'GREEN' || 
     (profile.pollutionCategory === 'ORANGE' && profile.landType === 'GOVT_INDUSTRIAL_PARK'))
  );

  let greenReason = 'Trust score and sector risk profile meet criteria for Green Channel Instant Auto-Approval.';
  if (!greenEligible) {
    if (profile.pollutionCategory === 'RED') {
      greenReason = 'Red Category industries require statutory committee review by law; Green Channel not permissible.';
    } else if (profile.landType === 'PRIVATE_AGRICULTURAL') {
      greenReason = 'Private land boundary survey requires physical cadastral verification.';
    } else {
      greenReason = 'Trust score must be 75 or higher for Green Channel fast-track.';
    }
  }

  let overallRisk: RiskLevel = 'LOW';
  let scrutiny: RiskScrutinyScore['recommendedScrutinyLevel'] = 'AUTOMATED_FAST_TRACK';

  if (trustScore < 50 || profile.pollutionCategory === 'RED') {
    overallRisk = 'HIGH';
    scrutiny = 'JOINT_FIELD_INSPECTION_REQUIRED';
  } else if (trustScore < 75) {
    overallRisk = 'MEDIUM';
    scrutiny = 'DESK_SCRUTINY_ONLY';
  }

  return {
    trustScore,
    overallRiskLevel: overallRisk,
    greenChannelEligible: greenEligible,
    greenChannelReason: greenReason,
    riskFactors: factors,
    recommendedScrutinyLevel: scrutiny,
    anomalies,
  };
}
