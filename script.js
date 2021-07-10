// JS For Snake Game

const root = document.documentElement;
const startBtn = document.getElementById("start-btn");
let timerId = 0;


let snake = {
    currentPos: [],
    direction: 1 // Can be w - up, s - down, a - left or d - right
}

let grid = {
    gridSquares: [],
    gridEl: document.getElementById("grid"),
    width: 16
}

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
    snake.currentPos = [2, 1, 0];

    // Add the snake class to the corresponding grids
    for (let i = 0; i < snake.currentPos.length; i++){
        grid.gridSquares[i].classList.add("snake");
    }
}


// Move the snake 1 unit in its current direction
// Stop snake movement if collision is detected
function moveSnake(){
    if (checkCollision()){
        return clearInterval(timerId);
    }
    // Remove the last element of the snake
    const tail = snake.currentPos.pop();
    grid.gridSquares[tail].classList.remove("snake");

    // Add it to the front of the Snake
    snake.currentPos.unshift(snake.currentPos[0] + snake.direction)
    grid.gridSquares[snake.currentPos[0]].classList.add("snake");
}


// Check for collisions with the wall or itself (game over condition)
// returns 1 if collision has been detected, otherwise returns 0
function checkCollision(timerId){
    let w = grid.width;
    let d = snake.direction;
    if ((snake.currentPos[0] + w >= w*w && d === w) ||
        (snake.currentPos[0] % w === w-1 && d === 1) ||
        (snake.currentPos[0] % w === 0 && d === -1) ||
        (snake.currentPos[0] - w < 0 && d === -w) ||
        grid.gridSquares[snake.currentPos[0] +
        d].classList.contains('snake')){
            return 1;
        }
    return 0;
}


// Add event listener/function to control the snake
document.addEventListener('keydown', function(event){
    if (event.code === "KeyW" || event.code === "ArrowUp") {
        snake.direction = -grid.width;
    } else if (event.code === "KeyS" || event.code === "ArrowDown") {
        snake.direction = grid.width;
    } else if (event.code === "KeyA" || event.code === "ArrowLeft") {
        snake.direction = -1;
    } else if (event.code === "KeyD" || event.code === "ArrowRight") {
        snake.direction = 1;
    }
})

// Start button
startBtn.addEventListener('click', function(){
    timerId = setInterval(moveSnake, 100);
})

setGridSize();
constructGrid();
drawSnake();
