import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Base de Datos de Telemetría Mantenimiento (Mock de Alta Fidelidad)
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
  mechanic: {
    name: string;
    level: string;
    avatar: string;
  };
  procedures: Procedure[];
  timeline: TimelineStep[];
  logs: TechLog[];
}

const mockDatabase: Record<string, BikeMaintenance> = {
  "NJA-400": {
    id: "SIG-88402-NJA",
    plate: "NJA-400",
    brand: "Kawasaki",
    model: "NINJA 400 SE",
    year: "2022",
    engine: "399 cc (Bicilíndrico)",
    mileage: "12,450 km",
    progress: 60,
    statusText: "Reparación Activa",
    statusType: "reparacion",
    eta: "Hoy, 5:30 PM (aprox. 2.5 hs)",
    mechanic: {
      name: "Carlos Mendoza",
      level: "Técnico Nivel Oro (Especialista Kawa)",
      avatar: "⚙️",
    },
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
      { time: "11:00", message: "Diagnóstico inicial finalizado. Filtro de aire K&N y bujías NGK Iridium preparadas para instalación preventiva." },
      { time: "09:30", message: "Inspección estética aprobada en bahía de recepción 2." },
    ],
  },
  "MT09-X": {
    id: "SIG-91104-MTO",
    plate: "MT09-X",
    brand: "Yamaha",
    model: "MT-09 Hypernaked",
    year: "2023",
    engine: "890 cc (Tricilíndrico CP3)",
    mileage: "8,320 km",
    progress: 100,
    statusText: "Listo para Retiro",
    statusType: "listo",
    eta: "Listo para entrega inmediata",
    mechanic: {
      name: "Andrés Restrepo",
      level: "Especialista Master Yamaha Hypernaked",
      avatar: "⚡",
    },
    procedures: [
      { name: "Pastillas de Freno Brembo Sinterizadas traseras", price: 220000, status: "completed" },
      { name: "Ajuste, Tensión y Lubricación de Cadena", price: 45000, status: "completed" },
      { name: "Mantenimiento Preventivo Horquilla Delantera", price: 180000, status: "completed" },
    ],
    timeline: [
      { title: "01. Ingreso y Recepción", desc: "Unidad ingresada por desgaste de frenada y mantenimiento periódico.", time: "15/05/2026 08:30 AM", status: "completed" },
      { title: "02. Diagnóstico Técnico", desc: "Validación de espesor de discos y recalibración electrónica del mapa de control del CP3.", time: "15/05/2026 09:45 AM", status: "completed" },
      { title: "03. Servicio y Reparación", desc: "Reemplazo de pastillas Brembo e inspección hidráulica de suspensión finalizados.", time: "15/05/2026 11:30 AM", status: "completed" },
      { title: "04. Pruebas de Calidad", desc: "Prueba de ruta de 5km completada. Excelente respuesta del acelerador electrónico y frenado.", time: "15/05/2026 02:00 PM", status: "completed" },
      { title: "05. Listo para Entrega", desc: "Lavado detallado con cera protectora de chasis completado. Documentación firmada.", time: "15/05/2026 03:15 PM", status: "completed" },
    ],
    logs: [
      { time: "15:15", message: "Lavado premium terminado. Motocicleta movida a la zona de entregas techada." },
      { time: "14:00", message: "Prueba de ruta en autopista exitosa. Absolutamente cero fallas de suspensión." },
      { time: "11:30", message: "Instalación de pastillas Brembo finalizada. Torsión de calipers ajustada a especificación de fábrica." },
    ],
  },
  "RC-200": {
    id: "SIG-37421-KTM",
    plate: "RC-200",
    brand: "KTM",
    model: "RC 200 GP",
    year: "2024",
    engine: "199.5 cc (Monocilíndrico)",
    mileage: "4,100 km",
    progress: 20,
    statusText: "Diagnóstico Inicial",
    statusType: "diagnostico",
    eta: "Mañana, 12:00 PM",
    mechanic: {
      name: "Mateo Ortiz",
      level: "Técnico KTM Ready to Race Certificado",
      avatar: "🏁",
    },
    procedures: [
      { name: "Diagnóstico de Campana y Discos de Embrague", price: 60000, status: "progress" },
      { name: "Kit de Discos de Embrague OEM KTM", price: 240000, status: "pending" },
      { name: "Cambio de Aceite Motul 7100 y Filtros", price: 110000, status: "pending" },
    ],
    timeline: [
      { title: "01. Ingreso y Recepción", desc: "Ingreso con reporte de tironeo al acoplar embrague y ruidos leves.", time: "16/05/2026 04:30 PM", status: "completed" },
      { title: "02. Diagnóstico Técnico", desc: "Desmontaje de tapa lateral de transmisión para medición dimensional de discos de fricción.", time: "16/05/2026 05:00 PM", status: "active" },
      { title: "03. Servicio y Reparación", desc: "Sustitución de componentes según reporte del diagnóstico.", status: "pending" },
      { title: "04. Pruebas de Calidad", desc: "Comprobación de torque y acople de transmisión en rodillos.", status: "pending" },
      { title: "05. Listo para Entrega", desc: "Limpieza final de carcasas y entrega formal.", status: "pending" },
    ],
    logs: [
      { time: "17:00", message: "Tapa lateral embrague removida. Inspección preliminar muestra desgaste fuera de rango en discos centrales." },
      { time: "16:30", message: "Vehículo en rampa de diagnóstico 4 asignado a Mateo Ortiz." },
    ],
  },
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
    if (!plateCode.trim()) {
      setSearchError("Por favor ingrese una placa o código.");
      return;
    }

    const cleanPlate = plateCode.trim().toUpperCase();
    setSearchError("");
    setIsSearching(true);
    setBootLogs([]);

    // Efecto de carga telemática al estilo terminal de carreras
    const logsSequence = [
      `INICIALIZANDO COMUNICACIÓN CON BASE DE DATOS SIGMOTOS...`,
      `CONEXIÓN CON ESTACIÓN DE MANTENIMIENTO: ACTIVA`,
      `BUSCANDO PLACA / ID DE SEGUIMIENTO: [ ${cleanPlate} ]...`,
      `DATOS ENCONTRADOS. CARGANDO TELEMETRÍA EN TIEMPO REAL...`,
      `INICIALIZACIÓN COMPLETA. DESPLEGANDO CABINA.`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logsSequence.length) {
        setBootLogs(prev => [...prev, logsSequence[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          const match = mockDatabase[cleanPlate];
          if (match) {
            setSelectedData(match);
          } else {
            setSearchError(`No se encontró registro para "${cleanPlate}". Prueba con NJA-400, MT09-X o RC-200.`);
            setSelectedData(null);
          }
          setIsSearching(false);
        }, 600);
      }
    }, 250);
  };

  const handleSimulateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      setShowReportModal(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#e8e8e8] font-sans antialiased selection:bg-[#ff5a00] selection:text-white">
      {/* HEADER HUD */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/85 backdrop-blur-md border-b border-white/5 py-4 px-6 lg:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
          <div className="font-['Barlow_Condensed'] text-xl font-extrabold tracking-widest text-[#e8e8e8]">
            <span className="text-[#ff5a00]">SIG</span>MOTOS
          </div>
          <span className="bg-white/5 border border-white/10 text-[9px] px-2 py-0.5 font-mono text-gray-400 uppercase tracking-widest rounded">
            Workshop HUD v2.4
          </span>
        </div>
        <div className="flex items-center gap-4">
          {selectedData && (
            <button 
              onClick={() => {
                setSelectedData(null);
                setSearchQuery("");
              }}
              className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest border border-white/5 hover:border-white/20 bg-white/5 px-3 py-1.5 transition-all"
            >
              Consultar otra
            </button>
          )}
          <button 
            onClick={() => navigate("/home")}
            className="text-[10px] font-bold uppercase tracking-widest text-black bg-[#ff5a00] hover:bg-[#ff7a2a] px-4 py-2 transition-all"
            style={{ clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)" }}
          >
            Volver a Inicio
          </button>
        </div>
      </header>

      {/* RENDER PRINCIPAL */}
      <main className="pt-24 pb-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!selectedData ? (
            /* ========================================================
               SECCIÓN 1: BUSCADOR INICIAL (SEARCH COCKPIT)
               ======================================================== */
            <motion.div
              key="search-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-5xl lg:max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-center py-6"
            >
              {/* Left Column: Title and telemetry vibes */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff5a00]/30 bg-[#ff5a00]/10 text-xs font-mono text-[#ff5a00] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#ff5a00] animate-ping" />
                  Módulo de Consulta al Cliente
                </div>
                <h1 className="font-['Barlow_Condensed'] text-5xl md:text-7xl font-extrabold uppercase leading-none tracking-tighter">
                  ESTADO DE <span className="text-[#ff5a00]">MANTENIMIENTO</span>
                </h1>
                <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed font-light">
                  Ingresa la placa de tu motocicleta para conectarte con el panel de telemetría y ver el avance mecánico, diagnóstico OBD II y logs del taller.
                </p>
                
                {/* Stats Mock */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 max-w-md">
                  <div>
                    <p className="font-['Barlow_Condensed'] text-2xl font-bold text-white">12</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Bahías Activas</p>
                  </div>
                  <div>
                    <p className="font-['Barlow_Condensed'] text-2xl font-bold text-[#ff5a00]">27 min</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Respuesta Prom.</p>
                  </div>
                  <div>
                    <p className="font-['Barlow_Condensed'] text-2xl font-bold text-white">99.8%</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Fiabilidad GPS</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Search Box HUD */}
              <div className="lg:col-span-5">
                <div className="bg-[#111] border border-white/5 p-6 md:p-8 relative overflow-hidden shadow-2xl">
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">ESTACIÓN DE BÚSQUEDA 01</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>

                    {!isSearching ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                            Código o Placa Vehicular
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Ej: NJA-400"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                              className="w-full bg-[#080808] border border-white/10 hover:border-white/20 focus:border-[#ff5a00]/50 focus:outline-none px-5 py-4.5 font-mono text-xl uppercase tracking-widest text-[#e8e8e8] placeholder-gray-700 transition-all rounded-none"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-mono text-xs animate-pulse">
                              █
                            </span>
                          </div>
                          {searchError && (
                            <p className="text-red-500 text-xs font-mono pt-1">⚠️ {searchError}</p>
                          )}
                        </div>

                        <button
                          onClick={() => handleSearch(searchQuery)}
                          className="w-full bg-[#ff5a00] hover:bg-[#ff7a2a] text-black font-extrabold uppercase py-5 tracking-[0.25em] text-sm transition-all shadow-[0_10px_20px_rgba(255,90,0,0.2)] hover:shadow-[0_12px_30px_rgba(255,90,0,0.45)] flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
                        >
                          Conectar Telemetría
                          <span className="text-lg">⇁</span>
                        </button>

                        {/* Quick Demo Demos */}
                        <div className="pt-4 border-t border-white/5 space-y-3">
                          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                            Consolas de Prueba Interactiva (Demos)
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => {
                                setSearchQuery("NJA-400");
                                handleSearch("NJA-400");
                              }}
                              className="bg-white/5 border border-white/5 hover:border-[#ff5a00]/50 hover:bg-[#ff5a00]/5 text-[10px] font-mono text-gray-300 py-2.5 transition-all text-center"
                            >
                              NJA-400
                              <span className="block text-[8px] text-[#ff5a00] uppercase mt-0.5 font-sans">Reparación</span>
                            </button>
                            <button
                              onClick={() => {
                                setSearchQuery("MT09-X");
                                handleSearch("MT09-X");
                              }}
                              className="bg-white/5 border border-white/5 hover:border-green-500/50 hover:bg-green-500/5 text-[10px] font-mono text-gray-300 py-2.5 transition-all text-center"
                            >
                              MT09-X
                              <span className="block text-[8px] text-green-500 uppercase mt-0.5 font-sans">Listo</span>
                            </button>
                            <button
                              onClick={() => {
                                setSearchQuery("RC-200");
                                handleSearch("RC-200");
                              }}
                              className="bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 text-[10px] font-mono text-gray-300 py-2.5 transition-all text-center"
                            >
                              RC-200
                              <span className="block text-[8px] text-blue-400 uppercase mt-0.5 font-sans">Diagnóstico</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Telemetry Boot loader animation */
                      <div className="space-y-4 font-mono text-[10px] text-gray-400 bg-black/50 p-4 border border-white/5 min-h-[220px] flex flex-col justify-center">
                        <div className="space-y-1">
                          {bootLogs.map((log, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`flex items-start gap-2 ${
                                index === bootLogs.length - 1 ? "text-[#ff5a00]" : "text-gray-400"
                              }`}
                            >
                              <span>&gt;</span>
                              <span>{log}</span>
                            </motion.div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5 mt-4">
                          <span className="w-2 h-2 rounded-full bg-[#ff5a00] animate-ping" />
                          <span className="text-[9px] uppercase tracking-widest text-[#ff5a00] font-bold">
                            Estableciendo túnel telemático...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ========================================================
               SECCIÓN 2: COCKPIT DE TELEMETRÍA (RESULTS HUD)
               ======================================================== */
            <motion.div
              key="telemetry-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-12 gap-8 items-start py-4"
            >
              {/* SIDEBAR TELEMETRY (4 columns) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Gauge & Main Info Card */}
                <div className="bg-[#111] border border-white/5 p-6 relative overflow-hidden shadow-xl">
                  {/* Decorative corner tag */}
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10px] right-[-30px] rotate-45 w-20 bg-white/5 border border-white/10 text-center py-0.5 text-[8px] tracking-widest font-mono text-gray-500">
                      INFO
                    </div>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-[#ff5a00] uppercase tracking-widest font-bold">
                        Unidad de Telemetría
                      </span>
                      <span className="text-gray-500 font-mono text-xs">#{selectedData.id}</span>
                    </div>

                    {/* Animated SVG Progress Gauge */}
                    <div className="flex flex-col items-center justify-center py-4 relative">
                      <svg className="w-36 h-36 transform -rotate-90">
                        {/* Track ring */}
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          stroke="rgba(255,255,255,0.03)"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        {/* Progress ring */}
                        <motion.circle
                          cx="72"
                          cy="72"
                          r="60"
                          stroke={
                            selectedData.statusType === "listo"
                              ? "#22c55e"
                              : selectedData.statusType === "reparacion"
                              ? "#ff5a00"
                              : "#3b82f6"
                          }
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={377} // 2 * pi * r
                          initial={{ strokeDashoffset: 377 }}
                          animate={{ strokeDashoffset: 377 - (377 * selectedData.progress) / 100 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Central stats text */}
                      <div className="absolute inset-0 flex flex-col justify-center items-center mt-2">
                        <span className="font-['Barlow_Condensed'] text-4xl font-extrabold text-white tracking-tighter">
                          {selectedData.progress}%
                        </span>
                        <span className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">
                          Completado
                        </span>
                      </div>
                    </div>

                    {/* Estimated Time Badge */}
                    <div className="bg-white/5 border border-white/5 p-4 text-center">
                      <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                        Compromiso de Entrega
                      </p>
                      <p className={`font-['Barlow_Condensed'] text-lg font-bold tracking-tight uppercase ${
                        selectedData.statusType === "listo" ? "text-green-500" : "text-[#ff5a00]"
                      }`}>
                        {selectedData.statusType === "listo" ? "🟢 " : "⏱️ "}
                        {selectedData.eta}
                      </p>
                    </div>

                    {/* Vehicle Specs Grid */}
                    <div className="border-t border-white/5 pt-4 space-y-3 font-mono text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">MOTO</span>
                        <span className="text-white uppercase font-bold">
                          {selectedData.brand} {selectedData.model}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">PLACA</span>
                        <span className="text-[#ff5a00] uppercase font-bold">{selectedData.plate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">MODELO / AÑO</span>
                        <span className="text-white">{selectedData.year}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">MOTOR</span>
                        <span className="text-white">{selectedData.engine}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">KILOMETRAJE</span>
                        <span className="text-white">{selectedData.mileage}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">ESTADO GLOBAL</span>
                        <span className={`px-2 py-0.5 text-[9px] font-sans font-bold uppercase rounded ${
                          selectedData.statusType === "listo"
                            ? "bg-green-500/10 border border-green-500/30 text-green-400"
                            : selectedData.statusType === "reparacion"
                            ? "bg-[#ff5a00]/10 border border-[#ff5a00]/30 text-[#ff5a00]"
                            : "bg-blue-500/10 border border-blue-500/30 text-blue-400"
                        }`}>
                          {selectedData.statusText}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mechanic Profile Card */}
                <div className="bg-[#111] border border-white/5 p-5 flex items-center gap-4 relative overflow-hidden">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-none flex items-center justify-center text-2xl">
                    {selectedData.mechanic.avatar}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">MECÁNICO ASIGNADO</p>
                    <h4 className="font-['Barlow_Condensed'] text-base font-bold text-white uppercase leading-none">
                      {selectedData.mechanic.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono">{selectedData.mechanic.level}</p>
                  </div>
                  <a
                    href="https://wa.me/573000000000"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 bg-white/5 hover:bg-[#25D366]/20 border border-white/5 hover:border-[#25D366]/50 flex items-center justify-center text-lg transition-all text-[#25D366]"
                    title="Enviar WhatsApp"
                  >
                    💬
                  </a>
                </div>
              </div>

              {/* TIMELINE & DATA SHEETS (8 columns) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 1. Timeline Progress Tracker */}
                <div className="bg-[#111] border border-white/5 p-6 md:p-8 space-y-6 shadow-xl">
                  <h3 className="font-['Barlow_Condensed'] text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#ff5a00]" />
                    Progreso Mecánico Detallado
                  </h3>

                  {/* Vertical Timeline */}
                  <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                    {selectedData.timeline.map((step, idx) => (
                      <div className="relative group" key={idx}>
                        {/* Timeline Node Point */}
                        <div
                          className={`absolute left-[-29px] top-1.5 w-6 h-6 rounded-none flex items-center justify-center border font-mono text-[9px] font-bold z-10 transition-all ${
                            step.status === "completed"
                              ? "bg-green-500 border-green-600 text-black shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                              : step.status === "active"
                              ? "bg-[#ff5a00] border-[#ff5a00] text-black animate-pulse shadow-[0_0_12px_rgba(255,90,0,0.5)]"
                              : "bg-[#111] border-white/10 text-gray-500"
                          }`}
                        >
                          {step.status === "completed" ? "✓" : idx + 1}
                        </div>

                        {/* Step Details */}
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4
                              className={`font-['Barlow_Condensed'] text-base font-bold uppercase tracking-wide transition-all ${
                                step.status === "completed"
                                  ? "text-white"
                                  : step.status === "active"
                                  ? "text-[#ff5a00]"
                                  : "text-gray-600"
                              }`}
                            >
                              {step.title}
                            </h4>
                            {step.time && (
                              <span className="font-mono text-[9px] bg-white/5 border border-white/5 px-2 py-0.5 text-gray-500">
                                {step.time}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs leading-relaxed max-w-2xl font-light ${
                            step.status === "pending" ? "text-gray-700" : "text-gray-400"
                          }`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Active Procedures List */}
                <div className="bg-[#111] border border-white/5 p-6 md:p-8 space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <h3 className="font-['Barlow_Condensed'] text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-[#ff5a00]" />
                      Procedimientos Ejecutados
                    </h3>
                    <div className="font-mono text-[10px] text-gray-500">
                      ORDEN DE SERVICIO FACTURABLE
                    </div>
                  </div>

                  <div className="border border-white/5 divide-y divide-white/5 overflow-hidden">
                    {selectedData.procedures.map((proc, idx) => (
                      <div
                        className="flex items-center justify-between p-4 bg-[#0d0d0d] hover:bg-white/5 transition-all gap-4"
                        key={idx}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-base flex-shrink-0 ${
                            proc.status === "completed"
                              ? "text-green-500"
                              : proc.status === "progress"
                              ? "text-[#ff5a00] animate-pulse"
                              : "text-gray-600"
                          }`}>
                            {proc.status === "completed" ? "✅" : proc.status === "progress" ? "⚙️" : "💤"}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-white uppercase">{proc.name}</p>
                            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">
                              TECTOOL: #{Math.floor(1000 + Math.random() * 9000)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right font-mono flex items-center gap-4">
                          <span className={`text-xs font-bold uppercase ${
                            proc.status === "completed"
                              ? "text-green-400"
                              : proc.status === "progress"
                              ? "text-[#ff5a00]"
                              : "text-gray-500"
                          }`}>
                            {proc.status === "completed" ? "Listo" : proc.status === "progress" ? "En Curso" : "Pendiente"}
                          </span>
                          <span className="text-xs text-gray-300 font-bold">
                            ${proc.price.toLocaleString("es-CO")} COP
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Total Mock */}
                    <div className="p-4 bg-[#111] flex justify-between items-center font-mono text-xs border-t-2 border-white/10">
                      <span className="text-gray-500 uppercase font-bold">Total Facturado Estimado</span>
                      <span className="text-base text-[#ff5a00] font-extrabold font-['Barlow_Condensed']">
                        $
                        {selectedData.procedures
                          .reduce((acc, p) => acc + p.price, 0)
                          .toLocaleString("es-CO")}{" "}
                        COP
                      </span>
                    </div>
                  </div>

                  {/* PDF report simulation CTA button */}
                  <div className="pt-2 flex justify-end gap-4">
                    <button
                      onClick={handleSimulateReport}
                      disabled={isGeneratingReport}
                      className="bg-white hover:bg-[#ff5a00] text-black hover:text-white font-extrabold uppercase px-8 py-4 text-xs tracking-widest transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
                      style={{ clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)" }}
                    >
                      {isGeneratingReport ? "Generando Telemetría..." : "Descargar Reporte PDF →"}
                    </button>
                  </div>
                </div>

                {/* 3. Tech Logs (Terminal Style) */}
                <div className="bg-[#111] border border-white/5 p-6 md:p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-['Barlow_Condensed'] text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-[#ff5a00]" />
                      Terminal de Notas Técnicas (Live Log)
                    </h3>
                    <span className="px-2 py-0.5 text-[8px] bg-red-500/10 border border-red-500/30 text-red-400 font-mono tracking-widest uppercase rounded">
                      Live Feed
                    </span>
                  </div>

                  <div className="bg-[#080808] border border-white/5 p-4 font-mono text-xs text-gray-400 space-y-3 max-h-60 overflow-y-auto">
                    {selectedData.logs.map((log, idx) => (
                      <div className="flex items-start gap-4" key={idx}>
                        <span className="text-[#ff5a00] flex-shrink-0">[{log.time}]</span>
                        <div className="space-y-1">
                          <span className="text-gray-300 uppercase font-bold">SYSTEM_LOG_EXEC:</span>
                          <p className="text-gray-400 font-light text-[11px] leading-relaxed">{log.message}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-2 text-[10px] text-gray-600 border-t border-white/5 animate-pulse">
                      <span>&gt;</span>
                      <span>Esperando entradas telemáticas adicionales del sensor central...</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ========================================================
         MODAL DE REPORTE TÉCNICO SIMULADO (PRINT PREVIEW HIGH FIDELITY)
         ======================================================== */}
      <AnimatePresence>
        {showReportModal && selectedData && (
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
              {/* Decorative print buttons */}
              <div className="absolute top-4 right-4 flex gap-2 no-print">
                <button
                  onClick={() => window.print()}
                  className="bg-black hover:bg-[#ff5a00] text-white font-bold py-1.5 px-3 text-[10px] tracking-wider uppercase rounded-none transition-colors"
                >
                  Imprimir
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
                    SISTEMA PROFESIONAL DE GESTIÓN DE TALLERES
                  </p>
                  <p className="text-[10px] text-gray-600">
                    Calle 13 # 44 - 92, Cali • Tel: (602) 485-9000
                  </p>
                </div>
                <div className="text-right font-mono text-xs">
                  <p className="font-bold text-sm bg-black text-white px-2 py-1 uppercase tracking-wider">
                    REPORTE DE SERVICIO
                  </p>
                  <p className="text-gray-500 mt-2">OS: {selectedData.id}</p>
                  <p className="text-gray-500">Fecha: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* SHEET SPECIFICATIONS */}
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 border border-gray-200 mb-6 font-mono text-xs">
                <div className="space-y-1">
                  <p className="text-gray-500 font-bold uppercase border-b border-gray-200 pb-1">DATOS DE LA MOTO</p>
                  <p><span className="text-gray-400">Marca/Modelo:</span> {selectedData.brand} {selectedData.model}</p>
                  <p><span className="text-gray-400">Placa:</span> {selectedData.plate}</p>
                  <p><span className="text-gray-400">Año:</span> {selectedData.year}</p>
                  <p><span className="text-gray-400">Cilindrada:</span> {selectedData.engine}</p>
                  <p><span className="text-gray-400">Kilometraje:</span> {selectedData.mileage}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 font-bold uppercase border-b border-gray-200 pb-1">DATOS TÉCNICOS</p>
                  <p><span className="text-gray-400">Técnico Asignado:</span> {selectedData.mechanic.name}</p>
                  <p><span className="text-gray-400">Especialidad:</span> {selectedData.mechanic.level}</p>
                  <p><span className="text-gray-400">Fase del Servicio:</span> {selectedData.statusText} ({selectedData.progress}%)</p>
                  <p><span className="text-gray-400">Entrega Estimada:</span> {selectedData.eta}</p>
                </div>
              </div>

              {/* DETAILED WORK TABLE */}
              <div className="mb-6">
                <h4 className="font-bold uppercase text-xs mb-3 border-b-2 border-black pb-1">
                  DESGLOSE DE SERVICIOS Y CONSUMIBLES
                </h4>
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase border-b border-gray-200">
                      <th className="p-2">Procedimiento / Descripción</th>
                      <th className="p-2 text-center">Estado</th>
                      <th className="p-2 text-right">Monto Unitario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedData.procedures.map((proc, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-2 font-bold">{proc.name}</td>
                        <td className="p-2 text-center uppercase font-bold">
                          {proc.status === "completed"
                            ? "✓ COMPLETADO"
                            : proc.status === "progress"
                            ? "⚙️ EN PROCESO"
                            : "PENDIENTE"}
                        </td>
                        <td className="p-2 text-right">${proc.price.toLocaleString("es-CO")} COP</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-black font-bold">
                      <td className="p-2 uppercase" colSpan={2}>
                        Total Liquidado Estimado
                      </td>
                      <td className="p-2 text-right text-base text-[#ff5a00]">
                        ${selectedData.procedures.reduce((acc, p) => acc + p.price, 0).toLocaleString("es-CO")} COP
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* SYSTEM DIAGNOSTICS */}
              <div className="mb-6 bg-gray-50 p-4 border border-gray-200">
                <h4 className="font-bold uppercase text-xs mb-2 border-b border-gray-200 pb-1">
                  DIAGNÓSTICO Y NOTAS FINALES DEL TALLER
                </h4>
                <p className="text-xs text-gray-700 italic leading-relaxed">
                  "El estado general de la motocicleta es óptimo. Se ejecutó mantenimiento de rutina de acuerdo con el kilometraje y manual de servicio del fabricante. Se realizó la lectura y borrado de fallas de la ECU sin registrar errores activos. Se recomienda revisar el estado físico de los neumáticos en un lapso de 2,000 kilómetros debido a desgaste natural del labrado."
                </p>
              </div>

              {/* SIGNATURE SECTION */}
              <div className="mt-12 flex justify-between items-end border-t border-gray-200 pt-8 font-mono text-[10px] text-gray-500">
                <div className="text-center w-48">
                  <div className="h-10 border-b border-black mb-2" />
                  <p className="uppercase font-bold text-black">{selectedData.mechanic.name}</p>
                  <p>Firma Técnico Asignado</p>
                </div>
                <div className="text-center w-48">
                  <div className="h-10 border-b border-black mb-2" />
                  <p className="uppercase font-bold text-black">Aprobado Cliente</p>
                  <p>Firma de Recepción Conforme</p>
                </div>
              </div>

              {/* PRINT FOOTER */}
              <div className="text-center text-[9px] text-gray-400 mt-8 border-t border-gray-100 pt-4">
                El presente es un documento de telemetría digital de SIGMOTOS.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
