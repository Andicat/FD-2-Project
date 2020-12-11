'use strict';

class ViewCanvas {
    
    constructor(context,container,fieldSize,borderSize,bgColor,borderColor,ballColor,ballRadius,ballSpeed,levelInfo,levelColors,imageBall,cntBlade,cntField,cntCounter,cntProgress,cntProgressValue,bladeTypes,bladeSpeed) {
        this.cnt = context;
        this.blade = container.querySelector('.blade');
        this.field = container.querySelector('.game__field');
        this.progress = container.querySelector('.progress__value');
        this.count = container.querySelector('.game__level');
        /*this.levelInfo = levelInfo;
        this.levelColors = levelColors;
        this.fieldSize = fieldSize;
        
        
        this.InProgress = true;
        this.scaleField = false;
        this.imageBall = imageBall;
        this.ballColor = ballColor;
        this.ballRadius = ballRadius;
        this.ballSpeed = ballSpeed;
        this.cntBlade = cntBlade;
        this.cntField = cntField;
        this.cntCounter = cntCounter;
        this.cntProgress = cntProgress;
        this.cntProgressValue = cntProgressValue;
        this.bladeTypes = bladeTypes;
        this.bladeSpeed = bladeSpeed;*/
        this.myModel;
        this.colorBg = "rgba(255, 255, 255, 0.3)";
        this.borderColor = "#FFFFFF";
        this.levelColor = "#FFC312";
        this.slitColor = "#FFFFFF";
        this.borderSize = 5;
        this.slitWidth = 3;
        //this.isCutting;
    };

    start = function(model) {
        this.myModel = model;
        //this.update();
    }

    draw = function(fieldSize,borderSize,rectsBg,rects,slits,ball) {
        //****************************************очищаем канвас
        this.cnt.clearRect(0, 0, fieldSize + borderSize*2, fieldSize + borderSize*2);

        //****************************************игровое поле
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
        this.cnt.fillStyle = this.levelColor;
        for (var i = 0; i < rects.length; i++) {
            rect = rects[i];
            this.cnt.fillRect(rect.left,rect.top,rect.right-rect.left,rect.bottom-rect.top);
        };
        
        //****************************************слайсеры
        this.cnt.strokeStyle = this.slitColor;
        this.cnt.fillStyle = this.slitColor;    
        slits.forEach(slit => {
            this.cnt.lineWidth = this.slitWidth;
            this.cnt.beginPath();
            this.cnt.moveTo(slit.startX,slit.startY);
            this.cnt.lineTo(slit.currX,slit.currY);
            this.cnt.stroke();
            this.cnt.closePath();
            this.cnt.beginPath();
            this.cnt.arc(slit.currX, slit.currY, this.slitWidth*2, 0, Math.PI*2, false);
            this.cnt.fill();
            this.cnt.closePath();
            this.cnt.beginPath();
            this.cnt.arc(slit.startX, slit.startY, this.slitWidth*2, 0, Math.PI*2, false);
            this.cnt.fill();
            this.cnt.closePath();
        });
        
        //****************************************мячик
        if (this.InProgress) {
            this.cnt.shadowBlur = 0;
            this.cnt.save();
            this.cnt.translate(ball.x,ball.y);
            this.cnt.rotate(ball.rotation*Math.PI/180);
            this.cnt.drawImage(ball.image, 0 - ball.radius, 0 - ball.radius, ball.radius*2, ball.radius*2);
            this.cnt.restore();
        }
    }

    update = function() {
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
        this.InProgress = this.myModel.InProgress;
        this.draw(fieldSize,borderSize,rectsBg,rects,slits,ball);
    }

    updateLevel = function() {
        this.progress.style.width = Math.min(this.myModel.level.progress,100) + "%";
        this.progress.style.backgroundColor = this.levelColor;
        this.progress.style.transitionDuration = "1s";
        //if (this.progress>=100) {
        //this.elemBar.style.transitionDuration = "";
        
    }

    updateBlade = function() {
        var bladeType = this.myModel.blade.type;
        this.blade.classList.remove("blade--active");
        this.blade.style.transform = "";
        this.blade.style.transitionProperty = "top, left";
        this.blade.style.transitionDuration = "1s";
        //this.blade.setAttribute("data-type", bladeType);
        this.blade.classList.add("blade--" + bladeType);
        this.blade.style.top = this.field.offsetTop + this.field.offsetHeight + this.blade.offsetHeight/6 + "px";
        this.blade.style.left = this.field.offsetLeft + this.field.offsetWidth/2 - this.blade.offsetWidth/2 + "px";
    }

    activateBlade = function() {
        var bladeType = this.myModel.blade.type;
        this.blade.classList.remove("blade--" + bladeType);
        this.blade.classList.add("blade--active");
        this.blade.style.transform = "scale(0)";
        //this.blade.style.transform = "";
        //this.blade.style.top = this.field.offsetTop + this.field.offsetHeight + this.blade.offsetHeight/6 + "px";
        //this.blade.style.left = this.field.offsetLeft + this.field.offsetWidth/2 - this.blade.offsetWidth/2 + "px";
    }
};
