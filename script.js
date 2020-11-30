'use strict';

//======================================FD-2 SCALE-GAME==================================
/*
*/

(function () {

    try {
        var blockGame = document.querySelector('.game');
        var cntGame = blockGame.querySelector('.game__container');
        var cntHeader = blockGame.querySelector('.game__header');
        var cntField = blockGame.querySelector('.game__field');
        var cntFooter = blockGame.querySelector('.game__footer');
    } catch {
        return;
    }

    var timer;
    const GAME_SIZE = window.matchMedia("(max-width: 768px)").matches?300:600;
    const SPEED = 5;
    const SIZES = {
        playgroundWidth: GAME_SIZE,
        playgroundHeight: GAME_SIZE,
        playerWidth: GAME_SIZE*0.02,
        playerHeight: GAME_SIZE*(0.2-0.02),
        ball: GAME_SIZE*0.025,
        scoreboardFontSize: GAME_SIZE*0.1,
    };
    const COLORS = {
        backgound: "rgb(144, 172, 173)",
        field: "#dbda79",
        rect: " rgb(163, 55, 55)",
        ball: "#000",
    }

    var rectsStart = [];
    var rects = [];

    //мячик
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

    function renderGameSVG (cnt) {

        var pgHeight = SIZES.playgroundHeight;
        var pgWidth = SIZES.playgroundWidth;
        
        //создаем канвас
        var gameCanvas = document.createElement("canvas");
        gameCanvas.setAttribute("width",pgWidth);
        gameCanvas.setAttribute("height",pgHeight);
        cntField.appendChild(gameCanvas);
        var context = gameCanvas.getContext("2d");

        //создаем кнопку старта
        var btnStart = document.createElement("button");
        btnStart.classList.add("game__start");
        btnStart.textContent = "Start";
        cntFooter.appendChild(btnStart);
        btnStart.addEventListener("click", startGame);

        //создаем поле
        var pointsStart = [
            {x:0,y:0},
            {x:600,y:0},
            {x:600,y:600},
            {x:600,y:0},
        ];
        /*window.points = [
            {x:200,y:0},
            {x:400,y:0},
            {x:400,y:50},
            {x:600,y:50},
            {x:600,y:250},
            {x:500,y:250},
            {x:500,y:600},
            {x:300,y:600},
            {x:300,y:400},
            {x:150,y:400},
            {x:150,y:250},
            {x:0,y:250},
            {x:0,y:100},
            {x:200,y:100},
        ];*/
        window.points = [
            {x:0,y:0},
            {x:600,y:0},
            {x:600,y:600},
            {x:0,y:600},
        ];
        
        //создаем мяч
        var ball = new Ball(context,COLORS.ball,SIZES.ball/2,pgWidth/2,pgHeight/2);

        //создание рисунка на канвасе
        function draw() {
            window.drawField(context,rectsStart,COLORS.backgound);
            window.drawField(context,window.rects,COLORS.rect);
            ball.draw();
        }

        function startGame() {
            clearInterval(timer);
            window.startBlade();
            rectsStart = window.createRects(pointsStart);
            window.rects = window.createRects(window.points);
            //console.log(window.rects);
            draw();
            //debugger
            window.actualRect = window.findActualRect(ball.x,ball.y);
            var nextRect;
            //запускаем мяч
            function move() {
                //window.actualRect = window.findActualRect(ball.x,ball.y);
                //движения мячика
                ball.x += ball.speedX;
                ball.y += ball.speedY;
                                
                var ballDirectionX = (ball.speedX>0 ? "right" : "left");
                var ballDirectionY = (ball.speedY>0 ? "bottom" : "top");
                var ballTop = ball.y - ball.radius;
                var ballBottom = ball.y + ball.radius;
                var ballLeft = ball.x - ball.radius;
                var ballRight = ball.x + ball.radius;
                
                // ударился ли мяч в правую стену?
                if ((ball.x + ball.radius) > actualRect.right) {
                    nextRect = window.findActualRect(ballRight,ball.y);
                    if (!nextRect) {
                        ball.speedX =- ball.speedX;
                        ball.x = actualRect.right - ball.radius;
                    } else {
                        actualRect = nextRect;
                    }
                }
               // ударился ли мяч в левую стену?
                if ((ball.x - ball.radius) < actualRect.left) {
                    nextRect = window.findActualRect(ballLeft,ball.y);
                    if (!nextRect) {
                        ball.speedX =- ball.speedX;
                        ball.x = actualRect.left + ball.radius;
                    } else {
                        actualRect = nextRect;
                    }
                }
                // вылетел ли мяч ниже пола?
                if ((ball.y + ball.radius) > actualRect.bottom) {
                    nextRect = window.findActualRect(ball.x,ballBottom);
                    if (!nextRect) {
                        ball.speedY =- ball.speedY;
                        ball.y = actualRect.bottom - ball.radius;
                    } else {
                        actualRect = nextRect;
                    }
                }
                // вылетел ли мяч выше потолка?
                if ((ball.y - ball.radius)< actualRect.top) {
                    nextRect = window.findActualRect(ball.x,ballTop);
                    if (!nextRect) {
                        ball.speedY =- ball.speedY;
                        ball.y = actualRect.top + ball.radius;
                    } else {
                        actualRect = nextRect;
                    }
                }
                draw();
            }
            timer = setInterval(move,40);
        }
    }

    renderGameSVG(cntField);

    //эскпорт
    window.cntGame = cntGame;
    window.cntField = cntField;
    window.rects = rects;
    window.points = points;
})();
