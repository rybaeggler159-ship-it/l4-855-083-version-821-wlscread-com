(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function setupNavigation() {
    var toggle = qs('.nav-toggle');
    var panel = qs('.mobile-panel');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', panel.classList.contains('open') ? 'true' : 'false');
    });
  }

  function setupHero() {
    var hero = qs('.hero');
    if (!hero) {
      return;
    }
    var slides = qsa('.hero-slide', hero);
    var dots = qsa('.hero-dot', hero);
    var prev = qs('.hero-prev', hero);
    var next = qs('.hero-next', hero);
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle('active', idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle('active', idx === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }
    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        show(idx);
        restart();
      });
    });
    show(0);
    restart();
  }

  function setupSearchForms() {
    qsa('.site-search').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = qs('input[name="q"]', form);
        var query = input ? input.value.trim() : '';
        var target = 'search.html';
        if (query) {
          target += '?q=' + encodeURIComponent(query);
        }
        window.location.href = target;
      });
    });
  }

  function setupFilters() {
    var input = qs('.filter-input');
    var region = qs('.filter-region');
    var year = qs('.filter-year');
    var cards = qsa('.searchable-card');
    var empty = qs('.no-results');
    if (!cards.length) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q');
    if (input && initial) {
      input.value = initial;
    }

    function filter() {
      var query = normalize(input ? input.value : '');
      var regionValue = region ? region.value : '';
      var yearValue = year ? year.value : '';
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year')
        ].join(' '));
        var okQuery = !query || haystack.indexOf(query) !== -1;
        var okRegion = !regionValue || card.getAttribute('data-region') === regionValue;
        var okYear = !yearValue || card.getAttribute('data-year') === yearValue;
        var show = okQuery && okRegion && okYear;
        card.classList.toggle('hidden-card', !show);
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    [input, region, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', filter);
        control.addEventListener('change', filter);
      }
    });
    filter();
  }

  function setupPlayers() {
    qsa('.js-player').forEach(function (box) {
      var video = qs('video', box);
      var layer = qs('.player-layer', box);
      var button = qs('.player-button', box);
      var status = qs('.player-status', box);
      var source = box.getAttribute('data-source');
      var ready = false;
      var hls = null;

      if (!video || !source) {
        return;
      }

      function setStatus(text) {
        if (status) {
          status.textContent = text || '';
        }
      }

      function init() {
        if (ready) {
          return;
        }
        ready = true;
        setStatus('正在加载高清播放源');
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setStatus('');
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setStatus('播放源加载失败，请稍后重试');
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          video.addEventListener('loadedmetadata', function () {
            setStatus('');
          }, { once: true });
        } else {
          setStatus('当前浏览器暂不支持此播放格式');
        }
      }

      function play() {
        init();
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {
            video.addEventListener('canplay', function () {
              video.play().catch(function () {});
            }, { once: true });
          });
        }
      }

      if (button) {
        button.addEventListener('click', function (event) {
          event.preventDefault();
          play();
        });
      }
      if (layer) {
        layer.addEventListener('click', play);
      }
      video.addEventListener('play', function () {
        box.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        if (!video.ended) {
          box.classList.remove('is-playing');
        }
      });
      video.addEventListener('ended', function () {
        box.classList.remove('is-playing');
      });
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      });
      init();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupNavigation();
    setupHero();
    setupSearchForms();
    setupFilters();
    setupPlayers();
  });
})();
