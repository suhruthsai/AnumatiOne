'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Zap, 
  Droplets, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  Flame, 
  Gift, 
  FileCheck2,
  ExternalLink,
  Lock,
  Layers,
  Compass,
  UserCheck,
  KeyRound,
  LogIn,
  UserPlus,
  Phone,
  Mail,
  Shield,
  LogOut,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CommonApplicationFormData, SectorType, PollutionCategory, DocumentType, LifecycleStage } from '@approvalos/shared';
import { useAppStore, IndustrialistAccount } from '@/lib/store';
import { 
  signUpWithFirebase, 
  signInWithFirebase, 
  signInWithGoogleFirebase, 
  signOutFirebase 
} from '@/lib/firebase/auth-service';

const SEED_INDUSTRIALISTS: IndustrialistAccount[] = [
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

const MIDC_CLUSTERS = [
  { id: 'chakan', name: 'MIDC Chakan Phase II, Pune', district: 'Pune', zone: 'A', powerKv: '22kV HT' },
  { id: 'ranjangaon', name: 'MIDC Ranjangaon Industrial Area, Pune', district: 'Pune', zone: 'A', powerKv: '22kV HT' },
  { id: 'butibori', name: 'MIDC Butibori Industrial Area, Nagpur', district: 'Nagpur', zone: 'D+', powerKv: '33kV HT' },
  { id: 'auric', name: 'AURIC Shendra / Bidkin, Chhatrapati Sambhaji Nagar', district: 'Chhatrapati Sambhaji Nagar', zone: 'D+', powerKv: '33kV HT' },
  { id: 'waluj', name: 'MIDC Waluj, Chhatrapati Sambhaji Nagar', district: 'Chhatrapati Sambhaji Nagar', zone: 'C', powerKv: '11kV HT' },
  { id: 'ttc', name: 'TTC Turbhe & Mahape Industrial Area, Navi Mumbai', district: 'Thane', zone: 'A', powerKv: '22kV HT' },
  { id: 'tarapur', name: 'MIDC Tarapur Chemical Zone, Palghar', district: 'Palghar', zone: 'B', powerKv: '22kV HT' },
  { id: 'kurkumbh', name: 'MIDC Kurkumbh Chemical Park, Daund, Pune', district: 'Pune', zone: 'B', powerKv: '22kV HT' },
  { id: 'supa', name: 'MIDC Supa Japanese Industrial Zone, Ahmednagar', district: 'Ahmednagar', zone: 'C', powerKv: '22kV HT' },
  { id: 'dindori', name: 'MIDC Dindori Mega Food Park, Nashik', district: 'Nashik', zone: 'C', powerKv: '11kV HT' },
];

function CommonApplicationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Zustand Store for Authenticated Industrialist Session
  const { currentIndustrialist, loginIndustrialist, logoutIndustrialist } = useAppStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    cafReferenceNumber: string;
    applicationsCount: number;
  } | null>(null);

  // Authentication Gate State
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [loginMethod, setLoginMethod] = useState<'OTP' | 'PASSWORD'>('OTP');
  const [loginIdentifier, setLoginIdentifier] = useState('9822054321');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // New Industrialist Registration Form State
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    designation: 'Managing Director',
    phone: '',
    email: '',
    companyName: '',
    entityType: 'PVT_LTD' as IndustrialistAccount['entityType'],
    pan: '',
    gstin: '',
    udyamNumber: '',
    password: '',
    confirmPassword: '',
    agreeRts: false,
    otpCode: '',
  });
  const [signupOtpSent, setSignupOtpSent] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CommonApplicationFormData>({
    companyName: 'Sahyadri EV Battery Systems Pvt Ltd',
    entityType: 'PVT_LTD',
    pan: 'AABCS8819Q',
    gstin: '27AABCS8819Q1ZP',
    udyamNumber: 'UDYAM-MH-26-008219',
    authorizedPersonName: 'Mr. Vikram Deshmukh',
    authorizedPersonPhone: '+91 98220 54321',
    authorizedPersonEmail: 'vikram.deshmukh@sahyadri-battery.in',
    sector: 'EV_MANUFACTURING',
    productDescription: 'Lithium Iron Phosphate (LFP) Battery Packs & Thermal Management Units for Electric Commercial Vehicles',
    projectStage: 'PRE_ESTABLISHMENT',
    midcCluster: 'MIDC Chakan Phase II, Pune',
    plotNumber: 'Plot E-84/2, Phase II',
    landAreaAcres: 5.5,
    builtUpAreaSqM: 14500,
    plantMachineryInvestmentCr: 38.5,
    landBuildingInvestmentCr: 16.0,
    totalProjectCostCr: 54.5,
    expectedEmployees: 180,
    enterpriseScale: 'MEDIUM',
    pollutionCategory: 'ORANGE',
    powerRequiredKva: 1750,
    waterRequiredKld: 45,
    effluentDischargeKld: 12,
    treatmentScheme: 'ZERO_LIQUID_DISCHARGE',
    boilerInstalled: false,
    boilerCapacityTph: 0,
    hazardousChemicals: false,
    selectedApprovalIds: [
      'LAND_ALLOTMENT',
      'BUILDING_PLAN',
      'CTE_POLLUTION',
      'POWER_SANCTION',
      'FACTORY_LICENSE',
      'FIRE_NOC',
    ],
    documents: [
      { docType: 'LAND_SALE_DEED', docName: 'MIDC_Chakan_Plot_Allotment_Agreement.pdf', verified: true, url: '#' },
      { docType: 'FACTORY_LAYOUT_PLAN', docName: 'Architectural_Plant_Layout_DCR14.dwg', verified: true, url: '#' },
      { docType: 'POLLUTION_UNDERTAKING', docName: 'Zero_Liquid_Discharge_Mass_Balance.pdf', verified: true, url: '#' },
      { docType: 'POWER_LOAD_CALCULATION', docName: 'HT_22kV_Substation_Single_Line_Diagram.pdf', verified: true, url: '#' },
      { docType: 'FIRE_SAFETY_SCHEMATIC', docName: 'Hydrant_Ring_Main_Evacuation_Plan.pdf', verified: true, url: '#' },
      { docType: 'PROJECT_FEASIBILITY_REPORT', docName: 'Detailed_Project_Report_Bankable_DPR.pdf', verified: true, url: '#' },
    ],
  });

  // Auto-fill Step 1 details when an authenticated industrialist is present
  useEffect(() => {
    if (currentIndustrialist) {
      setFormData(prev => ({
        ...prev,
        companyName: currentIndustrialist.companyName,
        entityType: currentIndustrialist.entityType,
        pan: currentIndustrialist.pan,
        gstin: currentIndustrialist.gstin,
        udyamNumber: currentIndustrialist.udyamNumber,
        authorizedPersonName: currentIndustrialist.fullName,
        authorizedPersonPhone: currentIndustrialist.phone,
        authorizedPersonEmail: currentIndustrialist.email,
      }));
    }
  }, [currentIndustrialist]);

  // Auth Handlers
  const handleFastTrackDemoLogin = (account: IndustrialistAccount) => {
    setAuthError(null);
    loginIndustrialist(account);
  };

  const handleSendLoginOtp = () => {
    if (!loginIdentifier || loginIdentifier.trim().length < 5) {
      setAuthError('Please enter a valid Mobile Number (10 digits), Company PAN, or Registered Email.');
      return;
    }
    setAuthError(null);
    setOtpSent(true);
    setLoginOtp('789123');
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      const account = await signInWithGoogleFirebase();
      loginIndustrialist(account);
    } catch (err: any) {
      setAuthError(err.message || 'Firebase Google Sign-In failed.');
    }
  };

  const handleLogout = async () => {
    await signOutFirebase();
    logoutIndustrialist();
  };

  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    const idClean = loginIdentifier.trim().toLowerCase();
    const matched = SEED_INDUSTRIALISTS.find(
      s => s.phone.replace(/\D/g, '').includes(idClean.replace(/\D/g, '')) ||
           s.pan.toLowerCase() === idClean ||
           s.email.toLowerCase() === idClean
    );

    if (loginMethod === 'OTP') {
      if (!otpSent) {
        setAuthError('Please click "Send Verification OTP" first.');
        return;
      }
      if (loginOtp.trim() !== '789123') {
        setAuthError('Invalid OTP code. Please enter the 6-digit test code (789123) sent via MahaGov SMS gateway.');
        return;
      }

      if (matched) {
        loginIndustrialist(matched);
      } else {
        const isPhone = /^\d{10}$/.test(idClean.replace(/\D/g, ''));
        const isPan = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(idClean);
        const isEmail = idClean.includes('@');

        const customAccount: IndustrialistAccount = {
          userId: `fb_${Date.now()}`,
          fullName: 'Authorized Signatory',
          designation: 'Managing Director',
          phone: isPhone ? idClean : '+91 98220 54321',
          email: isEmail ? idClean : 'signatory@enterprise-mh.in',
          companyName: 'Maharashtra Industrial Ventures LLP',
          entityType: 'LLP',
          pan: isPan ? idClean.toUpperCase() : 'AABCM1982K',
          gstin: isPan ? `27${idClean.toUpperCase()}1ZP` : '27AABCM1982K1ZP',
          udyamNumber: 'UDYAM-MH-26-009941',
          isKycVerified: true,
        };
        loginIndustrialist(customAccount);
      }
    } else {
      if (!loginPassword || loginPassword.length < 4) {
        setAuthError('Please enter your account password.');
        return;
      }

      try {
        const emailToUse = idClean.includes('@') ? idClean : `${idClean.toLowerCase().replace(/[^a-z0-9]/g, '')}@enterprise-mh.in`;
        const account = await signInWithFirebase(emailToUse, loginPassword);
        loginIndustrialist(account);
      } catch (err: any) {
        setAuthError(err.message || 'Firebase Authentication failed.');
      }
    }
  };

  const handleSendSignupOtp = () => {
    if (!signupForm.phone || signupForm.phone.replace(/\D/g, '').length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number for OTP verification.');
      return;
    }
    setAuthError(null);
    setSignupOtpSent(true);
    setSignupForm(prev => ({ ...prev, otpCode: '789123' }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!signupForm.fullName.trim()) {
      setAuthError('Authorized Signatory Full Name is required.');
      return;
    }
    if (!signupForm.companyName.trim()) {
      setAuthError('Legal Enterprise / Company Name is required.');
      return;
    }
    const cleanPan = signupForm.pan.trim().toUpperCase();
    if (!cleanPan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      setAuthError('Invalid 10-character Company PAN format (e.g. AABCS8819Q).');
      return;
    }
    const cleanGstin = signupForm.gstin.trim().toUpperCase();
    if (cleanGstin) {
      if (!cleanGstin.startsWith('27') || cleanGstin.length !== 15) {
        setAuthError('Maharashtra GSTIN must start with State Jurisdiction Code "27" and be 15 characters.');
        return;
      }
    }
    if (!signupForm.email.includes('@')) {
      setAuthError('Please provide a valid official email address for RTS statutory notifications.');
      return;
    }
    if (signupForm.password.length < 6) {
      setAuthError('Firebase security requires password to be at least 6 characters.');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (!signupForm.agreeRts) {
      setAuthError('You must accept the Maharashtra Right to Services Act 2015 statutory authorization declaration.');
      return;
    }

    try {
      const newAccount = await signUpWithFirebase({
        fullName: signupForm.fullName.trim(),
        designation: signupForm.designation.trim() || 'Managing Director',
        phone: signupForm.phone.trim(),
        email: signupForm.email.trim(),
        companyName: signupForm.companyName.trim(),
        entityType: signupForm.entityType,
        pan: cleanPan,
        gstin: cleanGstin || `27${cleanPan}1ZP`,
        udyamNumber: signupForm.udyamNumber.trim() || 'UDYAM-MH-26-009941',
        password: signupForm.password,
      });

      loginIndustrialist(newAccount);
    } catch (err: any) {
      setAuthError(err.message || 'Firebase Registration failed.');
    }
  };

  // Parse KYA URL params if coming from Know Your Approvals
  useEffect(() => {
    if (searchParams) {
      const stageParam = searchParams.get('stage') as LifecycleStage;
      const sectorParam = searchParams.get('sector') as SectorType;
      const clusterParam = searchParams.get('cluster');
      const costCrParam = searchParams.get('costCr');
      const powerParam = searchParams.get('powerKva');
      const waterParam = searchParams.get('waterKld');
      const boilerParam = searchParams.get('boiler');
      const hazParam = searchParams.get('haz');

      if (stageParam || sectorParam || clusterParam) {
        setFormData(prev => ({
          ...prev,
          ...(stageParam ? { projectStage: stageParam } : {}),
          ...(sectorParam ? { sector: sectorParam } : {}),
          ...(clusterParam ? { midcCluster: clusterParam } : {}),
          ...(costCrParam ? { 
            totalProjectCostCr: Number(costCrParam),
            plantMachineryInvestmentCr: Number((Number(costCrParam) * 0.7).toFixed(1)),
            landBuildingInvestmentCr: Number((Number(costCrParam) * 0.3).toFixed(1))
          } : {}),
          ...(powerParam ? { powerRequiredKva: Number(powerParam) } : {}),
          ...(waterParam ? { waterRequiredKld: Number(waterParam) } : {}),
          ...(boilerParam ? { boilerInstalled: boilerParam === 'true' } : {}),
          ...(hazParam ? { hazardousChemicals: hazParam === 'true' } : {}),
        }));
      }
    }
  }, [searchParams]);

  // Calculate dynamic approvals needed based on operational stage
  const dynamicApprovals = useMemo(() => {
    if (formData.projectStage === 'PRE_OPERATION') {
      const list = [
        {
          id: 'CTO_POLLUTION',
          code: 'MPCB-02',
          name: `MPCB Consent to Operate (CTO) — ${formData.pollutionCategory} Category`,
          dept: 'Maharashtra Pollution Control Board (MPCB)',
          slaDays: formData.pollutionCategory === 'RED' ? 30 : 21,
          mandatory: true,
        },
        {
          id: 'FACTORY_LICENSE',
          code: 'DISH-02',
          name: 'Factory Registration & License to Operate — DISH Maharashtra',
          dept: 'Directorate of Industrial Safety & Health (DISH)',
          slaDays: 20,
          mandatory: true,
        },
        {
          id: 'FIRE_FINAL_NOC',
          code: 'FIRE-02',
          name: 'Final Fire Safety Occupancy Certificate',
          dept: 'Directorate of Maharashtra Fire Services',
          slaDays: 14,
          mandatory: true,
        },
      ];

      if (formData.boilerInstalled) {
        list.push({
          id: 'BOILER_REGISTRATION',
          code: 'DSB-01',
          name: 'Steam Boiler Registration & Hydraulic Certificate',
          dept: 'Directorate of Steam Boilers, Maharashtra',
          slaDays: 14,
          mandatory: true,
        });
      }

      if (formData.hazardousChemicals) {
        list.push({
          id: 'PESO_LICENSE',
          code: 'PESO-01',
          name: 'PESO Flammable Solvent & Bulk Chemical Storage License',
          dept: 'Petroleum & Explosives Safety Organization',
          slaDays: 30,
          mandatory: true,
        });
      }

      return list;
    }

    if (formData.projectStage === 'RENEWAL') {
      return [
        {
          id: 'CTO_RENEWAL',
          code: 'MPCB-03',
          name: `Consent to Operate (CTO) 5-Year Fast-Track Renewal (${formData.pollutionCategory})`,
          dept: 'Maharashtra Pollution Control Board (MPCB)',
          slaDays: 15,
          mandatory: true,
        },
        {
          id: 'FACTORY_LICENSE_RENEWAL',
          code: 'DISH-03',
          name: 'Factory License Multi-Year Renewal — DISH Maharashtra',
          dept: 'Directorate of Industrial Safety & Health (DISH)',
          slaDays: 10,
          mandatory: true,
        },
        {
          id: 'FIRE_NOC_RENEWAL',
          code: 'FIRE-03',
          name: 'Annual Fire Safety Certificate Form B Re-Validation',
          dept: 'Directorate of Maharashtra Fire Services',
          slaDays: 8,
          mandatory: true,
        },
      ];
    }

    // Default: PRE_ESTABLISHMENT
    const list = [
      {
        id: 'LAND_ALLOTMENT',
        code: 'MIDC-01',
        name: 'MIDC Land Possession & Water Supply Sanction',
        dept: 'Maharashtra Industrial Development Corporation',
        slaDays: 15,
        mandatory: true,
      },
      {
        id: 'BUILDING_PLAN',
        code: 'MIDC-02',
        name: 'MIDC Building Plan Approval & Commencement Certificate',
        dept: 'MIDC Special Planning Authority (SPA)',
        slaDays: 30,
        mandatory: true,
      },
      {
        id: 'CTE_POLLUTION',
        code: 'MPCB-01',
        name: `MPCB Consent to Establish (${formData.pollutionCategory} Category)`,
        dept: 'Maharashtra Pollution Control Board (MPCB)',
        slaDays: formData.pollutionCategory === 'RED' ? 45 : 30,
        mandatory: true,
      },
      {
        id: 'POWER_SANCTION',
        code: 'MSEDCL-01',
        name: `MSEDCL HT Industrial Power Sanction (${formData.powerRequiredKva} kVA)`,
        dept: 'Maharashtra State Electricity Distribution Co. (MSEDCL)',
        slaDays: 15,
        mandatory: true,
      },
      {
        id: 'FACTORY_LICENSE',
        code: 'DISH-01',
        name: 'DISH Factory Plan Approval & Registration',
        dept: 'Directorate of Industrial Safety & Health (DISH)',
        slaDays: 30,
        mandatory: true,
      },
      {
        id: 'FIRE_NOC',
        code: 'FIRE-01',
        name: 'Maharashtra Fire Prevention & Life Safety Provisional NOC',
        dept: 'Directorate of Maharashtra Fire Services',
        slaDays: 15,
        mandatory: true,
      },
    ];

    if (formData.boilerInstalled) {
      list.push({
        id: 'BOILER_REGISTRATION',
        code: 'DSB-01',
        name: 'Steam Boiler Plan Approval & Hydraulic Test Certificate',
        dept: 'Directorate of Steam Boilers, Maharashtra',
        slaDays: 20,
        mandatory: true,
      });
    }

    if (formData.hazardousChemicals) {
      list.push({
        id: 'PESO_LICENSE',
        code: 'PESO-01',
        name: 'PESO Petroleum / Solvent Storage Site Clearance',
        dept: 'Petroleum & Explosives Safety Organization (West Circle)',
        slaDays: 30,
        mandatory: true,
      });
    }

    return list;
  }, [formData.projectStage, formData.pollutionCategory, formData.powerRequiredKva, formData.boilerInstalled, formData.hazardousChemicals]);

  // Update selected approval IDs when dynamic approvals change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      selectedApprovalIds: dynamicApprovals.map(a => a.id),
      totalProjectCostCr: Number((Number(prev.plantMachineryInvestmentCr || 0) + Number(prev.landBuildingInvestmentCr || 0)).toFixed(2)),
    }));
  }, [dynamicApprovals, formData.plantMachineryInvestmentCr, formData.landBuildingInvestmentCr]);

  // Pre-Submission Quality & Completeness Audit
  const preScrutinyAudit = useMemo(() => {
    const checks = [
      {
        category: 'MANDATORY_FIELD',
        label: 'Corporate Entity Identification',
        passed: Boolean(formData.companyName && formData.entityType),
        message: 'Corporate legal entity defined and active on MCA/RoC Maharashtra',
      },
      {
        category: 'MANDATORY_FIELD',
        label: 'Maharashtra GSTIN Verification (27-Prefix)',
        passed: Boolean(formData.gstin && formData.gstin.startsWith('27') && formData.gstin.length === 15),
        message: 'Valid 15-digit GSTIN with Maharashtra State jurisdiction (27)',
      },
      {
        category: 'MANDATORY_FIELD',
        label: 'Udyam MSME Registration',
        passed: Boolean(formData.udyamNumber && formData.udyamNumber.length > 5),
        message: 'MSME Udyam registration authenticated with Ministry of MSME',
      },
      {
        category: 'TECHNICAL_THRESHOLD',
        label: 'HT Electrical Feasibility Threshold',
        passed: formData.powerRequiredKva > 0,
        message: `${formData.powerRequiredKva} kVA dedicated HT transformer capacity specified`,
      },
      {
        category: 'ENVIRONMENTAL_SAFEGUARD',
        label: 'MPCB Effluent Safeguard & ZLD Commitment',
        passed: formData.pollutionCategory === 'WHITE' || (formData.effluentDischargeKld >= 0 && Boolean(formData.treatmentScheme)),
        message: formData.treatmentScheme === 'ZERO_LIQUID_DISCHARGE' ? 'ZLD installed with zero trade effluent discharge' : 'Effluent routed to MIDC Common Effluent Treatment Plant (CETP)',
      },
      {
        category: 'STATUTORY_DOCUMENT',
        label: 'MahaVault Pre-Validated Document Attachments',
        passed: formData.documents.length >= 4,
        message: `${formData.documents.length} verified statutory documents attached via DigiLocker`,
      },
    ];

    const passedCount = checks.filter(c => c.passed).length;
    const completenessScore = Math.round((passedCount / checks.length) * 100);

    return {
      completenessScore,
      isReady: completenessScore >= 80,
      checks,
    };
  }, [formData]);

  // Incentive estimation
  const incentiveEstimate = useMemo(() => {
    const selectedCluster = MIDC_CLUSTERS.find(c => c.name === formData.midcCluster) || MIDC_CLUSTERS[0];
    const isBackwardZone = selectedCluster.zone === 'D+' || selectedCluster.zone === 'C';
    const sgstRefundRate = isBackwardZone ? '100% SGST Refund for 9 Years' : '60% SGST Refund for 7 Years';
    const stampDuty = '100% Exemption on MIDC Lease Deed (Bombay Stamp Act)';
    const electricityDuty = isBackwardZone ? '100% Exemption for 10 Years' : '100% Exemption for 7 Years';
    const totalBenefitCr = Number(((formData.totalProjectCostCr * (isBackwardZone ? 0.45 : 0.25))).toFixed(1));

    return {
      policy: 'Maharashtra Package Scheme of Incentives (PSI 2019)',
      clusterZone: selectedCluster.zone,
      sgstRefundRate,
      stampDuty,
      electricityDuty,
      totalBenefitCr,
    };
  }, [formData.midcCluster, formData.totalProjectCostCr]);

  const handleSubmitCAF = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isCAF: true,
          cafData: formData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionResult({
          cafReferenceNumber: data.cafReferenceNumber,
          applicationsCount: data.count || data.data.length,
        });

        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
        });
      } else {
        alert(data.error || 'Failed to submit application');
      }
    } catch (e: any) {
      alert(`Error submitting application: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            Government of Maharashtra • MAITRI 2.0 Single-Window Unified CAF
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
          <Layers className="h-7 w-7 text-blue-400" />
          Apply for Industrial Approvals & State Clearances
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-1">
          Provide your enterprise, land, utility, and environmental parameters once. AnumatiOne orchestrates all state clearances simultaneously across MIDC, MPCB, DISH, MSEDCL, and Fire Services under the Maharashtra Right to Services Act 2015.
        </p>
      </div>

      {submissionResult ? (
        /* Submission Success Receipt */
        <div className="rounded-3xl border border-emerald-500/40 bg-emerald-950/20 p-8 text-center space-y-6 max-w-3xl mx-auto backdrop-blur-xl">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase font-mono font-bold text-emerald-400">
              Government of Maharashtra Acknowledgment
            </div>
            <h2 className="text-2xl font-black text-white">
              Industrial Common Application Form Dispatched!
            </h2>
            <p className="text-xs text-slate-300 max-w-xl mx-auto">
              Your comprehensive project dossier has been authenticated and simultaneously submitted to all {submissionResult.applicationsCount} regulatory departments.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/80 p-5 max-w-lg mx-auto space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Master CAF Tracking Number:</span>
              <span className="font-mono text-base font-black text-emerald-400">
                {submissionResult.cafReferenceNumber}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2">
              <span className="text-slate-400">Enterprise:</span>
              <span className="font-bold text-white">{formData.companyName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Location:</span>
              <span className="text-slate-200">{formData.midcCluster}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Departments Notified:</span>
              <span className="text-emerald-400 font-semibold">{submissionResult.applicationsCount} Parallel Lanes</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Legal Protection:</span>
              <span className="text-blue-400 font-mono">RTS Act 2015 SLA Clock Running</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.push('/portal/applications')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all"
            >
              <span>View in Real-Time Applications Sentinel</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => router.push('/officer')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-6 py-3 text-xs font-bold text-slate-200 transition-all"
            >
              <span>View in Department Officer Cockpit</span>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      ) : !currentIndustrialist ? (
        /* MAITRI Industrialist Authentication Gate */
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Statutory Gate Header Card */}
          <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-900 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Statutory Single-Window Access Control • RTS Act 2015 Sec 3
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                  <Lock className="h-6 w-6 text-blue-400" />
                  Industrialist Sign In & Entity Authentication
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Under the Maharashtra Right to Services Act 2015, all project proponents must verify their authorized signatory identity and enterprise credentials before generating the Single-Window Common Application Form (CAF).
                </p>
              </div>

              {/* Legal Seal Badge */}
              <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-right">
                <div className="text-[10px] uppercase font-mono font-bold text-amber-400">Maharashtra MAITRI 2.0</div>
                <div className="text-xs font-black text-white">e-KYC & DigiLocker Gateway</div>
                <div className="text-[10px] text-amber-400 font-mono flex items-center gap-1 justify-end">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  🔥 Firebase Auth Enabled
                </div>
              </div>
            </div>

            {/* Auth Mode Tabs */}
            <div className="mt-6 flex border-b border-slate-800 gap-4">
              <button
                type="button"
                onClick={() => { setAuthMode('LOGIN'); setAuthError(null); }}
                className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
                  authMode === 'LOGIN'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <LogIn className="h-4 w-4" />
                <span>Existing Industrialist Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('SIGNUP'); setAuthError(null); }}
                className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
                  authMode === 'SIGNUP'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="h-4 w-4" />
                <span>New Industrialist Registration (Sign Up)</span>
              </button>
            </div>

            {/* Error Alert */}
            {authError && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-2.5 text-xs text-red-200">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* TAB 1: LOGIN */}
            {authMode === 'LOGIN' && (
              <div className="mt-6 space-y-6">
                {/* 1-Click Fast-Track Demo Personas for Evaluators */}
                <div className="rounded-2xl border border-blue-500/25 bg-blue-950/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                      Evaluator Fast-Track: 1-Click Verified Personas
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Instant Hackathon Testing</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {SEED_INDUSTRIALISTS.map((s) => (
                      <button
                        key={s.userId}
                        type="button"
                        onClick={() => handleFastTrackDemoLogin(s)}
                        className="p-3 text-left rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-blue-900/30 hover:border-blue-500/50 transition-all group shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-white group-hover:text-blue-300 truncate">
                            {s.fullName}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                            Verified
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{s.companyName}</div>
                        <div className="text-[9px] text-blue-400/90 font-mono mt-1">
                          PAN: {s.pan} • GSTIN: {s.gstin.slice(0, 8)}...
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Google Sign-In with Firebase */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 hover:border-blue-500/50 text-xs font-bold text-white transition-all flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign In with Google (Firebase Auth)</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[10px] text-slate-400 uppercase font-mono tracking-wider absolute">
                    Or Sign In with MAITRI Credentials / OTP
                  </span>
                </div>

                {/* Login Method Toggle */}
                <div className="flex items-center gap-2 max-w-sm">
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('OTP'); setAuthError(null); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      loginMethod === 'OTP'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    SMS / Mobile OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('PASSWORD'); setAuthError(null); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      loginMethod === 'PASSWORD'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Account Password
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-lg">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Registered Mobile Number, Company PAN, or Email *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={e => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. 9822054321 or AABCS8819Q"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  {loginMethod === 'OTP' ? (
                    <div className="space-y-3">
                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={handleSendLoginOtp}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Phone className="h-3.5 w-3.5 text-blue-400" />
                          <span>Send 6-Digit Verification OTP</span>
                        </button>
                      ) : (
                        <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-blue-500/40">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-medium">Enter 6-Digit OTP:</span>
                            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Demo OTP: 789123
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={loginOtp}
                              onChange={e => setLoginOtp(e.target.value)}
                              maxLength={6}
                              placeholder="789123"
                              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={handleSendLoginOtp}
                              className="shrink-0 px-3 py-2 text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                            >
                              Resend
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Sent to registered mobile via Maharashtra State e-Governance SMS gateway.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        MAITRI Account Password *
                      </label>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Authenticate & Access Common Application Form</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('SIGNUP'); setAuthError(null); }}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      New Enterprise in Maharashtra? Register Authorized Signatory Profile →
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: SIGN UP */}
            {authMode === 'SIGNUP' && (
              <div className="mt-6 space-y-5">
                {/* 1-Click Google Sign-Up via Firebase */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 hover:border-blue-500/50 text-xs font-bold text-white transition-all flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Quick Register with Google (Firebase Auth)</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[10px] text-slate-400 uppercase font-mono tracking-wider absolute">
                    Or Register Enterprise with Email & Password
                  </span>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Authorized Signatory Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={signupForm.fullName}
                      onChange={e => setSignupForm({ ...signupForm, fullName: e.target.value })}
                      placeholder="e.g. Mr. Sanjay Shinde"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Designation in Enterprise *
                    </label>
                    <input
                      type="text"
                      required
                      value={signupForm.designation}
                      onChange={e => setSignupForm({ ...signupForm, designation: e.target.value })}
                      placeholder="Managing Director / Partner / Proprietor"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Mobile Number (for RTS SMS Alerts) *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={signupForm.phone}
                        onChange={e => setSignupForm({ ...signupForm, phone: e.target.value })}
                        placeholder="+91 98220 12345"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleSendSignupOtp}
                        className="shrink-0 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-white whitespace-nowrap"
                      >
                        {signupOtpSent ? 'OTP Sent' : 'Verify'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Official Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={signupForm.email}
                      onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                      placeholder="promoter@enterprise-mh.in"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Legal Enterprise / Proposed Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={signupForm.companyName}
                      onChange={e => setSignupForm({ ...signupForm, companyName: e.target.value })}
                      placeholder="e.g. Sahyadri High-Tech Precision Engineering Pvt Ltd"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Entity Constitution *
                    </label>
                    <select
                      value={signupForm.entityType}
                      onChange={e => setSignupForm({ ...signupForm, entityType: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PVT_LTD">Private Limited Company</option>
                      <option value="PUBLIC_LTD">Public Limited Company</option>
                      <option value="LLP">Limited Liability Partnership (LLP)</option>
                      <option value="PARTNERSHIP">Partnership Firm</option>
                      <option value="PROPRIETORSHIP">Sole Proprietorship</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Company PAN Number *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={signupForm.pan}
                      onChange={e => setSignupForm({ ...signupForm, pan: e.target.value.toUpperCase() })}
                      placeholder="AABCS8819Q"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Maharashtra GSTIN (Code 27) *
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      value={signupForm.gstin}
                      onChange={e => setSignupForm({ ...signupForm, gstin: e.target.value.toUpperCase() })}
                      placeholder="27AABCS8819Q1ZP"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      MSME Udyam Registration (Optional)
                    </label>
                    <input
                      type="text"
                      value={signupForm.udyamNumber}
                      onChange={e => setSignupForm({ ...signupForm, udyamNumber: e.target.value.toUpperCase() })}
                      placeholder="UDYAM-MH-26-008219"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Create MAITRI Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={signupForm.password}
                      onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={signupForm.confirmPassword}
                      onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {signupOtpSent && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-blue-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-slate-300">OTP code sent to mobile. Test simulation code:</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      789123
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="agreeRts"
                    checked={signupForm.agreeRts}
                    onChange={e => setSignupForm({ ...signupForm, agreeRts: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="agreeRts" className="text-xs text-slate-400">
                    I solemnly declare that I am the authorized legal representative of the above enterprise under Section 7 of the <strong className="text-slate-200">Maharashtra Right to Services Act 2015</strong> and agree to electronic scrutiny exchange across MIDC, MPCB, DISH, and MSEDCL.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register Enterprise Profile & Unlock Common Application Form</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('LOGIN'); setAuthError(null); }}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Already registered on MAITRI Single Window? Sign In Here →
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Statutory Security & Cross-Acceptance Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">MahaVault Inter-Dept Shield</div>
              <div className="text-[10px] text-slate-400">Documents verified once, accepted across all 5 departments</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <FileCheck2 className="h-5 w-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">DigiLocker Level-2 Certified</div>
              <div className="text-[10px] text-slate-400">Direct integration with Ministry of Electronics & IT</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <Zap className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Maharashtra RTS Act 2015</div>
              <div className="text-[10px] text-slate-400">Enforceable statutory SLA timers with deemed approvals</div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      /* Authenticated Applicant: Verified Profile Header + Multi-Step Wizard */
      <div className="space-y-6">
        {/* Authenticated Industrialist Profile Bar */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {currentIndustrialist.fullName}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({currentIndustrialist.designation})
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                    <ShieldCheck className="h-3 w-3" />
                    Level-2 e-KYC Verified
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-semibold mt-0.5">
                  {currentIndustrialist.companyName} • <span className="font-mono text-slate-400">{currentIndustrialist.entityType.replace('_', ' ')}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 mt-1">
                  <span>PAN: <strong className="text-slate-200">{currentIndustrialist.pan}</strong></span>
                  <span>•</span>
                  <span>GSTIN: <strong className="text-emerald-400">{currentIndustrialist.gstin}</strong></span>
                  {currentIndustrialist.udyamNumber && (
                    <>
                      <span>•</span>
                      <span>Udyam: <strong className="text-blue-400">{currentIndustrialist.udyamNumber}</strong></span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <LogOut className="h-3.5 w-3.5 text-slate-400" />
                <span>Switch Account / Sign Out</span>
              </button>
            </div>
          </div>
        </div>

          {/* Operational Lifecycle Stage Selector */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Compass className="h-4 w-4 text-blue-400" />
                Select Clearance Stage:
              </span>
              <span className="text-[11px] text-blue-400 font-mono">
                {formData.projectStage === 'PRE_ESTABLISHMENT' && 'Stage 1: Greenfield Clearances'}
                {formData.projectStage === 'PRE_OPERATION' && 'Stage 2: Factory Commissioning & CTO'}
                {formData.projectStage === 'RENEWAL' && 'Stage 3: Periodic Re-Licensing'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { stage: 'PRE_ESTABLISHMENT' as LifecycleStage, icon: '🏗️', label: 'Stage 1: Pre-Establishment', desc: 'Land, CTE, Building Plan, Fire Provisional, HT Feasibility' },
                { stage: 'PRE_OPERATION' as LifecycleStage, icon: '🏭', label: 'Stage 2: Pre-Operation (CTO)', desc: 'Consent to Operate, Factory License, Fire Final NOC, Boiler' },
                { stage: 'RENEWAL' as LifecycleStage, icon: '🔄', label: 'Stage 3: Statutory Renewals', desc: 'CTO Fast-Track Renewal, Multi-Year Factory License, Fire NOC' },
              ].map((item) => (
                <button
                  key={item.stage}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, projectStage: item.stage }))}
                  className={`text-left p-3 rounded-xl border text-xs transition-all ${
                    formData.projectStage === item.stage
                      ? 'border-blue-500 bg-blue-500/15 text-white font-bold shadow-md shadow-blue-500/10'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5 truncate">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Wizard Step Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { num: 1, title: 'Enterprise & Promoter', desc: 'Identity & Legal Entity' },
              { num: 2, title: 'Land & Location', desc: 'MIDC Cluster & Area' },
              { num: 3, title: 'Investment & Utilities', desc: 'Power, Water & Scale' },
              { num: 4, title: 'Approvals & Submit', desc: 'Clearances & Incentives' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`text-left p-3.5 rounded-2xl border transition-all ${
                  currentStep === s.num
                    ? 'border-blue-500/50 bg-blue-950/30 shadow-lg shadow-blue-500/10'
                    : currentStep > s.num
                    ? 'border-emerald-500/30 bg-emerald-950/10 text-slate-400'
                    : 'border-slate-800 bg-slate-900/40 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className={currentStep === s.num ? 'text-blue-400 font-bold' : ''}>
                    Step 0{s.num}
                  </span>
                  {currentStep > s.num && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                </div>
                <div className="text-xs font-bold text-white truncate">{s.title}</div>
                <div className="text-[10px] text-slate-400 truncate">{s.desc}</div>
              </button>
            ))}
          </div>

          {/* Form Step Body */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            {/* STEP 1: Enterprise & Promoter Details */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-400" />
                    Enterprise & Authorized Promoter Information
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Official registration details required by Government of Maharashtra single-window portal (MAITRI).
                  </p>
                </div>

                {/* Account Linked Verified Alert */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 flex items-center gap-2.5 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Enterprise Profile Linked:</strong> Statutory registration credentials pre-populated from your authenticated MAITRI account (<strong>{currentIndustrialist.companyName}</strong>).
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Legal Enterprise / Proposed Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Sahyadri EV Battery Systems Pvt Ltd"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Entity Constitution *
                    </label>
                    <select
                      value={formData.entityType}
                      onChange={e => setFormData({ ...formData, entityType: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PVT_LTD">Private Limited Company</option>
                      <option value="PUBLIC_LTD">Public Limited Company</option>
                      <option value="LLP">Limited Liability Partnership (LLP)</option>
                      <option value="PARTNERSHIP">Partnership Firm</option>
                      <option value="PROPRIETORSHIP">Sole Proprietorship</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Company PAN Number *
                    </label>
                    <input
                      type="text"
                      value={formData.pan}
                      onChange={e => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                      maxLength={10}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="AABCS8819Q"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      GSTIN (State Code 27 - Maharashtra)
                    </label>
                    <input
                      type="text"
                      value={formData.gstin}
                      onChange={e => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                      maxLength={15}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="27AABCS8819Q1ZP"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Udyam MSME Registration Number
                    </label>
                    <input
                      type="text"
                      value={formData.udyamNumber}
                      onChange={e => setFormData({ ...formData, udyamNumber: e.target.value.toUpperCase() })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="UDYAM-MH-26-008219"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Authorized Signatory / Promoter Name *
                    </label>
                    <input
                      type="text"
                      value={formData.authorizedPersonName}
                      onChange={e => setFormData({ ...formData, authorizedPersonName: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Official Contact Phone *
                    </label>
                    <input
                      type="text"
                      value={formData.authorizedPersonPhone}
                      onChange={e => setFormData({ ...formData, authorizedPersonPhone: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Authorized Email Address (for RTS SLA Alerts & Notifications) *
                    </label>
                    <input
                      type="email"
                      value={formData.authorizedPersonEmail}
                      onChange={e => setFormData({ ...formData, authorizedPersonEmail: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Land & Location Details */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-400" />
                    Proposed Plant Location & MIDC Industrial Land
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Location dictates MIDC Special Planning Authority building norms, MPCB zonal criteria, and PSI 2019 taluka incentives.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Maharashtra Industrial Area / MIDC Cluster *
                    </label>
                    <select
                      value={formData.midcCluster}
                      onChange={e => setFormData({ ...formData, midcCluster: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {MIDC_CLUSTERS.map(c => (
                        <option key={c.id} value={c.name}>
                          {c.name} (District: {c.district} | Incentive Zone: {c.zone} | Feeder: {c.powerKv})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      MIDC Plot / Shed Number *
                    </label>
                    <input
                      type="text"
                      value={formData.plotNumber}
                      onChange={e => setFormData({ ...formData, plotNumber: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Plot E-84/2, Phase II"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Project Stage *
                    </label>
                    <select
                      value={formData.projectStage}
                      onChange={e => setFormData({ ...formData, projectStage: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PRE_ESTABLISHMENT">Pre-Establishment (Greenfield Construction)</option>
                      <option value="PRE_OPERATION">Pre-Operation (Factory Ready for Machinery Run)</option>
                      <option value="EXPANSION">Brownfield Expansion of Existing Unit</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Total Plot Land Area (Acres) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.landAreaAcres}
                      onChange={e => setFormData({ ...formData, landAreaAcres: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      ≈ {Math.round(formData.landAreaAcres * 4046.86)} sq. meters
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Proposed Factory Built-Up Area (Sq. Meters) *
                    </label>
                    <input
                      type="number"
                      value={formData.builtUpAreaSqM}
                      onChange={e => setFormData({ ...formData, builtUpAreaSqM: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Permissible FSI under MIDC DCR 2009: 1.0 (Extendable to 1.5)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Capital Investment, Utilities & Environmental */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-400" />
                    Capital Investment, Scale & Technical Utilities
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Used to calculate MSEDCL feeder feasibility, MPCB pollution categorization, and DISH safety staffing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Plant & Machinery Investment (₹ Crores) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.plantMachineryInvestmentCr}
                      onChange={e => setFormData({ ...formData, plantMachineryInvestmentCr: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Land & Civil Construction (₹ Crores) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.landBuildingInvestmentCr}
                      onChange={e => setFormData({ ...formData, landBuildingInvestmentCr: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Total Capital Outlay (₹ Crores)
                    </label>
                    <div className="rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-black text-emerald-400 font-mono">
                      ₹ {formData.totalProjectCostCr} Cr
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Connected Electrical Load (kVA) *
                    </label>
                    <input
                      type="number"
                      value={formData.powerRequiredKva}
                      onChange={e => setFormData({ ...formData, powerRequiredKva: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {formData.powerRequiredKva > 500 ? '⚡ Requires MSEDCL HT Substation Connection' : 'Standard LT Connection'}
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Water Requirement (KLD - Kilo Litres / Day) *
                    </label>
                    <input
                      type="number"
                      value={formData.waterRequiredKld}
                      onChange={e => setFormData({ ...formData, waterRequiredKld: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      MIDC Piped Supply Pipeline Quota
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      MPCB Pollution Category *
                    </label>
                    <select
                      value={formData.pollutionCategory}
                      onChange={e => setFormData({ ...formData, pollutionCategory: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="WHITE">White (Zero Pollution - Instant Self-Certification)</option>
                      <option value="GREEN">Green (Low Impact - Green Channel Eligible)</option>
                      <option value="ORANGE">Orange (Medium Impact - Standard CTE/CTO)</option>
                      <option value="RED">Red (Heavy Scrutiny - Full SEIAA/ZLD Mandate)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Effluent Treatment Scheme *
                    </label>
                    <select
                      value={formData.treatmentScheme}
                      onChange={e => setFormData({ ...formData, treatmentScheme: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ZERO_LIQUID_DISCHARGE">Zero Liquid Discharge (100% Recycle / RO + MEE)</option>
                      <option value="CETP_DISCHARGE">Conveyance to MIDC CETP Common Facility</option>
                      <option value="CLOSED_LOOP">Closed Loop Internal Cooling</option>
                      <option value="NONE">Domestic Sewage Soak Pit Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Proposed Direct Employment *
                    </label>
                    <input
                      type="number"
                      value={formData.expectedEmployees}
                      onChange={e => setFormData({ ...formData, expectedEmployees: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {formData.expectedEmployees > 100 ? 'Full DISH Safety Officer Mandatory' : 'Standard First Aid Rules'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                      <input
                        type="checkbox"
                        checked={formData.boilerInstalled}
                        onChange={e => setFormData({ ...formData, boilerInstalled: e.target.checked })}
                        className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Industrial Steam Boiler Installed</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Dynamic Clearances Checklist, Pre-Validated Docs & Incentive Summary */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    Applicable Statutory Clearances & Pre-Validated Submission
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    AnumatiOne has automatically determined the exact statutory permits required for your project parameters.
                  </p>
                </div>

                {/* Clearances Table */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 overflow-hidden">
                  <div className="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span>{dynamicApprovals.length} Statutory Permits to be Dispatched</span>
                    <span className="text-emerald-400 font-mono text-[11px]">Parallel Concurrency Mode</span>
                  </div>
                  <div className="divide-y divide-slate-800/80">
                    {dynamicApprovals.map((app) => (
                      <div key={app.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-400 border border-blue-500/20">
                              {app.code}
                            </span>
                            <span className="font-bold text-white">{app.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{app.dept}</div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-[11px] text-slate-400 font-mono">
                            Statutory SLA: <strong className="text-white">{app.slaDays} Days</strong>
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Auto-Attached
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pre-Validated Documents from MahaVault */}
                <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-300 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-emerald-400" />
                      MahaVault DigiLocker Integration (6/6 Pre-Validated)
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Zero-Rejection Guarantee</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {formData.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-900/80 p-2.5 border border-slate-800">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                          <span className="text-slate-300 truncate">{doc.docName}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono shrink-0 ml-2">✓ Verified</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* State Incentive Matcher */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Gift className="h-4 w-4 text-amber-400" />
                      Maharashtra State Support Scheme Auto-Claim
                    </span>
                    <span className="font-mono text-xs font-black text-amber-400">
                      Est. ₹{incentiveEstimate.totalBenefitCr} Cr Subsidy
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Under <strong className="text-white">{incentiveEstimate.policy}</strong> ({formData.midcCluster}, Zone {incentiveEstimate.clusterZone}):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className="rounded-lg bg-slate-900/90 p-2 border border-slate-800 text-slate-300">
                      ⚡ <strong>SGST Refund:</strong> {incentiveEstimate.sgstRefundRate}
                    </div>
                    <div className="rounded-lg bg-slate-900/90 p-2 border border-slate-800 text-slate-300">
                      📜 <strong>Stamp Duty:</strong> {incentiveEstimate.stampDuty}
                    </div>
                    <div className="rounded-lg bg-slate-900/90 p-2 border border-slate-800 text-slate-300">
                      💡 <strong>Power Relief:</strong> {incentiveEstimate.electricityDuty}
                    </div>
                  </div>
                </div>

                {/* Live Pre-Submission Quality & Completeness Audit */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          AI Pre-Submission Quality & Completeness Audit
                        </h4>
                        <p className="text-[10px] text-slate-300">
                          Statutory verification under Maharashtra Right to Services Act 2015 to prevent departmental rejection.
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-emerald-400 font-mono">
                        {preScrutinyAudit.completenessScore}%
                      </span>
                      <span className="text-[9px] text-emerald-300/80 block">Completeness Score</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {preScrutinyAudit.checks.map((chk, idx) => (
                      <div key={idx} className={`flex items-center gap-2 rounded-xl p-2.5 border ${chk.passed ? 'bg-slate-950/80 border-slate-800' : 'bg-rose-950/20 border-rose-500/30'}`}>
                        {chk.passed
                          ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          : <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                        }
                        <div className="space-y-0.5 truncate">
                          <div className={`text-[11px] font-semibold truncate ${chk.passed ? 'text-white' : 'text-rose-300'}`}>{chk.label}</div>
                          <div className="text-[10px] text-slate-400 truncate">{chk.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Previous Step</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>Continue to Step 0{currentStep + 1}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitCAF}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/30 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Submitting to Maharashtra MAITRI Gateway...' : '⚡ Submit Common Application Form (CAF)'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommonApplicationPortal() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Single-Window Common Application Form...</div>}>
      <CommonApplicationContent />
    </Suspense>
  );
}
