'use strict';

class Game {
    
    constructor(canvasSize, data) {
        this.canvasSize = canvasSize;
        this.borderSize = canvasSize*0.008;
        this.slitWidth = canvasSize*0.006;
        this.fieldSize = canvasSize - this.borderSize*2;
        this.myView = null;
        this.speed = Number(60*this.fieldSize*0.03/6/data.fps).toFixed(2);
        this.field = null;
        this.ball = null;
        this.blade = null;
        this.level = null;
        this.ballsImage = data.balls;
        this.ballImageSrc = data.ballImageSrc?data.ballImageSrc:data.balls[0];
        this.bestScore = data.bestScore?data.bestScore:0;
        this.levelColors = data.colors;
        this.name = data.name;
        this.recordsTable = data.recordsTable;
        this.recordTableMin;
        this.levels = [];
        this.pointsStart = [
            {x:this.borderSize,y:this.borderSize},
            {x:this.borderSize + this.fieldSize,y:this.borderSize},
            {x:this.borderSize + this.fieldSize,y:this.fieldSize + this.borderSize},
            {x:this.borderSize,y: this.borderSize + this.fieldSize},
        ],
        this.inProgress = false;
        this.isScaling = false;
        this.isCutting = false;
        this.soundOff = data.soundOff?true:false;
        this.lsName = data.lsName;
        this.RAF =
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

    start = function(view) {
        this.myView = view;
    }

    setSound = function(value) {
        this.soundOff = value;
        this.myView.updateSound();
        this.saveLocalStorageData();
    }

    setBall = function(value) {
        this.ballImageSrc = value;
        this.myView.updateBallImage();
        this.saveLocalStorageData();
    }

    setName = function(value) {
        this.name = value;
        this.saveLocalStorageData();
        this.myView.updateStartScore();
    }

    startGame = function() {
        this.inProgress = true;
        this.recordTableMin = this.recordsTable.reduce(function (p, v) { return ( p > v.score ? v.score : p);},Infinity);
        this.field = new Field(this.pointsStart,this.pointsStart);
        this.level = new Level(1,this.pointsStart,this.field,50,this.levelColors);
        this.ball = new Ball(this.fieldSize,this.field,this.ballImageSrc,this.speed);
        this.startLevel();
        this.tick();
        this.myView.initSound();
    }

    clearGame = function() {
        this.inProgress = false;
        this.isCutting = false;
        this.level = null;
        this.field = null;
        this.ball = null;
        this.slit1 = null;
        this.slit2 = null;
        if (this.blade) {
            this.blade.isActive = false;
            this.myView.updateBlade();
        }
    }

    finishGame = function() {
        if (this.bestScore < this.level.count-1) {
            this.bestScore = this.level.count-1;
            this.saveRecord(this.level.color);
        }
        this.inProgress = false;
        this.isCutting = false;
        for (var i = 0; i < this.levels.length; i++) {
            this.levels[i].rects = this.field.createRects(this.levels[i].pointsCurr);
        }
        this.level = null;
        this.field = null;
        this.blade.isActive = false;
        this.ball = null;
        this.slit1 = null;
        this.slit2 = null;
        this.saveLocalStorageData()
        this.updateView();
    }


    tick = function() {
        if (this.inProgress) {
            this.moveBall();
        }
        if (this.isCutting) {
            this.cutField();
        }
        if (this.isScaling) {
            this.scaleField();
        }
        if (this.inProgress||this.isScaling) {
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
        gameData.name = this.name;
        gameData.bestScore = this.bestScore;
        gameData.soundOff = this.soundOff;
        gameData.ballImageSrc = this.ballImageSrc;
        localStorage.setItem(this.lsName,JSON.stringify(gameData));
    }

    saveRecord = function(color) {
        console.log("actual records");
        console.log(this.recordsTable);
        if ((this.bestScore < this.recordTableMin)&&this.recordsTable.length>=10) {
            console.log("your record less then recordsMin");
            return
        }
        var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
        var updatePassword;
        var stringName = 'Andreeva_ScaleRecords';
        updatePassword = Math.random();
        $.ajax( {
                url: ajaxHandlerScript, type: 'POST', cache: false, dataType:'json',
                data: { f: 'LOCKGET', n: stringName, p: updatePassword },
                success: lockGetReady.bind(this), error: errorHandler
            }
        );     

        function lockGetReady(callresult) {
            if ( callresult.error!=undefined ) {
                alert(callresult.error);
            }
            else {
                //var recordsTable = JSON.parse(callresult.result);
                var recordsTable = [];
                recordsTable.push({name:"Andik",score:10,color:this.levelColors[1]});
                recordsTable.push({name:"Pasya",score:9,color:this.levelColors[0]});
                recordsTable.push({name:"Patrik",score:8,color:this.levelColors[7]});
                recordsTable.push({name:"Stasik",score:7,color:this.levelColors[6]});
                recordsTable.push({name:"Porsh",score:6,color:this.levelColors[5]});
                recordsTable.push({name:"Tayo",score:5,color:this.levelColors[4]});
                recordsTable.push({name:"Peter",score:4,color:this.levelColors[3]});
                recordsTable.push({name:"Kate",score:3,color:this.levelColors[2]});
                recordsTable.push({name:"Tosha",score:2,color:this.levelColors[1]});
                recordsTable.push({name:"Suslik",score:1,color:this.levelColors[0]});
                //recordsTable.push({name:this.name,score:this.bestScore,color:"rgb(" + color.red + "," + color.green + "," + color.blue + ")"});
                this.recordsTable = recordsTable.sort((a,b) => b.score-a.score).slice(0,10);
                $.ajax({
                    url : ajaxHandlerScript, type: 'POST', cache: false, dataType:'json',
                    data : { f: 'UPDATE', n: stringName, v: JSON.stringify(this.recordsTable), p: updatePassword },
                    success : updateReady, error : errorHandler
                });
            }
        }

        function updateReady(callresult) {
            if ( callresult.error!=undefined ) {
                alert(callresult.error);
            }
        }
      
        function errorHandler(jqXHR,statusStr,errorStr) {
            alert(statusStr + ' ' + errorStr);
        }
    }

    //********************************************************LEVEL
    startLevel = function() {
        this.isScaling = false;
        this.inProgress = true;
        this.level.progress = 0;
        this.field.pointsBg = this.field.points;
        this.field.rectsBg = this.field.createRects(this.field.pointsBg);
        this.level.squareStart = window.utils.calculateSquare(this.field.rectsBg);
        this.blade = new Blade();
        this.updateBlade();
//        this.updateBallRect();
        setTimeout(this.myView.updateBlade.bind(this.myView),0);
        this.myView.updateLevel();
    }

    finishLevel = function() {
        this.inProgress = false;
        this.isCutting = false;
        this.levels.push(this.level);
        var scalingInfo = window.utils.scaleField(this.level.pointsCurr,this.fieldSize, this.borderSize,this.ball);
        this.level = new Level(this.level.count + 1, scalingInfo.points, this.field, 50, this.levelColors);
        this.field.rectsBg = [];
        this.scalingInfo = {
            colorPrev: this.levels[this.levels.length-1].color,
            colorNew: {red:this.level.color.red,green:this.level.color.green,blue:this.level.color.blue},
            pointsPrev: this.levels[this.levels.length-1].pointsCurr,
            pointsNew: this.level.pointsStart,
            ballPrev: {x:this.ball.x,y:this.ball.y},
            ballNew: scalingInfo.ball,
            ballActualRectIndex: scalingInfo.ball.ballActualRectIndex,
         };
        this.isScaling = true;
        this.scaleCount = 0;
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
            this.slit1 = new Slit(pointX,pointY,this.cutInfo.pointsNew[0].x,this.cutInfo.pointsNew[0].y,this.speed*4,this.slitWidth);
            this.slit2 = new Slit(pointX,pointY,this.cutInfo.pointsNew[1].x,this.cutInfo.pointsNew[1].y,this.speed*4,this.slitWidth);
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
                this.ball.actualRect = (this.ball.y > this.ball.actualRect.bottom)?nextRect:this.ball.actualRect;
            }
        } else if (((this.ball.y - this.ball.radius) < this.ball.actualRect.top)&&this.ball.speedY<0) { //top
            nextRect = window.utils.findActualRect(this.ball.field.rects,this.ball.x,this.ball.y-this.ball.radius,this.ball.radius);
            if (!nextRect) {
                this.ball.speedY =- this.ball.speedY;
                this.ball.y = this.ball.actualRect.top + this.ball.radius;
            } else {
                this.ball.actualRect = (this.ball.y < this.ball.actualRect.top)?nextRect:this.ball.actualRect;
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
            console.log("ball actual rect");
            console.log(this.ball.actualRect);
            console.log("index of rects");
            console.log(this.scalingInfo.ballActualRectIndex);
            console.log("ball prev");
            console.log(this.scalingInfo.ballPrev);
            console.log("ball new");
            console.log(this.scalingInfo.ballNew);
            //console.log("rects prev");
            //console.log(this.ball.field.rects);
            console.log("rects new");
            console.log(this.field.rects);
            
            this.ball.x -= this.ball.speedX;
            this.ball.y -= this.ball.speedY;
            this.ball.actualRect = this.field.rects[this.scalingInfo.ballActualRectIndex];
            var actualRectTest = window.utils.findActualRect(this.field.rects,this.ball.x,this.ball.y,this.ball.radius);
            if (actualRectTest===undefined) {
                debugger
            }
            //this.updateBallRect();
            this.startLevel();
            return;
        }
        var newFieldPoints = [];
        var ballActualRectPrev = this.ball.field.rects.indexOf(this.ball.actualRect);
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


class Slit {

    constructor(startX,startY,finishX,finishY,speed,width) {
        this.startX = startX;
        this.startY = startY;
        this.finishX = finishX;
        this.finishY = finishY;
        this.currX = startX;
        this.currY = startY;
        this.direction;
        this.speedX;
        this.speedY;
        this.width = width;
        if (startX!==finishX) {
            this.direction = "X";
            this.speedY = 0;
            this.speedX = Math.sign(finishX - startX)*speed;
        }
        if (startY!==finishY) {
            this.direction = "Y";
            this.speedX = 0;
            this.speedY = Math.sign(finishY - startY)*speed;
        }
    };

    move = function() {
        if (this.direction==="X") {
            var lenghtX = Math.abs(this.startX - this.finishX);
            var currLenghtX = Math.abs(this.startX - this.currX);
            if (currLenghtX<=lenghtX) {
                this.currX += this.speedX;
            } else {
                this.currX = this.finishX;
                this.direction = null;
            }
            return true;
        }
        if (this.direction==="Y") {
            var lenghtY = Math.abs(this.startY - this.finishY);
            var currLenghtY = Math.abs(this.startY - this.currY);
            if (currLenghtY<=lenghtY) {
                this.currY += this.speedY;
            }
            else {
                this.currY = this.finishY;
                this.direction = null;
            }
            return true;
        }
        return false;
    };
}

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
};

class Level {
    constructor(count,pointsStart,field,percent,colors) {
        this.count = count;
        this.pointsStart = pointsStart;
        this.pointsCurr = pointsStart;
        this.percent = percent;
        this.colors = colors;
        this.color = window.utils.convertColorHEXtoRGB(this.colors[((count%this.colors.length===0)?this.colors.length:count%this.colors.length)-1]);
        this.squareStart;
        this.squareCurr;
        this.progress;
        this.squareStart = window.utils.calculateSquare(field.rectsBg);
    }
}

class Ball {

    constructor(fieldSize,field,imageSrc,speed) {
        this.field = field;
        this.radius = fieldSize*0.03;
        this.speedX = window.utils.randomSign()*speed;
        this.speedY = window.utils.randomSign()*speed;
        this.x;
        this.y;
        this.actualRect;
        this.imageSrc = imageSrc;
        this.image = new Image();
        this.image.src = "img/" + this.imageSrc;
        this.rotation = 0;
        this.actualRect = field.rects[0];
        this.x = this.actualRect.left + (this.actualRect.right-this.actualRect.left)/2 - this.radius;
        this.y = this.actualRect.top + (this.actualRect.bottom-this.actualRect.top)/2 - this.radius;
    }
}

class Blade {

    constructor() {
        this.bladeTypes = ["top-right","top-left","bottom-right","bottom-left","left-right","top-bottom"];
        this.isTurn;
        this.isActive;
        this.type = null;
    }  
}