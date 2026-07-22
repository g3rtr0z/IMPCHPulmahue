import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu, Home } from "lucide-react";
import NewsManager from "./NewsManager";
import SocialMediaManager from "./SocialMediaManager";
import AdminSidebar from "../Admin/Layout/Sidebar";
import { useRoleInfo } from "../../hooks/useRoleInfo";
import { ALL_ADMIN_NAVIGATION } from "../Admin/adminNavigation";

export default function ComunicacionesDashboard() {
    const { userRole, loading: authLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const { rawPermissions: userPermsRaw, loading: loadingPerms } = useRoleInfo(userRole);
    const navigate = useNavigate();

    // Filtrado dinámico basado estrictamente en permisos
    const allowedNavigation = React.useMemo(() => {
        return ALL_ADMIN_NAVIGATION.filter(item => {
            return userPermsRaw.includes(item.id);
        });
    }, [userRole, userPermsRaw]);

    // Salto inteligente al primer módulo HABILITADO
    useEffect(() => {
        if (!loadingPerms && allowedNavigation.length > 0) {
            const firstTabId = allowedNavigation[0].id;
            if (activeTab === "dashboard" && activeTab !== firstTabId) {
                setActiveTab(firstTabId);
            }
        }
    }, [loadingPerms, allowedNavigation, activeTab]);

    const renderContent = () => {
        if (loadingPerms) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/50 p-12">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-impch-primary rounded-full animate-spin mb-4" />
                    <p className="text-slate-500 font-medium animate-pulse">Cargando herramientas...</p>
                </div>
            );
        }

        switch (activeTab) {
            case "createEvents":
                return <NewsManager />;
            case "redes":
                return <SocialMediaManager />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/50 p-12 text-center border-dashed border-2 border-slate-100">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Módulo en Desarrollo</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">La sección administrativa de comunicaciones "{activeTab}" estará disponible pronto.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            <AdminSidebar
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

                    {/* Right side navbar items - Solo el botón de inicio */}
                    <div className="flex flex-1 items-center justify-end">
                        <a
                            href="/"
                            className="p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center border border-slate-100"
                            title="Volver al inicio"
                        >
                            <Home className="h-5 w-5" aria-hidden="true" />
                        </a>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 relative scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none -z-10" />

                    <div className="mx-auto max-w-[1200px]">{renderContent()}</div>
                </main>
            </div>
        </div>
    );
}
