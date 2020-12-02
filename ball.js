'use strict';

(function () {

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
            this.actualRect;
        };

        draw = function() {
            this.cnt.fillStyle = this.color;
            this.cnt.beginPath();
            this.cnt.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
            this.cnt.fill();
        };

        move = function() {
            this.x += this.speedX;
            this.y += this.speedY;
                            
            var ballTop = this.y - this.radius;
            var ballBottom = this.y + this.radius;
            var ballLeft = this.x - this.radius;
            var ballRight = this.x + this.radius;
            var nextRect;
            
            // проверка справа
            if ((this.x + this.radius) > this.actualRect.right) {
                nextRect = window.field.findActualRect(ballRight,this.y);
                if (!nextRect) {
                    this.speedX =- this.speedX;
                    this.x = this.actualRect.right - this.radius;
                } else {
                    this.actualRect = nextRect;
                }
            }
           // проверка слева
            if ((this.x - this.radius) < this.actualRect.left) {
                nextRect = window.field.findActualRect(ballLeft,this.y);
                if (!nextRect) {
                    this.speedX =- this.speedX;
                    this.x = this.actualRect.left + this.radius;
                } else {
                    this.actualRect = nextRect;
                }
            }
            // проверка снизу
            if ((this.y + this.radius) > this.actualRect.bottom) {
                nextRect = window.field.findActualRect(this.x,ballBottom);
                if (!nextRect) {
                    this.speedY =- this.speedY;
                    this.y = this.actualRect.bottom - this.radius;
                } else {
                    this.actualRect = nextRect;
                }
            }
            // проверка сверху
            if ((this.y - this.radius) < this.actualRect.top) {
                nextRect = window.field.findActualRect(this.x,ballTop);
                if (!nextRect) {
                    this.speedY =- this.speedY;
                    this.y = this.actualRect.top + this.radius;
                } else {
                    this.actualRect = nextRect;
                }
            }
        };

        updateActualRect = function() {
            this.actualRect = window.field.findActualRect(this.x,this.y);
        }
    }

    //эскпорт
    window.Ball = Ball;

})();
