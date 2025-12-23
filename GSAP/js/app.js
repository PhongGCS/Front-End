tailwind.config = {
    theme: {
        extend: {
            colors: {
                'red': '#FF0000'
            }
        }
    }
}

gsap.to(".box", {
    x: 100,
    duration: 1,
    ease: "power2.inOut"
});

gsap.timeline()
.from(".heading001", {
    y: 50,
    opacity: 0,
    duration: 0.6
  })
  .from(".subtitle001", {
    y: 30,
    opacity: 0,
    duration: 0.5
  }, "-=0.3")
  .from(".btn001", {
    scale: 0.8,
    opacity: 0,
    duration: 0.4
  });




const title004Animation = function(titleSelector) {
  // 1. Chia chữ thành các thẻ span (JS thuần)
  const title = document.querySelector("." + titleSelector);
  const text = title.textContent;
  const chars = text.split(""); // Cắt chuỗi thành mảng từng ký tự
  
  title.innerHTML = chars
    .map(char => `<span class="${titleSelector}_char">${char === " " ? "&nbsp;" : char}</span>`)
    .join("");
  
  // 2. GSAP Animation
  gsap.to(`.${titleSelector}_char`, {
    y: 0,                // Bay về vị trí cũ
    opacity: 1,          // Hiện hình
    rotation: 0,         // Xoay về 0 độ
    duration: 1,
    ease: "back.out(1.7)", // Nảy nhẹ cực sang
    
    // CÁI MÀY CẦN ĐÂY:
    stagger: 0.05,        // Mỗi chữ cái xuất hiện cách nhau 0.1 giây
    
    // Bonus: bắt đầu từ giữa ra hoặc từ cuối lên nếu thích
  //   stagger: { each: 0.1, from: "center" } 
    scrollTrigger: {
        trigger: title,     // Element trigger là title
        start: "top 80%",   // Khi top của title ở 80% viewport
        end: "bottom 20%",  // Kết thúc khi bottom ở 20% viewport
        toggleActions: "play none none reverse", // Play khi vào, reverse khi ra
        // markers: true,   // Uncomment để debug
    }
  });
}

title004Animation("title_bay_len");