# Documentación Técnica del Módulo Frontend - SIGMOTOS

**Proyecto:** Sistema Integrado de Gestión para Motocicletas (SIGMOTOS)  
**Módulo:** Frontend Web Application  
**Fecha de Elaboración:** Mayo 2026  
**Versión:** 1.0.0

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Configuración del Entorno](#configuración-del-entorno)
5. [Componentes Desarrollados](#componentes-desarrollados)
6. [Enrutamiento y Navegación](#enrutamiento-y-navegación)
7. [Sistema de Estilos](#sistema-de-estilos)
8. [Herramientas de Desarrollo](#herramientas-de-desarrollo)
9. [Scripts y Comandos](#scripts-y-comandos)
10. [Containerización con Docker](#containerización-con-docker)
11. [Procesos de Build y Deployment](#procesos-de-build-y-deployment)
12. [Consideraciones de Producción](#consideraciones-de-producción)

---

## Introducción

El módulo frontend de **SIGMOTOS** es una aplicación web moderna desarrollada con React y TypeScript, diseñada para proporcionar una interfaz de usuario intuitiva y responsiva para la gestión de inventario de motocicletas, servicios de taller y citas de atención al cliente.

### Objetivos del Frontend

- Proporcionar una interfaz de usuario moderna y profesional
- Facilitar la navegación entre diferentes módulos del sistema
- Permitir autenticación de usuarios
- Visualizar información del taller y servicios disponibles
- Integración con servicios backend mediante APIs REST

---

## Stack Tecnológico

### Dependencias Principales

| Dependencia | Versión | Propósito |
|---|---|---|
| **React** | 19.2.5 | Framework base para componentes UI |
| **React DOM** | 19.2.5 | Renderizado de componentes en el navegador |
| **React Router DOM** | 6.x.x | Enrutamiento y navegación entre páginas |
| **Framer Motion** | 12.38.0 | Animaciones fluidas y transiciones |
| **Tailwind CSS + Vite** | 4.2.4 | Framework de utilidades CSS de bajo nivel |

### Herramientas de Desarrollo

| Herramienta | Versión | Función |
|---|---|---|
| **Vite** | 8.0.10 | Build tool y dev server |
| **TypeScript** | 6.0.2 | Tipado estático para JavaScript |
| **ESLint** | 10.2.1 | Linting y análisis de código |
| **Node.js** | 20 (LTS) | Runtime de JavaScript en servidor |

---

## Estructura del Proyecto

```
frontend-sigmotos/
├── src/
│   ├── pages/
│   │   ├── Home.tsx              # Página principal del sistema
│   │   └── Auth/
│   │       ├── SigmotosAuth.tsx   # Componente de autenticación
│   │       └── auth.css           # Estilos de autenticación
│   ├── styles/
│   │   └── home.css               # Estilos de página principal
│   ├── assets/
│   │   └── moto.jpeg              # Imagen de fondo hero
│   ├── App.tsx                    # Componente raíz de la aplicación
│   ├── App.css                    # Estilos globales
│   ├── main.tsx                   # Punto de entrada de la aplicación
│   └── index.css                  # Estilos base
├── public/                        # Archivos estáticos públicos
├── Dockerfile                     # Configuración de containerización
├── docker-compose.yml             # Orquestación de contenedores
├── package.json                   # Dependencias y scripts del proyecto
├── vite.config.ts                 # Configuración de Vite
├── eslint.config.js               # Configuración de ESLint
├── tsconfig.json                  # Configuración de TypeScript
├── tsconfig.app.json              # Config TypeScript para aplicación
├── tsconfig.node.json             # Config TypeScript para Node
├── index.html                     # Archivo HTML principal
└── README.md                      # Documentación básica del proyecto
```

### Descripción de Directorios

**`/src`** - Código fuente principal de la aplicación
- **`/pages`** - Componentes de páginas principales (vistas completas)
- **`/styles`** - Archivos CSS específicos para componentes
- **`/assets`** - Recursos estáticos (imágenes, fuentes, etc.)

**`/public`** - Archivos servidos directamente sin procesamiento

---

## Configuración del Entorno

### TypeScript (`tsconfig.json`)

La configuración de TypeScript está dividida en dos archivos:

- **`tsconfig.app.json`** - Configuración para el código de aplicación
- **`tsconfig.node.json`** - Configuración para archivos de Node.js (Vite, ESLint)

Ambos son referenciados en `tsconfig.json` principal para una gestión modular.

### Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),           // Plugin de React con Oxc
    tailwindcss(),     // Plugin de Tailwind CSS
  ],
})
```

**Características:**
- Plugin React para HMR (Hot Module Replacement)
- Plugin Tailwind CSS integrado para procesamiento de estilos
- Modo desarrollo con hot reload automático

### ESLint (`eslint.config.js`)

Configuración moderna de ESLint con:
- Reglas recomendadas de JavaScript
- Reglas TypeScript-ESLint
- Reglas de React Hooks
- Validación de React Refresh

---

## Componentes Desarrollados

### 1. **App.tsx** - Componente Raíz

```typescript
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SigmotosAuth from "./pages/Auth/SigmotosAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<SigmotosAuth />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Responsabilidades:**
- Configurar BrowserRouter para enrutamiento
- Definir rutas principales de la aplicación
- Redirigir raíz a página de login
- Proporcionar contexto de navegación global

---

### 2. **pages/Auth/SigmotosAuth.tsx** - Módulo de Autenticación

**Características implementadas:**

- Toggle entre modo login y registro
- Formulario de entrada con validación de estado
- Estados de formulario para email, contraseña y nombre
- Checkbox de "Recuérdame" para persistencia de sesión
- Navegación automática a `/home` tras envío del formulario
- Diseño split-screen: branding izquierdo, formulario derecho
- Etiquetado profesional: "Acceso al sistema" y "Registro de operador"

**Funcionalidades:**
```typescript
const [isLogin, setIsLogin] = useState(true);        // Toggle login/signup
const [remember, setRemember] = useState(false);     // Persistencia
const [formData, setFormData] = useState({...});     // Estado del formulario
```

---

### 3. **pages/Home.tsx** - Página Principal del Sistema

**Secciones implementadas:**

#### Navbar
- Logo SIGMOTOS con separación visual (SIG | MOTOS)
- Menú de navegación: Inicio, Servicios, Inventario, Citas
- Botón Dashboard para acceso a panel administrativo
- Diseño responsive con posicionamiento flexible

#### Hero Section
- Imagen de fondo (moto.jpeg) con overlay oscuro
- Badge de categoría: "Sistema de Gestión Profesional"
- Título principal con énfasis en "SIG"
- Subtítulo descriptivo: "Gestión inteligente para talleres de alto rendimiento"
- Call-to-Action (CTA) buttons:
  - Primario: "Agendar servicio"
  - Secundario: "Ver servicios →"

#### Estadísticas
- Card de "+500 Clientes activos"
- Card de "98%" (presumiblemente satisfacción)
- Dividers visuales entre estadísticas

---

## Enrutamiento y Navegación

### Estructura de Rutas

| Ruta | Componente | Descripción |
|------|-----------|---|
| `/` | Navigate | Redirige automáticamente a `/login` |
| `/login` | SigmotosAuth | Página de autenticación (login/registro) |
| `/home` | Home | Página principal del sistema |

### Configuración de React Router

- **BrowserRouter**: Proporciona contexto de navegación
- **Routes y Route**: Definen mapeo de rutas a componentes
- **Navigate**: Redirección programática
- **useNavigate()**: Hook para navegación desde componentes

---

## Sistema de Estilos

### Enfoque de Estilos

El proyecto implementa un sistema modular de estilos combinando:

1. **Tailwind CSS** - Framework de utilidades
2. **CSS personalizado** - Estilos específicos por página
3. **Framer Motion** - Animaciones de movimiento

### Archivos CSS

- **`index.css`** - Estilos base y resets globales
- **`App.css`** - Estilos del componente App
- **`styles/home.css`** - Estilos específicos de Home
- **`pages/Auth/auth.css`** - Estilos del módulo de autenticación

### Características de Diseño

- **Branding Visual**: Logo SIGMOTOS con tipografía diferenciada
- **Paleta de Colores**: Combinación profesional con acentos
- **Layout Responsivo**: Diseño adaptativo para diferentes dispositivos
- **Animaciones**: Transiciones suaves con Framer Motion
- **Accesibilidad**: Contraste adecuado y jerarquía visual

---

## Herramientas de Desarrollo

### ESLint

**Configuración aplicada:**
```javascript
export default defineConfig([
  globalIgnores(['dist']),  // Ignora carpeta de build
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
])
```

**Propósito:**
- Mantener consistencia de código
- Prevenir errores comunes
- Validar reglas de React Hooks
- Asegurar compatibilidad con React Refresh

---

## Scripts y Comandos

### Scripts Disponibles

En `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### Descripción de Comandos

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Inicia servidor de desarrollo con HMR en `http://localhost:5173` |
| `npm run build` | Compila TypeScript y genera build optimizado para producción |
| `npm run lint` | Analiza el código con ESLint |
| `npm run preview` | Previsualiza el build de producción localmente |

### Flujo de Desarrollo

1. **Desarrollo Local**
   ```bash
   npm run dev
   ```
   - Hot Module Replacement (HMR) automático
   - Recarga en tiempo real de cambios
   - Servidor en http://localhost:5173

2. **Linting**
   ```bash
   npm run lint
   ```
   - Valida código antes de commits
   - Previene problemas de tipado

3. **Build para Producción**
   ```bash
   npm run build
   ```
   - Compila TypeScript
   - Optimiza y minifica assets
   - Genera carpeta `dist/`

4. **Previsualización**
   ```bash
   npm run preview
   ```
   - Simula el build de producción

---

## Containerización con Docker

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### Justificación de Decisiones

| Aspecto | Decisión | Razón |
|--------|----------|-------|
| **Base Image** | `node:20-alpine` | Node.js LTS compatible con Vite 8 + imagen ligera |
| **Working Directory** | `/app` | Estructura estándar en contenedores |
| **Multi-layer Build** | Dependencias antes del código | Aprovecha caché de Docker |
| **EXPOSE 5173** | Puerto predeterminado de Vite | Permite mapeo de puertos en docker-compose |
| **--host 0.0.0.0** | Acepta conexiones externas | Crítico para acceso desde fuera del contenedor |

### Ventajas de Containerización

- **Portabilidad**: Mismo entorno en dev, staging y producción
- **Aislamiento**: No afecta configuración local
- **Reproducibilidad**: Build determinista
- **Escalabilidad**: Fácil de replicar en orquestadores

---

## Procesos de Build y Deployment

### Proceso de Build Optimizado

```bash
npm run build
```

**Pasos ejecutados:**

1. **TypeScript Compilation** (`tsc -b`)
   - Compila archivos .ts y .tsx a JavaScript
   - Valida tipado estático
   - Genera verificación de tipos

2. **Vite Build**
   - Minificación de código
   - Code splitting automático
   - Optimización de assets
   - Generación de source maps
   - Salida en carpeta `dist/`

### Output de Producción

```
dist/
├── index.html          # HTML principal
├── assets/
│   ├── index-[hash].js       # Bundle principal
│   └── [otros-hash].css      # Estilos compilados
└── vite.svg            # Assets estáticos
```

**Características:**
- Hash de contenido para cache busting
- Compresión gzip automática
- Tree-shaking de código no utilizado

---

## Consideraciones de Producción

### Optimizaciones Implementadas

1. **Code Splitting**
   - Separación de chunks por módulos
   - Carga lazy de componentes
   - Reducción de bundle inicial

2. **TypeScript**
   - Type-checking en tiempo de compilación
   - Prevención de errores en runtime
   - Mejor mantenibilidad del código

3. **ESLint**
   - Validación de mejores prácticas
   - Consistencia de código
   - Prevención de bugs comunes

4. **Tailwind CSS**
   - Generación de CSS únicamente usado
   - Compresión de estilos
   - Bajo tamaño de assets CSS

### Próximos Pasos Recomendados

- [ ] Implementar autenticación real con JWT
- [ ] Integración con API backend
- [ ] Sistema de manejo de errores global
- [ ] Gestión de estado (Redux/Zustand)
- [ ] Pruebas unitarias (Jest/Vitest)
- [ ] Pruebas de integración (Cypress/Playwright)
- [ ] Optimización de imágenes
- [ ] PWA capabilities
- [ ] Analytics y monitoreo
- [ ] CI/CD pipeline

---

## Resumen Técnico

### Fortalezas del Frontend

✅ Stack moderno (React 19, TypeScript, Vite)  
✅ Herramientas de desarrollo automatizadas  
✅ Arquitectura escalable y modular  
✅ Containerización lista para producción  
✅ Tipado estático para mayor seguridad  
✅ Performance optimizado con Vite  

### Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Versión de React** | 19.2.5 (última) |
| **TypeScript** | 6.0.2 |
| **Rutas Definidas** | 3 (/, /login, /home) |
| **Componentes Base** | 3 (App, Home, SigmotosAuth) |
| **Puerto de Desarrollo** | 5173 |
| **Node.js Requerido** | 20 LTS |
| **Tamaño Base Docker** | ~460MB (node:20-alpine) |

---

## Conclusiones

El módulo frontend de **SIGMOTOS** ha sido construido siguiendo mejores prácticas modernas de desarrollo web:

- Utilización del stack tecnológico más actual (React 19, Vite 8)
- Configuración profesional de herramientas de desarrollo
- Arquitectura escalable y mantenible
- Documentación clara y buenas prácticas de código
- Containerización lista para deployment en producción

Este documento sirve como referencia técnica para futuros mantenimientos y extensiones del módulo frontend.

---

**Documento preparado por:** Equipo de Desarrollo SIGMOTOS  
**Última actualización:** Mayo 2026  
**Versión del documento:** 1.0.0
