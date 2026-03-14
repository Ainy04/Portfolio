# 🌹 Portfolio — Ainy Contreras Mendoza

> *Frontend Web Developer · UI/UX · Data Visualization · React Native*

Portfolio personal desarrollado con **React + TypeScript + Tailwind CSS**, con estética oscura inspirada en rosas, terciopelo y oro. Incluye soporte multiidioma (ES/EN), animaciones CSS personalizadas y formulario de contacto funcional con EmailJS.

---

## ✨ Características

- 🌐 **Multiidioma** — Español e Inglés, cambio instantáneo sin recargar
- 🌹 **Animaciones temáticas** — pétalos de rosa cayendo, niebla, partículas doradas, anillos giratorios
- 📱 **Responsive** — adaptado a móvil, tablet y escritorio
- ⚡ **Scroll reveal** — cada sección aparece con fade + slide al entrar en pantalla
- 🗂️ **Tecnologías con tabs animados** — categorías con transición escalonada por skill
- 📬 **Formulario funcional** — integrado con EmailJS, sin backend
- 🔴 **Barra de progreso de scroll** — línea dorada/roja en la parte superior

---

## 🛠️ Stack

| Categoría | Tecnologías |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS |
| Animaciones | CSS Keyframes, IntersectionObserver |
| Iconos | Font Awesome 6 |
| Formulario | EmailJS |
| Build tool | Vite |
| Fuentes | Cinzel, Cormorant Garamond (Google Fonts) |

---

## 🚀 Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/Ainy04/portfolio.git
cd portfolio

# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev

# Build para producción
npm run build
```

---

## 📬 Configurar EmailJS

Para que el formulario de contacto funcione, necesitas una cuenta gratuita en [emailjs.com](https://www.emailjs.com):

1. Crea una cuenta en emailjs.com
2. Conecta tu Gmail en **Email Services** → copia el **Service ID**
3. Crea una plantilla en **Email Templates** con estas variables:
   ```
   De: {{from_email}}
   Asunto: {{subject}}
   Mensaje: {{message}}
   ```
   Copia el **Template ID**
4. En **Account → API Keys** copia tu **Public Key**
5. Reemplaza en `App.tsx`:

```tsx
// En useEffect:
window.emailjs.init({ publicKey: "TU_PUBLIC_KEY" });

// En ContactSection → handleSubmit:
await window.emailjs.send("TU_SERVICE_ID", "TU_TEMPLATE_ID", { ... });
```

---

## 🗂️ Secciones

| Sección | Descripción |
|---|---|
| **Hero** | Presentación con símbolo SVG animado y links a redes |
| **Acerca de mí** | Bio, métricas destacadas (proyectos, rendimiento, NASA) |
| **Proyectos** | 4 proyectos con fecha, descripción bilingüe y tecnologías |
| **Tecnologías** | 5 categorías con tabs animados y skill-orbs hexagonales |
| **Contacto** | Formulario funcional + links a redes sociales |

---

## 🔮 Proyectos destacados

- **Vialix** — App móvil de detección vial con React Native
- **ExoLab** — Dashboard de exoplanetas · NASA Space Apps Challenge 2025 · Equipo Astro404
- **SDGKU Academic System** — Plataforma web de gestión educativa con 12+ métricas en tiempo real
- **Semantic Visualization** — Visualización 3D/2D de algoritmos GSGP con t-SNE, UMAP y PaCMAP

---

Por los que vendrán después. 🌹

---

<p align="center">
  Hecho con 🌹 por <a href="https://github.com/Ainy04">Ainy Contreras</a> · Tecate, B.C., México
</p>
