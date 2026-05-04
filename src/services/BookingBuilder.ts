// services/BookingBuilder.ts
import { Booking } from '../types';

export class BookingBuilder {
  private booking: Partial<Booking> = {
    status: 'confirmed',
    with_driver: false,
    payment_method: 'Cash on Delivery'
  };

  setUser(userId: string) {
    this.booking.user_id = userId;
    return this;
  }

  setCar(carId: string) {
    this.booking.car_id = carId;
    return this;
  }

  setDates(startDate: string, endDate: string) {
    this.booking.start_date = startDate;
    this.booking.end_date = endDate;
    return this;
  }

  setPaymentMethod(method: 'Cash on Delivery' | 'Card' | 'bKash') {
    this.booking.payment_method = method;
    return this;
  }

  setWithDriver(withDriver: boolean) {
    this.booking.with_driver = withDriver;
    return this;
  }

  setPhone(phone: string) {
    this.booking.phone_number = phone;
    return this;
  }

  setNID(nid: string) {
    this.booking.nid_number = nid;
    return this;
  }

  build(): Partial<Booking> {
    if (!this.booking.user_id || !this.booking.car_id || 
        !this.booking.start_date || !this.booking.end_date) {
      throw new Error("Missing required booking fields");
    }
    return { ...this.booking };
  }
}