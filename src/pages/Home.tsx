import React, { useEffect, useState, useMemo } from 'react';
import { ServiceFactory } from '../services/ServiceFactory';
import { CarSearchStrategy, CarSortStrategy } from '../services/FilterStrategy';
import { Car } from '../types';
import CarCard from '../components/CarCard';
import { Search, SlidersHorizontal, Loader2, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const carService = useMemo(() => ServiceFactory.getCarService(), []);
  const filterStrategy = useMemo(() => new CarSearchStrategy(), []);
  const sortStrategy = useMemo(() => new CarSortStrategy(), []);

  useEffect(() => {
    fetchCars();
  }, [carService]);

  async function fetchCars() {
    try {
      setLoading(true);
      const data = await carService.getCars();
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredCars = useMemo(() => {
    const filtered = filterStrategy.filter(cars, { searchTerm, filterType });
    return sortStrategy.sort(filtered, sortBy);
  }, [cars, searchTerm, filterType, sortBy, filterStrategy, sortStrategy]);

  const carTypes = ['All', ...new Set(cars.map((car) => car.type))];
  const searchSuggestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return [];

    const suggestions = cars.flatMap((car) => [
      { label: car.name, meta: `${car.type} ride` },
      { label: car.location, meta: 'Location' },
      { label: car.type, meta: 'Car type' },
    ]);

    const uniqueSuggestions = new Map<string, { label: string; meta: string }>();

    suggestions.forEach((suggestion) => {
      const key = suggestion.label.toLowerCase();
      if (key.includes(query) && !uniqueSuggestions.has(key)) {
        uniqueSuggestions.set(key, suggestion);
      }
    });

    return Array.from(uniqueSuggestions.values()).slice(0, 6);
  }, [cars, searchTerm]);

  const showSearchSuggestions = isSearchFocused && searchSuggestions.length > 0;

  return (
    <div className="min-h-screen bg-[#f7f5f0] dark:bg-slate-950 text-gray-950 dark:text-slate-100 transition-colors">
      <div className="relative overflow-hidden bg-gray-950">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=80"
            alt="Premium car ready for booking"
            className="h-full w-full object-cover opacity-45"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gray-950/55" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase text-amber-200 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Crafting Premium Rides in Bangladesh
            </div>
            <h1 className="mt-6 text-4xl md:text-6xl font-black leading-tight text-white">
              RydexGo
            </h1>
            <p className="mt-5 max-w-2xl text-base md:text-lg leading-8 text-gray-200">
              Discover polished, reliable cars for city drives, business trips, airport transfers, and weekend escapes across Bangladesh.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3 max-w-3xl">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white backdrop-blur">
              <ShieldCheck className="h-5 w-5 text-amber-300" />
              <span className="text-sm font-semibold">Verified fleet</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white backdrop-blur">
              <MapPin className="h-5 w-5 text-amber-300" />
              <span className="text-sm font-semibold">Bangladesh coverage</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white backdrop-blur">
              <SlidersHorizontal className="h-5 w-5 text-amber-300" />
              <span className="text-sm font-semibold">Easy booking</span>
            </div>
          </div>

          <div className="mt-10 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 flex flex-col md:flex-row gap-3 shadow-2xl shadow-gray-950/25">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by car name or location"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/25 text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <AnimatePresence>
                {showSearchSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl shadow-gray-950/20"
                  >
                    {searchSuggestions.map((suggestion) => (
                      <button
                        key={`${suggestion.meta}-${suggestion.label}`}
                        type="button"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          setSearchTerm(suggestion.label);
                          setIsSearchFocused(false);
                        }}
                        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="font-semibold text-gray-800 dark:text-slate-100">{suggestion.label}</span>
                        <span className="shrink-0 rounded-full bg-gray-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase text-gray-500 dark:text-slate-300">
                          {suggestion.meta}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="bg-gray-950 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <p className="text-xs font-black uppercase text-amber-700">Browse the fleet</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-black text-gray-950 dark:text-white">Available Cars</h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
              {filteredCars.length} premium rides found
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 shadow-sm border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 hover:shadow-md transition">
              <SlidersHorizontal className="h-4 w-4 text-amber-600" />
              <select
                className="bg-transparent text-sm focus:outline-none text-gray-700 dark:text-slate-100"
                value={filterType}
                onChange={(event) => setFilterType(event.target.value)}
              >
                {carTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-slate-900 shadow-sm border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 hover:shadow-md transition">
              <select
                className="bg-transparent text-sm focus:outline-none text-gray-700 dark:text-slate-100"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Low Price</option>
                <option value="price-high">High Price</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="h-10 w-10 animate-spin text-amber-600 mb-4" />
            <p className="text-gray-500 dark:text-slate-400">Loading cars...</p>
          </div>
        ) : filteredCars.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
            {filteredCars.map((car) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -18 }}
                transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.8 }}
                className="transition duration-300 hover:-translate-y-1"
              >
                <CarCard car={car} />
              </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700">
            <div className="mx-auto w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-4">
              <Search className="text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100">No Cars Found</h3>
            <p className="text-gray-500 dark:text-slate-400 mt-2">Try different filters or keywords</p>
          </div>
        )}
      </div>
    </div>
  );
}
