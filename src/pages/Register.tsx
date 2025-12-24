import React from "react";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
    const leftImg = "https://www.figma.com/api/mcp/asset/ebeaa64d-e447-4c59-ba00-3af30920f891";

    return (
        <section className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
                {/* Left Panel - Hero */}
                <div className="hidden md:flex md:w-5/12 bg-gray-900 relative flex-col justify-end p-12 text-white">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1513258496098-3f1b4e7d02ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    <div className="relative z-10 space-y-4">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">🎓</span>
                        </div>
                        <h2 className="text-3xl font-bold font-display leading-tight">
                            Commencez votre voyage d'apprentissage aujourd'hui.
                        </h2>
                        <ul className="space-y-2 opacity-90 text-sm">
                            <li className="flex items-center gap-2">✓ Accès illimité à 1000+ cours</li>
                            <li className="flex items-center gap-2">✓ Certificats reconnus</li>
                            <li className="flex items-center gap-2">✓ Communauté active</li>
                        </ul>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto">
                    <div className="max-w-md mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">Créer un compte</h1>
                            <p className="text-gray-500">Rejoignez gratuitement notre communauté d'apprenants.</p>
                        </div>
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
