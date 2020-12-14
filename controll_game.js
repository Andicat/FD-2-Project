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
        this.moveBladeListener;
        this.endMoveBladeListener;
    }
    
    start = function(model,container) {
        this.myModel = model;
        this.myContainer = container;
        this.cntField = container.querySelector('.game__field');
        this.fieldSizes = window.utils.getElementCoords(this.cntField);
        this.cntPlay = container.querySelector('.game__play');
        this.cntIntro = container.querySelector('.game__intro');

        this.cntBlade = container.querySelector('.blade');
        this.cntBlade.classList.remove("blade--hidden");

        //находим все кнопки
        this.btnStart = container.querySelector('.game__button--start');
        this.btnSound = container.querySelector('.game__button--sound');
        this.btnBall = container.querySelector('.game__button--ball');
        this.btnRecord = container.querySelector('.game__button--record');

        //модальное окно выбора мячика
        this.modalBall = document.querySelector('.modal');
        this.btnBallModalClose = this.modalBall.querySelector('.modal__button-close');
        this.formBalls = this.modalBall.querySelector(".balls");

        //назначаем обработчики
        this.btnStart.addEventListener("click", this.startGame.bind(this));
        this.btnBall.addEventListener('click', this.openModalBall.bind(this));
        this.btnBallModalClose.addEventListener("click", this.closeModalBall.bind(this));

        this.modalBall.addEventListener('click', function(evt) {
            if (evt.target === this) {
                evt.target.classList.remove('modal--show');
                document.body.classList.remove('stop-scrolling');
            }
        });
        this.formBalls.addEventListener("change",this.changeBall.bind(this));
        this.btnSound.addEventListener("click", this.changeSound.bind(this));

        window.addEventListener("mousedown", this.startMoveBlade.bind(this));
        window.addEventListener('touchstart', this.startMoveBlade.bind(this),{passive: false});
        window.addEventListener("keydown",this.keyDown.bind(this));
    }

    startMoveBlade = function(evt) {
    
        var blade = this.cntBlade;
       
        if (evt.target!==blade) {
            return;
        }

        if (blade.classList.contains("blade--active")) {
            return;
        }

        blade.style.transitionProperty = "transform";
        blade.style.transitionDuration = "1s";

        evt.preventDefault();
        if (evt instanceof TouchEvent) {
            evt = evt.changedTouches[0];
            this.topShiftTouch = blade.offsetHeight*1.5;
        }

        //перемещаем объект
        blade.style.top = blade.offsetTop - this.topShiftTouch + "px";
        
        this.moveBladeListener = this.moveBlade.bind(this);
        this.endMoveBladeListener = this.endMoveBlade.bind(this);
        window.addEventListener('mousemove', this.moveBladeListener);
        window.addEventListener('mouseup', this.endMoveBladeListener);
        window.addEventListener('touchmove', this.moveBladeListener,{ passive: false });
        window.addEventListener('touchend', this.endMoveBladeListener);
        
        //начальные координаты мышки/пальца
        this.mouseStart = {
            x: evt.clientX,
            y: evt.clientY
        };

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

        //перемещаем объект
        blade.style.top = Math.min(topShift, this.limits.bottom) + "px";
        blade.style.left = Math.min(leftShift, this.limits.right) + "px";
        
        var shiftTopMouse = this.mouseStart.y - blade.offsetTop;
        if (shiftTopMouse < this.topShiftTouch) {
            blade.style.top = "0px";
            //console.log("shift between " + Math.round(shiftTopMouse) + " top shift " + Math.round(topShift) + " TOUCH " + Math.round(this.topShiftTouch));
        }
        
    }

    endMoveBlade = function(evt) {
        var blade = this.cntBlade;
        var centerX = blade.offsetLeft + (blade.offsetWidth-1)/2 + 1;
        var centerY = blade.offsetTop + (blade.offsetHeight-1)/2 + 1;
        var pointX = Math.round(centerX - this.fieldSizes.left);
        var pointY = Math.round(centerY - this.fieldSizes.top);
        evt.preventDefault();
        this.myModel.dropBlade(pointX,pointY);
        window.removeEventListener('mousemove', this.moveBladeListener);
        window.removeEventListener('mouseup', this.endMoveBladeListener);
        window.removeEventListener('touchmove', this.moveBladeListener,{ passive: false });
        window.removeEventListener('touchend', this.endMoveBladeListener);
    }

    changeSound = function(evt) {
        this.myModel.setSound(this.btnSound.classList.contains("game__button--sound-off")?false:true);
    }

    changeBall = function(evt) {
        this.myModel.setBall(evt.target.value);
    }

    keyDown = function(evt) {
        if (evt.keyCode === 27) {
            evt.preventDefault();
            this.closeModalBall();
        }
    }

    // модальное окнo выбора мячиков
    openModalBall = function(evt) {
        evt.preventDefault();
        document.body.classList.add('stop-scrolling');
        this.modalBall.classList.add('modal--show');
        this.formBalls.innerHTML = "";
        //создаем мячики
        var ballsArr = this.myModel.ballsImage;
        for (var i = 0; i < ballsArr.length; i++) {
            var ballItem = document.createElement("li");
            ballItem.classList.add("balls__item");
            this.formBalls.appendChild(ballItem);
            var ballInput = document.createElement("input");
            ballInput.classList.add("visually-hidden");
            ballInput.setAttribute("type","radio");
            ballInput.setAttribute("name","balls");
            ballInput.setAttribute("id","ball-" + (i+1));
            ballInput.setAttribute("value",ballsArr[i]);
            if (this.myModel.ballImageSrc == ballsArr[i]) {
                ballInput.setAttribute("checked","true");
            }
            ballItem.appendChild(ballInput);
            var ballLabel = document.createElement("label");
            ballLabel.setAttribute("for","ball-" + (i+1));
            ballLabel.style.backgroundImage = "url('img/" + ballsArr[i] + "')";
            ballItem.appendChild(ballLabel);
        }
    }

    closeModalBall = function(evt) {
        this.modalBall.classList.remove('modal--show');
        document.body.classList.remove('stop-scrolling');
    }

    startGame = function(evt) { 
        this.cntPlay.classList.remove("hidden");
        this.cntIntro.classList.add("hidden");
        this.myModel.startGame();
    }
}