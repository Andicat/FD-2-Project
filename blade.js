'use strict';

(function () {

    class Slit {

        constructor(startX,startY,finishX,finishY,speedX,speedY) {
            this.startX = startX;
            this.startY = startY;
            this.finishX = finishX;
            this.finishY = finishY;
            this.currX = startX;
            this.currY = startY;
            this.speedX = speedX;
            this.speedY = speedY;
            this.cnt;
            this.width;
            this.color;
        };

        draw = function(context,color,width) {
            this.cnt = context;
            this.color = color;
            this.width = width;
            this.cnt.strokeStyle = this.color;
            this.cnt.lineWidth = this.width;
            this.cnt.beginPath();
            this.cnt.moveTo(this.startX,this.startY);
            this.cnt.lineTo(this.currX,this.currY);
            this.cnt.stroke();
        };
    };

    class Blade {

        constructor(elem,fieldSizes) {
            this.elem = elem;
            this.fieldSizes = fieldSizes;
            this.startTop = this.fieldSizes.bottom + elem.offsetHeight/4;
            this.startLeft = this.fieldSizes.left + this.fieldSizes.width/2 - elem.offsetWidth/2;
            this.isCutting = false;
        };

        create = function(type) {
            this.elem.classList.remove("game__blade--hidden");
            this.elem.classList.remove("game__blade--" + this.type);
            this.type = type;
            this.elem.setAttribute("data-type", type);
            this.elem.classList.add("game__blade--" + type);
            window.addEventListener("mousedown", startMoveBlade);
            window.addEventListener('touchstart', startMoveBlade,{passive: false});
            this.goToStart();
        };

        goToStart = function() {
            this.elem.style.top = this.startTop + "px";
            this.elem.style.left = this.startLeft + "px";
        }

        takeCutInfo = function(type,x,y) {
            var pointsArr = window.field.points;
            var pointsArrNew = [];
            var pointsArrNew2 = [];
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
                    break;
                case "right-left":
                    pointsArr.forEach(function(point) {
                        if (point.y>y) {
                            pointsArrNew.push(point);
                        } else {
                            pointsArrNew2.push(point);
                        }
                    });
                    pointsArrNew2.sort((a,b) => {return a.x-b.x});
                    pointNew1.x = pointsArrNew2[0].x;
                    pointNew1.y = y;
                    pointNew2.x = pointsArrNew2[pointsArr2.length-1].x;
                    pointNew2.y = y;
                    break;
                case "top-bottom":
                default:
                    break;
            }
            return {pointsArrNew:pointsArrNew, pointsArrNew2:pointsArrNew2, pointNew1:pointNew1, pointNew2:pointNew2, pointBlade: {x:x,y:y}};
        };

        drawCutting = function(context,color,width) {
            var bladeSlit1 = this.bladeSlit1;
            var bladeSlit2 = this.bladeSlit2;
            var isCuttingBladeSlit1 = (bladeSlit1.currX===bladeSlit1.finishX)&&(bladeSlit1.currY===bladeSlit1.finishY);
            var isCuttingBladeSlit2 = (bladeSlit2.currX===bladeSlit2.finishX)&&(bladeSlit2.currY===bladeSlit2.finishY);
            if (!isCuttingBladeSlit1) {
                bladeSlit1.currX += bladeSlit1.speedX;
                bladeSlit1.currY += bladeSlit1.speedY;
                bladeSlit1.draw(context,color,width);
            } else {
                bladeSlit1.draw(context,color,width);
                isCuttingBladeSlit1 = false;
                
            }
            if (!isCuttingBladeSlit2) {
                bladeSlit2.currX += bladeSlit2.speedX;
                bladeSlit2.currY += bladeSlit2.speedY;
                bladeSlit2.draw(context,color,width);
            } else {
                isCuttingBladeSlit2 = false;
                bladeSlit1.draw(context,color,width);
            }
            /*if (!isCuttingBladeSlit1&&!isCuttingBladeSlit2) {
                window.isCutting = false;
                window.points = pointsArrNew;
                window.rects = createRects(window.points);
                window.updateBallInfo();
                blade.style.top = bladeCoords.top + "px";
                blade.style.left = bladeCoords.left + "px";
                startBlade();
            }*/
        }

        finish = function() {
            var centerY = blade.offsetTop + blade.offsetHeight/2;
            var centerX = blade.offsetLeft + blade.offsetWidth/2;
            var pointX = Math.round(centerX - this.fieldSizes.left);
            var pointY = Math.round(centerY - this.fieldSizes.top);
            //проверим попали ли мы в игровое поле
            var actualRect = window.field.findActualRect(pointX,pointY);
            if (!actualRect) {
                this.goToStart();
            } else {
                //режем
                this.elem.classList.add("game__blade--active");
                var pointsInfo = this.takeCutInfo(this.type,pointX,pointY);
                console.log(pointsInfo);
                var bladeStartPoint = pointsInfo.pointBlade;
                var bladeFinishPoint1 = pointsInfo.pointNew1;
                var bladeFinishPoint2 = pointsInfo.pointNew2;
                var bladeSpeedX1 = Math.sign(bladeFinishPoint1.x - bladeStartPoint.x)*2;
                var bladeSpeedY1 = Math.sign(bladeFinishPoint1.y - bladeStartPoint.y)*2;
                var bladeSpeedX2 = Math.sign(bladeFinishPoint2.x - bladeStartPoint.x)*2;
                var bladeSpeedY2 = Math.sign(bladeFinishPoint2.y - bladeStartPoint.y)*2;
                this.bladeSlit1 = new Slit(bladeStartPoint.x,bladeStartPoint.y,bladeFinishPoint1.x,bladeFinishPoint1.y,bladeSpeedX1,bladeSpeedY1);
                this.bladeSlit2 = new Slit(bladeStartPoint.x,bladeStartPoint.y,bladeFinishPoint2.x,bladeFinishPoint2.y,bladeSpeedX2,bladeSpeedY2);
                this.isCutting = true;
            }
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
        window.blade.finish();
        window.removeEventListener('mousemove', moveBlade);
        window.removeEventListener('mouseup', endMoveBlade);
        
        window.removeEventListener('touchmove', moveBlade);
        window.removeEventListener('touchend', endMoveBlade);
    }

    window.Blade = Blade;

})();
