"use strict";

//controller
class GameController {

    constructor() {
        this.myModel = null;
        this.myContainer = null;
        this.blade = null;
        this.mouseStart = null;
        this.mouseShift = null;
        this.limits = null;
        this.topShift = 0;
    }
    
    start = function(model,container) {
        this.myModel = model;
        this.myContainer = container;
        this.cntBlade = container.querySelector('.blade');
        this.cntField = container.querySelector('.game__field');
        this.fieldSizes = window.utils.getElementCoords(this.cntField);
        this.cntBlade.classList.remove("blade--hidden");
        window.addEventListener("mousedown", this.startMoveBlade.bind(this));
        window.addEventListener('touchstart', this.startMoveBlade.bind(this),{passive: false});

        /*var cntProgress = container.querySelector('.progress');*/
        
        
    }

    startMoveBlade = function(evt) {
    
        var blade = this.cntBlade;
       
        if (evt.target!==blade) {
            return;
        }

        blade.style.transitionProperty = "transform";
        blade.style.transitionDuration = "1s";

        evt.preventDefault();
        if (evt instanceof TouchEvent) {
            evt = evt.changedTouches[0];
            this.topShift = blade.offsetHeight*1.5;
        }

        //перемещаем объект
        blade.style.top = blade.offsetTop - this.topShift + "px";
        //blade.style.top = blade.offsetTop + "px";
    
        window.addEventListener('mousemove', this.moveBlade.bind(this));
        window.addEventListener('mouseup', this.endMoveBlade.bind(this));
        
        window.addEventListener('touchmove', this.moveBlade.bind(this),{ passive: false });
        window.addEventListener('touchend', this.endMoveBlade.bind(this));
        
        //начальные координаты мышки/пальца
        this.mouseStart = {
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
        this.limits = {
            bottom: document.documentElement.clientHeight - blade.offsetHeight,
            right: document.documentElement.clientWidth - blade.offsetWidth,
        };
    }

    moveBlade = function(evt) {
        var blade = this.cntBlade;

        evt.preventDefault();
        if (evt instanceof TouchEvent) {
            evt = evt.changedTouches[0];
        }
        //смещение мышки относительно начальных координат
        var mouseShift = {
            x: evt.clientX - this.mouseStart.x,
            y: evt.clientY - this.mouseStart.y 
        };
        //новые стартовые координаты мышки
        this.mouseStart = {
            x: evt.clientX,
            y: evt.clientY
        };
        //показатели смещения
        var leftShift = Math.max(blade.offsetLeft + mouseShift.x,0);
        var topShift = Math.max(blade.offsetTop + mouseShift.y,0);
        //var leftShift = blade.offsetLeft + mouseShift.x;
        //var topShift = blade.offsetTop + mouseShift.y;

        //перемещаем объект
        blade.style.top = Math.min(topShift, this.limits.bottom) + "px";
        blade.style.left = Math.min(leftShift, this.limits.right) + "px";
        //var shiftTopMouse = mouseStart.y - blade.offsetTop;
        //if (shiftTopMouse<blade.offsetHeight*1.5) {
            //blade.style.top = (mouseStart.y + blade.offsetHeight*1.5) + "px";
            //console.log("shift between " + shiftTopMouse + "height");
        //}
        
    }

    endMoveBlade = function(evt) {
        var blade = this.cntBlade;
        var centerX = blade.offsetLeft + (blade.offsetWidth-1)/2 + 1;
        var centerY = blade.offsetTop + (blade.offsetHeight-1)/2 + 1;
        var pointX = Math.round(centerX - this.fieldSizes.left);
        var pointY = Math.round(centerY - this.fieldSizes.top);
        evt.preventDefault();
        this.myModel.dropBlade(pointX,pointY);
        window.removeEventListener('mousemove', this.moveBlade);
        window.removeEventListener('mouseup', this.endMoveBlade);
        
        window.removeEventListener('touchmove', this.moveBlade);
        window.removeEventListener('touchend', this.endMoveBlade);
    }

    /*stop = function() {
        this.myModel.stop(); // контроллер вызывает только методы модели
    }*/
}
