import Component from "./index.js";

export class ProductAI extends Component {
  constructor(el) {
    super(el);
    if (!this.el) return;

    this.init();
  }

  init() {
    const { sectionImage, sectionBg, titleTop, titleBottom, contentItem } = this.refs;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.el,
        start: 'top 0%',
        end: '+=500%',
        scrub: 1,
        pin: this.el,
      }
    })

    gsap.set(sectionImage, { opacity: 0 })
    gsap.set(sectionBg, { opacity: 0 })
    gsap.set(titleTop, { scale: 10, top: "50%", y: "-50%" })
    gsap.set(titleBottom, {
      top: "calc(50% + 1.5em)",
      y: "-50%",
      color: "#fff",
      backgroundImage: "linear-gradient(to bottom, #fff, #019EDC)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "#fff",
    })
    gsap.set(titleBottom.children, { opacity: 0, y: "60%" })
    gsap.set(contentItem, { opacity: 0 })

    // title intro
    tl.to(titleTop, { scale: 1 }, 0)
    tl.to(titleBottom.children[0], { opacity: 1, y: 0 }, ">")
    tl.to(titleTop, { top: "calc(50% - 1em)" }, ">")
    tl.to(titleBottom, { top: "calc(50% + 0.5em)" }, "<")
    tl.to(titleBottom.children[2], { opacity: 1, y: 0 }, ">")

    // image intro
    tl.to(titleTop, { top: "15%", y: 0 }, ">")
    tl.to(titleBottom, { top: "35%", y: 0, color: "transparent", "webkitTextFillColor": "transparent" }, "<")
    tl.to(sectionBg, { opacity: 1 }, "<")
    tl.to(sectionImage, { opacity: 1 }, "<")

    // first content item enter

    if (globalThis.innerWidth <= 767) {
      tl.to(sectionImage, { height: "50%" }, ">2")
      gsap.set(contentItem, { top: "unset", bottom: "40px", left: 0 })
      tl.to(titleTop, { opacity: 0, y: "20%" }, "<")
      tl.to(titleBottom, { opacity: 0, y: "20%" }, "<")
    } else {
      tl.to(sectionImage, { width: "50%" }, ">2")
      tl.to(titleTop, {
        fontSize: "48px",
        top: contentItem[0].offsetTop,
        left: "50%",
        width: "50%",
      }, "<")
      tl.to(titleBottom, { opacity: 0, y: "20%" }, "<")
    }

    tl.set(titleTop, { fontSize: "clamp(24px, 4vw + 0px, 48px)" }, ">")
    tl.set(titleBottom, { fontSize: "clamp(24px, 4vw + 0px, 48px)" }, "<")
    tl.set(titleTop.children[1], { display: "inline" }, ">")
    tl.to(titleTop.children[1], { opacity: 1 }, ">")
    tl.set(contentItem[0], { opacity: 1 }, ">")
    tl.fromTo(contentItem[0].children, { opacity: 0, y: "1rem" }, { opacity: 1, y: 0, stagger: 0.3 }, ">")

    // first content item exit
    tl.to(titleTop, { y: "1rem", opacity: 0 }, ">2")
    tl.to(titleBottom, { y: "1rem", opacity: 0 }, "<")
    tl.to(contentItem[0].children, { opacity: 0, y: "1rem", stagger: 0.3 }, ">")
    tl.set(contentItem[0], { opacity: 0 }, ">")

    // other content items
    contentItem.slice(1).forEach((item, index) => {
      // enter
      tl.set(item, { opacity: 1 }, ">2")
      tl.fromTo(item.children, { opacity: 0, y: "1rem" }, { opacity: 1, y: 0, stagger: 0.3 }, ">")

      // exit
      if (index < contentItem.length - 2) {
        tl.to(item.children, { opacity: 0, y: "1rem", stagger: 0.3 }, ">2")
        tl.set(item, { opacity: 0 }, ">")
      }
    })
  }
}
