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
        
    } catch {
        return;
    }

    //настройка размеров игры
    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;
    const GAME_HEIGHT = clientHeight;
    const GAME_WIDTH = Math.round(Math.min(GAME_HEIGHT/4*3,clientWidth));
    const DATA = {};
    var lsData = {};
    
    //загрузка данных AJAX (цвета, мячики)
    function loadAJAXData() {
        var files = ["colors","balls"];
        var filesCount = 0;
        var URL = 'https://andicat.github.io/FD-2-Project/data/';
        
        for ( let i = 0; i < files.length; i++ ) {
    
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.addEventListener('load', loaded);
            xhr.open('GET', URL + files[i] + '.json');
            xhr.send();

            function loaded() {
                DATA[files[i]] = xhr.response;
                filesCount++;
                if (filesCount == files.length) {
                    renderGame();
                }
            }
        }
    }

    var clickAudio = new Audio;
    if (clickAudio.canPlayType("audio/mpeg")=="probably") {
        clickAudio.src="sound/click.mp3";
    }

    // если поддержка формата точно известна, можно сразу так:
    //var clickAudio=new Audio("http://fe.it-academy.by/Examples/Sounds/button-16.mp3");

    loadAJAXData();

    // открытие модального окна
    btnBall.addEventListener('click', function(evt) {
        evt.preventDefault();
        document.body.classList.add('stop-scrolling');
        modalBall.classList.add('modal--show');
        showBalls(modalBall.querySelector(".modal__container"));
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
        var ballSelectedSrc = document.forms["balls"].querySelector('input:checked').value;
        btnBall.style.backgroundImage = "url('img/" + ballSelectedSrc + "')";
        lsData.ballImageSrc = ballSelectedSrc;
    }

    function showBalls(cnt) {
        cnt.innerHTML = "";
        //создаем контейнер
        var ballsForm = document.createElement("form");
        ballsForm.setAttribute("name","balls");
        ballsForm.classList.add("ball");

        cnt.appendChild(ballsForm);
        
        //создаем мячики
        var ballsArr = DATA.balls;
        for (var i = 0; i < ballsArr.length; i++) {
            var ballItem = document.createElement("li");
            ballItem.classList.add("ball__item");
            ballsForm.appendChild(ballItem);
            var ballInput = document.createElement("input");
            ballInput.classList.add("visually-hidden");
            ballInput.setAttribute("type","radio");
            ballInput.setAttribute("name","balls");
            ballInput.setAttribute("id","ball-" + (i+1));
            ballInput.setAttribute("value",ballsArr[i]);
            if (lsData.ballImageSrc == ballsArr[i]) {
                ballInput.setAttribute("checked","true");
            }
            ballItem.appendChild(ballInput);
            var ballLabel = document.createElement("label");
            ballLabel.setAttribute("for","ball-" + (i+1));
            ballLabel.style.backgroundImage = "url('img/" + ballsArr[i] + "')";
            ballItem.appendChild(ballLabel);
        }

    }

    function closeModalOverlay(evt) {
        evt.target.classList.remove('modal--show');
        document.body.classList.remove('stop-scrolling');
    }
    
    function renderGame () {   
        //загрузка данный из локального хранилища
        var lsName = "gameScale";
        var ls = localStorage.getItem(lsName);
        if (ls) {
            lsData = JSON.parse(ls);
        }

        if (lsData.soundOff) {
            btnSound.classList.add("game__button--sound-off");
        } else {
            lsData.soundOff = false;
        }

        if (lsData.ballImageSrc) {
            btnBall.style.backgroundImage = "url('img/" + lsData.ballImageSrc + "')";
        } else {
            btnBall.style.backgroundImage = "url('img/" + DATA.balls[0] + "')";
            lsData.ballImageSrc = DATA.balls[0];
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
        

        var btnColors = blockGame.querySelector('.game__button--colors');
        btnColors.addEventListener("click", showColors);
        var colorIndex = 0;
        function showColors() {
            var colors = [
            "#e6bf32", 
            "#FBCB2C", 
            "#ebd726", 
            "#FAC221",  
            "#ffd333",
            "#F79F1F", 
            "#A3CB38", 
            "#009966", 
            "#00CC66",  
            "#66CC66",  
            "#66CC33", 
            "#009432", 
            "#1289A7", 
            "#006266", 
            "#0033CC", 
            "#0066FF", 
            "#0099CC", 
            "#00CCCC", 
            "#33CCCC", 
            "#1B1464", 
            "#5758BB", 
            "#993399", 
            "#6633CC", 
            "#B53471", 
            "#9980FA", 
            "#833471", 
            "#6F1E51", 
            "#993366", 
            "#ED4C67", 
            "#EE5A24", 
            "#EA2027", 
            "#ff6d69", 
            "#FF3300", 
            "#FF3333", 
            "#FF3366"];

            /*var colors = [
              ]*/  

            btnStart.style.backgroundColor = colors[colorIndex];
            btnStart.style.backgroundImage = btnBall.style.backgroundImage;
            btnStart.style.backgroundSize = "10%";
            btnStart.style.backgroundPosition = "70px 10px";
            btnStart.textContent = colors[colorIndex];
            btnStart.style.fontSize = "20px";
            colorIndex++;

        }

        function startGame() {
            cntIntro.classList.add("hidden");
            cntPlay.classList.remove("hidden");
            clickSoundInit();
            
            var myGame = new Game(CANVAS_SIZE,DATA);
            var viewCanvas = new ViewCanvas(context,blockGame);
            var controller = new GameController();
            controller.start(myGame,cntPlayground,btnSound);
            viewCanvas.start(myGame);
            myGame.startGame(viewCanvas,lsName,lsData,clickAudio);
        }

        function clickSoundInit() {
            clickAudio.play(); // запускаем звук
            clickAudio.pause(); // и сразу останавливаем
        }

        
    }

})();
