import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import api from "../lib/api";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        api.post('/auth/verify-email', { token })
            .then(() => setStatus('success'))
            .catch(() => setStatus('error'));
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-bold">Vérification en cours...</h2>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Email vérifié !</h2>
                        <p className="text-gray-500 mb-6">Votre compte est désormais actif.</p>
                        <Link to="/login" className="block w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark">
                            Se connecter
                        </Link>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Lien invalide</h2>
                        <p className="text-gray-500 mb-6">Ce lien a expiré ou est invalide.</p>
                        <Link to="/login" className="text-primary hover:underline font-bold">
                            Retour à la connexion
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
