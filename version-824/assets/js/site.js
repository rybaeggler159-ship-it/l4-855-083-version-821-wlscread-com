(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var topButton = document.querySelector('[data-back-top]');
  if (topButton) {
    window.addEventListener('scroll', function () {
      topButton.classList.toggle('show', window.scrollY > 480);
    });
    topButton.addEventListener('click', function () {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('active', itemIndex === current);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('active', itemIndex === current);
      });
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        play();
      });
    });
    show(0);
    play();
  }

  var params = new URLSearchParams(window.location.search);
  var queryValue = params.get('q') || '';
  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-card-search]'));
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var activeFilter = 'all';

  function applyCards() {
    var text = searchInputs.length ? searchInputs[0].value.trim().toLowerCase() : '';
    cards.forEach(function (card) {
      var hay = (card.getAttribute('data-search') || '').toLowerCase();
      var type = card.getAttribute('data-type') || '';
      var typeMatch = activeFilter === 'all' || type.indexOf(activeFilter) !== -1 || hay.indexOf(activeFilter.toLowerCase()) !== -1;
      var textMatch = !text || hay.indexOf(text) !== -1;
      card.classList.toggle('hidden-card', !(typeMatch && textMatch));
    });
  }

  if (searchInputs.length) {
    searchInputs.forEach(function (input) {
      if (queryValue) {
        input.value = queryValue;
      }
      input.addEventListener('input', function () {
        searchInputs.forEach(function (other) {
          if (other !== input) {
            other.value = input.value;
          }
        });
        applyCards();
      });
    });
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeFilter = button.getAttribute('data-filter') || 'all';
      filterButtons.forEach(function (item) {
        item.classList.toggle('active', item === button);
      });
      applyCards();
    });
  });

  if (cards.length && (queryValue || filterButtons.length)) {
    applyCards();
  }
})();
