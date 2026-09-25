import { NextRequest, NextResponse } from 'next/server';
import { NOTIFICATION_HISTORY, NotificationEngine, NotificationChannel, NotificationEventType } from '@/lib/notifications/notification-engine';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: NOTIFICATION_HISTORY,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, recipient, channel, context } = body;

    const log = NotificationEngine.dispatchNotification(
      event as NotificationEventType,
      recipient || '+919876543210',
      (channel as NotificationChannel) || 'WHATSAPP',
      context || {}
    );

    return NextResponse.json({
      success: true,
      data: log,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
