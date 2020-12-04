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
            this.rectsBg = window.utils.createRects(this.pointsBg);
            this.rects = window.utils.createRects(this.points);
        };

        draw = function() {
            var rect;
            for (var i = 0; i< this.rectsBg.length; i++) {
                rect = this.rectsBg[i];
                this.cnt.fillStyle = this.colorBg;
                this.cnt.fillRect(rect.left,rect.top,rect.right-rect.left,rect.bottom-rect.top);
            }
            for (var i = 0; i< this.rects.length; i++) {
                rect = this.rects[i];
                this.cnt.fillStyle = this.color;
                this.cnt.fillRect(rect.left,rect.top,rect.right-rect.left,rect.bottom-rect.top);
            }
        };

        draw2 = function() {
            this.cnt.strokeStyle = this.color;
                this.cnt.lineWidth = 1;
                this.cnt.beginPath();
            for (var i = 1; i< this.points.length; i++) {
                this.cnt.moveTo(this.points[i].x,this.points[i].y);
                this.cnt.lineTo(this.points[i-1].x,this.points[i-1].y);
            }
            this.cnt.stroke();
        };


        cut = function(cutInfo) {
            console.log("--------------BEFORE");
            console.log(this.rects);
            console.log(this.points);
            for (var i = 0; i< cutInfo.arrNew.length; i++) {
                var arr = cutInfo.arrNew[i].concat(cutInfo.pointsNew);
                var rects = window.utils.createRects(arr);
                var isBall = window.utils.findActualRect(rects,window.ball.x,window.ball.y);
                if (isBall) {
                    this.points = arr;
                    this.rects = window.utils.createRects(this.points);
                    this.points = arr;
                    window.ball.updateActualRect();
                    console.log("--------------AFTER");
                    console.log(this.rects);
                    console.log(this.points);
                    return;
                }
            }
        }
    };

    //экспорт
    window.Field = Field;
})();
