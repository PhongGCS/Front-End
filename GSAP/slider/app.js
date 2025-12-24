document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    // --- INTERPRETATION OF POSITIONS ---
    // Center Column (col 2): x: '0%', scale: 1
    // Left Column (col 1):   x: '-120%', scale: 0.5
    // Right Column (col 3):  x: '120%', scale: 0.5
    // Y positions are for stacking images in the side columns.

    // Set initial state
    gsap.set("#img1", { xPercent: -50, yPercent: -50, x: '0%', scale: 1, autoAlpha: 1 });
    gsap.set("#img2", { xPercent: -50, yPercent: -50, x: '120%', y: '-25%', scale: 0.5, autoAlpha: 1 });
    gsap.set("#img3", { xPercent: -50, yPercent: -50, x: '120%', y: '25%', scale: 0.5, autoAlpha: 1 });
    gsap.set("#img4", { xPercent: -50, yPercent: -50, x: '120%', autoAlpha: 0, scale: 0.5 });
    gsap.set("#img5", { xPercent: -50, yPercent: -50, x: '120%', autoAlpha: 0, scale: 0.5 });


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
        .to("#img1", { x: '-120%', y: '0%', scale: 0.5 }, "scroll1")
        .to("#img2", { x: '0%', y: '0%', scale: 1 }, "scroll1")
        .to("#img4", { autoAlpha: 1, y: '-25%' }, "scroll1");


    // Scroll 2: img2 -> left, img3 -> center, img1 moves up, img5 appears right
    tl.addLabel("scroll2")
        .to("#img1", { y: '-25%' }, "scroll2")
        .to("#img2", { x: '-120%', y: '25%', scale: 0.5 }, "scroll2")
        .to("#img3", { x: '0%', y: '0%', scale: 1 }, "scroll2")
        .to("#img5", { autoAlpha: 1, y: '25%' }, "scroll2");

    // Scroll 3: img3 -> left, img4 -> center, img2 moves down
    tl.addLabel("scroll3")
        // .to("#img2", { y: '50%', autoAlpha: 0 }, "scroll3") // Hiding an old image
        .to("#img3", { x: '-120%', y: '0%', scale: 0.5 }, "scroll3")
        .to("#img4", { x: '0%', y: '0%', scale: 1 }, "scroll3");

    // Scroll 4: img4 -> left, img5 -> center, img3 moves
    tl.addLabel("scroll4")
        // .to("#img3", { y: '-25%' }, "scroll4")
        .to("#img4", { x: '-120%', y: '25%', scale: 0.5 }, "scroll4")
        .to("#img5", { x: '0%', y: '0%', scale: 1 }, "scroll4");
        
    // Final state from user request: "chỉ còn hình 5 ở cột 2 còn hình 1 hiện 2 hình 3 và 4"
    // This animation step will arrange images 1, 3, 4 on the left and leave 5 in the center.
    tl.addLabel("finalArrange")
        .to("#img1", { y: '-50%', autoAlpha: 1 }, "finalArrange")
        .to("#img3", { y: '0%', autoAlpha: 1 }, "finalArrange")
        .to("#img4", { y: '50%', autoAlpha: 1 }, "finalArrange")
        .to("#img2", { autoAlpha: 0 }, "finalArrange"); // ensure img2 stays hidden

});
