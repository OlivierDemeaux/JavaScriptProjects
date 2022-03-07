
class Snake{
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.tail = [{x: this.x, y:this.y}];
        this.rotateX = 0;
        this.rotateY = 1;
    }

    checkImpact(newRect) {
        for (let i = 0; i < this.tail.length; i++) {
            if (newRect.x == this.tail[i].x && newRect.y == this.tail[i].y) {
                livesLeft--;
                resetGame(livesLeft)

            }
        } 
    }

    move() {
        var newRect;
        if (this.rotateX == 1){
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if(this.rotateX == -1){
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateY == 1){
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        } else if (this.rotateY == -1){
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        }
        this.tail.shift()
        this.checkImpact(newRect)
        this.tail.push(newRect)
    }
}

class Apple{
    constructor(){
        var isTouching;
        while(true){
            isTouching = false;
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size;
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size;
            for(var i = 0; i < snake.tail.length;i++){
                if(this.x == snake.tail[i].x && this.y == snake.tail[i].y){
                    isTouching = true
                }
            }
            this.color = "red"
            this.size = snake.size;
            if(!isTouching){
                break;
            }
        }
    }
}


var canvas = document.getElementById("canvas");
var scoreboard = document.getElementById("scoreboard");

var livesLeft = 3;

var snake = new Snake(20, 20, 20);

var apple = new Apple();

var canvasContext = canvas.getContext('2d');
var scoreboardCanvasContext = scoreboard.getContext('2d');

window.onload = () => {
    gameLoop();
}

function gameLoop(){
    setInterval(show, 1000/15);
}

function show() {
    update();
    if(livesLeft == 0) {
        drawGameOver();
    } else {
        drawCanvas();
        drawScoreboard();
    }
}

function update(){
    canvasContext.clearRect(0,0, canvas.width, canvas.height)
    scoreboardCanvasContext.clearRect(0, 0, scoreboard.width, scoreboard.height)
    snake.move();
    checkHitWall();
    eatApple();
}

function checkHitWall(){
    var headTail = snake.tail[snake.tail.length -1];
    if(headTail.x == - snake.size){
        headTail.x = canvas.width - snake.size
    } else if(headTail.x == canvas.width){
        headTail.x = 0
    } else if(headTail.y == - snake.size){
        headTail.y = canvas.height - snake.size
    } else if(headTail.y == canvas.height){
        headTail.y = 0
    }
}

function eatApple(){
    if(snake.tail[snake.tail.length - 1].x == apple.x && snake.tail[snake.tail.length - 1].y == apple.y) {
        snake.tail[snake.tail.length] = {x:apple.x, y:apple.y}
        apple = new Apple();
    }
}

function drawCanvas(){
    createRect(0,0,canvas.width, canvas.height, "black");
    for(let i = 0; i < snake.tail.length; i++){
        createRect(snake.tail[i].x + 2.5, snake.tail[i].y + 2.5, snake.size - 5, snake.size - 5, "white");
    }
    createRect(apple.x, apple.y, apple.size, apple.size, apple.color)
}

function drawGameOver(){
    createRect(0,0,canvas.width, canvas.height, "black");
    canvasContext.font = "20px Arial";
    canvasContext.fillStyle = "#00FF42";
    canvasContext.fillText("Game Over. Press 'r' to play again", 40 , 200);
}

function drawScoreboard(){
    createRectScore(0, 0, scoreboard.width , scoreboard.height , "black");
    scoreboardCanvasContext.font = "20px Arial";
    scoreboardCanvasContext.fillStyle = "#00FF42";
    scoreboardCanvasContext.fillText("Score: " + (snake.tail.length - 1), 10 , 25);
    scoreboardCanvasContext.fillText("Lives: " + (livesLeft), 10 , 60);
}

function createRect(x,y,width,height,color){
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x,y,width,height)
}

function createRectScore(x, y, width, height, color){
    scoreboardCanvasContext.fillStyle = color;
    scoreboardCanvasContext.fillRect(x,y,width,height)
}

function resetGame(x){
    livesLeft = x;
    snake = new Snake(20, 20, 20);
    apple = new Apple();
}

window.addEventListener("keydown", (event)=> {
    setTimeout(() => {
        if(event.keyCode == 37 && snake.rotateX != 1){
            snake.rotateX = -1;
            snake.rotateY = 0;
        } else if(event.keyCode == 38 && snake.rotateY != 1){
            snake.rotateX = 0;
            snake.rotateY = -1;
        } else if(event.keyCode == 39 && snake.rotateX != -1){
            snake.rotateX = 1;
            snake.rotateY = 0;
        } else if(event.keyCode == 40 && snake.rotateY != -1){
            snake.rotateX = 0;
            snake.rotateY = 1;
        } else if(event.keyCode == 82){
            resetGame(3)
        }
    }, 1)
})