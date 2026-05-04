import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from '../types';
import { Users, Fuel, Gauge, MapPin } from 'lucide-react';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-gray-200/80 transition-all duration-300 group">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-slate-800">
        <img
          src={car.image_url}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
            car.availability ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {car.availability ? 'Available' : 'Rented'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2 gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-black text-gray-950 dark:text-white leading-tight">{car.name}</h3>
            <div className="flex items-center text-gray-500 dark:text-slate-400 text-sm mt-1">
              <MapPin className="h-3 w-3 mr-1 shrink-0" />
              <span className="truncate">{car.location}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-black text-amber-700">BDT {car.price_per_day}</span>
            <span className="text-gray-400 dark:text-slate-500 text-xs block">/ day</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 my-4 py-4 border-y border-gray-100 dark:border-slate-700">
          <div className="flex flex-col items-center text-center">
            <Users className="h-4 w-4 text-amber-600 mb-1" />
            <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase font-semibold tracking-wider">{car.seats} Seats</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Fuel className="h-4 w-4 text-amber-600 mb-1" />
            <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase font-semibold tracking-wider">{car.fuel_type}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Gauge className="h-4 w-4 text-amber-600 mb-1" />
            <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase font-semibold tracking-wider">{car.transmission}</span>
          </div>
        </div>

        <Link
          to={`/car/${car.id}`}
          className="block w-full text-center bg-gray-950 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
