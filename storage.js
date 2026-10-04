// helper buat nyimpen & ngambil data di localStorage
// dipake bareng sama halaman game dan leaderboard

// data percobaan bentuknya array of objects
// contoh: { name: 'Ram', score: 50, length: 8, date: '2026-10-05T...' }
const KEY_ATTEMPTS = 'snakeAttempts';
const KEY_NAME = 'snakePlayerName';

// ambil semua percobaan, kalo kosong atau datanya rusak balikin array kosong
function getAttempts() {
  try {
    // localStorage cuma bisa nyimpen teks, makanya dibalikin lagi pake JSON.parse
    return JSON.parse(localStorage.getItem(KEY_ATTEMPTS)) || [];
  } catch {
    return [];
  }
}

// tambah 1 percobaan baru ke daftar, abistu simpan lagi
function saveAttempt(attempt) {
  const list = getAttempts();
  list.push(attempt);
  localStorage.setItem(KEY_ATTEMPTS, JSON.stringify(list));
}

// hapus semua percobaan
function clearAttempts() {
  localStorage.removeItem(KEY_ATTEMPTS);
}

// nama pemain, kalo belum diisi pake "Pemain"
function getPlayerName() {
  return localStorage.getItem(KEY_NAME) || 'Pemain';
}

function setPlayerName(name) {
  localStorage.setItem(KEY_NAME, name.trim() || 'Pemain');
}