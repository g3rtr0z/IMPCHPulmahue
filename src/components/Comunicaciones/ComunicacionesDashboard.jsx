import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    Menu,
    Bell,
    Newspaper,
    Megaphone,
    Radio,
    LogOut,
    X,
} from "lucide-react";
import NewsManager from "./NewsManager";
import SocialMediaManager from "./SocialMediaManager";

export default function ComunicacionesDashboard() {
    const { currentUser, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("noticias");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = "/";
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    };

    const navigation = [
        { name: "Gestión de Noticias", id: "noticias", icon: Newspaper },
        { name: "Redes Sociales", id: "redes", icon: Radio },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "noticias":
                return <NewsManager />;
            case "redes":
                return <SocialMediaManager />;
            default:
                // Placeholder hasta que se creen los componentes reales de Comunicaciones
                return (
                    <div className="bg-white rounded-2xl shadow-card p-12 flex flex-col items-center justify-center min-h-[400px] text-center border-dashed border-2 border-slate-200">
                        <div className="w-16 h-16 bg-impch-primary/5 text-impch-primary rounded-2xl flex items-center justify-center mb-4">
                            <Megaphone className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-impch-dark-panel">
                            Módulo de Comunicaciones
                        </h3>
                        <p className="text-slate-500 max-w-sm mt-2">
                            Esta sección está en desarrollo. Muy pronto disponeremos de las herramientas para gestionar el contenido y difusión de nuestra iglesia.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar for Comunicaciones */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } flex flex-col h-full shadow-2xl lg:shadow-none`}
            >
                <div className="flex h-20 shrink-0 items-center justify-between lg:justify-start gap-3 px-6 border-b border-slate-100 bg-impch-primary/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-impch-primary/10 rounded-xl flex items-center justify-center text-impch-primary">
                            <Radio className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="font-serif font-bold text-xl text-impch-dark-panel block leading-tight">
                                Portal <span className="text-impch-primary italic">Comunicaciones</span>
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                    {navigation.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive
                                    ? "bg-blue-50/80 text-impch-primary shadow-sm ring-1 ring-blue-100/50"
                                    : "text-slate-600 hover:text-impch-dark-panel hover:bg-slate-50"
                                    }`}
                            >
                                <item.icon
                                    className={`h-5 w-5 shrink-0 transition-colors ${isActive
                                        ? "text-impch-accent"
                                        : "text-slate-400 group-hover:text-slate-600"
                                        }`}
                                />
                                {item.name}
                            </button>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50 transition-colors group"
                    >
                        <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-500 transition-colors" />
                        Cerrar sesión
                    </button>
                </div>
            </div>

            {/* Main column */}
            <div className="flex flex-col flex-1 overflow-hidden relative">
                {/* Topbar */}
                <header className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white shadow-sm z-30 shrink-0">
                    <button
                        className="text-slate-500 hover:text-slate-700 lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-50 transition-colors"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex flex-1 items-center justify-end gap-x-6">
                        <button className="text-slate-400 hover:text-slate-500 relative group transition-colors">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white group-hover:bg-red-600"></span>
                        </button>
                        <div className="w-px h-6 bg-slate-200" />
                        <div className="flex items-center gap-x-4">
                            <img
                                className="h-9 w-9 rounded-full bg-slate-50 border border-slate-200 object-cover"
                                src={`https://ui-avatars.com/api/?name=${currentUser?.email.split("@")[0]}&background=cffafe&color=0891b2&bold=true`}
                                alt="Comunicaciones"
                            />
                            <div className="hidden md:flex flex-col text-sm leading-tight text-right">
                                <span className="font-semibold text-impch-dark-panel">Equipo Media</span>
                                <span className="text-xs text-impch-primary uppercase font-bold tracking-wider">
                                    Comunicaciones
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 relative scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none -z-10" />

                    <div className="max-w-[1400px] mx-auto">{renderContent()}</div>
                </main>
            </div>
        </div>
    );
}
