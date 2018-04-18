$(document).ready(function() {
    // Basic vars
    var canvas = document.getElementById('snake-board');
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var cellWidth = 15;
    var speed = 130;
    var direction = 'right';
    var cellColor = 'green';
    var food;
    var score;

    // Snake array
    var snakeArray;

    // Initialize the game
    function init() {
        createSnake(5);
        createFood();
        score = 0;

        if (typeof gameLoop != 'undefined') {
            clearInterval(gameLoop);
        }
        gameLoop = setInterval(paint, speed);
    }

    // Create the snake
    function createSnake(length) {
        snakeArray = new Array();

        for(var i = length - 1; i >= 0; i--) {
            snakeArray.push({
                x: i,
                y: 0
            });
        }
    }

    // Create the food
    function createFood() {
        food = {
            x: Math.round(Math.random() * (w - cellWidth) / cellWidth),
            y: Math.round(Math.random() * (h - cellWidth) / cellWidth)
        };
    }

    // Check if the snake has collided
    function checkCollision(x, y) {
        var snakeBite = false;

        for (var i = 0; i < snakeArray.length; i++) {
            if ((snakeArray[i].x == x) && (snakeArray[i].y == y)) {
                snakeBite = true;
                break;
            }
        }

        return (
            (x == -1) ||
            (x == w/cellWidth) ||
            (y == 1) ||
            (y == h/cellWidth) ||
            snakeBite
        );
    }

    function paintCell(x, y) {
        ctx.fillStyle = cellColor;
        ctx.fillRect((x * cellWidth), (y * cellWidth), cellWidth, cellWidth);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect((x * cellWidth), (y * cellWidth), cellWidth, cellWidth);
    }

    function paint() {
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(0, 0, w, h);

        var nx = snakeArray[0].x;
        var ny = snakeArray[0].y;

        switch (direction) {
            case 'right': nx++;
            break;
            case 'left': nx--;
            break;
            case 'up': ny--;
            break;
            case 'down': ny++;
            break;
        }

        // Check for a collision
        if (checkCollision(nx, ny)) {
            init();
            return;
        }

        // Check if the snake reaches the food
        if (nx == food.x && ny == food.y) {
            var tail = {
                x: nx,
                y: ny
            };
            score++;
            createFood();
        } else {
            var tail = snakeArray.pop();
            tail.x = nx;
            tail.y = ny;
        }

        snakeArray.unshift(tail);

        // Paint the snake
        for (var i = 0; i < snakeArray.length; i++) {
            var c = snakeArray[i];
            paintCell(c.x, c.y);
        }

        // Paint food
        paintCell(food.x, food.y);

        // Check the score
        checkScore();
    }

    init();
});