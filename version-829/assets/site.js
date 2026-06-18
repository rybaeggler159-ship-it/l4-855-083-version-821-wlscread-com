const ready = (fn) => {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};

const normalize = (value) => (value || "").toString().trim().toLowerCase();

function setupNavigation() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

function setupHero() {
  const stage = document.querySelector("[data-hero]");
  if (!stage) return;
  const slides = Array.from(stage.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
  if (!slides.length) return;
  let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  };
  dots.forEach((dot, i) => dot.addEventListener("click", () => show(i)));
  window.setInterval(() => show(index + 1), 5200);
}

function setupSearchForms() {
  document.querySelectorAll("[data-search-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      const input = form.querySelector("input[type='search'], input[name='q']");
      if (!input) return;
      const query = input.value.trim();
      if (!form.hasAttribute("data-local-search")) {
        event.preventDefault();
        const target = query ? `./search.html?q=${encodeURIComponent(query)}` : "./search.html";
        window.location.href = target;
      }
    });
  });
}

function setupLocalFilters() {
  const grid = document.querySelector("[data-card-grid]");
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll(".movie-card"));
  const input = document.querySelector("[data-filter-input]");
  const typeSelect = document.querySelector("[data-filter-type]");
  const yearSelect = document.querySelector("[data-filter-year]");
  const empty = document.querySelector("[data-empty]");
  const params = new URLSearchParams(window.location.search);
  const initial = params.get("q") || "";
  if (input && initial) input.value = initial;
  const filter = () => {
    const keyword = normalize(input && input.value);
    const type = normalize(typeSelect && typeSelect.value);
    const year = normalize(yearSelect && yearSelect.value);
    let visible = 0;
    cards.forEach((card) => {
      const text = normalize(`${card.dataset.title} ${card.dataset.genre} ${card.dataset.tags} ${card.dataset.region} ${card.dataset.year}`);
      const cardType = normalize(card.dataset.type);
      const cardYear = normalize(card.dataset.year);
      const matched = (!keyword || text.includes(keyword)) && (!type || cardType.includes(type)) && (!year || cardYear === year);
      card.style.display = matched ? "" : "none";
      if (matched) visible += 1;
    });
    if (empty) empty.classList.toggle("is-visible", visible === 0);
  };
  [input, typeSelect, yearSelect].forEach((node) => node && node.addEventListener("input", filter));
  filter();
}

ready(() => {
  setupNavigation();
  setupHero();
  setupSearchForms();
  setupLocalFilters();
});
