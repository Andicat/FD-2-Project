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
    
    console.log('Новое состояние приложения:');
    console.log(SPAState);

    // обновляем вариабельную часть страницы под текущее состояние
    // это реализация View из MVC - отображение состояния модели в HTML-код
    switch ( SPAState.pagename ) {
      case 'Menu':
        cntLoad.classList.add("hidden");  
        cntMenu.classList.remove("hidden");
        cntPlay.classList.add("hidden");
        //pageHTML+="<h3>Главная страница</h3>";
        //pageHTML+="<p>Щёлкайте по кнопкам!</p>";
        break;
      case 'Play':
        cntLoad.classList.add("hidden");
        cntPlay.classList.remove("hidden");
        cntMenu.classList.add("hidden");
        
        //var photo=photos[SPAState.photoid];
        //pageHTML+="<h3>Фото</h3>";
        //pageHTML+="<img src='"+photo.image+"'>";
        //pageHTML+="<p><i>"+photo.comment+"</i></p>";
        break;
      case 'Load':
        cntMenu.classList.add("hidden");
        cntPlay.classList.add("hidden");
        /*pageHTML+="<div class='load'>";
        pageHTML+="<div class='load__circle load__circle-1'></div>";
        pageHTML+="<div class='load__circle load__circle-2'></div>";
        pageHTML+="<div class='load__circle load__circle-3'></div>";
        pageHTML+="<div class='load__circle load__circle-4'></div>";
        pageHTML+="<div class='load__circle load__circle-5'></div>";
        pageHTML+="</div>";*/
        break;
    }
    //document.getElementById('IPage').innerHTML=pageHTML;
  }
