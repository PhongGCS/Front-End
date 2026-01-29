document.addEventListener('DOMContentLoaded', function () {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const videoSection = document.querySelector('.video-section-heka');
    if (!videoSection) return;

    const video = videoSection.querySelector('.video-heka');
    const videoSrc = videoSection.querySelector('.video-section-heka-src').dataset.hlsUrl;
    const contentItems = document.querySelectorAll('.video-js-content');
    if (!video || !videoSrc) return;

    // --- CẤU HÌNH ---
    const NUM_SEGMENTS = 7;
    const DURATION_POINTS = [0, 3.5, 7.5, 11, 14, 19, 21, 25];
    // --- STATE ---
    let currentIndex = -1; 
    let isAnimating = false;
    let isLocked = false;

    // --- HLS INIT ---
    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
    }

    const smoothWrapper = document.querySelector('#smooth-wrapper');
    const smoothContent = document.querySelector('#smooth-content');
    const smoother = (typeof ScrollSmoother !== 'undefined' && smoothWrapper && smoothContent)
        ? ScrollSmoother.create({
            wrapper: '#smooth-wrapper',
            content: '#smooth-content',
            smooth: 0.8,
            effects: false,
            normalizeScroll: true
        })
        : null;

    function setScrollLock(locked) {
        if (smoother) smoother.paused(locked);
        if (videoSection) {
            videoSection.style.touchAction = locked ? 'none' : '';
        }
    }

    // --- 1. OBSERVER (QUẢN LÝ HÀNH VI CUỘN) ---
    const isTouch = ScrollTrigger.isTouch === 1;
    const intentObserver = ScrollTrigger.observe({
		target: ".video-section-heka",
        type: isTouch ? "touch" : "wheel",
        onUp: () => handleDirection(isTouch ? 1 : -1),
        onDown: () => handleDirection(isTouch ? -1 : 1),
        tolerance: 10,
        preventDefault: false
    });
    intentObserver.disable();

    // --- 2. SCROLLTRIGGER (CÁI NEO) ---
    const st = ScrollTrigger.create({
        trigger: videoSection,
        start: "top top",
        end: "+=1000",
        fastScrollEnd: true,
        anticipatePin: 1,
        pin: true,
        scrub: true,
        onEnter: () => {
            intentObserver.enable();
            restoreVideoState();
        },
        onEnterBack: () => {
            intentObserver.enable();
            restoreVideoState();
        },
        onLeave: () => {
            intentObserver.disable();
        },
        onLeaveBack: () => {
            intentObserver.disable();
        },
        onUpdate: (self) => {
            if (self.isActive) {
                // log(`scrub ${Math.round(self.progress * 100)}%`);
            }
        }
    });

    // --- 3. LOGIC KHÔI PHỤC TRẠNG THÁI VIDEO ---
    function restoreVideoState() {
        if (currentIndex >= 0 && currentIndex < NUM_SEGMENTS) {
            const endOfCurrentSegment = DURATION_POINTS[currentIndex + 1];
            if (Number.isFinite(endOfCurrentSegment)) {
                video.currentTime = endOfCurrentSegment;
                showContent(currentIndex, true);
            }
        } else if (currentIndex >= NUM_SEGMENTS - 1) {
            const lastTime = DURATION_POINTS[NUM_SEGMENTS];
            video.currentTime = lastTime;
            showContent(NUM_SEGMENTS - 1, true);
        }
    }

    // --- 4. XỬ LÝ HƯỚNG CUỘN ---
    function handleDirection(direction) {
        if (direction === -1) {
            // Scroll lên -> Thoát luôn, giữ nguyên Index
            releaseScrollSmooth('up');
            return;
        } 
        
        if (isAnimating || isLocked) {
            return;
        }

        // === TRƯỜNG HỢP CUỘN XUỐNG (DOWN) ===
        if (currentIndex >= NUM_SEGMENTS - 1) {
            // Hết video -> Thoát xuống
            releaseScrollSmooth('down');
        } else {
            // Còn video -> Chạy tiếp đoạn kế
            playSegment(currentIndex + 1);
        }
    }

    function log(message) {
        const el = document.getElementById('log');
        if (el) el.innerHTML = `${message}`;
    }
    // --- 5. HÀM THOÁT MƯỢT ---
    function releaseScrollSmooth(direction) {
        intentObserver.disable();
        setScrollLock(false);
        
        const targetScroll = direction === 'down' 
            ? st.end + 5 
            : st.start - 5;

        if (smoother) {
            smoother.scrollTo(targetScroll, true);
        } else {
            gsap.to(window, {
                scrollTo: targetScroll,
                duration: 0.6,
                ease: "power2.inOut"
            });
        }
    }
    
    function showContent(index, instant = false) {
        if (!contentItems || contentItems.length === 0) return;


        contentItems.forEach((item, i) => {
            const itemIndex = parseInt(item.getAttribute('data-index'));
            
            if (itemIndex === index) {
                // Show active item
                if (instant) {
                    gsap.set(item, { opacity: 1 });
                } else {
                    gsap.to(item, {
                        opacity: 1,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                }
            } else {
                // Hide other items
                if (instant) {
                    gsap.set(item, { opacity: 0 });
                } else {
                    gsap.to(item, {
                        opacity: 0,
                        duration: 0.4,
                        ease: "power2.in"
                    });
                }
            }
        });
    }

    // --- 6. VIDEO PLAYER ---
    function playSegment(targetIndex) {
        // log(`playSegment ${targetIndex}`)
        if (targetIndex < 0 || targetIndex >= NUM_SEGMENTS) return;
        
        isAnimating = true;
        isLocked = true;
        setScrollLock(true);
        currentIndex = targetIndex;
        showContent(currentIndex);

        const startTime = DURATION_POINTS[currentIndex];
        const endTime = DURATION_POINTS[currentIndex + 1];
        const duration = endTime - startTime;

        video.currentTime = startTime;
        video.play().catch(e => console.log("Play interrupted:", e));

        gsap.delayedCall(duration, () => {
            video.pause();
            isAnimating = false;
            isLocked = false;
            setScrollLock(false);
        });
    }
});
