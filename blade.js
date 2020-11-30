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
        
        window.addEventListener("mousedown", startMoveBlade);
        window.addEventListener('touchstart', startMoveBlade,{passive: false});
        
        //blade.addEventListener("dragstart", startMoveBlade);       
        
        cntField.addEventListener("dragover", dragOver);
        cntField.addEventListener("drop", dropBlade);
    }

    function dragOver(evt) {
        evt = evt||window.event;
        evt.preventDefault();
    }
    
    function startMoveBlade(evt) {
        //debugger
        if (evt.target!==blade) {
            return;
        }
        //evt.preventDefault();
        if (evt instanceof TouchEvent) {
            evt = evt.changedTouches[0];
        }
    
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
        limits = {
            bottom: cntGame.offsetHeight - blade.offsetHeight,
            right: cntGame.offsetWidth - blade.offsetWidth,
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

        //перемещаем объект
        blade.style.top = Math.min(topShift, limits.bottom) + "px";
        blade.style.left = Math.min(leftShift, limits.right) + "px";
    }

    function endMoveBlade(evt) {
        evt.preventDefault();
        centerX = blade.offsetTop + blade.offsetHeight/2;
        centerY = blade.offsetLeft + blade.offsetWidth/2;
        console.log("end drag point is x " + centerX + " y " + centerY);

        window.removeEventListener('mousemove', moveBlade);
        window.removeEventListener('mouseup', endMoveBlade);
        
        window.removeEventListener('touchmove', moveBlade);
        window.removeEventListener('touchend', endMoveBlade);

        //blade.removeEventListener("drag", moveBlade);
        //blade.removeEventListener("dragend", endMoveBlade);
    } 

    function dropBlade(evt) {
        evt = evt||window.event;
        evt.preventDefault();
        centerX = blade.offsetTop + blade.offsetHeight/2;
        centerY = blade.offsetLeft + blade.offsetWidth/2;
        console.log("drop point is x " + centerX + " y " + centerY);
        //debugger;
    }

    // экспорт
    window.blade = blade;
    window.startBlade = startBlade;

})();
