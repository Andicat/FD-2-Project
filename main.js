'use strict';

//======================================FD-2 SCALE-GAME==================================
/*
*/

(function () {

    try {
        var blockGame = document.querySelector('.game');
        var cntPlayground = blockGame.querySelector('.game__playground');
        var progress = blockGame.querySelector('.progress');
        var cntField = blockGame.querySelector('.game__field');
        //var cntFooter = blockGame.querySelector('.game__footer');
        var btnStart = blockGame.querySelector('.game__start');
        var cntBlade = blockGame.querySelector('.game__blade');
    } catch {
        return;
    }
    
    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;
    const GAME_SIZE = Math.min(clientHeight,clientWidth);
    const SPEED = 5;
    const SIZES = {
        playgroundWidth: GAME_SIZE,
        playgroundHeight: GAME_SIZE,
        ball: GAME_SIZE*0.025,
    };
    const COLORS = {
        backgound: "rgb(144, 172, 173)",
        field: "#dbda79",
        rect: " rgb(163, 55, 55)",
        ball: "#000",
    }
    const TOUCH_SHIFT = 100;
    const bladeTypes = ["top-right","top-left","bottom-right","bottom-left","right-left","top-bottom"];
    const bladeSpeed = 3;

    function renderGameSVG (cnt) {

        cntPlayground.style.height = GAME_SIZE + "px";
        
        //создаем канвас
        var gameCanvas = document.createElement("canvas");
        gameCanvas.setAttribute("width",SIZES.playgroundWidth);
        gameCanvas.setAttribute("height",SIZES.playgroundHeight);
        cntField.appendChild(gameCanvas);
        window.context = gameCanvas.getContext("2d");

        btnStart.addEventListener("click", startGame);
        
        //создание рисунка на канвасе
        function draw() {
            window.field.draw();
            window.ball.draw();
            if (window.blade.isCutting) {
                blade.cut();
            }
        }

        function startGame() {
            var fieldSize = cntField.offsetHeight - progress.offsetHeight;
            progress.style.width = fieldSize + "px";
            cntField.style.width = fieldSize + "px";
            console.log(fieldSize);
            var count = 1;
            var pointsStart = [
                {x:0,y:0},
                {x:fieldSize,y:0},
                {x:fieldSize,y:fieldSize},
                {x:fieldSize,y:0},
            ];
            window.level = new Level(progress, count, pointsStart, pointsStart, 60, COLORS.rect);
            window.field = new Field(window.context,COLORS.backgound,window.level.color,window.level.pointsStart,window.level.pointsCurr);
            window.blade = new Blade(cntBlade,window.utils.getElementCoords(cntField),bladeTypes,bladeSpeed);
            window.blade.create();
            window.ball = new Ball(window.context,COLORS.ball,SIZES.ball/2,SIZES.playgroundWidth/2,SIZES.playgroundHeight/2);
            ball.updateActualRect();
            draw();
            function move() {
                window.ball.move();
                draw();
                requestAnimationFrame(move);
            }
            requestAnimationFrame(move);
            //timer = setInterval(move,40);
        }
    }

    renderGameSVG(cntField);

    //эскпорт
    //window.cntGame = cntGame;

    window.cntField = cntField;
})();
