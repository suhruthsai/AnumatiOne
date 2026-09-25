import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const departmentScorecards = [
    {
      department: 'Maharashtra Pollution Control Board (MPCB)',
      totalApplications: 1420,
      avgApprovalDays: 27.4,
      statutorySlaDays: 30,
      slaComplianceRate: 89.5,
      rejectionRate: 3.8,
      greenChannelAutoApproved: 412,
      bottleneckRank: 1,
      topDelayReason: 'Zero Liquid Discharge (ZLD) mass balance verification queries',
    },
    {
      department: 'SEIAA Maharashtra (State Environmental Authority)',
      totalApplications: 310,
      avgApprovalDays: 64.2,
      statutorySlaDays: 75,
      slaComplianceRate: 84.1,
      rejectionRate: 7.5,
      greenChannelAutoApproved: 0,
      bottleneckRank: 2,
      topDelayReason: 'State Expert Appraisal Committee (SEAC) quarterly meeting backlog',
    },
    {
      department: 'MSEDCL (Mahavitaran Power Distribution)',
      totalApplications: 2150,
      avgApprovalDays: 17.8,
      statutorySlaDays: 20,
      slaComplianceRate: 94.4,
      rejectionRate: 1.9,
      greenChannelAutoApproved: 620,
      bottleneckRank: 3,
      topDelayReason: 'Sub-station transformer load step-down feasibility verification',
    },
    {
      department: 'MIDC Special Planning Authority (SPA)',
      totalApplications: 1890,
      avgApprovalDays: 16.5,
      statutorySlaDays: 18,
      slaComplianceRate: 95.8,
      rejectionRate: 2.5,
      greenChannelAutoApproved: 980,
      bottleneckRank: 4,
      topDelayReason: 'Plot boundary setbacks under MIDC Development Control Regulations',
    },
    {
      department: 'Maharashtra Fire Services / MIDC Fire Brigade',
      totalApplications: 1650,
      avgApprovalDays: 14.2,
      statutorySlaDays: 15,
      slaComplianceRate: 97.1,
      rejectionRate: 1.4,
      greenChannelAutoApproved: 0,
      bottleneckRank: 5,
      topDelayReason: 'Hydrant water flow discharge pressure joint testing',
    },
  ];

  const eodbDistrictRankings = [
    { state: 'Pune (Chakan & Ranjangaon MIDC)', score: 96.8, rank: 1, avgDaysToClearance: 39, singleWindowFriction: 'Low' },
    { state: 'Chhatrapati Sambhajinagar (AURIC DMIC)', score: 95.4, rank: 2, avgDaysToClearance: 42, singleWindowFriction: 'Low' },
    { state: 'Thane / Navi Mumbai (Taloja MIDC)', score: 93.9, rank: 3, avgDaysToClearance: 46, singleWindowFriction: 'Low-Medium' },
    { state: 'Nagpur (MIHAN SEZ / Butibori MIDC)', score: 92.2, rank: 4, avgDaysToClearance: 49, singleWindowFriction: 'Medium' },
    { state: 'Nashik (Ambad & Dindori Food Park)', score: 90.7, rank: 5, avgDaysToClearance: 52, singleWindowFriction: 'Medium' },
    { state: 'Raigad (Roha & Patalganga Zone)', score: 88.5, rank: 6, avgDaysToClearance: 56, singleWindowFriction: 'Medium-High' },
  ];

  return NextResponse.json({
    success: true,
    data: {
      systemStats: {
        totalClearancesSimulated: 18450,
        averageTimeSavedPercentage: 58.4,
        greenChannelAutoApprovedCount: 4210,
        jointInspectionsScheduled: 1840,
        totalStatutoryFeesProcessedInr: 482000000,
        systemHealth: 'OPERATIONAL',
      },
      departmentScorecards,
      eodbDistrictRankings,
      eodbStateRankings: eodbDistrictRankings,
    },
  });
}
