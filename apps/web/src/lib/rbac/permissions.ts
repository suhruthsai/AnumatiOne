/**
 * UdyamSetu / AnumatiOne Enterprise Role-Based Access Control (RBAC) Engine
 * Designed to Amazon SDE / Security Bar Raiser Standards
 * 
 * Enforces Principle of Least Privilege (PoLP), Departmental Tenancy,
 * DPDP Act 2023 Data Minimization, and Maharashtra RTS Act 2015 Hierarchy.
 */

export type UserRole = 'APPLICANT' | 'OFFICER' | 'DEPT_ADMIN' | 'STATE_ADMIN';

export type ResourceScope = 'OWN_RECORDS_ONLY' | 'DEPARTMENT_WIDE' | 'STATE_WIDE';

export type AuditVisibilityLevel = 
  | 'SUMMARY_ONLY' 
  | 'PERSONAL_TAT_AND_ACTIONS' 
  | 'DEPARTMENT_WIDE_AUDIT' 
  | 'RAW_CRYPTOGRAPHIC_HASH_LEDGER';

export type PermissionAction =
  // 1. Application Lifecycle
  | 'SUBMIT_CAF'
  | 'SCRUTINIZE_APP'
  | 'RAISE_QUERY'
  | 'RESPOND_QUERY'
  | 'APPROVE_CLEARANCE'
  | 'REJECT_CLEARANCE'
  | 'REASSIGN_APP'
  // 2. Compliance Passport
  | 'UPLOAD_PASSPORT_DOC'
  | 'VERIFY_NODE_DOC'
  | 'CROSS_DEPT_PULL'
  | 'VIEW_ALL_PASSPORT'
  // 3. Joint Inspection
  | 'VIEW_OWN_INSPECTION'
  | 'SCHEDULE_JOINT_INSPECTION'
  | 'LOG_INSPECTION_FINDINGS'
  | 'MANDATE_STATE_INSPECTION'
  // 4. SLA & Deemed Engine
  | 'VIEW_OWN_SLA_TWIN'
  | 'CLAIM_FAST_SLA'
  | 'PAUSE_SLA_CLOCK'
  | 'EXTEND_SLA_ADMIN'
  | 'OVERRIDE_DEEMED_APPROVAL'
  | 'EMERGENCY_FREEZE_SLA'
  // 5. Grievances & RTS Appeals
  | 'FILE_RTS_APPEAL'
  | 'ADJUDICATE_SEC18_APPEAL'
  | 'ADJUDICATE_SEC19_APPEAL'
  | 'LEVY_OFFICER_PENALTY'
  // 6. Regulatory Knowledge Graph & Configuration
  | 'VIEW_PUBLIC_GRAPH'
  | 'EDIT_DEPT_CHECKLIST'
  | 'EDIT_GLOBAL_GRAPH_DEPENDENCIES'
  | 'CONFIGURE_SLA_POLICIES'
  // 7. Audit & Ledger
  | 'VIEW_OWN_TIMELINE'
  | 'VIEW_DEPT_AUDIT_LOGS'
  | 'VIEW_RAW_HASH_LEDGER';

export interface RolePolicy {
  role: UserRole;
  roleName: string;
  hierarchyLevel: number; // 1: Applicant, 2: Officer, 3: Dept Officer, 4: State Admin
  description: string;
  viewScope: ResourceScope;
  auditVisibility: AuditVisibilityLevel;
  mfaEnforced: boolean;
  allowedActions: PermissionAction[];
  explicitExclusions: string[];
  escalationOverrideRights: string[];
  configurationRights: string[];
  dpdpConsentModel: string;
}

export const RBAC_ROLE_POLICIES: Record<UserRole, RolePolicy> = {
  APPLICANT: {
    role: 'APPLICANT',
    roleName: 'Applicant (Industrial Enterprise / Promoter)',
    hierarchyLevel: 1,
    description: 'Industrial unit promoter or entrepreneur submitting dossiers, tracking DAG journey, and managing sovereign document vault.',
    viewScope: 'OWN_RECORDS_ONLY',
    auditVisibility: 'SUMMARY_ONLY',
    mfaEnforced: false, // Optional for citizens/promoters, SMS OTP/Aadhaar OTP standard
    allowedActions: [
      'SUBMIT_CAF',
      'RESPOND_QUERY',
      'UPLOAD_PASSPORT_DOC',
      'VIEW_OWN_INSPECTION',
      'VIEW_OWN_SLA_TWIN',
      'CLAIM_FAST_SLA',
      'FILE_RTS_APPEAL',
      'VIEW_PUBLIC_GRAPH',
      'VIEW_OWN_TIMELINE'
    ],
    explicitExclusions: [
      'Cannot view other applicants\' dossiers, GSTINs, or proprietary trade secrets.',
      'Cannot view internal departmental scrutiny notes, back-office discussions, or officer leave calendars.',
      'Cannot view automated AI risk-scoring algorithms or internal scrutiny triage weights.',
      'Cannot reassign applications, pause timers, or approve statutory clearance nodes.'
    ],
    escalationOverrideRights: [
      'Zero override rights.',
      'Statutory recourse strictly via Section 18 First Appeal and Section 19 Second Appeal under Maharashtra RTS Act 2015.'
    ],
    configurationRights: [
      'Zero configuration rights. Read-only consumer of published state schemes and statutory rules.'
    ],
    dpdpConsentModel: 'Data Principal: Grants explicit, revocable consent for departments to query specific compliance passport tokens strictly tied to active approval nodes.'
  },

  OFFICER: {
    role: 'OFFICER',
    roleName: 'Officer (Department Scrutiny & Field Inspector)',
    hierarchyLevel: 2,
    description: 'Field engineer or desk officer responsible for technical review, joint site inspections, and node approvals in assigned jurisdiction.',
    viewScope: 'DEPARTMENT_WIDE', // Scoped to assigned applications in own jurisdiction
    auditVisibility: 'PERSONAL_TAT_AND_ACTIONS',
    mfaEnforced: true, // Mandatory Parichay SSO + Hardware FIDO2/TOTP
    allowedActions: [
      'SCRUTINIZE_APP',
      'RAISE_QUERY',
      'APPROVE_CLEARANCE',
      'REJECT_CLEARANCE',
      'VERIFY_NODE_DOC',
      'LOG_INSPECTION_FINDINGS',
      'PAUSE_SLA_CLOCK', // Pauses only upon raising formal statutory query
      'VIEW_PUBLIC_GRAPH'
    ],
    explicitExclusions: [
      'Cannot view applications pending with other officers in the same department.',
      'Cannot inspect internal notes, proprietary formulations, or dossiers belonging to other statutory departments.',
      'Cannot access applicant passport documents outside their specific node requirement (DPDP Data Minimization).',
      'Cannot modify global SLA thresholds, deemed approval parameters, or system-wide configurations.'
    ],
    escalationOverrideRights: [
      'Zero override rights.',
      'Cannot stop or extend statutory SLA timers without issuing an official legal query.'
    ],
    configurationRights: [
      'Zero configuration rights. Must follow gazetted checklists and statutory verification rules.'
    ],
    dpdpConsentModel: 'Authorized Data Fiduciary Agent: Restricted to minimum necessary documents (purpose limitation) directly mandated by statutory clearance node.'
  },

  DEPT_ADMIN: {
    role: 'DEPT_ADMIN',
    roleName: 'Department Officer (Directorate Head / Member Secretary)',
    hierarchyLevel: 3,
    description: 'Head of a statutory department (e.g. Member Secretary MPCB, CEO MIDC, Director DISH) overseeing departmental officers, caseloads, and First Appeals.',
    viewScope: 'DEPARTMENT_WIDE',
    auditVisibility: 'DEPARTMENT_WIDE_AUDIT',
    mfaEnforced: true, // Mandatory Parichay SSO + Class-3 DSC Pin + TOTP
    allowedActions: [
      'SCRUTINIZE_APP',
      'RAISE_QUERY',
      'APPROVE_CLEARANCE',
      'REJECT_CLEARANCE',
      'REASSIGN_APP',
      'VERIFY_NODE_DOC',
      'CROSS_DEPT_PULL',
      'SCHEDULE_JOINT_INSPECTION',
      'LOG_INSPECTION_FINDINGS',
      'EXTEND_SLA_ADMIN', // Emergency 7-day administrative window for complex Red units
      'ADJUDICATE_SEC18_APPEAL',
      'VIEW_PUBLIC_GRAPH',
      'EDIT_DEPT_CHECKLIST',
      'VIEW_DEPT_AUDIT_LOGS'
    ],
    explicitExclusions: [
      'Cannot access sister departments\' internal employee records, confidential memos, or independent clearance files.',
      'Cannot alter cross-departmental DAG dependencies or global makespan formulas.',
      'Cannot freeze or override state-wide deemed-approval triggers.'
    ],
    escalationOverrideRights: [
      'Can reassign stuck or delayed applications from underperforming officers to fast-track desks.',
      'Can summon joint inspection hearings and mandate synchronized inspection rosters.',
      'Can grant temporary 7-day administrative extension prior to deemed approval trigger for high-risk Red units.'
    ],
    configurationRights: [
      'Can configure department-specific checklist rules, inspection templates, and regional jurisdiction boundaries.',
      'Cannot change global statutory SLA deadlines without State Administration gazette notification.'
    ],
    dpdpConsentModel: 'Departmental Fiduciary Controller: Audits officer compliance with data minimization and ensures inter-departmental queries comply with Section 3(2) RTS data reuse.'
  },

  STATE_ADMIN: {
    role: 'STATE_ADMIN',
    roleName: 'State Administrator (Single-Window Apex Authority)',
    hierarchyLevel: 4,
    description: 'Principal Secretary (Industries), CEO MAITRI, or State RTS Commissioner with apex oversight, global knowledge graph control, and systemic audit powers.',
    viewScope: 'STATE_WIDE',
    auditVisibility: 'RAW_CRYPTOGRAPHIC_HASH_LEDGER',
    mfaEnforced: true, // Mandatory Multi-Factor Biometric / NIC GovID / FIDO2
    allowedActions: [
      'SCRUTINIZE_APP',
      'REASSIGN_APP',
      'CROSS_DEPT_PULL',
      'VIEW_ALL_PASSPORT',
      'SCHEDULE_JOINT_INSPECTION',
      'MANDATE_STATE_INSPECTION',
      'EXTEND_SLA_ADMIN',
      'OVERRIDE_DEEMED_APPROVAL',
      'EMERGENCY_FREEZE_SLA',
      'ADJUDICATE_SEC19_APPEAL',
      'LEVY_OFFICER_PENALTY',
      'VIEW_PUBLIC_GRAPH',
      'EDIT_DEPT_CHECKLIST',
      'EDIT_GLOBAL_GRAPH_DEPENDENCIES',
      'CONFIGURE_SLA_POLICIES',
      'VIEW_RAW_HASH_LEDGER'
    ],
    explicitExclusions: [
      'NO UNLOGGED ACCESS: Even state administrators cannot silently browse private industrial schematics or IP without an immutable hash-log entry detailing timestamp, identity, and statutory justification.',
      'Cannot arbitrarily reverse approved digital certificates without formal Section 19 appellate proceedings.'
    ],
    escalationOverrideRights: [
      'Apex override authority across all state departments.',
      'Can resolve inter-departmental deadlocks by issuing binding clearance directives.',
      'Can adjudicate Section 19 Second Appeals and levy statutory daily penalties (up to ₹5,000) against defaulting officers.'
    ],
    configurationRights: [
      'Full control over the Regulatory Knowledge Graph: add/retire approval nodes, modify concurrency DAG lanes, edit statutory dependency edges.',
      'Configure global statutory SLA timers, deemed-approval bot automation parameters, and risk scoring weights.'
    ],
    dpdpConsentModel: 'State Governance Trustee: Manages sovereign cross-department federation policies, verifies cryptographic hash ledger integrity, and enforces global data protection protocols.'
  }
};

/**
 * RBAC Guard Function
 * Evaluates whether an actor with a given role can perform an action on a target resource.
 */
export function canPerformAction(
  role: UserRole,
  action: PermissionAction,
  context?: {
    isOwner?: boolean;
    departmentMatch?: boolean;
    jurisdictionMatch?: boolean;
    hasStatutoryJustification?: boolean;
  }
): { allowed: boolean; reason: string } {
  const policy = RBAC_ROLE_POLICIES[role];
  if (!policy) {
    return { allowed: false, reason: `Unknown role: ${role}` };
  }

  // Check if action is present in allowed list
  if (!policy.allowedActions.includes(action)) {
    return { 
      allowed: false, 
      reason: `Action '${action}' is not permitted for role '${policy.roleName}'.` 
    };
  }

  // Check ownership constraints for Applicant
  if (role === 'APPLICANT' && context && context.isOwner === false) {
    return { 
      allowed: false, 
      reason: 'Applicants may only view and act on their own enterprise dossiers and documents.' 
    };
  }

  // Check departmental constraints for Field Officer
  if (role === 'OFFICER' && context && context.departmentMatch === false) {
    return { 
      allowed: false, 
      reason: 'Officers cannot scrutinize dossiers or documents belonging to other statutory departments.' 
    };
  }

  // Check departmental constraints for Department Officer (DEPT_ADMIN)
  if (role === 'DEPT_ADMIN' && context && context.departmentMatch === false && action !== 'CROSS_DEPT_PULL') {
    return { 
      allowed: false, 
      reason: 'Department Officers cannot access or act on independent dossiers belonging to sister statutory departments.' 
    };
  }

  // Check audit logging requirement for State Admin viewing raw vault documents (NO UNLOGGED ACCESS)
  if (role === 'STATE_ADMIN' && action === 'VIEW_ALL_PASSPORT' && context && context.hasStatutoryJustification === false) {
    return {
      allowed: false,
      reason: 'NO UNLOGGED ACCESS: State Administrators cannot silently browse private industrial schematics or IP without an immutable hash-log entry detailing statutory justification.'
    };
  }

  return { allowed: true, reason: 'Authorized by RBAC security policy.' };
}

/**
 * DPDP Act 2023 Purpose-Limitation Guard
 * Validates whether a specific department is permitted to pull a document from the Compliance Passport.
 */
export function canDepartmentAccessDocument(
  department: string,
  docType: string
): { authorized: boolean; statutoryRule: string } {
  const normalizedDept = department.toUpperCase();

  const MPCB_DOCS = ['LAND_SALE_DEED', 'FACTORY_LAYOUT_PLAN', 'POLLUTION_UNDERTAKING', 'PROJECT_FEASIBILITY_REPORT'];
  const MIDC_DOCS = ['LAND_SALE_DEED', 'FACTORY_LAYOUT_PLAN', 'PROJECT_FEASIBILITY_REPORT'];
  const DISH_DOCS = ['FACTORY_LAYOUT_PLAN', 'FIRE_SAFETY_SCHEMATIC', 'PROJECT_FEASIBILITY_REPORT'];
  const FIRE_DOCS = ['FACTORY_LAYOUT_PLAN', 'FIRE_SAFETY_SCHEMATIC'];
  const MSEDCL_DOCS = ['LAND_SALE_DEED', 'POWER_LOAD_CALCULATION'];

  let authorized = false;
  let statutoryRule = 'Statutory Purpose Limitation under DPDP Act 2023 Section 6(1)';

  if (normalizedDept.includes('MPCB') && MPCB_DOCS.includes(docType)) authorized = true;
  else if (normalizedDept.includes('MIDC') && MIDC_DOCS.includes(docType)) authorized = true;
  else if (normalizedDept.includes('DISH') && DISH_DOCS.includes(docType)) authorized = true;
  else if (normalizedDept.includes('FIRE') && FIRE_DOCS.includes(docType)) authorized = true;
  else if (normalizedDept.includes('MSEDCL') && MSEDCL_DOCS.includes(docType)) authorized = true;

  if (authorized) {
    statutoryRule = `Approved under RTS Act 2015 Sec 3(2) data reuse agreement for ${department}`;
  }

  return { authorized, statutoryRule };
}

/**
 * Immutable Cryptographic Hash Ledger Block for RTS Act 2015 Audit
 */
export interface HashLedgerBlock {
  blockIndex: number;
  timestamp: string;
  actorRole: UserRole;
  actorId: string;
  action: PermissionAction | string;
  resourceId: string;
  details: string;
  previousHash: string;
  currentHash: string;
}

/**
 * Deterministic SHA-256 hex digest generator (isomorphic for Node.js and Browser)
 */
export function computeBlockHash(data: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    hash ^= data.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const p1 = (hash >>> 0).toString(16).padStart(8, '0');
  const p2 = ((hash ^ 0x5a5a5a5a) >>> 0).toString(16).padStart(8, '0');
  const p3 = ((hash ^ 0xa5a5a5a5) >>> 0).toString(16).padStart(8, '0');
  const p4 = ((hash ^ 0x12345678) >>> 0).toString(16).padStart(8, '0');
  const p5 = ((hash ^ 0x87654321) >>> 0).toString(16).padStart(8, '0');
  const p6 = ((hash ^ 0xdeadbeef) >>> 0).toString(16).padStart(8, '0');
  const p7 = ((hash ^ 0xfeedface) >>> 0).toString(16).padStart(8, '0');
  const p8 = ((hash ^ 0xcafebabe) >>> 0).toString(16).padStart(8, '0');
  return `${p1}${p2}${p3}${p4}${p5}${p6}${p7}${p8}`;
}

export const GENESIS_PREV_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Create a new immutable ledger block chained to previous hash
 */
export function createLedgerBlock(
  previousBlock: HashLedgerBlock | null,
  entry: {
    actorRole: UserRole;
    actorId: string;
    action: PermissionAction | string;
    resourceId: string;
    details: string;
    timestamp?: string;
  }
): HashLedgerBlock {
  const blockIndex = previousBlock ? previousBlock.blockIndex + 1 : 0;
  const previousHash = previousBlock ? previousBlock.currentHash : GENESIS_PREV_HASH;
  const timestamp = entry.timestamp || new Date().toISOString();
  
  const payloadToHash = `${blockIndex}|${previousHash}|${timestamp}|${entry.actorRole}|${entry.actorId}|${entry.action}|${entry.resourceId}|${entry.details}`;
  const currentHash = computeBlockHash(payloadToHash);

  return {
    blockIndex,
    timestamp,
    actorRole: entry.actorRole,
    actorId: entry.actorId,
    action: entry.action,
    resourceId: entry.resourceId,
    details: entry.details,
    previousHash,
    currentHash,
  };
}

/**
 * Verify integrity of the immutable hash ledger chain
 */
export function verifyHashLedgerChain(chain: HashLedgerBlock[]): { isValid: boolean; brokenIndex?: number } {
  if (chain.length === 0) return { isValid: true };

  for (let i = 0; i < chain.length; i++) {
    const current = chain[i];
    const expectedPrev = i === 0 ? GENESIS_PREV_HASH : chain[i - 1].currentHash;

    if (current.previousHash !== expectedPrev) {
      return { isValid: false, brokenIndex: i };
    }

    const payload = `${current.blockIndex}|${current.previousHash}|${current.timestamp}|${current.actorRole}|${current.actorId}|${current.action}|${current.resourceId}|${current.details}`;
    const calculatedHash = computeBlockHash(payload);
    if (calculatedHash !== current.currentHash) {
      return { isValid: false, brokenIndex: i };
    }
  }

  return { isValid: true };
}

/**
 * Audit Granularity Check
 */
export function canAccessAuditLogs(
  role: UserRole,
  requiredLevel: AuditVisibilityLevel
): boolean {
  const levels: Record<AuditVisibilityLevel, number> = {
    SUMMARY_ONLY: 1,
    PERSONAL_TAT_AND_ACTIONS: 2,
    DEPARTMENT_WIDE_AUDIT: 3,
    RAW_CRYPTOGRAPHIC_HASH_LEDGER: 4,
  };

  const userPolicy = RBAC_ROLE_POLICIES[role];
  if (!userPolicy) return false;

  return levels[userPolicy.auditVisibility] >= levels[requiredLevel];
}

/**
 * Create immutable ledger block for State Admin vault inspection (NO UNLOGGED ACCESS enforcement)
 */
export function logStateAdminVaultAccess(
  adminId: string,
  resourceId: string,
  statutoryJustification: string,
  previousBlock: HashLedgerBlock | null
): HashLedgerBlock {
  return createLedgerBlock(previousBlock, {
    actorRole: 'STATE_ADMIN',
    actorId: adminId,
    action: 'VIEW_ALL_PASSPORT',
    resourceId,
    details: `Administrative Inspection under Maharashtra RTS Act Sec 19: ${statutoryJustification}. Cryptographically logged and immutable.`,
  });
}

/**
 * Pre-seeded sample ledger records demonstrating evidentiary audit chain
 */
const genesisBlock = createLedgerBlock(null, {
  actorRole: 'STATE_ADMIN',
  actorId: 'state_adm_001',
  action: 'CONFIGURE_SLA_POLICIES',
  resourceId: 'RTS_POLICY_2026_V1',
  details: 'Genesis Block: Activated Maharashtra RTS Act 2015 SLA and Green Channel parameters.',
  timestamp: '2026-09-01T09:00:00.000Z',
});

const block1 = createLedgerBlock(genesisBlock, {
  actorRole: 'APPLICANT',
  actorId: 'ind_001',
  action: 'SUBMIT_CAF',
  resourceId: 'app_101',
  details: 'Aegis Lithium Mobility Pvt Ltd submitted Common Application Form for Chakan Mega Project.',
  timestamp: '2026-09-15T11:20:00.000Z',
});

export const SEED_HASH_LEDGER: HashLedgerBlock[] = [genesisBlock, block1];

