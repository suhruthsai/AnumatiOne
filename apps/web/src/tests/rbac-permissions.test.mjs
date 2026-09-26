import test from 'node:test';
import assert from 'node:assert';
import {
  RBAC_ROLE_POLICIES,
  canPerformAction,
  canDepartmentAccessDocument,
  createLedgerBlock,
  verifyHashLedgerChain,
  canAccessAuditLogs,
  SEED_HASH_LEDGER,
  GENESIS_PREV_HASH
} from '../lib/rbac/permissions.ts';

test('UdyamSetu / AnumatiOne Amazon SDE RBAC Engine & Security Architecture', async (t) => {

  await t.test('1. Role Hierarchy and Scope Definitions (4-Tier Architecture)', () => {
    const roles = ['APPLICANT', 'OFFICER', 'DEPT_ADMIN', 'STATE_ADMIN'];
    for (const r of roles) {
      assert.ok(RBAC_ROLE_POLICIES[r], `Policy for role ${r} must be defined`);
    }

    // Strict hierarchy verification
    assert.strictEqual(RBAC_ROLE_POLICIES.APPLICANT.hierarchyLevel, 1, 'Applicant must be level 1');
    assert.strictEqual(RBAC_ROLE_POLICIES.OFFICER.hierarchyLevel, 2, 'Officer must be level 2');
    assert.strictEqual(RBAC_ROLE_POLICIES.DEPT_ADMIN.hierarchyLevel, 3, 'Dept Admin must be level 3');
    assert.strictEqual(RBAC_ROLE_POLICIES.STATE_ADMIN.hierarchyLevel, 4, 'State Admin must be level 4');

    // View scope verification
    assert.strictEqual(RBAC_ROLE_POLICIES.APPLICANT.viewScope, 'OWN_RECORDS_ONLY');
    assert.strictEqual(RBAC_ROLE_POLICIES.OFFICER.viewScope, 'DEPARTMENT_WIDE');
    assert.strictEqual(RBAC_ROLE_POLICIES.DEPT_ADMIN.viewScope, 'DEPARTMENT_WIDE');
    assert.strictEqual(RBAC_ROLE_POLICIES.STATE_ADMIN.viewScope, 'STATE_WIDE');
  });

  await t.test('2. Allowed Actions and Principle of Least Privilege (PoLP)', () => {
    // Applicant capabilities
    assert.ok(RBAC_ROLE_POLICIES.APPLICANT.allowedActions.includes('SUBMIT_CAF'));
    assert.ok(RBAC_ROLE_POLICIES.APPLICANT.allowedActions.includes('CLAIM_FAST_SLA'));
    assert.ok(RBAC_ROLE_POLICIES.APPLICANT.allowedActions.includes('FILE_RTS_APPEAL'));
    assert.strictEqual(RBAC_ROLE_POLICIES.APPLICANT.allowedActions.includes('APPROVE_CLEARANCE'), false);
    assert.strictEqual(RBAC_ROLE_POLICIES.APPLICANT.allowedActions.includes('REASSIGN_APP'), false);

    // Field Officer capabilities
    assert.ok(RBAC_ROLE_POLICIES.OFFICER.allowedActions.includes('SCRUTINIZE_APP'));
    assert.ok(RBAC_ROLE_POLICIES.OFFICER.allowedActions.includes('RAISE_QUERY'));
    assert.ok(RBAC_ROLE_POLICIES.OFFICER.allowedActions.includes('APPROVE_CLEARANCE'));
    assert.strictEqual(RBAC_ROLE_POLICIES.OFFICER.allowedActions.includes('REASSIGN_APP'), false);
    assert.strictEqual(RBAC_ROLE_POLICIES.OFFICER.allowedActions.includes('EDIT_GLOBAL_GRAPH_DEPENDENCIES'), false);

    // Department Admin capabilities
    assert.ok(RBAC_ROLE_POLICIES.DEPT_ADMIN.allowedActions.includes('REASSIGN_APP'));
    assert.ok(RBAC_ROLE_POLICIES.DEPT_ADMIN.allowedActions.includes('EXTEND_SLA_ADMIN'));
    assert.ok(RBAC_ROLE_POLICIES.DEPT_ADMIN.allowedActions.includes('ADJUDICATE_SEC18_APPEAL'));
    assert.strictEqual(RBAC_ROLE_POLICIES.DEPT_ADMIN.allowedActions.includes('OVERRIDE_DEEMED_APPROVAL'), false);
    assert.strictEqual(RBAC_ROLE_POLICIES.DEPT_ADMIN.allowedActions.includes('EMERGENCY_FREEZE_SLA'), false);

    // State Admin capabilities
    assert.ok(RBAC_ROLE_POLICIES.STATE_ADMIN.allowedActions.includes('OVERRIDE_DEEMED_APPROVAL'));
    assert.ok(RBAC_ROLE_POLICIES.STATE_ADMIN.allowedActions.includes('EMERGENCY_FREEZE_SLA'));
    assert.ok(RBAC_ROLE_POLICIES.STATE_ADMIN.allowedActions.includes('ADJUDICATE_SEC19_APPEAL'));
    assert.ok(RBAC_ROLE_POLICIES.STATE_ADMIN.allowedActions.includes('LEVY_OFFICER_PENALTY'));
    assert.ok(RBAC_ROLE_POLICIES.STATE_ADMIN.allowedActions.includes('CONFIGURE_SLA_POLICIES'));
  });

  await t.test('3. Explicit Exclusions for Scope Creep Prevention', () => {
    // Check exclusions exist and are non-empty for all roles
    for (const role of ['APPLICANT', 'OFFICER', 'DEPT_ADMIN', 'STATE_ADMIN']) {
      const exclusions = RBAC_ROLE_POLICIES[role].explicitExclusions;
      assert.ok(exclusions && exclusions.length > 0, `Role ${role} must document explicit exclusions`);
    }

    // State admin has no unlogged access exclusion
    const stateAdminExclusions = RBAC_ROLE_POLICIES.STATE_ADMIN.explicitExclusions.join(' ');
    assert.ok(stateAdminExclusions.includes('NO UNLOGGED ACCESS'), 'State Admin must have NO UNLOGGED ACCESS exclusion');
  });

  await t.test('4. Cross-Cutting Security: Mandatory Multi-Factor Authentication (MFA)', () => {
    // Government staff & admins must have MFA enforced
    assert.strictEqual(RBAC_ROLE_POLICIES.APPLICANT.mfaEnforced, false, 'Applicant MFA is standard SMS/OTP');
    assert.strictEqual(RBAC_ROLE_POLICIES.OFFICER.mfaEnforced, true, 'Officer requires mandatory Parichay MFA');
    assert.strictEqual(RBAC_ROLE_POLICIES.DEPT_ADMIN.mfaEnforced, true, 'Dept Admin requires mandatory Class-3 DSC / MFA');
    assert.strictEqual(RBAC_ROLE_POLICIES.STATE_ADMIN.mfaEnforced, true, 'State Admin requires mandatory Biometric / GovID MFA');
  });

  await t.test('5. Cross-Cutting Compliance: DPDP Act 2023 Purpose Limitation', () => {
    // MPCB tests
    const mpcbPollution = canDepartmentAccessDocument('MPCB', 'POLLUTION_UNDERTAKING');
    assert.strictEqual(mpcbPollution.authorized, true);
    assert.ok(mpcbPollution.statutoryRule.includes('RTS Act 2015 Sec 3(2)'));

    const mpcbPower = canDepartmentAccessDocument('MPCB', 'POWER_LOAD_CALCULATION');
    assert.strictEqual(mpcbPower.authorized, false, 'MPCB should not access Power Load Calculation under DPDP purpose limitation');

    // MSEDCL tests
    const msedclPower = canDepartmentAccessDocument('MSEDCL', 'POWER_LOAD_CALCULATION');
    assert.strictEqual(msedclPower.authorized, true);

    const msedclPollution = canDepartmentAccessDocument('MSEDCL', 'POLLUTION_UNDERTAKING');
    assert.strictEqual(msedclPollution.authorized, false, 'MSEDCL cannot access pollution undertaking');

    // FIRE services tests
    const fireSafety = canDepartmentAccessDocument('FIRE', 'FIRE_SAFETY_SCHEMATIC');
    assert.strictEqual(fireSafety.authorized, true);

    const firePower = canDepartmentAccessDocument('FIRE', 'POWER_LOAD_CALCULATION');
    assert.strictEqual(firePower.authorized, false);
  });

  await t.test('6. RBAC Guard Evaluation: canPerformAction() Matrix Tests', () => {
    // Applicant trying to approve clearance
    const appApprove = canPerformAction('APPLICANT', 'APPROVE_CLEARANCE');
    assert.strictEqual(appApprove.allowed, false);

    // Applicant accessing own dossier vs someone else's dossier
    const appOwn = canPerformAction('APPLICANT', 'SUBMIT_CAF', { isOwner: true });
    assert.strictEqual(appOwn.allowed, true);

    const appOther = canPerformAction('APPLICANT', 'SUBMIT_CAF', { isOwner: false });
    assert.strictEqual(appOther.allowed, false);

    // Field Officer scrutinizing application in own dept vs outside dept
    const offOwnDept = canPerformAction('OFFICER', 'SCRUTINIZE_APP', { departmentMatch: true });
    assert.strictEqual(offOwnDept.allowed, true);

    const offOtherDept = canPerformAction('OFFICER', 'SCRUTINIZE_APP', { departmentMatch: false });
    assert.strictEqual(offOtherDept.allowed, false);

    // State Admin configuring global graph
    const adminConfig = canPerformAction('STATE_ADMIN', 'EDIT_GLOBAL_GRAPH_DEPENDENCIES');
    assert.strictEqual(adminConfig.allowed, true);
  });

  await t.test('7. Evidentiary Audit Hash-Ledger: Cryptographic Chaining & Tamper Detection', () => {
    // Verify pre-seeded ledger
    const seedVerification = verifyHashLedgerChain(SEED_HASH_LEDGER);
    assert.strictEqual(seedVerification.isValid, true, 'Seed ledger chain must be cryptographically valid');

    // Append a new block
    const prevBlock = SEED_HASH_LEDGER[SEED_HASH_LEDGER.length - 1];
    const newBlock = createLedgerBlock(prevBlock, {
      actorRole: 'OFFICER',
      actorId: 'off_001',
      action: 'APPROVE_CLEARANCE',
      resourceId: 'MPCB_CTE',
      details: 'Approved Consent to Establish with 5 statutory environmental conditions.',
    });

    const activeChain = [...SEED_HASH_LEDGER, newBlock];
    const chainVerification = verifyHashLedgerChain(activeChain);
    assert.strictEqual(chainVerification.isValid, true, 'Chained block must validate successfully');
    assert.strictEqual(newBlock.previousHash, prevBlock.currentHash, 'Block previousHash must point to predecessor currentHash');

    // Tamper test: Modify details in an earlier block
    const tamperedChain = activeChain.map((b, idx) => {
      if (idx === 1) {
        return { ...b, details: 'TAMPERED DOSSIER DETAILS HACKED' };
      }
      return b;
    });

    const tamperedVerification = verifyHashLedgerChain(tamperedChain);
    assert.strictEqual(tamperedVerification.isValid, false, 'Tampered ledger chain must fail verification');
    assert.strictEqual(tamperedVerification.brokenIndex, 1, 'Verification must flag the exact tampered block index');
  });

  await t.test('8. Audit Visibility Granularity Enforcement', () => {
    assert.strictEqual(canAccessAuditLogs('APPLICANT', 'SUMMARY_ONLY'), true);
    assert.strictEqual(canAccessAuditLogs('APPLICANT', 'DEPARTMENT_WIDE_AUDIT'), false);
    assert.strictEqual(canAccessAuditLogs('APPLICANT', 'RAW_CRYPTOGRAPHIC_HASH_LEDGER'), false);

    assert.strictEqual(canAccessAuditLogs('OFFICER', 'PERSONAL_TAT_AND_ACTIONS'), true);
    assert.strictEqual(canAccessAuditLogs('OFFICER', 'RAW_CRYPTOGRAPHIC_HASH_LEDGER'), false);

    assert.strictEqual(canAccessAuditLogs('DEPT_ADMIN', 'DEPARTMENT_WIDE_AUDIT'), true);
    assert.strictEqual(canAccessAuditLogs('DEPT_ADMIN', 'RAW_CRYPTOGRAPHIC_HASH_LEDGER'), false);

    assert.strictEqual(canAccessAuditLogs('STATE_ADMIN', 'RAW_CRYPTOGRAPHIC_HASH_LEDGER'), true);
  });

  await t.test('9. Role 1 (Applicant) Scope Isolation & Non-Escalation Protection', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    // 1. Verify strict PoLP actions
    const forbiddenApplicantActions = [
      'SCRUTINIZE_APP',
      'APPROVE_CLEARANCE',
      'REJECT_CLEARANCE',
      'REASSIGN_APP',
      'EDIT_GLOBAL_GRAPH_DEPENDENCIES',
      'CONFIGURE_SLA_POLICIES',
      'OVERRIDE_DEEMED_APPROVAL',
      'EMERGENCY_FREEZE_SLA',
      'LEVY_OFFICER_PENALTY'
    ];
    for (const act of forbiddenApplicantActions) {
      const res = canPerformAction('APPLICANT', act);
      assert.strictEqual(res.allowed, false, `Applicant must NOT be permitted to execute ${act}`);
    }

    // 2. Verify allowed Applicant actions
    assert.strictEqual(canPerformAction('APPLICANT', 'SUBMIT_CAF').allowed, true);
    assert.strictEqual(canPerformAction('APPLICANT', 'CLAIM_FAST_SLA').allowed, true);
    assert.strictEqual(canPerformAction('APPLICANT', 'RESPOND_QUERY').allowed, true);
    assert.strictEqual(canPerformAction('APPLICANT', 'UPLOAD_PASSPORT_DOC').allowed, true);
    assert.strictEqual(canPerformAction('APPLICANT', 'FILE_RTS_APPEAL').allowed, true);

    // 3. Verify Officer page has 403 Forbidden gate for Applicant
    const officerPagePath = path.join(process.cwd(), 'src/app/officer/page.tsx');
    const officerContent = fs.readFileSync(officerPagePath, 'utf-8');
    assert.ok(officerContent.includes("activeRole === 'APPLICANT'"), 'Officer page must check activeRole === APPLICANT');
    assert.ok(officerContent.includes('403 Forbidden: Officer Scrutiny Desk Restricted'), 'Officer page must show 403 gate for Applicant');

    // 4. Verify Admin page has 403 Forbidden gate for Applicant
    const adminPagePath = path.join(process.cwd(), 'src/app/admin/page.tsx');
    const adminContent = fs.readFileSync(adminPagePath, 'utf-8');
    assert.ok(adminContent.includes("activeRole === 'APPLICANT'"), 'Admin page must check activeRole === APPLICANT');
    assert.ok(adminContent.includes('403 Forbidden: State Administrator Console Restricted'), 'Admin page must show 403 gate for Applicant');

    // 5. Verify NavigationHeader enforces the 5 Applicant modules
    const navPath = path.join(process.cwd(), 'src/components/navbar/NavigationHeader.tsx');
    const navContent = fs.readFileSync(navPath, 'utf-8');
    assert.ok(navContent.includes('/portal/applications'), 'Must link to Overview');
    assert.ok(navContent.includes('/portal/profile'), 'Must link to Project Profile');
    assert.ok(navContent.includes('/portal/journey'), 'Must link to Approval Journey');
    assert.ok(navContent.includes('/portal/documents'), 'Must link to Documents');
    assert.ok(navContent.includes('/portal/chat'), 'Must link to Access to Chatbot');
    assert.ok(navContent.includes('⚡ Aegis EV'), 'Must include Aegis EV persona');
    assert.ok(navContent.includes('💊 Vanguard Pharma'), 'Must include Vanguard Pharma persona');
    assert.ok(navContent.includes('☀️ Helios Solar'), 'Must include Helios Solar persona');
    assert.ok(navContent.includes('🌾 Godavari Agro'), 'Must include Godavari Agro persona');
  });

  await t.test('10. Role 2 (Officer) Capabilities, Scope Constraints, and DPDP Enforcement', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    // 1. Role Metadata & Hierarchy
    const policy = RBAC_ROLE_POLICIES.OFFICER;
    assert.strictEqual(policy.hierarchyLevel, 2, 'Officer must be hierarchy level 2');
    assert.strictEqual(policy.viewScope, 'DEPARTMENT_WIDE', 'Officer scope must be DEPARTMENT_WIDE');
    assert.strictEqual(policy.auditVisibility, 'PERSONAL_TAT_AND_ACTIONS');
    assert.strictEqual(policy.mfaEnforced, true, 'Officer must have mandatory MFA');

    // 2. Allowed Actions (PoLP)
    assert.strictEqual(canPerformAction('OFFICER', 'SCRUTINIZE_APP').allowed, true);
    assert.strictEqual(canPerformAction('OFFICER', 'RAISE_QUERY').allowed, true);
    assert.strictEqual(canPerformAction('OFFICER', 'APPROVE_CLEARANCE').allowed, true);
    assert.strictEqual(canPerformAction('OFFICER', 'REJECT_CLEARANCE').allowed, true);
    assert.strictEqual(canPerformAction('OFFICER', 'VERIFY_NODE_DOC').allowed, true);
    assert.strictEqual(canPerformAction('OFFICER', 'LOG_INSPECTION_FINDINGS').allowed, true);
    assert.strictEqual(canPerformAction('OFFICER', 'PAUSE_SLA_CLOCK').allowed, true);

    // 3. Explicit Exclusions (Scope Creep Prevention)
    const forbiddenOfficerActions = [
      'REASSIGN_APP',
      'OVERRIDE_DEEMED_APPROVAL',
      'EMERGENCY_FREEZE_SLA',
      'EDIT_GLOBAL_GRAPH_DEPENDENCIES',
      'CONFIGURE_SLA_POLICIES',
      'LEVY_OFFICER_PENALTY',
      'SUBMIT_CAF',
      'CLAIM_FAST_SLA',
      'ADJUDICATE_SEC18_APPEAL',
      'ADJUDICATE_SEC19_APPEAL'
    ];
    for (const act of forbiddenOfficerActions) {
      const res = canPerformAction('OFFICER', act);
      assert.strictEqual(res.allowed, false, `Officer must NOT be permitted to execute ${act}`);
    }

    // 4. Department Scope Isolation
    const ownDept = canPerformAction('OFFICER', 'SCRUTINIZE_APP', { departmentMatch: true });
    assert.strictEqual(ownDept.allowed, true, 'Officer should scrutinize own department dossier');

    const otherDept = canPerformAction('OFFICER', 'SCRUTINIZE_APP', { departmentMatch: false });
    assert.strictEqual(otherDept.allowed, false, 'Officer must NOT scrutinize other department dossiers');
    assert.ok(otherDept.reason.includes('other statutory departments'));

    // 5. DPDP Act 2023 Purpose Limitation Checks for Officers
    assert.strictEqual(canDepartmentAccessDocument('MPCB', 'POLLUTION_UNDERTAKING').authorized, true);
    assert.strictEqual(canDepartmentAccessDocument('MPCB', 'POWER_LOAD_CALCULATION').authorized, false);
    assert.strictEqual(canDepartmentAccessDocument('DISH', 'FIRE_SAFETY_SCHEMATIC').authorized, true);
    assert.strictEqual(canDepartmentAccessDocument('DISH', 'POLLUTION_UNDERTAKING').authorized, false);
    assert.strictEqual(canDepartmentAccessDocument('MSEDCL', 'POWER_LOAD_CALCULATION').authorized, true);
    assert.strictEqual(canDepartmentAccessDocument('FIRE', 'FIRE_SAFETY_SCHEMATIC').authorized, true);

    // 6. UI Gate Check on Admin Page: Officer must be gated with 403 Forbidden
    const adminPagePath = path.join(process.cwd(), 'src/app/admin/page.tsx');
    const adminContent = fs.readFileSync(adminPagePath, 'utf-8');
    assert.ok(adminContent.includes("activeRole === 'OFFICER'"), 'Admin page must check activeRole === OFFICER');
    assert.ok(adminContent.includes('403 Forbidden: State Administrator Console Restricted'), 'Admin page must show 403 gate for Officer');

    // 7. SmartQueueTable component supports REJECT and DPDP badges
    const queueTablePath = path.join(process.cwd(), 'src/components/officer/SmartQueueTable.tsx');
    const queueContent = fs.readFileSync(queueTablePath, 'utf-8');
    assert.ok(queueContent.includes('Issue Statutory Rejection'), 'Queue table must have rejection button');
    assert.ok(queueContent.includes('canDepartmentAccessDocument'), 'Queue table must use DPDP document guard');
  });

  await t.test('11. Role 3 (Department Officer / DEPT_ADMIN) Capabilities, Scope Constraints, and Escalations', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    // 1. Role Metadata & Hierarchy
    const policy = RBAC_ROLE_POLICIES.DEPT_ADMIN;
    assert.strictEqual(policy.hierarchyLevel, 3, 'Dept Admin must be hierarchy level 3');
    assert.strictEqual(policy.viewScope, 'DEPARTMENT_WIDE', 'Dept Admin scope must be DEPARTMENT_WIDE');
    assert.strictEqual(policy.auditVisibility, 'DEPARTMENT_WIDE_AUDIT', 'Dept Admin audit must be DEPARTMENT_WIDE_AUDIT');
    assert.strictEqual(policy.mfaEnforced, true, 'Dept Admin must have mandatory MFA (Class-3 DSC Pin + TOTP)');

    // 2. Allowed Actions (PoLP)
    const allowedDeptAdminActions = [
      'SCRUTINIZE_APP',
      'RAISE_QUERY',
      'APPROVE_CLEARANCE',
      'REJECT_CLEARANCE',
      'REASSIGN_APP',
      'VERIFY_NODE_DOC',
      'CROSS_DEPT_PULL',
      'SCHEDULE_JOINT_INSPECTION',
      'LOG_INSPECTION_FINDINGS',
      'EXTEND_SLA_ADMIN',
      'ADJUDICATE_SEC18_APPEAL',
      'VIEW_PUBLIC_GRAPH',
      'EDIT_DEPT_CHECKLIST',
      'VIEW_DEPT_AUDIT_LOGS'
    ];
    for (const act of allowedDeptAdminActions) {
      assert.strictEqual(canPerformAction('DEPT_ADMIN', act).allowed, true, `DEPT_ADMIN must be allowed to execute ${act}`);
    }

    // 3. Explicit Exclusions (Scope Creep Prevention)
    const forbiddenDeptAdminActions = [
      'EDIT_GLOBAL_GRAPH_DEPENDENCIES', // Only STATE_ADMIN can edit Neo4j edges
      'CONFIGURE_SLA_POLICIES',        // Only STATE_ADMIN can change statutory SLA thresholds
      'OVERRIDE_DEEMED_APPROVAL',      // Only STATE_ADMIN can override deemed approval bot
      'EMERGENCY_FREEZE_SLA',          // Only STATE_ADMIN can freeze state-wide clock
      'LEVY_OFFICER_PENALTY',          // Only STATE_ADMIN (Appellate Tribunal) can levy penalties
      'ADJUDICATE_SEC19_APPEAL',       // Only STATE_ADMIN (Chief RTS Commissioner) can hear 2nd appeal
      'SUBMIT_CAF',                    // Applicant only
      'CLAIM_FAST_SLA'                 // Applicant only
    ];
    for (const act of forbiddenDeptAdminActions) {
      const res = canPerformAction('DEPT_ADMIN', act);
      assert.strictEqual(res.allowed, false, `DEPT_ADMIN must NOT be permitted to execute ${act}`);
    }

    // 4. Sister Department Exclusions vs Cross-Department Pull
    const sisterDeptScrutiny = canPerformAction('DEPT_ADMIN', 'SCRUTINIZE_APP', { departmentMatch: false });
    assert.strictEqual(sisterDeptScrutiny.allowed, false, 'DEPT_ADMIN cannot scrutinize sister department dossier');
    assert.ok(sisterDeptScrutiny.reason.includes('sister statutory departments'));

    const sisterDeptApproval = canPerformAction('DEPT_ADMIN', 'APPROVE_CLEARANCE', { departmentMatch: false });
    assert.strictEqual(sisterDeptApproval.allowed, false, 'DEPT_ADMIN cannot approve sister department clearance');

    const crossDeptPull = canPerformAction('DEPT_ADMIN', 'CROSS_DEPT_PULL', { departmentMatch: false });
    assert.strictEqual(crossDeptPull.allowed, true, 'DEPT_ADMIN CAN initiate RTS Sec 3(2) document pull from sister department');

    // 5. Database Escalation Operations: Reassignment & 7-Day SLA Extension in application-db.ts
    const dbPath = path.join(process.cwd(), 'src/lib/db/application-db.ts');
    const dbContent = fs.readFileSync(dbPath, 'utf-8');
    assert.ok(dbContent.includes('public reassignOfficer('), 'Application DB must implement reassignOfficer()');
    assert.ok(dbContent.includes('public extendSlaAdmin('), 'Application DB must implement extendSlaAdmin()');
    assert.ok(dbContent.includes('public crossDeptPull('), 'Application DB must implement crossDeptPull()');
    assert.ok(dbContent.includes('Emergency Administrative SLA Extension (+'), 'Must record emergency extension in timeline');
    assert.ok(dbContent.includes('Application Reassigned from'), 'Must record reassignment in timeline');

    // 5b. Route PATCH API Handler supports DEPT_ADMIN actions
    const routePath = path.join(process.cwd(), 'src/app/api/v1/applications/route.ts');
    const routeContent = fs.readFileSync(routePath, 'utf-8');
    assert.ok(routeContent.includes("case 'REASSIGN':"), 'PATCH API must handle REASSIGN action');
    assert.ok(routeContent.includes("case 'EXTEND_SLA':"), 'PATCH API must handle EXTEND_SLA action');
    assert.ok(routeContent.includes("case 'CROSS_DEPT_PULL':"), 'PATCH API must handle CROSS_DEPT_PULL action');

    // 6. UI Check: SmartQueueTable has dedicated DEPT_ADMIN action buttons
    const queueTablePath = path.join(process.cwd(), 'src/components/officer/SmartQueueTable.tsx');
    const queueContent = fs.readFileSync(queueTablePath, 'utf-8');
    assert.ok(queueContent.includes('Reassign Application Desk'), 'Queue table must have Reassign button for DEPT_ADMIN');
    assert.ok(queueContent.includes('Grant 7-Day SLA Extension'), 'Queue table must have 7-Day SLA Extension button for DEPT_ADMIN');
    assert.ok(queueContent.includes('Pull RTS Sec 3(2) Doc'), 'Queue table must have RTS 3(2) Doc Pull button for DEPT_ADMIN');

    // 7. UI Check: Officer Page supports Directorate Head switcher
    const officerPagePath = path.join(process.cwd(), 'src/app/officer/page.tsx');
    const officerContent = fs.readFileSync(officerPagePath, 'utf-8');
    assert.ok(officerContent.includes('Change Directorate Head'), 'Officer page must support Directorate Head switcher');
    assert.ok(officerContent.includes('Hierarchy Level 3: Department Directorate Head'), 'Officer page must show Level 3 badge');
  });

  await t.test('12. Role 4 (State Administrator / STATE_ADMIN) Apex Authority, Exclusions, and Immutable Audit', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const { logStateAdminVaultAccess, verifyHashLedgerChain, SEED_HASH_LEDGER } = await import('../lib/rbac/permissions.ts');

    // 1. Role Metadata & Hierarchy
    const policy = RBAC_ROLE_POLICIES.STATE_ADMIN;
    assert.strictEqual(policy.hierarchyLevel, 4, 'State Admin must be hierarchy level 4');
    assert.strictEqual(policy.viewScope, 'STATE_WIDE', 'State Admin scope must be STATE_WIDE');
    assert.strictEqual(policy.auditVisibility, 'RAW_CRYPTOGRAPHIC_HASH_LEDGER', 'State Admin audit must be RAW_CRYPTOGRAPHIC_HASH_LEDGER');
    assert.strictEqual(policy.mfaEnforced, true, 'State Admin must have mandatory MFA (NIC GovID / Biometric / FIDO2)');

    // 2. Allowed Actions (PoLP)
    const allowedStateAdminActions = [
      'REASSIGN_APP',
      'OVERRIDE_DEEMED_APPROVAL',
      'EMERGENCY_FREEZE_SLA',
      'ADJUDICATE_SEC19_APPEAL',
      'LEVY_OFFICER_PENALTY',
      'EDIT_GLOBAL_GRAPH_DEPENDENCIES',
      'CONFIGURE_SLA_POLICIES',
      'VIEW_RAW_HASH_LEDGER',
      'SCRUTINIZE_APP',
      'CROSS_DEPT_PULL',
      'VIEW_ALL_PASSPORT',
      'SCHEDULE_JOINT_INSPECTION',
      'MANDATE_STATE_INSPECTION',
      'EXTEND_SLA_ADMIN',
      'VIEW_PUBLIC_GRAPH',
      'EDIT_DEPT_CHECKLIST'
    ];
    for (const act of allowedStateAdminActions) {
      assert.strictEqual(canPerformAction('STATE_ADMIN', act).allowed, true, `STATE_ADMIN must be allowed to execute ${act}`);
    }

    // 3. Explicit Exclusions
    assert.strictEqual(canPerformAction('STATE_ADMIN', 'SUBMIT_CAF').allowed, false, 'STATE_ADMIN cannot submit applicant CAF');
    assert.strictEqual(canPerformAction('STATE_ADMIN', 'CLAIM_FAST_SLA').allowed, false, 'STATE_ADMIN cannot claim fast SLA');

    // 4. NO UNLOGGED ACCESS: State Admin Vault Inspection Guard
    const silentAccess = canPerformAction('STATE_ADMIN', 'VIEW_ALL_PASSPORT', { hasStatutoryJustification: false });
    assert.strictEqual(silentAccess.allowed, false, 'State Admin cannot silently browse vault without justification');
    assert.ok(silentAccess.reason.includes('NO UNLOGGED ACCESS'));

    const loggedAccess = canPerformAction('STATE_ADMIN', 'VIEW_ALL_PASSPORT', { hasStatutoryJustification: true });
    assert.strictEqual(loggedAccess.allowed, true, 'State Admin can access vault when statutory justification is recorded');

    // 5. Immutable Hash-Ledger Logging of State Admin Access
    const lastBlock = SEED_HASH_LEDGER[SEED_HASH_LEDGER.length - 1];
    const auditBlock = logStateAdminVaultAccess(
      'state_adm_001',
      'doc_aegis_fire_safety_cad',
      'RTS Section 19 Second Appeal hearing verification',
      lastBlock
    );
    assert.strictEqual(auditBlock.actorRole, 'STATE_ADMIN');
    assert.strictEqual(auditBlock.action, 'VIEW_ALL_PASSPORT');
    assert.ok(auditBlock.details.includes('RTS Section 19 Second Appeal'));
    assert.strictEqual(auditBlock.previousHash, lastBlock.currentHash);

    const testChain = [...SEED_HASH_LEDGER, auditBlock];
    const chainVerification = verifyHashLedgerChain(testChain);
    assert.strictEqual(chainVerification.isValid, true, 'Audit log block must cryptographically validate in chain');

    // 6. Security Gates: Verify Admin page 403 checks and restricts all lower tiers
    const adminPagePath = path.join(process.cwd(), 'src/app/admin/page.tsx');
    const adminContent = fs.readFileSync(adminPagePath, 'utf-8');
    assert.ok(adminContent.includes("activeRole === 'APPLICANT'"), 'Admin page must check APPLICANT');
    assert.ok(adminContent.includes("activeRole === 'OFFICER'"), 'Admin page must check OFFICER');
    assert.ok(adminContent.includes("activeRole === 'DEPT_ADMIN'"), 'Admin page must check DEPT_ADMIN');
    assert.ok(adminContent.includes('403 Forbidden: State Administrator Console Restricted'), 'Admin page must display 403 gate');

    // 7. UI Check: State Admin Banner and Evaluator Switcher
    assert.ok(adminContent.includes('Hierarchy Level 4: State Administrator'), 'Admin page must show Level 4 badge');
    assert.ok(adminContent.includes('Change Apex Administrator'), 'Admin page must have State Admin switcher');
    assert.ok(adminContent.includes('PRINCIPAL_SECRETARY'), 'Must include Principal Secretary persona');
    assert.ok(adminContent.includes('CEO_MAITRI'), 'Must include CEO MAITRI persona');
    assert.ok(adminContent.includes('EODB_COMMISSIONER'), 'Must include RTS Commissioner persona');
  });
});




