export type SectorType = 
  | 'PHARMA' 
  | 'EV_MANUFACTURING' 
  | 'TEXTILES' 
  | 'CHEMICALS' 
  | 'FOOD_PROCESSING' 
  | 'RENEWABLE_ENERGY' 
  | 'ELECTRONICS';

export type StateType = 'MAHARASHTRA';

export type LandType = 
  | 'GOVT_INDUSTRIAL_PARK' 
  | 'PRIVATE_AGRICULTURAL' 
  | 'SEZ' 
  | 'BROWNFIELD_EXISTING';

export type PollutionCategory = 'RED' | 'ORANGE' | 'GREEN' | 'WHITE';

export type ApprovalCategory = 
  | 'ENVIRONMENTAL' 
  | 'LAND_BUILDING' 
  | 'UTILITIES' 
  | 'SAFETY_LABOUR' 
  | 'SECTOR_SPECIFIC';

export type LifecycleStage = 
  | 'PRE_ESTABLISHMENT' 
  | 'PRE_OPERATION' 
  | 'DURING_OPERATIONS' 
  | 'RENEWAL';

export type TalukaZone = 
  | 'ZONE_A' 
  | 'ZONE_B' 
  | 'ZONE_C' 
  | 'ZONE_D' 
  | 'ZONE_D_PLUS';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface BusinessProfile {
  id: string;
  companyName: string;
  sector: SectorType;
  state: StateType;
  district: string;
  landType: LandType;
  landAreaAcres: number;
  builtUpAreaSqMeters: number;
  investmentInrCr: number;
  powerRequiredKva: number;
  waterRequiredKld: number;
  expectedEmployees: number;
  pollutionCategory: PollutionCategory;
  isMsme: boolean;
  hazardousChemicals: boolean;
  boilerInstalled: boolean;
  effluentDischarge: boolean;
  promoterExperienceYears?: number;
  pastComplianceRecord?: 'EXEMPLARY' | 'CLEAN' | 'MINOR_ISSUES' | 'NEW_ENTRANT';
  trustScore?: number;
}

export interface ApprovalNode {
  id: string;
  code: string;
  name: string;
  department: string;
  category: ApprovalCategory;
  baseDays: number;
  varianceDays: number;
  statutoryFee: number;
  prerequisites: string[]; // Node IDs required before this approval
  documentsRequired: string[];
  riskLevel: RiskLevel;
  canAutoApprove: boolean; // Green channel eligible
  inspectionRequired: boolean;
  description: string;
  issuingAuthority: string;
  validityYears: number;
  expeditedAvailable?: boolean;
  lifecycleStage?: LifecycleStage;
}

export interface SimulationLane {
  laneIndex: number;
  stageName: string;
  approvals: ApprovalNode[];
  estimatedDays: number;
  bottleneckNodeId?: string;
}

export type StrategyKey = 
  | 'GREEDY_PARALLEL' 
  | 'CRITICAL_PATH_FIRST' 
  | 'RISK_HEDGING_CONCURRENT' 
  | 'SLACK_MAXIMIZING';

export interface AdversarialStrategy {
  strategyId: StrategyKey;
  name: string;
  tagline: string;
  description: string;
  meanDays: number;
  worstCaseDays: number; // p95 under adversarial attacks
  p10Days: number;
  p50Days: number;
  p90Days: number;
  p95Days: number;
  resilienceScore: number; // 0 - 100
  recommended: boolean;
  tradeoffs: string;
}

export interface AdversaryScenario {
  id: string;
  name: string;
  triggerEvent: string;
  delayDaysAdded: number;
  affectedApprovalId: string;
  mitigationStrategy: string;
}

export interface BottleneckAnalysis {
  nodeId: string;
  nodeName: string;
  department: string;
  impactDays: number;
  riskLevel: RiskLevel;
  reason: string;
  mitigationAction: string;
  greenChannelFeasible: boolean;
}

export interface SimulationResult {
  profileId: string;
  profileSnapshot: BusinessProfile;
  sequentialDays: number;
  optimizedDays: number;
  daysSaved: number;
  percentageSaved: number;
  totalStatutoryFee: number;
  totalApprovalsCount: number;
  parallelLanes: SimulationLane[];
  criticalPath: string[]; // Node IDs in sequence
  bottlenecks: BottleneckAnalysis[];
  strategies: AdversarialStrategy[];
  minimaxStrategy: AdversarialStrategy;
  adversaryScenarios: AdversaryScenario[];
  monteCarloIterations: number;
  distributionData: Array<{ day: number; count: number; density: number }>;
  generatedAt: string;
}

export interface WhatIfComparison {
  id: string;
  title: string;
  baseline: {
    profile: BusinessProfile;
    result: SimulationResult;
  };
  scenario: {
    profile: BusinessProfile;
    result: SimulationResult;
  };
  deltaDays: number; // negative = faster
  deltaPercentage: number;
  deltaApprovals: number;
  deltaFee: number;
  keyDifferentiators: string[];
  recommendation: string;
}

export type DocumentType = 
  | 'PAN_CARD'
  | 'AADHAAR_CARD'
  | 'GSTIN_CERTIFICATE'
  | 'LAND_SALE_DEED'
  | 'FACTORY_LAYOUT_PLAN'
  | 'PROJECT_FEASIBILITY_REPORT'
  | 'POLLUTION_UNDERTAKING'
  | 'FIRE_SAFETY_SCHEMATIC'
  | 'WATER_BALANCE_CHART'
  | 'POWER_LOAD_CALCULATION';

export interface DocumentValidationResult {
  documentType: DocumentType;
  fileName: string;
  fileSizeBytes: number;
  status: 'VALID' | 'WARNING' | 'REJECTED';
  qualityScore: number; // 0 - 100
  isBlurry: boolean;
  hasGlare: boolean;
  resolutionDpi: number;
  extractedFields: Record<string, string | number | boolean>;
  issues: Array<{
    code: string;
    message: string;
    severity: 'ERROR' | 'WARNING' | 'INFO';
  }>;
  suggestions: string[];
  verifiedAt: string;
}

export type ApplicationWorkflowStatus = 
  | 'DRAFT'
  | 'PRE_VALIDATED'
  | 'SUBMITTED'
  | 'GREEN_CHANNEL_APPROVED'
  | 'UNDER_SCRUTINY'
  | 'INSPECTION_PENDING'
  | 'QUERY_RAISED'
  | 'APPROVED'
  | 'DEEMED_APPROVED'
  | 'REJECTED';

export interface DepartmentQueryRecord {
  id: string;
  applicationId: string;
  department: string;
  officerName: string;
  queryDate: string;
  objectionText: string;
  statutoryRuleRef?: string;
  applicantResponseText?: string;
  responseDate?: string;
  attachedDocName?: string;
  status: 'PENDING' | 'RESOLVED';
}

export interface DigitalCertificateRecord {
  certificateNumber: string;
  issuedAt: string;
  issuingAuthority: string;
  department: string;
  validUntil: string;
  qrHash: string;
  digitalSignatureHash: string;
  isDeemedApproval: boolean;
  statutoryAct: string;
}

export interface CommonApplicationFormData {
  // Enterprise Details
  companyName: string;
  entityType: 'PVT_LTD' | 'PUBLIC_LTD' | 'LLP' | 'PARTNERSHIP' | 'PROPRIETORSHIP';
  pan: string;
  gstin?: string;
  udyamNumber?: string;
  authorizedPersonName: string;
  authorizedPersonPhone: string;
  authorizedPersonEmail: string;

  // Project & Land Location
  sector: SectorType;
  productDescription: string;
  projectStage: LifecycleStage | 'EXPANSION';
  midcCluster: string;
  plotNumber: string;
  landAreaAcres: number;
  builtUpAreaSqM: number;

  // Capital & Employment
  plantMachineryInvestmentCr: number;
  landBuildingInvestmentCr: number;
  totalProjectCostCr: number;
  expectedEmployees: number;
  enterpriseScale: 'MICRO' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'MEGA';

  // Utilities & Environmental
  pollutionCategory: PollutionCategory;
  powerRequiredKva: number;
  waterRequiredKld: number;
  effluentDischargeKld: number;
  treatmentScheme: 'ZERO_LIQUID_DISCHARGE' | 'CETP_DISCHARGE' | 'CLOSED_LOOP' | 'NONE';
  boilerInstalled: boolean;
  boilerCapacityTph?: number;
  hazardousChemicals: boolean;

  // Selected Approvals
  selectedApprovalIds: string[];

  // Documents
  documents: Array<{
    docType: DocumentType;
    docName: string;
    verified: boolean;
    url: string;
  }>;
}

export interface ApplicationRecord {
  id: string;
  trackingNumber: string;
  cafReferenceNumber?: string;
  profileId: string;
  companyName: string;
  approvalNodeId: string;
  approvalName: string;
  department: string;
  status: ApplicationWorkflowStatus;
  submissionDate: string;
  slaDeadline: string;
  daysRemaining: number;
  isEscalated: boolean;
  escalationLevel: 'NONE' | 'OFFICER' | 'HOD' | 'DISTRICT_COLLECTOR';
  assignedOfficerName: string;
  riskScore: number; // 0 - 100
  trustScore: number; // 0 - 100
  greenChannelEligible: boolean;
  documents: Array<{
    docType: DocumentType;
    docName: string;
    verified: boolean;
    url: string;
  }>;
  inspections?: Array<{
    scheduledDate: string;
    officerNames: string[];
    isJointInspection: boolean;
    departments: string[];
    status: 'SCHEDULED' | 'COMPLETED' | 'WAIVED';
    mode: 'PHYSICAL' | 'REMOTE_VIDEO';
  }>;
  queries?: DepartmentQueryRecord[];
  queryNotes?: string[];
  certificate?: DigitalCertificateRecord;
  cafSummary?: {
    midcCluster: string;
    plotNumber: string;
    totalProjectCostCr: number;
    powerKva: number;
    waterKld: number;
    pollutionCategory: PollutionCategory;
  };
  timeline: Array<{
    timestamp: string;
    event: string;
    performedBy: string;
    status: string;
  }>;
}

export interface IncentiveScheme {
  id: string;
  code: string;
  name: string;
  ministryOrState: string;
  category: 'CENTRAL_PLI' | 'STATE_CAPITAL_SUBSIDY' | 'STAMP_DUTY_REIMBURSEMENT' | 'GREEN_ENERGY_REBATE' | 'MSME_INTEREST_SUBVENTION';
  description: string;
  minInvestmentCr: number;
  maxSubsidyInr: number;
  matchScore: number; // 0 - 100
  estimatedBenefitInr: number;
  disbursementMode: 'FRONT_LOADED' | 'MILESTONE_BASED' | 'ANNUAL_REBATE';
  qualifyingFactors: string[];
  documentsRequired: string[];
}

export interface GrievanceRecord {
  id: string;
  ticketNumber: string;
  applicationId: string;
  department: string;
  category: 'SLA_BREACH' | 'UNREASONABLE_QUERY' | 'PORTAL_TECHNICAL' | 'INSPECTION_DELAY';
  severity: 'HIGH' | 'CRITICAL' | 'NORMAL';
  title: string;
  description: string;
  createdAt: string;
  targetResolutionDate: string;
  status: 'OPEN' | 'INVESTIGATING' | 'ESCALATED_TO_COLLECTOR' | 'HEARING_SCHEDULED' | 'ORDER_PASSED' | 'RESOLVED';
  officerRemarks?: string;

  // Maharashtra RTS Act 2015 Statutory Appeal Fields
  appealTier?: 'TIER_1_GRIEVANCE' | 'TIER_2_FIRST_APPEAL' | 'TIER_3_SECOND_APPEAL';
  statutorySection?: 'SECTION_9_COMPLAINT' | 'SECTION_18_FIRST_APPEAL' | 'SECTION_19_SECOND_APPEAL';
  appellateAuthority?: string;
  reliefSought?: string;
  hearingDate?: string | null;
  rtsOrderDetails?: string | null;
  appellantDetails?: {
    companyName: string;
    authorizedPerson: string;
    pan: string;
    phone?: string;
    email?: string;
  };
}

export interface ComplianceCalendarItem {
  id: string;
  approvalId: string;
  approvalName: string;
  department: string;
  renewalDueDate: string;
  daysToExpiry: number;
  status: 'HEALTHY' | 'UPCOMING_RENEWAL' | 'CRITICAL_WINDOW' | 'EXPIRED';
  frequency: 'ANNUAL' | 'TRIENNIAL' | 'FIVE_YEAR' | 'ONE_TIME';
  autoRenewEligible: boolean;
  lastAuditedDate: string;
}

export interface KyaQuery {
  sector: SectorType;
  locationType: 'MIDC_ESTATE' | 'PRIVATE_AGRICULTURAL_NA' | 'MUNICIPAL_CORP' | 'CRZ_COASTAL';
  midcCluster?: string;
  talukaZone: TalukaZone;
  investmentInrCr: number;
  stage: LifecycleStage;
  powerRequiredKva: number;
  waterRequiredKld: number;
  pollutionCategory: PollutionCategory;
  hasBoiler: boolean;
  hasHazardousChemicals: boolean;
  isMsme: boolean;
}

export interface KyaApprovalItem {
  id: string;
  code: string;
  name: string;
  department: string;
  statutoryAct: string;
  slaDays: number;
  mandatoryDocuments: string[];
  lifecycleStage: LifecycleStage;
  riskLevel: RiskLevel;
  description: string;
}

export interface KyaResult {
  query: KyaQuery;
  applicableApprovals: KyaApprovalItem[];
  totalSlaDaysParallel: number;
  totalSlaDaysSequential: number;
  mandatoryDocumentsList: Array<{
    code: string;
    name: string;
    issuingSource: string;
    description: string;
    requiredForApprovals: string[];
  }>;
  eligibleIncentives: {
    grossSgstReimbursementPct: number;
    sgstReimbursementYears: number;
    stampDutyExemptionPct: number;
    electricityDutyExemptionYears: number;
    powerTariffSubsidyPerUnit: number;
    powerTariffSubsidyYears: number;
    estimatedTotalBenefitCr: number;
    eligiblePolicyName: string;
  };
  matchedSchemes: KyaSchemeDetail[];
}

export interface KyaSchemeDetail {
  id: string;
  code: string;
  name: string;
  category: 'TAX_REIMBURSEMENT' | 'STAMP_DUTY' | 'POWER_ENERGY' | 'MSME_GRANT' | 'SPECIAL_POLICY' | 'GREEN_SUSTAINABILITY';
  categoryLabel: string;
  department: string;
  isEligible: boolean;
  ineligibilityReason?: string;
  plainEnglishSummary: string;
  benefitHighlights: string[];
  estimatedSavingText: string;
  eligibilityConditions: string[];
  documentsRequired: string[];
  policyDocument: string;
  howToClaim: string;
}

export interface StatutoryReturnRecord {
  id: string;
  code: string; // 'FORM_V' | 'FORM_4' | 'FORM_27' | 'FORM_B'
  title: string;
  department: string;
  governingAct: string;
  frequency: 'ANNUAL' | 'HALF_YEARLY' | 'QUARTERLY';
  statutoryDueDate: string; // e.g. '30 Sep'
  daysRemaining: number;
  status: 'PENDING_FILING' | 'SUBMITTED' | 'OVERDUE';
  lastSubmittedDate?: string;
  acknowledgmentHash?: string;
}

export interface PreScrutinyAuditResult {
  completenessScore: number; // 0 - 100
  isReadyForDispatch: boolean;
  totalChecks: number;
  passedChecks: number;
  findings: Array<{
    category: 'MANDATORY_FIELD' | 'STATUTORY_DOCUMENT' | 'TECHNICAL_THRESHOLD' | 'ENVIRONMENTAL_SAFEGUARD';
    label: string;
    passed: boolean;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    message: string;
  }>;
}

export interface CrossDepartmentVerificationRecord {
  documentId: string;
  documentType: DocumentType;
  documentName: string;
  firstVerifiedByDepartment: string;
  verifiedAt: string;
  crossAcceptedByDepartments: string[];
  legalShieldCitation: string; // e.g. 'RTS Act 2015 Section 3(2) & MAITRI Single Window Resolution'
}
