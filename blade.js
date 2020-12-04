'use strict';

(function () {

    class Slit {

        constructor(context,color,width,startX,startY,finishX,finishY,speed) {
            this.cnt = context;
            this.width = width;
            this.color = color;
            this.startX = startX;
            this.startY = startY;
            this.finishX = finishX;
            this.finishY = finishY;
            this.currX = startX;
            this.currY = startY;
            this.direction;
            this.speedX;
            this.speedY;
            if (startX!==finishX) {
                this.direction = "X";
                this.speedY = 0;
                this.speedX = Math.sign(finishX - startX)*speed;
            }
            if (startY!==finishY) {
                this.direction = "Y";
                this.speedX = 0;
                this.speedY = Math.sign(finishY - startY)*speed;
            }
        };

        move = function() {
            if (this.direction==="X") {
                var lenghtX = Math.abs(this.startX - this.finishX);
                var currLenghtX = Math.abs(this.startX - this.currX);
                if (currLenghtX<=lenghtX) {
                    this.currX += this.speedX;
                } else {
                    this.currX = this.finishX;
                    this.direction = undefined;
                }
                return true;
            }
            if (this.direction==="Y") {
                var lenghtY = Math.abs(this.startY - this.finishY);
                var currLenghtY = Math.abs(this.startY - this.currY);
                if (currLenghtY<=lenghtY) {
                    this.currY += this.speedY;
                }
                else {
                    this.currY = this.finishY;
                    this.direction = undefined;
                }
                return true;
            }
            return false;
        };

        draw = function() {
            this.cnt.strokeStyle = this.color;
            this.cnt.lineWidth = this.width;
            this.cnt.beginPath();
            this.cnt.moveTo(this.startX,this.startY);
            this.cnt.lineTo(this.currX,this.currY);
            this.cnt.stroke();
        };
    };

    class Blade {

        constructor(elem,fieldSizes,types,speed) {
            this.elem = elem;
            this.fieldSizes = fieldSizes;
            this.startTop = this.fieldSizes.bottom + elem.offsetHeight/4;
            this.startLeft = this.fieldSizes.left + this.fieldSizes.width/2 - elem.offsetWidth/2;
            this.isCutting = false;
            this.cutInfo;
            this.types = types;
            this.speed = speed;
        };

        create = function() {
            this.update();
            this.elem.classList.remove("game__blade--hidden");
            window.addEventListener("mousedown", startMoveBlade);
            window.addEventListener('touchstart', startMoveBlade,{passive: false});
            this.goToStart();
        };

        goToStart = function() {
            this.elem.classList.remove("game__blade--active");
            this.slit1 = undefined;
            this.slit2 = undefined;
            this.elem.style.top = this.startTop + "px";
            this.elem.style.left = this.startLeft + "px";
        }

        takeCutInfo = function(type,x,y) {
            var arrNew = [];
            var pointsArr = window.field.points;
            var pointsArrNew = [];
            var pointsArrNew2 = [];
            var pointsNew = [];
            var pointNew1 = {};
            var pointNew2 = {};
            switch(type) {
                case "top-right":
                    pointsArr.forEach(function(point) {
                        if (!(point.x>=x&&point.y<=y)) {
                            pointsArrNew.push(point);
                        } else {
                            pointsArrNew2.push(point);
                        }
                    });
                    pointNew1.x = pointsArrNew2.sort((a,b) => {return b.x-a.x})[0].x;
                    pointNew1.y = y;
                    pointNew2.x = x;
                    pointNew2.y = pointsArrNew2.sort((a,b) => {return a.y-b.y})[0].y;
                    pointsNew.push(pointNew1);
                    pointsNew.push(pointNew2);
                    pointsNew.push({x:x,y:y});
                    break;
                case "top-left":
                    pointsArr.forEach(function(point) {
                        if (!(point.x<=x&&point.y<=y)) {
                            pointsArrNew.push(point);
                        } else {
                            pointsArrNew2.push(point);
                        }
                    });
                    pointNew1.x = pointsArrNew2.sort((a,b) => {return a.x-b.x})[0].x;
                    pointNew1.y = y;
                    pointNew2.x = x;
                    pointNew2.y = pointsArrNew2.sort((a,b) => {return a.y-b.y})[0].y;
                    pointsNew.push(pointNew1);
                    pointsNew.push(pointNew2);
                    pointsNew.push({x:x,y:y});
                    break;
                case "bottom-right":
                    pointsArr.forEach(function(point) {
                        if (!(point.x>=x&&point.y>=y)) {
                            pointsArrNew.push(point);
                        } else {
                            pointsArrNew2.push(point);
                        }
                    });
                    pointNew1.x = pointsArrNew2.sort((a,b) => {return b.x-a.x})[0].x;
                    pointNew1.y = y;
                    pointNew2.x = x;
                    pointNew2.y = pointsArrNew2.sort((a,b) => {return b.y-a.y})[0].y;
                    pointsNew.push(pointNew1);
                    pointsNew.push(pointNew2);
                    pointsNew.push({x:x,y:y});
                    break;
                case "bottom-left":
                    pointsArr.forEach(function(point) {
                        if (!(point.x<=x&&point.y>=y)) {
                            pointsArrNew.push(point);
                        } else {
                            pointsArrNew2.push(point);
                        }
                    });
                    pointNew1.x = pointsArrNew2.sort((a,b) => {return a.x-b.x})[0].x;
                    pointNew1.y = y;
                    pointNew2.x = x;
                    pointNew2.y = pointsArrNew2.sort((a,b) => {return b.y-a.y})[0].y;
                    pointsNew.push(pointNew1);
                    pointsNew.push(pointNew2);
                    pointsNew.push({x:x,y:y});
                    break;
                case "right-left":
                    pointsArr.forEach(function(point) {
                        if (point.y<y) {
                            pointsArrNew.push(point);
                        } else {
                            pointsArrNew2.push(point);
                        }
                    });
                    pointsArrNew2.sort((a,b) => {return a.x-b.x});
                    pointNew1.x = pointsArrNew2[0].x;
                    pointNew1.y = y;
                    pointNew2.x = pointsArrNew2[pointsArrNew2.length-1].x;
                    pointNew2.y = y;
                    pointsNew.push(pointNew1);
                    pointsNew.push(pointNew2);
                    break;
                case "top-bottom":
                    pointsArr.forEach(function(point) {
                        if (point.x<x) {
                            pointsArrNew.push(point);
                        } else {
                            pointsArrNew2.push(point);
                        }
                    });
                    pointsArrNew2.sort((a,b) => {return a.y-b.y});
                    pointNew1.x = x;
                    pointNew1.y = pointsArrNew2[0].y;
                    pointNew2.x = x;
                    pointNew2.y = pointsArrNew2[pointsArrNew2.length-1].y;
                    pointsNew.push(pointNew1);
                    pointsNew.push(pointNew2);
                    break;
                default:
                    break;
            }
            arrNew = [pointsArrNew,pointsArrNew2];
            return {arrNew:arrNew, pointsNew:pointsNew};
        };

        cut = function() {
            var slitInMove1 = this.slit1.move();
            var slitInMove2 = this.slit2.move();
            this.isCutting = slitInMove1||slitInMove2;
            if (this.isCutting) {
                this.slit1.draw();
                this.slit2.draw();
            } else {
                window.field.cut(this.cutInfo);
                this.update();
                this.goToStart();

            }
        }

        drop = function() {
            var centerY = blade.offsetTop + blade.offsetHeight/2;
            var centerX = blade.offsetLeft + blade.offsetWidth/2;
            var pointX = Math.round(centerX - this.fieldSizes.left);
            var pointY = Math.round(centerY - this.fieldSizes.top);
            //проверим попали ли мы в игровое поле
            var actualRect = window.utils.findActualRect(window.field.rects,pointX,pointY);
            if (!actualRect) {
                this.goToStart();
            } else {
                this.elem.classList.add("game__blade--active");
                this.cutInfo = this.takeCutInfo(this.type,pointX,pointY);
                this.slit1 = new Slit(window.context,"#ffffff",1,pointX,pointY,this.cutInfo.pointsNew[0].x,this.cutInfo.pointsNew[0].y,this.speed);
                this.slit2 = new Slit(window.context,"#ffffff",1,pointX,pointY,this.cutInfo.pointsNew[1].x,this.cutInfo.pointsNew[1].y,this.speed);
                this.isCutting = true;
                console.log(this.type + " cut point x:" + pointX + " y:" + pointY);
            }
        }

        update() {
            this.elem.classList.remove("game__blade--" + this.type);
            var type = this.types[window.utils.randomDiap(0,this.types.length-1)];
            this.type = type;
            this.elem.setAttribute("data-type", type);
            this.elem.classList.add("game__blade--" + type);
        }
    }

    var mouseStart;
    var mouseShift;
    var limits;
    var blade;

    function startMoveBlade(evt) {

        blade = window.blade.elem;
       
        if (evt.target!==blade) {
            console.log(blade);
            return;
        }
        evt.preventDefault();
        if (evt instanceof TouchEvent) {
            evt = evt.changedTouches[0];
        }

        //перемещаем объект
        blade.style.top = blade.offsetTop + "px";
    
        window.addEventListener('mousemove', moveBlade);
        window.addEventListener('mouseup', endMoveBlade);
        
        window.addEventListener('touchmove', moveBlade,{ passive: false });
        window.addEventListener('touchend', endMoveBlade);
        
        //начальные координаты мышки/пальца
        mouseStart = {
            x: evt.clientX,
            y: evt.clientY
        };

        //пределы
        /*var leftMax = blade.offsetLeft + blade.offsetWidth;
        var topMax = blade.offsetTop + blade.offsetHeight;
        var rightMin = cntGame.offsetWidth - blade.offsetLeft;
        var bottomMin = cntGame.offsetHeight - blade.offsetTop;
        /*limits = {
            bottom: cntGame.offsetHeight - blade.offsetHeight,
            right: cntGame.offsetWidth - blade.offsetWidth,
        };*/
        limits = {
            bottom: document.documentElement.clientHeight - blade.offsetHeight,
            right: document.documentElement.clientWidth - blade.offsetWidth,
        };
    }

    function moveBlade(evt) {
        evt.preventDefault();
        if (evt instanceof TouchEvent) {
            evt = evt.changedTouches[0];
        }
        //смещение мышки относительно начальных координат
        mouseShift = {
            x: evt.clientX - mouseStart.x,
            y: evt.clientY - mouseStart.y 
        };
        //новые стартовые координаты мышки
        mouseStart = {
            x: evt.clientX,
            y: evt.clientY
        };
        //показатели смещения
        var leftShift = Math.max(blade.offsetLeft + mouseShift.x,0);
        var topShift = Math.max(blade.offsetTop + mouseShift.y,0);
        //var leftShift = blade.offsetLeft + mouseShift.x;
        //var topShift = blade.offsetTop + mouseShift.y;

        //перемещаем объект
        blade.style.top = Math.min(topShift, limits.bottom) + "px";
        blade.style.left = Math.min(leftShift, limits.right) + "px";
    }

    function endMoveBlade(evt) {
        evt.preventDefault();
        window.blade.drop();
        window.removeEventListener('mousemove', moveBlade);
        window.removeEventListener('mouseup', endMoveBlade);
        
        window.removeEventListener('touchmove', moveBlade);
        window.removeEventListener('touchend', endMoveBlade);
    }

    window.Blade = Blade;

})();
