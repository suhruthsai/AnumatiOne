import { create } from 'zustand';
import { BusinessProfile, SimulationResult, ApprovalNode, WhatIfComparison, DocumentValidationResult } from '@approvalos/shared';
import { DEMO_PROFILES } from './demo-data';
import { AdversarialPathOptimizer } from './simulator/adversarial-optimizer';
import { getApprovalsForProfile } from './knowledge-engine/regulatory-graph';
import { generatePreValidatedMahaVault } from './document-intelligence/maitrivault-data';

export type UserRole = 'APPLICANT' | 'OFFICER';

export interface IndustrialistAccount {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  pan: string;
  gstin: string;
  udyamNumber: string;
  companyName: string;
  entityType: 'PVT_LTD' | 'PUBLIC_LTD' | 'LLP' | 'PARTNERSHIP' | 'PROPRIETORSHIP';
  designation: string;
  isKycVerified: boolean;
}

export interface OfficerAccount {
  officerId: string;
  fullName: string;
  designation: string;
  department: 'MPCB' | 'MIDC' | 'DISH' | 'MSEDCL' | 'FIRE';
  departmentName: string;
  jurisdictionDistrict: string;
  govEmail: string;
  employeeCode: string;
  badgeNumber: string;
}

export const SEED_OFFICERS: Record<string, OfficerAccount> = {
  MPCB_PUNE: {
    officerId: 'off_001',
    fullName: 'Er. Ramesh Kulkarni',
    designation: 'Sub-Regional Officer',
    department: 'MPCB',
    departmentName: 'Maharashtra Pollution Control Board',
    jurisdictionDistrict: 'Pune (Chakan & Bhosari)',
    govEmail: 'ramesh.mpcb@maharashtra.gov.in',
    employeeCode: 'GOM-MPCB-2016-8812',
    badgeNumber: 'SRO-PUNE-04',
  },
  MIDC_SPA: {
    officerId: 'off_002',
    fullName: 'Ar. Sneha Deshpande',
    designation: 'Executive Engineer & SPA',
    department: 'MIDC',
    departmentName: 'MIDC Special Planning Authority',
    jurisdictionDistrict: 'Pune Regional Office',
    govEmail: 'sneha.deshpande@midcindia.org',
    employeeCode: 'GOM-MIDC-2018-4421',
    badgeNumber: 'EE-SPA-CHAKAN',
  },
  DISH_FACTORIES: {
    officerId: 'off_003',
    fullName: 'Er. Dilip Patil',
    designation: 'Joint Director & Factory Inspector',
    department: 'DISH',
    departmentName: 'Directorate of Industrial Safety & Health',
    jurisdictionDistrict: 'Maharashtra Western Zone',
    govEmail: 'dilip.patil@dish.gov.in',
    employeeCode: 'GOM-DISH-2014-1109',
    badgeNumber: 'JD-INSP-09',
  },
  MSEDCL_POWER: {
    officerId: 'off_004',
    fullName: 'Er. Vijay More',
    designation: 'Superintending Engineer (HT)',
    department: 'MSEDCL',
    departmentName: 'MSEDCL (Mahavitaran) Industrial Wing',
    jurisdictionDistrict: 'Pune Rural & Industrial Circle',
    govEmail: 'vijay.more@mahadiscom.in',
    employeeCode: 'GOM-MSEDCL-2015-7731',
    badgeNumber: 'SE-HT-PUNE',
  },
  FIRE_SERVICES: {
    officerId: 'off_005',
    fullName: 'CFO Sanjay Pawar',
    designation: 'Chief Fire Officer',
    department: 'FIRE',
    departmentName: 'Maharashtra Fire Services (MIDC Command)',
    jurisdictionDistrict: 'MIDC Industrial Zones',
    govEmail: 'cfo.pawar@mahafire.gov.in',
    employeeCode: 'GOM-FIRE-2017-3390',
    badgeNumber: 'CFO-ZONE-1',
  },
};

export const SEED_INDUSTRIALISTS: Record<string, IndustrialistAccount> = {
  EV_PUNE: {
    userId: 'ind_001',
    fullName: 'Mr. Vikram Deshmukh',
    designation: 'Managing Director',
    phone: '+91 98220 54321',
    email: 'vikram.deshmukh@sahyadri-battery.in',
    companyName: 'Aegis Lithium Mobility Pvt Ltd',
    entityType: 'PVT_LTD',
    pan: 'AABCS8819Q',
    gstin: '27AABCS8819Q1ZP',
    udyamNumber: 'UDYAM-MH-26-008219',
    isKycVerified: true,
  },
  PHARMA_AURIC: {
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
  FOOD_NASHIK: {
    userId: 'ind_003',
    fullName: 'Mr. Rajesh Patil',
    designation: 'Proprietor & Founder',
    phone: '+91 98222 78901',
    email: 'rajesh.patil@godavari-organics.in',
    companyName: 'Godavari Valley Agro Foods Ltd',
    entityType: 'PROPRIETORSHIP',
    pan: 'AAPPP1234F',
    gstin: '27AAPPP1234F1ZR',
    udyamNumber: 'UDYAM-MH-20-009823',
    isKycVerified: true,
  },
  SOLAR_NAGPUR: {
    userId: 'ind_004',
    fullName: 'Mr. Rohan Kute',
    designation: 'Chief Operating Officer',
    phone: '+91 98223 11223',
    email: 'rohan.kute@helios-solar.in',
    companyName: 'Helios Photovoltaics India Ltd',
    entityType: 'PUBLIC_LTD',
    pan: 'AAACH6789L',
    gstin: '27AAACH6789L1ZT',
    udyamNumber: 'UDYAM-MH-31-007744',
    isKycVerified: true,
  },
};

interface AppState {
  currentProfile: BusinessProfile;
  simulationResult: SimulationResult | null;
  selectedNode: ApprovalNode | null;
  isDrawerOpen: boolean;
  activeStrategyId: string;
  whatIfComparison: WhatIfComparison | null;
  uploadedDocuments: Record<string, DocumentValidationResult>;
  isSimulating: boolean;

  // Role & Authentication Session
  activeRole: UserRole;
  currentIndustrialist: IndustrialistAccount | null;
  currentOfficer: OfficerAccount | null;

  // Actions
  setActiveRole: (role: UserRole) => void;
  loginIndustrialist: (account: IndustrialistAccount) => void;
  loginOfficer: (officer: OfficerAccount) => void;
  logout: () => void;
  logoutIndustrialist: () => void;
  logoutOfficer: () => void;
  setProfile: (profile: BusinessProfile) => void;
  loadDemoProfile: (key: string) => void;
  runSimulation: () => void;
  setSelectedNode: (node: ApprovalNode | null) => void;
  closeDrawer: () => void;
  setActiveStrategyId: (strategyId: string) => void;
  setWhatIfComparison: (comparison: WhatIfComparison | null) => void;
  addUploadedDocument: (docType: string, result: DocumentValidationResult) => void;
  setSimulationResult: (result: SimulationResult) => void;
}

export const useAppStore = create<AppState>((set, get) => {
  // Initialize with default EV Pune (Chakan MIDC) profile
  const initialProfile = DEMO_PROFILES.EV_PUNE;
  const initialApprovals = getApprovalsForProfile(initialProfile);
  const initialOptimizer = new AdversarialPathOptimizer(initialApprovals, initialProfile);
  const initialResult = initialOptimizer.optimize();
  const initialVault = generatePreValidatedMahaVault(initialProfile);

  return {
    currentProfile: initialProfile,
    simulationResult: initialResult,
    selectedNode: null,
    isDrawerOpen: false,
    activeStrategyId: initialResult.minimaxStrategy.strategyId,
    whatIfComparison: null,
    uploadedDocuments: initialVault,
    isSimulating: false,
    activeRole: 'APPLICANT',
    currentIndustrialist: SEED_INDUSTRIALISTS.EV_PUNE,
    currentOfficer: SEED_OFFICERS.MPCB_PUNE,

    setActiveRole: (role) => {
      set({ activeRole: role });
    },

    loginIndustrialist: (account) => {
      set({ currentIndustrialist: account, activeRole: 'APPLICANT' });
    },

    loginOfficer: (officer) => {
      set({ currentOfficer: officer, activeRole: 'OFFICER' });
    },

    logout: () => {
      set({ currentIndustrialist: null, currentOfficer: null });
    },

    logoutIndustrialist: () => {
      set({ currentIndustrialist: null });
    },

    logoutOfficer: () => {
      set({ currentOfficer: null });
    },

    setProfile: (profile) => {
      set({ 
        currentProfile: profile,
        uploadedDocuments: generatePreValidatedMahaVault(profile),
      });
      get().runSimulation();
    },

    loadDemoProfile: (key) => {
      const p = DEMO_PROFILES[key] || DEMO_PROFILES.EV_PUNE;
      const matchingAccount = 
        key === 'PHARMA_AURANGABAD' ? SEED_INDUSTRIALISTS.PHARMA_AURIC :
        key === 'FOOD_NASHIK' ? SEED_INDUSTRIALISTS.FOOD_NASHIK :
        key === 'SOLAR_NAGPUR' ? SEED_INDUSTRIALISTS.SOLAR_NAGPUR :
        SEED_INDUSTRIALISTS.EV_PUNE;

      set({ 
        currentProfile: p,
        currentIndustrialist: matchingAccount,
        uploadedDocuments: generatePreValidatedMahaVault(p),
      });
      get().runSimulation();
    },

    runSimulation: () => {
      set({ isSimulating: true });
      const profile = get().currentProfile;
      const approvals = getApprovalsForProfile(profile);
      const optimizer = new AdversarialPathOptimizer(approvals, profile);
      const result = optimizer.optimize();

      set({
        simulationResult: result,
        activeStrategyId: result.minimaxStrategy.strategyId,
        isSimulating: false,
      });
    },

    setSelectedNode: (node) => {
      set({ selectedNode: node, isDrawerOpen: !!node });
    },

    closeDrawer: () => {
      set({ isDrawerOpen: false, selectedNode: null });
    },

    setActiveStrategyId: (strategyId) => {
      set({ activeStrategyId: strategyId });
    },

    setWhatIfComparison: (comparison) => {
      set({ whatIfComparison: comparison });
    },

    addUploadedDocument: (docType, result) => {
      set((state) => ({
        uploadedDocuments: {
          ...state.uploadedDocuments,
          [docType]: result,
        },
      }));
    },

    setSimulationResult: (result) => {
      set({ 
        simulationResult: result, 
        activeStrategyId: result.minimaxStrategy.strategyId 
      });
    },
  };
});
