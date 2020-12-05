'use strict';

//игровое поле

(function () {

    class Rect {
        constructor(top,bottom,left,right) {
            this.top = top;
            this.bottom = bottom;
            this.left = left;
            this.right = right;
            this.square = Math.round((right-left)*(bottom-top));
        };
    };
  
    window.Rect = Rect;
})();
