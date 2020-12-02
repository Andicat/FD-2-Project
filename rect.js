'use strict';

//игровое поле

(function () {

    class Rect {
        constructor(cnt,color,top,bottom,left,right) {
            this.cnt = cnt;
            this.color = color;
            this.top = top;
            this.bottom = bottom;
            this.left = left;
            this.right = right;
            this.elem;
        };

        draw = function() {
            this.cnt.fillStyle = this.color;
            this.cnt.fillRect(this.left,this.top,this.right-this.left,this.bottom-this.top);
        };
    };
  
    window.Rect = Rect;
})();
