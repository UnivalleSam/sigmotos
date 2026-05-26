import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ── INTERFACES ───────────────────────────────────────────────
interface Appointment {
  id: string;
  customer: string;
  bike: string;
  date: string;
  time: string;
  service: string;
  price: number;
  mechanic: string;
  status: "agendada" | "taller" | "completada";
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: "Mecánico" | "Administrador" | "Recepcionista";
  specialty: string;
  activeTask?: string;
  status: "disponible" | "ocupado" | "ausente";
}

interface SparePart {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  location: string;
}

interface FinanceReceipt {
  id: string;
  customer: string;
  service: string;
  date: string;
  amount: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"citas" | "personal" | "finanzas" | "inventario" | "reportes">("citas");

  // ── ESTADO 1: CONTROL DE CITAS ───────────────────
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "TKT-3829", customer: "Juan Pérez", bike: "Kawasaki Ninja 400", date: "17 Mayo, 2026", time: "08:00 AM", service: "Mantenimiento General", price: 260000, mechanic: "Carlos Mendoza", status: "agendada" },
    { id: "TKT-4920", customer: "Sofía Gómez", bike: "Yamaha MT-09", date: "17 Mayo, 2026", time: "10:30 AM", service: "Pastillas de Freno Brembo", price: 220000, mechanic: "Andrés Restrepo", status: "taller" },
    { id: "TKT-1182", customer: "Mauricio Restrepo", bike: "KTM RC 200", date: "18 Mayo, 2026", time: "02:00 PM", service: "Diagnóstico Embrague", price: 60000, mechanic: "Mateo Ortiz", status: "agendada" },
    { id: "TKT-8839", customer: "Natalia Velez", bike: "Suzuki Gixxer 150", date: "15 Mayo, 2026", time: "04:30 PM", service: "Cambio Aceite Sintético", price: 90000, mechanic: "Carlos Mendoza", status: "completada" },
  ]);
  const [assigningTktId, setAssigningTktId] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, newStatus: Appointment["status"]) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };
  const handleReassignMechanic = (id: string, newMechanic: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, mechanic: newMechanic } : a));
    setAssigningTktId(null);
  };

  // ── ESTADO 2: CONTROL DE PERSONAL ────────────────
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "EMP-01", name: "Carlos Mendoza", email: "carlos.m@sigmotos.com", role: "Mecánico", specialty: "Especialista Kawasaki", activeTask: "TKT-3829", status: "ocupado" },
    { id: "EMP-02", name: "Andrés Restrepo", email: "andres.r@sigmotos.com", role: "Mecánico", specialty: "Master Yamaha CP3", activeTask: "TKT-4920", status: "ocupado" },
    { id: "EMP-03", name: "Mateo Ortiz", email: "mateo.o@sigmotos.com", role: "Mecánico", specialty: "Técnico KTM GP", activeTask: "Ninguna", status: "disponible" },
    { id: "EMP-04", name: "Valentina Daza", email: "valentina@sigmotos.com", role: "Recepcionista", specialty: "Atención al Cliente", activeTask: "Buzón de Citas", status: "disponible" },
    { id: "EMP-05", name: "José Cárdenas", email: "jose.admin@sigmotos.com", role: "Administrador", specialty: "Gestión General", activeTask: "Auditoría Activa", status: "disponible" },
  ]);
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpEmail, setNewEmpEmail] = useState("");
  const [newEmpRole, setNewEmpRole] = useState<Employee["role"]>("Mecánico");
  const [newEmpSpec, setNewEmpSpec] = useState("");
  const [personalError, setPersonalError] = useState("");

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpEmail.trim() || !newEmpSpec.trim()) {
      setPersonalError("Por favor complete todos los campos.");
      return;
    }
    setPersonalError("");
    const newEmp: Employee = {
      id: `EMP-${Math.floor(10 + Math.random() * 90)}`,
      name: newEmpName.trim(), email: newEmpEmail.trim(),
      role: newEmpRole, specialty: newEmpSpec.trim(),
      activeTask: "Ninguna", status: "disponible",
    };
    setEmployees(prev => [...prev, newEmp]);
    setNewEmpName(""); setNewEmpEmail(""); setNewEmpSpec("");
  };
  const handleDeleteEmployee = (id: string) => setEmployees(prev => prev.filter(e => e.id !== id));

  // ── ESTADO 3: CONTROL DE INVENTARIO ────────────────
  const [parts, setParts] = useState<SparePart[]>([
    { id: "PRT-902", name: "Pastillas Freno Brembo traseras", category: "Frenos", price: 220000, stock: 5, location: "Bahía Estantería A3" },
    { id: "PRT-347", name: "Aceite Líqui Moly 10W40 1L", category: "Lubricantes", price: 85000, stock: 24, location: "Bahía Estantería B1" },
    { id: "PRT-511", name: "Filtro Aire K&N Ninja 400", category: "Filtros", price: 95000, stock: 4, location: "Bahía Estantería A1" },
    { id: "PRT-119", name: "Bujía NGK Iridium CPR8EA", category: "Eléctrico", price: 35000, stock: 42, location: "Bahía Estantería C2" },
  ]);
  const [newPartName, setNewPartName] = useState("");
  const [newPartCategory, setNewPartCategory] = useState("Repuestos");
  const [newPartPrice, setNewPartPrice] = useState("");
  const [newPartStock, setNewPartStock] = useState("");
  const [newPartLoc, setNewPartLoc] = useState("");
  const [inventoryError, setInventoryError] = useState("");

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim() || !newPartPrice || !newPartStock || !newPartLoc.trim()) {
      setInventoryError("Complete todos los campos del repuesto.");
      return;
    }
    setInventoryError("");
    const newPart: SparePart = {
      id: `PRT-${Math.floor(100 + Math.random() * 899)}`,
      name: newPartName.trim(), category: newPartCategory,
      price: parseFloat(newPartPrice), stock: parseInt(newPartStock), location: newPartLoc.trim(),
    };
    setParts(prev => [...prev, newPart]);
    setNewPartName(""); setNewPartPrice(""); setNewPartStock(""); setNewPartLoc("");
  };
  const handleRestock = (id: string) => setParts(prev => prev.map(p => p.id === id ? { ...p, stock: p.stock + 10 } : p));

  // ── ESTADO 4: CONTROL FINANCIERO ───────────────
  const [financeReceipts] = useState<FinanceReceipt[]>([
    { id: "REC-9948", customer: "Sofía Gómez", service: "Pastillas Brembo + Suspensión", date: "15 Mayo, 2026", amount: 445000 },
    { id: "REC-3382", customer: "Juan Pérez", service: "Mantenimiento General", date: "16 Mayo, 2026", amount: 260000 },
    { id: "REC-1180", customer: "Natalia Velez", service: "Aceite Sintético Suzuki", date: "16 Mayo, 2026", amount: 90000 },
    { id: "REC-5401", customer: "David Cardona", service: "Sincronización Electrónica", date: "16 Mayo, 2026", amount: 140000 },
  ]);
  const [financeSearch, setFinanceSearch] = useState("");
  const totalEarnings = financeReceipts.reduce((acc, r) => acc + r.amount, 0);

  // ── ESTADO 5: REPORTES ────────────────────────
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = (title: string, type: "citas" | "finanzas" | "inventario") => {
    setIsGenerating(true);
    setReportTitle(title);
    setTimeout(() => {
      setIsGenerating(false);
      setShowReportModal(true);
      if (type === "citas") setReportContent(appointments);
      else if (type === "finanzas") setReportContent(financeReceipts);
      else setReportContent(parts);
    }, 1200);
  };

  const NAV_ITEMS = [
    { id: "citas", label: "Control de Citas", icon: "🗓️", count: appointments.filter(a => a.status !== "completada").length },
    { id: "personal", label: "Personal & Técnicos", icon: "👤", count: employees.length },
    { id: "finanzas", label: "Finanzas & Ganancias", icon: "📊", count: null },
    { id: "inventario", label: "Inventario Repuestos", icon: "📦", count: parts.filter(p => p.stock < 10).length },
    { id: "reportes", label: "Auditoría & Reportes", icon: "📋", count: null },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#080808", color: "#e8e8e8", fontFamily: "'Inter', sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 260, backgroundColor: "#0d0d0d", borderRight: "1px solid #1e1e1e", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>

        {/* Logo */}
        <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid #1e1e1e" }}>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "0.02em", margin: "0 0 8px", color: "#e8e8e8", lineHeight: 1 }}>
            <span style={{ color: "#ff5a00" }}>SIG</span>MOTOS
          </h1>
          <span style={{ backgroundColor: "rgba(255,90,0,0.1)", border: "1px solid rgba(255,90,0,0.3)", color: "#ff5a00", fontSize: 9, fontFamily: "monospace", padding: "2px 8px", letterSpacing: "0.12em", textTransform: "uppercase" as const, display: "inline-block" }}>
            Admin HUD
          </span>
        </div>

        {/* Operator Cockpit */}
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #1e1e1e" }}>
          <p style={{ color: "#444", fontSize: 9, fontFamily: "monospace", textTransform: "uppercase" as const, letterSpacing: "0.1em", margin: "0 0 4px" }}>OPERADOR ACTIVO</p>
          <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, fontWeight: 700, color: "#e8e8e8", textTransform: "uppercase" as const, letterSpacing: "0.04em", margin: "0 0 2px" }}>José Cárdenas</h4>
          <p style={{ color: "#ff5a00", fontSize: 10, fontFamily: "monospace", margin: "0 0 12px" }}>ID: ADMIN-SYS-01</p>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#4ade80", display: "inline-block", flexShrink: 0 }}
            />
            <span style={{ color: "#4ade80", fontSize: 9, fontFamily: "monospace", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Sistema Online</span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "12px 0", flex: 1 }}>
          {NAV_ITEMS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 24px",
                background: activeTab === tab.id ? "rgba(255,90,0,0.07)" : "transparent",
                border: "none", borderLeft: `2px solid ${activeTab === tab.id ? "#ff5a00" : "transparent"}`,
                color: activeTab === tab.id ? "#ff5a00" : "#555",
                fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const,
                letterSpacing: "0.07em", cursor: "pointer", textAlign: "left" as const, transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = "#aaa"; }}
              onMouseLeave={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = "#555"; }}
            >
              <span style={{ fontSize: 13 }}>{tab.icon}</span>
              <span style={{ flex: 1 }}>{tab.label}</span>
              {tab.count !== null && tab.count > 0 && (
                <span style={{
                  backgroundColor: activeTab === tab.id ? "rgba(255,90,0,0.2)" : tab.id === "inventario" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.07)",
                  color: activeTab === tab.id ? "#ff5a00" : tab.id === "inventario" ? "#f87171" : "#666",
                  fontSize: 9, fontFamily: "monospace", padding: "2px 6px", borderRadius: 3,
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #1e1e1e" }}>
          <button
            onClick={() => navigate("/login")}
            style={{ width: "100%", backgroundColor: "transparent", border: "1px dashed #2a2a2a", color: "#555", padding: "10px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", cursor: "pointer", borderRadius: 4, transition: "all 0.2s", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#ff5a00"; b.style.color = "#ff5a00"; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#2a2a2a"; b.style.color = "#555"; }}
          >
            <span>Cerrar Sesión</span>
            <span>⇁</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, padding: "48px 48px 64px", overflowY: "auto", minWidth: 0 }}>

        {/* KPI CARDS */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
          {/* Ingresos */}
          <div style={{ ...kpiCard, borderBottom: "3px solid #ff5a00" }}>
            <span style={kpiLabel}>Ingresos Estimados</span>
            <p style={{ ...kpiNum, color: "#e8e8e8" }}>${totalEarnings.toLocaleString("es-CO")}</p>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: "#444", margin: "2px 0 8px" }}>COP</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 700 }}>↑ +14.2%</span>
              <span style={{ color: "#333", fontSize: 10, fontFamily: "monospace" }}>esta semana</span>
            </div>
          </div>

          {/* Eficiencia */}
          <div style={{ ...kpiCard, borderBottom: "3px solid #333" }}>
            <span style={kpiLabel}>Eficiencia Bahías</span>
            <p style={{ ...kpiNum, color: "#e8e8e8" }}>92.4%</p>
            <div style={{ width: "100%", height: 4, backgroundColor: "#1a1a1a", borderRadius: 2, marginTop: 12 }}>
              <div style={{ width: "92.4%", height: "100%", backgroundColor: "#555", borderRadius: 2 }} />
            </div>
            <div style={{ color: "#444", fontSize: 10, fontFamily: "monospace", marginTop: 8 }}>5 Bahías Activas</div>
          </div>

          {/* Repuestos Críticos */}
          <div style={{ ...kpiCard, borderBottom: "3px solid rgba(239,68,68,0.6)" }}>
            <span style={kpiLabel}>Repuestos Críticos</span>
            <motion.p
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ ...kpiNum, color: "#ff5a00" }}
            >
              {parts.filter(p => p.stock < 10).length} ALERTA
            </motion.p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
              <motion.span animate={{ scale: [1, 1.4, 1], opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#ef4444", display: "inline-block", flexShrink: 0 }} />
              <span style={{ color: "#f87171", fontSize: 10, fontFamily: "monospace" }}>Stock bajo · acción requerida</span>
            </div>
          </div>

          {/* Citas de hoy */}
          <div style={{ ...kpiCard, borderBottom: "3px solid #333" }}>
            <span style={kpiLabel}>Citas de Hoy</span>
            <p style={{ ...kpiNum, color: "#e8e8e8" }}>
              {appointments.filter(a => a.status === "agendada" || a.status === "taller").length} ACTIVAS
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
                style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#ff5a00", display: "inline-block", flexShrink: 0 }} />
              <span style={{ color: "#ff5a00", fontSize: 10, fontFamily: "monospace" }}>
                {appointments.filter(a => a.status === "taller").length} en taller ahora
              </span>
            </div>
          </div>
        </section>

        {/* TAB CONTENT */}
        <div style={{ minHeight: 500 }}>
          <AnimatePresence mode="wait">

            {/* ═══════════════════════════════════
                TAB 1: CITAS
            ═══════════════════════════════════ */}
            {activeTab === "citas" && (
              <motion.div key="tab-citas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e1e1e", paddingBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 4, height: 24, backgroundColor: "#ff5a00", borderRadius: 2 }} />
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 800, color: "#e8e8e8", margin: 0, letterSpacing: "0.02em" }}>
                      Control de Agenda y Servicios
                    </h2>
                  </div>
                  <span style={{ color: "#333", fontSize: 11, fontFamily: "monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
                    PANEL ACTIVO
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {appointments.map(appt => (
                    <motion.div key={appt.id} layout
                      style={{
                        backgroundColor: "#111", border: "1px solid #1e1e1e", borderRadius: 8, overflow: "hidden",
                        borderLeft: `3px solid ${appt.status === "taller" ? "#ff5a00" : appt.status === "completada" ? "rgba(74,222,128,0.5)" : "#2a2a2a"}`,
                      }}>
                      <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 16 }}>
                        {/* Left: info */}
                        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" as const }}>
                          <span style={{ fontFamily: "monospace", fontSize: 11, backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a", padding: "4px 10px", borderRadius: 4, color: "#555", flexShrink: 0 }}>
                            {appt.id}
                          </span>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#e8e8e8", textTransform: "uppercase" as const, letterSpacing: "0.04em", margin: 0 }}>{appt.customer}</p>
                            <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase" as const, letterSpacing: "0.06em", margin: "3px 0 0" }}>{appt.bike}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: 12, fontFamily: "monospace", color: "#aaa", margin: 0 }}>{appt.date} · {appt.time}</p>
                            <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase" as const, margin: "3px 0 0" }}>
                              {appt.service} ·{" "}
                              <span style={{ color: "#ff5a00", fontWeight: 700 }}>${appt.price.toLocaleString("es-CO")} COP</span>
                            </p>
                          </div>
                          <div style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e", padding: "6px 12px", borderRadius: 4, display: "flex", alignItems: "center", gap: 6 }}>
                            <span>🔧</span>
                            <span style={{ fontFamily: "monospace", fontSize: 11, color: "#888" }}>{appt.mechanic}</span>
                          </div>
                        </div>

                        {/* Right: actions */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const, flexShrink: 0 }}>
                          {appt.status === "agendada" && (
                            <>
                              <button onClick={() => handleUpdateStatus(appt.id, "taller")}
                                style={{ backgroundColor: "#ff5a00", border: "none", color: "#fff", fontWeight: 700, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.06em", padding: "10px 18px", borderRadius: 5, cursor: "pointer", transition: "background 0.2s" }}
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ff7a2a"}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ff5a00"}>
                                Ingreso a Taller
                              </button>
                              <button onClick={() => handleUpdateStatus(appt.id, "completada")}
                                style={{ backgroundColor: "transparent", border: "1px solid #2a2a2a", color: "#888", fontWeight: 700, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.06em", padding: "10px 18px", borderRadius: 5, cursor: "pointer", transition: "all 0.2s" }}
                                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#4ade80"; b.style.color = "#4ade80"; }}
                                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#2a2a2a"; b.style.color = "#888"; }}>
                                Completar
                              </button>
                            </>
                          )}

                          {appt.status === "taller" && (
                            <>
                              <span style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.08em", fontFamily: "monospace", fontWeight: 700, color: "#ff5a00", backgroundColor: "rgba(255,90,0,0.1)", border: "1px solid rgba(255,90,0,0.3)", padding: "8px 14px", borderRadius: 4 }}>
                                🟠 En Reparación
                              </span>
                              <button onClick={() => handleUpdateStatus(appt.id, "completada")}
                                style={{ backgroundColor: "#4ade80", border: "none", color: "#000", fontWeight: 700, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.06em", padding: "10px 18px", borderRadius: 5, cursor: "pointer", transition: "background 0.2s" }}
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#22c55e"}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#4ade80"}>
                                Listo para Entrega ✓
                              </button>
                            </>
                          )}

                          {appt.status === "completada" && (
                            <span style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.08em", fontFamily: "monospace", fontWeight: 700, color: "#4ade80", backgroundColor: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", padding: "8px 14px", borderRadius: 4 }}>
                              🟢 Retirado y Cerrado
                            </span>
                          )}

                          {appt.status !== "completada" && (
                            <div style={{ position: "relative" as const }}>
                              <button
                                onClick={() => setAssigningTktId(assigningTktId === appt.id ? null : appt.id)}
                                style={{ backgroundColor: "transparent", border: "1px solid #2a2a2a", color: "#555", fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.06em", padding: "10px 14px", borderRadius: 5, cursor: "pointer", transition: "all 0.2s" }}
                                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#555"; b.style.color = "#aaa"; }}
                                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#2a2a2a"; b.style.color = "#555"; }}>
                                Reasignar ▾
                              </button>
                              {assigningTktId === appt.id && (
                                <div style={{ position: "absolute" as const, right: 0, marginTop: 4, width: 200, backgroundColor: "#161616", border: "1px solid #2a2a2a", borderRadius: 6, zIndex: 30, overflow: "hidden" }}>
                                  {employees.filter(e => e.role === "Mecánico").map(mech => (
                                    <button key={mech.id} onClick={() => handleReassignMechanic(appt.id, mech.name)}
                                      style={{ width: "100%", textAlign: "left" as const, fontFamily: "monospace", fontSize: 11, color: "#888", padding: "10px 14px", background: "none", border: "none", borderBottom: "1px solid #1e1e1e", cursor: "pointer", transition: "all 0.15s", display: "block" }}
                                      onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "rgba(255,90,0,0.08)"; b.style.color = "#e8e8e8"; }}
                                      onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "transparent"; b.style.color = "#888"; }}>
                                      {mech.name}
                                      <span style={{ marginLeft: 8, fontSize: 9, color: mech.status === "ocupado" ? "#ff5a00" : "#4ade80" }}>
                                        {mech.status === "ocupado" ? "· Ocupado" : "· Libre"}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress bar for "taller" */}
                      {appt.status === "taller" && (
                        <div style={{ height: 3, width: "100%", backgroundColor: "#0a0a0a" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "65%" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{ height: "100%", background: "linear-gradient(to right, #ff5a00, #ff8c00)" }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════
                TAB 2: PERSONAL
            ═══════════════════════════════════ */}
            {activeTab === "personal" && (
              <motion.div key="tab-personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32 }}>
                  {/* Employees list */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e1e1e", paddingBottom: 16, marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 4, height: 24, backgroundColor: "#ff5a00", borderRadius: 2 }} />
                        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 800, color: "#e8e8e8", margin: 0, letterSpacing: "0.02em" }}>
                          Colaboradores del Sistema
                        </h2>
                      </div>
                      <span style={{ color: "#333", fontSize: 11, fontFamily: "monospace" }}>ACTIVOS: {employees.length}</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      {employees.map(emp => (
                        <div key={emp.id}
                          style={{ backgroundColor: "#111", border: "1px solid #1e1e1e", borderRadius: 8, padding: 20, position: "relative" as const, transition: "border-color 0.2s" }}
                          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,90,0,0.3)"}
                          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "#1e1e1e"}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <span style={{ backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a", fontSize: 9, fontFamily: "monospace", color: "#555", padding: "2px 8px", borderRadius: 3, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
                                {emp.role}
                              </span>
                              <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: "#e8e8e8", textTransform: "uppercase" as const, margin: "8px 0 2px" }}>
                                {emp.name}
                              </h4>
                              <p style={{ fontSize: 10, fontFamily: "monospace", color: "#555", margin: 0 }}>{emp.email}</p>
                            </div>
                            <span style={{
                              fontSize: 9, fontFamily: "monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em", padding: "3px 8px", borderRadius: 3,
                              backgroundColor: emp.status === "disponible" ? "rgba(74,222,128,0.1)" : emp.status === "ocupado" ? "rgba(255,90,0,0.1)" : "rgba(100,100,100,0.1)",
                              border: `1px solid ${emp.status === "disponible" ? "rgba(74,222,128,0.3)" : emp.status === "ocupado" ? "rgba(255,90,0,0.3)" : "rgba(100,100,100,0.3)"}`,
                              color: emp.status === "disponible" ? "#4ade80" : emp.status === "ocupado" ? "#ff5a00" : "#666",
                            }}>
                              {emp.status}
                            </span>
                          </div>

                          <div style={{ borderTop: "1px solid #1e1e1e", marginTop: 14, paddingTop: 12, display: "flex", flexDirection: "column" as const, gap: 6 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "monospace" }}>
                              <span style={{ color: "#444" }}>ESPECIALIDAD:</span>
                              <span style={{ color: "#aaa", textTransform: "uppercase" as const }}>{emp.specialty}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "monospace" }}>
                              <span style={{ color: "#444" }}>TAREA ACTIVA:</span>
                              <span style={{ color: emp.activeTask !== "Ninguna" && emp.activeTask !== "Buzón de Citas" ? "#ff5a00" : "#888" }}>
                                {emp.activeTask}
                              </span>
                            </div>
                          </div>

                          <button onClick={() => handleDeleteEmployee(emp.id)}
                            style={{ position: "absolute" as const, top: 12, right: 12, backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 9, padding: "3px 8px", borderRadius: 3, cursor: "pointer", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", opacity: 0, transition: "all 0.2s" }}
                            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.opacity = "1"; b.style.backgroundColor = "rgba(239,68,68,0.2)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0"; }}
                            className="emp-delete-btn">
                            Dar de Baja ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add employee form */}
                  <div style={{ ...card }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                      <div style={{ width: 4, height: 20, backgroundColor: "#ff5a00", borderRadius: 2 }} />
                      <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: "#e8e8e8", margin: 0, letterSpacing: "0.02em" }}>Registrar Operador</h3>
                    </div>

                    <form onSubmit={handleAddEmployee} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <label style={labelSt}>Nombre Completo</label>
                        <input type="text" placeholder="Ej: Marcos Silva" value={newEmpName} onChange={e => setNewEmpName(e.target.value)} style={inputSt}
                          onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5a00"}
                          onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#2a2a2a"} />
                      </div>
                      <div>
                        <label style={labelSt}>Correo Electrónico</label>
                        <input type="email" placeholder="marcos@sigmotos.com" value={newEmpEmail} onChange={e => setNewEmpEmail(e.target.value)} style={inputSt}
                          onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5a00"}
                          onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#2a2a2a"} />
                      </div>
                      <div>
                        <label style={labelSt}>Rol Administrativo</label>
                        <select value={newEmpRole} onChange={e => setNewEmpRole(e.target.value as any)} style={inputSt}>
                          <option value="Mecánico">Mecánico Operador</option>
                          <option value="Recepcionista">Recepcionista Taller</option>
                          <option value="Administrador">Administrador General</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelSt}>Especialidad / Cargo</label>
                        <input type="text" placeholder="Ej: Inyección Electrónica" value={newEmpSpec} onChange={e => setNewEmpSpec(e.target.value)} style={inputSt}
                          onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5a00"}
                          onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#2a2a2a"} />
                      </div>

                      {personalError && (
                        <p style={{ color: "#f87171", fontSize: 11, fontFamily: "monospace", margin: 0 }}>⚠️ {personalError}</p>
                      )}

                      <button type="submit"
                        style={{ backgroundColor: "#ff5a00", border: "none", color: "#fff", fontWeight: 700, fontSize: 12, textTransform: "uppercase" as const, letterSpacing: "0.08em", padding: "13px 20px", borderRadius: 5, cursor: "pointer", transition: "background 0.2s", marginTop: 4 }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ff7a2a"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ff5a00"}>
                        Añadir al Personal →
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════
                TAB 3: FINANZAS
            ═══════════════════════════════════ */}
            {activeTab === "finanzas" && (
              <motion.div key="tab-finanzas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e1e1e", paddingBottom: 16, marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 4, height: 24, backgroundColor: "#ff5a00", borderRadius: 2 }} />
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 800, color: "#e8e8e8", margin: 0, letterSpacing: "0.02em" }}>
                      Control Financiero y Ganancias
                    </h2>
                  </div>
                  <span style={{ color: "#333", fontSize: 11, fontFamily: "monospace", textTransform: "uppercase" as const }}>MONITOREO TRANSACCIONAL</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>
                  {/* Transactions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <input type="text" placeholder="Buscar por cliente o servicio..." value={financeSearch} onChange={e => setFinanceSearch(e.target.value)} style={{ ...inputSt, flex: 1 }}
                        onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5a00"}
                        onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#2a2a2a"} />
                      {financeSearch && (
                        <button onClick={() => setFinanceSearch("")}
                          style={{ backgroundColor: "#111", border: "1px solid #2a2a2a", color: "#888", fontSize: 12, padding: "10px 14px", borderRadius: 5, cursor: "pointer" }}>
                          ✕
                        </button>
                      )}
                    </div>

                    <div style={{ border: "1px solid #1e1e1e", borderRadius: 8, overflow: "hidden" }}>
                      {financeReceipts
                        .filter(r => r.customer.toLowerCase().includes(financeSearch.toLowerCase()) || r.service.toLowerCase().includes(financeSearch.toLowerCase()))
                        .map((receipt, idx, arr) => (
                          <div key={receipt.id}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", backgroundColor: "#111", borderBottom: idx < arr.length - 1 ? "1px solid #1a1a1a" : "none", transition: "background 0.15s" }}
                            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = "#161616"}
                            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = "#111"}>
                            <div>
                              <p style={{ fontSize: 12, fontWeight: 700, color: "#e8e8e8", textTransform: "uppercase" as const, margin: "0 0 3px" }}>{receipt.customer}</p>
                              <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase" as const, letterSpacing: "0.06em", margin: "0 0 3px" }}>{receipt.service}</p>
                              <p style={{ fontSize: 10, color: "#333", fontFamily: "monospace", margin: 0 }}>{receipt.date} · OS: #{receipt.id}</p>
                            </div>
                            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: "#ff5a00", flexShrink: 0 }}>
                              +${receipt.amount.toLocaleString("es-CO")} COP
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Income chart */}
                  <div style={{ ...card }}>
                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, fontWeight: 700, color: "#e8e8e8", margin: "0 0 24px", letterSpacing: "0.02em" }}>
                      📋 Telemetría de Ingresos
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {[
                        { month: "Enero", income: 3800000, pct: 40 },
                        { month: "Febrero", income: 5200000, pct: 55 },
                        { month: "Marzo", income: 7800000, pct: 82 },
                        { month: "Abril", income: 6400000, pct: 67 },
                        { month: "Mayo 2026", income: 9500000, pct: 100 },
                      ].map((m, idx) => (
                        <div key={idx}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: "monospace", fontSize: 11 }}>
                            <span style={{ color: idx === 4 ? "#ff5a00" : "#555", fontWeight: idx === 4 ? 700 : 400 }}>{m.month}</span>
                            <span style={{ color: "#888" }}>${m.income.toLocaleString("es-CO")}</span>
                          </div>
                          <div style={{ height: 8, backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 3, overflow: "hidden" }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${m.pct}%` }}
                              transition={{ duration: 1.2, delay: idx * 0.1 }}
                              style={{ height: "100%", background: idx === 4 ? "linear-gradient(to right, #ff5a00, #ff8c00)" : "#2a2a2a", borderRadius: 3 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════
                TAB 4: INVENTARIO
            ═══════════════════════════════════ */}
            {activeTab === "inventario" && (
              <motion.div key="tab-inventario" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>
                  {/* Parts list */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e1e1e", paddingBottom: 16, marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 4, height: 24, backgroundColor: "#ff5a00", borderRadius: 2 }} />
                        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 800, color: "#e8e8e8", margin: 0, letterSpacing: "0.02em" }}>
                          Inventario de Piezas
                        </h2>
                      </div>
                      <span style={{ color: "#333", fontSize: 11, fontFamily: "monospace" }}>STOCK TOTAL: {parts.reduce((a, p) => a + p.stock, 0)} U</span>
                    </div>

                    <div style={{ border: "1px solid #1e1e1e", borderRadius: 8, overflow: "hidden" }}>
                      {parts.map((part, idx, arr) => (
                        <div key={part.id}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", backgroundColor: "#111", borderBottom: idx < arr.length - 1 ? "1px solid #1a1a1a" : "none", gap: 16, transition: "background 0.15s" }}
                          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = "#161616"}
                          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = "#111"}>
                          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{ width: 40, height: 40, backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                              📦
                            </div>
                            <div>
                              <span style={{ fontSize: 9, fontFamily: "monospace", color: "#444", backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e", padding: "2px 8px", borderRadius: 3, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
                                {part.category} · {part.id}
                              </span>
                              <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, color: "#e8e8e8", textTransform: "uppercase" as const, margin: "6px 0 3px", letterSpacing: "0.02em" }}>
                                {part.name}
                              </h4>
                              <p style={{ fontSize: 10, fontFamily: "monospace", color: "#444", margin: 0 }}>📍 {part.location}</p>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
                            <div style={{ textAlign: "right" as const }}>
                              <p style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: "#e8e8e8", margin: "0 0 4px" }}>
                                ${part.price.toLocaleString("es-CO")} COP
                              </p>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                                <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 700, color: part.stock < 10 ? "#ff5a00" : "#888" }}>
                                  STOCK: {part.stock} U
                                </span>
                                {part.stock < 10 && (
                                  <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{ backgroundColor: "rgba(255,90,0,0.1)", border: "1px solid rgba(255,90,0,0.4)", color: "#ff5a00", fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 3, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
                                    CRÍTICO
                                  </motion.span>
                                )}
                              </div>
                            </div>
                            <button onClick={() => handleRestock(part.id)}
                              style={{ backgroundColor: "transparent", border: "1px solid #2a2a2a", color: "#555", fontSize: 10, fontFamily: "monospace", textTransform: "uppercase" as const, letterSpacing: "0.06em", padding: "8px 12px", borderRadius: 4, cursor: "pointer", transition: "all 0.2s" }}
                              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "rgba(255,90,0,0.5)"; b.style.color = "#ff5a00"; b.style.backgroundColor = "rgba(255,90,0,0.08)"; }}
                              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#2a2a2a"; b.style.color = "#555"; b.style.backgroundColor = "transparent"; }}>
                              +10 Stock
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add part form */}
                  <div style={{ ...card }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                      <div style={{ width: 4, height: 20, backgroundColor: "#ff5a00", borderRadius: 2 }} />
                      <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: "#e8e8e8", margin: 0, letterSpacing: "0.02em" }}>Ingresar Repuesto</h3>
                    </div>

                    <form onSubmit={handleAddPart} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div>
                        <label style={labelSt}>Nombre del Repuesto</label>
                        <input type="text" placeholder="Ej: Bujía NGK GP" value={newPartName} onChange={e => setNewPartName(e.target.value)} style={inputSt}
                          onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5a00"}
                          onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#2a2a2a"} />
                      </div>
                      <div>
                        <label style={labelSt}>Categoría</label>
                        <select value={newPartCategory} onChange={e => setNewPartCategory(e.target.value)} style={inputSt}>
                          <option value="Frenos">Frenado y Calipers</option>
                          <option value="Lubricantes">Líquidos y Aceites</option>
                          <option value="Filtros">Filtros de Aire / Combustible</option>
                          <option value="Eléctrico">Sistema Eléctrico y Bujías</option>
                          <option value="Repuestos">Repuestos Generales</option>
                        </select>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <label style={labelSt}>Precio (COP)</label>
                          <input type="number" placeholder="0" value={newPartPrice} onChange={e => setNewPartPrice(e.target.value)} style={inputSt}
                            onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5a00"}
                            onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#2a2a2a"} />
                        </div>
                        <div>
                          <label style={labelSt}>Cantidad (U)</label>
                          <input type="number" placeholder="0" value={newPartStock} onChange={e => setNewPartStock(e.target.value)} style={inputSt}
                            onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5a00"}
                            onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#2a2a2a"} />
                        </div>
                      </div>
                      <div>
                        <label style={labelSt}>Localización</label>
                        <input type="text" placeholder="Ej: Estante B4" value={newPartLoc} onChange={e => setNewPartLoc(e.target.value)} style={inputSt}
                          onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5a00"}
                          onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#2a2a2a"} />
                      </div>

                      {inventoryError && (
                        <p style={{ color: "#f87171", fontSize: 11, fontFamily: "monospace", margin: 0 }}>⚠️ {inventoryError}</p>
                      )}

                      <button type="submit"
                        style={{ backgroundColor: "#ff5a00", border: "none", color: "#fff", fontWeight: 700, fontSize: 12, textTransform: "uppercase" as const, letterSpacing: "0.08em", padding: "12px 20px", borderRadius: 5, cursor: "pointer", transition: "background 0.2s", marginTop: 4 }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ff7a2a"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ff5a00"}>
                        Añadir al Inventario →
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════
                TAB 5: REPORTES
            ═══════════════════════════════════ */}
            {activeTab === "reportes" && (
              <motion.div key="tab-reportes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e1e1e", paddingBottom: 16, marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 4, height: 24, backgroundColor: "#ff5a00", borderRadius: 2 }} />
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 800, color: "#e8e8e8", margin: 0, letterSpacing: "0.02em" }}>
                      Auditoría & Reportes
                    </h2>
                  </div>
                  <span style={{ color: "#333", fontSize: 11, fontFamily: "monospace", textTransform: "uppercase" as const }}>EXPORTACIÓN DE DATOS</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                  {[
                    {
                      tag: "SISTEMA CÓMPUTO",
                      title: "Resumen de Agenda & Citas Activas",
                      desc: "Genera un reporte consolidado con las citas agendadas, vehículos en taller, estados del servicio y asignaciones de mecánicos.",
                      type: "citas" as const,
                      reportKey: "Agenda",
                      fullTitle: "Reporte Consolidado de Agenda & Citas",
                    },
                    {
                      tag: "SISTEMA FINANCIERO",
                      title: "Auditoría Contable & Ganancias Q2",
                      desc: "Consolida las transacciones completadas, mano de obra y costos de consumibles, calculando la ganancia neta del período.",
                      type: "finanzas" as const,
                      reportKey: "Contable",
                      fullTitle: "Auditoría Contable y Estado de Ganancias",
                    },
                    {
                      tag: "SISTEMA INVENTARIO",
                      title: "Reporte General de Stock Crítico",
                      desc: "Extrae el inventario completo de repuestos y señala las piezas con stock menor a 10 unidades que requieren reposición.",
                      type: "inventario" as const,
                      reportKey: "Inventario",
                      fullTitle: "Reporte de Inventario y Piezas Críticas",
                    },
                  ].map((r, i) => (
                    <div key={i}
                      style={{ ...card, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20, transition: "border-color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "#2a2a2a"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "#1e1e1e"}>
                      <div>
                        <span style={{ fontSize: 9, fontFamily: "monospace", color: "#444", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{r.tag}</span>
                        <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, fontWeight: 700, color: "#e8e8e8", textTransform: "uppercase" as const, margin: "10px 0 10px", letterSpacing: "0.02em" }}>
                          {r.title}
                        </h4>
                        <p style={{ fontSize: 12, color: "#555", lineHeight: 1.65, margin: 0 }}>{r.desc}</p>
                      </div>
                      <button
                        onClick={() => handleGenerateReport(r.fullTitle, r.type)}
                        disabled={isGenerating}
                        style={{ backgroundColor: "#ff5a00", border: "none", color: "#fff", fontWeight: 700, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.08em", padding: "12px 20px", borderRadius: 5, cursor: isGenerating ? "not-allowed" : "pointer", opacity: isGenerating ? 0.7 : 1, transition: "background 0.2s" }}
                        onMouseEnter={e => { if (!isGenerating) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ff7a2a"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ff5a00"; }}>
                        {isGenerating && reportTitle.includes(r.reportKey) ? "Procesando Datos..." : "Generar Reporte ⇁"}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* ── REPORT MODAL ── */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed" as const, inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "rgba(0,0,0,0.95)", backdropFilter: "blur(6px)", overflowY: "auto" }}>
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              style={{ backgroundColor: "#fff", color: "#000", padding: "40px 48px", maxWidth: 760, width: "100%", fontFamily: "'Inter', sans-serif", position: "relative" as const, borderTop: "8px solid #ff5a00", boxShadow: "0 32px 64px rgba(0,0,0,0.8)", margin: "32px 0" }}>

              {/* Buttons */}
              <div style={{ position: "absolute" as const, top: 16, right: 16, display: "flex", gap: 8 }}>
                <button onClick={() => window.print()}
                  style={{ backgroundColor: "#000", color: "#fff", border: "none", fontWeight: 700, fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.06em", padding: "6px 14px", cursor: "pointer" }}>
                  Imprimir
                </button>
                <button onClick={() => setShowReportModal(false)}
                  style={{ backgroundColor: "#eee", color: "#333", border: "none", fontWeight: 700, fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.06em", padding: "6px 14px", cursor: "pointer" }}>
                  Cerrar
                </button>
              </div>

              {/* Report header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #000", paddingBottom: 24, marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" as const, margin: "0 0 4px", lineHeight: 1 }}>
                    SIG<span style={{ color: "#ff5a00" }}>MOTOS</span>
                  </h2>
                  <p style={{ fontSize: 10, fontFamily: "monospace", color: "#666", textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "4px 0 2px" }}>
                    Sistema Profesional de Gestión · Administración
                  </p>
                  <p style={{ fontSize: 10, color: "#888", margin: 0 }}>Calle 13 # 44–92, Cali · Tel: (602) 485-9000</p>
                </div>
                <div style={{ textAlign: "right" as const, fontFamily: "monospace", fontSize: 11 }}>
                  <p style={{ backgroundColor: "#000", color: "#fff", padding: "4px 10px", fontWeight: 700, fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.06em", margin: "0 0 8px" }}>REPORTE GENERAL</p>
                  <p style={{ color: "#888", margin: "2px 0" }}>ID: #{Math.floor(100000 + Math.random() * 900000)}</p>
                  <p style={{ color: "#888", margin: 0 }}>Fecha: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, textTransform: "uppercase" as const, margin: "0 0 6px", borderBottom: "1px solid #e5e5e5", paddingBottom: 8 }}>
                  {reportTitle}
                </h3>
                <p style={{ fontSize: 10, fontFamily: "monospace", color: "#999", textTransform: "uppercase" as const, margin: "0 0 24px" }}>
                  Generado por: José Cárdenas · Estado: Consolidado Aprobado
                </p>

                {/* Table */}
                <div style={{ border: "1px solid #e5e5e5", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" as const, fontFamily: "monospace", fontSize: 10 }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #e5e5e5" }}>
                        {["Identificador / ID", "Descripción / Parámetro", "Detalle / Responsable", "Valoración / Cantidad"].map(h => (
                          <th key={h} style={{ padding: "10px 12px", textAlign: "left" as const, color: "#666", textTransform: "uppercase" as const, letterSpacing: "0.06em", fontSize: 9 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportContent.map((item: any, idx: number) => {
                        let desc = "", detail = "", val = "";
                        if (item.customer && item.bike) {
                          desc = `${item.bike} (${item.service})`; detail = `${item.customer} · Mec: ${item.mechanic}`; val = `$${item.price.toLocaleString("es-CO")} COP`;
                        } else if (item.customer && item.amount) {
                          desc = item.service; detail = item.customer; val = `$${item.amount.toLocaleString("es-CO")} COP`;
                        } else {
                          desc = item.name; detail = `Loc: ${item.location}`; val = `${item.stock} U · $${item.price.toLocaleString("es-CO")}`;
                        }
                        return (
                          <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0", backgroundColor: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ padding: "10px 12px", fontWeight: 700, color: "#555" }}>{item.id}</td>
                            <td style={{ padding: "10px 12px", color: "#222" }}>{desc}</td>
                            <td style={{ padding: "10px 12px", color: "#666", textTransform: "uppercase" as const }}>{detail}</td>
                            <td style={{ padding: "10px 12px", fontWeight: 700, color: "#222", textAlign: "right" as const }}>{val}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div style={{ backgroundColor: "#f5f5f5", border: "1px solid #e5e5e5", padding: "14px 16px", marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>
                  <span>METRIC CONSOLIDATED TOTAL</span>
                  <span style={{ color: "#ff5a00", fontSize: 14 }}>
                    {reportTitle.includes("Contable") ? `$${totalEarnings.toLocaleString("es-CO")} COP`
                      : reportTitle.includes("Agenda") ? `${appointments.length} Citas Registradas`
                      : `${parts.length} Repuestos en Auditoría`}
                  </span>
                </div>

                {/* Signatures */}
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e5e5", paddingTop: 32, marginTop: 40, fontFamily: "monospace", fontSize: 9, color: "#999" }}>
                  <div style={{ textAlign: "center" as const, width: 180 }}>
                    <div style={{ height: 32, borderBottom: "1px solid #000", marginBottom: 8 }} />
                    <p style={{ fontWeight: 700, color: "#000", textTransform: "uppercase" as const, margin: "0 0 2px" }}>JOSÉ CÁRDENAS</p>
                    <p style={{ margin: 0 }}>Administrador Firmante</p>
                  </div>
                  <div style={{ textAlign: "center" as const, width: 180 }}>
                    <div style={{ height: 32, borderBottom: "1px solid #000", marginBottom: 8 }} />
                    <p style={{ fontWeight: 700, color: "#000", textTransform: "uppercase" as const, margin: "0 0 2px" }}>SISTEMAS CORE</p>
                    <p style={{ margin: 0 }}>Firma y Sello de Auditoría</p>
                  </div>
                </div>

                <p style={{ textAlign: "center" as const, fontSize: 9, color: "#ccc", marginTop: 24, borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
                  El presente es un documento de auditoría digital interna generado por SIGMOTOS Core.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ── STYLE CONSTANTS ──────────────────────────────────────────
const card: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #1e1e1e",
  borderRadius: 8,
  padding: 24,
};

const kpiCard: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #1e1e1e",
  borderRadius: 8,
  padding: "22px 24px",
};

const kpiLabel: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  fontFamily: "monospace",
  color: "#555",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: 2,
};

const kpiNum: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 32,
  fontWeight: 800,
  letterSpacing: "-0.01em",
  margin: "6px 0 0",
  lineHeight: 1,
};

const inputSt: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#0d0d0d",
  border: "1px solid #2a2a2a",
  borderRadius: 5,
  padding: "10px 14px",
  color: "#e8e8e8",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelSt: React.CSSProperties = {
  display: "block",
  color: "#555",
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 6,
  fontFamily: "monospace",
};
