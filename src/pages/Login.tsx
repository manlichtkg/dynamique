import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useAuthStore } from "../store/useAuthStore";
import api from "../lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../lib/schemas";
import { Loader2 } from "lucide-react";

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const { showToast } = useToast();

    async function onSubmit(data: LoginFormData) {
        try {
            const res = await api.post('/auth/login', data);
            login(res.data.user, res.data.token);
            showToast('Connexion réussie ! Ravie de vous revoir.', 'success');
            navigate('/dashboard');
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Erreur de connexion.';
            showToast(errorMessage, 'error');
        }
    }

    return (
        <section className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Left Panel - Image/Brand */}
                <div className="hidden md:flex md:w-1/2 bg-gray-900 p-12 text-white flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    <div className="relative z-10">
                        <Link to="/" className="text-2xl font-bold tracking-tight mb-2 block text-white hover:text-primary-light transition-colors">Ecole-Facile</Link>
                        <p className="opacity-90 max-w-xs">La plateforme d'apprentissage de nouvelle génération pour booster votre carrière.</p>
                    </div>
                    <div className="relative z-10">
                        <blockquote className="text-xl font-medium leading-relaxed italic mb-4 text-gray-100">
                            "L'éducation est l'arme la plus puissante qu'on puisse utiliser pour changer le monde."
                        </blockquote>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-0.5 bg-primary"></div>
                            <p className="text-sm opacity-90 font-bold uppercase tracking-wider">Nelson Mandela</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="text-center md:text-left mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">Bon te revoir !</h1>
                        <p className="text-gray-500">Saisissez vos identifiants pour accéder à votre compte.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">


                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                                <input
                                    type="email"
                                    {...register("email")}
                                    placeholder="exemple@email.com"
                                    className={`w-full pl-11 pr-4 py-3 rounded-lg border focus:ring-4 outline-none transition-all placeholder:text-gray-400 ${errors.email
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-200 focus:border-primary focus:ring-primary/10"
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                                <a href="#" className="text-xs text-primary hover:text-primary-dark font-medium">Mot de passe oublié ?</a>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                                <input
                                    type="password"
                                    {...register("password")}
                                    placeholder="••••••••"
                                    className={`w-full pl-11 pr-4 py-3 rounded-lg border focus:ring-4 outline-none transition-all placeholder:text-gray-400 ${errors.password
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-200 focus:border-primary focus:ring-primary/10"
                                        }`}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Connexion...
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-white text-gray-500">Ou se connecter avec</span>
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

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Pas encore de compte ?{' '}
                        <Link to="/register" className="text-primary hover:underline font-bold">
                            Créer un compte
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
