const level1 = [

    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]

];

const level2 = [

    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]

];

const level3 = [

    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0, 1, 1, 1, 0, 1]

];

const level4 = [

    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]

];

const level5 = [

    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

];







const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    NEXTLEVEL: 4,
    GAMEWON: 5
};

function buildLevel(game, level) {
    let bricks = [];
    level.forEach((row, rowIndex) => {
        row.forEach((brick, brickIndex) => {
            if (brick == 1) {
                let position = {
                    x: 80 * brickIndex,
                    y: 40 + 24 * rowIndex,
                }
                bricks.push(new Brick(game, position))
            }

        });

    });

    return bricks;
}

function checkForCollision(ball, object) {
    let bottomOfBall = ball.position.y + ball.radius;
    let topOfBall = ball.position.y - ball.radius;
    let topOfObject = object.position.y;
    let leftSideOfObject = object.position.x;
    let rightSideOfObject = object.position.x + object.width;
    let bottomOfObject = object.position.y + object.height;

    if (bottomOfBall >= topOfObject && topOfBall <= bottomOfObject && ball.position.x >= leftSideOfObject && ball.position.x <= rightSideOfObject && !object.hasBeenHit) {
        return true;
    } else {
        return false;
    }
}








class Paddle {
    constructor(game) {
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.width = 100;
        this.height = 10;
        this.currentSpeed = 0;
        this.maxSpeed = 10;
        this.position = {
            x: (game.gameWidth / 2) - (this.width / 2),
            y: game.gameHeight - this.height - 10,
        };
        this.topOfPaddle = this.position.y;
        this.leftSideOfPaddle = this.position.x;
        this.rightSideOfPaddle = this.position.x + this.width;
        this.hasBeenHit = false;
    }

    drawPaddle(context) {
        context.fillStyle = "black";
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    moveLeft() {
        this.currentSpeed = -this.maxSpeed;
    }
    moveRight() {
        this.currentSpeed = this.maxSpeed;
    }
    stop() {
        this.currentSpeed = 0;
    }

    updatePaddle() {
        this.position.x += this.currentSpeed;
        if (this.position.x < 0) {
            this.position.x = 0;
        }
        if (this.position.x + this.width > this.gameWidth) {
            this.position.x = this.gameWidth - this.width;
        }
    }

    reset() {
        this.position = {
            x: (game.gameWidth / 2) - (this.width / 2),
            y: game.gameHeight - this.height - 10,
        };

    }
}

class InputHandler {

    constructor(paddle, game) {
        document.addEventListener("keydown", (move) => {
            if (move.key == "Right" || move.key == "ArrowRight") {
                paddle.moveRight();
            } else if (move.key == "Left" || move.key == "ArrowLeft") {
                paddle.moveLeft();
            } else if (move.keyCode == 32 && game.gamestate == GAMESTATE.MENU) {
                game.startGame();
            } else if (move.keyCode == 32 && game.gamestate == GAMESTATE.RUNNING) {
                game.togglePause();
            } else if (move.keyCode == 32 && game.gamestate == GAMESTATE.PAUSED) {
                game.togglePause();
            } else if (move.keyCode == 32 && game.gamestate == GAMESTATE.GAMEOVER) {
                return;
            } else if (move.keyCode == 32 && game.gamestate == GAMESTATE.NEXTLEVEL) {
                game.currentLevel++;
                game.paddle.width -= 10;
                game.ball.timesHit = 0;
                game.ball.incrementOnce = false;
                game.ball.incrementTwice = false;
                game.ball.incrementThreeTimes = false;
                game.ball.incrementFourTimes = false;
                game.ball.hitToIncrement--;
                game.startGame();
            } else if (move.keyCode == 32 && game.gamestate == GAMESTATE.GAMEWON) {
                return;
            }


        });
        document.addEventListener("keyup", (move) => {
            if (move.key == "Right" || move.key == "ArrowRight") {
                if (paddle.currentSpeed > 0) {
                    paddle.stop()
                }
            } else if (move.key == "Left" || move.key == "ArrowLeft") {
                if (paddle.currentSpeed < 0) {
                    paddle.stop()
                }
            }

        });


    }
}

class Ball {

    constructor(game, paddle) {
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.paddle = paddle;
        this.radius = 9;
        this.game = game;
        this.position = {
            x: this.gameWidth / 2,
            y: paddle.position.y - this.radius,
        };
        this.speed = {
            x: 2,
            y: -2,
        }
        this.timesHit = 0;
        this.incrementOnce = false;
        this.incrementTwice = false;
        this.incrementThreeTimes = false;
        this.incrementFourTimes = false;
        this.hitToIncrement = 6;

    }
    drawBall(context) {
        context.beginPath();
        context.fillStyle = "black";
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    }
    updateBall() {

        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        if (checkForCollision(this, this.paddle)) {
            this.timesHit++;
            this.speed.y = (-this.speed.y);
            return;
        }
        if (this.position.y + this.speed.y < this.radius) { //you are at the top 
            this.speed.y = (-this.speed.y);
            return;
        }
        if (this.position.x + this.speed.x < this.radius || this.position.x + this.speed.x > this.gameWidth - this.radius) { //you are at the right or left edges 
            this.speed.x = (-this.speed.x);
            return;
        }

        if (this.position.y + this.speed.y > this.gameHeight - this.radius) { //you are at the bottom 
            game.lives--;
            this.reset();
            this.paddle.reset();
            this.incrementOnce = false;
            this.incrementTwice = false;
            this.incrementThreeTimes = false;
            this.incrementFourTimes = false;
            this.timesHit = 0;
            this.game.gamestate = GAMESTATE.PAUSED;
            return;
        }

        if (this.timesHit == this.hitToIncrement) {
            if (this.incrementOnce) {
                return;
            }
            if (this.speed.x > 0) {
                this.speed.x++;
                this.incrementOnce = true;
            }
            if (this.speed.x < 0) {
                this.speed.x--;
                this.incrementOnce = true;
            }
            if (this.speed.y > 0) {
                this.speed.y++;
                this.incrementOnce = true;
            }
            if (this.speed.y < 0) {
                this.speed.y--;
                this.incrementOnce = true;
            }
        }
        if (this.timesHit == this.hitToIncrement + 4) {
            if (this.incrementTwice) {
                return;
            }
            if (this.speed.x > 0) {
                this.speed.x++;
                this.incrementTwice = true;
            }
            if (this.speed.x < 0) {
                this.speed.x--;
                this.incrementTwice = true;
            }
            if (this.speed.y > 0) {
                this.speed.y++;
                this.incrementTwice = true;
            }
            if (this.speed.y < 0) {
                this.speed.y--;
                this.incrementTwice = true;
            }
        }
        if (this.timesHit == this.hitToIncrement + 8) {
            if (this.incrementThreeTimes) {
                return;
            }
            if (this.speed.x > 0) {
                this.speed.x++;
                this.incrementThreeTimes = true;
            }
            if (this.speed.x < 0) {
                this.speed.x--;
                this.incrementThreeTimes = true;
            }
            if (this.speed.y > 0) {
                this.speed.y++;
                this.incrementThreeTimes = true;
            }
            if (this.speed.y < 0) {
                this.speed.y--;
                this.incrementThreeTimes = true;
            }
        }
        if (this.timesHit == this.hitToIncrement + 12) {
            if (this.incrementFourTimes) {
                return;
            }
            if (this.speed.x > 0) {
                this.speed.x++;
                this.incrementFourTimes = true;
            }
            if (this.speed.x < 0) {
                this.speed.x--;
                this.incrementFourTimes = true;
            }
            if (this.speed.y > 0) {
                this.speed.y++;
                this.incrementFourTimes = true;
            }
            if (this.speed.y < 0) {
                this.speed.y--;
                this.incrementFourTimes = true;
            }
        }
    }

    reset() {
        this.position = {
            x: this.gameWidth / 2,
            y: this.paddle.position.y - this.radius,
        };
        this.speed = {
            x: 2,
            y: -2,
        }
    }
}

class Brick {

    constructor(game, position) {
        this.image = document.getElementById("brickImage");
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.position = position;
        this.width = 80;
        this.height = 24;
        this.game = game;
        this.hasBeenHit = false;
    }

    drawBrick(context) {
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    updateBrick() {
        if (checkForCollision(this.game.ball, this)) {
            this.game.ball.speed.y = (-this.game.ball.speed.y);
            this.hasBeenHit = true;
        }
    }

}

class Game {

    constructor(gameWidth, gameHeight, context) {
        this.context = context;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gamestate = GAMESTATE.MENU;
        this.paddle = new Paddle(this);
        this.ball = new Ball(this, this.paddle);
        new InputHandler(this.paddle, this);
        this.bricks = [];
        this.lives = 5;
        this.totalScore = 0;
        this.previousScore = 0;
        this.levels = [level1, level2, level3, level4, level5];
        this.currentLevel = 0;
    }

    startGame() {
        if (this.gamestate !== GAMESTATE.MENU && this.gamestate != GAMESTATE.NEXTLEVEL) {
            return;
        } else if (this.currentLevel >= this.levels.length) {
            this.gamestate = GAMESTATE.GAMEWON;
        } else {
            this.paddle.reset();
            this.ball.reset();

            this.gamestate = GAMESTATE.RUNNING;
            this.bricks = buildLevel(this, this.levels[this.currentLevel]);
        }
    }

    updateGame() {
        if (this.lives === 0) {
            this.gamestate = GAMESTATE.GAMEOVER;
        }
        if (this.gamestate === GAMESTATE.PAUSED || this.gamestate === GAMESTATE.MENU || this.gamestate === GAMESTATE.GAMEOVER || this.gamestate === GAMESTATE.NEXTLEVEL || this.gamestate === GAMESTATE.GAMEWON) {
            return;
        }
        this.paddle.updatePaddle();
        this.ball.updateBall();
        for (let i = 0; i < this.bricks.length; i++) {
            this.bricks[i].updateBrick();
        }

    }

    drawGame(context) {
        this.paddle.drawPaddle(context);
        this.ball.drawBall(context);
        this.checkScore();
        this.drawScore();
        this.drawLives();
        for (let i = 0; i < this.bricks.length; i++) {
            if (!this.bricks[i].hasBeenHit) {
                this.bricks[i].drawBrick(context);
            }
        }

        if (this.gamestate == GAMESTATE.MENU) {
            context.rect(0, 0, this.gameWidth, this.gameHeight);
            context.fillStyle = "rgba(0,0,0,0.5)";
            context.fill();
            context.font = '25px Arial';
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText("WELCOME TO BRICK BREAKER", this.gameWidth / 2, this.gameHeight / 2 - 20);
            context.fillText("Press Spacebar to start", this.gameWidth / 2, this.gameHeight / 2 + 50);
        } else if (this.gamestate == GAMESTATE.PAUSED) {
            context.rect(0, 0, this.gameWidth, this.gameHeight);
            context.fillStyle = "rgba(0,0,0,0.5)";
            context.fill();
            context.font = '25px Arial';
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText("PAUSED", this.gameWidth / 2, this.gameHeight / 2);
        } else if (this.gamestate == GAMESTATE.GAMEOVER) {
            context.rect(0, 0, this.gameWidth, this.gameHeight);
            context.fillStyle = "rgba(0,0,0,0.5)";
            context.fill();
            context.font = '25px Arial';
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2 - 20);
            context.fillText("Score : " + this.totalScore, this.gameWidth / 2, this.gameHeight / 2 + 50);
        } else if (this.gamestate == GAMESTATE.NEXTLEVEL) {
            context.rect(0, 0, this.gameWidth, this.gameHeight);
            context.fillStyle = "rgba(0,0,0,0.5)";
            context.fill();
            context.font = '25px Arial';
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText("LEVEL PASSED", this.gameWidth / 2, this.gameHeight / 2);
        } else if (this.gamestate == GAMESTATE.GAMEWON) {
            this.context.rect(0, 0, this.gameWidth, this.gameHeight);
            this.context.fillStyle = "rgba(0,0,0,0.5)";
            this.context.fill();
            this.context.font = '25px Arial';
            this.context.fillStyle = "white";
            this.context.textAlign = "center";
            this.context.fillText("GAME WON", this.gameWidth / 2, this.gameHeight / 2);
            return;
        }
    }

    togglePause() {
        if (this.gamestate == GAMESTATE.PAUSED) {
            this.gamestate = GAMESTATE.RUNNING;
        } else if (this.gamestate = GAMESTATE.RUNNING) {
            this.gamestate = GAMESTATE.PAUSED;
        } else if (this.gamestate = GAMESTATE.MENU) {
            this.gamestate = GAMESTATE.MENU;
        }
    }

    checkScore() {
        if (this.gamestate != GAMESTATE.NEXTLEVEL) {
            let score = 0;
            for (let i = 0; i < this.bricks.length; i++) {
                if (this.bricks[i].hasBeenHit) {
                    score++;
                }
            }
            this.totalScore = score + this.previousScore;
            if (score == this.bricks.length && this.bricks.length != 0 && this.gamestate != GAMESTATE.GAMEWON) {
                this.previousScore += score;
                this.totalScore = this.previousScore;
                this.gamestate = GAMESTATE.NEXTLEVEL;
            }

        }

    }

    drawLives() {
        context.font = "16px Arial";
        context.fillStyle = "black";
        context.fillText("Lives = " + this.lives, canvas.width - 38, 16);
    }

    drawScore() {
        context.font = "16px Arial";
        context.fillStyle = "black";
        context.fillText("Score = " + this.totalScore, 40, 16);
    }

    incrementSpeedOnce() {

    }
    incrementSpeedTwice() {
        if (this.incrementTwice) {
            return;
        }
        if (this.ball.speed.x > 0) {
            this.ball.speed.x++;
            this.incrementTwice = true;
        }
        if (this.ball.speed.x < 0) {
            this.ball.speed.x--;
            this.incrementTwice = true;
        }
        if (this.ball.speed.y > 0) {
            this.ball.speed.y++;
            this.incrementTwice = true;
        }
        if (this.ball.speed.y < 0) {
            this.ball.speed.y--;
            this.incrementTwice = true;
        }
    }
    incrementSpeedThreeTimes() {
        if (this.incrementThreeTimes) {
            return;
        }
        if (this.ball.speed.x > 0) {
            this.ball.speed.x++;
            this.incrementThreeTimes = true;
        }
        if (this.ball.speed.x < 0) {
            this.ball.speed.x--;
            this.incrementThreeTimes = true;
        }
        if (this.ball.speed.y > 0) {
            this.ball.speed.y++;
            this.incrementThreeTimes = true;
        }
        if (this.ball.speed.y < 0) {
            this.ball.speed.y--;
            this.incrementThreeTimes = true;
        }
    }
    incrementSpeedFourTimes() {
        if (this.incrementFourTimes) {
            return;
        }
        if (this.ball.speed.x > 0) {
            this.ball.speed.x++;
            this.incrementFourTimes = true;
        }
        if (this.ball.speed.x < 0) {
            this.ball.speed.x--;
            this.incrementFourTimes = true;
        }
        if (this.ball.speed.y > 0) {
            this.ball.speed.y++;
            this.incrementFourTimes = true;
        }
        if (this.ball.speed.y < 0) {
            this.ball.speed.y--;
            this.incrementFourTimes = true;
        }
    }

}

let canvas = document.getElementById("brickBreakerCanvas");
let context = canvas.getContext('2d');


function clearCanvas(context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

let game = new Game(canvas.width, canvas.height, context);


function gameLoop() {
    clearCanvas(context);
    game.updateGame();
    game.drawGame(context);
    requestAnimationFrame(gameLoop);
}

gameLoop();