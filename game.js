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
        field: "#dbda79",
        rect: " rgb(163, 55, 55)",
        ball: "#000",
    }
    const TOUCH_SHIFT = 80;
    const bladeTypes = ["top-right","top-left","bottom-right","bottom-left","left-right","top-bottom"];
    const bladeSpeed = 3;

    class Game {
        constructor(context,levelInfo,gameSize) {
            this.cnt = context;
            this.levelInfo = levelInfo;
            this.gameSize = gameSize;
            this.InProgress = true;
        };

        initLevel = function() {
            window.level = new Level(cntCounter, this.levelInfo.count, cntProgress, this.levelInfo.pointsStart, this.levelInfo.percentToWin, this.levelInfo.color);
            window.field = new Field(window.context,COLORS.background,window.level.color,window.level.pointsStart,window.level.pointsCurr);
            window.level.init(field);
            window.blade = new Blade(cntBlade,window.utils.getElementCoords(cntField),bladeTypes,bladeSpeed,window.context,COLORS.slit,SIZES.ball/7,TOUCH_SHIFT);
            window.blade.activate();
            window.ball = new Ball(window.context,COLORS.ball,SIZES.ball/2,this.gameSize/2,this.gameSize/2);
            ball.updateActualRect();
        }

        draw = function() {
            window.ball.move();
            this.cnt.clearRect(0, 0, this.gameSize, this.gameSize);
            window.field.draw();
            window.ball.draw();
            if (window.blade.isCutting) {
                window.blade.cut();
            }
        }

        start = function() {
            this.InProgress = true;
            this.initLevel();
        }

        finishLevel = function() {
            this.InProgress = false;
            //тут сделаем красивое завершение уровня
            this.levelInfo.count += 1;
            this.levelInfo.pointsStart = window.utils.scaleField(window.level.pointsCurr,this.gameSize);
            this.levelInfo.percentToWin = 80;
            this.levelInfo.color = "#9db854";
            window.blade.disactivate();
            setTimeout(this.start.bind(this),5000);
        }
    };

    function renderGameSVG (cnt) {

        cntPlayground.style.height = GAME_HEIGHT + "px";
        cntPlayground.style.width = GAME_WIDTH + "px";
        const CANVAS_SIZE = cntField.offsetWidth;

        var levelInfo = {
            count: 1,
            percentToWin: 65,
            pointsStart: [
                    {x:0,y:0},
                    {x:CANVAS_SIZE,y:0},
                    {x:CANVAS_SIZE,y:CANVAS_SIZE},
                    {x:0,y:CANVAS_SIZE},
                ],
            color: COLORS.rect,
        };
        
        //создаем канвас
        var gameCanvas = document.createElement("canvas");
        gameCanvas.setAttribute("width",CANVAS_SIZE);
        gameCanvas.setAttribute("height",CANVAS_SIZE);
        cntField.appendChild(gameCanvas);
        window.context = gameCanvas.getContext("2d");

        btnStart.addEventListener("click", startGame);

        window.game = new Game(window.context,levelInfo,CANVAS_SIZE);
        
        function startGame() {
            window.game.start();
            function tick() {
                if (window.game.InProgress) {
                    window.game.draw();
                }
                requestAnimationFrame(tick);
            }
            tick();
        }
    }

    renderGameSVG(cntField);
})();
