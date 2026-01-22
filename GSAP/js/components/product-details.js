import Component from './index.js'

export class ProductDetails extends Component {
  section
  isInViewport
  timeline

  constructor(el) {
    super(el)
    if (!this.el || !globalThis.gsap || !globalThis.ScrollTrigger) return

    this.section = this.el

    this.init()
  }

  init() {
    const {
      sectionTitle,
      titleLeft,
      titleRight,
      titleText,
      wordMask,
      productDetailItems,
      productDetailItem
    } = this.refs

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.el,
        start: 'top 0%',
        end: '+=2000%',
        scrub: 1,
        pin: this.el
      }
    })

    gsap.set(sectionTitle, { y: "50lvh" })
    gsap.set(titleText, { opacity: 0 })
    gsap.set(wordMask, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(productDetailItems, { opacity: 0, y: "10%" })

    // intro
    tl.to(titleText, { opacity: 1, duration: 0 }, 1)
    tl.to(wordMask, { scaleX: 1, duration: 1, ease: 'power4.out', transformOrigin: 'left center' }, 0)
    tl.to(wordMask, { scaleX: 0, duration: 1, ease: 'power4.out', transformOrigin: 'right center' }, '>')
    tl.to(sectionTitle, { y: 0, duration: 1 }, ">")
    tl.to(titleLeft, { x: "-5%" }, "<")
    tl.to(titleRight, { x: "10%", y: "90%" }, "<")
    tl.to(productDetailItems, { opacity: 1 }, "-=0.2")

    // first item
    tl.to(sectionTitle, { fontSize: "48px" }, "+=2")
    tl.to(titleLeft, { x: 0 }, "<")
    tl.to(titleRight, { x: 0, y: 0 }, "<")
    tl.call(() => sectionTitle.classList.replace('h-2xl', 'h-xl'), null, ">")
    tl.eventCallback('onReverseComplete', () => sectionTitle.classList.replace('h-xl', 'h-2xl'))

    // product detail items
    const detailItems = Array.isArray(productDetailItem) ? productDetailItem : [productDetailItem].filter(Boolean)
    const detailSequence = detailItems.slice(1)

    detailSequence.forEach((detailItem, index) => {
      const tooltip = detailItem?.querySelector?.('.pd-tooltip')
      const tooltipPin = tooltip?.querySelector?.('.pd-tooltip__pin')
      const tooltipLine = tooltip?.querySelector?.('.pd-tooltip__line')
      const tooltipCard = detailItem?.querySelector?.('.pd-tooltip__card')

      gsap.set(tooltipPin, { scale: 0, opacity: 0, transformOrigin: 'center center' })
      gsap.set(tooltipLine, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(tooltipCard, { opacity: 0, y: 16 })

      tl.to(detailItem, { opacity: 1 }, `+=1`)
      tl.to(tooltipPin, { scale: 1, opacity: 1 }, ">")
      tl.to(tooltipLine, { scaleX: 1 }, ">")
      tl.to(tooltipCard, { opacity: 1, y: 0 }, ">")

      // exit
      tl.to(detailItem, { opacity: 0 }, "+=2")
      tl.to(tooltipPin, { scale: 0, opacity: 0 }, "<")
      tl.to(tooltipLine, { scaleX: 0 }, "<")
      tl.to(tooltipCard, { opacity: 0, y: 16 }, "<")
    })
  }
}
