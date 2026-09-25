'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  SectorType, 
  TalukaZone, 
  LifecycleStage, 
  PollutionCategory,
  KyaQuery 
} from '@approvalos/shared';
import { evaluateKyaQuery, STATUTORY_DOCUMENTS_GUIDE } from '@/lib/knowledge-engine/kya-engine';
import { 
  Compass, 
  Sparkles, 
  Building2, 
  MapPin, 
  Coins, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Flame, 
  Zap, 
  Droplets,
  HelpCircle,
  Download,
  Info,
  Gift,
  Check,
  ChevronDown,
  ChevronUp,
  Award,
  Lightbulb,
  Scale,
  TrendingDown,
  Printer,
  DollarSign
} from 'lucide-react';

const SECTORS: Array<{ value: SectorType; label: string; pollution: PollutionCategory; desc: string }> = [
  { value: 'EV_MANUFACTURING', label: 'Automobile & EV Manufacturing', pollution: 'ORANGE', desc: 'Chassis assembly, battery pack integration, body welding' },
  { value: 'PHARMA', label: 'Pharmaceuticals & API Synthesis', pollution: 'RED', desc: 'Bulk drugs, formulation units, sterile injectables' },
  { value: 'CHEMICALS', label: 'Specialty Chemicals & Petrochemicals', pollution: 'RED', desc: 'Solvent handling, distillation, batch reactor processing' },
  { value: 'FOOD_PROCESSING', label: 'Agro & Food Processing', pollution: 'ORANGE', desc: 'Dairy, grain milling, packaged food, cold chain' },
  { value: 'ELECTRONICS', label: 'Electronics & Semiconductor Assembly', pollution: 'GREEN', desc: 'PCB fabrication, SMT assembly, testing units' },
  { value: 'TEXTILES', label: 'Textiles & Technical Weaving', pollution: 'ORANGE', desc: 'Yarn spinning, processing, fabric finishing' },
];

const MIDC_CLUSTERS = [
  'Chakan MIDC Phase II (Pune)',
  'Talegaon Industrial Park (Pune)',
  'Butibori 5-Star MIDC (Nagpur)',
  'AURIC Smart City (Shendra, Chh. Sambhajinagar)',
  'Waluj Industrial Estate (Chh. Sambhajinagar)',
  'TTC Industrial Area (Turbhe, Navi Mumbai)',
  'Tarapur Chemical Zone (Palghar)',
  'Supa Parner Industrial Park (Ahilyanagar)',
  'Dindori Mega Industrial Area (Nashik)',
  'Roha Chemical Complex (Raigad)',
];

const TALUKA_ZONES: Array<{ value: TalukaZone; label: string; desc: string }> = [
  { value: 'ZONE_A', label: 'Zone A (Developed Core)', desc: 'Mumbai Metropolitan Region, Pune City, Pimpri-Chinchwad' },
  { value: 'ZONE_B', label: 'Zone B (Developing Hubs)', desc: 'Thane rural, Pune surrounding, Nashik municipal periphery' },
  { value: 'ZONE_C', label: 'Zone C (Industrial Growth)', desc: 'Nashik, Kolhapur, Aurangabad, Sangli, Satara' },
  { value: 'ZONE_D', label: 'Zone D (Backward Regions)', desc: 'Solapur, Nagpur, Amravati, Jalgaon, Ahmednagar' },
  { value: 'ZONE_D_PLUS', label: 'Zone D+ (Maximum Incentives)', desc: 'Vidarbha, Marathwada, Nanded, Gadchiroli, Tribal & Naxalite blocks' },
];

const LIFECYCLE_STAGES: Array<{ value: LifecycleStage; label: string; icon: string; desc: string }> = [
  { value: 'PRE_ESTABLISHMENT', label: 'Stage 1: Pre-Establishment', icon: '🏗️', desc: 'Before breaking ground: Land, CTE, Building Plan, Fire Provisional, Power Feasibility' },
  { value: 'PRE_OPERATION', label: 'Stage 2: Pre-Operation / Commissioning', icon: '🏭', desc: 'Before commercial production: Consent to Operate (CTO), Factory License, Final Fire NOC, Boiler' },
  { value: 'DURING_OPERATIONS', label: 'Stage 3: During Operations', icon: '⚙️', desc: 'Active manufacturing: Annual MPCB Form V, Hazardous Form 4, DISH Safety Return, Fire Form B' },
  { value: 'RENEWAL', label: 'Stage 4: Statutory Renewals', icon: '🔄', desc: 'Periodic re-licensing: CTO 1-5 yr Renewal, Factory License Renewal, Fire NOC Renewal' },
];

const INVESTOR_PERSONAS = [
  {
    id: 'EV_PUNE',
    badge: '⚡ EV Mobility (Zone B)',
    title: 'Aegis Lithium EV Assembly',
    cluster: 'Chakan MIDC Phase II (Pune)',
    sector: 'EV_MANUFACTURING' as SectorType,
    zone: 'ZONE_B' as TalukaZone,
    investment: 120,
    power: 3500,
    water: 30,
    boiler: false,
    haz: false,
    stage: 'PRE_ESTABLISHMENT' as LifecycleStage,
    highlight: 'MH EV 15% Capital Grant + 40% SGST Refund',
    color: 'from-blue-600/30 to-indigo-600/20 border-blue-500/40 text-blue-300'
  },
  {
    id: 'PHARMA_AURIC',
    badge: '💊 API Bulk Drug (Zone C)',
    title: 'Vanguard Biopharma Synthesis',
    cluster: 'AURIC Smart City (Shendra, Chh. Sambhajinagar)',
    sector: 'PHARMA' as SectorType,
    zone: 'ZONE_C' as TalukaZone,
    investment: 85,
    power: 1200,
    water: 120,
    boiler: true,
    haz: true,
    stage: 'PRE_ESTABLISHMENT' as LifecycleStage,
    highlight: 'PSI 60% SGST + Clean Tech ZLD Subsidy (₹1 Cr)',
    color: 'from-rose-600/30 to-amber-600/20 border-rose-500/40 text-rose-300'
  },
  {
    id: 'SOLAR_NAGPUR',
    badge: '☀️ Clean Tech Solar (Zone D+)',
    title: 'Helios Photovoltaics India',
    cluster: 'Butibori 5-Star MIDC (Nagpur)',
    sector: 'ELECTRONICS' as SectorType,
    zone: 'ZONE_D_PLUS' as TalukaZone,
    investment: 45,
    power: 600,
    water: 15,
    boiler: false,
    haz: false,
    stage: 'PRE_ESTABLISHMENT' as LifecycleStage,
    highlight: '100% SGST Refund + 10-Yr Duty Waiver + ₹2/unit',
    color: 'from-emerald-600/30 to-teal-600/20 border-emerald-500/40 text-emerald-300'
  },
  {
    id: 'FOOD_NASHIK',
    badge: '🌾 Agro MSME (Zone C)',
    title: 'Godavari Valley Organics',
    cluster: 'Dindori Mega Industrial Area (Nashik)',
    sector: 'FOOD_PROCESSING' as SectorType,
    zone: 'ZONE_C' as TalukaZone,
    investment: 12,
    power: 350,
    water: 40,
    boiler: true,
    haz: false,
    stage: 'PRE_ESTABLISHMENT' as LifecycleStage,
    highlight: 'MAGNET 35% Capital Grant + MSME 5% Interest Subvention',
    color: 'from-purple-600/30 to-blue-600/20 border-purple-500/40 text-purple-300'
  },
  {
    id: 'WOMEN_MSME',
    badge: '👩 Women & SC/ST MSME (Zone D+)',
    title: 'Pragati Precision Green Tech',
    cluster: 'Waluj Industrial Estate (Chh. Sambhajinagar)',
    sector: 'ELECTRONICS' as SectorType,
    zone: 'ZONE_D_PLUS' as TalukaZone,
    investment: 3.5,
    power: 120,
    water: 10,
    boiler: false,
    haz: false,
    stage: 'PRE_ESTABLISHMENT' as LifecycleStage,
    highlight: 'CMEGP 35% Margin Cash Grant + Women +10% SGST',
    color: 'from-pink-600/30 to-purple-600/20 border-pink-500/40 text-pink-300'
  }
];

export default function KnowYourApprovalsPage() {
  const router = useRouter();

  // Questionnaire state
  const [sector, setSector] = useState<SectorType>('EV_MANUFACTURING');
  const [locationType, setLocationType] = useState<'MIDC_ESTATE' | 'PRIVATE_AGRICULTURAL_NA'>('MIDC_ESTATE');
  const [midcCluster, setMidcCluster] = useState(MIDC_CLUSTERS[0]);
  const [talukaZone, setTalukaZone] = useState<TalukaZone>('ZONE_B');
  const [investmentInrCr, setInvestmentInrCr] = useState<number>(35);
  const [stage, setStage] = useState<LifecycleStage>('PRE_ESTABLISHMENT');
  const [powerRequiredKva, setPowerRequiredKva] = useState<number>(750);
  const [waterRequiredKld, setWaterRequiredKld] = useState<number>(45);
  const [hasBoiler, setHasBoiler] = useState(false);
  const [hasHazardousChemicals, setHasHazardousChemicals] = useState(false);

  // Active result tab: 'SCHEMES' (default to put schemes front-and-center), 'ROADMAP', 'DOCUMENTS', 'RISKS', 'DOSSIER'
  const [resultTab, setResultTab] = useState<'SCHEMES' | 'ROADMAP' | 'DOCUMENTS' | 'RISKS' | 'DOSSIER'>('SCHEMES');

  // Scheme filter & accordion expansion state
  const [schemeFilter, setSchemeFilter] = useState<'ALL' | 'ELIGIBLE' | 'TAX' | 'POWER' | 'MSME' | 'SPECIAL'>('ALL');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);

  // Active persona key for visual feedback
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);

  // Derive pollution category from sector
  const currentSectorObj = SECTORS.find(s => s.value === sector) || SECTORS[0];
  const pollutionCategory = currentSectorObj.pollution;
  const isMsme = investmentInrCr <= 50;

  // Run dynamic KYA evaluation
  const kyaResult = useMemo(() => {
    const query: KyaQuery = {
      sector,
      locationType,
      midcCluster: locationType === 'MIDC_ESTATE' ? midcCluster : undefined,
      talukaZone,
      investmentInrCr,
      stage,
      powerRequiredKva,
      waterRequiredKld,
      pollutionCategory,
      hasBoiler,
      hasHazardousChemicals,
      isMsme,
    };
    return evaluateKyaQuery(query);
  }, [sector, locationType, midcCluster, talukaZone, investmentInrCr, stage, powerRequiredKva, waterRequiredKld, pollutionCategory, hasBoiler, hasHazardousChemicals, isMsme]);

  // Filter schemes based on active category filter
  const filteredSchemes = useMemo(() => {
    const list = kyaResult.matchedSchemes || [];
    if (schemeFilter === 'ELIGIBLE') return list.filter(s => s.isEligible);
    if (schemeFilter === 'TAX') return list.filter(s => s.category === 'TAX_REIMBURSEMENT' || s.category === 'STAMP_DUTY');
    if (schemeFilter === 'POWER') return list.filter(s => s.category === 'POWER_ENERGY');
    if (schemeFilter === 'MSME') return list.filter(s => s.category === 'MSME_GRANT');
    if (schemeFilter === 'SPECIAL') return list.filter(s => s.category === 'SPECIAL_POLICY' || s.category === 'GREEN_SUSTAINABILITY');
    return list;
  }, [kyaResult.matchedSchemes, schemeFilter]);

  const handleLaunchCaf = () => {
    const params = new URLSearchParams({
      stage,
      sector,
      zone: talukaZone,
      cluster: midcCluster,
      costCr: investmentInrCr.toString(),
      powerKva: powerRequiredKva.toString(),
      waterKld: waterRequiredKld.toString(),
      boiler: hasBoiler.toString(),
      haz: hasHazardousChemicals.toString(),
    });
    router.push(`/portal/apply?${params.toString()}`);
  };

  const handleLaunchCafWithScheme = (schemeCode?: string) => {
    const params = new URLSearchParams({
      stage,
      sector,
      zone: talukaZone,
      cluster: midcCluster,
      costCr: investmentInrCr.toString(),
      powerKva: powerRequiredKva.toString(),
      waterKld: waterRequiredKld.toString(),
      boiler: hasBoiler.toString(),
      haz: hasHazardousChemicals.toString(),
      ...(schemeCode ? { scheme: schemeCode } : {})
    });
    router.push(`/portal/apply?${params.toString()}`);
  };

  const handleApplyPersona = (p: typeof INVESTOR_PERSONAS[0]) => {
    setActivePersonaId(p.id);
    setSector(p.sector);
    setMidcCluster(p.cluster);
    setLocationType('MIDC_ESTATE');
    setTalukaZone(p.zone);
    setInvestmentInrCr(p.investment);
    setPowerRequiredKva(p.power);
    setWaterRequiredKld(p.water);
    setHasBoiler(p.boiler);
    setHasHazardousChemicals(p.haz);
    setStage(p.stage);
    setResultTab('SCHEMES'); // Make sure scheme is known to people immediately!
  };

  // Upfront vs Recurring benefit estimates
  const upfrontSavingsCr = Number(((investmentInrCr * 0.04) * (kyaResult.eligibleIncentives.stampDutyExemptionPct / 100)).toFixed(2));
  const recurringCashflowCr = Number((kyaResult.eligibleIncentives.estimatedTotalBenefitCr - upfrontSavingsCr).toFixed(2));
  const percentOutlayRecovered = investmentInrCr > 0 ? Math.min(100, Math.round((kyaResult.eligibleIncentives.estimatedTotalBenefitCr / investmentInrCr) * 100)) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            MAITRI 2.0 • Know Your Approvals (KYA) & State Support Engine
          </div>
          <a
            href="https://maitri.maharashtra.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
          >
            <span>Official Portal: maitri.maharashtra.gov.in</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Compass className="h-8 w-8 text-blue-400" />
          Know Your Approvals (KYA) & Government Schemes Discovery
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-4xl mt-1">
          Dynamically discovers your exact statutory clearances under the <strong>Maharashtra Right to Services Act 2015</strong>, mandatory documents, and all <strong>11 Maharashtra Industrial Schemes & Fiscal Grants</strong> tailored to your investment.
        </p>
      </div>

      {/* 1-Click Interactive Industrialist Persona Bar */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              1-Click Maharashtra Industrial Presets (Try Real Projects)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Click any profile to instantly calculate permits and unlock matching subsidies
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {INVESTOR_PERSONAS.map((persona) => {
            const isSelected = activePersonaId === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => handleApplyPersona(persona)}
                className={`text-left rounded-2xl border p-3.5 transition-all flex flex-col justify-between space-y-2 group ${
                  isSelected
                    ? 'border-blue-500 bg-blue-950/40 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold block uppercase tracking-wider text-slate-400 group-hover:text-blue-300">
                    {persona.badge}
                  </span>
                  <div className="font-bold text-xs text-white mt-0.5 line-clamp-1">
                    {persona.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">
                    ₹{persona.investment} Cr Outlay
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 text-[10px] font-medium text-emerald-400 line-clamp-1">
                  ✨ {persona.highlight}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Questionnaire (40%) and Tailored Results (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Questionnaire */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-400" />
                Step 1: Operational Lifecycle Stage
              </h2>
              <span className="text-xs font-mono text-blue-400">Phase</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {LIFECYCLE_STAGES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStage(s.value)}
                  className={`text-left rounded-2xl border p-3.5 transition-all flex items-start gap-3 ${
                    stage === s.value
                      ? 'border-blue-500 bg-blue-950/40 text-white shadow-md shadow-blue-500/10'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{s.icon}</span>
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs">{s.label}</div>
                    <div className="text-[11px] text-slate-400 leading-snug">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Step 2: Sector & Pollution */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-400" />
                  Step 2: Sector & Pollution Scale
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  pollutionCategory === 'RED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                  pollutionCategory === 'ORANGE' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                  pollutionCategory === 'GREEN' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  'bg-slate-500/10 text-slate-300 border-slate-500/30'
                }`}>
                  {pollutionCategory} Category
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Manufacturing Domain</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as SectorType)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  {SECTORS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label} ({s.pollution} Category)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">{currentSectorObj.desc}</p>
              </div>
            </div>

            {/* Step 3: Location & Taluka Zone */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                Step 3: Location & Taluka Zone
              </h2>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setLocationType('MIDC_ESTATE')}
                  className={`p-3 rounded-xl border font-semibold transition-all ${
                    locationType === 'MIDC_ESTATE'
                      ? 'border-blue-500 bg-blue-950/40 text-blue-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  MIDC Industrial Park
                </button>
                <button
                  type="button"
                  onClick={() => setLocationType('PRIVATE_AGRICULTURAL_NA')}
                  className={`p-3 rounded-xl border font-semibold transition-all ${
                    locationType === 'PRIVATE_AGRICULTURAL_NA'
                      ? 'border-blue-500 bg-blue-950/40 text-blue-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Private Land (Sec 44 NA)
                </button>
              </div>

              {locationType === 'MIDC_ESTATE' && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">MIDC Estate / Notified Park</label>
                  <select
                    value={midcCluster}
                    onChange={(e) => setMidcCluster(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    {MIDC_CLUSTERS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">Taluka Zone (PSI 2019 Tier)</label>
                  <span className="text-[10px] text-blue-400 font-mono">Dictates Subsidies</span>
                </div>
                <select
                  value={talukaZone}
                  onChange={(e) => setTalukaZone(e.target.value as TalukaZone)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  {TALUKA_ZONES.map((z) => (
                    <option key={z.value} value={z.value}>
                      {z.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  {TALUKA_ZONES.find(z => z.value === talukaZone)?.desc}
                </p>
              </div>
            </div>

            {/* Step 4: Scale & Utilities */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Coins className="h-4 w-4 text-purple-400" />
                Step 4: Investment & Utilities
              </h2>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Total Fixed Capital Investment:</span>
                  <span className="font-mono font-bold text-white">₹{investmentInrCr} Crores</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="250"
                  step="1"
                  value={investmentInrCr}
                  onChange={(e) => setInvestmentInrCr(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹1 Cr (MSME)</span>
                  <span>₹50 Cr (Medium)</span>
                  <span>₹250 Cr (Mega)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1">Contract Power (kVA)</label>
                  <input
                    type="number"
                    value={powerRequiredKva}
                    onChange={(e) => setPowerRequiredKva(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Daily Water (KLD)</label>
                  <input
                    type="number"
                    value={waterRequiredKld}
                    onChange={(e) => setWaterRequiredKld(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <label className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <input
                    type="checkbox"
                    checked={hasBoiler}
                    onChange={(e) => setHasBoiler(e.target.checked)}
                    className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Steam Boiler Installed</span>
                </label>
                <label className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <input
                    type="checkbox"
                    checked={hasHazardousChemicals}
                    onChange={(e) => setHasHazardousChemicals(e.target.checked)}
                    className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Hazardous / Solvents</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tailored Creative Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Summary Card with Total Entitlement */}
          <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                  Evaluation Complete
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  {kyaResult.applicableApprovals.length} Clearances • {kyaResult.matchedSchemes?.length ?? 0} State Schemes
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  For <span className="font-semibold text-white">{currentSectorObj.label}</span> at{' '}
                  <span className="font-semibold text-white">{locationType === 'MIDC_ESTATE' ? midcCluster : 'Non-MIDC Private Land'}</span> ({talukaZone})
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">RTS SLA Time:</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    ~{kyaResult.totalSlaDaysParallel} Days
                  </span>
                  <span className="text-[10px] text-slate-500 block">vs 240d Legacy</span>
                </div>

                <div className="h-10 w-px bg-slate-800" />

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">Total State Support:</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    ₹{kyaResult.eligibleIncentives.estimatedTotalBenefitCr} Cr
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold block">{percentOutlayRecovered}% Outlay Back</span>
                </div>
              </div>
            </div>

            {/* Launch CAF Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="text-xs text-slate-300">
                Ready to apply? Pre-fill all parameters and auto-claim matched schemes in Maharashtra's Unified CAF.
              </div>
              <button
                onClick={handleLaunchCaf}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all"
              >
                <span>⚡ Apply via Unified CAF</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Result View Mode Switcher (Puts Schemes First & Prominent!) */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
            {[
              { id: 'SCHEMES', label: '💰 State Schemes & Cashflow (11 Programs)', badge: 'Most Popular' },
              { id: 'ROADMAP', label: '🗺️ Clearance Roadmap (Lane Gantt)' },
              { id: 'DOCUMENTS', label: `📑 Document Guide (${kyaResult.mandatoryDocumentsList.length})` },
              { id: 'RISKS', label: '⚠️ Red-Tape Risk Heatmap' },
              { id: 'DOSSIER', label: '📄 Bankable Summary' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setResultTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  resultTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-850'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="rounded-full bg-amber-400 text-slate-950 px-1.5 py-0.5 text-[9px] font-black uppercase">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: SCHEMES & THE MONEY MAP (Front and Center so schemes are known to everyone!) */}
          {resultTab === 'SCHEMES' && (
            <div className="space-y-6">
              {/* The Investor Money Map Banner */}
              <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 p-6 backdrop-blur-xl shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5" />
                      The Maharashtra Investor Money Map
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">
                      You Recover ~₹{kyaResult.eligibleIncentives.estimatedTotalBenefitCr} Crores ({percentOutlayRecovered}% of Outlay)
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Direct fiscal benefits guaranteed under the Maharashtra Package Scheme of Incentives (PSI 2019) & Sector Policies.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/80 p-3 text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block">Accelerated Payback:</span>
                    <span className="text-lg font-black text-emerald-300 font-mono">
                      ~3.2 Years Faster
                    </span>
                    <span className="text-[9px] text-emerald-400 block font-semibold">Government-Backed Cashflow</span>
                  </div>
                </div>

                {/* 2 Cashflow Streams: Upfront vs Yearly */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-blue-500/20 bg-slate-950/70 p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                      1. Pre-Construction Upfront Savings
                    </span>
                    <div className="text-2xl font-black text-white font-mono">
                      ₹{upfrontSavingsCr} Cr
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                        <span><strong>{kyaResult.eligibleIncentives.stampDutyExemptionPct}% Stamp Duty Exemption</strong> on 95-Yr MIDC Lease</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                        <span>Sub-Registrar Conveyance Surcharge Waiver</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/70 p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                      2. Ongoing Operational Cashflow (7-10 Yrs)
                    </span>
                    <div className="text-2xl font-black text-emerald-300 font-mono">
                      ₹{recurringCashflowCr} Cr
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span><strong>{kyaResult.eligibleIncentives.grossSgstReimbursementPct}% Gross SGST Refund</strong> over {kyaResult.eligibleIncentives.sgstReimbursementYears} years</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span><strong>Zero Electricity Duty</strong> for {kyaResult.eligibleIncentives.electricityDutyExemptionYears} years</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span><strong>₹{kyaResult.eligibleIncentives.powerTariffSubsidyPerUnit}/unit Power Rebate</strong> for {kyaResult.eligibleIncentives.powerTariffSubsidyYears} years</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => router.push('/portal/incentives')}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Open Detailed Interactive PSI 2019 Incentive Calculator</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Complete Maharashtra State Industrial Schemes Portfolio */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-6">
                <div className="border-b border-slate-800 pb-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Gift className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">
                          All Maharashtra State Support Schemes & Subsidies
                        </h3>
                        <p className="text-xs text-slate-400">
                          Understand every government grant, tax reimbursement, power rebate, and affirmative action policy available for your unit.
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 font-mono text-xs font-bold text-blue-400">
                      {kyaResult.matchedSchemes?.length || 0} Programs
                    </span>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-3">
                    {[
                      { key: 'ALL', label: `All (${kyaResult.matchedSchemes?.length || 0})` },
                      { key: 'ELIGIBLE', label: `Eligible for You (${kyaResult.matchedSchemes?.filter(s => s.isEligible).length || 0})` },
                      { key: 'TAX', label: 'State Tax & Stamp Duty' },
                      { key: 'POWER', label: 'Power & Electricity' },
                      { key: 'MSME', label: 'MSME & Capital Grants' },
                      { key: 'SPECIAL', label: 'Sector & Affirmative Policies' },
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setSchemeFilter(tab.key as any)}
                        className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                          schemeFilter === tab.key
                            ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                            : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Schemes Cards List */}
                <div className="space-y-4">
                  {filteredSchemes.map((scheme) => {
                    const isExpanded = expandedSchemeId === scheme.id;

                    const categoryColors: Record<string, string> = {
                      TAX_REIMBURSEMENT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                      STAMP_DUTY: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                      POWER_ENERGY: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                      MSME_GRANT: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                      SPECIAL_POLICY: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                      GREEN_SUSTAINABILITY: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
                    };

                    return (
                      <div
                        key={scheme.id}
                        className={`rounded-2xl border transition-all ${
                          scheme.isEligible
                            ? 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                            : 'border-slate-900 bg-slate-950/40 opacity-80 hover:opacity-100'
                        } p-4 space-y-3`}
                      >
                        {/* Top Row: Category, Code, Eligibility Pill */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${categoryColors[scheme.category] || 'bg-slate-800 text-slate-300'}`}>
                              {scheme.categoryLabel}
                            </span>
                            <span className="rounded bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                              {scheme.code}
                            </span>
                          </div>

                          {scheme.isEligible ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" />
                              Eligible for Your Business
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
                              <AlertTriangle className="h-3 w-3" />
                              Conditional / Scale Specific
                            </span>
                          )}
                        </div>

                        {/* Title & Department */}
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {scheme.name}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {scheme.department}
                          </p>
                        </div>

                        {/* In Plain Words (Easy to Understand Summary) */}
                        <div className="rounded-xl border border-blue-500/20 bg-blue-950/30 p-3 space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                            In Simple Terms (Plain-Language Explanation)
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed">
                            {scheme.plainEnglishSummary}
                          </p>
                        </div>

                        {/* Live Calculated Benefit Bar */}
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                          <span className="text-slate-400 font-medium text-[11px]">
                            Calculated Benefit for Your Outlay:
                          </span>
                          <span className="font-mono font-bold text-emerald-300">
                            {scheme.estimatedSavingText}
                          </span>
                        </div>

                        {/* Key Benefit Highlights */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                            Key Fiscal Advantages:
                          </span>
                          <ul className="space-y-1 text-xs text-slate-300">
                            {scheme.benefitHighlights.map((benefit, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2">
                                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Conditional warning if ineligible */}
                        {scheme.ineligibilityReason && (
                          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-300 flex items-center gap-2">
                            <Info className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                            <span><strong>Qualification Note:</strong> {scheme.ineligibilityReason}</span>
                          </div>
                        )}

                        {/* Collapsible Details Drawer */}
                        <div className="pt-2 border-t border-slate-900">
                          <button
                            onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
                          >
                            <span>{isExpanded ? 'Hide Eligibility Checklist & Claim Steps' : 'View Eligibility Checklist, Documents & How to Claim'}</span>
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-3 space-y-3 pt-3 border-t border-slate-800 text-xs">
                              {/* Eligibility Criteria Checklist */}
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                                  Qualification Checklist:
                                </span>
                                <ul className="space-y-1 text-slate-300">
                                  {scheme.eligibilityConditions.map((cond, cIdx) => (
                                    <li key={cIdx} className="flex items-start gap-2 text-[11px]">
                                      <CheckCircle2 className="h-3 w-3 text-blue-400 shrink-0 mt-0.5" />
                                      <span>{cond}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Documents Required */}
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                                  Documents to Keep Ready:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {scheme.documentsRequired.map((docCode) => (
                                    <span
                                      key={docCode}
                                      className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] font-mono text-purple-300"
                                    >
                                      {docCode.replace(/_/g, ' ')}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* How to Claim */}
                              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-[11px] text-slate-300 space-y-1">
                                <span className="font-bold text-white block">Official Claiming Procedure:</span>
                                <p className="text-slate-300">{scheme.howToClaim}</p>
                              </div>

                              {/* Official Policy GR */}
                              <div className="text-[10px] font-mono text-slate-500">
                                Policy Reference: {scheme.policyDocument}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Button: Pre-Claim in CAF */}
                        <div className="pt-2">
                          <button
                            onClick={() => handleLaunchCafWithScheme(scheme.code)}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 px-4 py-2 text-xs font-bold text-blue-300 transition-colors"
                          >
                            <span>⚡ Pre-Claim this Scheme in Unified CAF</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLEARANCE ROADMAP (Parallel Lane Gantt & SLAs) */}
          {resultTab === 'ROADMAP' && (
            <div className="space-y-6">
              {/* Parallel vs Serial Visual Gantt Lane */}
              <div className="rounded-3xl border border-blue-500/30 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                      Process Engineering Breakthrough
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      Parallel Multi-Department Clearance Lanes
                    </h3>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    162 Days Saved
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-rose-400 font-bold">Traditional Sequential Filings</span>
                      <span className="font-mono font-bold text-rose-300">240 Days</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-rose-500 w-full rounded-full" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Department silos: Wait for Land Deed ➔ then file CTE ➔ then file Plan ➔ serial queries.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold">ApprovalOS Parallel Tracks</span>
                      <span className="font-mono font-bold text-emerald-300">~{kyaResult.totalSlaDaysParallel} Days</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[32%] rounded-full" />
                    </div>
                    <p className="text-[11px] text-emerald-400 font-medium">
                      Simultaneous filings across 4 lanes under Maharashtra RTS Act 2015 deemed approvals.
                    </p>
                  </div>
                </div>

                {/* 4 Lanes Diagram */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-blue-500/20 bg-slate-950/60 p-3 space-y-1">
                    <span className="text-[10px] font-bold text-blue-400 uppercase">Lane 1: Land & Civil</span>
                    <div className="text-xs text-white font-semibold">MIDC Land ➔ Building Plan</div>
                    <span className="text-[10px] text-slate-400">RTS Statutory SLA: 30 Days</span>
                  </div>

                  <div className="rounded-xl border border-purple-500/20 bg-slate-950/60 p-3 space-y-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase">Lane 2: Environment</span>
                    <div className="text-xs text-white font-semibold">MPCB CTE / CTO ➔ ZLD</div>
                    <span className="text-[10px] text-slate-400">RTS Statutory SLA: 45–60 Days</span>
                  </div>

                  <div className="rounded-xl border border-amber-500/20 bg-slate-950/60 p-3 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Lane 3: Power Feasibility</span>
                    <div className="text-xs text-white font-semibold">MSEDCL HT Substation Feeder</div>
                    <span className="text-[10px] text-slate-400">RTS Statutory SLA: 30 Days</span>
                  </div>

                  <div className="rounded-xl border border-rose-500/20 bg-slate-950/60 p-3 space-y-1">
                    <span className="text-[10px] font-bold text-rose-400 uppercase">Lane 4: Safety & Fire</span>
                    <div className="text-xs text-white font-semibold">DISH Factory Reg ➔ Fire NOC</div>
                    <span className="text-[10px] text-slate-400">RTS Statutory SLA: 30 Days</span>
                  </div>
                </div>
              </div>

              {/* Clearances List */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Mandatory Clearances & Statutory Safeguards
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Maharashtra RTS Act 2015 SLAs
                  </span>
                </div>

                <div className="space-y-3">
                  {kyaResult.applicableApprovals.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 hover:border-slate-700 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-400">
                              {app.code}
                            </span>
                            <h4 className="text-xs font-bold text-white">
                              {app.name}
                            </h4>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {app.department}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-400">
                            {app.slaDays} Days SLA
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-900 pt-2">
                        {app.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 pt-1">
                        <span className="font-mono text-slate-500">
                          Governing Law: {app.statutoryAct}
                        </span>
                        <span className="text-blue-400 font-mono">
                          {app.mandatoryDocuments.length} Required Files
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS & SCRUTINY GUIDE */}
          {resultTab === 'DOCUMENTS' && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-400" />
                    Documentation Requirements & Scrutiny Guide
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pre-validate every file to eliminate redundant multi-desk queries and rejection traps.
                  </p>
                </div>
                <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-purple-300">
                  {kyaResult.mandatoryDocumentsList.length} Files
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {kyaResult.mandatoryDocumentsList.map((doc) => {
                  const guide = STATUTORY_DOCUMENTS_GUIDE[doc.code];
                  return (
                    <div
                      key={doc.code}
                      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white truncate max-w-[200px]">
                          {doc.name}
                        </span>
                        <span className="rounded bg-blue-500/10 text-blue-400 font-mono text-[9px] px-1.5 py-0.5 border border-blue-500/20">
                          {guide?.formatReq || 'PDF'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-snug">
                        {doc.description}
                      </p>

                      <div className="border-t border-slate-900 pt-2 text-[10px] space-y-1">
                        <div className="text-slate-500 truncate">
                          Issuing Source: <span className="text-slate-300">{guide?.issuingSource}</span>
                        </div>
                        {guide?.commonRejectionPitfall && (
                          <div className="text-amber-400/90 text-[10px] flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            <span className="truncate">Pitfall: {guide.commonRejectionPitfall}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: RED-TAPE RISK HEATMAP */}
          {resultTab === 'RISKS' && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Predictive Red-Tape Elimination
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Top Maharashtra Regulatory Friction Points & ApprovalOS Solutions
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  {
                    department: 'MPCB Environmental Cell',
                    risk: 'Zero Liquid Discharge (ZLD) Mass Balance Ambiguity',
                    delayDays: '+25 Days',
                    description: 'Chemical & Pharma units face repeated queries if daily water input does not equal RO recovery + MEE condensate + solid salt cake.',
                    solution: 'ApprovalOS pre-attaches standardized MPCB water balance mass sheet, guaranteeing first-pass scrutiny sign-off.',
                    badge: 'High Impact'
                  },
                  {
                    department: 'MSEDCL Industrial Feeder Cell',
                    risk: '33kV Substation Feeder Line-of-Route Objections',
                    delayDays: '+20 Days',
                    description: 'High power (>1000 kVA) connections stalled over ROW (Right of Way) disputes on transmission lines.',
                    solution: 'MahaVault pulls pre-surveyed MIDC corridor maps, linking the plot directly to the nearest bay without re-survey.',
                    badge: 'Infrastructure'
                  },
                  {
                    department: 'MIDC Special Planning Authority',
                    risk: '6.0m Fire Driveway Boundary Setback Objections',
                    delayDays: '+15 Days',
                    description: 'Factory layout plans rejected if building edge to boundary is under Rule 14.1 of MIDC DCR 2009.',
                    solution: 'AI Pre-Submission Quality Audit checks AutoCAD/PDF layout margins before submission.',
                    badge: 'Civil Sanction'
                  },
                  {
                    department: 'Cross-Department Multi-Desk Scrutiny',
                    risk: 'Repetitive Re-Verification of Land Deeds & PAN',
                    delayDays: '+30 Days',
                    description: 'MPCB, DISH, and MSEDCL each independently requesting physical copies of registered land allotment deeds.',
                    solution: 'RTS Act 2015 Sec 3(2) Scrutiny Shield locks sister-department verified records across all desks.',
                    badge: 'Statutory Shield'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.risk}</span>
                      <span className="rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 font-mono text-[10px] font-bold">
                        {item.delayDays}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{item.description}</p>
                    <div className="rounded-xl bg-blue-950/30 border border-blue-500/20 p-2.5 text-[11px] text-blue-200">
                      <strong className="text-blue-400">ApprovalOS Pre-emption: </strong>
                      {item.solution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EXECUTIVE BANKABLE SUMMARY (DOSSIER) */}
          {resultTab === 'DOSSIER' && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                    Official Executive Dossier
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Project Readiness & Statutory Entitlement Brief
                  </h3>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-white transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Dossier</span>
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-900">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Project Domain:</span>
                    <span className="font-bold text-white text-sm">{currentSectorObj.label}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Location & Zone:</span>
                    <span className="font-bold text-white text-sm">{midcCluster} ({talukaZone})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Capital Outlay:</span>
                    <span className="font-bold text-emerald-300 font-mono text-sm">₹{investmentInrCr} Crores</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Government Subsidies:</span>
                    <span className="font-bold text-emerald-400 font-mono text-sm">₹{kyaResult.eligibleIncentives.estimatedTotalBenefitCr} Cr ({percentOutlayRecovered}%)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-300 block text-[11px] uppercase tracking-wider">
                    Statutory Clearance Checklist:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {kyaResult.applicableApprovals.map(a => (
                      <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px]">
                        <span className="text-slate-200">{a.name}</span>
                        <span className="font-mono text-blue-400 text-[10px]">{a.slaDays}d</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <span className="font-bold text-slate-300 block text-[11px] uppercase tracking-wider">
                    Key Entitled Schemes:
                  </span>
                  <div className="space-y-1.5">
                    {filteredSchemes.slice(0, 5).map(s => (
                      <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px]">
                        <span className="font-medium text-white">{s.name}</span>
                        <span className="font-mono text-emerald-300 font-bold">{s.estimatedSavingText}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Ready to file? This dossier pre-populates all 15 department CAF sections.
                </span>
                <button
                  onClick={handleLaunchCaf}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  <span>Submit via CAF</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
