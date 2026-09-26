import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('SIH 26130 Enterprise RBAC & Dual-Portal Architecture', async (t) => {
  const storeFilePath = path.join(process.cwd(), 'src/lib/store.ts');
  assert.ok(fs.existsSync(storeFilePath), 'Zustand store must exist at src/lib/store.ts');
  const storeContent = fs.readFileSync(storeFilePath, 'utf-8');

  await t.test('1. Seed Industrialist accounts comply with Maharashtra regulatory criteria', () => {
    // Verify SEED_INDUSTRIALISTS is exported and contains all 4 major sector personas
    assert.ok(storeContent.includes('export const SEED_INDUSTRIALISTS'), 'Must export SEED_INDUSTRIALISTS');
    assert.ok(storeContent.includes('EV_PUNE'), 'Must include EV_PUNE persona');
    assert.ok(storeContent.includes('PHARMA_AURIC'), 'Must include PHARMA_AURIC persona');
    assert.ok(storeContent.includes('FOOD_NASHIK'), 'Must include FOOD_NASHIK persona');
    assert.ok(storeContent.includes('SOLAR_NAGPUR'), 'Must include SOLAR_NAGPUR persona');

    // Verify statutory identifiers present in store definition
    assert.ok(storeContent.includes('27AABCS8819Q1ZP'), 'Must include valid 27-prefix GSTIN for EV');
    assert.ok(storeContent.includes('27AABCV4912K1ZQ'), 'Must include valid 27-prefix GSTIN for Pharma');
    assert.ok(storeContent.includes('UDYAM-MH-26-008219'), 'Must include valid UDYAM-MH identifier');
    assert.ok(storeContent.includes('isKycVerified: true'), 'Industrialists must have verified MahaVault KYC');
  });

  await t.test('2. Seed Government Officers cover all 5 required statutory directorates', () => {
    assert.ok(storeContent.includes('export const SEED_OFFICERS'), 'Must export SEED_OFFICERS');
    const expectedDepts = ['MPCB', 'MIDC', 'DISH', 'MSEDCL', 'FIRE'];
    for (const dept of expectedDepts) {
      assert.ok(
        storeContent.includes(`department: '${dept}'`),
        `Must define authorized officer for department ${dept}`
      );
    }

    assert.ok(storeContent.includes('GOM-MPCB-2016-8812'), 'Officer must have GoM MPCB employee code');
    assert.ok(storeContent.includes('GOM-MIDC-2018-4421'), 'Officer must have GoM MIDC employee code');
    assert.ok(storeContent.includes('GOM-DISH-2014-1109'), 'Officer must have GoM DISH employee code');
    assert.ok(storeContent.includes('GOM-MSEDCL-2015-7731'), 'Officer must have GoM MSEDCL employee code');
    assert.ok(storeContent.includes('GOM-FIRE-2017-3390'), 'Officer must have GoM FIRE employee code');
  });

  await t.test('3. Dedicated Dual Login Gateway file exists with citizen and officer portals', () => {
    const loginFilePath = path.join(process.cwd(), 'src/app/auth/login/page.tsx');
    assert.ok(fs.existsSync(loginFilePath), 'Login portal page must exist at /auth/login');

    const content = fs.readFileSync(loginFilePath, 'utf-8');
    assert.ok(content.includes('Industrialist & Investor Gateway'), 'Must include Industrialist gateway');
    assert.ok(content.includes('Government Official Desk'), 'Must include Official desk');
    assert.ok(content.includes('Parichay'), 'Must mention Parichay SSO');
    assert.ok(content.includes('Jury / Evaluator 1-Click Launchers'), 'Must include 1-click evaluator launcher');
  });

  await t.test('4. Unified Industrialist Dashboard delivers the 4 official problem statement pillars', () => {
    const appPagePath = path.join(process.cwd(), 'src/app/portal/applications/page.tsx');
    assert.ok(fs.existsSync(appPagePath), 'Dashboard page must exist at /portal/applications');

    const content = fs.readFileSync(appPagePath, 'utf-8');
    assert.ok(content.includes('APPLICATIONS'), 'Must include Quadrant 1: Applications');
    assert.ok(content.includes('APPROVALS'), 'Must include Quadrant 2: Approvals');
    assert.ok(content.includes('RENEWALS'), 'Must include Quadrant 3: Renewals');
    assert.ok(content.includes('INCENTIVES'), 'Must include Quadrant 4: Incentives');
    assert.ok(content.includes('MPCB Form V'), 'Must include statutory return Form V');
    assert.ok(content.includes('DISH Form 27'), 'Must include statutory return Form 27');
    assert.ok(content.includes('PSI 2019'), 'Must include PSI 2019 fiscal entitlements');
  });

  await t.test('5. Officer Workspace includes Risk Scrutiny, Joint Inspections, and Delay Analytics', () => {
    const officerPagePath = path.join(process.cwd(), 'src/app/officer/page.tsx');
    assert.ok(fs.existsSync(officerPagePath), 'Officer page must exist at /officer');

    const content = fs.readFileSync(officerPagePath, 'utf-8');
    assert.ok(content.includes('SmartQueueTable') || content.includes('QUEUE'), 'Must include Risk-Based Scrutiny Queue');
    assert.ok(content.includes('Multi-Department Synchronized Joint Site Inspection'), 'Must include Common Inspection Planner');
    assert.ok(content.includes('State-Wide Clearance Makespan & Bottleneck Heatmap'), 'Must include Delay Analytics');
    assert.ok(content.includes('RTS Act 2015 Section 3(2)'), 'Must include RTS Section 3(2) Cross-Acceptance Mechanism');
  });
});
