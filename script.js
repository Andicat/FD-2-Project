'use strict';

//======================================FD-2 SCALE-GAME==================================

(function () {

    try {
        var blockGame = document.querySelector('.game');
        var cntGame = blockGame.querySelector('.game__container');
    } catch (error){
        return;
    }

    location.hash = "";
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

    //запускаем игру после загрузки всех данных
    Promise.all([prFPS,prAJAX,prAJAXRecords,prLS]).then( result => {setTimeout(renderGame,500)});

    function renderGame () {
        //предзагрузка изображений
        var imagesPreload = ["sound-on.svg","sound-off.svg","icon-table.svg","blade-top-right.svg","blade-top-left.svg","blade-bottom-right.svg","blade-bottom-left.svg","blade-left-right.svg","blade-top-bottom.svg","icon-turn.svg","icon-back.svg"];
        imagesPreload.forEach( function(imgSrc) {
            var img = new Image();
            img.src = "img/" + imgSrc;
        });
        //инициализация игры
        var myGame = new Game(data);
        var viewCanvas = new ViewCanvas(cntGame);
        var controller = new GameController();
        controller.start(myGame,cntGame);
        viewCanvas.start(myGame);
        myGame.start(viewCanvas);
        location.hash = "Menu";      
    }
})();