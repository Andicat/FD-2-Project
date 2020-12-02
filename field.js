'use strict';

//игровое поле

(function () {

    class Field {
        constructor(cnt,colorBg,color,pointsBg,points) {
            this.cnt = cnt;
            this.colorBg = colorBg;
            this.color = color;
            this.pointsBg = pointsBg;
            this.points = points;
            this.rectsBg = this.createRects(this.cnt,this.colorBg,this.pointsBg);
            this.rects = this.createRects(this.cnt,this.color,this.points);
        };

        draw = function() {
            this.rectsBg.forEach(function(r) {
                r.draw();
            });
            this.rects.forEach(function(r) {
                r.draw();
            });
        };

        createRects = function(context, color, pointsArr) {
            var rect;
            var rects = [];
            var left;
            var right;
            var top;
            var bottom;
            var leftPrev;
            var rightPrev;
            var sortY = Array.from(new Set(pointsArr.map(p => p.y).sort((a,b) => {return a-b})));
            
            for (var i = 0; i < sortY.length-1; i++) {
                top = sortY[i];
                bottom = sortY[i+1];
                var pointsX = pointsArr.filter(p => {return p.y===top}).map(p => p.x).sort((a,b) => {return a-b});
                var left = pointsX[0];
                var right = pointsX[pointsX.length-1];
                if (left===leftPrev) {
                    left = pointsX[1];
                } else {
                    left = (left!==rightPrev&&left!==leftPrev)?left:leftPrev;
                }
                if (right===rightPrev) {
                    right = pointsX[pointsX.length-2];
                } else {
                    right = (right!==rightPrev&&right!==leftPrev&&right!==left)?right:rightPrev;
                }
                leftPrev = left;
                rightPrev = right;
                rect = new window.Rect(context,color,top,bottom,left,right);
                rects.push(rect);
            }
            return rects;
        };

        findActualRect = function(posX,posY) {
            return this.rects.filter(r => {return (r.top<posY&&r.bottom>posY&&r.left<posX&&r.right>posX)})[0];
        };
    };

    //экспорт
    window.Field = Field;
})();
