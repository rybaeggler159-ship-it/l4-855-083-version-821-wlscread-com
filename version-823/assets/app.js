const menuButton = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("is-open");
  });
}

const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const heroDots = Array.from(document.querySelectorAll(".slider-dot"));
let heroIndex = 0;

function setHeroSlide(nextIndex) {
  if (!heroSlides.length) {
    return;
  }

  heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, index) => {
    slide.classList.toggle("is-active", index === heroIndex);
  });
  heroDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === heroIndex);
  });
}

if (heroSlides.length) {
  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => setHeroSlide(index));
  });
  setInterval(() => setHeroSlide(heroIndex + 1), 5200);
}

const searchInput = document.querySelector("[data-filter-input]");
const yearSelect = document.querySelector("[data-filter-year]");
const typeSelect = document.querySelector("[data-filter-type]");
const cards = Array.from(document.querySelectorAll("[data-movie-card]"));
const resultLabel = document.querySelector("[data-filter-result]");

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function applyFilters() {
  if (!cards.length) {
    return;
  }

  const keyword = normalizeText(searchInput ? searchInput.value : "");
  const year = yearSelect ? yearSelect.value : "";
  const type = typeSelect ? typeSelect.value : "";
  let visible = 0;

  cards.forEach((card) => {
    const haystack = normalizeText([
      card.dataset.title,
      card.dataset.region,
      card.dataset.type,
      card.dataset.year,
      card.dataset.genre,
      card.dataset.tags
    ].join(" "));
    const yearOk = !year || card.dataset.year === year;
    const typeOk = !type || card.dataset.type === type;
    const keywordOk = !keyword || haystack.includes(keyword);
    const show = yearOk && typeOk && keywordOk;
    card.classList.toggle("hidden-card", !show);
    if (show) {
      visible += 1;
    }
  });

  if (resultLabel) {
    resultLabel.textContent = `当前显示 ${visible} 部影片`;
  }
}

[searchInput, yearSelect, typeSelect].forEach((control) => {
  if (control) {
    control.addEventListener("input", applyFilters);
    control.addEventListener("change", applyFilters);
  }
});

applyFilters();

const navSearchForms = Array.from(document.querySelectorAll("[data-nav-search]"));

navSearchForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    const query = encodeURIComponent((input && input.value ? input.value : "").trim());
    window.location.href = query ? `search.html?q=${query}` : "search.html";
  });
});

const pageParams = new URLSearchParams(window.location.search);
const initialQuery = pageParams.get("q");

if (initialQuery && searchInput) {
  searchInput.value = initialQuery;
  applyFilters();
}
