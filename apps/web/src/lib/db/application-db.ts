import fs from 'fs';
import path from 'path';
import { 
  ApplicationRecord, 
  CommonApplicationFormData, 
  DepartmentQueryRecord, 
  DigitalCertificateRecord,
  ApplicationWorkflowStatus,
  DocumentType
} from '@approvalos/shared';
import { MASTER_APPROVALS } from '@/lib/knowledge-engine/regulatory-graph';
import { getGoverningActForApproval } from '@/lib/knowledge-engine/maharashtra-governance';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'applications-db.json');

/**
 * Initial Seed Dataset with Authentic Maharashtra Industrial Applications
 */
const SEED_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app_101',
    trackingNumber: 'APOS-ENV02-882194',
    cafReferenceNumber: 'MH-CAF-2026-004812',
    profileId: 'profile_ev_pune',
    companyName: 'Apex Lithium & Battery Packs Pvt Ltd',
    approvalNodeId: 'CTE_POLLUTION',
    approvalName: 'Consent to Establish (CTE) - MPCB',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    status: 'GREEN_CHANNEL_APPROVED',
    submissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    daysRemaining: 25,
    isEscalated: false,
    escalationLevel: 'NONE',
    assignedOfficerName: 'ApprovalOS Green-Channel AI Daemon',
    riskScore: 12,
    trustScore: 88,
    greenChannelEligible: true,
    cafSummary: {
      midcCluster: 'MIDC Chakan Phase II, Pune',
      plotNumber: 'Plot E-42/1',
      totalProjectCostCr: 45,
      powerKva: 1500,
      waterKld: 40,
      pollutionCategory: 'ORANGE',
    },
    documents: [
      { docType: 'LAND_SALE_DEED', docName: 'MIDC_Chakan_Allotment_Deed.pdf', verified: true, url: '#' },
      { docType: 'FACTORY_LAYOUT_PLAN', docName: 'EV_Assembly_Architect_Plan.pdf', verified: true, url: '#' },
      { docType: 'POLLUTION_UNDERTAKING', docName: 'Zero_Liquid_Discharge_Schematic.pdf', verified: true, url: '#' },
    ],
    certificate: {
      certificateNumber: 'MPCB/RO-PUNE/CTE/2026/0481',
      issuedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      issuingAuthority: 'Regional Officer, MPCB Pune',
      department: 'Maharashtra Pollution Control Board',
      validUntil: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      qrHash: 'mh.mpcb.verify.cte.2026.0481.apex-lithium',
      digitalSignatureHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      isDeemedApproval: false,
      statutoryAct: 'Water Act 1974 Sec. 25 & Air Act 1981 Sec. 21',
    },
    timeline: [
      {
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Instant Green-Channel Auto-Approval Granted (Trust Score 88)',
        performedBy: 'ApprovalOS Autonomous AI Daemon',
        status: 'GREEN_CHANNEL_APPROVED',
      },
    ],
  },
  {
    id: 'app_102',
    trackingNumber: 'APOS-SAF01-491023',
    cafReferenceNumber: 'MH-CAF-2026-004812',
    profileId: 'profile_ev_pune',
    companyName: 'Apex Lithium & Battery Packs Pvt Ltd',
    approvalNodeId: 'FIRE_NOC',
    approvalName: 'Maharashtra Fire Services Provisional NOC',
    department: 'Maharashtra Fire Services / MIDC Fire Brigade',
    status: 'INSPECTION_PENDING',
    submissionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    daysRemaining: 9,
    isEscalated: false,
    escalationLevel: 'NONE',
    assignedOfficerName: 'Chief Fire Officer, MIDC Pune Division',
    riskScore: 25,
    trustScore: 88,
    greenChannelEligible: false,
    cafSummary: {
      midcCluster: 'MIDC Chakan Phase II, Pune',
      plotNumber: 'Plot E-42/1',
      totalProjectCostCr: 45,
      powerKva: 1500,
      waterKld: 40,
      pollutionCategory: 'ORANGE',
    },
    documents: [
      { docType: 'FACTORY_LAYOUT_PLAN', docName: 'Fire_Hydrant_Evacuation_Map.pdf', verified: true, url: '#' },
      { docType: 'FIRE_SAFETY_SCHEMATIC', docName: 'Emergency_Escape_Staircases.pdf', verified: true, url: '#' },
    ],
    inspections: [
      {
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        officerNames: ['Capt. R. K. Nair (CFO)', 'Er. M. K. Chudasama (DISH)'],
        isJointInspection: true,
        departments: ['State Fire Services', 'Directorate of Industrial Safety (DISH)'],
        status: 'SCHEDULED',
        mode: 'PHYSICAL',
      },
    ],
    timeline: [
      {
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Common Application Form Dossier Submitted & Pre-Validated',
        performedBy: 'Applicant',
        status: 'SUBMITTED',
      },
      {
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Joint Multi-Department Site Inspection Slotted',
        performedBy: 'ApprovalOS Joint Scheduler',
        status: 'INSPECTION_PENDING',
      },
    ],
  },
  {
    id: 'app_103',
    trackingNumber: 'APOS-BLD01-771920',
    cafReferenceNumber: 'MH-CAF-2026-004812',
    profileId: 'profile_ev_pune',
    companyName: 'Apex Lithium & Battery Packs Pvt Ltd',
    approvalNodeId: 'BUILDING_PLAN',
    approvalName: 'MIDC Building Plan Approval & Commencement Certificate',
    department: 'MIDC Special Planning Authority',
    status: 'QUERY_RAISED',
    submissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    daysRemaining: 20,
    isEscalated: false,
    escalationLevel: 'NONE',
    assignedOfficerName: 'Er. Sandeep Patil, Executive Engineer (SPA)',
    riskScore: 35,
    trustScore: 88,
    greenChannelEligible: false,
    cafSummary: {
      midcCluster: 'MIDC Chakan Phase II, Pune',
      plotNumber: 'Plot E-42/1',
      totalProjectCostCr: 45,
      powerKva: 1500,
      waterKld: 40,
      pollutionCategory: 'ORANGE',
    },
    documents: [
      { docType: 'FACTORY_LAYOUT_PLAN', docName: 'Chakan_Architectural_Floor_Plan.dwg', verified: true, url: '#' },
      { docType: 'PROJECT_FEASIBILITY_REPORT', docName: 'Structural_Stability_Certificate.pdf', verified: true, url: '#' },
    ],
    queries: [
      {
        id: 'qry_101',
        applicationId: 'app_103',
        department: 'MIDC Special Planning Authority',
        officerName: 'Er. Sandeep Patil',
        queryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        objectionText: 'Under Rule 14.1 of MIDC DCR 2009, heavy industrial plots exceeding 10,000 sq.m require minimum 6.0m rear marginal setback for fire tender turning radius. Drawing shows 4.5m.',
        statutoryRuleRef: 'MIDC Development Control Regulations 2009 Rule 14.1',
        status: 'PENDING',
      },
    ],
    queryNotes: [
      'Under Rule 14.1 of MIDC DCR 2009, heavy industrial plots exceeding 10,000 sq.m require minimum 6.0m rear marginal setback for fire tender turning radius. Drawing shows 4.5m.',
    ],
    timeline: [
      {
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Architectural Blueprint Submitted',
        performedBy: 'Applicant',
        status: 'SUBMITTED',
      },
      {
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Scrutiny Query Raised by MIDC SPA regarding Rule 14.1 setback',
        performedBy: 'Er. Sandeep Patil',
        status: 'QUERY_RAISED',
      },
    ],
  },
  {
    id: 'app_104',
    trackingNumber: 'APOS-UTL01-992019',
    cafReferenceNumber: 'MH-CAF-2026-004812',
    profileId: 'profile_ev_pune',
    companyName: 'Apex Lithium & Battery Packs Pvt Ltd',
    approvalNodeId: 'POWER_SANCTION',
    approvalName: 'HT Power Feasibility & Sanction (1.5 MVA)',
    department: 'MSEDCL (State DISCOM)',
    status: 'UNDER_SCRUTINY',
    submissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    daysRemaining: 10,
    isEscalated: false,
    escalationLevel: 'NONE',
    assignedOfficerName: 'Er. P. B. Kadam, Executive Engineer MSEDCL',
    riskScore: 20,
    trustScore: 88,
    greenChannelEligible: false,
    cafSummary: {
      midcCluster: 'MIDC Chakan Phase II, Pune',
      plotNumber: 'Plot E-42/1',
      totalProjectCostCr: 45,
      powerKva: 1500,
      waterKld: 40,
      pollutionCategory: 'ORANGE',
    },
    documents: [
      { docType: 'POWER_LOAD_CALCULATION', docName: 'HT_Substation_SingleLine_SLD.pdf', verified: true, url: '#' },
    ],
    timeline: [
      {
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'HT 22kV Feeder Feasibility Application Submitted',
        performedBy: 'Applicant',
        status: 'SUBMITTED',
      },
      {
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Technical Load Flow Study Under Scrutiny',
        performedBy: 'MSEDCL Distribution Cell',
        status: 'UNDER_SCRUTINY',
      },
    ],
  },
];

class ApplicationDatabase {
  private cache: ApplicationRecord[] | null = null;

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (!fs.existsSync(DB_FILE)) {
        this.persistToDisk(SEED_APPLICATIONS);
        this.cache = SEED_APPLICATIONS;
      } else {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.cache = JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error initializing applications DB:', e);
      this.cache = SEED_APPLICATIONS;
    }
  }

  private persistToDisk(data: ApplicationRecord[]) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
      this.cache = data;
    } catch (e) {
      console.error('Failed to persist applications to disk:', e);
    }
  }

  private getLiveCache(): ApplicationRecord[] {
    if (!this.cache) {
      this.ensureInitialized();
    }
    return this.cache || [];
  }

  public getAll(filters?: {
    profileId?: string;
    department?: string;
    role?: string;
    status?: string;
    search?: string;
  }): ApplicationRecord[] {
    let list = [...this.getLiveCache()];

    // Refresh dynamic SLA days
    list = list.map(app => this.calculateSLA(app));

    if (filters?.profileId) {
      list = list.filter(a => a.profileId === filters.profileId);
    }

    if (filters?.department && filters.department !== 'ALL') {
      const depLower = filters.department.toLowerCase();
      list = list.filter(a => a.department.toLowerCase().includes(depLower));
    }

    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(a => a.status === filters.status);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(a => 
        a.companyName.toLowerCase().includes(q) ||
        a.trackingNumber.toLowerCase().includes(q) ||
        (a.cafReferenceNumber && a.cafReferenceNumber.toLowerCase().includes(q)) ||
        a.approvalName.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q)
      );
    }

    // Role-based sorting
    if (filters?.role === 'officer') {
      list.sort((a, b) => a.daysRemaining - b.daysRemaining || b.riskScore - a.riskScore);
    } else {
      list.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }

    return list;
  }

  public getById(id: string): ApplicationRecord | null {
    const list = this.getLiveCache();
    const app = list.find(a => a.id === id || a.trackingNumber === id);
    return app ? this.calculateSLA(app) : null;
  }

  /**
   * Submits a full Industrialist Common Application Form (CAF)
   * Spawns individual departmental applications linked under a single CAF Reference Number
   */
  public submitCommonApplication(formData: CommonApplicationFormData): {
    cafReferenceNumber: string;
    createdApplications: ApplicationRecord[];
  } {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const cafReferenceNumber = `MH-CAF-2026-${randomSuffix}`;
    const now = new Date();
    const submissionDate = now.toISOString();

    const selectedIds = formData.selectedApprovalIds && formData.selectedApprovalIds.length > 0
      ? formData.selectedApprovalIds
      : ['LAND_ALLOTMENT', 'BUILDING_PLAN', 'CTE_POLLUTION', 'POWER_SANCTION', 'FACTORY_LICENSE', 'FIRE_NOC'];

    const newApps: ApplicationRecord[] = [];

    // Calculate enterprise risk/trust score
    const isCleanSector = formData.pollutionCategory === 'WHITE' || formData.pollutionCategory === 'GREEN';
    const trustScore = isCleanSector ? 90 : (formData.pollutionCategory === 'ORANGE' ? 82 : 70);
    const riskScore = 100 - trustScore;

    for (const approvalId of selectedIds) {
      const masterApproval = MASTER_APPROVALS.find(a => a.id === approvalId) || {
        id: approvalId,
        code: approvalId.slice(0, 6).toUpperCase(),
        name: `${approvalId.replace(/_/g, ' ')} Clearance`,
        department: 'Government of Maharashtra Regulatory Authority',
        baseDays: 30,
        canAutoApprove: false,
        validityYears: 5,
        documentsRequired: ['LAND_SALE_DEED', 'FACTORY_LAYOUT_PLAN'],
      };

      const slaDays = masterApproval.baseDays || 30;
      const slaDeadline = new Date(now.getTime() + slaDays * 24 * 60 * 60 * 1000).toISOString();
      const trackingNumber = `APOS-${masterApproval.code}-${Math.floor(100000 + Math.random() * 900000)}`;

      // Green channel auto-approval
      const autoApprove = (masterApproval.canAutoApprove && trustScore >= 85) || formData.pollutionCategory === 'WHITE';
      const initialStatus: ApplicationWorkflowStatus = autoApprove ? 'GREEN_CHANNEL_APPROVED' : 'UNDER_SCRUTINY';

      const appRecord: ApplicationRecord = {
        id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        trackingNumber,
        cafReferenceNumber,
        profileId: `prof_${formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15)}`,
        companyName: formData.companyName,
        approvalNodeId: masterApproval.id,
        approvalName: masterApproval.name,
        department: masterApproval.department,
        status: initialStatus,
        submissionDate,
        slaDeadline,
        daysRemaining: slaDays,
        isEscalated: false,
        escalationLevel: 'NONE',
        assignedOfficerName: autoApprove ? 'ApprovalOS Green-Channel AI Daemon' : `Desk Officer, ${masterApproval.department.split('/')[0]}`,
        riskScore,
        trustScore,
        greenChannelEligible: autoApprove,
        cafSummary: {
          midcCluster: formData.midcCluster,
          plotNumber: formData.plotNumber,
          totalProjectCostCr: formData.totalProjectCostCr,
          powerKva: formData.powerRequiredKva,
          waterKld: formData.waterRequiredKld,
          pollutionCategory: formData.pollutionCategory,
        },
        documents: (formData.documents && formData.documents.length > 0) ? formData.documents : [
          { docType: 'LAND_SALE_DEED', docName: `${formData.companyName}_Land_Document.pdf`, verified: true, url: '#' },
          { docType: 'FACTORY_LAYOUT_PLAN', docName: `${formData.companyName}_Factory_Layout.pdf`, verified: true, url: '#' },
          { docType: 'PROJECT_FEASIBILITY_REPORT', docName: `${formData.companyName}_Detailed_Project_Report.pdf`, verified: true, url: '#' },
        ],
        timeline: [
          {
            timestamp: submissionDate,
            event: `Common Application Form (CAF) Submitted by ${formData.authorizedPersonName}`,
            performedBy: 'Applicant (Industrialist)',
            status: 'SUBMITTED',
          },
          ...(autoApprove ? [{
            timestamp: submissionDate,
            event: 'Instant Green-Channel Clearance Auto-Issued based on White/Green category and verified credentials',
            performedBy: 'ApprovalOS Autonomous AI Daemon',
            status: 'GREEN_CHANNEL_APPROVED',
          }] : [{
            timestamp: submissionDate,
            event: 'Routed to Scrutiny Officer with Pre-Validated DigiLocker Dossier',
            performedBy: 'ApprovalOS Orchestrator',
            status: 'UNDER_SCRUTINY',
          }]),
        ],
      };

      if (autoApprove) {
        const governing = getGoverningActForApproval(masterApproval.id);
        appRecord.certificate = {
          certificateNumber: `${masterApproval.code}/MH/2026/${randomSuffix}`,
          issuedAt: submissionDate,
          issuingAuthority: masterApproval.department,
          department: masterApproval.department,
          validUntil: new Date(Date.now() + (masterApproval.validityYears || 5) * 365 * 24 * 60 * 60 * 1000).toISOString(),
          qrHash: `mh.gov.verify.${masterApproval.code.toLowerCase()}.${randomSuffix}`,
          digitalSignatureHash: `SHA256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
          isDeemedApproval: false,
          statutoryAct: governing?.name || 'Maharashtra Right to Services Act 2015',
        };
      }

      newApps.push(appRecord);
    }

    const currentList = this.getLiveCache();
    const updatedList = [...newApps, ...currentList];
    this.persistToDisk(updatedList);

    return {
      cafReferenceNumber,
      createdApplications: newApps,
    };
  }

  /**
   * Officer raises a scrutiny objection (pauses RTS SLA countdown)
   */
  public raiseOfficerQuery(
    applicationId: string,
    officerName: string,
    objectionText: string,
    statutoryRuleRef?: string
  ): ApplicationRecord {
    const list = this.getLiveCache();
    const idx = list.findIndex(a => a.id === applicationId);
    if (idx === -1) throw new Error(`Application ${applicationId} not found`);

    const app = { ...list[idx] };
    const now = new Date().toISOString();

    const queryId = `qry_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    const newQuery: DepartmentQueryRecord = {
      id: queryId,
      applicationId: app.id,
      department: app.department,
      officerName: officerName || 'Scrutiny Officer',
      queryDate: now,
      objectionText,
      statutoryRuleRef: statutoryRuleRef || 'Applicable Departmental Regulations',
      status: 'PENDING',
    };

    app.status = 'QUERY_RAISED';
    app.queries = app.queries || [];
    app.queries.unshift(newQuery);

    app.queryNotes = app.queryNotes || [];
    app.queryNotes.unshift(objectionText);

    app.timeline.push({
      timestamp: now,
      event: `Clarification Query Issued by ${officerName}: "${objectionText}" (SLA Paused)`,
      performedBy: officerName,
      status: 'QUERY_RAISED',
    });

    list[idx] = app;
    this.persistToDisk(list);
    return app;
  }

  /**
   * Industrialist responds to a department query (resumes SLA countdown)
   */
  public respondToQuery(
    applicationId: string,
    applicantResponseText: string,
    attachedDocName?: string
  ): ApplicationRecord {
    const list = this.getLiveCache();
    const idx = list.findIndex(a => a.id === applicationId);
    if (idx === -1) throw new Error(`Application ${applicationId} not found`);

    const app = { ...list[idx] };
    const now = new Date().toISOString();

    // Mark pending query as resolved
    if (app.queries && app.queries.length > 0) {
      const pendingQry = app.queries.find(q => q.status === 'PENDING') || app.queries[0];
      pendingQry.status = 'RESOLVED';
      pendingQry.applicantResponseText = applicantResponseText;
      pendingQry.responseDate = now;
      pendingQry.attachedDocName = attachedDocName;
    }

    if (attachedDocName) {
      app.documents.push({
        docType: 'PROJECT_FEASIBILITY_REPORT',
        docName: attachedDocName,
        verified: true,
        url: '#',
      });
    }

    app.status = 'UNDER_SCRUTINY';
    app.timeline.push({
      timestamp: now,
      event: `Applicant Submitted Clarification: "${applicantResponseText}" (SLA Resumed)`,
      performedBy: 'Applicant (Industrialist)',
      status: 'UNDER_SCRUTINY',
    });

    list[idx] = app;
    this.persistToDisk(list);
    return app;
  }

  /**
   * Officer approves application and issues official verifiable digital certificate
   */
  public approve(applicationId: string, officerName: string, remarks?: string): ApplicationRecord {
    const list = this.getLiveCache();
    const idx = list.findIndex(a => a.id === applicationId);
    if (idx === -1) throw new Error(`Application ${applicationId} not found`);

    const app = { ...list[idx] };
    const now = new Date().toISOString();
    const governing = getGoverningActForApproval(app.approvalNodeId);

    const randomCert = Math.floor(1000 + Math.random() * 9000);
    const certNumber = `${app.trackingNumber.slice(5, 11)}/MH/2026/${randomCert}`;

    app.status = 'APPROVED';
    app.certificate = {
      certificateNumber: certNumber,
      issuedAt: now,
      issuingAuthority: officerName || app.department,
      department: app.department,
      validUntil: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      qrHash: `in.gov.mh.clearance.${app.trackingNumber.toLowerCase()}.${randomCert}`,
      digitalSignatureHash: `SHA256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      isDeemedApproval: false,
      statutoryAct: governing?.name || 'Maharashtra Right to Services Act 2015',
    };

    app.timeline.push({
      timestamp: now,
      event: `Clearance Granted by ${officerName}. Official Certificate #${certNumber} Issued. ${remarks || ''}`,
      performedBy: officerName,
      status: 'APPROVED',
    });

    list[idx] = app;
    this.persistToDisk(list);
    return app;
  }

  /**
   * Statutory Deemed Approval Enforcement under Maharashtra RTS Act 2015 Section 4(1)
   */
  public triggerDeemedApproval(applicationId: string): ApplicationRecord {
    const list = this.getLiveCache();
    const idx = list.findIndex(a => a.id === applicationId);
    if (idx === -1) throw new Error(`Application ${applicationId} not found`);

    const app = { ...list[idx] };
    const now = new Date().toISOString();
    const governing = getGoverningActForApproval(app.approvalNodeId);

    const certNumber = `DEEMED/RTS2015/MH/${Math.floor(10000 + Math.random() * 90000)}`;

    app.status = 'DEEMED_APPROVED';
    app.certificate = {
      certificateNumber: certNumber,
      issuedAt: now,
      issuingAuthority: 'Government of Maharashtra Statutory RTS Authority',
      department: app.department,
      validUntil: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      qrHash: `in.gov.mh.deemed.${app.trackingNumber.toLowerCase()}`,
      digitalSignatureHash: `DEEMED-SHA256:${Math.random().toString(36).substring(2)}`,
      isDeemedApproval: true,
      statutoryAct: 'Maharashtra Right to Services Act 2015 (Section 4(1) Deemed Approval)',
    };

    app.timeline.push({
      timestamp: now,
      event: `Statutory Deemed Approval Triggered under Section 4(1) of Maharashtra RTS Act 2015. Deemed Certificate #${certNumber} Issued.`,
      performedBy: 'Autonomous Statutory SLA Sentinel',
      status: 'DEEMED_APPROVED',
    });

    list[idx] = app;
    this.persistToDisk(list);
    return app;
  }

  /**
   * Schedules a synchronized Joint Site Inspection
   */
  public scheduleInspection(
    applicationId: string, 
    date: string, 
    departments: string[], 
    officerNames: string[]
  ): ApplicationRecord {
    const list = this.getLiveCache();
    const idx = list.findIndex(a => a.id === applicationId);
    if (idx === -1) throw new Error(`Application ${applicationId} not found`);

    const app = { ...list[idx] };
    const now = new Date().toISOString();

    app.status = 'INSPECTION_PENDING';
    app.inspections = app.inspections || [];
    app.inspections.push({
      scheduledDate: date,
      departments: departments.length > 0 ? departments : ['State Fire Services', 'DISH Safety Directorate'],
      officerNames: officerNames.length > 0 ? officerNames : ['Joint Inspection Team'],
      isJointInspection: true,
      status: 'SCHEDULED',
      mode: 'PHYSICAL',
    });

    app.timeline.push({
      timestamp: now,
      event: `Joint Multi-Department Inspection Scheduled for ${date} with ${departments.join(', ')}`,
      performedBy: 'ApprovalOS Joint Scheduler',
      status: 'INSPECTION_PENDING',
    });

    list[idx] = app;
    this.persistToDisk(list);
    return app;
  }

  /**
   * Resets database to default seed data (useful for jury demos)
   */
  public resetToDefaults(): ApplicationRecord[] {
    this.persistToDisk(SEED_APPLICATIONS);
    return SEED_APPLICATIONS;
  }

  private calculateSLA(app: ApplicationRecord): ApplicationRecord {
    if (app.status === 'APPROVED' || app.status === 'GREEN_CHANNEL_APPROVED' || app.status === 'DEEMED_APPROVED' || app.status === 'REJECTED') {
      return app;
    }

    const deadline = new Date(app.slaDeadline).getTime();
    const now = Date.now();
    const daysRemaining = Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)));
    const updated = { ...app, daysRemaining };

    if (now > deadline) {
      updated.isEscalated = true;
      updated.escalationLevel = 'DISTRICT_COLLECTOR';
    } else if (daysRemaining <= 3) {
      updated.isEscalated = true;
      updated.escalationLevel = 'HOD';
    }

    return updated;
  }
}

// Global Singleton Instance
export const applicationDB = new ApplicationDatabase();
