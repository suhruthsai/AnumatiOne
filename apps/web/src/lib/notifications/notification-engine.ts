export type NotificationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';

export type NotificationEventType = 
  | 'APPLICATION_SUBMITTED'
  | 'GREEN_CHANNEL_APPROVED'
  | 'INSPECTION_SLOTTED'
  | 'QUERY_RAISED'
  | 'SLA_BREACH_WARNING'
  | 'RENEWAL_ALERT';

export interface NotificationLog {
  id: string;
  recipient: string;
  channel: NotificationChannel;
  event: NotificationEventType;
  title: string;
  body: string;
  status: 'SENT' | 'DELIVERED' | 'QUEUED';
  timestamp: string;
}

export const NOTIFICATION_TEMPLATES: Record<NotificationEventType, { title: string; template: string }> = {
  APPLICATION_SUBMITTED: {
    title: 'AnumatiOne: Application Dossier Registered',
    template: 'Dear {{companyName}}, your application {{trackingNumber}} for {{approvalName}} has been pre-validated and dispatched to {{department}}. Statutory SLA: {{slaDays}} days.',
  },
  GREEN_CHANNEL_APPROVED: {
    title: '⚡ Instant Green-Channel Auto-Approval Granted',
    template: 'Congratulations {{companyName}}! Your permit {{approvalName}} (Tracking: {{trackingNumber}}) has been auto-approved under Green Channel rules based on your Trust Score of {{trustScore}}/100.',
  },
  INSPECTION_SLOTTED: {
    title: '📅 Joint Site Inspection Scheduled',
    template: 'Notice: Synchronized multi-department site visit for {{companyName}} is locked for {{inspectionDate}} (10:30 AM - 01:30 PM). Joint team: {{departments}}.',
  },
  QUERY_RAISED: {
    title: '⚠️ Clarification Query Raised by Department',
    template: 'Attention {{companyName}}: {{department}} has raised a query on {{trackingNumber}}: "{{queryNote}}". Please respond within 7 days to preserve SLA precedence.',
  },
  SLA_BREACH_WARNING: {
    title: '🚨 SLA Escalation Warning: 48 Hours Remaining',
    template: 'Urgent: Application {{trackingNumber}} is within 48 hours of statutory SLA deadline. Escalated to {{escalationLevel}} for priority signoff.',
  },
  RENEWAL_ALERT: {
    title: '🔔 Statutory Renewal Window Open',
    template: 'Notice: Your {{approvalName}} is due for periodic statutory renewal on {{dueDate}} ({{daysLeft}} days remaining). Auto-renew is enabled.',
  },
};

// In-memory notifications log
export const NOTIFICATION_HISTORY: NotificationLog[] = [
  {
    id: 'notif_001',
    recipient: '+919876543210 (Aakash Singhania)',
    channel: 'WHATSAPP',
    event: 'GREEN_CHANNEL_APPROVED',
    title: '⚡ Instant Green-Channel Auto-Approval Granted',
    body: 'Congratulations Aegis Lithium Mobility! Your permit Consent to Establish (Tracking: APOS-ENV02-882194) has been auto-approved under Green Channel rules.',
    status: 'DELIVERED',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_002',
    recipient: 'aakash@aegislithium.com',
    channel: 'EMAIL',
    event: 'INSPECTION_SLOTTED',
    title: '📅 Joint Site Inspection Scheduled',
    body: 'Notice: Synchronized multi-department site visit is locked for 2 days from now. Joint team: State Fire Services + DISH.',
    status: 'DELIVERED',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_003',
    recipient: '+919876543210',
    channel: 'SMS',
    event: 'SLA_BREACH_WARNING',
    title: '🚨 SLA Escalation Warning: 48 Hours Remaining',
    body: 'Urgent: Application APOS-UTL01-992019 is within 48 hours of statutory deadline. Escalated to HOD for priority signoff.',
    status: 'DELIVERED',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export class NotificationEngine {
  /**
   * Compiles template string with context variables
   */
  public static compileTemplate(template: string, context: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => context[key] !== undefined ? String(context[key]) : '');
  }

  /**
   * Dispatches event-driven multi-channel notification
   */
  public static dispatchNotification(
    event: NotificationEventType,
    recipient: string,
    channel: NotificationChannel,
    context: Record<string, any>
  ): NotificationLog {
    const meta = NOTIFICATION_TEMPLATES[event];
    const title = this.compileTemplate(meta.title, context);
    const body = this.compileTemplate(meta.template, context);

    const log: NotificationLog = {
      id: `notif_${Date.now()}`,
      recipient,
      channel,
      event,
      title,
      body,
      status: 'SENT',
      timestamp: new Date().toISOString(),
    };

    NOTIFICATION_HISTORY.unshift(log);
    return log;
  }
}
