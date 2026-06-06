import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAppointments, updateAppointmentStatus } from "../../services/api";
import type { AppointmentDto } from "../../services/api";

interface AppointmentsBoardProps {
    onCountChange?: (total: number, active: number) => void;
}

// ─────────────────────────────────────────────────────────────────────────
//  STATUS CONFIG
// ─────────────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    PENDING: {
        label: "Pendientes",
        color: "#eab308",
        bg: "rgba(234,179,8,0.08)",
        border: "#eab308",
        badge: "🟡 Pendiente",
    },
    ACCEPTED: {
        label: "Aceptadas (En Taller)",
        color: "#22c55e",
        bg: "rgba(34,197,94,0.08)",
        border: "#22c55e",
        badge: "🟢 En Taller",
    },
    CANCELLED: {
        label: "Canceladas",
        color: "#ef4444",
        bg: "rgba(239,68,68,0.08)",
        border: "#ef4444",
        badge: "🔴 Cancelada",
    },
} as const;

// ─────────────────────────────────────────────────────────────────────────
//  APPOINTMENT CARD
// ─────────────────────────────────────────────────────────────────────────
function AppointmentCard({
    appt,
    onChangeStatus,
}: {
    appt: AppointmentDto;
    onChangeStatus: (id: number, s: "PENDING" | "ACCEPTED" | "CANCELLED") => void;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const cfg = STATUS_CONFIG[appt.status];

    const handleChange = async (newStatus: "PENDING" | "ACCEPTED" | "CANCELLED") => {
        if (newStatus === appt.status) { setMenuOpen(false); return; }
        setLoading(true);
        setMenuOpen(false);
        await onChangeStatus(appt.id, newStatus);
        setLoading(false);
    };

    const formattedDate = new Date(appt.appointmentDate).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const NEXT_ACTIONS: { label: string; status: "PENDING" | "ACCEPTED" | "CANCELLED"; color: string }[] = appt.status === "PENDING"
        ? [
            { label: "✅ Aceptar cita", status: "ACCEPTED", color: "#22c55e" },
            { label: "❌ Cancelar cita", status: "CANCELLED", color: "#ef4444" },
        ]
        : appt.status === "ACCEPTED"
        ? [{ label: "❌ Cancelar cita", status: "CANCELLED", color: "#ef4444" }]
        : [{ label: "↩️ Restaurar como Pendiente", status: "PENDING", color: "#eab308" }];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            style={{
                position: "relative",
                backgroundColor: loading ? "#111" : cfg.bg,
                borderRadius: 8,
                border: `1px solid ${cfg.border}33`,
                borderLeft: `3px solid ${cfg.border}`,
                padding: "14px 16px",
                cursor: "pointer",
                transition: "background 0.2s",
            }}
            onClick={() => !loading && setMenuOpen((o) => !o)}
        >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ color: "#ff5a00", fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>
                    Cita #{appt.id}
                </span>
                <span style={{ color: "#555", fontSize: 11, fontFamily: "monospace" }}>{formattedDate}</span>
            </div>

            {/* Cliente */}
            <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#e8e8e8" }}>
                👤 {appt.clientName}
            </p>

            {/* Vehículo */}
            <p style={{ margin: "0 0 6px", fontSize: 12, color: "#aaa", fontFamily: "monospace" }}>
                🏍️ {appt.vehicleLabel}
            </p>

            {/* Motivo */}
            {appt.reason && (
                <p style={{ margin: "0 0 10px", fontSize: 11, color: "#666", fontStyle: "italic" }}>
                    {appt.reason}
                </p>
            )}

            {/* Badge de estado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{
                    fontSize: 10, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.06em",
                    padding: "3px 9px", borderRadius: 20,
                    backgroundColor: `${cfg.border}22`,
                    color: cfg.color,
                    border: `1px solid ${cfg.border}55`,
                }}>
                    {cfg.badge}
                </span>
                {appt.status === "ACCEPTED" && (
                    <span style={{ color: "#22c55e", fontSize: 10, fontFamily: "monospace" }}>
                        📋 OT Generada
                    </span>
                )}
                {!loading && (
                    <span style={{ color: "#444", fontSize: 11 }}>{menuOpen ? "▲" : "▼"}</span>
                )}
                {loading && (
                    <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        style={{ color: "#ff5a00", fontSize: 11, fontFamily: "monospace" }}
                    >
                        actualizando...
                    </motion.span>
                )}
            </div>

            {/* Menú desplegable de acciones */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: "absolute",
                            bottom: "calc(100% + 6px)",
                            left: 0, right: 0,
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            borderRadius: 8,
                            zIndex: 50,
                            overflow: "hidden",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p style={{ margin: 0, padding: "10px 14px 6px", fontSize: 9, color: "#444", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            Cambiar estado
                        </p>
                        {NEXT_ACTIONS.map((action) => (
                            <button
                                key={action.status}
                                onClick={() => handleChange(action.status)}
                                style={{
                                    width: "100%", textAlign: "left", padding: "10px 14px",
                                    background: "none", border: "none", borderTop: "1px solid #2a2a2a",
                                    color: action.color, fontSize: 12, fontWeight: 600,
                                    cursor: "pointer", transition: "background 0.15s",
                                    fontFamily: "'Inter', sans-serif",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                                {action.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────
//  KANBAN COLUMN
// ─────────────────────────────────────────────────────────────────────────
function KanbanColumn({
    status,
    appointments,
    onChangeStatus,
}: {
    status: "PENDING" | "ACCEPTED" | "CANCELLED";
    appointments: AppointmentDto[];
    onChangeStatus: (id: number, s: "PENDING" | "ACCEPTED" | "CANCELLED") => void;
}) {
    const cfg = STATUS_CONFIG[status];

    return (
        <div style={{
            flex: 1,
            backgroundColor: "#0d0d0d",
            borderRadius: 10,
            borderTop: `3px solid ${cfg.border}`,
            padding: "16px",
            minHeight: 300,
            display: "flex",
            flexDirection: "column",
            gap: 0,
        }}>
            {/* Cabecera de columna */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace" }}>
                    {cfg.label}
                </h3>
                <span style={{
                    backgroundColor: `${cfg.border}22`,
                    color: cfg.color,
                    fontSize: 11, fontFamily: "monospace", fontWeight: 700,
                    padding: "2px 8px", borderRadius: 12,
                    border: `1px solid ${cfg.border}44`,
                }}>
                    {appointments.length}
                </span>
            </div>

            {/* Tarjetas */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                <AnimatePresence>
                    {appointments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ textAlign: "center", color: "#333", fontSize: 12, fontFamily: "monospace", paddingTop: 40 }}
                        >
                            Sin citas
                        </motion.div>
                    ) : (
                        appointments.map((appt) => (
                            <AppointmentCard key={appt.id} appt={appt} onChangeStatus={onChangeStatus} />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────
//  MAIN BOARD
// ─────────────────────────────────────────────────────────────────────────
export default function AppointmentsBoard({ onCountChange }: AppointmentsBoardProps) {
    const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const data = await getAppointments();
        setAppointments(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
        // Refresco automático cada 30 segundos
        const interval = setInterval(fetchData, 30_000);
        return () => clearInterval(interval);
    }, [fetchData]);

    // Notificar al padre con el conteo de citas
    useEffect(() => {
        const active = appointments.filter((a) => a.status === "PENDING" || a.status === "ACCEPTED").length;
        onCountChange?.(appointments.length, active);
    }, [appointments, onCountChange]);

    const handleStatusChange = async (id: number, newStatus: "PENDING" | "ACCEPTED" | "CANCELLED") => {
        const updated = await updateAppointmentStatus(id, newStatus);
        if (updated) {
            // Mantener campos enriquecidos localmente
            setAppointments((prev) =>
                prev.map((a) =>
                    a.id === id ? { ...a, status: updated.status } : a
                )
            );
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "40px 0", color: "#555" }}>
                <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ff5a00" }}
                />
                <span style={{ fontFamily: "monospace", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Cargando citas...
                </span>
            </div>
        );
    }

    return (
        <div>
            {/* Barra de acciones */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <button
                    onClick={fetchData}
                    style={{
                        backgroundColor: "transparent",
                        border: "1px solid #2a2a2a",
                        color: "#555",
                        fontSize: 11, fontFamily: "monospace",
                        padding: "7px 14px", borderRadius: 5,
                        cursor: "pointer", transition: "all 0.2s",
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        display: "flex", alignItems: "center", gap: 6,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ff5a00"; e.currentTarget.style.color = "#ff5a00"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#555"; }}
                >
                    ↺ Actualizar
                </button>
            </div>

            {/* Columnas Kanban */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                {(["PENDING", "ACCEPTED", "CANCELLED"] as const).map((status) => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        appointments={appointments.filter((a) => a.status === status)}
                        onChangeStatus={handleStatusChange}
                    />
                ))}
            </div>
        </div>
    );
}
