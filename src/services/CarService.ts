import { Car } from '../types';
import SupabaseService from './SupabaseService';
import { SupabaseCarAdapter } from './CarAdapter';

export interface ICarService {
  getCars(): Promise<Car[]>;
  getCarById(id: string): Promise<Car | null>;
}

export class CarService implements ICarService {
  private supabase = SupabaseService.getInstance().getClient();
  private carAdapter = new SupabaseCarAdapter();

  async getCars(): Promise<Car[]> {
    const { data, error } = await this.supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data?.map((car) => this.carAdapter.toCar(car)) ?? [];
  }

  async getCarById(id: string): Promise<Car | null> {
    const { data, error } = await this.supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? this.carAdapter.toCar(data) : null;
  }
}
