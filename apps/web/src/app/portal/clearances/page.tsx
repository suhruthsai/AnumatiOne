'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowRight, 
  ExternalLink, 
  Zap, 
  Flame, 
  Droplet, 
  Sparkles, 
  Layers, 
  AlertTriangle, 
  Download, 
  Info,
  Calendar,
  Scale,
  X,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

type ClearanceStage = 'PRE_ESTABLISHMENT' | 'PRE_OPERATION' | 'GREEN_CHANNEL' | 'ANNUAL_RETURNS';

interface ClearanceItem {
  id: string;
  code: string;
  name: string;
  department: string;
  departmentShort: 'MPCB' | 'MIDC' | 'DISH' | 'MSEDCL' | 'FIRE' | 'BOILERS' | 'REVENUE';
  stage: 'PRE_ESTABLISHMENT' | 'PRE_OPERATION';
  slaDays: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  canAutoApprove: boolean;
  legalAct: string;
  sectionOrRule: string;
  description: string;
  issuingAuthority: string;
  documentsRequired: string[];
  prerequisites: string[];
  validityYears: number | string;
  keyRuleSafeguard: string;
}

const STATUTORY_CLEARANCES: ClearanceItem[] = [
  // --- PRE-ESTABLISHMENT ---
  {
    id: 'LAND_ALLOTMENT',
    code: 'MIDC-01',
    name: 'MIDC Industrial Land Allotment & Lease Deed',
    department: 'Maharashtra Industrial Development Corp (MIDC)',
    departmentShort: 'MIDC',
    stage: 'PRE_ESTABLISHMENT',
    slaDays: 15,
    riskLevel: 'MEDIUM',
    canAutoApprove: true,
    legalAct: 'MIDC Act 1961',
    sectionOrRule: 'Regulation 11',
    description: 'Statutory lease deed execution, plot demarcation, and boundary possession certificate in notified industrial parks.',
    issuingAuthority: 'Regional Officer, MIDC Regional Office',
    documentsRequired: ['Promoter PAN & Aadhaar', 'Company Incorporation / Udyam', 'Detailed Project Report (DPR)', 'Land Survey Demarcation'],
    prerequisites: [],
    validityYears: 95,
    keyRuleSafeguard: 'Zero Stamp Duty payment required on presentation of DIC certificate.',
  },
  {
    id: 'CTE_POLLUTION',
    code: 'MPCB-01',
    name: 'Consent to Establish (CTE) — MPCB',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    departmentShort: 'MPCB',
    stage: 'PRE_ESTABLISHMENT',
    slaDays: 30,
    riskLevel: 'HIGH',
    canAutoApprove: true,
    legalAct: 'Water Act 1974 & Air Act 1981',
    sectionOrRule: 'Section 25 (Water) & Section 21 (Air)',
    description: 'Mandatory environmental permission prior to initiating groundbreaking civil construction or equipment installation.',
    issuingAuthority: 'Member Secretary / Sub-Regional Officer, MPCB',
    documentsRequired: ['MIDC Land Allotment Letter', 'Effluent Treatment Plant (ETP) Blueprint', 'Water Mass-Balance Schematic', 'ZLD Technical Report'],
    prerequisites: ['LAND_ALLOTMENT'],
    validityYears: 5,
    keyRuleSafeguard: 'White/Green tier units qualify for 48-Hour Green Channel instant deemed sanction.',
  },
  {
    id: 'BUILDING_PLAN_BPAMS',
    code: 'MIDC-02',
    name: 'MIDC Special Planning Authority (SPA) Building Plan',
    department: 'MIDC Special Planning Authority (SPA)',
    departmentShort: 'MIDC',
    stage: 'PRE_ESTABLISHMENT',
    slaDays: 20,
    riskLevel: 'MEDIUM',
    canAutoApprove: true,
    legalAct: 'MIDC Development Control Regulations (DCR) 2009',
    sectionOrRule: 'Rule 14 & Rule 18 (BPAMS)',
    description: 'Structural vetting, FSI/FAR compliance, and mandatory 12.0m clear peripheral fire tender driveway clearance.',
    issuingAuthority: 'Executive Engineer & Special Planning Authority (SPA), MIDC',
    documentsRequired: ['CAD Layout Drawings (DXF format)', 'Structural Stability Certificate', 'Architectural Site Plan', 'Soil Bearing Capacity Report'],
    prerequisites: ['LAND_ALLOTMENT'],
    validityYears: 3,
    keyRuleSafeguard: 'Auto-CAD pre-scrutiny via MahaVault detects setback violations before official submission.',
  },
  {
    id: 'FIRE_PROVISIONAL_NOC',
    code: 'FIRE-01',
    name: 'Provisional Fire Safety NOC',
    department: 'Maharashtra Fire Services / MIDC Fire Brigade',
    departmentShort: 'FIRE',
    stage: 'PRE_ESTABLISHMENT',
    slaDays: 15,
    riskLevel: 'HIGH',
    canAutoApprove: false,
    legalAct: 'Maharashtra Fire Prevention & Life Safety Act 2006',
    sectionOrRule: 'Section 3 & Schedule I',
    description: 'Architectural fire defense vetting, static fire water tank sizing (min 100,000L), and hydrant ring main schematic review.',
    issuingAuthority: 'Chief Fire Officer (CFO), Maharashtra Fire Services',
    documentsRequired: ['Building Floor Plans', 'Hydrant Network Single-Line Schematic', 'Fire Water Sump Calculation', 'Emergency Egress Width Proof'],
    prerequisites: ['BUILDING_PLAN_BPAMS'],
    validityYears: 1,
    keyRuleSafeguard: 'Runs concurrently with Building Plan approval, saving 3 weeks of dead time.',
  },
  {
    id: 'TREE_FELLING_NOC',
    code: 'REV-01',
    name: 'Tree Protection & Felling Permission',
    department: 'Revenue & Forest Department, Maharashtra',
    departmentShort: 'REVENUE',
    stage: 'PRE_ESTABLISHMENT',
    slaDays: 15,
    riskLevel: 'LOW',
    canAutoApprove: true,
    legalAct: 'Maharashtra (Urban Areas) Protection & Preservation of Trees Act',
    sectionOrRule: 'Section 8',
    description: 'Plot clearance permission with mandatory compensatory afforestation undertaking (3 saplings per felled tree).',
    issuingAuthority: 'Tree Officer / Sub-Divisional Magistrate (SDM)',
    documentsRequired: ['Site Cadastral Map', 'Tree Census Count & GPS Points', 'Compensatory Afforestation Plan'],
    prerequisites: ['LAND_ALLOTMENT'],
    validityYears: 1,
    keyRuleSafeguard: 'Auto-waived if industrial plot contains zero protected tree canopies.',
  },
  {
    id: 'CGWA_GROUNDWATER',
    code: 'ENV-03',
    name: 'Groundwater Extraction NOC — CGWA / MWRRA',
    department: 'Maharashtra Water Resources Regulatory Authority (MWRRA)',
    departmentShort: 'MPCB',
    stage: 'PRE_ESTABLISHMENT',
    slaDays: 30,
    riskLevel: 'HIGH',
    canAutoApprove: false,
    legalAct: 'MWRRA Act 2005 & Central Ground Water Authority Guidelines',
    sectionOrRule: 'Section 14',
    description: 'Hydrogeological assessment and rainwater harvesting recharge compliance for industrial borewell extraction.',
    issuingAuthority: 'Regional Director, CGWA / District Collector',
    documentsRequired: ['Hydrogeological Survey Report', 'Rainwater Harvesting Dual-Recharge Design', 'Flow Meter Telemetry Specs'],
    prerequisites: ['LAND_ALLOTMENT'],
    validityYears: 3,
    keyRuleSafeguard: 'Not required if unit draws 100% piped water supply from MIDC industrial feeder.',
  },

  // --- PRE-OPERATION ---
  {
    id: 'CTO_POLLUTION',
    code: 'MPCB-02',
    name: 'Consent to Operate (CTO) & Sensor Telemetry',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    departmentShort: 'MPCB',
    stage: 'PRE_OPERATION',
    slaDays: 25,
    riskLevel: 'HIGH',
    canAutoApprove: true,
    legalAct: 'Water Act 1974 & Air Act 1981',
    sectionOrRule: 'Section 26 & Section 21',
    description: 'Final environmental authorization to commence commercial production, commissioning ETP and OCEMS digital telemetry.',
    issuingAuthority: 'Member Secretary / Regional Officer, MPCB',
    documentsRequired: ['CTE Grant Copy', 'ETP Installation & Trial Run Certificate', 'OCEMS Sensor IP Telemetry Link', 'Hazardous Waste Management Plan'],
    prerequisites: ['CTE_POLLUTION', 'BUILDING_PLAN_BPAMS'],
    validityYears: 5,
    keyRuleSafeguard: 'Instant digital renewal granted automatically if OCEMS telemetry reports 100% compliance.',
  },
  {
    id: 'FACTORY_LICENSE',
    code: 'DISH-01',
    name: 'Factory License & Plan Approval — DISH Maharashtra',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    departmentShort: 'DISH',
    stage: 'PRE_OPERATION',
    slaDays: 20,
    riskLevel: 'MEDIUM',
    canAutoApprove: true,
    legalAct: 'Maharashtra Factories Rules 1963 & Factories Act 1948',
    sectionOrRule: 'Section 6 & Rule 4',
    description: 'Occupational safety audit, emergency exits, machine guarding, and welfare compliance prior to workforce entry.',
    issuingAuthority: 'Joint Director / Factory Inspector, DISH Maharashtra',
    documentsRequired: ['Factory Machinery Layout', 'Ventilation & Lighting Lux Calculations', 'Worker Welfare Amenities Plan', 'Boiler / Pressure Vessel List'],
    prerequisites: ['BUILDING_PLAN_BPAMS', 'FIRE_PROVISIONAL_NOC'],
    validityYears: 5,
    keyRuleSafeguard: 'Synchronized joint site visit with Fire and MPCB via Common Inspection Planner.',
  },
  {
    id: 'POWER_SANCTION',
    code: 'MSEDCL-01',
    name: 'HT 11kV/22kV/33kV Power Load Release — MSEDCL',
    department: 'MSEDCL (Mahavitaran) Industrial Wing',
    departmentShort: 'MSEDCL',
    stage: 'PRE_OPERATION',
    slaDays: 20,
    riskLevel: 'MEDIUM',
    canAutoApprove: true,
    legalAct: 'Electricity Act 2003 & MERC Supply Code',
    sectionOrRule: 'Regulation 4.1',
    description: 'High Tension industrial transformer step-down energization, meter testing, and tariff category sanction.',
    issuingAuthority: 'Superintending Engineer (HT), MSEDCL',
    documentsRequired: ['Electrical Contractor Form A', 'Transformer Test Report (CEIG Clearance)', 'Connected Load Distribution Table', 'MIDC Possession Receipt'],
    prerequisites: ['LAND_ALLOTMENT'],
    validityYears: 'Permanent',
    keyRuleSafeguard: '18 days of calculated slack in AnumatiOne ensures power release never delays commissioning.',
  },
  {
    id: 'FIRE_FINAL_NOC',
    code: 'FIRE-02',
    name: 'Final Occupancy Fire Safety NOC',
    department: 'Maharashtra Fire Services / MIDC Fire Brigade',
    departmentShort: 'FIRE',
    stage: 'PRE_OPERATION',
    slaDays: 14,
    riskLevel: 'HIGH',
    canAutoApprove: false,
    legalAct: 'Maharashtra Fire Prevention & Life Safety Act 2006',
    sectionOrRule: 'Section 4 & Rule 6',
    description: 'Physical hydraulic pressure test of fire ring main, smoke detector commissioning, and building occupancy permit.',
    issuingAuthority: 'Chief Fire Officer (CFO), MIDC Fire Command',
    documentsRequired: ['Provisional NOC Copy', 'Licensed Fire Agency Installation Certificate', 'Fire Pump Flow Test Certificate', 'Fire Driveway As-Built Photos'],
    prerequisites: ['FIRE_PROVISIONAL_NOC', 'BUILDING_PLAN_BPAMS'],
    validityYears: 1,
    keyRuleSafeguard: 'Annual Form B maintenance certificate grants instant digital renewal without physical re-inspection.',
  },
  {
    id: 'BOILER_REGISTRATION',
    code: 'BOIL-01',
    name: 'High-Pressure Steam Boiler Registration (IBR)',
    department: 'Directorate of Steam Boilers, Maharashtra',
    departmentShort: 'BOILERS',
    stage: 'PRE_OPERATION',
    slaDays: 15,
    riskLevel: 'HIGH',
    canAutoApprove: false,
    legalAct: 'Indian Boiler Regulations (IBR) 1950',
    sectionOrRule: 'Regulation 375 & 392',
    description: 'Steam piping radiographic weld inspection and high-pressure hydraulic proof test at 1.5x design pressure.',
    issuingAuthority: 'Inspector of Steam Boilers, Maharashtra',
    documentsRequired: ['Boiler Maker Form II Certificate', 'Steam Piping Isometric Drawings', 'Welder IBR Test Certificates', 'Safety Valve Test Slip'],
    prerequisites: ['BUILDING_PLAN_BPAMS'],
    validityYears: 1,
    keyRuleSafeguard: 'Auto-synchronized with CTO timeline for seamless steam energization.',
  },
  {
    id: 'LEGAL_METROLOGY',
    code: 'REV-02',
    name: 'Legal Metrology Weighbridge Stamping',
    department: 'Food, Civil Supplies & Consumer Protection Dept',
    departmentShort: 'REVENUE',
    stage: 'PRE_OPERATION',
    slaDays: 10,
    riskLevel: 'LOW',
    canAutoApprove: true,
    legalAct: 'Legal Metrology Act 2009',
    sectionOrRule: 'Section 24',
    description: 'Verification, calibration, and statutory security stamping of commercial factory weighbridges and automated packaging scales.',
    issuingAuthority: 'Inspector of Legal Metrology',
    documentsRequired: ['Scale Manufacturer Model Approval Certificate', 'Weighbridge Civil Foundation Certificate', 'Test Weight Calibration Slips'],
    prerequisites: ['FACTORY_LICENSE'],
    validityYears: 1,
    keyRuleSafeguard: 'Deemed approved within 10 days if inspector does not complete calibration.',
  },
];

const ANNUAL_RETURNS_REGISTRY = [
  {
    code: 'MPCB-FORM-V',
    title: 'MPCB Form V Environmental Statement',
    department: 'Maharashtra Pollution Control Board',
    duePeriod: 'Annual • Due 30th September',
    statute: 'Environment (Protection) Rules 1986, Rule 14',
    description: 'Annual water consumption, pollution load discharged per unit of output, and hazardous waste generated.',
    penalty: '₹10,000 fine + notice of show cause under Water Act Section 33A',
    actionUrl: '/portal/compliance',
  },
  {
    code: 'MPCB-FORM-4',
    title: 'Hazardous Waste Form 4 Annual Returns',
    department: 'Maharashtra Pollution Control Board',
    duePeriod: 'Annual • Due 30th June',
    statute: 'Hazardous & Other Wastes Rules 2016, Rule 6(5)',
    description: 'Manifest audit of hazardous chemical sludge, spent batteries, and delivery to authorized CHWTSDF facilities (e.g. MEPL Ranjangaon).',
    penalty: 'Criminal prosecution under Environment Protection Act 1986',
    actionUrl: '/portal/compliance',
  },
  {
    code: 'DISH-FORM-27',
    title: 'DISH Form 27 Half-Yearly Safety Return',
    department: 'Directorate of Industrial Safety & Health',
    duePeriod: 'Bi-Annual • Due 1st Feb & 1st Aug',
    statute: 'Maharashtra Factories Rules 1963, Rule 103',
    description: 'Accident rate records, man-hours worked, safety committee meeting minutes, and medical checkup logs of contract labor.',
    penalty: 'Inspection audit summons + fine up to ₹1,00,000 under Factories Act Sec 92',
    actionUrl: '/portal/compliance',
  },
  {
    code: 'FIRE-FORM-B',
    title: 'Maharashtra Fire Services Form B Certificate',
    department: 'Maharashtra Fire Services',
    duePeriod: 'Bi-Annual • Due January & July',
    statute: 'Maharashtra Fire Prevention & Life Safety Act 2006, Sec 3(3)',
    description: 'Bi-annual maintenance and pressure testing certificate issued by a licensed fire fighting installation agency.',
    penalty: 'Withdrawal of Fire NOC and electrical disconnection directive',
    actionUrl: '/portal/compliance',
  },
];

export default function ClearancesDirectoryPage() {
  const { currentProfile, currentIndustrialist } = useAppStore();
  const [activeStage, setActiveStage] = useState<ClearanceStage>('PRE_ESTABLISHMENT');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [activeModalItem, setActiveModalItem] = useState<ClearanceItem | null>(null);

  // Estimator State
  const [estSector, setEstSector] = useState<'EV' | 'PHARMA' | 'FOOD' | 'SOLAR' | 'ENGINEERING'>('EV');
  const [estInvestment, setEstInvestment] = useState<number>(35);
  const [estLandType, setEstLandType] = useState<'MIDC_ESTATE' | 'PRIVATE_LAND'>('MIDC_ESTATE');

  // Filter Clearances
  const filteredClearances = useMemo(() => {
    let list = STATUTORY_CLEARANCES;

    if (activeStage === 'PRE_ESTABLISHMENT') {
      list = list.filter(c => c.stage === 'PRE_ESTABLISHMENT');
    } else if (activeStage === 'PRE_OPERATION') {
      list = list.filter(c => c.stage === 'PRE_OPERATION');
    } else if (activeStage === 'GREEN_CHANNEL') {
      list = list.filter(c => c.canAutoApprove);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.legalAct.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }

    if (selectedDept !== 'ALL') {
      list = list.filter(c => c.departmentShort === selectedDept);
    }

    if (selectedRisk !== 'ALL') {
      list = list.filter(c => c.riskLevel === selectedRisk);
    }

    return list;
  }, [activeStage, searchQuery, selectedDept, selectedRisk]);

  // Estimator Calculations
  const estimatorSummary = useMemo(() => {
    const isMidc = estLandType === 'MIDC_ESTATE';
    const totalClearancesCount = isMidc ? 7 : 10;
    const baseStatutoryDays = isMidc ? 35 : 55;
    const parallelMakespanDays = isMidc ? 28 : 42;
    const sgstRefundRate = estSector === 'EV' ? '100% of FCI (Zone B/C)' : '70% of FCI';
    const stampDutySavingInr = Math.round(estInvestment * 0.05 * 100000); // 5% saving

    return {
      totalClearancesCount,
      baseStatutoryDays,
      parallelMakespanDays,
      sgstRefundRate,
      stampDutySavingInr,
    };
  }, [estSector, estInvestment, estLandType]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Microsoft Fluent Ambient Acrylic Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-10 w-[600px] h-[450px] bg-indigo-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-emerald-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        
        {/* Breadcrumb & Sovereign Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link href="/" className="hover:text-blue-400 transition-colors">AnumatiOne</Link>
            <span>/</span>
            <span className="text-white">Statutory Clearances & Approvals</span>
            <span className="rounded-md bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[10px] text-blue-400 font-mono">
              MAITRI 2.0 • RTS ACT 2015
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/portal/apply"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Launch Single-Window CAF
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Hero Section — Microsoft Fluent 2 Surface Card */}
        <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl mb-8 overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400 mb-3">
              <Building2 className="h-3.5 w-3.5 text-blue-400" />
              Government of Maharashtra Single-Window Approvals Architecture
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Statutory Clearances, Permits & Compliance Directory
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore all mandatory pre-establishment and pre-operation approvals across <strong>MIDC, MPCB, DISH, MSEDCL, and Fire Services</strong>. 
              Under the <strong>Maharashtra Right to Services (RTS) Act 2015</strong>, every clearance is legally protected by binding 15-to-30 day SLAs with automated deemed sanctions.
            </p>
          </div>

          {/* Quick Metrics Ribbon — Fluent Acrylic Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 backdrop-blur-md">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Integrated Clearances</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">28 Approvals</div>
              <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1 font-mono">
                <CheckCircle2 className="h-3 w-3" /> 7 Line Departments
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 backdrop-blur-md">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Max Statutory SLA</div>
              <div className="text-xl sm:text-2xl font-black text-blue-400 mt-1">30 Days Legal Max</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                RTS Act 2015 Sec 4(1)
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 backdrop-blur-md">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Green Channel Fast-Track</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">48 Hours</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                Instant Deemed Sanctions
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 backdrop-blur-md">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">MahaVault Data Reuse</div>
              <div className="text-xl sm:text-2xl font-black text-indigo-400 mt-1">94% Zero-Re-entry</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                RTS Sec 3(2) Shield
              </div>
            </div>
          </div>
        </div>

        {/* Fluent Segmented Pivot Controls (Tabs) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 backdrop-blur-md shadow-inner">
            <button
              onClick={() => setActiveStage('PRE_ESTABLISHMENT')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeStage === 'PRE_ESTABLISHMENT'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="h-4 w-4" />
              1. Pre-Establishment
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-blue-900/60 text-blue-200 font-mono">
                {STATUTORY_CLEARANCES.filter(c => c.stage === 'PRE_ESTABLISHMENT').length}
              </span>
            </button>

            <button
              onClick={() => setActiveStage('PRE_OPERATION')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeStage === 'PRE_OPERATION'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Zap className="h-4 w-4" />
              2. Pre-Operation
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-blue-900/60 text-blue-200 font-mono">
                {STATUTORY_CLEARANCES.filter(c => c.stage === 'PRE_OPERATION').length}
              </span>
            </button>

            <button
              onClick={() => setActiveStage('GREEN_CHANNEL')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeStage === 'GREEN_CHANNEL'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Green Channel (Self-Cert)
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-emerald-900/60 text-emerald-200 font-mono">
                48h
              </span>
            </button>

            <button
              onClick={() => setActiveStage('ANNUAL_RETURNS')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeStage === 'ANNUAL_RETURNS'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Statutory Returns
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-purple-900/60 text-purple-200 font-mono">
                4 Forms
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search clearances, acts, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills for Standard Clearances */}
        {activeStage !== 'ANNUAL_RETURNS' && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="h-3 w-3" /> Department:
            </span>
            {['ALL', 'MPCB', 'MIDC', 'DISH', 'MSEDCL', 'FIRE', 'BOILERS', 'REVENUE'].map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  selectedDept === dept
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-800 mx-2 hidden sm:block" />

            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">Risk:</span>
            {['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(risk => (
              <button
                key={risk}
                onClick={() => setSelectedRisk(risk)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  selectedRisk === risk
                    ? 'bg-slate-700 text-white border border-slate-600'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
        )}

        {/* SECTION A: STANDARD STATUTORY CLEARANCES GRID */}
        {activeStage !== 'ANNUAL_RETURNS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClearances.map(item => (
              <div
                key={item.id}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-5 hover:border-blue-500/40 hover:bg-slate-900/80 transition-all duration-200 flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* Card Header: Department & Tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 text-[11px] font-mono text-slate-300">
                      {item.code}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {item.canAutoApprove && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 className="h-2.5 w-2.5" /> Green Channel
                        </span>
                      )}
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                        item.riskLevel === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                        item.riskLevel === 'HIGH' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                        item.riskLevel === 'MEDIUM' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                        'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </div>
                  </div>

                  {/* Title & Department */}
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1 font-medium">
                    {item.department}
                  </div>

                  {/* Legal Act & Rule */}
                  <div className="mt-3 rounded-lg bg-slate-950/70 border border-slate-800/80 p-2.5 text-[11px] text-slate-300">
                    <div className="font-semibold text-slate-200">{item.legalAct}</div>
                    <div className="text-slate-400 font-mono mt-0.5">{item.sectionOrRule}</div>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                                    {/* Key Metrics: SLA & Validity */}
                  <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-800/80 py-2.5 my-3">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Statutory SLA</span>
                      <span className="font-bold text-white font-mono">{item.slaDays} Working Days</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Statutory Validity</span>
                      <span className="font-bold text-blue-300 font-mono">
                        {typeof item.validityYears === 'number' ? `${item.validityYears} Years` : item.validityYears}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => setActiveModalItem(item)}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition-colors"
                  >
                    View Specs
                  </button>

                  <Link
                    href={`/portal/apply?approval=${item.id}`}
                    className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-bold text-white text-center flex items-center justify-center gap-1 shadow-md shadow-blue-600/20 transition-all"
                  >
                    Apply in CAF
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION B: ANNUAL STATUTORY RETURNS DIRECTORY */}
        {activeStage === 'ANNUAL_RETURNS' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4 text-xs text-purple-300 mb-6 flex items-center gap-3">
              <Info className="h-5 w-5 text-purple-400 shrink-0" />
              <span>
                <strong>Annual Compliance Mandate:</strong> Once an industrial unit is operational in Maharashtra, statutory returns must be submitted by specified annual dates to prevent fines, factory inspection notices, or electrical disconnections.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ANNUAL_RETURNS_REGISTRY.map(ret => (
                <div 
                  key={ret.code}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded">
                        {ret.code}
                      </span>
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                        <Calendar className="h-3 w-3" /> {ret.duePeriod}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mt-2">
                      {ret.title}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {ret.department} • <span className="font-mono text-slate-300">{ret.statute}</span>
                    </div>

                    <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                      {ret.description}
                    </p>

                    <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-950/20 p-3 text-xs text-rose-300">
                      <strong className="text-rose-400 block mb-0.5 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Statutory Breach Penalty:
                      </strong>
                      {ret.penalty}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      1-Click e-Filing via AnumatiOne
                    </span>
                    <Link
                      href={ret.actionUrl}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-all"
                    >
                      File Return in Compliance Tab
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION C: INTERACTIVE STATUTORY TIMELINE & MAKESPAN ESTIMATOR WIDGET */}
        <div className="mt-14 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="max-w-2xl mb-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
              <Scale className="h-3.5 w-3.5" />
              Interactive Statutory Clearance Estimator
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Simulate Clearance Timelines & Concurrent Makespan
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select your manufacturing sector, investment outlay, and location to calculate parallel processing makespan and Package Scheme of Incentives (PSI 2019) fiscal savings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Controls */}
            <div className="lg:col-span-1 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Manufacturing Sector:
                </label>
                <select
                  value={estSector}
                  onChange={(e: any) => setEstSector(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EV">Electric Vehicle & Battery (Thrust Sector)</option>
                  <option value="PHARMA">Biopharma & Life Sciences</option>
                  <option value="FOOD">Food Processing & Agro MSME</option>
                  <option value="SOLAR">Solar Photovoltaics & Clean Energy</option>
                  <option value="ENGINEERING">General Precision Engineering</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Gross Capital Investment (FCI): <span className="text-blue-400 font-mono">₹{estInvestment} Crore</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="150"
                  step="1"
                  value={estInvestment}
                  onChange={(e) => setEstInvestment(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>₹2 Cr (MSME)</span>
                  <span>₹75 Cr (Large)</span>
                  <span>₹150 Cr (Mega)</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Plot Location Type:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setEstLandType('MIDC_ESTATE')}
                    className={`rounded-xl border p-2 text-xs font-bold transition-all ${
                      estLandType === 'MIDC_ESTATE'
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    MIDC Industrial Estate
                  </button>
                  <button
                    onClick={() => setEstLandType('PRIVATE_LAND')}
                    className={`rounded-xl border p-2 text-xs font-bold transition-all ${
                      estLandType === 'PRIVATE_LAND'
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    Non-MIDC Private Land
                  </button>
                </div>
              </div>
            </div>

            {/* Computation Output Ribbon */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <span className="text-[11px] font-semibold text-slate-400 block">Total Clearances</span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {estimatorSummary.totalClearancesCount} NOCs
                </span>
                <span className="text-[10px] text-emerald-400 block mt-1 font-mono">
                  All in 1 Single-Window CAF
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <span className="text-[11px] font-semibold text-slate-400 block">Parallel Makespan</span>
                <span className="text-2xl font-black text-blue-400 font-mono mt-1 block">
                  {estimatorSummary.parallelMakespanDays} Days
                </span>
                <span className="text-[10px] text-slate-400 block mt-1 line-through">
                  vs {estimatorSummary.baseStatutoryDays * 4} Days Legacy Silos
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <span className="text-[11px] font-semibold text-slate-400 block">Time Reduction</span>
                <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                  {Math.round((1 - estimatorSummary.parallelMakespanDays / (estimatorSummary.baseStatutoryDays * 4)) * 100)}% Faster
                </span>
                <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                  Concurrent Scheduling
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <span className="text-[11px] font-semibold text-slate-400 block">PSI 2019 SGST Refund</span>
                <span className="text-lg font-black text-emerald-400 font-mono mt-1 block">
                  {estimatorSummary.sgstRefundRate}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Disbursed over 7-10 years
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <span className="text-[11px] font-semibold text-slate-400 block">Stamp Duty Saved</span>
                <span className="text-lg font-black text-indigo-400 font-mono mt-1 block">
                  ₹{(estimatorSummary.stampDutySavingInr / 100000).toFixed(1)} Lakhs
                </span>
                <span className="text-[10px] text-emerald-400 block mt-1">
                  100% DIC Waiver
                </span>
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-blue-900/20 p-4 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-blue-300 block">Ready to Apply?</span>
                <Link
                  href={`/portal/apply?sector=${estSector}&investment=${estInvestment}`}
                  className="rounded-lg bg-blue-600 hover:bg-blue-500 py-2 px-3 text-xs font-bold text-white text-center flex items-center justify-center gap-1 shadow-md transition-all mt-2"
                >
                  Start Custom CAF
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION D: STATUTORY RIGHT TO SERVICES SAFEGUARDS BANNER */}
        <div className="mt-10 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 to-slate-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shrink-0">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Statutory Citizen Safeguards under Maharashtra RTS Act 2015
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                If any designated officer fails to sanction, reject with a reasoned order, or raise a structured query within the legally notified SLA timeline, 
                Section 4(2) automatically triggers <strong>Deemed Approval</strong>, generating an authentic digital clearance certificate without human delay.
              </p>
            </div>
          </div>

          <Link
            href="/portal/grievances"
            className="rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-white shrink-0 transition-colors"
          >
            Explore RTS 2-Tier Appeals
          </Link>
        </div>

      </div>

      {/* DETAIL MODAL / SLIDE-OVER DRAWER (FLUENT ACRYLIC FLYOUT) */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 relative">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute right-4 top-4 rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded">
                {activeModalItem.code}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {activeModalItem.department}
              </span>
            </div>

            <h2 className="text-xl font-black text-white">
              {activeModalItem.name}
            </h2>

            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs">
              <div className="font-bold text-slate-200">Legal Foundation:</div>
              <div className="text-slate-300 mt-0.5">{activeModalItem.legalAct} — {activeModalItem.sectionOrRule}</div>
              <div className="text-slate-400 mt-1">{activeModalItem.description}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 text-xs">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
                <span className="text-[10px] text-slate-500 block uppercase">Statutory SLA</span>
                <span className="font-bold text-blue-400 font-mono mt-0.5 block">{activeModalItem.slaDays} Working Days</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
                <span className="text-[10px] text-slate-500 block uppercase">Validity</span>
                <span className="font-bold text-white font-mono mt-0.5 block">{activeModalItem.validityYears} Years</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
                <span className="text-[10px] text-slate-500 block uppercase">Green Channel</span>
                <span className={`font-bold font-mono mt-0.5 block ${activeModalItem.canAutoApprove ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {activeModalItem.canAutoApprove ? 'Eligible (48h)' : 'Standard Queue'}
                </span>
              </div>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <strong className="text-slate-200 block mb-1">Issuing Authority:</strong>
                <span className="text-slate-400">{activeModalItem.issuingAuthority}</span>
              </div>

              <div>
                <strong className="text-slate-200 block mb-1">Mandatory Documentation Checklist:</strong>
                <ul className="space-y-1">
                  {activeModalItem.documentsRequired.map(doc => (
                    <li key={doc} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span>{doc}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1 rounded ml-auto">
                        MahaVault Auto-Attach
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-3">
                <strong className="text-blue-300 block mb-0.5">Statutory Safeguard:</strong>
                <span className="text-slate-300">{activeModalItem.keyRuleSafeguard}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveModalItem(null)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-white"
              >
                Close Specs
              </button>
              <Link
                href={`/portal/apply?approval=${activeModalItem.id}`}
                className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-xs font-bold text-white text-center shadow-lg shadow-blue-600/30"
              >
                Apply in Single-Window CAF
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
