import { BusinessProfile, ApprovalNode, DocumentType } from '@approvalos/shared';
import { getApprovalsForProfile } from './regulatory-graph';
import { solveApprovalDAG } from '../simulator/dag-solver';

export interface DeduplicatedDocument {
  documentType: DocumentType;
  title: string;
  description: string;
  requiredByApprovals: Array<{ id: string; name: string; department: string }>;
  isMandatoryUpfront: boolean;
  ocrAvailable: boolean;
  sampleTemplateUrl?: string;
}

export interface ChecklistResponse {
  profileId: string;
  totalApprovals: number;
  totalStatutoryFees: number;
  estimatedTimelineDays: number;
  deduplicatedDocuments: DeduplicatedDocument[];
  approvalsByStage: Array<{
    stageNumber: number;
    stageName: string;
    approvals: Array<{
      id: string;
      name: string;
      department: string;
      fee: number;
      baseDays: number;
      prerequisites: string[];
      canAutoApprove: boolean;
      documents: DocumentType[];
    }>;
  }>;
}

const DOCUMENT_METADATA: Record<DocumentType, { title: string; description: string; ocr: boolean }> = {
  PAN_CARD: {
    title: 'Company / Promoter PAN Card',
    description: 'Permanent Account Number issued by Income Tax Department.',
    ocr: true,
  },
  AADHAAR_CARD: {
    title: 'Authorized Signatory Aadhaar Card',
    description: '12-digit UIDAI identity document of authorized promoter/director.',
    ocr: true,
  },
  GSTIN_CERTIFICATE: {
    title: 'GST Registration Certificate',
    description: 'Form GST REG-06 showing legal entity name and state tax jurisdiction.',
    ocr: true,
  },
  LAND_SALE_DEED: {
    title: 'Land Allotment Letter / Title Deed',
    description: 'Registered lease agreement with SIDC or registered private sale deed with 7/12 land extract.',
    ocr: true,
  },
  FACTORY_LAYOUT_PLAN: {
    title: 'Architectural Factory Layout Plan',
    description: 'Blueprints certified by chartered architect showing machine layout, fire exits, and setbacks.',
    ocr: false,
  },
  PROJECT_FEASIBILITY_REPORT: {
    title: 'Detailed Project Report (DPR)',
    description: 'Comprehensive report covering manufacturing process, raw materials, power, and employment.',
    ocr: false,
  },
  POLLUTION_UNDERTAKING: {
    title: 'Environmental Undertaking & Effluent Balance',
    description: 'Chartered engineer schematic of ETP/STP design, zero liquid discharge, and emission stacks.',
    ocr: true,
  },
  FIRE_SAFETY_SCHEMATIC: {
    title: 'Fire Safety & Hydrant Drawing',
    description: 'Engineering drawing detailing hydrant lines, sprinkler networks, and evacuation egress.',
    ocr: false,
  },
  WATER_BALANCE_CHART: {
    title: 'Industrial Water Balance Chart',
    description: 'Detailed mass flow diagram showing fresh water intake, cooling towers, and recycled volume.',
    ocr: false,
  },
  POWER_LOAD_CALCULATION: {
    title: 'Connected HT Electrical Load SLD',
    description: 'Single Line Diagram (SLD) signed by licensed electrical contractor.',
    ocr: false,
  },
};

export function generateCustomChecklist(profile: BusinessProfile): ChecklistResponse {
  const approvals = getApprovalsForProfile(profile);
  const dag = solveApprovalDAG(approvals);

  // Group and deduplicate documents across all approvals
  const docMap = new Map<DocumentType, DeduplicatedDocument>();

  for (const app of approvals) {
    for (const docType of app.documentsRequired as DocumentType[]) {
      if (!docMap.has(docType)) {
        const meta = DOCUMENT_METADATA[docType] || {
          title: docType.replace(/_/g, ' '),
          description: 'Required verification document',
          ocr: false,
        };

        docMap.set(docType, {
          documentType: docType,
          title: meta.title,
          description: meta.description,
          requiredByApprovals: [],
          isMandatoryUpfront: app.prerequisites.length === 0,
          ocrAvailable: meta.ocr,
        });
      }

      docMap.get(docType)!.requiredByApprovals.push({
        id: app.id,
        name: app.name,
        department: app.department,
      });
    }
  }

  const approvalsByStage = dag.lanes.map((lane, idx) => ({
    stageNumber: idx + 1,
    stageName: lane.stageName,
    approvals: lane.approvals.map(a => ({
      id: a.id,
      name: a.name,
      department: a.department,
      fee: 0,
      baseDays: a.baseDays,
      prerequisites: a.prerequisites,
      canAutoApprove: a.canAutoApprove,
      documents: a.documentsRequired as DocumentType[],
    })),
  }));

  return {
    profileId: profile.id,
    totalApprovals: approvals.length,
    totalStatutoryFees: 0,
    estimatedTimelineDays: dag.criticalPathDays,
    deduplicatedDocuments: Array.from(docMap.values()),
    approvalsByStage,
  };
}
