import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../img/logo.jpg';
import { useAuthStore } from '../../store/useAuthStore';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Lock scroll when mobile menu is open
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = () => setIsProfileOpen(false);
    if (isProfileOpen) {
      window.addEventListener('click', closeDropdown);
    }
    return () => window.removeEventListener('click', closeDropdown);
  }, [isProfileOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Ecole-Facile" className="w-11 h-11 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300" />
          <span className="text-lg md:text-xl font-bold text-gray-900 tracking-tight group-hover:text-primary transition-colors">Ecole-Facile</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/dashboard' ? 'text-primary font-bold' : 'text-gray-600'}`}>Tableau de bord</Link>
          <Link to="/formation" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname.includes('/formation') ? 'text-primary font-bold' : 'text-gray-600'}`}>Formations</Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Gamification Stats (Desktop) */}
              <div className="hidden md:flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 border-r border-gray-200 pr-3">
                  <span className="text-base">🏆</span>
                  <span>{user?.total_points || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
                  <span className="text-base">🔥</span>
                  <span>{user?.day_streak || 0} jours</span>
                </div>
              </div>

              {/* Notification Icon */}
              <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }}
                  className="flex items-center gap-2 focus:outline-none group"
                >
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:shadow-md transition-all sm:w-11 sm:h-11" />
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-bold text-gray-900 leading-none">{user?.name || 'Utilisateur'}</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-1">{user?.title || 'Apprenti'}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-200 origin-top-right ${isProfileOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                  <div className="p-4 border-b border-gray-50 lg:hidden">
                    <p className="font-bold text-gray-900">{user?.name || 'Utilisateur'}</p>
                    <p className="text-xs text-gray-500">{user?.title || 'Apprenti'}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                      <span>📊</span> Tableau de bord
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                      <span>⚙️</span> Paramètres
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left">
                      <span>🚪</span> Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Connexion</Link>
              <Link to="/register" className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full transition-all shadow-md hover:bg-primary-dark hover:shadow-lg hover:-translate-y-0.5">
                Rejoindre
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="md:hidden p-2 rounded-lg text-gray-900 bg-gray-100 active:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Overlay Menu */}
        <div className={`fixed inset-0 z-[60] bg-white/98 backdrop-blur-xl flex flex-col transition-all duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="p-6 flex justify-end">
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
            {isAuthenticated && (
              <div className="flex gap-4 mb-4">
                <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-2xl border border-yellow-100 w-32">
                  <span className="text-2xl">🏆</span>
                  <span className="font-bold text-gray-900 mt-1">{user?.total_points || 0}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Points</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-orange-50 rounded-2xl border border-orange-100 w-32">
                  <span className="text-2xl">🔥</span>
                  <span className="font-bold text-gray-900 mt-1">{user?.day_streak || 0}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Série</span>
                </div>
              </div>
            )}

            <nav className="flex flex-col items-center gap-6 text-xl font-display">
              <Link to="/dashboard" onClick={() => setOpen(false)} className="font-bold text-gray-900 hover:text-primary transition-colors">Tableau de bord</Link>
              <Link to="/formation" onClick={() => setOpen(false)} className="font-bold text-gray-900 hover:text-primary transition-colors">Formations</Link>
              <Link to="/settings" onClick={() => setOpen(false)} className="font-bold text-gray-900 hover:text-primary transition-colors">Paramètres</Link>
            </nav>

            {!isAuthenticated && (
              <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-xs">
                <Link to="/login" onClick={() => setOpen(false)} className="w-full text-center px-6 py-4 rounded-xl border-2 border-gray-100 text-gray-900 font-bold hover:border-primary/30 hover:bg-primary/5 transition-all">Connexion</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="w-full text-center px-6 py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform">Rejoindre</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
