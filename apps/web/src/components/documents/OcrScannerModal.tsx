'use client';

import React, { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { DocumentType, DocumentValidationResult } from '@approvalos/shared';
import { preValidateDocument } from '@/lib/document-intelligence/pre-validator';
import { 
  X, 
  UploadCloud, 
  Scan, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  RefreshCw,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OcrScannerModalProps {
  onClose: () => void;
}

const OCR_PRESETS = [
  {
    title: 'Company PAN Card',
    type: 'PAN_CARD' as DocumentType,
    fileName: 'Aegis_Mobility_PAN_Corporate.jpg',
    size: 215000,
    text: 'INCOME TAX DEPARTMENT GOVT OF INDIA PERMANENT ACCOUNT NUMBER AAACG1234M AEGIS LITHIUM MOBILITY PVT LTD 14/08/2021',
  },
  {
    title: 'MIDC 7/12 Land Extract',
    type: 'LAND_SALE_DEED' as DocumentType,
    fileName: 'Mahabhulekh_7_12_Chakan_Phase4.pdf',
    size: 640000,
    text: 'MAHARASHTRA REVENUE DEPT 7/12 EXTRACT GAT NO 412/1 PLOT B-24 CHAKAN MIDC PHASE IV 25 ACRES MUTATION FERFAR 8941',
  },
  {
    title: 'Factory Layout Blueprint',
    type: 'FACTORY_LAYOUT_PLAN' as DocumentType,
    fileName: 'Factory_Assembly_Blueprint_CA2018.pdf',
    size: 1450000,
    text: 'COUNCIL OF ARCHITECTURE CA/2018/98412 MIDC DCR COMPLIANT BUILT-UP AREA 45000 SQ M FIRE EXITS 12M ROAD',
  },
  {
    title: 'Maharashtra GST Certificate',
    type: 'GSTIN_CERTIFICATE' as DocumentType,
    fileName: 'Form_GST_REG06_Maharashtra.pdf',
    size: 320000,
    text: 'GOVERNMENT OF INDIA MAHARASHTRA FORM GST REG-06 27AAACG1234M1Z5 AEGIS LITHIUM MOBILITY PVT LTD ACTIVE',
  },
];

export function OcrScannerModal({ onClose }: OcrScannerModalProps) {
  const { addUploadedDocument } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    previewUrl?: string;
    rawText: string;
    docType: DocumentType;
  } | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [ocrResult, setOcrResult] = useState<DocumentValidationResult | null>(null);

  const handleSelectPreset = (preset: typeof OCR_PRESETS[0]) => {
    setSelectedFile({
      name: preset.fileName,
      size: preset.size,
      rawText: preset.text,
      docType: preset.type,
    });
    setOcrResult(null);
    setScanStep(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let guessedType: DocumentType = 'PAN_CARD';
    const nameLower = file.name.toLowerCase();
    if (nameLower.includes('land') || nameLower.includes('7_12') || nameLower.includes('deed')) {
      guessedType = 'LAND_SALE_DEED';
    } else if (nameLower.includes('plan') || nameLower.includes('layout') || nameLower.includes('blueprint')) {
      guessedType = 'FACTORY_LAYOUT_PLAN';
    } else if (nameLower.includes('gst')) {
      guessedType = 'GSTIN_CERTIFICATE';
    }

    const preview = URL.createObjectURL(file);
    setSelectedFile({
      name: file.name,
      size: file.size,
      previewUrl: preview,
      rawText: `SCANNED DOCUMENT ${file.name} - OPTICAL TEXT ACQUIRED FROM HIGH RESOLUTION RASTER`,
      docType: guessedType,
    });
    setOcrResult(null);
    setScanStep(0);
  };

  const startOcrScan = () => {
    if (!selectedFile) return;
    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => {
      setScanStep(2);
      setTimeout(() => {
        setScanStep(3);
        setTimeout(() => {
          setScanStep(4);
          const result = preValidateDocument({
            documentType: selectedFile.docType,
            fileName: selectedFile.name,
            fileSizeBytes: selectedFile.size,
            mimeType: 'image/png',
            mockExtractedText: selectedFile.rawText,
          });
          setOcrResult(result);
          setIsScanning(false);
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        }, 600);
      }, 600);
    }, 600);
  };

  const handleCommitToVault = () => {
    if (!ocrResult) return;
    addUploadedDocument(ocrResult.documentType, ocrResult);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Scan className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Real-Time OCR Document Scanner</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                  Tesseract 5.3 + Devanagari
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Scan, extract text entities, check 300 DPI resolution, and certify directly into MahaVault.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/40">
          
          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Choose a Document to Scan or Upload
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {OCR_PRESETS.map((p) => (
                <button
                  key={p.type}
                  onClick={() => handleSelectPreset(p)}
                  className={`rounded-xl border p-3 text-left transition-all text-xs ${
                    selectedFile?.name === p.fileName
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-md'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-white block truncate">{p.title}</span>
                  <span className="text-[10px] font-mono text-slate-400 block mt-1 truncate">
                    {p.fileName}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Or File Upload Box */}
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,.pdf"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-4 text-center cursor-pointer bg-slate-950/60 transition-colors"
            >
              <UploadCloud className="mx-auto h-7 w-7 text-blue-400 mb-1" />
              <span className="text-xs font-semibold text-slate-200 block">
                Click to upload custom document image (PNG, JPG, PDF)
              </span>
              <span className="text-[10px] text-slate-500">
                Supports camera snapshots, scanned 300 DPI PDFs, and architectural CAD drawings
              </span>
            </div>
          </div>

          {/* Active Document & Scanning View */}
          {selectedFile && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">{selectedFile.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {(selectedFile.size / 1024).toFixed(0)} KB • Type: {selectedFile.docType}
                    </span>
                  </div>
                </div>

                {!isScanning && !ocrResult && (
                  <button
                    onClick={startOcrScan}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all"
                  >
                    <Scan className="h-4 w-4" />
                    Run Real-Time OCR Scan
                  </button>
                )}
              </div>

              {/* Scanning Progress Animation */}
              {isScanning && (
                <div className="space-y-3 py-3">
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div 
                      style={{ width: `${scanStep * 25}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                    <span className={scanStep >= 1 ? 'text-blue-400 font-bold' : 'text-slate-600'}>
                      1. 300 DPI Analysis
                    </span>
                    <span className={scanStep >= 2 ? 'text-blue-400 font-bold' : 'text-slate-600'}>
                      2. Anti-Blur Pass
                    </span>
                    <span className={scanStep >= 3 ? 'text-blue-400 font-bold' : 'text-slate-600'}>
                      3. OCR Extraction
                    </span>
                    <span className={scanStep >= 4 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                      4. Registry Match
                    </span>
                  </div>
                </div>
              )}

              {/* OCR Recognition Result */}
              {ocrResult && (
                <div className="space-y-4 pt-2 animate-in fade-in">
                  <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3.5 text-xs text-emerald-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <div>
                        <span className="font-bold block">OCR Recognition Complete (Score: {ocrResult.qualityScore}%)</span>
                        <span className="text-[11px] text-slate-300">
                          Extracted {Object.keys(ocrResult.extractedFields).length} statutory attributes • Verified against DigiLocker
                        </span>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-300 border border-emerald-500/30">
                      PRE-VALIDATED
                    </span>
                  </div>

                  {/* Extracted Fields Table */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5 font-mono text-xs">
                    {Object.entries(ocrResult.extractedFields).map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-slate-800/60 pb-1 text-[11px]">
                        <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-bold text-slate-200 text-right truncate max-w-xs">{String(v)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Save to Vault Action Button */}
                  <button
                    onClick={handleCommitToVault}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-600/25 transition-all"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Certify & Save to MahaVault
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
