import { H as Hls } from "./hls-vendor.js";

export function initPlayer(video, trigger, stream) {
  if (!video || !stream) return;
  let attached = false;
  const start = () => {
    if (!attached) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else if (Hls && Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
      attached = true;
    }
    video.controls = true;
    if (trigger) trigger.classList.add("is-hidden");
    const result = video.play();
    if (result && typeof result.catch === "function") result.catch(() => {});
  };
  if (trigger) trigger.addEventListener("click", start);
  video.addEventListener("click", () => {
    if (video.paused) start();
  });
}
