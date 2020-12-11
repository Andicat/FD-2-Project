'use strict';

class Game {
    
    constructor(canvasSize) {
        this.borderSize = canvasSize*0.01;
        this.fieldSize = canvasSize - this.borderSize*2;
        this.myView = null;
        this.field = null;
        this.ball = null;
        this.blade = null;
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
        this.level = new Level(1,this.pointsStart,this.field,50);
        this.ball = new Ball(this.fieldSize,this.field);
        this.blade = new Blade(this.fieldSize);
        this.updateBlade();
        this.tick();
    }

    tick = function() {
        if (this.InProgress) {
            this.ball.move();
        }
        if (this.isCutting) {
            this.cut();
        }
        /*if (window.game.scaleField) {
            window.game.scale();
        }*/
        if (this.InProgress) {
            this.updateView();
            requestAnimationFrame(this.tick.bind(this));
        }
    }

    dropBlade = function(pointX, pointY) {
        //проверим попали ли мы в игровое поле
        var actualRect = window.utils.findActualRect(this.field.rects,pointX,pointY,0);
        if (!actualRect) {
            this.myView.updateBlade();
            //this.goToStart();
            //this.elem.style.transitionProperty = "top, left";
            //this.elem.style.transitionDuration = "1s";
        } else {
            this.myView.activateBlade();
            this.cutInfo = this.takeCutInfo(this.blade.type,pointX,pointY);
            this.slit1 = new Slit(pointX,pointY,this.cutInfo.pointsNew[0].x,this.cutInfo.pointsNew[0].y,this.speed);
            this.slit2 = new Slit(pointX,pointY,this.cutInfo.pointsNew[1].x,this.cutInfo.pointsNew[1].y,this.speed);
            this.isCutting = true;
        }
    }

    takeCutInfo = function(type,x,y) {
        var arrNew = [];
        var pointsArr = this.field.points;
        var pointsArrNew = [];
        var pointsArrNew2 = [];
        var pointsNew = [];
        var pointNew1 = {};
        var pointNew2 = {};
        switch(type) {
            case "top-right":
                pointsArr.forEach(function(point) {
                    if (!(point.x>=x && point.y<=y)) {
                        pointsArrNew.push(point);
                    } else {
                        pointsArrNew2.push(point);
                    }
                });
                var horizontal = window.utils.findHorizontal(pointsArrNew,pointsArrNew2);
                var vertical = window.utils.findVertical(pointsArrNew,pointsArrNew2);
                pointNew1.x = horizontal[0];
                pointNew1.y = y;
                pointNew2.x = x;
                pointNew2.y = vertical[0];
                pointsNew.push(pointNew1);
                pointsNew.push(pointNew2);
                pointsNew.push({x:x,y:y});
                break;
            case "top-left":
                pointsArr.forEach(function(point) {
                    if (!(point.x<=x&&point.y<=y)) {
                        pointsArrNew.push(point);
                    } else {
                        pointsArrNew2.push(point);
                    }
                });
                var horizontal = window.utils.findHorizontal(pointsArrNew,pointsArrNew2);
                var vertical = window.utils.findVertical(pointsArrNew,pointsArrNew2);
                pointNew1.x = horizontal[0];
                pointNew1.y = y;
                pointNew2.x = x;
                pointNew2.y = vertical[0];
                pointsNew.push(pointNew1);
                pointsNew.push(pointNew2);
                pointsNew.push({x:x,y:y});
                break;
            case "bottom-right":
                pointsArr.forEach(function(point) {
                    if (!(point.x>=x&&point.y>=y)) {
                        pointsArrNew.push(point);
                    } else {
                        pointsArrNew2.push(point);
                    }
                });
                var horizontal = window.utils.findHorizontal(pointsArrNew,pointsArrNew2);
                var vertical = window.utils.findVertical(pointsArrNew,pointsArrNew2);
                pointNew1.x = horizontal[0];
                pointNew1.y = y;
                pointNew2.x = x;
                pointNew2.y = vertical[0];
                pointsNew.push(pointNew1);
                pointsNew.push(pointNew2);
                pointsNew.push({x:x,y:y});
                break;
            case "bottom-left":
                pointsArr.forEach(function(point) {
                    if (!(point.x<=x&&point.y>=y)) {
                        pointsArrNew.push(point);
                    } else {
                        pointsArrNew2.push(point);
                    }
                });
                var horizontal = window.utils.findHorizontal(pointsArrNew,pointsArrNew2);
                var vertical = window.utils.findVertical(pointsArrNew,pointsArrNew2);
                pointNew1.x = horizontal[0];
                pointNew1.y = y;
                pointNew2.x = x;
                pointNew2.y = vertical[0];
                pointsNew.push(pointNew1);
                pointsNew.push(pointNew2);
                pointsNew.push({x:x,y:y});
                break;
            case "left-right":
                pointsArr.forEach(function(point) {
                    if (point.y<y) {
                        pointsArrNew.push(point);
                    } else {
                        pointsArrNew2.push(point);
                    }
                });
                var horizontal = window.utils.findHorizontal(pointsArrNew,pointsArrNew2);
                pointNew1.x = horizontal[0];
                pointNew1.y = y;
                pointNew2.x = horizontal[horizontal.length-1];
                pointNew2.y = y;
                pointsNew.push(pointNew1);
                pointsNew.push(pointNew2);
                break;
            case "top-bottom":
                pointsArr.forEach(function(point) {
                    if (point.x<x) {
                        pointsArrNew.push(point);
                    } else {
                        pointsArrNew2.push(point);
                    }
                });
                var vertical = window.utils.findVertical(pointsArrNew,pointsArrNew2);
                pointNew1.x = x;
                pointNew1.y = vertical[0];
                pointNew2.x = x;
                pointNew2.y = vertical[vertical.length-1];
                pointsNew.push(pointNew1);
                pointsNew.push(pointNew2);
                break;
            default:
                break;
        }
        arrNew = [pointsArrNew,pointsArrNew2];
        return {arrNew:arrNew, pointsNew:pointsNew};
    };

    cut = function() {
        var slitInMove1 = this.slit1.move();
        var slitInMove2 = this.slit2.move();
        this.isCutting = slitInMove1||slitInMove2;
        if (this.isCutting) {
            //this.elem.style.transform = "scale(0)";
            //this.slit1.draw();
            //this.slit2.draw();
        } else {
            this.slit1 = null;
            this.slit2 = null;
            //window.field.cut(this.cutInfo);
            for (var i = 0; i< this.cutInfo.arrNew.length; i++) {
                var arr = this.cutInfo.arrNew[i].concat(this.cutInfo.pointsNew);
                var rects = this.field.createRects(arr);
                var isBall = window.utils.findActualRect(rects,this.ball.x,this.ball.y,this.ball.radius);
                if (isBall) {
                    this.field.points = arr;
                    this.field.rects = this.field.createRects(this.field.points);
                    this.ball.updateActualRect();
                    this.updateBlade();
                    this.updateProgress();
                    //window.level.updateProgress(this);
                    //window.utils.getMaxCoords(this.points);
                    return;
                }
            }
            
        }
    }

    updateProgress = function() {
        this.level.pointsCurr = this.field.points;
        this.level.squareCurr = window.utils.calculateSquare(this.field.rects);
        this.level.progress = Math.round((this.level.squareStart - this.level.squareCurr)/(this.level.squareStart/100*(100-this.level.percent))*100);
        //console.log(this.level.progress);
        this.myView.updateLevel();
        if (this.level.progress>=100) {
            this.finishLevel();
        } else {
            ///window.blade.update();
        }
    }

    updateView = function() {
        if (this.myView) {
            this.myView.update();
        }
    }

    updateBlade = function() {
        this.blade.update();
        if (this.myView) {
            this.myView.updateBlade();
        }
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
};

class Level {
    constructor(count,pointsStart,field,percent,color) {
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

    
};

class Ball {

    constructor(fieldSize,field) {
        this.field = field;
        this.radius = fieldSize*0.03;
        var speed = 3;
        this.speedX = window.utils.randomSign()*speed;
        this.speedY = window.utils.randomSign()*speed;
        this.x;
        this.y;
        this.actualRect;
        this.image = new Image();
        this.image.src = "img/ball-7.svg";
        this.rotation = 0;
        this.actualRect = field.rects[0];
        this.x = this.actualRect.left + (this.actualRect.right-this.actualRect.left)/2 - this.radius;
        this.y = this.actualRect.top + (this.actualRect.bottom-this.actualRect.top)/2 - this.radius;
    };

    move = function() {
        this.x += this.speedX;
        this.y += this.speedY;   
        this.rotation += 5;      
        var nextRect;
        
        //проверка области
        if ((this.x + this.radius) > this.actualRect.right) { //right
            this.speedX =- this.speedX;
            this.x = this.actualRect.right - this.radius;
        } else if ((this.x - this.radius) < this.actualRect.left) { //left
            this.speedX =- this.speedX;
            this.x = this.actualRect.left + this.radius;
        } else if (((this.y + this.radius) > this.actualRect.bottom)&&this.speedY>0) { //bottom
            nextRect = window.utils.findActualRect(this.field.rects,this.x,this.y+this.radius,this.radius);
            if (!nextRect) {
                this.speedY =- this.speedY;
                this.y = this.actualRect.bottom - this.radius;
            } else {
                this.actualRect = nextRect;
            }
        } else if (((this.y - this.radius) < this.actualRect.top)&&this.speedY<0) { //top
            nextRect = window.utils.findActualRect(this.field.rects,this.x,this.y-this.radius,this.radius);
            if (!nextRect) {
                this.speedY =- this.speedY;
                this.y = this.actualRect.top + this.radius;
            } else {
                this.actualRect = nextRect;
            }
        }
        // проверка коллизии с линиями blade
        /*if (window.blade.isCutting) {
            var hit = window.utils.hitSlit(this,window.blade.slit1)||window.utils.hitSlit(this,window.blade.slit2);
            if (hit) {
                window.game.finish();
                return;
            }
        }*/
    };

    updateActualRect = function() {
        this.actualRect = window.utils.findActualRect(this.field.rects,this.x,this.y,this.radius);
    }
}



class Blade {

    constructor(fieldSize) {
        this.bladeTypes = ["top-right","top-left","bottom-right","bottom-left","left-right","top-bottom"];
        this.isCutting = false;
        this.cutInfo;
        this.type = null;
        this.speed = 3;
        this.update();
        //this.activate();
    };

    disactivate = function() {
        this.elem.classList.remove("blade--" + this.type);
        this.elem.classList.add("blade--hidden");
        window.removeEventListener("mousedown", startMoveBlade);
        window.removeEventListener('touchstart', startMoveBlade,{passive: false});
        this.goToStart();
    }

    goToStart = function() {
        this.elem.classList.remove("blade--active");
        this.elem.style.transform = "";
        this.slit1 = null;
        this.slit2 = null;
        this.elem.style.top = this.startTop + "px";
        this.elem.style.left = this.startLeft + "px";
    }

    

    update() {
        //this.elem.classList.remove("blade--" + this.type);
        this.type = this.bladeTypes[window.utils.randomDiap(0,this.bladeTypes.length-1)];
        //this.elem.setAttribute("data-type", type);
        //this.elem.classList.add("blade--" + type);
        //this.goToStart();
    }
}

