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

    window.utils.randomSign = function() {
        return Math.sign(0.5-Math.random());
    }

    window.utils.hitSlit = function(elem,slit) {
        var r1x = elem.x - elem.radius;
        var r1y = elem.y - elem.radius;
        var r1w = elem.radius*2;
        var r1h = elem.radius*2;

        if (slit.startX === slit.finishX) { // vertical
            var r2w = slit.width;
            var r2h = Math.abs(slit.startY - slit.currY);
            var r2x = slit.startX - slit.width/2;
            var r2y = Math.min(slit.startY,slit.currY);
        }
        if (slit.startY === slit.finishY) { // horizontal
            var r2w = Math.abs(slit.startX - slit.currX);
            var r2h = slit.width;
            var r2x = Math.min(slit.startX,slit.currX)
            var r2y = slit.startY - slit.width/2;;
        }
        if (r1x + r1w >= r2x &&    
            r1x <= r2x + r2w &&    
            r1y + r1h >= r2y &&    
            r1y <= r2y + r2h) {    
            return true;
        }
        return false;
    }

    window.utils.findActualRect = function(rects,posX,posY,radius) {
        //return rects.filter(r => {return (r.top<=posY&&r.bottom>posY&&r.left<=posX&&r.right>posX)})[0];
        return rects.filter(r => {return (r.top<=posY&&r.bottom>=posY&&r.left<=posX-radius&&r.right>=posX+radius)})[0];
    };

    window.utils.findVertical = function(arr1,arr2) {
        return arr1.filter(function (a1) {
            return (arr2.filter(a2 => {return a2.y===a1.y}).length);
        }).map(p => p.y).sort((a,b) => {return a-b});
    };

    window.utils.findHorizontal = function(arr1,arr2) {
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

    window.utils.scaleField = function(points, fieldSize, borderSize) {
        var sortY = Array.from(new Set(points.map(p => p.y).sort((a,b) => {return a-b})));
        var sortX = Array.from(new Set(points.map(p => p.x).sort((a,b) => {return a-b})));
        var maxX = sortX[sortX.length-1];
        var minX = sortX[0];
        var maxY = sortY[sortY.length-1];
        var minY = sortY[0];
        var width = maxX - minX;
        var height = maxY - minY;
        var centerX = sortX[0] + (width/2);
        var centerY = sortY[0] + (height/2);
        //центрируем по ширине
        if ((width+height)!==fieldSize*2) {
            var deltaX = Math.round(fieldSize/2 + borderSize - centerX);
            var deltaY = Math.round(fieldSize/2 + borderSize- centerY);
            points = points.map(p => { return {x:p.x + deltaX, y: p.y + deltaY} });
            centerX += deltaX;
            centerY += deltaY;
            maxX += deltaX;
            minX += deltaX;
            maxY += deltaY;
            minY += deltaY;
        }
        //растягиваем
        var scale = Math.min(fieldSize/width, fieldSize/height);
        if (scale>1) {
            points = points.map(function(p) {
                let newX = Math.round(centerX + (p.x-centerX)*scale);
                let newY = Math.round(centerY + (p.y-centerY)*scale);
                return {x:newX, y:newY};
            });
        }
        return points;
    }

    window.utils.getMaxCoords = function(points) {
        var sortY = Array.from(new Set(points.map(p => p.y).sort((a,b) => {return a-b})));
        var sortX = Array.from(new Set(points.map(p => p.x).sort((a,b) => {return a-b})));
        //console.log("AFTER CUT X-" + sortX[0] + "-" + sortX[sortX.length-1]);
        //console.log("AFTER CUT Y-" + sortY[0] + "-" + sortY[sortY.length-1]);
    };

    window.utils.convertColorHEXtoRGB = function(color) {
        if(color.substring(0,1) == '#') {
            color = color.substring(1);
        }
      
        var rgbColor = {};
      
        rgbColor.red = parseInt(color.substring(0,2),16);
        rgbColor.green = parseInt(color.substring(2,4),16);
        rgbColor.blue = parseInt(color.substring(4),16);
      
        return rgbColor;
       };
})();