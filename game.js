'use strict';

(function () {

    class Level {
        constructor(elem,count,pointsStart, pointsCurr, percent,color) {
            this.elem = elem;
            this.count = count;
            this.pointsStart = pointsStart;
            this.pointsCurr = pointsCurr;
            this.percent = percent;
            this.color = color;
        };

        update = function(field) {
            
        }
    };

    //экспорт
    window.Level = Level;
})();
