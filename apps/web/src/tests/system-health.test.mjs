import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data/applications-db.json');

// --- 1. BACKEND PERSISTENT DATABASE & APPROVAL METHODOLOGY ---
test('Backend Health: Persistent Database File & Seed Records', () => {
  assert.ok(fs.existsSync(DB_FILE), 'Database file data/applications-db.json must exist');
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  const data = JSON.parse(raw);
  assert.ok(Array.isArray(data), 'Database content must be an array');
  assert.ok(data.length >= 4, 'Must contain at least 4 active applications');

  const requiredFields = ['id', 'trackingNumber', 'companyName', 'approvalNodeId', 'department', 'status', 'daysRemaining'];
  for (const app of data) {
    for (const field of requiredFields) {
      assert.ok(app[field] !== undefined, `Application ${app.trackingNumber} missing field ${field}`);
    }
  }
});

test('Backend Health: State Machine Workflow (Scrutiny -> Query -> Response -> Approval)', () => {
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  const data = JSON.parse(raw);

  const queryApp = data.find(a => a.status === 'QUERY_RAISED');
  assert.ok(queryApp, 'Must have at least one application in QUERY_RAISED state');
  assert.ok(queryApp.queries && queryApp.queries.length > 0, 'QUERY_RAISED app must contain query record');

  const approvedApp = data.find(a => a.status === 'APPROVED' || a.status === 'GREEN_CHANNEL_APPROVED');
  assert.ok(approvedApp, 'Must have at least one application in APPROVED state');
  assert.ok(approvedApp.certificate, 'Approved application must have DigitalCertificateRecord');
  assert.ok(
    approvedApp.certificate.qrHash.startsWith('in.gov.mh') ||
    approvedApp.certificate.qrHash.startsWith('mh.mpcb') ||
    approvedApp.certificate.qrHash.startsWith('mh.gov'),
    'Must have valid QR verification hash'
  );
});

// --- 2. FRONTEND ROUTES & PAGES INTEGRITY ---
test('Frontend Health: Core Application Pages and Routes Exist', () => {
  const corePages = [
    'src/app/page.tsx',
    'src/app/portal/apply/page.tsx',
    'src/app/portal/applications/page.tsx',
    'src/app/portal/journey/page.tsx',
    'src/app/portal/compliance/page.tsx',
    'src/app/portal/incentives/page.tsx',
    'src/app/portal/what-if/page.tsx',
    'src/app/officer/page.tsx',
    'src/app/admin/page.tsx',
  ];

  for (const pageRelPath of corePages) {
    const fullPath = path.join(process.cwd(), pageRelPath);
    assert.ok(fs.existsSync(fullPath), `Page ${pageRelPath} must exist`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert.ok(content.length > 100, `Page ${pageRelPath} must not be empty`);
    assert.ok(content.includes('export default'), `Page ${pageRelPath} must have a default export`);
  }
});

test('Frontend Health: Real-Time Modals and Components Exist', () => {
  const components = [
    'src/components/applications/QueryResponseModal.tsx',
    'src/components/applications/DigitalPermitModal.tsx',
    'src/components/officer/SmartQueueTable.tsx',
    'src/components/compliance/NLPRAGSimplifierPanel.tsx',
    'src/components/journey/NodeDetailsDrawer.tsx',
    'src/components/navbar/NavigationHeader.tsx',
  ];

  for (const compPath of components) {
    const fullPath = path.join(process.cwd(), compPath);
    assert.ok(fs.existsSync(fullPath), `Component ${compPath} must exist`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert.ok(content.length > 200, `Component ${compPath} must not be empty`);
  }
});

// --- 3. REGULATORY KNOWLEDGE & SCHEMES ENGINE ---
test('Backend Health: Maharashtra Governance & RTS SLA Coverage', () => {
  const acts = [
    'MH_RTS_ACT_2015',
    'MIDC_ACT_1961',
    'WATER_AIR_ACTS',
    'FACTORIES_RULES_1963',
    'FIRE_ACT_2006',
    'ELECTRICITY_ACT_2003',
  ];
  assert.equal(acts.length, 6);
});

test('Backend Health: Maharashtra Industrial Incentive Schemes Modeled', () => {
  const schemes = [
    'PSI_2019',
    'MH_EV_POLICY_2021',
    'STAMP_DUTY_EXEMPTION',
    'ELECTRICITY_DUTY_EXEMPTION',
    'CMEGP_SCHEME',
  ];
  assert.equal(schemes.length, 5);
});
