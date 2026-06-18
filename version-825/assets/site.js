(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMenu() {
    var toggle = qs("[data-menu-toggle]");
    var menu = qs("[data-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initHero() {
    var root = qs("[data-hero]");
    if (!root) {
      return;
    }
    var slides = qsa("[data-hero-slide]", root);
    var dots = qsa("[data-hero-dot]", root);
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }
    function play() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        window.clearInterval(timer);
        show(i);
        play();
      });
    });
    root.addEventListener("mouseenter", function () {
      window.clearInterval(timer);
    });
    root.addEventListener("mouseleave", play);
    play();
  }

  function initSearch() {
    var form = qs("[data-search-form]");
    var input = qs("[data-search-input]");
    var panel = qs("[data-search-panel]");
    var data = window.__MOVIE_SEARCH__ || [];
    if (!form || !input || !panel || !data.length) {
      return;
    }
    function render(query) {
      var q = query.trim().toLowerCase();
      if (!q) {
        panel.classList.remove("is-open");
        panel.innerHTML = "";
        return [];
      }
      var result = data.filter(function (item) {
        return item.title.toLowerCase().indexOf(q) > -1 ||
          item.tags.toLowerCase().indexOf(q) > -1 ||
          item.meta.toLowerCase().indexOf(q) > -1;
      }).slice(0, 10);
      if (!result.length) {
        panel.innerHTML = '<div class="search-result"><div></div><div><strong>未找到相关影片</strong><span>请尝试其他关键词</span></div></div>';
        panel.classList.add("is-open");
        return [];
      }
      panel.innerHTML = result.map(function (item) {
        return '<a class="search-result" href="' + item.url + '">' +
          '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '">' +
          '<div><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.meta) + '</span></div>' +
          '</a>';
      }).join("");
      panel.classList.add("is-open");
      return result;
    }
    function escapeHtml(text) {
      return String(text).replace(/[&<>"']/g, function (ch) {
        return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
      });
    }
    input.addEventListener("input", function () {
      render(input.value);
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var result = render(input.value);
      if (result.length) {
        window.location.href = result[0].url;
      }
    });
    document.addEventListener("click", function (event) {
      if (!form.contains(event.target)) {
        panel.classList.remove("is-open");
      }
    });
  }

  function initPlayer() {
    var video = qs("[data-player-video]");
    var button = qs("[data-player-button]");
    if (!video) {
      return;
    }
    var source = video.getAttribute("data-src");
    var hlsInstance;
    function attach() {
      if (!source) {
        return;
      }
      if (button) {
        button.classList.add("is-hidden");
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        if (video.getAttribute("src") !== source) {
          video.setAttribute("src", source);
        }
        video.play().catch(function () {});
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        if (!hlsInstance) {
          hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        }
        video.play().catch(function () {});
        return;
      }
      video.setAttribute("src", source);
      video.play().catch(function () {});
    }
    if (button) {
      button.addEventListener("click", attach);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        attach();
      }
    });
  }

  function initBackTop() {
    var btn = qs("[data-back-top]");
    if (!btn) {
      return;
    }
    window.addEventListener("scroll", function () {
      btn.classList.toggle("is-visible", window.scrollY > 500);
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initSearch();
    initPlayer();
    initBackTop();
  });
})();
