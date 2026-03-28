import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "../../firebase";

export default function ResetPasswordHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [emailToReset, setEmailToReset] = useState("");

  useEffect(() => {
    // Si no hay código de acción, redirigir al login
    if (!oobCode || mode !== "resetPassword") {
      navigate("/login");
      return;
    }

    // Verificar el código al cargar
    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setEmailToReset(email);
        setVerifying(false);
      })
      .catch((error) => {
        console.error("Invalid or expired action code.", error);
        setError(
          "El enlace ha expirado o no es válido. Por favor, solicita uno nuevo.",
        );
        setVerifying(false);
      });
  }, [oobCode, mode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMsg(
        "¡Contraseña actualizada exitosamente! Redirigiendo al inicio de sesión...",
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        "Ocurrió un error al intentar cambiar la contraseña. El enlace puede haber caducado.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 relative w-full overflow-hidden">
        <div className="absolute inset-0 flex w-full h-full pointer-events-none">
          <div className="w-full h-full bg-[#0a1120]"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-medium">Verificando enlace seguro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative w-full m-0 p-0 overflow-hidden">
      {/* Split Background Layout (Solid Dark Blue)*/}
      <div className="absolute inset-0 flex w-full h-full pointer-events-none bg-[#0a1120]"></div>

      {/* Glowing orbs */}
      <div
        className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-lg shadow-2xl rounded-3xl overflow-hidden relative z-10 mx-6 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 sm:p-12">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-3">
            Nueva Contraseña
          </h3>
          <p className="text-slate-400">
            {error && error.includes("expirado")
              ? "Este enlace ya no es válido."
              : `Crear clave de acceso para ${emailToReset}`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl flex items-start gap-3 animate-fadeIn">
            <svg
              className="mt-0.5 shrink-0"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {msg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl flex items-start gap-3 animate-fadeIn">
            <svg
              className="mt-0.5 shrink-0"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>{msg}</p>
          </div>
        )}

        {!error.includes("expirado") && !msg && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Escribe tu nueva contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-700/50 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500 tracking-widest"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Confirma tu contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-700/50 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500 tracking-widest"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] flex items-center justify-center gap-3 ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-blue-500 hover:to-blue-400 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]"
              }`}
            >
              {loading ? "Guardando credencial..." : "Establecer Contraseña"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
}
