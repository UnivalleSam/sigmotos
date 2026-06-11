import React, { useState, useEffect } from "react";
import "../styles/home.css";
import motoBg from "../assets/moto.jpeg";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // OCR/Camera states
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [ocrApiUrl, setOcrApiUrl] = useState(() => localStorage.getItem("ocr_api_url") || "http://localhost:8084");
  const [detectedPlate, setDetectedPlate] = useState("");
  const [ocrError, setOcrError] = useState("");
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);

  // Guardar URL del OCR en localStorage
  useEffect(() => {
    localStorage.setItem("ocr_api_url", ocrApiUrl);
  }, [ocrApiUrl]);

  // Escanear placa con cámara Raspberry Pi (remoto)
  const handleScanPiCamera = async () => {
    setIsProcessingOcr(true);
    setOcrError("");
    setDetectedPlate("");
    try {
      const res = await fetch(`${ocrApiUrl}/ocr/scan-camera`);
      if (!res.ok) throw new Error("Error en el servidor OCR");
      const data = await res.json();
      const detected = data.placa_detectada;
      if (detected && detected !== "No se pudo abrir la cámara" && detected !== "No se pudo capturar imagen") {
        setDetectedPlate(detected.toUpperCase());
      } else {
        setOcrError(detected || "No se pudo detectar una placa en el visor.");
      }
    } catch (err) {
      console.error("Error OCR Raspberry:", err);
      setOcrError("Error de comunicación con el servicio OCR de la Raspberry Pi. Verifica que el puerto 8084 esté abierto y la IP sea correcta.");
    } finally {
      setIsProcessingOcr(false);
    }
  };


  const handleGoToMaintenance = () => {
    setIsOcrModalOpen(false);
    navigate(`/maintenance?plate=${detectedPlate}`);
  };

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <span className="logo-sig">SIG</span>
          <span className="logo-motos">MOTOS</span>
        </div>
        
        {/* HAMBURGER BUTTON */}
        <button 
          className={`navbar-toggle ${isMenuOpen ? "active" : ""}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <ul className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <li onClick={() => { navigate("/home"); setIsMenuOpen(false); }}>Inicio</li>
          <li onClick={() => { navigate("/booking"); setIsMenuOpen(false); }}>Agendar Cita</li>
          <li onClick={() => { navigate("/maintenance"); setIsMenuOpen(false); }}>Mantenimiento</li>
          <li onClick={() => { navigate("/repuestos"); setIsMenuOpen(false); }}>Repuestos</li>
          <li onClick={() => { navigate("/profile"); setIsMenuOpen(false); }}>Mi Perfil</li>
          <li className="mobile-nav-item">
            <button onClick={() => { navigate("/dashboard"); setIsMenuOpen(false); }} className="btn-primary w-full">Dashboard</button>
          </li>
        </ul>
        <button onClick={() => navigate("/dashboard")} className="btn-primary desktop-nav-btn">Dashboard</button>
      </nav>

      {/* HERO */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${motoBg})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">Sistema de Gestión Profesional</div>
          <h1 className="hero-title">
            <span className="hero-sig">SIG</span>MOTOS
          </h1>
          <div className="hero-line" />
          <p className="hero-subtitle">
            Gestión inteligente para talleres<br />de alto rendimiento
          </p>
          <div className="hero-actions" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => navigate("/booking")} className="btn-primary">Agendar servicio</button>
            <button onClick={() => navigate("/maintenance")} className="btn-ghost">Consultar mantenimiento →</button>
            <button onClick={() => setIsOcrModalOpen(true)} className="btn-primary" style={{ backgroundColor: "#22c55e", borderColor: "#22c55e", display: "flex", alignItems: "center", gap: 8 }}>
              <span>📷</span> Escanear Placa OCR
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">+500</span>
              <span className="stat-label">Clientes activos</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">98%</span>
              <span className="stat-label">Satisfacción</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">24/7</span>
              <span className="stat-label">Soporte</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="services">
        <div className="section-header">
          <span className="section-tag">Lo que ofrecemos</span>
          <h2>Nuestros <span>Servicios</span></h2>
          <p>Soluciones completas para el cuidado de tu moto</p>
        </div>

        <div className="cards">
          {[
            { icon: "🔧", title: "Diagnóstico digital", desc: "Análisis computarizado de fallas en tiempo real" },
            { icon: "⚙️", title: "Reparación de motor", desc: "Técnicos certificados con repuestos originales" },
            { icon: "🛠️", title: "Mantenimiento", desc: "Planes preventivos para tu tranquilidad" },
            { icon: "⚡", title: "Sistema eléctrico", desc: "Diagnóstico y reparación de circuitos" },
          ].map((s, i) => (
            <div className="card" key={i}>
              <div className="card-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="card-line" />
            </div>
          ))}
        </div>
      </section>

      {/* TECNOLOGÍA */}
      <section className="tech">
        <div className="tech-inner">
          <div className="tech-text">
            <span className="section-tag">Plataforma</span>
            <h2>Sistema <span>Inteligente</span></h2>
            <p>Control total de inventario, clientes y servicios en un solo lugar. Optimiza tu taller con tecnología de punta.</p>
            <ul className="tech-list">
              <li>✓ Gestión de inventario en tiempo real</li>
              <li>✓ Agenda de citas automatizada</li>
              <li>✓ Historial de servicios por cliente</li>
              <li>✓ Reportes y analíticas avanzadas</li>
            </ul>
          </div>
          <div className="tech-visual">
            <div className="tech-card">
              <div className="tech-card-header">
                <span className="tc-title">Panel de control</span>
              </div>
              <div className="tc-row"><span className="tc-label">Motos en taller</span><span className="tc-val orange">12</span></div>
              <div className="tc-row"><span className="tc-label">Citas hoy</span><span className="tc-val">8</span></div>
              <div className="tc-row"><span className="tc-label">Piezas disponibles</span><span className="tc-val">347</span></div>
              <div className="tc-row"><span className="tc-label">Técnicos activos</span><span className="tc-val orange">5</span></div>
              <div className="tc-bar-wrap">
                <div className="tc-bar-label">Eficiencia mensual</div>
                <div className="tc-bar"><div className="tc-bar-fill" style={{ width: "87%" }} /></div>
                <span className="tc-bar-pct">87%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-inner">
          <span className="section-tag">Empieza hoy</span>
          <h2>Agenda tu servicio <span>ahora</span></h2>
          <p>Tu moto merece la mejor atención. Reserva en segundos.</p>
          <button className="btn-primary btn-large" onClick={() => navigate("/booking")}>Reservar cita →</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo"><span>SIG</span>MOTOS</div>
        <p>© 2025 Sigmotos. Todos los derechos reservados.</p>
      </footer>

      {/* OCR MODAL DIALOG */}
      <AnimatePresence>
        {isOcrModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={modalOverlayStyle}
            onClick={() => {
              setIsOcrModalOpen(false);
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 16 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 16 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              style={modalContentStyle}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: "1px solid #222", paddingBottom: 16 }}>
                <h3 style={{ margin: 0, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: "#ff5a00" }}>
                  📷 ESCANER DE PLACA OCR
                </h3>
                <button 
                  onClick={() => {
                    setIsOcrModalOpen(false);
                  }}
                  style={{ background: "none", border: "none", color: "#666", fontSize: 20, cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              {/* API Configuration */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, color: "#666", textTransform: "uppercase", display: "block", marginBottom: 6, fontFamily: "monospace" }}>
                  Dirección URL del Servicio OCR (Raspberry Pi o Local)
                </label>
                <input 
                  type="text" 
                  value={ocrApiUrl} 
                  onChange={(e) => setOcrApiUrl(e.target.value)}
                  placeholder="Ej: http://192.168.1.50:8084"
                  style={{ width: "100%", padding: "10px 14px", backgroundColor: "#080808", border: "1px solid #222", borderRadius: 4, color: "#fff", fontSize: 13, fontFamily: "monospace", boxSizing: "border-box" }}
                />
              </div>

              {/* Contenedor del visor */}
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", backgroundColor: "#000", borderRadius: 8, overflow: "hidden", border: "1px solid #222", marginBottom: 20 }}>
                <img 
                  key={ocrApiUrl}
                  src={`${ocrApiUrl}/ocr/video-feed`} 
                  alt="Transmisión Raspberry Pi"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    setOcrError("No se pudo conectar a la transmisión de la Raspberry Pi. Verifica la dirección URL o si el servicio OCR FastAPI está corriendo en el puerto 8084.");
                  }}
                />

                {/* Guía en pantalla para el usuario */}
                {(!detectedPlate && !isProcessingOcr) && (
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "70%", height: "40%", border: "2px dashed #4ade80", borderRadius: 6, pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 255, 0, 0.05)" }}>
                    <span style={{ backgroundColor: "#000000ba", color: "#4ade80", fontSize: 10, padding: "4px 10px", borderRadius: 3, fontFamily: "monospace", letterSpacing: "0.05em", fontWeight: 700 }}>
                      ENCUADRE LA PLACA
                    </span>
                  </div>
                )}

                {/* Estado de carga de OCR */}
                {isProcessingOcr && (
                  <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                    <span style={{ fontSize: 24, animation: "spin 1s infinite linear", display: "inline-block", marginBottom: 14 }}>⚙️</span>
                    <span style={{ color: "#ff5a00", fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                      Analizando placa con OpenCV + Tesseract...
                    </span>
                  </div>
                )}

                {/* Error overlay */}
                {ocrError && !isProcessingOcr && (
                  <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", zIndex: 5 }}>
                    <span style={{ fontSize: 26, marginBottom: 8 }}>⚠️</span>
                    <p style={{ color: "#f87171", fontSize: 12, margin: "0 0 16px", fontFamily: "monospace" }}>{ocrError}</p>
                    <button 
                      onClick={() => {
                        setOcrError("");
                        setDetectedPlate("");
                      }}
                      style={{ backgroundColor: "#222", border: "1px solid #333", color: "#fff", padding: "6px 14px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
                    >
                      Reintentar conexión
                    </button>
                  </div>
                )}
              </div>

              {/* Botones de acción / Resultado */}
              {detectedPlate ? (
                <div style={{ backgroundColor: "#080808", border: "1px solid #ff5a0040", borderRadius: 6, padding: 20, textAlign: "center" }}>
                  <p style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Placa Vehicular Reconocida</p>
                  <h2 style={{ fontSize: 36, fontFamily: "monospace", color: "#ff5a00", margin: "0 0 20px", letterSpacing: "0.1em", fontWeight: 800 }}>
                    [ {detectedPlate} ]
                  </h2>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => {
                        setDetectedPlate("");
                        setOcrError("");
                      }}
                      style={{ flex: 1, padding: "12px", fontSize: 13, border: "1px solid #222", backgroundColor: "transparent", color: "#aaa", borderRadius: 4, cursor: "pointer" }}
                    >
                      🔄 Escanear otra
                    </button>
                    <button
                      onClick={handleGoToMaintenance}
                      style={{ flex: 2, padding: "12px", fontSize: 13, border: "none", backgroundColor: "#ff5a00", color: "#fff", fontWeight: 700, borderRadius: 4, cursor: "pointer" }}
                    >
                      🔎 Buscar Cita e Ir al Estado →
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    disabled={isProcessingOcr}
                    onClick={handleScanPiCamera}
                    style={{
                      flex: 1, padding: "14px", fontSize: 14, fontWeight: 700, border: "none", borderRadius: 4, cursor: "pointer",
                      backgroundColor: "#ff5a00", color: "#fff", transition: "all 0.2s"
                    }}
                  >
                    🔍 RECONOCER PLACA
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline Styles for OCR Modal
const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: 20,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#111",
  color: "#fff",
  borderRadius: 8,
  border: "1px solid #222",
  padding: 28,
  maxWidth: 500,
  width: "100%",
  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
  position: "relative",
};