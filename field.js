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

    class Field {
        constructor(cnt,colorBg,color,pointsBg,points,borderWidth,borderColor) {
            this.cnt = cnt;
            this.colorBg = colorBg;
            this.color = color;
            this.pointsBg = pointsBg;
            this.points = points;
            this.rectsBg = this.createRects(this.pointsBg);
            this.rects = this.createRects(this.points);
            this.borderWidth = borderWidth;
            this.borderColor = borderColor;
        };

        draw = function() {
            var rect;
            for (var i = 0; i < this.rectsBg.length; i++) {
                rect = this.rectsBg[i];
                this.cnt.fillStyle = this.colorBg;
                this.cnt.fillRect(rect.left,rect.top,rect.right-rect.left,rect.bottom-rect.top);
            };
            for (var i = 0; i < this.rects.length; i++) {
                rect = this.rects[i];
                this.cnt.fillStyle = this.borderColor;
                this.cnt.fillRect(rect.left-this.borderWidth,rect.top-this.borderWidth,rect.right-rect.left+this.borderWidth*2,rect.bottom-rect.top+this.borderWidth*2);
            };
            for (var i = 0; i < this.rects.length; i++) {
                rect = this.rects[i];
                this.cnt.fillStyle = this.color;
                this.cnt.fillRect(rect.left,rect.top,rect.right-rect.left,rect.bottom-rect.top);
            };
        };

        createRects = function(pointsArr) {
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
                if (pointsX.length===4) { //если точек 4
                    left = pointsX[0]!==leftPrev?pointsX[0]:pointsX[1];
                    right = pointsX[3]!==rightPrev?pointsX[3]:pointsX[2];
                } else { //если точек 2
                    if (!leftPrev&&!rightPrev) { //самый первый 
                        left = pointsX[0];
                        right = pointsX[1];
                    } else if(pointsX[0]===leftPrev) { //сужение слева
                        left = pointsX[1];
                        right = rightPrev;
                    } else if(pointsX[1]===leftPrev) { //расширение слева
                        left = pointsX[0];
                        right = rightPrev;
                    } else if(pointsX[1]===rightPrev) { //сужение справа
                        left = leftPrev;
                        right = pointsX[0];
                    } else if(pointsX[0]===rightPrev) { //расширение справа
                        left = leftPrev;
                        right = pointsX[1];
                    }
                }
                leftPrev = left;
                rightPrev = right;
                rect = new Rect(top,bottom,left,right);
                rects.push(rect);
            }
            return rects;
        };

        cut = function(cutInfo) {
            for (var i = 0; i< cutInfo.arrNew.length; i++) {
                var arr = cutInfo.arrNew[i].concat(cutInfo.pointsNew);
                var rects = this.createRects(arr);
                var isBall = window.utils.findActualRect(rects,window.ball.x,window.ball.y,window.ball.radius);
                if (isBall) {
                    this.points = arr;
                    this.rects = this.createRects(this.points);
                    this.points = arr;
                    window.ball.updateActualRect();
                    window.level.updateProgress(this);
                    window.utils.getMaxCoords(this.points);
                    return;
                }
            }
        }
    };

    //экспорт
    window.Field = Field;
})();
