import { GrievanceRecord } from '@approvalos/shared';

// In-memory grievance and RTS statutory appeal store
export let DEMO_GRIEVANCES: GrievanceRecord[] = [
  {
    id: 'apl_001',
    ticketNumber: 'RTS-SEC18-PUNE-2026-081',
    applicationId: 'APOS-PUNE-MIDC-01-2026-9812',
    department: 'Maharashtra Industrial Development Corp (MIDC)',
    category: 'SLA_BREACH',
    severity: 'CRITICAL',
    title: 'Statutory 30-Day SLA Expired: Building Plan Approval Unreasonably Withheld',
    description: 'MIDC Special Planning Authority failed to issue commencement certificate within statutory 30-day timeline despite structural drawings and fire NOC clearance submitted on time.',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    targetResolutionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'HEARING_SCHEDULED',
    officerRemarks: 'Notice issued to MIDC Area Executive Engineer under RTS Act Sec 18(2). Hearing fixed before District Collector on Thursday.',
    appealTier: 'TIER_2_FIRST_APPEAL',
    statutorySection: 'SECTION_18_FIRST_APPEAL',
    appellateAuthority: 'District Collector & First Appellate Authority, Pune',
    reliefSought: 'Direction for immediate deemed Building Commencement Certificate and disciplinary scrutiny of defaulting desk.',
    hearingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    rtsOrderDetails: 'Preliminary Notice issued: Respondent officer required to produce file note and explain cause of 14-day delay.',
    appellantDetails: {
      companyName: 'Sahyadri EV Battery Systems Pvt Ltd',
      authorizedPerson: 'Mr. Vikram Deshmukh',
      pan: 'AABCS8819Q',
      phone: '+91 98220 54321',
      email: 'vikram.deshmukh@sahyadri-battery.in'
    }
  },
  {
    id: 'apl_002',
    ticketNumber: 'RTS-SEC19-MUM-2026-019',
    applicationId: 'APOS-AURIC-MPCB-01-2026-4419',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    category: 'UNREASONABLE_QUERY',
    severity: 'HIGH',
    title: 'Repeated Demands for Previously Cross-Verified Leases (Violation of Sec 3(2))',
    description: 'MPCB scrutiny desk rejected Consent to Establish application demanding fresh land possession panchnama, which was already authenticated by MIDC on DigiLocker MahaVault.',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    targetResolutionDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ORDER_PASSED',
    officerRemarks: 'State Commission passed statutory ruling: Department barred from demanding physical lease copy. Deemed clearance issued.',
    appealTier: 'TIER_3_SECOND_APPEAL',
    statutorySection: 'SECTION_19_SECOND_APPEAL',
    appellateAuthority: 'Chief Commissioner, Maharashtra State Right to Services Commission',
    reliefSought: 'Quashing of redundant query notice and enforcement of Repetitive Scrutiny Shield with deemed CTE issuance.',
    hearingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    rtsOrderDetails: 'Commission Order No. RTS/COMM/2026/419: MPCB directed to upload digitally signed CTE within 48 hours. Show-cause notice issued under Sec 19(8) for imposition of ₹2,500 penalty.',
    appellantDetails: {
      companyName: 'Vanguard Biopharma Life Sciences Pvt Ltd',
      authorizedPerson: 'Dr. Ananya Joshi',
      pan: 'AABCV4912K',
      phone: '+91 98221 65432',
      email: 'ananya.joshi@vanguardbio.in'
    }
  },
  {
    id: 'grv_001',
    ticketNumber: 'GRV-2026-8910',
    applicationId: 'APOS-NASHIK-MSEDCL-01-2026-1102',
    department: 'Maharashtra State Electricity Distribution Co. (MSEDCL)',
    category: 'SLA_BREACH',
    severity: 'HIGH',
    title: 'HT Feasibility Sanction Quotation Delayed Beyond 15-Day Limit',
    description: 'HT 22kV transformer load sanction applied 22 days ago. Field feasibility report complete but demand note not uploaded to MAITRI portal.',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    targetResolutionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ESCALATED_TO_COLLECTOR',
    officerRemarks: 'Transferred to District Single-Window Monitoring Cell for expedited demand note generation.',
    appealTier: 'TIER_1_GRIEVANCE',
    statutorySection: 'SECTION_9_COMPLAINT',
    appellateAuthority: 'MSEDCL Superintending Engineer (Nashik Rural)',
    reliefSought: 'Immediate upload of sanction letter and firmware meter quotation.',
    hearingDate: null,
    rtsOrderDetails: null,
    appellantDetails: {
      companyName: 'Godavari Valley Organics MSME',
      authorizedPerson: 'Mr. Rajesh Patil',
      pan: 'AAPPP1234F',
      phone: '+91 98222 78901',
      email: 'rajesh.patil@godavari-organics.in'
    }
  }
];

/**
 * Natural Language Processing (NLP) Grievance Auto-Categorizer
 */
export function categorizeGrievanceWithNLP(title: string, description: string): {
  category: GrievanceRecord['category'];
  severity: GrievanceRecord['severity'];
  suggestedDepartment: string;
} {
  const text = `${title} ${description}`.toLowerCase();

  let category: GrievanceRecord['category'] = 'SLA_BREACH';
  let severity: GrievanceRecord['severity'] = 'NORMAL';
  let suggestedDepartment = 'General Single Window Support';

  if (text.includes('bribe') || text.includes('harass') || text.includes('unreasonable') || text.includes('query') || text.includes('redundant')) {
    category = 'UNREASONABLE_QUERY';
    severity = 'HIGH';
  } else if (text.includes('inspect') || text.includes('visit') || text.includes('site') || text.includes('no-show')) {
    category = 'INSPECTION_DELAY';
    severity = 'NORMAL';
  } else if (text.includes('portal') || text.includes('error') || text.includes('upload') || text.includes('technical') || text.includes('bug')) {
    category = 'PORTAL_TECHNICAL';
    severity = 'NORMAL';
  } else if (text.includes('delay') || text.includes('expired') || text.includes('overdue') || text.includes('sla') || text.includes('breach')) {
    category = 'SLA_BREACH';
    severity = 'HIGH';
  }

  if (text.includes('pollution') || text.includes('mpcb') || /\b(cte|cto|etp)\b/.test(text)) {
    suggestedDepartment = 'Maharashtra Pollution Control Board (MPCB)';
  } else if (text.includes('fire') || /\bnoc\b/.test(text)) {
    suggestedDepartment = 'Maharashtra Fire Services / MIDC Fire Brigade';
  } else if (text.includes('power') || text.includes('electricity') || text.includes('msedcl') || text.includes('transformer')) {
    suggestedDepartment = 'Maharashtra State Electricity Distribution Co. (MSEDCL)';
  } else if (text.includes('land') || text.includes('allotment') || text.includes('possession') || text.includes('midc') || text.includes('building')) {
    suggestedDepartment = 'Maharashtra Industrial Development Corp (MIDC)';
  } else if (text.includes('factory') || text.includes('dish') || text.includes('safety') || text.includes('license')) {
    suggestedDepartment = 'Directorate of Industrial Safety & Health (DISH)';
  }

  return { category, severity, suggestedDepartment };
}

/**
 * Creates and registers a new citizen grievance or statutory appeal
 */
export function registerGrievance(input: {
  applicationId?: string;
  title: string;
  description: string;
  department?: string;
  appealTier?: GrievanceRecord['appealTier'];
  statutorySection?: GrievanceRecord['statutorySection'];
  appellateAuthority?: string;
  reliefSought?: string;
  appellantDetails?: GrievanceRecord['appellantDetails'];
}): GrievanceRecord {
  const nlp = categorizeGrievanceWithNLP(input.title, input.description);
  const now = new Date();
  const targetDays = input.appealTier === 'TIER_3_SECOND_APPEAL' ? 45 : input.appealTier === 'TIER_2_FIRST_APPEAL' ? 30 : 7;
  const targetDate = new Date(now.getTime() + targetDays * 24 * 60 * 60 * 1000);

  const prefix = input.appealTier === 'TIER_3_SECOND_APPEAL' 
    ? 'RTS-SEC19' 
    : input.appealTier === 'TIER_2_FIRST_APPEAL' 
    ? 'RTS-SEC18' 
    : 'GRV';

  const newRecord: GrievanceRecord = {
    id: `rts_${Date.now()}`,
    ticketNumber: `${prefix}-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    applicationId: input.applicationId || 'APOS-GEN-2026',
    department: input.department || nlp.suggestedDepartment,
    category: nlp.category,
    severity: input.appealTier ? 'CRITICAL' : nlp.severity,
    title: input.title,
    description: input.description,
    createdAt: now.toISOString(),
    targetResolutionDate: targetDate.toISOString(),
    status: input.appealTier === 'TIER_2_FIRST_APPEAL' ? 'ESCALATED_TO_COLLECTOR' : input.appealTier === 'TIER_3_SECOND_APPEAL' ? 'INVESTIGATING' : 'OPEN',
    appealTier: input.appealTier || 'TIER_1_GRIEVANCE',
    statutorySection: input.statutorySection || (input.appealTier === 'TIER_2_FIRST_APPEAL' ? 'SECTION_18_FIRST_APPEAL' : input.appealTier === 'TIER_3_SECOND_APPEAL' ? 'SECTION_19_SECOND_APPEAL' : 'SECTION_9_COMPLAINT'),
    appellateAuthority: input.appellateAuthority || (input.appealTier === 'TIER_2_FIRST_APPEAL' ? 'District Collector & First Appellate Authority' : input.appealTier === 'TIER_3_SECOND_APPEAL' ? 'Chief Commissioner, Maharashtra State RTS Commission' : 'Designated Department Officer'),
    reliefSought: input.reliefSought || 'Immediate processing and time-bound statutory clearance grant.',
    hearingDate: input.appealTier ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
    rtsOrderDetails: input.appealTier ? 'Formal legal appeal registered under Maharashtra Right to Services Rules 2016. Statutory summons issued.' : null,
    appellantDetails: input.appellantDetails || {
      companyName: 'Applicant Enterprise',
      authorizedPerson: 'Authorized Proponent',
      pan: 'AABCS8819Q'
    }
  };

  DEMO_GRIEVANCES.unshift(newRecord);
  return newRecord;
}
