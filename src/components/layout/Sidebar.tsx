import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../img/logo.jpg';
import { Icons } from '../dashboard/DashboardIcons';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();

    const navItems = [
        { label: 'Tableau de bord', path: '/dashboard', icon: Icons.Layout },
        { label: 'Mes cours', path: '/formation', icon: Icons.Book },
        { label: 'Communauté', path: '/community', icon: Icons.Users },
        { label: 'Récompenses', path: '/rewards', icon: Icons.Trophy },
        { label: 'Paramètres', path: '/settings', icon: Icons.Settings },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-50 transition-transform duration-300 transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-gray-50">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <img src={logo} alt="Ecole-Facile" className="w-8 h-8 rounded-lg" />
                        <span className="font-bold font-display text-gray-900 text-lg">Ecole-Facile</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-primary/10 text-primary-700 font-bold shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                <span>{item.label}</span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-50">
                    <button
                        onClick={() => window.location.href = '/login'} // Simple redirect/mock logic
                        aria-label="Se déconnecter"
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold"
                    >
                        <Icons.LogOut className="w-5 h-5 opacity-70" aria-hidden="true" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
