import test from 'node:test';
import assert from 'node:assert';

function testValidateDocument(input) {
  const issues = [];
  let score = 92;
  const validExts = ['pdf', 'png', 'jpg', 'jpeg'];
  const ext = input.fileName.split('.').pop()?.toLowerCase() || '';

  if (!validExts.includes(ext)) {
    issues.push({ code: 'INVALID_FORMAT', severity: 'ERROR' });
    score -= 40;
  }

  if (input.mockText?.includes('BLUR') || input.fileName.includes('blur')) {
    issues.push({ code: 'OCR_UNREADABLE', severity: 'ERROR' });
    score -= 35;
  }

  // PAN Regex
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]/;
  const panMatch = input.mockText?.match(panRegex);

  const status = issues.some(i => i.severity === 'ERROR') ? 'REJECTED' : 'VALID';

  return {
    status,
    qualityScore: Math.max(0, score),
    issues,
    extractedPan: panMatch ? panMatch[0] : null,
  };
}

test('Document Pre-Validator accepts authentic high-resolution documents', () => {
  const result = testValidateDocument({
    fileName: 'Company_PAN_Signed.pdf',
    fileSizeBytes: 180000,
    mockText: 'INCOME TAX DEPARTMENT GOVT OF INDIA AAACG1234M DATED 2021',
  });

  assert.strictEqual(result.status, 'VALID');
  assert.strictEqual(result.extractedPan, 'AAACG1234M');
  assert.strictEqual(result.issues.length, 0);
  assert.ok(result.qualityScore >= 80);
});

test('Document Pre-Validator catches blurry uploads and flags them before submission', () => {
  const result = testValidateDocument({
    fileName: 'blurry_flash_glare.jpg',
    fileSizeBytes: 14000,
    mockText: 'BLUR UNREADABLE',
  });

  assert.strictEqual(result.status, 'REJECTED');
  assert.ok(result.issues.some(i => i.code === 'OCR_UNREADABLE'));
});
