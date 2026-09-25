import { NextRequest, NextResponse } from 'next/server';
import { preValidateDocument } from '@/lib/document-intelligence/pre-validator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = preValidateDocument({
      documentType: body.documentType || 'PAN_CARD',
      fileName: body.fileName || 'promoter_pan.pdf',
      fileSizeBytes: body.fileSizeBytes || 180000,
      mimeType: body.mimeType || 'application/pdf',
      mockExtractedText: body.extractedText || '',
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Pre-validation error' },
      { status: 500 }
    );
  }
}
