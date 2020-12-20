"use strict";

//controller
class GameController {

    constructor() {
        this.myModel = null;
        this.myContainer = null;
        this.fieldSizes = null;
        this.blade = null;
        this.mouseStart = null;
        this.mouseShift = null;
        this.limits = null;
        this.topShift = 0;
        this.moveBladeListener;
        this.endMoveBladeListener;
        this.swipeShift = 0;
    }
    
    start = function(model,container) {
        this.myModel = model;
        this.myContainer = container;
        this.cntField = container.querySelector('.game__field');

        this.cntBlade = container.querySelector('.blade');
        this.cntBlade.classList.remove("blade--hidden");

        //звук
        this.btnSound = container.querySelector('.game__button--sound');
        this.btnSound.addEventListener("click", this.changeSound.bind(this));

        //старт игры
        this.btnStart = container.querySelector('.game__button--start');
        this.btnStart.addEventListener("click", this.startGame.bind(this));
        
        //мячики
        this.btnBall = container.querySelector('.game__button--ball');
        this.btnBall.addEventListener('click', this.openModalBall.bind(this));
        this.modalBall = document.querySelector('.modal--balls');
        this.modalBall.addEventListener('click', function(evt) {
            if (evt.target === this) {
                evt.target.classList.remove('modal--show');
                document.body.classList.remove('stop-scrolling');
            }
        });
        this.btnBallModalClose = this.modalBall.querySelector('.modal__button-close');
        this.btnBallModalClose.addEventListener("click", this.closeModalBall.bind(this));
        this.formBalls = document.forms.formBalls;
        this.formBalls.addEventListener("change",this.changeBall.bind(this));
        this.formBalls.addEventListener("mousedown",this.startSwipe.bind(this));
        this.formBalls.addEventListener('touchstart', this.startSwipe.bind(this),{passive: false});

        //рекорды
        this.btnRecord = container.querySelector('.game__button--record');
        this.btnRecord.addEventListener("click",this.openModalRecords.bind(this))
        this.modalRecord = document.querySelector('.modal--records');
        this.modalRecord.addEventListener('click', function(evt) {
            if (evt.target === this) {
                evt.target.classList.remove('modal--show');
                document.body.classList.remove('stop-scrolling');
            }
        });
        this.btnRecordModalClose = this.modalRecord.querySelector('.modal__button-close');
        this.btnRecordModalClose.addEventListener("click", this.closeModalRecords.bind(this));
        this.recordsTable = this.modalRecord.querySelector(".records");
        this.recordsTable.addEventListener("mousedown",this.startSwipe.bind(this));
        this.recordsTable.addEventListener('touchstart', this.startSwipe.bind(this),{passive: false});

        //имя
        this.formName = document.forms.formName;
        this.formName.addEventListener("submit",this.checkName.bind(this));
        this.inputName = this.formName.querySelector('input[name="name"]');
        //this.inputName.addEventListener("keypress", this.checkName.bind(this));

        window.addEventListener("mousedown", this.startMove.bind(this));
        window.addEventListener('touchstart', this.startMove.bind(this),{passive: false});
        window.addEventListener("keydown",this.keyDown.bind(this));
        window.addEventListener("resize",debounce(this.resizeWindow.bind(this)));
        window.onbeforeunload = this.beforeUnload.bind(this);

        //дебоусинг
        function debounce(cb) {
            var DEBOUNCE_INTERVAL = 500;
            var lastTimeout = null;
            return function () {
                var parameters = arguments;
                if (lastTimeout) {
                    window.clearTimeout(lastTimeout);
                }
                lastTimeout = window.setTimeout(function () {
                    cb.apply(this, parameters);
                }, DEBOUNCE_INTERVAL);
            };
        }

        this.resizeWindow();
    }

    //обработка свайпа - пролистывание таблицы рекордовб списка мячиков
    startSwipe = function(evt) {

        if (!evt.touches) {
            return
        }

        if ( evt.touches.length!=1 ) {
            return;
        }
        if ((evt.currentTarget!==this.formBalls)&&(evt.currentTarget!==this.recordsTable)) {
            return;
        }

        //evt.preventDefault();
        this.mouseStart = { x:evt.touches[0].pageX, y:evt.touches[0].pageY };
        evt.currentTarget.addEventListener("mousemove",this.moveSwipe.bind(this));
        evt.currentTarget.addEventListener("touchmove",this.moveSwipe.bind(this));
        evt.currentTarget.addEventListener('mouseup', this.endSwipe.bind(this));
        evt.currentTarget.addEventListener('touchend', this.endSwipe.bind(this));
    }

    moveSwipe = function(evt) {

        if (!evt.touches) {
            return
        }
        
        var HorzShift = Math.round(evt.touches[0].pageX - this.mouseStart.x);
        var VertShift = Math.round(evt.touches[0].pageY - this.mouseStart.y);
        //новые стартовые координаты мышки
        this.mouseStart = {
            x: evt.touches[0].pageX,
            y: evt.touches[0].pageY
        };

        if (Math.abs(VertShift) > Math.abs(HorzShift)) {
            evt.preventDefault();
            evt.currentTarget.removeEventListener("touchmove",this.moveSwipe.bind(this));
            this.swipeShift = Math.min(this.swipeShift + VertShift,0);
            evt.currentTarget.style.transform = "translateY(" + Math.max(this.swipeShift,Math.min((evt.currentTarget.parentNode.offsetHeight-evt.currentTarget.offsetHeight),0)) + "px)";
        }
    }

    endSwipe = function(evt) {
        evt.currentTarget.removeEventListener('mouseup', this.endSwipe);
        evt.currentTarget.removeEventListener('touchmove', this.moveSwipe);
    }

    //обработка мышки/тача - перемещение фигурки
    startMove = function(evt) {
        var blade = this.cntBlade;
       
        if (evt.target!==blade) {
            return;
        }

        if (blade.classList.contains("blade--active")) {
            return;
        }

        //if (!this.fieldSizes) {
        this.fieldSizes = getElementCoords(this.cntField);
        //}

        blade.classList.add("blade--work");
        blade.style.transitionProperty = "transform";
        blade.style.transitionDuration = "1s";

        evt.preventDefault();
        if (window.TouchEvent && evt instanceof TouchEvent) {
        //if (evt instanceof TouchEvent) {
            evt = evt.changedTouches[0];
            this.topShiftTouch = blade.offsetHeight*1.5;
        }

        //перемещаем объект
        blade.style.top = blade.offsetTop - this.topShiftTouch + "px";
        
        this.moveBladeListener = this.move.bind(this);
        this.endMoveBladeListener = this.endMove.bind(this);
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
                width: elem.offsetWidth,
                height: elem.offsetHeight,
                left: left,
                top: top,
                bottom: top + elem.offsetHeight,
                right: left + elem.offsetWidth,
            };
        }
    }

    move = function(evt) {
        var blade = this.cntBlade;

        evt.preventDefault();

        if (window.TouchEvent && evt instanceof TouchEvent) {
        //if (evt instanceof TouchEvent) {
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
        if ((shiftTopMouse < this.topShiftTouch)&&shiftTopMouse) {
            //debugger;
            blade.style.top = "0px";
            
            //console.log("shift between " + Math.round(shiftTopMouse) + " top shift " + Math.round(topShift) + " TOUCH " + Math.round(this.topShiftTouch));
        }
        
    }

    endMove = function(evt) {
        var blade = this.cntBlade;
        var centerX = blade.offsetLeft + (blade.offsetWidth-1)/2 + 1;
        var centerY = blade.offsetTop + (blade.offsetHeight-1)/2 + 1;
        var pointX = Math.round(centerX - this.fieldSizes.left);
        var pointY = Math.round(centerY - this.fieldSizes.top);
        evt.preventDefault();
        this.myModel.dropBlade(pointX,pointY);
        blade.classList.remove("blade--work");
        window.removeEventListener('mousemove', this.moveBladeListener);
        window.removeEventListener('mouseup', this.endMoveBladeListener);
        window.removeEventListener('touchmove', this.moveBladeListener,{ passive: false });
        window.removeEventListener('touchend', this.endMoveBladeListener);
    }

    //смена звука (on-off)
    changeSound = function(evt) {
        this.myModel.setSound(this.btnSound.classList.contains("game__button--sound-off")?false:true);
    }

    //смена мячика
    changeBall = function(evt) {
        this.myModel.setBall(evt.target.value);
        this.closeModalBall();
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
            var ballItem = document.createElement("fieldset");
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

    // модальное окнo рекордов
    openModalRecords = function(evt) {
        evt.preventDefault();
        document.body.classList.add('stop-scrolling');
        this.modalRecord.classList.add('modal--show');
        this.recordsTable.innerHTML = "";
        var recordsArr = this.myModel.recordsTable;
        for (var i = 0; i < recordsArr.length; i++) {
            var rowTable = document.createElement("div");
            rowTable.classList.add("records__row");
            if (this.myModel.name == recordsArr[i].name) {
                rowTable.classList.add(".records__row--you");
            }
            rowTable.style.background = "linear-gradient(90deg, " + recordsArr[i].color + " 0%, rgba(0,0,0,0) 100%)";
            this.recordsTable.appendChild(rowTable);
            var playerScore = document.createElement("span");
            playerScore.classList.add("records__score");
            playerScore.textContent = recordsArr[i].score;
            playerScore.style.backgroundColor = recordsArr[i].color;
            rowTable.appendChild(playerScore);
            var playerName = document.createElement("span");
            playerName.classList.add("records__name");
            playerName.textContent = recordsArr[i].name;
            rowTable.appendChild(playerName);
        }
    }

    closeModalRecords = function(evt) {
        this.modalRecord.classList.remove('modal--show');
        document.body.classList.remove('stop-scrolling');
    }

    //закрытие модальных окон по клавише Esc
    keyDown = function(evt) {
        if (evt.keyCode === 27) {
            evt.preventDefault();
            this.closeModalBall();
            this.closeModalRecords();
        }
    }

    //кпопка "Старт"
    startGame = function(evt) {
        if (!this.myModel.name) {
            if (String(this.inputName.value).trim().length===0) {
                this.formName.classList.add("game__player-name--error");
                return;
            }
            this.myModel.setName(String(this.inputName.value).trim());
        } 
        
        location.hash = "Play";
        setTimeout(this.myModel.clearGame.bind(this.myModel),0);
        setTimeout(this.myModel.startGame.bind(this.myModel),100);
    }
    
    //проверка заполненности имени
    checkName = function(evt) {

        if (String(this.inputName.value).trim().length===0) {
            this.formName.classList.add("game__player-name--error");
            evt.preventDefault();
            return;
        } else {
            this.formName.classList.remove("game__player-name--error");
            this.myModel.setName(String(this.inputName.value).trim());
            evt.preventDefault();
            this.btnStart.focus();
        }
    }

    //уход со страницы    
    beforeUnload = function(evt) {
        if (this.myModel.inProgress||this.myModel.isScaling) {
            evt.returnValue = 'А у вас есть несохранённые изменения!';
        }
    }

     //ресайз окна
    resizeWindow = function(evt) {
        var clientWidth = document.documentElement.clientWidth;
        var clientHeight = document.documentElement.clientHeight;
        //alert(clientHeight +  " " + clientWidth + " " + (clientWidth/clientHeight));
        //var canvasSize = (clientWidth/clientHeight>2/3)?clientHeight*0.6:clientWidth*0.9;
        var canvasSize = Math.min(clientHeight*0.6,clientWidth - clientHeight*0.04);
        //var canvasSize = clientHeight*0.6;
        this.myModel.setSizes(canvasSize); 
        //alert(canvasSize);
        //console.log(document.documentElement.requestFullscreen);
       
    }
}
