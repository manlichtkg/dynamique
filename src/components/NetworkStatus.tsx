import React, { useEffect, useState } from 'react';
import { CloudOff } from 'lucide-react';
import api from '../lib/api';

export default function NetworkStatus() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Listen for custom API errors dispatch from api.ts
        const handleApiError = (e: any) => {
            if (e.detail?.type === 'network') {
                setIsOffline(true);
            }
        };

        window.addEventListener('api-error', handleApiError);

        // Periodically check health if offline (to auto-recover)
        const checkHealth = async () => {
            if (!isOffline) return;
            try {
                await api.get('/health');
                setIsOffline(false); // Recovered
            } catch (err) {
                // Still offline
            }
        };

        const interval = setInterval(checkHealth, 5000);

        return () => {
            window.removeEventListener('api-error', handleApiError);
            clearInterval(interval);
        };
    }, [isOffline]);

    if (!isOffline) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-bounce-in">
            <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                <CloudOff className="w-5 h-5" />
                <div>
                    <h4 className="font-bold text-sm">Serveur hors ligne</h4>
                    <p className="text-xs opacity-90">Tentative de reconnexion...</p>
                </div>
            </div>
        </div>
    );
}
