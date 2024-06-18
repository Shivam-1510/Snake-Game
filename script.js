let inputDir = {x: 0, y: 0}; 
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 19;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13, y: 15}
];

food = {x: 6, y: 7};

document.addEventListener('DOMContentLoaded', () => {
    let hiscore = localStorage.getItem("hiscore");
    if (hiscore === null) {
        hiscoreval = 0;
        localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
    } else {
        hiscoreval = JSON.parse(hiscore);
        hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
    }

    // Display the initial snake and food
    gameEngine();

    window.addEventListener('keydown', startGame, { once: true });

    // Touch events for mobile
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    window.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent the default scroll behavior
        let touchEndX = e.touches[0].clientX;
        let touchEndY = e.touches[0].clientY;
        handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
    });

    // Add button listeners for mobile
    document.getElementById('upBtn').addEventListener('click', () => handleDirection('ArrowUp'));
    document.getElementById('downBtn').addEventListener('click', () => handleDirection('ArrowDown'));
    document.getElementById('leftBtn').addEventListener('click', () => handleDirection('ArrowLeft'));
    document.getElementById('rightBtn').addEventListener('click', () => handleDirection('ArrowRight'));
});

function startGame(e) {
    e.preventDefault(); // Prevent the default scroll behavior
    musicSound.play();
    window.requestAnimationFrame(main);
    window.addEventListener('keydown', handleKeydown);
}

function main(ctime) {
    window.requestAnimationFrame(main);
    
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    for (let i = 1; i < snakeArr.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    
    if(snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0){
        return true;
    }
        
    return false;
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = {x: 0, y: 0}; 
        alert("Game Over. Press any key to play again!");
        snakeArr = [{x: 13, y: 15}];
        musicSound.play();
        score = 0; 
        scoreBox.innerHTML = "Score: " + score; 
    }

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random())};
    }

    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

function handleKeydown(e) {
    e.preventDefault(); 
    inputDir = {x: 0, y: 1}; 
    moveSound.play();
    handleDirection(e.key);
}

function handleDirection(direction) {
    switch (direction) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
}

function handleSwipe(startX, startY, endX, endY) {
    let diffX = endX - startX;
    let diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            handleDirection('ArrowRight');
        } else {
            handleDirection('ArrowLeft');
        }
    } else {
        if (diffY > 0) {
            handleDirection('ArrowDown');
        } else {
            handleDirection('ArrowUp');
        }
    }
}
