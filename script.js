// JS For Snake Game

// == DOM ===

const root = document.documentElement;
const scoreEl = document.getElementById("score-el");
const highScoreEl = document.getElementById("h-score-el");
const finalScoreEl = document.getElementById("final-score-el");
const gridEl = document.getElementById("grid");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const menuBtn = document.getElementById("menu-btn");
const difficultyBtn = document.getElementById("difficulty-btn");
const easyBtn = document.getElementById("easy-btn");
const mediumBtn = document.getElementById("medium-btn");
const hardBtn = document.getElementById("hard-btn");

const newGameModal = document.getElementById("new-game-modal");
const gameOverModal = document.getElementById("game-over-modal");
const difficultyModal = document.getElementById("difficulty-modal");
let timerId = 0;

const eatAudio = new Audio("audio/snake-eat.wav");
const wallHit = new Audio("audio/wall-hit.wav");


// == OBJECTS ==

let snake = {
    currentPos: [],
    direction: 1, // Can be w - up, s - down, a - left or d - right
    canMove: true,
    score: 0,
    highScore: 0,
    difficulty: "e", // e - easy, m - medium, h - hard
    snakeSpeed: 300, // Initial speed of snake
    speedFactor: 0.95 // Snake gets faster by 5%
};

let grid = {
    gridSquares: [],
    gridEl: document.getElementById("grid"),
    width: 16,
    applePos: -1
};

let difficulty = {
    easy: [400, 2],
    medium: [250, 1],
    hard: [150, 1]
};

// Retrieve high score from local storage
if (localStorage.getItem("highScore")){
      snake.highScore = localStorage.getItem("highScore");
      highScoreEl.textContent = snake.highScore;
}


// == FUNCTIONS ==

// Set the grid size based on screen size, supports displays down to 256px wide
function setGridSize(){
    let screenWidth = screen.width;

    if (screenWidth >= 512){
        root.style.setProperty("--gridWidth", "512px");
    }
    else if (screenWidth >= 320){
        root.style.setProperty("--gridWidth", "320px");
    }
    else if (screenWidth > 0){
        root.style.setProperty("--gridWidth", "256px");
    }
    // Border added to stop a line appearing across screen at START
    grid.gridEl.style.setProperty("border", "2px #525252 solid");
}

// Construct the grid using 16x16 squares.
function constructGrid(){
    for (let i = 0; i < grid.width*grid.width; i++){
        // create a 'square', give it the class 'square' and add it to the grid
        const square = document.createElement('div');
        square.classList.add("square");
        grid.gridEl.appendChild(square);
        grid.gridSquares.push(square);
    }
}

// Initialize snake and draw it on board
function drawSnake(){
    // Pick initial position of snake
    snake.currentPos = [116, 115, 114];

    // Add the snake class to the corresponding grids
    for (let i = 0; i < snake.currentPos.length; i++){
        grid.gridSquares[snake.currentPos[i]].classList.add("snake");
    }
}

// Check for collisions with the wall or itself (game over condition)
// returns 1 if collision with wall/itself has been detected
// returns 2 if collision with apple detected
// otherwise returns 0
function checkCollision(){
    let w = grid.width;
    let d = snake.direction;

    // If collision with wall or itself
    if ((snake.currentPos[0] + w >= w*w && d === w) ||
        (snake.currentPos[0] % w === w-1 && d === 1) ||
        (snake.currentPos[0] % w === 0 && d === -1) ||
        (snake.currentPos[0] - w < 0 && d === -w) ||
        grid.gridSquares[snake.currentPos[0] +
        d].classList.contains('snake')){
            wallHit.play();
            return 1;
        }

    // If collision with Apple return 2
    else if (snake.currentPos[0] === grid.applePos){
        eatAudio.play();
        return 2;
    }

    return 0;
}

// Generate an apple in a random position not held by the snake and return
// its position
function generateApple(){
    let randNum = snake.currentPos[0];
    while(snake.currentPos.includes(randNum)){
        randNum = Math.floor(Math.random()*(grid.width*grid.width));
    }
    grid.applePos = randNum;
    return randNum;
}

// Call generate apple, then draw the apple on the board
function drawApple(){
    let appleIndex = generateApple();
    grid.gridSquares[appleIndex].classList.add("apple");
}

function growSnake(tail){
    snake.currentPos.push(tail);
    grid.gridSquares[tail].classList.add("snake");
}


// Calculate next iteration of game
// Generate and Draw Apple at the start
// Move the snake 1 unit in its current direction
// Stop snake movement if collision is detected
function iterateGame(){
    snake.canMove = true;
    let collisionId = checkCollision();
    if (collisionId === 1){
        // Set high score if highest score and save it to local storage
        if (snake.score > snake.highScore){
            snake.highScore = snake.score;
            highScoreEl.textContent = snake.highScore;
            saveHighScore();
        }
        gameOverModal.style.setProperty("display", "block");
        return clearInterval(timerId);
    }
    // if collision with apple
    else if (collisionId === 2){
        grid.gridSquares[grid.applePos].classList.remove("apple");

        // Make snake faster to an acceptable threshold
        if (snake.snakeSpeed > 100){
            clearInterval(timerId);
            snake.snakeSpeed -= snake.speedFactor;
            timerId = setInterval(iterateGame, snake.snakeSpeed);
        }

        // Reset apple position
        grid.applePos = -1;
        snake.score += 1;
        scoreEl.textContent = snake.score;
        finalScoreEl.textContent = snake.score;
    }
    if (grid.applePos < 0){
        drawApple();
    }
    // Remove the last element of the snake
    const tail = snake.currentPos.pop();
    grid.gridSquares[tail].classList.remove("snake");

    // Grow snake while moving to always ensure tail is valid only if apple
    // collision is detected
    if (collisionId === 2){
        growSnake(tail);
    }

    // Add it to the front of the Snake
    snake.currentPos.unshift(snake.currentPos[0] + snake.direction)
    grid.gridSquares[snake.currentPos[0]].classList.add("snake");
}

// Reset the game back to it's initial state
function resetGame(){
    for (let item of snake.currentPos){
        grid.gridSquares[item].classList.remove("snake");
    }
    snake.currentPos = [];
    snake.direction = 1;
    snake.score = 0;

    if (snake.difficulty === "e"){
        snake.snakeSpeed = difficulty.easy[0];
    }
    else if (snake.difficulty === "m"){
        snake.snakeSpeed = difficulty.medium[0];
    }
    else if (snake.difficulty === "h"){
        snake.snakeSpeed = difficulty.hard[0];
    }

    scoreEl.textContent = 0;
}

// Save the current high score to local storage
function saveHighScore(){
  localStorage.setItem("highScore", snake.highScore);
}

// Back to Main Menu
function mainMenu(){
    resetGame();
    gameOverModal.style.setProperty("display", "none");
    difficultyModal.style.setProperty("display", "none");
    drawSnake();
    newGameModal.style.setProperty("display", "block");
}

// Start game
function startGame(){
    timerId = setInterval(iterateGame, snake.snakeSpeed);
    newGameModal.style.setProperty("display", "none");
    difficultyModal.style.setProperty("display", "none");
}

// == EVENT LISTENERS ==

// Add event listener/function to control the snake
document.addEventListener("keydown", function(event){
    if (snake.canMove){
        if ((event.code === "KeyW" || event.code === "ArrowUp") &&
        (snake.direction != grid.width)){
            snake.direction = -grid.width;
            snake.canMove = false;
        } else if ((event.code === "KeyS" || event.code === "ArrowDown") &&
        (snake.direction != -grid.width)){
            snake.direction = grid.width;
            snake.canMove = false;
        } else if ((event.code === "KeyA" || event.code === "ArrowLeft") &&
        (snake.direction != 1)){
            snake.direction = -1;
            snake.canMove = false;
        } else if ((event.code === "KeyD" || event.code === "ArrowRight") &&
        (snake.direction != -1)){
            snake.direction = 1;
            snake.canMove = false;
        }
    }
})

// Listen for swipe (for mobile controls) using hammer.js
let swipeListener = new Hammer(gridEl);
swipeListener.get('pan').set({direction: Hammer.DIRECTION_ALL});
swipeListener.get('pan').set({threshold: 20});

swipeListener.on("panup", function(){
    if (snake.direction != grid.width){
        snake.direction = -grid.width;
    }
});
swipeListener.on("pandown", function(){
    if (snake.direction != -grid.width){
        snake.direction = grid.width;
    }
});
swipeListener.on("panleft", function(){
    if (snake.direction != 1){
        snake.direction = -1;
    }
});
swipeListener.on("panright", function(){
    if (snake.direction != -1){
        snake.direction = 1;
    }
});

// Restart button
restartBtn.addEventListener("click", function(){
    resetGame();
    drawSnake();
    gameOverModal.style.setProperty("display", "none");
    timerId = setInterval(iterateGame, snake.snakeSpeed);
})

// Main Menu button
menuBtn.addEventListener("click", function(){
    resetGame();
    gameOverModal.style.setProperty("display", "none");
    drawSnake();
    newGameModal.style.setProperty("display", "block");
})

// Difficulty Navigation button
difficultyBtn.addEventListener("click", function(){
    newGameModal.style.setProperty("display", "none");
    difficultyModal.style.setProperty("display", "block");
})

// Difficulty Selector buttons
easyBtn.addEventListener("click", function(){
    easyBtn.style.setProperty("background", "firebrick");
    mediumBtn.style.setProperty("background", "rgb(250, 125, 193)")
    hardBtn.style.setProperty("background", "rgb(250, 125, 193)")
    snake.difficulty = "e";
    snake.snakeSpeed = difficulty.easy[0];
    snake.speedFactor = difficulty.easy[1];
})

mediumBtn.addEventListener("click", function(){
    mediumBtn.style.setProperty("background", "firebrick");
    easyBtn.style.setProperty("background", "rgb(250, 125, 193)")
    hardBtn.style.setProperty("background", "rgb(250, 125, 193)")
    snake.difficulty = "m";
    snake.snakeSpeed = difficulty.medium[0];
    snake.speedFactor = difficulty.medium[1];
})

hardBtn.addEventListener("click", function(){
    hardBtn.style.setProperty("background", "firebrick");
    easyBtn.style.setProperty("background", "rgb(250, 125, 193)")
    mediumBtn.style.setProperty("background", "rgb(250, 125, 193)")
    snake.difficulty = "h";
    snake.snakeSpeed = difficulty.hard[0];
    snake.speedFactor = difficulty.hard[1];
})

setGridSize();
constructGrid();
drawSnake();
