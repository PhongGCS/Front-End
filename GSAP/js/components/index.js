export default class Component {
  el;
  refs = {};
  toRevert = [];

  constructor(el) {
    gsap.registerPlugin(ScrollTrigger);
    this.el = document.querySelector(el);
    this.getRefs();

    console.log(this.refs);
  }

  getRefs() {
    document.querySelectorAll('[class*="js-"]').forEach((el) => {
      const component = el.closest("[data-component]");
      if (component && component !== el && component !== this.el) return;

      const jsClass = Array.from(el.classList).find((c) => c.startsWith("js-"));
      if (!jsClass) return;

      const key = this.toCamelCase(jsClass.replace("js-", ""));

      if (this.refs[key]) {
        if (!Array.isArray(this.refs[key])) {
          this.refs[key] = [this.refs[key]];
        }
        this.refs[key].push(el);
      } else {
        this.refs[key] = el;
      }
    });
  }

  toCamelCase(str) {
    return str
      .split(/[\W_]+/)
      .filter(Boolean)
      .map((part, index) =>
        index === 0
          ? part.toLowerCase()
          : part[0].toUpperCase() + part.slice(1),
      )
      .join("");
  }
}
