let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 19;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
];
let food = { x: 6, y: 7 };
let gameStarted = false;
let hiscoreval = 0;

document.addEventListener('DOMContentLoaded', () => {
    let hiscore = localStorage.getItem("hiscore");
    if (hiscore !== null) {
        hiscoreval = JSON.parse(hiscore);
        document.getElementById("hiscoreBox").innerHTML = "HiScore: " + hiscoreval;
    }

    gameEngine();

    
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        startGame();
    });

    window.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent the default scroll behavior
        let touchEndX = e.touches[0].clientX;
        let touchEndY = e.touches[0].clientY;
        handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
    });

    
    document.getElementById('upBtn').addEventListener('click', () => startGame(() => handleDirection('ArrowUp')));
    document.getElementById('downBtn').addEventListener('click', () => startGame(() => handleDirection('ArrowDown')));
    document.getElementById('leftBtn').addEventListener('click', () => startGame(() => handleDirection('ArrowLeft')));
    document.getElementById('rightBtn').addEventListener('click', () => startGame(() => handleDirection('ArrowRight')));

  
    window.addEventListener('keydown', (e) => {
        if (!gameStarted) {
            startGame();
        }
    }, { once: true });
});

function startGame(callback) {
    if (!gameStarted) {
        gameStarted = true;
        musicSound.play(); 
        window.requestAnimationFrame(main);
        window.addEventListener('keydown', handleKeydown);
    }
    if (typeof callback === 'function') {
        callback();
    }
}

function main(ctime) {
    window.requestAnimationFrame(main);

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false;
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        alert("Game Over. Press any key to play again!");
        initializeGame();
        return;
    }

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            document.getElementById("hiscoreBox").innerHTML = "HiScore: " + hiscoreval;
        }
        document.getElementById("scoreBox").innerHTML = "Score: " + score;

        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

function handleKeydown(e) {
    e.preventDefault(); 
    moveSound.play();
    handleDirection(e.key);
}

function handleDirection(direction) {
    switch (direction) {
        case "ArrowUp":
            if (inputDir.y !== 1) { 
                inputDir.x = 0;
                inputDir.y = -1;
            }
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) {
                inputDir.x = 0;
                inputDir.y = 1;
            }
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) {
                inputDir.x = -1;
                inputDir.y = 0;
            }
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) {
                inputDir.x = 1;
                inputDir.y = 0;
            }
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


document.getElementById('upBtn').addEventListener('click', () => startGame(() => handleDirection('ArrowUp')));
document.getElementById('downBtn').addEventListener('click', () => startGame(() => handleDirection('ArrowDown')));
document.getElementById('leftBtn').addEventListener('click', () => startGame(() => handleDirection('ArrowLeft')));
document.getElementById('rightBtn').addEventListener('click', () => startGame(() => handleDirection('ArrowRight')));
