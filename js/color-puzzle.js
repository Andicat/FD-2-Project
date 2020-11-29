'use strict';

(function () {

    try {
        var blockPuzzle = document.querySelector('.puzzle');
        var btnPuzzleCreate = blockPuzzle.querySelector('.puzzle__create');
        var cntPuzzle = blockPuzzle.querySelector('.puzzle__container');
    } catch {
        return;
    }

    var timer;
    const puzzle_SIZE = window.matchMedia("(max-width: 768px)").matches?300:500;
    
    function renderPuzzle (cnt, colors, size) {

        const SIZES = {
            rows: size,
            cols: size,
        };

        cnt.style.width = puzzle_SIZE + "px";
        cnt.style.height = puzzle_SIZE + "px";

        var colorLeftTop = convertColor(colors[0]);
        var colorRightTop = convertColor(colors[1]);
        var colorLeftBottom = convertColor(colors[2]);
        var colorRightBottom = convertColor(colors[3]);

        function convertColor(color) {
          
            if(color.substring(0,1) == '#') {
                color = color.substring(1);
            }
          
            var rgbColor = {};
          
            rgbColor.red = parseInt(color.substring(0,2),16);
            rgbColor.green = parseInt(color.substring(2,4),16);
            rgbColor.blue = parseInt(color.substring(4),16);
          
            return rgbColor;
           }

        /*console.log("left top " + colorLeftTop.red);
        console.log("right top " + colorRightTop.red);
        console.log("left bottom " + colorLeftBottom.red);
        console.log("right bottom " + colorRightBottom.red);
        console.log("left top-bottom " + (colorLeftTop.red - colorLeftBottom.red));*/

        var shiftRedLeft = (colorLeftBottom.red - colorLeftTop.red)/(SIZES.rows-1);
        var shiftRedRight = (colorRightBottom.red - colorRightTop.red)/(SIZES.rows-1);
        var shiftGreenLeft = (colorLeftBottom.green - colorLeftTop.green)/(SIZES.rows-1);
        var shiftGreenRight = (colorRightBottom.green - colorRightTop.green)/(SIZES.rows-1);
        var shiftBlueLeft = (colorLeftBottom.blue - colorLeftTop.blue)/(SIZES.rows-1);
        var shiftBlueRight = (colorRightBottom.blue - colorRightTop.blue)/(SIZES.rows-1);

        for (var r = 0; r < SIZES.rows; r++) {
            //red values
            var redStart = colorLeftTop.red + r*shiftRedLeft;
            var redEnd = colorRightTop.red + r*shiftRedRight;
            var redShift = (redEnd - redStart)/(SIZES.cols-1);
            //green values
            var greenStart = colorLeftTop.green + r*shiftGreenLeft;
            var greenEnd = colorRightTop.green + r*shiftGreenRight;
            var greenShift = (greenEnd - greenStart)/(SIZES.cols-1);
            //red values
            var blueStart = colorLeftTop.blue + r*shiftBlueLeft;
            var blueEnd = colorRightTop.blue + r*shiftBlueRight;
            var blueShift = (blueEnd - blueStart)/(SIZES.cols-1);
            
            var puzzleRow = document.createElement("div");
            puzzleRow.classList.add("puzzle__row");
            //puzzleRow.style.width = puzzle_SIZE + "px";
            //puzzleRow.style.height = puzzle_SIZE/SIZES.rows + "px";
            cnt.appendChild(puzzleRow);

            for (var c = 0; c < SIZES.cols; c++) {
                var red = redStart + c*redShift;
                var green = greenStart + c*greenShift;
                var blue = blueStart + c*blueShift;
                //create puzzle ceil
                var puzzleCeil = document.createElement("div");
                puzzleCeil.classList.add("puzzle__ceil");
                puzzleCeil.style.width = puzzle_SIZE/SIZES.cols + "px";
                puzzleCeil.style.height = puzzle_SIZE/SIZES.rows + "px";
                puzzleCeil.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
                puzzleRow.appendChild(puzzleCeil);
            }
        }
        /*for (var i = 0; i < SIZES.cols; i++) {
            var red = colorLeftBottom.red + i*(colorRightBottom.red - colorLeftBottom.red)/SIZES.cols;
            var green = colorLeftBottom.green + i*(colorRightBottom.green - colorLeftBottom.green)/SIZES.cols;
            var blue = colorLeftBottom.blue + i*(colorRightBottom.blue - colorLeftBottom.blue)/SIZES.cols;
            //create puzzle ceil
            var puzzle = document.createElement("div");
            puzzle.classList.add("puzzle__ceil");
            puzzle.style.width = puzzle_SIZE/SIZES.cols + "px";
            puzzle.style.height = puzzle_SIZE/SIZES.cols + "px";
            puzzle.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
            cnt.appendChild(puzzle);
        }*/
    }

    blockPuzzle.addEventListener('click', function() {
        var colors = ["#f5e1bf","#b44f1e","#1a1918","#d4a752"];
        var size = 10;
        clearInterval(timer);
        cntPuzzle.innerHTML = "";
        renderPuzzle(cntPuzzle,colors,size);
    });

})();
