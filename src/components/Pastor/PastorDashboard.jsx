import React, { useState, useEffect } from "react";
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
  Home,
} from "lucide-react";
import MembersManager from "./MembersManager";
import PrayerRequestsManager from "./PrayerRequestsManager";
import PastorDashboardStats from "./PastorDashboardStats";
import CalendarManager from "./CalendarManager";
import ScheduleManager from "./ScheduleManager";
import RoleBadge from "../shared/RoleBadge";
import { useRoleInfo } from "../../hooks/useRoleInfo";
import { ALL_ADMIN_NAVIGATION } from "../Admin/adminNavigation";

export default function PastorDashboard() {
  const { currentUser, logout, userRole, userData } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { rawPermissions: userPermsRaw, loading: loadingPerms } = useRoleInfo(userRole);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

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
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium animate-pulse">Sincronizando portal...</p>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return <PastorDashboardStats />;
      case "miembros":
      case "viewMembers":
        return <MembersManager />;
      case "calendario":
        return <CalendarManager />;
      case "peticiones":
        return <PrayerRequestsManager />;
      case "horarios":
        return <ScheduleManager />;
      default:
        return (
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 p-12 flex flex-col items-center justify-center min-h-[400px] text-center border-dashed border-2 border-slate-100">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
              <BookHeart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">
              Módulo Ministerial
            </h3>
            <p className="text-slate-500 max-w-sm mt-2">
              Selecciona una de tus herramientas en el menú de la izquierda para comenzar la gestión.
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
          {allowedNavigation.map((item) => {
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
        <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-900 truncate">
              {userData?.nombre || currentUser?.email.split("@")[0]}
            </span>
            <span className="text-[10px] text-primary uppercase font-bold tracking-widest leading-none mt-1">
              {userRole}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors group flex-shrink-0"
            title="Cerrar sesión"
          >
            <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-600" />
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

        {/* Content */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 relative scrollbar-thin scrollbar-thumb-slate-200">
          <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none -z-10" />

          <div className="max-w-[1400px] mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
