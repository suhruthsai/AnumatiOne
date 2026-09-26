import { NextRequest, NextResponse } from 'next/server';
import { applicationDB } from '@/lib/db/application-db';
import { CommonApplicationFormData } from '@approvalos/shared';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const profileId = searchParams.get('profileId') || undefined;
  const role = searchParams.get('role') || undefined;
  const department = searchParams.get('department') || undefined;
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;

  const list = applicationDB.getAll({
    profileId,
    department,
    role,
    status,
    search,
  });

  return NextResponse.json({
    success: true,
    count: list.length,
    data: list,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Full Common Application Form (CAF) submission
    if (body.isCAF || body.companyName && body.midcCluster) {
      const cafData: CommonApplicationFormData = body.isCAF ? body.cafData : body;
      const result = applicationDB.submitCommonApplication(cafData);

      return NextResponse.json({
        success: true,
        cafReferenceNumber: result.cafReferenceNumber,
        count: result.createdApplications.length,
        data: result.createdApplications,
      });
    }

    // Single approval quick submit
    const companyName = body.profile?.companyName || body.companyName || 'Maharashtra Industrial Unit';
    const singleCAF: CommonApplicationFormData = {
      companyName,
      entityType: 'PVT_LTD',
      pan: 'ABCDE1234F',
      authorizedPersonName: 'Unit Representative',
      authorizedPersonPhone: '+91 98230 11223',
      authorizedPersonEmail: 'contact@industry.mh.gov.in',
      sector: body.profile?.sector || 'EV_MANUFACTURING',
      productDescription: 'Manufacturing Unit',
      projectStage: 'PRE_ESTABLISHMENT',
      midcCluster: body.profile?.district ? `MIDC ${body.profile.district}` : 'MIDC Chakan Pune',
      plotNumber: 'Plot 101',
      landAreaAcres: body.profile?.landAreaAcres || 5,
      builtUpAreaSqM: body.profile?.builtUpAreaSqMeters || 12000,
      plantMachineryInvestmentCr: body.profile?.investmentInrCr || 25,
      landBuildingInvestmentCr: 10,
      totalProjectCostCr: (body.profile?.investmentInrCr || 25) + 10,
      expectedEmployees: body.profile?.expectedEmployees || 120,
      enterpriseScale: 'MEDIUM',
      pollutionCategory: body.profile?.pollutionCategory || 'ORANGE',
      powerRequiredKva: body.profile?.powerRequiredKva || 1000,
      waterRequiredKld: body.profile?.waterRequiredKld || 25,
      effluentDischargeKld: 10,
      treatmentScheme: 'ZERO_LIQUID_DISCHARGE',
      boilerInstalled: false,
      hazardousChemicals: false,
      selectedApprovalIds: [body.approvalNodeId || 'CTE_POLLUTION'],
      documents: body.documents || [],
    };

    const result = applicationDB.submitCommonApplication(singleCAF);

    return NextResponse.json({
      success: true,
      data: result.createdApplications[0],
      allApplications: result.createdApplications,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Application submission error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      applicationId, 
      action, 
      notes, 
      performedBy, 
      statutoryRuleRef, 
      response, 
      attachedDocName,
      scheduledDate,
      departments,
      officerNames 
    } = body;

    if (!applicationId && action !== 'RESET_DEMO') {
      return NextResponse.json({ success: false, error: 'applicationId required' }, { status: 400 });
    }

    let updated;

    switch (action) {
      case 'APPROVE':
        updated = applicationDB.approve(applicationId, performedBy, notes);
        break;

      case 'REJECT':
        updated = applicationDB.reject(applicationId, performedBy, notes);
        break;

      case 'RAISE_QUERY':
        updated = applicationDB.raiseOfficerQuery(
          applicationId, 
          performedBy || 'Scrutiny Officer', 
          notes || 'Deficiency noted during scrutiny', 
          statutoryRuleRef
        );
        break;

      case 'RESPOND_QUERY':
        updated = applicationDB.respondToQuery(
          applicationId, 
          response || notes || 'Clarification submitted by applicant', 
          attachedDocName
        );
        break;

      case 'DEEMED_APPROVE':
        updated = applicationDB.triggerDeemedApproval(applicationId);
        break;

      case 'SCHEDULE_INSPECTION':
        updated = applicationDB.scheduleInspection(
          applicationId,
          scheduledDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          departments || ['State Fire Services', 'DISH Safety Directorate'],
          officerNames || ['Joint Inspection Team']
        );
        break;

      case 'REASSIGN':
        updated = applicationDB.reassignOfficer(
          applicationId,
          body.newOfficerName || 'Er. Dilip Patil (Fast-Track Technical Cell)',
          notes || 'Caseload load-balancing and statutory SLA protection',
          performedBy || 'Department Directorate Head'
        );
        break;

      case 'EXTEND_SLA':
        updated = applicationDB.extendSlaAdmin(
          applicationId,
          body.additionalDays || 7,
          notes || 'Complex multi-disciplinary hazardous chemical & safety audit',
          performedBy || 'Department Directorate Head'
        );
        break;

      case 'CROSS_DEPT_PULL':
        updated = applicationDB.crossDeptPull(
          applicationId,
          body.docType || 'LAND_SALE_DEED',
          body.docName || 'MIDC_Chakan_Plot_Allotment_Agreement.pdf',
          body.sourceDept || 'MIDC Planning Directorate',
          performedBy || 'Department Directorate Head'
        );
        break;

      case 'RESET_DEMO':
        const resetData = applicationDB.resetToDefaults();
        return NextResponse.json({ success: true, message: 'Database reset to demo state', data: resetData });

      default:
        return NextResponse.json({ success: false, error: `Unknown action ${action}` }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Workflow action error' },
      { status: 500 }
    );
  }
}
