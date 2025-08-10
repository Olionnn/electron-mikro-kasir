// src/layouts/ShellLayout.jsx
import React, { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar"; 
import { NavbarProvider, useNavbarContext } from "../hooks/useNavbar";

function ShellInner() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  const { config } = useNavbarContext();

  const navbarProps = useMemo(
    () => ({ ...config, onToggleSidebar: toggleSidebar }),
    [config, toggleSidebar]
  );

  return (
    <div className="relative flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar {...navbarProps} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-40"
        />
      )}
    </div>
  );
}

export default function ShellLayout() {
  return (
    <NavbarProvider>
      <ShellInner />
    </NavbarProvider>
  );
}