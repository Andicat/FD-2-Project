'use strict';

//игровое поле

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
        backgound: "#fff",
        field: "#dbda79",
        rect: "#d5a129",
        ball: "#000",
    }

    //игровое поле
    class Field {

        constructor(cnt,color,points) {
            this.cnt = cnt;
            this.color = color;
            this.points = points;
            this.elem;
        };

        draw = function() {
            this.cnt.fillStyle = this.color;
            this.cnt.beginPath();
            this.cnt.moveTo(this.points[0].x,this.points[0].y);
            
            for (var i = 1; i < this.points.length; i++) {
                this.cnt.lineTo(this.points[i].x,this.points[i].y);
            }
            
            this.cnt.closePath();
            
            this.cnt.fill();
            //this.cnt.stroke();
        };
    }

     //игровая область
     class Rect {
        constructor(cnt,color,top,bottom,left,right) {
            this.cnt = cnt;
            this.color = color;
            this.top = top;
            this.bottom = bottom;
            this.left = left;
            this.right = right;
            this.elem;
        };

        draw = function() {
            this.cnt.fillStyle = this.color;
            this.cnt.fillRect(this.left,this.top,this.right-this.left,this.bottom-this.top);
        };
    }

    function renderGameSVG (cnt) {

        var pgHeight = SIZES.playgroundHeight;
        var pgWidth = SIZES.playgroundWidth;
        var rects = [];

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
        var startPoints = [
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
        ];
        var field = new Field(context,COLORS.field,startPoints);
        field.draw();

        //создаем мяч
        var ball = new Ball(context,COLORS.ball,SIZES.ball/2,pgWidth/2,pgHeight/2);
        ball.draw();

        //создание рисунка на канвасе
        function draw() {
            //field.draw();
            context.fillStyle = COLORS.backgound;
            context.fillRect(0,0,pgWidth,pgWidth);
            rects.forEach(function(r) {r.draw()});
            ball.draw();
        }

        function createRects(pointsArr) {
            var rect;
            var left;
            var right;
            var top;
            var bottom;
            var leftPrev;
            var rightPrev;
            var sortY = Array.from(new Set(pointsArr.map(p => p.y).sort((a,b) => {return a-b})));
           
            for (var i = 0; i < sortY.length-1; i++) {
                top = sortY[i];
                bottom = sortY[i+1];
                var pointsX = pointsArr.filter(p => {return p.y===top}).map(p => p.x).sort((a,b) => {return a-b});
                var left = pointsX[0];
                var right = pointsX[pointsX.length-1];
                if (left===leftPrev) {
                    left = pointsX[1];
                } else {
                    left = (left!==rightPrev&&left!==leftPrev)?left:leftPrev;
                }
                if (right===rightPrev) {
                    right = pointsX[pointsX.length-2];
                } else {
                    right = (right!==rightPrev&&right!==leftPrev&&right!==left)?right:rightPrev;
                }
                leftPrev = left;
                rightPrev = right;
                rect = new Rect(context,COLORS.rect,top,bottom,left,right);
                rect.draw();
                rects.push(rect);
            }
            return rects;
        }

        function findActualRect(ballY,ballX) {
            return rects.filter(r => {return (r.top<ballY&&r.bottom>ballY&&r.left<ballX&&r.right>ballX)})[0];
        }

        function startGame() {
            window.startBlade();
            clearInterval(timer);
            rects = createRects(field.points);
            draw();
            var actualRect = rects.filter(r => {return (r.top<ball.y&&r.bottom>ball.y&&r.left<ball.x&&r.right>ball.x)})[0];
            var nextRect;
            //запускаем мяч
            function move() {
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
                    nextRect = findActualRect(ball.y,ballRight);
                    if (!nextRect) {
                        ball.speedX =- ball.speedX;
                        ball.x = actualRect.right - ball.radius;
                    } else {
                        actualRect = nextRect;
                    }
                }
               // ударился ли мяч в левую стену?
                if ((ball.x - ball.radius) < actualRect.left) {
                    nextRect = findActualRect(ball.y,ballLeft);
                    if (!nextRect) {
                        ball.speedX =- ball.speedX;
                        ball.x = actualRect.left + ball.radius;
                    } else {
                        actualRect = nextRect;
                    }
                }
                // вылетел ли мяч ниже пола?
                if ((ball.y + ball.radius) > actualRect.bottom) {
                    nextRect = findActualRect(ballBottom,ball.x);
                    if (!nextRect) {
                        ball.speedY =- ball.speedY;
                        ball.y = actualRect.bottom - ball.radius;
                    } else {
                        actualRect = nextRect;
                    }
                }
                // вылетел ли мяч выше потолка?
                if ((ball.y - ball.radius)< actualRect.top) {
                    nextRect = findActualRect(ballTop,ball.x);
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
})();
