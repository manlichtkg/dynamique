import React from 'react';

export default function About() {
    return (
        <div className="container mx-auto px-6 py-20 text-center">
            <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">À Propos</h1>
            <p className="text-xl text-gray-600">Notre mission : Rendre l'éducation accessible et ludique.</p>
            <div className="mt-12 p-12 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
                <span className="text-4xl">👋</span>
                <p className="mt-4 text-gray-500 font-medium">L'histoire de notre équipe...</p>
            </div>
        </div>
    );
}
