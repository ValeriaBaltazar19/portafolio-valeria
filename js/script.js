const GITHUB_USER = "ValeriaBaltazar19";

const fallbackRepos = [
  {
    name: "portafolio-sisters",
    description: "Repositorio público desarrollado como parte de mi práctica en frontend y publicación web.",
    language: "HTML",
    html_url: "https://github.com/ValeriaBaltazar19/portafolio-sisters",
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
  },
  {
    name: "Libro",
    description: "Proyecto web enfocado en presentación de contenido, estructura visual y organización de información.",
    language: "HTML",
    html_url: "https://github.com/ValeriaBaltazar19/Libro",
    updated_at: "2025-04-02T00:00:00Z",
    stargazers_count: 0
  },
  {
    name: "RotarAI",
    description: "Sitio web con enfoque visual y uso de estilos personalizados para practicar maquetación.",
    language: "CSS",
    html_url: "https://github.com/ValeriaBaltazar19/RotarAI",
    updated_at: "2025-04-01T00:00:00Z",
    stargazers_count: 0
  }
];

const customDescriptions = Object.fromEntries(
  fallbackRepos.map(repo => [repo.name, repo.description])
);

const projectsGrid = document.getElementById("projectsGrid");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");
const themeText = themeToggle?.querySelector(".theme-text");
const backToTop = document.getElementById("backToTop");
const year = document.getElementById("year");

if (year) year.textContent = new Date().getFullYear();

function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

function updateThemeButton(theme) {
  if (!themeToggle) return;

  const isDark = theme === "dark";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
  );

  if (themeIcon) themeIcon.textContent = isDark ? "☀️" : "🌙";
  if (themeText) themeText.textContent = isDark ? "Claro" : "Oscuro";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateThemeButton(theme);
}

updateThemeButton(getTheme());

themeToggle?.addEventListener("click", () => {
  setTheme(getTheme() === "dark" ? "light" : "dark");
});

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    menuToggle?.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

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
    const description =
      customDescriptions[repo.name] ||
      repo.description ||
      "Repositorio público desarrollado como parte de mi práctica en software.";

    const language = repo.language || "Proyecto";

    return `
      <article class="project-card reveal visible">
        <div class="project-top">
          <h3>${sanitize(repo.name)}</h3>
          <span class="language">${sanitize(language)}</span>
        </div>
        <p>${sanitize(description)}</p>
        <div class="project-meta">
          <span>Actualizado: ${formatDate(repo.updated_at)}</span>
          <span>★ ${repo.stargazers_count ?? 0}</span>
        </div>
        <div class="project-actions">
          <a href="${repo.html_url}" target="_blank" rel="noopener">
            Código
            <svg class="svg-icon"><use href="#i-external"></use></svg>
          </a>
        </div>
      </article>
    `;
  }).join("");
}

async function loadGithubRepos() {
  if (!projectsGrid) return;

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`
    );

    if (!response.ok) throw new Error("No se pudo conectar con GitHub");

    const repos = await response.json();

    const publicRepos = repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    renderRepos(publicRepos.length ? publicRepos : fallbackRepos);
  } catch (error) {
    renderRepos(fallbackRepos);
  }
}

function initRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  elements.forEach((element) => observer.observe(element));
}

function initBackToTop() {
  if (!backToTop) return;

  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 460);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

function initActiveNav() {
  const sections = [...document.querySelectorAll("main section[id], main[id]")];
  const links = [...document.querySelectorAll(".nav-links a")];

  if (!sections.length || !links.length || !("IntersectionObserver" in window)) return;

  const map = new Map();

  links.forEach((link) => {
    const id = link.getAttribute("href")?.replace("#", "");
    if (id) map.set(id, link);
  });

  const observer = new IntersectionObserver((entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!active) return;

    links.forEach((link) => link.classList.remove("active"));

    const link = map.get(active.target.id);
    if (link) link.classList.add("active");
  }, {
    rootMargin: "-25% 0px -60% 0px",
    threshold: [0.18, 0.35, 0.55]
  });

  sections.forEach((section) => observer.observe(section));
}

loadGithubRepos();
initRevealAnimations();
initBackToTop();
initActiveNav();