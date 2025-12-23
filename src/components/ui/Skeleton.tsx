import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: string | number;
    height?: string | number;
    circle?: boolean;
}

export const Skeleton = ({ className, width, height, circle, style, ...props }: SkeletonProps) => {
    return (
        <div
            className={cn(
                "bg-gray-200 animate-pulse",
                circle ? "rounded-full" : "rounded-md",
                className
            )}
            style={{
                width,
                height,
                ...style
            }}
            {...props}
        />
    );
};
