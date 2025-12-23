import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Icons } from '../dashboard/DashboardIcons';

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    const user = useAuthStore((state) => state.user);

    // Fallback if not loaded
    if (!user) return <div className="h-16 bg-white border-b border-gray-100" />;

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">

            {/* Left: Mobile Menu Trigger & Breadcrumbs */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    aria-label="Ouvrir le menu"
                    className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <Icons.Menu className="w-6 h-6" />
                </button>
                <div className="hidden sm:block">
                    {/* Placeholder for breadcrumbs or page title */}
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Aperçu</h2>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">

                {/* Quick Stats */}
                <div className="hidden md:flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🏆</span>
                        <span className="text-sm font-bold text-gray-900">{user.total_points} pts</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300" />
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🔥</span>
                        <span className="text-sm font-bold text-orange-600">{user.day_streak} Jours</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <button
                        aria-label="Notifications"
                        className="relative p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                        <Icons.Bell className="w-6 h-6" />
                    </button>

                    {/* Profile */}
                    <button
                        aria-label="Menu utilisateur"
                        className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all"
                    >
                        <img
                            src={user.avatar}
                            alt=""
                            loading="lazy"
                            aria-hidden="true"
                            className="w-8 h-8 rounded-full border border-white shadow-sm"
                        />
                        <span className="hidden md:block text-sm font-bold text-gray-700">{user.name.split(' ')[0]}</span>
                        <Icons.ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>
        </header>
    );
}
