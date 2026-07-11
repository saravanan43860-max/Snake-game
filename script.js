const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- CONFIGURATION ---
let snake = [{ x: 100, y: 100 }]; // Array of body parts
const segments = 10;              // Initial length
let target = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
let mouse = { x: 100, y: 100 };
let score = 0;

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animate() {
    // 1. Move Head toward mouse
    let head = snake[0];
    head.x += (mouse.x - head.x) * 0.15;
    head.y += (mouse.y - head.y) * 0.15;

    // 2. Move body segments (each follows the one before it)
    for (let i = 1; i < snake.length; i++) {
        let prev = snake[i - 1];
        let curr = snake[i];
        let dx = prev.x - curr.x;
        let dy = prev.y - curr.y;
        let dist = Math.hypot(dx, dy);
        
        // Keep distance of 15px between segments
        if (dist > 15) {
            let angle = Math.atan2(dy, dx);
            curr.x = prev.x - Math.cos(angle) * 15;
            curr.y = prev.y - Math.sin(angle) * 15;
        }
    }

    // 3. Collision Logic
    if (Math.hypot(head.x - target.x, head.y - target.y) < 30) {
        score++;
        target.x = Math.random() * (canvas.width - 50) + 25;
        target.y = Math.random() * (canvas.height - 50) + 25;
        // Grow: Add a new segment at the tail's position
        let tail = snake[snake.length - 1];
        snake.push({ x: tail.x, y: tail.y });
    }

    // --- DRAWING ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Target
    ctx.fillStyle = "#ff0055";
    ctx.beginPath();
    ctx.arc(target.x, target.y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw Snake
    ctx.strokeStyle = "#44ff44";
    ctx.lineWidth = 15;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(snake[0].x, snake[0].y);
    for (let i = 1; i < snake.length; i++) {
        ctx.lineTo(snake[i].x, snake[i].y);
    }
    ctx.stroke();

    // Draw Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);

    requestAnimationFrame(animate);
}

// Initialize snake body
for (let i = 0; i < segments; i++) snake.push({ x: 100, y: 100 });

animate();