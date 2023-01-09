// Initialisation du canvas

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.style.border = '5px solid #6198d8';
ctx.lineWidth = 1;

// constantes nécessaires

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const PADDLE_MARGIN_BOTTOM = 20;

// variables nécessaires

let leftArrow = false;
let rightArrow = false;


// créer la planche

const paddle = {
  x: (canvas.width / 2) - (PADDLE_WIDTH / 2),
  y: canvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
  w: PADDLE_WIDTH,
  h: PADDLE_HEIGHT,
  dx: 8
}

// dessinner la planche

function dramPaddle() {
  ctx.beginPath();
  ctx.fillStyle = '#fff';
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.strokeStyle = '6198d8';
  ctx.strokeRect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.closePath();
}

dramPaddle();

// Mise en place des touches de contrôle

document.addEventListener("keydown", (e) => {
  if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftArrow = true;
  } else if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightArrow = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftArrow = false;
  } else if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightArrow = false;
  }
});

// Annimation planche

function movePaddle() {
  if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  } else if (rightArrow && paddle.x + paddle.w < canvas.width) {
    paddle.x += paddle.dx;
  }
}

function loop() {
  ctx.clearRect( 0, 0, canvas.width, canvas.height);
  dramPaddle();  // dessinner la planche
  movePaddle();   // Annimation planche
  requestAnimationFrame(loop);  // Annimation canvas
}

loop();




const rules = document.getElementById('rules');
const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');

// affichage des régles du jeu

rulesBtn.addEventListener("click", (event) => { rules.classList.add('show')
});

closeBtn.addEventListener("click", (event) => { rules.classList.remove('show')
});
