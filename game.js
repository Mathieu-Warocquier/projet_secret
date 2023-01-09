// Initialisation du canvas

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.style.border = '5px solid #6198d8';
ctx.lineWidth = 1;

// constantes nécessaires

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const PADDLE_MARGIN_BOTTOM = 20;
const BALL_RADIUS = 5;

const rules = document.getElementById('rules');
const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');

// variables nécessaires

let leftArrow = false;
let rightArrow = false;
let life = 3;

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


// créer la balle

const ball = {
  x: canvas.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  velocity: 7, // vitesse de la balle
  dx: 3 * (Math.random() * 2 - 1), // déplacement suivant l'axe de x
  dy: -3, // déplacement suivant l'axe de y
}

// dessiner la balle

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#fff'
  ctx.fill();
  ctx.strokeStyle = '#6198d8'
  ctx.stroke();
  ctx.closePath();
}

// mouvement de la balle

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

// interaction ball et murs

function bwCollission() {
  // collision sur les axes de x
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1; // inverse la trajectoire
  }
  // collision sur les axes supp de y
  if (ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }
  // collision sur les axes inf de y (perte de vie)
  if (ball.y + ball.radius > canvas.height) {
    life--;
    resetBall();
    resetPaddle();
  }
}

// reset la balle et le paddle

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = paddle.y - BALL_RADIUS;
  ball.dx = 3 * (Math.random() * 2 - 1); // déplacement suivant l'axe de x aléatoire
  ball.dy = -3 // déplacement suivant l'axe de y
}

function resetPaddle() {
  paddle.x = (canvas.width / 2) - (PADDLE_WIDTH / 2);
  paddle.y = canvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT;
}

// interaction avec la planche et la balle

function bpCollission() {
  if (ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.w && ball.y + ball.radius > paddle.y) {

      let collidePoint = ball.x - (paddle.x + paddle.w / 2); // faire que les collisions soient aléatoire

    ball.dx = ball.velocity;
    ball.dy = -ball.velocity;

  }
}



// affichage des régles du jeu

rulesBtn.addEventListener("click", (event) => { rules.classList.add('show')
});

closeBtn.addEventListener("click", (event) => { rules.classList.remove('show')
});


function loop() {
  ctx.clearRect( 0, 0, canvas.width, canvas.height);
  dramPaddle();  // dessinner la planche
  drawBall(); // dessinner la balle
  movePaddle();   // Annimation planche
  moveBall(); // mouvement de la balle
  bwCollission(); // collision de la balle avec murs
  bpCollission(); // collision de la balle avec planche
  requestAnimationFrame(loop);  // Annimation canvas
}

loop();
