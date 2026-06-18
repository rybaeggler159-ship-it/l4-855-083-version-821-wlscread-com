
(function () {
    function $(selector, root) {
        return (root || document).querySelector(selector);
    }

    function $all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupMenu() {
        var button = $('[data-menu-button]');
        var panel = $('[data-mobile-panel]');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function () {
            panel.classList.toggle('is-open');
            button.textContent = panel.classList.contains('is-open') ? '×' : '☰';
        });
    }

    function setupHero() {
        var hero = $('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = $all('.hero-slide', hero);
        var dots = $all('.hero-dot', hero);
        var prev = $('[data-hero-prev]', hero);
        var next = $('[data-hero-next]', hero);
        var index = 0;
        var timer;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function textOfCard(card) {
        return [
            card.getAttribute('data-title') || '',
            card.getAttribute('data-year') || '',
            card.getAttribute('data-region') || '',
            card.getAttribute('data-genre') || '',
            card.textContent || ''
        ].join(' ').toLowerCase();
    }

    function setupFilter() {
        var input = $('[data-filter-input]');
        var cards = $all('.movie-card');
        var chips = $all('.filter-chip');
        if (!input || !cards.length) {
            return;
        }
        var activeChip = '';

        function apply() {
            var query = (input.value || '').trim().toLowerCase();
            cards.forEach(function (card) {
                var text = textOfCard(card);
                var matchedQuery = !query || text.indexOf(query) !== -1;
                var matchedChip = !activeChip || text.indexOf(activeChip.toLowerCase()) !== -1;
                card.classList.toggle('is-hidden-card', !(matchedQuery && matchedChip));
            });
        }

        input.addEventListener('input', apply);
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                chips.forEach(function (item) {
                    item.classList.remove('is-active');
                });
                chip.classList.add('is-active');
                activeChip = chip.getAttribute('data-filter-value') || '';
                apply();
            });
        });

        if (input.hasAttribute('data-query-sync')) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            if (q) {
                input.value = q;
            }
        }
        apply();
    }

    function setupPlayer() {
        $all('.player-shell').forEach(function (shell) {
            var video = $('video', shell);
            var overlay = $('.play-overlay', shell);
            var stream = shell.getAttribute('data-stream');
            var ready = false;
            var hlsInstance = null;

            if (!video || !overlay || !stream) {
                return;
            }

            function load() {
                if (ready) {
                    return;
                }
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({ enableWorker: true });
                    hlsInstance.loadSource(stream);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = stream;
                }
                ready = true;
            }

            function play() {
                load();
                overlay.classList.add('is-hidden');
                var promise = video.play();
                if (promise && typeof promise.catch === 'function') {
                    promise.catch(function () {
                        overlay.classList.remove('is-hidden');
                    });
                }
            }

            overlay.addEventListener('click', play);
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                }
            });
            video.addEventListener('play', function () {
                overlay.classList.add('is-hidden');
            });
            video.addEventListener('ended', function () {
                overlay.classList.remove('is-hidden');
            });
            window.addEventListener('beforeunload', function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        });
    }

    function setupScrollTop() {
        $all('[data-scroll-top]').forEach(function (button) {
            button.addEventListener('click', function () {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupHero();
        setupFilter();
        setupPlayer();
        setupScrollTop();
    });
})();
