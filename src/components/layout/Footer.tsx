import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../img/logo.jpg';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t-4 border-primary text-gray-400 py-16 mt-20 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 text-white group">
              <img src={logo} alt="Ecole-Facile" className="w-10 h-10 object-contain rounded-xl shadow-lg shadow-white/10 group-hover:scale-105 transition-transform" />
              <span className="text-2xl font-bold font-display tracking-tight">Ecole-Facile</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              La plateforme éducative qui récompense votre curiosité. Apprenez, gagnez des points, et devenez un maître de la connaissance.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Social Placeholders */}
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">🐦</a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-all">📘</a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all">📸</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Navigation</h4>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Tableau de bord</Link></li>
              <li><Link to="/formation" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Catalogue des cours</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Tarifs</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">À propos</Link></li>
            </ul>
          </div>

          {/* Gamification Info */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Gamification</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-accent transition-colors hover:translate-x-1 inline-block">Comment gagner des points ?</a></li>
              <li><a href="#" className="hover:text-accent transition-colors hover:translate-x-1 inline-block">Niveaux et Badges</a></li>
              <li><a href="#" className="hover:text-accent transition-colors hover:translate-x-1 inline-block">Classement mensuel</a></li>
              <li><a href="#" className="hover:text-accent transition-colors hover:translate-x-1 inline-block">Boutique de récompenses</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Restez connecté</h4>
            <p className="text-sm mb-4">Recevez nos astuces pour progresser plus vite.</p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="votre@email.com"
                className="bg-gray-800 borderborder-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none text-white w-full transition-all"
              />
              <button className="px-4 py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/25">
                Rejoindre la communauté
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
          <p>© {new Date().getFullYear()} Ecole-Facile. Fait avec ❤️ pour l'éducation.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link to="/terms" className="hover:text-white transition-colors">CGU</Link>
            <Link to="/legal" className="hover:text-white transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
