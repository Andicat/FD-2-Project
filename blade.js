'use strict';

(function () {

    try {
        var cntGame = window.cntGame;
        var cntField = window.cntField;
        var blade = cntGame.querySelector('.game__blade');
    } catch {
        return;
    }

    class BladeSlit {

        constructor(cnt,color,width) {
            this.cnt = cnt;
            this.width = width;
            this.color = color;
        };

        setSettings(startX,startY,finishX,finishY,speedX,speedY) {
            this.startX = startX;
            this.startY = startY;
            this.finishX = finishX;
            this.finishY = finishY;
            this.speedX = speedX;
            this.speedY = speedY;
        }

        draw = function() {
            this.cnt.strokeStyle = this.color;
            this.cnt.lineWidth = this.width;
            this.cnt.beginPath();
            this.cnt.moveTo(this.startX,this.startY);
            this.cnt.lineTo(this.finishX,this.finishY);
            this.cnt.stroke();
        };
    }

    const TOUCH_SHIFT = 100;
    //const bladeTypes = ["top-right","top-left","bottom-right","bottom-left","right-left","top-bottom"]; 
    const bladeTypes = ["top-right","top-left"]; 

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

    function startBlade() {
        blade.classList.remove("game__blade--" + bladeType);
        bladeType = bladeTypes[randomDiap(0,bladeTypes.length-1)];
        blade.setAttribute("data-type",bladeType);
        blade.classList.add("game__blade--"+bladeType);
        window.addEventListener("mousedown", startMoveBlade);
        window.addEventListener('touchstart', startMoveBlade,{passive: false});
        //blade.addEventListener("dragstart", startMoveBlade);       
        //cntField.addEventListener("dragover", dragOver);
        //cntField.addEventListener("drop", dropBlade);
    }

    function startMoveBlade(evt) {
       
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
        function findActualRect(posX,posY) {
            return window.rects.filter(r => {return (r.top<posY&&r.bottom>posY&&r.left<posX&&r.right>posX)})[0];
        }
        var actualRect = findActualRect(pointX,pointY);
        if (!actualRect) {
            //возвращаем назад лезвие
            blade.style.top = bladeCoords.top + "px";
            blade.style.left = bladeCoords.left + "px";
        } else {
            //режем
            var bladeType = blade.getAttribute("data-type");
            var pointsInfo = window.cutField(bladeType,pointX,pointY);
            cut(pointsInfo);
            //window.points = pointsArr;
            //window.rects = createRects(window.points);
            //window.updateBallInfo();
            blade.style.top = bladeCoords.top + "px";
            blade.style.left = bladeCoords.left + "px";
            startBlade();

        }

        window.removeEventListener('mousemove', moveBlade);
        window.removeEventListener('mouseup', endMoveBlade);
        
        window.removeEventListener('touchmove', moveBlade);
        window.removeEventListener('touchend', endMoveBlade);

        //blade.removeEventListener("drag", moveBlade);
        //blade.removeEventListener("dragend", endMoveBlade);
    }

    function cut(info) {
        var bladeSlit1 = new BladeSlit()
        var bladeStartPoint = info.pointBlade;
        var bladeFinishPoint1 = info.pointNew1;
        var bladeFinishPoint2 = info.pointNew2;
        var bladeSpeedX1 = Math.sign(bladeFinishPoint1.x - bladeStartPoint.x);
        var bladeSpeedY1 = Math.sign(bladeFinishPoint1.y - bladeStartPoint.y);
        var bladeSpeedX2 = Math.sign(bladeFinishPoint2.x - bladeStartPoint.x);
        var bladeSpeedY2 = Math.sign(bladeFinishPoint2.y - bladeStartPoint.y);
        console.log("direction " + bladeType);
        console.log("from " + bladeStartPoint.x + ":" + bladeStartPoint.y + " to " + bladeFinishPoint1.x + ":" + bladeFinishPoint1.y);
        console.log("speed " + bladeSpeedX1 + ":" + bladeSpeedY1);
        console.log("from " + bladeStartPoint.x + ":" + bladeStartPoint.y + " to " + bladeFinishPoint2.x + ":" + bladeFinishPoint2.y);
        console.log("speed " + bladeSpeedX2 + ":" + bladeSpeedY2);


        do {
            
        } while()
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

})();
