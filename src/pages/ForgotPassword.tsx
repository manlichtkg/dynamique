import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "../context/ToastContext";
import api from "../lib/api";
import { Loader2, ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
    email: z.string().email("Email invalide"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema)
    });
    const { showToast } = useToast();

    async function onSubmit(data: ForgotPasswordForm) {
        try {
            await api.post('/auth/forgot-password', data);
            showToast("Si cet email existe, vous recevrez un lien de réinitialisation.", "success");
        } catch (error) {
            showToast("Une erreur est survenue.", "error");
        }
    }

    return (
        <section className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <Link to="/login" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la connexion
                </Link>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🔑</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié ?</h1>
                    <p className="text-gray-500 text-sm">Entrez votre email pour recevoir les instructions de réinitialisation.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="exemple@email.com"
                            className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${errors.email ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-primary focus:ring-primary/10"
                                } focus:ring-4`}
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer le lien"}
                    </button>
                </form>
            </div>
        </section>
    );
}
