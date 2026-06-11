import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getVehicles, getVehiclesByOwner, createVehicle, type VehicleDto } from "../../services/api";

interface Moto {
  id: number;
  brand: string;
  model: string;
  year: number;
  plate: string;
  ownerId: number;
  ownerName?: string;
}

const BRANDS = ["Yamaha", "Honda", "Kawasaki", "Suzuki", "KTM", "BMW", "Otra"];
const BRAND_ICONS: Record<string, string> = {
  Yamaha: "🔵",
  Honda: "🔴",
  Kawasaki: "🟢",
  Suzuki: "🟠",
  KTM: "🟡",
  BMW: "⚫",
  Otra: "⚪",
};

interface MotoForm {
  brand: string;
  model: string;
  year: number;
  plate: string;
}

const emptyForm = (): MotoForm => ({
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  plate: "",
});

export default function MyMotos() {
  const navigate = useNavigate();
  const [motos, setMotos] = useState<Moto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Obtener el usuario logueado desde localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser.id;

  // Cargar vehículos al montar el componente
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      let vehicles: VehicleDto[];
      if (userId) {
        vehicles = await getVehiclesByOwner(Number(userId));
      } else {
        // Si no hay usuario logueado, traer todos los vehículos
        vehicles = await getVehicles();
      }

      const mapped: Moto[] = vehicles.map((v) => ({
        id: v.id,
        brand: v.brand,
        model: v.model,
        year: v.year,
        plate: v.plate,
        ownerId: v.ownerId,
      }));

      setMotos(mapped);
    } catch (err) {
      console.error("Error cargando vehículos:", err);
      setError("No se pudieron cargar los vehículos. Verifica que el backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.brand || !form.model || !form.plate) return;

    setSaving(true);
    setError(null);
    try {
      const newVehicle = await createVehicle({
        plate: form.plate.toUpperCase(),
        brand: form.brand,
        model: form.model,
        year: form.year,
        ownerId: userId ? Number(userId) : 1,
      });

      if (newVehicle) {
        setMotos((prev) => [
          ...prev,
          {
            id: newVehicle.id,
            brand: newVehicle.brand,
            model: newVehicle.model,
            year: newVehicle.year,
            plate: newVehicle.plate,
            ownerId: newVehicle.ownerId,
          },
        ]);
        setSuccessMsg(`🏍️ ${newVehicle.brand} ${newVehicle.model} registrada exitosamente`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
      setForm(emptyForm());
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || "Error al registrar el vehículo");
    } finally {
      setSaving(false);
    }
  };

  const years = Array.from({ length: 18 }, (_, i) => 2027 - i);

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

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => navigate("/repuestos")}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #2a2a2a",
              color: "#aaa",
              cursor: "pointer",
              padding: "9px 16px",
              fontSize: 13,
              borderRadius: 5,
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
            📦 Ver Repuestos
          </button>
          <button
            onClick={() => { setForm(emptyForm()); setShowForm(true); }}
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
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>

        {/* Toast de éxito */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              style={{
                backgroundColor: "#0d2b0d",
                border: "1px solid #1a5c1a",
                color: "#4ade80",
                padding: "12px 20px",
                borderRadius: 6,
                marginBottom: 20,
                fontSize: 14,
              }}
            >
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast de error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              style={{
                backgroundColor: "#2b0d0d",
                border: "1px solid #5c1a1a",
                color: "#ff6b6b",
                padding: "12px 20px",
                borderRadius: 6,
                marginBottom: 20,
                fontSize: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>⚠️ {error}</span>
              <button
                onClick={() => setError(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff6b6b",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulario agregar */}
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
                  ➕ Registrar nuevo vehículo
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
                      onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
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
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button
                    onClick={handleAdd}
                    disabled={!form.brand || !form.model || !form.plate || saving}
                    style={{
                      backgroundColor: "#ff5a00",
                      border: "none",
                      color: "#fff",
                      cursor: form.brand && form.model && form.plate && !saving ? "pointer" : "not-allowed",
                      padding: "10px 24px",
                      fontSize: 14,
                      fontWeight: 600,
                      borderRadius: 5,
                      opacity: form.brand && form.model && form.plate && !saving ? 1 : 0.4,
                    }}
                  >
                    {saving ? "Registrando..." : "Registrar moto"}
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setForm(emptyForm()); }}
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

        {/* Estado de carga */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "80px 24px",
              color: "#555",
            }}
          >
            <div style={{ fontSize: 42, marginBottom: 16 }}>⏳</div>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, margin: "0 0 8px", color: "#888" }}>
              Cargando vehículos...
            </h3>
            <p style={{ fontSize: 14 }}>Conectando con el servidor</p>
          </motion.div>
        ) : motos.length === 0 ? (
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
          /* Lista de motos */
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
                          ID: {moto.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
                  {[
                    { label: "Placa", value: moto.plate },
                    { label: "Año", value: String(moto.year) },
                    { label: "Propietario ID", value: String(moto.ownerId) },
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
