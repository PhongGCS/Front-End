import { splitTextLines } from "../utils/splitText.js";
import Component from "./index.js";
/**
 * Scroll-driven slider inspired by the SProjectsFeatured controller.
 * Animates stacked items through a GSAP timeline with ScrollTrigger.
 */
export class Slider extends Component {
  items;
  itemsProgress;
  timeline;

  constructor(el) {
    super(el);
    if (!this.el || !globalThis.gsap || !globalThis.ScrollTrigger) return;

    this.items = Array.from(this.el.querySelectorAll(".slider-item"));
    if (!this.items.length) return;

    // Keep CSS height in sync with item count.
    this.el.style.setProperty("--item-count", this.items.length);

    this.createTimeline();
    // Rebuild animations when the layout changes.
    ScrollTrigger.addEventListener("refreshInit", () => {
      this.createTimeline();
    });
  }

  createTimeline() {
    const sliderItemEls = Array.from(this.refs.sliderItem);
    const { sectionTitle, titleHeading, titleText, titleTextHidden } = this.refs;

    const n = 1 + sliderItemEls.length;
    this.toRevert?.forEach((e) => {
      e.revert();
    });
    this.toRevert = [];
    this.timelines = [];

    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionTitle,
        start: "top 50%",
        end: "+=100%",
        scrub: 1,
      },
    });

    gsap.set(sectionTitle, { y: "-250%" });
    gsap.set(titleHeading, { fontSize: "clamp(30px, 6.5vw, 96px)" });
    gsap.set(titleText[0], { x: "25%", y: "-50%" });
    gsap.set(titleText[1], { x: "-35%", y: "50%" });

    titleTl.to(sectionTitle, { y: "48px", duration: 1 });
    titleTl.to(titleText[0], { x: "0%", y: "0%" }, "<");
    titleTl.to(titleText[1], { x: "0%", y: "0%" }, "<");
    titleTl.to(titleTextHidden, { opacity: 1, width: "auto", display: "inline-block", duration: 1 }, "<");
    titleTl.to(titleHeading, { fontSize: "clamp(24px, 6.5vw, 48px)" }, "<");

    titleTl.set(titleHeading, { fontSize: "clamp(24px, 4vw, 48px)" });

    const sliderTl = gsap.timeline({
      scrollTrigger: {
        trigger: this.el,
        start: "top 70%",
        end: "bottom 50%",
        scrub: 1,
      },
    });


    if (sliderItemEls.length > 0) {
      const itemWidth = sliderItemEls[0].offsetWidth;
      const itemHeight = sliderItemEls[0].offsetHeight;
      const o =
        "polygon(98.533% 50.1%,52.405% 50.1%,52.328% 50.1%,52.328% 50.1%,52.311% 50.1%,52.263% 50.1%,52.188% 50.1%,52.089% 50.1%,51.971% 50.1%,51.838% 50.1%,51.693% 50.1%,51.541% 50.1%,51.386% 50.1%,51.231% 50.1%,51.231% 50.1%,51.081% 50.1%,50.944% 50.1%,50.817% 50.1%,50.698% 50.1%,50.584% 50.1%,50.471% 50.1%,50.359% 50.1%,50.244% 50.1%,50.123% 50.1%,49.994% 50.1%,49.994% 50.1%,49.871% 50.1%,49.755% 50.1%,49.643% 50.1%,49.533% 50.1%,49.423% 50.1%,49.31% 50.1%,49.193% 50.1%,49.07% 50.1%,48.938% 50.1%,48.795% 50.1%,48.795% 50.1%,48.638% 50.1%,48.484% 50.1%,48.335% 50.1%,48.196% 50.1%,48.069% 50.1%,47.958% 50.1%,47.866% 50.1%,47.796% 50.1%,47.751% 50.1%,47.736% 50.1%,47.455% 50.1%,1.48% 50.1%,1.48% 50.1%,1.24% 50.1%,1.012% 50.1%,0.8% 50.1%,0.606% 50.1%,0.434% 50.1%,0.286% 50.1%,0.165% 50.1%,0.076% 50.1%,0.019% 50.1%,0% 50.1%,0% 50.1%,0% 50.1%,0.019% 50.1%,0.076% 50.1%,0.165% 50.1%,0.286% 50.1%,0.434% 50.1%,0.606% 50.1%,0.8% 50.1%,1.012% 50.1%,1.24% 50.1%,1.48% 50.1%,47.608% 50.1%,47.685% 50.1%,47.685% 50.1%,47.702% 50.1%,47.751% 50.1%,47.828% 50.1%,47.928% 50.1%,48.047% 50.1%,48.181% 50.1%,48.325% 50.1%,48.477% 50.1%,48.63% 50.1%,48.782% 50.1%,48.782% 50.1%,48.928% 50.1%,49.062% 50.1%,49.186% 50.1%,49.303% 50.1%,49.415% 50.1%,49.524% 50.1%,49.633% 50.1%,49.744% 50.1%,49.859% 50.1%,49.981% 50.1%,49.981% 50.1%,50.11% 50.1%,50.231% 50.1%,50.346% 50.1%,50.459% 50.1%,50.571% 50.1%,50.685% 50.1%,50.805% 50.1%,50.932% 50.1%,51.069% 50.1%,51.218% 50.1%,51.218% 50.1%,51.37% 50.1%,51.523% 50.1%,51.675% 50.1%,51.819% 50.1%,51.953% 50.1%,52.072% 50.1%,52.172% 50.1%,52.249% 50.1%,52.298% 50.1%,52.315% 50.1%,52.43% 50.1%,98.52% 50.1%,98.52% 50.1%,98.76% 50.1%,98.988% 50.1%,99.2% 50.1%,99.394% 50.1%,99.566% 50.1%,99.714% 50.1%,99.835% 50.1%,99.924% 50.1%,99.981% 50.1%,100% 50.1%,100% 50.1%,100% 50.1%,99.981% 50.1%,99.924% 50.1%,99.835% 50.1%,99.714% 50.1%,99.566% 50.1%,99.394% 50.1%,99.2% 50.1%,98.988% 50.1%,98.76% 50.1%,98.52% 50.1%,98.533% 50.1%)";
      const i =
        "polygon(98.533% 0.001%,52.405% 0.001%,52.328% 0.001%,52.328% 0.001%,52.311% 0%,52.263% 0.003%,52.188% 0.016%,52.089% 0.048%,51.971% 0.105%,51.838% 0.195%,51.693% 0.327%,51.541% 0.506%,51.386% 0.74%,51.231% 1.037%,51.231% 1.037%,51.081% 1.338%,50.944% 1.581%,50.817% 1.772%,50.698% 1.919%,50.584% 2.026%,50.471% 2.1%,50.359% 2.147%,50.244% 2.173%,50.123% 2.184%,49.994% 2.186%,49.994% 2.186%,49.871% 2.183%,49.755% 2.169%,49.643% 2.138%,49.533% 2.087%,49.423% 2.009%,49.31% 1.899%,49.193% 1.753%,49.07% 1.563%,48.938% 1.327%,48.795% 1.037%,48.795% 1.037%,48.638% 0.74%,48.484% 0.506%,48.335% 0.327%,48.196% 0.195%,48.069% 0.105%,47.958% 0.048%,47.866% 0.016%,47.796% 0.003%,47.751% 0%,47.736% 0.001%,47.455% 0.001%,1.48% 0.001%,1.48% 0.001%,1.24% 0.035%,1.012% 0.134%,0.8% 0.293%,0.606% 0.506%,0.434% 0.767%,0.286% 1.072%,0.165% 1.414%,0.076% 1.789%,0.019% 2.191%,0% 2.615%,0% 97.386%,0% 97.386%,0.019% 97.81%,0.076% 98.212%,0.165% 98.587%,0.286% 98.929%,0.434% 99.234%,0.606% 99.495%,0.8% 99.708%,1.012% 99.867%,1.24% 99.966%,1.48% 100%,47.608% 100%,47.685% 100%,47.685% 100%,47.702% 100.001%,47.751% 99.999%,47.828% 99.986%,47.928% 99.956%,48.047% 99.901%,48.181% 99.815%,48.325% 99.69%,48.477% 99.518%,48.63% 99.294%,48.782% 99.009%,48.782% 99.009%,48.928% 98.719%,49.062% 98.483%,49.186% 98.293%,49.303% 98.147%,49.415% 98.037%,49.524% 97.959%,49.633% 97.908%,49.744% 97.877%,49.859% 97.863%,49.981% 97.859%,49.981% 97.859%,50.11% 97.862%,50.231% 97.875%,50.346% 97.903%,50.459% 97.952%,50.571% 98.028%,50.685% 98.137%,50.805% 98.283%,50.932% 98.474%,51.069% 98.714%,51.218% 99.009%,51.218% 99.009%,51.37% 99.294%,51.523% 99.518%,51.675% 99.69%,51.819% 99.815%,51.953% 99.901%,52.072% 99.956%,52.172% 99.986%,52.249% 99.999%,52.298% 100.001%,52.315% 100%,52.43% 100%,98.52% 100%,98.52% 100%,98.76% 99.966%,98.988% 99.867%,99.2% 99.708%,99.394% 99.495%,99.566% 99.234%,99.714% 98.929%,99.835% 98.587%,99.924% 98.212%,99.981% 97.81%,100% 97.386%,100% 2.615%,100% 2.615%,99.981% 2.191%,99.924% 1.789%,99.835% 1.414%,99.714% 1.072%,99.566% 0.767%,99.394% 0.506%,99.2% 0.293%,98.988% 0.134%,98.76% 0.035%,98.52% 0.001%,98.533% 0.001%)";
      const s =
        "polygon(98.533% 0%,52.405% 0%,52.328% 0%,52.328% 0%,52.311% 0%,52.263% 0%,52.188% 0%,52.089% 0%,51.971% 0%,51.838% 0%,51.693% 0%,51.541% 0%,51.386% 0%,51.231% 0%,51.231% 0%,51.081% 0%,50.944% 0%,50.817% 0%,50.698% 0%,50.584% 0%,50.471% 0%,50.359% 0%,50.244% 0%,50.123% 0%,49.994% 0%,49.994% 0%,49.871% 0%,49.755% 0%,49.643% 0%,49.533% 0%,49.423% 0%,49.31% 0%,49.193% 0%,49.07% 0%,48.938% 0%,48.795% 0%,48.795% 0%,48.638% 0%,48.484% 0%,48.335% 0%,48.196% 0%,48.069% 0%,47.958% 0%,47.866% 0%,47.796% 0%,47.751% 0%,47.736% 0%,47.455% 0%,1.48% 0.001%,1.48% 0.001%,1.24% 0.035%,1.012% 0.134%,0.8% 0.293%,0.606% 0.506%,0.434% 0.767%,0.286% 1.072%,0.165% 1.414%,0.076% 1.789%,0.019% 2.191%,0% 2.615%,0% 97.386%,0% 97.386%,0.019% 97.81%,0.076% 98.212%,0.165% 98.587%,0.286% 98.929%,0.434% 99.234%,0.606% 99.495%,0.8% 99.708%,1.012% 99.867%,1.24% 99.966%,1.48% 100%,47.608% 100%,47.685% 100%,47.685% 100%,47.702% 100%,47.751% 100%,47.828% 100%,47.928% 100%,48.047% 100%,48.181% 100%,48.325% 100%,48.477% 100%,48.63% 100%,48.782% 100%,48.782% 100%,48.928% 100%,49.062% 100%,49.186% 100%,49.303% 100%,49.415% 100%,49.524% 100%,49.633% 100%,49.744% 100%,49.859% 100%,49.981% 100%,49.981% 100%,50.11% 100%,50.231% 100%,50.346% 100%,50.459% 100%,50.571% 100%,50.685% 100%,50.805% 100%,50.932% 100%,51.069% 100%,51.218% 100%,51.218% 100%,51.37% 100%,51.523% 100%,51.675% 100%,51.819% 100%,51.953% 100%,52.072% 100%,52.172% 100%,52.249% 100%,52.298% 100%,52.315% 100%,52.43% 100%,98.52% 100%,98.52% 100%,98.76% 99.966%,98.988% 99.867%,99.2% 99.708%,99.394% 99.495%,99.566% 99.234%,99.714% 98.929%,99.835% 98.587%,99.924% 98.212%,99.981% 97.81%,100% 97.386%,100% 2.615%,100% 2.615%,99.981% 2.191%,99.924% 1.789%,99.835% 1.414%,99.714% 1.072%,99.566% 0.767%,99.394% 0.506%,99.2% 0.293%,98.988% 0.134%,98.76% 0.035%,98.52% 0.001%,98.533% 0.001%)";

      const animateFirstSlide = ({
        item,
        itemMedia,
        titleLines,
        titleNumber,
        enterAt,
        centerAt,
      }) => {
        sliderTl.fromTo(
          item,
          { scale: 0.75, clipPath: o },
          { scale: 1, clipPath: i, duration: 0.32, ease: "expo.out" },
          enterAt
        );

        if (itemMedia) {
          sliderTl.fromTo(
            itemMedia,
            { scale: 1.2 },
            { scale: 1, duration: 1, ease: "expo.out" },
            enterAt
          );
        }

        sliderTl.fromTo(
          titleLines,
          { y: "100%" },
          { y: "0%", duration: 0.48, ease: "expo.out" },
          centerAt + 0.4
        );

        sliderTl.fromTo(
          titleNumber,
          { opacity: 0, y: "50%" },
          { opacity: 1, y: "0%", duration: 0.48, ease: "expo.out" },
          centerAt + 0.48
        );
      };

      const animateCenteredSlide = ({
        item,
        itemMedia,
        titleLines,
        itemTitleNumber,
        enterAt,
        centerAt,
        parkedScale,
      }) => {
        sliderTl.fromTo(
          item,
          {
            opacity: 0,
            x: 0.8 * itemWidth,
            y: 0.25 * itemHeight * (centerAt % 2 === 0 ? 1 : -1),
            scale: parkedScale,
            clipPath: o,
          },
          {
            opacity: 1,
            x: 0.75 * itemWidth,
            y: 0.25 * itemHeight * (centerAt % 2 === 0 ? 1 : -1),
            scale: parkedScale,
            clipPath: s,
            duration: centerAt - enterAt,
            ease: "power4.out",
          },
          enterAt
        );

        sliderTl.set(item, { zIndex: 1 }, centerAt);
        sliderTl.set(item, { zIndex: 2 }, centerAt);

        sliderTl.to(item, { x: 0, y: 0, duration: 1, ease: "expo.inOut" }, centerAt);

        sliderTl.to(item, { scale: 1, duration: 1, ease: "expo.inOut" }, centerAt);

        sliderTl.to(item, { clipPath: i, duration: 1, ease: "expo.inOut" }, centerAt);

        if (itemMedia) {
          sliderTl.fromTo(
            itemMedia,
            { scale: 1.2 },
            { scale: 1, duration: 1, ease: "expo.out" },
            centerAt + 0.4
          );
        }

        sliderTl.fromTo(
          titleLines,
          { y: "100%" },
          { y: "0%", duration: 0.48, ease: "expo.out" },
          centerAt + 0.5
        );

        sliderTl.fromTo(
          itemTitleNumber,
          { opacity: 0, y: "50%" },
          { opacity: 1, y: "0%", duration: 0.4, ease: "expo.out" },
          centerAt + 0.5
        );
      };

      const animateExit = ({
        item,
        itemMedia,
        titleLines,
        itemTitleNumber,
        exitAt,
        exitScale,
        index,
      }) => {
        sliderTl.to(
          item,
          {
            scale: exitScale,
            x: -0.75 * itemWidth,
            y: 0.25 * itemHeight * (index % 2 === 0 ? -1 : 1),
            duration: 1,
            ease: "expo.inOut",
          },
          exitAt
        );

        sliderTl.to(item, { clipPath: s, duration: 1, ease: "expo.inOut" }, exitAt);

        if (itemMedia) {
          sliderTl.fromTo(
            itemMedia,
            { scale: 1 },
            { scale: 1.2, duration: 1, ease: "expo.out", immediateRender: !1 },
            exitAt + 0.4
          );
        }

        sliderTl.to(
          titleLines,
          { y: "100%", duration: 0.48, ease: "expo.in" },
          exitAt + 0.12
        );

        sliderTl.to(
          itemTitleNumber,
          { opacity: 0, y: "50%", duration: 0.4, ease: "expo.in" },
          exitAt + 0.12
        );
      };

      const animateCleanup = ({ item, cleanupAt, exitScale }) => {
        sliderTl.to(
          item,
          { scale: exitScale, opacity: 0, duration: 1, ease: "power4.inOut" },
          cleanupAt
        );
      };

      sliderItemEls.forEach((item, index) => {
        const itemMedia = item.querySelector(".js-media");
        const itemTitleNumber = item.querySelector(".js-title-number");
        const titleLines = splitTextLines(
          item.querySelector(".js-title-text"),
          { useMask: true }
        );

        const enterAt = index <= 2 ? 0.24 + 0.08 * index : 0.24 + index - 2;
        const centerAt = index;
        const exitAt = index + 1;
        const cleanupAt = index + 3;
        const parkedScale = index % 2 ? 0.37 : 0.3;
        const exitScale = index % 2 ? 0.37 : 0.3;

        if (index === 0) {
          animateFirstSlide({
            item,
            itemMedia,
            titleLines,
            titleNumber: itemTitleNumber,
            enterAt,
            centerAt,
          });
        } else {
          animateCenteredSlide({
            item,
            itemMedia,
            titleLines,
            itemTitleNumber,
            enterAt,
            centerAt,
            parkedScale,
          });
        }

        if (index < sliderItemEls.length - 1) {
          animateExit({
            item,
            itemMedia,
            titleLines,
            itemTitleNumber,
            exitAt,
            exitScale,
            index,
          });
        }

        if (index < sliderItemEls.length - 3) {
          animateCleanup({ item, cleanupAt, exitScale });
        }
      });
    }

    sliderTl.to(sectionTitle, { opacity: 0, duration: 0.5 }, ">");

    sliderTl.call(() => { }, [], n);
    this.toRevert = [sliderTl];
    this.timelines.push(sliderTl);
  }
}
