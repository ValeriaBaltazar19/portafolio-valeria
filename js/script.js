const GITHUB_USER = 'ValeriaBaltazar19';

const fallbackRepos = [
  { name: 'demo_crud_spring', description: 'Aplicación orientada a operaciones CRUD para registrar, administrar y consultar información en un entorno web.', language: 'HTML', html_url: 'https://github.com/ValeriaBaltazar19/demo_crud_spring', updated_at: '2025-10-04T00:00:00Z', stargazers_count: 0 },
  { name: 'Bot-Asistente-de-Consultas', description: 'Bot desarrollado en Python para automatizar respuestas y ejecutar flujos de consulta de manera eficiente.', language: 'Python', html_url: 'https://github.com/ValeriaBaltazar19/Bot-Asistente-de-Consultas', updated_at: '2025-09-12T00:00:00Z', stargazers_count: 0 },
  { name: 'Minimarket', description: 'Sistema administrativo desarrollado en C# para apoyar el control de productos, operaciones y procesos de un minimarket.', language: 'C#', html_url: 'https://github.com/ValeriaBaltazar19/Minimarket', updated_at: '2025-04-28T00:00:00Z', stargazers_count: 0 },
  { name: 'Libro', description: 'Proyecto web enfocado en la presentación de contenido, estructura de interfaz y experiencia visual.', language: 'HTML', html_url: 'https://github.com/ValeriaBaltazar19/Libro', updated_at: '2025-04-02T00:00:00Z', stargazers_count: 0 },
  { name: 'RotarAI', description: 'Sitio web con enfoque visual y práctica de estilos personalizados mediante CSS.', language: 'CSS', html_url: 'https://github.com/ValeriaBaltazar19/RotarAI', updated_at: '2025-04-01T00:00:00Z', stargazers_count: 0 }
];

const descriptions = Object.fromEntries(fallbackRepos.map(repo => [repo.name, repo.description]));
const projectsGrid = document.getElementById('projectsGrid');
const navLinks = document.getElementById('navLinks');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const themeText = themeToggle?.querySelector('.theme-text');
const year = document.getElementById('year');

if (year) year.textContent = new Date().getFullYear();

function svgIcon(name) {
  return `<svg class="svg-icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
}

function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

function updateThemeButton(theme) {
  const isDark = theme === 'dark';
  if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
  if (themeText) themeText.textContent = isDark ? 'Claro' : 'Oscuro';
  themeToggle?.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeButton(theme);
}

updateThemeButton(getCurrentTheme());

themeToggle?.addEventListener('click', () => {
  setTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
});

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('open');
    menuToggle?.classList.remove('active');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

function sanitize(text = '') {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDate(dateString) {
  if (!dateString) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-PE', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString));
}

function renderRepos(repos) {
  if (!projectsGrid) return;
  projectsGrid.innerHTML = repos.map((repo, index) => {
    const description = descriptions[repo.name] || repo.description || 'Repositorio público desarrollado como parte de mi formación y práctica en software.';
    const language = repo.language || 'Proyecto';
    return `
      <article class="project-card reveal visible" style="transition-delay:${Math.min(index * .06, .3)}s">
        <div class="project-top">
          <div class="project-title-wrap">
            <span class="project-icon">${svgIcon('github')}</span>
            <h3>${sanitize(repo.name)}</h3>
          </div>
          <span class="language">${svgIcon('code')} ${sanitize(language)}</span>
        </div>
        <p>${sanitize(description)}</p>
        <div class="project-meta">
          <span>${svgIcon('calendar')} ${formatDate(repo.updated_at)}</span>
          <span>${svgIcon('star')} ${repo.stargazers_count ?? 0}</span>
        </div>
        <div class="project-actions">
          <a href="${repo.html_url}" target="_blank" rel="noopener">${svgIcon('external')} Ver código</a>
        </div>
      </article>`;
  }).join('');
}

async function loadGithubRepos() {
  if (!projectsGrid) return;
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`);
    if (!response.ok) throw new Error('No se pudo conectar con GitHub');
    const repos = await response.json();
    const publicRepos = repos.filter(repo => !repo.fork).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    renderRepos(publicRepos.length ? publicRepos : fallbackRepos);
  } catch (error) {
    renderRepos(fallbackRepos);
  }
}

function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .14 });
  elements.forEach(el => observer.observe(el));
}

function initActiveNav() {
  const sections = [...document.querySelectorAll('header[id], main section[id]')];
  const links = [...document.querySelectorAll('.nav-links a')];
  if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;
  const map = new Map(links.map(link => [link.getAttribute('href').replace('#',''), link]));
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
    if (!visible.length) return;
    links.forEach(link => link.classList.remove('active'));
    map.get(visible[0].target.id)?.classList.add('active');
  }, { rootMargin: '-20% 0px -62% 0px', threshold: [.18, .35, .6] });
  sections.forEach(section => observer.observe(section));
}

loadGithubRepos();
initRevealAnimations();
initActiveNav();
