import { supabase } from '../supabase';

type BookingNotificationEvent = 'booking_created' | 'status_updated';

export interface BookingNotificationPayload {
  event: BookingNotificationEvent;
  recipientEmail?: string | null;
  recipientName?: string | null;
  bookingId?: string;
  carName: string;
  status: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  paymentMethod: string;
  withDriver: boolean;
  sendPush?: boolean;
}

export interface NotificationDeliveryResult {
  channel: 'email' | 'push';
  delivered: boolean;
  skipped?: boolean;
  reason?: string;
}

const getEnv = (key: string) => ((import.meta as any).env?.[key] as string | undefined)?.trim();

export class NotificationService {
  async requestPushPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (!('Notification' in window)) {
      return 'unsupported';
    }

    if (Notification.permission === 'default') {
      return Notification.requestPermission();
    }

    return Notification.permission;
  }

  async sendBookingConfirmation(payload: BookingNotificationPayload): Promise<NotificationDeliveryResult[]> {
    return this.sendBookingNotification({
      ...payload,
      event: 'booking_created',
      status: payload.status || 'confirmed'
    });
  }

  async sendBookingStatusUpdate(payload: BookingNotificationPayload): Promise<NotificationDeliveryResult[]> {
    return this.sendBookingNotification({
      ...payload,
      event: 'status_updated'
    });
  }

  private async sendBookingNotification(
    payload: BookingNotificationPayload
  ): Promise<NotificationDeliveryResult[]> {
    const pushPromise = payload.sendPush === false
      ? Promise.resolve<NotificationDeliveryResult>({
          channel: 'push',
          delivered: false,
          skipped: true,
          reason: 'Push delivery was not requested for this notification.'
        })
      : this.sendPushNotification(payload);

    const [emailResult, pushResult] = await Promise.all([
      this.sendEmail(payload),
      pushPromise
    ]);

    return [emailResult, pushResult];
  }

  private async sendEmail(payload: BookingNotificationPayload): Promise<NotificationDeliveryResult> {
    if (!payload.recipientEmail) {
      return {
        channel: 'email',
        delivered: false,
        skipped: true,
        reason: 'No recipient email is available for this booking.'
      };
    }

    const endpoint = getEnv('VITE_BOOKING_NOTIFICATION_ENDPOINT');
    const functionName = getEnv('VITE_BOOKING_NOTIFICATION_FUNCTION');

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.toEmailPayload(payload))
        });

        if (!response.ok) {
          throw new Error(`Email endpoint returned ${response.status}`);
        }

        return { channel: 'email', delivered: true };
      }

      if (functionName) {
        const { error } = await supabase.functions.invoke(functionName, {
          body: this.toEmailPayload(payload)
        });

        if (error) {
          throw error;
        }

        return { channel: 'email', delivered: true };
      }

      return {
        channel: 'email',
        delivered: false,
        skipped: true,
        reason: 'Configure VITE_BOOKING_NOTIFICATION_ENDPOINT or VITE_BOOKING_NOTIFICATION_FUNCTION.'
      };
    } catch (error) {
      console.error('Email notification failed:', error);
      return {
        channel: 'email',
        delivered: false,
        reason: error instanceof Error ? error.message : 'Email notification failed.'
      };
    }
  }

  private async sendPushNotification(
    payload: BookingNotificationPayload
  ): Promise<NotificationDeliveryResult> {
    if (!('Notification' in window)) {
      return {
        channel: 'push',
        delivered: false,
        skipped: true,
        reason: 'Browser notifications are not supported.'
      };
    }

    try {
      let permission = Notification.permission;

      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        return {
          channel: 'push',
          delivered: false,
          skipped: true,
          reason: 'Browser notification permission was not granted.'
        };
      }

      const title = payload.event === 'booking_created'
        ? 'Booking confirmed'
        : `Booking ${payload.status}`;

      new Notification(title, {
        body: `${payload.carName} from ${payload.startDate} to ${payload.endDate}. Total: BDT ${payload.totalPrice}.`,
        tag: payload.bookingId ? `booking-${payload.bookingId}` : `booking-${payload.carName}`,
        data: {
          bookingId: payload.bookingId,
          event: payload.event,
          status: payload.status
        }
      });

      return { channel: 'push', delivered: true };
    } catch (error) {
      console.error('Push notification failed:', error);
      return {
        channel: 'push',
        delivered: false,
        reason: error instanceof Error ? error.message : 'Push notification failed.'
      };
    }
  }

  private toEmailPayload(payload: BookingNotificationPayload) {
    const subject = payload.event === 'booking_created'
      ? `RydexGo booking confirmed: ${payload.carName}`
      : `RydexGo booking ${payload.status}: ${payload.carName}`;

    const message = payload.event === 'booking_created'
      ? `Your booking for ${payload.carName} has been confirmed.`
      : `Your booking for ${payload.carName} is now ${payload.status}.`;

    return {
      to: payload.recipientEmail,
      subject,
      template: 'booking-notification',
      data: {
        ...payload,
        message
      }
    };
  }
}

export const notificationService = new NotificationService();
