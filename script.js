'use strict';

//======================================FD-2 SCALE-GAME==================================

(function () {

    try {
        var blockGame = document.querySelector('.game');
        var cntPlayground = blockGame.querySelector('.game__playground');
        var cntIntro = blockGame.querySelector('.game__intro');
        var cntPlay = blockGame.querySelector('.game__play');
        var cntScore = blockGame.querySelector('.game__score-value');
        var btnSound = blockGame.querySelector('.game__button--sound');
        var btnBall = blockGame.querySelector('.game__button--ball');
        var modalBall = document.querySelector('.modal');
        var btnBallModalClose = modalBall.querySelector('.modal__button-close');
        var cntField = blockGame.querySelector('.game__field');
        var btnStart = blockGame.querySelector('.game__button--start');
        //var btnColors = blockGame.querySelector('.game__button--colors');
        
    } catch {
        return;
    }

    var ttt = ["ball-1.svg","ball-2.svg","ball-3.svg","ball-4.svg","ball-5.svg","ball-6.svg","ball-7.svg","ball-8.svg","ball-9.svg","ball-10.svg","ball-11.svg","ball-12.svg","ball-13.svg","ball-14.svg","ball-15.svg","ball-16.svg","ball-17.svg","ball-18.svg","ball-19.svg","ball-20.svg","ball-21.svg","ball-22.svg","ball-23.svg","ball-24.svg","ball-25.svg","ball-26.svg","ball-27.svg","ball-28.svg","ball-29.svg","ball-30.svg","ball-31.svg","ball-32.svg","ball-33.svg","ball-34.svg","ball-35.svg","ball-36.svg","ball-37.svg","ball-38.svg","ball-39.svg","ball-40.svg"];
    console.log(JSON.stringify(ttt));

    //настройка размеров игры
    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;
    const GAME_HEIGHT = clientHeight;
    const GAME_WIDTH = Math.round(Math.min(GAME_HEIGHT/4*3,clientWidth));
    
    //загрузка данных AJAX (цвета, мячики)
    function loadAJAXData() {
        var files = ["colors","balls"];
        var filesCount = 0;
        var DATA = {};
        var URL = 'https://andicat.github.io/FD-2-Project/data/';
        
       

        for ( let i = 0; i < files.length; i++ ) {
    
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'text';
            xhr.addEventListener('load', loaded);
            xhr.open('GET', URL + files[i] + '.json');
            xhr.send();

            function loaded() {
                debugger
                DATA[i] = xhr.response;
                filesCount++;
                if (filesCount == files.length) {
                    showIP();
                }
            }

            function showIP() {
                console.log("данные загружены");
                console.log(DATA);
            }
        }
    }

    loadAJAXData();

    //загрузка данный из локального хранилища
    var lsName = "gameScale";
    var ls = localStorage.getItem(lsName);
    var lsData = {};
    if (ls) {
        lsData = JSON.parse(ls);
    }

    // открытие модального окна
    btnBall.addEventListener('click', function(evt) {
        evt.preventDefault();
        document.body.classList.add('stop-scrolling');
        modalBall.classList.add('modal--show');
        showBalls(modalBall.querySelector(".modal__inner"));
    });
    
    //закрытие модального окна по кнопке закрытия
    btnBallModalClose.addEventListener("click", closeModal);

    // закрытие модального окна по esc
    window.addEventListener("keydown", function(evt) {
        if (evt.keyCode === 27) {
        evt.preventDefault();
        closeModal();
        }
    });

    // закрытие модального окна по клику на modal-overlay
    modalBall.addEventListener('click', function(evt) {
        if (evt.target === this) {
            closeModalOverlay(evt);
        }
    });

    function closeModal() {
        modalBall.classList.remove('modal--show');
        document.body.classList.remove('stop-scrolling');
    }

    function showBalls(cnt) {
        cnt.innerHTML = "";
        //создаем контейнер
        var balls = document.createElement("ul");
        balls.classList.add("ball");
        cnt.appendChild(balls);
        
        //создаем мячики
        for (var i = 1; i <= 40; i++) {
            var ballItem = document.createElement("li");
            ballItem.classList.add("ball__item");
            balls.appendChild(ballItem);
            var ballInput = document.createElement("input");
            ballInput.classList.add("visually-hidden");
            ballInput.setAttribute("type","radio");
            ballInput.setAttribute("name","balls");
            ballInput.setAttribute("id","ball-" + i);
            ballInput.setAttribute("value","ball-" + i);
            ballItem.appendChild(ballInput);
            var ballLabel = document.createElement("label");
            ballLabel.setAttribute("for","ball-" + i);
            ballLabel.style.backgroundImage = "url('img/ball-" + i + ".svg')";
            ballItem.appendChild(ballLabel);
        }
    }

    function closeModalOverlay(evt) {
        evt.target.classList.remove('modal--show');
        document.body.classList.remove('stop-scrolling');
    }
    
    function renderGame (cnt) {   
        if (lsData.soundOff) {
            btnSound.classList.add("game__button--sound-off");
        } else {
            lsData.soundOff = false;
        }

        if (lsData.ballImageSrc) {
            btnBall.style.backgroundImage = "url('" + lsData.ballImageSrc + "')";
        } else {
            btnBall.style.backgroundImage = "url('img/ball-1.svg')";
            lsData.ballImageSrc = 'img/ball-1.svg';
        }

        if (lsData.bestScore) {
            cntScore.textContent = lsData.bestScore;
        }

        cntPlayground.style.height = GAME_HEIGHT + "px";
        cntPlayground.style.width = GAME_WIDTH + "px";

        const CANVAS_SIZE = cntField.offsetWidth;
        const BORDER_SIZE = CANVAS_SIZE*0.01;
        const FIELD_SIZE = CANVAS_SIZE - BORDER_SIZE*2;

        //создаем канвас
        var gameCanvas = document.createElement("canvas");
        gameCanvas.setAttribute("width",CANVAS_SIZE);
        gameCanvas.setAttribute("height",CANVAS_SIZE);
        cntField.appendChild(gameCanvas);
        var context = gameCanvas.getContext("2d");

        btnStart.addEventListener("click", startGame);
        btnSound.addEventListener("click", function() {
            btnSound.classList.toggle("game__button--sound-off");
            lsData.soundOff = btnSound.classList.contains("game__button--sound-off")?true:false;
        })
        cntPlay.classList.add("hidden");
        //btnColors.addEventListener("click", showColors);

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
            //btnStart.textContent = "Finish";
            //btnStart.removeEventListener("click", startGame);
            //btnStart.addEventListener("click", finishGame);
            cntIntro.classList.add("hidden");
            cntPlay.classList.remove("hidden");
            
            var myGame = new Game(CANVAS_SIZE);
            var viewCanvas = new ViewCanvas(context,blockGame);
            var controller = new GameController();
            controller.start(myGame,cntPlayground,btnSound);
            viewCanvas.start(myGame);
            myGame.startGame(viewCanvas,lsName,lsData);
        }

        
    }


    renderGame(cntField);

})();
