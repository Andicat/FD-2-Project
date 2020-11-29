'use strict';

//blade

(function () {

    try {
        var cntGame = window.cntGame;
        var blade = cntGame.querySelector('.game__blade');
        var cntField = cntGame.querySelector('.game__field');
    } catch {
        return;
    }

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

    function startBlade() {
        window.addEventListener("mousedown", startMove);
        window.addEventListener('touchstart', startMove,{passive: false});
        document.addEventListener("drop", dropBlade);
    }
    
    function startMove(evt) {
        if (evt.target!==blade) {
            return;
        }
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
        leftMax = blade.offsetLeft + blade.offsetWidth;
        topMax = blade.offsetTop + blade.offsetHeight;
        rightMin = cntGame.offsetWidth - blade.offsetLeft;
        bottomMin = cntGame.offsetHeight - blade.offsetTop;
        limits = {
            bottom: cntGame.offsetHeight - blade.offsetHeight,
            right: cntGame.offsetWidth - blade.offsetWidth,
        };
    }

    function move(evt) {
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
        //перемещаем объект
        blade.style.top = Math.min(topShift, limits.bottom) + "px";
        blade.style.left = Math.min(leftShift, limits.right) + "px";
    }

    function endMove(evt) {
        evt.preventDefault();
        centerX = blade.offsetTop + blade.offsetHeight/2;
        centerY = blade.offsetLeft + blade.offsetWidth/2;
        console.log("point is x " + centerX + " y " + centerY);
        window.removeEventListener('mousemove', move);
        window.removeEventListener('touchmove', move);
        window.removeEventListener('mouseup', endMove);
        window.removeEventListener('touchend', endMove);
    } 

    function dropBlade(evt) {
        debugger;
    }

    // экспорт
    window.blade = blade;
    window.startBlade = startBlade;

})();
