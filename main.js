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
        var btnStart = blockGame.querySelector('.game__start');
        var cntBlade = blockGame.querySelector('.game__blade');
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

    function renderGameSVG (cnt) {

        var pgHeight = SIZES.playgroundHeight;
        var pgWidth = SIZES.playgroundWidth;
        
        //создаем канвас
        var gameCanvas = document.createElement("canvas");
        gameCanvas.setAttribute("width",pgWidth);
        gameCanvas.setAttribute("height",pgHeight);
        cntField.appendChild(gameCanvas);
        window.context = gameCanvas.getContext("2d");

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
        /*var points = [
            {x:0,y:0},
            {x:pgWidth,y:0},
            {x:pgWidth,y:pgHeight},
            {x:0,y:pgHeight},
        ];*/

        var points = [
        {x: 600, y: 0},
        {x: 100, y: 600},
        {x: 100, y: 500},
        {x: 50, y: 0},
        {x: 50, y: 500},
        {x: 600, y: 480},
        {x: 450, y: 600},
        {x: 450, y: 480},
        ];

        const TOUCH_SHIFT = 100;
        //const bladeTypes = ["top-right","top-left","bottom-right","bottom-left","right-left","top-bottom"];
        const bladeTypes = ["top-bottom"];
        const bladeSpeed = 3;
        
        //создание рисунка на канвасе
        function draw() {
            window.field.draw2();
            window.ball.draw();
            if (window.blade.isCutting) {
                blade.cut();
            }
        }

        function startGame() {
            //clearInterval(timer);
            window.field = new Field(window.context,COLORS.backgound,COLORS.rect,pointsStart,points);
            window.blade = new Blade(cntBlade,window.utils.getElementCoords(cntField),bladeTypes,bladeSpeed);
            window.blade.create();
            window.ball = new Ball(window.context,COLORS.ball,SIZES.ball/2,pgWidth/2,pgHeight/2);
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
    window.cntGame = cntGame;

    window.cntField = cntField;
})();
