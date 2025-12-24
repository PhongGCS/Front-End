document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    // --- INTERPRETATION OF POSITIONS ---
    // Center Column (col 2): x: '0%', scale: 1
    // Left Column (col 1):   x: '-120%', scale: 0.5
    // Right Column (col 3):  x: '120%', scale: 0.5
    // Y positions are for stacking images in the side columns.

    // Set initial state
    gsap.set("#img1", { xPercent: -50, yPercent: -50, x: '0%', scale: 1, autoAlpha: 1, force3D: true });
    gsap.set("#img2", { xPercent: -50, yPercent: -50, x: '120%', y: '-25%', scale: 0.5, autoAlpha: 1, force3D: true });
    gsap.set("#img3", { xPercent: -50, yPercent: -50, x: '120%', y: '25%', scale: 0.5, autoAlpha: 1, force3D: true });
    gsap.set("#img4", { xPercent: -50, yPercent: -50, x: '120%', autoAlpha: 0, scale: 0.5, force3D: true });
    gsap.set("#img5", { xPercent: -50, yPercent: -50, x: '120%', autoAlpha: 0, scale: 0.5, force3D: true });


    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".section-two",
            pin: true,
            start: "top top",
            end: "+=4000", // Duration of the scroll animation
            scrub: 1, // Smoothly syncs with scroll
        }
    });

    // --- ANIMATION SEQUENCE ---

    // Scroll 1: img1 -> left, img2 -> center, img4 appears right
    tl.addLabel("scroll1")
        .to("#img1", { x: '-120%', y: '0%', scale: 0.5, force3D: true }, "scroll1")
        .to("#img2", { x: '0%', y: '0%', scale: 1, force3D: true }, "scroll1")
        .to("#img4", { autoAlpha: 1, y: '-25%', force3D: true }, "scroll1");


    // Scroll 2: img2 -> left, img3 -> center, img1 moves up, img5 appears right
    tl.addLabel("scroll2")
        .to("#img1", { y: '-25%', force3D: true }, "scroll2")
        .to("#img2", { x: '-120%', y: '25%', scale: 0.5, force3D: true }, "scroll2")
        .to("#img3", { x: '0%', y: '0%', scale: 1, force3D: true }, "scroll2")
        .to("#img5", { autoAlpha: 1, y: '25%', force3D: true }, "scroll2");

    // Scroll 3: img3 replaces img1 on the left, img4 to center.
    tl.addLabel("scroll3")
        .to("#img1", { autoAlpha: 0, force3D: true }, "scroll3") // img1 fades out
        .to("#img2", { y: '0%', force3D: true }, "scroll3") // img2 moves up to center-left
        .to("#img3", { x: '-120%', y: '-25%', scale: 0.5, force3D: true }, "scroll3") // img3 takes top-left spot
        .to("#img4", { x: '0%', y: '0%', scale: 1, force3D: true }, "scroll3");

    // Scroll 4: img4 replaces img2 on the left, img5 to center.
    tl.addLabel("scroll4")
        .to("#img2", { autoAlpha: 0, force3D: true }, "scroll4") // img2 fades out
        .to("#img3", { y: '25%', force3D: true }, "scroll4") // img3 moves to bottom-left
        .to("#img4", { x: '-120%', y: '-25%', scale: 0.5, force3D: true }, "scroll4") // img4 takes top-left spot
        .to("#img5", { x: '0%', y: '0%', scale: 1, force3D: true }, "scroll4");
        
    // Final state: img5 is in the center. img3 and img4 are visible on the left.
    tl.addLabel("finalArrange")
        .to("#img1", { autoAlpha: 0 }, "finalArrange")
        .to("#img2", { autoAlpha: 0 }, "finalArrange")
        .to("#img3", { autoAlpha: 1 }, "finalArrange")
        .to("#img4", { autoAlpha: 1 }, "finalArrange");


});