'use strict';

(function () {

    var ball;

    class Ball {

        constructor(cnt,color,radius,x,y) {
            this.speedX = 3;
            this.speedY = -3;
            this.cnt = cnt;
            this.color = color;
            this.radius = radius;
            this.elem;
            this.x = x;
            this.y = y;
        };

        draw = function() {
            this.cnt.fillStyle = this.color;
            this.cnt.beginPath();
            this.cnt.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
            this.cnt.fill();
        };
    }

    function startBall(context,color,radius,posX,posY) {
        ball = new Ball(context,color,radius,posX,posY);
        window.actualBallRect = window.findActualRect(ball.x,ball.y);
    }

    function drawBall() {
        ball.draw();
    }

    function moveBall() {
        ball.x += ball.speedX;
        ball.y += ball.speedY;
                        
        var ballTop = ball.y - ball.radius;
        var ballBottom = ball.y + ball.radius;
        var ballLeft = ball.x - ball.radius;
        var ballRight = ball.x + ball.radius;
        var nextRect;
        
        // проверка справа
        if ((ball.x + ball.radius) > window.actualBallRect.right) {
            nextRect = window.findActualRect(ballRight,ball.y);
            if (!nextRect) {
                ball.speedX =- ball.speedX;
                ball.x = window.actualBallRect.right - ball.radius;
            } else {
                window.actualBallRect = nextRect;
            }
        }
       // проверка слева
        if ((ball.x - ball.radius) < window.actualBallRect.left) {
            nextRect = window.findActualRect(ballLeft,ball.y);
            if (!nextRect) {
                ball.speedX =- ball.speedX;
                ball.x = window.actualBallRect.left + ball.radius;
            } else {
                window.actualBallRect = nextRect;
            }
        }
        // проверка снизу
        if ((ball.y + ball.radius) > window.actualBallRect.bottom) {
            nextRect = window.findActualRect(ball.x,ballBottom);
            if (!nextRect) {
                ball.speedY =- ball.speedY;
                ball.y = window.actualBallRect.bottom - ball.radius;
            } else {
                window.actualBallRect = nextRect;
            }
        }
        // проверка сверху
        if ((ball.y - ball.radius) < window.actualBallRect.top) {
            nextRect = window.findActualRect(ball.x,ballTop);
            if (!nextRect) {
                ball.speedY =- ball.speedY;
                ball.y = window.actualBallRect.top + ball.radius;
            } else {
                window.actualBallRect = nextRect;
            }
        }
        ball.draw();
    }

    function updateBallInfo() {
        window.actualBallRect = window.findActualRect(ball.x,ball.y);
    }

    //эскпорт
    window.updateBallInfo = updateBallInfo;
    window.drawBall = drawBall;
    window.startBall = startBall;
    window.moveBall = moveBall;
    window.startBall = startBall;
})();
