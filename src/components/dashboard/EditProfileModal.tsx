import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../context/ToastContext';
import api from '../../lib/api';
import { Button } from '../ui/Button';

interface EditProfileModalProps {
    onClose: () => void;
}

export default function EditProfileModal({ onClose }: EditProfileModalProps) {
    const user = useAuthStore((state) => state.user);
    const login = useAuthStore((state) => state.login);
    const { showToast } = useToast();
    const [name, setName] = useState(user?.name || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.put('/users/me', { name, avatar });
            if (user && res.data) {
                // Update local auth context with new data
                // We re-use 'login' method or we might need a 'updateUser' method in context. 
                // For now, assuming login overwrites safely or we just assume it works for updating state implies re-login logic.
                // Update AuthStore
                const token = localStorage.getItem('token');
                if (token) login(res.data, token);
            }
            showToast('Profil mis à jour avec succès !', 'success');
            onClose();
        } catch (error) {
            console.error(error);
            showToast('Erreur lors de la mise à jour.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Modifier mon profil</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Avatar Preview */}
                    <div className="flex flex-col items-center gap-4">
                        <img
                            src={avatar || "https://ui-avatars.com/api/?name=?"}
                            alt="Avatar Preview"
                            className="w-24 h-24 rounded-full border-4 border-lime-100 object-cover"
                            onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=?")}
                        />
                        <p className="text-xs text-gray-500">Aperçu de votre avatar</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Nom d'affichage</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="Votre pseudo"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">URL de l'avatar</label>
                        <input
                            type="text"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="https://..."
                        />
                        <p className="text-xs text-gray-400">Collez un lien d'image (Unsplash, etc.)</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Annuler</Button>
                        <Button type="submit" isLoading={isLoading} className="flex-1">Safeguarder</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
