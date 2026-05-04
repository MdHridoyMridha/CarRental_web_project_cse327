import type { Car } from '../types';

type SupabaseCarRow = Car;

export interface ICarAdapter {
  toCar(row: SupabaseCarRow): Car;
}

export class SupabaseCarAdapter implements ICarAdapter {
  toCar(row: SupabaseCarRow): Car {
    return {
      id: row.id,
      created_at: row.created_at,
      name: row.name,
      image_url: row.image_url,
      price_per_day: row.price_per_day,
      availability: row.availability,
      location: row.location,
      type: row.type,
      description: row.description,
      transmission: row.transmission,
      fuel_type: row.fuel_type,
      seats: row.seats,
      driver_fee: row.driver_fee,
    };
  }
}
