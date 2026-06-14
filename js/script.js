const GITHUB_USER = "ValeriaBaltazar19";

const fallbackRepos = [
  {
    name: "portafolio-valeria",
    description: "Portafolio profesional desarrollado como página web personal y práctica de desarrollo frontend.",
    language: "HTML",
    html_url: "https://github.com/ValeriaBaltazar19/portafolio-valeria",
    updated_at: "2026-06-13T00:00:00Z",
    stargazers_count: 0
  },
  {
    name: "demo_crud_spring",
    description: "Aplicación orientada a operaciones CRUD para el registro, administración y consulta de información.",
    language: "HTML",
    html_url: "https://github.com/ValeriaBaltazar19/demo_crud_spring",
    updated_at: "2025-10-04T00:00:00Z",
    stargazers_count: 0
  },
  {
    name: "Bot-Asistente-de-Consultas",
    description: "Bot desarrollado en Python para automatizar respuestas y ejecutar flujos de consulta.",
    language: "Python",
    html_url: "https://github.com/ValeriaBaltazar19/Bot-Asistente-de-Consultas",
    updated_at: "2025-09-12T00:00:00Z",
    stargazers_count: 0
  },
  {
    name: "Minimarket",
    description: "Sistema administrativo desarrollado en C# para apoyar el control de productos y procesos.",
    language: "C#",
    html_url: "https://github.com/ValeriaBaltazar19/Minimarket",
    updated_at: "2025-04-28T00:00:00Z",
    stargazers_count: 0
  }
];

const descriptions = {
  "portafolio-valeria": "Portafolio profesional desarrollado como página web personal y práctica de desarrollo frontend.",
  "demo_crud_spring": "Aplicación orientada a operaciones CRUD para el registro, administración y consulta de información.",
  "Bot-Asistente-de-Consultas": "Bot desarrollado en Python para automatizar respuestas y ejecutar flujos de consulta.",
  "Minimarket": "Sistema administrativo desarrollado en C# para apoyar el control de productos y procesos.",
  "Libro": "Proyecto web enfocado en la presentación de contenido y organización visual.",
  "RotarAI": "Sitio web con enfoque visual y práctica de estilos personalizados mediante CSS."
};

const projectsGrid = document.getElementById("projectsGrid");
const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
const themeToggle = document.getElementById("themeToggle");
const backToTop = document.getElementById("backToTop");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

/* ============================= */
/* MODO CLARO / OSCURO */
/* ============================= */

function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

function updateThemeButton(theme) {
  const icon = themeToggle?.querySelector(".theme-icon");
  const text = themeToggle?.querySelector(".theme-text");

  if (!themeToggle) return;

  if (theme === "dark") {
    if (icon) icon.textContent = "☀️";
    if (text) text.textContent = "Claro";
  } else {
    if (icon) icon.textContent = "🌙";
    if (text) text.textContent = "Oscuro";
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateThemeButton(theme);
}

const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle?.addEventListener("click", () => {
  setTheme(getCurrentTheme() === "dark" ? "light" : "dark");
});

/* ============================= */
/* MENÚ RESPONSIVE */
/* ============================= */

menuToggle?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
  menuToggle.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    menuToggle?.classList.remove("active");
  });
});

/* ============================= */
/* BOTÓN VOLVER AL INICIO */
/* ============================= */

if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 450) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* ============================= */
/* PROYECTOS DESDE GITHUB */
/* ============================= */

function sanitize(text = "") {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(dateString) {
  if (!dateString) return "Sin fecha";

  return new Intl.DateTimeFormat("es-PE", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(dateString));
}

function renderRepos(repos) {
  if (!projectsGrid) return;

  projectsGrid.innerHTML = repos.map((repo) => {
    const description = descriptions[repo.name] || repo.description || "Repositorio público desarrollado como parte de mi formación en software.";
    const language = repo.language || "Proyecto";

    return `
      <article class="project-card reveal visible">
        <div class="project-top">
          <div>
            <h3>${sanitize(repo.name)}</h3>
            <span class="language">${sanitize(language)}</span>
          </div>
        </div>

        <p>${sanitize(description)}</p>

        <div class="project-meta">
          <span>
            <svg class="svg-icon"><use href="#icon-calendar"></use></svg>
            ${formatDate(repo.updated_at)}
          </span>

          <span>
            <svg class="svg-icon"><use href="#icon-star"></use></svg>
            ${repo.stargazers_count ?? 0}
          </span>
        </div>

        <div class="project-actions">
          <a href="${repo.html_url}" target="_blank">
            <svg class="svg-icon"><use href="#icon-external"></use></svg>
            Código
          </a>
        </div>
      </article>
    `;
  }).join("");
}

async function loadGithubRepos() {
  if (!projectsGrid) return;

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`);

    if (!response.ok) {
      throw new Error("No se pudo conectar con GitHub");
    }

    const repos = await response.json();

    const publicRepos = repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    renderRepos(publicRepos.length ? publicRepos : fallbackRepos);
  } catch (error) {
    renderRepos(fallbackRepos);
  }
}

loadGithubRepos();

/* ============================= */
/* ANIMACIONES AL HACER SCROLL */
/* ============================= */

function initRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16
  });

  elements.forEach((el) => observer.observe(el));
}

initRevealAnimations();

/* ============================= */
/* LINK ACTIVO EN NAVBAR */
/* ============================= */

function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a");

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((link) => link.classList.remove("active"));

        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);

        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  }, {
    rootMargin: "-35% 0px -55% 0px"
  });

  sections.forEach((section) => observer.observe(section));
}

initActiveNav();