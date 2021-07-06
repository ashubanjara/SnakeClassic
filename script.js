
const grid = document.getElementById("grid");
const square = document.getElementsByClassName("");
const root = document.documentElement;


let snake = {
    currentPos: [],
    direction: "w" // Can be w - up, s - down, a - left or d - right
}

// Set the grid size based on screen size, supports displays down to 256px wide
function setGridSize(gridSize){
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
    grid.style.setProperty("border", "2px gray solid");
}

function constructGrid(){

}

setGridSize();
