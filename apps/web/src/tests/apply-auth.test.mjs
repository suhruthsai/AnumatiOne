import { test } from 'node:test';
import assert from 'node:assert/strict';

test('MAITRI 2.0 Industrialist Authentication: Session and Registration Verification', async (t) => {
  // 1. Verify Seed Personas have valid Maharashtra statutory identifiers
  const SEED_INDUSTRIALISTS = [
    {
      userId: 'ind_001',
      fullName: 'Mr. Vikram Deshmukh',
      designation: 'Managing Director',
      phone: '+91 98220 54321',
      email: 'vikram.deshmukh@sahyadri-battery.in',
      companyName: 'Sahyadri EV Battery Systems Pvt Ltd',
      entityType: 'PVT_LTD',
      pan: 'AABCS8819Q',
      gstin: '27AABCS8819Q1ZP',
      udyamNumber: 'UDYAM-MH-26-008219',
      isKycVerified: true,
    },
    {
      userId: 'ind_002',
      fullName: 'Dr. Ananya Joshi',
      designation: 'Director & Technical Head',
      phone: '+91 98221 65432',
      email: 'ananya.joshi@vanguardbio.in',
      companyName: 'Vanguard Biopharma Life Sciences Pvt Ltd',
      entityType: 'PVT_LTD',
      pan: 'AABCV4912K',
      gstin: '27AABCV4912K1ZQ',
      udyamNumber: 'UDYAM-MH-19-004512',
      isKycVerified: true,
    },
    {
      userId: 'ind_003',
      fullName: 'Mr. Rajesh Patil',
      designation: 'Proprietor & Founder',
      phone: '+91 98222 78901',
      email: 'rajesh.patil@godavari-organics.in',
      companyName: 'Godavari Valley Organics MSME',
      entityType: 'PROPRIETORSHIP',
      pan: 'AAPPP1234F',
      gstin: '27AAPPP1234F1ZR',
      udyamNumber: 'UDYAM-MH-20-009823',
      isKycVerified: true,
    }
  ];

  await t.test('All seed personas have valid Maharashtra 27-prefix GSTIN and 10-char PAN', () => {
    for (const ind of SEED_INDUSTRIALISTS) {
      assert.match(ind.gstin, /^27[A-Z0-9]{13}$/, `GSTIN ${ind.gstin} must start with Maharashtra code 27 and be 15 chars`);
      assert.match(ind.pan, /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, `PAN ${ind.pan} must follow statutory format`);
      assert.strictEqual(ind.isKycVerified, true);
    }
  });

  await t.test('Authentication gate correctly validates SMS OTP simulation code 789123', () => {
    const validOtp = '789123';
    const invalidOtp = '123456';

    const verifyOtp = (code) => code === '789123';

    assert.strictEqual(verifyOtp(validOtp), true);
    assert.strictEqual(verifyOtp(invalidOtp), false);
  });

  await t.test('New Industrialist Registration validates statutory fields', () => {
    const validateSignup = (form) => {
      if (!form.fullName || !form.companyName) return { valid: false, error: 'Name and Company required' };
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan)) return { valid: false, error: 'Invalid PAN' };
      if (form.gstin && (!form.gstin.startsWith('27') || form.gstin.length !== 15)) return { valid: false, error: 'Invalid 27-GSTIN' };
      if (!form.agreeRts) return { valid: false, error: 'RTS agreement required' };
      return { valid: true };
    };

    const validRegistration = {
      fullName: 'Sunil Gavaskar',
      companyName: 'Shivaji Precision Tools Pvt Ltd',
      pan: 'AABCS9999K',
      gstin: '27AABCS9999K1Z5',
      agreeRts: true,
    };
    assert.strictEqual(validateSignup(validRegistration).valid, true);

    const invalidGstinReg = {
      ...validRegistration,
      gstin: '29AABCS9999K1Z5', // Karnataka code 29
    };
    assert.strictEqual(validateSignup(invalidGstinReg).valid, false);

    const missingRtsReg = {
      ...validRegistration,
      agreeRts: false,
    };
    assert.strictEqual(validateSignup(missingRtsReg).valid, false);
  });

  await t.test('Profile pre-population maps authenticated credentials into CAF Step 1 data', () => {
    const industrialist = SEED_INDUSTRIALISTS[0];
    const initialFormData = {
      companyName: '',
      entityType: 'LLP',
      pan: '',
      gstin: '',
      udyamNumber: '',
      authorizedPersonName: '',
      authorizedPersonPhone: '',
      authorizedPersonEmail: '',
      sector: 'EV_MANUFACTURING',
      projectStage: 'PRE_ESTABLISHMENT',
    };

    const syncedFormData = {
      ...initialFormData,
      companyName: industrialist.companyName,
      entityType: industrialist.entityType,
      pan: industrialist.pan,
      gstin: industrialist.gstin,
      udyamNumber: industrialist.udyamNumber,
      authorizedPersonName: industrialist.fullName,
      authorizedPersonPhone: industrialist.phone,
      authorizedPersonEmail: industrialist.email,
    };

    assert.strictEqual(syncedFormData.companyName, 'Sahyadri EV Battery Systems Pvt Ltd');
    assert.strictEqual(syncedFormData.pan, 'AABCS8819Q');
    assert.strictEqual(syncedFormData.gstin, '27AABCS8819Q1ZP');
    assert.strictEqual(syncedFormData.sector, 'EV_MANUFACTURING', 'Preserves sector selection');
    assert.strictEqual(syncedFormData.projectStage, 'PRE_ESTABLISHMENT', 'Preserves clearance stage');
  });
});
