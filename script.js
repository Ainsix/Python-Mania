// catatan: storage.js harus dimuat duluan di html, soalnya fungsi getPlayerName, saveAttempt, dll dipake di sini
// ambil element dom abistu kasi variabel
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

// ini grid box mapnya 
const GRID = 20;                      // ukuran 1 sel (px)
const COLS = canvas.width / GRID;    
const ROWS = canvas.height / GRID;    
//jadi nanti tinggi dan lebar dari canvas akan dibagi dengan grid biar bisa pas(harus habis dibagi btw)
// 

let snake, direction, nextDirection, food, score, highScore;
let gameLoop = null;
let isRunning = false;

// Ambil high score dari localStorage
highScore = Number(localStorage.getItem('snakeHighScore')) || 0;
highScoreEl.textContent = highScore;


//inisialisasi gamenya(start)

function init() {
  snake = [
    { x: 10, y: 10 },  // kepala
    { x: 9,  y: 10 },
    { x: 8,  y: 10 }   // buntut
  ];
  direction     = { x: 1, y: 0 };  //mulai ke kanan
  nextDirection = { x: 1, y: 0 }; 
  score = 0;
  scoreEl.textContent = score;
  spawnFood();
  draw();
}

//spawn foodnya

function spawnFood() {
  do {
    food = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS)
    };
  } while (snake.some(p => p.x === food.x && p.y === food.y));
}


//update gameloop
function update() {
  direction = nextDirection;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // kalo tabrak dinding
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    return gameOver();
  }

  // kalo tabrak diri sendiri
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    return gameOver();
  }

  snake.unshift(head);

  // Makan?
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}


// gambar(rendernya)
function draw() {
  // Background
  ctx.fillStyle = '#0f0f1e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid halus
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.05)';
  // garis tegak (sebanyak kolom)
  for (let i = 0; i <= COLS; i++) {
    ctx.beginPath();
    ctx.moveTo(i * GRID, 0);
    ctx.lineTo(i * GRID, canvas.height);
    ctx.stroke();
  }
  // garis datar (sebanyak baris, bukan kolom)
  for (let j = 0; j <= ROWS; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * GRID);
    ctx.lineTo(canvas.width, j * GRID);
    ctx.stroke();
  }

  // Makanan
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(
    food.x * GRID + GRID / 2,
    food.y * GRID + GRID / 2,
    GRID / 2 - 2, 0, Math.PI * 2
  );
  ctx.fill();

  // Ular
  snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? '#4ade80' : '#22c55e';
    ctx.fillRect(seg.x * GRID + 1, seg.y * GRID + 1, GRID - 2, GRID - 2);

    // Mata di kepala
    if (i === 0) {
      ctx.fillStyle = '#0f0f1e';
      ctx.fillRect(seg.x * GRID + 6,  seg.y * GRID + 6, 3, 3);
      ctx.fillRect(seg.x * GRID + 12, seg.y * GRID + 6, 3, 3);
    }
  });
}

// game over

function gameOver() {
  clearInterval(gameLoop);
  isRunning = false;

  // Update high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHighScore', highScore);
    highScoreEl.textContent = highScore;
  }

  // simpan percobaan ini ke leaderboard (fungsinya ada di storage.js)
  saveAttempt({
    name: getPlayerName(),
    score: score,
    length: snake.length,
    date: new Date().toISOString()
  });

  // Overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 36px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);

  ctx.fillStyle = '#fff';
  ctx.font = '18px Segoe UI';
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
}


//ubah arah
function setDirection(newDir) {
  if (newDir === 'up'    && direction.y === 0) nextDirection = { x: 0,  y: -1 };
  if (newDir === 'down'  && direction.y === 0) nextDirection = { x: 0,  y: 1  };
  if (newDir === 'left'  && direction.x === 0) nextDirection = { x: -1, y: 0  };
  if (newDir === 'right' && direction.x === 0) nextDirection = { x: 1,  y: 0  };
}

// control keyboard
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  if (key === 'arrowup')    setDirection('up');
  if (key === 'arrowdown')  setDirection('down');
  if (key === 'arrowleft')  setDirection('left');
  if (key === 'arrowright') setDirection('right');

  // Cegah scroll halaman
  if (['arrowup','arrowdown','arrowleft','arrowright'].includes(key)) {
    e.preventDefault();
  }
});


// swipe untuk control mobile

let touchStartX = 0;
let touchStartY = 0;
let swipeTriggered = false;
const SWIPE_THRESHOLD = 25; // minimal geser (px)

canvas.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  swipeTriggered = false;
}, { passive: true });

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault(); // cegah scroll halaman

  if (swipeTriggered) return;

  const touch = e.touches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;

  // Abaikan swipe terlalu pendek
  if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

  // Arah dominan
  if (Math.abs(dx) > Math.abs(dy)) {
    setDirection(dx > 0 ? 'right' : 'left');
  } else {
    setDirection(dy > 0 ? 'down' : 'up');
  }

  swipeTriggered = true; // kunci sampai jari diangkat
}, { passive: false });

canvas.addEventListener('touchend', () => {
  swipeTriggered = false;
});

// input nama pemain, isi awalnya diambil dari storage.js
const nameInput = document.getElementById('playerName');
nameInput.value = getPlayerName();

// start
startBtn.addEventListener('click', () => {
  if (isRunning) return;
  setPlayerName(nameInput.value); // simpan nama sebelum main
  init();
  isRunning = true;
  clearInterval(gameLoop);
  gameLoop = setInterval(update, 120);
});


// pause
pauseBtn.addEventListener('click', () => {
  if (!isRunning) return;

  if (gameLoop) {
    clearInterval(gameLoop);
    gameLoop = null;
    pauseBtn.textContent = 'Lanjut';
  } else {
    gameLoop = setInterval(update, 120);
    pauseBtn.textContent = 'Pause';
  }
});

//render awalnya
init(); 