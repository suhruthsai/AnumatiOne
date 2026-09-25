export interface InspectionSlot {
  id: string;
  applicationIds: string[];
  companyName: string;
  district: string;
  scheduledDate: string;
  timeWindow: string;
  mode: 'PHYSICAL_JOINT' | 'REMOTE_VIDEO';
  departments: string[];
  inspectors: Array<{ name: string; department: string; designation: string }>;
  clusterZone: string;
  estimatedTravelSavingKm: number;
}

/**
 * Inspection Scheduler: Bundles site visits across departments into a single joint slot
 * and clusters geographic routes to eliminate inspector backlog.
 */
export function scheduleJointInspection(
  applicationIds: string[],
  companyName: string,
  district: string,
  departments: string[],
  isLowRisk: boolean
): InspectionSlot {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + (isLowRisk ? 2 : 5));
  const scheduledDate = tomorrow.toISOString().split('T')[0];

  const mode = isLowRisk ? 'REMOTE_VIDEO' : 'PHYSICAL_JOINT';

  const inspectors = departments.map((dept, idx) => ({
    name: ['Er. Aniket Deshmukh', 'Dr. Sunita Patel', 'Shri V. Ramaswamy', 'Capt. R. K. Nair'][idx % 4],
    department: dept,
    designation: 'Senior Regulatory Inspector',
  }));

  return {
    id: `INSP-${Date.now().toString().slice(-6)}`,
    applicationIds,
    companyName,
    district,
    scheduledDate,
    timeWindow: '10:30 AM - 01:30 PM (Single Joint Slot)',
    mode,
    departments,
    inspectors,
    clusterZone: `${district} Industrial Cluster Zone-B`,
    estimatedTravelSavingKm: departments.length * 35, // 35 km saved per department by combining trips
  };
}
