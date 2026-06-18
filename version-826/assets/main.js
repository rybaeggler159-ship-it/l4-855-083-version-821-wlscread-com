(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function text(value) {
    return String(value || "");
  }

  function escapeHtml(value) {
    return text(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initMenu() {
    var toggle = qs("[data-menu-toggle]");
    var menu = qs("[data-nav-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initBackTop() {
    qsa("[data-back-top]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      });
    });
  }

  function renderSearchItem(item) {
    return "<a class=\"search-item\" href=\"" + escapeHtml(item.url) + "\">" +
      "<img src=\"" + escapeHtml(item.cover) + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\">" +
      "<span><strong>" + escapeHtml(item.title) + "</strong>" +
      "<span>" + escapeHtml(item.year) + " · " + escapeHtml(item.category) + " · " + escapeHtml(item.genre) + "</span>" +
      "<em>" + escapeHtml(item.intro) + "</em></span></a>";
  }

  function initSearch() {
    var data = window.SiteSearchIndex || [];
    qsa("[data-search-form]").forEach(function (form) {
      var input = qs("[data-search-input]", form);
      var box = qs("[data-search-results]", form);
      if (!input || !box) {
        return;
      }
      function run() {
        var query = input.value.trim().toLowerCase();
        if (!query) {
          box.classList.remove("open");
          box.innerHTML = "";
          return [];
        }
        var terms = query.split(/\s+/).filter(Boolean);
        var results = data.filter(function (item) {
          var haystack = text(item.search).toLowerCase();
          return terms.every(function (term) {
            return haystack.indexOf(term) !== -1;
          });
        }).slice(0, 10);
        box.innerHTML = results.length ? results.map(renderSearchItem).join("") : "<div class=\"search-empty\">没有找到相关影片</div>";
        box.classList.add("open");
        return results;
      }
      input.addEventListener("input", run);
      input.addEventListener("focus", run);
      form.addEventListener("submit", function (event) {
        var results = run();
        if (results.length) {
          event.preventDefault();
          window.location.href = results[0].url;
        }
      });
      document.addEventListener("click", function (event) {
        if (!form.contains(event.target)) {
          box.classList.remove("open");
        }
      });
    });
  }

  function initHero() {
    var slider = qs("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = qsa("[data-hero-slide]", slider);
    var dots = qsa("[data-slide-to]", slider);
    var prev = qs("[data-hero-prev]", slider);
    var next = qs("[data-hero-next]", slider);
    var index = 0;
    var timer = null;
    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide-to")) || 0);
        start();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initPageFilter() {
    var input = qs("[data-page-filter]");
    var cards = qsa("[data-filter-card]");
    var chips = qsa("[data-filter-chip]");
    var clear = qs("[data-clear-filter]");
    if (!input || !cards.length) {
      return;
    }
    var activeChip = "";
    function matches(card, query) {
      var haystack = [
        card.getAttribute("data-title"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-tags"),
        card.getAttribute("data-year"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type")
      ].join(" ").toLowerCase();
      var okQuery = !query || query.split(/\s+/).filter(Boolean).every(function (term) {
        return haystack.indexOf(term) !== -1;
      });
      var okChip = !activeChip || haystack.indexOf(activeChip.toLowerCase()) !== -1;
      return okQuery && okChip;
    }
    function apply() {
      var query = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        card.classList.toggle("is-hidden", !matches(card, query));
      });
    }
    input.addEventListener("input", apply);
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var value = chip.getAttribute("data-filter-chip") || "";
        activeChip = activeChip === value ? "" : value;
        chips.forEach(function (item) {
          item.classList.toggle("active", item.getAttribute("data-filter-chip") === activeChip);
        });
        apply();
      });
    });
    if (clear) {
      clear.addEventListener("click", function () {
        input.value = "";
        activeChip = "";
        chips.forEach(function (item) {
          item.classList.remove("active");
        });
        apply();
      });
    }
  }

  function initPlayers() {
    qsa("[data-player]").forEach(function (player) {
      var video = qs("video", player);
      var cover = qs("[data-player-start]", player);
      var stream = player.getAttribute("data-stream-url");
      var prepared = false;
      var hls = null;
      function prepare() {
        if (prepared || !video || !stream) {
          return;
        }
        prepared = true;
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        }
      }
      function start() {
        prepare();
        if (cover) {
          cover.classList.add("hidden");
        }
        video.controls = true;
        var playPromise = video.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(function () {
            if (cover) {
              cover.classList.remove("hidden");
            }
          });
        }
      }
      if (cover) {
        cover.addEventListener("click", start);
      }
      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            start();
          }
        });
      }
      window.addEventListener("beforeunload", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initBackTop();
    initSearch();
    initHero();
    initPageFilter();
    initPlayers();
  });
})();
