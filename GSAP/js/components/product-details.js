import Component from "./index.js";

export class ProductDetails extends Component {
  detailSequence;
  isMobile;

  constructor(el) {
    super(el);
    if (!this.el || !globalThis.gsap || !globalThis.ScrollTrigger) return;

    this.isMobile = globalThis.innerWidth <= 767;
    this.init();
    this.setupTooltipLines();
  }

  init() {
    const {
      sectionTitle,
      titleLeft,
      titleRight,
      titleText,
      wordMask,
      productDetailItems,
      productDetailItem,
    } = this.refs;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.el,
        start: "top 0%",
        end: "+=2000%",
        scrub: 1,
        pin: this.el,
        onUpdate: () => this.scheduleTooltipUpdate?.("scroll"),
      },
    });

    gsap.set(sectionTitle, { y: "40lvh" });
    gsap.set(titleText, { opacity: 0 });
    gsap.set(wordMask, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(productDetailItems, { opacity: 0 });
    if (!this.isMobile) {
      gsap.set(productDetailItems, { y: "10%" });
    }

    // intro
    tl.to(titleText, { opacity: 1, duration: 0 }, 1);
    tl.to(
      wordMask,
      {
        scaleX: 1,
        duration: 1,
        ease: "power4.out",
        transformOrigin: "left center",
      },
      0,
    );
    tl.to(
      wordMask,
      {
        scaleX: 0,
        duration: 1,
        ease: "power4.out",
        transformOrigin: "right center",
      },
      ">",
    );
    tl.to(sectionTitle, { y: 0, duration: 1 }, ">");
    tl.to(titleLeft, { x: this.isMobile ? "10%" : "-5%" }, "<");
    tl.to(
      titleRight,
      { x: this.isMobile ? "-10%" : "10%", y: this.isMobile ? "100%" : "90%" },
      "<",
    );
    tl.to(productDetailItems, { opacity: 1 }, "-=0.2");

    // first item
    tl.to(sectionTitle, { fontSize: "clamp(24px, 4vw + 0px, 48px)" }, ">2");
    tl.to(titleLeft, { x: 0 }, "<");
    tl.to(titleRight, { x: 0, y: 0 }, "<");
    tl.call(() => sectionTitle.classList.replace("h-2xl", "h-xl"), null, ">");
    tl.eventCallback("onReverseComplete", () =>
      sectionTitle.classList.replace("h-xl", "h-2xl"),
    );

    // product detail items
    const detailItems = Array.isArray(productDetailItem)
      ? productDetailItem
      : [productDetailItem].filter(Boolean);
    this.detailSequence = detailItems.slice(1);

    this.detailSequence.forEach((detailItem, index) => {
      const tooltip = detailItem?.querySelector?.(".pd-tooltip");
      const tooltipPin = tooltip?.querySelector?.(".pd-tooltip__pin");
      const tooltipLine = tooltip?.querySelector?.(".pd-tooltip__line");
      const tooltipCard = detailItem?.querySelector?.(".pd-tooltip__card");

      gsap.set(tooltipPin, {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
      });
      gsap.set(tooltipLine, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(tooltipCard, { opacity: 0, y: 16 });

      // enter
      tl.to(detailItem, { opacity: 1 }, `>1`);
      tl.to(tooltipPin, { scale: 1, opacity: 1 }, ">");
      tl.to(tooltipLine, { scaleX: 1 }, ">");
      tl.to(tooltipCard, { opacity: 1, y: 0 }, ">");

      // exit
      tl.to(tooltipPin, { scale: 0, opacity: 0 }, ">2");
      tl.to(tooltipLine, { scaleX: 0 }, "<");
      tl.to(tooltipCard, { opacity: 0, y: 16 }, "<");
      tl.to(detailItem, { opacity: 0 }, ">");
    });
  }

  updateTooltipLine(detailItem) {
    const tooltip = detailItem?.querySelector?.(".pd-tooltip");
    const tooltipLine = tooltip?.querySelector?.(".pd-tooltip__line");
    const tooltipCard = detailItem?.querySelector?.(".pd-tooltip__card");
    const tooltipPin = tooltip?.querySelector?.(".pd-tooltip__pin");

    if (!tooltip || !tooltipLine || !tooltipCard || !tooltipPin) return;

    const tooltipRect = tooltip.getBoundingClientRect();
    const pinRect = tooltipPin.getBoundingClientRect();
    const cardRect = tooltipCard.getBoundingClientRect();
    const computed = globalThis.getComputedStyle(tooltip);
    const angleValue = computed.getPropertyValue("--line-angle").trim();
    const angleDeg = angleValue.endsWith("deg")
      ? Number.parseFloat(angleValue)
      : 0;
    const angleRad = (angleDeg * Math.PI) / 180;

    const pinXVar = computed.getPropertyValue("--pin-x").trim();
    const pinYVar = computed.getPropertyValue("--pin-y").trim();
    const resolvePinCoord = (value, size) => {
      if (!value) return null;
      if (value.endsWith("%")) {
        const pct = Number.parseFloat(value);
        return Number.isFinite(pct) ? (pct / 100) * size : null;
      }
      if (value.endsWith("px")) {
        const px = Number.parseFloat(value);
        return Number.isFinite(px) ? px : null;
      }
      const raw = Number.parseFloat(value);
      return Number.isFinite(raw) ? raw : null;
    };
    const pinXFromVar = resolvePinCoord(pinXVar, tooltipRect.width);
    const pinYFromVar = resolvePinCoord(pinYVar, tooltipRect.height);
    const usePinVars =
      Number.isFinite(pinXFromVar) && Number.isFinite(pinYFromVar);

    // Pin center in tooltip-local coordinates
    const xP = usePinVars
      ? pinXFromVar
      : pinRect.left + pinRect.width / 2 - tooltipRect.left;
    const yP = usePinVars
      ? pinYFromVar
      : pinRect.top + pinRect.height / 2 - tooltipRect.top;
    // Card bounds in tooltip-local coordinates
    const xL = cardRect.left - tooltipRect.left;
    const xR = cardRect.right - tooltipRect.left;
    const yT = cardRect.top - tooltipRect.top;
    const yB = cardRect.bottom - tooltipRect.top;
    // Ray direction vector derived from the tooltip angle
    const dx = Math.cos(angleRad);
    const dy = Math.sin(angleRad);

    // Smallest positive intersection distance from the pin to the card along the ray
    let tMin = Number.POSITIVE_INFINITY;
    let hitCount = 0;
    // Accept intersections that land on the card bounds
    const tryHit = (t, x, y) => {
      if (t >= 0 && x >= xL && x <= xR && y >= yT && y <= yB) {
        tMin = Math.min(tMin, t);
        hitCount += 1;
      }
    };

    // Intersect the ray with the vertical sides (x = xL / xR)
    if (dx !== 0) {
      let t = (xL - xP) / dx;
      tryHit(t, xL, yP + t * dy);
      t = (xR - xP) / dx;
      tryHit(t, xR, yP + t * dy);
    }

    // Intersect the ray with the horizontal sides (y = yT / yB)
    if (dy !== 0) {
      let t = (yT - yP) / dy;
      tryHit(t, xP + t * dx, yT);
      t = (yB - yP) / dy;
      tryHit(t, xP + t * dx, yB);
    }

    if (Number.isFinite(tMin)) {
      tooltip.style.setProperty("--line-length", `${tMin}px`);
    } else {
      // Fallback: aim directly at the nearest point on the card
      const xTarget = Math.min(Math.max(xP, xL), xR);
      const yTarget = Math.min(Math.max(yP, yT), yB);
      const dxTarget = xTarget - xP;
      const dyTarget = yTarget - yP;
      const fallbackLen = Math.hypot(dxTarget, dyTarget);
      const fallbackAngle = Math.atan2(dyTarget, dxTarget) * (180 / Math.PI);

      tooltip.style.setProperty("--line-length", `${fallbackLen}px`);
      tooltip.style.setProperty("--line-angle", `${fallbackAngle}deg`);
    }
  }

  updateTooltipLines() {
    this.detailSequence?.forEach((detailItem) =>
      this.updateTooltipLine(detailItem),
    );
  }

  setupTooltipLines() {
    this.scheduleTooltipUpdate = () => {
      globalThis.requestAnimationFrame(() => {
        this.updateTooltipLines();
        // Run a second frame to catch late layout shifts (fonts/images)
        globalThis.requestAnimationFrame(() => this.updateTooltipLines());
      });
    };

    this.scheduleTooltipUpdate();
    globalThis.addEventListener("resize", () => this.scheduleTooltipUpdate());
    ScrollTrigger.addEventListener("refresh", () =>
      this.scheduleTooltipUpdate(),
    );
    globalThis.addEventListener("load", () => this.scheduleTooltipUpdate());

    const detailItems = this.detailSequence || [];
    detailItems.forEach((detailItem) => {
      const img = detailItem?.querySelector?.("img");
      if (!img) return;
      if (img.complete) {
        this.scheduleTooltipUpdate();
        return;
      }
      img.addEventListener("load", () => this.scheduleTooltipUpdate(), {
        once: true,
      });
      img.addEventListener("error", () => this.scheduleTooltipUpdate(), {
        once: true,
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Keep a reference to avoid "no-new" lint and allow debugging.
  globalThis.productDetails = new ProductDetails(".js-product-details");
});
