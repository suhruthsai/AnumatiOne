import { BusinessProfile, IncentiveScheme } from '@approvalos/shared';

export const MASTER_INCENTIVE_SCHEMES: IncentiveScheme[] = [
  {
    id: 'MAHARASHTRA_PSI_IPS',
    code: 'MH-PSI-IPS-01',
    name: 'Maharashtra PSI 2019/2024 - Industrial Promotion Subsidy (IPS)',
    ministryOrState: 'Industries Department, Government of Maharashtra',
    category: 'STATE_CAPITAL_SUBSIDY',
    description: 'Up to 60% to 100% reimbursement of Gross/Net SGST paid on eligible fixed capital investment over 7-10 years under Package Scheme of Incentives (PSI).',
    minInvestmentCr: 10,
    maxSubsidyInr: 250000000, // 25 Cr
    matchScore: 0,
    estimatedBenefitInr: 0,
    disbursementMode: 'MILESTONE_BASED',
    qualifyingFactors: ['Manufacturing unit in Maharashtra', 'Minimum 10 Cr Fixed Capital Investment', 'Local employment quota > 50%'],
    documentsRequired: ['PROJECT_FEASIBILITY_REPORT', 'LAND_SALE_DEED', 'GSTIN_CERTIFICATE'],
  },
  {
    id: 'MAHARASHTRA_STAMP_DUTY',
    code: 'MH-REV-STAMP-02',
    name: '100% Stamp Duty Exemption on MIDC Industrial Lease',
    ministryOrState: 'Revenue & Stamps Dept, Govt of Maharashtra',
    category: 'STAMP_DUTY_REIMBURSEMENT',
    description: 'Full 100% waiver of statutory stamp duty and registration fees on execution of MIDC industrial lease agreements.',
    minInvestmentCr: 5,
    maxSubsidyInr: 35000000, // 3.5 Cr
    matchScore: 0,
    estimatedBenefitInr: 0,
    disbursementMode: 'FRONT_LOADED',
    qualifyingFactors: ['Execution within MIDC notified estate or notified SEZ', 'Adherence to building timeline'],
    documentsRequired: ['LAND_SALE_DEED', 'GSTIN_CERTIFICATE'],
  },
  {
    id: 'MAHARASHTRA_ELECTRICITY_DUTY',
    code: 'MH-MEDA-ELEC-03',
    name: 'Maharashtra Electricity Duty Exemption Scheme',
    ministryOrState: 'Maharashtra Energy Development Agency (MEDA) & Industries Dept',
    category: 'GREEN_ENERGY_REBATE',
    description: '100% exemption from Maharashtra state electricity duty for 7 to 10 years for new eligible industrial investments.',
    minInvestmentCr: 5,
    maxSubsidyInr: 25000000, // 2.5 Cr
    matchScore: 0,
    estimatedBenefitInr: 0,
    disbursementMode: 'ANNUAL_REBATE',
    qualifyingFactors: ['Connected HT power load with MSEDCL', 'Energy efficiency or captive solar adoption >= 15%'],
    documentsRequired: ['POWER_LOAD_CALCULATION', 'FACTORY_LAYOUT_PLAN'],
  },
  {
    id: 'MAHARASHTRA_MSME_INTEREST_SUBVENTION',
    code: 'MH-MSME-INT-04',
    name: 'Maharashtra MSME 5% Interest Subvention Scheme',
    ministryOrState: 'Directorate of Industries, Maharashtra / MSFC',
    category: 'MSME_INTEREST_SUBVENTION',
    description: '5% interest subsidy on term loans up to 10 Cr for plant modernization, green technologies, and zero-defect manufacturing.',
    minInvestmentCr: 1,
    maxSubsidyInr: 15000000, // 1.5 Cr
    matchScore: 0,
    estimatedBenefitInr: 0,
    disbursementMode: 'ANNUAL_REBATE',
    qualifyingFactors: ['Udyam Registered Micro, Small, or Medium Enterprise in Maharashtra'],
    documentsRequired: ['GSTIN_CERTIFICATE', 'PAN_CARD'],
  },
  {
    id: 'MAHARASHTRA_EV_POLICY_2021',
    code: 'MH-EVD-2021-02',
    name: 'Maharashtra Electric Vehicle (EV) Policy 2021',
    ministryOrState: 'Industries, Energy & Labour Department, Govt of Maharashtra',
    category: 'STATE_CAPITAL_SUBSIDY',
    description: 'Pioneer & Mega unit capital incentives (15% additional capital subsidy) for EV assembly, battery pack, and drivetrain manufacturing in Maharashtra auto clusters.',
    minInvestmentCr: 20,
    maxSubsidyInr: 200000000, // 20 Cr
    matchScore: 0,
    estimatedBenefitInr: 0,
    disbursementMode: 'MILESTONE_BASED',
    qualifyingFactors: ['EV Manufacturing, Battery, or Powertrain unit', 'Located in Chakan/Pune/Aurangabad auto hubs'],
    documentsRequired: ['PROJECT_FEASIBILITY_REPORT', 'FACTORY_LAYOUT_PLAN', 'POWER_LOAD_CALCULATION'],
  },
  {
    id: 'MAHARASHTRA_CMEGP',
    code: 'MH-CMEGP-05',
    name: 'Chief Minister Employment Generation Programme (CMEGP)',
    ministryOrState: 'Directorate of Industries, Maharashtra / KVIC',
    category: 'MSME_INTEREST_SUBVENTION',
    description: 'Margin money capital assistance of 15% to 35% of project cost for micro/small industrial ventures creating local manufacturing employment in Maharashtra.',
    minInvestmentCr: 0.25,
    maxSubsidyInr: 17500000, // 1.75 Cr
    matchScore: 0,
    estimatedBenefitInr: 0,
    disbursementMode: 'FRONT_LOADED',
    qualifyingFactors: ['New industrial enterprise in Maharashtra', 'Local job creation > 10 workers'],
    documentsRequired: ['AADHAAR_CARD', 'PAN_CARD', 'PROJECT_FEASIBILITY_REPORT', 'GSTIN_CERTIFICATE'],
  },
  {
    id: 'CENTRAL_PLI_MAHARASHTRA',
    code: 'PLI-AUTO-PHARMA-05',
    name: 'National PLI for Maharashtra Auto/EV & Bulk Drug Clusters',
    ministryOrState: 'Ministry of Heavy Industries & Dept of Pharmaceuticals, GoI',
    category: 'CENTRAL_PLI',
    description: 'Cash incentives of 8% to 18% on incremental sales over base year for advanced automotive/EV components and active pharma ingredients.',
    minInvestmentCr: 50,
    maxSubsidyInr: 300000000, // 30 Cr
    matchScore: 0,
    estimatedBenefitInr: 0,
    disbursementMode: 'MILESTONE_BASED',
    qualifyingFactors: ['Located in Maharashtra industrial clusters (Pune, Chhatrapati Sambhajinagar, Thane)', 'Minimum 50 Cr Capital Outlay'],
    documentsRequired: ['PROJECT_FEASIBILITY_REPORT', 'GSTIN_CERTIFICATE', 'FACTORY_LAYOUT_PLAN'],
  },
];

/**
 * Evaluates business profile and calculates eligible financial benefits under Maharashtra policies
 */
export function matchIncentivesForProfile(profile: BusinessProfile): {
  schemes: IncentiveScheme[];
  totalEligibleBenefitInr: number;
} {
  const matchedSchemes: IncentiveScheme[] = [];
  let totalBenefit = 0;

  for (const master of MASTER_INCENTIVE_SCHEMES) {
    let score = 0;
    let benefit = 0;

    if (master.id === 'CENTRAL_PLI_MAHARASHTRA') {
      if (profile.sector === 'EV_MANUFACTURING' || profile.sector === 'PHARMA' || profile.sector === 'ELECTRONICS') {
        score += 50;
      }
      if (profile.investmentInrCr >= 50) {
        score += 45;
        benefit = Math.min(master.maxSubsidyInr, Math.round(profile.investmentInrCr * 0.10 * 10000000));
      }
    } else if (master.id === 'MAHARASHTRA_PSI_IPS') {
      if (profile.investmentInrCr >= master.minInvestmentCr) {
        score += 75;
        // Maharashtra PSI IPS benefit rate: 12% to 15% of capital investment
        const rate = profile.landType === 'GOVT_INDUSTRIAL_PARK' ? 0.14 : 0.11;
        benefit = Math.min(master.maxSubsidyInr, Math.round(profile.investmentInrCr * rate * 10000000));
      }
      if (profile.expectedEmployees >= 50) {
        score += 20;
      }
    } else if (master.id === 'MAHARASHTRA_STAMP_DUTY') {
      if (profile.landType === 'GOVT_INDUSTRIAL_PARK' || profile.landType === 'SEZ') {
        score = 95;
        // MIDC stamp duty saving: acres * 85 lakhs * 6% stamp duty
        benefit = Math.min(master.maxSubsidyInr, Math.round(profile.landAreaAcres * 8500000 * 0.06));
      } else {
        score = 55;
        benefit = Math.min(master.maxSubsidyInr, Math.round(profile.landAreaAcres * 5500000 * 0.06));
      }
    } else if (master.id === 'MAHARASHTRA_MSME_INTEREST_SUBVENTION') {
      if (profile.isMsme) {
        score = 95;
        benefit = Math.min(master.maxSubsidyInr, 4500000); // 45 lakhs over loan tenure
      }
    } else if (master.id === 'MAHARASHTRA_ELECTRICITY_DUTY') {
      if (profile.powerRequiredKva >= 500) {
        score = 85;
        benefit = Math.min(master.maxSubsidyInr, 6500000);
      }
    } else if (master.id === 'MAHARASHTRA_EV_POLICY_2021') {
      if (profile.sector === 'EV_MANUFACTURING') {
        score = 98;
        benefit = Math.min(master.maxSubsidyInr, Math.round(profile.investmentInrCr * 0.15 * 10000000));
      }
    } else if (master.id === 'MAHARASHTRA_CMEGP') {
      if (profile.isMsme || profile.expectedEmployees >= 20) {
        score = 85;
        benefit = Math.min(master.maxSubsidyInr, 2500000); // 25 Lakhs margin money
      }
    }

    if (score >= 60 && benefit > 0) {
      matchedSchemes.push({
        ...master,
        matchScore: score,
        estimatedBenefitInr: benefit,
      });
      totalBenefit += benefit;
    }
  }

  // Sort by benefit descending
  matchedSchemes.sort((a, b) => b.estimatedBenefitInr - a.estimatedBenefitInr);

  return {
    schemes: matchedSchemes,
    totalEligibleBenefitInr: totalBenefit,
  };
}
