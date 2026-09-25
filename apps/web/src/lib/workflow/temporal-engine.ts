import { ApplicationRecord, ApplicationWorkflowStatus, BusinessProfile, ApprovalNode } from '@approvalos/shared';
import { evaluateRiskScrutiny } from './risk-scrutiny';

export interface WorkflowSignal {
  type: 'SUBMIT' | 'APPROVE' | 'REJECT' | 'RAISE_QUERY' | 'RESPOND_QUERY' | 'SCHEDULE_INSPECTION';
  performedBy: string;
  notes?: string;
}

/**
 * Temporal-style Workflow Orchestrator
 * Coordinates parallel applications, enforces statutory SLAs, triggers green-channel auto-approvals,
 * and escalates overdue files automatically to District Collectors.
 */
export class ApprovalWorkflowOrchestrator {
  /**
   * Initializes a new regulatory application workflow
   */
  public static startApplication(
    profile: BusinessProfile,
    approval: ApprovalNode,
    documents: Array<{ docType: any; docName: string; verified: boolean; url: string }>
  ): ApplicationRecord {
    const scrutiny = evaluateRiskScrutiny(profile);
    const trackingNumber = `APOS-${approval.code}-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const submissionDate = now.toISOString();

    const slaDays = approval.baseDays;
    const deadlineDate = new Date(now.getTime() + slaDays * 24 * 60 * 60 * 1000);
    const slaDeadline = deadlineDate.toISOString();

    // Check if Green Channel auto-approval triggers immediately
    let initialStatus: ApplicationWorkflowStatus = 'SUBMITTED';
    let greenChannelApproved = false;

    if (scrutiny.greenChannelEligible && approval.canAutoApprove) {
      initialStatus = 'GREEN_CHANNEL_APPROVED';
      greenChannelApproved = true;
    }

    const app: ApplicationRecord = {
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      trackingNumber,
      profileId: profile.id,
      companyName: profile.companyName,
      approvalNodeId: approval.id,
      approvalName: approval.name,
      department: approval.department,
      status: initialStatus,
      submissionDate,
      slaDeadline,
      daysRemaining: slaDays,
      isEscalated: false,
      escalationLevel: 'NONE',
      assignedOfficerName: greenChannelApproved ? 'AnumatiOne Green-Channel AI Daemon' : 'Er. Ramesh Kulkarni, HOD',
      riskScore: 100 - scrutiny.trustScore,
      trustScore: scrutiny.trustScore,
      greenChannelEligible: scrutiny.greenChannelEligible,
      documents,
      timeline: [
        {
          timestamp: submissionDate,
          event: greenChannelApproved ? 'Instant Green-Channel Auto-Approval Granted' : 'Application Dossier Submitted & Pre-Validated',
          performedBy: 'Applicant / DigiLocker Vault',
          status: initialStatus,
        },
      ],
    };

    return app;
  }

  /**
   * Applies an event/signal to an active application
   */
  public static processSignal(app: ApplicationRecord, signal: WorkflowSignal): ApplicationRecord {
    const updated = { ...app };
    const now = new Date().toISOString();

    switch (signal.type) {
      case 'APPROVE':
        updated.status = 'APPROVED';
        updated.timeline.push({
          timestamp: now,
          event: 'Statutory Clearance Granted by Competent Authority',
          performedBy: signal.performedBy,
          status: 'APPROVED',
        });
        break;

      case 'RAISE_QUERY':
        updated.status = 'QUERY_RAISED';
        updated.queryNotes = updated.queryNotes || [];
        if (signal.notes) updated.queryNotes.push(signal.notes);
        updated.timeline.push({
          timestamp: now,
          event: `Clarification Query Raised: ${signal.notes || 'Additional details required'}`,
          performedBy: signal.performedBy,
          status: 'QUERY_RAISED',
        });
        break;

      case 'RESPOND_QUERY':
        updated.status = 'UNDER_SCRUTINY';
        updated.timeline.push({
          timestamp: now,
          event: `Applicant Submitted Clarification: ${signal.notes || 'Document re-uploaded'}`,
          performedBy: signal.performedBy,
          status: 'UNDER_SCRUTINY',
        });
        break;

      case 'SCHEDULE_INSPECTION':
        updated.status = 'INSPECTION_PENDING';
        updated.timeline.push({
          timestamp: now,
          event: `Joint Site Inspection Slotted: ${signal.notes || 'Physical inspection confirmed'}`,
          performedBy: signal.performedBy,
          status: 'INSPECTION_PENDING',
        });
        break;

      case 'REJECT':
        updated.status = 'REJECTED';
        updated.timeline.push({
          timestamp: now,
          event: `Application Rejected: ${signal.notes || 'Statutory criteria not met'}`,
          performedBy: signal.performedBy,
          status: 'REJECTED',
        });
        break;
    }

    return updated;
  }

  /**
   * Evaluates SLA status and triggers automated escalation to higher authorities
   */
  public static evaluateSLA(app: ApplicationRecord): ApplicationRecord {
    if (app.status === 'APPROVED' || app.status === 'GREEN_CHANNEL_APPROVED' || app.status === 'REJECTED') {
      return app;
    }

    const deadline = new Date(app.slaDeadline).getTime();
    const now = Date.now();
    const daysRemaining = Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)));
    const updated = { ...app, daysRemaining };

    if (now > deadline) {
      updated.isEscalated = true;
      updated.escalationLevel = 'DISTRICT_COLLECTOR';
    } else if (daysRemaining <= 2) {
      updated.isEscalated = true;
      updated.escalationLevel = 'HOD';
    }

    return updated;
  }
}
