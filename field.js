'use strict';

//игровое поле

(function () {

    //игровой блок 
    class Rect {
        constructor(top,bottom,left,right) {
            this.cnt;
            this.color;
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

    function drawField(context,rectsArr,color) {
        context.fillStyle = color;
        rectsArr.forEach(function(r) {
            r.cnt = context;
            r.color = color;
            r.draw();
        });
    };

    function createRects(pointsArr) {
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
            rect = new Rect(top,bottom,left,right);
            rects.push(rect);
        }
        return rects;
    };

    function findActualRect(posX,posY) {
        return window.rects.filter(r => {return (r.top<posY&&r.bottom>posY&&r.left<posX&&r.right>posX)})[0];
    };

    function cutField(type,x,y) {
        var pointsArrNew = [];
        var pointsArrNew2 = [];
        var pointNew1 = {};
        var pointNew2 = {};
        switch(type) {
            case "top-right":
                window.points.forEach(function(point) {
                    if (!(point.x>=x&&point.y<=y)) {
                        pointsArrNew.push(point);
                    } else {
                        pointsArrNew2.push(point);
                    }
                });
                pointNew1.x = pointsArrNew2.sort((a,b) => {return b.x-a.x})[0].x;
                pointNew1.y = y;
                pointNew2.x = x;
                pointNew2.y = pointsArrNew2.sort((a,b) => {return a.y-b.y})[0].y;
                break;
            case "top-left":
                window.points.forEach(function(point) {
                    if (!(point.x<=x&&point.y<=y)) {
                        pointsArrNew.push(point);
                    } else {
                        pointsArrNew2.push(point);
                    }
                });
                pointNew1.x = pointsArrNew2.sort((a,b) => {return a.x-b.x})[0].x;
                pointNew1.y = y;
                pointNew2.x = x;
                pointNew2.y = pointsArrNew2.sort((a,b) => {return a.y-b.y})[0].y;
                break;
            case "bottom-right":
                window.points.forEach(function(point) {
                    if (!(point.x>=x&&point.y>=y)) {
                        pointsArrNew.push(point);
                    } else {
                        pointsArrNew2.push(point);
                    }
                });
                pointNew1.x = pointsArrNew2.sort((a,b) => {return b.x-a.x})[0].x;
                pointNew1.y = y;
                pointNew2.x = x;
                pointNew2.y = pointsArrNew2.sort((a,b) => {return b.y-a.y})[0].y;
                break;
            case "bottom-left":
                window.points.forEach(function(point) {
                    if (!(point.x<=x&&point.y>=y)) {
                        pointsArrNew.push(point);
                    } else {
                        pointsArrNew2.push(point);
                    }
                });
                pointNew1.x = pointsArrNew2.sort((a,b) => {return a.x-b.x})[0].x;
                pointNew1.y = y;
                pointNew2.x = x;
                pointNew2.y = pointsArrNew2.sort((a,b) => {return b.y-a.y})[0].y;
                break;
            case "right-left":
                window.points.forEach(function(point) {
                    if (point.y>y) {
                        pointsArrNew.push(point);
                    } else {
                        pointsArrNew2.push(point);
                    }
                });
                pointsArrNew2.sort((a,b) => {return a.x-b.x});
                pointNew1.x = pointsArrNew2[0].x;
                pointNew1.y = y;
                pointNew2.x = pointsArrNew2[pointsArr2.length-1].x;
                pointNew2.y = y;
                break;
            case "top-bottom":
            default:
                break;
        }

        return {pointsArrNew:pointsArrNew, pointsArrNew2:pointsArrNew2, pointNew1:pointNew1, pointNew2:pointNew2, pointBlade: {x:x,y:y}};
    };

    //экспорт
    window.findActualRect = findActualRect;
    window.createRects = createRects;
    window.drawField = drawField;
    window.cutField = cutField;
})();



/*
//игровое поле
    class Field {

        constructor(cnt,color,points) {
            this.cnt = cnt;
            this.color = color;
            this.points = points;
            this.elem;
        };

        draw = function() {
            this.cnt.fillStyle = this.color;
            this.cnt.beginPath();
            this.cnt.moveTo(this.points[0].x,this.points[0].y);
            
            for (var i = 1; i < this.points.length; i++) {
                this.cnt.lineTo(this.points[i].x,this.points[i].y);
            }
            
            this.cnt.closePath();
            
            this.cnt.fill();
            //this.cnt.stroke();
        };
    }


    //var field = new Field(context,COLORS.field,startPoints);
    //field.draw();

*/
