// ==========================================
// ส่วนที่ 1: การจัดการเมนูนำทาง (Navigation Menu)
// ==========================================

// ฟังก์ชันสำหรับเปิด/ปิด เมนูนำทางบนมือถือ (Mobile Menu)
const showMenu = (toggleId, navId) => {
   const toggle = document.getElementById(toggleId)
   const nav = document.getElementById(navId)

   // เช็คว่ามี element เหล่านี้อยู่จริงหรือไม่ ป้องกัน error
   if (!toggle || !nav) {
      return
   }

   // เมื่อคลิกที่ปุ่ม toggle (เช่น ไอคอนแฮมเบอร์เกอร์)
   toggle.addEventListener('click', () => {
       // สลับคลาส 'show-menu' เพื่อแสดงหรือซ่อนเมนู
       nav.classList.toggle('show-menu')

       // สลับคลาส 'show-icon' เพื่อเปลี่ยนรูปแบบไอคอน (เช่น จากแฮมเบอร์เกอร์เป็นกากบาท)
       toggle.classList.toggle('show-icon')
   })
}

// เรียกใช้งานฟังก์ชัน โดยส่ง id ของปุ่มกดและ id ของเมนูไป
showMenu('nav-toggle','nav-menu')

// เลือกรายการเมนูที่มี Dropdown ทั้งหมด
const dropdownItems = document.querySelectorAll('.dropdown__item')

// วนลูปเพื่อจัดการคลิกอีเวนต์ในแต่ละ Dropdown
dropdownItems.forEach((item) => {
   const dropdownButton = item.querySelector('.nav__link')

   if (!dropdownButton) {
      return
   }

   dropdownButton.addEventListener('click', () => {
      // หากหน้าจอกว้างกว่า 1118px (หน้าจอคอมพิวเตอร์) ให้ข้ามการทำงานนี้ไป
      // (มักจะใช้ CSS hover แทนในหน้าจอใหญ่)
      if (window.innerWidth > 1118) {
         return
      }

      // วนลูปเพื่อปิด Dropdown ตัวอื่นๆ ที่เปิดอยู่ (ให้เปิดได้แค่ทีละ 1 อัน)
      dropdownItems.forEach((otherItem) => {
         if (otherItem !== item) {
            otherItem.classList.remove('is-open')
         }
      })

      // สลับสถานะเปิด/ปิด สำหรับ Dropdown ที่เพิ่งคลิก
      item.classList.toggle('is-open')
   })
})

// รีเซ็ตสถานะเมนูเมื่อผู้ใช้ย่อ/ขยายขนาดหน้าต่างเบราว์เซอร์ (Resize)
window.addEventListener('resize', () => {
   const toggle = document.getElementById('nav-toggle')
   const nav = document.getElementById('nav-menu')

   if (!toggle || !nav) {
      return
   }

   // หากหน้าจอถูกขยายกว้างกว่า 1118px ให้ซ่อนเมนูมือถือและเคลียร์สถานะต่างๆ ทิ้ง
   if (window.innerWidth > 1118) {
      nav.classList.remove('show-menu')
      toggle.classList.remove('show-icon')

      dropdownItems.forEach((item) => {
         item.classList.remove('is-open')
      })
   }
})


// ==========================================
// ส่วนที่ 2: การจัดการสไลเดอร์ (Hero Slider)
// ==========================================

const slider = document.getElementById("heroSlider");
const slides = Array.from(document.querySelectorAll(".hero-slide")); // แปลงเป็น Array เพื่อให้ใช้งานง่าย
const dotsBox = document.getElementById("heroDots");

let currentImage = 0; // เก็บค่า index ของสไลด์ปัจจุบัน
let slideTimer;       // ตัวแปรสำหรับเก็บ Timer ของระบบ Auto-play

// อัปเดตจุดไข่ปลา (Dots) ด้านล่างสไลเดอร์ให้ตรงกับรูปปัจจุบัน
function updateDots() {
    document.querySelectorAll(".hero-dots button").forEach((dot, index) => {
        // เพิ่มคลาส 'is-active' เฉพาะจุดที่ตรงกับ currentImage
        dot.classList.toggle("is-active", index === currentImage);
    });
}

// ฟังก์ชันสำหรับเปลี่ยนสไลด์ไปยังภาพที่กำหนด (nextImage)
function showSlide(nextImage) {
    // ถ้าคลิกรูปเดิม หรือไม่มีรูปนั้นอยู่ ให้ข้ามไป
    if (nextImage === currentImage || !slides[nextImage]) {
        return;
    }

    const oldSlide = slides[currentImage];
    const newSlide = slides[nextImage];

    // จัดการคลาสของสไลด์เดิมเพื่อให้เกิดแอนิเมชันเลื่อนออก
    oldSlide.classList.remove("is-active");
    oldSlide.classList.add("is-leaving");
    
    // แสดงสไลด์ใหม่
    newSlide.classList.add("is-active");

    // อัปเดตค่าสไลด์ปัจจุบันและจุด (Dots)
    currentImage = nextImage;
    updateDots();

    // ลบคลาส 'is-leaving' ออกเมื่อแอนิเมชันจบ (หน่วงเวลาไว้ 900ms)
    window.setTimeout(() => {
        oldSlide.classList.remove("is-leaving");
    }, 900);
}

// ฟังก์ชันเลื่อนไปยังสไลด์ถัดไป
function nextSlide() {
    // ใช้ Modulo (%) เพื่อให้เมื่อถึงรูปสุดท้ายแล้ววนกลับมาเริ่มรูปที่ 0 ใหม่
    showSlide((currentImage + 1) % slides.length);
}

// เริ่มต้น Auto-play สไลด์
function startSlider() {
    stopSlider(); // เคลียร์ของเก่าก่อนป้องกันการทำงานซ้อนทับกัน
    slideTimer = window.setInterval(nextSlide, 4200); // เปลี่ยนสไลด์ทุกๆ 4.2 วินาที
}

// หยุด Auto-play
function stopSlider() {
    window.clearInterval(slideTimer);
}

// สร้างปุ่มจุด (Dots) ตามจำนวนสไลด์ที่มี
slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    
    dot.type = "button";
    dot.setAttribute("aria-label", `Show slide ${index + 1}`); // สำหรับผู้พิการทางสายตา (Accessibility)
    dot.classList.toggle("is-active", index === currentImage);

    // เมื่อคลิกที่จุด ให้เปลี่ยนไปที่สไลด์นั้น และรีเซ็ตเวลา Auto-play ใหม่
    dot.addEventListener("click", () => {
        showSlide(index);
        startSlider();
    });

    dotsBox.appendChild(dot); // นำจุดไปแสดงผลใน DOM
});

// หยุดสไลด์ชั่วคราวเมื่อเอาเมาส์ชี้ (Hover) และให้ทำงานต่อเมื่อเอาเมาส์ออก
slider.addEventListener("mouseenter", stopSlider);
slider.addEventListener("mouseleave", startSlider);

// ประหยัดทรัพยากร: หยุดสไลด์เมื่อผู้ใช้เปลี่ยนไปเปิด Tab อื่น และให้กลับมาทำงานเมื่อสลับกลับมา
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopSlider();
    } else {
        startSlider();
    }
});

// เรียกใช้งานสไลด์เป็นครั้งแรกเมื่อโหลดเสร็จ
startSlider();