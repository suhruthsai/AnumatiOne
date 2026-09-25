/**
 * Official Maharashtra Statutory Acts, Rules, and Industrial Schemes Registry
 * Models the complete regulatory and policy architecture of MAITRI 2.0 (Single Window, GoM)
 */

export interface MaharashtraActDetail {
  id: string;
  name: string;
  shortName: string;
  enactedYear: number;
  governingRules: string;
  keySections: string;
  department: string;
  issuingAuthority: string;
  rtsSlaDays: number;
  appliesToApprovals: string[]; // ApprovalNode IDs
  statutoryMandate: string;
  complianceRules: string[];
}

export interface MaharashtraSchemeDetail {
  id: string;
  name: string;
  code: string;
  department: string;
  policyDocument: string;
  category: string;
  description: string;
  benefitHighlights: string;
  linkedApprovals: string[]; // ApprovalNode IDs where this incentive applies
  eligibilityConditions: string[];
  documentsRequired: string[];
}

export const MAHARASHTRA_STATUTORY_ACTS: MaharashtraActDetail[] = [
  {
    id: 'RTS_ACT_2015',
    name: 'Maharashtra Right to Public Services Act, 2015',
    shortName: 'Maharashtra RTS Act 2015',
    enactedYear: 2015,
    governingRules: 'Maharashtra Right to Public Services Rules, 2016',
    keySections: 'Section 3 (Notification of Services), Section 4(1) (Deemed Approval), Section 8 & 9 (Appeals & Penalties)',
    department: 'General Administration Department (GAD), Government of Maharashtra',
    issuingAuthority: 'Maharashtra State Right to Services Commission / Designated First Appellate Authority',
    rtsSlaDays: 30,
    appliesToApprovals: ['LAND_ALLOTMENT', 'EIA_EC', 'CTE_POLLUTION', 'POWER_SANCTION', 'WATER_SANCTION', 'BUILDING_PLAN', 'FIRE_NOC', 'FACTORY_LICENSE', 'BOILER_REGISTRATION', 'PESO_EXPLOSIVES', 'CTO_POLLUTION'],
    statutoryMandate: 'Guarantees transparent, time-bound delivery of notified industrial approvals. Mandates statutory deemed clearance if designated officers fail to decide within SLA limits.',
    complianceRules: [
      'Every industrial service has a legally binding statutory delivery timeline (SLA).',
      'If an officer raises no query within the SLA, the applicant has deemed statutory clearance under Section 4(1).',
      'Officers face financial penalties up to ₹5,000 for unjustified delay or redundant query loops.',
    ],
  },
  {
    id: 'MIDC_ACT_1961',
    name: 'Maharashtra Industrial Development Act, 1961 & MIDC DCR 2009',
    shortName: 'MIDC Act 1961 & DCR 2009',
    enactedYear: 1961,
    governingRules: 'MIDC Development Control Regulations (DCR) 2009 & Land Disposal Regulations',
    keySections: 'Section 14 (Functions of Corporation), Section 32 (Land Acquisition), DCR Rule 14.1 (Setbacks & FSI)',
    department: 'Maharashtra Industrial Development Corporation (MIDC) & Special Planning Authority',
    issuingAuthority: 'Chief Executive Officer (CEO) / Regional Officer / Special Planning Authority (SPA), MIDC',
    rtsSlaDays: 18,
    appliesToApprovals: ['LAND_ALLOTMENT', 'BUILDING_PLAN', 'WATER_SANCTION'],
    statutoryMandate: 'Establishes notified industrial estates with deemed Non-Agricultural (NA) zoning, infrastructure trunk grids, and building plan approvals.',
    complianceRules: [
      'Deemed NA zoning: Industrial plots in notified MIDC zones do not require separate Collector conversion under MLRC 1966.',
      'Mandatory 12-meter peripheral fire driveway for industrial trailers and tankers.',
      'Maximum permissible FSI/FAR strictly governed by industrial sector and plot coverage limits.',
    ],
  },
  {
    id: 'WATER_AIR_ACTS',
    name: 'Water (Prevention & Control of Pollution) Act 1974 & Air Act 1981',
    shortName: 'Water Act 1974 & Air Act 1981',
    enactedYear: 1974,
    governingRules: 'Maharashtra Water & Air Pollution Control Rules & Hazardous Waste Rules 2016',
    keySections: 'Section 25/26 (Water Act - Consent to Establish/Operate), Section 21 (Air Act - Chimney/Stack Control)',
    department: 'Maharashtra Pollution Control Board (MPCB), Environment Dept, GoM',
    issuingAuthority: 'Member Secretary / Regional Officer, MPCB',
    rtsSlaDays: 28,
    appliesToApprovals: ['CTE_POLLUTION', 'CTO_POLLUTION'],
    statutoryMandate: 'Prevents environmental contamination via mandatory prior consent before plant construction (CTE) and prior to manufacturing operations (CTO).',
    complianceRules: [
      'Zero Liquid Discharge (ZLD) or certified Effluent Treatment Plant (ETP) meeting state discharge norms.',
      'Continuous Online Emission Monitoring System (OCEMS) connected live to Central MPCB & CPCB servers.',
      'Chimney stack height determined strictly via stoichiometric sulfur/particulate dispersion modeling.',
    ],
  },
  {
    id: 'EPA_EIA_2006',
    name: 'Environment (Protection) Act, 1986 & MoEFCC EIA Notification 2006',
    shortName: 'Environment Protection Act 1986 & EIA 2006',
    enactedYear: 1986,
    governingRules: 'EIA Notification 2006 (as amended) & State Environmental Rules',
    keySections: 'Section 3 & 5 (Powers of Central Govt), Schedule Item 5(f)/5(g) (Chemical/Pharma/Heavy Industrial Appraisal)',
    department: 'State Environment Impact Assessment Authority (SEIAA) Maharashtra / MoEFCC',
    issuingAuthority: 'Member Secretary, SEIAA Maharashtra',
    rtsSlaDays: 65,
    appliesToApprovals: ['EIA_EC'],
    statutoryMandate: 'Comprehensive baseline environmental assessment and public consultation for heavy, chemical, pharma, or red-category mega industries.',
    complianceRules: [
      'Comprehensive Environmental Impact Assessment (EIA) conducted by NABET-accredited environmental consultant.',
      'Public hearing organized by District Collector and MPCB unless situated inside pre-notified industrial zones.',
      'Six-monthly compliance reporting and mandatory Corporate Environmental Responsibility (CER) earmarking.',
    ],
  },
  {
    id: 'FACTORIES_ACT_1948',
    name: 'Factories Act, 1948 & Maharashtra Factories Rules, 1963',
    shortName: 'Factories Act 1948 & MH Rules 1963',
    enactedYear: 1948,
    governingRules: 'Maharashtra Factories Rules 1963 (amended 2024)',
    keySections: 'Section 6 (Plan Approval & Licensing), Section 21 (Machinery Guarding), Section 45 (First Aid/Welfare)',
    department: 'Directorate of Industrial Safety & Health (DISH), Labour Dept, GoM',
    issuingAuthority: 'Joint Director / Additional Director, DISH Maharashtra',
    rtsSlaDays: 20,
    appliesToApprovals: ['FACTORY_LICENSE'],
    statutoryMandate: 'Safeguards occupational health, mechanical safety, internal factory ventilation, and statutory worker welfare provisions.',
    complianceRules: [
      'Form No. 1 site plan approval verifying machinery layouts, passage widths, and emergency exits before machine placement.',
      'Mandatory mechanical guarding on all moving equipment, drives, and rotating shafts.',
      'Mandatory annual health surveillance for high-risk workers and creche/canteen amenities per employee count.',
    ],
  },
  {
    id: 'FIRE_ACT_2006',
    name: 'Maharashtra Fire Prevention & Life Safety Measures Act, 2006',
    shortName: 'Maharashtra Fire Prevention Act 2006',
    enactedYear: 2006,
    governingRules: 'Maharashtra Fire Prevention Rules 2007 & Amendment Act 2023',
    keySections: 'Section 3 (Fire Safety Compliance), Section 9 (Licensing of Fire Agencies), National Building Code (NBC) 2016',
    department: 'Directorate of Maharashtra Fire Services / MIDC Fire Brigade',
    issuingAuthority: 'Chief Fire Officer (CFO), MIDC Fire Service / Directorate of Fire Services',
    rtsSlaDays: 15,
    appliesToApprovals: ['FIRE_NOC'],
    statutoryMandate: 'Enforces life safety, emergency evacuation design, industrial hydrant networks, and automatic sprinkler coverage.',
    complianceRules: [
      'Internal and external fire hydrant ring mains with independent diesel backup fire booster pumps.',
      'Dedicated static water storage tanks sized per industrial hazard category (Light, Ordinary, or High Hazard).',
      'Mandatory bi-annual Form B maintenance certificate issued by Government Licensed Fire Agency.',
    ],
  },
  {
    id: 'ELECTRICITY_ACT_2003',
    name: 'Electricity Act, 2003 & Maharashtra Electricity Regulatory Commission (MERC)',
    shortName: 'Electricity Act 2003 & MERC Regulations',
    enactedYear: 2003,
    governingRules: 'MERC (Electricity Supply Code and Standards of Performance) Regulations',
    keySections: 'Section 43 (Duty to Supply on Request), Section 45 (Power Tariffs), Section 53 (Safety & Technical Standards)',
    department: 'Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL / Mahavitaran)',
    issuingAuthority: 'Superintending Engineer (SE), Technical & Commercial Wing, MSEDCL',
    rtsSlaDays: 18,
    appliesToApprovals: ['POWER_SANCTION'],
    statutoryMandate: 'Governs high-tension (HT) industrial feeder line feasibility, sub-station transformer sanctions, and reliable bulk power delivery.',
    complianceRules: [
      'Dedicated 11kV / 22kV / 33kV express feeder sanction for industrial contract demand exceeding 1,000 kVA.',
      'Electrical installation vetted and cleared by Chief Electrical Inspector (CEI) to Government of Maharashtra.',
      'Power factor maintained above 0.95 with automated capacitor banks to avoid MERC penalty surcharge.',
    ],
  },
  {
    id: 'BOILER_REGULATIONS_1950',
    name: 'Indian Boilers Act, 1923 & Indian Boiler Regulations (IBR 1950)',
    shortName: 'Indian Boiler Regulations 1950',
    enactedYear: 1950,
    governingRules: 'Maharashtra Boiler Rules 1962 & Central Boiler Board Standards',
    keySections: 'Section 7 (Registration of Boilers), Section 8 (Renewal of Certificate), Regulation 376 (Hydraulic Tests)',
    department: 'Directorate of Steam Boilers, Government of Maharashtra',
    issuingAuthority: 'Director of Steam Boilers, Maharashtra',
    rtsSlaDays: 14,
    appliesToApprovals: ['BOILER_REGISTRATION'],
    statutoryMandate: 'Ensures pressurized steam equipment, economizers, and steam pipelines undergo rigorous metallurgical inspection to prevent industrial explosions.',
    complianceRules: [
      'Mandatory pre-commissioning hydraulic pressure test witnessed by designated Boiler Inspector.',
      'Steam piping layout designed with certified IBR-grade materials and certified high-pressure welders.',
      'Certified Boiler Attendant / Engineer stationed on-site for continuous operational monitoring.',
    ],
  },
  {
    id: 'PETROLEUM_RULES_2002',
    name: 'Petroleum Act, 1934 & Petroleum Rules, 2002',
    shortName: 'Petroleum Rules 2002 (PESO)',
    enactedYear: 2002,
    governingRules: 'Static & Mobile Pressure Vessels (SMPV) Rules & Gas Cylinder Rules',
    keySections: 'Rule 116 (Storage Licensing), Rule 125 (Safety Distance / Isolation Distances)',
    department: 'Petroleum and Explosives Safety Organisation (PESO), Ministry of Commerce & Industry, GoI',
    issuingAuthority: 'Joint Chief Controller of Explosives (Jt CCOE), West Circle, Navi Mumbai',
    rtsSlaDays: 32,
    appliesToApprovals: ['PESO_EXPLOSIVES'],
    statutoryMandate: 'Regulates hazardous chemicals, bulk hydrocarbons, flammable solvent farms, and pressurized gas installations.',
    complianceRules: [
      'Strict safety boundary clearance / isolation distances demarcated from property line and public roads.',
      'Flame-proof electrical fittings (Ex-d rated) throughout the hazardous storage containment dike.',
      'Comprehensive on-site emergency disaster management and foam firefighting sprinkler installations.',
    ],
  },
];

export const MAHARASHTRA_STATE_SCHEMES: MaharashtraSchemeDetail[] = [
  {
    id: 'MAHARASHTRA_PSI_IPS',
    code: 'MH-PSI-IPS-01',
    name: 'Package Scheme of Incentives (PSI 2019 / 2024) — SGST Industrial Promotion Subsidy (IPS)',
    department: 'Industries Department, Government of Maharashtra',
    policyDocument: 'Government Resolution No. PSI-2019/CR-46/IND-8',
    category: 'State Capital & Tax Subsidy',
    description: 'Reimbursement of 60% to 100% of eligible State GST (SGST) paid on intra-state sales for 7 to 10 years, capped at eligible Fixed Capital Investment.',
    benefitHighlights: 'Up to 100% SGST Reimbursement for 7–10 Years (Eligible for ₹25 Cr+ capital relief)',
    linkedApprovals: ['LAND_ALLOTMENT', 'CTE_POLLUTION', 'CTO_POLLUTION'],
    eligibilityConditions: [
      'Manufacturing unit located in Maharashtra (classified in B, C, D, D+ or No Industry Districts).',
      'Minimum eligible Fixed Capital Investment (FCI) of ₹10 Crores for Large/Mega Units.',
      'At least 50% of total workforce recruited from Maharashtra domiciled residents.',
    ],
    documentsRequired: ['PROJECT_FEASIBILITY_REPORT', 'LAND_SALE_DEED', 'GSTIN_CERTIFICATE', 'CHARTERED_ACCOUNTANT_FCI_CERT'],
  },
  {
    id: 'MAHARASHTRA_EV_POLICY_2021',
    code: 'MH-EV-2021-02',
    name: 'Maharashtra Electric Vehicle (EV) Policy 2021 — Pioneer & Mega Manufacturing Incentives',
    department: 'Industries, Energy & Labour Department, Government of Maharashtra',
    policyDocument: 'Government Resolution No. EVD-2021/CR-143/IND-8',
    category: 'Clean Mobility & Sector Specific',
    description: 'Special capital subsidies and accelerated fiscal incentives for EV assembly, battery cells/packs, EV drivetrains, and charging station manufacturing.',
    benefitHighlights: 'Pioneer Mega Unit Status: 15% Additional Capital Subsidy + Priority Land Allotment in Chakan/Aurangabad',
    linkedApprovals: ['LAND_ALLOTMENT', 'BUILDING_PLAN', 'POWER_SANCTION'],
    eligibilityConditions: [
      'Manufacturing Electric 2W/3W/4W, EV powertrains, battery cells, or battery swapping equipment.',
      'Facility located within notified Maharashtra auto/EV clusters (Pune-Chakan, Talegaon, Aurangabad, or Nagpur).',
      'Commitment to continuous green operations with captive or green open-access power.',
    ],
    documentsRequired: ['PROJECT_FEASIBILITY_REPORT', 'FACTORY_LAYOUT_PLAN', 'POWER_LOAD_CALCULATION'],
  },
  {
    id: 'MAHARASHTRA_STAMP_DUTY',
    code: 'MH-REV-STAMP-03',
    name: '100% Stamp Duty Exemption on MIDC Industrial Leases (Bombay Stamp Act)',
    department: 'Revenue and Forest Department, Government of Maharashtra',
    policyDocument: 'Notification under Section 9(a) of the Maharashtra Stamp Act, 1958',
    category: 'Fiscal Exemption',
    description: 'Full 100% exemption from payment of stamp duty on execution of lease deeds, sub-leases, or mortgage deeds for industrial land inside MIDC estates.',
    benefitHighlights: '100% Waiver on Stamp Duty & Surcharge on 95-Year MIDC Registered Lease Deed',
    linkedApprovals: ['LAND_ALLOTMENT'],
    eligibilityConditions: [
      'Executed for new industrial manufacturing setup within notified MIDC industrial area or Special Economic Zone (SEZ).',
      'Valid MIDC Offer Letter and registered provisional agreement in place.',
      'Compliance with MIDC building completion schedule (development within 3 years).',
    ],
    documentsRequired: ['LAND_SALE_DEED', 'GSTIN_CERTIFICATE', 'PAN_CARD'],
  },
  {
    id: 'MAHARASHTRA_ELECTRICITY_DUTY',
    code: 'MH-MEDA-ELEC-04',
    name: 'Electricity Duty Exemption for 7–10 Years (Maharashtra Electricity Duty Act)',
    department: 'Energy Department & Industries Dept, Government of Maharashtra',
    policyDocument: 'Government Resolution under Maharashtra Electricity Duty Act, 2016',
    category: 'Utility & Energy Rebate',
    description: '100% waiver of state electricity duty on high-tension (HT) power consumption for a duration of 7 to 10 years from the date of commercial production.',
    benefitHighlights: 'Zero State Electricity Duty for up to 10 Years on MSEDCL HT Industrial Feeder',
    linkedApprovals: ['POWER_SANCTION', 'CTO_POLLUTION'],
    eligibilityConditions: [
      'Contract demand contracted directly with MSEDCL (Mahavitaran) or licensed distribution utility.',
      'New industrial investment registered under Package Scheme of Incentives (PSI).',
      'Commercial production commenced within statutory validity period.',
    ],
    documentsRequired: ['POWER_LOAD_CALCULATION', 'FACTORY_LAYOUT_PLAN'],
  },
  {
    id: 'MAHARASHTRA_CMEGP',
    code: 'MH-CMEGP-05',
    name: 'Chief Minister Employment Generation Programme (CMEGP)',
    department: 'Directorate of Industries, Maharashtra / KVIC & KVIB',
    policyDocument: 'Government Resolution No. CMEGP-2019/CR-120/IND-7',
    category: 'Employment & Capital Assistance',
    description: 'Margin money subsidy ranging from 15% to 35% of total project cost for establishing micro, small, and medium manufacturing projects generating local employment.',
    benefitHighlights: '15% to 35% Margin Money Capital Assistance + Priority Bank Loan Guarantee',
    linkedApprovals: ['FACTORY_LICENSE', 'LAND_ALLOTMENT'],
    eligibilityConditions: [
      'First-generation entrepreneur, proprietary concern, LLP, or Pvt Ltd manufacturing unit in Maharashtra.',
      'Project cost up to ₹50 Lakhs (Micro/Small) or eligible MSME scale.',
      'Mandatory creation of permanent local direct jobs within the industrial unit.',
    ],
    documentsRequired: ['AADHAAR_CARD', 'PAN_CARD', 'PROJECT_FEASIBILITY_REPORT', 'GSTIN_CERTIFICATE'],
  },
  {
    id: 'MAHARASHTRA_MSME_INTEREST_SUBVENTION',
    code: 'MH-MSME-INT-06',
    name: 'Maharashtra MSME 5% Interest Subvention Scheme',
    department: 'Directorate of Industries, Government of Maharashtra',
    policyDocument: 'Government Resolution No. MSME-2020/CR-88/IND-7',
    category: 'Credit & Technology Upgradation',
    description: '5% interest rate subsidy on term loans obtained from Scheduled Commercial Banks for plant modernization, zero-defect certification, and green manufacturing.',
    benefitHighlights: '5% Interest Subsidy on Term Loans up to ₹10 Crores for Advanced Manufacturing',
    linkedApprovals: ['FACTORY_LICENSE', 'CTE_POLLUTION'],
    eligibilityConditions: [
      'Holds valid Udyam Registration Certificate in Maharashtra.',
      'Term loan sanctioned by RBI-registered Commercial Bank or Maharashtra State Finance Corp (MSFC).',
      'Timely repayment track record without turning into Non-Performing Asset (NPA).',
    ],
    documentsRequired: ['GSTIN_CERTIFICATE', 'PAN_CARD', 'PROJECT_FEASIBILITY_REPORT'],
  },
];

/**
 * Returns the exact Maharashtra Statutory Act governing a given approval node
 */
export function getGoverningActForApproval(approvalId: string): MaharashtraActDetail | undefined {
  return MAHARASHTRA_STATUTORY_ACTS.find(act => act.appliesToApprovals.includes(approvalId));
}

/**
 * Returns all Maharashtra Industrial Incentive Schemes applicable to a given approval node
 */
export function getLinkedSchemesForApproval(approvalId: string): MaharashtraSchemeDetail[] {
  return MAHARASHTRA_STATE_SCHEMES.filter(scheme => scheme.linkedApprovals.includes(approvalId));
}
