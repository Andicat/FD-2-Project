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

    window.utils.hitSlit = function(elem,slit) {
        var r1x = elem.x - elem.radius;
        var r1y = elem.y - elem.radius;
        var r1w = elem.radius*2;
        var r1h = elem.radius*2;

        if (slit.startX===slit.finishX) { // vertical
            var r2w = slit.width;
            var r2h = Math.abs(slit.startY - slit.currY);
            var r2x = slit.startX - slit.width/2;
            var r2y = Math.min(slit.startY,slit.currY);
        }
        if (slit.startY===slit.finishY) { // horizontal
            var r2w = Math.abs(slit.startX - slit.currX);
            var r2h = slit.width;
            var r2x = Math.min(slit.startX,slit.currX)
            var r2y = slit.startY - slit.width/2;;
        }
        if (r1x + r1w >= r2x &&    // r1 right edge past r2 left
            r1x <= r2x + r2w &&    // r1 left edge past r2 right
            r1y + r1h >= r2y &&    // r1 top edge past r2 bottom
            r1y <= r2y + r2h) {    // r1 bottom edge past r2 top
            return true;
        }
        return false;
    }

    window.utils.createRects = function(pointsArr) {
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
            rect = new window.Rect(top,bottom,left,right);
            rects.push(rect);
        }
        return rects;
    };

    window.utils.findActualRect = function(rects,posX,posY) {
        return rects.filter(r => {return (r.top<=posY&&r.bottom>posY&&r.left<=posX&&r.right>posX)})[0];
    };

    window.utils.findVertical = function(arr1,arr2) {
        return arr1.filter(function (a1) {
            return (arr2.filter(a2 => {return a2.y===a1.y}).length);
        }).map(p => p.y).sort((a,b) => {return a-b});
    };

    window.utils.findHorisontal = function(arr1,arr2) {
        return arr1.filter(function (a1) {
            return (arr2.filter(a2 => {return a2.x===a1.x}).length);
        }).map(p => p.x).sort((a,b) => {return a-b});
    };

    window.utils.calculateSquare = function(rects) {
        var square = rects.reduce(function(s,r,i,a) {
            return s + r.square;
          }, 0);
        return square;
    };

    window.utils.scaleField = function(points, fieldSize) {
        var sortY = Array.from(new Set(points.map(p => p.y).sort((a,b) => {return a-b})));
        var sortX = Array.from(new Set(points.map(p => p.x).sort((a,b) => {return a-b})));
        var width = sortX[sortX.length-1] - sortX[0];
        var height = sortY[sortY.length-1] - sortY[0];
        console.log("width " + width);
        console.log("height " + height);
        console.log("field " + fieldSize);
        console.log("scale index " + fieldSize/Math.max(width,height));
        console.log("center x " + (width/2) + " y " + (height/2));
        console.log("center FIELD x " + (fieldSize/2) + " y " + (fieldSize/2));
        //центрируем по ширине
        if ((width+height)!==fieldSize*2) {
            var deltaX = Math.round((fieldSize - width)/2);
            console.log("смещаем по x " + deltaX);
            var deltaY = Math.round((fieldSize - height)/2);
            console.log("смещаем по y " + deltaY);
            var pointsNew = points.map(p => { return {x:p.x + deltaX, y: p.y + deltaY} });
            console.log(points);
            console.log(pointsNew);
        }
        return pointsNew;
    }
})();
