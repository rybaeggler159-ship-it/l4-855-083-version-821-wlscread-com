import { H as Hls } from "./hls-vendor-dru42stk.js";

function ready(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

function setupMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-mobile-nav]");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
}

function setupHero() {
  const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
  if (slides.length < 2) return;
  let index = 0;
  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  };
  dots.forEach((dot, i) => dot.addEventListener("click", () => show(i)));
  window.setInterval(() => show(index + 1), 5200);
}

function setupFilters() {
  const input = document.querySelector("[data-filter-input]");
  const buttons = Array.from(document.querySelectorAll("[data-filter-value]"));
  const cards = Array.from(document.querySelectorAll("[data-card]"));
  const empty = document.querySelector("[data-empty]");
  if (!cards.length) return;
  let filter = "all";
  const params = new URLSearchParams(window.location.search);
  if (input && params.get("q")) {
    input.value = params.get("q");
  }
  const apply = () => {
    const query = input ? input.value.trim().toLowerCase() : "";
    let visible = 0;
    cards.forEach((card) => {
      const text = [
        card.dataset.title,
        card.dataset.tags,
        card.dataset.category,
        card.dataset.region,
        card.dataset.year
      ].join(" ").toLowerCase();
      const passQuery = !query || text.includes(query);
      const passFilter = filter === "all" || card.dataset.category === filter || card.dataset.region === filter || card.dataset.year === filter;
      const show = passQuery && passFilter;
      card.style.display = show ? "" : "none";
      if (show) visible += 1;
    });
    if (empty) empty.classList.toggle("is-visible", visible === 0);
  };
  if (input) input.addEventListener("input", apply);
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.filterValue || "all";
      buttons.forEach((item) => item.classList.toggle("is-active", item === button));
      apply();
    });
  });
  apply();
}

export function initPlayer(src) {
  const shell = document.querySelector("[data-player]");
  if (!shell) return;
  const video = shell.querySelector("video");
  const overlay = shell.querySelector("[data-play]");
  if (!video || !overlay) return;
  let started = false;
  let hls = null;
  const attach = () => {
    if (started) return;
    started = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }
  };
  const play = () => {
    attach();
    overlay.classList.add("is-hidden");
    video.controls = true;
    const attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => {
        overlay.classList.remove("is-hidden");
      });
    }
  };
  overlay.addEventListener("click", play);
  video.addEventListener("click", () => {
    if (video.paused) play();
  });
  window.addEventListener("pagehide", () => {
    if (hls) hls.destroy();
  });
}

ready(() => {
  setupMenu();
  setupHero();
  setupFilters();
});
