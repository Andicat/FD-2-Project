'use strict';

(function () {

    window.utils = {};

    window.utils.getElementCoords = function(elem) {
        var bbox = elem.getBoundingClientRect();
    
        var body = document.body;
        var docEl = document.documentElement;
    
        var scrollTop = window.pageYOffset||docEl.scrollTop||body.scrollTop;
        var scrollLeft = window.pageXOffset||docEl.scrollLeft||body.scrollLeft;
    
        var clientTop = docEl.clientTop||body.clientTop||0;
        var clientLeft = docEl.clientLeft||body.clientLeft||0;
    
        var top = bbox.top + scrollTop - clientTop;
        var left = bbox.left + scrollLeft - clientLeft;
    
        return {
            width: elem.offsetWidth,
            height: elem.offsetHeight,
            left: left,
            top: top,
            bottom: top + elem.offsetHeight,
            right: left + elem.offsetWidth,
        };
    }

    window.utils.randomDiap = function(n,m) {
        return Math.floor(Math.random()*(m-n+1))+n;
    }

})();
