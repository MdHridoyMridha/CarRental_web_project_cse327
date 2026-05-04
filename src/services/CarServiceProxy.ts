// services/CarServiceProxy.ts
import type { Car } from '../types';
import { ICarService, CarService } from './CarService';
import { CarServiceLoggingDecorator } from './CarServiceDecorator';

export class CarServiceProxy implements ICarService {
  private service: ICarService;
  private cache = new Map<string, any>();

  constructor() {
    // Chain: Proxy → Decorator → Real Service
    this.service = new CarServiceLoggingDecorator(new CarService());
  }

  async getCars(): Promise<Car[]> {
    const cacheKey = 'all_cars';
    if (this.cache.has(cacheKey)) {
      console.log('🚀 [Proxy] Cache hit for all cars');
      return this.cache.get(cacheKey);
    }

    const cars = await this.service.getCars();
    this.cache.set(cacheKey, cars);
    return cars;
  }

  async getCarById(id: string): Promise<Car | null> {
    if (this.cache.has(id)) {
      console.log(`🚀 [Proxy] Cache hit for car ${id}`);
      return this.cache.get(id);
    }

    const car = await this.service.getCarById(id);
    if (car) this.cache.set(id, car);
    return car;
  }

  clearCache() {
    this.cache.clear();
    console.log('🧹 [Proxy] Cache cleared');
  }
}

export { CarService };
export type { ICarService };
