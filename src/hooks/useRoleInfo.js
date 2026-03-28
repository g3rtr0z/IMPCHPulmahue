import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const permissionLabels = {
    dashboard: "Resumen Ministerial",
    viewMembers: "Ver Miembros",
    createEvents: "Gestionar Noticias",
    peticiones: "Gestionar Solicitudes",
    redes: "Gestionar Redes Sociales",
    horarios: "Gestionar Horarios",
    calendario: "Gestionar Calendario",
    editUsers: "Editar Usuarios",
    manageSystem: "Gestionar Roles y Permisos",
    manageMinistries: "Gestionar Ministerios y Cargos",
};

/**
 * Returns { roleName, permissions[] } for a given roleId with REAL-TIME updates.
 */
export function useRoleInfo(roleId) {
    const [roleName, setRoleName] = useState(roleId || "—");
    const [permissions, setPermissions] = useState([]);
    const [rawPermissions, setRawPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const defaultRoles = {
        admin: { nombre: "Administrador", permisos: ["dashboard", "viewMembers", "createEvents", "peticiones", "horarios", "calendario", "redes", "editUsers", "manageSystem", "manageMinistries"] },
        pastor: { nombre: "Pastor", permisos: ["dashboard", "viewMembers", "peticiones", "horarios", "calendario", "manageMinistries"] },
        comunicaciones: { nombre: "Comunicaciones", permisos: ["createEvents", "redes"] },
        user: { nombre: "Usuario Base", permisos: [] },
    };

    useEffect(() => {
        if (!roleId) { setLoading(false); return; }

        // Suscripción en tiempo real a los cambios del rol
        const unsubscribe = onSnapshot(doc(db, "roles", roleId), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setRoleName(data.nombre || roleId);
                const raw = data.permisos || [];
                setRawPermissions(raw);
                setPermissions(raw.map(p => permissionLabels[p] || p));
            } else {
                // Fallback a valores por defecto si el rol no existe en DB
                const def = defaultRoles[roleId] || { nombre: roleId, permisos: [] };
                setRoleName(def.nombre);
                setRawPermissions(def.permisos);
                setPermissions(def.permisos.map(p => permissionLabels[p] || p));
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching real-time role info:", error);
            const def = defaultRoles[roleId] || { nombre: roleId, permisos: [] };
            setRoleName(def.nombre);
            setPermissions(def.permisos.map(p => permissionLabels[p] || p));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [roleId]);

    return { roleName, permissions, rawPermissions, loading };
}
