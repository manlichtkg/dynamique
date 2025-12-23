import React, { ImgHTMLAttributes, useState } from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fallback?: string;
}

export const Avatar = ({ className, src, alt, size = 'md', fallback, ...props }: AvatarProps) => {
    const [error, setError] = useState(false);

    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-14 h-14 text-base",
        xl: "w-20 h-20 text-xl",
    };

    if (error || !src) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-bold uppercase",
                    sizes[size],
                    className
                )}
            >
                {fallback || alt?.slice(0, 2) || "??"}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            onError={() => setError(true)}
            className={cn(
                "object-cover rounded-full border-2 border-white shadow-soft-sm",
                sizes[size],
                className
            )}
            {...props}
        />
    );
};
