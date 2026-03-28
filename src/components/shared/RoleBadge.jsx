import React, { useState } from "react";
import { Shield, ChevronDown } from "lucide-react";
import { useRoleInfo } from "../../hooks/useRoleInfo";

/**
 * Shows the current user's role badge in the topbar.
 * Clicking it opens a small popover with the list of active permissions.
 */
export default function RoleBadge({ roleId }) {
    const { roleName, permissions, loading } = useRoleInfo(roleId);
    const [open, setOpen] = useState(false);

    if (loading) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-colors text-sm font-semibold text-slate-700 shadow-sm"
            >
                <Shield className="w-4 h-4 text-slate-400" />
                {roleName}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white border border-slate-200 shadow-lg">
                        <div className="px-4 py-3 border-b border-slate-100">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Rol Asignado</p>
                            <p className="font-bold text-slate-900 text-sm">{roleName}</p>
                        </div>
                        <div className="px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Permisos Activos</p>
                            {permissions.length > 0 ? (
                                <ul className="space-y-1.5">
                                    {permissions.map((perm) => (
                                        <li key={perm} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                            {perm}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-slate-400 italic">Sin permisos especiales</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
