import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const SigmotosAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [remember, setRemember] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos:", formData);
    navigate("/home");
  };

  return (
    <div className="auth-root">

      {/* ── LEFT: Branding ── */}
      <div className="auth-left">
        <div className="auth-brand">
          <h1 className="brand-title">
            <span className="brand-sig">SIG</span>MOTOS
          </h1>
          <div className="brand-divider" />
          <p className="brand-tagline">
            Gestión de inventario inteligente para<br />sistemas de alto rendimiento.
          </p>
        </div>
      </div>

      {/* ── RIGHT: Form ── */}
      <div className="auth-right">
        <div className="auth-form-wrap">

          <div className="auth-heading">
            <h2>{isLogin ? "Acceso al sistema" : "Registro de operador"}</h2>
            <div className="auth-heading-line" />
          </div>

          <form onSubmit={handleSubmit} className="auth-form">

            {!isLogin && (
              <div className="field-group">
                <label>Nombre de operador</label>
                <input
                  type="text"
                  placeholder="Ej: Carlos Méndez"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

            <div className="field-group">
              <label>Email de operador</label>
              <input
                type="email"
                placeholder="cesar@sigmotos.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {isLogin && (
              <div className="auth-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Mantener conectado</span>
                </label>
                <button type="button" className="link-btn" onClick={() => setIsLogin(false)}>
                  ¿No tienes cuenta? Regístrate
                </button>
              </div>
            )}

            {!isLogin && (
              <div className="auth-row">
                <button type="button" className="link-btn" onClick={() => setIsLogin(true)}>
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              </div>
            )}

            <button type="submit" className="auth-submit">
              <span>{isLogin ? "Iniciar motores" : "Crear cuenta"}</span>
              <span className="submit-arrow">→</span>
            </button>

          </form>

          <div className="auth-footer">
            <span className="auth-footer-dot" />
            <span className="auth-footer-version">Sigmotos Core v1.0.0</span>
            <span className="auth-footer-right">Sistema de alto rendimiento</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SigmotosAuth;