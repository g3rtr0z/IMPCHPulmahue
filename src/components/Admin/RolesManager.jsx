import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Plus, Edit2, Trash2, Check, X, Shield, Lock } from "lucide-react";

export default function RolesManager() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({
    dashboard: false,
    viewMembers: false,
    createEvents: false,
    peticiones: false,
    redes: false,
    horarios: false,
    calendario: false,
    editUsers: false,
    manageSystem: false,
    manageMinistries: false,
  });
  const [editingRoleId, setEditingRoleId] = useState(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "roles"));
      const rolesList = [];
      querySnapshot.forEach((doc) => {
        rolesList.push({ id: doc.id, ...doc.data() });
      });

      // Always ensure the 4 system roles exist, adding only the ones missing
      const systemRoles = [
        {
          id: "admin",
          nombre: "Administrador",
          permisos: ["viewMembers", "createEvents", "peticiones", "calendario", "editUsers", "manageSystem", "manageMinistries"],
        },
        {
          id: "pastor",
          nombre: "Pastor",
          permisos: ["viewMembers", "peticiones", "calendario", "manageMinistries"],
        },
        {
          id: "comunicaciones",
          nombre: "Comunicaciones",
          permisos: ["createEvents", "redes"],
        },
        { id: "user", nombre: "Usuario Base", permisos: [] },
      ];

      const existingIds = new Set(rolesList.map((r) => r.id));
      const missing = systemRoles.filter((r) => !existingIds.has(r.id));

      if (missing.length > 0) {
        await Promise.all(
          missing.map((r) =>
            setDoc(doc(db, "roles", r.id), { nombre: r.nombre, permisos: r.permisos })
          )
        );
        // Merge missing into the list
        setRoles([...rolesList, ...missing]);
      } else {
        setRoles(rolesList);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSaveRole = async (e) => {
    e.preventDefault();

    // Map permissions state to array
    const permsArray = Object.keys(permissions).filter(
      (key) => permissions[key],
    );

    const roleId = editingRoleId || roleName.toLowerCase().replace(/\s+/g, "_");

    try {
      await setDoc(doc(db, "roles", roleId), {
        nombre: roleName,
        permisos: permsArray,
      });
      setShowModal(false);
      resetForm();
      fetchRoles();
    } catch (err) {
      console.error("Error saving role:", err);
      alert("No se pudo guardar el rol.");
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar este rol del sistema?",
      )
    )
      return;
    try {
      await deleteDoc(doc(db, "roles", roleId));
      fetchRoles();
    } catch (err) {
      console.error("Error deleting role:", err);
      alert("No se pudo eliminar el rol.");
    }
  };

  const resetForm = () => {
    setRoleName("");
    setPermissions({
      viewMembers: false,
      createEvents: false,
      peticiones: false,
      redes: false,
      calendario: false,
      editUsers: false,
      manageSystem: false,
      manageMinistries: false,
    });
    setEditingRoleId(null);
  };

  const editRole = (role) => {
    setRoleName(role.nombre);
    setEditingRoleId(role.id);

    const rolePerms = role.permisos || [];
    setPermissions({
      dashboard: rolePerms.includes("dashboard"),
      viewMembers: rolePerms.includes("viewMembers"),
      createEvents: rolePerms.includes("createEvents"),
      peticiones: rolePerms.includes("peticiones"),
      redes: rolePerms.includes("redes"),
      horarios: rolePerms.includes("horarios"),
      calendario: rolePerms.includes("calendario"),
      editUsers: rolePerms.includes("editUsers"),
      manageSystem: rolePerms.includes("manageSystem"),
      manageMinistries: rolePerms.includes("manageMinistries"),
    });
    setShowModal(true);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Gestión de Roles y Permisos
          </h2>
          <p className="text-slate-500 mt-1">
            Configura el control de acceso (RBAC) para el portal.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-hover shadow-sm transition-all focus:ring-2 focus:ring-primary/50 flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Nuevo Rol
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-blue-300"></div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {role.nombre}
                  {role.id === "admin" && (
                    <Lock className="w-4 h-4 text-amber-500" />
                  )}
                </h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={() => editRole(role)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 bg-white rounded-lg shadow-sm ring-1 ring-slate-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {role.id !== "admin" && (
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 bg-white rounded-lg shadow-sm ring-1 ring-slate-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Permisos Activos
                </h4>
                <ul className="space-y-2">
                  {role.permisos && role.permisos.length > 0 ? (
                    role.permisos.map((perm, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm"
                      >
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="truncate">
                          {perm === "viewMembers"
                            ? "Ver Miembros"
                            : perm === "createEvents"
                              ? "Gestionar Noticias"
                              : perm === "peticiones"
                                ? "Gestionar Solicitudes"
                                : perm === "redes"
                                  ? "Gestionar Redes Sociales"
                                  : perm === "calendario"
                                    ? "Gestionar Calendario"
                                    : perm === "editUsers"
                                      ? "Editar Usuarios"
                                      : perm === "manageSystem"
                                        ? "Gestionar Roles y Permisos"
                                        : perm === "manageMinistries"
                                          ? "Gestionar Ministerios y Cargos"
                                          : perm}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-400 italic bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm flex items-center gap-2">
                      <X className="w-4 h-4 text-slate-300" /> Sin permisos
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating/Editing Role */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              {editingRoleId ? "Editar Rol" : "Crear Nuevo Rol"}
            </h3>

            <form onSubmit={handleSaveRole} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">
                  Nombre del Rol
                </label>
                <input
                  type="text"
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50/50 disabled:bg-slate-100 disabled:text-slate-400"
                  placeholder="Ej. Administrador"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-slate-700">
                  Asignar Permisos
                </label>
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={permissions.dashboard}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          dashboard: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary/30"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      Ver Resumen Ministerial (Estadísticas)
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={permissions.viewMembers}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          viewMembers: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary/30"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      Visualizar Directorio de Miembros
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={permissions.createEvents}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          createEvents: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary/30"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      Publicar y Editar Noticias
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={permissions.peticiones}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          peticiones: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary/30"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      Gestionar Solicitudes de Ingreso
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={permissions.redes}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          redes: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary/30"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      Gestionar Redes Sociales
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={permissions.horarios}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          horarios: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary/30"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      Gestionar Horarios de Servicios
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={permissions.calendario}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          calendario: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary/30"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      Administrar Calendario Ministerial
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={permissions.editUsers}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          editUsers: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary/30"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      Modificar Accesos de Usuarios
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={permissions.manageSystem}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          manageSystem: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary/30"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      Gestionar Roles y Permisos (Control Total)
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={permissions.manageMinistries}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          manageMinistries: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary/30"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      Gestionar Ministerios y Cargos
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-slate-600 font-semibold bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-sm transition-all focus:ring-2 focus:ring-primary/50 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
