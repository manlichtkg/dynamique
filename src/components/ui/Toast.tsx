import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColors = {
        success: 'bg-white border-lime-500 text-gray-900', // Modern look
        error: 'bg-white border-red-500 text-gray-900',
        info: 'bg-white border-blue-500 text-gray-900',
        warning: 'bg-white border-yellow-500 text-gray-900',
    };

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️',
    };

    return createPortal(
        <div className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 transition-all duration-300 transform font-medium",
            bgColors[type],
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
            <span className="text-xl">{icons[type]}</span>
            <p>{message}</p>
        </div>,
        document.body
    );
}
