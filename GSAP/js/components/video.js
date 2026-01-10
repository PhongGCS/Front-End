import Component from "./index.js";

export class Video extends Component {
  video;
  videoSrc;
  contents;
  contentSegments = [];
  duration = 0;
  timeline;
  objectUrl;
  activated = false;
  readyMarked = false;

  constructor(el) {
    super(el);
    if (!this.el || !globalThis.gsap || !globalThis.ScrollTrigger) return;

    this.video = this.el.querySelector("video");
    if (!this.video) return;

    this.videoSrc = this.video.getAttribute("src");
    this.contents = this.refs.content;
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
    this.video.setAttribute("playsinline", "");
    this.video.setAttribute("webkit-playsinline", "");
    this.video.disableRemotePlayback = true;

    // iOS activation to allow programmatic seeking.
    this.once(document.documentElement, "touchstart", () => {
      this.tryActivate();
    });
    this.once(document.documentElement, "pointerdown", () => {
      this.tryActivate();
    });

    this.createScrollScrub();
    this.prepareContentSegments();
    this.markReady();
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
      onEnter: () => {
        this.tryActivate();
        this.video.pause();
      },
      onEnterBack: () => {
        this.tryActivate();
        this.video.pause();
      },
      onRefresh: () => this.video.pause(),
      onUpdate: (self) => this.syncContent(self.progress),
    });
  }

  prepareContentSegments() {
    const items = Array.isArray(this.contents)
      ? this.contents
      : [this.contents].filter(Boolean);
    if (!items.length) return;
    const segmentCount = items.length;
    this.contentSegments = [];
    for (let i = 0; i < segmentCount; i++) {
      this.contentSegments.push({
        el: items[i],
        start: i / segmentCount,
        end: (i + 1) / segmentCount,
      });
      // hide all initially
      gsap.set(items[i], { opacity: 0, pointerEvents: "none" });
    }
  }

  syncContent(progress) {
    if (!this.contentSegments.length) return;
    // find current segment by progress
    const active = this.contentSegments.find(
      (seg) => progress >= seg.start && progress < seg.end
    );
    this.contentSegments.forEach((seg) => {
      const visible = seg === active;
      gsap.to(seg.el, {
        opacity: visible ? 1 : 0,
        duration: visible ? 0.3 : 0.2,
        ease: "power1.out",
        overwrite: true,
      });
      gsap.set(seg.el, { pointerEvents: visible ? "auto" : "none" });
    });
  }

  tryActivate() {
    if (this.activated) return;
    this.activated = true;
    // Play/pause to unlock currentTime updates on iOS.
    const p = this.video.play();
    if (p && typeof p.then === "function") {
      p.then(() => this.video.pause()).catch(() => {});
    } else {
      this.video.pause();
    }
  }

  markReady() {
    if (this.readyMarked) return;
    this.readyMarked = true;
    document.documentElement.classList.remove("is-loading");
    const loader = document.getElementById("page-loader");
    if (loader) loader.style.display = "none";
  }
}
