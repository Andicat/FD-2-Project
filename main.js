'use strict';

//======================================FD-2 SCALE-GAME==================================
/*
*/

(function () {

    try {
        var blockGame = document.querySelector('.game');
        var cntGame = blockGame.querySelector('.game__container');
        var cntHeader = blockGame.querySelector('.game__header');
        var cntField = blockGame.querySelector('.game__field');
        var cntFooter = blockGame.querySelector('.game__footer');
    } catch {
        return;
    }

    var timer;
    const GAME_SIZE = window.matchMedia("(max-width: 768px)").matches?300:600;
    const SPEED = 5;
    const SIZES = {
        playgroundWidth: GAME_SIZE,
        playgroundHeight: GAME_SIZE,
        playerWidth: GAME_SIZE*0.02,
        playerHeight: GAME_SIZE*(0.2-0.02),
        ball: GAME_SIZE*0.025,
        scoreboardFontSize: GAME_SIZE*0.1,
    };
    const COLORS = {
        backgound: "rgb(144, 172, 173)",
        field: "#dbda79",
        rect: " rgb(163, 55, 55)",
        ball: "#000",
    }

    var rectsStart = [];
    var rects = [];

    function renderGameSVG (cnt) {

        var pgHeight = SIZES.playgroundHeight;
        var pgWidth = SIZES.playgroundWidth;
        
        //создаем канвас
        var gameCanvas = document.createElement("canvas");
        gameCanvas.setAttribute("width",pgWidth);
        gameCanvas.setAttribute("height",pgHeight);
        cntField.appendChild(gameCanvas);
        var context = gameCanvas.getContext("2d");

        //создаем кнопку старта
        var btnStart = document.createElement("button");
        btnStart.classList.add("game__start");
        btnStart.textContent = "Start";
        cntFooter.appendChild(btnStart);
        btnStart.addEventListener("click", startGame);

        //создаем поле
        var pointsStart = [
            {x:0,y:0},
            {x:pgWidth,y:0},
            {x:pgWidth,y:pgHeight},
            {x:pgWidth,y:0},
        ];
        /*window.points = [
            {x:200,y:0},
            {x:400,y:0},
            {x:400,y:50},
            {x:100,y:50},
            {x:100,y:250},
            {x:500,y:250},
            {x:500,y:100},
            {x:300,y:100},
            {x:300,y:400},
            {x:150,y:400},
            {x:150,y:250},
            {x:0,y:250},
            {x:0,y:100},
            {x:200,y:100},
        ];*/
        window.points = [
            {x:0,y:0},
            {x:pgWidth,y:0},
            {x:pgWidth,y:pgHeight},
            {x:0,y:pgHeight},
        ];
        
        //создание рисунка на канвасе
        function draw() {
            window.drawField(context,rectsStart,COLORS.backgound);
            window.drawField(context,window.rects,COLORS.rect);
            window.drawBall();
            if (window.isCutting) {
                window.drawCutting(context,"#ffffff",1);
            }
        }

        function startGame() {
            clearInterval(timer);
            rectsStart = window.createRects(pointsStart);
            window.rects = window.createRects(window.points);
            window.startBlade();
            window.startBall(context,COLORS.ball,SIZES.ball/2,pgWidth/2,pgHeight/2);
            draw();
            function move() {
                window.moveBall();
                draw();
            }
            timer = setInterval(move,40);
        }
    }

    renderGameSVG(cntField);

    //эскпорт
    window.cntGame = cntGame;
    window.cntField = cntField;
    window.rects = rects;
    window.points = points;
})();
