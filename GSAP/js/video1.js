document.addEventListener('DOMContentLoaded', function () {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const SELECTORS = {
        section: '.video-section-heka',
        video: '.video-heka',
        source: '.video-section-heka-src',
        content: '.video-js-content',
        smootherWrapper: '#smooth-wrapper',
        smootherContent: '#smooth-content'
    };

    const CONFIG = {
        numSegments: 7,
        durationPoints: [0, 3.5, 7.5, 11, 14, 19, 21, 25],
        pinScrollDistance: '+=1000',
        smoother: {
            smooth: 0.8,
            effects: false,
            normalizeScroll: true
        }
    };

    const videoSection = document.querySelector(SELECTORS.section);
    if (!videoSection) return;

    const video = videoSection.querySelector(SELECTORS.video);
    const sourceEl = videoSection.querySelector(SELECTORS.source);
    const videoSrc = sourceEl ? sourceEl.dataset.hlsUrl : '';
    const contentItems = Array.from(document.querySelectorAll(SELECTORS.content));
    if (!video || !videoSrc) return;

    let currentIndex = -1;
    let isAnimating = false;
    let isLocked = false;

    initHls(video, videoSrc);
    const smoother = initSmoother();
    const intentObserver = createIntentObserver();
    const st = createScrollTrigger();

    intentObserver.disable();

    function initHls(targetVideo, src) {
        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(targetVideo);
            return;
        }

        if (targetVideo.canPlayType('application/vnd.apple.mpegurl')) {
            targetVideo.src = src;
        }
    }

    function initSmoother() {
        const wrapper = document.querySelector(SELECTORS.smootherWrapper);
        const content = document.querySelector(SELECTORS.smootherContent);
        if (!wrapper || !content || typeof ScrollSmoother === 'undefined') return null;

        return ScrollSmoother.create({
            wrapper: SELECTORS.smootherWrapper,
            content: SELECTORS.smootherContent,
            smooth: CONFIG.smoother.smooth,
            effects: CONFIG.smoother.effects,
            normalizeScroll: CONFIG.smoother.normalizeScroll
        });
    }

    function setScrollLock(locked) {
        if (smoother) smoother.paused(locked);
        videoSection.style.touchAction = locked ? 'none' : '';
    }

    function createIntentObserver() {
        const isTouch = ScrollTrigger.isTouch === 1;
        const upDir = isTouch ? 1 : -1;
        const downDir = isTouch ? -1 : 1;

        return ScrollTrigger.observe({
            target: videoSection,
            type: isTouch ? 'touch' : 'wheel',
            onUp: () => handleDirection(upDir),
            onDown: () => handleDirection(downDir),
            tolerance: 10,
            preventDefault: false
        });
    }

    function createScrollTrigger() {
        return ScrollTrigger.create({
            trigger: videoSection,
            start: 'top top',
            end: CONFIG.pinScrollDistance,
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
    }

    function restoreVideoState() {
        if (currentIndex >= 0 && currentIndex < CONFIG.numSegments) {
            const endOfCurrentSegment = CONFIG.durationPoints[currentIndex + 1];
            if (Number.isFinite(endOfCurrentSegment)) {
                video.currentTime = endOfCurrentSegment;
                showContent(currentIndex, true);
            }
            return;
        }

        if (currentIndex >= CONFIG.numSegments - 1) {
            const lastTime = CONFIG.durationPoints[CONFIG.numSegments];
            video.currentTime = lastTime;
            showContent(CONFIG.numSegments - 1, true);
        }
    }

    function handleDirection(direction) {
        if (direction === -1) {
            releaseScrollSmooth('up');
            return;
        }

        if (isAnimating || isLocked) return;

        if (currentIndex >= CONFIG.numSegments - 1) {
            releaseScrollSmooth('down');
            return;
        }

        playSegment(currentIndex + 1);
    }

    function releaseScrollSmooth(direction) {
        intentObserver.disable();
        setScrollLock(false);

        const targetScroll = direction === 'down' ? st.end + 5 : st.start - 5;
        if (smoother) {
            smoother.scrollTo(targetScroll, true);
            return;
        }

        gsap.to(window, {
            scrollTo: targetScroll,
            duration: 0.6,
            ease: 'power2.inOut'
        });
    }

    function showContent(index, instant = false) {
        if (contentItems.length === 0) return;

        contentItems.forEach((item) => {
            const itemIndex = parseInt(item.getAttribute('data-index'), 10);
            const isActive = itemIndex === index;
            const props = { opacity: isActive ? 1 : 0 };

            if (instant) {
                gsap.set(item, props);
                return;
            }

            gsap.to(item, {
                ...props,
                duration: isActive ? 0.6 : 0.4,
                ease: isActive ? 'power2.out' : 'power2.in'
            });
        });
    }

    function playSegment(targetIndex) {
        if (targetIndex < 0 || targetIndex >= CONFIG.numSegments) return;

        isAnimating = true;
        isLocked = true;
        setScrollLock(true);
        currentIndex = targetIndex;
        showContent(currentIndex);

        const startTime = CONFIG.durationPoints[currentIndex];
        const endTime = CONFIG.durationPoints[currentIndex + 1];
        const duration = endTime - startTime;

        video.currentTime = startTime;
        video.play().catch((e) => console.log('Play interrupted:', e));

        gsap.delayedCall(duration, () => {
            video.pause();
            isAnimating = false;
            isLocked = false;
            setScrollLock(false);
        });
    }

    function log(message) {
        const el = document.getElementById('log');
        if (el) el.innerHTML = `${message}`;
    }
});
