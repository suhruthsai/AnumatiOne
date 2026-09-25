import { create } from 'zustand';
import { BusinessProfile, SimulationResult, ApprovalNode, WhatIfComparison, DocumentValidationResult } from '@approvalos/shared';
import { DEMO_PROFILES } from './demo-data';
import { AdversarialPathOptimizer } from './simulator/adversarial-optimizer';
import { getApprovalsForProfile } from './knowledge-engine/regulatory-graph';
import { generatePreValidatedMahaVault } from './document-intelligence/maitrivault-data';

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

interface AppState {
  currentProfile: BusinessProfile;
  simulationResult: SimulationResult | null;
  selectedNode: ApprovalNode | null;
  isDrawerOpen: boolean;
  activeStrategyId: string;
  whatIfComparison: WhatIfComparison | null;
  uploadedDocuments: Record<string, DocumentValidationResult>;
  isSimulating: boolean;

  // Industrialist Auth Session
  currentIndustrialist: IndustrialistAccount | null;

  // Actions
  setProfile: (profile: BusinessProfile) => void;
  loadDemoProfile: (key: string) => void;
  runSimulation: () => void;
  setSelectedNode: (node: ApprovalNode | null) => void;
  closeDrawer: () => void;
  setActiveStrategyId: (strategyId: string) => void;
  setWhatIfComparison: (comparison: WhatIfComparison | null) => void;
  addUploadedDocument: (docType: string, result: DocumentValidationResult) => void;
  setSimulationResult: (result: SimulationResult) => void;
  loginIndustrialist: (account: IndustrialistAccount) => void;
  logoutIndustrialist: () => void;
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
    currentIndustrialist: null, // Initialized unauthenticated so user signs up/logs in

    loginIndustrialist: (account) => {
      set({ currentIndustrialist: account });
    },

    logoutIndustrialist: () => {
      set({ currentIndustrialist: null });
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
      set({ 
        currentProfile: p,
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
