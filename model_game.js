'use strict';

class Game {
    
    constructor(data) {
        this.canvasSize = null;
        this.borderSize = null;
        this.slitWidth = null;
        this.fieldSize = null;
        this.myView = null;
        this.speed = null;
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
        this.fps = data.fps;
        this.pointsStart = [];
        this.inProgress = false;
        this.isScaling = false;
        this.isCutting = false;
        this.isResizing = false;
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
        this.ballCoords = [];
    };

    setSizes = function(canvasSize) {
        /*console.log("PREVIOUS----------------------");
        console.log("canvas " + this.canvasSize + " field " + this.fieldSize);
        console.log(this.field);
        console.log(this.level);
        //debugger*/
        var fieldSizePrev = this.fieldSize;
        this.canvasSize = canvasSize;
        this.borderSize = canvasSize*0.008;
        this.slitWidth = canvasSize*0.006;
        this.fieldSize = canvasSize - this.borderSize*2;
        this.speed = Number(60*this.fieldSize*0.03/6/this.fps).toFixed(2);
        if (this.inProgress) {
            this.inProgress = false;
            var resizingInfo = resizeField(this.field.pointsBg,this.field.points,this.fieldSize, fieldSizePrev,this.ball);
            this.resizingInfo = {
                pointsNewStart: resizingInfo.pointsStart,
                pointsNew: resizingInfo.points,
                ballPrev: {x:this.ball.x,y:this.ball.y},
                ballNew: resizingInfo.ball,
                ballActualRectIndex: resizingInfo.ball.ballActualRectIndex,
            };
            this.isResizing = true;
            this.scaleCount = 0;
        }

        function resizeField(pointsStart, points, fieldSize, fieldSizePrev, ball) {
            var scale = fieldSize/fieldSizePrev;
            var center = fieldSizePrev/2;
            var centerBallX = (fieldSize/2 + (ball.x - center)*scale).toFixed(2);
            var centerBallY = (fieldSize/2 + (ball.y - center)*scale).toFixed(2);
            pointsStart = pointsStart.map(function(p) {
                let newX = (fieldSize/2 + (p.x-center)*scale).toFixed(2);
                let newY = (fieldSize/2 + (p.y-center)*scale).toFixed(2);
                return {x:newX, y:newY};
            });
            points = points.map(function(p) {
                let newX = (fieldSize/2 + (p.x-center)*scale).toFixed(2);
                let newY = (fieldSize/2 + (p.y-center)*scale).toFixed(2);
                return {x:newX, y:newY};
            });
    
            var ballActualRectIndex = ball.field.rects.indexOf(ball.actualRect);
            return {pointsStart:pointsStart, points:points, ball:{x:centerBallX,y:centerBallY,ballActualRectIndex:ballActualRectIndex}};
        }
    }

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
        this.setSizes(this.canvasSize);
        this.inProgress = true;
        this.recordTableMin = this.recordsTable.reduce(function (p, v) { return ( p > v.score ? v.score : p);},Infinity);
        this.pointsStart = [
            {x:this.borderSize,y:this.borderSize},
            {x:this.borderSize + this.fieldSize,y:this.borderSize},
            {x:this.borderSize + this.fieldSize,y:this.fieldSize + this.borderSize},
            {x:this.borderSize,y: this.borderSize + this.fieldSize}];
        this.field = new Field(this.pointsStart,this.pointsStart);
        this.level = new Level(1,this.field,50,this.levelColors);
        this.ball = new Ball(this.fieldSize,this.field,this.ballImageSrc,this.speed);
        this.startLevel();
        this.tick();
        this.myView.updateSizes();
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
        //console.log(this.isCutting);
        if (this.inProgress) {
            this.moveBall();
        }
        if (this.isCutting) {
            this.cutField();
        }
        if (this.isScaling) {
            this.scaleField();
        }
        if (this.isResizing) {
            this.resizeField();
        }
        if (this.inProgress||this.isScaling||this.isResizing) {
            this.updateView();
            this.RAF.call(window, this.tick.bind(this));
        }
    }

    updateProgress = function() {
        console.log("updateProgress");
        this.level.squareCurr = this.level.calculateSquare(this.field.rects);
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
        if ((this.bestScore < this.recordTableMin)&&this.recordsTable.length>=20) {
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
                var recordsTable = JSON.parse(callresult.result);
                /*var recordsTable = [];
                recordsTable.push({name:"Andik",score:10,color:this.levelColors[9]});
                recordsTable.push({name:"Pasya",score:9,color:this.levelColors[8]});
                recordsTable.push({name:"Patrik",score:8,color:this.levelColors[7]});
                recordsTable.push({name:"Stasik",score:7,color:this.levelColors[6]});
                recordsTable.push({name:"Porsh",score:6,color:this.levelColors[5]});
                recordsTable.push({name:"Tayo",score:5,color:this.levelColors[4]});
                recordsTable.push({name:"Peter",score:4,color:this.levelColors[3]});
                recordsTable.push({name:"Kate",score:3,color:this.levelColors[2]});
                recordsTable.push({name:"Tosha",score:2,color:this.levelColors[1]});
                recordsTable.push({name:"Suslik",score:1,color:this.levelColors[0]});*/
                recordsTable.push({name:this.name,score:this.bestScore,color:"rgb(" + color.red + "," + color.green + "," + color.blue + ")"});
                this.recordsTable = recordsTable.sort((a,b) => b.score-a.score).slice(0,20);
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
        console.log("startLevel");
        this.isScaling = false;
        this.inProgress = true;
        this.level.progress = 0;
        this.field.pointsBg = this.field.points;
        this.field.rectsBg = this.field.createRects(this.field.pointsBg);
        this.level.squareStart = this.level.calculateSquare(this.field.rectsBg);
        this.blade = new Blade();
        this.updateBlade();
        setTimeout(this.myView.updateBlade.bind(this.myView),0);
        this.myView.updateLevel();
    }

    finishLevel = function() {
        console.log("finishLevel");
        this.inProgress = false;
        this.isCutting = false;
        var levelColorPrev = this.level.color;
        var scalingInfo = scaleField(this.field.points,this.fieldSize, this.borderSize,this.ball);
        this.level = new Level(this.level.count + 1, this.field, 50, this.levelColors);
        this.field.rectsBg = [];
        this.scalingInfo = {
            colorPrev: levelColorPrev,
            colorNew: {red:this.level.color.red,green:this.level.color.green,blue:this.level.color.blue},
            pointsPrev: this.field.points,
            pointsNew: scalingInfo.points,
            ballPrev: {x:this.ball.x,y:this.ball.y},
            ballNew: scalingInfo.ball,
            ballActualRectIndex: scalingInfo.ball.ballActualRectIndex,
         };
        this.isScaling = true;
        this.scaleCount = 0;
        this.myView.sound("soundScale");

        function scaleField(points, fieldSize, borderSize, ball) {
            var sortY = Array.from(new Set(points.map(p => p.y).sort((a,b) => {return a-b})));
            var sortX = Array.from(new Set(points.map(p => p.x).sort((a,b) => {return a-b})));
            var maxX = sortX[sortX.length-1];
            var minX = sortX[0];
            var maxY = sortY[sortY.length-1];
            var minY = sortY[0];
            var width = maxX - minX;
            var height = maxY - minY;
            var centerX = sortX[0] + (width/2);
            var centerY = sortY[0] + (height/2);
            var centerBallX = ball.x;
            var centerBallY = ball.y;
            //центрируем по ширине
            if ((width+height)!==fieldSize*2) {
                var deltaX = Math.round(fieldSize/2 + borderSize - centerX);
                var deltaY = Math.round(fieldSize/2 + borderSize- centerY);
                points = points.map(p => { return {x:p.x + deltaX, y: p.y + deltaY} });
                centerX += deltaX;
                centerY += deltaY;
                centerBallX += deltaX;
                centerBallY += deltaY;
                maxX += deltaX;
                minX += deltaX;
                maxY += deltaY;
                minY += deltaY;
            }
            //растягиваем
            var scale = Math.min(fieldSize/width, fieldSize/height);
            if (scale>1) {
                points = points.map(function(p) {
                    let newX = Math.round(centerX + (p.x-centerX)*scale);
                    let newY = Math.round(centerY + (p.y-centerY)*scale);
                    return {x:newX, y:newY};
                });
            }
            var ballActualRectIndex = ball.field.rects.indexOf(ball.actualRect);
            return {points:points, ball:{x:centerBallX,y:centerBallY,ballActualRectIndex:ballActualRectIndex}};
        }
    }    

    //********************************************************BLADE
    dropBlade = function(pointX, pointY) {
        //проверим попали ли мы в игровое поле
        var actualRect = this.findActualRect(this.field.rects,pointX,pointY,0);
        if (!actualRect) {
            this.blade.isTurn = true;
            this.myView.updateBlade();
            this.isCutting = false;
        } else {
            this.blade.isActive = false;
            this.blade.isTurn = false;
            this.myView.updateBlade();
            this.cutInfo = takeCutInfo(this.field.points,this.blade.type,pointX,pointY);
            this.slit1 = new Slit(pointX,pointY,this.cutInfo.pointsNew[0].x,this.cutInfo.pointsNew[0].y,this.speed*4,this.slitWidth);
            this.slit2 = new Slit(pointX,pointY,this.cutInfo.pointsNew[1].x,this.cutInfo.pointsNew[1].y,this.speed*4,this.slitWidth);
            this.isCutting = true;
        }

        function takeCutInfo(pointsArr,type,x,y) {
            var arrNew = [];
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
                    var horizontal = findHorizontal(pointsArrNew,pointsArrNew2);
                    var vertical = findVertical(pointsArrNew,pointsArrNew2);
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
                    var horizontal = findHorizontal(pointsArrNew,pointsArrNew2);
                    var vertical = findVertical(pointsArrNew,pointsArrNew2);
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
                    var horizontal = findHorizontal(pointsArrNew,pointsArrNew2);
                    var vertical = findVertical(pointsArrNew,pointsArrNew2);
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
                    var horizontal = findHorizontal(pointsArrNew,pointsArrNew2);
                    var vertical = findVertical(pointsArrNew,pointsArrNew2);
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
                    var horizontal = findHorizontal(pointsArrNew,pointsArrNew2);
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
                    var vertical = findVertical(pointsArrNew,pointsArrNew2);
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
        }

        function findVertical(arr1,arr2) {
            return arr1.filter(function (a1) {
                return (arr2.filter(a2 => {return a2.y===a1.y}).length);
            }).map(p => p.y).sort((a,b) => {return a-b});
        };
    
        function findHorizontal(arr1,arr2) {
            return arr1.filter(function (a1) {
                return (arr2.filter(a2 => {return a2.x===a1.x}).length);
            }).map(p => p.x).sort((a,b) => {return a-b});
        };
    }

    updateBlade() {
        console.log("updateBlade");
        this.blade.isActive = true;
        this.blade.isTurn = false;
        this.blade.update();
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
            nextRect = this.findActualRect(this.ball.field.rects,this.ball.x,this.ball.y+this.ball.radius,this.ball.radius);
            if (!nextRect) {
                //var nextX = this.ball.x + this.ball.speedX;
                //var nextY = this.ball.y - this.ball.speedY;
                //var next2Rect = this.findActualRect(this.ball.field.rects,nextX,nextY+this.ball.radius,this.ball.radius);
                //if (!next2Rect) {
                    //debugger
                    //this.ball.speedX =- this.ball.speedX;
                //}
                this.ball.speedY =- this.ball.speedY;
                this.ball.y = this.ball.actualRect.bottom - this.ball.radius;
            } else {
                this.ball.actualRect = (this.ball.y > this.ball.actualRect.bottom)?nextRect:this.ball.actualRect;
            }
        } else if (((this.ball.y - this.ball.radius) < this.ball.actualRect.top)&&this.ball.speedY<0) { //top
            nextRect = this.findActualRect(this.ball.field.rects,this.ball.x,this.ball.y-this.ball.radius,this.ball.radius);
            if (!nextRect) {
                //var nextX = this.ball.x + this.ball.speedX;
                //var nextY = this.ball.y - this.ball.speedY;
                //var next2Rect = this.findActualRect(this.ball.field.rects,nextX,nextY+this.ball.radius,this.ball.radius);
                //if (!next2Rect) {
                    //debugger
                //    this.ball.speedX =- this.ball.speedX;
                //}
                this.ball.speedY =- this.ball.speedY;
                this.ball.y = this.ball.actualRect.top + this.ball.radius;
            } else {
                this.ball.actualRect = (this.ball.y < this.ball.actualRect.top)?nextRect:this.ball.actualRect;
            }
        }
        // проверка коллизии с линиями blade
        if (this.isCutting) {
            var hit = hitSlit(this.ball,this.slit1)||hitSlit(this.ball,this.slit2);
            if (hit) {
                this.finishGame();
                return;
            }
        }
        this.ballCoords.push({x:this.ball.x,y:this.ball.y});
        if (this.ballCoords.length>20) {
            this.ballCoords.shift();
        }

        function hitSlit(elem,slit) {
            var r1x = elem.x - elem.radius;
            var r1y = elem.y - elem.radius;
            var r1w = elem.radius*2;
            var r1h = elem.radius*2;
    
            if (slit.startX === slit.finishX) { // vertical
                var r2w = slit.width;
                var r2h = Math.abs(slit.startY - slit.currY);
                var r2x = slit.startX - slit.width/2;
                var r2y = Math.min(slit.startY,slit.currY);
            }
            if (slit.startY === slit.finishY) { // horizontal
                var r2w = Math.abs(slit.startX - slit.currX);
                var r2h = slit.width;
                var r2x = Math.min(slit.startX,slit.currX)
                var r2y = slit.startY - slit.width/2;;
            }
            if (r1x + r1w >= r2x &&    
                r1x <= r2x + r2w &&    
                r1y + r1h >= r2y &&    
                r1y <= r2y + r2h) {    
                return true;
            }
            return false;
        }
    }

    updateBallRect = function() {
        this.ball.actualRect = this.findActualRect(this.field.rects,this.ball.x,this.ball.y,this.ball.radius);
    }

    //********************************************************FIELD
    cutField = function() {
        console.log("cutField");
        var slitInMove1 = this.slit1.move();
        var slitInMove2 = this.slit2.move();
        this.isCutting = slitInMove1||slitInMove2;
        if (!this.isCutting) {
            this.slit1 = null;
            this.slit2 = null;
            var isBall;
            var arr;
            var rects;
            var ballX = this.ball.x;
            var ballY = this.ball.y;
            for (var i = 0; i< this.cutInfo.arrNew.length; i++) {
                arr = this.cutInfo.arrNew[i].concat(this.cutInfo.pointsNew);
                rects = this.field.createRects(arr);
                isBall = this.findActualRect(rects,ballX,ballY,this.ball.radius);
                if (isBall) {
                    this.field.points = arr;
                    this.field.rects = this.field.createRects(this.field.points);
                    this.updateBallRect();
                    this.updateProgress();
                    return;
                } //else {
                    //debugger;
                //}
                console.log(rects);
                console.log(arr);
                console.log(ballX);
                console.log(ballY);
            }
            if (!isBall) {
                console.log("ball is NOT find!!!");
                console.log(this.cutInfo.arrNew);
                console.log(this.ballCoords);
                //alert("!!!")
                debugger
            }
        }
    }

    scaleField = function() {
        console.log("scaleField");
        if (this.scaleCount > 100) {
            this.ball.x -= this.ball.speedX;
            this.ball.y -= this.ball.speedY;
            this.ball.actualRect = this.field.rects[this.scalingInfo.ballActualRectIndex];
            //var actualRectTest = this.findActualRect(this.field.rects,this.ball.x,this.ball.y,this.ball.radius);
            /*if (actualRectTest===undefined) {
                debugger
            }*/
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

    resizeField = function() {
        if (this.scaleCount > 100) {
            this.level.squareStart = this.level.calculateSquare(this.field.rectsBg);
            this.level.squareCurr = this.level.calculateSquare(this.field.rects);
            this.ball.actualRect = this.field.rects[this.resizingInfo.ballActualRectIndex];
            this.ball.updateSizes(this.fieldSize,this.speed);
            this.isResizing = false;
            this.inProgress = true;
            return;
        }
        var newFieldPoints = [];
        var newFieldPointsStart = [];
        
        var pointsPrevStart = this.field.pointsBg;
        var pointsNewStart = this.resizingInfo.pointsNewStart;

        var pointsPrev = this.field.points;
        var pointsNew = this.resizingInfo.pointsNew;

        var ballPrev = this.resizingInfo.ballPrev;
        var ballNew = this.resizingInfo.ballNew;

        var scaleBallX = Math.round(ballPrev.x + (ballNew.x - ballPrev.x)/100*this.scaleCount);
        var scaleBallY = Math.round(ballPrev.y + (ballNew.y - ballPrev.y)/100*this.scaleCount);
        for (var i = 0; i < pointsPrevStart.length; i++) {
            var scaleX = Math.round(pointsPrevStart[i].x + (pointsNewStart[i].x - pointsPrevStart[i].x)/100*this.scaleCount);
            var scaleY = Math.round(pointsPrevStart[i].y + (pointsNewStart[i].y - pointsPrevStart[i].y)/100*this.scaleCount);
            newFieldPointsStart.push({x:scaleX, y:scaleY});
        };
        for (var i = 0; i < pointsPrev.length; i++) {
            var scaleX = Math.round(pointsPrev[i].x + (pointsNew[i].x - pointsPrev[i].x)/100*this.scaleCount);
            var scaleY = Math.round(pointsPrev[i].y + (pointsNew[i].y - pointsPrev[i].y)/100*this.scaleCount);
            newFieldPoints.push({x:scaleX, y:scaleY});
        };
        this.ball.x = scaleBallX;
        this.ball.y = scaleBallY;

        this.field.pointsBg = newFieldPointsStart;
        this.field.points = newFieldPoints;
        this.field.rectsBg = this.field.createRects(newFieldPointsStart);
        this.field.rects = this.field.createRects(newFieldPoints);

        this.scaleCount = this.scaleCount + 10;
    }

    //utils
    findActualRect = function(rects,posX,posY,radius) {
        /*var rectsSuitableWidth = rects.filter(r => {return(r.left<=posX-radius&&r.right>=posX+radius)});
        var rectsSuitableHeight = rectsSuitableWidth.filter(r => {return(r.top<=posY&&r.bottom>=posY)});
        if (rectsSuitableHeight.length===0) {
            if (rectsSuitableHeight[0].bottom-rectsSuitableHeight[0].top<radius) {
                debugger;
            }
            //console.log("suitable for width " + rectsSuitableWidth.length);
            //console.log("suitable for height " + rectsSuitableHeight.length);
            //debugger    
        }
        return rectsSuitableHeight[0];*/

        /*var nextRect = rects.filter(r => {return (r.top<=posY&&r.bottom>=posY&&r.left<=posX-radius&&r.right>=posX+radius)})[0];
        //если узкий, проверим дальнейшие
        if (radius!==0&&nextRect) {
            if (nextRect.bottom-nextRect.top<radius) {
                var nextX = this.ball.x + this.ball.speedX;
                var nextY = this.ball.y + this.ball.speedY;
                var nextRect2 = rects.filter(r => {return (r.top<=nextY&&r.bottom>=nextY&&r.left<=nextX-radius&&r.right>=nextX+radius)})[0];
                if (!nextRect2) {
                    debugger
                }
            }
        }
        return nextRect;*/
        return rects.filter(r => {return (r.top<=posY&&r.bottom>=posY&&r.left<=posX-radius&&r.right>=posX+radius)})[0];
    };
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
    constructor(count,field,percent,colors) {
        this.count = count;
        this.percent = percent;
        this.colors = colors;
        this.progress;
        this.color = this.convertColorHEXtoRGB(this.colors[((count%this.colors.length===0)?this.colors.length:count%this.colors.length)-1]);
        this.squareStart = this.calculateSquare(field.rectsBg);
        this.squareCurr;
    }

    convertColorHEXtoRGB = function(color) {
        var rgbColor = {};
        if(color.substring(0,1) == '#') {
            color = color.substring(1);
        }
        rgbColor.red = parseInt(color.substring(0,2),16);
        rgbColor.green = parseInt(color.substring(2,4),16);
        rgbColor.blue = parseInt(color.substring(4),16);
        return rgbColor;
    };

    calculateSquare = function(rects) {
        var square = rects.reduce(function(s,r,i,a) { return s + r.square;}, 0);
        return square;
    };
}

class Ball {

    constructor(fieldSize,field,imageSrc,speed) {
        this.field = field;
        this.radius = fieldSize*0.03;
        this.speedX = this.randomSign()*speed;
        this.speedY = this.randomSign()*speed;
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

    randomSign = function() {
        return Math.sign(0.5-Math.random());
    }

    updateSizes = function(fieldSize,speed) {
        this.radius = fieldSize*0.03;
        this.speedX = this.randomSign()*speed;
        this.speedY = this.randomSign()*speed;
    }
}

class Blade {

    constructor() {
        this.bladeTypes = ["top-right","top-left","bottom-right","bottom-left","left-right","top-bottom"];
        this.isTurn;
        this.isActive;
        this.type = null;
    }

    update = function() {
        this.type = this.bladeTypes[this.randomDiap(0,this.bladeTypes.length-1)];
    }

    randomDiap = function(n,m) {
        return Math.floor(Math.random()*(m-n+1))+n;
    }
}