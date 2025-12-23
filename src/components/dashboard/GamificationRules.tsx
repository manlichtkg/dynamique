import React from 'react';

export default function GamificationRules({ onClose }: { onClose: () => void }) {
    const rules = [
        {
            icon: '📘',
            title: 'Apprendre',
            desc: 'Gagnez 50 XP pour chaque leçon terminée et 100 XP pour un quiz réussi.',
            color: 'bg-blue-50 text-blue-600 border-blue-100',
        },
        {
            icon: '🔥',
            title: 'Persévérer',
            desc: 'Connectez-vous chaque jour pour augmenter votre série et gagner un bonus.',
            color: 'bg-orange-50 text-orange-600 border-orange-100',
        },
        {
            icon: '🏅',
            title: 'Collectionner',
            desc: 'Débloquez des badges uniques en relevant des défis spéciaux.',
            color: 'bg-purple-50 text-purple-600 border-purple-100',
        },
        {
            icon: '🏆',
            title: 'Triompher',
            desc: 'Grimpez dans le classement mensuel pour gagner des prix exclusifs.',
            color: 'bg-yellow-50 text-yellow-600 border-yellow-100',
        },
    ];

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="text-center mb-10">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-3 uppercase tracking-wider">Guide du joueur</span>
                <h2 className="text-2xl font-bold text-gray-900">Comment devenir un Sage ?</h2>
                <p className="text-gray-500 mt-2">Maîtrisez les règles pour progresser plus vite.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {rules.map((rule, idx) => (
                    <div key={idx} className={`p-6 rounded-2xl border ${rule.color} transition-transform hover:-translate-y-1`}>
                        <div className="text-4xl mb-4">{rule.icon}</div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900">{rule.title}</h3>
                        <p className="text-sm opacity-80 font-medium leading-relaxed">{rule.desc}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <button onClick={onClose} className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">masquer le guide</button>
            </div>
        </div>
    );
}
