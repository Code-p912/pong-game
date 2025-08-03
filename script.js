const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PLAYER_X = 20;
const AI_X = canvas.width - 20 - PADDLE_WIDTH;

// Game objects
let player = {
    x: PLAYER_X,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    score: 0
};

let ai = {
    x: AI_X,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    score: 0,
    speed: 4
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 6 * (Math.random() > 0.5 ? 1 : -1),
    vy: 4 * (Math.random() > 0.5 ? 1 : -1),
    radius: BALL_RADIUS
};

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 6 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 4;
    for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, i);
        ctx.lineTo(canvas.width / 2, i + 15);
        ctx.stroke();
    }
}

function drawScore() {
    ctx.font = "36px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(player.score, canvas.width / 4, 50);
    ctx.fillText(ai.score, 3 * canvas.width / 4, 50);
}

function draw() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#222");
    drawNet();
    drawScore();

    // Paddles
    drawRect(player.x, player.y, player.width, player.height, "#fff");
    drawRect(ai.x, ai.y, ai.width, ai.height, "#fff");
    // Ball
    drawCircle(ball.x, ball.y, ball.radius, "#fff");
}

// Mouse Movement for Player Paddle
canvas.addEventListener('mousemove', function(evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Clamp
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
});

// Simple AI Movement
function moveAI() {
    let target = ball.y - ai.height / 2;
    if (ai.y < target) {
        ai.y += ai.speed;
        if (ai.y > target) ai.y = target;
    } else if (ai.y > target) {
        ai.y -= ai.speed;
        if (ai.y < target) ai.y = target;
    }
    // Clamp
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;
}

// Collision Detection
function collision(paddle, ball) {
    return (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.y + ball.radius > paddle.y
    );
}

function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall collision (top and bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.vy = -ball.vy;
    }

    // Left paddle collision
    if (collision(player, ball)) {
        ball.x = player.x + player.width + ball.radius; // prevent sticking
        ball.vx = -ball.vx;
        // Add a bit of "english"
        let collidePoint = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        ball.vy = 5 * collidePoint;
    }

    // Right paddle collision
    if (collision(ai, ball)) {
        ball.x = ai.x - ball.radius; // prevent sticking
        ball.vx = -ball.vx;
        let collidePoint = (ball.y - (ai.y + ai.height / 2)) / (ai.height / 2);
        ball.vy = 5 * collidePoint;
    }

    // Score
    if (ball.x - ball.radius < 0) {
        ai.score++;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }

    moveAI();
}

function game() {
    update();
    draw();
    requestAnimationFrame(game);
}

game();