import Component from "./index.js";

export class Video extends Component {
  video;
  videoSrc;
  duration = 0;
  timeline;
  objectUrl;

  constructor(el) {
    super(el);
    if (!this.el || !globalThis.gsap || !globalThis.ScrollTrigger) return;

    this.video = this.el.querySelector("video");
    if (!this.video) return;

    this.videoSrc = this.video.getAttribute("src");
  }

  async setup() {
    await this.initVideo();
    await this.cacheToBlob();
    this.handleReady();
  }

  async initVideo() {
    return new Promise((resolve) => {
      const onReady = () => resolve();

      // If metadata is already available, continue immediately.
      if (this.video.readyState >= 1 && this.video.duration) {
        resolve();
        return;
      }

      this.video.addEventListener("loadedmetadata", onReady, { once: true });
      if (!this.video.getAttribute("src")) {
        this.video.src = this.videoSrc;
      }
    });
  }

  async cacheToBlob() {
    // Skip if already blob cached or fetch unavailable.
    if (this.video.src.startsWith("blob:") || !globalThis.fetch) return;

    const t = this.video.currentTime || 0;
    const response = await fetch(this.videoSrc);
    const blob = await response.blob();
    this.objectUrl = URL.createObjectURL(blob);

    await new Promise((resolve) => {
      this.video.addEventListener("loadedmetadata", resolve, { once: true });
      this.video.src = this.objectUrl;
      // Nudge currentTime slightly to force ready state on some browsers.
      this.video.currentTime = t + 0.01;
    });
  }

  once(el, event, fn, opts) {
    const onceFn = (...args) => {
      el.removeEventListener(event, onceFn, opts);
      fn.apply(el, args);
    };
    el.addEventListener(event, onceFn, opts);
    return onceFn;
  }

  handleReady() {
    this.duration = this.video.duration || 0;
    if (!this.duration) {
      this.video.addEventListener("loadedmetadata", () => this.handleReady(), {
        once: true,
      });
      return;
    }

    // Ensure controlled by scrub, not native playback.
    this.video.pause();
    this.video.currentTime = 0;
    this.video.muted = true;
    this.video.playsInline = true;

    // iOS activation to allow programmatic seeking.
    this.once(document.documentElement, "touchstart", () => {
      this.video.play();
      this.video.pause();
    });

    this.createScrollScrub();
  }

  createScrollScrub() {
    this.timeline = gsap.timeline({ paused: true });
    this.timeline.to(
      this.video,
      { currentTime: this.duration, ease: "none" },
      0
    );

    ScrollTrigger.create({
      trigger: this.el,
      start: "top top",
      end: () => `+=${this.duration * 320}`,
      scrub: 1,
      pin: true,
      animation: this.timeline,
      onEnter: () => this.video.pause(),
      onEnterBack: () => this.video.pause(),
      onRefresh: () => this.video.pause(),
    });
  }
}
