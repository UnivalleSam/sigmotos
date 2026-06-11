import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getProducts, createProduct, type ProductDto } from "../../services/api";

const CATEGORIES = ["Todos", "Frenos", "Lubricantes", "Filtros", "Eléctrico", "Repuestos"];

interface ProductForm {
  nombre: string;
  descripcion: string;
  codigo: string;
  marca: string;
  categoria: string;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo: number;
  ubicacion: string;
}

const emptyForm = (): ProductForm => ({
  nombre: "",
  descripcion: "",
  codigo: "",
  marca: "",
  categoria: "Repuestos",
  precioCompra: 0,
  precioVenta: 0,
  stockActual: 0,
  stockMinimo: 5,
  ubicacion: "",
});

export default function Repuestos() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error cargando repuestos:", err);
      setError("No se pudieron cargar los repuestos de la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.codigo || !form.marca || !form.categoria || form.precioVenta <= 0) {
      setError("Completa todos los campos obligatorios y asegúrate de que el precio de venta sea mayor a 0.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const created = await createProduct({
        nombre: form.nombre,
        descripcion: form.descripcion,
        codigo: form.codigo,
        marca: form.marca,
        categoria: form.categoria,
        precioCompra: Number(form.precioCompra),
        precioVenta: Number(form.precioVenta),
        stockActual: Number(form.stockActual),
        stockMinimo: Number(form.stockMinimo),
        ubicacion: form.ubicacion,
      });

      setProducts((prev) => [...prev, created]);
      setSuccessMsg(`✅ Repuesto "${created.nombre}" registrado con éxito.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      setForm(emptyForm());
      setShowForm(false);
    } catch (err: any) {
      console.error("Error al registrar repuesto:", err);
      setError(err.message || "Error al registrar el repuesto. Verifica que el código no esté repetido.");
    } finally {
      setSaving(false);
    }
  };

  // Filtrado de repuestos
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.marca.toLowerCase().includes(search.toLowerCase()) ||
      p.codigo.toLowerCase().includes(search.toLowerCase()) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === "Todos" || p.categoria.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

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
              / Inventario Repuestos
            </span>
          </h1>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm());
            setShowForm(true);
          }}
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
          + Registrar Repuesto
        </button>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        
        {/* Alerts / Toasts */}
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

        {/* Buscador y Filtros */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            marginBottom: 32,
            backgroundColor: "#111",
            padding: "24px",
            borderRadius: 8,
            border: "1px solid #1e1e1e",
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <input
              type="text"
              placeholder="Buscar por nombre, código o marca de repuesto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 5,
                padding: "12px 16px",
                color: "#e8e8e8",
                fontSize: 14,
                outline: "none",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  backgroundColor: "#2a2a2a",
                  border: "none",
                  color: "#aaa",
                  padding: "0 16px",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Categorías */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map((cat) => {
              const isActive = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    backgroundColor: isActive ? "#ff5a00" : "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: isActive ? "#fff" : "#aaa",
                    padding: "8px 16px",
                    borderRadius: 20,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Formulario */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden", marginBottom: 32 }}
            >
              <form
                onSubmit={handleCreate}
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
                  ➕ Registrar Nuevo Repuesto
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Nombre del Repuesto *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Pastillas de Freno Brembo"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Código de Barra / SKU *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: PRT-902"
                      value={form.codigo}
                      onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Marca *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Brembo, NGK, Liqui Moly"
                      value={form.marca}
                      onChange={(e) => setForm({ ...form, marca: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Categoría *</label>
                    <select
                      value={form.categoria}
                      onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                      style={inputStyle}
                    >
                      {CATEGORIES.filter(c => c !== "Todos").map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Ubicación Bahía / Estante</label>
                    <input
                      type="text"
                      placeholder="Ej: Bahía Estantería A3"
                      value={form.ubicacion}
                      onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Descripción</label>
                    <input
                      type="text"
                      placeholder="Ej: Pastillas traseras para Ninja 400"
                      value={form.descripcion}
                      onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                  <div>
                    <label style={labelStyle}>Precio de Compra ($ COP) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={form.precioCompra}
                      onChange={(e) => setForm({ ...form, precioCompra: Number(e.target.value) })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Precio de Venta ($ COP) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={form.precioVenta}
                      onChange={(e) => setForm({ ...form, precioVenta: Number(e.target.value) })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Stock Inicial *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={form.stockActual}
                      onChange={(e) => setForm({ ...form, stockActual: Number(e.target.value) })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Stock Mínimo *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={form.stockMinimo}
                      onChange={(e) => setForm({ ...form, stockMinimo: Number(e.target.value) })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      backgroundColor: "#ff5a00",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      padding: "10px 24px",
                      fontSize: 14,
                      fontWeight: 600,
                      borderRadius: 5,
                    }}
                  >
                    {saving ? "Registrando..." : "Registrar Repuesto"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setForm(emptyForm());
                    }}
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
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Listado / Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22 }}>
              Cargando catálogo de repuestos...
            </h3>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#555" }}>
            <div style={{ fontSize: 50, marginBottom: 16 }}>📦</div>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, margin: "0 0 8px" }}>
              No se encontraron repuestos
            </h3>
            <p style={{ fontSize: 14 }}>Intenta ajustar tu búsqueda o registra uno nuevo.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stockActual === 0;
              const isLowStock = !isOutOfStock && product.stockActual <= product.stockMinimo;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundColor: "#111",
                    border: "1px solid #1e1e1e",
                    borderRadius: 10,
                    padding: "24px",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* Indicador de estado */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: "monospace",
                          color: "#555",
                          backgroundColor: "#0d0d0d",
                          border: "1px solid #1e1e1e",
                          padding: "2px 8px",
                          borderRadius: 3,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {product.codigo}
                      </span>

                      {isOutOfStock ? (
                        <span style={{ backgroundColor: "#3d1212", color: "#ff4444", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 3, border: "1px solid rgba(255, 68, 68, 0.4)" }}>
                          AGOTADO
                        </span>
                      ) : isLowStock ? (
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{ backgroundColor: "rgba(255, 90, 0, 0.1)", color: "#ff5a00", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 3, border: "1px solid rgba(255, 90, 0, 0.4)" }}
                        >
                          CRÍTICO
                        </motion.span>
                      ) : (
                        <span style={{ backgroundColor: "rgba(74, 222, 128, 0.1)", color: "#4ade80", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 3, border: "1px solid rgba(74, 222, 128, 0.4)" }}>
                          DISPONIBLE
                        </span>
                      )}
                    </div>

                    <h3
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 18,
                        fontWeight: 700,
                        margin: "0 0 4px",
                        letterSpacing: "0.02em",
                        textTransform: "uppercase",
                      }}
                    >
                      {product.nombre}
                    </h3>
                    <p style={{ margin: "0 0 12px", color: "#888", fontSize: 13 }}>
                      {product.marca} · <span style={{ color: "#ff5a00" }}>{product.categoria}</span>
                    </p>

                    {product.descripcion && (
                      <p style={{ margin: "0 0 16px", color: "#555", fontSize: 12, lineHeight: 1.4 }}>
                        {product.descripcion}
                      </p>
                    )}
                  </div>

                  <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 16, marginTop: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div>
                        <span style={{ color: "#444", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Stock Actual</span>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: isLowStock ? "#ff5a00" : isOutOfStock ? "#ff4444" : "#e8e8e8" }}>
                          {product.stockActual} Unidades
                        </p>
                      </div>
                      <div>
                        <span style={{ color: "#444", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Ubicación</span>
                        <p style={{ margin: 0, fontSize: 13, color: "#aaa" }}>
                          {product.ubicacion || "Sin ubicación"}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ color: "#444", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Precio Venta</span>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#ff5a00", fontFamily: "'Barlow Condensed', sans-serif" }}>
                          ${product.precioVenta.toLocaleString("es-CO")} COP
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
