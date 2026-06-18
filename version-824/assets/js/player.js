(function () {
  function prepare(config) {
    var video = document.getElementById(config.videoId);
    var button = document.getElementById(config.buttonId);
    if (!video || !button || !config.url) {
      return;
    }
    var ready = false;

    function attach() {
      if (ready) {
        return;
      }
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = config.url;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(config.url);
        hls.attachMedia(video);
        video.hlsInstance = hls;
      } else {
        video.src = config.url;
      }
    }

    function start() {
      attach();
      button.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }

    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (!ready) {
        start();
      }
    });
  }

  window.initMoviePlayer = prepare;
  var list = window.__moviePlayers || [];
  function run() {
    list.forEach(prepare);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
