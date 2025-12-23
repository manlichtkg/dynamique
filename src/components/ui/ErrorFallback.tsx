import React from 'react';
import { Button } from './Button';

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">💥</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Oups ! Une erreur est survenue.</h2>
                <p className="text-gray-500 mb-6 text-sm">
                    {error.message || "Quelque chose s'est mal passé. Ne vous inquiétez pas, nos écureuils sont sur le coup."}
                </p>

                {/* Dev details - Hidden in prod usually, but useful for prototype */}
                {process.env.NODE_ENV === 'development' && (
                    <pre className="bg-gray-100 p-4 rounded-lg text-xs text-left overflow-auto max-h-40 mb-6 text-red-600 font-mono">
                        {error.stack}
                    </pre>
                )}

                <Button onClick={resetErrorBoundary} size="lg" className="w-full">
                    Réessayer
                </Button>
            </div>
        </div>
    );
};
