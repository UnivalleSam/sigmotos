import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Bike { brand: string; model: string; year: string; }
interface Service { id: string; label: string; price: number; duration: number; icon: string; }

const BRANDS = ["Yamaha", "Honda", "Kawasaki", "Suzuki", "KTM", "BMW"];
const TYPES = ["Naked", "Deportiva", "Adventure", "Offroad", "Scooter"];
const MODELS: Record<string, Record<string, string[]>> = {
  Yamaha: { Naked: ["MT-03","MT-07","MT-09","MT-10"], Deportiva: ["YZF-R15","YZF-R3","YZF-R7","YZF-R1"], Adventure: ["Ténéré 700","Super Ténéré 1200","Tracer 900 GT"], Offroad: ["YZ250F","WR450F","XTZ 150","XTZ 250"], Scooter: ["NMAX 155","XMAX 300","BWS FI"] },
  Honda: { Naked: ["CB 300F","CB 500F","CB 650R","CB 1000R"], Deportiva: ["CBR 250R","CBR 500R","CBR 650R","CBR 1000RR"], Adventure: ["CB 500X","NC 750X","Transalp XL750","Africa Twin"], Offroad: ["XR 150L","XR 190L","XR 300L","CRF 250RX"], Scooter: ["PCX 160","Elite 125","Dio110"] },
  Kawasaki: { Naked: ["Z400","Z650","Z900","Z H2"], Deportiva: ["Ninja 400","Ninja 650","Ninja ZX-6R","Ninja ZX-10R"], Adventure: ["Versys-X 300","Versys 650","Versys 1000"], Offroad: ["KLX 150","KLX 300R","KX 250","KX 450X"], Scooter: ["J300","J125"] },
  Suzuki: { Naked: ["Gixxer 150","Gixxer 250","GSX-S750","GSX-S1000"], Deportiva: ["GSX-R150","GSX-R600","GSX-R1000R","Hayabusa"], Adventure: ["V-Strom 250","V-Strom 650","V-Strom 800","V-Strom 1050"], Offroad: ["DR 150","DR 650","DR-Z400SM"], Scooter: ["Burgman 125","Access 125"] },
  KTM: { Naked: ["Duke 200","Duke 250","Duke 390","Duke 790","Duke 990"], Deportiva: ["RC 200","RC 390"], Adventure: ["Adventure 250","Adventure 390","Adventure 890","Super Adventure 1290"], Offroad: ["150 XC-W","250 EXC-F","350 EXC-F","450 EXC-F"], Scooter: [] },
  BMW: { Naked: ["G 310 R","F 900 R","S 1000 R"], Deportiva: ["S 1000 RR","M 1000 RR"], Adventure: ["G 310 GS","F 850 GS","R 1250 GS","R 1300 GS"], Offroad: ["G 450 X"], Scooter: ["C 400 X","CE 04"] },
};

const SERVICES: Service[] = [
  { id: "maint", label: "Mantenimiento General", price: 260000, duration: 240, icon: "🔧" },
  { id: "diag", label: "Scanner OBD II", price: 120000, duration: 45, icon: "💻" },
  { id: "oil", label: "Cambio Aceite Sintético", price: 90000, duration: 30, icon: "🛢️" },
  { id: "wash", label: "Lavado Detallado", price: 40000, duration: 60, icon: "🚿" },
];

const TIMES = ["08:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"];
const YEARS = Array.from({ length: 18 }, (_, i) => String(2027 - i));

export default function Booking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("2026");
  const [services, setServices] = useState<Service[]>([]);
  const [date, setDate] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const bike: Bike | null = brand && model ? { brand, model, year } : null;
  const total = services.reduce((a, s) => a + s.price, 0);
  const duration = services.reduce((a, s) => a + s.duration, 0);
  const fmtDur = (m: number) => { const h = Math.floor(m / 60), min = m % 60; return h > 0 ? `${h}h${min > 0 ? ` ${min}m` : ""}` : `${min} min`; };
  const toggleService = (s: Service) => setServices(prev => prev.find(x => x.id === s.id) ? prev.filter(x => x.id !== s.id) : [...prev, s]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080808", color: "#e8e8e8", fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #1e1e1e", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, backgroundColor: "#080808", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={() => navigate("/home")} style={backBtn}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ff5a00"; (e.currentTarget as HTMLButtonElement).style.color = "#ff5a00"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLButtonElement).style.color = "#aaa"; }}>
            ← Volver
          </button>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: "0.05em", margin: 0 }}>
            <span style={{ color: "#ff5a00" }}>SIG</span>MOTOS
            <span style={{ color: "#555", fontWeight: 400, fontSize: 14, marginLeft: 12 }}>/ Agendar servicio</span>
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: step >= 1 ? "#ff5a00" : "#333", fontWeight: step === 1 ? 700 : 400 }}>01 Configurar</span>
          <div style={{ width: 40, height: 2, backgroundColor: step >= 2 ? "#ff5a00" : "#2a2a2a", borderRadius: 1 }} />
          <span style={{ fontFamily: "monospace", fontSize: 11, color: step >= 2 ? "#ff5a00" : "#333", fontWeight: step === 2 ? 700 : 400 }}>02 Agendar</span>
        </div>
      </header>

      {/* Success modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              style={{ backgroundColor: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 40, maxWidth: 420, width: "100%", textAlign: "center" }}>
              <div style={{ width: 60, height: 60, backgroundColor: "#ff5a00", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 26, fontWeight: 900, color: "#fff" }}>✓</div>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, margin: "0 0 6px" }}>Cita confirmada</h2>
              <p style={{ color: "#555", fontSize: 12, margin: "0 0 24px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Protocolo de recepción activado</p>
              <div style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 6, padding: 16, marginBottom: 24, textAlign: "left" }}>
                {[
                  ["Unidad", `${bike?.brand} ${bike?.model}`],
                  ["Horario", `${date} Mayo, 2026 · ${time}`],
                  ["Ticket ID", `#${Math.random().toString(36).substr(2, 8).toUpperCase()}`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 12, marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #1a1a1a" }}>
                    <span style={{ color: "#555" }}>{k}</span>
                    <span style={{ color: k === "Ticket ID" ? "#ff5a00" : "#c8c8c8", fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/home")}
                style={{ width: "100%", backgroundColor: "#ff5a00", border: "none", color: "#fff", padding: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", borderRadius: 5 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ff7a2a")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff5a00")}>
                Entendido, cerrar →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <AnimatePresence mode="wait">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.25 }}
              style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Selección de moto */}
                <div style={card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #1a1a1a" }}>
                    <h3 style={sectionTitle}>Selección de vehículo</h3>
                    <span style={{ backgroundColor: "#ff5a0015", border: "1px solid #ff5a0030", color: "#ff5a00", fontSize: 10, padding: "3px 10px", borderRadius: 3, fontFamily: "monospace", textTransform: "uppercase" }}>Filtro dinámico</span>
                  </div>

                  {/* Marca */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={fieldLabel}>1. Marca</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
                      {BRANDS.map(b => (
                        <button key={b} onClick={() => { setBrand(b); setModel(""); }}
                          style={{ padding: "10px 4px", fontSize: 12, fontWeight: 600, textAlign: "center", border: `1px solid ${brand === b ? "#ff5a00" : "#2a2a2a"}`, borderRadius: 5, backgroundColor: brand === b ? "#ff5a0015" : "#0d0d0d", color: brand === b ? "#ff5a00" : "#888", cursor: "pointer", transition: "all 0.2s" }}
                          onMouseEnter={(e) => { if (brand !== b) { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#e8e8e8"; } }}
                          onMouseLeave={(e) => { if (brand !== b) { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#888"; } }}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tipo */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={fieldLabel}>2. Tipo</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                      {TYPES.map(t => (
                        <button key={t} onClick={() => { setType(t); setModel(""); }}
                          style={{ padding: "10px 4px", fontSize: 12, fontWeight: 600, textAlign: "center", border: `1px solid ${type === t ? "#ff5a00" : "#2a2a2a"}`, borderRadius: 5, backgroundColor: type === t ? "#ff5a0015" : "#0d0d0d", color: type === t ? "#ff5a00" : "#888", cursor: "pointer", transition: "all 0.2s" }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Modelo */}
                  {brand && type && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ paddingTop: 16, borderTop: "1px solid #1a1a1a" }}>
                      <label style={fieldLabel}>3. Modelo</label>
                      {(() => {
                        const available = MODELS[brand]?.[type] || [];
                        return available.length > 0 ? (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                            {available.map(m => (
                              <button key={m} onClick={() => setModel(m)}
                                style={{ padding: "12px 10px", textAlign: "left", border: `1px solid ${model === m ? "#ff5a00" : "#2a2a2a"}`, borderRadius: 5, backgroundColor: model === m ? "#ff5a0015" : "#0d0d0d", cursor: "pointer", transition: "all 0.2s" }}>
                                <p style={{ color: "#ff5a00", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 3px", fontFamily: "monospace" }}>{brand}</p>
                                <p style={{ color: model === m ? "#e8e8e8" : "#888", fontSize: 13, fontWeight: 600, margin: 0 }}>{m}</p>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <input type="text" placeholder="Ingresa el modelo manualmente" value={model} onChange={(e) => setModel(e.target.value)}
                            style={{ width: "100%", backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 5, padding: "11px 14px", color: "#e8e8e8", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "#ff5a00")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")} />
                        );
                      })()}
                    </motion.div>
                  )}

                  {/* Moto configurada */}
                  {brand && model && (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                      style={{ marginTop: 16, backgroundColor: "#ff5a0010", border: "1px solid #ff5a0030", borderRadius: 6, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ color: "#ff5a00", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 3px", fontFamily: "monospace" }}>Vehículo configurado</p>
                        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, margin: 0 }}>{brand} {model}</p>
                        <p style={{ color: "#888", fontSize: 11, margin: "2px 0 0", fontFamily: "monospace" }}>Tipo: {type || "N/A"}</p>
                      </div>
                      <div>
                        <label style={{ color: "#555", fontSize: 10, display: "block", marginBottom: 4, textTransform: "uppercase" }}>Año</label>
                        <select value={year} onChange={(e) => setYear(e.target.value)}
                          style={{ backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 4, padding: "6px 10px", color: "#e8e8e8", fontSize: 13, cursor: "pointer", outline: "none" }}>
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Servicios */}
                <div style={card}>
                  <h3 style={{ ...sectionTitle, marginBottom: 20 }}>Servicios requeridos</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {SERVICES.map(s => {
                      const selected = !!services.find(x => x.id === s.id);
                      return (
                        <button key={s.id} onClick={() => toggleService(s)}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", border: `1px solid ${selected ? "#ff5a00" : "#1e1e1e"}`, borderRadius: 6, backgroundColor: selected ? "#ff5a0010" : "#0d0d0d", cursor: "pointer", transition: "all 0.2s", textAlign: "left", borderLeft: selected ? "3px solid #ff5a00" : "3px solid transparent" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <span style={{ fontSize: 22, filter: selected ? "none" : "grayscale(1)" }}>{s.icon}</span>
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 600, color: "#e8e8e8", margin: 0 }}>{s.label}</p>
                              <p style={{ fontSize: 11, color: "#555", margin: "3px 0 0", fontFamily: "monospace" }}>Duración: {fmtDur(s.duration)}</p>
                            </div>
                          </div>
                          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: selected ? "#e8e8e8" : "#555" }}>
                            ${s.price.toLocaleString("es-CO")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div style={{ ...card, position: "sticky", top: 80 }}>
                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, margin: "0 0 20px", letterSpacing: "0.05em" }}>Resumen</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "#666" }}>Servicios</span>
                      <span style={{ fontWeight: 600 }}>{services.length}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "#666" }}>Duración</span>
                      <span style={{ color: "#ff5a00", fontWeight: 600 }}>{fmtDur(duration)}</span>
                    </div>
                    <div style={{ paddingTop: 16, borderTop: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <span style={{ color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em" }}>Subtotal</span>
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 30, fontWeight: 800, lineHeight: 1 }}>${total.toLocaleString("es-CO")}</span>
                    </div>
                  </div>
                  <button disabled={!bike || services.length === 0} onClick={() => setStep(2)}
                    style={{ width: "100%", backgroundColor: "#ff5a00", border: "none", color: "#fff", padding: "13px", fontSize: 14, fontWeight: 700, cursor: (!bike || services.length === 0) ? "not-allowed" : "pointer", borderRadius: 5, opacity: (!bike || services.length === 0) ? 0.3 : 1, transition: "all 0.2s" }}
                    onMouseEnter={(e) => { if (bike && services.length > 0) (e.currentTarget.style.backgroundColor = "#ff7a2a"); }}
                    onMouseLeave={(e) => { (e.currentTarget.style.backgroundColor = "#ff5a00"); }}>
                    Siguiente: Agendar →
                  </button>
                  {(!bike || services.length === 0) && (
                    <p style={{ color: "#444", fontSize: 11, textAlign: "center", marginTop: 10 }}>
                      {!bike ? "Selecciona una moto" : "Selecciona al menos un servicio"}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
              <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 13, marginBottom: 28, display: "flex", alignItems: "center", gap: 6, padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ff5a00")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}>
                ← Volver a configuración
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

                {/* Calendario */}
                <div style={card}>
                  <h3 style={{ ...sectionTitle, marginBottom: 20 }}>Mayo 2026</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 10 }}>
                    {["L","M","M","J","V","S","D"].map((d, i) => (
                      <div key={i} style={{ textAlign: "center", color: "#444", fontSize: 11, fontWeight: 700, paddingBottom: 8 }}>{d}</div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <button key={d} onClick={() => setDate(d)}
                        style={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, border: `1px solid ${date === d ? "#ff5a00" : "#1e1e1e"}`, borderRadius: 5, backgroundColor: date === d ? "#ff5a00" : "#0d0d0d", color: date === d ? "#fff" : "#888", cursor: "pointer", fontWeight: date === d ? 700 : 400, transition: "all 0.15s" }}
                        onMouseEnter={(e) => { if (date !== d) (e.currentTarget.style.borderColor = "#3a3a3a"); }}
                        onMouseLeave={(e) => { if (date !== d) (e.currentTarget.style.borderColor = "#1e1e1e"); }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hora + confirmar */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={card}>
                    <div style={{ backgroundColor: "#ff5a0010", border: "1px solid #ff5a0025", borderLeft: "3px solid #ff5a00", borderRadius: 5, padding: "12px 16px", marginBottom: 20 }}>
                      <p style={{ color: "#ff5a00", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 3px", fontFamily: "monospace" }}>Slots disponibles</p>
                      <p style={{ color: "#888", fontSize: 13, margin: 0 }}>Selecciona el horario de ingreso</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {TIMES.map(t => (
                        <button key={t} onClick={() => setTime(t)}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", border: `1px solid ${time === t ? "#ff5a00" : "#1e1e1e"}`, borderRadius: 6, backgroundColor: time === t ? "#ff5a00" : "#0d0d0d", color: time === t ? "#fff" : "#888", cursor: "pointer", transition: "all 0.2s", fontWeight: time === t ? 700 : 400 }}>
                          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, letterSpacing: "0.03em" }}>{t}</span>
                          <span style={{ fontSize: 11, color: time === t ? "rgba(255,255,255,0.7)" : "#ff5a00", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {time === t ? "Seleccionado ✓" : "Disponible"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={card}>
                    <button disabled={!date || !time} onClick={() => setShowSuccess(true)}
                      style={{ width: "100%", backgroundColor: "#ff5a00", border: "none", color: "#fff", padding: "16px", fontSize: 15, fontWeight: 700, cursor: (!date || !time) ? "not-allowed" : "pointer", borderRadius: 5, opacity: (!date || !time) ? 0.3 : 1, marginBottom: 12, transition: "all 0.2s" }}
                      onMouseEnter={(e) => { if (date && time) (e.currentTarget.style.backgroundColor = "#ff7a2a"); }}
                      onMouseLeave={(e) => { (e.currentTarget.style.backgroundColor = "#ff5a00"); }}>
                      Confirmar cita de servicio →
                    </button>
                    <p style={{ color: "#333", fontSize: 11, textAlign: "center", fontFamily: "monospace" }}>
                      Se reservarán {fmtDur(duration)} de capacidad técnica
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #1e1e1e",
  borderRadius: 8,
  padding: 24,
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 18,
  fontWeight: 700,
  margin: 0,
  letterSpacing: "0.03em",
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const fieldLabel: React.CSSProperties = {
  display: "block",
  color: "#555",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 10,
};

const backBtn: React.CSSProperties = {
  background: "none",
  border: "1px solid #2a2a2a",
  color: "#aaa",
  cursor: "pointer",
  padding: "6px 14px",
  fontSize: 13,
  borderRadius: 4,
  transition: "all 0.2s",
};
