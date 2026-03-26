import { LogOut, X } from "lucide-react";
import { ALL_ADMIN_NAVIGATION } from "../adminNavigation";
import { useAuth } from "../../../context/AuthContext";
import { useRoleInfo } from "../../../hooks/useRoleInfo";

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) {
  const { logout, userRole, currentUser, userData } = useAuth();

  // Obtenemos los permisos crudos de la base de datos para el Sidebar
  const { rawPermissions: userPermsRaw, loading } = useRoleInfo(userRole);

  // Filtramos: El admin siempre ve roles. Los demás ven según sus permisos técnicos.
  const navigation = ALL_ADMIN_NAVIGATION.filter(item => {
    // Obtenemos los permisos crudos (sin traducir a etiquetas) para el Sidebar
    return userPermsRaw.includes(item.id);
  });

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
            <div className="w-20 h-20 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src="/logo-impch.png"
                alt="Logo IMPCH"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-slate-900 block leading-tight">
                Portal <span className="text-primary italic">IMPCH</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Gestión Central
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-40">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin mb-3" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Verificando...</span>
            </div>
          ) : (
            navigation.map((item) => {
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
            })
          )}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-900 truncate">
              {userData?.nombre || currentUser?.email.split("@")[0]}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none mt-1">
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
    </>
  );
}
