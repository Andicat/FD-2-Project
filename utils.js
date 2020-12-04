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
            var left = pointsX[0];
            var right = pointsX[pointsX.length-1];
            var leftToChange = false;
            var rightToChange = false;
            if (left===leftPrev) {
                left = pointsX[1];
            } else if (left!==rightPrev&&left!==leftPrev) {
                leftToChange = true;
            } else {
                left = leftPrev;
            }
            if (right===rightPrev) {
                right = pointsX[pointsX.length-2];
            } else if (right!==rightPrev&&right!==leftPrev) {
                rightToChange = true; 
            } else {
                right = rightPrev;
            }
            if (leftToChange&&!rightToChange) {
                left = leftPrev;
                //console.log(pointsX);
                //console.log("left " + left + " right " + right);
                //console.log("prev left " + leftPrev + " prev right " + rightPrev);
                //debugger
            }
            if (rightToChange&&!leftToChange) {
                right = rightPrev;
            }
            leftPrev = left;
            rightPrev = right;
            rect = new window.Rect(top,bottom,left,right);
            rects.push(rect);
        }
        return rects;
    };

    window.utils.findActualRect = function(rects,posX,posY) {
        return rects.filter(r => {return (r.top<posY&&r.bottom>posY&&r.left<posX&&r.right>posX)})[0];
    };

})();
