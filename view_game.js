'use strict';

class ViewCanvas {
    
    constructor(container) {
        this.canvas;
        this.blade = container.querySelector('.blade');
        this.field = container.querySelector('.game__field');
        this.btnStart = container.querySelector('.game__button--start');
        this.btnBall = container.querySelector('.game__button--ball');
        this.btnSound = container.querySelector('.game__button--sound');
        this.cntProgress = container.querySelector('.game__progress-view');
        this.progress = container.querySelector('.game__progress-view-value');
        this.count = container.querySelector('.game__progress-value');
        this.cntScore = container.querySelector('.game__score');
        this.cntScoreValue = container.querySelector('.game__score-value');
        this.formName = container.querySelector('.game__player-name');
        this.myModel;
        this.colorBg = "rgba(255, 255, 255, 0.3)";
        this.borderColor = "#FFFFFF";
        this.slitColor = "#FFFFFF";
        this.borderSize = null;
        this.slitWidth = null;
        this.soundBlade = new Audio('sound/click.mp3');
        this.soundCut = new Audio('sound/cut.mp3');
        this.soundEnd = new Audio('sound/end.mp3');
        this.soundStart = new Audio('sound/start.mp3');
        this.soundScale = new Audio('sound/scale.mp3');
    };

    //инициализация отображения игры
    start = function(model) {
        this.myModel = model;
        //создаем канвас
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width",this.myModel.canvasSize);
        this.canvas.setAttribute("height",this.myModel.canvasSize);
        this.field.appendChild(this.canvas);
        this.cnt = this.canvas.getContext("2d");
        this.updateBallImage();
        this.updateSound();
        this.updateStartScore();
    }

    //обновление стартовой страницы
    updateStartScore = function() {
        if (this.myModel.name) {
            this.formName.classList.add("hidden");
        }
        if (this.myModel.bestScore) {
            this.cntScoreValue.textContent = this.myModel.bestScore;
        } else {
            this.cntScore.classList.add("hidden");
        }
    }

    //инициализация звука
    initSound = function() {
        if (this.myModel.soundOff) {
            return;
        }
        var playPromise = this.soundBlade.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
            this.soundBlade.pause();
            })
        }
        var playPromise = this.soundCut.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
            this.soundCut.pause();
            })
        }
        var playPromise = this.soundEnd.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
            this.soundEnd.pause();
            })
        }
        var playPromise = this.soundScale.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
            this.soundScale.pause();
            })
        }
        var playPromise = this.soundStart.play();
    }

    //прогрывание звука, вибрация
    sound = function(type) {
        if (this.myModel.soundOff) {
            return;
        }
        this[type].currentTime = 0;
        if (type==="soundCut") {
            this[type].playbackRate = 1 + Math.max(1*(this.myModel.level.progress?this.myModel.level.progress:100)/100,0);
        }
        this[type].play();
        if ( navigator.vibrate ) {
            if (type==="soundEnd") {
                window.navigator.vibrate(300,100,300,100,300);
            } else {
                window.navigator.vibrate(100);
            }
        }
    }

    //отрисовка на канвасе
    draw = function(fieldSize,borderSize,slitWidth,rectsBg,rects,slits,ball) {
        //очищаем канвас
        this.cnt.clearRect(0, 0, fieldSize + borderSize*2, fieldSize + borderSize*2);

        //игровое поле
        //подложка
        this.cnt.fillStyle = this.colorBg;
        for (var i = 0; i < rectsBg.length; i++) {
            var rect = rectsBg[i];
            this.cnt.fillRect(rect.left,rect.top,rect.right-rect.left,rect.bottom-rect.top);
        };
        //обводка
        this.cnt.fillStyle = this.borderColor;
        for (var i = 0; i < rects.length; i++) {
            var rect = rects[i];
            this.cnt.fillRect(rect.left-borderSize,rect.top-borderSize,rect.right-rect.left+borderSize*2,rect.bottom-rect.top+borderSize*2);
        };
        //текущее игровое поле
        this.cnt.fillStyle = "rgb(" + this.myModel.level.color.red + "," + this.myModel.level.color.green + "," + this.myModel.level.color.blue + ")";
        for (var i = 0; i < rects.length; i++) {
            rect = rects[i];
            this.cnt.fillRect(rect.left,rect.top,rect.right-rect.left,rect.bottom-rect.top+0.1);
        };
        
        //слайсеры
        this.cnt.strokeStyle = this.slitColor;
        this.cnt.fillStyle = this.slitColor;    
        slits.forEach(slit => {
            this.cnt.lineWidth = slitWidth;
            this.cnt.beginPath();
            this.cnt.moveTo(slit.startX,slit.startY);
            this.cnt.lineTo(slit.currX,slit.currY);
            this.cnt.stroke();
            this.cnt.closePath();
            this.cnt.beginPath();
            this.cnt.arc(slit.currX, slit.currY, slitWidth*2, 0, Math.PI*2, false);
            this.cnt.fill();
            this.cnt.closePath();
            this.cnt.beginPath();
            this.cnt.arc(slit.startX, slit.startY, slitWidth*2, 0, Math.PI*2, false);
            this.cnt.fill();
            this.cnt.closePath();
        });
        
        //мячик
        this.cnt.shadowBlur = 0;
        this.cnt.save();
        this.cnt.translate(ball.x,ball.y);
        this.cnt.rotate(ball.rotation*Math.PI/180);
        this.cnt.drawImage(ball.image, 0 - ball.radius, 0 - ball.radius, ball.radius*2, ball.radius*2);
        this.cnt.restore();
    }

    //обновление отображения
    update = function() {
        if (this.myModel.isResizing) {
            this.updateSizes();
        }
        if (!this.myModel.inProgress&&!this.myModel.isScaling&&!this.myModel.isResizing) {
            this.field.style.opacity = "0";
            this.cntProgress.style.opacity = "0";
            var fieldSize = this.myModel.fieldSize; 
            var borderSize = this.myModel.borderSize;
            this.count.style.opacity = "0";
            this.btnStart.textContent = "Again";
            this.sound("soundEnd");
            if (this.myModel.bestScore) {
                this.cntScoreValue.textContent = this.myModel.bestScore;
                this.cntScore.classList.remove("hidden");
            }
            this.updateSizes();
            setTimeout(function(){ location.hash = "Menu";},1000);
            return;
        }
        this.field.style.opacity = "1";
        this.cntProgress.style.opacity = "1";
        this.count.style.opacity = "1";
            
        var rectsBg = this.myModel.field.rectsBg;
        var rects = this.myModel.field.rects;
        var slits = [];
        if (this.myModel.slit1) {
            slits.push(this.myModel.slit1);
        }
        if (this.myModel.slit2) {
            slits.push(this.myModel.slit2);
        }
        var ball = this.myModel.ball;
        var fieldSize = this.myModel.fieldSize; 
        var borderSize = this.myModel.borderSize;
        var slitWidth = this.myModel.slitWidth; 
        this.draw(fieldSize,borderSize,slitWidth,rectsBg,rects,slits,ball);
    }

    //обновление размеров игры
    updateSizes = function() {
        this.canvas.setAttribute("width",this.myModel.canvasSize);
        this.canvas.setAttribute("height",this.myModel.canvasSize);
        this.blade.style.top = this.field.offsetTop + this.field.offsetHeight + this.blade.offsetHeight + "px";
        this.blade.style.left = this.field.offsetLeft + this.field.offsetWidth/2 - this.blade.offsetWidth/2 + "px";
    }

    //обновление уровня
    updateLevel = function() {
        this.progress.style.width = Math.min(this.myModel.level.progress,100) + "%";
        this.progress.style.backgroundColor = "rgb(" + this.myModel.level.color.red + "," + this.myModel.level.color.green + "," + this.myModel.level.color.blue + ")";
        this.progress.style.transitionDuration = "0.5s";
        this.count.textContent = this.myModel.level.count;
        if (this.myModel.isScaling) {
            this.progress.style.transitionDuration = "";
            this.count.textContent = this.myModel.level.count;
        } 
        if (!this.myModel.blade.isActive) {
            this.sound("soundCut");
        }    
    }

    //обновление фигурки-лезвия
    updateBlade = function() {
        if (this.myModel.blade.isActive) {
            this.blade.classList.remove("hidden");
            this.blade.classList.remove("blade--active");
            if (this.myModel.blade.isTurn) {
                this.blade.style.transitionProperty = "top, left";
                this.blade.style.transitionDuration = "0.7s";
            } else {
                this.blade.style.transitionProperty = "";
                this.blade.style.transitionDuration = "";
            }
            this.blade.style.transform = "";
            this.blade.style.top = this.field.offsetTop + this.field.offsetHeight + this.blade.offsetHeight + "px";
            this.blade.style.left = this.field.offsetLeft + this.field.offsetWidth/2 - this.blade.offsetWidth/2 + "px";
            this.blade.classList.add("blade--" + this.myModel.blade.type);
           
        } else {
            this.blade.classList.add("blade--active");
            this.blade.classList.remove("blade--" + this.myModel.blade.type);
            this.blade.style.transform = "scale(0)";
            this.blade.style.transitionDuration = "1s";
            this.sound("soundBlade");
        }
    }

    //обновление настроек звука
    updateSound = function() {
        if (this.myModel.soundOff) {
            this.btnSound.classList.add("game__button--sound-off");
        } else {
            this.btnSound.classList.remove("game__button--sound-off");
        }
    }

    //обновление изображения мячика
    updateBallImage = function() {
        this.btnBall.style.backgroundImage = "url('img/" + this.myModel.ballImageSrc + "')";
    }
};
