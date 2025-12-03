import { initializeNavbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
  const components = [
    { id: 'navbar', file: 'navbar.html' },
    { id: 'hero', file: 'hero.html' },
    { id: 'about', file: 'about.html' },
    { id: 'experience', file: 'experience.html' },
    { id: 'projects', file: 'projects.html' },
    { id: 'footer', file: 'footer.html' },
  ];

  const loadComponent = async (component) => {
    const targetElement = document.getElementById(component.id);
    if (!targetElement) return;

    try {
        const response = await fetch(`/components/${component.file}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();

        if (!html || html.trim().length === 0) {
            console.error(`Component file is empty: ${component.file}`);
            return;
        }

        targetElement.innerHTML = html;
        
        // Nếu component có hàm khởi tạo, hãy gọi nó
        if (component.init) {
            component.init();
        }
    } catch (error) {
        console.error(`Error loading component: ${component.file}`, error);
    }
  };

  // Hàm này chứa các logic không phụ thuộc vào component cụ thể
  function initializePageLogic() {
    // --- Logic cho Dark Mode ---
    const themeToggleDarkIcons = document.querySelectorAll('.theme-toggle-dark-icon');
    const themeToggleLightIcons = document.querySelectorAll('.theme-toggle-light-icon');

    const updateThemeUI = (isDarkMode) => {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        themeToggleLightIcons.forEach(icon => icon.classList.remove('hidden'));
        themeToggleDarkIcons.forEach(icon => icon.classList.add('hidden'));
      } else {
        document.documentElement.classList.remove('dark');
        themeToggleDarkIcons.forEach(icon => icon.classList.remove('hidden'));
        themeToggleLightIcons.forEach(icon => icon.classList.add('hidden'));
      }
    };

    // Lắng nghe sự kiện thay đổi theme từ navbar
    document.addEventListener('themeChanged', (e) => {
      updateThemeUI(e.detail.theme === 'dark');
    });

    // Cập nhật theme lần đầu khi tải trang
    const isDarkMode = localStorage.getItem('color-theme') === 'dark' ||
                       (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    updateThemeUI(isDarkMode);


    // --- Logic cuộn trang tùy chỉnh và Active Link ---
    const sections = Array.from(document.querySelectorAll('section[id], footer[id]'));
    const navLinks = document.querySelectorAll('.nav-link');
    let isScrolling = false;
    let currentSectionIndex = 0;

    const scrollToSection = (index) => {
      if (isScrolling || index < 0 || index >= sections.length) return;
      isScrolling = true;
      sections[index].scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    };

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    // Chỉ xử lý cuộn bằng con lăn chuột trên thiết bị không cảm ứng (desktop)
    if (!isTouchDevice) {
      window.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (isScrolling) return;
        const direction = event.deltaY > 0 ? 1 : -1;
        const newIndex = currentSectionIndex + direction;
        if (newIndex >= 0 && newIndex < sections.length) {
          scrollToSection(newIndex);
        }
      }, { passive: false });
    }

    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetIndex = sections.findIndex(section => `#${section.id}` === targetId);
        scrollToSection(targetIndex);
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          currentSectionIndex = sections.findIndex(section => section.id === id);
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.7 });

    sections.forEach(section => observer.observe(section));

    if (window.ScrollReveal) {
      ScrollReveal({
        reset: false,
        distance: '60px',
        duration: 1000,
        easing: 'ease-in-out',
      });
      ScrollReveal().reveal('#hero, #navbar', { delay: 400, origin: 'top' });
      ScrollReveal().reveal('#about', { delay: 400, origin: 'left' });
      ScrollReveal().reveal('#experience, #projects, #footer', { delay: 400, origin: 'bottom', interval: 200 });
    }
  }

  // --- QUY TRÌNH TẢI ---
  // Gán hàm khởi tạo cho các component cần thiết
  components.find(c => c.id === 'navbar').init = initializeNavbar;

  // Tải tất cả các component song song và khởi tạo chúng khi hoàn tất
  await Promise.all(components.map(loadComponent));
  
  // Khởi tạo các logic chung của trang sau khi tất cả component đã được tải
  requestAnimationFrame(initializePageLogic);

});