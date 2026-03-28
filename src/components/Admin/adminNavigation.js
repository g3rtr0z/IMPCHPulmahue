import {
    LayoutDashboard,
    Clock,
    UserPlus,
    Users,
    Calendar,
    Newspaper,
    Share2,
    UserCog,
    ShieldCheck,
    Briefcase
} from "lucide-react";

export const ALL_ADMIN_NAVIGATION = [
    { name: "Resumen Ministerial", id: "dashboard", icon: LayoutDashboard, perm: "dashboard" },
    { name: "Horarios de Servicios", id: "horarios", icon: Clock, perm: "horarios" },
    { name: "Solicitudes de Ingreso", id: "peticiones", icon: UserPlus, perm: "peticiones" },
    { name: "Directorio de Miembros", id: "viewMembers", icon: Users, perm: "viewMembers" },
    { name: "Calendario de Cultos", id: "calendario", icon: Calendar, perm: "calendario" },
    { name: "Gestión de Noticias", id: "createEvents", icon: Newspaper, perm: "createEvents" },
    { name: "Redes Sociales", id: "redes", icon: Share2, perm: "redes" },
    { name: "Control de Usuarios", id: "editUsers", icon: UserCog, perm: "editUsers" },
    { name: "Roles y Permisos", id: "manageSystem", icon: ShieldCheck, perm: "manageSystem" },
    { name: "Ministerios y Cargos", id: "manageMinistries", icon: Briefcase, perm: "manageMinistries" },
];
