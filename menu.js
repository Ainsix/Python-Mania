// ambil element yang dibutuhin
const exitBtn = document.getElementById('exitBtn');
const menuButtons = document.getElementById('menuButtons');
const bye = document.getElementById('bye');

// pas tombol exit diklik
exitBtn.addEventListener('click', () => {
  // browser biasanya nolak close() buat tab biasa, jadi ini cuma jaga-jaga
  window.close();
  // tombol disembunyiin, tulisan perpisahan ditampilin
  menuButtons.hidden = true;
  bye.hidden = false;
});