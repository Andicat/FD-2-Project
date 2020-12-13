'use strict';

class Game {
    
    constructor(canvasSize) {
        this.borderSize = canvasSize*0.01;
        this.slitWidth = canvasSize*0.008;
        this.fieldSize = canvasSize - this.borderSize*2;
        this.myView = null;
        this.speed = 3;
        this.field = null;
        this.ball = null;
        this.blade = null;
        this.level = null;
        this.levels = [];
        this.pointsStart = [
            {x:this.borderSize,y:this.borderSize},
            {x:this.borderSize + this.fieldSize,y:this.borderSize},
            {x:this.borderSize + this.fieldSize,y:this.fieldSize + this.borderSize},
            {x:this.borderSize,y: this.borderSize + this.fieldSize},
        ],
        this.InProgress = false;
        this.isScaling = false;
        this.isCutting = false;
        this.soundOff = null;
        this.lsName = null;
        this.RAF=
            // находим, какой метод доступен
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            // ни один не доступен
            // будем работать просто по таймеру
            function(callback)
                { window.setTimeout(callback, 1000 / 60); }
            ;
    };

    startGame = function(view,lsName,lsData) {
        this.InProgress = true;
        this.myView = view;
        this.lsData = lsData;
        this.soundOff = this.lsData.soundOff;
        this.lsName = lsName;
        //console.log(this.soundOff);
        this.field = new Field(this.pointsStart,this.pointsStart);
        this.level = new Level(1,this.pointsStart,this.field,50);
        this.ball = new Ball(this.fieldSize,this.field,this.lsData.ballImageSrc);
        this.startLevel();
        this.tick();
    }

    finishGame = function() {
        this.InProgress = false;
        this.isCutting = false;
        for (var i = 0; i < this.levels.length; i++) {
            this.levels[i].rects = this.field.createRects(this.levels[i].pointsCurr);
        }
        this.level = null;
        this.field = null;
        this.blade.isActive = false;
        this.ball = null;
        this.updateView();
    }


    tick = function() {
        if (this.InProgress) {
            this.moveBall();
        }
        if (this.isCutting) {
            this.cutField();
        }
        if (this.isScaling) {
            this.scaleField();
        }
        if (this.InProgress||this.isScaling) {
            this.updateView();
            this.RAF.call(window, this.tick.bind(this));
        }
    }

    updateProgress = function() {
        this.level.pointsCurr = this.field.points;
        this.level.squareCurr = window.utils.calculateSquare(this.field.rects);
        this.level.progress = Math.round((this.level.squareStart - this.level.squareCurr)/(this.level.squareStart/100*(100-this.level.percent))*100);
        this.myView.updateLevel();
        if (this.level.progress>=100) {
            this.finishLevel();
        } else {
            this.updateBlade();
            this.myView.updateBlade();
        }
    }

    updateView = function() {
        if (this.myView) {
            this.myView.update();
        }
    }

    saveLocalStorageData = function() {
        var gameData = {};
        if (this.lsData.bestScore) {
            gameData.bestScore = (Number(this.lsData.bestScore)<this.level.count)?this.level.count:Number(this.lsData.bestScore);    
        } else {
            gameData.bestScore = this.level.count;
        }
        gameData.soundOff = this.soundOff;
        gameData.ballImageSrc = this.ball.imageSrc;
        localStorage.setItem(this.lsName,JSON.stringify(gameData));
    }

    //********************************************************LEVEL
    startLevel = function() {
        this.isScaling = false;
        this.InProgress = true;
        this.level.progress = 0;
        this.field.pointsBg = this.field.points;
        this.field.rectsBg = this.field.createRects(this.field.pointsBg);
        this.level.squareStart = window.utils.calculateSquare(this.field.rectsBg);
        this.blade = new Blade(this.fieldSize);
        this.updateBlade();
        this.updateBallRect();
        this.myView.updateBlade();
        this.myView.updateLevel();
    }

    finishLevel = function() {
        this.InProgress = false;
        this.isCutting = false;
        this.levels.push(this.level);
        var scalingInfo = window.utils.scaleField(this.level.pointsCurr,this.fieldSize, this.borderSize,this.ball);
        this.level = new Level(this.level.count + 1, scalingInfo.points, this.field, 50);
        this.field.rectsBg = [];
        this.scalingInfo = {
            colorPrev: this.levels[this.levels.length-1].color,
            colorNew: {red:this.level.color.red,green:this.level.color.green,blue:this.level.color.blue},
            pointsPrev: this.levels[this.levels.length-1].pointsCurr,
            pointsNew: this.level.pointsStart,
            ballPrev: {x:this.ball.x,y:this.ball.y},
            ballNew: scalingInfo.ball,
         };
        this.isScaling = true;
        this.scaleCount = 0;
        this.saveLocalStorageData();
    }    

    //********************************************************BLADE
    dropBlade = function(pointX, pointY) {
        //проверим попали ли мы в игровое поле
        var actualRect = window.utils.findActualRect(this.field.rects,pointX,pointY,0);
        if (!actualRect) {
            this.blade.isTurn = true;
            this.myView.updateBlade();
        } else {
            this.blade.isActive = false;
            this.blade.isTurn = false;
            this.myView.updateBlade();
            this.cutInfo = window.utils.takeCutInfo(this.field.points,this.blade.type,pointX,pointY);
            this.slit1 = new Slit(pointX,pointY,this.cutInfo.pointsNew[0].x,this.cutInfo.pointsNew[0].y,this.speed*2,this.slitWidth);
            this.slit2 = new Slit(pointX,pointY,this.cutInfo.pointsNew[1].x,this.cutInfo.pointsNew[1].y,this.speed*2,this.slitWidth);
            this.isCutting = true;
        }
    }

    updateBlade() {
        this.blade.isActive = true;
        this.blade.isTurn = false;
        this.blade.type = this.blade.bladeTypes[window.utils.randomDiap(0,this.blade.bladeTypes.length-1)];
    }

    //********************************************************BALL
    moveBall = function() {

        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;   
        this.ball.rotation += 5;      
        var nextRect;
        
        //проверка области
        if ((this.ball.x + this.ball.radius) > this.ball.actualRect.right) { //right
            this.ball.speedX =- this.ball.speedX;
            this.ball.x = this.ball.actualRect.right - this.ball.radius;
        } else if ((this.ball.x - this.ball.radius) < this.ball.actualRect.left) { //left
            this.ball.speedX =- this.ball.speedX;
            this.ball.x = this.ball.actualRect.left + this.ball.radius;
        } else if (((this.ball.y + this.ball.radius) > this.ball.actualRect.bottom)&&this.ball.speedY>0) { //bottom
            nextRect = window.utils.findActualRect(this.ball.field.rects,this.ball.x,this.ball.y+this.ball.radius,this.ball.radius);
            if (!nextRect) {
                this.ball.speedY =- this.ball.speedY;
                this.ball.y = this.ball.actualRect.bottom - this.ball.radius;
            } else {
                this.ball.actualRect = nextRect;
            }
        } else if (((this.ball.y - this.ball.radius) < this.ball.actualRect.top)&&this.ball.speedY<0) { //top
            nextRect = window.utils.findActualRect(this.ball.field.rects,this.ball.x,this.ball.y-this.ball.radius,this.ball.radius);
            if (!nextRect) {
                this.ball.speedY =- this.ball.speedY;
                this.ball.y = this.ball.actualRect.top + this.ball.radius;
            } else {
                this.ball.actualRect = nextRect;
            }
        }
        // проверка коллизии с линиями blade
        if (this.isCutting) {
            var hit = window.utils.hitSlit(this.ball,this.slit1)||window.utils.hitSlit(this.ball,this.slit2);
            if (hit) {
                this.finishGame();
                return;
            }
        }
    }

    updateBallRect = function() {
        this.ball.actualRect = window.utils.findActualRect(this.field.rects,this.ball.x,this.ball.y,this.ball.radius);
    }

    //********************************************************FIELD
    cutField = function() {
        var slitInMove1 = this.slit1.move();
        var slitInMove2 = this.slit2.move();
        this.isCutting = slitInMove1||slitInMove2;
        if (!this.isCutting) {
            this.slit1 = null;
            this.slit2 = null;
            for (var i = 0; i< this.cutInfo.arrNew.length; i++) {
                var arr = this.cutInfo.arrNew[i].concat(this.cutInfo.pointsNew);
                var rects = this.field.createRects(arr);
                var isBall = window.utils.findActualRect(rects,this.ball.x,this.ball.y,this.ball.radius);
                if (isBall) {
                    this.field.points = arr;
                    this.field.rects = this.field.createRects(this.field.points);
                    this.updateBallRect();
                    this.updateProgress();
                    return;
                }
            }
        }
    }

    scaleField = function() {
        if (this.scaleCount > 100) {
            this.startLevel();
            return;
        }
        var newFieldPoints = [];
        var colorPrev = this.scalingInfo.colorPrev;
        var colorNew = this.scalingInfo.colorNew;
        var pointsPrev = this.scalingInfo.pointsPrev;
        var pointsNew = this.scalingInfo.pointsNew;
        var ballPrev = this.scalingInfo.ballPrev;
        var ballNew = this.scalingInfo.ballNew;
        var scaleRed = Math.round(colorPrev.red + (colorNew.red - colorPrev.red)/100*this.scaleCount);
        var scaleGreen = Math.round(colorPrev.green + (colorNew.green - colorPrev.green)/100*this.scaleCount);
        var scaleBlue = Math.round(colorPrev.blue + (colorNew.blue - colorPrev.blue)/100*this.scaleCount);
        var scaleBallX = Math.round(ballPrev.x + (ballNew.x - ballPrev.x)/100*this.scaleCount);
        var scaleBallY = Math.round(ballPrev.y + (ballNew.y - ballPrev.y)/100*this.scaleCount);
        for (var i = 0; i < pointsPrev.length; i++) {
            var scaleX = Math.round(pointsPrev[i].x + (pointsNew[i].x - pointsPrev[i].x)/100*this.scaleCount);
            var scaleY = Math.round(pointsPrev[i].y + (pointsNew[i].y - pointsPrev[i].y)/100*this.scaleCount);
            newFieldPoints.push({x:scaleX, y:scaleY});
        };
        this.level.progress = 100 - this.scaleCount;
        this.level.color.red = scaleRed;
        this.level.color.green = scaleGreen;
        this.level.color.blue = scaleBlue;
        this.ball.x = scaleBallX;
        this.ball.y = scaleBallY;
        this.field.points = newFieldPoints;
        this.field.rects = this.field.createRects(newFieldPoints);
        this.scaleCount = this.scaleCount + 4;
    }
};

