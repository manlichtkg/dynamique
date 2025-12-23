import React, { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
    size?: 'sm' | 'md';
    children?: React.ReactNode;
}

export const Badge = ({ className, variant = 'primary', size = 'md', ...props }: BadgeProps) => {
    const variants = {
        primary: "bg-primary/10 text-primary-700 border-primary/20",
        secondary: "bg-secondary/10 text-secondary-700 border-secondary/20",
        accent: "bg-accent/10 text-accent-700 border-accent/20",
        outline: "bg-transparent border-gray-200 text-gray-600",
        ghost: "bg-gray-100 text-gray-600 border-transparent",
        success: "bg-green-50 text-green-700 border-green-200",
        warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
        error: "bg-red-50 text-red-700 border-red-200",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center justify-center font-bold rounded-full border",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
};
