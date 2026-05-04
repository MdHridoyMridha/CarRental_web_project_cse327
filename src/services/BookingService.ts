import { Booking } from '../types';
import SupabaseService from './SupabaseService';
import { BookingEventManager, BookingLoggerObserver } from './BookingObserver';

export interface IBookingService {
  checkAvailability(carId: string, startDate: string, endDate: string): Promise<boolean>;
  createBooking(booking: Omit<Booking, 'id' | 'created_at'>): Promise<void>;
}

export class BookingService implements IBookingService {
  private supabase = SupabaseService.getInstance().getClient();
  private bookingEvents = new BookingEventManager();

  constructor() {
    this.bookingEvents.subscribe(new BookingLoggerObserver());
  }

  async checkAvailability(carId: string, startDate: string, endDate: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('id')
      .eq('car_id', carId)
      .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

    if (error) {
      throw error;
    }

    return !data?.length;
  }

  async createBooking(booking: Omit<Booking, 'id' | 'created_at'>): Promise<void> {
    const { error } = await this.supabase.from('bookings').insert(booking);

    if (error) {
      throw error;
    }

    this.bookingEvents.notify(booking);
  }
}
