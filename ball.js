'use strict';

(function () {

    class Ball {

        constructor(cnt,color,radius,speed,image) {
            this.speedX = window.utils.randomSign()*speed;
            this.speedY = window.utils.randomSign()*speed;
            this.cnt = cnt;
            this.color = color;
            //cnt.createPattern(image, "no-repeat");
            this.radius = radius;
            this.elem;
            this.x;
            this.y;
            this.actualRect;
            //this.image = image;
        };

        draw = function() {
            this.cnt.fillStyle = this.color;
            this.cnt.beginPath();
            this.cnt.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
            this.cnt.fill();
        };

        activate = function() {
            this.actualRect = window.field.rects[0];
            this.x = this.actualRect.left + (this.actualRect.right-this.actualRect.left)/2;
            this.y = this.actualRect.top + (this.actualRect.bottom-this.actualRect.top)/2;
        }

        move = function() {
            this.x += this.speedX;
            this.y += this.speedY;
                            
            var nextRect;
            
            //проверка области
            if ((this.x + this.radius) > this.actualRect.right) { //right
                this.speedX =- this.speedX;
                this.x = this.actualRect.right - this.radius;
            } else if ((this.x - this.radius) < this.actualRect.left) { //left
                this.speedX =- this.speedX;
                this.x = this.actualRect.left + this.radius;
            } else if (((this.y + this.radius) > this.actualRect.bottom)&&this.speedY>0) { //bottom
                nextRect = window.utils.findActualRect(window.field.rects,this.x,this.y+this.radius,this.radius);
                if (!nextRect) {
                    this.speedY =- this.speedY;
                    this.y = this.actualRect.bottom - this.radius;
                } else {
                    this.actualRect = nextRect;
                }
            } else if (((this.y - this.radius) < this.actualRect.top)&&this.speedY<0) { //top
                nextRect = window.utils.findActualRect(window.field.rects,this.x,this.y-this.radius,this.radius);
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
                    this.draw();
                    window.game.finish();
                    return;
                }
            }
            this.draw();
        };

        updateActualRect = function() {
            this.actualRect = window.utils.findActualRect(window.field.rects,this.x,this.y,this.radius);
        }
    }

    //эскпорт
    window.Ball = Ball;

})();
