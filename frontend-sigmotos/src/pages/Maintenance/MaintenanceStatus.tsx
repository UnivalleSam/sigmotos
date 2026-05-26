import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Procedure {
  name: string;
  price: number;
  status: "completed" | "progress" | "pending";
}
interface TimelineStep {
  title: string;
  desc: string;
  time?: string;
  status: "completed" | "active" | "pending";
}
interface TechLog {
  time: string;
  message: string;
}
interface BikeMaintenance {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: string;
  engine: string;
  mileage: string;
  progress: number;
  statusText: string;
  statusType: "reparacion" | "listo" | "diagnostico";
  eta: string;
  mechanic: { name: string; level: string; avatar: string };
  procedures: Procedure[];
  timeline: TimelineStep[];
  logs: TechLog[];
}

const mockDatabase: Record<string, BikeMaintenance> = {
  "NJA-400": {
    id: "SIG-88402-NJA", plate: "NJA-400", brand: "Kawasaki", model: "NINJA 400 SE",
    year: "2022", engine: "399 cc (Bicilíndrico)", mileage: "12,450 km",
    progress: 60, statusText: "Reparación Activa", statusType: "reparacion",
    eta: "Hoy, 5:30 PM (aprox. 2.5 hs)",
    mechanic: { name: "Carlos Mendoza", level: "Técnico Nivel Oro (Especialista Kawa)", avatar: "⚙️" },
    procedures: [
      { name: "Cambio de Aceite 10W40 Liqui Moly sintético", price: 185000, status: "completed" },
      { name: "Sincronización de Motor y Calibración de Válvulas", price: 140000, status: "progress" },
      { name: "Cambio de Filtro de Aire K&N Alto Rendimiento", price: 95000, status: "pending" },
    ],
    timeline: [
      { title: "01. Ingreso y Recepción", desc: "Registro formal de ingreso y checklist estético aprobado sin daños graves.", time: "16/05/2026 09:00 AM", status: "completed" },
      { title: "02. Diagnóstico Técnico", desc: "Scanner OBD II conectado. Desgaste en bujías detectado, compresión estable en 12.8 bar.", time: "16/05/2026 10:15 AM", status: "completed" },
      { title: "03. Servicio y Reparación", desc: "Procedimientos de calibración de motor y reemplazo de consumibles en curso.", time: "16/05/2026 02:30 PM", status: "active" },
      { title: "04. Pruebas de Calidad", desc: "Verificación de gases en dinamómetro y testeo de suspensión en calle.", status: "pending" },
      { title: "05. Listo para Entrega", desc: "Lavado premium de cortesía y reportes del mecánico firmados digitalmente.", status: "pending" },
    ],
    logs: [
      { time: "14:30", message: "Cambio de aceite de motor completado. Filtro cambiado por OEM original." },
      { time: "11:00", message: "Diagnóstico inicial finalizado. Filtro de aire K&N y bujías NGK Iridium preparadas." },
      { time: "09:30", message: "Inspección estética aprobada en bahía de recepción 2." },
    ],
  },
  "MT09-X": {
    id: "SIG-91104-MTO", plate: "MT09-X", brand: "Yamaha", model: "MT-09 Hypernaked",
    year: "2023", engine: "890 cc (Tricilíndrico CP3)", mileage: "8,320 km",
    progress: 100, statusText: "Listo para Retiro", statusType: "listo",
    eta: "Listo para entrega inmediata",
    mechanic: { name: "Andrés Restrepo", level: "Especialista Master Yamaha Hypernaked", avatar: "⚡" },
    procedures: [
      { name: "Pastillas de Freno Brembo Sinterizadas traseras", price: 220000, status: "completed" },
      { name: "Ajuste, Tensión y Lubricación de Cadena", price: 45000, status: "completed" },
      { name: "Mantenimiento Preventivo Horquilla Delantera", price: 180000, status: "completed" },
    ],
    timeline: [
      { title: "01. Ingreso y Recepción", desc: "Unidad ingresada por desgaste de frenada y mantenimiento periódico.", time: "15/05/2026 08:30 AM", status: "completed" },
      { title: "02. Diagnóstico Técnico", desc: "Validación de espesor de discos y recalibración electrónica.", time: "15/05/2026 09:45 AM", status: "completed" },
      { title: "03. Servicio y Reparación", desc: "Reemplazo de pastillas Brembo e inspección hidráulica finalizada.", time: "15/05/2026 11:30 AM", status: "completed" },
      { title: "04. Pruebas de Calidad", desc: "Prueba de ruta completada. Excelente respuesta de frenado.", time: "15/05/2026 02:00 PM", status: "completed" },
      { title: "05. Listo para Entrega", desc: "Lavado detallado completado. Documentación firmada.", time: "15/05/2026 03:15 PM", status: "completed" },
    ],
    logs: [
      { time: "15:15", message: "Lavado premium terminado. Motocicleta movida a la zona de entregas." },
      { time: "14:00", message: "Prueba de ruta exitosa. Sin fallas de suspensión." },
      { time: "11:30", message: "Instalación de pastillas Brembo finalizada." },
    ],
  },
  "RC-200": {
    id: "SIG-37421-KTM", plate: "RC-200", brand: "KTM", model: "RC 200 GP",
    year: "2024", engine: "199.5 cc (Monocilíndrico)", mileage: "4,100 km",
    progress: 20, statusText: "Diagnóstico Inicial", statusType: "diagnostico",
    eta: "Mañana, 12:00 PM",
    mechanic: { name: "Mateo Ortiz", level: "Técnico KTM Ready to Race Certificado", avatar: "🏁" },
    procedures: [
      { name: "Diagnóstico de Campana y Discos de Embrague", price: 60000, status: "progress" },
      { name: "Kit de Discos de Embrague OEM KTM", price: 240000, status: "pending" },
      { name: "Cambio de Aceite Motul 7100 y Filtros", price: 110000, status: "pending" },
    ],
    timeline: [
      { title: "01. Ingreso y Recepción", desc: "Ingreso con reporte de tironeo al acoplar embrague.", time: "16/05/2026 04:30 PM", status: "completed" },
      { title: "02. Diagnóstico Técnico", desc: "Desmontaje de tapa lateral para medición de discos de fricción.", time: "16/05/2026 05:00 PM", status: "active" },
      { title: "03. Servicio y Reparación", desc: "Sustitución de componentes según diagnóstico.", status: "pending" },
      { title: "04. Pruebas de Calidad", desc: "Comprobación de torque y acople en rodillos.", status: "pending" },
      { title: "05. Listo para Entrega", desc: "Limpieza final y entrega formal.", status: "pending" },
    ],
    logs: [
      { time: "17:00", message: "Tapa lateral embrague removida. Desgaste fuera de rango en discos centrales." },
      { time: "16:30", message: "Vehículo en rampa de diagnóstico 4 asignado a Mateo Ortiz." },
    ],
  },
};

const STATUS_COLOR = {
  reparacion: "#ff5a00",
  listo: "#4ade80",
  diagnostico: "#60a5fa",
};

export default function MaintenanceStatus() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedData, setSelectedData] = useState<BikeMaintenance | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleSearch = (plateCode: string) => {
    if (!plateCode.trim()) { setSearchError("Ingresa una placa o código."); return; }
    const cleanPlate = plateCode.trim().toUpperCase();
    setSearchError("");
    setIsSearching(true);
    setBootLogs([]);
    const logs = [
      "INICIALIZANDO COMUNICACIÓN CON BASE DE DATOS...",
      "CONEXIÓN CON ESTACIÓN DE MANTENIMIENTO: ACTIVA",
      `BUSCANDO PLACA: [ ${cleanPlate} ]...`,
      "DATOS ENCONTRADOS. CARGANDO TELEMETRÍA...",
      "INICIALIZACIÓN COMPLETA.",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) { setBootLogs((prev) => [...prev, logs[i]]); i++; }
      else {
        clearInterval(interval);
        setTimeout(() => {
          const match = mockDatabase[cleanPlate];
          if (match) { setSelectedData(match); }
          else { setSearchError(`Sin registro para "${cleanPlate}". Prueba: NJA-400, MT09-X, RC-200.`); setSelectedData(null); }
          setIsSearching(false);
        }, 500);
      }
    }, 220);
  };

  const handleSimulateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => { setIsGeneratingReport(false); setShowReportModal(true); }, 1400);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080808", color: "#e8e8e8", fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <header style={{
        borderBottom: "1px solid #1e1e1e", padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, backgroundColor: "#080808", zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={() => navigate("/home")} style={backBtnStyle}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ff5a00"; (e.currentTarget as HTMLButtonElement).style.color = "#ff5a00"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLButtonElement).style.color = "#aaa"; }}>
            ← Volver
          </button>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: "0.05em", margin: 0 }}>
            <span style={{ color: "#ff5a00" }}>SIG</span>MOTOS
            <span style={{ color: "#555", fontWeight: 400, fontSize: 14, marginLeft: 12 }}>/ Estado de Mantenimiento</span>
          </h1>
        </div>
        {selectedData && (
          <button onClick={() => { setSelectedData(null); setSearchQuery(""); }} style={backBtnStyle}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ff5a00"; (e.currentTarget as HTMLButtonElement).style.color = "#ff5a00"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLButtonElement).style.color = "#aaa"; }}>
            Consultar otra moto
          </button>
        )}
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        <AnimatePresence mode="wait">

          {/* ── BÚSQUEDA ── */}
          {!selectedData && (
            <motion.div key="search" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
              style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 48, alignItems: "center" }}>

              {/* Left: título */}
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "#ff5a0015", border: "1px solid #ff5a0030", borderRadius: 4, padding: "5px 12px", marginBottom: 24 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#ff5a00", display: "inline-block" }} />
                  <span style={{ color: "#ff5a00", fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Consulta en tiempo real</span>
                </div>
                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 52, fontWeight: 800, lineHeight: 1.05, margin: "0 0 16px", letterSpacing: "0.01em" }}>
                  ESTADO DE<br /><span style={{ color: "#ff5a00" }}>MANTENIMIENTO</span>
                </h1>
                <p style={{ color: "#555", fontSize: 14, lineHeight: 1.7, maxWidth: 380, margin: "0 0 40px" }}>
                  Ingresa la placa de tu motocicleta para ver el progreso mecánico, diagnóstico y logs del taller en tiempo real.
                </p>
                <div style={{ display: "flex", gap: 40, paddingTop: 24, borderTop: "1px solid #1a1a1a" }}>
                  {[{ v: "12", l: "Bahías activas" }, { v: "27 min", l: "Resp. promedio" }, { v: "99.8%", l: "Fiabilidad" }].map((s, i) => (
                    <div key={i}>
                      <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 700, color: i === 1 ? "#ff5a00" : "#e8e8e8", margin: 0 }}>{s.v}</p>
                      <p style={{ fontSize: 11, color: "#555", margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: search box */}
              <div style={{ backgroundColor: "#111", border: "1px solid #1e1e1e", borderRadius: 8, padding: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #1a1a1a" }}>
                  <span style={{ color: "#555", fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Estación de búsqueda</span>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#4ade80", display: "inline-block" }} />
                </div>

                {!isSearching ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                        Placa o código vehicular
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: NJA-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                        style={{ width: "100%", backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 5, padding: "13px 16px", color: "#e8e8e8", fontSize: 18, fontFamily: "monospace", textTransform: "uppercase", outline: "none", boxSizing: "border-box", letterSpacing: "0.1em" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#ff5a00")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
                      />
                      {searchError && <p style={{ color: "#f87171", fontSize: 12, marginTop: 6, fontFamily: "monospace" }}>⚠ {searchError}</p>}
                    </div>

                    <button onClick={() => handleSearch(searchQuery)}
                      style={{ backgroundColor: "#ff5a00", border: "none", color: "#fff", padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer", borderRadius: 5, width: "100%", transition: "background 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ff7a2a")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff5a00")}>
                      Consultar estado →
                    </button>

                    <div style={{ paddingTop: 16, borderTop: "1px solid #1a1a1a" }}>
                      <p style={{ color: "#444", fontSize: 11, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>Demos rápidos</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        {[
                          { plate: "NJA-400", status: "Reparación", color: "#ff5a00" },
                          { plate: "MT09-X", status: "Listo", color: "#4ade80" },
                          { plate: "RC-200", status: "Diagnóstico", color: "#60a5fa" },
                        ].map((d) => (
                          <button key={d.plate} onClick={() => { setSearchQuery(d.plate); handleSearch(d.plate); }}
                            style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 4, padding: "10px 6px", cursor: "pointer", textAlign: "center", transition: "border-color 0.2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = d.color)}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}>
                            <p style={{ color: "#c8c8c8", fontSize: 12, fontFamily: "monospace", margin: 0, fontWeight: 600 }}>{d.plate}</p>
                            <p style={{ color: d.color, fontSize: 10, margin: "3px 0 0", textTransform: "uppercase" }}>{d.status}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 4, padding: 20, minHeight: 200, fontFamily: "monospace", fontSize: 12 }}>
                    {bootLogs.map((log, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        style={{ display: "flex", gap: 8, marginBottom: 8, color: i === bootLogs.length - 1 ? "#ff5a00" : "#555" }}>
                        <span>&gt;</span><span>{log}</span>
                      </motion.div>
                    ))}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 12, borderTop: "1px solid #1a1a1a" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#ff5a00", display: "inline-block", animation: "ping 1s infinite" }} />
                      <span style={{ color: "#ff5a00", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em" }}>Conectando telemetría...</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── RESULTADOS ── */}
          {selectedData && (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>

              {/* Columna izquierda */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Gauge card */}
                <div style={{ backgroundColor: "#111", border: "1px solid #1e1e1e", borderRadius: 8, padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <span style={{ color: "#ff5a00", fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.07em" }}>Telemetría</span>
                    <span style={{ color: "#444", fontSize: 11, fontFamily: "monospace" }}>#{selectedData.id}</span>
                  </div>

                  {/* SVG Gauge */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                    <div style={{ position: "relative", width: 140, height: 140 }}>
                      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="70" cy="70" r="56" stroke="#1a1a1a" strokeWidth="8" fill="transparent" />
                        <motion.circle cx="70" cy="70" r="56" stroke={STATUS_COLOR[selectedData.statusType]}
                          strokeWidth="8" fill="transparent" strokeDasharray={352}
                          initial={{ strokeDashoffset: 352 }}
                          animate={{ strokeDashoffset: 352 - (352 * selectedData.progress) / 100 }}
                          transition={{ duration: 1.4, ease: "easeOut" }} strokeLinecap="round" />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, fontWeight: 800, color: "#e8e8e8", lineHeight: 1 }}>{selectedData.progress}%</span>
                        <span style={{ fontSize: 10, color: "#555", textTransform: "uppercase", marginTop: 2 }}>Completado</span>
                      </div>
                    </div>
                  </div>

                  {/* ETA */}
                  <div style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 5, padding: "12px 16px", textAlign: "center", marginBottom: 20 }}>
                    <p style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 4px" }}>Entrega estimada</p>
                    <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, color: STATUS_COLOR[selectedData.statusType], margin: 0 }}>{selectedData.eta}</p>
                  </div>

                  {/* Specs */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12, fontFamily: "monospace" }}>
                    {[
                      ["Moto", `${selectedData.brand} ${selectedData.model}`],
                      ["Placa", selectedData.plate],
                      ["Año", selectedData.year],
                      ["Motor", selectedData.engine],
                      ["Km", selectedData.mileage],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#555", textTransform: "uppercase", fontSize: 10 }}>{k}</span>
                        <span style={{ color: k === "Placa" ? "#ff5a00" : "#c8c8c8", fontWeight: 600, fontSize: 11 }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#555", textTransform: "uppercase", fontSize: 10 }}>Estado</span>
                      <span style={{ backgroundColor: STATUS_COLOR[selectedData.statusType] + "20", border: `1px solid ${STATUS_COLOR[selectedData.statusType]}40`, color: STATUS_COLOR[selectedData.statusType], fontSize: 10, padding: "2px 8px", borderRadius: 3, fontWeight: 700 }}>{selectedData.statusText}</span>
                    </div>
                  </div>
                </div>

                {/* Mecánico */}
                <div style={{ backgroundColor: "#111", border: "1px solid #1e1e1e", borderRadius: 8, padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{selectedData.mechanic.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 3px" }}>Mecánico asignado</p>
                    <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, margin: 0 }}>{selectedData.mechanic.name}</p>
                    <p style={{ color: "#666", fontSize: 11, margin: "2px 0 0" }}>{selectedData.mechanic.level}</p>
                  </div>
                </div>
              </div>

              {/* Columna derecha */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Timeline */}
                <div style={{ backgroundColor: "#111", border: "1px solid #1e1e1e", borderRadius: 8, padding: 28 }}>
                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, margin: "0 0 24px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 3, height: 18, backgroundColor: "#ff5a00", display: "inline-block", borderRadius: 2 }} />
                    Progreso del servicio
                  </h3>
                  <div style={{ position: "relative", paddingLeft: 32 }}>
                    <div style={{ position: "absolute", left: 11, top: 4, bottom: 4, width: 2, backgroundColor: "#1a1a1a" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                      {selectedData.timeline.map((step, i) => (
                        <div key={i} style={{ position: "relative" }}>
                          <div style={{
                            position: "absolute", left: -21, top: 2, width: 22, height: 22, borderRadius: 4,
                            backgroundColor: step.status === "completed" ? "#4ade80" : step.status === "active" ? "#ff5a00" : "#111",
                            border: `2px solid ${step.status === "completed" ? "#4ade80" : step.status === "active" ? "#ff5a00" : "#2a2a2a"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, fontWeight: 700, color: step.status === "pending" ? "#555" : "#000",
                            zIndex: 1,
                          }}>
                            {step.status === "completed" ? "✓" : i + 1}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 4 }}>
                            <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, margin: 0, color: step.status === "completed" ? "#e8e8e8" : step.status === "active" ? "#ff5a00" : "#333", letterSpacing: "0.03em" }}>{step.title}</h4>
                            {step.time && <span style={{ color: "#444", fontSize: 10, fontFamily: "monospace", flexShrink: 0 }}>{step.time}</span>}
                          </div>
                          <p style={{ color: step.status === "pending" ? "#333" : "#666", fontSize: 12, margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Procedimientos */}
                <div style={{ backgroundColor: "#111", border: "1px solid #1e1e1e", borderRadius: 8, padding: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 3, height: 18, backgroundColor: "#ff5a00", display: "inline-block", borderRadius: 2 }} />
                      Procedimientos ejecutados
                    </h3>
                    <span style={{ color: "#444", fontSize: 11, fontFamily: "monospace", textTransform: "uppercase" }}>Orden de servicio</span>
                  </div>

                  <div style={{ border: "1px solid #1a1a1a", borderRadius: 5, overflow: "hidden" }}>
                    {selectedData.procedures.map((proc, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", backgroundColor: "#0d0d0d", borderBottom: i < selectedData.procedures.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 16 }}>{proc.status === "completed" ? "✅" : proc.status === "progress" ? "⚙️" : "💤"}</span>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: "#c8c8c8" }}>{proc.name}</p>
                            <p style={{ fontSize: 10, color: proc.status === "completed" ? "#4ade80" : proc.status === "progress" ? "#ff5a00" : "#444", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              {proc.status === "completed" ? "Completado" : proc.status === "progress" ? "En curso" : "Pendiente"}
                            </p>
                          </div>
                        </div>
                        <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#e8e8e8" }}>${proc.price.toLocaleString("es-CO")}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", backgroundColor: "#111", borderTop: "2px solid #2a2a2a" }}>
                      <span style={{ fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total estimado</span>
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: "#ff5a00" }}>
                        ${selectedData.procedures.reduce((a, p) => a + p.price, 0).toLocaleString("es-CO")} COP
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                    <button onClick={handleSimulateReport} disabled={isGeneratingReport}
                      style={{ backgroundColor: isGeneratingReport ? "#1a1a1a" : "#ff5a00", border: "none", color: isGeneratingReport ? "#555" : "#fff", padding: "11px 24px", fontSize: 13, fontWeight: 600, cursor: isGeneratingReport ? "not-allowed" : "pointer", borderRadius: 5, transition: "background 0.2s" }}
                      onMouseEnter={(e) => { if (!isGeneratingReport) (e.currentTarget.style.backgroundColor = "#ff7a2a"); }}
                      onMouseLeave={(e) => { if (!isGeneratingReport) (e.currentTarget.style.backgroundColor = "#ff5a00"); }}>
                      {isGeneratingReport ? "Generando..." : "Descargar reporte PDF →"}
                    </button>
                  </div>
                </div>

                {/* Terminal logs */}
                <div style={{ backgroundColor: "#111", border: "1px solid #1e1e1e", borderRadius: 8, padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 3, height: 18, backgroundColor: "#ff5a00", display: "inline-block", borderRadius: 2 }} />
                      Log técnico
                    </h3>
                    <span style={{ backgroundColor: "#3d1212", border: "1px solid #5c1a1a", color: "#f87171", fontSize: 10, padding: "2px 8px", borderRadius: 3, fontFamily: "monospace", textTransform: "uppercase" }}>Live</span>
                  </div>
                  <div style={{ backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 5, padding: 16, fontFamily: "monospace", fontSize: 12, maxHeight: 180, overflowY: "auto" }}>
                    {selectedData.logs.map((log, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                        <span style={{ color: "#ff5a00", flexShrink: 0 }}>[{log.time}]</span>
                        <p style={{ color: "#666", margin: 0, lineHeight: 1.5, fontSize: 11 }}>{log.message}</p>
                      </div>
                    ))}
                    <div style={{ color: "#333", fontSize: 11, paddingTop: 8, borderTop: "1px solid #1a1a1a" }}>
                      &gt; Esperando entradas del sensor central...
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal reporte */}
      <AnimatePresence>
        {showReportModal && selectedData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24, overflowY: "auto" }}
            onClick={() => setShowReportModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: "#fff", color: "#111", padding: "40px", maxWidth: 700, width: "100%", borderTop: "6px solid #ff5a00", borderRadius: 2, position: "relative", margin: "32px auto" }}>
              <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8 }}>
                <button onClick={() => window.print()} style={{ backgroundColor: "#111", border: "none", color: "#fff", padding: "6px 14px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Imprimir</button>
                <button onClick={() => setShowReportModal(false)} style={{ backgroundColor: "#eee", border: "none", color: "#555", padding: "6px 14px", fontSize: 11, cursor: "pointer" }}>Cerrar</button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #111", paddingBottom: 20, marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, margin: 0 }}>SIG<span style={{ color: "#ff5a00" }}>MOTOS</span></h2>
                  <p style={{ fontSize: 10, color: "#999", margin: "4px 0 0", fontFamily: "monospace", textTransform: "uppercase" }}>Gestión profesional de talleres</p>
                  <p style={{ fontSize: 11, color: "#666", margin: "2px 0 0" }}>Calle 13 # 44-92, Cali · Tel: (602) 485-9000</p>
                </div>
                <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: 11 }}>
                  <div style={{ backgroundColor: "#111", color: "#fff", padding: "4px 10px", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Reporte de servicio</div>
                  <p style={{ color: "#999", margin: "6px 0 0" }}>OS: {selectedData.id}</p>
                  <p style={{ color: "#999" }}>Fecha: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, backgroundColor: "#f9f9f9", padding: 16, border: "1px solid #eee", marginBottom: 20, fontFamily: "monospace", fontSize: 11 }}>
                <div>
                  <p style={{ fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #eee", paddingBottom: 6, marginBottom: 8 }}>Datos de la moto</p>
                  {[["Marca/Modelo", `${selectedData.brand} ${selectedData.model}`], ["Placa", selectedData.plate], ["Año", selectedData.year], ["Motor", selectedData.engine], ["Kilometraje", selectedData.mileage]].map(([k, v]) => (
                    <p key={k} style={{ margin: "4px 0" }}><span style={{ color: "#999" }}>{k}:</span> {v}</p>
                  ))}
                </div>
                <div>
                  <p style={{ fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #eee", paddingBottom: 6, marginBottom: 8 }}>Datos técnicos</p>
                  {[["Técnico", selectedData.mechanic.name], ["Especialidad", selectedData.mechanic.level], ["Estado", `${selectedData.statusText} (${selectedData.progress}%)`], ["Entrega", selectedData.eta]].map(([k, v]) => (
                    <p key={k} style={{ margin: "4px 0" }}><span style={{ color: "#999" }}>{k}:</span> {v}</p>
                  ))}
                </div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: 11, marginBottom: 16 }}>
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0", textTransform: "uppercase" }}>
                    <th style={{ padding: "8px 10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Procedimiento</th>
                    <th style={{ padding: "8px 10px", textAlign: "center", borderBottom: "1px solid #ddd" }}>Estado</th>
                    <th style={{ padding: "8px 10px", textAlign: "right", borderBottom: "1px solid #ddd" }}>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedData.procedures.map((p, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "8px 10px" }}>{p.name}</td>
                      <td style={{ padding: "8px 10px", textAlign: "center", fontWeight: 700, textTransform: "uppercase" }}>{p.status === "completed" ? "✓ Completado" : p.status === "progress" ? "⚙ En proceso" : "Pendiente"}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right" }}>${p.price.toLocaleString("es-CO")} COP</td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: "2px solid #111", fontWeight: 700 }}>
                    <td colSpan={2} style={{ padding: "10px 10px", textTransform: "uppercase" }}>Total liquidado estimado</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", color: "#ff5a00", fontSize: 15 }}>${selectedData.procedures.reduce((a, p) => a + p.price, 0).toLocaleString("es-CO")} COP</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 32, borderTop: "1px solid #eee", fontFamily: "monospace", fontSize: 10, color: "#999" }}>
                <div style={{ textAlign: "center", width: 160 }}>
                  <div style={{ height: 32, borderBottom: "1px solid #111", marginBottom: 6 }} />
                  <p style={{ fontWeight: 700, color: "#111", textTransform: "uppercase", margin: 0 }}>{selectedData.mechanic.name}</p>
                  <p style={{ margin: 0 }}>Firma Técnico</p>
                </div>
                <div style={{ textAlign: "center", width: 160 }}>
                  <div style={{ height: 32, borderBottom: "1px solid #111", marginBottom: 6 }} />
                  <p style={{ fontWeight: 700, color: "#111", textTransform: "uppercase", margin: 0 }}>Aprobado Cliente</p>
                  <p style={{ margin: 0 }}>Firma de recepción</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const backBtnStyle: React.CSSProperties = {
  background: "none", border: "1px solid #2a2a2a", color: "#aaa",
  cursor: "pointer", padding: "6px 14px", fontSize: 13, borderRadius: 4, transition: "all 0.2s",
};
