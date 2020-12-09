'use strict';

(function () {

    class Game {
    
        constructor(context,fieldSize,borderSize,bgColor,borderColor,ballColor,ballRadius,ballSpeed,levelInfo,levelColors,imageBall,cntBlade,cntField,cntCounter,cntProgress,cntProgressValue,bladeTypes,bladeSpeed) {
            this.cnt = context;
            this.levelInfo = levelInfo;
            this.levelColors = levelColors;
            this.fieldSize = fieldSize;
            this.borderSize = borderSize;
            this.borderColor = borderColor;
            this.InProgress = true;
            this.scaleField = false;
            this.imageBall = imageBall;
            this.bgColor = bgColor;
            this.ballColor = ballColor;
            this.ballRadius = ballRadius;
            this.ballSpeed = ballSpeed;
            this.cntBlade = cntBlade;
            this.cntField = cntField;
            this.cntCounter = cntCounter;
            this.cntProgress = cntProgress;
            this.cntProgressValue = cntProgressValue;
            this.bladeTypes = bladeTypes;
            this.bladeSpeed = bladeSpeed;
        };

        initLevel = function() {
            window.level = new Level(this.cntCounter, this.levelInfo.count, this.cntProgressValue, this.levelInfo.pointsStart, this.levelInfo.percentToWin, this.levelInfo.color);
            window.field = new Field(this.cnt,this.bgColor,this.levelInfo.color,this.levelInfo.pointsStart,this.levelInfo.pointsStart,this.borderSize,this.borderColor);
            window.level.init(field);
            window.blade = new Blade(this.cnt,this.cntBlade,window.utils.getElementCoords(this.cntField),this.bladeTypes,this.bladeSpeed,this.borderColor,this.ballRadius/3);
            window.blade.activate();
            window.ball = new Ball(this.cnt,this.ballColor,this.ballRadius,this.ballSpeed,this.imageBall);
            window.ball.activate();
        }

        draw = function() {
            this.cnt.clearRect(0, 0, this.fieldSize + this.borderSize*2, this.fieldSize + this.borderSize*2);
            window.field.draw();
            if (window.blade && window.blade.isCutting) {
                window.blade.cut();
            }
            if (this.InProgress) {
                window.ball.move();
            }
        }

        start = function() {
            this.InProgress = true;
            this.initLevel();
        }

        finish = function() {
            this.InProgress = false;
            this.cntField.style.opacity = "0";
            this.cntProgress.style.opacity = "0";
            this.cntCounter.textContent = "FINISH";
            window.level = null;
            window.field = null;
            window.blade.disactivate();
            window.blade = null;
            window.ball = null;
        }

        finishLevel = function() {
            this.InProgress = false;
            this.draw();
            window.blade.disactivate();
            this.pointsOld = window.level.pointsCurr;
            this.colorOld = window.utils.convertColorHEXtoRGB(this.levelInfo.color);
            this.levelInfo.count += 1;
            this.levelInfo.pointsStart = window.utils.scaleField(window.level.pointsCurr,this.fieldSize, this.borderSize);
            this.levelInfo.percentToWin = 50;
            this.levelInfo.color = this.levelColors[window.utils.randomDiap(0,this.levelColors.length-1)];
            this.pointsNew = this.levelInfo.pointsStart;
            this.colorNew =  window.utils.convertColorHEXtoRGB(this.levelInfo.color);
            this.scaleField = true;
            this.scaleCount = 0;
        }

        scale = function() {
            var newFieldPoints = [];
            var scaleRed = Math.round(this.colorOld.red + (this.colorNew.red - this.colorOld.red)/100*this.scaleCount);
            var scaleGreen = Math.round(this.colorOld.green + (this.colorNew.green - this.colorOld.green)/100*this.scaleCount);
            var scaleBlue = Math.round(this.colorOld.blue + (this.colorNew.blue - this.colorOld.blue)/100*this.scaleCount);
            for (var i = 0; i < this.pointsOld.length; i++) {
                var scaleX = Math.round(this.pointsOld[i].x + (this.pointsNew[i].x - this.pointsOld[i].x)/100*this.scaleCount);
                var scaleY = Math.round(this.pointsOld[i].y + (this.pointsNew[i].y - this.pointsOld[i].y)/100*this.scaleCount);
                newFieldPoints.push({x:scaleX, y:scaleY});
            };
            window.level.elemBar.style.width = (100 - this.scaleCount) + "%";
            window.level.elemBar.style.backgroundColor = "rgb(" + scaleRed + "," + scaleGreen + "," + scaleBlue + ")";
            window.field.color = "rgb(" + scaleRed + "," + scaleGreen + "," + scaleBlue + ")";
            window.field.points = newFieldPoints;
            window.field.rectsBg = [];
            window.field.rects = window.field.createRects(newFieldPoints);
            this.draw();
            this.scaleCount = this.scaleCount + 3;
            if (this.scaleCount >= 100) {
                this.scaleField = false;
                this.start();
            }
        }
    };

    window.Game = Game;
})();
