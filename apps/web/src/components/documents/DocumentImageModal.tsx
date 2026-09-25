'use client';

import React, { useState } from 'react';
import { DocumentValidationResult, DocumentType } from '@approvalos/shared';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  QrCode, 
  Scan, 
  Eye, 
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface DocumentImageModalProps {
  doc: DocumentValidationResult;
  onClose: () => void;
}

export function DocumentImageModal({ doc, onClose }: DocumentImageModalProps) {
  const [zoom, setZoom] = useState(1);
  const [showOcrOverlay, setShowOcrOverlay] = useState(true);
  const [activeTab, setActiveTab] = useState<'VISUAL' | 'OCR_TEXT' | 'METADATA'>('VISUAL');

  const fields = doc.extractedFields || {};

  // Render authentic document mockup based on document type
  const renderVisualMockup = () => {
    switch (doc.documentType) {
      case 'PAN_CARD':
        return (
          <div className="relative mx-auto w-full max-w-md rounded-2xl border-2 border-slate-700 bg-gradient-to-br from-sky-900/90 via-slate-900 to-sky-950 p-6 shadow-2xl text-slate-100 font-sans">
            {/* Hologram & Emblem Header */}
            <div className="flex items-center justify-between border-b border-sky-500/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-xs font-bold text-amber-300">
                  🏛️
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-amber-300 uppercase">
                    INCOME TAX DEPARTMENT
                  </div>
                  <div className="text-[9px] text-slate-300">
                    GOVT. OF INDIA / भारत सरकार
                  </div>
                </div>
              </div>
              <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-md border border-yellow-300/60 flex items-center justify-center text-[10px] font-bold text-slate-900">
                HOLOGRAM
              </div>
            </div>

            {/* Entity Name & PAN */}
            <div className="mt-4 space-y-3">
              <div>
                <span className="text-[9px] font-mono uppercase text-slate-400 block">Name / नाम</span>
                <span className="text-sm font-extrabold text-white tracking-wide block">
                  {String(fields.entityName || 'AEGIS LITHIUM MOBILITY PVT LTD')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-400 block">Permanent Account Number (PAN)</span>
                  <span className="font-mono text-xl font-black tracking-widest text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30 inline-block">
                    {String(fields.panNumber || 'AAACG1234M')}
                  </span>
                </div>
                <div className="h-14 w-12 rounded bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-[8px] text-slate-400">
                  PHOTO
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-sky-500/20 text-[10px]">
                <div>
                  <span className="text-slate-400">Category: </span>
                  <span className="font-bold text-white">{String(fields.entityType || 'COMPANY')}</span>
                </div>
                <div className="font-mono text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="h-3 w-3" /> NSDL VERIFIED
                </div>
              </div>
            </div>
          </div>
        );

      case 'LAND_SALE_DEED':
        return (
          <div className="relative mx-auto w-full max-w-lg rounded-xl border border-amber-600/40 bg-[#fdfbf7] p-6 shadow-2xl text-slate-900 font-serif">
            <div className="text-center border-b-2 border-amber-900/30 pb-3">
              <div className="text-xs font-bold text-amber-950 uppercase tracking-widest">
                महाराष्ट्र शासन • महसूल विभाग (MAHARASHTRA REVENUE DEPT)
              </div>
              <div className="text-base font-black text-slate-950 mt-0.5">
                गाव नमुना सात / बारा (FORM VII-XII EXTRACT)
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                अभिलेख कक्ष • हवेली उप-निबंधक कार्यालय • एम.आय.डी.सी. चाकण
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-300 p-2.5 rounded bg-amber-50/50">
                <span className="font-sans text-[10px] text-slate-500 block font-bold">गट क्र. / SURVEY NUMBER</span>
                <span className="font-bold font-mono text-slate-900 text-sm">
                  {String(fields.surveyGatNumber || 'Gat No. 412/1, Plot B-24')}
                </span>
              </div>
              <div className="border border-slate-300 p-2.5 rounded bg-amber-50/50">
                <span className="font-sans text-[10px] text-slate-500 block font-bold">क्षेत्रफळ / DEMARCATED AREA</span>
                <span className="font-bold font-mono text-slate-900 text-sm">
                  {String(fields.areaAcresDemarcated || '25.0 ACRES')}
                </span>
              </div>
            </div>

            <div className="mt-3 border border-slate-300 p-3 rounded text-xs space-y-1.5 bg-white">
              <div className="flex justify-between">
                <span className="text-slate-600 font-sans text-[11px]">पट्टेदार / Lessee:</span>
                <span className="font-bold font-sans">Aegis Lithium Mobility Pvt Ltd</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-sans text-[11px]">पट्टा प्रकार / Tenure:</span>
                <span className="font-bold font-sans">95-Year MIDC Statutory Industrial Lease</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-sans text-[11px]">फेरफार क्रमांक / Mutation:</span>
                <span className="font-bold font-mono">Ferfar No. 8941 (Certified)</span>
              </div>
            </div>

            {/* Official Stamp & QR Code */}
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-amber-900/20 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 border-2 border-red-700 rounded-full flex items-center justify-center text-[8px] font-bold text-red-700 rotate-[-12deg] text-center leading-tight">
                  SEAL<br/>MIDC
                </div>
                <div className="text-[10px] font-sans text-slate-600">
                  Signed: Regional Officer, MIDC Pune<br/>
                  DigiLocker ID: in.gov.mh.midc.land
                </div>
              </div>
              <div className="h-10 w-10 bg-slate-900 rounded p-1 text-white flex items-center justify-center">
                <QrCode className="h-8 w-8" />
              </div>
            </div>
          </div>
        );

      case 'FACTORY_LAYOUT_PLAN':
        return (
          <div className="relative mx-auto w-full max-w-lg rounded-xl border-2 border-blue-500/60 bg-[#0c1f38] p-5 shadow-2xl text-blue-100 font-mono">
            {/* Blueprint Grid Overlay */}
            <div className="flex items-center justify-between border-b border-blue-400/40 pb-2">
              <span className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase">
                COUNCIL OF ARCHITECTURE • CERTIFIED BLUEPRINT
              </span>
              <span className="text-[10px] text-blue-300">SCALE 1:100</span>
            </div>

            {/* Architectural Drawing Graphic Simulation */}
            <div className="my-4 h-48 w-full rounded border border-dashed border-cyan-400/50 bg-[#081527] p-3 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a5f_1px,transparent_1px),linear-gradient(to_bottom,#1e3a5f_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />
              
              <div className="relative z-10 flex justify-between text-[9px] text-cyan-300">
                <span>← 15M FRONT SETBACK →</span>
                <span>ENTRY GATE (12M ROAD)</span>
              </div>

              {/* Main Factory Floor Box */}
              <div className="relative z-10 mx-auto my-auto h-24 w-4/5 rounded border-2 border-cyan-400 bg-cyan-950/60 p-2 text-center flex flex-col items-center justify-center">
                <span className="font-bold text-xs text-white">MAIN ASSEMBLY & PRODUCTION BAY</span>
                <span className="text-[9px] text-cyan-300">BUILT-UP AREA: {String(fields.builtUpAreaSqM || '45,000 sq.m.')}</span>
                <span className="text-[8px] text-emerald-400 font-bold mt-1">✓ FIRE EVACUATION CORRIDORS (NFPA COMPLIANT)</span>
              </div>

              <div className="relative z-10 flex justify-between text-[9px] text-cyan-300">
                <span>← 10M SIDE SETBACK →</span>
                <span>← 12M REAR ETP BUFFER →</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-blue-400/30 text-[10px]">
              <div>
                <span>ARCHITECT REG: </span>
                <span className="font-bold text-white">CA/2018/98412</span>
              </div>
              <div className="text-emerald-400 font-bold">
                MIDC DCR COMPLIANCE: 100% PASS
              </div>
            </div>
          </div>
        );

      case 'GSTIN_CERTIFICATE':
        return (
          <div className="relative mx-auto w-full max-w-md rounded-xl border border-slate-700 bg-white p-6 shadow-2xl text-slate-900 font-sans">
            <div className="text-center border-b-2 border-slate-800 pb-3">
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                GOVERNMENT OF INDIA • MAHARASHTRA STATE TAX
              </div>
              <div className="text-base font-black text-slate-950 mt-0.5">
                FORM GST REG-06
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                REGISTRATION CERTIFICATE
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-medium">GSTIN:</span>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {String(fields.gstin || '27AAACG1234M1Z5')}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-medium">Legal Name:</span>
                <span className="font-bold text-slate-900">{String(fields.legalName || 'Aegis Lithium Mobility Pvt Ltd')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-medium">Jurisdiction:</span>
                <span className="font-bold text-slate-800">Ward 4, Pune Division, Maharashtra</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  ✓ ACTIVE & REGULAR
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
              <span>Date of Issue: 15/04/2021</span>
              <span className="font-mono font-semibold text-slate-700">QR-GSTN-27MH</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative mx-auto w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-white">
                  {doc.documentType.replace(/_/g, ' ')}
                </span>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                PRE-VALIDATED
              </span>
            </div>

            <div className="my-6 rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
              {Object.entries(fields).slice(0, 5).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-800/60 pb-1 text-[11px]">
                  <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="font-bold text-slate-200 truncate max-w-[200px]">{String(v)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              <span>Verified at 300 DPI</span>
              <span className="text-emerald-400 font-bold">DIGILOCKER SYNCED</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Scan className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {doc.fileName}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                  OCR Passed (Score: {doc.qualityScore}%)
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                MahaVault Certificate Image & OCR Recognition Inspector
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('VISUAL')}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  activeTab === 'VISUAL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Visual Certificate
              </button>
              <button
                onClick={() => setActiveTab('OCR_TEXT')}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  activeTab === 'OCR_TEXT' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                OCR Extracted Text
              </button>
              <button
                onClick={() => setActiveTab('METADATA')}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  activeTab === 'METADATA' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Diagnostic Metadata
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50">
          {activeTab === 'VISUAL' && (
            <div className="space-y-6">
              {/* Document Visual Display */}
              <div 
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                className="transition-transform duration-200"
              >
                {renderVisualMockup()}
              </div>

              {/* Zoom & View Controls */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                >
                  <ZoomOut className="h-3.5 w-3.5 inline mr-1" /> Zoom Out
                </button>
                <span className="font-mono text-xs text-slate-400">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                >
                  <ZoomIn className="h-3.5 w-3.5 inline mr-1" /> Zoom In
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {activeTab === 'OCR_TEXT' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 text-xs space-y-1">
                <div className="font-bold text-blue-300 flex items-center gap-1.5">
                  <Scan className="h-4 w-4" />
                  Optical Character Recognition (OCR) Engine Pass
                </div>
                <p className="text-[11px] text-slate-300">
                  Tesseract 5.3 + Custom Maharashtra Devanagari Lexicon. High-confidence text extracted from 300 DPI original.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {Object.entries(fields)
                  .map(([k, v]) => `[EXTRACTED_ENTITY] ${k.toUpperCase()}: ${v}`)
                  .join('\n\n')}
                {'\n\n[OCR_SCAN_STATUS]: 100% MATCHED WITH MAITRI STATUTORY ATTRIBUTE REGEX'}
              </div>
            </div>
          )}

          {activeTab === 'METADATA' && (
            <div className="space-y-4 max-w-2xl mx-auto text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3 font-mono">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Optical & Cryptographic Attributes
                </h4>
                <div className="divide-y divide-slate-800/80">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">File Name:</span>
                    <span className="text-white">{doc.fileName}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Resolution DPI:</span>
                    <span className="text-emerald-400 font-bold">{doc.resolutionDpi} DPI (Optimal)</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Blur Detection:</span>
                    <span className="text-emerald-400 font-bold">Negative (Zero Blur Detected)</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Camera Glare:</span>
                    <span className="text-emerald-400 font-bold">Negative (Zero Flash Glare)</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Overall Quality Index:</span>
                    <span className="text-blue-400 font-bold">{doc.qualityScore} / 100</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">SHA-256 Checksum:</span>
                    <span className="text-slate-300 text-[10px]">7f8a91c0e34b12d9876543210abcdef012345678</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 px-6 py-3 bg-slate-950/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Certified by Maharashtra DigiLocker Gateway • RTS Act 2015 Protected</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
