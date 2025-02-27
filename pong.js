//#region globals
let canvas;
let ctx;

let DIRECTION = {
    STOPPED: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
}

let player;
let aiPlayer;
let ball;
let running = false;
let gameOver = false;
let delayAmount;
let targetForBall;
let beepSound;
let isAIvsAI = true;

//#region game attributes
let cvsHeight = 550;
let cvsWidth = 1000;
let aiPaddleSpeed = 6.5;
let ballSpeed = 7;
//#endregion
//#endregion

//#region classes
class Paddle {
    constructor(side) {
        this.width = 15;
        this.height = 65;
        this.x = side === 'left' ? 150 : canvas.width - 150;
        this.y = canvas.height / 2
        this.score = 0;
        this.move = DIRECTION.STOPPED;
        this.speed = 11;
    }
}

class Ball {
    constructor(newSpeed) {
        this.width = 15;
        this.height = 15;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.moveX = DIRECTION.STOPPED;
        this.moveY = DIRECTION.STOPPED;
        this.speed = newSpeed;
    }
}
//#endregion

//#region listeners
document.addEventListener('DOMContentLoaded', SetupCanvas);
//#endregion

//#region functions
//#region main
function SetupCanvas() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = cvsWidth;
    canvas.height = cvsHeight;
    player = new Paddle('left');
    aiPlayer = new Paddle('right');
    ball = new Ball(ballSpeed);
    aiPlayer.speed = aiPaddleSpeed;
    targetForBall = player;
    delayAmount = (new Date()).getTime();
    beepSound = document.getElementById('beepSound');
    beepSound.src = 'beep.wav';
    document.addEventListener('keydown', MovePlayerPaddle);
    document.addEventListener('keyup', StopPlayerPaddle);
    Draw();
}
//#endregion

//#region renderer
function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(aiPlayer.x, aiPlayer.y, aiPlayer.width, aiPlayer.height);
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(player.score.toString(), (canvas.width / 2) - 300, 100);
    ctx.fillText(aiPlayer.score.toString(), (canvas.width / 2) + 300, 100);

    if (player.score === 2) {
        ctx.fillText('Player wins', canvas.width / 2, 300);
        gameOver = true;
    }
    
    if (aiPlayer.score === 2) {
        ctx.fillText('AI wins', canvas.width / 2, 300);
        gameOver = true;
    }
}
//#endregion

//#region game state
//called in function MovePlayerPaddle
function GameLoop() {
    Update();
    Draw();
    if(!gameOver) {
        requestAnimationFrame(GameLoop);
    }
}

function Update() {
    if(!gameOver) {
        CheckBallReachingGoal()
        CheckBallBounceWalls()
        PlayerPaddleMovement()
        PlayerPaddleClipping()
        DelayBallStart()
        BallMove()
        if(isAIvsAI) { AIMove(player, DIRECTION.LEFT) }
        AIMove(aiPlayer, DIRECTION.RIGHT)
        AIPaddleClipping()
        CollisionsWithPaddle()
    }
}

//#region procedures for Update()
function CheckBallReachingGoal() {
    if(ball.x <= 0) {
        ResetBall(aiPlayer, player);
    }
    
    if(ball.x >= canvas.width - ball.width) {
        ResetBall(player, aiPlayer);
    }
}

function CheckBallBounceWalls() {
    if(ball.y <= 0) {
        ball.moveY = DIRECTION.DOWN;
    }

    if(ball.y >= canvas.height - ball.height) {
        ball.moveY = DIRECTION.UP;
    }
}

function PlayerPaddleMovement() {
    if(player.move === DIRECTION.DOWN) {
        player.y += player.speed;
    }
    else if(player.move === DIRECTION.UP) {
        player.y -= player.speed;
    }
}

function PlayerPaddleClipping() {
    if(player.y <= 0) {
        player.y = 0;
    }
    else if(player.y >= (canvas.height - player.height)) {
        player.y = canvas.height - player.height;
    }
}

function DelayBallStart() {
    if(AddADelay() && targetForBall) {
        ball.moveX = targetForBall === player ? DIRECTION.LEFT : DIRECTION.RIGHT;
        ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
        ball.y = canvas.height / 2;
        targetForBall = null;
    }
}

function BallMove() {
    if(ball.moveY === DIRECTION.UP) {
        ball.y -= ball.speed;
    }
    else if(ball.moveY === DIRECTION.DOWN) {
        ball.y += ball.speed;
    }

    if(ball.moveX === DIRECTION.LEFT) {
        ball.x -= ball.speed;
    }
    else if(ball.moveX === DIRECTION.RIGHT) {
        ball.x += ball.speed;
    }
}

function AIMove(player, directionBall) {
    if(player.y > ball.y - (player.height / 2)) {
        if(ball.moveX === directionBall) {
            player.y -= player.speed;
        }
    }

    if(player.y < ball.y - (player.height / 2)) {
        if(ball.moveX === directionBall) {
            player.y += player.speed;
        }        
    }
}

function AIPaddleClipping() {
    if(aiPlayer.y <= 0) {
        aiPlayer.y = 0;
    }
    else if(aiPlayer.y >= (canvas.height - aiPlayer.height)) {
        aiPlayer.y = canvas.height - aiPlayer.height;
    }
}

function CollisionsWithPaddle() {
    CheckBallPlayerCollision(DIRECTION.RIGHT, player)
    CheckBallPlayerCollision(DIRECTION.LEFT, aiPlayer)
}

//Calleb by CollisionPlayerCollision()
function CheckBallPlayerCollision(direction, player) {
    if(ball.x - ball.width <= player.x 
        && ball.x >= player.x - player.width
    ) {
        if(ball.y <= player.y + player.height
            && ball.y + ball.height >= player.y
        ) {
            ball.moveX = direction;
            beepSound.play();
        }
    }
}
//#endregion

function AddADelay() {
    return ((new Date()).getTime() - delayAmount >= 1000);
}

function ResetBall(whoScored, whoLost) {
    whoScored.score++;
    let newBallSpeed = ball.speed + 0.2;
    ball = new Ball(newBallSpeed);
    targetForBall = whoLost;
    delayAmount = (new Date()).getTime(); 
}

//#region paddle update
function MovePlayerPaddle(key) {
    if(running === false) {
        running = true;
        window.requestAnimationFrame(GameLoop);
    }

    if(key.keyCode === 38 || key.keyCode === 87) {
        player.move = DIRECTION.UP;
    }

    if(key.keyCode === 40 || key.keyCode === 83) {
        player.move = DIRECTION.DOWN;
    }
}

function StopPlayerPaddle(evt) {
    player.move = DIRECTION.STOPPED;
}
//#endregion

//#endregion