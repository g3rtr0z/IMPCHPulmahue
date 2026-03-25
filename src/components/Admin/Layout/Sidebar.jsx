import React from "react";
import {
  LayoutDashboard,
  UserCog,
  ShieldCheck,
  BookOpen,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const navigation = [
  { name: "Dashboard", id: "dashboard", icon: LayoutDashboard },
  { name: "Usuarios", id: "usuarios", icon: UserCog },
  { name: "Roles y Permisos", id: "roles", icon: ShieldCheck },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col h-full shadow-2xl lg:shadow-none`}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 shrink-0 items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-slate-900 block leading-tight">
                Admin<span className="text-primary italic">Panel</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Portal Central
              </span>
            </div>
          </div>
          <button
            type="button"
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
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
                  aria-hidden="true"
                />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
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
    </>
  );
}
