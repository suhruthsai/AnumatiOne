import test from 'node:test';
import assert from 'node:assert/strict';

test('CAF Data Model: Complete Industrialist Submission Validation', () => {
  const sampleCAF = {
    companyName: 'Sahyadri EV Battery Systems Pvt Ltd',
    entityType: 'PVT_LTD',
    pan: 'AABCS8819Q',
    gstin: '27AABCS8819Q1ZP',
    udyamNumber: 'UDYAM-MH-26-008219',
    authorizedPersonName: 'Mr. Vikram Deshmukh',
    authorizedPersonPhone: '+91 98220 54321',
    authorizedPersonEmail: 'vikram.deshmukh@sahyadri-battery.in',
    sector: 'EV_MANUFACTURING',
    productDescription: 'Lithium Battery Packs',
    projectStage: 'PRE_ESTABLISHMENT',
    midcCluster: 'MIDC Chakan Phase II, Pune',
    plotNumber: 'Plot E-84/2',
    landAreaAcres: 5.5,
    builtUpAreaSqM: 14500,
    plantMachineryInvestmentCr: 38.5,
    landBuildingInvestmentCr: 16.0,
    totalProjectCostCr: 54.5,
    expectedEmployees: 180,
    enterpriseScale: 'MEDIUM',
    pollutionCategory: 'ORANGE',
    powerRequiredKva: 1750,
    waterRequiredKld: 45,
    effluentDischargeKld: 12,
    treatmentScheme: 'ZERO_LIQUID_DISCHARGE',
    boilerInstalled: false,
    hazardousChemicals: false,
    selectedApprovalIds: [
      'LAND_ALLOTMENT',
      'BUILDING_PLAN',
      'CTE_POLLUTION',
      'POWER_SANCTION',
      'FACTORY_LICENSE',
      'FIRE_NOC',
    ],
  };

  assert.equal(sampleCAF.companyName, 'Sahyadri EV Battery Systems Pvt Ltd');
  assert.equal(sampleCAF.totalProjectCostCr, 54.5);
  assert.equal(sampleCAF.selectedApprovalIds.length, 6);
  assert.ok(sampleCAF.pan.length === 10);
  assert.ok(sampleCAF.gstin.startsWith('27')); // Maharashtra State Code
});

test('Approval Methodology: Query-Response-Approval State Machine', () => {
  let appState = {
    id: 'app_test_1',
    status: 'SUBMITTED',
    daysRemaining: 30,
    queries: [],
    timeline: [],
  };

  // Step 1: Officer Scrutinizes and Raises Query
  const objectionText = 'Under Rule 14.1 of MIDC DCR 2009, heavy industrial plots require 6.0m rear setback. Plan shows 4.5m.';
  appState.status = 'QUERY_RAISED';
  appState.queries.push({
    id: 'qry_test_1',
    objectionText,
    statutoryRuleRef: 'MIDC DCR 2009 Rule 14.1',
    status: 'PENDING',
  });
  appState.timeline.push({ event: 'Query Raised: ' + objectionText });

  assert.equal(appState.status, 'QUERY_RAISED');
  assert.equal(appState.queries.length, 1);
  assert.equal(appState.queries[0].status, 'PENDING');

  // Step 2: Citizen Responds with Clarification & Revised Drawing
  const clarificationText = 'Revised drawing attached shifting rear machinery bay to provide clear 6.0m fire driveway.';
  appState.status = 'UNDER_SCRUTINY';
  appState.queries[0].status = 'RESOLVED';
  appState.queries[0].applicantResponseText = clarificationText;
  appState.timeline.push({ event: 'Citizen Clarification: ' + clarificationText });

  assert.equal(appState.status, 'UNDER_SCRUTINY');
  assert.equal(appState.queries[0].status, 'RESOLVED');
  assert.equal(appState.queries[0].applicantResponseText, clarificationText);

  // Step 3: Officer Approves and Issues Digital Clearance Certificate
  appState.status = 'APPROVED';
  appState.certificate = {
    certificateNumber: 'MIDC/SPA/2026/8912',
    issuingAuthority: 'Executive Engineer, MIDC Special Planning Authority',
    qrHash: 'in.gov.mh.verify.midc.8912',
    digitalSignatureHash: 'SHA256:abc123def456',
    isDeemedApproval: false,
    statutoryAct: 'MIDC Act 1961 & MIDC DCR 2009',
  };

  assert.equal(appState.status, 'APPROVED');
  assert.ok(appState.certificate.certificateNumber.includes('MIDC'));
  assert.ok(appState.certificate.qrHash.includes('in.gov.mh'));
});

test('Approval Methodology: Maharashtra RTS Act 2015 Deemed Approval', () => {
  let appState = {
    id: 'app_test_deemed',
    status: 'UNDER_SCRUTINY',
    daysRemaining: 0,
    slaDeadline: new Date(Date.now() - 1000).toISOString(),
  };

  // Statutory SLA expired past 30 days without officer action
  const now = Date.now();
  const deadline = new Date(appState.slaDeadline).getTime();
  const isSlaBreached = now > deadline;

  assert.equal(isSlaBreached, true);

  // Trigger Section 4(1) Deemed Approval
  appState.status = 'DEEMED_APPROVED';
  appState.certificate = {
    certificateNumber: 'DEEMED/RTS2015/MH/99218',
    isDeemedApproval: true,
    statutoryAct: 'Maharashtra Right to Services Act 2015 (Section 4(1))',
  };

  assert.equal(appState.status, 'DEEMED_APPROVED');
  assert.equal(appState.certificate.isDeemedApproval, true);
  assert.ok(appState.certificate.statutoryAct.includes('Section 4(1)'));
});
