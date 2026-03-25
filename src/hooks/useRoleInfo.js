import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const permissionLabels = {
    viewMembers: "Ver Miembros",
    createEvents: "Gestionar Eventos",
    editUsers: "Editar Usuarios",
    manageSystem: "Administración Total",
};

/**
 * Returns { roleName, permissions[] } for a given roleId fetched from Firestore.
 * Falls back to system defaults if the "roles" collection is empty.
 */
export function useRoleInfo(roleId) {
    const [roleName, setRoleName] = useState(roleId || "—");
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const defaultRoles = {
        admin: { nombre: "Administrador", permisos: ["viewMembers", "createEvents", "editUsers", "manageSystem"] },
        pastor: { nombre: "Pastor", permisos: ["viewMembers", "createEvents"] },
        comunicaciones: { nombre: "Comunicaciones", permisos: ["createEvents"] },
        user: { nombre: "Usuario Base", permisos: [] },
    };

    useEffect(() => {
        if (!roleId) { setLoading(false); return; }

        const fetch = async () => {
            try {
                const snap = await getDoc(doc(db, "roles", roleId));
                if (snap.exists()) {
                    const data = snap.data();
                    setRoleName(data.nombre || roleId);
                    setPermissions((data.permisos || []).map(p => permissionLabels[p] || p));
                } else {
                    // fallback
                    const def = defaultRoles[roleId] || { nombre: roleId, permisos: [] };
                    setRoleName(def.nombre);
                    setPermissions(def.permisos.map(p => permissionLabels[p] || p));
                }
            } catch {
                const def = defaultRoles[roleId] || { nombre: roleId, permisos: [] };
                setRoleName(def.nombre);
                setPermissions(def.permisos.map(p => permissionLabels[p] || p));
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [roleId]);

    return { roleName, permissions, loading };
}
