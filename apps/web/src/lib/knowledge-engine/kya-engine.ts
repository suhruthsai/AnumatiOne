import { 
  KyaQuery, 
  KyaResult, 
  KyaApprovalItem, 
  KyaSchemeDetail,
  LifecycleStage, 
  TalukaZone, 
  SectorType,
  DocumentType
} from '@approvalos/shared';
import { MASTER_APPROVALS } from './regulatory-graph';

/**
 * Standard descriptions and guidelines for all statutory documents
 */
export const STATUTORY_DOCUMENTS_GUIDE: Record<string, {
  name: string;
  issuingSource: string;
  formatReq: string;
  description: string;
  commonRejectionPitfall: string;
}> = {
  PAN_CARD: {
    name: 'Company PAN Card',
    issuingSource: 'Income Tax Department (Govt of India)',
    formatReq: 'Self-attested Color PDF (max 2MB)',
    description: 'Mandatory PAN card in the exact name of the entity or authorized promoter.',
    commonRejectionPitfall: 'Name spelling mismatch against GSTIN or incorporation deed.',
  },
  AADHAAR_CARD: {
    name: 'Authorized Signatory Aadhaar Card',
    issuingSource: 'UIDAI (Govt of India)',
    formatReq: 'Masked Aadhaar PDF with QR code',
    description: 'Aadhaar of managing director or designated partner authorized by board resolution.',
    commonRejectionPitfall: 'Aadhaar not linked with mobile for OTP e-sign.',
  },
  GSTIN_CERTIFICATE: {
    name: 'Maharashtra GSTIN Certificate (Form GST REG-06)',
    issuingSource: 'State Goods & Services Tax Department',
    formatReq: 'Official Registration Certificate PDF (27-prefix)',
    description: 'Proof of GST registration in Maharashtra state with active trade classification.',
    commonRejectionPitfall: 'State code not starting with 27 or principal place of business not matching site.',
  },
  LAND_SALE_DEED: {
    name: 'Land Ownership / MIDC Allotment Lease Deed',
    issuingSource: 'MIDC / Revenue Department (Sub-Registrar)',
    formatReq: 'Registered Lease Deed or 7/12 & 8-A Extract with index-II',
    description: 'Proof of legal possession of plot in MIDC or registered non-agricultural title deed.',
    commonRejectionPitfall: 'Missing mutation entry or pending encumbrance on 7/12 extract.',
  },
  PROJECT_FEASIBILITY_REPORT: {
    name: 'Detailed Project Report (DPR) / Technical Brief',
    issuingSource: 'Certified Industrial Consultant / CA',
    formatReq: 'Detailed PDF with capital outlay, machinery list, raw material balance',
    description: 'Comprehensive financial and engineering blueprint of manufacturing operations.',
    commonRejectionPitfall: 'Machinery schedule not matching total fixed capital investment (FCI).',
  },
  FACTORY_LAYOUT_PLAN: {
    name: 'Architectural Site & Factory Layout Plan',
    issuingSource: 'Registered Chartered Architect / Town Planner',
    formatReq: '1:100 Scale CAD/PDF with color-coded safety setbacks',
    description: 'Detailed drawings showing production shop floor, 12m perimeter fire driveway, and entry/exit gates.',
    commonRejectionPitfall: 'Peripheral driveway less than 12 meters or missing fire hydrant positions.',
  },
  POLLUTION_UNDERTAKING: {
    name: 'Environmental Undertaking & Effluent Treatment Scheme',
    issuingSource: 'Chartered Environmental Engineer',
    formatReq: 'Signed Undertaking on ₹500 Stamp Paper with ETP/STP design schematics',
    description: 'Effluent generation calculation (KLD), air emission stack heights, and Zero Liquid Discharge (ZLD) details.',
    commonRejectionPitfall: 'Discharge quality parameters exceeding MPCB standard limits (BOD < 30 mg/l, COD < 250 mg/l).',
  },
  WATER_BALANCE_CHART: {
    name: 'Water Balance & Consumption Audit Chart',
    issuingSource: 'Industrial Utility Consultant',
    formatReq: 'Input-Output Mass Balance Table PDF',
    description: 'Breakdown of water used in process, boiler feed, domestic, and gardening.',
    commonRejectionPitfall: 'Treated water recycling volume not mathematically balancing intake.',
  },
  POWER_LOAD_CALCULATION: {
    name: 'Connected Load & HT Feasibility Estimation',
    issuingSource: 'Licensed Electrical Contractor / Engineer',
    formatReq: 'Single Line Diagram (SLD) with transformer and substation rating',
    description: 'Connected load calculations in kVA, contract demand, and transformer protection scheme.',
    commonRejectionPitfall: 'Contract demand exceeding distribution substation spare capacity.',
  },
  FIRE_SAFETY_SCHEMATIC: {
    name: 'Fire Protection & Emergency Evacuation Schematic',
    issuingSource: 'Certified Fire Safety Auditor / Consultant',
    formatReq: 'Floor-wise schematic with hydrant, risers, and escape routes',
    description: 'Compliance with Maharashtra Fire Prevention and Life Safety Measures Act 2006.',
    commonRejectionPitfall: 'Exit doors width not meeting occupant load safety standards.',
  },
};

/**
 * Evaluates the user's project parameters and returns a complete, tailored statutory matrix
 */
export function evaluateKyaQuery(query: KyaQuery): KyaResult {
  const applicableApprovals: KyaApprovalItem[] = [];

  // Filter based on Lifecycle Stage
  if (query.stage === 'PRE_ESTABLISHMENT') {
    applicableApprovals.push({
      id: 'LAND_ALLOTMENT',
      code: 'LND-01',
      name: query.locationType === 'MIDC_ESTATE' 
        ? `MIDC Land Allotment & Lease Possession (${query.midcCluster || 'MIDC Cluster'})`
        : 'Section 44 Land Conversion & Non-Agricultural (NA) Sanction',
      department: query.locationType === 'MIDC_ESTATE' ? 'MIDC Industrial Land Division' : 'Revenue Department / District Collector',
      statutoryAct: query.locationType === 'MIDC_ESTATE' ? 'Maharashtra Industrial Development Act 1961' : 'Maharashtra Land Revenue Code 1966',
      slaDays: query.locationType === 'MIDC_ESTATE' ? 18 : 30,
      mandatoryDocuments: ['PAN_CARD', 'AADHAAR_CARD', 'GSTIN_CERTIFICATE', 'PROJECT_FEASIBILITY_REPORT'],
      lifecycleStage: 'PRE_ESTABLISHMENT',
      riskLevel: 'MEDIUM',
      description: 'Physical plot handover, demarcation, and statutory lease deed execution.',
    });

    if (query.pollutionCategory === 'RED' || query.investmentInrCr > 100 || query.sector === 'CHEMICALS' || query.locationType === 'CRZ_COASTAL') {
      applicableApprovals.push({
        id: 'EIA_EC',
        code: 'ENV-01',
        name: 'Environmental Clearance (SEIAA Maharashtra)',
        department: 'SEIAA Maharashtra / Environment & Climate Change Dept',
        statutoryAct: 'Environment (Protection) Act 1986 & EIA Notification 2006',
        slaDays: 60,
        mandatoryDocuments: ['LAND_SALE_DEED', 'PROJECT_FEASIBILITY_REPORT', 'POLLUTION_UNDERTAKING', 'WATER_BALANCE_CHART'],
        lifecycleStage: 'PRE_ESTABLISHMENT',
        riskLevel: 'CRITICAL',
        description: 'Statutory public consultation and State Expert Appraisal Committee scrutiny.',
      });
    }

    applicableApprovals.push({
      id: 'CTE_POLLUTION',
      code: 'ENV-02',
      name: `Consent to Establish (CTE) — MPCB (${query.pollutionCategory} Category)`,
      department: 'Maharashtra Pollution Control Board (MPCB)',
      statutoryAct: 'Water Act 1974 & Air Act 1981',
      slaDays: query.pollutionCategory === 'RED' ? 30 : query.pollutionCategory === 'ORANGE' ? 21 : 15,
      mandatoryDocuments: ['LAND_SALE_DEED', 'FACTORY_LAYOUT_PLAN', 'POLLUTION_UNDERTAKING', 'WATER_BALANCE_CHART'],
      lifecycleStage: 'PRE_ESTABLISHMENT',
      riskLevel: query.pollutionCategory === 'RED' ? 'HIGH' : 'MEDIUM',
      description: 'Mandatory environmental consent before starting any civil construction on site.',
    });

    applicableApprovals.push({
      id: 'BUILDING_PLAN',
      code: 'BLD-01',
      name: 'Industrial Building & Architectural Plan Sanction',
      department: query.locationType === 'MIDC_ESTATE' ? 'MIDC Special Planning Authority (SPA)' : 'Town Planning / Municipal Corp',
      statutoryAct: 'Maharashtra Regional & Town Planning (MRTP) Act 1966',
      slaDays: 18,
      mandatoryDocuments: ['LAND_SALE_DEED', 'FACTORY_LAYOUT_PLAN'],
      lifecycleStage: 'PRE_ESTABLISHMENT',
      riskLevel: 'MEDIUM',
      description: 'FSI/FAR structural vetting, peripheral safety margins, and height approvals.',
    });

    applicableApprovals.push({
      id: 'FIRE_NOC',
      code: 'SAF-01',
      name: 'Provisional Fire Safety NOC',
      department: 'Directorate of Maharashtra Fire Services',
      statutoryAct: 'Maharashtra Fire Prevention & Life Safety Measures Act 2006',
      slaDays: 15,
      mandatoryDocuments: ['FACTORY_LAYOUT_PLAN', 'FIRE_SAFETY_SCHEMATIC'],
      lifecycleStage: 'PRE_ESTABLISHMENT',
      riskLevel: 'HIGH',
      description: 'Review of emergency egress, hydrant layout, and fire water reservoir capacities.',
    });

    applicableApprovals.push({
      id: 'POWER_SANCTION',
      code: 'UTL-01',
      name: `HT Power Feasibility & Tariff Sanction (${query.powerRequiredKva} kVA)`,
      department: 'MSEDCL (Mahavitaran)',
      statutoryAct: 'Electricity Act 2003 & MERC Supply Code 2021',
      slaDays: 18,
      mandatoryDocuments: ['LAND_SALE_DEED', 'POWER_LOAD_CALCULATION'],
      lifecycleStage: 'PRE_ESTABLISHMENT',
      riskLevel: 'MEDIUM',
      description: 'Dedicated 11kV/22kV HT feeder feasibility and step-down transformer clearance.',
    });

    applicableApprovals.push({
      id: 'WATER_SANCTION',
      code: 'UTL-02',
      name: `Industrial Water Quota Sanction (${query.waterRequiredKld} KLD)`,
      department: query.locationType === 'MIDC_ESTATE' ? 'MIDC Water Works' : 'MJP / Water Resources Dept',
      statutoryAct: 'Maharashtra Industrial Development Act 1961',
      slaDays: 14,
      mandatoryDocuments: ['LAND_SALE_DEED', 'WATER_BALANCE_CHART'],
      lifecycleStage: 'PRE_ESTABLISHMENT',
      riskLevel: 'LOW',
      description: 'Industrial water pipeline connection and daily volumetric allocation.',
    });

  } else if (query.stage === 'PRE_OPERATION') {
    applicableApprovals.push({
      id: 'CTO_POLLUTION',
      code: 'ENV-03',
      name: `Consent to Operate (CTO) — MPCB (${query.pollutionCategory} Category)`,
      department: 'Maharashtra Pollution Control Board (MPCB)',
      statutoryAct: 'Water Act 1974 & Air Act 1981',
      slaDays: 24,
      mandatoryDocuments: ['POLLUTION_UNDERTAKING', 'WATER_BALANCE_CHART'],
      lifecycleStage: 'PRE_OPERATION',
      riskLevel: 'HIGH',
      description: 'Final commissioning consent verifying installed ETP, STP, and emission stacks.',
    });

    applicableApprovals.push({
      id: 'FACTORY_LICENSE',
      code: 'LAB-01',
      name: 'Factory Registration & License — DISH Maharashtra',
      department: 'Directorate of Industrial Safety & Health (DISH)',
      statutoryAct: 'Factories Act 1948 & Maharashtra Factories Rules 1963',
      slaDays: 20,
      mandatoryDocuments: ['LAND_SALE_DEED', 'FACTORY_LAYOUT_PLAN', 'FIRE_SAFETY_SCHEMATIC'],
      lifecycleStage: 'PRE_OPERATION',
      riskLevel: 'MEDIUM',
      description: 'Worker safety inspection, machine guarding certification, and health welfare amenities.',
    });

    applicableApprovals.push({
      id: 'FIRE_FINAL_NOC',
      code: 'SAF-03',
      name: 'Final Fire Safety Occupancy Certificate',
      department: 'Directorate of Maharashtra Fire Services',
      statutoryAct: 'Maharashtra Fire Prevention & Life Safety Measures Act 2006',
      slaDays: 14,
      mandatoryDocuments: ['FACTORY_LAYOUT_PLAN', 'FIRE_SAFETY_SCHEMATIC'],
      lifecycleStage: 'PRE_OPERATION',
      riskLevel: 'HIGH',
      description: 'Physical pressure testing of hydrants, sprinkler loops, and smoke dampers.',
    });

    if (query.hasBoiler || query.sector === 'TEXTILES' || query.sector === 'CHEMICALS' || query.sector === 'FOOD_PROCESSING') {
      applicableApprovals.push({
        id: 'BOILER_REGISTRATION',
        code: 'SAF-02',
        name: 'Industrial Boiler Registration & Steam Pipeline Certificate',
        department: 'Directorate of Steam Boilers, Maharashtra',
        statutoryAct: 'Indian Boilers Act 1923 & IBR 1950',
        slaDays: 14,
        mandatoryDocuments: ['FACTORY_LAYOUT_PLAN'],
        lifecycleStage: 'PRE_OPERATION',
        riskLevel: 'HIGH',
        description: 'Hydraulic steam pressure testing and safety valve calibration.',
      });
    }

    if (query.hasHazardousChemicals || query.sector === 'CHEMICALS' || (query.sector === 'PHARMA' && query.investmentInrCr > 30)) {
      applicableApprovals.push({
        id: 'PESO_EXPLOSIVES',
        code: 'SEC-01',
        name: 'PESO Flammable Solvent & Bulk Chemical Storage License',
        department: 'Petroleum & Explosives Safety Organisation (PESO)',
        statutoryAct: 'Petroleum Act 1934 & Explosives Act 1884',
        slaDays: 30,
        mandatoryDocuments: ['FACTORY_LAYOUT_PLAN', 'FIRE_SAFETY_SCHEMATIC'],
        lifecycleStage: 'PRE_OPERATION',
        riskLevel: 'CRITICAL',
        description: 'Storage installation approval for Class A/B petroleum products and hazardous gases.',
      });
    }

  } else if (query.stage === 'DURING_OPERATIONS') {
    applicableApprovals.push({
      id: 'FORM_V_RETURN',
      code: 'RET-01',
      name: 'Annual Environmental Statement (Form V Filing)',
      department: 'Maharashtra Pollution Control Board (MPCB)',
      statutoryAct: 'Environment (Protection) Rules 1986 (Rule 14)',
      slaDays: 7,
      mandatoryDocuments: ['POLLUTION_UNDERTAKING', 'WATER_BALANCE_CHART'],
      lifecycleStage: 'DURING_OPERATIONS',
      riskLevel: 'LOW',
      description: 'Mandatory annual filing by September 30 summarizing water and raw material consumption.',
    });

    applicableApprovals.push({
      id: 'FORM_4_RETURN',
      code: 'RET-02',
      name: 'Hazardous Waste Annual Return (Form 4 Filing)',
      department: 'Maharashtra Pollution Control Board (MPCB)',
      statutoryAct: 'Hazardous and Other Wastes Management Rules 2016',
      slaDays: 7,
      mandatoryDocuments: ['POLLUTION_UNDERTAKING'],
      lifecycleStage: 'DURING_OPERATIONS',
      riskLevel: 'MEDIUM',
      description: 'Mandatory annual return by June 30 reporting quantity of hazardous waste sent to CHWTSDF.',
    });

    applicableApprovals.push({
      id: 'DISH_FORM_27',
      code: 'RET-03',
      name: 'Half-Yearly Factory Safety & Labour Return (Form 27)',
      department: 'Directorate of Industrial Safety & Health (DISH)',
      statutoryAct: 'Maharashtra Factories Rules 1963',
      slaDays: 7,
      mandatoryDocuments: ['PROJECT_FEASIBILITY_REPORT'],
      lifecycleStage: 'DURING_OPERATIONS',
      riskLevel: 'LOW',
      description: 'Biannual report on occupational health, safety committee meetings, and working hours.',
    });

    applicableApprovals.push({
      id: 'FIRE_FORM_B',
      code: 'RET-04',
      name: 'Annual Fire Equipment Maintenance Certificate (Form B)',
      department: 'Maharashtra Fire Services',
      statutoryAct: 'Maharashtra Fire Prevention & Life Safety Measures Act 2006',
      slaDays: 5,
      mandatoryDocuments: ['FIRE_SAFETY_SCHEMATIC'],
      lifecycleStage: 'DURING_OPERATIONS',
      riskLevel: 'LOW',
      description: 'Statutory certificate issued by licensed agency verifying functional condition of all fire systems.',
    });

  } else if (query.stage === 'RENEWAL') {
    applicableApprovals.push({
      id: 'CTO_RENEWAL',
      code: 'ENV-04',
      name: `Consent to Operate (CTO) Fast-Track Renewal — MPCB (${query.pollutionCategory})`,
      department: 'Maharashtra Pollution Control Board (MPCB)',
      statutoryAct: 'Water Act 1974 & Air Act 1981',
      slaDays: 15,
      mandatoryDocuments: ['POLLUTION_UNDERTAKING', 'WATER_BALANCE_CHART'],
      lifecycleStage: 'RENEWAL',
      riskLevel: 'MEDIUM',
      description: 'Auto-renewal for compliant industries with zero pending show-cause notices.',
    });

    applicableApprovals.push({
      id: 'FACTORY_LICENSE_RENEWAL',
      code: 'LAB-02',
      name: 'Factory License Multi-Year Renewal — DISH Maharashtra',
      department: 'Directorate of Industrial Safety & Health (DISH)',
      statutoryAct: 'Maharashtra Factories Rules 1963 (Rule 7)',
      slaDays: 10,
      mandatoryDocuments: ['FACTORY_LAYOUT_PLAN'],
      lifecycleStage: 'RENEWAL',
      riskLevel: 'LOW',
      description: 'Multi-year renewal option up to 10 years with automated electronic fee calculation.',
    });

    applicableApprovals.push({
      id: 'FIRE_NOC_RENEWAL',
      code: 'SAF-04',
      name: 'Annual Fire NOC Re-Validation',
      department: 'Maharashtra Fire Services',
      statutoryAct: 'Maharashtra Fire Prevention & Life Safety Measures Act 2006',
      slaDays: 8,
      mandatoryDocuments: ['FIRE_SAFETY_SCHEMATIC'],
      lifecycleStage: 'RENEWAL',
      riskLevel: 'LOW',
      description: 'Routine statutory re-validation upon uploading Form B maintenance certificate.',
    });
  }

  // Calculate timelines
  const totalSlaDaysSequential = applicableApprovals.reduce((sum, a) => sum + a.slaDays, 0);
  const totalSlaDaysParallel = applicableApprovals.length > 0 ? Math.max(...applicableApprovals.map(a => a.slaDays)) + 8 : 0;

  // Build unique mandatory document list
  const docCodesSet = new Set<string>();
  const docToApprovalsMap: Record<string, string[]> = {};

  for (const app of applicableApprovals) {
    for (const docCode of app.mandatoryDocuments) {
      docCodesSet.add(docCode);
      if (!docToApprovalsMap[docCode]) {
        docToApprovalsMap[docCode] = [];
      }
      docToApprovalsMap[docCode].push(app.name);
    }
  }

  const mandatoryDocumentsList = Array.from(docCodesSet).map(code => {
    const guide = STATUTORY_DOCUMENTS_GUIDE[code] || {
      name: code.replace(/_/g, ' '),
      issuingSource: 'Authorized Authority',
      formatReq: 'Official Signed PDF',
      description: 'Statutory verification document.',
      commonRejectionPitfall: 'Missing seal or signature.',
    };

    return {
      code,
      name: guide.name,
      issuingSource: guide.issuingSource,
      description: guide.description,
      requiredForApprovals: docToApprovalsMap[code] || [],
    };
  });

  // Calculate eligible state incentives under Package Scheme of Incentives (PSI 2019)
  let grossSgstReimbursementPct = 0;
  let sgstReimbursementYears = 0;
  let stampDutyExemptionPct = 0;
  let electricityDutyExemptionYears = 0;
  let powerTariffSubsidyPerUnit = 0;
  let powerTariffSubsidyYears = 0;
  let eligiblePolicyName = 'Maharashtra Package Scheme of Incentives (PSI 2019)';

  switch (query.talukaZone) {
    case 'ZONE_A':
      grossSgstReimbursementPct = query.sector === 'EV_MANUFACTURING' ? 30 : 0;
      sgstReimbursementYears = 5;
      stampDutyExemptionPct = 0;
      electricityDutyExemptionYears = 0;
      powerTariffSubsidyPerUnit = 0;
      powerTariffSubsidyYears = 0;
      if (query.sector === 'EV_MANUFACTURING') eligiblePolicyName = 'Maharashtra EV Policy 2021 (Special Zone A Incentives)';
      break;

    case 'ZONE_B':
      grossSgstReimbursementPct = 40;
      sgstReimbursementYears = 7;
      stampDutyExemptionPct = 50;
      electricityDutyExemptionYears = 5;
      powerTariffSubsidyPerUnit = 1.0;
      powerTariffSubsidyYears = 3;
      break;

    case 'ZONE_C':
      grossSgstReimbursementPct = 60;
      sgstReimbursementYears = 7;
      stampDutyExemptionPct = 100;
      electricityDutyExemptionYears = 7;
      powerTariffSubsidyPerUnit = 1.5;
      powerTariffSubsidyYears = 3;
      break;

    case 'ZONE_D':
      grossSgstReimbursementPct = 80;
      sgstReimbursementYears = 8;
      stampDutyExemptionPct = 100;
      electricityDutyExemptionYears = 8;
      powerTariffSubsidyPerUnit = 1.75;
      powerTariffSubsidyYears = 5;
      break;

    case 'ZONE_D_PLUS':
      grossSgstReimbursementPct = 100;
      sgstReimbursementYears = 10;
      stampDutyExemptionPct = 100;
      electricityDutyExemptionYears = 10;
      powerTariffSubsidyPerUnit = 2.0;
      powerTariffSubsidyYears = 5;
      eligiblePolicyName = 'Maharashtra PSI 2019 (Special Category: Vidarbha, Marathwada & Naxalite Zones)';
      break;
  }

  // Estimate financial benefit:
  // Gross SGST value ~ FCI * pct, Stamp Duty ~ 4% of FCI, Electricity Duty waiver ~ ₹0.25 Cr/yr
  const stampDutyBenefitCr = (query.investmentInrCr * 0.04) * (stampDutyExemptionPct / 100);
  const sgstBenefitCr = (query.investmentInrCr * (grossSgstReimbursementPct / 100));
  const electricityBenefitCr = (0.25 * electricityDutyExemptionYears);
  const powerTariffBenefitCr = (powerTariffSubsidyPerUnit * 0.15 * powerTariffSubsidyYears);
  const estimatedTotalBenefitCr = Number((stampDutyBenefitCr + sgstBenefitCr + electricityBenefitCr + powerTariffBenefitCr).toFixed(2));

  // Construct Comprehensive Maharashtra State Industrial Schemes Portfolio
  const matchedSchemes: KyaSchemeDetail[] = [
    {
      id: 'MH_PSI_SGST_IPS',
      code: 'MH-PSI-IPS-01',
      name: 'Package Scheme of Incentives (PSI 2019/2024) — SGST Industrial Promotion Subsidy',
      category: 'TAX_REIMBURSEMENT',
      categoryLabel: 'State Tax Refund',
      department: 'Directorate of Industries, Maharashtra',
      isEligible: query.talukaZone !== 'ZONE_A' || query.sector === 'EV_MANUFACTURING',
      ineligibilityReason: query.talukaZone === 'ZONE_A' && query.sector !== 'EV_MANUFACTURING' ? 'Units in Zone A (Mumbai/Pune Core) must be EV/Thrust sectors to claim SGST subsidy' : undefined,
      plainEnglishSummary: 'Cash reimbursement of up to 100% of State GST (SGST) paid on factory sales for 7–10 years, capped at your total plant & machinery investment.',
      benefitHighlights: [
        `${grossSgstReimbursementPct}% of eligible capital investment refundable via annual SGST refunds`,
        `Disbursed over ${sgstReimbursementYears} years directly into company bank account`,
        'Exemption from routine commercial tax scrutiny during sanctioned claim validity'
      ],
      estimatedSavingText: `~₹${sgstBenefitCr.toFixed(2)} Cr total refund potential over ${sgstReimbursementYears} years`,
      eligibilityConditions: [
        `Manufacturing setup located in Maharashtra Taluka ${query.talukaZone}`,
        'Minimum 50% recruitment from Maharashtra domiciled workforce',
        'Commercial production commenced within 3 years of land allotment'
      ],
      documentsRequired: ['PROJECT_FEASIBILITY_REPORT', 'CHARTERED_ACCOUNTANT_FCI_CERT', 'GSTIN_CERTIFICATE'],
      policyDocument: 'Government Resolution No. PSI-2019/CR-46/IND-8',
      howToClaim: 'Auto-claimed when you submit Single-Window CAF Section 3'
    },
    {
      id: 'MH_STAMP_DUTY_EXEMPTION',
      code: 'MH-REV-STAMP-02',
      name: '100% Stamp Duty & Registration Fee Exemption (Maharashtra Stamp Act)',
      category: 'STAMP_DUTY',
      categoryLabel: 'Land Lease Exemption',
      department: 'Revenue & Forest Department / Inspector General of Registration',
      isEligible: query.locationType === 'MIDC_ESTATE' || query.talukaZone !== 'ZONE_A',
      ineligibilityReason: query.locationType !== 'MIDC_ESTATE' && query.talukaZone === 'ZONE_A' ? 'Private land in Zone A core does not qualify for general stamp duty exemption' : undefined,
      plainEnglishSummary: 'Zero stamp duty payable when executing registered 95-year MIDC lease agreements, land conveyance deeds, or mortgage documents.',
      benefitHighlights: [
        `${stampDutyExemptionPct}% waiver on state stamp duty & registration surcharge`,
        'Direct upfront capital savings before initiating civil construction',
        'Valid across all MIDC notified estates and developer agreements'
      ],
      estimatedSavingText: `~₹${(stampDutyBenefitCr > 0 ? stampDutyBenefitCr : (query.investmentInrCr * 0.04 * 0.5)).toFixed(2)} Cr saved upfront on lease registration`,
      eligibilityConditions: [
        'Execution of industrial lease within notified MIDC industrial park or Section 44 NA land',
        'Fulfillment of building completion schedule within sanctioned tenure'
      ],
      documentsRequired: ['MIDC_ALLOTMENT_LETTER', 'LAND_SALE_DEED', 'PAN_CARD'],
      policyDocument: 'Notification under Section 9(a) of the Maharashtra Stamp Act, 1958',
      howToClaim: 'Present Single-Window CAF provisional allotment letter to Sub-Registrar'
    },
    {
      id: 'MH_ELECTRICITY_DUTY_WAIVER',
      code: 'MH-MEDA-ELEC-03',
      name: '100% Electricity Duty Exemption for 5–10 Years (Electricity Duty Act)',
      category: 'POWER_ENERGY',
      categoryLabel: 'Power Bill Relief',
      department: 'Energy Department & MSEDCL',
      isEligible: electricityDutyExemptionYears > 0,
      ineligibilityReason: electricityDutyExemptionYears === 0 ? 'Zone A industrial units outside thrust sectors do not receive electricity duty waiver' : undefined,
      plainEnglishSummary: '100% waiver of state electricity duty on high-tension (HT) factory power bills for 5 to 10 years after starting production.',
      benefitHighlights: [
        'Zero state electricity duty charged on monthly MSEDCL power bills',
        `Valid for ${electricityDutyExemptionYears} continuous years from Commercial Operation Date (COD)`,
        'Applicable to all contracted high-tension and low-tension industrial connections'
      ],
      estimatedSavingText: `~₹${electricityBenefitCr.toFixed(2)} Cr power duty waived over ${electricityDutyExemptionYears} years`,
      eligibilityConditions: [
        'Power connection contracted directly with MSEDCL or licensed distribution utility',
        'Eligibility Certificate issued by District Industries Centre (DIC)'
      ],
      documentsRequired: ['POWER_LOAD_CALCULATION', 'FACTORY_LICENSE'],
      policyDocument: 'Government Resolution under Maharashtra Electricity Duty Act, 2016',
      howToClaim: 'Submit DIC Eligibility Certificate directly to MSEDCL billing division'
    },
    {
      id: 'MH_POWER_TARIFF_SUBSIDY',
      code: 'MH-TARIFF-SUB-04',
      name: 'Industrial Power Tariff Subsidy (₹1.0 to ₹2.0 / unit Rebate)',
      category: 'POWER_ENERGY',
      categoryLabel: 'Energy Tariff Subsidy',
      department: 'Directorate of Industries & MSEDCL',
      isEligible: powerTariffSubsidyPerUnit > 0,
      ineligibilityReason: powerTariffSubsidyPerUnit === 0 ? 'Power tariff subsidy applies to developing and backward talukas (Zones B, C, D, D+)' : undefined,
      plainEnglishSummary: 'Direct tariff discount of ₹1.0 to ₹2.0 per unit on monthly industrial electricity bills for 3 to 5 years.',
      benefitHighlights: [
        `Direct ₹${powerTariffSubsidyPerUnit}/unit rebate credited on monthly power consumption bills`,
        `Lowers recurring energy operational overheads for ${powerTariffSubsidyYears} consecutive years`,
        'Special higher rebate of ₹2.0/unit in Vidarbha, Marathwada and North Maharashtra'
      ],
      estimatedSavingText: `~₹${powerTariffBenefitCr.toFixed(2)} Cr direct power bill deductions`,
      eligibilityConditions: [
        'Operating in notified developing or backward talukas',
        'Valid industrial HT or LT power connection without bill arrears'
      ],
      documentsRequired: ['POWER_LOAD_CALCULATION', 'MSEDCL_SANCTION_LETTER'],
      policyDocument: 'Industries Department G.R. on Industrial Tariff Concessions',
      howToClaim: 'Credit adjusted directly on monthly MSEDCL power bill invoice'
    },
    {
      id: 'MH_EV_POLICY_2021',
      code: 'MH-EV-2021-05',
      name: 'Maharashtra Electric Vehicle (EV) Policy 2021 — Pioneer & Mega Unit Incentives',
      category: 'SPECIAL_POLICY',
      categoryLabel: 'Clean Mobility & EV',
      department: 'Industries, Energy & Labour Department',
      isEligible: query.sector === 'EV_MANUFACTURING',
      ineligibilityReason: query.sector !== 'EV_MANUFACTURING' ? 'Applicable specifically to EV assembly, battery cells/packs, and charging hardware manufacturing' : undefined,
      plainEnglishSummary: 'Special incentives for electric vehicles, battery packs, motors, and charging equipment: 15% additional capital subsidy, priority MIDC allotment, and green channel approvals.',
      benefitHighlights: [
        '15% additional capital subsidy on eligible plant and machinery',
        'Priority green-channel clearance with deemed consent protection in 30 days',
        '100% stamp duty exemption across all Maharashtra zones (including Zone A/B)',
        'Priority industrial land allotment in Chakan, Talegaon, and Aurangabad clusters'
      ],
      estimatedSavingText: `~₹${(query.investmentInrCr * 0.15).toFixed(2)} Cr additional capital grant for EV manufacturing`,
      eligibilityConditions: [
        'Manufacturing 2W/3W/4W electric vehicles, battery cells, or fast chargers',
        'Commitment to green or solar power procurement'
      ],
      documentsRequired: ['PROJECT_FEASIBILITY_REPORT', 'FACTORY_LAYOUT_PLAN', 'UDYAM_CERTIFICATE'],
      policyDocument: 'Government Resolution No. EVD-2021/CR-143/IND-8',
      howToClaim: 'Tag as EV Pioneer Project in Single-Window CAF Sector Tab'
    },
    {
      id: 'MH_CMEGP_SCHEME',
      code: 'MH-CMEGP-06',
      name: 'Chief Minister Employment Generation Programme (CMEGP)',
      category: 'MSME_GRANT',
      categoryLabel: 'Direct Capital Grant',
      department: 'Directorate of Industries & KVIC / KVIB',
      isEligible: query.investmentInrCr <= 5.0,
      ineligibilityReason: query.investmentInrCr > 5.0 ? 'CMEGP is designed for Micro & Small projects with total outlay up to ₹50 Lakhs (General) / ₹5 Crores' : undefined,
      plainEnglishSummary: 'Direct non-repayable cash grant of 15% to 35% of total project setup cost for first-generation entrepreneurs and MSMEs creating local jobs.',
      benefitHighlights: [
        '15% to 35% free margin money cash grant directly funded by State Government',
        'Collateral-free bank loan coverage under CGTMSE credit guarantee',
        '5% interest subvention on bank term loan for 5 consecutive years'
      ],
      estimatedSavingText: 'Up to ₹17.5 to ₹50 Lakhs free, non-repayable capital grant',
      eligibilityConditions: [
        'First-generation entrepreneur or MSME founder in Maharashtra',
        'Age 18+ with minimum 10th standard pass for projects above ₹10 Lakhs',
        'Creation of minimum 5 to 10 local permanent factory jobs'
      ],
      documentsRequired: ['AADHAAR_CARD', 'PAN_CARD', 'PROJECT_FEASIBILITY_REPORT', 'UDYAM_CERTIFICATE'],
      policyDocument: 'Government Resolution No. CMEGP-2019/CR-120/IND-7',
      howToClaim: 'Apply online through District Task Force Committee (DTFC) single-window gateway'
    },
    {
      id: 'MH_MSME_INTEREST_SUBVENTION',
      code: 'MH-MSME-INT-07',
      name: 'Maharashtra MSME 5% Interest Subvention Scheme',
      category: 'MSME_GRANT',
      categoryLabel: 'Bank Loan Interest Relief',
      department: 'Directorate of Industries, Maharashtra',
      isEligible: query.investmentInrCr <= 50.0,
      ineligibilityReason: query.investmentInrCr > 50.0 ? 'Applicable to MSME units with investment in plant & machinery up to ₹50 Crores' : undefined,
      plainEnglishSummary: 'Government pays 5% of your bank term loan interest for 5 years for factory machinery purchase, plant expansion, or technology modernization.',
      benefitHighlights: [
        '5% effective annual interest rate reduction on bank term loans up to ₹10 Crores',
        'Disbursed directly into borrower commercial bank loan account',
        'Cuts bank debt servicing burden by up to ₹50 Lakhs annually'
      ],
      estimatedSavingText: `~₹${(Math.min(query.investmentInrCr * 0.7, 10) * 0.05 * 5).toFixed(2)} Cr interest reimbursement over 5 years`,
      eligibilityConditions: [
        'Holds valid Maharashtra Udyam Registration Certificate',
        'Term loan sanctioned by RBI-registered Commercial Bank or SIDBI',
        'Timely repayment track record without turning into Non-Performing Asset (NPA)'
      ],
      documentsRequired: ['UDYAM_CERTIFICATE', 'BANK_SANCTION_LETTER', 'CA_FCI_CERTIFICATE'],
      policyDocument: 'Government Resolution No. MSME-2020/CR-88/IND-7',
      howToClaim: 'Apply through District Industries Centre (DIC) portal module'
    },
    {
      id: 'MH_GREEN_CLEAN_TECH_SUBSIDY',
      code: 'MH-ENV-ZLD-08',
      name: 'Maharashtra Clean Technology & Zero Liquid Discharge (ZLD) Subsidy',
      category: 'GREEN_SUSTAINABILITY',
      categoryLabel: 'Environmental Subsidy',
      department: 'Environment & Climate Change Department / MPCB',
      isEligible: query.hasHazardousChemicals || query.waterRequiredKld > 10 || query.pollutionCategory === 'RED',
      ineligibilityReason: !query.hasHazardousChemicals && query.waterRequiredKld <= 10 && query.pollutionCategory !== 'RED' ? 'Applicable to industrial units with effluent generation requiring ZLD effluent plant or solar installations' : undefined,
      plainEnglishSummary: '25% capital subsidy (up to ₹1.0 Crore) for setting up Zero Liquid Discharge (ZLD) effluent treatment plants + ₹1/unit green power tariff discount for captive solar.',
      benefitHighlights: [
        '25% capital grant on advanced wastewater recovery (RO, MEE, ATFD) machinery',
        '₹1.0/unit concessional green energy tariff from MSEDCL for captive solar tie-in',
        'Fast-track Consent to Establish (CTE) processing with green corridor priority'
      ],
      estimatedSavingText: 'Up to ₹1.00 Cr capital subsidy on effluent & green equipment',
      eligibilityConditions: [
        'Installation of 100% Zero Liquid Discharge closed-loop water treatment system',
        'Rooftop captive solar grid tie-in certified by MEDA'
      ],
      documentsRequired: ['POLLUTION_UNDERTAKING', 'EFFLUENT_TREATMENT_SCHEME_DPR'],
      policyDocument: 'Maharashtra Clean Technology Policy & MPCB Circular 2021',
      howToClaim: 'Auto-verified during MPCB CTE scrutiny with subsidy released post-inspection'
    },
    {
      id: 'MH_DR_AMBEDKAR_SPECIAL_PSI',
      code: 'MH-SCST-PSI-09',
      name: 'Dr. Babasaheb Ambedkar Special PSI Scheme for SC/ST Entrepreneurs',
      category: 'SPECIAL_POLICY',
      categoryLabel: 'Affirmative Action',
      department: 'Social Justice & Special Assistance / Industries Department',
      isEligible: true,
      plainEnglishSummary: 'Special affirmative support: 20% additional capital subsidy, 20% discount on MIDC industrial land plot costs, and 100% SGST refund irrespective of taluka zone.',
      benefitHighlights: [
        '20% concession on MIDC industrial plot lease premium',
        '100% Gross SGST reimbursement even in developed Zone A and Zone B',
        '100% electricity duty exemption for the maximum 10-year term',
        'Dedicated handholding cell at Directorate of Industries'
      ],
      estimatedSavingText: '20% MIDC land discount + 100% SGST refund in any district',
      eligibilityConditions: [
        'Enterprise with ≥ 51% shareholding and control by SC/ST entrepreneurs',
        'Valid Caste & Caste Validity Certificate issued by Competent Authority of Maharashtra'
      ],
      documentsRequired: ['CASTE_CERTIFICATE', 'CASTE_VALIDITY_CERTIFICATE', 'UDYAM_CERTIFICATE'],
      policyDocument: 'Government Resolution No. PSI-2016/CR-313/IND-8',
      howToClaim: 'Select "Dr. Ambedkar Special Category" in Single-Window CAF Section 1'
    },
    {
      id: 'MH_WOMEN_ENTREPRENEUR_POLICY',
      code: 'MH-WOMEN-IND-10',
      name: 'Maharashtra Women Entrepreneur Industrial Policy (Mahila Udyojak)',
      category: 'SPECIAL_POLICY',
      categoryLabel: 'Women Entrepreneurs',
      department: 'Industries Department, Government of Maharashtra',
      isEligible: true,
      plainEnglishSummary: 'Enterprises with ≥ 51% women ownership receive +10% higher SGST reimbursement ceiling, lower power tariff, and priority plots in MIDC parks.',
      benefitHighlights: [
        '+10% additional SGST reimbursement limit on top of base taluka zone ceiling',
        '₹1.00/unit additional power tariff subsidy for 5 years',
        'Reserved industrial plots (5% quota) in all new MIDC industrial estates'
      ],
      estimatedSavingText: `+10% enhanced subsidy ceiling (~₹${(query.investmentInrCr * 0.10).toFixed(2)} Cr extra benefit)`,
      eligibilityConditions: [
        'Minimum 51% equity holding and active management by women promoters',
        'At least 30% women employment in total factory workforce'
      ],
      documentsRequired: ['PROMOTER_KYC', 'PARTNERSHIP_DEED_OR_ROC_LIST', 'UDYAM_CERTIFICATE'],
      policyDocument: 'Maharashtra Industrial Policy — Women Entrepreneurship Chapter',
      howToClaim: 'Tick "Women-Owned Enterprise" checkbox in CAF Section 1'
    },
    {
      id: 'MH_FOOD_PROCESSING_MAGNET',
      code: 'MH-AGRO-MAG-11',
      name: 'Maharashtra Food Processing & Cold Chain Scheme (MAGNET / MoFPI)',
      category: 'SPECIAL_POLICY',
      categoryLabel: 'Agro & Food Processing',
      department: 'Co-operation, Marketing & Textiles Department / Industries Dept',
      isEligible: query.sector === 'FOOD_PROCESSING',
      ineligibilityReason: query.sector !== 'FOOD_PROCESSING' ? 'Applicable specifically to Agro-processing, cold storage, and food manufacturing units' : undefined,
      plainEnglishSummary: 'Up to 35% capital subsidy for cold storage, ripening chambers, sorting/grading units, and agro-processing in notified Maharashtra fruit/vegetable clusters.',
      benefitHighlights: [
        '25% to 35% capital subsidy on food processing plant and cold chain setup',
        'Special agro-industrial power tariff concession of ₹1.5/unit',
        'Exemption from APMC market cess on direct farm produce procurement'
      ],
      estimatedSavingText: 'Up to ₹2.50 Cr capital subsidy on processing equipment',
      eligibilityConditions: [
        'Processing notified Maharashtra crops (grapes, oranges, onions, dairy, millets)',
        'FSSAI Food Safety License and verifiable backward farm linkages'
      ],
      documentsRequired: ['PROJECT_FEASIBILITY_REPORT', 'FSSAI_LICENSE', 'UDYAM_CERTIFICATE'],
      policyDocument: 'Maharashtra Agribusiness Network (MAGNET) Policy 2021',
      howToClaim: 'Select "Agro Processing MAGNET" in Single-Window CAF Sector Tab'
    }
  ];

  return {
    query,
    applicableApprovals,
    totalSlaDaysParallel,
    totalSlaDaysSequential,
    mandatoryDocumentsList,
    eligibleIncentives: {
      grossSgstReimbursementPct,
      sgstReimbursementYears,
      stampDutyExemptionPct,
      electricityDutyExemptionYears,
      powerTariffSubsidyPerUnit,
      powerTariffSubsidyYears,
      estimatedTotalBenefitCr,
      eligiblePolicyName,
    },
    matchedSchemes,
  };
}
