
/* ═══════════════════════════════════════════════════════════
   MENÚ MÓVIL
═══════════════════════════════════════════════════════════ */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Cierra el menú al tocar un link (útil en móvil)
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ═══════════════════════════════════════════════════════════
   LINK ACTIVO SEGÚN LA SECCIÓN VISIBLE
═══════════════════════════════════════════════════════════ */
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav__links a");

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navAnchors.forEach((a) => {
        a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

sections.forEach((section) => spyObserver.observe(section));

/* ═══════════════════════════════════════════════════════════
   REVELADO SUAVE DE SECCIONES AL HACER SCROLL
═══════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

sections.forEach((section) => revealObserver.observe(section));

/* ═══════════════════════════════════════════════════════════
   TERMINAL ANIMADA DEL HERO
   Escribe unas líneas tipo shell una sola vez al cargar.
   Si el usuario prefiere menos movimiento, se muestran directo.
═══════════════════════════════════════════════════════════ */
const terminalBody = document.getElementById("terminalBody");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const terminalLines = [
  { prompt: "$ whoami", output: "orisono728" },
  { prompt: "$ cat rol.txt", output: "Estudiante de Ingeniería de Sistemas y Computación" },
  { prompt: "$ cat filosofia.txt", output: '"Understand the machine. Then build the next one."' },
  { prompt: "$ _", output: "" },
];

function renderTerminalInstant() {
  terminalBody.textContent = terminalLines
    .map((l) => (l.output ? `${l.prompt}\n${l.output}` : l.prompt))
    .join("\n\n");
}

async function typeTerminal() {
  for (const line of terminalLines) {
    await typeText(line.prompt, "\n");
    if (line.output) {
      await typeText(line.output, "\n\n", true);
    }
  }
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  terminalBody.appendChild(cursor);
}

function typeText(text, trailing, dim = false) {
  return new Promise((resolve) => {
    const span = document.createElement("span");
    if (dim) span.style.color = "var(--text-dim)";
    terminalBody.appendChild(span);
    let i = 0;
    const speed = 22;
    const timer = setInterval(() => {
      span.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        terminalBody.appendChild(document.createTextNode(trailing));
        resolve();
      }
    }, speed);
  });
}

if (prefersReducedMotion) {
  renderTerminalInstant();
} else {
  typeTerminal();
}

/* ═══════════════════════════════════════════════════════════
   PROYECTOS
   ───────────────────────────────────────────────────────────
   Cómo agregar un proyecto nuevo:
   Copia este bloque dentro del array `proyectos` de abajo y
   completa los datos. No necesitas tocar el HTML ni el CSS.

   {
     nombre: "Nombre del proyecto",
     descripcion: "Qué hace, en una sola frase.",
     stack: ["JS", "CSS"],
     estado: "dev",      // "dev" | "live" | "archivado"
     repo: "https://github.com/Orisono728/tu-repo",
     demo: ""            // opcional, deja "" si no hay demo en vivo
   }
   ───────────────────────────────────────────────────────────
   Empieza vacío a propósito: el primer commit real va aquí. */
const proyectos = [
  // Ejemplos ya listos por si quieres arrancar con lo que ya existe,
  // solo descomenta el que aplique:
  // {
  //   nombre: "KernelGarden Web",
  //   descripcion: "Portal web del colectivo indie The KernelGames.",
  //   stack: ["HTML", "CSS", "JS"],
  //   estado: "live",
  //   repo: "https://github.com/the-kernelgames/The-KernelGarden",
  //   demo: "",
  // },
  // {
  //   nombre: "Pangolin: The Lost Cap",
  //   descripcion: "Aventura indie en desarrollo activo por The KernelGames.",
  //   stack: ["JS", "Phaser 3"],
  //   estado: "dev",
  //   repo: "https://github.com/the-kernelgames/The-KernelGames",
  //   demo: "",
  // },
];

const estadoLabel = { dev: "En desarrollo", live: "Live", archivado: "Archivado" };
const estadoClase = { dev: "badge--dev", live: "badge--live", archivado: "badge--archived" };

function renderProyectos() {
  const grid = document.getElementById("projectsGrid");

  if (proyectos.length === 0) {
    grid.innerHTML = `
      <div class="projects-empty">
        <strong>(vacío por ahora)</strong>
        el primer commit va aquí — vuelve pronto
      </div>
    `;
    return;
  }

  grid.innerHTML = proyectos
    .map(
      (p) => `
      <a class="project-card" href="${p.repo}" target="_blank" rel="noopener noreferrer">
        <div class="project-card__top">
          <h3>${p.nombre}</h3>
          <span class="badge ${estadoClase[p.estado] || "badge--dev"}">${
        estadoLabel[p.estado] || p.estado
      }</span>
        </div>
        <p>${p.descripcion}</p>
        <div class="project-card__stack">
          ${p.stack.map((s) => `<span>${s}</span>`).join("")}
        </div>
      </a>
    `
    )
    .join("");
}

renderProyectos();
