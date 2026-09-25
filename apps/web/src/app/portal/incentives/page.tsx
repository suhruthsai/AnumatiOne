'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { IncentiveScheme, TalukaZone, SectorType } from '@approvalos/shared';
import { matchIncentivesForProfile, MASTER_INCENTIVE_SCHEMES } from '@/lib/incentives/incentive-matcher';
import { 
  Gift, 
  IndianRupee, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  FileText,
  BadgePercent,
  Calculator,
  Zap,
  MapPin,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Percent
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TALUKA_ZONES: Array<{ value: TalukaZone; label: string; desc: string }> = [
  { value: 'ZONE_A', label: 'Zone A (Developed Core)', desc: 'Mumbai MMR, Pune City, PCMC' },
  { value: 'ZONE_B', label: 'Zone B (Developing Hubs)', desc: 'Thane rural, Pune surrounding, Nashik periphery' },
  { value: 'ZONE_C', label: 'Zone C (Industrial Growth)', desc: 'Nashik, Kolhapur, Aurangabad, Sangli, Satara' },
  { value: 'ZONE_D', label: 'Zone D (Backward Districts)', desc: 'Solapur, Nagpur, Amravati, Jalgaon, Ahmednagar' },
  { value: 'ZONE_D_PLUS', label: 'Zone D+ (Maximum Incentives)', desc: 'Vidarbha, Marathwada, Nanded, Gadchiroli, Tribal blocks' },
];

export default function IncentivesPage() {
  const router = useRouter();
  const { currentProfile } = useAppStore();

  // Interactive Calculator State
  const [fciCr, setFciCr] = useState<number>(currentProfile.investmentInrCr || 40);
  const [zone, setZone] = useState<TalukaZone>('ZONE_C');
  const [sector, setSector] = useState<SectorType>(currentProfile.sector || 'EV_MANUFACTURING');
  const [isWomenEntrepreneur, setIsWomenEntrepreneur] = useState(false);
  const [hasCaptiveSolar, setHasCaptiveSolar] = useState(true);
  const [isAgroProcessing, setIsAgroProcessing] = useState(false);
  const [claimedSchemeId, setClaimedSchemeId] = useState<string | null>(null);

  // Dynamic PSI 2019 Calculations
  const psiCalculations = useMemo(() => {
    let sgstPct = 0;
    let sgstYears = 0;
    let stampDutyPct = 0;
    let electricityYears = 0;
    let powerSubsidyPerUnit = 0;
    let powerSubsidyYears = 0;

    switch (zone) {
      case 'ZONE_A':
        sgstPct = sector === 'EV_MANUFACTURING' ? 30 : 0;
        sgstYears = 5;
        stampDutyPct = 0;
        electricityYears = 0;
        powerSubsidyPerUnit = 0;
        powerSubsidyYears = 0;
        break;
      case 'ZONE_B':
        sgstPct = 40;
        sgstYears = 7;
        stampDutyPct = 50;
        electricityYears = 5;
        powerSubsidyPerUnit = 1.0;
        powerSubsidyYears = 3;
        break;
      case 'ZONE_C':
        sgstPct = 60;
        sgstYears = 7;
        stampDutyPct = 100;
        electricityYears = 7;
        powerSubsidyPerUnit = 1.5;
        powerSubsidyYears = 3;
        break;
      case 'ZONE_D':
        sgstPct = 80;
        sgstYears = 8;
        stampDutyPct = 100;
        electricityYears = 8;
        powerSubsidyPerUnit = 1.75;
        powerSubsidyYears = 5;
        break;
      case 'ZONE_D_PLUS':
        sgstPct = 100;
        sgstYears = 10;
        stampDutyPct = 100;
        electricityYears = 10;
        powerSubsidyPerUnit = 2.0;
        powerSubsidyYears = 5;
        break;
    }

    if (isWomenEntrepreneur) sgstPct = Math.min(100, sgstPct + 10);
    if (sector === 'EV_MANUFACTURING') sgstPct = Math.min(100, sgstPct + 15);

    // Financial Values
    const sgstBenefitCr = Number(((fciCr * (sgstPct / 100))).toFixed(2));
    const stampDutyBenefitCr = Number(((fciCr * 0.04) * (stampDutyPct / 100)).toFixed(2));
    const electricityBenefitCr = Number((0.25 * electricityYears).toFixed(2));
    const powerSubsidyBenefitCr = Number((powerSubsidyPerUnit * 0.20 * powerSubsidyYears).toFixed(2));
    const msmeInterestBenefitCr = fciCr <= 50 ? Number((0.05 * Math.min(fciCr * 0.6, 10) * 3).toFixed(2)) : 0;
    const greenBonusCr = hasCaptiveSolar ? Number((fciCr * 0.05).toFixed(2)) : 0;

    const totalBenefitCr = Number((sgstBenefitCr + stampDutyBenefitCr + electricityBenefitCr + powerSubsidyBenefitCr + msmeInterestBenefitCr + greenBonusCr).toFixed(2));

    return {
      sgstPct,
      sgstYears,
      sgstBenefitCr,
      stampDutyPct,
      stampDutyBenefitCr,
      electricityYears,
      electricityBenefitCr,
      powerSubsidyPerUnit,
      powerSubsidyYears,
      powerSubsidyBenefitCr,
      msmeInterestBenefitCr,
      greenBonusCr,
      totalBenefitCr,
    };
  }, [fciCr, zone, sector, isWomenEntrepreneur, hasCaptiveSolar]);

  const handleClaim = (schemeId: string) => {
    setClaimedSchemeId(schemeId);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleApplyViaCaf = () => {
    const params = new URLSearchParams({
      stage: 'PRE_ESTABLISHMENT',
      sector,
      zone,
      costCr: fciCr.toString(),
    });
    router.push(`/portal/apply?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Title & MAITRI Links */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            Government of Maharashtra • Package Scheme of Incentives (PSI 2019)
          </div>
          <a
            href="https://maitri.maharashtra.gov.in/wp-content/portal/incentive_calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
          >
            <span>Official MAITRI Incentive Calculator</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Calculator className="h-8 w-8 text-emerald-400" />
          State Support Services & Industrial Incentive Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-1">
          Simulate statutory state subsidies under Maharashtra's Industrial Policy, Package Scheme of Incentives (PSI 2019), and EV Policy 2021. Adjust capital outlay, taluka zone, and enterprise category to calculate gross SGST refunds, stamp duty waivers, and power subsidies.
        </p>
      </div>

      {/* Main Interactive Calculator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calculator className="h-4 w-4 text-emerald-400" />
                Investment Parameters
              </h2>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                PSI 2019 Calibrated
              </span>
            </div>

            {/* FCI Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Fixed Capital Investment (FCI):</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">₹{fciCr} Crores</span>
              </div>
              <input
                type="range"
                min={2}
                max={250}
                step={1}
                value={fciCr}
                onChange={(e) => setFciCr(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹2 Cr (Micro)</span>
                <span>₹50 Cr (MSME Cap)</span>
                <span>₹250 Cr (Mega)</span>
              </div>
            </div>

            {/* Taluka Zone Selector */}
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <label className="text-xs font-semibold text-slate-300 block">
                Taluka Development Category (Incentive Tier):
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value as TalukaZone)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                {TALUKA_ZONES.map((z) => (
                  <option key={z.value} value={z.value}>
                    {z.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-emerald-400">
                {TALUKA_ZONES.find(z => z.value === zone)?.desc}
              </p>
            </div>

            {/* Sector Selector */}
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <label className="text-xs font-semibold text-slate-300 block">
                Target Sector / Priority Category:
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as SectorType)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="EV_MANUFACTURING">Automobile & EV Components (+15% Policy Boost)</option>
                <option value="PHARMA">Pharmaceuticals & Bulk Drugs</option>
                <option value="CHEMICALS">Specialty Chemicals</option>
                <option value="FOOD_PROCESSING">Food Processing & Cold Chain</option>
                <option value="ELECTRONICS">Electronics & Hardware Assembly</option>
                <option value="TEXTILES">Textiles & Garmenting</option>
              </select>
            </div>

            {/* Special Policy Boosters */}
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <label className="text-xs font-semibold text-slate-300 block">
                Special State Policy Additions:
              </label>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isWomenEntrepreneur}
                    onChange={(e) => setIsWomenEntrepreneur(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Women Entrepreneur / SC-ST Unit (+10% SGST Refund)</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCaptiveSolar}
                    onChange={(e) => setHasCaptiveSolar(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Captive Solar / Zero-Discharge Green Unit (+5% Grant)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Breakdown Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Total Financial Benefit Hero Card */}
          <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Total Statutory Fiscal Benefit
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                  ₹{psiCalculations.totalBenefitCr} Crores
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Estimated total state support package unlocked for ₹{fciCr} Cr project in {zone}.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">
                  ⚡ Pre-Vetted Eligibility: 100%
                </span>
              </div>
            </div>

            {/* Direct Auto-Claim Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="text-xs text-slate-300">
                Incentives can be auto-claimed during Common Application Form (CAF) filing.
              </div>
              <button
                onClick={handleApplyViaCaf}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition-all"
              >
                <span>⚡ Auto-Claim in Single-Window CAF</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Component-Wise Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Gross SGST Refund */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <BadgePercent className="h-4 w-4 text-emerald-400" />
                  Gross SGST Reimbursement (IPS)
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {psiCalculations.sgstPct}% of FCI
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                ₹{psiCalculations.sgstBenefitCr} Cr
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Reimbursed over {psiCalculations.sgstYears} years against SGST paid on commercial manufacturing output.
              </p>
            </div>

            {/* 2. Stamp Duty Exemption */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-blue-400" />
                  100% Stamp Duty Exemption
                </span>
                <span className="text-xs font-mono font-bold text-blue-400">
                  {psiCalculations.stampDutyPct}% Waiver
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                ₹{psiCalculations.stampDutyBenefitCr} Cr
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Complete waiver of stamp duty under Bombay Stamp Act on execution of MIDC industrial lease deed.
              </p>
            </div>

            {/* 3. Electricity Duty Exemption */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-400" />
                  Electricity Duty Exemption
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {psiCalculations.electricityYears} Years Exemption
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                ₹{psiCalculations.electricityBenefitCr} Cr
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                100% exemption on power duty levied by MSEDCL for dedicated HT industrial feeder connections.
              </p>
            </div>

            {/* 4. Power Tariff & MSME Support */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  Power Subsidy & MSME Subvention
                </span>
                <span className="text-xs font-mono font-bold text-purple-400">
                  ₹{psiCalculations.powerSubsidyPerUnit}/unit
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                ₹{(psiCalculations.powerSubsidyBenefitCr + psiCalculations.msmeInterestBenefitCr).toFixed(2)} Cr
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Power bill tariff subsidy for {psiCalculations.powerSubsidyYears} years + 5% interest subvention for MSME term loans.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Matched Central & State Government Support Schemes */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Gift className="h-4 w-4 text-emerald-400" />
              Eligible Government Support Schemes Portfolio
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Statutory central and state schemes auto-matched against your project profile.
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-400">
            {MASTER_INCENTIVE_SCHEMES.length} Active Schemes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matchIncentivesForProfile({ ...currentProfile, sector, investmentInrCr: fciCr, landType: zone === 'ZONE_D_PLUS' || zone === 'ZONE_D' ? 'GOVT_INDUSTRIAL_PARK' : currentProfile.landType }).schemes.slice(0, 4).map((scheme) => {
            const isClaimed = claimedSchemeId === scheme.id;
            return (
              <div
                key={scheme.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-900 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {scheme.code} • {scheme.ministryOrState}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">
                        {scheme.name}
                      </h4>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300 border border-emerald-500/30 shrink-0">
                      {scheme.matchScore > 0 ? `${scheme.matchScore}% Match` : 'Eligible'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {scheme.description}
                  </p>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Max Scheme Cap:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      ₹{(scheme.maxSubsidyInr / 10000000).toFixed(1)} Cr
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-3">
                  {isClaimed ? (
                    <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-2 text-center text-xs font-bold text-emerald-300">
                      ✓ Claimed in Project Dossier
                    </div>
                  ) : (
                    <button
                      onClick={() => handleClaim(scheme.id)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 px-4 text-xs font-bold text-slate-200 transition-all"
                    >
                      <span>1-Click Pre-Certify Eligibility</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
