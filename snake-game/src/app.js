const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.style.position = 'absolute';
canvas.style.top = '50%';
canvas.style.left = '50%';
canvas.style.transform = 'translate(-50%, -50%)';

const box = 20;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const GRID_ROWS = CANVAS_HEIGHT / box;
const GRID_COLS = CANVAS_WIDTH / box;
const WALL_OFFSET_TOP = 0;
const WALL_OFFSET_BOTTOM = CANVAS_HEIGHT - box;
const WALL_OFFSET_LEFT = 0;
const WALL_OFFSET_RIGHT = CANVAS_WIDTH - box;

let snake = [{ x: 9 * box, y: 9 * box }];
let direction;
let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
};
let directionChanged = false; // Flag to track direction change
let foodCounter = 0; // Initialize food counter

const foodCounterElement = document.getElementById('foodCounter'); // Get the food counter element

foodCounterElement.style.position = 'absolute';
foodCounterElement.style.top = '10px';
foodCounterElement.style.left = '50%';
foodCounterElement.style.transform = 'translateX(-50%)';
foodCounterElement.style.fontSize = '30px';
foodCounterElement.style.color = 'black';

document.addEventListener('keydown', directionControl);

function directionControl(event) {
    if (directionChanged) return; // Prevent multiple direction changes in one loop

    if (event.keyCode === 37 && direction !== 'RIGHT' && direction !== 'LEFT') {
        direction = 'LEFT';
    } else if (event.keyCode === 38 && direction !== 'DOWN' && direction !== 'UP') {
        direction = 'UP';
    } else if (event.keyCode === 39 && direction !== 'LEFT' && direction !== 'RIGHT') {
        direction = 'RIGHT';
    } else if (event.keyCode === 40 && direction !== 'UP' && direction !== 'DOWN') {
        direction = 'DOWN';
    }

    directionChanged = true; // Mark direction as changed
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            console.log('Collision detected');
            return true;
        }
    }
    
    return false;
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < canvas.height / box; row++) {
        for (let col = 0; col < canvas.width / box; col++) {
            ctx.strokeStyle = 'green';
            ctx.strokeRect(col * box, row * box, box, box);
        }
    }

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'red' : 'red';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'red';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'darkblue';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        foodCounter++;
        foodCounterElement.textContent = `Food Consumed: ${foodCounter}`; // Update the GUI counter
        console.log('Food Consumed:', foodCounter);
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    let hitLeftWall = snakeX < WALL_OFFSET_LEFT;
    let hitRightWall = snakeX > WALL_OFFSET_RIGHT;
    let hitTopWall = snakeY < WALL_OFFSET_TOP;
    let hitBottomWall = snakeY > WALL_OFFSET_BOTTOM;
    let hitWall = hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    let hitSelf = collision(newHead, snake);

    if (hitWall || hitSelf) {
        console.log('Game Over');
        console.log('Snake:', snake);
        console.log('Direction:', direction);
        console.log('Food:', food);
        console.log('Snake Head Position:', newHead);
        console.log('SnakeX:', snakeX);
        console.log('SnakeY:', snakeY);
        console.log('Box Size:', box);
        console.log('Hit Wall:', hitWall);
        console.log('Hit Left Wall:', hitLeftWall);
        console.log('Hit Right Wall:', hitRightWall);
        console.log('Hit Top Wall:', hitTopWall);
        console.log('Hit Bottom Wall:', hitBottomWall);
        console.log('Hit Self:', hitSelf);
        clearInterval(game);
        showGameOverAnimation(); // Show game over animation
    }

    snake.unshift(newHead);

    directionChanged = false; // Reset the flag at the end of the loop
}

function showGameOverAnimation() {
    const gameOverText = document.createElement('div');
    gameOverText.textContent = 'Game Over';
    gameOverText.style.position = 'absolute';
    gameOverText.style.top = '50%';
    gameOverText.style.left = '50%';
    gameOverText.style.transform = 'translate(-50%, -50%)';
    gameOverText.style.fontSize = '48px';
    gameOverText.style.color = 'red';
    gameOverText.style.fontWeight = 'bold';
    gameOverText.style.animation = 'fadeInOut 2s infinite';
    gameOverText.style.backgroundColor = 'black';
    gameOverText.style.padding = '30px';
    gameOverText.style.borderRadius = '40px';
    document.body.appendChild(gameOverText);

    // Add keyframes for animation
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
    `, styleSheet.cssRules.length);
}

let game = setInterval(draw, 100);