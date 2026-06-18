import { H as Hls } from "./hls-vendor-dru42stk.js";

const DEFAULT_HLS_SOURCES = [
  'https://vod.bunnycdn.com/5a1a1074-b8c6-48e8-81e8-d7a085fef2fc/playlist.m3u8',
  'https://vod.bunnycdn.com/3d12764c-1bfd-4a29-9196-b0c3b8c6e0a2/playlist.m3u8',
  'https://vod.bunnycdn.com/9c724e34-53f8-4a29-bf5c-c8a0e3f7d8a1/playlist.m3u8',
  'https://vod.bunnycdn.com/7f8a9d4e-23b5-4c89-a7d3-e5f2c1b9a4d6/playlist.m3u8',
  'https://vod.bunnycdn.com/2e5f3c7a-89d4-4b6e-9f2a-d8c3e7a1b5f9/playlist.m3u8',
  'https://vod.bunnycdn.com/4a8b2d5f-67c9-4e3a-8b1d-f9a2c5e7d3b8/playlist.m3u8',
  'https://vod.bunnycdn.com/6d9e4c2b-45a8-4f7e-9c3b-a1d5e8f2c7b4/playlist.m3u8',
  'https://vod.bunnycdn.com/8c3f5a7e-92d4-4b6a-8e1c-b5d9f3a7e2c8/playlist.m3u8',
  'https://vod.bunnycdn.com/1f7d4b9c-38e5-4a2f-9d6b-c8a3f5e1d7b2/playlist.m3u8',
  'https://vod.bunnycdn.com/5b2e8d4a-67c9-4f3e-8b1a-d5f9c3e7a2b6/playlist.m3u8',
  'https://vod.bunnycdn.com/9a4c7e2d-51b8-4f6a-8e3c-b7d5f9a2e1c4/playlist.m3u8',
  'https://vod.bunnycdn.com/3e8f5c1b-72d4-4a9e-9c6b-a8d3f5e7c2b1/playlist.m3u8',
  'https://vod.bunnycdn.com/7d2a9f4c-86e5-4b3a-8f1d-c5b9e3f7a2d8/playlist.m3u8',
  'https://vod.bunnycdn.com/2c5e8b3f-49d7-4a6e-9b2c-d8f1a5e3c7b9/playlist.m3u8',
  'https://vod.bunnycdn.com/6f9d4a2e-73c8-4b5f-8e1a-b3d7f5c9a2e6/playlist.m3u8',
  'https://vod.bunnycdn.com/4b8e2d5c-67a9-4f3e-9c1b-d5f8a3e7c2b4/playlist.m3u8',
  'https://vod.bunnycdn.com/8a3f5c7e-92d4-4b6a-8e1c-b9d5f3a7e2c1/playlist.m3u8',
  'https://vod.bunnycdn.com/1d7b4c9f-38e5-4a2f-9d6b-c3a8f5e1d7b2/playlist.m3u8',
  'https://vod.bunnycdn.com/5e2b8d4a-67c9-4f3e-8b1a-d9f5c3e7a2b6/playlist.m3u8',
  'https://vod.bunnycdn.com/9c4a7e2d-51b8-4f6a-8e3c-b5d7f9a2e1c4/playlist.m3u8'
];

function setupMobileMenu() {
  const button = document.querySelector("[data-mobile-toggle]");
  const nav = document.querySelector("[data-mobile-nav]");

  if (!button || !nav) {
    return;
  }

  button.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
}

function setupHeroCarousel() {
  const carousel = document.querySelector("[data-hero-carousel]");

  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(carousel.querySelectorAll("[data-hero-dot]"));
  const previous = carousel.querySelector("[data-hero-prev]");
  const next = carousel.querySelector("[data-hero-next]");
  let currentIndex = 0;
  let timer = null;

  function show(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
    });
  }

  function restart() {
    if (timer) {
      window.clearInterval(timer);
    }

    timer = window.setInterval(() => {
      show(currentIndex + 1);
    }, 5000);
  }

  previous?.addEventListener("click", () => {
    show(currentIndex - 1);
    restart();
  });

  next?.addEventListener("click", () => {
    show(currentIndex + 1);
    restart();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      show(dotIndex);
      restart();
    });
  });

  show(0);
  restart();
}

function setupFilters() {
  const panels = Array.from(document.querySelectorAll("[data-filter-panel]"));

  panels.forEach((panel) => {
    const targetSelector = panel.dataset.target || "[data-filter-list]";
    const target = document.querySelector(targetSelector);

    if (!target) {
      return;
    }

    const cards = Array.from(target.querySelectorAll("[data-movie-card]"));
    const keywordInput = panel.querySelector("[data-search-input]");
    const regionSelect = panel.querySelector("[data-region-filter]");
    const typeSelect = panel.querySelector("[data-type-filter]");
    const yearSelect = panel.querySelector("[data-year-filter]");
    const countLabel = panel.querySelector("[data-result-count]");
    const emptyState = target.querySelector("[data-empty-state]") || document.querySelector("[data-empty-state]");

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilters() {
      const keyword = normalize(keywordInput?.value);
      const region = regionSelect?.value || "";
      const type = typeSelect?.value || "";
      const year = yearSelect?.value || "";
      let visibleCount = 0;

      cards.forEach((card) => {
        const search = normalize(card.dataset.search || card.textContent);
        const matchesKeyword = !keyword || search.includes(keyword);
        const matchesRegion = !region || card.dataset.region === region;
        const matchesType = !type || card.dataset.type === type;
        const matchesYear = !year || card.dataset.year === year;
        const isVisible = matchesKeyword && matchesRegion && matchesType && matchesYear;

        card.hidden = !isVisible;

        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (countLabel) {
        countLabel.textContent = String(visibleCount);
      }

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    }

    [keywordInput, regionSelect, typeSelect, yearSelect].forEach((control) => {
      control?.addEventListener("input", applyFilters);
      control?.addEventListener("change", applyFilters);
    });

    applyFilters();
  });
}

function setupPlayers() {
  const players = Array.from(document.querySelectorAll("[data-hls-player]"));

  players.forEach((video) => {
    const box = video.closest(".video-box");
    const startButton = box?.querySelector("[data-player-start]");
    const status = box?.querySelector("[data-player-status]");
    let hls = null;
    let currentSourceIndex = 0;
    let hasStarted = false;

    const preferredSource = video.dataset.src || DEFAULT_HLS_SOURCES[0];
    const candidateSources = [preferredSource, ...DEFAULT_HLS_SOURCES]
      .filter(Boolean)
      .filter((source, index, array) => array.indexOf(source) === index);

    function setStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    function destroyHls() {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    }

    function tryNextSource() {
      currentSourceIndex += 1;

      if (currentSourceIndex < candidateSources.length) {
        loadCurrentSource();
        return;
      }

      setStatus("视频加载失败，请稍后重试");
      startButton?.classList.remove("is-hidden");
    }

    function playVideo() {
      video.play().catch(() => {
        setStatus("已加载，请点击播放器播放");
      });
    }

    function loadCurrentSource() {
      const source = candidateSources[currentSourceIndex];

      if (!source) {
        setStatus("未找到可用播放源");
        return;
      }

      destroyHls();
      setStatus("正在加载播放源...");
      startButton?.classList.add("is-hidden");

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hls.loadSource(source);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setStatus("播放源已就绪");
          playVideo();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data && data.fatal) {
            tryNextSource();
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.addEventListener("loadedmetadata", () => {
          setStatus("播放源已就绪");
          playVideo();
        }, { once: true });
        video.addEventListener("error", tryNextSource, { once: true });
      } else {
        setStatus("当前浏览器不支持 HLS 播放");
        startButton?.classList.remove("is-hidden");
      }
    }

    function start() {
      if (hasStarted) {
        playVideo();
        return;
      }

      hasStarted = true;
      currentSourceIndex = 0;
      loadCurrentSource();
    }

    startButton?.addEventListener("click", start);
    video.addEventListener("play", () => {
      if (!hasStarted) {
        start();
      }
    }, { once: true });
    window.addEventListener("beforeunload", destroyHls);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupHeroCarousel();
  setupFilters();
  setupPlayers();
});
