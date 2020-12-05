'use strict';

//======================================FD-2 SCALE-GAME==================================
/*
*/

(function () {

    try {
        var blockGame = document.querySelector('.game');
        var cntPlayground = blockGame.querySelector('.game__playground');
        var cntProgress = blockGame.querySelector('.progress__value');
        var cntField = blockGame.querySelector('.game__field');
        var cntCounter = blockGame.querySelector('.game__level');
        var btnStart = blockGame.querySelector('.game__start');
        var cntBlade = blockGame.querySelector('.blade');
    } catch {
        return;
    }
    
    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;
    const GAME_HEIGHT = clientHeight;
    const GAME_WIDTH = Math.round(Math.min(GAME_HEIGHT/4*3,clientWidth));
    const SIZES = {
        playgroundWidth: GAME_WIDTH,
        playgroundHeight: GAME_HEIGHT,
        ball: GAME_WIDTH*0.03,
    };
    const COLORS = {
        background: "rgba(255, 255, 255, 0.3)",
        slit: "#f0f0f0",
        ball: "#000",
    }
    const TOUCH_SHIFT = 80;
    const bladeTypes = ["top-right","top-left","bottom-right","bottom-left","left-right","top-bottom"];
    const bladeSpeed = 6;
    const ballSpeed = 3;

    const levelColors = ["#FFFF66","#FFCC33","#FF3300","#CCCC00","#FF3333","#FF3366","#993366","#FF66FF","#993399","#6633CC","#9999FF","#3366FF","#00CCCC","#339966","#66FF66","#33CC33","#999999","#CCFF66"];
    
    class Game {
    
        constructor(context,levelInfo,gameSize) {
            this.cnt = context;
            this.levelInfo = levelInfo;
            this.gameSize = gameSize;
            this.InProgress = true;
            this.growField = false;
        };

        initLevel = function() {
            window.level = new Level(cntCounter, this.levelInfo.count, cntProgress, this.levelInfo.pointsStart, this.levelInfo.percentToWin, this.levelInfo.color);
            window.field = new Field(window.context,COLORS.background,window.level.color,window.level.pointsStart,window.level.pointsCurr);
            window.level.init(field);
            window.blade = new Blade(cntBlade,window.utils.getElementCoords(cntField),bladeTypes,bladeSpeed,window.context,COLORS.slit,SIZES.ball/7,TOUCH_SHIFT);
            window.blade.activate();
            window.ball = new Ball(window.context,COLORS.ball,SIZES.ball/2,this.gameSize/2,this.gameSize/2,ballSpeed);
            ball.updateActualRect();
        }

        draw = function() {
            this.cnt.clearRect(0, 0, this.gameSize, this.gameSize);
            window.field.draw();
            if (this.InProgress) {
                window.ball.move();
            }
            if (window.blade && window.blade.isCutting) {
                window.blade.cut();
            }
        }

        start = function() {
            this.InProgress = true;
            this.initLevel();
        }

        finish = function() {
            this.InProgress = false;
            window.level = undefined;
            window.field = undefined;
            window.blade.disactivate();
            window.blade = undefined;
            window.ball = undefined;
        }

        finishLevel = function() {
            this.InProgress = false;
            this.draw();
            window.blade.disactivate();
            this.pointsOld = window.level.pointsCurr;
            this.colorOld = window.utils.convertColorHEXtoRGB(this.levelInfo.color);
            this.levelInfo.count += 1;
            this.levelInfo.pointsStart = window.utils.scaleField(window.level.pointsCurr,this.gameSize);
            this.levelInfo.percentToWin = 50;
            this.levelInfo.color = levelColors[window.utils.randomDiap(0,levelColors.length-1)];
            this.pointsNew = this.levelInfo.pointsStart;
            this.colorNew =  window.utils.convertColorHEXtoRGB(this.levelInfo.color);
            this.growField = true;
            this.growCount = 0;
        }

        grow = function() {
            var newFieldPoints = [];
            /*var growRed = this.colorOld.red;
            var growGreen = this.colorOld.green;
            var growBlue = this.colorOld.blue;
            var growRedNew = this.colorNew.red;
            var growGreenNew = this.colorNew.green;
            var growBlueNew = this.colorNew.blue;*/
            var growRed = Math.round(this.colorOld.red + (this.colorNew.red - this.colorOld.red)/100*this.growCount);
            var growGreen = Math.round(this.colorOld.green + (this.colorNew.green - this.colorOld.green)/100*this.growCount);
            var growBlue = Math.round(this.colorOld.blue + (this.colorNew.blue - this.colorOld.blue)/100*this.growCount);
            /*console.log("red was " + growRed + " will be " + growRedNew);
            console.log("green was " + growGreen + " will be " + growGreenNew);
            console.log("blue was " + growBlue + " will be " + growBlueNew);*/
            for (var i = 0; i < this.pointsOld.length; i++) {
                //console.log("was " + this.pointsOld[i].x + "-" + this.pointsOld[i].y + " will be " + this.pointsNew[i].x + "-" + this.pointsNew[i].y);
                var growX = Math.round(this.pointsOld[i].x + (this.pointsNew[i].x - this.pointsOld[i].x)/100*this.growCount);
                var growY = Math.round(this.pointsOld[i].y + (this.pointsNew[i].y - this.pointsOld[i].y)/100*this.growCount);
                newFieldPoints.push({x:growX, y:growY});
            };
            window.field.color = "rgb(" + growRed + "," + growGreen + "," + growBlue + ")";
            window.field.points = newFieldPoints;
            window.field.rectsBg = [];
            window.field.rects = window.utils.createRects(newFieldPoints);
            this.draw();
            this.growCount = this.growCount + 4;
            if (this.growCount>=100) {
                this.growField = false;
                this.start();
            }
        }
    };

    function renderGameSVG (cnt) {

        cntPlayground.style.height = GAME_HEIGHT + "px";
        cntPlayground.style.width = GAME_WIDTH + "px";
        const CANVAS_SIZE = cntField.offsetWidth;

        var levelInfo = {
            count: 1,
            percentToWin: 50,
            pointsStart: [
                    {x:0,y:0},
                    {x:CANVAS_SIZE,y:0},
                    {x:CANVAS_SIZE,y:CANVAS_SIZE},
                    {x:0,y:CANVAS_SIZE},
                ],
            color: levelColors[window.utils.randomDiap(0,levelColors.length-1)],
        };
        
        //создаем канвас
        var gameCanvas = document.createElement("canvas");
        gameCanvas.setAttribute("width",CANVAS_SIZE);
        gameCanvas.setAttribute("height",CANVAS_SIZE);
        cntField.appendChild(gameCanvas);
        window.context = gameCanvas.getContext("2d");

        btnStart.addEventListener("click", startGame);

        function startGame() {
            btnStart.textContent = "Finish";
            btnStart.removeEventListener("click", startGame);
            btnStart.addEventListener("click", finishGame);
            window.game = new Game(window.context,levelInfo,CANVAS_SIZE);
            window.game.start();
            function tick() {
                if (window.game) {
                    if (window.game.InProgress) {
                        window.game.draw();
                    }
                    if (window.game.growField) {
                        window.game.grow();
                    }
                    requestAnimationFrame(tick);
                }
            }
            tick();
        }

        function finishGame() {
            window.game.finish();
            window.game = undefined;
            context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            btnStart.textContent = "Start";
            btnStart.removeEventListener("click", finishGame);
            btnStart.addEventListener("click", startGame);
        }
    }

    renderGameSVG(cntField);
})();
