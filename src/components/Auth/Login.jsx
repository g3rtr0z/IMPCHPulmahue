import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db, firebaseConfig } from "../../firebase";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { sendWelcomeEmail } from "../../utils/emailService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    if (e) e.preventDefault();

    if (isResetMode) {
      if (!email) {
        setError("Por favor, ingresa tu correo electrónico.");
        return;
      }
      try {
        setError("");
        setMsg("");
        setLoading(true);

        // Check if member exists in the database first
        const miembrosRef = collection(db, "miembros");
        const q = query(miembrosRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError(
            "No encontramos este correo en los registros de la iglesia. Por favor, comunícate con el Pastor para ser registrado.",
          );
          setLoading(false);
          return;
        }

        // The member exists. Attempt to send password reset.
        // But what if they never had an Auth account created? sendPasswordResetEmail will silently "succeed" due to enumeration protection but send nothing.
        // We can preemptively ensure their account exists by creating it in a secondary app.
        try {
          const secondaryApp = initializeApp(
            firebaseConfig,
            "SelfServiceApp" + Date.now(),
          );
          const secondaryAuth = getAuth(secondaryApp);
          const tempPassword =
            "Impch" + Math.random().toString(36).slice(-6) + "!";

          const userCredential = await createUserWithEmailAndPassword(
            secondaryAuth,
            email,
            tempPassword,
          );
          const newUser = userCredential.user;

          // Registramos el rol en la DB de users
          await setDoc(doc(db, "users", newUser.uid), {
            email: newUser.email,
            nombre: querySnapshot.docs[0].data().nombre || "Sin Nombre",
            role: "user",
            estado: "activo",
            createdAt: serverTimestamp(),
          });

          // Enlazamos al miembro en Firestore con su nuevo UID
          await updateDoc(doc(db, "miembros", querySnapshot.docs[0].id), {
            userId: newUser.uid,
          });

          // Enviar inmediatamente correo con clave segura generada
          await sendWelcomeEmail(email, tempPassword);
          await secondaryAuth.signOut();
          setMsg(
            "¡Perfecto! Hemos generado un acceso personal e instransferible para ti. Revisa tu correo Institucional, acabar de llegarte tus credenciales temporales.",
          );
        } catch (creationError) {
          if (creationError.code !== "auth/email-already-in-use") {
            console.error("Error auto-creating auth:", creationError);
            setError(
              "Tuvimos un problema con el despacho. Acércate a informática para solucionarlo.",
            );
          } else {
            // El usuario ya tenía una cuenta de Firebase Auth creada anteriormente.
            // Para cuentas ya existentes, la única forma segura (sin backend) de recuperar la clave es a través del sistema de recuperación de Firebase.
            await resetPassword(email);
            setMsg(
              "Notamos que ya tenías una cuenta creada previamente. Como medida de seguridad, hemos enviado el correo oficial de recuperación de contraseña de Firebase a tu bandeja.",
            );
          }
        }

        setTimeout(() => {
          setIsResetMode(false);
          setMsg("");
          setPassword("");
        }, 6000);
      } catch (err) {
        setError("Ocurrió un error de red. Intenta nuevamente.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setError("");
        setMsg("");
        setLoading(true);
        const userCred = await login(email, password);
        const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          if (role === "admin") {
            window.location.href = "/admin";
          } else if (role === "pastor") {
            window.location.href = "/pastor";
          } else if (role === "comunicaciones") {
            window.location.href = "/comunicaciones";
          } else {
            window.location.href = "/";
          }
        } else {
          window.location.href = "/";
        }
      } catch (err) {
        setError(
          "Error al iniciar sesión. Por favor, revisa tus credenciales.",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      <style>{`
        @keyframes loginFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes loginSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes loginSlideRight {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .anim-fade    { animation: loginFadeIn   0.7s ease both; }
        .anim-img     { animation: loginSlideRight 0.9s cubic-bezier(.22,1,.36,1) both; }
        .anim-form    { animation: loginSlideUp   0.8s cubic-bezier(.22,1,.36,1) both; }
        .anim-d1 { animation-delay: 0.05s; }
        .anim-d2 { animation-delay: 0.15s; }
        .anim-d3 { animation-delay: 0.25s; }
        .anim-d4 { animation-delay: 0.35s; }
        .anim-d5 { animation-delay: 0.45s; }
        .anim-d6 { animation-delay: 0.55s; }
      `}</style>
      {/* Botón de regresar al inicio */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50 flex items-center justify-center w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800 transition-all border border-slate-200"
        title="Regresar al inicio"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Contenedor Izquierdo: Imagen (Visible solo en pantallas grandes) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 flex-col justify-end p-16 anim-img">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 blur-[3px]"
          style={{
            backgroundImage: "url('/fondo-login.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none" />
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-3 mb-6 opacity-90">
            <img
              src="/logo-impch.png"
              alt="Logo IMPCH"
              className="w-10 h-10 object-contain drop-shadow"
            />
            <span className="font-serif font-bold text-2xl tracking-wide">
              IMPCH Pulmahue
            </span>
          </div>
          <h2 className="text-5xl font-serif font-bold mb-6 leading-tight">
            Portal Staff
          </h2>
          <p className="text-lg opacity-80 max-w-md font-medium leading-relaxed italic border-l-4 border-impch-primary pl-4">
            "Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres."
            <br />
            <span className="text-sm font-bold uppercase tracking-widest mt-2 block not-italic text-impch-primary">Colosenses 3:23</span>
          </p>
        </div>
      </div>

      {/* Contenedor Derecho: Formulario Minimalista */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 max-h-screen overflow-y-auto anim-form anim-d2">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile Header (Solo visible en móviles) */}
          <div className="lg:hidden flex items-center gap-3 mb-10 text-impch-dark-panel">
            <img
              src="/logo-impch.png"
              alt="Logo IMPCH"
              className="w-8 h-8 object-contain"
            />
            <span className="font-serif font-bold text-2xl tracking-wide">
              IMPCH Pulmahue
            </span>
          </div>

          <div className="mb-10 anim-form anim-d2">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">
              {isResetMode ? "Configurar Acceso" : "Iniciar Sesión"}
            </h3>
            <p className="text-slate-500 font-medium">
              {isResetMode
                ? "Ingresa tu correo para obtener tus credenciales."
                : "Ingresa tus credenciales para continuar"}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100 flex gap-3 items-start">
              <span className="mt-0.5 shrink-0 block">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {msg && (
            <div className="mb-8 p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl font-medium border border-emerald-100 flex gap-3 items-start">
              <span className="mt-0.5 shrink-0 block">✅</span>
              <p>{msg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 anim-form anim-d3">
              <label className="text-sm font-bold text-slate-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-impch-primary/20 focus:border-impch-primary transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                placeholder="admin@impchpulmahue.cl"
                required
              />
            </div>

            {!isResetMode && (
              <div className="space-y-2 anim-form anim-d4">
                <label className="text-sm font-bold text-slate-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-impch-primary/20 focus:border-impch-primary transition-all text-slate-900 placeholder:text-slate-400 font-medium tracking-widest"
                  placeholder="••••••••"
                  required={!isResetMode}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-impch-primary text-white py-4 rounded-xl font-bold transition-all shadow-soft mt-8 flex items-center justify-center gap-2 anim-form anim-d5 ${loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-impch-primary-hover hover:-translate-y-0.5"
                }`}
            >
              {loading ? (
                "Procesando..."
              ) : (
                <>
                  <span>
                    {isResetMode
                      ? "Enviar enlace de acceso"
                      : "Ingresar al Panel"}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-start space-y-4 border-t border-slate-100 pt-8">
            <button
              type="button"
              onClick={() => {
                setIsResetMode(!isResetMode);
                setError("");
                setMsg("");
              }}
              className="text-sm font-bold text-impch-accent hover:text-impch-accent-hover transition-colors"
            >
              {isResetMode ? "Volver al inicio de sesión" : "¿Olvidó su contraseña? / Nuevo acceso"}
            </button>
          </div>

          <div className="mt-12 text-left">
            <p className="text-xs text-slate-500 font-medium">
              Soporte:{" "}
              <a
                href="mailto:soporte.impchpulmahue@gmail.com"
                className="text-slate-700 font-bold hover:text-impch-primary transition-colors ml-1"
              >
                soporte.impchpulmahue@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
