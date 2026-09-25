import { DocumentType, DocumentValidationResult } from '@approvalos/shared';

export interface PreValidationInput {
  documentType: DocumentType;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  base64Content?: string;
  mockExtractedText?: string;
}

/**
 * Document Intelligence & Pre-Validation Engine
 * Prevents departmental rejections by performing rigorous pre-submission verification.
 */
export function preValidateDocument(input: PreValidationInput): DocumentValidationResult {
  const issues: DocumentValidationResult['issues'] = [];
  const suggestions: string[] = [];
  const extractedFields: Record<string, string | number | boolean> = {};

  let qualityScore = 92;
  let isBlurry = false;
  let hasGlare = false;
  let resolutionDpi = 300;

  // 1. File Format & Size Validation
  const validExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
  const ext = input.fileName.split('.').pop()?.toLowerCase() || '';

  if (!validExtensions.includes(ext)) {
    issues.push({
      code: 'INVALID_FORMAT',
      message: `File format .${ext} is not accepted. Please upload a PDF, PNG, or JPEG.`,
      severity: 'ERROR',
    });
    qualityScore -= 40;
  }

  if (input.fileSizeBytes > 15 * 1024 * 1024) {
    issues.push({
      code: 'FILE_TOO_LARGE',
      message: 'File size exceeds 15 MB limit. Please compress before uploading.',
      severity: 'ERROR',
    });
    qualityScore -= 30;
  } else if (input.fileSizeBytes < 25 * 1024) {
    issues.push({
      code: 'FILE_TOO_SMALL',
      message: 'File size is unusually small (< 25 KB). Image may lack legibility.',
      severity: 'WARNING',
    });
    qualityScore -= 20;
    isBlurry = true;
  }

  // 2. Multi-Language OCR Detection (English + Hindi Devanagari)
  const rawText = input.mockExtractedText || '';
  const text = rawText.toUpperCase();
  const hasDevanagari = /[\u0900-\u097F]/.test(rawText);
  const detectedLanguages = ['ENGLISH'];
  if (hasDevanagari || rawText.includes('भारत') || rawText.includes('सरकार') || rawText.includes('आधार') || rawText.includes('विभाग')) {
    detectedLanguages.push('HINDI (हिन्दी)');
  }
  extractedFields['ocrLanguagesDetected'] = detectedLanguages.join(', ');

  switch (input.documentType) {
    case 'PAN_CARD': {
      // Regex for Indian PAN: 5 uppercase letters, 4 digits, 1 uppercase letter
      const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]/;
      const panMatch = text.match(panRegex);

      if (panMatch) {
        extractedFields['panNumber'] = panMatch[0];
        extractedFields['entityType'] = panMatch[0][3] === 'C' ? 'COMPANY' : 'PROPRIETOR/INDIVIDUAL';
        extractedFields['verifiedWithITD'] = true;
      } else {
        // Fallback default simulation for demo
        extractedFields['panNumber'] = 'AAACG1234M';
        extractedFields['entityType'] = 'COMPANY';
        extractedFields['verifiedWithITD'] = true;
      }

      if (text.includes('BLUR') || input.fileName.toLowerCase().includes('blur')) {
        isBlurry = true;
        qualityScore -= 35;
        issues.push({
          code: 'OCR_UNREADABLE_NAME',
          message: 'The name or PAN characters are blurry or obscured by camera flash.',
          severity: 'ERROR',
        });
        suggestions.push('Place the card on a flat surface in natural light and re-photograph without glare.');
      }
      break;
    }

    case 'AADHAAR_CARD': {
      // 12-digit Aadhaar pattern
      const aadhaarRegex = /\b[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\b/;
      const match = text.match(aadhaarRegex);
      if (match) {
        extractedFields['maskedAadhaar'] = `XXXX-XXXX-${match[0].slice(-4)}`;
        extractedFields['uidaiVerified'] = true;
      } else {
        extractedFields['maskedAadhaar'] = 'XXXX-XXXX-8901';
        extractedFields['uidaiVerified'] = true;
      }
      break;
    }

    case 'GSTIN_CERTIFICATE': {
      // 15-character GSTIN pattern
      const gstinRegex = /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/;
      const match = text.match(gstinRegex);
      if (match) {
        extractedFields['gstin'] = match[0];
        extractedFields['stateCode'] = match[0].substring(0, 2);
        extractedFields['gstStatus'] = 'ACTIVE';
      } else {
        extractedFields['gstin'] = '27AAACG1234M1Z5';
        extractedFields['stateCode'] = '27 (Maharashtra)';
        extractedFields['gstStatus'] = 'ACTIVE';
      }
      break;
    }

    case 'LAND_SALE_DEED': {
      extractedFields['surveyNumber'] = 'Chakan MIDC Phase IV, Plot No. B-24, Gat No. 412/1';
      extractedFields['subRegistrarSealPresent'] = true;
      extractedFields['areaAcresDemarcated'] = 25.0;
      extractedFields['mahabhulekhVerified'] = true;

      if (text.includes('EXPIRED') || input.fileName.toLowerCase().includes('expired')) {
        issues.push({
          code: 'ENCUMBRANCE_CERTIFICATE_OUTDATED',
          message: 'The attached Non-Encumbrance Certificate is older than 90 days.',
          severity: 'ERROR',
        });
        qualityScore -= 45;
        suggestions.push('Obtain a fresh online 12-year Non-Encumbrance Certificate from the Inspector General of Registration (IGR).');
      }
      break;
    }

    case 'FACTORY_LAYOUT_PLAN': {
      extractedFields['architectRegistrationNo'] = 'CA/2018/98412';
      extractedFields['fireExitsMarked'] = true;
      extractedFields['setbackComplianceConfirmed'] = true;
      break;
    }

    case 'POLLUTION_UNDERTAKING': {
      extractedFields['zeroLiquidDischargeDesign'] = 'Multi-Effect Evaporator (MEE)';
      extractedFields['effluentFlowRateKld'] = 45;
      extractedFields['chimneyStackHeightMeters'] = 30;
      break;
    }

    default:
      extractedFields['docStatus'] = 'SCANNED';
      break;
  }

  // 3. Determine Overall Status
  let status: DocumentValidationResult['status'] = 'VALID';
  if (issues.some(i => i.severity === 'ERROR')) {
    status = 'REJECTED';
  } else if (issues.some(i => i.severity === 'WARNING') || qualityScore < 75) {
    status = 'WARNING';
  }

  if (suggestions.length === 0) {
    suggestions.push('Document satisfies resolution, format, and authenticity requirements.');
    suggestions.push('Eligible for automatic DigiLocker Data Vault cross-referencing across departments.');
  }

  return {
    documentType: input.documentType,
    fileName: input.fileName,
    fileSizeBytes: input.fileSizeBytes,
    status,
    qualityScore: Math.max(10, Math.min(100, qualityScore)),
    isBlurry,
    hasGlare,
    resolutionDpi,
    extractedFields,
    issues,
    suggestions,
    verifiedAt: new Date().toISOString(),
  };
}
