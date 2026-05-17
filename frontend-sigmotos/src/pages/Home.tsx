import "../styles/home.css";
import motoBg from "../assets/moto.jpeg";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-sig">SIG</span>
          <span className="logo-motos">MOTOS</span>
        </div>
        <ul className="navbar-links">
          <li>Inicio</li>
          <li>Servicios</li>
          <li>Inventario</li>
          <li>Citas</li>
        </ul>
        <button className="btn-primary">Dashboard</button>
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
          <div className="hero-actions">
            <button onClick={() => navigate("/booking")} className="btn-primary">Agendar servicio</button>
            <button onClick={() => navigate("/maintenance")} className="btn-ghost">Consultar mantenimiento →</button>
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
          <button className="btn-primary btn-large">Reservar cita →</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo"><span>SIG</span>MOTOS</div>
        <p>© 2025 Sigmotos. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}