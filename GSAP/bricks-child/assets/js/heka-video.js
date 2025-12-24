document.addEventListener('DOMContentLoaded', function () {
    const hekaVideoSections = document.querySelectorAll('.video-section-heka');

    if (hekaVideoSections.length === 0) {
        return;
    }

    // Initialize each video section found on the page
    hekaVideoSections.forEach(initHekaVideo);

    function initHekaVideo(videoSection) {
        const video = videoSection.querySelector('.video-heka');
        const counterEl = videoSection.querySelector('.counter-heka');
        const videoSrc = videoSection.dataset.hlsUrl;

        if (!video || !counterEl || !videoSrc) {
            console.error('Heka Video component is missing required elements or data-hls-url attribute.');
            return;
        }

        const NUM_SEGMENTS = 7;
        const DURATION_POINTS = [0, 3.5, 7.5, 11, 14, 19, 21, 25];
        const SCROLL_COOLDOWN = 800;

        let currentSegmentIndex = -1;
        let isPlaying = false;
        let isScrollAllowed = true;
        let pauseTimer = null;
        
        // --- HLS Video Initialization ---
        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc;
        }

        // --- GSAP ScrollTrigger Setup ---
        const videoScrollTrigger = ScrollTrigger.create({
            trigger: videoSection,
            start: 'top top',
            end: () => `+=${NUM_SEGMENTS * 400}`,
            pin: true,
            onEnter: () => videoSection.addEventListener('wheel', handleWheel, { passive: false }),
            onLeave: () => videoSection.removeEventListener('wheel', handleWheel),
            onEnterBack: () => videoSection.addEventListener('wheel', handleWheel, { passive: false }),
            onLeaveBack: () => videoSection.removeEventListener('wheel', handleWheel),
        });

        // --- Scroll Wheel Event Handler ---
        function handleWheel(e) {
            const direction = e.deltaY > 0 ? 'down' : 'up';

            if (direction === 'up' && currentSegmentIndex <= 0) {
                return;
            }

            if (direction === 'down' && currentSegmentIndex >= NUM_SEGMENTS - 1) {
                return;
            }

            e.preventDefault();

            if (!isScrollAllowed || isPlaying) {
                return;
            }

            isScrollAllowed = false;
            setTimeout(() => { isScrollAllowed = true; }, SCROLL_COOLDOWN);

            if (direction === 'down') {
                currentSegmentIndex++;
                playSegment(currentSegmentIndex);
            } else {
                currentSegmentIndex--;
                playSegment(currentSegmentIndex);
            }
        }

        // --- Video Playback Logic ---
        function playSegment(index) {
            if (index < 0 || index >= NUM_SEGMENTS) return;

            isPlaying = true;
            const startTime = DURATION_POINTS[index];
            const endTime = DURATION_POINTS[index + 1];
            const duration = endTime - startTime;

            counterEl.innerText = `Segment: ${index + 1}/${NUM_SEGMENTS} - PLAYING`;
            video.currentTime = startTime;

            video.play().then(() => {
                if (pauseTimer) pauseTimer.kill();
                pauseTimer = gsap.delayedCall(duration, () => {
                    video.pause();
                    isPlaying = false;
                    counterEl.innerText = `Segment: ${index + 1}/${NUM_SEGMENTS} - READY`;
                });
            }).catch(e => {
                isPlaying = false;
                console.error("Heka Video play failed.", e);
                counterEl.innerText = "Playback Error!";
            });
        }
    }
});
