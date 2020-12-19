  "use strict";

  // в закладке УРЛа будем хранить разделённые подчёркиваниями слова
  // #Main - главная
  // #Photo_55 - отобразить фото 55
  // #About - о нас

  // отслеживаем изменение закладки в УРЛе
  // оно происходит при любом виде навигации
  // в т.ч. при нажатии кнопок браузера ВПЕРЁД/НАЗАД
  window.onhashchange=switchToStateFromURLHash;

  // текущее состояние приложения
  // это Model из MVC
  var SPAState={};

  // вызывается при изменении закладки УРЛа
  // а также при первом открытии страницы
  // читает новое состояние приложения из закладки УРЛа
  // и обновляет ВСЮ вариабельную часть веб-страницы
  // соответственно этому состоянию
  // это упрощённая реализация РОУТИНГА - автоматического выполнения нужных
  // частей кода в зависимости от формы URLа
  // "роутинг" и есть "контроллер" из MVC - управление приложением через URL
  function switchToStateFromURLHash() {
    var URLHash=window.location.hash;

    var cntGame = document.querySelector(".game__container");
    var cntLoad = cntGame.querySelector('.game__loader');
    var cntMenu = cntGame.querySelector('.game__menu');
    var cntPlay = cntGame.querySelector('.game__play');

    // убираем из закладки УРЛа решётку
    // (по-хорошему надо ещё убирать восклицательный знак, если есть)
    var stateStr=URLHash.substr(1);

    if ( stateStr!="" ) { // если закладка непустая, читаем из неё состояние и отображаем
      var parts=stateStr.split("_")
      SPAState={ pagename: parts[0] }; // первая часть закладки - номер страницы
      if ( SPAState.pagename=='Photo' )
        SPAState.photoid=parts[1]; // для фото нужна ещё вторая часть закладки - номер фото
    }
    else
      SPAState={pagename:'Load'}; // иначе показываем главную страницу

    switch ( SPAState.pagename ) {
      case 'Menu':
        cntLoad.classList.add("hidden");  
        cntMenu.classList.remove("hidden");
        cntPlay.classList.add("hidden");
        cancelFullscreen();
        break;
      case 'Play':
        cntLoad.classList.add("hidden");
        cntPlay.classList.remove("hidden");
        cntMenu.classList.add("hidden");
        launchFullScreen(document.documentElement);
        break;
      case 'Load':
        cntMenu.classList.add("hidden");
        cntPlay.classList.add("hidden");
        cancelFullscreen();
        break;
    }

    
    function launchFullScreen(element) {
      if(element.requestFullScreen) {
        element.requestFullScreen();
      } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      }
    }

    function cancelFullscreen() {
      if(document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if(document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
