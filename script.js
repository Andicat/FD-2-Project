'use strict';

//======================================FD-2 PROJECT==================================
/*
*/

(function () {

    try {
        var blockGame = document.querySelector('.game');
        var btnGame = blockGame.querySelector('.game__button');
        var cntGame = blockGame.querySelector('.game__container');
    } catch {
        return;
    }

    var timer;
    const GAME_SIZE = window.matchMedia("(max-width: 768px)").matches?300:600;
    const SPEED = 5;
    const SIZES = {
        playgroundWidth: GAME_SIZE,
        playgroundHeight: GAME_SIZE/1.5,
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
        cnt.appendChild(gameCanvas);
        var context = gameCanvas.getContext("2d");

        //создаем кнопку старта
        var btnStart = document.createElement("button");
        btnStart.classList.add("game__start");
        btnStart.textContent = "Start";
        cnt.appendChild(btnStart);
        btnStart.addEventListener("click", startGame);

        //создаем фигурку-лезвие
        var blade = document.createElement("div");
        blade.classList.add("game__blade");
        blade.setAttribute("width",pgWidth/10 + "px");
        blade.setAttribute("height",pgHeight/10 + "px");
        cnt.appendChild(blade);
        //вешаем обработчики событий на контэйнер
        blade.addEventListener("mousedown", startMove);
        blade.addEventListener('touchstart',startMove);

        function startMove(evt) {
            evt.preventDefault();
            if (evt instanceof TouchEvent) {
                evt = evt.changedTouches[0];
            }
        
            window.addEventListener('mousemove', move);
            window.addEventListener('touchmove', move,{ passive: false });
            window.addEventListener('mouseup', endMove);
            window.addEventListener('touchend', endMove);
            //начальные координаты мышки/пальца
        
            mouseStart = {
                x: evt.clientX,
                y: evt.clientY
            };
            //пределы
            leftMax = cnt.offsetLeft + cnt.offsetWidth;
            topMax = cnt.offsetTop + cnt.offsetHeight;
            rightMin = cntImages.offsetWidth - cnt.offsetLeft;
            bottomMin = cntImages.offsetHeight - cnt.offsetTop;
            limits = {
                bottom: cntImages.offsetHeight - image.offsetHeight,
                right: cntImages.offsetWidth - image.offsetWidth,
            };
        }

        //создаем поле
        var startPoints = [
            {x:200,y:0},
            {x:400,y:0},
            {x:400,y:50},
            {x:600,y:50},
            {x:600,y:250},
            {x:500,y:250},
            {x:500,y:400},
            {x:300,y:400},
            {x:300,y:300},
            {x:200,y:300},
            {x:200,y:120},
            {x:0,y:120},
            {x:0,y:50},
            {x:200,y:50},
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


        function findRects(pointsArr) {
            var rect;
            var left;
            var right;
            var top;
            var bottom;
            var sortY = Array.from(new Set(pointsArr.map(p => p.y).sort((a,b) => {return a-b})));
           
            for (var i = 0; i < sortY.length-1; i++) {
                top = sortY[i];
                bottom = sortY[i+1];
                var pointsX = pointsArr.filter(p => {return p.y===top}).map(p => p.x).sort((a,b) => {return a-b});
                if (pointsX[0]===left) {
                    left = pointsX[1];
                } else {
                    left = (pointsX[pointsX.length-1]!==right)?pointsX[0]:left;
                }
                if (pointsX[pointsX.length-1]===right) {
                    right = pointsX[pointsX.length-2];
                } else {
                    right = (pointsX[pointsX.length-1]===left)?right:pointsX[pointsX.length-1];
                }
                rect = new Rect(context,COLORS.rect,top,bottom,left,right);
                rects.push(rect);
            }
            return rects;
        }

        function findActualRect(ballY,ballX) {
            return rects.filter(r => {return (r.top<ballY&&r.bottom>ballY&&r.left<ballX&&r.right>ballX)})[0];
        }

        function startGame() {
            clearInterval(timer);
            rects = findRects(field.points);
            draw();
            var actualRect = rects.filter(r => {return (r.top<ball.y&&r.bottom>ball.y&&r.left<ball.x&&r.right>ball.x)})[0];
            var nextRect;
            //ball.speedY = -ball.speedY;
            //ball.speedX = -ball.speedX;
            //запускаем мяч
            function move() {
                //движения мячика
                ball.x += ball.speedX;
                ball.y += ball.speedY;
                                
                //var ballLimitX = ball.x + ball.radius*Math.sign(ball.speedX);
                //var ballLimitY = ball.y + ball.radius*Math.sign(ball.speedY);
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

    

    renderGameSVG(cntGame);

    btnGame.addEventListener('click', function() {
        clearInterval(timer);
        cntGame.innerHTML = "";
        
    });
})();
