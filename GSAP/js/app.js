import { Slider } from "./components/slider.js";
import { Video } from "./components/video.js";
import { ProductDetails } from "./components/product-details.js";
import { ProductAI } from "./components/product-ai.js";

class App {
  components;
  refs = {};

  constructor() {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    this.createComponents();
    this.addEventListeners();
    this.onResize();
  }

  createComponents() {
    this.components = [];
    const slider = new Slider(".js-slider");
    const video = new Video(".js-video");

    video
      .setup()
      .then(() => {
        const productDetails = new ProductDetails(".js-product-details");
        const productAI = new ProductAI(".js-product-ai");
        this.components.push(slider, video, productDetails, productAI);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
  }

  onResize() {
    const windowWidth = window.innerWidth;
    const clientWidth = document.documentElement.clientWidth;
    const windowHeight = window.innerHeight;
    const clientHeight = document.documentElement.clientHeight;
    globalThis.requestAnimationFrame(() => {
      document.documentElement.style.setProperty(
        "--vw",
        0.01 * windowWidth + "px",
      );
      document.documentElement.style.setProperty(
        "--cw",
        0.01 * clientWidth + "px",
      );
      document.documentElement.style.setProperty(
        "--vh",
        0.01 * windowHeight + "px",
      );
      document.documentElement.style.setProperty(
        "--ch",
        0.01 * clientHeight + "px",
      );
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Keep a reference to avoid "no-new" lint and allow debugging.
  globalThis.app = new App();
});
