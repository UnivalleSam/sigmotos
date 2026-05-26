import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Moto {
  id: string;
  brand: string;
  model: string;
  year: string;
  plate: string;
  type: string;
  color: string;
  mileage: string;
  lastService?: string;
}

const BRANDS = ["Yamaha", "Honda", "Kawasaki", "Suzuki", "KTM", "BMW", "Otra"];
const TYPES = ["Naked", "Deportiva", "Adventure", "Offroad", "Scooter"];
const BRAND_ICONS: Record<string, string> = {
  Yamaha: "🔵",
  Honda: "🔴",
  Kawasaki: "🟢",
  Suzuki: "🟠",
  KTM: "🟡",
  BMW: "⚫",
  Otra: "⚪",
};

const INITIAL_MOTOS: Moto[] = [
  {
    id: "MOTO-001",
    brand: "Kawasaki",
    model: "NINJA 400",
    year: "2022",
    plate: "NJA-400",
    type: "Deportiva",
    color: "Verde Lima",
    mileage: "12,450 km",
    lastService: "16 Mayo, 2026",
  },
  {
    id: "MOTO-002",
    brand: "Yamaha",
    model: "MT-09",
    year: "2021",
    plate: "MT09-X",
    type: "Naked",
    color: "Gris Metálico",
    mileage: "8,210 km",
    lastService: "10 Abril, 2026",
  },
];

const emptyForm = (): Omit<Moto, "id"> => ({
  brand: "",
  model: "",
  year: String(new Date().getFullYear()),
  plate: "",
  type: "",
  color: "",
  mileage: "0 km",
});

export default function MyMotos() {
  const navigate = useNavigate();
  const [motos, setMotos] = useState<Moto[]>(INITIAL_MOTOS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!form.brand || !form.model || !form.plate) return;
    if (editingId) {
      setMotos((prev) =>
        prev.map((m) => (m.id === editingId ? { ...form, id: editingId } : m))
      );
      setEditingId(null);
    } else {
      const id = `MOTO-${String(motos.length + 1).padStart(3, "0")}`;
      setMotos((prev) => [...prev, { ...form, id }]);
    }
    setForm(emptyForm());
    setShowForm(false);
  };

  const handleEdit = (moto: Moto) => {
    const { id, ...rest } = moto;
    setForm(rest);
    setEditingId(id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    setMotos((prev) => prev.filter((m) => m.id !== id));
    setDeleteId(null);
  };

  const years = Array.from({ length: 18 }, (_, i) => String(2027 - i));

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
            <span
              style={{
                color: "#555",
                fontWeight: 400,
                fontSize: 14,
                marginLeft: 12,
              }}
            >
              / Mis Motos
            </span>
          </h1>
        </div>

        <button
          onClick={() => { setForm(emptyForm()); setEditingId(null); setShowForm(true); }}
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
          + Agregar moto
        </button>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>

        {/* Formulario agregar/editar */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden", marginBottom: 32 }}
            >
              <div
                style={{
                  backgroundColor: "#111",
                  border: "1px solid #ff5a0033",
                  borderRadius: 10,
                  padding: "28px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 18,
                    fontWeight: 600,
                    margin: "0 0 24px",
                    color: "#ff5a00",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {editingId ? "✏️ Editar vehículo" : "➕ Registrar nuevo vehículo"}
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  {/* Marca */}
                  <div>
                    <label style={labelStyle}>Marca</label>
                    <select
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="">Seleccionar marca</option>
                      {BRANDS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Modelo */}
                  <div>
                    <label style={labelStyle}>Modelo</label>
                    <input
                      type="text"
                      placeholder="Ej: MT-09, Ninja 400"
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  {/* Año */}
                  <div>
                    <label style={labelStyle}>Año</label>
                    <select
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      style={inputStyle}
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  {/* Placa */}
                  <div>
                    <label style={labelStyle}>Placa</label>
                    <input
                      type="text"
                      placeholder="Ej: NJA-400"
                      value={form.plate}
                      onChange={(e) => setForm({ ...form, plate: e.target.value.toUpperCase() })}
                      style={inputStyle}
                    />
                  </div>

                  {/* Tipo */}
                  <div>
                    <label style={labelStyle}>Tipo</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="">Seleccionar tipo</option>
                      {TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Color */}
                  <div>
                    <label style={labelStyle}>Color</label>
                    <input
                      type="text"
                      placeholder="Ej: Rojo Pasión"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button
                    onClick={handleAdd}
                    disabled={!form.brand || !form.model || !form.plate}
                    style={{
                      backgroundColor: "#ff5a00",
                      border: "none",
                      color: "#fff",
                      cursor: form.brand && form.model && form.plate ? "pointer" : "not-allowed",
                      padding: "10px 24px",
                      fontSize: 14,
                      fontWeight: 600,
                      borderRadius: 5,
                      opacity: form.brand && form.model && form.plate ? 1 : 0.4,
                    }}
                  >
                    {editingId ? "Guardar cambios" : "Registrar moto"}
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm()); }}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid #333",
                      color: "#aaa",
                      cursor: "pointer",
                      padding: "10px 20px",
                      fontSize: 14,
                      borderRadius: 5,
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de motos */}
        {motos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "80px 24px",
              color: "#444",
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>🏍️</div>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, margin: "0 0 8px" }}>
              Sin vehículos registrados
            </h3>
            <p style={{ fontSize: 14 }}>Agrega tu primera moto para comenzar</p>
          </motion.div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {motos.map((moto, i) => (
              <motion.div
                key={moto.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                style={{
                  backgroundColor: "#111",
                  border: "1px solid #1e1e1e",
                  borderRadius: 10,
                  padding: "24px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#2a2a2a";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#1e1e1e";
                }}
              >
                {/* Acento lateral */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 3,
                    height: "100%",
                    backgroundColor: "#ff5a00",
                  }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 22 }}>{BRAND_ICONS[moto.brand] || "⚪"}</span>
                      <div>
                        <h3
                          style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: 20,
                            fontWeight: 700,
                            margin: 0,
                            letterSpacing: "0.03em",
                          }}
                        >
                          {moto.brand} {moto.model}
                        </h3>
                        <p style={{ margin: 0, color: "#555", fontSize: 12, fontFamily: "monospace" }}>
                          {moto.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleEdit(moto)}
                      style={actionBtnStyle}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setDeleteId(moto.id)}
                      style={{ ...actionBtnStyle, borderColor: "#3d1212", color: "#ff4444" }}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
                  {[
                    { label: "Placa", value: moto.plate },
                    { label: "Año", value: moto.year },
                    { label: "Tipo", value: moto.type || "—" },
                    { label: "Color", value: moto.color || "—" },
                    { label: "Kilometraje", value: moto.mileage },
                    { label: "Último servicio", value: moto.lastService || "Sin servicios" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 3px" }}>
                        {label}
                      </p>
                      <p style={{ margin: 0, fontSize: 13, color: "#c8c8c8" }}>{value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
                  <button
                    onClick={() => navigate("/booking")}
                    style={{
                      backgroundColor: "#ff5a0015",
                      border: "1px solid #ff5a0040",
                      color: "#ff5a00",
                      cursor: "pointer",
                      padding: "7px 14px",
                      fontSize: 12,
                      borderRadius: 4,
                      fontWeight: 600,
                    }}
                  >
                    📅 Agendar servicio
                  </button>
                  <button
                    onClick={() => navigate("/maintenance")}
                    style={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      color: "#aaa",
                      cursor: "pointer",
                      padding: "7px 14px",
                      fontSize: 12,
                      borderRadius: 4,
                    }}
                  >
                    🔍 Ver estado
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
            }}
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#111",
                border: "1px solid #3d1212",
                borderRadius: 10,
                padding: "32px",
                maxWidth: 360,
                width: "90%",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 42, marginBottom: 12 }}>⚠️</div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, margin: "0 0 10px" }}>
                ¿Eliminar vehículo?
              </h3>
              <p style={{ color: "#777", fontSize: 13, margin: "0 0 24px" }}>
                Esta acción no se puede deshacer. Se eliminará el vehículo y su historial asociado.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  onClick={() => setDeleteId(null)}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #333",
                    color: "#aaa",
                    cursor: "pointer",
                    padding: "10px 22px",
                    fontSize: 14,
                    borderRadius: 5,
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  style={{
                    backgroundColor: "#ff2222",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    padding: "10px 22px",
                    fontSize: 14,
                    fontWeight: 600,
                    borderRadius: 5,
                  }}
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#555",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: 5,
  padding: "9px 12px",
  color: "#e8e8e8",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const actionBtnStyle: React.CSSProperties = {
  backgroundColor: "#1a1a1a",
  border: "1px solid #2a2a2a",
  color: "#aaa",
  cursor: "pointer",
  padding: "6px 10px",
  fontSize: 14,
  borderRadius: 4,
};
