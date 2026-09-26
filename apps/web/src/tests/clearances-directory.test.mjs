import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

test('AnumatiOne Clearances & Approvals Directory (Microsoft Fluent 2 Redesign)', async (t) => {
  const pagePath = path.join(process.cwd(), 'src/app/portal/clearances/page.tsx');
  const navHeaderPath = path.join(process.cwd(), 'src/components/navbar/NavigationHeader.tsx');
  const landingPagePath = path.join(process.cwd(), 'src/app/page.tsx');

  assert.ok(fs.existsSync(pagePath), 'Clearances directory page must exist at src/app/portal/clearances/page.tsx');
  assert.ok(fs.existsSync(navHeaderPath), 'NavigationHeader.tsx must exist');
  assert.ok(fs.existsSync(landingPagePath), 'page.tsx must exist');

  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  const navContent = fs.readFileSync(navHeaderPath, 'utf-8');
  const landingContent = fs.readFileSync(landingPagePath, 'utf-8');

  await t.test('1. Architecture & Fluent 2 design structure', () => {
    assert.ok(pageContent.includes('use client'), 'Must be a client component for interactive filtering');
    assert.ok(pageContent.includes('backdrop-blur'), 'Must incorporate Fluent acrylic glassmorphic design');
    assert.ok(pageContent.includes('STATUTORY_CLEARANCES'), 'Must define rich structured clearances catalogue');
    assert.ok(pageContent.includes('export default function ClearancesDirectoryPage'), 'Must export the page component');
  });

  await t.test('2. Four-stage lifecycle pivot is fully represented', () => {
    assert.ok(pageContent.includes('PRE_ESTABLISHMENT'), 'Must support Pre-Establishment stage');
    assert.ok(pageContent.includes('PRE_OPERATION'), 'Must support Pre-Operation stage');
    assert.ok(pageContent.includes('GREEN_CHANNEL'), 'Must support Green Channel 48-Hr fast-track stage');
    assert.ok(pageContent.includes('ANNUAL_RETURNS'), 'Must support Statutory Annual Returns stage');
  });

  await t.test('3. Key Maharashtra statutory authorities and approvals are included', () => {
    const requiredDepartments = ['MPCB', 'MIDC', 'DISH', 'MSEDCL', 'FIRE', 'BOILERS'];
    for (const dept of requiredDepartments) {
      assert.ok(pageContent.includes(dept), `Must include clearance from statutory department: ${dept}`);
    }

    // Key specific clearances
    assert.ok(pageContent.includes('Consent to Establish (CTE)'), 'Must include MPCB CTE');
    assert.ok(pageContent.includes('Consent to Operate (CTO)'), 'Must include MPCB CTO');
    assert.ok(pageContent.includes('Factory License & Plan Approval'), 'Must include DISH Factory License');
    assert.ok(pageContent.includes('HT 11kV/22kV/33kV Power Load Release'), 'Must include MSEDCL HT clearance');
    assert.ok(pageContent.includes('Provisional Fire Safety NOC'), 'Must include Fire NOC');
    assert.ok(pageContent.includes('High-Pressure Steam Boiler Registration'), 'Must include Boiler clearance');
  });

  await t.test('4. Legal acts and RTS Act 2015 SLA provisions are accurately cited', () => {
    assert.ok(pageContent.includes('Maharashtra RTS Act 2015'), 'Must cite RTS Act 2015');
    assert.ok(pageContent.includes('Water Act 1974 & Air Act 1981'), 'Must cite Water and Air Acts');
    assert.ok(pageContent.includes('Maharashtra Factories Rules 1963 & Factories Act 1948'), 'Must cite Factories Act');
    assert.ok(pageContent.includes('Indian Boiler Regulations (IBR) 1950'), 'Must cite Boilers Act/IBR');
    assert.ok(pageContent.includes('Deemed Approval'), 'Must cite deemed approval protection');
  });

  await t.test('5. Interactive fee & timeline estimator widget is implemented', () => {
    assert.ok(pageContent.includes('Interactive Statutory Clearance Estimator'), 'Estimator title must be present');
    assert.ok(pageContent.includes('estInvestment'), 'Must support FCI capital investment calculation');
    assert.ok(pageContent.includes('estLandType'), 'Must support MIDC vs Private Land estimation switch');
    assert.ok(pageContent.includes('Parallel Makespan'), 'Must calculate parallel clearance makespan');
    assert.ok(pageContent.includes('PSI 2019 SGST Refund'), 'Must calculate Package Scheme of Incentives benefit');
  });

  await t.test('6. MahaVault Section 3(2) data reuse and 1-Click CAF apply integration', () => {
    assert.ok(pageContent.includes('MahaVault Auto-Attach'), 'Must indicate auto-attached verified documents');
    assert.ok(pageContent.includes('/portal/apply?approval='), 'Must provide 1-click single-window CAF links with approval query param');
    assert.ok(pageContent.includes('Apply in Single-Window CAF'), 'Must display direct application CTA');
  });

  await t.test('7. Header navigation and landing page hero link to Clearances Directory', () => {
    assert.ok(navContent.includes('/portal/clearances'), 'Navigation header must link to /portal/clearances');
    assert.ok(landingContent.includes('/portal/clearances'), 'Landing page hero must link to /portal/clearances');
  });
});
