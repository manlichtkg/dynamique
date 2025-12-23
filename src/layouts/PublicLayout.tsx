import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from '../components/layout/PublicHeader';
import Footer from '../components/layout/Footer';

export default function PublicLayout() {
    return (
        <div className="flex flex-col min-h-screen font-sans bg-white selection:bg-primary/20">
            <PublicHeader />
            <main className="flex-1 pt-20">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
