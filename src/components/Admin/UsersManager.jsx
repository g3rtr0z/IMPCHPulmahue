import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, firebaseConfig } from "../../firebase";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Lock,
  CheckCircle2,
  X,
} from "lucide-react";

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch users
      const usersSnap = await getDocs(collection(db, "users"));
      const uList = [];
      usersSnap.forEach((doc) => {
        uList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(uList);

      // Fetch roles (if needed for the dropdowns)
      const rolesSnap = await getDocs(collection(db, "roles"));
      const rList = [];
      rolesSnap.forEach((doc) => rList.push({ id: doc.id, ...doc.data() }));

      // Fallback default roles if empty
      if (rList.length === 0) {
        setRolesList([
          { id: "admin", nombre: "Administrador" },
          { id: "pastor", nombre: "Pastor" },
          { id: "comunicaciones", nombre: "Comunicaciones" },
          { id: "user", nombre: "Usuario Base" },
        ]);
      } else {
        setRolesList(rList);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      const secondaryApp = initializeApp(
        firebaseConfig,
        "Secondary" + Date.now(),
      );
      const secondaryAuth = getAuth(secondaryApp);

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password,
      );
      const newUser = userCredential.user;

      await setDoc(doc(db, "users", newUser.uid), {
        email: newUser.email,
        nombre: fullName || "Sin Nombre",
        role: role,
        estado: "activo",
        createdAt: serverTimestamp(),
      });

      await secondaryAuth.signOut();

      setSuccess("Usuario creado exitosamente.");
      setTimeout(() => {
        setShowModal(false);
        resetForm();
        fetchData();
      }, 1500);
    } catch (err) {
      console.error("Error al crear usuario:", err);
      setError(err.message || "No se pudo crear el usuario.");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setRole("user");
    setFullName("");
    setError("");
    setSuccess("");
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await setDoc(
        doc(db, "users", userId),
        { role: newRole },
        { merge: true },
      );
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      console.error("Error updating role:", err);
      alert("No se pudo actualizar el rol.");
    }
  };

  const handleDeleteUserDoc = async (userId) => {
    if (
      !window.confirm(
        "¿Seguro que deseas eliminar el acceso a este usuario del sistema?",
      )
    )
      return;
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Error deleting user doc:", err);
      alert("No se pudo eliminar el acceso.");
    }
  };

  const roleColors = {
    admin: "bg-red-50 text-red-700 ring-red-600/20",
    pastor: "bg-blue-50 text-blue-700 ring-blue-600/20",
    comunicaciones: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    user: "bg-slate-50 text-slate-700 ring-slate-600/20",
  };

  const getRoleName = (roleId) => {
    const found = rolesList.find((r) => r.id === roleId);
    return found ? found.nombre : roleId;
  };

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.nombre || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Directorio de Accesos
          </h2>
          <p className="text-slate-500 mt-1">
            Administra los usuarios del sistema y sus niveles de acceso.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-hover shadow-sm transition-all focus:ring-2 focus:ring-primary/50 flex items-center gap-2 hover:-translate-y-0.5"
        >
          <UserPlus className="w-5 h-5" />
          Agregar Usuario
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border-0 py-2.5 pl-10 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6 bg-slate-50"
          />
        </div>
        <div className="relative sm:max-w-xs w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Filter className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-10 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6 bg-slate-50 appearance-none text-slate-700"
          >
            <option value="all">Todos los roles</option>
            {rolesList.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto ring-1 ring-slate-200 rounded-2xl">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6"
                >
                  Usuario
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                >
                  Rol
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500">
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {(u.nombre
                          ? u.nombre.charAt(0)
                          : u.email?.substring(0, 1) || "?"
                        ).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-slate-900">
                          {u.nombre || "Sin Nombre"}
                        </div>
                        <div className="text-slate-500 text-sm">
                          {u.email || u.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${roleColors[u.role] || roleColors["user"]}`}
                    >
                      {getRoleName(u.role)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 ring-1 ring-inset ring-emerald-600/20`}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                        aria-hidden="true"
                      ></span>
                      {u.estado || "Activo"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    <div className="flex items-center gap-3">
                      {/* Role select directly mapped to actions for speed */}
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className="bg-white border text-xs border-slate-200 text-slate-700 rounded-lg focus:ring-primary focus:border-primary block p-1.5 outline-none shadow-sm"
                      >
                        {rolesList.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nombre}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleDeleteUserDoc(u.id)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                        title="Eliminar Acceso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Creating User */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
              <UserPlus className="w-6 h-6 text-primary" />
              Nuevo Staff
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                {success}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50 focus:bg-white"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50 focus:bg-white"
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Contraseña Temporal
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50 focus:bg-white"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">
                  Asignar Rol Inicial
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50 focus:bg-white text-slate-700"
                >
                  {rolesList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  disabled={formLoading}
                  className="flex-1 py-3 text-slate-600 font-semibold bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-sm transition-all focus:ring-2 focus:ring-primary/50 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {formLoading ? "Procesando..." : "Crear Acceso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
