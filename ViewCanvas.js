'use strict';

class ViewCanvas {
    
    constructor(context,fieldSize,borderSize,bgColor,borderColor,ballColor,ballRadius,ballSpeed,levelInfo,levelColors,imageBall,cntBlade,cntField,cntCounter,cntProgress,cntProgressValue,bladeTypes,bladeSpeed) {
        this.cnt = context;
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
        this.bgColor = "rgba(255, 255, 255, 0.3)";
        this.borderColor = "#FFFFFF";
        this.levelColor = "#FFC312";
        this.slitColor = "#FFFFFF";
        this.borderSize = 5;
        //this.isCutting;
    };

    start = function(model) {
        this.myModel = model;
        this.update();
    }

    draw = function(rectsBg,rects,slits,ball) {
        //****************************************очищаем канвас
        this.cnt.clearRect(0, 0, this.fieldSize + this.borderSize*2, this.fieldSize + this.borderSize*2);

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
            this.cnt.fillRect(rect.left-this.borderSize,rect.top-this.borderSize,rect.right-rect.left+this.borderSize*2,rect.bottom-rect.top+this.borderSize*2);
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
            this.cnt.lineWidth = slit.width;
            this.cnt.beginPath();
            this.cnt.moveTo(slit.startX,slit.startY);
            this.cnt.lineTo(slit.currX,slit.currY);
            this.cnt.stroke();
            this.cnt.closePath();
            this.cnt.beginPath();
            this.cnt.arc(slit.currX, slit.currY, slit.width*2, 0, Math.PI*2, false);
            this.cnt.fill();
            this.cnt.closePath();
            this.cnt.beginPath();
            this.cnt.arc(slit.startX, slit.startY, slit.width*2, 0, Math.PI*2, false);
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
        this.draw();
    }
};
