// ambil element dom abistu kasi variabel
const rowsEl = document.getElementById('rows');
const emptyEl = document.getElementById('empty');
const tabTop = document.getElementById('tabTop');
const tabRecent = document.getElementById('tabRecent');
const clearBtn = document.getElementById('clearBtn');

// 'top' = skor tertinggi, 'recent' = percobaan terbaru
let mode = 'top';

// gambar ulang isi tabel sesuai mode
function render() {
  let list = getAttempts();

  if (mode === 'top') {
    // urutin dari skor terbesar, ambil 10 teratas
    list = [...list].sort((a, b) => b.score - a.score).slice(0, 10);
  } else {
    // dibalik biar yang terbaru di atas, ambil 20
    list = [...list].reverse().slice(0, 20);
  }

  // kosongin tabel dulu, tulisan "belum ada data" muncul kalo list kosong
  rowsEl.innerHTML = '';
  emptyEl.hidden = list.length > 0;

  // bikin 1 baris tabel buat tiap percobaan
  list.forEach((a, i) => {
    const tr = document.createElement('tr');
    const waktu = new Date(a.date).toLocaleString('id-ID', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
    [i + 1, a.name, a.score, a.length, waktu].forEach((val) => {
      const td = document.createElement('td');
      td.textContent = val; // pake textContent biar aman dari injeksi html
      tr.appendChild(td);
    });
    rowsEl.appendChild(tr);
  });
}

// ganti mode (tab), tab yang aktif tampilannya solid, yang lain outline
function setMode(newMode) {
  mode = newMode;
  tabTop.classList.toggle('secondary', mode !== 'top');
  tabRecent.classList.toggle('secondary', mode !== 'recent');
  render();
}

// klik tab
tabTop.addEventListener('click', () => setMode('top'));
tabRecent.addEventListener('click', () => setMode('recent'));

// hapus semua data (ada konfirmasi dulu)
clearBtn.addEventListener('click', () => {
  if (confirm('Hapus semua data percobaan?')) {
    clearAttempts();
    render();
  }
});

// tampilan awal
setMode('top');