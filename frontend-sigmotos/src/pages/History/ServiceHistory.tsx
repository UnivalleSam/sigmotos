import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ServiceRecord {
  id: string;
  date: string;
  plate: string;
  bike: string;
  service: string;
  mechanic: string;
  status: "completado" | "en_proceso" | "cancelado";
  cost: number;
  notes?: string;
  duration: string;
}

const MOCK_HISTORY: ServiceRecord[] = [
  {
    id: "TKT-8839",
    date: "15 Mayo, 2026",
    plate: "MT09-X",
    bike: "Yamaha MT-09",
    service: "Cambio Aceite Sintético 10W40",
    mechanic: "Carlos Mendoza",
    status: "completado",
    cost: 90000,
    notes: "Se reemplazó filtro de aceite y se revisó nivel de refrigerante.",
    duration: "30 min",
  },
  {
    id: "TKT-7201",
    date: "10 Abril, 2026",
    plate: "NJA-400",
    bike: "Kawasaki NINJA 400",
    service: "Scanner OBD II + Diagnóstico",
    mechanic: "Andrés Restrepo",
    status: "completado",
    cost: 120000,
    notes: "Sin códigos de error activos. Ajuste de válvulas recomendado para próximo servicio.",
    duration: "45 min",
  },
  {
    id: "TKT-6540",
    date: "22 Marzo, 2026",
    plate: "MT09-X",
    bike: "Yamaha MT-09",
    service: "Mantenimiento General 6,000 km",
    mechanic: "Carlos Mendoza",
    status: "completado",
    cost: 260000,
    notes: "Cambio de aceite, filtros, bujías. Revisión completa de frenos y suspensión.",
    duration: "240 min",
  },
  {
    id: "TKT-5109",
    date: "5 Febrero, 2026",
    plate: "NJA-400",
    bike: "Kawasaki NINJA 400",
    service: "Cambio Pastillas de Freno Brembo",
    mechanic: "Mateo Ortiz",
    status: "completado",
    cost: 220000,
    notes: "Pastillas delanteras y traseras. Se sangró el sistema de frenos.",
    duration: "90 min",
  },
  {
    id: "TKT-4322",
    date: "12 Enero, 2026",
    plate: "NJA-400",
    bike: "Kawasaki NINJA 400",
    service: "Lavado Detallado Premium",
    mechanic: "José Cárdenas",
    status: "completado",
    cost: 40000,
    duration: "60 min",
  },
  {
    id: "TKT-3210",
    date: "30 Noviembre, 2025",
    plate: "MT09-X",
    bike: "Yamaha MT-09",
    service: "Revisión Sistema Eléctrico",
    mechanic: "Valentina Daza",
    status: "cancelado",
    cost: 0,
    notes: "Cliente no se presentó a la cita.",
    duration: "—",
  },
];

const STATUS_CONFIG = {
  completado: { label: "Completado", color: "#4ade80", bg: "#0d2b0d", border: "#1a5c1a" },
  en_proceso: { label: "En proceso", color: "#facc15", bg: "#2b2400", border: "#5c4a00" },
  cancelado: { label: "Cancelado", color: "#f87171", bg: "#2b0d0d", border: "#5c1a1a" },
};

export default function ServiceHistory() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"todos" | "completado" | "en_proceso" | "cancelado">("todos");
  const [filterBike, setFilterBike] = useState("todas");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const bikes = ["todas", ...Array.from(new Set(MOCK_HISTORY.map((r) => r.plate)))];

  const filtered = MOCK_HISTORY.filter((r) => {
    const matchStatus = filter === "todos" || r.status === filter;
    const matchBike = filterBike === "todas" || r.plate === filterBike;
    const matchSearch =
      search === "" ||
      r.service.toLowerCase().includes(search.toLowerCase()) ||
      r.bike.toLowerCase().includes(search.toLowerCase()) ||
      r.mechanic.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchBike && matchSearch;
  });

  const totalGasto = filtered
    .filter((r) => r.status === "completado")
    .reduce((acc, r) => acc + r.cost, 0);

  const totalServicios = MOCK_HISTORY.filter((r) => r.status === "completado").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#080808",
        color: "#e8e8e8",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid #1e1e1e",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          backgroundColor: "#080808",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button
            onClick={() => navigate("/profile")}
            style={{
              background: "none",
              border: "1px solid #2a2a2a",
              color: "#aaa",
              cursor: "pointer",
              padding: "6px 12px",
              fontSize: 13,
              borderRadius: 4,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#ff5a00";
              (e.currentTarget as HTMLButtonElement).style.color = "#ff5a00";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a";
              (e.currentTarget as HTMLButtonElement).style.color = "#aaa";
            }}
          >
            ← Volver
          </button>
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.05em",
              margin: 0,
            }}
          >
            <span style={{ color: "#ff5a00" }}>SIG</span>MOTOS
            <span style={{ color: "#555", fontWeight: 400, fontSize: 14, marginLeft: 12 }}>
              / Historial de Servicios
            </span>
          </h1>
        </div>

        <button
          onClick={() => navigate("/booking")}
          style={{
            backgroundColor: "#ff5a00",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            padding: "9px 20px",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 5,
          }}
        >
          + Nuevo servicio
        </button>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>

        {/* Resumen */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {[
            {
              label: "Servicios completados",
              value: String(totalServicios),
              icon: "✅",
              sub: "Total histórico",
            },
            {
              label: "Gasto total acumulado",
              value: `$${totalGasto.toLocaleString("es-CO")}`,
              icon: "💳",
              sub: "En servicios completados",
            },
            {
              label: "Último servicio",
              value: MOCK_HISTORY[0].date,
              icon: "🗓️",
              sub: MOCK_HISTORY[0].bike,
            },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#111",
                border: "1px solid #1e1e1e",
                borderRadius: 8,
                padding: "20px",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#ff5a00",
                  marginBottom: 2,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: "#e8e8e8", marginBottom: 2 }}>{stat.label}</div>
              <div style={{ fontSize: 11, color: "#555" }}>{stat.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            backgroundColor: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: 8,
            padding: "16px 20px",
            marginBottom: 20,
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Búsqueda */}
          <input
            type="text"
            placeholder="Buscar por servicio, mecánico, ticket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: 200,
              backgroundColor: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: 5,
              padding: "8px 12px",
              color: "#e8e8e8",
              fontSize: 13,
              outline: "none",
            }}
          />

          {/* Filtro por moto */}
          <select
            value={filterBike}
            onChange={(e) => setFilterBike(e.target.value)}
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: 5,
              padding: "8px 12px",
              color: "#e8e8e8",
              fontSize: 13,
              cursor: "pointer",
              outline: "none",
            }}
          >
            {bikes.map((b) => (
              <option key={b} value={b}>
                {b === "todas" ? "Todas las motos" : b}
              </option>
            ))}
          </select>

          {/* Filtro por estado */}
          <div style={{ display: "flex", gap: 6 }}>
            {(["todos", "completado", "en_proceso", "cancelado"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  backgroundColor: filter === s ? "#ff5a00" : "#1a1a1a",
                  border: `1px solid ${filter === s ? "#ff5a00" : "#2a2a2a"}`,
                  color: filter === s ? "#fff" : "#aaa",
                  cursor: "pointer",
                  padding: "7px 14px",
                  fontSize: 12,
                  borderRadius: 4,
                  textTransform: "capitalize",
                  fontWeight: filter === s ? 600 : 400,
                }}
              >
                {s === "todos" ? "Todos" : s === "en_proceso" ? "En proceso" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Lista de registros */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", color: "#444" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20 }}>
              Sin resultados para los filtros aplicados
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((record, i) => {
              const statusCfg = STATUS_CONFIG[record.status];
              const isExpanded = expandedId === record.id;

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  style={{
                    backgroundColor: "#111",
                    border: "1px solid #1e1e1e",
                    borderRadius: 8,
                    overflow: "hidden",
                    transition: "border-color 0.2s",
                  }}
                >
                  {/* Fila principal */}
                  <div
                    style={{
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      cursor: "pointer",
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : record.id)}
                  >
                    {/* Indicador de estado */}
                    <div
                      style={{
                        width: 4,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: statusCfg.color,
                        flexShrink: 0,
                      }}
                    />

                    {/* Ticket ID */}
                    <div style={{ width: 100, flexShrink: 0 }}>
                      <p style={{ margin: 0, fontFamily: "monospace", fontSize: 12, color: "#ff5a00", fontWeight: 600 }}>
                        {record.id}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#555" }}>{record.duration}</p>
                    </div>

                    {/* Fecha */}
                    <div style={{ width: 130, flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, color: "#c8c8c8" }}>{record.date}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#555" }}>{record.plate}</p>
                    </div>

                    {/* Servicio */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {record.service}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "#666" }}>{record.bike}</p>
                    </div>

                    {/* Mecánico */}
                    <div style={{ width: 150, flexShrink: 0, display: "none" }} className="md-show">
                      <p style={{ margin: 0, fontSize: 13, color: "#aaa" }}>{record.mechanic}</p>
                    </div>

                    {/* Costo */}
                    <div style={{ width: 110, flexShrink: 0, textAlign: "right" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          fontWeight: 700,
                          fontFamily: "monospace",
                          color: record.status === "cancelado" ? "#555" : "#e8e8e8",
                          textDecoration: record.status === "cancelado" ? "line-through" : "none",
                        }}
                      >
                        {record.cost === 0 ? "—" : `$${record.cost.toLocaleString("es-CO")}`}
                      </p>
                    </div>

                    {/* Badge */}
                    <div
                      style={{
                        backgroundColor: statusCfg.bg,
                        border: `1px solid ${statusCfg.border}`,
                        color: statusCfg.color,
                        padding: "4px 10px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        flexShrink: 0,
                        minWidth: 90,
                        textAlign: "center",
                      }}
                    >
                      {statusCfg.label}
                    </div>

                    {/* Chevron */}
                    <div
                      style={{
                        color: "#555",
                        fontSize: 12,
                        transition: "transform 0.2s",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        flexShrink: 0,
                      }}
                    >
                      ▼
                    </div>
                  </div>

                  {/* Detalle expandido */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          style={{
                            borderTop: "1px solid #1e1e1e",
                            padding: "20px",
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: 20,
                            backgroundColor: "#0d0d0d",
                          }}
                        >
                          <div>
                            <p style={detailLabel}>Vehículo</p>
                            <p style={detailValue}>{record.bike}</p>
                            <p style={{ ...detailLabel, marginTop: 8 }}>Placa</p>
                            <p style={detailValue}>{record.plate}</p>
                          </div>
                          <div>
                            <p style={detailLabel}>Mecánico asignado</p>
                            <p style={detailValue}>{record.mechanic}</p>
                            <p style={{ ...detailLabel, marginTop: 8 }}>Duración estimada</p>
                            <p style={detailValue}>{record.duration}</p>
                          </div>
                          <div>
                            <p style={detailLabel}>Notas técnicas</p>
                            <p style={{ ...detailValue, color: "#888", fontStyle: "italic" }}>
                              {record.notes || "Sin notas adicionales."}
                            </p>
                          </div>
                        </div>

                        <div
                          style={{
                            backgroundColor: "#0d0d0d",
                            padding: "0 20px 16px",
                            display: "flex",
                            gap: 10,
                          }}
                        >
                          <button
                            onClick={() => navigate("/maintenance")}
                            style={{
                              backgroundColor: "#ff5a0015",
                              border: "1px solid #ff5a0040",
                              color: "#ff5a00",
                              cursor: "pointer",
                              padding: "7px 16px",
                              fontSize: 12,
                              borderRadius: 4,
                              fontWeight: 600,
                            }}
                          >
                            🔍 Ver en mantenimiento
                          </button>
                          <button
                            onClick={() => navigate("/booking")}
                            style={{
                              backgroundColor: "#1a1a1a",
                              border: "1px solid #2a2a2a",
                              color: "#aaa",
                              cursor: "pointer",
                              padding: "7px 16px",
                              fontSize: 12,
                              borderRadius: 4,
                            }}
                          >
                            📅 Repetir servicio
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer con total filtrado */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              marginTop: 20,
              padding: "16px 20px",
              backgroundColor: "#111",
              border: "1px solid #1e1e1e",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#666", fontSize: 13 }}>
              {filtered.length} registro{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 15,
                fontWeight: 700,
                color: "#e8e8e8",
              }}
            >
              Total filtrado:{" "}
              <span style={{ color: "#ff5a00" }}>
                ${filtered
                  .filter((r) => r.status === "completado")
                  .reduce((a, r) => a + r.cost, 0)
                  .toLocaleString("es-CO")} COP
              </span>
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const detailLabel: React.CSSProperties = {
  color: "#555",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  margin: "0 0 4px",
};

const detailValue: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "#c8c8c8",
};
