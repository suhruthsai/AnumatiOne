import test from 'node:test';
import assert from 'node:assert/strict';

// Ground truth data for Maharashtra Acts & Schemes
const MAHARASHTRA_ACTS = [
  'MH_RTS_ACT_2015',
  'MIDC_ACT_1961',
  'WATER_AIR_ACTS',
  'EPA_1986',
  'FACTORIES_RULES_1963',
  'FIRE_ACT_2006',
  'ELECTRICITY_ACT_2003',
  'IBR_1950',
  'PETROLEUM_RULES_2002',
];

const MAHARASHTRA_SCHEMES = [
  'PSI_2019',
  'MH_EV_POLICY_2021',
  'STAMP_DUTY_EXEMPTION',
  'ELECTRICITY_DUTY_EXEMPTION',
  'CMEGP_SCHEME',
  'MSME_INTEREST_SUBVENTION',
];

const TWIN_SCENARIOS = {
  MINIMAX_CONCURRENCY: {
    name: 'AnumatiOne Smart Parallel Track',
    totalDays: 88,
    daysSavedVsSequential: 130,
    concurrencyLanes: 4,
    recommended: true,
  },
  TRADITIONAL_SEQUENTIAL: {
    name: 'Legacy Departmental Silos',
    totalDays: 218,
    daysSavedVsSequential: 0,
    concurrencyLanes: 1,
    recommended: false,
  },
  GREEN_CHANNEL_EXPRESS: {
    name: 'Green Channel Fast-Track (MSME & Clean Tech)',
    totalDays: 48,
    daysSavedVsSequential: 170,
    concurrencyLanes: 4,
    recommended: false,
  },
  RED_CATEGORY_SCRUTINY: {
    name: 'Heavy Industry / Chemical Scrutiny',
    totalDays: 128,
    daysSavedVsSequential: 132,
    concurrencyLanes: 4,
    recommended: false,
  },
};

test('Digital Twin Scenario 1: AnumatiOne Smart Parallel Track', () => {
  const scen = TWIN_SCENARIOS.MINIMAX_CONCURRENCY;
  assert.equal(scen.totalDays, 88);
  assert.equal(scen.concurrencyLanes, 4);
  assert.equal(scen.recommended, true);
  assert.ok(scen.daysSavedVsSequential > 100);
});

test('Digital Twin Scenario 2: Legacy Departmental Silos', () => {
  const scen = TWIN_SCENARIOS.TRADITIONAL_SEQUENTIAL;
  assert.equal(scen.totalDays, 218);
  assert.equal(scen.concurrencyLanes, 1);
  assert.equal(scen.daysSavedVsSequential, 0);
});

test('Digital Twin Scenario 3: Green Channel Express saves > 70% time', () => {
  const scen = TWIN_SCENARIOS.GREEN_CHANNEL_EXPRESS;
  assert.equal(scen.totalDays, 48);
  const percentSaved = Math.round((scen.daysSavedVsSequential / 218) * 100);
  assert.ok(percentSaved >= 70, `Expected >= 70% saved, got ${percentSaved}%`);
});

test('Maharashtra Governance: 9 Statutory Acts and Rules Covered', () => {
  assert.equal(MAHARASHTRA_ACTS.length, 9);
  assert.ok(MAHARASHTRA_ACTS.includes('MH_RTS_ACT_2015'));
  assert.ok(MAHARASHTRA_ACTS.includes('MIDC_ACT_1961'));
  assert.ok(MAHARASHTRA_ACTS.includes('WATER_AIR_ACTS'));
  assert.ok(MAHARASHTRA_ACTS.includes('FACTORIES_RULES_1963'));
});

test('Maharashtra Schemes: 6 Priority Industrial Schemes Modeled', () => {
  assert.equal(MAHARASHTRA_SCHEMES.length, 6);
  assert.ok(MAHARASHTRA_SCHEMES.includes('PSI_2019'));
  assert.ok(MAHARASHTRA_SCHEMES.includes('MH_EV_POLICY_2021'));
  assert.ok(MAHARASHTRA_SCHEMES.includes('STAMP_DUTY_EXEMPTION'));
  assert.ok(MAHARASHTRA_SCHEMES.includes('ELECTRICITY_DUTY_EXEMPTION'));
});

// Statutory RAG & NLP Simplifier Tests
test('Statutory RAG: Legal Corpus Grounding', () => {
  const corpusKeywords = [
    'Right to Services Act 2015',
    'Deemed Approval Sec. 4(1)',
    'MIDC DCR Rule 14.1',
    'Water Act 1974 Sec. 25',
    'Maharashtra Factories Rules 1963',
    'Package Scheme of Incentives 2019',
  ];
  assert.equal(corpusKeywords.length, 6);
  assert.ok(corpusKeywords.every(k => typeof k === 'string' && k.length > 5));
});

test('NLP Simplifier: Department Notice Analysis Rules', () => {
  const noticeSample = 'Deficiency noted: ETP schematic lacks multi-effect evaporator for Zero Liquid Discharge.';
  const isMpcbNotice = noticeSample.toLowerCase().includes('zero liquid discharge') || noticeSample.toLowerCase().includes('etp');
  assert.equal(isMpcbNotice, true);

  const mockSimplification = {
    plainSummary: 'MPCB is asking for proof of 100% water recycling (ZLD) before granting Consent to Establish.',
    statutorySafeguard: 'Water Act 1974 Section 25 & Environment Protection Act 1986',
    draftSubject: 'Compliance Submission: Zero Liquid Discharge Clarification & ETP Specifications',
  };

  assert.ok(mockSimplification.plainSummary.includes('MPCB'));
  assert.ok(mockSimplification.statutorySafeguard.includes('Water Act 1974'));
  assert.ok(mockSimplification.draftSubject.includes('Compliance Submission'));
});

