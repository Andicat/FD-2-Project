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
                nextRect = window.utils.findActualRect(window.field.rects,ballRight,this.y);
                if (!nextRect) {
                    this.speedX =- this.speedX;
                    this.x = this.actualRect.right - this.radius;
                } else {
                    this.actualRect = nextRect;
                }
            }
            // проверка слева
            if ((this.x - this.radius) < this.actualRect.left) {
                nextRect = window.utils.findActualRect(window.field.rects,ballLeft,this.y);
                if (!nextRect) {
                    this.speedX =- this.speedX;
                    this.x = this.actualRect.left + this.radius;
                } else {
                    this.actualRect = nextRect;
                }
            }
            // проверка снизу
            if ((this.y + this.radius) > this.actualRect.bottom) {
                nextRect = window.utils.findActualRect(window.field.rects,this.x,ballBottom);
                if (!nextRect) {
                    this.speedY =- this.speedY;
                    this.y = this.actualRect.bottom - this.radius;
                } else {
                    this.actualRect = nextRect;
                }
            }
            // проверка сверху
            if ((this.y - this.radius) < this.actualRect.top) {
                nextRect = window.utils.findActualRect(window.field.rects,this.x,ballTop);
                if (!nextRect) {
                    this.speedY =- this.speedY;
                    this.y = this.actualRect.top + this.radius;
                } else {
                    this.actualRect = nextRect;
                }
            }
            // проверка коллизии с линиями blade
            if (window.blade.isCutting) {
                var hit = window.utils.hitSlit(this,window.blade.slit1)||window.utils.hitSlit(this,window.blade.slit2);
                if (hit) {
                    console.log("hit");
                    window.blade.goToStart();
                }
            }
        };

        updateActualRect = function() {
            this.actualRect = window.utils.findActualRect(window.field.rects,this.x,this.y);
        }
    }

    //эскпорт
    window.Ball = Ball;

})();
