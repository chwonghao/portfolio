/**
 * Tải một component HTML từ file và chèn vào một phần tử trên trang.
 * @param {string} id ID của phần tử đích.
 * @param {string} url Đường dẫn đến file component HTML.
 * @returns {Promise<void>}
 */
const loadComponent = (id, url) => {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = data;
            }
        });
};

/**
 * Khởi tạo tất cả các thành phần tương tác và hiệu ứng sau khi các component đã được tải.
 */
const initializePage = () => {
    // --- Logic chuyển đổi giao diện Sáng/Tối ---
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    if (themeToggleBtn) {
        const darkIcon = document.querySelector('.theme-toggle-dark-icon');   // icon trăng → hiện khi đang light
        const lightIcon = document.querySelector('.theme-toggle-light-icon'); // icon mặt trời → hiện khi đang dark

        /**
         * isDark = true  → giao diện tối (dark)
         * isDark = false → giao diện sáng (light)
         */
        const setTheme = (isDark) => {
            const html = document.documentElement;
            if (isDark) {
                html.classList.remove('light');
                html.classList.add('dark');
                // Đang tối → hiện icon mặt trời để người dùng chuyển sang sáng
                if (lightIcon) lightIcon.classList.remove('hidden');
                if (darkIcon) darkIcon.classList.add('hidden');
                localStorage.setItem('color-theme', 'dark');
            } else {
                html.classList.remove('dark');
                html.classList.add('light');
                // Đang sáng → hiện icon trăng để người dùng chuyển sang tối
                if (darkIcon) darkIcon.classList.remove('hidden');
                if (lightIcon) lightIcon.classList.add('hidden');
                localStorage.setItem('color-theme', 'light');
            }
        };

        // Mặc định dark mode trừ khi người dùng đã chọn light
        const savedTheme = localStorage.getItem('color-theme');
        const prefersDark = !savedTheme || savedTheme === 'dark';
        setTheme(prefersDark);

        themeToggleBtn.addEventListener('click', () => {
            const isCurrentlyDark = document.documentElement.classList.contains('dark');
            setTheme(!isCurrentlyDark);
        });
    }

    // --- Mobile menu toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        // Đóng menu khi click vào link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // --- Logic hiển thị CV Modal ---
    const openCvModalBtn = document.getElementById('open-cv-modal');
    const closeCvModalBtn = document.getElementById('close-cv-modal');
    const cvModal = document.getElementById('cv-modal');

    if (openCvModalBtn && cvModal) {
        openCvModalBtn.addEventListener('click', () => {
            cvModal.classList.remove('hidden');
            cvModal.classList.add('flex');
        });
    }
    if (closeCvModalBtn && cvModal) {
        closeCvModalBtn.addEventListener('click', () => {
            cvModal.classList.add('hidden');
            cvModal.classList.remove('flex');
        });
    }
    if (cvModal) {
        cvModal.addEventListener('click', (event) => {
            if (event.target === cvModal) {
                cvModal.classList.add('hidden');
                cvModal.classList.remove('flex');
            }
        });
    }

    // --- Active nav link highlight on scroll ---
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.style.color = '';
            link.style.background = '';
            const href = link.getAttribute('href')?.replace('#', '');
            if (href === current) {
                link.style.color = 'white';
                link.style.background = 'rgba(255,255,255,0.1)';
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // --- Khởi tạo ScrollReveal ---
    if (typeof ScrollReveal === 'undefined') {
        console.warn('ScrollReveal not loaded.');
        return;
    }

    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '30px',
        duration: 800,
        delay: 100,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        reset: false,
    });

    // Hero
    sr.reveal('#hero h1', { origin: 'bottom', duration: 900, delay: 100, distance: '50px' });
    sr.reveal('#hero p', { origin: 'bottom', duration: 800, delay: 250, distance: '30px' });
    sr.reveal('#hero .flex.flex-wrap', { origin: 'bottom', duration: 800, delay: 350, distance: '25px' });
    sr.reveal('#hero .company-badge', { origin: 'bottom', duration: 700, delay: 450, distance: '20px' });
    sr.reveal('#hero .btn-primary, #hero .btn-secondary', { origin: 'bottom', duration: 700, delay: 550, distance: '20px', interval: 100 });

    // About
    sr.reveal('#about .section-eyebrow, #about .section-title', { origin: 'top', duration: 700 });
    sr.reveal('#about p', { origin: 'left', duration: 700, delay: 150 });
    sr.reveal('#about .stat-card', { interval: 100, duration: 600, delay: 200 });
    sr.reveal('#about h3', { origin: 'right', duration: 600, delay: 100 });
    sr.reveal('#about .skill-category', { interval: 80, duration: 600, delay: 250 });

    // Experience
    sr.reveal('#experience .section-eyebrow, #experience .section-title', { origin: 'top', duration: 700 });
    sr.reveal('#experience .timeline-group-label', { origin: 'left', duration: 600, delay: 100 });
    sr.reveal('#experience .timeline-card', { origin: 'left', duration: 700, delay: 150, interval: 100 });

    // Projects
    sr.reveal('#projects .section-eyebrow, #projects .section-title', { origin: 'top', duration: 700 });
    sr.reveal('#projects .project-card', { interval: 120, duration: 700, delay: 100 });

    // Contact
    sr.reveal('#contact h2, #contact p', { origin: 'top', duration: 700 });
    sr.reveal('#contact ul', { interval: 80, duration: 600, delay: 200 });
};

// --- Thực thi chính ---
document.addEventListener('DOMContentLoaded', () => {
    const componentsToLoad = [
        loadComponent('navbar', 'components/navbar.html'),
        loadComponent('hero', 'components/hero.html'),
        loadComponent('about', 'components/about.html'),
        loadComponent('experience', 'components/experience.html'),
        loadComponent('projects', 'components/projects.html'),
    ];

    Promise.all(componentsToLoad)
        .then(initializePage)
        .catch(error => console.error("Error loading components:", error));
});