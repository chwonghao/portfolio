export function initializeHero() {
  const openCvModalBtn = document.getElementById('open-cv-modal');
  const closeCvModalBtn = document.getElementById('close-cv-modal');
  const cvModal = document.getElementById('cv-modal');

  // Kiểm tra xem các phần tử có tồn tại không trước khi gán sự kiện
  if (openCvModalBtn && closeCvModalBtn && cvModal) {
    openCvModalBtn.addEventListener('click', () => {
      cvModal.classList.remove('hidden');
      cvModal.classList.add('flex');
    });

    const closeModal = () => {
      cvModal.classList.add('hidden');
      cvModal.classList.remove('flex');
    };

    closeCvModalBtn.addEventListener('click', closeModal);

    // Đóng modal khi nhấn vào vùng nền mờ bên ngoài
    cvModal.addEventListener('click', (event) => {
      if (event.target === cvModal) {
        closeModal();
      }
    });
  } else {
    console.error('Không tìm thấy các phần tử của CV modal để khởi tạo.');
  }
}
