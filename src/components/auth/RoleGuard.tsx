import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface RoleGuardProps {
    allowedRoles: string[];
}

export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Default to 'user' role if not specified
    const userRole = (user as any).role || 'user';

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />; // Redirect unauthorized users
    }

    return <Outlet />;
}
