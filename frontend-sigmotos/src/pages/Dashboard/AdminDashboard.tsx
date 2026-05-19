import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Interfaces de Datos de Gestión Administrativa
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
      setPersonalError("Por favor complete todos los campos del nuevo colaborador.");
      return;
    }
    setPersonalError("");
    const newEmp: Employee = {
      id: `EMP-${Math.floor(10 + Math.random() * 90)}`,
      name: newEmpName.trim(),
      email: newEmpEmail.trim(),
      role: newEmpRole,
      specialty: newEmpSpec.trim(),
      activeTask: "Ninguna",
      status: "disponible"
    };
    setEmployees(prev => [...prev, newEmp]);
    setNewEmpName("");
    setNewEmpEmail("");
    setNewEmpSpec("");
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

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
      setInventoryError("Complete todos los campos del nuevo repuesto.");
      return;
    }
    setInventoryError("");
    const newPart: SparePart = {
      id: `PRT-${Math.floor(100 + Math.random() * 899)}`,
      name: newPartName.trim(),
      category: newPartCategory,
      price: parseFloat(newPartPrice),
      stock: parseInt(newPartStock),
      location: newPartLoc.trim()
    };
    setParts(prev => [...prev, newPart]);
    setNewPartName("");
    setNewPartPrice("");
    setNewPartStock("");
    setNewPartLoc("");
  };

  const handleRestock = (id: string) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, stock: p.stock + 10 } : p));
  };

  // ── ESTADO 4: CONTROL FINANCIERO ───────────────
  const [financeReceipts] = useState<FinanceReceipt[]>([
    { id: "REC-9948", customer: "Sofía Gómez", service: "Pastillas Brembo + Suspensión", date: "15 Mayo, 2026", amount: 445000 },
    { id: "REC-3382", customer: "Juan Pérez", service: "Mantenimiento General", date: "16 Mayo, 2026", amount: 260000 },
    { id: "REC-1180", customer: "Natalia Velez", service: "Aceite Sintético Suzuki", date: "16 Mayo, 2026", amount: 90000 },
    { id: "REC-5401", customer: "David Cardona", service: "Sincronización Electrónica", date: "16 Mayo, 2026", amount: 140000 },
  ]);

  const [financeSearch, setFinanceSearch] = useState("");

  const totalEarnings = financeReceipts.reduce((acc, r) => acc + r.amount, 0);

  // ── ESTADO 5: REPORTES DE AUDITORÍA ────────────
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
      if (type === "citas") {
        setReportContent(appointments);
      } else if (type === "finanzas") {
        setReportContent(financeReceipts);
      } else {
        setReportContent(parts);
      }
    }, 1200);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080808] text-[#e8e8e8] font-sans antialiased selection:bg-[#ff5a00] selection:text-white flex flex-col md:flex-row">
      {/* ────────────────────────────────────────────────────────
         SIDEBAR NAVIGATION
         ──────────────────────────────────────────────────────── */}
      <aside className="w-full md:w-64 bg-[#111] border-b md:border-b-0 md:border-r border-white/5 flex flex-col shrink-0 transition-all duration-300">
        {/* Mobile Header Bar */}
        <div className="p-6 flex items-center justify-between border-b border-white/5 md:border-b-0">
          <div className="font-['Barlow_Condensed'] text-2xl font-extrabold tracking-widest text-[#e8e8e8]">
            <span className="text-[#ff5a00]">SIG</span>MOTOS
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-[#ff5a00]/10 border border-[#ff5a00]/30 text-[#ff5a00] text-[8px] font-mono px-2 py-0.5 uppercase tracking-widest rounded hidden sm:inline-block">
              Admin HUD
            </span>
            {/* Toggle Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex flex-col justify-between w-6 h-4 bg-transparent border-none cursor-pointer p-0 group"
              aria-label="Toggle admin menu"
            >
              <span className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Menu Items Container (collapsible on mobile, always visible on md+) */}
        <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col justify-between flex-grow transition-all`}>
          <div className="p-6 pt-6 md:pt-6 space-y-6 md:space-y-8">
            {/* User Cockpit */}
            <div className="bg-[#080808] border border-white/5 p-4 relative overflow-hidden">
              <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest font-bold">OPERADOR ACTIVO</p>
              <h4 className="font-['Barlow_Condensed'] text-base font-bold text-white uppercase mt-1">José Cárdenas</h4>
              <p className="text-[9px] text-[#ff5a00] font-mono uppercase tracking-tighter">ID: ADMIN-SYS-01</p>
              <div className="absolute right-3 bottom-3 text-xs opacity-20 select-none">⚙️</div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1">
              {[
                { id: "citas", label: "Control de Citas", icon: "🗓️" },
                { id: "personal", label: "Personal & Técnicos", icon: "👤" },
                { id: "finanzas", label: "Finanzas & Ganancias", icon: "📊" },
                { id: "inventario", label: "Inventario Repuestos", icon: "📦" },
                { id: "reportes", label: "Auditoría & Reportes", icon: "📋" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsMobileMenuOpen(false); // Close menu on click
                  }}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-l-2 text-left rounded-none cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#ff5a00]/10 border-[#ff5a00] text-[#ff5a00] shadow-[inset_4px_0_10px_rgba(255,90,0,0.05)]"
                      : "border-transparent text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Footer actions */}
          <div className="p-6 border-t border-white/5 space-y-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-500 font-extrabold uppercase py-3 text-[10px] tracking-widest transition-all text-center cursor-pointer"
            >
              Cerrar Sesión ⇁
            </button>
          </div>
        </div>
      </aside>

      {/* ────────────────────────────────────────────────────────
         MAIN CONTENT AREA
         ──────────────────────────────────────────────────────── */}
      <main className="flex-grow p-6 lg:p-10 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* KPI COUNTER HEADER COCKPIT */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111] border border-white/5 p-4 relative overflow-hidden">
            <span className="text-[9px] font-mono text-[#ff5a00] uppercase tracking-widest block font-bold">Ingresos Estimados</span>
            <p className="font-['Barlow_Condensed'] text-3xl font-extrabold text-white tracking-tighter mt-2">
              ${totalEarnings.toLocaleString("es-CO")} COP
            </p>
            <div className="text-[9px] text-green-500 font-mono mt-1">+14.2% esta semana</div>
          </div>
          
          <div className="bg-[#111] border border-white/5 p-4 relative overflow-hidden">
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Eficiencia Bahías</span>
            <p className="font-['Barlow_Condensed'] text-3xl font-extrabold text-white tracking-tighter mt-2">
              92.4%
            </p>
            <div className="text-[9px] text-gray-500 font-mono mt-1">Capacidad: 5 Bahías Activas</div>
          </div>

          <div className="bg-[#111] border border-white/5 p-4 relative overflow-hidden">
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Repuestos Críticos</span>
            <p className="font-['Barlow_Condensed'] text-3xl font-extrabold text-[#ff5a00] tracking-tighter mt-2 animate-pulse">
              {parts.filter(p => p.stock < 10).length} ALERTA
            </p>
            <div className="text-[9px] text-gray-500 font-mono mt-1">Stock bajo en pastillas y filtros</div>
          </div>

          <div className="bg-[#111] border border-white/5 p-4 relative overflow-hidden">
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Citas de Hoy</span>
            <p className="font-['Barlow_Condensed'] text-3xl font-extrabold text-white tracking-tighter mt-2">
              {appointments.filter(a => a.status === "agendada" || a.status === "taller").length} ACTIVAS
            </p>
            <div className="text-[9px] text-[#ff5a00] font-mono mt-1">{appointments.filter(a => a.status === "taller").length} en taller actualmente</div>
          </div>
        </section>

        {/* HUD SCREEN RENDER */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {/* ========================================================
               TAB 1: CONTROL DE CITAS
               ======================================================== */}
            {activeTab === "citas" && (
              <motion.div
                key="tab-citas"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-4">
                  <h2 className="font-['Barlow_Condensed'] text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#ff5a00]" />
                    Control de Agenda y Servicios
                  </h2>
                  <span className="text-xs text-gray-500 font-mono">PANEL DE CITAS RECTIVO</span>
                </div>

                <div className="grid gap-4">
                  {appointments.map(appt => (
                    <div 
                      key={appt.id}
                      className="bg-[#111] border border-white/5 p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:border-white/10 transition-all"
                    >
                      <div className="space-y-2 lg:space-y-0 lg:flex lg:items-center lg:gap-8">
                        {/* ID Badge */}
                        <div className="font-mono text-xs bg-white/5 border border-white/5 px-2 py-1 text-gray-400">
                          {appt.id}
                        </div>
                        {/* Client & Bike */}
                        <div>
                          <p className="text-sm font-bold text-white uppercase">{appt.customer}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{appt.bike}</p>
                        </div>
                        {/* Schedule & Price */}
                        <div>
                          <p className="text-xs font-mono text-gray-300">{appt.date} • {appt.time}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{appt.service} • <span className="text-[#ff5a00] font-bold">${appt.price.toLocaleString("es-CO")} COP</span></p>
                        </div>
                        {/* Assigned Mechanic */}
                        <div className="bg-[#080808] border border-white/5 px-3 py-1.5 text-xs text-gray-400">
                          🔧 {appt.mechanic}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 border-white/5 pt-3 lg:pt-0">
                        {appt.status === "agendada" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(appt.id, "taller")}
                              className="bg-[#ff5a00] hover:bg-[#ff7a2a] text-black font-extrabold uppercase py-2.5 px-5 text-[10px] tracking-wider transition-all cursor-pointer hover:scale-[1.02]"
                            >
                              Ingreso a Taller
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(appt.id, "completada")}
                              className="bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white font-extrabold uppercase py-2.5 px-5 text-[10px] tracking-wider transition-all cursor-pointer hover:scale-[1.02]"
                            >
                              Completar
                            </button>
                          </>
                        )}

                        {appt.status === "taller" && (
                          <>
                            <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-[#ff5a00] bg-[#ff5a00]/10 border border-[#ff5a00]/30 px-3 py-1.5 animate-pulse">
                              🟠 En Reparación
                            </span>
                            <button
                              onClick={() => handleUpdateStatus(appt.id, "completada")}
                              className="bg-green-500 hover:bg-green-600 text-black font-extrabold uppercase py-2.5 px-5 text-[10px] tracking-wider transition-all cursor-pointer hover:scale-[1.02]"
                            >
                              Listo para Entrega ✓
                            </button>
                          </>
                        )}

                        {appt.status === "completada" && (
                          <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-green-400 bg-green-500/10 border border-green-500/30 px-3 py-1.5">
                            🟢 Retirado y Cerrado
                          </span>
                        )}

                        {/* Reassign Mechanic Toggle */}
                        {appt.status !== "completada" && (
                          <div className="relative">
                            <button
                              onClick={() => setAssigningTktId(assigningTktId === appt.id ? null : appt.id)}
                              className="bg-white/5 border border-white/5 hover:border-white/20 text-gray-500 hover:text-white py-2 px-3 text-[9px] tracking-widest uppercase transition-all"
                            >
                              Reasignar Mecánico
                            </button>
                            {assigningTktId === appt.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-[#161616] border border-white/10 shadow-2xl z-30 divide-y divide-white/5 p-1">
                                {employees.filter(e => e.role === "Mecánico").map(mech => (
                                  <button
                                    key={mech.id}
                                    onClick={() => handleReassignMechanic(appt.id, mech.name)}
                                    className="w-full text-left font-mono text-[10px] text-gray-400 hover:text-white hover:bg-[#ff5a00]/10 p-2 uppercase transition-all block"
                                  >
                                    {mech.name} {mech.status === "ocupado" ? "(Ocupado)" : "(Libre)"}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ========================================================
               TAB 2: PERSONAL & OPERADORES
               ======================================================== */}
            {activeTab === "personal" && (
              <motion.div
                key="tab-personal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid lg:grid-cols-12 gap-8"
              >
                {/* Employees List Grid (8 columns) */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h2 className="font-['Barlow_Condensed'] text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-[#ff5a00]" />
                      Colaboradores del Sistema
                    </h2>
                    <span className="text-xs text-gray-500 font-mono">ACTIVOS: {employees.length}</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {employees.map(emp => (
                      <div 
                        key={emp.id}
                        className="bg-[#111] border border-white/5 p-5 relative overflow-hidden group hover:border-[#ff5a00]/30 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="bg-white/5 border border-white/5 text-[8px] font-mono text-gray-400 px-2 py-0.5 uppercase tracking-widest rounded">
                              {emp.role}
                            </span>
                            <h4 className="font-['Barlow_Condensed'] text-lg font-bold text-white uppercase mt-2">
                              {emp.name}
                            </h4>
                            <p className="text-[10px] text-gray-500 font-mono lowercase">{emp.email}</p>
                          </div>
                          
                          <span className={`text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 ${
                            emp.status === "disponible"
                              ? "bg-green-500/10 border border-green-500/30 text-green-400"
                              : emp.status === "ocupado"
                              ? "bg-[#ff5a00]/10 border border-[#ff5a00]/30 text-[#ff5a00] animate-pulse"
                              : "bg-gray-500/10 border border-gray-500/30 text-gray-500"
                          }`}>
                            {emp.status}
                          </span>
                        </div>

                        <div className="border-t border-white/5 pt-3 mt-4 space-y-1.5 font-mono text-[10px]">
                          <div className="flex justify-between text-gray-500">
                            <span>ESPECIALIDAD:</span>
                            <span className="text-white uppercase">{emp.specialty}</span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>TAREA ACTIVA:</span>
                            <span className={emp.activeTask !== "Ninguna" && emp.activeTask !== "Buzón de Citas" ? "text-[#ff5a00]" : "text-white"}>
                              {emp.activeTask}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons hover */}
                        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-500 hover:text-white text-[8px] font-bold uppercase tracking-wider py-1 px-2.5 transition-all"
                          >
                            Dar de Baja ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Employee Form (4 columns) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-[#111] border border-white/5 p-6 relative overflow-hidden shadow-xl">
                    <h3 className="font-['Barlow_Condensed'] text-xl font-bold uppercase tracking-tight text-white mb-6 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-[#ff5a00]" />
                      Registrar Operador
                    </h3>

                    <form onSubmit={handleAddEmployee} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Nombre Completo</label>
                        <input
                          type="text"
                          placeholder="Ej: Marcos Silva"
                          value={newEmpName}
                          onChange={(e) => setNewEmpName(e.target.value)}
                          className="w-full bg-[#080808] border border-white/10 hover:border-white/20 focus:border-[#ff5a00]/50 focus:outline-none px-4 py-3 text-xs md:text-sm text-[#e8e8e8] placeholder-gray-700 transition-all rounded-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Correo Electrónico</label>
                        <input
                          type="email"
                          placeholder="marcos@sigmotos.com"
                          value={newEmpEmail}
                          onChange={(e) => setNewEmpEmail(e.target.value)}
                          className="w-full bg-[#080808] border border-white/10 hover:border-white/20 focus:border-[#ff5a00]/50 focus:outline-none px-4 py-3 text-xs md:text-sm text-[#e8e8e8] placeholder-gray-700 transition-all rounded-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Rol Administrativo</label>
                        <select
                          value={newEmpRole}
                          onChange={(e) => setNewEmpRole(e.target.value as any)}
                          className="w-full bg-[#080808] border border-white/10 focus:border-[#ff5a00]/50 focus:outline-none px-4 py-3 text-xs md:text-sm text-[#e8e8e8] transition-all rounded-none"
                        >
                          <option value="Mecánico">Mecánico Operador</option>
                          <option value="Recepcionista">Recepcionista Taller</option>
                          <option value="Administrador">Administrador General</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Especialidad / Cargo</label>
                        <input
                          type="text"
                          placeholder="Ej: Inyección Electrónica"
                          value={newEmpSpec}
                          onChange={(e) => setNewEmpSpec(e.target.value)}
                          className="w-full bg-[#080808] border border-white/10 hover:border-white/20 focus:border-[#ff5a00]/50 focus:outline-none px-4 py-3 text-xs md:text-sm text-[#e8e8e8] placeholder-gray-700 transition-all rounded-none"
                        />
                      </div>

                      {personalError && (
                        <p className="text-red-500 font-mono text-[9px] pt-1">⚠️ {personalError}</p>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-[#ff5a00] hover:bg-[#ff7a2a] text-black font-extrabold uppercase py-4 tracking-widest text-xs transition-all shadow-[0_5px_15px_rgba(255,90,0,0.15)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                      >
                        Añadir al Personal →
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================
               TAB 3: FINANZAS & GANANCIAS
               ======================================================== */}
            {activeTab === "finanzas" && (
              <motion.div
                key="tab-finanzas"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h2 className="font-['Barlow_Condensed'] text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#ff5a00]" />
                    Control Financiero y Ganancias
                  </h2>
                  <span className="text-xs text-gray-500 font-mono">MONITOREO TRANSACCIONAL</span>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Transaction Feed (7 columns) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Buscar por cliente o servicio..."
                        value={financeSearch}
                        onChange={(e) => setFinanceSearch(e.target.value)}
                        className="flex-grow bg-[#111] border border-white/5 hover:border-white/10 focus:border-[#ff5a00]/50 focus:outline-none px-4 py-2.5 text-xs text-[#e8e8e8] placeholder-gray-700 transition-all rounded-none"
                      />
                      {financeSearch && (
                        <button
                          onClick={() => setFinanceSearch("")}
                          className="bg-white/5 hover:bg-white/10 px-3 text-xs text-gray-400"
                        >
                          Limpiar
                        </button>
                      )}
                    </div>

                    <div className="border border-white/5 divide-y divide-white/5">
                      {financeReceipts
                        .filter(
                          r =>
                            r.customer.toLowerCase().includes(financeSearch.toLowerCase()) ||
                            r.service.toLowerCase().includes(financeSearch.toLowerCase())
                        )
                        .map(receipt => (
                          <div 
                            key={receipt.id}
                            className="flex items-center justify-between p-4 bg-[#111]/40 hover:bg-[#111] transition-all"
                          >
                            <div>
                              <p className="text-xs font-bold text-white uppercase">{receipt.customer}</p>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{receipt.service}</p>
                              <p className="text-[9px] text-gray-600 font-mono mt-0.5">{receipt.date} • OS ID: #{receipt.id}</p>
                            </div>
                            <span className="font-['Barlow_Condensed'] text-base font-bold text-[#ff5a00]">
                              +${receipt.amount.toLocaleString("es-CO")} COP
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Right Column: Dynamic Income Charts (5 columns) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#111] border border-white/5 p-6 space-y-6 shadow-xl">
                      <h3 className="font-['Barlow_Condensed'] text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2">
                        📋 Telemetría de Ingresos (Mensual)
                      </h3>

                      {/* Custom Horizontal Bar Graph */}
                      <div className="space-y-4 font-mono text-[10px]">
                        {[
                          { month: "Enero", income: 3800000, pct: 40 },
                          { month: "Febrero", income: 5200000, pct: 55 },
                          { month: "Marzo", income: 7800000, pct: 82 },
                          { month: "Abril", income: 6400000, pct: 67 },
                          { month: "Mayo 2026", income: 9500000, pct: 100 },
                        ].map((m, idx) => (
                          <div className="space-y-1.5" key={idx}>
                            <div className="flex justify-between items-center text-gray-400">
                              <span className={idx === 4 ? "text-[#ff5a00] font-bold" : ""}>{m.month}</span>
                              <span className="text-white">${m.income.toLocaleString("es-CO")} COP</span>
                            </div>
                            <div className="h-2.5 bg-black border border-white/5 relative overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${m.pct}%` }}
                                transition={{ duration: 1.2, delay: idx * 0.1 }}
                                className={`h-full ${
                                  idx === 4
                                    ? "bg-gradient-to-r from-[#ff5a00] to-[#ff8c00]"
                                    : "bg-white/10"
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================
               TAB 4: INVENTARIO DE REPUESTOS (STOCK TECH)
               ======================================================== */}
            {activeTab === "inventario" && (
              <motion.div
                key="tab-inventario"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid lg:grid-cols-12 gap-8"
              >
                {/* Spare parts Table (8 columns) */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h2 className="font-['Barlow_Condensed'] text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-[#ff5a00]" />
                      Inventario Tecnológico de Piezas
                    </h2>
                    <span className="text-xs text-gray-500 font-mono">STOCK TOTAL: {parts.reduce((a,p)=>a+p.stock, 0)} U</span>
                  </div>

                  <div className="border border-white/5 divide-y divide-white/5">
                    {parts.map(part => (
                      <div 
                        key={part.id}
                        className="flex items-center justify-between p-5 bg-[#111]/40 hover:bg-[#111] transition-all gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-[#080808] border border-white/5 flex items-center justify-center text-lg select-none">
                            📦
                          </div>
                          <div>
                            <span className="bg-white/5 border border-white/5 text-[8px] font-mono text-gray-400 px-2 py-0.5 uppercase tracking-widest rounded">
                              {part.category} • {part.id}
                            </span>
                            <h4 className="font-['Barlow_Condensed'] text-base font-bold text-white uppercase mt-1 leading-none">
                              {part.name}
                            </h4>
                            <p className="text-[10px] text-gray-500 font-mono mt-1">Ubicación: {part.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* Price & Stock status */}
                          <div className="text-right">
                            <p className="text-xs font-mono font-bold text-white">${part.price.toLocaleString("es-CO")} COP</p>
                            <div className="flex items-center justify-end gap-2 mt-1">
                              <span className={`text-[10px] font-mono font-bold ${
                                part.stock < 10 ? "text-[#ff5a00] animate-pulse" : "text-gray-400"
                              }`}>
                                STOCK: {part.stock} U
                              </span>
                              {part.stock < 10 && (
                                <span className="bg-[#ff5a00]/10 border border-[#ff5a00]/40 text-[#ff5a00] text-[8px] font-sans px-1.5 py-0.5 uppercase font-bold rounded">
                                  CRÍTICO
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick Restock Action */}
                          <button
                            onClick={() => handleRestock(part.id)}
                            className="bg-white/5 hover:bg-[#ff5a00]/15 border border-white/5 hover:border-[#ff5a00]/50 text-gray-400 hover:text-[#ff5a00] text-[9px] font-mono uppercase tracking-wider py-2 px-3 transition-all rounded-none"
                            title="Añadir +10 unidades al stock"
                          >
                            +10 Stock
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Part Form (4 columns) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-[#111] border border-white/5 p-6 relative overflow-hidden shadow-xl">
                    <h3 className="font-['Barlow_Condensed'] text-xl font-bold uppercase tracking-tight text-white mb-6 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-[#ff5a00]" />
                      Ingresar Repuesto
                    </h3>

                    <form onSubmit={handleAddPart} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Nombre del Repuesto</label>
                        <input
                          type="text"
                          placeholder="Ej: Bujía NGK GP"
                          value={newPartName}
                          onChange={(e) => setNewPartName(e.target.value)}
                          className="w-full bg-[#080808] border border-white/10 hover:border-white/20 focus:border-[#ff5a00]/50 focus:outline-none px-3 py-2.5 text-xs text-[#e8e8e8] placeholder-gray-700 transition-all rounded-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Categoría de Repuesto</label>
                        <select
                          value={newPartCategory}
                          onChange={(e) => setNewPartCategory(e.target.value)}
                          className="w-full bg-[#080808] border border-white/10 focus:border-[#ff5a00]/50 focus:outline-none px-3 py-2.5 text-xs text-[#e8e8e8] transition-all rounded-none"
                        >
                          <option value="Frenos">Frenado y calipers</option>
                          <option value="Lubricantes">Líquidos y Aceites</option>
                          <option value="Filtros">Filtros de Aire / Combustible</option>
                          <option value="Eléctrico">Sistema Eléctrico y Bujías</option>
                          <option value="Repuestos">Repuestos Generales</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Precio Unit.</label>
                          <input
                            type="number"
                            placeholder="COP"
                            value={newPartPrice}
                            onChange={(e) => setNewPartPrice(e.target.value)}
                            className="w-full bg-[#080808] border border-white/10 hover:border-white/20 focus:border-[#ff5a00]/50 focus:outline-none px-3 py-2.5 text-xs text-[#e8e8e8] placeholder-gray-700 transition-all rounded-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Cantidad Inicial</label>
                          <input
                            type="number"
                            placeholder="U"
                            value={newPartStock}
                            onChange={(e) => setNewPartStock(e.target.value)}
                            className="w-full bg-[#080808] border border-white/10 hover:border-white/20 focus:border-[#ff5a00]/50 focus:outline-none px-3 py-2.5 text-xs text-[#e8e8e8] placeholder-gray-700 transition-all rounded-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Localización del Stock</label>
                        <input
                          type="text"
                          placeholder="Ej: Estante B4"
                          value={newPartLoc}
                          onChange={(e) => setNewPartLoc(e.target.value)}
                          className="w-full bg-[#080808] border border-white/10 hover:border-white/20 focus:border-[#ff5a00]/50 focus:outline-none px-3 py-2.5 text-xs text-[#e8e8e8] placeholder-gray-700 transition-all rounded-none"
                        />
                      </div>

                      {inventoryError && (
                        <p className="text-red-500 font-mono text-[9px] pt-1">⚠️ {inventoryError}</p>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-[#ff5a00] hover:bg-[#ff7a2a] text-black font-extrabold uppercase py-3 tracking-widest text-[10px] transition-all shadow-[0_5px_15px_rgba(255,90,0,0.1)] flex items-center justify-center gap-2"
                      >
                        Añadir al Inventario →
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================
               TAB 5: AUDITORÍA & REPORTES
               ======================================================== */}
            {activeTab === "reportes" && (
              <motion.div
                key="tab-reportes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h2 className="font-['Barlow_Condensed'] text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#ff5a00]" />
                    Generación de Reportes y Auditoría
                  </h2>
                  <span className="text-xs text-gray-500 font-mono">EXPORTACIÓN Y ANÁLISIS DE DATOS</span>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Card Report 1 */}
                  <div className="bg-[#111] border border-white/5 p-6 space-y-4 hover:border-white/10 transition-all flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">SISTEMA CÓMPUTO</span>
                      <h4 className="font-['Barlow_Condensed'] text-lg font-bold text-white uppercase mt-2">
                        Resumen de Agenda & Citas Activas
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-light mt-2">
                        Genera un reporte consolidado con las citas agendadas, vehículos en taller mecánico, estados del servicio y asignaciones de los mecánicos operadores.
                      </p>
                    </div>
                    <button
                      onClick={() => handleGenerateReport("Reporte Consolidado de Agenda & Citas", "citas")}
                      disabled={isGenerating}
                      className="w-full bg-[#ff5a00] hover:bg-[#ff7a2a] text-black font-extrabold uppercase py-3 text-[9px] tracking-widest transition-all mt-4 text-center"
                    >
                      {isGenerating && reportTitle.includes("Agenda") ? "Procesando Datos..." : "Generar Reporte ⇁"}
                    </button>
                  </div>

                  {/* Card Report 2 */}
                  <div className="bg-[#111] border border-white/5 p-6 space-y-4 hover:border-white/10 transition-all flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">SISTEMA FINANCIERO</span>
                      <h4 className="font-['Barlow_Condensed'] text-lg font-bold text-white uppercase mt-2">
                        Auditoría Contable & Ganancias Q2
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-light mt-2">
                        Consolida las transacciones completadas, subtotal de mano de obra y costos de consumibles en el taller mecánico, calculando la ganancia neta.
                      </p>
                    </div>
                    <button
                      onClick={() => handleGenerateReport("Auditoría Contable y Estado de Ganancias", "finanzas")}
                      disabled={isGenerating}
                      className="w-full bg-[#ff5a00] hover:bg-[#ff7a2a] text-black font-extrabold uppercase py-3 text-[9px] tracking-widest transition-all mt-4 text-center"
                    >
                      {isGenerating && reportTitle.includes("Contable") ? "Procesando Datos..." : "Generar Reporte ⇁"}
                    </button>
                  </div>

                  {/* Card Report 3 */}
                  <div className="bg-[#111] border border-white/5 p-6 space-y-4 hover:border-white/10 transition-all flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">SISTEMA INVENTARIO</span>
                      <h4 className="font-['Barlow_Condensed'] text-lg font-bold text-white uppercase mt-2">
                        Reporte General de Stock Crítico
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-light mt-2">
                        Extrae un inventario completo de consumibles y repuestos del taller mecánico, señalando las piezas que requieren compra inmediata por stock menor a 10.
                      </p>
                    </div>
                    <button
                      onClick={() => handleGenerateReport("Reporte de Inventario y Piezas Críticas", "inventario")}
                      disabled={isGenerating}
                      className="w-full bg-[#ff5a00] hover:bg-[#ff7a2a] text-black font-extrabold uppercase py-3 text-[9px] tracking-widest transition-all mt-4 text-center"
                    >
                      {isGenerating && reportTitle.includes("Inventario") ? "Procesando Datos..." : "Generar Reporte ⇁"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ========================================================
         MODAL DE REPORTE TÉCNICO SIMULADO (HIGH FIDELITY COCKPIT OVERLAY)
         ======================================================== */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white text-black p-6 md:p-10 max-w-3xl w-full font-sans relative border-t-8 border-[#ff5a00] shadow-2xl my-8 text-left"
            >
              {/* Close Button */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-black hover:bg-[#ff5a00] text-white font-bold py-1.5 px-3 text-[10px] tracking-wider uppercase rounded-none transition-colors"
                >
                  Imprimir Reporte
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1.5 px-3 text-[10px] tracking-wider uppercase rounded-none transition-colors"
                >
                  Cerrar
                </button>
              </div>

              {/* REPORT LOGO HEADER */}
              <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
                <div>
                  <h2 className="font-['Barlow_Condensed'] text-3xl font-extrabold tracking-widest uppercase leading-none">
                    SIG<span className="text-[#ff5a00]">MOTOS</span>
                  </h2>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mt-1">
                    SISTEMA PROFESIONAL DE GESTIÓN DE TALLERES • ADMINISTRACIÓN
                  </p>
                  <p className="text-[10px] text-gray-600">
                    Calle 13 # 44 - 92, Cali • Tel: (602) 485-9000
                  </p>
                </div>
                <div className="text-right font-mono text-xs">
                  <p className="font-bold text-sm bg-black text-white px-2 py-1 uppercase tracking-wider">
                    REPORTE GENERAL
                  </p>
                  <p className="text-gray-500 mt-2">ID AUDIT: #{Math.floor(100000 + Math.random() * 900000)}</p>
                  <p className="text-gray-500">Fecha: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-['Barlow_Condensed'] text-xl font-bold uppercase tracking-tight text-gray-900 border-b border-gray-200 pb-1 mb-3">
                    {reportTitle}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-mono">
                    GENERADO POR: JOSÉ CÁRDENAS (SISTEMAS GENERAL) • ESTADO: CONSOLIDADO APROBADO
                  </p>
                </div>

                {/* Table Data Render dynamically based on what was selected */}
                <div className="border border-gray-200 overflow-hidden">
                  <table className="w-full text-left font-mono text-[10px] border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase border-b border-gray-200">
                        <th className="p-2.5">Identificador / ID</th>
                        <th className="p-2.5">Descripción / Parámetro</th>
                        <th className="p-2.5">Detalle / Responsable</th>
                        <th className="p-2.5 text-right">Valoración / Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportContent.map((item: any, idx: number) => {
                        // Check if it is appointment, receipt or spare part
                        const id = item.id;
                        let desc = "";
                        let detail = "";
                        let val = "";

                        if (item.customer && item.bike) {
                          // Appointment
                          desc = `${item.bike} (${item.service})`;
                          detail = `${item.customer} • Mec: ${item.mechanic}`;
                          val = `$${item.price.toLocaleString("es-CO")} COP`;
                        } else if (item.customer && item.amount) {
                          // Finance
                          desc = item.service;
                          detail = item.customer;
                          val = `$${item.amount.toLocaleString("es-CO")} COP`;
                        } else {
                          // Spare part
                          desc = item.name;
                          detail = `Loc: ${item.location}`;
                          val = `${item.stock} U (Unit: $${item.price.toLocaleString("es-CO")})`;
                        }

                        return (
                          <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-2.5 font-bold text-gray-700">{id}</td>
                            <td className="p-2.5 text-gray-900">{desc}</td>
                            <td className="p-2.5 text-gray-600 uppercase">{detail}</td>
                            <td className="p-2.5 text-right font-bold text-gray-900">{val}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary summary metrics based on report content */}
                <div className="bg-gray-50 p-4 border border-gray-200 text-xs flex justify-between items-center font-mono font-bold">
                  <span>METRIC CONSOLIDATED TOTAL</span>
                  <span className="text-[#ff5a00] text-sm">
                    {reportTitle.includes("Contable")
                      ? `$${totalEarnings.toLocaleString("es-CO")} COP`
                      : reportTitle.includes("Agenda")
                      ? `${appointments.length} Citas Registradas`
                      : `${parts.length} Repuestos en Auditoría`}
                  </span>
                </div>

                {/* SIGNATURE SECTION */}
                <div className="mt-12 flex justify-between items-end border-t border-gray-200 pt-8 font-mono text-[9px] text-gray-400">
                  <div className="text-center w-48">
                    <div className="h-8 border-b border-black mb-2" />
                    <p className="uppercase font-bold text-black">JOSÉ CÁRDENAS</p>
                    <p>Administrador Firmante</p>
                  </div>
                  <div className="text-center w-48">
                    <div className="h-8 border-b border-black mb-2" />
                    <p className="uppercase font-bold text-black">SISTEMAS CORE</p>
                    <p>Firma y Sello de Auditoría</p>
                  </div>
                </div>
              </div>

              {/* PRINT FOOTER */}
              <div className="text-center text-[9px] text-gray-400 mt-8 border-t border-gray-100 pt-4">
                El presente es un documento de auditoría digital interna generado por SIGMOTOS Core.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
