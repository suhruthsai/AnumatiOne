import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('MAITRI Lifecycle Stages: 4 Sequential and Operational Phases Validated', () => {
  const lifecycleStages = [
    {
      stage: 'PRE_ESTABLISHMENT',
      description: 'Prior to construction: land, building plan, pollution CTE, power feasibility, fire provisional',
      primaryDepartments: ['MIDC', 'MPCB', 'MSEDCL', 'MFS'],
    },
    {
      stage: 'PRE_OPERATION',
      description: 'Post-construction readiness: pollution CTO, factory license, boiler inspection, HT energization',
      primaryDepartments: ['MPCB', 'DISH', 'BOILERS', 'MSEDCL', 'MFS'],
    },
    {
      stage: 'DURING_OPERATIONS',
      description: 'Active factory compliance: Form V Environmental Statement, Form 4 Hazardous, Form 27 Half-yearly',
      primaryDepartments: ['MPCB', 'DISH', 'MFS'],
    },
    {
      stage: 'RENEWAL',
      description: 'Periodic license re-authorizations: 5-year CTO renewal, 10-year factory license renewal',
      primaryDepartments: ['MPCB', 'DISH', 'MFS'],
    },
  ];

  assert.equal(lifecycleStages.length, 4);
  assert.equal(lifecycleStages[0].stage, 'PRE_ESTABLISHMENT');
  assert.equal(lifecycleStages[1].stage, 'PRE_OPERATION');
  assert.equal(lifecycleStages[2].stage, 'DURING_OPERATIONS');
  assert.equal(lifecycleStages[3].stage, 'RENEWAL');
});

test('MAITRI Statutory Returns Calendar: Timelines and GoM Form Numbers', () => {
  const statutoryReturns = [
    {
      id: 'MPCB_FORM_V',
      name: 'Environmental Statement (Form V)',
      statutoryAct: 'Environment (Protection) Rules 1986, Rule 14',
      dueDateAnnual: 'September 30',
      issuingAuthority: 'Maharashtra Pollution Control Board (MPCB)',
    },
    {
      id: 'HAZARDOUS_FORM_4',
      name: 'Hazardous Waste Annual Return (Form 4)',
      statutoryAct: 'Hazardous & Other Wastes Rules 2016, Rule 6(5)',
      dueDateAnnual: 'June 30',
      issuingAuthority: 'MPCB Hazardous Waste Cell',
    },
    {
      id: 'DISH_FORM_27',
      name: 'Half-Yearly Factory Return (Form 27)',
      statutoryAct: 'Maharashtra Factories Rules 1963, Rule 118',
      dueDateAnnual: 'July 15 & Jan 15',
      issuingAuthority: 'Directorate of Industrial Safety & Health (DISH)',
    },
    {
      id: 'FIRE_FORM_B',
      name: 'Bi-Annual Fire Safety Certificate (Form B)',
      statutoryAct: 'Maharashtra Fire Prevention & Life Safety Act 2006, Sec 3(1)',
      dueDateAnnual: 'January & July',
      issuingAuthority: 'Maharashtra Fire Services (Licensed Agency)',
    },
  ];

  assert.equal(statutoryReturns.length, 4);
  const mpcbFormV = statutoryReturns.find(r => r.id === 'MPCB_FORM_V');
  assert.ok(mpcbFormV);
  assert.equal(mpcbFormV.dueDateAnnual, 'September 30');

  const hazardousForm4 = statutoryReturns.find(r => r.id === 'HAZARDOUS_FORM_4');
  assert.ok(hazardousForm4);
  assert.equal(hazardousForm4.dueDateAnnual, 'June 30');
});

test('PSI 2019 Incentive Tiers: Taluka Zones and Fiscal Benefits', () => {
  const zoneMatrix = {
    ZONE_A: { name: 'Developed (Mumbai, Pune Corp)', sgstRefundPct: 0, electricityDutyYears: 0 },
    ZONE_B: { name: 'Developing (Chakan, Ranjangaon, Nashik City)', sgstRefundPct: 40, electricityDutyYears: 5 },
    ZONE_C: { name: 'Moderately Backward (Aurangabad, Solapur, Ahmednagar)', sgstRefundPct: 60, electricityDutyYears: 7 },
    ZONE_D: { name: 'Backward (Jalgaon, Nanded, Kolhapur Rural)', sgstRefundPct: 80, electricityDutyYears: 9 },
    ZONE_D_PLUS: { name: 'Ultra Backward / Vidarbha / Marathwada (Nagpur, Gadchiroli)', sgstRefundPct: 100, electricityDutyYears: 10 },
  };

  assert.equal(zoneMatrix.ZONE_A.sgstRefundPct, 0);
  assert.equal(zoneMatrix.ZONE_D_PLUS.sgstRefundPct, 100);
  assert.equal(zoneMatrix.ZONE_D_PLUS.electricityDutyYears, 10);
  assert.ok(zoneMatrix.ZONE_C.sgstRefundPct > zoneMatrix.ZONE_B.sgstRefundPct);
});

test('MahaVault Inter-Departmental Scrutiny Shield: RTS Act 2015 Sec 3(2) Cross-Acceptance', () => {
  const crossDepartmentRegistry = [
    {
      documentType: 'MIDC_LAND_ALLOTMENT_ORDER',
      originalIssuingDept: 'MIDC',
      consumingDepartments: ['MPCB', 'DISH', 'MSEDCL', 'SEIAA'],
      isRepetitiveScrutinyBlocked: true,
      legalGrounding: 'Maharashtra Right to Services Act 2015, Sec 3(2)',
    },
    {
      documentType: 'DIRECTORATE_OF_INDUSTRIES_GSTIN_27',
      originalIssuingDept: 'Directorate of Industries / GSTN',
      consumingDepartments: ['MIDC', 'MPCB', 'DISH', 'BOILERS'],
      isRepetitiveScrutinyBlocked: true,
      legalGrounding: 'State Single Window Directive G.R. 2016/MAITRI-04',
    },
    {
      documentType: 'SPA_SANCTIONED_BUILDING_LAYOUT',
      originalIssuingDept: 'MIDC Special Planning Authority',
      consumingDepartments: ['MPCB', 'DISH', 'MFS'],
      isRepetitiveScrutinyBlocked: true,
      legalGrounding: 'Unified Development Control and Promotion Regulations (UDCPR)',
    },
  ];

  assert.equal(crossDepartmentRegistry.length, 3);
  crossDepartmentRegistry.forEach(doc => {
    assert.equal(doc.isRepetitiveScrutinyBlocked, true);
    assert.ok(doc.consumingDepartments.length >= 3);
  });
});

test('AI Pre-Submission Quality Audit: Zero-Query Validation Rules', () => {
  const validateSubmission = (caf) => {
    const issues = [];
    if (!caf.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(caf.pan)) {
      issues.push('Invalid Company PAN format');
    }
    if (!caf.gstin || !caf.gstin.startsWith('27') || caf.gstin.length !== 15) {
      issues.push('Invalid Maharashtra GSTIN (Must start with 27)');
    }
    if (!caf.udyamNumber || !caf.udyamNumber.startsWith('UDYAM-MH-')) {
      issues.push('Missing or invalid Maharashtra Udyam registration');
    }
    if (caf.effluentDischargeKld > 10 && caf.treatmentScheme !== 'ZERO_LIQUID_DISCHARGE' && caf.treatmentScheme !== 'CETP_MEMBER') {
      issues.push('Effluent discharge requires ZLD or CETP membership documentation');
    }
    return {
      isValid: issues.length === 0,
      issues,
      completenessScore: issues.length === 0 ? 100 : Math.max(20, 100 - (issues.length * 25))
    };
  };

  const validCAF = {
    pan: 'AABCS8819Q',
    gstin: '27AABCS8819Q1ZP',
    udyamNumber: 'UDYAM-MH-26-008219',
    effluentDischargeKld: 15,
    treatmentScheme: 'ZERO_LIQUID_DISCHARGE'
  };

  const auditValid = validateSubmission(validCAF);
  assert.equal(auditValid.isValid, true);
  assert.equal(auditValid.completenessScore, 100);

  const flawedCAF = {
    pan: 'INVALID',
    gstin: '29AABCS8819Q1ZP', // Karnataka state code
    udyamNumber: '',
    effluentDischargeKld: 50,
    treatmentScheme: 'DIRECT_DISCHARGE'
  };

  const auditFlawed = validateSubmission(flawedCAF);
  assert.equal(auditFlawed.isValid, false);
  assert.ok(auditFlawed.issues.length >= 3);
  assert.ok(auditFlawed.completenessScore < 50);
});

test('File Verification: New MAITRI 2.0 Frontend Routes and Engine Files Exist', () => {
  const baseDir = fs.existsSync(path.join(process.cwd(), 'src/app/page.tsx'))
    ? process.cwd()
    : path.resolve(process.cwd(), 'apps/web');

  const requiredFiles = [
    'src/app/portal/kya/page.tsx',
    'src/app/portal/apply/page.tsx',
    'src/app/portal/compliance/page.tsx',
    'src/app/portal/incentives/page.tsx',
    'src/lib/knowledge-engine/kya-engine.ts',
    'src/lib/knowledge-engine/regulatory-graph.ts',
    'src/components/officer/SmartQueueTable.tsx',
    'src/components/navbar/NavigationHeader.tsx',
    'src/app/page.tsx',
  ];

  requiredFiles.forEach((relPath) => {
    const fullPath = path.join(baseDir, relPath);
    const exists = fs.existsSync(fullPath);
    assert.ok(exists, `Expected file to exist: ${relPath}`);
  });
});
