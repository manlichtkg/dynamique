import React, { useState } from 'react';

// Custom Toggle Component (Figma Style)
const Toggle = ({ label, checked, onChange }: { label: string, checked?: boolean, onChange?: () => void }) => {
    const [isOn, setIsOn] = useState(checked || false);

    const handleToggle = () => {
        setIsOn(!isOn);
        if (onChange) onChange();
    };

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 group cursor-pointer" onClick={handleToggle}>
            <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{label}</span>
            <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${isOn ? 'bg-primary' : 'bg-gray-300'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isOn ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
        </div>
    );
};

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profil');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const tabs = [
        { id: 'profil', icon: '👤', label: 'Mon Profil' },
        { id: 'securite', icon: '🔒', label: 'Sécurité' },
        { id: 'notifications', icon: '🔔', label: 'Notifications' },
        { id: 'facturation', icon: '💳', label: 'Abonnement' }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-8 md:py-12 font-sans">
            <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-display tracking-tight">Paramètres</h1>

                    {/* Mobile Tab Toggle */}
                    <button
                        className="md:hidden px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold shadow-sm"
                        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {tabs.find(t => t.id === activeTab)?.label} ▼
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    {/* Sidebar Navigation */}
                    <nav className={`
                        w-full md:w-72 flex-shrink-0 space-y-2
                        ${isMobileMenuOpen ? 'block' : 'hidden md:block'}
                    `}>
                        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-3 border border-gray-100/50 backdrop-blur-xl">
                            {tabs.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-5 py-3.5 rounded-xl flex items-center gap-4 transition-all duration-200 group ${activeTab === item.id
                                        ? 'bg-lime-50 text-primary font-bold shadow-sm ring-1 ring-primary/10'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                                        }`}
                                >
                                    <span className={`text-xl transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                                    {item.label}
                                    {activeTab === item.id && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Quick Status Card */}
                        <div className="bg-primary/5 rounded-2xl p-6 mt-6 border border-primary/10 hidden md:block">
                            <h4 className="font-bold text-primary mb-2 text-sm uppercase tracking-wider">Statut</h4>
                            <div className="flex items-center gap-2 text-gray-900 font-bold">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                En ligne
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Dernière connexion: Aujourd'hui</p>
                        </div>
                    </nav>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-10 border border-gray-100/50 relative overflow-hidden">
                            {/* Decorative Top Gradient */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>

                            {activeTab === 'profil' && (
                                <div className="space-y-10 animate-fade-in">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 pb-8 border-b border-gray-50">
                                        <div className="relative group">
                                            <div className="w-28 h-28 bg-gray-100 rounded-full overflow-hidden border-[6px] border-white shadow-2xl shadow-gray-200">
                                                <img src="https://i.pravatar.cc/300?img=32" alt="Avatar" className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" />
                                            </div>
                                            <button className="absolute bottom-2 right-0 bg-white text-gray-700 p-2 rounded-full shadow-lg border border-gray-100 hover:text-primary transition-colors hover:scale-110 transform duration-200">
                                                📷
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-1">Jane Doe</h2>
                                            <p className="text-gray-500 font-medium">Élève • 4ème B</p>
                                            <div className="flex gap-3 mt-4">
                                                <span className="px-3 py-1 bg-lime-50 text-primary text-xs font-bold rounded-full border border-primary/20">PREMIUM</span>
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">Level 5</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Prénom</label>
                                            <input
                                                type="text"
                                                defaultValue="Jane"
                                                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 font-medium shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all duration-200 p-3.5"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Nom</label>
                                            <input
                                                type="text"
                                                defaultValue="Doe"
                                                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 font-medium shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all duration-200 p-3.5"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Email</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                                                <input
                                                    type="email"
                                                    defaultValue="jane.doe@example.com"
                                                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 font-medium shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all duration-200 p-3.5 pl-11"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Bio</label>
                                            <textarea
                                                rows={4}
                                                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 font-medium shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all duration-200 p-3.5 resize-none"
                                                defaultValue="Passionnée par le développement web et le design d'interface."
                                            />
                                            <p className="text-xs text-gray-400 text-right">0/150 caractères</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 flex justify-end border-t border-gray-50">
                                        <button className="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                                            <span>💾</span> Enregistrer
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'securite' && (
                                <div className="space-y-10 animate-fade-in">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Sécurité</h2>
                                        <p className="text-gray-500">Gérez votre mot de passe et l'accès à votre compte.</p>
                                    </div>

                                    <div className="space-y-6 max-w-lg">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Mot de passe actuel</label>
                                            <input type="password" className="block w-full rounded-xl border-gray-200 bg-gray-50/50 font-medium shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all duration-200 p-3.5" placeholder="••••••••" />
                                        </div>

                                        <div className="p-1 bg-gray-50 rounded-xl space-y-4"></div> {/* Spacer */}

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Nouveau mot de passe</label>
                                            <input type="password" className="block w-full rounded-xl border-gray-200 bg-gray-50/50 font-medium shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all duration-200 p-3.5" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Confirmer</label>
                                            <input type="password" className="block w-full rounded-xl border-gray-200 bg-gray-50/50 font-medium shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all duration-200 p-3.5" />
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 flex items-start gap-4">
                                        <span className="text-2xl">🛡️</span>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Authentification à deux facteurs</h4>
                                            <p className="text-sm text-gray-600 mt-1">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
                                            <button className="text-primary font-bold text-sm mt-3 hover:underline">Activer la 2FA →</button>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button className="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-md">
                                            Mettre à jour
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-8 animate-fade-in">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Préférences</h2>
                                        <p className="text-gray-500">Choisissez comment nous pouvons vous contacter.</p>
                                    </div>

                                    <div className="divide-y divide-gray-100">
                                        <div className="py-2">
                                            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Email</h3>
                                            <Toggle label="Nouveaux cours disponibles" checked={true} />
                                            <Toggle label="Réponses à mes questions" checked={true} />
                                            <Toggle label="Résumé hebdomadaire" checked={false} />
                                            <Toggle label="Offres promotionnelles" checked={false} />
                                        </div>

                                        <div className="py-6">
                                            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Push Mobile</h3>
                                            <Toggle label="Rappels d'exercices" checked={true} />
                                            <Toggle label="Mentions" checked={true} />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/30">
                                            Enregistrer
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'facturation' && (
                                <div className="text-center py-20 animate-fade-in">
                                    <div className="w-24 h-24 bg-gradient-to-br from-lime-100 to-green-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 text-primary shadow-inner">💳</div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-3 font-display">Abonnement Premium</h3>
                                    <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
                                        Votre abonnement est actif. Prochain renouvellement le <strong className="text-gray-900">31/12/2025</strong>.
                                    </p>
                                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                                        <button className="px-8 py-3.5 bg-white border-2 border-gray-100 rounded-xl text-gray-700 font-bold hover:border-gray-300 hover:bg-gray-50 transition-all">
                                            L'historique
                                        </button>
                                        <button className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                                            Gérer mon plan
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
