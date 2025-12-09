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
        const themeToggleDarkIcon = document.querySelector('.theme-toggle-dark-icon');
        const themeToggleLightIcon = document.querySelector('.theme-toggle-light-icon');

        const setTheme = (isDark) => {
            if (isDark) {
                document.documentElement.classList.add('dark');
                if(themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden');
                if(themeToggleDarkIcon) themeToggleDarkIcon.classList.add('hidden');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                if(themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden');
                if(themeToggleLightIcon) themeToggleLightIcon.classList.add('hidden');
                localStorage.setItem('color-theme', 'light');
            }
        };

        const isDarkMode = localStorage.getItem('color-theme') === 'dark' ||
            (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setTheme(isDarkMode);

        themeToggleBtn.addEventListener('click', () => {
            setTheme(!document.documentElement.classList.contains('dark'));
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

    // --- Khởi tạo ScrollReveal ---
    if (typeof ScrollReveal === 'undefined') {
        console.error('ScrollReveal is not loaded. Make sure the script is included in index.html.');
        return;
    }

    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '40px',  // Giảm khoảng cách mặc định
        duration: 2000,   // Tăng thời gian để hiệu ứng chậm hơn
        delay: 200,
    });

    // --- Cấu hình hiệu ứng cho các phần tử ---
    // Section Hero - Ghi đè cài đặt chung để có hiệu ứng nhanh và ấn tượng hơn
    sr.reveal('#hero h2, #hero p, #hero button', { interval: 150, duration: 1000, distance: '80px' });
    // Tiêu đề các section
    sr.reveal('#about h2, #experience h2, #projects h2, #footer h2', { origin: 'top' });

    // Section Giới thiệu (About) - xuất hiện từ bên trái
    sr.reveal('#about p, #about h3', { delay: 300, origin: 'left' });
    sr.reveal('#about .flex-wrap span', { interval: 100, delay: 400 }); // Giữ nguyên từ dưới lên

    // Section Học vấn - xuất hiện xen kẽ từ trái và phải
    sr.reveal('#experience .max-w-3xl > .relative:nth-child(odd)', { origin: 'left' });
    sr.reveal('#experience .max-w-3xl > .relative:nth-child(even)', { origin: 'right' });

    // Section Dự án - hiệu ứng lật (rotate)
    sr.reveal('#projects .grid > div', {
        rotate: { x: 0, y: 80, z: 0 }, // Xoay 80 độ quanh trục Y
        duration: 1500
    });

    sr.reveal('#contact .flex', { origin: 'top', duration: 1000 });
    sr.reveal('#contact p', { origin: 'top', duration: 1000, delay: 200 });
};

// --- Thực thi chính ---
document.addEventListener('DOMContentLoaded', () => {
    const componentsToLoad = [
        loadComponent('navbar', 'components/navbar.html'),
        loadComponent('hero', 'components/hero.html'),
        loadComponent('about', 'components/about.html'),
        loadComponent('experience', 'components/experience.html'),
        loadComponent('projects', 'components/projects.html'),
        loadComponent('footer', 'components/footer.html')
    ];

    Promise.all(componentsToLoad)
        .then(initializePage)
        .catch(error => console.error("Error loading components:", error));
});