import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <header className="relative bg-white text-gray-900 overflow-hidden border-b border-gray-100">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      {/* Visible on focus skip link */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-primary-dark focus:px-3 focus:py-2 rounded-md ring-2 ring-primary"
      >
        Skip to content
      </a>

      <div className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="inline-block px-4 py-1.5 bg-primary/10 text-primary-dark rounded-full text-sm font-semibold mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s' }}>
            Nouveau : Soutien scolaire personnalisé 🎓
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-gray-900 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
            Réussissez vos{' '}
            <span className="text-primary relative inline-block">
              examens
              {/* Underline decoration */}
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>{' '}
            avec confiance
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s' }}>
            Des cours interactifs, des exercices corrigés et des professeurs dédiés
            pour le collège et le lycée.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-dark hover:shadow-xl hover:-translate-y-1 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30"
            >
              Commencer gratuitement
            </Link>
            <Link
              to="/formation"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-xl font-bold text-lg hover:border-primary/50 hover:text-primary hover:-translate-y-1 transition-all focus:outline-none focus:ring-4 focus:ring-gray-100"
              aria-label="Voir les matières"
            >
              📚 Voir les matières
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
