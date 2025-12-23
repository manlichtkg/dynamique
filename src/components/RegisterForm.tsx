import React, { useState } from "react";

export default function RegisterForm() {
    const [form, setForm] = useState({ name: '', email: '', password: '', password2: '', agree: false });
    const [errors, setErrors] = useState<any>({});

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    }

    function validate() {
        const errs: any = {};
        if (!form.name) errs.name = 'Veuillez saisir votre nom complet.';
        if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Email invalide.';
        if (!form.password || form.password.length < 8) errs.password = 'Mot de passe trop court.';
        if (form.password !== form.password2) errs.password2 = 'Les mots de passe ne correspondent pas.';
        if (!form.agree) errs.agree = "Vous devez accepter les conditions.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        // Simulate API call
        console.log("Registered", form);
        alert("Inscription réussie (simulée)");
    }

    return (
        <form onSubmit={handleSubmit} noValidate aria-label="Formulaire d'inscription" className="flex flex-col gap-5">
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Nom complet</label>
                    <div className="relative">
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Jean Dupont"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        />
                    </div>
                    {errors.name && <div className="text-red-600 text-xs flex items-center gap-1"><span>⚠️</span>{errors.name}</div>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="exemple@email.com"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        />
                    </div>
                    {errors.email && <div className="text-red-600 text-xs flex items-center gap-1"><span>⚠️</span>{errors.email}</div>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                        <div className="relative">
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="8+ caractères"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            />
                        </div>
                        {errors.password && <div className="text-red-600 text-xs flex items-center gap-1"><span>⚠️</span>{errors.password}</div>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Confirmation</label>
                        <div className="relative">
                            <input
                                name="password2"
                                type="password"
                                value={form.password2}
                                onChange={handleChange}
                                placeholder="Répétez"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            />
                        </div>
                        {errors.password2 && <div className="text-red-600 text-xs flex items-center gap-1"><span>⚠️</span>{errors.password2}</div>}
                    </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer py-2">
                    <input
                        name="agree"
                        type="checkbox"
                        checked={form.agree}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-600">
                        J'accepte les <a href="#" className="text-primary hover:underline font-medium">conditions d'utilisation</a> et la <a href="#" className="text-primary hover:underline font-medium">politique de confidentialité</a>
                    </span>
                </label>
                {errors.agree && <div className="text-red-600 text-xs">{errors.agree}</div>}
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all mt-2">
                Créer mon compte
            </button>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou s'inscrire avec</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <button type="button" className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all">
                    <span className="sr-only">Google</span>
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                </button>
                <button type="button" className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-700 font-bold">f</button>
                <button type="button" className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-700 font-bold">in</button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
                Déjà inscrit ? <a href="/login" className="text-primary hover:underline font-bold">Connectez-vous</a>
            </p>
        </form>
    )
}
