import type { Booking } from '../types';

type BookingPayload = Omit<Booking, 'id' | 'created_at'>;

export interface BookingObserver {
  update(booking: BookingPayload): void;
}

export class BookingEventManager {
  private observers: BookingObserver[] = [];

  subscribe(observer: BookingObserver) {
    this.observers.push(observer);
  }

  unsubscribe(observer: BookingObserver) {
    this.observers = this.observers.filter((item) => item !== observer);
  }

  notify(booking: BookingPayload) {
    this.observers.forEach((observer) => observer.update(booking));
  }
}

export class BookingLoggerObserver implements BookingObserver {
  update(booking: BookingPayload) {
    console.log(
      `[BookingObserver] Booking created for car ${booking.car_id} from ${booking.start_date} to ${booking.end_date}`
    );
  }
}
