'use strict';

//======================================FD-2 SCALE-GAME==================================

(function () {

    try {
        var blockGame = document.querySelector('.game');
        var cntPlayground = blockGame.querySelector('.game__playground');
        var cntIntro = blockGame.querySelector('.game__intro');
        var cntPlay = blockGame.querySelector('.game__play');
        var cntField = blockGame.querySelector('.game__field');
        
    } catch {
        return;
    }

    //настройка размеров игры
    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;
    const GAME_HEIGHT = clientHeight;
    const GAME_WIDTH = Math.round(Math.min(GAME_HEIGHT/4*3,clientWidth));
    var data = {};
    
    //узнаем частоту экрана
    var prFPS = new Promise( (resolve,reject) => {
        var sss = {};
        var s1 = new Date().getMilliseconds();
        getFPS();
        
        function getFPS() {
            var s2 = new Date().getMilliseconds();
            var delta = s2-s1;
            s1 = s2;
            if (delta in sss) {
                sss[delta] = sss[delta] + 1;
                if (sss[delta]>50) {
                    data.fps = Math.round(1000/delta);
                    blockGame.querySelector('.game__button--start').textContent = data.fps;
                    resolve(true);
                    return;
                }  
            } else {
                sss[delta] = 1;
            }
            requestAnimationFrame(getFPS);
        }
    });

    //загрузка данных AJAX (цвета, мячики)
    var prAJAX= new Promise( (resolve,reject) => {
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
                data[files[i]] = xhr.response;
                filesCount++;
                if (filesCount == files.length) {
                    resolve(true);
                }
            }
        }
    });

    //загрузка данных local Storage
    var prLS= new Promise( (resolve,reject) => {
        var lsName = "gameScale";
        data.lsName = lsName;
        var ls = localStorage.getItem(lsName);
        if (ls) {
            var dataLs = JSON.parse(ls);
            for (var k in dataLs) {
                data[k] = dataLs[k];
            }
        }
        resolve(true);
    });

    Promise.all([prFPS,prAJAX,prLS]).then( result => {renderGame();});
        
    function renderGame () {
        cntPlay.classList.remove("hidden");
        console.log("данные загружены");
        cntPlayground.style.height = GAME_HEIGHT + "px";
        cntPlayground.style.width = GAME_WIDTH + "px";
        const CANVAS_SIZE = cntField.offsetWidth;

        //создаем канвас
        var gameCanvas = document.createElement("canvas");
        gameCanvas.setAttribute("width",CANVAS_SIZE);
        gameCanvas.setAttribute("height",CANVAS_SIZE);
        cntField.appendChild(gameCanvas);
        var context = gameCanvas.getContext("2d");

        var myGame = new Game(CANVAS_SIZE,data);
        var viewCanvas = new ViewCanvas(blockGame);
        var controller = new GameController();
        myGame.start(viewCanvas);
        controller.start(myGame,blockGame);
        viewCanvas.start(context,myGame);

        cntIntro.classList.remove("hidden");
        cntPlay.classList.add("hidden");

        
    }
})();



/**
 *         //var btnColors = blockGame.querySelector('.game__button--colors');
        //btnColors.addEventListener("click", showColors);
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


              btnStart.style.backgroundColor = colors[colorIndex];
              btnStart.style.backgroundImage = btnBall.style.backgroundImage;
              btnStart.style.backgroundSize = "10%";
              btnStart.style.backgroundPosition = "70px 10px";
              btnStart.textContent = colors[colorIndex];
              btnStart.style.fontSize = "20px";
              colorIndex++;
  
          }
  
          
  
 */