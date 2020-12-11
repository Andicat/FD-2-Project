'use strict';

class Game {
    
    constructor(canvasSize) {
        this.borderSize = canvasSize*0.01;
        this.fieldSize = canvasSize - this.borderSize*2;
        this.myView = null;
        this.level = null;
        this.pointsStart = [
            {x:this.borderSize,y:this.borderSize},
            {x:this.borderSize + this.fieldSize,y:this.borderSize},
            {x:this.borderSize + this.fieldSize,y:this.fieldSize + this.borderSize},
            {x:this.borderSize,y: this.borderSize + this.fieldSize},
        ],
        this.InProgress = false;

        /*this.cnt = context;
        this.levelInfo = levelInfo;
        this.levelColors = levelColors;
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
        this.bladeSpeed = bladeSpeed;*/
    };

    start = function(view) {
        this.InProgress = true;
        this.myView = view;
        
        this.field = new Field(this.pointsStart,this.pointsStart);
        this.level = new Level(1,this.pointsStart,50);
        //window.blade = new Blade(this.cnt,this.cntBlade,window.utils.getElementCoords(this.cntField),this.bladeTypes,this.bladeSpeed,this.borderColor,this.ballRadius/3);
        //window.blade.activate();
        //window.ball = new Ball(this.cnt,this.ballColor,this.ballRadius,this.ballSpeed,this.imageBall);
        //window.ball.activate();
    }

    initLevel = function() {
        window.level = new Level(this.cntCounter, this.levelInfo.count, this.cntProgressValue, this.levelInfo.pointsStart, this.levelInfo.percentToWin, this.levelInfo.color);
        window.field = new Field(this.cnt,this.bgColor,this.levelInfo.color,this.levelInfo.pointsStart,this.levelInfo.pointsStart,this.borderSize,this.borderColor);
        window.level.init(field);
        window.blade = new Blade(this.cnt,this.cntBlade,window.utils.getElementCoords(this.cntField),this.bladeTypes,this.bladeSpeed,this.borderColor,this.ballRadius/3);
        window.blade.activate();
        window.ball = new Ball(this.cnt,this.ballColor,this.ballRadius,this.ballSpeed,this.imageBall);
        window.ball.activate();
    }

    /*draw = function() {
        this.cnt.clearRect(0, 0, this.fieldSize + this.borderSize*2, this.fieldSize + this.borderSize*2);
        window.field.draw();
        if (window.blade && window.blade.isCutting) {
            window.blade.cut();
        }
        if (this.InProgress) {
            window.ball.move();
        }
    }*/

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

class Rect {
    constructor(top,bottom,left,right) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
        this.square = Math.round((right-left)*(bottom-top));
    };
};

class Field {
    
    constructor(pointsBg,points) {
        this.pointsBg = pointsBg;
        this.points = points;
        this.rectsBg = this.createRects(this.pointsBg);
        this.rects = this.createRects(this.points);
    };

    createRects = function(pointsArr) {
        var rect;
        var rects = [];
        var left;
        var right;
        var top;
        var bottom;
        var leftPrev;
        var rightPrev;
        var sortY = Array.from(new Set(pointsArr.map(p => p.y).sort((a,b) => {return a-b})));
        
        for (var i = 0; i < sortY.length-1; i++) {
            top = sortY[i];
            bottom = sortY[i+1];
            var pointsX = pointsArr.filter(p => {return p.y===top}).map(p => p.x).sort((a,b) => {return a-b});
            if (pointsX.length===4) { //если точек 4
                left = pointsX[0]!==leftPrev?pointsX[0]:pointsX[1];
                right = pointsX[3]!==rightPrev?pointsX[3]:pointsX[2];
            } else { //если точек 2
                if (!leftPrev&&!rightPrev) { //самый первый 
                    left = pointsX[0];
                    right = pointsX[1];
                } else if(pointsX[0]===leftPrev) { //сужение слева
                    left = pointsX[1];
                    right = rightPrev;
                } else if(pointsX[1]===leftPrev) { //расширение слева
                    left = pointsX[0];
                    right = rightPrev;
                } else if(pointsX[1]===rightPrev) { //сужение справа
                    left = leftPrev;
                    right = pointsX[0];
                } else if(pointsX[0]===rightPrev) { //расширение справа
                    left = leftPrev;
                    right = pointsX[1];
                }
            }
            leftPrev = left;
            rightPrev = right;
            rect = new Rect(top,bottom,left,right);
            rects.push(rect);
        }
        return rects;
    };

    cut = function(cutInfo) {
        for (var i = 0; i< cutInfo.arrNew.length; i++) {
            var arr = cutInfo.arrNew[i].concat(cutInfo.pointsNew);
            var rects = this.createRects(arr);
            var isBall = window.utils.findActualRect(rects,window.ball.x,window.ball.y,window.ball.radius);
            if (isBall) {
                this.points = arr;
                this.rects = this.createRects(this.points);
                this.points = arr;
                window.ball.updateActualRect();
                window.level.updateProgress(this);
                window.utils.getMaxCoords(this.points);
                return;
            }
        }
    }
};

class Level {
    constructor(count,pointsStart,percent,color) {
        this.count = count;
        this.pointsStart = pointsStart;
        this.pointsCurr = pointsStart;
        this.percent = percent;
        this.color = color;
        this.squareStart;
        this.squareCurr;
        this.progress;
        this.squareStart = window.utils.calculateSquare(field.rectsBg);
    };

    updateProgress = function(field) {
        this.pointsCurr = field.points;
        this.squareCurr = window.utils.calculateSquare(field.rects);
        this.progress = Math.round((this.squareStart - this.squareCurr)/(this.squareStart/100*(100-this.percent))*100);
        this.elemBar.style.width = Math.min(this.progress,100) + "%";
        this.elemBar.style.transitionDuration = "1s";
        if (this.progress>=100) {
            this.elemBar.style.transitionDuration = "";
            window.game.finishLevel();
        } else {
            window.blade.update();
        }
    }
};


class Ball {

    constructor(radius,speed,image) {
        this.speedX = window.utils.randomSign()*speed;
        this.speedY = window.utils.randomSign()*speed;
        this.radius = radius;
        this.x;
        this.y;
        this.actualRect;
        this.image = new Image();
        this.image.src = image;
        this.rotation;
    };

    activate = function() {
        this.actualRect = window.field.rects[0];
        this.x = this.actualRect.left + (this.actualRect.right-this.actualRect.left)/2 - this.radius;
        this.y = this.actualRect.top + (this.actualRect.bottom-this.actualRect.top)/2 - this.radius;
        this.rotation = 0;
    }

    move = function() {
        this.x += this.speedX;
        this.y += this.speedY;
                        
        var nextRect;
        
        //проверка области
        if ((this.x + this.radius) > this.actualRect.right) { //right
            this.speedX =- this.speedX;
            this.x = this.actualRect.right - this.radius;
        } else if ((this.x - this.radius) < this.actualRect.left) { //left
            this.speedX =- this.speedX;
            this.x = this.actualRect.left + this.radius;
        } else if (((this.y + this.radius) > this.actualRect.bottom)&&this.speedY>0) { //bottom
            nextRect = window.utils.findActualRect(window.field.rects,this.x,this.y+this.radius,this.radius);
            if (!nextRect) {
                this.speedY =- this.speedY;
                this.y = this.actualRect.bottom - this.radius;
            } else {
                this.actualRect = nextRect;
            }
        } else if (((this.y - this.radius) < this.actualRect.top)&&this.speedY<0) { //top
            nextRect = window.utils.findActualRect(window.field.rects,this.x,this.y-this.radius,this.radius);
            if (!nextRect) {
                this.speedY =- this.speedY;
                this.y = this.actualRect.top + this.radius;
            } else {
                this.actualRect = nextRect;
            }
        }
        // проверка коллизии с линиями blade
        if (window.blade.isCutting) {
            var hit = window.utils.hitSlit(this,window.blade.slit1)||window.utils.hitSlit(this,window.blade.slit2);
            if (hit) {
                window.game.finish();
                return;
            }
        }
    };

    updateActualRect = function() {
        this.actualRect = window.utils.findActualRect(window.field.rects,this.x,this.y,this.radius);
    }
}

