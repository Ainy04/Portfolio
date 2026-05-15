import { useState, useEffect } from "react";

interface Petal {
  left: string;
  anim: string;
  dur: string;
  delay: string;
}

interface Project {
  num: string;
  title: string;
  date: string;
  desc: { es: string; en: string };
  longDesc: { es: string; en: string };
  features: { es: string[]; en: string[] };
  images: string[];          // paths under /public — e.g. "/Portfolio/projects/vialix/1.png"
  tags: string[];
  repo?: string;
}

interface Skill {
  icon: string;
  name: string;
}

interface NavbarProps {
  scrolled: boolean;
  lang: "es" | "en";
  setLang: (l: "es" | "en") => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}

interface FormFields {
  asunto: string;
  email: string;
  mensaje: string;
}

// Traducciones
const T = {
  es: {
    nav_about: "Acerca de mí", nav_projects: "Proyectos", nav_tech: "Tecnologías", nav_contact: "Contacto",
    hero_role: "Python Developer", hero_sub: "Visualización de Datos",
    btn_projects: "Proyectos", btn_about: "Acerca de mí", btn_contact: "Contactar",
    about_title: "Acerca de Mí",
    about_text: "Soy desarrolladora Python con enfoque en ciencia de datos, visualización y automatización. Me apasiona el espacio donde los datos y la tecnología se encuentran — donde un buen análisis se traduce en decisiones claras e impacto real. Trabajo principalmente con Python y su ecosistema: Pandas, NumPy, Scikit-learn, Plotly, Matplotlib y Streamlit, con experiencia en visualización de datos científicos, machine learning y sistemas de análisis académico. También manejo JavaScript, TypeScript y frameworks como React Native para proyectos full-stack. Me gusta aprender rápido, trabajar en equipo y entregar algo que no solo funcione — sino que cuente una historia. Actualmente curso Ingeniería en Software y Tecnologías Emergentes en la UABC, Tecate, B.C.",
    hl1: "Proyectos", hl2: "Mejora rendimiento", hl3: "Registros visualizados", hl4: "Space Apps 2025",
    proj_title: "Proyectos",
    tech_title: "Tecnologías",
    contact_title: "Contacto", contact_sub: "Contáctame",
    contact_text: "Puedes contactarme directamente a través de mis redes o enviarme un correo. Siempre estoy abierta a nuevas ideas, proyectos o colaboraciones.",
    f_subject: "Asunto", f_message: "Mensaje", btn_send: "Enviar",
    ph_subject: "Asunto", ph_message: "Mensaje",
    sending: "Enviando...", ok: "✦ ¡Mensaje enviado!", err: "Error al enviar. Intenta de nuevo.", err_fields: "Por favor llena email y mensaje.",
    footer: "Por los que vendrán después",
    repo_label: "ver repo",
    skill_cat1: "Lenguajes", skill_cat2: "Frameworks y Librerías", skill_cat3: "Bases de Datos", skill_cat4: "Visualización de Datos", skill_cat5: "Herramientas y Diseño",
    modal_features: "Características", modal_stack: "Stack", modal_gallery: "Galería",
    modal_no_images: "Sin capturas aún — ¡pronto!", modal_close: "Cerrar", modal_image: "Imagen",
    modal_of: "de",
  },
  en: {
    nav_about: "About me", nav_projects: "Projects", nav_tech: "Technologies", nav_contact: "Contact",
    hero_role: "Python Developer", hero_sub: "Data Science · Data Visualization",
    btn_projects: "Projects", btn_about: "About me", btn_contact: "Contact",
    about_title: "About Me",
    about_text: "I'm a Python Developer focused on data science, visualization, and automation. I'm passionate about the intersection of data and technology — where solid analysis translates into clear decisions and real impact. I primarily work with Python and its ecosystem: Pandas, NumPy, Scikit-learn, Plotly, Matplotlib, and Streamlit, with experience in scientific data visualization, machine learning, and academic management systems. I also work with JavaScript, TypeScript, and frameworks like React Native for full-stack projects. I love learning fast, collaborating with teams, and delivering things that don't just work — but tell a story. Currently studying Software Engineering & Emerging Technologies at UABC, Tecate, B.C.",
    hl1: "Projects", hl2: "Performance boost", hl3: "Records visualized", hl4: "Space Apps 2025",
    proj_title: "Projects",
    tech_title: "Technologies",
    contact_title: "Contact", contact_sub: "Contact me",
    contact_text: "You can reach me directly through my social links or send me an email. I'm always open to new ideas, projects, or collaborations.",
    f_subject: "Subject", f_message: "Message", btn_send: "Send",
    ph_subject: "Subject", ph_message: "Message",
    sending: "Sending...", ok: "✦ Message sent!", err: "Failed to send. Try again.", err_fields: "Please fill in your email and message.",
    footer: "For those who come after",
    repo_label: "view repo",
    skill_cat1: "Languages", skill_cat2: "Frameworks & Libraries", skill_cat3: "Databases", skill_cat4: "Data Visualization", skill_cat5: "Tools & Design",
    modal_features: "Features", modal_stack: "Stack", modal_gallery: "Gallery",
    modal_no_images: "No screenshots yet — coming soon!", modal_close: "Close", modal_image: "Image",
    modal_of: "of",
  },
} as const;
type Lang = keyof typeof T;

// Datos para la animación
const PETALS: Petal[] = [
  { left: "5%", anim: "petal-fall-left", dur: "12s", delay: "0s" },
  { left: "12%", anim: "petal-spiral", dur: "14s", delay: "1.5s" },
  { left: "20%", anim: "petal-fall", dur: "11s", delay: "3s" },
  { left: "28%", anim: "petal-fall-right", dur: "13s", delay: "0.8s" },
  { left: "35%", anim: "petal-fall-left", dur: "15s", delay: "4.2s" },
  { left: "42%", anim: "petal-spiral", dur: "12s", delay: "2.1s" },
  { left: "50%", anim: "petal-fall", dur: "13s", delay: "5.5s" },
  { left: "58%", anim: "petal-fall-right", dur: "14s", delay: "1.2s" },
  { left: "65%", anim: "petal-fall-left", dur: "11s", delay: "3.8s" },
  { left: "72%", anim: "petal-spiral", dur: "15s", delay: "0.5s" },
  { left: "80%", anim: "petal-fall", dur: "12s", delay: "4.7s" },
  { left: "88%", anim: "petal-fall-right", dur: "13s", delay: "2.3s" },
  { left: "95%", anim: "petal-fall-left", dur: "14s", delay: "6s" },
  { left: "8%", anim: "petal-fall", dur: "16s", delay: "7s" },
  { left: "18%", anim: "petal-fall-right", dur: "11s", delay: "8.5s" },
  { left: "25%", anim: "petal-spiral", dur: "13s", delay: "5.2s" },
  { left: "38%", anim: "petal-fall-left", dur: "12s", delay: "9s" },
  { left: "48%", anim: "petal-fall", dur: "14s", delay: "3.5s" },
  { left: "55%", anim: "petal-spiral", dur: "15s", delay: "7.8s" },
  { left: "68%", anim: "petal-fall-right", dur: "13s", delay: "4.5s" },
  { left: "75%", anim: "petal-fall-left", dur: "11s", delay: "6.7s" },
  { left: "85%", anim: "petal-fall", dur: "12s", delay: "8.2s" },
  { left: "92%", anim: "petal-spiral", dur: "14s", delay: "2.8s" },
];

// Proyectos
const PROJECTS: Project[] = [
  {
    num: "01", title: "Vialix", date: "Feb – May 2026",
    desc: {
      es: "App móvil que detecta irregularidades viales mediante los sensores del dispositivo. Incluye i18n, narración de audio personalizada y sistema de componentes globales dinámicos.",
      en: "Mobile app that detects road irregularities using device sensors. Features i18n support, custom audio narration, and a global dynamic component system.",
    },
    longDesc: {
      es: "Vialix es una aplicación móvil desarrollada en React Native que utiliza el acelerómetro y giroscopio del dispositivo para detectar baches, topes y otras irregularidades en el pavimento en tiempo real. Los datos se georreferencian mediante OpenStreetMap y se almacenan en PostgreSQL. Cuenta con narración de audio personalizada que informa al conductor de los eventos detectados, y soporte completo de internacionalización (español e inglés). La arquitectura incluye un sistema de componentes globales dinámicos que permite actualizar el HUD sin recargar la app.",
      en: "Vialix is a React Native mobile app that uses the device's accelerometer and gyroscope to detect potholes, speed bumps, and other road irregularities in real time. Events are georeferenced via OpenStreetMap and stored in PostgreSQL. It features custom audio narration to inform the driver of detected events and full i18n support (Spanish and English). The architecture includes a global dynamic component system that allows HUD updates without reloading the app.",
    },
    features: {
      es: ["Detección de baches con acelerómetro/giroscopio", "Narración de audio en tiempo real", "Mapas con OpenStreetMap", "Internacionalización (ES / EN)", "HUD dinámico con componentes globales", "Almacenamiento en PostgreSQL"],
      en: ["Pothole detection via accelerometer/gyroscope", "Real-time audio narration", "Maps with OpenStreetMap", "Internationalization (ES / EN)", "Dynamic HUD with global components", "PostgreSQL storage"],
    },
    images: [
      "/Portfolio/vialix/v1.jpeg",
      "/Portfolio/vialix/v2.jpeg",
      "/Portfolio/vialix/v4.jpeg",
      "/Portfolio/vialix/v5.jpeg",
      "/Portfolio/vialix/v6.jpeg",
      "/Portfolio/vialix/v7.jpeg",
      "/Portfolio/vialix/v8.jpeg",
      "/Portfolio/vialix/v9.jpeg",
      "/Portfolio/vialix/v10.jpeg",
    ],
    tags: ["React Native", "PostgreSQL", "OpenStreetMap", "i18n"],
    repo: "https://github.com/AssuredPigeon/ASPHALT",
  },
  {
    num: "02", title: "ExoLab", date: "Oct 2025",
    desc: {
      es: "Dashboard interactivo para exploración, análisis y clasificación de exoplanetas mediante machine learning. Procesa datasets NASA KOI/TOI con 3,000+ cuerpos. NASA Space Apps Challenge 2025 — Equipo Astro404.",
      en: "Interactive dashboard for exoplanet exploration and ML classification. Processes NASA KOI/TOI datasets with 3,000+ bodies. NASA Space Apps Challenge 2025 — Team Astro404.",
    },
    longDesc: {
      es: "ExoLab es un dashboard científico construido con Streamlit y Python para el NASA Space Apps Challenge 2025 (Equipo Astro404). Procesa más de 3,000 exoplanetas candidatos de los datasets NASA KOI y TOI usando Pandas y NumPy. Incluye clasificación automática con Scikit-learn y XGBoost, visualizaciones interactivas con Plotly, Matplotlib y Seaborn, y análisis exploratorio de datos astronómicos. El sistema permite filtrar, comparar y explorar características físicas de los exoplanetas de forma intuitiva.",
      en: "ExoLab is a scientific dashboard built with Streamlit and Python for the NASA Space Apps Challenge 2025 (Team Astro404). It processes 3,000+ candidate exoplanets from NASA KOI and TOI datasets using Pandas and NumPy. Features automatic classification with Scikit-learn and XGBoost, interactive visualizations with Plotly, Matplotlib, and Seaborn, and exploratory analysis of astronomical data. Users can filter, compare, and explore physical characteristics of exoplanets intuitively.",
    },
    features: {
      es: ["Datasets NASA KOI/TOI con 3,000+ cuerpos", "Clasificación ML con XGBoost y Scikit-learn", "Visualizaciones interactivas con Plotly", "Análisis exploratorio con Pandas/NumPy", "Interfaz Streamlit responsive", "NASA Space Apps Challenge 2025"],
      en: ["NASA KOI/TOI datasets with 3,000+ bodies", "ML classification with XGBoost & Scikit-learn", "Interactive Plotly visualizations", "Exploratory analysis with Pandas/NumPy", "Responsive Streamlit interface", "NASA Space Apps Challenge 2025"],
    },
    images: [
      "/Portfolio/exolab/exo1.png",
      "/Portfolio/exolab/exo2.png",
      "/Portfolio/exolab/exo3.png",
      "/Portfolio/exolab/exo4.png",
      "/Portfolio/exolab/exo5.png",
      "/Portfolio/exolab/exo6.png",
      "/Portfolio/exolab/exo7.png",
    ],
    tags: ["Streamlit", "Pandas", "Python", "Numpy", "Scikit-learn", "XGBoost", "Plotly", "Matplotlib", "Seaborn"],
    repo: "https://github.com/Ainy04/ExoLab-NasaSpacesApp2025",
  },
  {
    num: "03", title: "SDGKU Academic System", date: "Sep – Dic 2025",
    desc: {
      es: "Plataforma de administración educativa con dashboard de 12+ métricas en tiempo real y sistema de recomendación inteligente basado en historial académico.",
      en: "Full-stack educational management platform with a real-time dashboard of 12+ metrics and an intelligent recommendation system based on academic history.",
    },
    longDesc: {
      es: "SDGKU Academic System es una plataforma full-stack de gestión educativa. El dashboard en tiempo real muestra más de 12 métricas clave: calificaciones, asistencia, carga académica y progreso por materia. Incluye un motor de recomendación inteligente que analiza el historial académico del estudiante y sugiere materias, horarios y estrategias de estudio personalizadas. Desarrollado con Node.js, TypeScript y Prisma ORM sobre MySQL, con interfaz en Tailwind CSS.",
      en: "SDGKU Academic System is a full-stack educational management platform. The real-time dashboard shows 12+ key metrics: grades, attendance, academic load, and subject progress. Features an intelligent recommendation engine that analyzes student history and suggests personalized subjects, schedules, and study strategies. Built with Node.js, TypeScript, and Prisma ORM on MySQL, with a Tailwind CSS interface.",
    },
    features: {
      es: ["Dashboard con 12+ métricas en tiempo real", "Motor de recomendación inteligente", "Gestión de materias y horarios", "Autenticación y roles de usuario", "ORM Prisma con MySQL", "Interfaz responsive con Tailwind"],
      en: ["Dashboard with 12+ real-time metrics", "Intelligent recommendation engine", "Subject and schedule management", "Authentication and user roles", "Prisma ORM with MySQL", "Responsive Tailwind interface"],
    },
    images: [
      "/Portfolio/sdgku/sdgku1.png",
      "/Portfolio/sdgku/sdgku2.png",
      "/Portfolio/sdgku/sdgku3.png",
      "/Portfolio/sdgku/sdgku4.png",
      "/Portfolio/sdgku/sdgku5.png",
      "/Portfolio/sdgku/sdgku6.png",
      "/Portfolio/sdgku/sdgku7.png",
      "/Portfolio/sdgku/sdgku8.png",
      "/Portfolio/sdgku/sdgku10.png",
      "/Portfolio/sdgku/sdgku11.png",
    ],
    tags: ["Node.js", "TypeScript", "HTML", "Tailwind", "JavaScript", "Prisma", "MySQL"],
    repo: "https://github.com/Garethsito/SDKGU-Subject-Sistem",
  },
  {
    num: "04", title: "Semantic Visualization", date: "Sep 2025 – Mar 2026",
    desc: {
      es: "Herramienta de visualización para explorar algoritmos GSGP en espacios semánticos. Visualización 3D/2D en tiempo real con t-SNE, UMAP y PaCMAP.",
      en: "Visualization tool to explore GSGP algorithms in semantic spaces. Real-time 3D/2D visualization using t-SNE, UMAP, and PaCMAP.",
    },
    longDesc: {
      es: "Semantic Visualization es una herramienta de investigación desarrollada para el TreeLab que permite explorar visualmente cómo los algoritmos de Programación Genética Semántica (GSGP) navegan los espacios semánticos durante la evolución. Genera visualizaciones 3D y 2D interactivas en tiempo real usando técnicas de reducción dimensional como t-SNE, UMAP y PaCMAP sobre los vectores semánticos de los individuos. Backend en Flask (Python) con Plotly 3D para renderizado, interfaz web con Tailwind CSS.",
      en: "Semantic Visualization is a research tool developed for TreeLab that visually explores how Geometric Semantic Genetic Programming (GSGP) algorithms navigate semantic spaces during evolution. It generates interactive real-time 3D and 2D visualizations using dimensionality reduction techniques — t-SNE, UMAP, and PaCMAP — applied to individual semantic vectors. Flask (Python) backend with Plotly 3D rendering and a Tailwind CSS web interface.",
    },
    features: {
      es: ["Visualización 3D interactiva en tiempo real", "Reducción dimensional: t-SNE, UMAP, PaCMAP", "Exploración de vectores semánticos GSGP", "Backend Flask + Plotly 3D", "Interfaz web con Tailwind CSS", "Herramienta de investigación académica"],
      en: ["Interactive real-time 3D visualization", "Dimensionality reduction: t-SNE, UMAP, PaCMAP", "GSGP semantic vector exploration", "Flask + Plotly 3D backend", "Tailwind CSS web interface", "Academic research tool"],
    },
    images: [
      "/Portfolio/gsgp/gsgp1.png",
      "/Portfolio/gsgp/gsgp2.png",
      "/Portfolio/gsgp/gsgp3.png",
      "/Portfolio/gsgp/gsgp4.png",
      "/Portfolio/gsgp/gsgp5.png",
      "/Portfolio/gsgp/gsgp6.png",
      "/Portfolio/gsgp/gsgp7.gif",
    ],
    tags: ["Flask", "Python", "HTML", "Tailwind", "JavaScript", "Plotly 3D"],
    repo: "https://github.com/TreeLab-Projects/Visualizing-Semantic-Space-Exploration-in-GSGP",
  },
];

// Orbes para skills
// SKILLS keys: cat1..cat5 — labels come from T[lang].skill_catN
const SKILLS_DATA: Skill[][] = [
  [
    { icon: "fa-brands fa-python", name: "Python" },
    { icon: "fa-brands fa-js", name: "JavaScript" },
    { icon: "fa-solid fa-code", name: "TypeScript" },
    { icon: "fa-brands fa-html5", name: "HTML5" },
    { icon: "fa-brands fa-css3-alt", name: "CSS3" },
    { icon: "fa-solid fa-database", name: "SQL" },
  ],
  [
    { icon: "fa-solid fa-flask", name: "Flask" },
    { icon: "fa-solid fa-layer-group", name: "Streamlit" },
    { icon: "fa-brands fa-react", name: "React Native" },
    { icon: "fa-brands fa-node-js", name: "Node.js" },
    { icon: "fa-solid fa-wind", name: "Tailwind CSS" },
  ],
  [
    { icon: "fa-solid fa-database", name: "MySQL" },
    { icon: "fa-solid fa-database", name: "PostgreSQL" },
  ],
  [
    { icon: "fa-solid fa-chart-line", name: "Plotly" },
    { icon: "fa-solid fa-chart-bar", name: "Seaborn" },
    { icon: "fa-solid fa-chart-area", name: "Matplotlib" },
    { icon: "fa-solid fa-brain", name: "Scikit-learn" },
    { icon: "fa-solid fa-chart-pie", name: "Pandas" },
  ],
  [
    { icon: "fa-brands fa-git-alt", name: "Git" },
    { icon: "fa-brands fa-github", name: "GitHub" },
    { icon: "fa-solid fa-pen-ruler", name: "Figma" },
    { icon: "fa-solid fa-image", name: "Photoshop" },
  ],
];

// Componentes

// Navbar con menú hamburguesa para móvil
function Navbar({ scrolled, lang, setLang, menuOpen, setMenuOpen }: NavbarProps) {
  const t = T[lang];
  const navLinks: [string, string][] = [
    ["#aboutme", t.nav_about],
    ["#projects", t.nav_projects],
    ["#techstack", t.nav_tech],
    ["#contact", t.nav_contact],
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6">
      <div className={`nav-glass flex justify-between items-center w-full max-w-6xl py-3 px-6 rounded-full ${scrolled ? "scrolled" : ""}`}>

        {/* Logo */}
        <a href="#home" className="logo-container p-2 rounded-lg">
          <img src="/Portfolio/Monograma_Bronce.png" alt="Logo" className="w-12 h-12" />
        </a>

        {/* Links desktop — ocultos en móvil */}
        <div className="hidden md:flex gap-2 items-center">
          {navLinks.map(([href, label]) => (
            <a key={href} href={href} className="nav-link text-sm uppercase tracking-widest px-4 py-2 rounded-full">
              {label}
            </a>
          ))}

          {/* Selector de idioma desktop */}
          <div className="flex gap-0 ml-2 border border-[rgba(212,175,55,0.3)] rounded-full overflow-hidden">
            {(["es", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs uppercase tracking-widest px-3 py-2 transition-all cursor-pointer border-none
                  ${lang === l
                    ? "bg-[rgba(212,175,55,0.15)] text-[#d4af37]"
                    : "bg-transparent text-[rgba(255,255,255,0.5)] hover:text-[#d4af37]"
                  }`}
                style={{ fontFamily: "inherit" }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Visible para movil */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 cursor-pointer border-none bg-transparent"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span className={`block w-6 h-[1.5px] bg-[#d4af37] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
          <span className={`block w-6 h-[1.5px] bg-[#d4af37] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-[1.5px] bg-[#d4af37] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
        </button>
      </div>

      {/* Menú desplegable móvil con animación */}
      <div className={`md:hidden absolute top-20 left-4 right-4 nav-glass rounded-2xl px-6 py-4 flex flex-col gap-3 transition-all duration-300
        ${menuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"}`}
      >
        {navLinks.map(([href, label]) => (
          <a
            key={href}
            href={href}
            onClick={() => setMenuOpen(false)}
            className="nav-link text-sm uppercase tracking-widest px-4 py-2 rounded-full text-center"
          >
            {label}
          </a>
        ))}
        {/* Selector idioma móvil */}
        <div className="flex justify-center mt-1">
          <div className="flex gap-0 border border-[rgba(212,175,55,0.3)] rounded-full overflow-hidden">
            {(["es", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setMenuOpen(false); }}
                className={`text-xs uppercase tracking-widest px-4 py-2 transition-all cursor-pointer border-none
                  ${lang === l
                    ? "bg-[rgba(212,175,55,0.15)] text-[#d4af37]"
                    : "bg-transparent text-[rgba(255,255,255,0.5)]"
                  }`}
                style={{ fontFamily: "inherit" }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Animación 33
function RoseBackground() {
  return (
    <>
      {PETALS.map((p, i) => (
        <div
          key={i}
          className="rose-petal"
          style={{ left: p.left, animation: `${p.anim} ${p.dur} infinite`, animationDelay: p.delay }}
        />
      ))}
      <div className="fog" style={{ top: "15%", animationDelay: "0s" }} />
      <div className="fog" style={{ bottom: "20%", animationDelay: "-10s" }} />
      <div className="fog" style={{ top: "60%", animationDelay: "-5s" }} />
      {[
        { left: "10%", top: "20%", delay: "0s" },
        { left: "30%", top: "40%", delay: "2s" },
        { left: "50%", top: "60%", delay: "4s" },
        { left: "70%", top: "30%", delay: "1s" },
        { left: "90%", top: "50%", delay: "3s" },
      ].map((p, i) => (
        <div key={i} className="particle" style={{ left: p.left, top: p.top, animationDelay: p.delay }} />
      ))}
    </>
  );
}

function HeroSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center items-center relative mt-5 px-4 sm:px-8 z-10">
      <div className="decorative-frame w-full max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-semibold text-center tracking-[0.2em] mb-4 animate-shimmer shimmer-stroke">
          Ainy Contreras Mendoza
        </h1>
        <div className="flex gap-10 justify-center mt-6">
          <a href="https://github.com/Ainy04" target="_blank" rel="noreferrer" aria-label="GitHub" className="social-sigil">
            <i className="fa-brands fa-github" />
          </a>
          <a href="https://www.linkedin.com/in/ainy-contreras-mendoza-3317rssw/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-sigil">
            <i className="fa-brands fa-linkedin-in" />
          </a>
        </div>
        <div className="divider" />
        <div className="text-lg sm:text-2xl text-[#f4d03f] tracking-[0.3em] lowercase italic text-center">
          {t.hero_role}
        </div>
        <p className="text-center text-xs sm:text-sm tracking-widest mt-2 text-[rgba(255,255,255,0.45)]">
          {t.hero_sub}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap items-center">
          <a href="#projects" className="btn-mystic mt-6 sm:mt-8 w-full sm:w-auto text-center"><span>{t.btn_projects}</span></a>
          <a href="#aboutme" className="btn-mystic sm:mt-8 w-full sm:w-auto text-center"><span>{t.btn_about}</span></a>
          <a href="#contact" className="btn-mystic sm:mt-8 w-full sm:w-auto text-center"><span>{t.btn_contact}</span></a>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <section id="aboutme" className="min-h-screen py-24 sm:py-32 px-4 sm:px-8 relative z-10 bg-gradient-to-b from-black/35 to-[#1a1a1a]/35">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl sm:text-6xl text-center mb-10 sm:mb-16 animate-shimmer shimmer-stroke" style={{ fontWeight: 700 }}>
          {t.about_title}
        </h2>
        <div className="decorative-frame">
          <p className="about-text mb-8">{t.about_text}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
            {([
              ["4+", t.hl1],
              ["35%", t.hl2],
              ["3k+", t.hl3],
              ["NASA", t.hl4],
            ] as [string, string][]).map(([num, label]) => (
              <div
                key={label}
                className="border border-[rgba(212,175,55,0.3)] p-3 sm:p-4 text-center
                           hover:border-[#dc143c] hover:shadow-[0_0_20px_rgba(139,0,0,0.4)]
                           transition-all duration-300"
              >
                <span className="block text-2xl sm:text-3xl text-[#d4af37] font-light tracking-widest" style={{ fontFamily: "inherit" }}>
                  {num}
                </span>
                <span className="block text-[10px] sm:text-xs mt-1 uppercase tracking-widest text-[rgba(255,255,255,0.5)]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Modal de detalle de proyecto ──────────────────────────────────────────────
function ProjectModal({ project, lang, onClose }: { project: Project; lang: Lang; onClose: () => void }) {
  const t = T[lang];
  const [imgIdx, setImgIdx] = useState(0);
  const hasImages = project.images.length > 0;

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const prev = () => setImgIdx((i) => (i - 1 + project.images.length) % project.images.length);
  const next = () => setImgIdx((i) => (i + 1) % project.images.length);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(20,20,20,0.98) 0%, rgba(30,15,15,0.98) 100%)",
          border: "1px solid rgba(212,175,55,0.35)",
          boxShadow: "0 0 60px rgba(139,0,0,0.4), 0 0 120px rgba(212,175,55,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-start px-6 pt-6 pb-4"
          style={{ background: "linear-gradient(135deg, rgba(20,20,20,0.98), rgba(30,15,15,0.98))", borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#dc143c] mb-1">{project.date}</p>
            <h2 className="text-2xl sm:text-3xl text-[#f4d03f]" style={{ fontFamily: "inherit" }}>{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[rgba(255,255,255,0.4)] hover:text-[#d4af37] transition-colors text-2xl leading-none mt-1 cursor-pointer border-none bg-transparent"
            aria-label={t.modal_close}
          >✕</button>
        </div>

        <div className="px-6 pb-8 space-y-8 mt-4">

          {/* Galería */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.35)] mb-3">✦ {t.modal_gallery}</p>
            {hasImages ? (
              <div className="relative rounded-lg overflow-hidden" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.2)" }}>
                <img
                  src={project.images[imgIdx]}
                  alt={`${t.modal_image} ${imgIdx + 1} ${t.modal_of} ${project.images.length}`}
                  className="w-full object-contain max-h-72"
                />
                {project.images.length > 1 && (
                  <>
                    <button onClick={prev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border-none transition-all"
                      style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", color: "#d4af37" }}>
                      <i className="fa-solid fa-chevron-left text-xs" />
                    </button>
                    <button onClick={next}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border-none transition-all"
                      style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", color: "#d4af37" }}>
                      <i className="fa-solid fa-chevron-right text-xs" />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {project.images.map((_, i) => (
                        <button key={i} onClick={() => setImgIdx(i)}
                          className="rounded-full cursor-pointer border-none transition-all"
                          style={{ width: i === imgIdx ? 18 : 6, height: 6, background: i === imgIdx ? "#d4af37" : "rgba(212,175,55,0.3)" }} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-36 rounded-lg text-[rgba(255,255,255,0.25)] text-sm tracking-widest italic"
                style={{ border: "1px dashed rgba(212,175,55,0.2)", background: "rgba(0,0,0,0.3)" }}>
                {t.modal_no_images}
              </div>
            )}
          </div>

          {/* Descripción larga */}
          <div>
            <p className="text-[rgba(255,255,255,0.75)] leading-relaxed text-sm sm:text-base">{project.longDesc[lang]}</p>
          </div>

          {/* Características */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.35)] mb-3">✦ {t.modal_features}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.features[lang].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#c0c0c0]">
                  <span className="text-[#d4af37] mt-0.5 flex-shrink-0">◆</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Stack */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.35)] mb-3">✦ {t.modal_stack}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="bg-[#8b0000]/20 border border-[#d4af37]/30 px-3 py-1 text-xs text-[#d4af37] tracking-wider rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Repo link */}
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 btn-mystic px-6 text-sm">
              <i className="fa-brands fa-github" />
              <span>{t.repo_label}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sección Proyectos ──────────────────────────────────────────────────────────
function ProjectsSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      {selected && <ProjectModal project={selected} lang={lang} onClose={() => setSelected(null)} />}
      <section id="projects" className="min-h-screen py-20 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-black/65 to-[#1a1a1a]/95">
        <h2 className="text-4xl sm:text-5xl text-center mt-10 sm:mt-14 mb-10 sm:mb-16 text-[#d4af37] tracking-[0.3em] uppercase">
          {t.proj_title}
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {PROJECTS.map((p) => (
            <div
              key={p.num}
              onClick={() => setSelected(p)}
              className="relative bg-gradient-to-br from-[#2d2d2d]/40 to-[#1a1a1a]/60 border border-[#d4af37]/30 p-6 sm:p-8
                         cursor-pointer overflow-hidden
                         hover:border-[#dc143c] hover:shadow-[0_0_40px_rgba(139,0,0,0.6)] hover:-translate-y-2
                         transition-all group"
            >
              <div className="absolute top-4 right-4 text-6xl sm:text-8xl text-[#d4af37]/20 font-light">{p.num}</div>
              {/* Hint "ver más" al hover */}
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                              text-[10px] uppercase tracking-[0.2em] text-[#d4af37]/60 flex items-center gap-1">
                <i className="fa-solid fa-expand text-[9px]" />
                {lang === "es" ? "ver más" : "see more"}
              </div>
              <p className="text-sm sm:text-lg uppercase tracking-[0.2em] text-[#dc143c] mb-2 mt-5" style={{ fontFamily: "inherit" }}>
                {p.date}
              </p>
              <h3 className="text-2xl sm:text-3xl text-[#f4d03f] mb-3 sm:mb-4 relative z-10">{p.title}</h3>
              <p className="text-[#c0c0c0] leading-relaxed mb-4 sm:mb-6 relative z-10 text-sm sm:text-base">{p.desc[lang]}</p>
              <div className="flex flex-wrap gap-2 relative z-10">
                {p.tags.map((tag) => (
                  <span key={tag} className="bg-[#8b0000]/20 border border-[#d4af37]/30 px-2 sm:px-3 py-1 text-xs text-[#d4af37] tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              {p.repo && (
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-xs uppercase tracking-widest
                             text-[rgba(255,255,255,0.45)] hover:text-[#d4af37] transition-colors duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="fa-brands fa-github text-sm" />
                  {t.repo_label}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function TechStackSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const skillCatLabels = [t.skill_cat1, t.skill_cat2, t.skill_cat3, t.skill_cat4, t.skill_cat5];
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visibleSkills, setVisibleSkills] = useState<Skill[]>(SKILLS_DATA[0]);

  const switchCategory = (idx: number) => {
    if (idx === activeIdx) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setVisibleSkills(SKILLS_DATA[idx]);
      setAnimating(false);
    }, 220);
  };

  return (
    <section
      id="techstack"
      className="min-h-screen py-24 sm:py-32 px-4 sm:px-8 relative z-10 bg-gradient-to-b from-black/75 to-[#1a1a1a]/75"
    >
      <h2
        className="text-4xl sm:text-6xl text-center mb-10 sm:mb-12 animate-shimmer shimmer-stroke"
        style={{ fontWeight: 700 }}
      >
        {t.tech_title}
      </h2>

      <div className="max-w-4xl mx-auto mb-8 sm:mb-10">
        <div
          className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-2 overflow-x-auto pb-2 sm:pb-0 px-1"
          style={{ scrollbarWidth: "none" }}
        >
          {skillCatLabels.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => switchCategory(idx)}
              className="text-xs uppercase tracking-widest px-3 sm:px-4 py-2 border transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0"
              style={{
                fontFamily: "inherit",
                background: activeIdx === idx ? "rgba(212,175,55,0.12)" : "transparent",
                borderColor: activeIdx === idx ? "rgba(212,175,55,0.7)" : "rgba(212,175,55,0.2)",
                color: activeIdx === idx ? "#f4d03f" : "rgba(255,255,255,0.45)",
                boxShadow: activeIdx === idx ? "0 0 14px rgba(212,175,55,0.18)" : "none",
                transform: activeIdx === idx ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto" style={{ height: "260px" }}>
        <div
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 content-start"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(10px)" : "translateY(0)",
            transition: "opacity 0.22s ease, transform 0.22s ease",
          }}
        >
          {visibleSkills.map((skill, i) => (
            <div
              key={skill.name}
              className="skill-orb group"
              style={{
                opacity: 0,
                animation: `skill-pop 0.35s ease forwards`,
                animationDelay: `${i * 55}ms`,
              }}
            >
              <div
                className="skill-icon transition-all duration-300 group-hover:scale-110 group-hover:brightness-125"
                style={{
                  filter: "drop-shadow(0 0 0px rgba(212,175,55,0))",
                  transition: "filter 0.3s ease, transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.filter = "drop-shadow(0 0 8px rgba(212,175,55,0.55))";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.filter = "drop-shadow(0 0 0px rgba(212,175,55,0))";
                }}
              >
                <i className={skill.icon} />
              </div>
              <div className="skill-name transition-colors duration-300 group-hover:text-[#f4d03f]">
                {skill.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes skill-pop {
          from { opacity: 0; transform: scale(0.7) translateY(12px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);    }
        }
      `}</style>
    </section>
  );
}

function ContactSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [fields, setFields] = useState<FormFields>({ asunto: "", email: "", mensaje: "" });
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name as keyof FormFields]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!fields.email || !fields.mensaje) {
      setStatus({ msg: t.err_fields, ok: false });
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      // @ts-ignore — emailjs loaded via CDN script tag in index.html
      await window.emailjs.send(
        "service_ruteuf6",
        "template_fbsx19f",
        {
          name: "Portfolio visitor",
          email: fields.email,
          message: fields.mensaje,
          title: fields.asunto || "Portfolio message",
        }
      );
      setStatus({ msg: t.ok, ok: true });
      setFields({ asunto: "", email: "", mensaje: "" });
    } catch {
      setStatus({ msg: t.err, ok: false });
    }
    setSending(false);
  };

  return (
    <section id="contact" className="contact-section min-h-screen py-24 sm:py-32 px-4 sm:px-8 relative z-10">
      <h2 className="text-4xl sm:text-6xl text-center mb-10 sm:mb-12 animate-shimmer shimmer-stroke" style={{ fontWeight: 700 }}>
        {t.contact_title}
      </h2>
      <div className="max-w-5xl mx-auto">
        <div className="decorative-frame">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-xl sm:text-2xl mb-4 sm:mb-6" style={{ color: "var(--dorado-claro)", letterSpacing: "0.12em" }}>
                {t.contact_sub}
              </p>
              <p className="text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed" style={{ color: "var(--gris-claro)" }}>
                {t.contact_text}
              </p>
              <div className="flex gap-6">
                <a href="https://github.com/Ainy04" target="_blank" rel="noreferrer" className="social-sigil">
                  <i className="fa-brands fa-github" />
                </a>
                <a href="https://www.linkedin.com/in/ainy-contreras-mendoza-3317rssw/" target="_blank" rel="noreferrer" className="social-sigil">
                  <i className="fa-brands fa-linkedin-in" />
                </a>
              </div>
            </div>

            <div className="space-y-3 w-full">
              {([
                { label: t.f_subject, name: "asunto", type: "text", placeholder: t.ph_subject },
                { label: "Email", name: "email", type: "email", placeholder: "usuario@email.com" },
              ] as { label: string; name: keyof FormFields; type: string; placeholder: string }[]).map((f) => (
                <div key={f.name}>
                  <label className="block text-sm" style={{ color: "var(--dorado-claro)", letterSpacing: "0.1em" }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={fields[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    className="contact-input text-sm py-2"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm" style={{ color: "var(--dorado-claro)", letterSpacing: "0.1em" }}>
                  {t.f_message}
                </label>
                <textarea
                  name="mensaje"
                  value={fields.mensaje}
                  onChange={handleChange}
                  rows={3}
                  placeholder={t.ph_message}
                  className="contact-input text-sm py-2 resize-none"
                />
              </div>
              <button onClick={handleSubmit} disabled={sending} className="btn-mystic px-8 text-sm w-full sm:w-auto">
                <span>{sending ? t.sending : t.btn_send}</span>
              </button>
              {status && (
                <p className="text-xs tracking-widest pt-1" style={{ color: status.ok ? "#7ec8a0" : "#e07070" }}>
                  {status.msg}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer
      className="py-8 text-center relative z-10 mt-24 sm:mt-48"
      style={{ background: "rgba(10,10,10,0.8)", borderTop: "1px solid rgba(212,175,55,0.2)" }}
    >
      <p style={{ color: "var(--gris-claro)", letterSpacing: "0.15em" }}>
        {T[lang].footer}
      </p>
    </footer>
  );
}

// App Principal
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<Lang>("es");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fa = document.createElement("script");
    fa.src = "https://kit.fontawesome.com/337be747ec.js";
    fa.crossOrigin = "anonymous";
    document.head.appendChild(fa);

    const ejs = document.createElement("script");
    ejs.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    ejs.onload = () => {
      // @ts-ignore
      window.emailjs.init({ publicKey: "26AjJvp86Dw82_dqN" });
    };
    document.head.appendChild(ejs);

    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
      setMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <RoseBackground />
      <Navbar scrolled={scrolled} lang={lang} setLang={setLang} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <HeroSection lang={lang} />
      <AboutSection lang={lang} />
      <ProjectsSection lang={lang} />
      <TechStackSection lang={lang} />
      <ContactSection lang={lang} />
      <Footer lang={lang} />
    </>
  );
}