// JS For Snake Game

const root = document.documentElement;


let snake = {
    currentPos: [0,1,2],
    direction: "w" // Can be w - up, s - down, a - left or d - right
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

function drawSnake(){
    for (let i = 0; i < snake.currentPos.length; i++){
        grid.gridSquares[i].classList.add("snake");
    }
}

setGridSize();
constructGrid();
drawSnake();
