const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 15, PADDLE_HEIGHT = 90;
const BALL_SIZE = 15;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 7;
const BALL_SPEED = 6;

// Paddle objects
let player = { x: PLAYER_X, y: (canvas.height - PADDLE_HEIGHT) / 2, width: PADDLE_WIDTH, height: PADDLE_HEIGHT, score: 0 };
let ai = { x: AI_X, y: (canvas.height - PADDLE_HEIGHT) / 2, width: PADDLE_WIDTH, height: PADDLE_HEIGHT, score: 0 };

// Ball object
let ball = {
  x: canvas.width / 2 - BALL_SIZE / 2,
  y: canvas.height / 2 - BALL_SIZE / 2,
  width: BALL_SIZE,
  height: BALL_SIZE,
  velX: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
  velY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1)
};

// Draw everything
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, size = 32) {
  ctx.fillStyle = '#00e0ff';
  ctx.font = `${size}px Segoe UI, Arial`;
  ctx.fillText(text, x, y);
}

function resetBall() {
  ball.x = canvas.width / 2 - BALL_SIZE / 2;
  ball.y = canvas.height / 2 - BALL_SIZE / 2;
  ball.velX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ball.velY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
  // Clear canvas
  drawRect(0, 0, canvas.width, canvas.height, '#222b3a');

  // Middle line
  for(let i = 0; i < canvas.height; i += 30) {
    drawRect(canvas.width / 2 - 2, i, 4, 18, '#00e0ff55');
  }

  // Paddles and ball
  drawRect(player.x, player.y, player.width, player.height, '#00e0ff');
  drawRect(ai.x, ai.y, ai.width, ai.height, '#00e0ff');
  drawRect(ball.x, ball.y, ball.width, ball.height, '#fff');

  // Scores
  drawText(player.score, canvas.width / 2 - 60, 60);
  drawText(ai.score, canvas.width / 2 + 40, 60);
}

function update() {
  // Move ball
  ball.x += ball.velX;
  ball.y += ball.velY;

  // Ball collision with top/bottom wall
  if (ball.y <= 0 || ball.y + BALL_SIZE >= canvas.height) {
    ball.velY = -ball.velY;
  }

  // Ball collision with player paddle
  if (
    ball.x <= player.x + player.width &&
    ball.y + BALL_SIZE >= player.y &&
    ball.y <= player.y + player.height
  ) {
    ball.velX = Math.abs(ball.velX);
    // Add a bit of "spin"
    let collidePoint = (ball.y + BALL_SIZE/2) - (player.y + player.height/2);
    collidePoint = collidePoint / (player.height/2);
    ball.velY = BALL_SPEED * collidePoint;
  }

  // Ball collision with AI paddle
  if (
    ball.x + BALL_SIZE >= ai.x &&
    ball.y + BALL_SIZE >= ai.y &&
    ball.y <= ai.y + ai.height
  ) {
    ball.velX = -Math.abs(ball.velX);
    // Add spin
    let collidePoint = (ball.y + BALL_SIZE/2) - (ai.y + ai.height/2);
    collidePoint = collidePoint / (ai.height/2);
    ball.velY = BALL_SPEED * collidePoint;
  }

  // Player scores
  if (ball.x + BALL_SIZE < 0) {
    ai.score++;
    resetBall();
  }
  // AI scores
  if (ball.x > canvas.width) {
    player.score++;
    resetBall();
  }

  // AI movement (basic)
  let aiCenter = ai.y + ai.height / 2;
  if (aiCenter < ball.y + BALL_SIZE / 2 - 10) {
    ai.y += PADDLE_SPEED;
  } else if (aiCenter > ball.y + BALL_SIZE / 2 + 10) {
    ai.y -= PADDLE_SPEED;
  }
  // Clamp AI paddle in bounds
  ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));
}

// Player paddle follows mouse Y
canvas.addEventListener('mousemove', function (evt) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = evt.clientY - rect.top;
  player.y = mouseY - player.height / 2;
  // Clamp in bounds
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
});

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Start game
loop();