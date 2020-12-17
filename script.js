'use strict';

//======================================FD-2 SCALE-GAME==================================

(function () {

    try {
        var blockGame = document.querySelector('.game');
        var cntGame = blockGame.querySelector('.game__container');
        var cntGameName = blockGame.querySelector('.game__name');
        var cntGameScore = blockGame.querySelector('.game__score');
        var cntGameSettings = blockGame.querySelector('.game__settings');
        var cntField = blockGame.querySelector('.game__field');
    } catch {
        return;
    }

    location.hash = "";

    //настройка размеров игры
    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;
    //const GAME_HEIGHT = clientHeight - cntGameName.offsetHeight - cntGameScore.offsetHeight - cntGameSettings.offsetHeight;
    //const GAME_WIDTH = Math.round(Math.min(GAME_HEIGHT,clientWidth));
    const GAME_HEIGHT = clientHeight;
    const GAME_WIDTH = Math.round(Math.min(GAME_HEIGHT-60-80-100,clientWidth));
    const CANVAS_SIZE = GAME_WIDTH - 20;
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

    //загрузка таблицы рекордов AJAX (fe.it-academy.by/AjaxStringStorage2)
    var prAJAXRecords= new Promise( (resolve,reject) => {

        var ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
        var stringName = 'Andreeva_ScaleRecords';
        $.ajax( {
                url: ajaxHandlerScript, type: 'POST', cache: false, dataType:'json',
                data: { f: 'READ', n: stringName },
                success: readReady, error: errorHandler
            }
        );  
        
        function readReady(callresult) {
            if ( callresult.error!=undefined ) {             
                alert(callresult.error);
            } else {
                data.recordsTable = JSON.parse(callresult.result);
                resolve(true);
            }
        }

        function errorHandler(jqXHR,statusStr,errorStr) {
            alert(statusStr + ' ' + errorStr);
        }
    });

    //загрузка данных localStorage
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

    Promise.all([prFPS,prAJAX,prAJAXRecords,prLS]).then( result => {setTimeout(renderGame,500)});


/*
   var btnColors = blockGame.querySelector('.game__button--colors');
   var btnStart = blockGame.querySelector('.game__button--start');
   var btnBall = blockGame.querySelector('.game__button--ball');
   btnColors.addEventListener("click", showColors);
        function showColors() {
            btnStart.style.display = "none";
            var cntGameStart = blockGame.querySelector('.game__start');
            cntGameStart.style.display = "flex";
            cntGameStart.style.flexWrap = "wrap";
            cntGame.style.width = "auto";
            var colors = [
                "#A52A2A","#E56C19","#DAA520","#228B22","#0099CC","#4169E1","#483D8B","#1B1464","#6F1E51",
                "#EA2027","#EE5A24","#F79F1F","#FFD333","#A3CB38","#006266","#4682B4","#993366","#ED4C67",
                "#FF6D69","#FF3333","#FF3300","#FBCB2C","#66CC33","#33CCCC","#1289A7","#5758BB","#833471",
                "#000000"];
                for (var i = 0; i < colors.length; i++) {
                    var cntColor = document.createElement("div");
                    cntColor.classList.add("game__button");
                    cntColor.classList.add("game__button--TEST");
                    cntColor.textContent = colors[i];
                    cntColor.style.backgroundColor = colors[i];
                    cntColor.style.backgroundSize = "30%";
                    cntColor.style.backgroundImage = btnBall.style.backgroundImage;
                    cntColor.style.backgroundPosition = "center";
                    cntColor.style.backgroundRepeat = "no-repeat";
                    cntColor.style.fontSize = "10px";
                    cntColor.style.width = "70px";
                    cntColor.style.height = "70px";
                    cntColor.style.margin = "10px";
                    cntGameStart.appendChild(cntColor);      
                }

          }
  */

    function renderGame () {
        cntGame.style.height = GAME_HEIGHT + "px";
        cntGame.style.width = GAME_WIDTH + "px";

        //создаем канвас
        var gameCanvas = document.createElement("canvas");
        gameCanvas.setAttribute("width",CANVAS_SIZE);
        gameCanvas.setAttribute("height",CANVAS_SIZE);
        cntField.appendChild(gameCanvas);
        var context = gameCanvas.getContext("2d");

        var myGame = new Game(CANVAS_SIZE,data);
        var viewCanvas = new ViewCanvas(cntGame);
        var controller = new GameController();
        myGame.start(viewCanvas);
        controller.start(myGame,cntGame);
        viewCanvas.start(context,myGame);
        
        location.hash = "Menu";      
    }
})();