'use strict';

(function () {
        
    var mouseStart;
    var mouseShift;
    var rightMin;
    var bottomMin;
    var topMax;
    var limits;
    var leftMax;
    var topMax;
    var centerX;
    var centerY;

    var fieldCoords = getElementCoords(cntField);
    var bladeCoords = getElementCoords(blade);
    var bladeType;
    var bladeSlit1;
    var bladeSlit2;

    window.utils.startMove = function(evt) {
       
        if (evt.target!==blade) {
            return;
        }
        evt.preventDefault();
        if (evt instanceof TouchEvent) {
            evt = evt.changedTouches[0];
        }

        //перемещаем объект
        blade.style.top = (blade.offsetTop - TOUCH_SHIFT) + "px";
    
        window.addEventListener('mousemove', moveBlade);
        window.addEventListener('mouseup', endMoveBlade);
        
        window.addEventListener('touchmove', moveBlade,{ passive: false });
        window.addEventListener('touchend', endMoveBlade);
        
        //blade.addEventListener("drag", moveBlade);
        //blade.addEventListener("dragend", endMoveBlade);
        
        //начальные координаты мышки/пальца
        mouseStart = {
            x: evt.clientX,
            y: evt.clientY
        };

        //пределы
        leftMax = blade.offsetLeft + blade.offsetWidth;
        topMax = blade.offsetTop + blade.offsetHeight;
        rightMin = cntGame.offsetWidth - blade.offsetLeft;
        bottomMin = cntGame.offsetHeight - blade.offsetTop;
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
        centerY = blade.offsetTop + blade.offsetHeight/2;
        centerX = blade.offsetLeft + blade.offsetWidth/2;
        var pointX = Math.round(centerX - fieldCoords.left);
        var pointY = Math.round(centerY - fieldCoords.top);
        //проверим попали ли мы в игровое поле
        var actualRect = window.field.findActualRect(pointX,pointY);
        if (!actualRect) {
            //возвращаем назад лезвие
            blade.style.top = bladeCoords.top + "px";
            blade.style.left = bladeCoords.left + "px";
        } else {
            //режем
            var bladeType = blade.getAttribute("data-type");
            var pointsInfo = window.cutField(bladeType,pointX,pointY);
            cut(pointsInfo);
            window.isCutting = true;
        }

        window.removeEventListener('mousemove', moveBlade);
        window.removeEventListener('mouseup', endMoveBlade);
        
        window.removeEventListener('touchmove', moveBlade);
        window.removeEventListener('touchend', endMoveBlade);

        //blade.removeEventListener("drag", moveBlade);
        //blade.removeEventListener("dragend", endMoveBlade);
    }

    var pointsArrNew;

    function cut(info) {
        var bladeStartPoint = info.pointBlade;
        var bladeFinishPoint1 = info.pointNew1;
        var bladeFinishPoint2 = info.pointNew2;
        var bladeSpeedX1 = Math.sign(bladeFinishPoint1.x - bladeStartPoint.x)*2;
        var bladeSpeedY1 = Math.sign(bladeFinishPoint1.y - bladeStartPoint.y)*2;
        var bladeSpeedX2 = Math.sign(bladeFinishPoint2.x - bladeStartPoint.x)*2;
        var bladeSpeedY2 = Math.sign(bladeFinishPoint2.y - bladeStartPoint.y)*2;
        bladeSlit1 = new BladeSlit(bladeStartPoint.x,bladeStartPoint.y,bladeFinishPoint1.x,bladeFinishPoint1.y,bladeSpeedX1,bladeSpeedY1);
        bladeSlit2 = new BladeSlit(bladeStartPoint.x,bladeStartPoint.y,bladeFinishPoint2.x,bladeFinishPoint2.y,bladeSpeedX2,bladeSpeedY2);
        //console.log("direction " + bladeType);
        //console.log("from " + bladeStartPoint.x + ":" + bladeStartPoint.y + " to " + bladeFinishPoint1.x + ":" + bladeFinishPoint1.y);
        //console.log("speed " + bladeSpeedX1 + ":" + bladeSpeedY1);
        //console.log("from " + bladeStartPoint.x + ":" + bladeStartPoint.y + " to " + bladeFinishPoint2.x + ":" + bladeFinishPoint2.y);
        //console.log("speed " + bladeSpeedX2 + ":" + bladeSpeedY2);

    }

    function drawCutting(context,color,width) {
        var isCuttingBladeSlit1 = (bladeSlit1.currX===bladeSlit1.finishX)&&(bladeSlit1.currY===bladeSlit1.finishY);
        var isCuttingBladeSlit2 = (bladeSlit2.currX===bladeSlit2.finishX)&&(bladeSlit2.currY===bladeSlit2.finishY);
        if (isCuttingBladeSlit1) {
            bladeSlit1.currX += bladeSlit1.speedX;
            bladeSlit1.currY += bladeSlit1.speedY;
            bladeSlit1.draw(context,color,width);
        } else {
            isCuttingBladeSlit1 = false;
        }
        if (isCuttingBladeSlit2) {
            bladeSlit2.currX += bladeSlit2.speedX;
            bladeSlit2.currY += bladeSlit2.speedY;
            bladeSlit2.draw(context,color,width);
        } else {
            isCuttingBladeSlit2 = false;
        }
        if (!isCuttingBladeSlit1&&!isCuttingBladeSlit2) {
            window.isCutting = false;
            window.points = pointsArrNew;
            window.rects = createRects(window.points);
            window.updateBallInfo();
            blade.style.top = bladeCoords.top + "px";
            blade.style.left = bladeCoords.left + "px";
            startBlade();
        }
    }

    function getElementCoords(elem) {
        var bbox = elem.getBoundingClientRect();
    
        var body = document.body;
        var docEl = document.documentElement;
    
        var scrollTop = window.pageYOffset||docEl.scrollTop||body.scrollTop;
        var scrollLeft = window.pageXOffset||docEl.scrollLeft||body.scrollLeft;
    
        var clientTop = docEl.clientTop||body.clientTop||0;
        var clientLeft = docEl.clientLeft||body.clientLeft||0;
    
        var top = bbox.top + scrollTop - clientTop;
        var left = bbox.left + scrollLeft - clientLeft;
    
        return {
            left: left,
            top: top,
            bottom: top + elem.offsetHeight,
            right: left + elem.offsetWidth
        };
    }

    function randomDiap(n,m) {
        return Math.floor(Math.random()*(m-n+1))+n;
    }

    // экспорт
    window.blade = blade;
    window.startBlade = startBlade;
    window.drawCutting = drawCutting;

})();
