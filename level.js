'use strict';

(function () {

    class Level {
        constructor(elemCount,count,elemBar,pointsStart,percent,color) {
            this.elemCount = elemCount;
            this.elemBar = elemBar;
            this.elemBar.style.backgroundColor = color;
            this.count = count;
            this.pointsStart = pointsStart;
            this.pointsCurr = pointsStart;
            this.percent = percent;
            this.color = color;
            this.squareStart;
            this.squareCurr;
            this.progress;
        };

        init = function(field) {
            this.squareStart = window.utils.calculateSquare(field.rectsBg);
            this.elemCount.textContent = this.count;
            this.elemBar.style.width = "";
        }

        updateProgress = function(field) {
            this.pointsCurr = field.points;
            this.squareCurr = window.utils.calculateSquare(field.rects);
            this.progress = Math.round((this.squareStart - this.squareCurr)/(this.squareStart/100*(100-this.percent))*100);
            this.elemBar.style.width = Math.min(this.progress,100) + "%";
            if (this.progress>=100) {
                window.game.finishLevel();
            } else {
                window.blade.update();
            }
        }
    };

    //экспорт
    window.Level = Level;
})();
