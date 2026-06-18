(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var navLinks = document.querySelector("[data-nav-links]");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
      navLinks.classList.toggle("is-open");
    });
  }

  var navForms = document.querySelectorAll("[data-nav-search]");

  navForms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input");
      var value = input ? input.value.trim() : "";
      var target = "./search.html";

      if (value) {
        target += "?q=" + encodeURIComponent(value);
      }

      window.location.href = target;
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var pageSearch = document.querySelector("[data-page-search]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
  var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-value]"));

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function applyFilters() {
    var keyword = normalize(pageSearch ? pageSearch.value : "");
    var activeChip = document.querySelector("[data-filter-value].is-active");
    var filter = activeChip ? normalize(activeChip.getAttribute("data-filter-value")) : "all";

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute("data-search"));
      var tags = normalize(card.getAttribute("data-tags"));
      var matchedKeyword = !keyword || text.indexOf(keyword) > -1;
      var matchedFilter = filter === "all" || tags.indexOf(filter) > -1;
      card.style.display = matchedKeyword && matchedFilter ? "" : "none";
    });
  }

  if (pageSearch && cards.length) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");

    if (query) {
      pageSearch.value = query;
    }

    pageSearch.addEventListener("input", applyFilters);
    applyFilters();
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (item) {
        item.classList.remove("is-active");
      });
      chip.classList.add("is-active");
      applyFilters();
    });
  });
}());
