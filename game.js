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
const SCORE_UNIT = 10;
const MAX_LEVEL = 3;



// variables nécessaires

let leftArrow = false;
let rightArrow = false;
let gameOver = false;
let isPaused = false;
let life = 3;
let score = 0;
let level = 1;

// créer la planche

const paddle = {
  x: (canvas.width / 2) - (PADDLE_WIDTH / 2),
  y: canvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
  w: PADDLE_WIDTH,
  h: PADDLE_HEIGHT,
  dx: 8
}

// dessinner la planche

function drawPaddle() {
  ctx.beginPath();
  ctx.fillStyle = '#fff';
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.strokeStyle = '6198d8';
  ctx.strokeRect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.closePath();
}


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
    WALL_HIT.play();
    ball.dx *= -1; // inverse la trajectoire
  }
  // collision sur les axes supp de y
  if (ball.y - ball.radius < 0) {
    WALL_HIT.play();
    ball.dy *= -1;
  }
  // collision sur les axes inf de y (perte de vie)
  if (ball.y + ball.radius > canvas.height) {
    LIFE_LOST.play();
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

      PADDLE_HIT.play();

      let collidePoint = ball.x - (paddle.x + paddle.w / 2); // faire que les collisions soient aléatoire
      collidePoint = collidePoint / (paddle.w / 2);

      let angle = collidePoint * Math.PI/3;

    ball.dx = ball.velocity * Math.sin(angle);
    ball.dy = -ball.velocity * Math.cos(angle);

  }
}

// créer les propriètés des briques

const brickProp = {
  row: 2,
  column: 13,
  w: 35,
  h: 10,
  padding: 3,
  offsetX: 55,
  offsetY: 40,
  fillColor: '#fff',
  visible: true,
}

// stocker les briques dans un tableau

let bricks = [];
function createBricks() {
  for (let r = 0; r < brickProp.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brickProp.column; c++) {
      bricks[r][c] = {
        x: c * (brickProp.w + brickProp.padding) + brickProp.offsetX,
        y: r * (brickProp.h + brickProp.padding) + brickProp.offsetY,
        status: true,
        ...brickProp
      }
    }
  }
}
createBricks();

// dessiner les briques

function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.status) {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.w, brick.h);
        ctx.fillStyle = brick.fillColor;
        ctx.fill();
        ctx.closePath();
      }
    })
  })
}

// collision balle bricks

function bbCollission() {
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.status) {
        if (ball.x + ball.radius > brick.x &&
          ball.x - ball.radius < brick.x + brick.w &&
          ball.y + ball.radius > brick.y &&
          ball.y - ball.radius < brick.y + brick.h) {

          BRICK_HIT.play();
          ball.dy *= -1;
          brick.status = false;
          score+= SCORE_UNIT;
        }
      }
    })
  })
}

// affichage des statistiques de jeu

function showStats(img, iPosX, iPosY, text = '', tPosX = null, tPosY = null) {
  ctx.fillStyle = '#fff';
  ctx.font = '2Opx Roboto';
  ctx.fillText(text, tPosX, tPosY)
  ctx.drawImage(img, iPosX, iPosY, width = 20, height = 20)
}

// gestion fin partie

function gameover() {
  if (life <= 0) {
    showEndInfo('lose');
    gameOver = true;
  }
}

// passer au niveau suivant

function nextLevel() {
  let isLevelUp = true;

  for (let r = 0; r < brickProp.row; r++) {
    for (let c = 0; c < brickProp.column; c++) {
      isLevelUp = isLevelUp && !bricks[r][c].status;
    }
  }

  if (isLevelUp) {
    WIN.play();
    if (level >= MAX_LEVEL) {
      showEndInfo();
      gameOver = true;
      return;
    }

    brickProp.row += 2;
    createBricks();
    ball.velocity += 0.5;
    resetBall();
    resetPaddle();
    level++;
  }
}

// refacto toutes les fct qui on pour but de dessiner
function draw() {
  drawPaddle();  // dessinner la planche
  drawBall(); // dessinner la balle
  drawBricks(); // dessinner les briques
  showStats(SCORE_IMG, canvas.width - 100, 5, score, canvas.width - 65, 22);
  showStats(LIFE_IMG, 35, 5, life, 70 , 22);
  showStats(LEVEL_IMG, canvas.width/2 - 25, 5, level, canvas.width/2, 22);
}

// refacto toutes les fct liées aux animations
function move() {
  movePaddle();   // Annimation planche
  moveBall(); // mouvement de la balle
  bwCollission(); // collision de la balle avec murs
  bpCollission(); // collision de la balle avec planche
  bbCollission(); // collision de la balle avec briques
  gameover(); // gestion fin partie
  nextLevel(); // passer au niveau suivant
}

function loop() {
  ctx.clearRect( 0, 0, canvas.width, canvas.height);
  if (!isPaused) {
    draw();
    move();
  }

  if (!gameOver) {
    requestAnimationFrame(loop);  // Annimation canvas
  }
}

loop();

// gestion elements audio

const sound = document.getElementById('sound');
sound.addEventListener('click', audioManager);

function audioManager() {
  // changer l'image
  let imgSrc = sound.getAttribute('src');
  let SOUND_IMG = imgSrc === 'img/sound_on.png' ? 'img/mute.png' : 'img/sound_on.png';
  sound.setAttribute('src', SOUND_IMG);

  WALL_HIT.muted = !WALL_HIT.muted;
  PADDLE_HIT.muted = !PADDLE_HIT.muted;
  BRICK_HIT.muted = !BRICK_HIT.muted;
  WIN_HIT.muted = !WIN_HIT.muted;
  LIFE_LOST.muted = !LIFE_LOST.muted;
}

// importation des elements du DOM

const rules = document.getElementById('rules');
const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const game_over = document.getElementById('game-over');
const youWon = document.getElementById('you-won');
const youLose = document.getElementById('you-lose');
const restart = document.getElementById('restart');

// affichage des régles du jeu

rulesBtn.addEventListener("click", (event) => {
  rules.classList.add('show');
  isPaused = true;
});

closeBtn.addEventListener("click", (event) => {
  rules.classList.remove('show');
  isPaused = false;
});

// affichage des infos de fin de partie

function showEndInfo(type = 'win') {
  game_over.style.visibility = 'visible';
  game_over.style.opacity = '1';

  if (type === 'win') {
    youWon.style.visibility = 'visible';
    youLose.style.visibility = 'hidden';
    youLose.style.opacity = '0';
  } else {
    youWon.style.visibility = 'hidden';
    youWon.style.opacity = '0';
    youLose.style.visibility = 'visible';
  }
}

// relancer la partie

restart.addEventListener('click', () => {
  location.reload();
})
