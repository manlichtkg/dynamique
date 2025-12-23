import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/layout/DashboardHeader';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50/50 font-sans selection:bg-primary/20">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
                <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 md:p-8 animate-fade-in relative z-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
