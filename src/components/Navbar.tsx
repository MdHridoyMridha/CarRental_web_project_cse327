import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Car, LogOut, LayoutDashboard, Settings, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../services/ThemeContext';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav className="bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50 shadow-sm shadow-gray-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gray-950 dark:bg-amber-500 p-1.5 rounded-lg shadow-sm">
              <Car className="h-6 w-6 text-white dark:text-gray-950" />
            </div>
            <div className="leading-tight">
              <span className="block text-xl font-black text-gray-950 dark:text-white tracking-tight">RydexGo</span>
              <span className="hidden sm:block text-[10px] font-bold uppercase text-amber-600">Premium rides in Bangladesh</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-semibold text-gray-600 dark:text-slate-300 hover:text-amber-600 transition-colors">Browse Cars</Link>
            {user && (
              <Link to="/dashboard" className="text-sm font-semibold text-gray-600 dark:text-slate-300 hover:text-amber-600 transition-colors">My Bookings</Link>
            )}
            {(profile?.is_admin || user?.email === 'hridoyhs369@gmail.com') && (
              <Link to="/admin" className="text-sm font-semibold text-gray-600 dark:text-slate-300 hover:text-amber-600 transition-colors flex items-center">
                <Settings className="h-4 w-4 mr-1" />
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-200 hidden sm:block">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors hidden md:block"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-600 dark:text-slate-300 hover:text-amber-600 transition-colors hidden md:block"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?signup=true"
                  className="bg-gray-950 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-all shadow-sm hidden md:block"
                >
                  Get Started
                </Link>
              </div>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-amber-300 hover:border-amber-400 hover:text-amber-600 transition-all"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-gray-100 transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 animate-in slide-in-from-top-2">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-4 text-base font-bold text-gray-700 dark:text-slate-200 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-900 rounded-xl transition-all"
            >
              Browse Cars
            </Link>
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-bold text-gray-700 dark:text-slate-200 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-900 rounded-xl transition-all"
              >
                My Bookings
              </Link>
            )}
            {(profile?.is_admin || user?.email === 'hridoyhs369@gmail.com') && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-bold text-gray-700 dark:text-slate-200 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-900 rounded-xl transition-all flex items-center"
              >
                <Settings className="h-5 w-5 mr-2" />
                Admin Panel
              </Link>
            )}

            <div className="pt-4 mt-4 border-t border-gray-100">
              {user ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-4 text-base font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center px-4 py-3 text-sm font-bold text-gray-700 dark:text-slate-200 bg-gray-50 dark:bg-slate-900 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login?signup=true"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-gray-950 rounded-xl hover:bg-amber-600 transition-all shadow-md shadow-gray-100"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 px-6 py-3 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link to="/" className="flex flex-col items-center space-y-1 group">
            <div className="p-2 rounded-xl group-hover:bg-amber-50 transition-colors">
              <Car className="h-6 w-6 text-gray-950" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Browse</span>
          </Link>

          {user && (
            <Link to="/dashboard" className="flex flex-col items-center space-y-1 group">
              <div className="p-2 rounded-xl group-hover:bg-amber-50 transition-colors">
                <LayoutDashboard className="h-6 w-6 text-gray-950 dark:text-amber-300" />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bookings</span>
            </Link>
          )}

          {(profile?.is_admin || user?.email === 'hridoyhs369@gmail.com') && (
            <Link to="/admin" className="flex flex-col items-center space-y-1 group">
              <div className="p-2 rounded-xl group-hover:bg-amber-50 transition-colors">
                <Settings className="h-6 w-6 text-gray-950 dark:text-amber-300" />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Admin</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
