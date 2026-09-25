import { ApprovalNode, BusinessProfile, DocumentType } from '@approvalos/shared';

/**
 * Standard Approval Registry containing Maharashtra Single Window (MAITRI 2.0)
 * statutory regulatory specs across MIDC, MPCB, MSEDCL, DISH, and Fire Services
 * under the Maharashtra Right to Services (RTS) Act 2015.
 */
export const MASTER_APPROVALS: ApprovalNode[] = [
  {
    id: 'LAND_ALLOTMENT',
    code: 'LND-01',
    name: 'MIDC Industrial Land Allotment & Possession',
    department: 'Maharashtra Industrial Development Corp (MIDC)',
    category: 'LAND_BUILDING',
    lifecycleStage: 'PRE_ESTABLISHMENT',
    baseDays: 18,
    varianceDays: 5,
    statutoryFee: 0,
    prerequisites: [],
    documentsRequired: ['PAN_CARD', 'AADHAAR_CARD', 'GSTIN_CERTIFICATE', 'PROJECT_FEASIBILITY_REPORT'],
    riskLevel: 'MEDIUM',
    canAutoApprove: true,
    inspectionRequired: true,
    description: 'MIDC statutory lease deed, boundary demarcation, and physical possession handover under Maharashtra Industrial Development Act 1961.',
    issuingAuthority: 'Regional Officer, MIDC',
    validityYears: 95,
  },
  {
    id: 'EIA_EC',
    code: 'ENV-01',
    name: 'Environmental Clearance (SEIAA Maharashtra)',
    department: 'SEIAA Maharashtra / MoEFCC',
    category: 'ENVIRONMENTAL',
    lifecycleStage: 'PRE_ESTABLISHMENT',
    baseDays: 65,
    varianceDays: 18,
    statutoryFee: 0,
    prerequisites: ['LAND_ALLOTMENT'],
    documentsRequired: ['LAND_SALE_DEED', 'PROJECT_FEASIBILITY_REPORT', 'POLLUTION_UNDERTAKING', 'WATER_BALANCE_CHART'],
    riskLevel: 'CRITICAL',
    canAutoApprove: false,
    inspectionRequired: true,
    description: 'State Expert Appraisal Committee (SEAC-1/2/3) Maharashtra environmental impact assessment under EIA Notification 2006.',
    issuingAuthority: 'Member Secretary, SEIAA Maharashtra',
    validityYears: 7,
  },
  {
    id: 'CTE_POLLUTION',
    code: 'ENV-02',
    name: 'Consent to Establish (CTE) — MPCB',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    category: 'ENVIRONMENTAL',
    lifecycleStage: 'PRE_ESTABLISHMENT',
    baseDays: 28,
    varianceDays: 7,
    statutoryFee: 0,
    prerequisites: ['LAND_ALLOTMENT'],
    documentsRequired: ['LAND_SALE_DEED', 'FACTORY_LAYOUT_PLAN', 'POLLUTION_UNDERTAKING', 'WATER_BALANCE_CHART'],
    riskLevel: 'HIGH',
    canAutoApprove: true,
    inspectionRequired: true,
    description: 'Water (Prevention & Control of Pollution) Act 1974 & Air Act 1981 statutory consent for establishing industrial facility in Maharashtra.',
    issuingAuthority: 'Member Secretary / Regional Officer, MPCB',
    validityYears: 5,
  },
  {
    id: 'POWER_SANCTION',
    code: 'UTL-01',
    name: 'HT Power Feasibility & Tariff Sanction — MSEDCL',
    department: 'MSEDCL (Mahavitaran)',
    category: 'UTILITIES',
    lifecycleStage: 'PRE_ESTABLISHMENT',
    baseDays: 18,
    varianceDays: 5,
    statutoryFee: 0,
    prerequisites: ['LAND_ALLOTMENT'],
    documentsRequired: ['LAND_SALE_DEED', 'POWER_LOAD_CALCULATION'],
    riskLevel: 'MEDIUM',
    canAutoApprove: true,
    inspectionRequired: true,
    description: 'MSEDCL 11kV/22kV/33kV dedicated HT industrial feeder feasibility and transformer substation approval under Electricity Act 2003.',
    issuingAuthority: 'Superintending Engineer, MSEDCL',
    validityYears: 99,
  },
  {
    id: 'WATER_SANCTION',
    code: 'UTL-02',
    name: 'Industrial Water Allocation & Pipeline NOC — MIDC',
    department: 'MIDC Water Works / MJP',
    category: 'UTILITIES',
    lifecycleStage: 'PRE_ESTABLISHMENT',
    baseDays: 14,
    varianceDays: 4,
    statutoryFee: 0,
    prerequisites: ['LAND_ALLOTMENT'],
    documentsRequired: ['LAND_SALE_DEED', 'WATER_BALANCE_CHART'],
    riskLevel: 'MEDIUM',
    canAutoApprove: true,
    inspectionRequired: false,
    description: 'MIDC industrial pipeline tapping sanction or Maharashtra Jeevan Pradhikaran (MJP) bulk industrial water quota clearance.',
    issuingAuthority: 'Executive Engineer (Water), MIDC',
    validityYears: 5,
  },
  {
    id: 'BUILDING_PLAN',
    code: 'BLD-01',
    name: 'MIDC Special Planning Authority (SPA) Building Plan',
    department: 'MIDC Special Planning Authority (SPA)',
    category: 'LAND_BUILDING',
    lifecycleStage: 'PRE_ESTABLISHMENT',
    baseDays: 18,
    varianceDays: 5,
    statutoryFee: 0,
    prerequisites: ['LAND_ALLOTMENT'],
    documentsRequired: ['LAND_SALE_DEED', 'FACTORY_LAYOUT_PLAN'],
    riskLevel: 'MEDIUM',
    canAutoApprove: true,
    inspectionRequired: false,
    description: 'Civil structural vetting, FSI/FAR compliance, and mandatory 12m peripheral fire driveway approval under MIDC DCR 2009.',
    issuingAuthority: 'Special Planning Authority Officer, MIDC',
    validityYears: 3,
  },
  {
    id: 'FIRE_NOC',
    code: 'SAF-01',
    name: 'Maharashtra Fire Services Provisional NOC',
    department: 'Maharashtra Fire Services / MIDC Fire Brigade',
    category: 'SAFETY_LABOUR',
    lifecycleStage: 'PRE_ESTABLISHMENT',
    baseDays: 15,
    varianceDays: 4,
    statutoryFee: 0,
    prerequisites: ['BUILDING_PLAN'],
    documentsRequired: ['FACTORY_LAYOUT_PLAN', 'FIRE_SAFETY_SCHEMATIC'],
    riskLevel: 'HIGH',
    canAutoApprove: false,
    inspectionRequired: true,
    description: 'Maharashtra Fire Prevention and Life Safety Measures Act 2006 compliance for industrial hydrant, sprinkler, and emergency egress.',
    issuingAuthority: 'Chief Fire Officer (CFO), MIDC Fire Service',
    validityYears: 1,
  },
  {
    id: 'FACTORY_LICENSE',
    code: 'LAB-01',
    name: 'Factory License — DISH Maharashtra (Factories Rules 1963)',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    category: 'SAFETY_LABOUR',
    lifecycleStage: 'PRE_OPERATION',
    baseDays: 20,
    varianceDays: 6,
    statutoryFee: 0,
    prerequisites: ['BUILDING_PLAN', 'FIRE_NOC', 'CTE_POLLUTION', 'POWER_SANCTION'],
    documentsRequired: ['LAND_SALE_DEED', 'FACTORY_LAYOUT_PLAN', 'FIRE_SAFETY_SCHEMATIC'],
    riskLevel: 'MEDIUM',
    canAutoApprove: true,
    inspectionRequired: true,
    description: 'Occupational health, industrial ventilation, machine guarding, and worker safety under DISH Maharashtra and Factories Act 1948.',
    issuingAuthority: 'Joint Director, DISH Maharashtra',
    validityYears: 5,
  },
  {
    id: 'BOILER_REGISTRATION',
    code: 'SAF-02',
    name: 'Industrial Boiler Registration — Maharashtra',
    department: 'Directorate of Steam Boilers, Maharashtra',
    category: 'SAFETY_LABOUR',
    lifecycleStage: 'PRE_OPERATION',
    baseDays: 14,
    varianceDays: 4,
    statutoryFee: 0,
    prerequisites: ['BUILDING_PLAN'],
    documentsRequired: ['FACTORY_LAYOUT_PLAN'],
    riskLevel: 'HIGH',
    canAutoApprove: false,
    inspectionRequired: true,
    description: 'Hydraulic steam pressure testing and steam pipeline metallurgy certification under Indian Boiler Regulations (IBR 1950).',
    issuingAuthority: 'Director of Steam Boilers, Maharashtra',
    validityYears: 1,
  },
  {
    id: 'PESO_EXPLOSIVES',
    code: 'SEC-01',
    name: 'PESO Hazardous Chemicals / Solvent License',
    department: 'PESO (West Circle, Navi Mumbai)',
    category: 'SECTOR_SPECIFIC',
    lifecycleStage: 'PRE_OPERATION',
    baseDays: 32,
    varianceDays: 9,
    statutoryFee: 0,
    prerequisites: ['BUILDING_PLAN', 'FIRE_NOC'],
    documentsRequired: ['FACTORY_LAYOUT_PLAN', 'FIRE_SAFETY_SCHEMATIC'],
    riskLevel: 'CRITICAL',
    canAutoApprove: false,
    inspectionRequired: true,
    description: 'Flammable solvents, bulk gas storage bullets, and petroleum class A/B installations under Petroleum Rules 2002.',
    issuingAuthority: 'Joint Chief Controller of Explosives, Navi Mumbai',
    validityYears: 3,
  },
  {
    id: 'CTO_POLLUTION',
    code: 'ENV-03',
    name: 'Consent to Operate (CTO) — MPCB',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    category: 'ENVIRONMENTAL',
    lifecycleStage: 'PRE_OPERATION',
    baseDays: 24,
    varianceDays: 6,
    statutoryFee: 0,
    prerequisites: ['FACTORY_LICENSE', 'CTE_POLLUTION', 'WATER_SANCTION'],
    documentsRequired: ['POLLUTION_UNDERTAKING', 'WATER_BALANCE_CHART'],
    riskLevel: 'HIGH',
    canAutoApprove: false,
    inspectionRequired: true,
    description: 'Final operational sanction confirming constructed ETP, online continuous emission monitoring (OCEMS) meet MPCB environmental norms.',
    issuingAuthority: 'Regional Officer, MPCB',
    validityYears: 5,
  },
  {
    id: 'FIRE_FINAL_NOC',
    code: 'SAF-03',
    name: 'Maharashtra Fire Services Final Occupancy NOC',
    department: 'Maharashtra Fire Services / MIDC Fire Brigade',
    category: 'SAFETY_LABOUR',
    lifecycleStage: 'PRE_OPERATION',
    baseDays: 14,
    varianceDays: 4,
    statutoryFee: 0,
    prerequisites: ['BUILDING_PLAN', 'FIRE_NOC'],
    documentsRequired: ['FACTORY_LAYOUT_PLAN', 'FIRE_SAFETY_SCHEMATIC'],
    riskLevel: 'HIGH',
    canAutoApprove: false,
    inspectionRequired: true,
    description: 'Post-construction physical inspection of operational fire hydrants, sprinkler systems, and smoke alarms under Maharashtra Fire Act 2006.',
    issuingAuthority: 'Chief Fire Officer (CFO), MIDC Fire Service',
    validityYears: 1,
  },
  {
    id: 'CTO_RENEWAL',
    code: 'ENV-04',
    name: 'Consent to Operate (CTO) Renewal — MPCB',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    category: 'ENVIRONMENTAL',
    lifecycleStage: 'RENEWAL',
    baseDays: 15,
    varianceDays: 4,
    statutoryFee: 0,
    prerequisites: ['CTO_POLLUTION'],
    documentsRequired: ['POLLUTION_UNDERTAKING', 'WATER_BALANCE_CHART'],
    riskLevel: 'MEDIUM',
    canAutoApprove: true,
    inspectionRequired: false,
    description: 'Fast-track renewal of MPCB Consent to Operate under Water & Air Acts based on self-certified Form V submission and zero pending violations.',
    issuingAuthority: 'Regional Officer, MPCB',
    validityYears: 5,
  },
  {
    id: 'FACTORY_LICENSE_RENEWAL',
    code: 'LAB-02',
    name: 'Factory License Renewal — DISH Maharashtra',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    category: 'SAFETY_LABOUR',
    lifecycleStage: 'RENEWAL',
    baseDays: 10,
    varianceDays: 3,
    statutoryFee: 0,
    prerequisites: ['FACTORY_LICENSE'],
    documentsRequired: ['FACTORY_LAYOUT_PLAN'],
    riskLevel: 'LOW',
    canAutoApprove: true,
    inspectionRequired: false,
    description: 'Statutory renewal of factory registration under Rule 7 of Maharashtra Factories Rules 1963 with multi-year fee payment.',
    issuingAuthority: 'Joint Director, DISH Maharashtra',
    validityYears: 5,
  },
  {
    id: 'FIRE_NOC_RENEWAL',
    code: 'SAF-04',
    name: 'Annual Fire Safety Certificate Form B Renewal',
    department: 'Maharashtra Fire Services',
    category: 'SAFETY_LABOUR',
    lifecycleStage: 'RENEWAL',
    baseDays: 8,
    varianceDays: 2,
    statutoryFee: 0,
    prerequisites: ['FIRE_NOC'],
    documentsRequired: ['FIRE_SAFETY_SCHEMATIC'],
    riskLevel: 'LOW',
    canAutoApprove: true,
    inspectionRequired: false,
    description: 'Annual submission of Form B licensed agency maintenance certificate under Section 3(3) of Maharashtra Fire Act 2006.',
    issuingAuthority: 'Chief Fire Officer, Maharashtra Fire Services',
    validityYears: 1,
  },
];

/**
 * Filter and calibrate approvals customized for the entrepreneur's business profile in Maharashtra
 */
export function getApprovalsForProfile(profile: BusinessProfile): ApprovalNode[] {
  const result: ApprovalNode[] = [];

  // Determine if EIA/EC is mandated
  const needsEIA = (
    profile.pollutionCategory === 'RED' ||
    profile.sector === 'CHEMICALS' ||
    profile.sector === 'PHARMA' ||
    profile.investmentInrCr > 100 ||
    profile.landType === 'PRIVATE_AGRICULTURAL'
  );

  // Determine if Boiler is needed
  const needsBoiler = profile.boilerInstalled || profile.sector === 'TEXTILES' || profile.sector === 'CHEMICALS' || profile.sector === 'FOOD_PROCESSING';

  // Determine if PESO is needed
  const needsPESO = profile.hazardousChemicals || profile.sector === 'CHEMICALS' || (profile.sector === 'PHARMA' && profile.investmentInrCr > 30);

  // Maharashtra MIDC vs Private Land speed factor
  const isGovtPark = profile.landType === 'GOVT_INDUSTRIAL_PARK' || profile.landType === 'SEZ';
  const speedFactor = isGovtPark ? 0.85 : 1.20;

  for (const master of MASTER_APPROVALS) {
    if (master.lifecycleStage === 'RENEWAL') continue; // only for renewal workflows
    if (master.id === 'EIA_EC' && !needsEIA) continue;
    if (master.id === 'BOILER_REGISTRATION' && !needsBoiler) continue;
    if (master.id === 'PESO_EXPLOSIVES' && !needsPESO) continue;

    const node: ApprovalNode = {
      ...master,
      prerequisites: [...master.prerequisites],
      baseDays: Math.max(5, Math.round(master.baseDays * speedFactor)),
      varianceDays: Math.max(2, Math.round(master.varianceDays * speedFactor)),
      statutoryFee: 0,
    };

    if (master.id === 'CTE_POLLUTION') {
      node.prerequisites = needsEIA ? ['EIA_EC'] : ['LAND_ALLOTMENT'];
    }

    if (isGovtPark) {
      if (node.id === 'LAND_ALLOTMENT') {
        node.baseDays = Math.round(node.baseDays * 0.60);
        node.canAutoApprove = true;
      }
      if (node.id === 'BUILDING_PLAN') {
        node.baseDays = Math.round(node.baseDays * 0.70);
        node.canAutoApprove = true;
      }
    }

    if (profile.trustScore && profile.trustScore >= 80) {
      if (node.canAutoApprove) {
        node.baseDays = Math.max(3, Math.round(node.baseDays * 0.35));
      }
    }

    result.push(node);
  }

  return result;
}

/**
 * Returns complete interactive graph nodes & links for D3 / DAG visualization
 */
export function getKnowledgeGraphGraphData() {
  const nodes = MASTER_APPROVALS.map(a => ({
    id: a.id,
    label: a.name,
    department: a.department,
    category: a.category,
    riskLevel: a.riskLevel,
    baseDays: a.baseDays,
    statutoryFee: 0,
  }));

  const links: Array<{ source: string; target: string; type: string }> = [];
  for (const a of MASTER_APPROVALS) {
    for (const p of a.prerequisites) {
      links.push({
        source: p,
        target: a.id,
        type: 'DEPENDS_ON',
      });
    }
  }

  return { nodes, links };
}
