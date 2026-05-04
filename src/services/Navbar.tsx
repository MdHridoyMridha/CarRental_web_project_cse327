import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LogOut, User, Car } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-indigo-600">
            <Car className="h-7 w-7" />
            RydexGo
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Home
            </Link>
            
            {user && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                  My Bookings
                </Link>
              </>
            )}

            {user?.email === 'hridoyhs369@gmail.com' && (
              <Link to="/admin" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-2xl">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.email?.split('@')[0]}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
