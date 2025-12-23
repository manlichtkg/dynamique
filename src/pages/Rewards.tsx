import React from 'react';
import { Icons } from '../components/dashboard/DashboardIcons';

export default function Rewards() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-display text-gray-900">Mes Récompenses</h1>
                <p className="text-gray-500">Célébrez vos réussites !</p>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center opacity-50">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl grayscale">
                            🏆
                        </div>
                        <h3 className="font-bold text-gray-900">Succès Verrouillé</h3>
                        <p className="text-sm text-gray-500 mt-1">Continuez à apprendre pour débloquer.</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
