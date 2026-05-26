import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  email: string;
  phone: string;
  city: string;
  joinDate: string;
  id: string;
}

export default function UserProfile() {
  const navigate = useNavigate();

  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    name: stored.name || "Operador SIGMOTOS",
    email: stored.email || "usuario@sigmotos.com",
    phone: stored.phone || "+57 300 000 0000",
    city: stored.city || "Bogotá, Colombia",
    joinDate: stored.joinDate || "Enero 2026",
    id: stored.id || "USR-00001",
  });

  const [form, setForm] = useState({ ...userData });

  const handleSave = () => {
    setUserData({ ...form });
    localStorage.setItem("user", JSON.stringify({ ...stored, ...form }));
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const stats = [
    { label: "Motos registradas", value: "3", icon: "🏍️" },
    { label: "Servicios realizados", value: "12", icon: "🔧" },
    { label: "Citas activas", value: "1", icon: "📅" },
    { label: "Puntos SIGMOTOS", value: "840", icon: "⭐" },
  ];

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
            onClick={() => navigate("/home")}
            style={{
              background: "none",
              border: "1px solid #2a2a2a",
              color: "#aaa",
              cursor: "pointer",
              padding: "6px 12px",
              fontSize: 13,
              borderRadius: 4,
              transition: "all 0.2s",
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
            <span
              style={{
                color: "#555",
                fontWeight: 400,
                fontSize: 14,
                marginLeft: 12,
              }}
            >
              / Mi Perfil
            </span>
          </h1>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => navigate("/my-motos")}
            style={{
              background: "none",
              border: "1px solid #2a2a2a",
              color: "#aaa",
              cursor: "pointer",
              padding: "7px 16px",
              fontSize: 13,
              borderRadius: 4,
            }}
          >
            🏍️ Mis Motos
          </button>
          <button
            onClick={() => navigate("/history")}
            style={{
              background: "none",
              border: "1px solid #2a2a2a",
              color: "#aaa",
              cursor: "pointer",
              padding: "7px 16px",
              fontSize: 13,
              borderRadius: 4,
            }}
          >
            📋 Historial
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        {/* Toast de guardado */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundColor: "#0d2b0d",
              border: "1px solid #1a5c1a",
              color: "#4ade80",
              padding: "10px 20px",
              borderRadius: 6,
              marginBottom: 24,
              fontSize: 14,
            }}
          >
            ✓ Perfil actualizado correctamente
          </motion.div>
        )}

        {/* Avatar + info principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            backgroundColor: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: 10,
            padding: "32px",
            marginBottom: 24,
            display: "flex",
            gap: 32,
            alignItems: "flex-start",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              backgroundColor: "#1a1a1a",
              border: "2px solid #ff5a00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              flexShrink: 0,
            }}
          >
            🧑‍🔧
          </div>

          {/* Datos */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 26,
                    fontWeight: 700,
                    margin: 0,
                    letterSpacing: "0.03em",
                  }}
                >
                  {userData.name}
                </h2>
                <p style={{ color: "#555", fontSize: 12, margin: "4px 0 0", fontFamily: "monospace" }}>
                  {userData.id}
                </p>
              </div>

              {!editMode ? (
                <button
                  onClick={() => { setForm({ ...userData }); setEditMode(true); }}
                  style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    color: "#e8e8e8",
                    cursor: "pointer",
                    padding: "8px 18px",
                    fontSize: 13,
                    borderRadius: 5,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#ff5a00";
                    (e.currentTarget as HTMLButtonElement).style.color = "#ff5a00";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#333";
                    (e.currentTarget as HTMLButtonElement).style.color = "#e8e8e8";
                  }}
                >
                  ✏️ Editar perfil
                </button>
              ) : (
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setEditMode(false)}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid #333",
                      color: "#aaa",
                      cursor: "pointer",
                      padding: "8px 16px",
                      fontSize: 13,
                      borderRadius: 5,
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      backgroundColor: "#ff5a00",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      padding: "8px 18px",
                      fontSize: 13,
                      fontWeight: 600,
                      borderRadius: 5,
                    }}
                  >
                    Guardar cambios
                  </button>
                </div>
              )}
            </div>

            {/* Campos */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginTop: 20,
              }}
            >
              {(
                [
                  { label: "Nombre completo", key: "name", type: "text" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Teléfono", key: "phone", type: "text" },
                  { label: "Ciudad", key: "city", type: "text" },
                ] as { label: string; key: keyof UserData; type: string }[]
              ).map(({ label, key, type }) => (
                <div key={key}>
                  <p
                    style={{
                      color: "#555",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 6,
                      margin: "0 0 6px",
                    }}
                  >
                    {label}
                  </p>
                  {editMode ? (
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: 5,
                        padding: "8px 12px",
                        color: "#e8e8e8",
                        fontSize: 14,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  ) : (
                    <p style={{ margin: 0, fontSize: 14, color: "#c8c8c8" }}>
                      {userData[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <p style={{ color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
                Miembro desde
              </p>
              <p style={{ margin: 0, fontSize: 14, color: "#c8c8c8" }}>{userData.joinDate}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#111",
                border: "1px solid #1e1e1e",
                borderRadius: 8,
                padding: "20px 16px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#ff5a00",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Acciones rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            backgroundColor: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: 10,
            padding: "24px",
          }}
        >
          <h3
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 0 20px",
            }}
          >
            Acciones rápidas
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { label: "Agendar servicio", icon: "📅", route: "/booking", desc: "Reserva tu próxima cita" },
              { label: "Ver mis motos", icon: "🏍️", route: "/my-motos", desc: "Gestiona tus vehículos" },
              { label: "Historial de servicios", icon: "📋", route: "/history", desc: "Revisa servicios pasados" },
              { label: "Estado de mantenimiento", icon: "🔍", route: "/maintenance", desc: "Monitorea tu moto en taller" },
              { label: "Volver al inicio", icon: "🏠", route: "/home", desc: "Página principal" },
              {
                label: "Cerrar sesión",
                icon: "🔒",
                route: "/login",
                desc: "Salir de la cuenta",
                danger: true,
              },
            ].map((action: any, i) => (
              <button
                key={i}
                onClick={() => {
                  if (action.route === "/login") localStorage.removeItem("user");
                  navigate(action.route);
                }}
                style={{
                  backgroundColor: "#0d0d0d",
                  border: `1px solid ${action.danger ? "#3d1212" : "#1e1e1e"}`,
                  borderRadius: 8,
                  padding: "16px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  color: action.danger ? "#ff4444" : "#e8e8e8",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = action.danger ? "#ff4444" : "#ff5a00";
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#151515";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = action.danger ? "#3d1212" : "#1e1e1e";
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0d0d0d";
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{action.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{action.label}</div>
                <div style={{ fontSize: 12, color: "#555" }}>{action.desc}</div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
