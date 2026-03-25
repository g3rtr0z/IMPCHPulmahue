import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  BookHeart,
  Users,
  Calendar,
  HandHeart,
  MessageSquare,
  LogOut,
  X,
  UserPlus,
} from "lucide-react";
import MembersManager from "./MembersManager";
import PrayerRequestsManager from "./PrayerRequestsManager";
import PastorDashboardStats from "./PastorDashboardStats";
import CalendarManager from "./CalendarManager";

export default function PastorDashboard() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("resumen");
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

  // Fake navigation tailored for a Pastor
  const navigation = [
    { name: "Resumen Ministeral", id: "resumen", icon: BookHeart },
    { name: "Directorio de Miembros", id: "miembros", icon: Users },
    { name: "Calendario de Cultos", id: "calendario", icon: Calendar },
    { name: "Nuevos Contactos", id: "peticiones", icon: UserPlus },
    { name: "Mensajes Pastorales", id: "mensajes", icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "resumen":
        return <PastorDashboardStats />;
      case "miembros":
        return <MembersManager />;
      case "calendario":
        return <CalendarManager />;
      case "peticiones":
        return <PrayerRequestsManager />;
      default:
        return (
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 p-12 flex flex-col items-center justify-center min-h-[400px] text-center border-dashed border-2 border-slate-100">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
              <BookHeart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">
              Sección en Preparación
            </h3>
            <p className="text-slate-500 max-w-sm mt-2">
              Estamos vinculando esta sección administrativa ministerial. Muy
              pronto dispondrá de todas las herramientas.
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

      {/* Sidebar for Pastor */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col h-full shadow-2xl lg:shadow-none`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between lg:justify-start gap-3 px-6 border-b border-slate-100 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <BookHeart className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-slate-900 block leading-tight">
                Portal <span className="text-primary italic">Pastor</span>
              </span>
            </div>
          </div>
          <button
            type="button"
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
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
                  ? "bg-blue-50/80 text-primary shadow-sm ring-1 ring-blue-100/50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                <item.icon
                  className={`h-5 w-5 shrink-0 transition-colors ${isActive
                    ? "text-primary"
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
            className="text-slate-500 hover:text-slate-700 lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-50"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 items-center justify-end gap-x-6">
            <button className="text-slate-400 hover:text-slate-500 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex items-center gap-x-4">
              <img
                className="h-9 w-9 rounded-full bg-slate-50 border border-slate-200 object-cover"
                src={`https://ui-avatars.com/api/?name=${currentUser?.email.split("@")[0]}&background=bfdbfe&color=1e3a8a&bold=true`}
                alt="Pastor"
              />
              <div className="hidden md:flex flex-col text-sm leading-tight text-right">
                <span className="font-semibold text-slate-900">Pastor</span>
                <span className="text-xs text-primary uppercase font-bold tracking-wider">
                  {currentUser?.email}
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
