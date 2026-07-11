const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- CONFIGURATION ---
let snake, velocity, target, score, gameOver;
const wallPadding = 10; // Space between wall and edge

function initGame() {
    snake = [{ x: 100, y: 100 }];
    for (let i = 0; i < 20; i++) snake.push({ x: 100, y: 100 });
    velocity = { x: 2, y: 0 };
    target = { 
        x: Math.random() * (canvas.width - 100) + 50, 
        y: Math.random() * (canvas.height - 100) + 50 
    };
    score = 0;
    gameOver = false;
}

window.addEventListener("mousemove", (e) => {
    if (gameOver) return;
    let dx = e.clientX - snake[0].x;
    let dy = e.clientY - snake[0].y;
    let angle = Math.atan2(dy, dx);
    let speed = 3;
    velocity.x = Math.cos(angle) * speed;
    velocity.y = Math.sin(angle) * speed;
});

window.addEventListener("touchmove", (e) => {
    if (gameOver) return;
    if (e.touches.length === 0) return;
    let touch = e.touches[0];
    let dx = touch.clientX - snake[0].x;
    let dy = touch.clientY - snake[0].y;
    let angle = Math.atan2(dy, dx);
    let speed = 3;
    velocity.x = Math.cos(angle) * speed;
    velocity.y = Math.sin(angle) * speed;
    e.preventDefault();
}, { passive: false });

window.addEventListener("mousedown", () => {
    if (gameOver) initGame();
});

window.addEventListener("touchstart", (e) => {
    if (gameOver) {
        initGame();
        e.preventDefault();
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Visible Wall
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.strokeRect(wallPadding, wallPadding, canvas.width - wallPadding * 2, canvas.height - wallPadding * 2);

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Click to Restart", canvas.width / 2, canvas.height / 2 + 50);
        requestAnimationFrame(animate);
        return;
    }

    // Move Head
    let head = snake[0];
    head.x += velocity.x;
    head.y += velocity.y;

    // Wall Collision Check (using padded area)
    if (head.x < wallPadding || head.x > canvas.width - wallPadding || 
        head.y < wallPadding || head.y > canvas.height - wallPadding) {
        gameOver = true;
    }

    // Move body
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }

    // Collision with Target
    if (Math.hypot(head.x - target.x, head.y - target.y) < 25) {
        score++;
        target.x = Math.random() * (canvas.width - 100) + 50;
        target.y = Math.random() * (canvas.height - 100) + 50;
        for (let i = 0; i < 5; i++) {
            snake.push({ ...snake[snake.length - 1] });
        }
    }

    // Draw Target
    ctx.fillStyle = "#ff0055";
    ctx.beginPath();
    ctx.arc(target.x, target.y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw Snake
    ctx.strokeStyle = "#44ff44";
    ctx.lineWidth = 15;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(snake[0].x, snake[0].y);
    for (let i = 1; i < snake.length; i++) {
        ctx.lineTo(snake[i].x, snake[i].y);
    }
    ctx.stroke();

    // Draw Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 30, 40);

    requestAnimationFrame(animate);
}

initGame();
animate();