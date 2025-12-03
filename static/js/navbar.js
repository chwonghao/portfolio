export function initializeNavbar() {
  // --- Logic cho Dark Mode (chỉ các nút trong navbar) ---
  const themeToggleButtons = document.querySelectorAll('#navbar .theme-toggle-btn');
  
  themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDarkModeNow = document.documentElement.classList.contains('dark');
      const newTheme = isDarkModeNow ? 'light' : 'dark';
      localStorage.setItem('color-theme', newTheme);
      
      // Gửi một sự kiện tùy chỉnh để các phần khác của trang có thể lắng nghe
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    });
  });
}
