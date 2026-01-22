document.addEventListener('DOMContentLoaded', function () {
    gsap.registerPlugin(ScrollTrigger);

    const videoSection = document.querySelector('.video-section-heka');
    if (!videoSection) return;

    const video = videoSection.querySelector('.video-heka');
    const videoSrc = videoSection.dataset.hlsUrl;

    if (!video || !videoSrc) return;

    // --- CẤU HÌNH ---
    const NUM_SEGMENTS = 7;
    const DURATION_POINTS = [0, 3.5, 7.5, 11, 14, 19, 21, 25];
    const COOLDOWN = 1000;

    // --- STATE ---
    // Biến này sẽ lưu vị trí cũ mãi mãi chừng nào chưa f5
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

    // --- 1. OBSERVER (QUẢN LÝ HÀNH VI CUỘN) ---
    const intentObserver = ScrollTrigger.observe({
        target: window,
        type: "wheel,touch,pointer",
        onUp: () => handleDirection(-1),
        onDown: () => handleDirection(1),
        tolerance: 10,
        preventDefault: true // Chặn cuộn thật để xử lý logic
    });
    intentObserver.disable();

    // --- 2. SCROLLTRIGGER (CÁI NEO) ---
    const st = ScrollTrigger.create({
        trigger: videoSection,
        start: "top top",
        end: "+=1000", // Vùng Pin ảo cực ngắn
        pin: true,
        onEnter: () => {
            intentObserver.enable();
            restoreVideoState(); // QUAN TRỌNG: Khôi phục hình ảnh video tại vị trí cũ
        },
        onEnterBack: () => {
            intentObserver.enable();
            restoreVideoState();
            // Nếu người dùng cuộn từ dưới footer lên, có thể muốn set về cuối?
            // Nhưng để "lưu vị trí cũ" thì ta không nên can thiệp, cứ để nguyên currentIndex
        }
    });

    // --- 3. LOGIC KHÔI PHỤC TRẠNG THÁI VIDEO ---
    function restoreVideoState() {
        // Nếu đã xem dở (ví dụ index = 3), thì video phải hiển thị ở giây kết thúc của đoạn 3
        if (currentIndex >= 0 && currentIndex < NUM_SEGMENTS) {
            const endOfCurrentSegment = DURATION_POINTS[currentIndex + 1];
            // Seek video tới đúng chỗ cũ để người dùng nhớ mình đang xem tới đâu
            // Kiểm tra safety để tránh lỗi
            if (Number.isFinite(endOfCurrentSegment)) {
                video.currentTime = endOfCurrentSegment; 
                // Không gọi video.play(), chỉ seek tới ảnh tĩnh
            }
        }
    }

    // --- 4. XỬ LÝ HƯỚNG CUỘN (CORE FIX) ---
    function handleDirection(direction) {
        if (direction === -1) {
            // YÊU CẦU: Scroll lên -> Thoát luôn, giữ nguyên Index
            // KHÔNG gọi playSegment(currentIndex - 1) nữa!
            releaseScroll('up');
        } 
        
        if (isAnimating || isLocked) return;

        // === TRƯỜNG HỢP CUỘN LÊN (UP) ===

        
        // === TRƯỜNG HỢP CUỘN XUỐNG (DOWN) ===
        else {
            if (currentIndex >= NUM_SEGMENTS - 1) {
                // Hết video -> Thoát xuống
                releaseScroll('down');
            } else {
                // Còn video -> Chạy tiếp đoạn kế
                playSegment(currentIndex + 1);
            }
        }
    }

    // --- 5. HÀM THOÁT (UNPIN) ---
    function releaseScroll(direction) {
        intentObserver.disable();
        
        // Nhảy ra khỏi vùng Pin 1 chút để không bị hút lại
        const targetScroll = direction === 'down' 
            ? st.end + 100 
            : st.start - 100;

        window.scrollTo({
            top: targetScroll,
            behavior: "auto"
        });
    }

    // --- VIDEO PLAYER ---
    function playSegment(targetIndex) {
        if (targetIndex < 0 || targetIndex >= NUM_SEGMENTS) return;
        
        isAnimating = true;
        isLocked = true;
        currentIndex = targetIndex; // Cập nhật Index mới

        console.log(`Playing segment ${currentIndex} (Time: ${DURATION_POINTS[currentIndex]} -> ${DURATION_POINTS[currentIndex+1]})`);

        const startTime = DURATION_POINTS[currentIndex];
        const endTime = DURATION_POINTS[currentIndex + 1];
        const duration = endTime - startTime;

        video.currentTime = startTime;
        video.play().catch(e => console.log("Play interrupted"));

        gsap.delayedCall(duration, () => {
            video.pause();
            isAnimating = false;
        });

        setTimeout(() => {
            isLocked = false;
        }, COOLDOWN);
    }
});   