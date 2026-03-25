import React, { useState } from "react";
import Sidebar from "./Layout/Sidebar";
import DashboardStats from "./DashboardStats";
import UsersManager from "./UsersManager";
import RolesManager from "./RolesManager";
import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { currentUser, userRole } = useAuth();

  // Mapping activeTab to the corresponding component
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardStats />;
      case "usuarios":
        return <UsersManager />;
      case "roles":
        return <RolesManager />;
      default:
        // Placeholder for tabs not yet implemented
        return (
          <div className="flexflex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/50 p-12 text-center border-dashed border-2 border-slate-100">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">
              Módulo en Desarrollo
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              La sección que estás intentando ver "{activeTab}" estará
              disponible en próximas versiones del sistema.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar component handles both mobile overlay and desktop sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main column */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white shadow-sm z-30 shrink-0">
          <button
            type="button"
            className="text-slate-500 hover:text-slate-700 lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-50 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Right side navbar items */}
          <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500 transition-colors relative group"
            >
              <span className="sr-only">Ver notificaciones</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
              {/* Notification badge dot */}
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:bg-red-600 transition-colors"></span>
            </button>

            <div
              className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200"
              aria-hidden="true"
            />

            <div className="flex items-center gap-x-4">
              <img
                className="h-9 w-9 rounded-full bg-slate-50 border border-slate-200 p-0.5 object-cover"
                src={`https://ui-avatars.com/api/?name=${currentUser?.email.split("@")[0]}&background=f1f5f9&color=64748b&bold=true`}
                alt="Avatar"
              />
              <div className="hidden md:flex flex-col text-sm leading-tight">
                <span className="font-semibold text-slate-900">
                  {currentUser?.email.split("@")[0] || "Admin"}
                </span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  {userRole || "Administrador"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 relative scrollbar-thin scrollbar-thumb-slate-200">
          {/* Background decorations for main panel */}
          <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none -z-10" />

          <div className="mx-auto max-w-[1400px]">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
