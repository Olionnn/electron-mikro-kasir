import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavbarAdmin from '../../component/NavbarAdmin';
import Sidebar from '../../component/Sidebar';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Map pathname to page name
    const getPageName = (pathname) => {
        const pageMap = {
            '/dashboard': 'Dashboard',
            '/management':'Management',
            '/barang-jasa': 'Barang & Jasa',
            '/pos': 'Transaksi',
            '/pembelian-supplier': 'Pembelian',
        };
        return pageMap[pathname] || 'Unknown Page';
    };

    const pageName = getPageName(location.pathname);

    return (
        <div className="relative flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <NavbarAdmin toggleSidebar={toggleSidebar} pageName={pageName} />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
            {sidebarOpen && (
                <div 
                    onClick={toggleSidebar} 
                    className="fixed inset-0 bg-black opacity-50 z-40"
                ></div>
            )}
        </div>
    );
}