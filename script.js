'use strict';

//======================================FD-2 SCALE-GAME==================================
/*
*/

(function () {

    try {
        var blockGame = document.querySelector('.game');
        var cntPlayground = blockGame.querySelector('.game__playground');
        var cntProgress = blockGame.querySelector('.progress');
        var cntProgressValue = blockGame.querySelector('.progress__value');
        var cntField = blockGame.querySelector('.game__field');
        var cntCounter = blockGame.querySelector('.game__level');
        var btnStart = blockGame.querySelector('.game__button--start');
        var btnColors = blockGame.querySelector('.game__button--colors');
        var cntBlade = blockGame.querySelector('.blade');
    } catch {
        return;
    }
    
    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;
    const GAME_HEIGHT = clientHeight;
    const GAME_WIDTH = Math.round(Math.min(GAME_HEIGHT/4*3,clientWidth));
    
    const COLOR_BG = "rgba(255, 255, 255, 0.3)";
    const COLOR_BORDER = "#FFFFFF";
    const COLOR_BALL = "#000000";

    const bladeTypes = ["top-right","top-left","bottom-right","bottom-left","left-right","top-bottom"];
    const bladeSpeed = 6;
    const ballSpeed = 3;

    
    const levelColors = [
        "#F79F1F","#FFC312","#ffd700","#FFCC33","#FFFF33","#A3CB38", //yellow
        "#009966","#00CC66","#33FF66","#66CC66","#66FF33","#66CC33","#009432","#1289A7","#006266", //green
        "#0033CC","#0066FF","#0099CC","#00CCCC","#33CCCC","#1B1464","#5758BB", //blue
        "#993399","#6633CC","#D980FA","#B53471","#9980FA","#833471","#6F1E51","#993366","#FF66FF", //violet
        "#ED4C67","#EE5A24","#EA2027","#ff6d69","#FF3300","#FF3333","#FF3366" //pink
    ];

    function renderGameSVG (cnt) {

        cntPlayground.style.height = GAME_HEIGHT + "px";
        cntPlayground.style.width = GAME_WIDTH + "px";

        const CANVAS_SIZE = cntField.offsetWidth;
        const BORDER_SIZE = CANVAS_SIZE*0.01;
        const FIELD_SIZE = CANVAS_SIZE - BORDER_SIZE*2;
        const BALL_RADIUS = CANVAS_SIZE*0.02;

        var imgBall = new Image();
        imgBall.src = "img/ball.svg";

        var levelInfo = {
            count: 1,
            percentToWin: 50,
            pointsStart: [
                    {x:BORDER_SIZE,y:BORDER_SIZE},
                    {x:FIELD_SIZE+BORDER_SIZE,y:BORDER_SIZE},
                    {x:FIELD_SIZE+BORDER_SIZE,y:FIELD_SIZE+BORDER_SIZE},
                    {x:BORDER_SIZE,y:FIELD_SIZE+BORDER_SIZE},
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
        btnColors.addEventListener("click", showColors);

        function showColors() {
            context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            var colorCount = levelColors.length;
            var colorSize = CANVAS_SIZE/Math.ceil(Math.sqrt(colorCount));
            var top = 0;
            var left = 0;
            for (var i = 0; i< levelColors.length; i++) {
                context.fillStyle = levelColors[i];
                context.fillRect(left,top,colorSize,colorSize);
                left = left + colorSize;
                if (left+colorSize>CANVAS_SIZE) {
                    top = top + colorSize;
                    left = 0;
                }
            }
        }

        function startGame() {
            btnStart.textContent = "Finish";
            btnStart.removeEventListener("click", startGame);
            btnStart.addEventListener("click", finishGame);
            window.game = new Game(window.context,FIELD_SIZE,BORDER_SIZE,COLOR_BG,COLOR_BORDER,COLOR_BALL,BALL_RADIUS,ballSpeed,levelInfo,levelColors,imgBall,cntBlade,cntField,cntCounter,cntProgress,cntProgressValue,bladeTypes,bladeSpeed);
            window.game.start();
            function tick() {
                if (window.game) {
                    if (window.game.InProgress) {
                        window.game.draw();
                    }
                    if (window.game.scaleField) {
                        window.game.scale();
                    }
                    if (window.game.InProgress||window.game.scaleField) {
                        requestAnimationFrame(tick);
                    }
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
