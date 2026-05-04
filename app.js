const APPS = [
  {
    id: 'argo',
    name: 'Portale Argo',
    desc: 'Registro elettronico scolastico. Voti, presenze, comunicazioni e pagelle in un\'unica piattaforma.',
    url: 'https://www.portaleargo.it/',
    cat: 'scuola',
    tag: { label: 'Scuola', cls: 'tag-amber' },
    icon: { url: 'https://www.portaleargo.it/portale/images/favicon.ico' },
  },
  {
    id: 'presentazioni',
    name: 'Presentazioni',
    desc: 'Crea e modifica presentazioni Google direttamente nel browser, con condivisione in tempo reale.',
    url: 'https://docs.google.com/presentation/u/0/',
    cat: 'scuola',
    tag: { label: 'Scuola', cls: 'tag-amber' },
    icon: { url: 'https://ssl.gstatic.com/docs/presentations/images/favicon-2023q4.ico' },
  },
  {
    id: 'github',
    name: 'GitHub',
    desc: 'Repository pubblici, contributi open source e progetti personali di Silvio Luca.',
    url: 'https://github.com/silvioluca/',
    cat: 'dev',
    tag: { label: 'Dev', cls: 'tag-blue' },
    icon: { url: 'https://github.githubassets.com/favicons/favicon-dark.png' },
  },
  {
    id: 'oscilloscope',
    name: 'Arduino Oscilloscope',
    desc: 'Oscilloscopio in tempo reale nel browser. Visualizza segnali analogici via porta seriale.',
    url: 'https://silvioluca.github.io/arduinoweboscilloscope/',
    cat: 'dev',
    tag: { label: 'Hardware', cls: 'tag-green' },
    icon: { url: 'https://cdn.arduino.cc/header-footer/prod/assets/favicon-arduino/favicon.ico' },
  },
  {
    id: 'budget',
    name: 'Budget Manager',
    desc: 'Traccia entrate e uscite condivise. Google Sheets come backend, con grafici e analisi mensili.',
    url: 'https://silvioluca.github.io/budgetmanager/login.html',
    cat: 'finance',
    tag: { label: 'Finance', cls: 'tag-green' },
    icon: { emoji: '💰' },
  },
  {
    id: 'quiztube',
    name: 'QuizTube',
    desc: 'Genera quiz interattivi da qualsiasi video YouTube. Studia e metti alla prova le tue conoscenze.',
    url: 'https://silvioluca.github.io/quiztube/',
    cat: 'learning',
    tag: { label: 'Learning', cls: 'tag-blue' },
    icon: { url: 'https://www.youtube.com/s/desktop/1904e31a/img/favicon.ico' },
  },
  {
    id: 'notion',
    name: 'Notion',
    desc: 'Area di lavoro per note, database, documenti e project management tutto in uno.',
    url: 'https://www.notion.so/',
    cat: 'produttivita',
    tag: { label: 'Produttività', cls: 'tag-neutral' },
    icon: { url: 'https://www.notion.so/images/favicon.ico' },
  },
];

const CATS = [
  { id: 'all',          label: 'Tutte' },
  { id: 'dev',          label: 'Dev' },
  { id: 'finance',      label: 'Finance' },
  { id: 'learning',     label: 'Learning' },
  { id: 'scuola',       label: 'Scuola' },
  { id: 'produttivita', label: 'Produttività' },
];

// ─── State ────────────────────────────────────────────────
let activeCat = 'all';

// ─── Theme ───────────────────────────────────────────────
const html = document.documentElement;
const stored = localStorage.getItem('hub-theme');
if (stored) html.dataset.theme = stored;
updateThemeIcon();

document.getElementById('themeToggle').addEventListener('click', () => {
  const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = next;
  localStorage.setItem('hub-theme', next);
  updateThemeIcon();
});

function updateThemeIcon() {
  const dark = html.dataset.theme === 'dark';
  document.getElementById('iconMoon').style.display = dark  ? '' : 'none';
  document.getElementById('iconSun').style.display  = !dark ? '' : 'none';
}

// ─── Render filters ───────────────────────────────────────
function renderFilters() {
  const wrap = document.getElementById('filters');
  wrap.innerHTML = '';
  CATS.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-pill' + (cat.id === activeCat ? ' active' : '');
    btn.textContent = cat.label;
    btn.dataset.cat = cat.id;
    btn.addEventListener('click', () => {
      activeCat = cat.id;
      renderFilters();
      filterCards();
    });
    wrap.appendChild(btn);
  });
}

// ─── Render cards ─────────────────────────────────────────
function renderCards() {
  const grid = document.getElementById('appGrid');
  grid.innerHTML = '';
  APPS.forEach(app => {
    const a = document.createElement('a');
    a.className = 'app-card';
    a.href = app.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.dataset.cat = app.cat;

    const iconHtml = app.icon.url
      ? `<img src="${app.icon.url}" alt="${app.name} icon" loading="lazy" />`
      : `<span class="icon-emoji">${app.icon.emoji}</span>`;

    const urlLabel = app.url.replace(/^https?:\/\//, '').replace(/\/$/, '');

    a.innerHTML = `
      <div class="card-top">
        <div class="app-icon">${iconHtml}</div>
        <span class="tag ${app.tag.cls}">${app.tag.label}</span>
      </div>
      <div class="app-name">${app.name}</div>
      <div class="app-desc">${app.desc}</div>
      <div class="card-footer">
        <span class="app-url">${urlLabel}</span>
        <span class="card-arrow">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
          </svg>
        </span>
      </div>
    `;
    grid.appendChild(a);
  });
}

function filterCards() {
  const cards = document.querySelectorAll('.app-card');
  let visible = 0;
  cards.forEach(card => {
    const show = activeCat === 'all' || card.dataset.cat === activeCat;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });

  let empty = document.querySelector('.empty-state');
  if (visible === 0) {
    if (!empty) {
      empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'Nessuna app in questa categoria.';
      document.getElementById('appGrid').appendChild(empty);
    }
  } else if (empty) {
    empty.remove();
  }
}

// ─── Footer year ──────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ─── Init ─────────────────────────────────────────────────
renderFilters();
renderCards();
