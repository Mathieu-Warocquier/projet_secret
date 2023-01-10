// chargement des effets sonores

const WALL_HIT = new Audio("sounds/wall.mp3");
const PADDLE_HIT = new Audio("sounds/paddle_hit.mp3");
const BRICK_HIT = new Audio("sounds/brick_hit.mp3");
const WIN = new Audio("sounds/win.mp3");
const LIFE_LOST = new Audio("sounds/life_lost1.mp3");


// chargement des images

const LEVEL_IMG = new Image();
LEVEL_IMG.src = "img/level1.png";
const LIFE_IMG = new Image();
LIFE_IMG.src = "img/life2.png";
const SCORE_IMG = new Image();
SCORE_IMG.src = "img/score1.png";
