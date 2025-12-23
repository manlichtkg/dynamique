import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../img/logo.jpg';
import { Button } from '../ui/Button';

export default function PublicHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img src={logo} alt="Ecole-Facile" className="w-10 h-10 object-cover rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300" />
                    <span className={`text-xl font-bold font-display tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>
                        Ecole-Facile
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Accueil</Link>
                    <Link to="/features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Fonctionnalités</Link>
                    <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Tarifs</Link>
                    <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">À propos</Link>
                </nav>

                {/* Auth Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/login">
                        <Button variant="ghost" size="sm">Connexion</Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="solid" size="sm">S'inscrire</Button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-gray-600"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg p-6 flex flex-col gap-4 animate-fade-in">
                    <Link to="/" className="text-lg font-medium text-gray-900" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
                    <Link to="/features" className="text-lg font-medium text-gray-900" onClick={() => setMobileMenuOpen(false)}>Fonctionnalités</Link>
                    <Link to="/pricing" className="text-lg font-medium text-gray-900" onClick={() => setMobileMenuOpen(false)}>Tarifs</Link>
                    <hr className="border-gray-100" />
                    <div className="flex flex-col gap-3">
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full justify-center">Connexion</Button>
                        </Link>
                        <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="solid" className="w-full justify-center">Commencer gratuitement</Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
